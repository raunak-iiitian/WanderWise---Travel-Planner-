import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { suggestDestinations, generateItinerary } from '../services/api';
import '../styles/global.css';

const CreateItinerary = () => {
  const navigate = useNavigate();
  // Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];
  
  // --- STATE ---
  const [step, setStep] = useState(1); // 1 = Preferences, 2 = Select City
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  
  // Form Data
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    budget: 'Medium',
    interests: []
  });

  const interestOptions = [
    { name: 'Nature', icon: '🌲' },
    { name: 'Adventure', icon: '🧗' },
    { name: 'Heritage', icon: '🏰' },
    { name: 'Food', icon: '🍜' },
    { name: 'Relaxation', icon: '🧘' },
    { name: 'Shopping', icon: '🛍️' },
    { name: 'Nightlife', icon: '🎉' },
    { name: 'Culture', icon: '🎨' }
  ];

  // --- HANDLERS ---
  
  const toggleInterest = (name) => {
    setFormData(prev => {
      const exists = prev.interests.includes(name);
      return {
        ...prev,
        interests: exists 
          ? prev.interests.filter(i => i !== name)
          : [...prev.interests, name]
      };
    });
  };

  const handleFindDestinations = async (e) => {
    e.preventDefault();
    if (formData.interests.length === 0) return alert("Please select at least one vibe!");
    
    setLoading(true);
    try {
      // Call our new "Smart Suggestion" Endpoint
      const response = await suggestDestinations({ 
        interests: formData.interests 
      });
      setSuggestions(response.data);
      setStep(2); // Move to Step 2
    } catch (err) {
      console.error(err);
      alert("Failed to find places.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCity = async (destinationId) => {
    setLoading(true);
    const userString = localStorage.getItem('user');
    if (!userString) return navigate('/auth');
    const user = JSON.parse(userString);

    try {
      // Generate Itinerary for the selected city
      const payload = {
        userId: user.id,
        destinationId: destinationId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: formData.budget,
        interests: formData.interests
      };

      const response = await generateItinerary(payload);
      navigate(`/itinerary/${response.data.itineraryId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to generate plan.");
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight: '100vh', padding: '40px 20px', maxWidth: '1000px', margin: '0 auto'}}>
      
      {/* HEADER */}
      <div style={{textAlign: 'center', marginBottom: '40px'}}>
        <h1 style={{color: 'var(--primary)', fontSize: '2.5rem', marginBottom: '10px'}}>
          {step === 1 ? "What's your Vibe?" : "Perfect Matches Found"}
        </h1>
        <p style={{color: 'var(--text-light)', fontSize: '1.1rem'}}>
          {step === 1 ? "Tell us what you love, and we'll find the perfect weather & destination." : "Select a destination to generate your detailed itinerary."}
        </p>
      </div>

      {/* --- STEP 1: PREFERENCES FORM --- */}
      {step === 1 && (
        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="glass-card" style={{padding: '40px', maxWidth: '800px', margin: '0 auto'}}>
          <form onSubmit={handleFindDestinations}>
            
           {/* Dates Row */}
<div style={{display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap'}}>
  
  <div style={{flex: 1, minWidth: '200px'}}>
    <label style={{fontWeight: '600', marginBottom: '8px', display: 'block'}}>Start Date</label>
    <input 
      type="date" 
      required 
      min={today} // <--- 1. Cannot pick past dates
      value={formData.startDate} 
      onChange={e => {
        // When start date changes, reset end date if it's now invalid
        if (formData.endDate && e.target.value > formData.endDate) {
          setFormData({...formData, startDate: e.target.value, endDate: ''});
        } else {
          setFormData({...formData, startDate: e.target.value});
        }
      }}
      style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd'}}
    />
  </div>

  <div style={{flex: 1, minWidth: '200px'}}>
    <label style={{fontWeight: '600', marginBottom: '8px', display: 'block'}}>End Date</label>
    <input 
      type="date" 
      required 
      min={formData.startDate || today} 
      value={formData.endDate} 
      onChange={e => setFormData({...formData, endDate: e.target.value})} 
      disabled={!formData.startDate} 
      style={{
        width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd',
        backgroundColor: !formData.startDate ? '#f5f5f5' : 'white'
      }}
    />
  </div>

  <div style={{flex: 1, minWidth: '200px'}}>
    <label style={{fontWeight: '600', marginBottom: '8px', display: 'block'}}>Budget</label>
    <select value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd'}}>
      <option value="Low">Low (Budget)</option>
      <option value="Medium">Medium (Balanced)</option>
      <option value="High">High (Luxury)</option>
    </select>
  </div>
</div>

            {/* Interests Grid */}
            <div style={{marginBottom: '40px'}}>
              <label style={{fontWeight: '600', marginBottom: '15px', display: 'block', fontSize: '1.1rem'}}>Pick your Interests</label>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px'}}>
                {interestOptions.map(opt => {
                  const active = formData.interests.includes(opt.name);
                  return (
                    <div 
                      key={opt.name}
                      onClick={() => toggleInterest(opt.name)}
                      style={{
                        padding: '15px', borderRadius: '15px', cursor: 'pointer', textAlign: 'center',
                        border: active ? '2px solid var(--primary)' : '1px solid #ddd',
                        background: active ? '#eff6ff' : 'white',
                        color: active ? 'var(--primary)' : '#555',
                        fontWeight: active ? '700' : '500',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{fontSize: '1.5rem', marginBottom: '5px'}}>{opt.icon}</div>
                      {opt.name}
                    </div>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{width: '100%', fontSize: '1.2rem'}} disabled={loading}>
              {loading ? 'Analyzing Weather...' : 'Find Best Places 🌍'}
            </button>
          </form>
        </motion.div>
      )}

      {/* --- STEP 2: SUGGESTIONS GRID --- */}
      {step === 2 && (
        <div>
          <button onClick={() => setStep(1)} style={{background: 'none', border: 'none', color: '#666', cursor: 'pointer', marginBottom: '20px', fontSize: '1rem'}}>
            ← Change Preferences
          </button>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px'}}>
            {suggestions.map((city, idx) => (
              <motion.div
                key={city.destination_id}
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: idx * 0.1}}
                className="glass-card"
                style={{overflow: 'hidden', padding: '0', position: 'relative'}}
              >
                {/* Weather Badge */}
                <div style={{
                  position: 'absolute', top: '15px', right: '15px', zIndex: 10,
                  background: city.weather.isGood ? '#d1fae5' : '#fee2e2',
                  color: city.weather.isGood ? '#065f46' : '#991b1b',
                  padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem',
                  display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}>
                  <span>{city.weather.isGood ? '☀️ Great Weather' : '🌧️ Rain Alert'}</span>
                </div>

                {/* City Image */}
                <div style={{height: '200px', background: '#eee'}}>
                  <img 
                    src={`https://loremflickr.com/600/400/${city.name.toLowerCase()},travel`} 
                    alt={city.name}
                    style={{width: '100%', height: '100%', objectFit: 'cover'}} 
                  />
                </div>

                {/* Content */}
                <div style={{padding: '20px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                    <h2 style={{margin: 0, color: 'var(--text-main)'}}>{city.name}</h2>
                    <div style={{textAlign: 'right'}}>
                      <div style={{fontSize: '1.2rem', fontWeight: 'bold'}}>{city.weather.temp}°C</div>
                      <div style={{fontSize: '0.8rem', color: '#666'}}>{city.weather.condition}</div>
                    </div>
                  </div>
                  
                  <p style={{color: 'var(--text-light)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '20px'}}>
                    {city.description}
                  </p>

                  <button 
                    onClick={() => handleSelectCity(city.destination_id)} 
                    className="btn-primary" 
                    style={{width: '100%'}}
                    disabled={loading}
                  >
                    {loading ? 'Creating Plan...' : `Plan Trip to ${city.name} →`}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateItinerary;