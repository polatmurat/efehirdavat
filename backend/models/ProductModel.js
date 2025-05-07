const mongoose = require("mongoose");
const variationSchema = new mongoose.Schema({
  size: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  color: { type: String }
}, {
  validate: [
    {
      validator: function(variation) {
        return variation.size || variation.color; // At least one must be present
      },
      message: 'A variation must have either a size or a color'
    }
  ]
});
const productSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    normalizedTitle: { type: String, required: true },
    price: { type: Number }, // opsiyonel: ana ürün fiyatı, ilk varyasyonun fiyatı gibi
    currency: { type: String, enum: ['TL', 'USD', 'EUR'], default: 'TL' },
    discount: { type: Number, default: 0 },
    stock: { type: Number, default: 0 }, // opsiyonel: toplam stok
    category: { type: String, default: "diğer" },
    isAvailable: { type: Boolean, default: true },
    variations: { type: [variationSchema], default: [] },
    image1: { type: String, default: "" },
    image2: { type: String, default: "" },
    image3: { type: String, default: "" },
    description: { type: String, default: "" },
    normalizedDescription: { type: String, default: "" },
    reviews: { type: Array, default: [] },
  },
  { timestamps: true }
);
productSchema.index({ normalizedTitle: 1, normalizedDescription: 1 });
module.exports = mongoose.model("product", productSchema);