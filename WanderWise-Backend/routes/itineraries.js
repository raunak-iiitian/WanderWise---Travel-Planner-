// wanderwise-backend/routes/itineraries.js
const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itineraryController');

// ✅ CORRECT ORDER: Specific routes MUST be first!

// 1. Public Feed (Specific)
router.get('/public', itineraryController.getPublicItineraries); 

// 2. User Trips (Specific)
router.get('/user/:userId', itineraryController.getUserItineraries);

// 3. Generate Trip (Specific)
router.post('/generate', itineraryController.generateItinerary);

// 4. Update Visibility (Specific structure)
router.put('/:id/share', itineraryController.updateVisibility);

router.put('/:id/like', itineraryController.likeItinerary);

// The (\\d+) tells the server: "Only trigger this if ID is a NUMBER"
router.get('/trip/:id', itineraryController.getItinerary);

router.post('/:id/reviews', itineraryController.addReview);

module.exports = router;