// wanderwise-backend/controllers/userController.js

const User = require('../models/User');
const Preference = require('../models/Preference');

exports.saveUserPreferences = async (req, res) => {
  try {
    const userId = req.params.id;
    const { preferenceIds } = req.body; // Expecting [1, 2, 5]

    // 1. Find the User
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. Save Preferences
    // setPreferences is a magic method Sequelize adds because of 'belongsToMany'
    // It automatically removes old preferences and adds the new ones!
    await user.setPreferences(preferenceIds);

    res.json({ message: 'Preferences saved successfully!' });

  } catch (error) {
    console.error('Error saving preferences:', error);
    res.status(500).json({ message: 'Server error' });
  }
};