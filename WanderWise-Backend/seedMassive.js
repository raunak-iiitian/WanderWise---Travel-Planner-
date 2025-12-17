// wanderwise-backend/seedMassive.js

const sequelize = require('./config/database');
const Destination = require('./models/Destination');
const Activity = require('./models/Activity');

const seedMassive = async () => {
  try {
    await sequelize.authenticate();
    console.log('🌱 Connecting to database...');

    // ⚠️ CLEAR EXISTING DATA to prevent duplicates
    // We use { cascade: true } (or equivalent logic) to ensure referenced items are deleted
    await Activity.destroy({ where: {}, truncate: false }); // Delete activities first
    await Destination.destroy({ where: {}, truncate: false }); // Then destinations
    console.log('🧹 Old data cleared.');

    // --- 1. JABALPUR (Nature & Rocks) ---
    const jabalpur = await Destination.create({
      name: 'Jabalpur',
      location: 'Madhya Pradesh, India',
      description: 'Known for the marble rocks of Bhedaghat and the Dhuandhar Falls.',
      seasonality: 'Winter, Monsoon'
    });

    await Activity.bulkCreate([
      { destination_id: jabalpur.destination_id, name: 'Dhuandhar Falls', type: 'Nature', estimated_cost: 0, description: 'A massive waterfall where the Narmada river creates a smoky mist.' },
      { destination_id: jabalpur.destination_id, name: 'Marble Rocks Boat Ride', type: 'Adventure', estimated_cost: 10, description: 'Boat ride through the stunning white marble gorges at Bhedaghat.' },
      { destination_id: jabalpur.destination_id, name: 'Madan Mahal Fort', type: 'Heritage', estimated_cost: 0, description: 'An ancient hilltop fort built by the Gond rulers.' },
      { destination_id: jabalpur.destination_id, name: 'Balancing Rock', type: 'Nature', estimated_cost: 0, description: 'A geological marvel where a massive rock balances on a small base.' },
      { destination_id: jabalpur.destination_id, name: 'Chausath Yogini Temple', type: 'Heritage', estimated_cost: 0, description: 'An ancient temple dedicated to Goddess Durga, offering city views.' },
      { destination_id: jabalpur.destination_id, name: 'Bargi Dam Cruise', type: 'Relaxation', estimated_cost: 15, description: 'A relaxing cruise on the massive reservoir of the Narmada river.' },
    ]);

    // --- 2. BHOPAL (Lakes & History) ---
    const bhopal = await Destination.create({
      name: 'Bhopal',
      location: 'Madhya Pradesh, India',
      description: 'The City of Lakes, known for its greenery and heritage sites.',
      seasonality: 'Winter, Monsoon'
    });

    await Activity.bulkCreate([
      { destination_id: bhopal.destination_id, name: 'Upper Lake Boating', type: 'Relaxation', estimated_cost: 5, description: 'Sunset boating in the oldest man-made lake in India.' },
      { destination_id: bhopal.destination_id, name: 'Van Vihar National Park', type: 'Nature', estimated_cost: 2, description: 'A unique open zoo and national park perfect for cycling.' },
      { destination_id: bhopal.destination_id, name: 'Sanchi Stupa Tour', type: 'Heritage', estimated_cost: 10, description: 'Visit the UNESCO World Heritage site of ancient Buddhist monuments.' },
      { destination_id: bhopal.destination_id, name: 'Taj-ul-Masajid', type: 'Heritage', estimated_cost: 0, description: 'One of the largest mosques in Asia with stunning architecture.' },
      { destination_id: bhopal.destination_id, name: 'Tribal Museum', type: 'Culture', estimated_cost: 2, description: 'An immersive museum showcasing the tribal life of Madhya Pradesh.' },
      { destination_id: bhopal.destination_id, name: 'Bhimbetka Caves', type: 'Heritage', estimated_cost: 5, description: 'Prehistoric rock shelters featuring ancient cave paintings.' },
    ]);

    // --- 3. INDORE (Food & Culture) ---
    const indore = await Destination.create({
      name: 'Indore',
      location: 'Madhya Pradesh, India',
      description: 'The food capital of central India and the cleanest city.',
      seasonality: 'Winter'
    });

    await Activity.bulkCreate([
      { destination_id: indore.destination_id, name: 'Sarafa Bazaar Night Food', type: 'Food', estimated_cost: 10, description: 'Famous jewelry market that turns into a street food paradise at night.' },
      { destination_id: indore.destination_id, name: 'Rajwada Palace', type: 'Heritage', estimated_cost: 2, description: 'A historical palace built by the Holkars displaying Maratha style.' },
      { destination_id: indore.destination_id, name: 'Lal Bagh Palace', type: 'Heritage', estimated_cost: 3, description: 'A grand European-style palace with stunning interiors.' },
      { destination_id: indore.destination_id, name: 'Chappan Dukan', type: 'Food', estimated_cost: 15, description: 'A famous hub of 56 shops offering distinct food items.' },
      { destination_id: indore.destination_id, name: 'Patalpani Waterfalls', type: 'Nature', estimated_cost: 0, description: 'A scenic waterfall and picnic spot outside the city.' },
    ]);

    // --- 4. GWALIOR (Forts & Music) ---
    const gwalior = await Destination.create({
      name: 'Gwalior',
      location: 'Madhya Pradesh, India',
      description: 'Famous for its massive hilltop fort and musical heritage.',
      seasonality: 'Winter'
    });

    await Activity.bulkCreate([
      { destination_id: gwalior.destination_id, name: 'Gwalior Fort', type: 'Heritage', estimated_cost: 5, description: 'An impenetrable hill fort described as the pearl amongst fortresses.' },
      { destination_id: gwalior.destination_id, name: 'Jai Vilas Palace', type: 'Heritage', estimated_cost: 15, description: 'A lavish European-style palace with the world\'s largest chandelier.' },
      { destination_id: gwalior.destination_id, name: 'Sas Bahu Temple', type: 'Heritage', estimated_cost: 0, description: 'Intricately carved temples dating back to the 11th century.' },
      { destination_id: gwalior.destination_id, name: 'Sun Temple', type: 'Heritage', estimated_cost: 0, description: 'A modern architectural marvel dedicated to the Sun God.' },
      { destination_id: gwalior.destination_id, name: 'Tansen Tomb', type: 'Culture', estimated_cost: 0, description: 'The resting place of the legendary musician Tansen.' },
    ]);

    // --- 5. SRINAGAR (Paradise on Earth) ---
    const srinagar = await Destination.create({
      name: 'Srinagar',
      location: 'Jammu & Kashmir, India',
      description: 'Famous for the Dal Lake, houseboats, and Mughal gardens.',
      seasonality: 'Summer'
    });

    await Activity.bulkCreate([
      { destination_id: srinagar.destination_id, name: 'Dal Lake Shikara Ride', type: 'Relaxation', estimated_cost: 15, description: 'A romantic boat ride with views of the mountains.' },
      { destination_id: srinagar.destination_id, name: 'Shalimar Bagh', type: 'Nature', estimated_cost: 2, description: 'A stunning Mughal garden built by Emperor Jahangir.' },
      { destination_id: srinagar.destination_id, name: 'Shankaracharya Temple', type: 'Heritage', estimated_cost: 0, description: 'Ancient hilltop temple offering panoramic views of Srinagar.' },
      { destination_id: srinagar.destination_id, name: 'Tulip Garden', type: 'Nature', estimated_cost: 5, description: 'Asia\'s largest tulip garden (seasonal).' },
      { destination_id: srinagar.destination_id, name: 'Gulmarg Day Trip', type: 'Adventure', estimated_cost: 50, description: 'A trip to the meadow of flowers for skiing and gondola rides.' },
      { destination_id: srinagar.destination_id, name: 'Wazwan Lunch', type: 'Food', estimated_cost: 25, description: 'Experience the traditional multi-course Kashmiri meal.' },
    ]);

    // --- 6. GUWAHATI (Gateway to Northeast) ---
    const guwahati = await Destination.create({
      name: 'Guwahati',
      location: 'Assam, India',
      description: 'A sprawling city beside the Brahmaputra River.',
      seasonality: 'Winter, Spring'
    });

    await Activity.bulkCreate([
      { destination_id: guwahati.destination_id, name: 'Kamakhya Temple', type: 'Heritage', estimated_cost: 0, description: 'A famous Hindu temple dedicated to the mother goddess.' },
      { destination_id: guwahati.destination_id, name: 'Brahmaputra River Cruise', type: 'Relaxation', estimated_cost: 20, description: 'Sunset cruise on the mighty Brahmaputra river.' },
      { destination_id: guwahati.destination_id, name: 'Umananda Island', type: 'Nature', estimated_cost: 5, description: 'The smallest inhabited river island in the world.' },
      { destination_id: guwahati.destination_id, name: 'Pobitora Wildlife Sanctuary', type: 'Adventure', estimated_cost: 30, description: 'Home to the highest density of one-horned rhinos.' },
      { destination_id: guwahati.destination_id, name: 'Assam State Zoo', type: 'Nature', estimated_cost: 3, description: 'The largest zoo in the North East region.' },
    ]);

    // --- 7. HYDERABAD (Pearls & Biryani) ---
    const hyderabad = await Destination.create({
      name: 'Hyderabad',
      location: 'Telangana, India',
      description: 'A blend of history and technology, famous for Biryani.',
      seasonality: 'Winter'
    });

    await Activity.bulkCreate([
      { destination_id: hyderabad.destination_id, name: 'Charminar', type: 'Heritage', estimated_cost: 2, description: 'The iconic monument and mosque in the heart of the city.' },
      { destination_id: hyderabad.destination_id, name: 'Golconda Fort', type: 'Heritage', estimated_cost: 5, description: 'A massive fortress with acoustic wonders.' },
      { destination_id: hyderabad.destination_id, name: 'Ramoji Film City', type: 'Adventure', estimated_cost: 40, description: 'The world\'s largest integrated film city complex.' },
      { destination_id: hyderabad.destination_id, name: 'Paradise Biryani', type: 'Food', estimated_cost: 10, description: 'Taste the world-famous authentic Hyderabadi Biryani.' },
      { destination_id: hyderabad.destination_id, name: 'Hussain Sagar Lake', type: 'Relaxation', estimated_cost: 0, description: 'Heart-shaped lake with a large Buddha statue.' },
      { destination_id: hyderabad.destination_id, name: 'Salar Jung Museum', type: 'Heritage', estimated_cost: 5, description: 'One of the largest one-man collections of antiques.' },
    ]);

    // --- 8. UDAIPUR (Lakes & Palaces) ---
    const udaipur = await Destination.create({
      name: 'Udaipur',
      location: 'Rajasthan, India',
      description: 'The City of Lakes, known for its lavish royal residences.',
      seasonality: 'Winter'
    });

    await Activity.bulkCreate([
      { destination_id: udaipur.destination_id, name: 'City Palace', type: 'Heritage', estimated_cost: 10, description: 'A complex of small palaces built over 400 years.' },
      { destination_id: udaipur.destination_id, name: 'Lake Pichola Boat Ride', type: 'Relaxation', estimated_cost: 15, description: 'Scenic boat ride with views of Jag Mandir and Lake Palace.' },
      { destination_id: udaipur.destination_id, name: 'Jag Mandir', type: 'Heritage', estimated_cost: 5, description: 'An island palace on Lake Pichola.' },
      { destination_id: udaipur.destination_id, name: 'Saheliyon Ki Bari', type: 'Nature', estimated_cost: 2, description: 'Garden of the Maidens with fountains and marble elephants.' },
      { destination_id: udaipur.destination_id, name: 'Bagore Ki Haveli', type: 'Culture', estimated_cost: 5, description: 'Evening cultural show with folk dance and puppetry.' },
      { destination_id: udaipur.destination_id, name: 'Karni Mata Ropeway', type: 'Adventure', estimated_cost: 5, description: 'Cable car ride offering sunset views of the city.' },
    ]);

    // --- 9. DELHI (The Capital) ---
    const delhi = await Destination.create({
      name: 'Delhi',
      location: 'India',
      description: 'The capital city, a mix of ancient history and modernity.',
      seasonality: 'Winter, Spring'
    });

    await Activity.bulkCreate([
      { destination_id: delhi.destination_id, name: 'Red Fort', type: 'Heritage', estimated_cost: 5, description: 'Historic fort that served as the main residence of Mughal Emperors.' },
      { destination_id: delhi.destination_id, name: 'Qutub Minar', type: 'Heritage', estimated_cost: 5, description: 'The tallest brick minaret in the world.' },
      { destination_id: delhi.destination_id, name: 'India Gate', type: 'Heritage', estimated_cost: 0, description: 'A war memorial located astride the Rajpath.' },
      { destination_id: delhi.destination_id, name: 'Chandni Chowk Food Walk', type: 'Food', estimated_cost: 10, description: 'Famous for street food like Parathas and Chaat.' },
      { destination_id: delhi.destination_id, name: 'Lotus Temple', type: 'Relaxation', estimated_cost: 0, description: 'Baháʼí House of Worship notable for its flowerlike shape.' },
      { destination_id: delhi.destination_id, name: 'Humayun\'s Tomb', type: 'Heritage', estimated_cost: 5, description: 'The tomb of the Mughal Emperor Humayun.' },
      { destination_id: delhi.destination_id, name: 'Hauz Khas Village', type: 'Nightlife', estimated_cost: 30, description: 'Trendy complex with cafes, bars, and boutiques.' },
    ]);

    // --- 10. MUMBAI (City of Dreams) ---
    const mumbai = await Destination.create({
      name: 'Mumbai',
      location: 'Maharashtra, India',
      description: 'The financial powerhouse and home of Bollywood.',
      seasonality: 'All Year'
    });

    await Activity.bulkCreate([
      { destination_id: mumbai.destination_id, name: 'Gateway of India', type: 'Heritage', estimated_cost: 0, description: 'The iconic arch monument overlooking the Arabian Sea.' },
      { destination_id: mumbai.destination_id, name: 'Marine Drive', type: 'Relaxation', estimated_cost: 0, description: 'The Queen’s Necklace, perfect for evening strolls.' },
      { destination_id: mumbai.destination_id, name: 'Elephanta Caves', type: 'Heritage', estimated_cost: 10, description: 'Ancient rock-cut caves accessed by ferry.' },
      { destination_id: mumbai.destination_id, name: 'Juhu Beach Street Food', type: 'Food', estimated_cost: 10, description: 'Famous for Pav Bhaji and Vada Pav stalls.' },
      { destination_id: mumbai.destination_id, name: 'Colaba Causeway', type: 'Shopping', estimated_cost: 0, description: 'Street shopping for clothes, antiques, and jewelry.' },
      { destination_id: mumbai.destination_id, name: 'Siddhivinayak Temple', type: 'Heritage', estimated_cost: 0, description: 'One of the richest and most famous temples in India.' },
      { destination_id: mumbai.destination_id, name: 'Bollywood Film City Tour', type: 'Adventure', estimated_cost: 40, description: 'Behind the scenes of the Indian movie industry.' },
    ]);

    console.log('✅ MASSIVE Database seeded successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding:', error);
    process.exit(1);
  }
};

seedMassive();