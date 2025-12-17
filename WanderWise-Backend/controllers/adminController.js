// wanderwise-backend/controllers/adminController.js

const User = require('../models/User');
const Itinerary = require('../models/Itinerary');
const Destination = require('../models/Destination');
const Activity = require('../models/Activity');
const sequelize = require('../config/database');

// --- STATS ---
// wanderwise-backend/controllers/adminController.js

exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Count ALL the things
    const totalUsers = await User.count();
    const totalTrips = await Itinerary.count();
    const totalDestinations = await Destination.count(); // <--- NEW: Count Cities

    // 2. Calculate Avg Cost
    const costStats = await Itinerary.findAll({
      attributes: [[sequelize.fn('AVG', sequelize.col('total_est_cost')), 'avgCost']]
    });
    const avgCost = parseFloat(costStats[0].getDataValue('avgCost') || 0).toFixed(2);

    // 3. Send it all back
    res.json({ 
      totalUsers, 
      totalTrips, 
      totalDestinations, // <--- Send this to frontend
      avgCost 
    });

  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};

// --- POPULAR DESTINATIONS ---
exports.getPopularDestinations = async (req, res) => {
  // (Keep your existing logic here, or return empty mock if you want to save space)
  res.json({ labels: ['Goa', 'Manali'], data: [10, 5] }); 
};

// --- NEW: GET ALL TRIPS (For Admin View) ---
exports.getAllItineraries = async (req, res) => {
  try {
    const trips = await Itinerary.findAll({
      include: [{ model: User, attributes: ['full_name', 'email'] }],
      order: [['itinerary_id', 'DESC']]
    });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching all trips' });
  }
};

// --- NEW: TRIGGER SEED (The Magic Button) ---
exports.seedDatabase = async (req, res) => {
  try {
    // 1. Create a new Destination (Example: Varanasi)
    // In a real app, you could pass this data in req.body
    const varanasi = await Destination.create({
      name: 'Varanasi',
      location: 'Uttar Pradesh, India',
      description: 'The spiritual capital of India, famous for its Ghats and temples.',
      seasonality: 'Winter'
    });

    // 2. Add Activities
    await Activity.bulkCreate([
      { destination_id: varanasi.destination_id, name: 'Ganga Aarti', type: 'Culture', estimated_cost: 0, description: 'Evening ritual at Dashashwamedh Ghat.' },
      { destination_id: varanasi.destination_id, name: 'Kashi Vishwanath Temple', type: 'Heritage', estimated_cost: 0, description: 'One of the most famous Hindu temples.' },
      { destination_id: varanasi.destination_id, name: 'Morning Boat Ride', type: 'Relaxation', estimated_cost: 10, description: 'Sunrise boat ride along the Ganges.' },
      { destination_id: varanasi.destination_id, name: 'Sarnath Tour', type: 'Heritage', estimated_cost: 5, description: 'Where Buddha preached his first sermon.' }
    ]);

    res.json({ message: '✅ Successfully added Varanasi & Activities to Database!' });
  } catch (error) {
    console.error("Seed Error", error);
    res.status(500).json({ message: 'Error seeding data.' });
  }
};

// wanderwise-backend/controllers/adminController.js

// ... imports remain the same ...

// --- NEW: ADD CUSTOM CITY (Dynamic) ---
// wanderwise-backend/controllers/adminController.js

// ... imports ...

// wanderwise-backend/controllers/adminController.js

exports.addDestination = async (req, res) => {
  try {
    const { name, location, description, seasonality, activities } = req.body;

    console.log("Received Data:", req.body); // Log data to see what's wrong in terminal

    if (!name || !location) {
      return res.status(400).json({ message: 'City Name and Location are required.' });
    }

    // 1. Create Destination
    const newDest = await Destination.create({
      name,
      location,
      description,
      seasonality
    });

    // 2. Add Activities (Safely)
    if (activities && activities.length > 0) {
      // Clean the data: Convert cost to number, ensure fields exist
      const cleanActivities = activities.map(act => ({
        destination_id: newDest.destination_id,
        name: act.name,
        type: act.type || 'Sightseeing', // Default if missing
        description: act.description,
        // CRITICAL FIX: Convert "" to 0
        estimated_cost: parseFloat(act.estimated_cost) || 0 
      }));
      
      await Activity.bulkCreate(cleanActivities);
    } else {
      // Fallback
      await Activity.create({
        destination_id: newDest.destination_id,
        name: `${name} City Center`,
        type: 'Sightseeing',
        estimated_cost: 0,
        description: 'Explore the heart of the city.'
      });
    }

    res.json({ message: `✅ Successfully added ${name}!` });

  } catch (error) {
    console.error("Add City Error:", error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'City already exists.' });
    }
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};
// ... existing functions ...

// ... keep getDashboardStats, getPopularDestinations, getAllItineraries ...