const express = require("express");
const { registerValidations, loginValidations } = require("../validations/userValidations");
const { register, login, getAllUsers, updateUser, deleteUser, adminLogin, getUser } = require("../controllers/usersController");
const { isAdmin } = require("../middleware/auth");
const router = express.Router();

router.post("/register", registerValidations, register);
router.post('/login', loginValidations, login);
router.post('/admin/login', loginValidations, adminLogin);

// Admin only routes
router.get("/users/:page", isAdmin, getAllUsers);
router.get("/user/:id", isAdmin, getUser);
router.put("/user/:id", isAdmin, updateUser);
router.delete("/user/:id", isAdmin, deleteUser);

module.exports = router;