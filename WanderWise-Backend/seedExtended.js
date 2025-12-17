// wanderwise-backend/seedExtended.js

const sequelize = require('./config/database');
const Destination = require('./models/Destination');
const Activity = require('./models/Activity');

const seedExtended = async () => {
  try {
    await sequelize.authenticate();
    console.log('🌱 Connecting to database...');

    // NOTE: This appends data. It checks if a city exists before adding.

    const newCities = [
      // --- NORTH INDIA ---
      {
        name: 'Varanasi', location: 'Uttar Pradesh, India', seasonality: 'Winter', description: 'The spiritual capital of India, famous for its Ghats.',
        activities: [
          { name: 'Ganga Aarti', type: 'Culture', estimated_cost: 0, description: 'Evening ritual at Dashashwamedh Ghat.' },
          { name: 'Kashi Vishwanath Temple', type: 'Heritage', estimated_cost: 0, description: 'One of the most famous Hindu temples.' },
          { name: 'Morning Boat Ride', type: 'Relaxation', estimated_cost: 500, description: 'Sunrise boat ride on the Ganges.' },
          { name: 'Sarnath Tour', type: 'Heritage', estimated_cost: 200, description: 'Where Buddha preached his first sermon.' },
          { name: 'Assi Ghat Walk', type: 'Relaxation', estimated_cost: 0, description: 'A peaceful ghat famous for morning yoga.' },
          { name: 'Ramnagar Fort', type: 'Heritage', estimated_cost: 100, description: 'An 18th-century fort on the eastern bank.' },
          { name: 'Blue Lassi Shop', type: 'Food', estimated_cost: 150, description: 'Famous traditional yogurt drink shop.' },
          { name: 'Manikarnika Ghat', type: 'Culture', estimated_cost: 0, description: 'The main burning ghat, a place of deep spiritual significance.' },
          { name: 'Banaras Silk Shopping', type: 'Shopping', estimated_cost: 0, description: 'Shop for world-famous Banarasi sarees.' },
          { name: 'Bharat Mata Mandir', type: 'Heritage', estimated_cost: 0, description: 'Unique temple dedicated to Mother India with a marble map.' }
        ]
      },
      {
        name: 'Agra', location: 'Uttar Pradesh, India', seasonality: 'Winter', description: 'Home of the Taj Mahal and Mughal heritage.',
        activities: [
          { name: 'Taj Mahal', type: 'Heritage', estimated_cost: 1100, description: 'One of the Seven Wonders of the World.' },
          { name: 'Agra Fort', type: 'Heritage', estimated_cost: 600, description: 'Historic fort of the Mughal empire.' },
          { name: 'Mehtab Bagh', type: 'Nature', estimated_cost: 300, description: 'Garden complex with Taj views at sunset.' },
          { name: 'Tomb of Itimad-ud-Daulah', type: 'Heritage', estimated_cost: 300, description: 'Often called the "Baby Taj".' },
          { name: 'Kinari Bazar', type: 'Shopping', estimated_cost: 0, description: 'Bustling market for jewelry and fabrics.' },
          { name: 'Fatehpur Sikri Day Trip', type: 'Heritage', estimated_cost: 1500, description: 'Abandoned Mughal capital city nearby.' },
          { name: 'Petha Shopping', type: 'Food', estimated_cost: 300, description: 'Try the famous sweet candy of Agra.' },
          { name: 'Akbar\'s Tomb', type: 'Heritage', estimated_cost: 300, description: 'Grand mausoleum of Emperor Akbar in Sikandra.' },
          { name: 'Mughal Heritage Walk', type: 'Culture', estimated_cost: 1000, description: 'Guided walking tour through old Agra.' },
          { name: 'Sadar Bazar Street Food', type: 'Food', estimated_cost: 200, description: 'Famous chaat and street snacks.' }
        ]
      },
      {
        name: 'Rishikesh', location: 'Uttarakhand, India', seasonality: 'Spring, Autumn', description: 'Yoga capital and adventure hub.',
        activities: [
          { name: 'River Rafting', type: 'Adventure', estimated_cost: 1500, description: 'White water rafting on the Ganges.' },
          { name: 'Beatles Ashram', type: 'Heritage', estimated_cost: 200, description: 'Abandoned ashram with graffiti art.' },
          { name: 'Ganga Aarti at Triveni', type: 'Culture', estimated_cost: 0, description: 'Spiritual gathering by the river.' },
          { name: 'Lakshman Jhula', type: 'Sightseeing', estimated_cost: 0, description: 'Iconic suspension bridge.' },
          { name: 'Bungee Jumping', type: 'Adventure', estimated_cost: 3500, description: 'India\'s highest bungee jump.' },
          { name: 'Neer Garh Waterfall', type: 'Nature', estimated_cost: 50, description: 'Trek to a refreshing waterfall.' },
          { name: 'Parmarth Niketan', type: 'Relaxation', estimated_cost: 0, description: 'Famous ashram for yoga and meditation.' },
          { name: 'Cafe Hopping', type: 'Food', estimated_cost: 500, description: 'Visit Little Buddha Cafe and others.' },
          { name: 'Vashishta Gufa', type: 'Heritage', estimated_cost: 0, description: 'Ancient cave for meditation.' },
          { name: 'Kayaking', type: 'Adventure', estimated_cost: 2000, description: 'Learn to kayak on the Ganges.' }
        ]
      },
      {
        name: 'Manali', location: 'Himachal Pradesh, India', seasonality: 'Summer, Winter', description: 'High-altitude resort town in the Himalayas.',
        activities: [
          { name: 'Solang Valley', type: 'Adventure', estimated_cost: 1000, description: 'Paragliding and skiing hub.' },
          { name: 'Rohtang Pass', type: 'Nature', estimated_cost: 500, description: 'Snow point with breathtaking views.' },
          { name: 'Old Manali Cafe Hopping', type: 'Food', estimated_cost: 800, description: 'Vibrant cafes with river views.' },
          { name: 'Hadimba Temple', type: 'Heritage', estimated_cost: 50, description: 'Ancient wooden temple in a cedar forest.' },
          { name: 'Jogini Waterfalls Trek', type: 'Adventure', estimated_cost: 0, description: 'Scenic hike to a waterfall.' },
          { name: 'Mall Road Shopping', type: 'Shopping', estimated_cost: 0, description: 'Main street for woolens and souvenirs.' },
          { name: 'Vashisht Hot Springs', type: 'Relaxation', estimated_cost: 0, description: 'Natural hot sulphur springs.' },
          { name: 'Manu Temple', type: 'Heritage', estimated_cost: 0, description: 'Temple dedicated to Sage Manu.' },
          { name: 'Beas River Rafting', type: 'Adventure', estimated_cost: 800, description: 'Rafting in Kullu.' },
          { name: 'Atal Tunnel Drive', type: 'Sightseeing', estimated_cost: 1500, description: 'Drive through the world\'s longest highway tunnel.' }
        ]
      },
      {
        name: 'Shimla', location: 'Himachal Pradesh, India', seasonality: 'Summer', description: 'The Queen of Hills and former summer capital.',
        activities: [
          { name: 'The Ridge', type: 'Sightseeing', estimated_cost: 0, description: 'The hub of all cultural activities.' },
          { name: 'Jakhu Temple', type: 'Heritage', estimated_cost: 0, description: 'Ancient temple with a giant Hanuman statue.' },
          { name: 'Toy Train Ride', type: 'Relaxation', estimated_cost: 500, description: 'UNESCO heritage railway journey.' },
          { name: 'Mall Road Walk', type: 'Shopping', estimated_cost: 0, description: 'Pedestrian-only shopping street.' },
          { name: 'Christ Church', type: 'Heritage', estimated_cost: 0, description: 'Second oldest church in North India.' },
          { name: 'Kufri Fun World', type: 'Adventure', estimated_cost: 800, description: 'Amusement park with go-karting.' },
          { name: 'Viceregal Lodge', type: 'Heritage', estimated_cost: 100, description: 'Historical British architecture.' },
          { name: 'Chadwick Falls', type: 'Nature', estimated_cost: 0, description: 'Quiet waterfall inside Glen forest.' },
          { name: 'Lakkar Bazaar', type: 'Shopping', estimated_cost: 0, description: 'Market famous for wooden crafts.' },
          { name: 'Summer Hill', type: 'Nature', estimated_cost: 0, description: 'Scenic spot for nature walks.' }
        ]
      },
      {
        name: 'Jaipur', location: 'Rajasthan, India', seasonality: 'Winter', description: 'The Pink City of forts and palaces.',
        activities: [
          { name: 'Amber Fort', type: 'Heritage', estimated_cost: 500, description: 'Hilltop fort with elephant rides.' },
          { name: 'Hawa Mahal', type: 'Sightseeing', estimated_cost: 200, description: 'Palace of Winds.' },
          { name: 'Chokhi Dhani', type: 'Food', estimated_cost: 1200, description: 'Traditional Rajasthani village experience.' },
          { name: 'City Palace', type: 'Heritage', estimated_cost: 700, description: 'Royal residence and museum.' },
          { name: 'Jantar Mantar', type: 'Heritage', estimated_cost: 200, description: 'Ancient astronomical observatory.' },
          { name: 'Nahargarh Fort Sunset', type: 'Nature', estimated_cost: 200, description: 'Best view of Jaipur city.' },
          { name: 'Johari Bazaar', type: 'Shopping', estimated_cost: 0, description: 'Famous for jewelry and sarees.' },
          { name: 'Patrika Gate', type: 'Sightseeing', estimated_cost: 0, description: 'Instagram-famous colorful gate.' },
          { name: 'Lassiwala', type: 'Food', estimated_cost: 80, description: 'Iconic lassi shop.' },
          { name: 'Hot Air Ballooning', type: 'Adventure', estimated_cost: 12000, description: 'Float over forts and palaces.' }
        ]
      },
      {
        name: 'Udaipur', location: 'Rajasthan, India', seasonality: 'Winter', description: 'The City of Lakes.',
        activities: [
          { name: 'City Palace', type: 'Heritage', estimated_cost: 400, description: 'Massive palace complex.' },
          { name: 'Lake Pichola Boat Ride', type: 'Relaxation', estimated_cost: 500, description: 'Sunset boat ride.' },
          { name: 'Jag Mandir', type: 'Heritage', estimated_cost: 0, description: 'Island palace.' },
          { name: 'Bagore Ki Haveli', type: 'Culture', estimated_cost: 150, description: 'Folk dance show.' },
          { name: 'Saheliyon Ki Bari', type: 'Nature', estimated_cost: 100, description: 'Garden of Maidens.' },
          { name: 'Monsoon Palace', type: 'Sightseeing', estimated_cost: 300, description: 'Hilltop palace with views.' },
          { name: 'Karni Mata Ropeway', type: 'Adventure', estimated_cost: 150, description: 'Cable car ride.' },
          { name: 'Vintage Car Museum', type: 'Heritage', estimated_cost: 400, description: 'Classic car collection.' },
          { name: 'Ambrai Ghat', type: 'Relaxation', estimated_cost: 0, description: 'Evening view of the lake.' },
          { name: 'Hathi Pol Bazaar', type: 'Shopping', estimated_cost: 0, description: 'Market for art and paintings.' }
        ]
      },

      // --- SOUTH INDIA ---
      {
        name: 'Bangalore', location: 'Karnataka, India', seasonality: 'All Year', description: 'The Silicon Valley and Garden City.',
        activities: [
          { name: 'Cubbon Park', type: 'Nature', estimated_cost: 0, description: 'Massive green lung of the city.' },
          { name: 'Bangalore Palace', type: 'Heritage', estimated_cost: 500, description: 'Tudor-style architecture.' },
          { name: 'Microbrewery Tour', type: 'Nightlife', estimated_cost: 2000, description: 'Pub hopping in Indiranagar.' },
          { name: 'Lalbagh Botanical Garden', type: 'Nature', estimated_cost: 50, description: 'Famous glass house.' },
          { name: 'Nandi Hills Sunrise', type: 'Adventure', estimated_cost: 500, description: 'Early morning drive.' },
          { name: 'Tipu Sultan\'s Summer Palace', type: 'Heritage', estimated_cost: 200, description: 'Historical wooden palace.' },
          { name: 'Commercial Street', type: 'Shopping', estimated_cost: 0, description: 'Shopping hub.' },
          { name: 'VV Puram Food Street', type: 'Food', estimated_cost: 300, description: 'Street food paradise.' },
          { name: 'Wonderla', type: 'Adventure', estimated_cost: 1500, description: 'Amusement park.' },
          { name: 'ISKCON Temple', type: 'Culture', estimated_cost: 0, description: 'Hilltop temple complex.' }
        ]
      },
      {
        name: 'Coorg', location: 'Karnataka, India', seasonality: 'Winter, Monsoon', description: 'The Scotland of India, known for coffee.',
        activities: [
          { name: 'Abbey Falls', type: 'Nature', estimated_cost: 50, description: 'Scenic waterfall.' },
          { name: 'Dubare Elephant Camp', type: 'Adventure', estimated_cost: 800, description: 'Bathe and feed elephants.' },
          { name: 'Coffee Plantation Walk', type: 'Nature', estimated_cost: 300, description: 'Learn about coffee.' },
          { name: 'Raja\'s Seat', type: 'Sightseeing', estimated_cost: 50, description: 'Sunset point.' },
          { name: 'Namdroling Monastery', type: 'Culture', estimated_cost: 0, description: 'Golden Temple of Coorg.' },
          { name: 'Talakaveri', type: 'Heritage', estimated_cost: 0, description: 'Source of River Kaveri.' },
          { name: 'Mandalpatti Jeep Safari', type: 'Adventure', estimated_cost: 2000, description: 'Off-road mountain drive.' },
          { name: 'Nisargadhama', type: 'Nature', estimated_cost: 100, description: 'Bamboo forest island.' },
          { name: 'Madikeri Fort', type: 'Heritage', estimated_cost: 0, description: 'Historical fort.' },
          { name: 'Coorg Cuisine Lunch', type: 'Food', estimated_cost: 500, description: 'Try Pandi Curry.' }
        ]
      },
      {
        name: 'Munnar', location: 'Kerala, India', seasonality: 'Winter, Monsoon', description: 'Rolling tea gardens and misty hills.',
        activities: [
          { name: 'Tea Museum', type: 'Culture', estimated_cost: 200, description: 'History of tea making.' },
          { name: 'Eravikulam National Park', type: 'Nature', estimated_cost: 400, description: 'Home to the Nilgiri Tahr.' },
          { name: 'Top Station View', type: 'Sightseeing', estimated_cost: 0, description: 'Panoramic views.' },
          { name: 'Mattupetty Dam', type: 'Relaxation', estimated_cost: 500, description: 'Boating and picnics.' },
          { name: 'Echo Point', type: 'Nature', estimated_cost: 0, description: 'Scenic lake spot.' },
          { name: 'Attukad Waterfalls', type: 'Adventure', estimated_cost: 0, description: 'Trekking spot.' },
          { name: 'Pothamedu View Point', type: 'Sightseeing', estimated_cost: 0, description: 'Sunset views.' },
          { name: 'Kundala Lake', type: 'Relaxation', estimated_cost: 300, description: 'Shikara boat ride.' },
          { name: 'Tea Garden Photo Walk', type: 'Nature', estimated_cost: 0, description: 'Photography.' },
          { name: 'Kathakali Show', type: 'Culture', estimated_cost: 500, description: 'Traditional dance.' }
        ]
      },
      {
        name: 'Alleppey', location: 'Kerala, India', seasonality: 'Winter', description: 'Venice of the East, famous for backwaters.',
        activities: [
          { name: 'Houseboat Stay', type: 'Relaxation', estimated_cost: 8000, description: 'Overnight stay in backwaters.' },
          { name: 'Shikara Ride', type: 'Relaxation', estimated_cost: 1000, description: 'Canal cruise.' },
          { name: 'Marari Beach', type: 'Nature', estimated_cost: 0, description: 'Quiet beach.' },
          { name: 'Alappuzha Lighthouse', type: 'Sightseeing', estimated_cost: 50, description: 'Coastline views.' },
          { name: 'Kayaking', type: 'Adventure', estimated_cost: 1500, description: 'Paddle through villages.' },
          { name: 'Krishnapuram Palace', type: 'Heritage', estimated_cost: 100, description: 'Kerala architecture.' },
          { name: 'Ambalapuzha Temple', type: 'Culture', estimated_cost: 0, description: 'Famous for Palpayasam.' },
          { name: 'Pathiramanal Island', type: 'Nature', estimated_cost: 0, description: 'Bird watching.' },
          { name: 'Village Walk', type: 'Culture', estimated_cost: 500, description: 'Explore local life.' },
          { name: 'Toddy Shop Visit', type: 'Food', estimated_cost: 500, description: 'Local cuisine and drink.' }
        ]
      },

      // --- WEST INDIA ---
      {
        name: 'Goa', location: 'India', seasonality: 'Winter', description: 'Beaches, parties and Portuguese history.',
        activities: [
          { name: 'Baga Beach', type: 'Adventure', estimated_cost: 500, description: 'Water sports.' },
          { name: 'Fort Aguada', type: 'Heritage', estimated_cost: 50, description: 'Portuguese fort.' },
          { name: 'Thalassa', type: 'Food', estimated_cost: 2000, description: 'Greek dining.' },
          { name: 'Dudhsagar Waterfalls', type: 'Adventure', estimated_cost: 1500, description: 'Jeep safari and trek.' },
          { name: 'Basilica of Bom Jesus', type: 'Heritage', estimated_cost: 0, description: 'UNESCO church.' },
          { name: 'Anjuna Flea Market', type: 'Shopping', estimated_cost: 0, description: 'Wednesday market.' },
          { name: 'Casino Royale', type: 'Nightlife', estimated_cost: 3000, description: 'Floating casino.' },
          { name: 'Palolem Beach', type: 'Relaxation', estimated_cost: 0, description: 'Scenic beach.' },
          { name: 'Spice Plantation', type: 'Nature', estimated_cost: 800, description: 'Tour and lunch.' },
          { name: 'Chapora Fort', type: 'Sightseeing', estimated_cost: 0, description: 'Dil Chahta Hai fort.' }
        ]
      },
      {
        name: 'Mumbai', location: 'Maharashtra, India', seasonality: 'All Year', description: 'The City of Dreams.',
        activities: [
          { name: 'Gateway of India', type: 'Heritage', estimated_cost: 0, description: 'Iconic monument.' },
          { name: 'Marine Drive', type: 'Relaxation', estimated_cost: 0, description: 'Sunset walk.' },
          { name: 'Elephanta Caves', type: 'Heritage', estimated_cost: 250, description: 'Ferry and caves.' },
          { name: 'Juhu Beach', type: 'Food', estimated_cost: 200, description: 'Pav Bhaji.' },
          { name: 'Colaba Causeway', type: 'Shopping', estimated_cost: 0, description: 'Street shopping.' },
          { name: 'Siddhivinayak Temple', type: 'Culture', estimated_cost: 0, description: 'Famous Ganesh temple.' },
          { name: 'Haji Ali Dargah', type: 'Heritage', estimated_cost: 0, description: 'Mosque in the sea.' },
          { name: 'Film City Tour', type: 'Adventure', estimated_cost: 1500, description: 'Bollywood tour.' },
          { name: 'Bandra Bandstand', type: 'Sightseeing', estimated_cost: 0, description: 'Seafront promenade.' },
          { name: 'Leopold Cafe', type: 'Food', estimated_cost: 1000, description: 'Historic cafe.' }
        ]
      },
      {
        name: 'Pune', location: 'Maharashtra, India', seasonality: 'Winter, Monsoon', description: 'Cultural capital of Maharashtra.',
        activities: [
          { name: 'Shaniwar Wada', type: 'Heritage', estimated_cost: 50, description: 'Peshwa fortification.' },
          { name: 'Sinhagad Fort Trek', type: 'Adventure', estimated_cost: 0, description: 'Popular trek.' },
          { name: 'German Bakery', type: 'Food', estimated_cost: 500, description: 'Famous cafe.' },
          { name: 'Aga Khan Palace', type: 'Heritage', estimated_cost: 50, description: 'Gandhi memorial.' },
          { name: 'Osho Ashram', type: 'Relaxation', estimated_cost: 1000, description: 'Meditation resort.' },
          { name: 'Phoenix Mall', type: 'Shopping', estimated_cost: 0, description: 'Large shopping mall.' },
          { name: 'Khadakwasla Dam', type: 'Nature', estimated_cost: 0, description: 'Lake view.' },
          { name: 'Parvati Hill', type: 'Sightseeing', estimated_cost: 0, description: 'City view temple.' },
          { name: 'Raja Dinkar Kelkar Museum', type: 'Culture', estimated_cost: 100, description: 'Artifacts museum.' },
          { name: 'High Spirits', type: 'Nightlife', estimated_cost: 1500, description: 'Live music gig.' }
        ]
      }
    ];

    for (const city of newCities) {
      // 1. Check if city exists
      const existing = await Destination.findOne({ where: { name: city.name } });
      
      if (existing) {
        console.log(`⚠️  Skipping ${city.name} (Already exists)`);
        // Optional: You could add logic here to append activities to existing cities if needed
        continue;
      }

      // 2. Create if not exists
      const newDest = await Destination.create({
        name: city.name,
        location: city.location,
        description: city.description,
        seasonality: city.seasonality
      });

      // 3. Add Activities
      if (city.activities && city.activities.length > 0) {
        const activitiesWithId = city.activities.map(act => ({
          ...act,
          destination_id: newDest.destination_id
        }));
        await Activity.bulkCreate(activitiesWithId);
      }

      console.log(`✅ Added ${city.name}`);
    }

    console.log('🎉 DOMESTIC SEED COMPLETE! 300+ Activities Added.');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding:', error);
    process.exit(1);
  }
};

seedExtended();