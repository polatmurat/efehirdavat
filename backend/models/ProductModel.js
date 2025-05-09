const mongoose = require("mongoose");
const variationSchema = new mongoose.Schema({
  size: { type: String },
  price: { type: Number },
  stock: { type: Number },
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
    price: { type: Number, required: true },
    currency: { type: String, enum: ['TL', 'USD', 'EUR'], default: 'TL' },
    discount: { type: Number, default: 0 },
    stock: { type: Number },
    category: { type: String, required: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    isAvailable: { type: Boolean, default: true },
    variations: { type: [variationSchema], default: [] },
    image1: { type: String, default: "" },
    image2: { type: String, default: "" },
    image3: { type: String, default: "" },
    description: { type: String },
    normalizedDescription: { type: String },
    reviews: { type: Array, default: [] },
  },
  { timestamps: true }
);
productSchema.index({ normalizedTitle: 1, normalizedDescription: 1 });
module.exports = mongoose.model("product", productSchema);