// wanderwise-backend/models/Activity.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Activity = sequelize.define('Activity', {
  activity_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  destination_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  estimated_cost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  type: {
    type: DataTypes.STRING // e.g., "Sightseeing", "Food", "Adventure"
  }
}, {
  tableName: 'Activity',
  timestamps: false
});

module.exports = Activity;