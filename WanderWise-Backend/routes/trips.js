const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');

router.post('/create', tripController.createTrip);       // Start Trip
router.get('/user/:userId', tripController.getUserTrips); // Get My Trips
router.post('/:tripId/add-member', tripController.addMember); // Add Friend

module.exports = router;