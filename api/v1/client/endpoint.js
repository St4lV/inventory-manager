const { Router } = require("express");
const router = Router();

const Client = require("../../../express_utils/classes/Client");

router.get("/", async (req, res) => {
	const location = new Client()
	const result = await location.getAll();
	return res.status(result.code).json(result);
})

router.post("/", async (req, res) => {
	const { name, email, tel, siren, address, is_entity} = req.body;
	const location = new Client( name, address, tel, email, siren, is_entity)
	const result = await location.create();
	return res.status(result.code).json(result);
})

router.put("/", async (req, res) => {
	const { name, email, tel, siren, address, is_entity, new_name, new_email, new_tel, new_siren, new_address, new_is_entity} = req.body;
	const location = new Client( name, address, tel, email, siren, is_entity)
	const result = await location.modify( new_name, new_address, new_tel, new_email, new_siren, new_is_entity);
	return res.status(result.code).json(result);
})

router.delete("/", async (req, res) => {
	const { name, email, tel, siren, address, is_entity} = req.body;
	const location = new Client( name, address, tel, email, siren, is_entity)
	const result = await location.delete();
	return res.status(result.code).json(result);
})

module.exports = router;