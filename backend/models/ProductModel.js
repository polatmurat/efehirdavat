const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    normalizedTitle: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ['TL', 'USD', 'EUR'],
      default: 'TL'
    },
    discount: {
      type: Number,
      default: 0
    },
    stock: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      default: "diğer",
    },
    isAvailable: {
      type: Boolean,
      default: true 
    },
    colors: {
      type: Array,
      default: [],
    },
    sizes: {
      type: Array,
      default: [],
    },
    image1: {
      type: String,
      default: "",
    },
    image2: {
      type: String,
      default: "",
    },
    image3: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    normalizedDescription: {
      type: String,
      default: "",
    },
    reviews: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

// Text indexes for search
productSchema.index({ normalizedTitle: 1, normalizedDescription: 1 });

module.exports = mongoose.model("product", productSchema);
