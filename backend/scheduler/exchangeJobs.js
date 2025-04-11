const axios = require("axios");
const ExchangeRateModel = require("../models/ExchangeRates");
const cheerio = require("cheerio");
const cron = require('node-cron');


const upsertRate = async (currency, value) => {
    await ExchangeRateModel.findOneAndUpdate(
        { currency },
        { value, updatedAt: new Date() },
        { upsert: true, new: true }
    );
};

const fetchandSaveExchanges = async () => {
    const rates = {};
    try {
        const response = await axios.get("https://setkaysiparis.com.tr/tum-urunler?categories=11&order=smart");

        if (response.status !== 200) {
            console.error("Döviz kurları getirilirken hata oluştu.");
            return res.status(400).json({ error: "Döviz kurları getirilirken hata oluştu." });
        }

        const $ = cheerio.load(response.data);
        const ratesHTML = $(".header-top strong").text().trim();
        rates["USD"] = ratesHTML.split("|")[0].replace("USD:", "").trim();
        rates["EUR"] = ratesHTML.split("|")[1].replace("EUR:", "").trim();

        await upsertRate('USD', rates.USD.replace(",", "."));
        await upsertRate('EUR', rates.EUR.replace(",", "."));

        console.log('Kur bilgileri güncellendi.');

    } catch (error) {
        console.error('Kur bilgisi alınamadı:', error.message);
    }
}

const scheduleExchangeJob = () => {
    // Saat 08:00, 14:00 ve 20:00'de çalışır
    cron.schedule('0 8,14,20 * * *', () => {
        console.log(`[${new Date().toLocaleString()}] Zamanlayıcı tetiklendi. (exchange - rate)`);
        fetchandSaveExchanges();
    });
};

module.exports = scheduleExchangeJob;