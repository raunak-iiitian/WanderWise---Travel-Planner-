// config/database.js

const { Sequelize } = require('sequelize');

// Create a new Sequelize instance
// new Sequelize('database_name', 'username', 'password')
const sequelize = new Sequelize('wanderwise_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

// Test the connection
const connectDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

connectDb();

module.exports = sequelize;