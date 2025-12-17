// wanderwise-backend/models/Destination.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Destination = sequelize.define('Destination', {
  destination_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  seasonality: {
    type: DataTypes.STRING // e.g., "Winter, Spring"
  }
}, {
  tableName: 'Destination',
  timestamps: false
});

module.exports = Destination;