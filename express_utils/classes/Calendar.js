const { createDAVClient } = require('tsdav');
const ical = require('node-ical');
const icalGenerator = require('ical-generator').default;
const { randomUUID } = require('crypto');
const { nextcloud_values } = require("../env-values-dictionnary");
const credentials = nextcloud_values.credentials;
const { log } = require("../utils");

class Calendar {
    constructor() {
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

    async getCalendarEvents() {
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
                    events_list.push(ev.summary);
                }
            }
        });
        return { code: 200, data: events_list };
    }

    async newCalendarEvent(event, calendar_name = this.name) {
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

		function calDavEventBuilder(event) {
			const uid = event.uid || `${randomUUID()}@inventory-manager-app`;
	
			const cal = icalGenerator({ prodId: '//InventoryManager//CalDAV//FR' });
	
			cal.createEvent({
				id: uid,
				start: new Date(event.start),
				end: new Date(event.end),
				summary: event.summary,
				description: event.description,
				location: event.location,
				allDay: event.allDay || false,
			});
	
			return {
				uid,
				filename: `${uid}.ics`,
				iCalString: cal.toString(),
			};
		}
    }
}

module.exports = Calendar;