const { Router } = require("express");
const router = Router();

const Condition = require("../../../express_utils/classes/Condition");

router.get("/", async (req, res) => {
	const location = new Condition()
	const result = await location.getAll();
	return res.status(result.code).json(result);
})

module.exports = router;