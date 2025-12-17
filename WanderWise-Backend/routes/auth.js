// routes/auth.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route for User Registration
// POST /api/auth/signup
router.post('/signup', authController.signup);

// Route for User Login
// POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;