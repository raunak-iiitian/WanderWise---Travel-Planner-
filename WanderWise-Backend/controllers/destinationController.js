// wanderwise-backend/controllers/destinationController.js

const Destination = require('../models/Destination');
const Activity = require('../models/Activity');
const { Op } = require('sequelize');
const axios = require('axios');

// --- HELPER: Check Weather ---
const getWeatherForCity = async (cityName) => {
  try {
    const API_KEY = 'a5bdb825a369149d41a423e09e887fd6'; // <--- PASTE YOUR KEY HERE
    // If no key, return mock data so app doesn't crash
    if (API_KEY === 'a5bdb825a369149d41a423e09e887fd6') {
      return { temp: 25, condition: 'Sunny (Mock)', icon: '01d', isGood: true };
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${a5bdb825a369149d41a423e09e887fd6}&units=metric`;
    const response = await axios.get(url);
    
    const weather = response.data;
    const condition = weather.weather[0].main; // Rain, Clear, Clouds
    const temp = weather.main.temp;

    // Simple Logic: What is "Good" weather?
    // Not Raining + Not too cold (unless it's a snow destination)
    let isGood = true;
    if (condition === 'Rain' || condition === 'Thunderstorm') isGood = false;

    return {
      temp: Math.round(temp),
      condition: condition,
      icon: weather.weather[0].icon,
      isGood: isGood
    };
  } catch (error) {
    console.error(`Weather error for ${cityName}:`, error.message);
    return { temp: '--', condition: 'Unavailable', icon: '', isGood: true };
  }
};

exports.getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.findAll();
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// --- NEW: Suggestion Logic ---
exports.suggestDestinations = async (req, res) => {
  try {
    const { interests, month } = req.body; // e.g. ['Nature', 'Beach']

    // 1. Find Destinations matching Interest
    // We look for destinations that HAVE activities with these types
    const matchingDestinations = await Destination.findAll({
      include: [{
        model: Activity,
        where: { type: { [Op.in]: interests } },
        attributes: [] // We just need the existence of match
      }],
      group: ['Destination.destination_id'] // Group to avoid duplicates
    });

    // If no specific match, fallback to all destinations
    const candidates = matchingDestinations.length > 0 ? matchingDestinations : await Destination.findAll();

    // 2. Check Weather for each candidate
    const suggestions = await Promise.all(candidates.map(async (dest) => {
      const weather = await getWeatherForCity(dest.name);
      
      // Calculate a "Match Score"
      // (Real logic would count how many activities match, simpler here)
      const score = weather.isGood ? 100 : 50; 

      return {
        ...dest.toJSON(),
        weather: weather,
        matchScore: score
      };
    }));

    // 3. Sort: Good Weather first
    suggestions.sort((a, b) => b.matchScore - a.matchScore);

    res.json(suggestions);

  } catch (error) {
    console.error('Suggestion Error:', error);
    res.status(500).json({ message: 'Server error suggesting places' });
  }
};