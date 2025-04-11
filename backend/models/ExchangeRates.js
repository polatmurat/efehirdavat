const mongoose = require('mongoose');

const exchangeRateSchema = new mongoose.Schema({
  currency: { type: String, unique: true }, // 'USD' veya 'EUR'
  value: Number,
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ExchangeRate', exchangeRateSchema);
