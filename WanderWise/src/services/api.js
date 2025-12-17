// src/services/api.js

import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Automatically add the JWT Token to every request if it exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- API Functions ---

// Get all available preferences (Nature, Budget, etc.)
export const getPreferences = () => {
  return apiClient.get('/preferences');
};

// Save the user's selected preferences
export const saveUserPreferences = (userId, preferenceIds) => {
  return apiClient.post(`/users/${userId}/preferences`, { preferenceIds });
};

// --- Destinations ---
export const getDestinations = () => {
  return apiClient.get('/destinations');
};

// --- Itineraries ---
export const generateItinerary = (tripData) => {
  // tripData = { userId, destinationId, startDate, endDate, budget }
  return apiClient.post('/itineraries/generate', tripData);
};

// Fetch a specific itinerary by ID
export const getItinerary = (id) => {
  return apiClient.get(`/itineraries/trip/${id}`);
};

export const getPublicItineraries = () => {
  return apiClient.get('/itineraries/public');
};


export const getAdminStats = () => {
  return apiClient.get('/admin/stats');
};

export const getPopularDestinations = () => {
  return apiClient.get('/admin/destinations');
};

export const updateItineraryVisibility = (id, isPublic, note) => {
  return apiClient.put(`/itineraries/${id}/share`, { is_public: isPublic, public_note: note });
};


export const suggestDestinations = (preferences) => {
  return apiClient.post('/destinations/suggest', preferences);
};

export const getAllItinerariesAdmin = () => apiClient.get('/admin/all-trips');
export const seedDatabaseAdmin = () => apiClient.post('/admin/seed')

export const addCityAdmin = (cityData) => {
  return apiClient.post('/admin/add-city', cityData);
};

export const addReview = (itineraryId, reviewData) => {
  return apiClient.post(`/itineraries/${itineraryId}/reviews`, reviewData);
};

export const createTrip = (data) => apiClient.post('/trips/create', data);
export const getUserTrips = (userId) => apiClient.get(`/trips/user/${userId}`);
export const addTripMember = (tripId, email) => apiClient.post(`/trips/${tripId}/add-member`, { email });

export const addComment = (itineraryId, commentData) => {
  // reusing the review endpoint
  return apiClient.post(`/itineraries/${itineraryId}/reviews`, commentData);
};

export const addLike = (itineraryId) => apiClient.put(`/itineraries/${itineraryId}/like`);

export default apiClient;