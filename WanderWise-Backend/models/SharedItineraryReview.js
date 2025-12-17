// wanderwise-backend/models/SharedItineraryReview.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SharedItineraryReview = sequelize.define('SharedItineraryReview', {
  review_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  itinerary_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.INTEGER, validate: { min: 1, max: 5 } },
  comment: { type: DataTypes.TEXT }
}, {
  tableName: 'SharedItineraryReview',
  timestamps: false
});

module.exports = SharedItineraryReview;