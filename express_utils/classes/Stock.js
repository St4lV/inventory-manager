const { pool } = require("../postgres-connect");
const { log, convertDateToDBFormat } = require("../utils");
const Condition = require("./Condition");
const Item = require("./Item");
const Location = require("./Location");
const Owner = require("./Owner");

class Stock {
	constructor(label, tax_rate, tax_set, purchase_price, purchase_date, count, item_data, condition_data, location_data, owner_data, rental_price, specification, second_hand,) {
		this.label = label ?? null;
		this.tax_rate = tax_rate ?? 20.00;
		this.tax_set = tax_set ?? true;
		this.purchase_price = purchase_price ?? 0.00;
		this.purchase_date = convertDateToDBFormat(purchase_date) ?? null;
		this.count = count ?? 1;
		this.item_data = item_data ?? null;
		this.condition_data = condition_data ?? null;
		this.location_data = location_data ?? null;
		this.owner_data = owner_data ?? null;
		this.rental_price = rental_price ?? 0.00; 
		this.specification = specification ?? "";
		this.second_hand = second_hand ?? false;
		
		this._id = null;
		this._components_cache = null;
	}

	async getAll() {
		const query = `SELECT s.second_hand, s.rental_price, s.specification, s.label, s.count, s.vat_set AS tax_set, s.vat_rate AS tax_rate, s.purchase_price, s.purchase_date, i.tags AS tags_raw, json_build_object('label', i.label, 'img_url', i.img_url, 'description', i.description, 'reference', i.reference) AS item_data, json_build_object('label', c.label) AS condition_data, json_build_object('label', l.label, 'address', l.address) AS location_data, json_build_object('label', o.label) AS owner_data FROM inventory.stock s LEFT JOIN inventory.item i ON s.item_id = i.id LEFT JOIN inventory.condition c ON s.condition_id = c.id LEFT JOIN inventory.location l ON s.location_id = l.id LEFT JOIN inventory.owner o ON s.owner_id = o.id ORDER BY s.label;`;
		try {
			const stockResult = await pool.query(query, []);
			const tagsResult = await pool.query(`SELECT id, label FROM inventory.tag;`, []);
	
			const tagsById = new Map(tagsResult.rows.map(t => [t.id, t.label]));
	
			const data = stockResult.rows.map(row => {
				const ids = (row.tags_raw ?? '')
					.split(';')
					.map(s => s.trim())
					.filter(s => s !== '')
					.map(Number)
					.filter(n => !Number.isNaN(n));
	
				const tags = ids.map(id => tagsById.get(id)).filter(Boolean).sort((a, b) => a.localeCompare(b));
	
				const { tags_raw, item_data, ...rest } = row;
				return { ...rest, item_data: { ...item_data, tags } };
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
			return { code: 401, data: `Stock with label ${this.label} already exist` };
		}

		const components = await this._getComponentData(true);

		const _SQLquery = async () => {
			const query = `INSERT INTO inventory.stock (label, item_id, condition_id, location_id, count, vat_set, vat_rate, purchase_price, purchase_date, owner_id, rental_price, specification, second_hand) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id;`;
			try {
				await pool.query(query, [this.label, components.item_id, components.condition_id, components.location_id, this.count, this.tax_set, this.tax_rate, this.purchase_price, this.purchase_date, components.owner_id, this.rental_price, this.specification, this.second_hand,]);
				return { code: 201, data: "Created" };
			} catch (error) {
				log.error(error);
				return { code: 500, data: error };
			}
		};

		const stock = await _SQLquery();
		if (stock.code !== 201) {
			log.error(stock.data);
			return { code: 500, data: "Internal server error" };
		}
		return stock;
	}

	async modify(new_label = '', new_tax_rate = '', new_tax_set = '', new_purchase_price = '', new_purchase_date = '', new_count = '', new_item_data = '', new_condition_data = '', new_location_data = '', new_owner_data = '', new_rental_price = '', new_specification = '', new_second_hand = '') {
		if (!this._validateData() || new_label === '' || new_tax_rate === '' || new_tax_set === '' || new_purchase_price === '' || new_purchase_date === '' || new_count === '' || new_item_data === '' || new_condition_data === '' || new_location_data === '' || new_owner_data === '' || new_rental_price === '' || new_specification === '' || new_second_hand === '') {
			
			return { code: 400, data: "Error : No fields should be empty" };
		}

		if (!await this._exist()) {
			return { code: 404, data: `Stock with label ${this.label} does not exist` };
		}

		const components = this._components_cache;
		const new_components = await this._getComponentData(false, new_condition_data, new_item_data, new_location_data, new_owner_data);
		const _SQLquery = async () => {
			const query = `UPDATE inventory.stock
				SET label = $2,
				  item_id = $3,
			 condition_id = $4,
			  location_id = $5,
					count = $6,
				  vat_set = $7,
				 vat_rate = $8,
		   purchase_price = $9,
			purchase_date = $10,
			     owner_id = $11,
			 rental_price = $12,
			specification = $13,
			  second_hand = $14
				WHERE id = $1
				RETURNING id;`;
			
			try {
				const result = await pool.query(query, [

					this.id,

					new_label, new_components.item_id, new_components.condition_id,
					new_components.location_id, new_count, new_tax_set, new_tax_rate,
					new_purchase_price, convertDateToDBFormat(new_purchase_date), new_components.owner_id,
					new_rental_price, new_specification, new_second_hand,

				]);

				if (result.rowCount>0) {

					this.label = new_label;
					this.tax_rate = new_tax_rate;
					this.tax_set = new_tax_set;
					this.purchase_price = new_purchase_price;
					this.purchase_date = convertDateToDBFormat(new_purchase_date);
					this.count = new_count;
					this.item_data = new_item_data;
					this.condition_data = new_condition_data;
					this.location_data = new_location_data;
					this.owner_data = new_owner_data;
					this.rental_price = new_rental_price; 
					this.specification = new_specification;
					this.second_hand = new_second_hand;
					
					return { code: 200, data: "OK" };
				}
				return { code : 404, data : "Not found in database" };
			} catch (error) {
				log.error(error)
				return { code: 500, data: "Internal server error" };
			}
		};

		const stock = await _SQLquery();
		return stock;
	}

	async delete() {
		if (!this._validateData()) {
			return { code: 400, data: "Error : No fields should be empty" };
		}

		if (!await this._exist()) {
			return { code: 404, data: `Stock with label ${this.label} does not exist` };
		}

		const components = this._components_cache;

		const _SQLquery = async () => {
			const query = `DELETE FROM inventory.stock WHERE id = $1;`;
			try {
				await pool.query(query, [this.id]);
				return { code: 204, data: "OK" };
			} catch (error) {
				log.error(error)
				return { code: 500, data: error };
			}
		};

		const stock = await _SQLquery();
		if (stock.code !== 204) {
			log.error(stock.data);
			return { code: 500, data: "Internal server error" };
		}
		return stock;
	}

	async _exist() {
		const components = await this._getComponentData(true);
		const query = `SELECT * FROM inventory.stock WHERE label = $1 AND item_id = $2 AND condition_id = $3 AND location_id = $4 AND count = $5 AND vat_set = $6 AND vat_rate = $7 AND purchase_price = $8 AND purchase_date = $9 AND owner_id = $10;`;
		try {
			const result = await pool.query(query, [this.label, components.item_id, components.condition_id, components.location_id, this.count, this.tax_set, this.tax_rate, this.purchase_price, this.purchase_date, components.owner_id]);
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
		return !(this.label === "" || this.label === null);
	}

	async _getComponentData(cache_data = false, condition_data = this.condition_data, item_data = this.item_data, location_data = this.location_data, owner_data = this.owner_data) {
		const condition = new Condition(condition_data.label);
		await condition._exist();

		const item = new Item(item_data.label, item_data.img_url, item_data.description, item_data.reference);
		await item._exist();

		const location = new Location(location_data.label, location_data.address);
		await location._exist();

		const owner = new Owner(owner_data.label);
		await owner._exist();

		const result = { condition_id: condition.id, item_id: item.id, location_id: location.id, owner_id: owner.id };

		if (cache_data) {
			this._components_cache = result;
		}

		return result;
	}

	_mutate() {
		
		const mutators = {
			label: (v) => `${v} modified`,
			tax_rate: (v) => v+1,
			tax_set: (v) => !v,
			purchase_price: (v) => v+1,
			count: (v) => v+1,
			rental_price: (v) => v+1,
			specification: (v) => `${v} modified`,
			second_hand: (v) => !v,
		};
	
		return {
			label : mutators.label(this.label),
			tax_rate : mutators.tax_rate(this.tax_rate),
			tax_set : mutators.tax_set(this.tax_set),
			purchase_price : mutators.purchase_price(this.purchase_price),
			purchase_date : convertDateToDBFormat(new Date(Date.now()+10_000)),
			count : mutators.count(this.count),
			item_data : this.item_data,
			condition_data : this.condition_data,
			location_data : this.location_data,
			owner_data : this.owner_data,
			rental_price : mutators.rental_price(this.rental_price), 
			specification : mutators.specification(this.specification),
			second_hand : mutators.second_hand(this.second_hand),
		};
	}
}

module.exports = Stock;