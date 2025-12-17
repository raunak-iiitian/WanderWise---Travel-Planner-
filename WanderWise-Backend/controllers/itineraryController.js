// wanderwise-backend/controllers/itineraryController.js

const Itinerary = require('../models/Itinerary');
const ItineraryItem = require('../models/ItineraryItem');
const Activity = require('../models/Activity');
const Destination = require('../models/Destination');
const User = require('../models/User');
const { Op } = require('sequelize');
const SharedItineraryReview = require('../models/SharedItineraryReview');

exports.generateItinerary = async (req, res) => {
  try {
    const { userId, destinationId, startDate, endDate, budget } = req.body;

    // 1. Calculate Duration (Days)
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // 2. Fetch Destination Details
    const destination = await Destination.findByPk(destinationId);
    if (!destination) return res.status(404).json({ message: 'Destination not found' });

    // 3. Create the Main Itinerary Record
    const newItinerary = await Itinerary.create({
      creator_user_id: userId,
      title: `My Trip to ${destination.name}`,
      total_est_cost: 0, // Will update later
      carbon_footprint_score: 5.0 // Placeholder score
    });

    // 4. Fetch Activities based on Budget Logic
    let costFilter = {};
    if (budget === 'Low') {
      costFilter = { estimated_cost: { [Op.lte]: 20 } }; // Cheap items only
    } else if (budget === 'Medium') {
      costFilter = { estimated_cost: { [Op.lte]: 100 } };
    }
    // High budget gets everything

    const activities = await Activity.findAll({
      where: { 
        destination_id: destinationId,
        ...costFilter
      }
    });

    if (activities.length === 0) {
      return res.status(400).json({ message: 'No activities found for this criteria.' });
    }

    
    // 5. Smart Allocation Logic (No Repetition)
    const itemsToCreate = [];
    let currentActivityIndex = 0;
    let runningTotalCost = 0;

    // We use a simple counter to ensure we don't exceed available unique activities
    // If user wants 5 days (10 slots) but we only have 8 activities, 
    // we stop at 8 activities instead of repeating or crashing.
    const maxSlots = activities.length; 
    let slotsFilled = 0;

    for (let day = 0; day < days; day++) {
      const currentDayDate = new Date(start);
      currentDayDate.setDate(start.getDate() + day);

      // Try to add 2 activities per day (Morning & Afternoon)
      for (let slot = 0; slot < 2; slot++) {
        
        // STOP CONDITION: If we ran out of unique activities, stop adding.
        if (slotsFilled >= maxSlots) {
          break; 
        }

        const activity = activities[currentActivityIndex];
        
        // Time Logic: Morning (10 AM), Afternoon (2 PM)
        const startTime = new Date(currentDayDate);
        startTime.setHours(10 + (slot * 4), 0, 0); 
        
        const endTime = new Date(startTime);
        endTime.setHours(startTime.getHours() + 2); 

        itemsToCreate.push({
          itinerary_id: newItinerary.itinerary_id,
          activity_id: activity.activity_id,
          custom_title: activity.name,
          start_time: startTime,
          end_time: endTime,
          estimated_cost: activity.estimated_cost
        });

        runningTotalCost += parseFloat(activity.estimated_cost);
        
        // Move to next unique activity
        currentActivityIndex++;
        slotsFilled++;
      }
    }

    // 6. Save all items to DB
    await ItineraryItem.bulkCreate(itemsToCreate);

    // 7. Update Total Cost
    newItinerary.total_est_cost = runningTotalCost;
    await newItinerary.save();

    // 8. Return Full Plan
    res.status(201).json({ 
      message: 'Itinerary generated!', 
      itineraryId: newItinerary.itinerary_id,
      days: days,
      items: itemsToCreate
    });

  } catch (error) {
    console.error('Generator Error:', error);
    res.status(500).json({ message: 'Server error generating plan.' });
  }
};

// Also add a 'Get Itinerary' function for viewing it later
exports.getItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const itinerary = await Itinerary.findByPk(id, {
      include: [
        { model: ItineraryItem, include: [Activity] },
        { model: User, attributes: ['full_name'] },
        // Add this line to fetch reviews with the trip:
        { model: SharedItineraryReview, include: [{ model: User, attributes: ['full_name'] }] } 
      ]
    });
    if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });
    res.json(itinerary);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// --- ADD THIS NEW FUNCTION ---
