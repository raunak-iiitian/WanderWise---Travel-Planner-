// wanderwise-backend/routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/stats', adminController.getDashboardStats);
router.get('/destinations', adminController.getPopularDestinations);
router.get('/all-trips', adminController.getAllItineraries);

// CHANGED: From /seed to /add-city
router.post('/add-city', adminController.addDestination); 

module.exports = router;