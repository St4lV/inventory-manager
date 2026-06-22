require('dotenv').config();

// Values from .env file

const express_values = {
    port : process.env.EXPRESS_PORT,
    api_version : process.env.EXPRESS_API_VERSION,
}

const postgres_values = {
	user : process.env.POSTGRES_USER,
	password : process.env.POSTGRES_PASSWORD,
	host : process.env.POSTGRES_HOST,
	port : process.env.POSTGRES_PORT,
	database : process.env.POSTGRES_DATABASE,
}

const nextcloud_values = {
	server : process.env.NEXTCLOUD_SERVER_URL,
	credentials : {
		login : process.env.NEXTCLOUD_EMAIL,
		password : process.env.NEXTCLOUD_APP_PASSWORD,
	},
	calendar : process.env.NEXTCLOUD_RENTAL_CAL,
}

module.exports = { express_values, postgres_values, nextcloud_values }