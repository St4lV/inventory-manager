const { log } = require("../express_utils/utils");
const { express_values } = require("../express_utils/env-values-dictionnary");

const Client = require("../express_utils/classes/Client");
const Condition = require("../express_utils/classes/Condition");
const Item = require("../express_utils/classes/Item");
const Location = require("../express_utils/classes/Location");
const Owner = require("../express_utils/classes/Owner");
const Stock = require("../express_utils/classes/Stock");
const Tag = require("../express_utils/classes/Tag");

const test_error_list = [];

const api_tests = async () => {
	
	const condition_list = await new Condition().getAll();
	const item_list = await new Item().getAll();
	const location_list = await new Location().getAll();
	const owner_list = await new Owner().getAll();
	const tag_list = await new Tag().getAll()
	if (tag_list.code!==200){
		return ["Can't connect to database"]
	}

	log.debug("Launching API classes test");
    
	// CONFIG TEST VALUES

	const client_vals = { name: "Test", address: "42 rue de la Paix, Paris (75000)", tel: "+33123456789", email: "test@domain.com", siren: "123456789", is_entity: false };

	const item_vals = {label:'Test item',img_url:'/assets/test.svg',description:'Item description text',reference:"test_item_"+Date.now(),tags:[tag_list.data[0].label]};
    
	const location_vals = {label:"Test place",address: "42 rue de la Paix, Paris (75000)"};
	
	const owner_vals = {label : "Test owner"};

	const stock_vals = {label:"Test stock", tax_rate : 20 , tax_set : false, purchase_price:100 , purchase_date : new Date(Date.now()), count : 2, item_data : item_list.data[0], condition_data : condition_list.data[0], location_data : location_list.data[0], owner_data : owner_list.data[0], rental_price : 10, specification : "Test stock specification", second_hand:false};

	const tag_vals = {label:"Test tag"};

	const api_classes_obj = {
        client: new Client(client_vals.name, client_vals.address, client_vals.tel, client_vals.email, client_vals.siren, client_vals.is_entity),
        condition: new Condition(),
		item: new Item(item_vals.label,item_vals.img_url,item_vals.description,item_vals.reference,item_vals.tags),
		location: new Location(location_vals.label,location_vals.address),
		owner: new Owner(owner_vals.label),
		stock: new Stock(stock_vals.label,stock_vals.tax_rate,stock_vals.tax_set,stock_vals.purchase_price,stock_vals.purchase_date,stock_vals.count,stock_vals.item_data,stock_vals.condition_data,stock_vals.location_data,stock_vals.owner_data,stock_vals.rental_price,stock_vals.specification,stock_vals.second_hand),
		tag: new Tag(tag_vals.label),
    };

    for (const [name, instance] of Object.entries(api_classes_obj)) {
		log.debug("-----")
		log.debug(`Testing /api/v${express_values.api_version}/${name}`);
		
		// GET

		if (typeof instance.getAll === 'function') {
			const test_get = await instance.getAll();
			ouputFormatter(200,test_get,name,"GET")
		}

		// POST
		if (typeof instance.create === 'function'){
			const test_post = await instance.create();
			ouputFormatter(201,test_post,name,"POST")
		}
		
		// PUT
		if (typeof instance.modify === 'function' && typeof instance._mutate === 'function') {
            const mutated = instance._mutate();
            const test_put = await instance.modify(...Object.values(mutated));
			ouputFormatter(200,test_put,name,"PUT")
        }

		// DELETE

		if (typeof instance.delete === 'function'){
			const test_delete = await instance.delete();
			ouputFormatter(200,test_delete,name,"DELETE")
		}
    }
	log.debug("-----")
	return test_error_list;

	function ouputFormatter(excepted_code=200,data={code:200,data:"OK"},endpoint='condition',method="GET"){
		if (data.code===excepted_code){
			log.debug(`${method} - [${data.code}] : OK`);
		} else {
			log.error(`${method} - [${data.code}] : ERROR`);
			test_error_list.push(`/api/v${express_values.api_version}/${endpoint} | ${method} - [${data.code}] : ${JSON.stringify(data.data)}`);
		}
	}
};

module.exports = { api_tests };