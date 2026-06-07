const express = require("express");

const { express_values } = require("./express_utils/env-values-dictionnary");
const { log, dim } = require("./express_utils/utils");

const app = express();
const port = express_values.port

app.use(express.json());

const api_routes = require("./api/api_router");
app.use(`/api`, api_routes);

// HOME

app.get('/', async (req, res) => {
	return res.status(200).sendFile('index.html', { root: __dirname + "/client/" });
});
app.get('/main.js', async (req, res) => {
	return res.status(200).sendFile('main.js', { root: __dirname + "/client/" });
});
app.get('/style.css', async (req, res) => {
	return res.status(200).sendFile('style.css', { root: __dirname + "/client/" });
});

// ASSETS

app.get('/favicon.ico', async (req, res) => {
	return res.status(200).sendFile('favicon.ico', { root: __dirname + "/client/" });
});

app.get('/assets/stock.svg', async (req, res) => {
	return res.status(200).sendFile('stock.svg', { root: __dirname + "/client/assets/" });
});

// /stock

app.get('/stock/main.js', async (req, res) => {
	return res.status(200).sendFile('main.js', { root: __dirname + "/client/stock/" });
});
app.get('/stock/style.css', async (req, res) => {
	return res.status(200).sendFile('style.css', { root: __dirname + "/client/stock/" });
});

app.get('/stock/', async (req, res) => {
	return res.status(200).sendFile('index.html', { root: __dirname + "/client/stock/" });
});

// /pdf

app.get('/pdf/main.js', async (req, res) => {
	return res.status(200).sendFile('main.js', { root: __dirname + "/client/pdf/" });
});
app.get('/pdf/style.css', async (req, res) => {
	return res.status(200).sendFile('style.css', { root: __dirname + "/client/pdf/" });
});

app.get('/pdf/', async (req, res) => {
	return res.status(200).sendFile('index.html', { root: __dirname + "/client/pdf/" });
});

// /app-settings

app.get('/app-settings/main.js', async (req, res) => {
	return res.status(200).sendFile('main.js', { root: __dirname + "/client/app-settings/" });
});
app.get('/app-settings/style.css', async (req, res) => {
	return res.status(200).sendFile('style.css', { root: __dirname + "/client/app-settings/" });
});

app.get('/app-settings/', async (req, res) => {
	return res.status(200).sendFile('index.html', { root: __dirname + "/client/app-settings/" });
});

//TEST API

app.get('/test_api/main.js', async (req, res) => {
	return res.status(200).sendFile('main.js', { root: __dirname + "/client/test_api/" });
});
app.get('/test_api/style.css', async (req, res) => {
	return res.status(200).sendFile('style.css', { root: __dirname + "/client/test_api/" });
});

app.get('/test_api/', async (req, res) => {
	return res.status(200).sendFile('index.html', { root: __dirname + "/client/test_api/" });
});

app.use((req, res) => {
	res.status(418).end();
});

app.listen(port, async () => {
	log.debug("Initializing application...");

	log.data(`=============================================`);
	log.data(`Running app on port ${port}`);
	log.data(`=============================================`);
});

