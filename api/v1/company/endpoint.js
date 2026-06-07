const { pool } = require("../../../express_utils/postgres-connect");
const { log } = require("../../../express_utils/utils");

const { Router } = require("express");
const router = Router();

router.get("/", async (req, res) => {
	const query = "SELECT name, address, email, tel, siren FROM inventory.company_data;";
	async function getData() {
		try {
			const result = await pool.query(query, [])
			return { code: 200, data: result.rows[0] };
		} catch (error) {
			log.error(error);
			return { code: 500, data: "Internal server error" };
		}
	}

	const result = await getData();
		
	return res.status(result.code).json(result);
});

router.put("/", async (req, res) => {
	const { new_name, new_email, new_tel, new_siren, new_address} = req.body;

	async function putData(){
		if ( new_name === null || new_name === "" || new_email === null || new_email === "" || new_tel === null || new_tel === "" || new_siren === null || new_siren === "" || new_address === null || new_address === "" ) {
			return { code: 400, data: "Error : No fields should be empty" }
		}
	
		const query = "UPDATE inventory.company_data SET name = $1, email = $2, tel = $3, siren = $4 WHERE id = 1;";
		try {
			const result = await pool.query(query, [new_name, new_email, new_tel, new_siren, new_address]);
			return { code: 200, data: "OK" };
		} catch (error) {
			return { code: 500, data: error };
		}
	}
	
	const result = await putData();

	return res.status(result.code).json(result);
});

module.exports = router;