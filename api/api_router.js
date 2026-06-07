const { Router } = require("express");
const { express_values } = require("../express_utils/env-values-dictionnary");
const router = Router();

router.get('/', async (req, res) => {
	const pjson = require('../package.json');
	const json_body = {
		app: pjson.name,
		version: pjson.version,
		api_version:express_values.api_version,
		dev: pjson.author,
		license: pjson.license
	}
	return res.status(200).json({ data: json_body })
})

const api_routes = {
	v1: ()=>{	
		const v1 = require("./v1/routes") 
		return v1;
	},
}

for (let i = 1;i<=express_values.api_version;i++){
	router.use(`/v${i}`,api_routes[`v${i}`]())
}

module.exports = router;