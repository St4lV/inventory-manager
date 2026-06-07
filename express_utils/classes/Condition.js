const { pool } = require("../postgres-connect");
const { log } = require("../utils");

class Condition {
	constructor(label) {
		this.label = label ?? null;
		this.id = null;
	}

	async getAll() {
		const query = "SELECT label FROM inventory.condition;";
		try {
			const result = await pool.query(query, [])
			return { code: 200, data: result.rows };
		} catch (error) {
			log.error(error);
			return { code: 500, data: error };
		}
	}

	async _exist() {
		const query = "SELECT * FROM inventory.condition WHERE label = $1;";
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
}

module.exports = Condition;