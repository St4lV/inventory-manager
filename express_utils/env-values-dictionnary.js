require('dotenv').config();

// Values from .env file

const express_values = {
    port : process.env.EXPRESS_PORT,
    api_version : process.env.EXPRESS_API_VERSION,
}

const mongo_db_values = {
	server : process.env.MONGODB_SERVER,
	port : process.env.MONGODB_PORT,
	database: process.env.MONGODB_DATABASE,
}

const postgres_values = {
	user : process.env.POSTGRES_USER,
	password : process.env.POSTGRES_PASSWORD,
	host : process.env.POSTGRES_HOST,
	port : process.env.POSTGRES_PORT,
	database : process.env.POSTGRES_DATABASE,
}

module.exports = { express_values, mongo_db_values, postgres_values }