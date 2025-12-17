// routes/preferences.js
const express = require('express');
const router = express.Router();
const preferenceController = require('../controllers/preferenceController');

// GET /api/preferences
router.get('/', preferenceController.getAllPreferences);

module.exports = router;