const { pool } = require("../postgres-connect");
const { log } = require("../utils");

class Location {
	constructor(label,address) {
		this.label = label ?? null;
		this.address = address ?? null;
		this.id = null;
	}

	async getAll(){
		const query="SELECT label, address FROM inventory.location;";
		try {
			const result = await pool.query(query, [])
			return { code: 200, data: result.rows };
		} catch (error) {
			log.error(error);
			return { code: 500, data: error };
		}
	}

	async create(){

		if (this.label === null || this.address === null || this.label === "" || this.address === "") {
			return {code:400,data:"Error : No fields should be empty"}
		}

		if (await this._exist()){
			return {code:401,data:`${this.label} and ${this.address} already exist`}
		}

		const _SQLquery = async () => {
			const query = "INSERT INTO inventory.location (label, address) VALUES ($1, $2) RETURNING id;";
			try {
				const result = await pool.query(query, [this.label, this.address])
				const location_id = result.rows[0].id;
				return { code: 201, data: "Created" };
			} catch (error) {
				return { code: 500, data: error };
			}
		}

		const location = await _SQLquery();
		if (location.code!==201){
			log.error(location.data);
			return {code:500,data:"Internal server error"};
		}
		return location;
	}

	async modify(new_label='',new_address=''){
		if (this.label === null || this.address === null || this.label === "" || this.address === "" || new_label === '' || new_address === '') {
			return { code: 400, data: "Error : No fields should be empty" }
		}

		if (!await this._exist()) {
			return { code: 401, data: `Location with ${this.label} and ${this.address} does not exist` }
		}

		const _SQLquery = async () => {
			const query = "UPDATE inventory.location SET label = $3, address= $4 WHERE label = $1 AND address = $2 RETURNING id;";
			try {
				const result = await pool.query(query, [this.label, this.address, new_label, new_address])
				const location_id = result.rows[0].id;
				return { code: 200, data: "OK" };
			} catch (error) {
				return { code: 500, data: error };
			}
		}

		const location = await _SQLquery();
		if (location.code !== 200) {
			log.error(location);
			return { code: 500, data: "Internal server error" };
		}
		this.label = new_label;
		this.address = new_address;
		return location;
	}

	async delete(){
		if (this.label === null || this.address === null || this.label === "" || this.address === "") {
			return { code: 400, data: "Error : No fields should be empty" }
		}

		if (!await this._exist()) {
			return { code: 401, data: `Location with ${this.label} and ${this.address} does not exist` }
		}

		const _SQLquery = async () => {
			const query = `DELETE FROM inventory.location WHERE label = $1 AND address = $2;`;
			try {
				const result = await pool.query(query, [this.label, this.address]);
				return { code: 200, data: "OK" };
			} catch (error) {
				return { code: 500, data: error };
			}
		}

		const location = await _SQLquery();
		if (location.code !== 200) {
			log.error(location.data);
			return { code: 500, data: "Internal server error" };
		}
		return location;
	}

	async _exist() {
		const query = "SELECT * FROM inventory.location WHERE label = $1 AND address = $2;";
		try {
			const result = await pool.query(query, [this.label, this.address]);
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
			address: (v) => `${v} modified`,
		};
	
		return {
			label : mutators.label(this.label),
			address : mutators.address(this.address)
		};
	}
}

module.exports = Location;