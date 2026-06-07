const { Router } = require("express");
const router = Router();

const Item = require("../../../express_utils/classes/Item");

router.get("/", async (req, res) => {
	const item = new Item();
	const result = await item.getAll();
	return res.status(result.code).json(result);
});

router.post("/", async (req, res) => {
	const { label, img_url, description, reference, tags } = req.body;
	const item = new Item(label, img_url, description, reference, tags);
	const result = await item.create();
	return res.status(result.code).json(result);
});

router.put("/", async (req, res) => {
	const { label, img_url, description, reference, tags,
		new_label, new_img_url, new_description, new_reference, new_tags } = req.body;
	const item = new Item(label, img_url, description, reference, tags);
	const result = await item.modify(new_label, new_img_url, new_description, new_reference, new_tags);
	return res.status(result.code).json(result);
});

router.delete("/", async (req, res) => {
	const { label, img_url, description, reference } = req.query;
	const item = new Item(label, img_url, description, reference);
	const result = await item.delete();
	return res.status(result.code).json(result);
});

module.exports = router;