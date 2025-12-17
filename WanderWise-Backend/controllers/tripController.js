const Trip = require('../models/Trip');
const TripMember = require('../models/TripMember');
const User = require('../models/User');
const Itinerary = require('../models/Itinerary');

// --- 1. START A NEW TRIP ---
exports.createTrip = async (req, res) => {
  try {
    const { userId, itineraryId, tripName, startDate, endDate } = req.body;

    // Create the Trip
    const newTrip = await Trip.create({
      itinerary_id: itineraryId,
      trip_name: tripName,
      start_date: startDate,
      end_date: endDate
    });

    // Add Creator as Member
    await TripMember.create({
      trip_id: newTrip.trip_id,
      user_id: userId,
    });

    res.json({ message: 'Trip started successfully!', tripId: newTrip.trip_id });
  } catch (error) {
    console.error("Create Trip Error:", error);
    res.status(500).json({ message: 'Server error creating trip.' });
  }
};

// --- 2. GET MY ACTIVE TRIPS ---
exports.getUserTrips = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId, {
      include: [{
        model: Trip,
        include: [
          { model: Itinerary, attributes: ['title', 'total_est_cost'] }, // Include Plan Details
          { model: TripMember, include: [User] } // Include Other Members
        ]
      }]
    });

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.Trips);
  } catch (error) {
    console.error("Fetch Trips Error:", error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// --- 3. ADD MEMBER (Invite Friend) ---
exports.addMember = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { email } = req.body; // Add by email

    const userToAdd = await User.findOne({ where: { email } });
    if (!userToAdd) return res.status(404).json({ message: 'User with this email not found.' });

    await TripMember.create({
      trip_id: tripId,
      user_id: userToAdd.user_id,
    });

    res.json({ message: `${userToAdd.full_name} added to the trip!` });
  } catch (error) {
    console.error("Add Member Error:", error);
    res.status(500).json({ message: 'Could not add member.' });
  }
};