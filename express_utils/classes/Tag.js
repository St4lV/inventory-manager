const { pool } = require("../postgres-connect");
const { log } = require("../utils");

class Tag {
	constructor(label) {
		this.label = label ?? null;
		this.id = null;
	}

	async getAll() {
		const query = "SELECT label FROM inventory.tag ORDER BY label;";
		try {
			const result = await pool.query(query, [])
			return { code: 200, data: result.rows };
		} catch (error) {
			log.error(error);
			return { code: 500, data: error };
		}
	}

	async getById(id) {
		const query = "SELECT label FROM inventory.tag WHERE id = $1;";
		try {
			const result = await pool.query(query, [id])
			return { code: 200, data: result.rows.length > 0 ? result.rows[0].label : [] };
		} catch (error) {
			log.error(error);
			return { code: 500, data: error };
		}
	}

	async create() {

		if (this.label === null || this.label === "") {
			return { code: 400, data: "Error : No fields should be empty" }
		}

		if (await this._exist()) {
			return { code: 401, data: `Tag with label ${this.label} already exist` }
		}

		const _SQLquery = async () => {
			const query = "INSERT INTO inventory.tag (label) VALUES ($1) RETURNING id;";
			try {
				const result = await pool.query(query, [this.label])
				const tag_id = result.rows[0].id;
				return { code: 201, data: "Created" };
			} catch (error) {
				return { code: 500, data: error };
			}
		}

		const tag = await _SQLquery();
	if (tag.code !== 201) {
			log.error(tag.data);
			return { code: 500, data: "Internal server error" };
		}
		return tag;
	}

	async modify(new_label = '') {
		if (this.label === null || this.label === "" || new_label === '') {
			return { code: 400, data: "Error : No fields should be empty" }
		}

		if (!await this._exist()) {
			return { code: 401, data: `Tag with label ${this.label} does not exist` }
		}

		const _SQLquery = async () => {
			const query = "UPDATE inventory.tag SET label = $2 WHERE label = $1 RETURNING id;";
			try {
				const result = await pool.query(query, [this.label, new_label])
				const tag_id = result.rows[0].id;
				return { code: 200, data: "OK" };
			} catch (error) {
				return { code: 500, data: error };
			}
		}

		const tag = await _SQLquery();
		if (tag.code !== 200) {
			log.error(tag);
			return { code: 500, data: "Internal server error" };
		}
		
		this.label = new_label;
		return tag;
	}

	async delete() {
		if (this.label === null || this.label === "") {
			return { code: 400, data: "Error : No fields should be empty" }
		}

		if (!await this._exist()) {
			return { code: 401, data: `Tag with label ${this.label} does not exist` }
		}

		const _SQLquery = async () => {
			const query = `DELETE FROM inventory.tag WHERE label = $1;`;
			try {
				const result = await pool.query(query, [this.label]);
				return { code: 204, data: "OK" };
			} catch (error) {
				return { code: 500, data: error };
			}
		}

		const tag = await _SQLquery();
		if (tag.code !== 204) {
			log.error(tag.data);
			return { code: 500, data: "Internal server error" };
		}
		return tag;
	}

	async _exist() {
		const query = "SELECT * FROM inventory.tag WHERE label = $1;";
		try {
			const result = await pool.query(query, [this.label]);
			if (result.rowCount > 0) {
				this.id = result.rows[0].id
				return true;
			}
			return false;
		} catch (error) {
			log.error(error);
			return false;
		}
	}

	_mutate() {
		const mutators = {
			label: (v) => `${v} modified`,
		};
	
		return {
			label : mutators.label(this.label)
		};
	}
}

module.exports = Tag;