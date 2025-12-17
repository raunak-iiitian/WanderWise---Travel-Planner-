// wanderwise-backend/models/ItineraryItem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ItineraryItem = sequelize.define('ItineraryItem', {
  item_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  itinerary_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  activity_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  custom_title: {
    type: DataTypes.STRING
  },
  start_time: {
    type: DataTypes.DATE
  },
  end_time: {
    type: DataTypes.DATE
  },
  estimated_cost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  }
}, {
  tableName: 'ItineraryItem',
  timestamps: false
});

module.exports = ItineraryItem;