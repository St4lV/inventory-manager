const { log } = require("../express_utils/utils");

const { api_tests } = require("./api.test");

async function launchTests() {
	
	const test_error_list = [];
	
	const start_time = Date.now();
 	log.data("Unitary tests started.")

	// API
	const api_endpoint = await api_tests();
	for (let i of api_endpoint){
		test_error_list.push(i);
	}
	
	const end_time = Date.now();
	const total_time = (end_time - start_time)*0.001; 
	log.data("Done in "+total_time.toFixed(2)+" s");
	
	if (test_error_list.length>0){
		log.error(`${test_error_list.length} error${test_error_list.length>1 ? "s" : ""} detected :`);
		for (let i of test_error_list){
			log.error(i+"\n");
		}
	}
}

module.exports = { launchTests };

(async () => {
	await launchTests();
})();