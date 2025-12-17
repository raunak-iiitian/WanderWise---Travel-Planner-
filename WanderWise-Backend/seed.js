// wanderwise-backend/seed.js

const sequelize = require('./config/database');
const Preference = require('./models/Preference');

const seedPreferences = async () => {
  try {
    // 1. Connect to the DB
    await sequelize.authenticate();
    console.log('🌱 Connected to database...');

    // 2. Define the data we want to add
    // Matches your User Module requirements
    const preferencesData = [
      // -- Interests --
      { category: 'Interest', name: 'Nature' },
      { category: 'Interest', name: 'Adventure' },
      { category: 'Interest', name: 'Heritage' },
      { category: 'Interest', name: 'Food' },
      { category: 'Interest', name: 'Shopping' },
      { category: 'Interest', name: 'Relaxation' },
      { category: 'Interest', name: 'Nightlife' },
      
      // -- Budget --
      { category: 'Budget', name: 'Low (Budget)' },
      { category: 'Budget', name: 'Medium (Comfort)' },
      { category: 'Budget', name: 'High (Luxury)' },
      
      // -- Pace (Optional) --
      { category: 'Pace', name: 'Relaxed' },
      { category: 'Pace', name: 'Fast-paced' }
    ];

    // 3. Insert the data
    // bulkCreate is efficient. 'ignoreDuplicates' skips if they already exist.
    await Preference.bulkCreate(preferencesData, { 
      ignoreDuplicates: true 
    });

    console.log('✅ Database seeded successfully!');
    process.exit(0); // Exit the script

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedPreferences();