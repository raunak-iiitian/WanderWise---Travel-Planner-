// wanderwise-backend/routes/users.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST /api/users/:id/preferences
router.post('/:id/preferences', userController.saveUserPreferences);

module.exports = router;