const express = require("express");
const authController = require("../controller/authController");

const router = express.Router();

// Inscription
router.post("/register", authController.register);

// Connexion
router.post("/login", authController.login);

module.exports = router;
