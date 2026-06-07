const { Router } = require("express");
const router = Router();

const Location = require("../../../express_utils/classes/Location");

router.get("/", async (req, res) => {
	const location = new Location()
	const result = await location.getAll();
	return res.status(result.code).json(result);
})

router.post("/", async (req, res) => {
	const { label, address } = req.body
	const location = new Location(label, address)
	const result = await location.create();
	return res.status(result.code).json(result);
})

router.put("/", async (req, res) => {
	const { label, address, new_label, new_address } = req.body
	const location = new Location(label, address)
	const result = await location.modify(new_label,new_address);
	return res.status(result.code).json(result);
})

router.delete("/", async (req, res) => {
	const { label, address } = req.query;
	const location = new Location(label, address)
	const result = await location.delete();
	return res.status(result.code).json(result);
})

module.exports = router;