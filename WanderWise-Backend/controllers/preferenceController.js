// controllers/preferenceController.js
const Preference = require('../models/Preference');

exports.getAllPreferences = async (req, res) => {
  try {
    const preferences = await Preference.findAll();
    res.json(preferences);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ message: 'Server error' });
  }
};