exports.getPublicItineraries = async (req, res) => {
  try {
    const publicTrips = await Itinerary.findAll({
      where: { is_public: 1 },
      include: [
        { 
          model: User, 
          attributes: ['full_name'], // We only need the name, not the password!
          required: false
        },
        {
          model: SharedItineraryReview,
          include: [{ model: User, attributes: ['full_name'] }] // Who wrote the comment?
        }
      ],
      order: [['total_est_cost', 'ASC']] // Show cheapest trips first (optional)
    });

    res.json(publicTrips);
  } catch (error) {
    console.error('Error fetching public trips:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserItineraries = async (req, res) => {
  const { userId } = req.params;
  const trips = await Itinerary.findAll({ where: { creator_user_id: userId } });
  res.json(trips);
};

exports.updateVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_public, public_note } = req.body;

    const itinerary = await Itinerary.findByPk(id);
    if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });

    // Update fields
    itinerary.is_public = is_public;
    itinerary.public_note = public_note; // Save the custom message
    await itinerary.save();

    res.json({ message: 'Visibility updated', itinerary });
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// wanderwise-backend/controllers/itineraryController.js

// ... imports remain the same ...

exports.generateItinerary = async (req, res) => {
  try {
    // 1. Get 'interests' from the request body
    const { userId, destinationId, startDate, endDate, budget, interests } = req.body;

    // Calculate Duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const destination = await Destination.findByPk(destinationId);
    if (!destination) return res.status(404).json({ message: 'Destination not found' });

    // 2. Build the Filter Logic
    let whereClause = { destination_id: destinationId };

    // Filter by Budget
    if (budget === 'Low') {
      whereClause.estimated_cost = { [Op.lte]: 30 };
    } else if (budget === 'Medium') {
      whereClause.estimated_cost = { [Op.lte]: 100 };
    }
    
    // Filter by Interests (if user selected any)
    // Expecting interests to be like ['Nature', 'Food']
    if (interests && interests.length > 0) {
      whereClause.type = { [Op.in]: interests };
    }

    // 3. Fetch Activities
    const activities = await Activity.findAll({ where: whereClause });

    if (activities.length === 0) {
      return res.status(400).json({ 
        message: 'No activities found matching your specific interests and budget for this location. Try selecting fewer filters.' 
      });
    }

    // Create Itinerary Record
    const newItinerary = await Itinerary.create({
      creator_user_id: userId,
      title: `My ${interests && interests.length > 0 ? interests[0] : ''} Trip to ${destination.name}`,
      total_est_cost: 0,
      carbon_footprint_score: 5.0
    });

    // 4. Allocation Logic (Prevent Repetition)
    const itemsToCreate = [];
    let currentActivityIndex = 0;
    let runningTotalCost = 0;
    const maxSlots = activities.length; 
    let slotsFilled = 0;

    for (let day = 0; day < days; day++) {
      const currentDayDate = new Date(start);
      currentDayDate.setDate(start.getDate() + day);

      for (let slot = 0; slot < 2; slot++) {
        if (slotsFilled >= maxSlots) break;

        const activity = activities[currentActivityIndex];
        
        const startTime = new Date(currentDayDate);
        startTime.setHours(10 + (slot * 4), 0, 0); 
        const endTime = new Date(startTime);
        endTime.setHours(startTime.getHours() + 2); 

        itemsToCreate.push({
          itinerary_id: newItinerary.itinerary_id,
          activity_id: activity.activity_id,
          custom_title: activity.name,
          start_time: startTime,
          end_time: endTime,
          estimated_cost: activity.estimated_cost
        });

        runningTotalCost += parseFloat(activity.estimated_cost);
        currentActivityIndex++;
        slotsFilled++;
      }
    }

    await ItineraryItem.bulkCreate(itemsToCreate);
    newItinerary.total_est_cost = runningTotalCost;
    await newItinerary.save();

    res.status(201).json({ 
      message: 'Itinerary generated!', 
      itineraryId: newItinerary.itinerary_id,
      days: days,
      items: itemsToCreate
    });

  } catch (error) {
    console.error('Generator Error:', error);
    res.status(500).json({ message: 'Server error generating plan.' });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { id } = req.params; // Itinerary ID
    const { userId, rating, comment } = req.body;

    const newReview = await SharedItineraryReview.create({
      itinerary_id: id,
      user_id: userId,
      rating,
      comment
    });

    // Fetch user info to send back immediately
    const fullReview = await SharedItineraryReview.findByPk(newReview.review_id, {
      include: [{ model: User, attributes: ['full_name'] }]
    });

    res.json(fullReview);
  } catch (error) {
    console.error("Review Error:", error);
    res.status(500).json({ message: "Failed to add review" });
  }
};

exports.likeItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const itinerary = await Itinerary.findByPk(id);
    if (!itinerary) return res.status(404).json({ message: 'Not found' });

    // Increment Like
    itinerary.likes += 1;
    await itinerary.save();

    res.json({ likes: itinerary.likes });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ... keep other functions ...