// models/UserPreference.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserPreference = sequelize.define('UserPreference', {
  // We don't need an ID here because it's a composite key of user_id + preference_id
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'User',
      key: 'user_id'
    }
  },
  preference_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Preference',
      key: 'preference_id'
    }
  }
}, {
  tableName: 'UserPreference',
  timestamps: false
});

module.exports = UserPreference;