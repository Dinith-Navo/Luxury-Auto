const express = require('express');
const router = express.Router();
const authController = require('../Controllers/AuthController');

// Login route
router.post('/login', authController.loginUser);

module.exports = router;
