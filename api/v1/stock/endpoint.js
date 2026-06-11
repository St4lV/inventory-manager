const { Router } = require("express");
const router = Router();
const Stock = require("../../../express_utils/classes/Stock");

router.get("/", async (req, res) => {
	const stock = new Stock();
	const result = await stock.getAll();
	return res.status(result.code).json({ data: result.data });
});

router.post("/", async (req, res) => {
	const { label, tax_rate, tax_set, purchase_price, purchase_date, count, item_data, condition_data, location_data, owner_data, rental_price, specification, second_hand } = req.body;
	const stock = new Stock(label, tax_rate, tax_set, purchase_price, purchase_date, count, item_data, condition_data, location_data, owner_data, rental_price, specification, second_hand);
	const result = await stock.create();
	return res.status(result.code).json({ data: result.data });
});

router.put("/", async (req, res) => {
	const { label, tax_rate, tax_set, purchase_price, purchase_date, count, item_data, condition_data, location_data, owner_data, rental_price, specification, second_hand,
		new_label, new_tax_rate, new_tax_set, new_purchase_price, new_purchase_date, new_count, new_item_data, new_condition_data, new_location_data, new_owner_data, new_rental_price, new_specification, new_second_hand } = req.body;
	const stock = new Stock(label, tax_rate, tax_set, purchase_price, purchase_date, count, item_data, condition_data, location_data, owner_data);
	const result = await stock.modify(new_label, new_tax_rate, new_tax_set, new_purchase_price, new_purchase_date, new_count, new_item_data, new_condition_data, new_location_data, new_owner_data, new_rental_price, new_specification, new_second_hand);
	return res.status(result.code).json({ data: result.data });
});

router.delete("/", async (req, res) => {
	const { label, tax_rate, tax_set, purchase_price, purchase_date, count, item_data, condition_data, location_data, owner_data, rental_price, specification, second_hand, } = req.query;
	const stock = new Stock(label, tax_rate, tax_set, purchase_price, purchase_date, count, JSON.parse(item_data), JSON.parse(condition_data), JSON.parse(location_data), JSON.parse(owner_data), rental_price, specification, second_hand);
	const result = await stock.delete();
	return res.status(result.code).json({ data: result.data });
});

module.exports = router;