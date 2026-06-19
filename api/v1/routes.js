const { Router } = require("express");
const router = Router();

const condition_endpoint = require("./condition/endpoint")
router.use("/condition", condition_endpoint);

const item_endpoint = require("./item/endpoint")
router.use("/item", item_endpoint);

const location_endpoint = require("./location/endpoint")
router.use("/location", location_endpoint);

const owner_endpoint = require("./owner/endpoint")
router.use("/owner", owner_endpoint);

const stock_endpoint = require("./stock/endpoint")
router.use("/stock",stock_endpoint);

const tag_endpoint = require("./tag/endpoint")
router.use("/tag", tag_endpoint);

const company_endpoint = require("./company/endpoint")
router.use("/company", company_endpoint);

const client_endpoint = require("./client/endpoint")
router.use("/client", client_endpoint);

const pdf_endpoint = require("./pdf/endpoint")
router.use("/pdf", pdf_endpoint);

module.exports = router;