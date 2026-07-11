const { Router } = require("express");
const router = Router();

const Calendar = require("../../../express_utils/classes/Calendar");

router.get('/', async(req, res)=>{
	const calendar = new Calendar();
	const result = await calendar.getAll();
	return res.status(result.code).json(result.data);
});

router.post('/', async(req, res)=>{
	const { event } = req.body
	const calendar = new Calendar(event);
	const result = await calendar.create(event);
	return res.status(result.code).json(result.data);
});

router.put('/', async(req, res)=>{
	const { event, new_event } = req.body
	const calendar = new Calendar(event);
	const result = await calendar.modify(new_event);
	return res.status(result.code).json(result.data);
});


router.delete('/', async(req, res)=>{
	const { event } = req.body
	const calendar = new Calendar(event);
	const result = await calendar.delete();
	return res.status(result.code).json(result.data);
});


module.exports = router;