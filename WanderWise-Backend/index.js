// wanderwise-backend/index.js

const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// --- Import Models ---
const User = require('./models/User');
const Preference = require('./models/Preference');
const UserPreference = require('./models/UserPreference');
const Destination = require('./models/Destination');
const Activity = require('./models/Activity');
const Itinerary = require('./models/Itinerary');
const ItineraryItem = require('./models/ItineraryItem');
const SharedItineraryReview = require('./models/SharedItineraryReview');
const Trip = require('./models/Trip');
const TripMember = require('./models/TripMember');
const tripRoutes = require('./routes/trips');

// --- Define Associations ---
// User <-> Preference
User.belongsToMany(Preference, { through: UserPreference, foreignKey: 'user_id' });
Preference.belongsToMany(User, { through: UserPreference, foreignKey: 'preference_id' });

// Destination <-> Activity
Destination.hasMany(Activity, { foreignKey: 'destination_id' });
Activity.belongsTo(Destination, { foreignKey: 'destination_id' });

// Itinerary Relationships
User.hasMany(Itinerary, { foreignKey: 'creator_user_id' });
Itinerary.belongsTo(User, { foreignKey: 'creator_user_id' });

Itinerary.hasMany(ItineraryItem, { foreignKey: 'itinerary_id' });
ItineraryItem.belongsTo(Itinerary, { foreignKey: 'itinerary_id' });

Activity.hasMany(ItineraryItem, { foreignKey: 'activity_id' });
ItineraryItem.belongsTo(Activity, { foreignKey: 'activity_id' });

Itinerary.hasMany(SharedItineraryReview, { foreignKey: 'itinerary_id' });
SharedItineraryReview.belongsTo(Itinerary, { foreignKey: 'itinerary_id' });

User.hasMany(SharedItineraryReview, { foreignKey: 'user_id' });
SharedItineraryReview.belongsTo(User, { foreignKey: 'user_id' });

Trip.belongsTo(Itinerary, { foreignKey: 'itinerary_id' });
Itinerary.hasMany(Trip, { foreignKey: 'itinerary_id' });

// 2. User <-> Trip (Many-to-Many via TripMember)
User.belongsToMany(Trip, { through: TripMember, foreignKey: 'user_id' });
Trip.belongsToMany(User, { through: TripMember, foreignKey: 'trip_id' });

// Also define TripMember directly for easier querying
Trip.hasMany(TripMember, { foreignKey: 'trip_id' });
TripMember.belongsTo(User, { foreignKey: 'user_id' });

// --- Import Routes ---
const authRoutes = require('./routes/auth');
const preferenceRoutes = require('./routes/preferences');
const userRoutes = require('./routes/users');
const destinationRoutes = require('./routes/destinations');
const itineraryRoutes = require('./routes/itineraries');
const adminRoutes = require('./routes/admin'); // <--- 1. IMPORT THIS

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());


// --- Basic Route ---
app.get('/', (req, res) => {
  res.send('WanderWise Backend is running!');
});

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/preferences', preferenceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/admin', adminRoutes); // <--- 2. PLUG IT IN HERE
app.use('/api/trips', tripRoutes);

// --- Start Server ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
  console.log(`Server is listening on port ${PORT}`);
  try {
    await sequelize.sync();
    console.log('✅ All models were synchronized successfully.');
  } catch (error) {
    console.error('❌ Unable to sync models with the database:', error);
  }
});