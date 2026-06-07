function URLize(input){
  return input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "_")
}

const pjson = require('../package.json');
const log = {
    data(data){
      console.log(`[${pjson.name}@${pjson.version}] `+ data);
    },
	debug(data) {
		console.log(dim(`[${pjson.name}@${pjson.version}] ` + data));
	},
    error(data){
      console.error(red(`[${pjson.name}@${pjson.version}] `+ data));
    }
}

// Text formatting code coming from dotenv lib
//=============================================
function supportsAnsi () {
	return process.stdout.isTTY
}
function dim (text) {
	return supportsAnsi() ? `\x1b[2m${text}\x1b[0m` : text
}
//=============================================

function red(text) {
	return supportsAnsi() ? `\x1b[31m${text}\x1b[0m` : text
}

function convertDateToDBFormat(iso) {
	if (!iso) return null;
	const d = new Date(iso);
	if (isNaN(d.getTime())) return iso;
	const pad = (n, l = 2) => String(n).padStart(l, '0');
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
		+ `T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
		+ `.${pad(d.getMilliseconds(), 3)}`;
}

module.exports = { URLize, log, dim, convertDateToDBFormat};