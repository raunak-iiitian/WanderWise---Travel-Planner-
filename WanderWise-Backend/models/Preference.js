// models/Preference.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Preference = sequelize.define('Preference', {
  preference_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
    // e.g., 'Interest', 'Budget'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
    // e.g., 'Nature', 'Low', 'High'
  }
}, {
  tableName: 'Preference',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['category', 'name']
    }
  ]
});

module.exports = Preference;