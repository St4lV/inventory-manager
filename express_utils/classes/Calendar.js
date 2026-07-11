const { createDAVClient } = require('tsdav');
const ical = require('node-ical');
const icalGenerator = require('ical-generator').default;
const { randomUUID } = require('crypto');
const { nextcloud_values } = require("../env-values-dictionnary");
const credentials = nextcloud_values.credentials;
const { log } = require("../utils");

class Calendar {
    constructor(event) {
		this.event = event;
        this.name = nextcloud_values.calendar;
        this._caldav_client = null;
    }

    async createCaldavClient() {
        try {
            const dav_client = await createDAVClient({
                serverUrl: nextcloud_values.server + '/remote.php/dav/',
                credentials: {
                    username: credentials.login,
                    password: credentials.password,
                },
                authMethod: 'Basic',
                defaultAccountType: 'caldav',
            });
            this._caldav_client = dav_client;
            return { code: 200, data: "OK" };
        } catch (error) {
            log.error(error);
            return { code: 400, data: error };
        }
    }

    async _getSelectedCalendar(calendar_name) {
        const agendas = await this._caldav_client.fetchCalendars();
        return agendas.find((a) => a.displayName === calendar_name);
    }

    async getAll() {
        if (this._caldav_client === null) {
            const result = await this.createCaldavClient();
            if (result.code !== 200) {
                return { code: 500, data: result.data };
            }
        }

        const selected_calendar = await this._getSelectedCalendar(this.name);
        if (!selected_calendar) {
            return { code: 404, data: `this.name [${this.name}] not found.` };
        }

        const events = await this._caldav_client.fetchCalendarObjects({
            calendar: selected_calendar,
        });

        let events_list = [];
		events.forEach((e) => {
			const objets = ical.sync.parseICS(e.data);
			for (const cle in objets) {
				const ev = objets[cle];
				if (ev.type === 'VEVENT') {
					events_list.push({
						name: ev.summary,
						location: ev.location,
						description: ev.description,
						start: ev.start,
						end: ev.end
					});
				}
			}
		});

		events_list.sort((a, b) => new Date(a.start) - new Date(b.start));

		return { code: 200, data: events_list };
    }

    async create(event = this.event, calendar_name = this.name) {
        if (this._caldav_client === null) {
            const result = await this.createCaldavClient();
            if (result.code !== 200) {
                return { code: 500, data: result.data };
            }
        }

        const selected_calendar = await this._getSelectedCalendar(calendar_name);
        if (!selected_calendar) {
            return { code: 404, data: `Calendar [${calendar_name}] not found.` };
        }

		const calDavEventBuilder = (event) => {
			const uid = event.uid || `${randomUUID()}@inventory-manager-app`;
	
			const cal = icalGenerator({ prodId: '//InventoryManager//CalDAV//FR' });
	
			const vals = {
				id: uid,
				start: new Date(event.start),
				end: new Date(event.end),
				summary: event.summary,
				description: event.description,
				location: event.location,
				allDay: event.allDay || false,
			}

			this.event = vals; // now `this` correctly refers to the Calendar instance

			cal.createEvent(vals);
	
			return {
				uid,
				filename: `${uid}.ics`,
				iCalString: cal.toString(),
			};
		}

        try {
            const { uid, filename, iCalString } = calDavEventBuilder(event);

            const result = await this._caldav_client.createCalendarObject({
                calendar: selected_calendar,
                filename: filename,
                iCalString: iCalString,
            });

            return { code: 201, data: { uid, url: result.url } };
        } catch (error) {
            log.error(error);
            return { code: 400, data: error };
        }

		// changed from `function calDavEventBuilder(event) {...}` to an arrow function
		
    }

	async _findEventObject(selected_calendar, uid) {
		const objects = await this._caldav_client.fetchCalendarObjects({
			calendar: selected_calendar,
		});

		return objects.find((o) => {
			try {
				const parsed = ical.sync.parseICS(o.data);
				return Object.values(parsed).some(
					(ev) => ev.type === 'VEVENT' && ev.uid === uid
				);
			} catch (err) {
				return false;
			}
		});
	}

	async modify(start, end, summary, description, location, allDay, calendar_name = this.name) {
		if (this._caldav_client === null) {
            const result = await this.createCaldavClient();
            if (result.code !== 200) {
                return { code: 500, data: result.data };
            }
        }

        const selected_calendar = await this._getSelectedCalendar(calendar_name);
        if (!selected_calendar) {
            return { code: 404, data: `Calendar [${calendar_name}] not found.` };
        }

        const uid = this.event && this.event.id;
        if (!uid) {
            return { code: 400, data: 'this.event.id is required to modify an event.' };
        }

        try {
            const existing_object = await this._findEventObject(selected_calendar, uid);
            if (!existing_object) {
                return { code: 404, data: `Event [${uid}] not found.` };
            }

            const cal = icalGenerator({ prodId: '//InventoryManager//CalDAV//FR' });

            const vals = {
                id: uid,
                start: new Date(start),
                end: new Date(end),
                summary,
                description,
                location,
                allDay: allDay || false,
            };

            cal.createEvent(vals);

            const result = await this._caldav_client.updateCalendarObject({
                calendarObject: {
                    url: existing_object.url,
                    data: cal.toString(),
                    etag: existing_object.etag,
                },
            });

            if (!result.ok) {
                return { code: result.status || 400, data: await result.text() };
            }

            this.event = vals;

            return { code: 200, data: { uid, url: existing_object.url } };
        } catch (error) {
            log.error(error);
            return { code: 400, data: error };
        }
	}

	async delete(event = this.event, calendar_name = this.name) {
		if (this._caldav_client === null) {
            const result = await this.createCaldavClient();
            if (result.code !== 200) {
                return { code: 500, data: result.data };
            }
        }

        const selected_calendar = await this._getSelectedCalendar(calendar_name);
        if (!selected_calendar) {
            return { code: 404, data: `Calendar [${calendar_name}] not found.` };
        }

        const uid = event && event.id;
        if (!uid) {
            return { code: 400, data: 'event.id is required to delete an event.' };
        }

        try {
            const existing_object = await this._findEventObject(selected_calendar, uid);
            if (!existing_object) {
                return { code: 404, data: `Event [${uid}] not found.` };
            }

            const result = await this._caldav_client.deleteCalendarObject({
                calendarObject: {
                    url: existing_object.url,
                    etag: existing_object.etag,
                },
            });

            if (!result.ok) {
                return { code: result.status || 400, data: await result.text() };
            }

            return { code: 204, data: 'OK' };
        } catch (error) {
            log.error(error);
            return { code: 400, data: error };
        }
	}

	_mutate() {
		const mutators = {
			start: (v) => new Date(v + (1000  * 3600 * 24)),
			end: (v) => new Date(v + (1000  * 3600 * 24)),
			summary: (v) => `${v}_modified`,
			description: (v) => `${v}_modified`,
			location: (v) => `${v} bis`,
		};
	
		return {
			start: mutators.start(this.event.start),
			end: mutators.end(this.event.end),
			summary: mutators.summary(this.event.summary),
			description: mutators.description(this.event.description),
			location: mutators.location(this.event.location),
			allDay: false,
		};
	}
}

module.exports = Calendar;