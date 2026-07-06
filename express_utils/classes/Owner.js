const { pool } = require("../postgres-connect");
const { log } = require("../utils");

class Owner {
	constructor(label) {
		this.label = label ?? null;
		this.id = null;
	}

	async getAll() {
		const query = "SELECT label FROM inventory.owner;";
		try {
			const result = await pool.query(query, [])
			return { code: 200, data: result.rows };
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
			return { code: 401, data: `Owner with label ${this.label} already exist` }
		}

		const _SQLquery = async () => {
			const query = "INSERT INTO inventory.owner (label) VALUES ($1) RETURNING id;";
			try {
				const result = await pool.query(query, [this.label])
				const owner_id = result.rows[0].id;
				return { code: 201, data: "Created" };
			} catch (error) {
				return { code: 500, data: error };
			}
		}

		const owner = await _SQLquery();
		if (owner.code !== 201) {
			log.error(owner.data);
			return { code: 500, data: "Internal server error" };
		}
		return owner;
	}

	async modify(new_label = '') {
		if (this.label === null || this.label === "" || new_label === '') {
			return { code: 400, data: "Error : No fields should be empty" }
		}

		if (!await this._exist()) {
			return { code: 401, data: `Owner with label ${this.label} does not exist` }
		}

		const _SQLquery = async () => {
			const query = "UPDATE inventory.owner SET label = $2 WHERE label = $1 RETURNING id;";
			try {
				const result = await pool.query(query, [this.label, new_label])
				const owner_id = result.rows[0].id;
				return { code: 200, data: "OK" };
			} catch (error) {
				return { code: 500, data: error };
			}
		}

		const owner = await _SQLquery();
		if (owner.code !== 200) {
			log.error(owner);
			return { code: 500, data: "Internal server error" };
		}

		this.label = new_label
		return owner;
	}

	async delete() {
		if (this.label === null || this.label === "") {
			return { code: 400, data: "Error : No fields should be empty" }
		}

		if (!await this._exist()) {
			return { code: 401, data: `Owner with label ${this.label} does not exist` }
		}

		const _SQLquery = async () => {
			const query = `DELETE FROM inventory.owner WHERE label = $1;`;
			try {
				const result = await pool.query(query, [this.label]);
				return { code: 200, data: "OK" };
			} catch (error) {
				return { code: 500, data: error };
			}
		}

		const owner = await _SQLquery();
		if (owner.code !== 200) {
			log.error(owner.data);
			return { code: 500, data: "Internal server error" };
		}
		return owner;
	}

	async _exist() {
		const query = "SELECT * FROM inventory.owner WHERE label = $1;";
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

module.exports = Owner;