const { Router } = require("express");
const router = Router();

const Owner = require("../../../express_utils/classes/Owner");

router.get("/", async (req, res) => {
	const location = new Owner()
	const result = await location.getAll();
	return res.status(result.code).json(result);
})

router.post("/", async (req, res) => {
	const { label } = req.body
	const location = new Owner(label)
	const result = await location.create();
	return res.status(result.code).json(result);
})

router.put("/", async (req, res) => {
	const { label, new_label } = req.body
	const location = new Owner(label)
	const result = await location.modify(new_label);
	return res.status(result.code).json(result);
})

router.delete("/", async (req, res) => {
	const { label } = req.query;
	const location = new Owner(label)
	const result = await location.delete();
	return res.status(result.code).json(result);
})

module.exports = router;