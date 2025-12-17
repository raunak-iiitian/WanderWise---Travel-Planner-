// wanderwise-backend/routes/destinations.js
const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');

router.get('/', destinationController.getAllDestinations);

// NEW: Suggestion Endpoint
router.post('/suggest', destinationController.suggestDestinations);

module.exports = router;