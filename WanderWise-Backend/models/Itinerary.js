// wanderwise-backend/models/Itinerary.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Itinerary = sequelize.define('Itinerary', {
  itinerary_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  creator_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  is_public: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  carbon_footprint_score: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  
  total_est_cost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  public_note: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'Itinerary',
  timestamps: false
});

module.exports = Itinerary;