const express = require("express");
const router = express.Router();
const Product = require("../controllers/Product");
const { isAuth } = require("../middleware/isAuth");

router.post("/create", isAuth, Product.create);
router.get("/get/:page", Product.get);
router.get("/get-product/:id", Product.getProduct);
router.put("/update", isAuth, Product.updateProduct);
router.delete("/delete/:id", isAuth, Product.deleteProduct);
router.get("/get-products-by-category/:categoryId", Product.getProductsByCategory);

module.exports = router; 