const ExchangeRates = require("../models/ExchangeRates");


const getExchanges = async (req, res) => {

    const rates = {};

    try {
        const USD = await ExchangeRates.findOne({currency: 'USD'});
        const EUR = await ExchangeRates.findOne({currency: 'EUR'});
        
        rates["USD"] = USD.value;
        rates["EUR"] = EUR.value;
        
        return res.status(200).json(rates);
        
    } catch(error) {
        console.error(error.message);
        return res.status(400).json({ error : error.message })
    }
}

module.exports = { getExchanges };