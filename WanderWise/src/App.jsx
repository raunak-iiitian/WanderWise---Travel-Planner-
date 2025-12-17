// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import your components
import Navbar from './components/common/Navbar';
import LandingPage from './pages/LandingPage';
import PreferenceSelector from './components/user/PreferenceSelector';
import CreateItinerary from './pages/CreateItinerary';
import ItineraryView from './pages/ItineraryView';
import Discover from './pages/Discover';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage'; // <--- Import AuthPage
import AccountSettings from './pages/AccountSettings';
import MyTrips from './pages/MyTrips';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/create" element={<CreateItinerary />} />
        <Route path="/preferences" element={<PreferenceSelector />} />
        <Route path="/itinerary/:id" element={<ItineraryView />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* NEW ROUTES */}
        <Route path="/account" element={<AccountSettings />} />
        <Route path="/my-trips" element={<MyTrips />} />
      </Routes>
    </div>
  );
}
export default App;