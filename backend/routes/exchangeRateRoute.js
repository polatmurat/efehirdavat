const router = require("express").Router();
const { getExchanges } = require("../controllers/ExchangeRateController");

router.get("/exchange-rate", getExchanges);

module.exports = router;