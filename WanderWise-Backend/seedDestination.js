// wanderwise-backend/seedDestinations.js

const sequelize = require('./config/database');
const Destination = require('./models/Destination');
const Activity = require('./models/Activity');

const seedDestinations = async () => {
  try {
    await sequelize.authenticate();
    console.log('🌱 Connected for seeding...');

    // 1. Create GOA
    const goa = await Destination.create({
      name: 'Goa',
      location: 'India',
      description: 'Famous for beaches, nightlife, and Portuguese heritage.',
      seasonality: 'Winter'
    });

    // Add Activities for Goa
    await Activity.bulkCreate([
      { destination_id: goa.destination_id, name: 'Baga Beach', type: 'Nature', estimated_cost: 0, description: 'Popular beach with water sports.' },
      { destination_id: goa.destination_id, name: 'Fort Aguada', type: 'Heritage', estimated_cost: 5, description: '17th-century Portuguese fort.' },
      { destination_id: goa.destination_id, name: 'Thalassa Restaurant', type: 'Food', estimated_cost: 40, description: 'Greek food with sunset views.' },
      { destination_id: goa.destination_id, name: 'Dudhsagar Waterfalls', type: 'Adventure', estimated_cost: 20, description: 'Scenic waterfall trek.' },
      { destination_id: goa.destination_id, name: 'Anjuna Flea Market', type: 'Shopping', estimated_cost: 0, description: 'Wednesday market for souvenirs.' }
    ]);

    // 2. Create JAIPUR
    const jaipur = await Destination.create({
      name: 'Jaipur',
      location: 'India',
      description: 'The Pink City, known for palaces and forts.',
      seasonality: 'Winter'
    });

    await Activity.bulkCreate([
      { destination_id: jaipur.destination_id, name: 'Amber Fort', type: 'Heritage', estimated_cost: 10, description: 'Hilltop fort with elephant rides.' },
      { destination_id: jaipur.destination_id, name: 'Hawa Mahal', type: 'Heritage', estimated_cost: 2, description: 'Palace of Winds.' },
      { destination_id: jaipur.destination_id, name: 'Chokhi Dhani', type: 'Food', estimated_cost: 15, description: 'Traditional Rajasthani dining experience.' },
      { destination_id: jaipur.destination_id, name: 'Johari Bazaar', type: 'Shopping', estimated_cost: 0, description: 'Famous for jewelry and fabrics.' }
    ]);

    console.log('✅ Destinations and Activities seeded!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding:', error);
    process.exit(1);
  }
};

seedDestinations();