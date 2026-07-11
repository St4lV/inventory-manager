const { pool } = require("../postgres-connect");
const { log } = require("../utils");
const Tag = require("./Tag");

class Item {
	constructor(label, img_url, description, reference, tags) {
		this.label = label ?? null;
		this.img_url = img_url ?? null;
		this.description = description ?? null;
		this.reference = reference ?? null;
		this.tags = tags ?? null;
		this.id = null;
	}

	async getAll() {
		const itemsQuery = `
			SELECT i.label, i.img_url, i.description, i.reference, i.tags AS tags_raw, COALESCE(json_agg(json_build_object( 'label', s.label, 'condition', c.label, 'count', s.count, 'location', json_build_object('label', l.label, 'address', l.address), 'owner', o.label, 'purchase_date', s.purchase_date, 'purchase_price', s.purchase_price, 'second_hand', s.second_hand, 'specification', s.specification, 'rental_price', s.rental_price, 'vat', json_build_object('set', s.vat_set, 'rate', s.vat_rate) )) FILTER (WHERE s.id IS NOT NULL), '[]') AS stock FROM inventory.item i LEFT JOIN inventory.stock s ON s.item_id = i.id LEFT JOIN inventory.condition c ON s.condition_id = c.id LEFT JOIN inventory.location l ON s.location_id = l.id LEFT JOIN inventory.owner o ON s.owner_id = o.id GROUP BY i.id, i.label, i.img_url, i.description, i.reference, i.tags ORDER BY i.label;`;
		try {
			const itemsResult = await pool.query(itemsQuery, []);

			const tagsResult = await pool.query("SELECT id, label FROM inventory.tag;", []);
			const tagsById = new Map(tagsResult.rows.map(t => [t.id, t.label]));

			const data = itemsResult.rows.map(row => {
				const ids = (row.tags_raw ?? '')
					.split(';')
					.map(s => s.trim())
					.filter(s => s !== '')
					.map(Number)
					.filter(n => !Number.isNaN(n));
				const tags = ids.map(id => tagsById.get(id)).filter(Boolean).sort((a, b) => a.localeCompare(b));
				const { tags_raw, ...rest } = row;
				return { ...rest, tags };
			});

			return { code: 200, data };
		} catch (error) {
			log.error(error);
			return { code: 500, data: "Internal server error" };
		}
	}

	async create() {
		if (!this._validateData()) {
			return { code: 400, data: "Error : No fields should be empty" };
		}

		if (await this._exist()) {
			return { code: 401, data: `Item with label ${this.label} already exist` };
		}

		const tags_id = await this._resolveTagsToIdString(this.tags);

		const _SQLquery = async () => {
			const query = "INSERT INTO inventory.item (label, img_url, description, reference, tags) VALUES ($1, $2, $3, $4, $5) RETURNING id;";
			try {
				await pool.query(query, [this.label, this.img_url, this.description, this.reference, tags_id]);
				return { code: 201, data: "Created" };
			} catch (error) {
				return { code: 500, data: error };
			}
		};

		const result = await _SQLquery();
		if (result.code !== 201) {
			log.error(result.data);
			return { code: 500, data: "Internal server error" };
		}
		return result;
	}

	async modify(new_label = '', new_img_url = '', new_description = '', new_reference = '', new_tags = null) {
		if (!this._validateData() || new_label === '' || new_img_url === '' || new_description === '' || new_reference === '') {
			return { code: 400, data: "Error : No fields should be empty" };
		}

		if (!await this._exist()) {
			return { code: 401, data: `Item with label ${this.label} does not exist` };
		}

		const new_tags_id = await this._resolveTagsToIdString(new_tags);

		const _SQLquery = async () => {
			const query = "UPDATE inventory.item SET label = $5, img_url = $6, description = $7, reference = $8, tags = $9 WHERE label = $1 AND img_url = $2 AND description = $3 AND reference = $4 RETURNING id;";
			try {
				await pool.query(query, [
					this.label, this.img_url, this.description, this.reference,
					new_label, new_img_url, new_description, new_reference, new_tags_id,
				]);
				return { code: 200, data: "OK" };
			} catch (error) {
				return { code: 500, data: error };
			}
		};

		const result = await _SQLquery();
		if (result.code !== 200) {
			log.error(result);
			return { code: 500, data: "Internal server error" };
		}
		this.label = new_label;
		this.img_url = new_img_url;
		this.description = new_description;
		this.reference = new_reference;
		this.tags = new_tags; 
		return result;
	}

	async delete() {
		if (!this._validateData()) {
			return { code: 400, data: "Error : No fields should be empty" };
		}

		if (!await this._exist()) {
			return { code: 401, data: `Item with label ${this.label} does not exist` };
		}

		const _SQLquery = async () => {
			const query = `DELETE FROM inventory.item WHERE label = $1 AND img_url = $2 AND description = $3 AND reference = $4;`;
			try {
				await pool.query(query, [this.label, this.img_url, this.description, this.reference]);
				return { code: 204, data: "OK" };
			} catch (error) {
				return { code: 500, data: error };
			}
		};

		const result = await _SQLquery();
		if (result.code !== 204) {
			log.error(result.data);
			return { code: 500, data: "Internal server error" };
		}
		return result;
	}

	async _exist() {
		const query = "SELECT * FROM inventory.item WHERE label = $1 AND img_url = $2 AND description = $3 AND reference = $4;";
		try {
			const result = await pool.query(query, [this.label, this.img_url, this.description, this.reference]);
			if (result.rowCount > 0) {
				this.id = result.rows[0].id;
				return true;
			}
			return false;
		} catch (error) {
			log.error(error);
			return false;
		}
	}

	_validateData() {
		if (this.label === "" || this.label === null ||
			this.img_url === "" || this.img_url === null ||
			this.description === "" || this.description === null ||
			this.reference === "" || this.reference === null) {
			return false;
		}
		return true;
	}

	async _resolveTagsToIdString(tags) {
		if (!Array.isArray(tags) || tags.length === 0) return "";
		let ids = "";
		for (const label of tags) {
			const tag = new Tag(label);
			await tag._exist();
			if (tag.id != null) {
				ids += `${tag.id};`;
			} else {
				log.error(`Item._resolveTagsToIdString: tag with label "${label}" not found`);
			}
		}
		return ids;
	}

	_mutate() {

		const mutators = {
			label: (v) => `${v}_modified`,
			img_url: (v) => `${v}.png`,
			description : (v) =>`${v} modified`,
			reference : (v) => `${v}_modified`
		};
	
		return {
			label : mutators.label(this.label),
			img_url : mutators.img_url(this.img_url),
			description : mutators.description(this.description),
			reference : mutators.reference(this.reference),
			tags : []
		};
	}
}

module.exports = Item;