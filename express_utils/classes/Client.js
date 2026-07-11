const { pool } = require("../postgres-connect");
const { log } = require("../utils");

class Client {
	constructor(name,address,tel,email,siren,is_entity) {
		this.name = name ?? null;
		this.address = address ?? null;
		this.tel = tel ?? null;
		this.email = email ?? null;
		this.siren = siren  ?? null;
		this.is_entity = is_entity ?? null;
		this.id = null;
	}

	async getAll() {
		const query = "SELECT name, address, email, tel, siren, is_entity FROM inventory.client;";
		try {
			const result = await pool.query(query, [])
			return { code: 200, data: result.rows };
		} catch (error) {
			log.error(error);
			return { code: 500, data: "Internal server error" };
		}
	}

	async getById(id) {
		const query = "SELECT name FROM inventory.client WHERE id = $1;";
		try {
			const result = await pool.query(query, [id])
			return { code: 200, data: result.rows.length > 0 ? result.rows[0].name : [] };
		} catch (error) {
			log.error(error);
			return { code: 500, data: "Internal server error" };
		}
	}

	async create() {

		if ( this.name === null || this.name === "" || this.email === null || this.email === "" || this.tel === null || this.tel === "" || this.siren === null || this.siren === "" || this.address === null || this.address === "" || this.is_entity === null ) {
			return { code: 400, data: "Error : No fields should be empty" }
		}

		if (await this._exist()) {
			return { code: 401, data: `Client with siren ${this.siren} already exist` }
		}

		const _SQLquery = async () => {
			const query = "INSERT INTO inventory.client (name, address, tel, email, siren, is_entity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;";
			try {
				const result = await pool.query(query, [this.name, this.address, this.tel, this.email, this.siren, this.is_entity])
				const client_id = result.rows[0].id;
				return { code: 201, data: "Created" };
			} catch (error) {
				return { code: 500, data: "Internal server error" };
			}
		}

		const client = await _SQLquery();
	if (client.code !== 201) {
			log.error(client.data);
			return { code: 500, data: "Internal server error" };
		}
		return client;
	}

	async modify(new_name="", new_address="", new_tel="", new_email="", new_siren="", new_is_entity=true) {
		if ( new_name === null || new_name === "" || new_email === null || new_email === "" || new_tel === null || new_tel === "" || new_siren === null || new_siren === "" || new_address === null || new_address === "" ) {
			return { code: 400, data: "Error : No fields should be empty" }
		}

		if (!await this._exist()) {
			return { code: 401, data: `Client with siren ${this.siren} does not exist` }
		}

		const _SQLquery = async () => {
			const query = "UPDATE inventory.client SET name = $2, email = $3, tel = $4, siren = $5, address = $6, is_entity = $7 WHERE id = $1;";
			try {
				const result = await pool.query(query, [this.id, new_name, new_email, new_tel, new_siren, new_address, new_is_entity]);
				return { code: 200, data: "OK" };
			} catch (error) {
				return { code: 500, data: "Internal server error" };
			}
		}

		const client = await _SQLquery();
		if (client.code !== 200) {
			log.error(client.data);
			return { code: 500, data: "Internal server error" };
		}

		this.name = new_name;
		this.address = new_address;
		this.tel = new_tel;
		this.email = new_email;
		this.siren = new_siren;
		this.is_entity = new_is_entity; 

		return client;
	}

	async delete() {
		if ( this.name === null || this.name === "" || this.email === null || this.email === "" || this.tel === null || this.tel === "" || this.siren === null || this.siren === "" || this.address === null || this.address === "" ) {
			return { code: 400, data: "Error : No fields should be empty" }
		}

		if (!await this._exist()) {
			return { code: 401, data: `Client with siren ${this.siren} does not exist` }
		}

		const _SQLquery = async () => {
			const query = `DELETE FROM inventory.client WHERE id = $1;`;
			try {
				const result = await pool.query(query, [this.id]);
				return { code: 204, data: "OK" };
			} catch (error) {
				return { code: 500, data: "Internal server error" };
			}
		}

		const client = await _SQLquery();
		if (client.code !== 204) {
			log.error(client.data);
			return { code: 500, data: "Internal server error" };
		}
		return client;
	}

	async _exist() {
		const query = "SELECT * FROM inventory.client WHERE siren = $1;";
		try {
			const result = await pool.query(query, [this.siren]);
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
			name: (v) => `${v}_modified`,
			address: (v) => `${v} bis`,
			tel: (v) => v.slice(0, -1) + (v.endsWith('9') ? '0' : '9'),
			email: (v) => v.replace('@', '.test@'),
			siren: (v) => {
				const digits = v.split('');
				digits[8] = digits[8] === '9' ? '0' : '9';
				return digits.join('');
			},
			is_entity: (v) => !v,
		};
	
		return {
			name: mutators.name(this.name),
			address: mutators.address(this.address),
			tel: mutators.tel(this.tel),
			email: mutators.email(this.email),
			siren : mutators.siren(this.siren),
			is_entity: mutators.is_entity(this.is_entity),
		};
	}
}

module.exports = Client;