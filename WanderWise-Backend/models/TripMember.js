const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TripMember = sequelize.define('TripMember', {
  trip_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  
}, {
  tableName: 'TripMember',
  timestamps: false
});

module.exports = TripMember;