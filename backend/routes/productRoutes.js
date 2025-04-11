const express = require("express");
const HomeProducts = require("../controllers/HomeProducts");
const router = new express.Router();
const Product = require("../controllers/Product");
const Authorization = require("../services/Authorization");
const productValidations = require("../validations/productValidations");

router.post("/create-product", Product.create);
router.get("/products/:page", Authorization.authorized, Product.get);
router.get("/del20prod", Product.del20prods);
router.get("/product/:id", Product.getProduct);
router.put(
  "/product",
  [Authorization.authorized, productValidations],
  Product.updateProduct
);
router.delete("/delete/:id", Authorization.authorized, Product.deleteProduct);
router.get("/cat-products/:name/:page?", HomeProducts.catProducts);
router.get("/search-products/:keyword/:page?", HomeProducts.catProducts);
// Tüm ürünlerin normalize edilmiş alanlarını güncelle
module.exports = router;
