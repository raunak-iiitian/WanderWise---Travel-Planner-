import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserTrips, addTripMember } from '../services/api';
import '../styles/global.css';

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      getUserTrips(user.id).then(res => setTrips(res.data));
    }
  }, []);

  const handleAddMember = async (e, tripId) => {
    e.stopPropagation();
    const email = prompt("Enter friend's email to invite:");
    if(!email) return;
    try {
      await addTripMember(tripId, email);
      alert("Member added!");
      window.location.reload(); 
    } catch(err) { alert("User not found or error adding."); }
  };

  // Helper to format dates nicely (e.g. "Dec 01, 2025")
  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div style={{maxWidth: '900px', margin: '40px auto', padding: '0 20px'}}>
      <h1 style={{color: 'var(--primary)', marginBottom: '30px'}}>My Active Trips</h1>
      
      {trips.length === 0 ? (
        <div style={{textAlign: 'center', marginTop: '50px'}}>
          <p style={{color: '#666', fontSize: '1.2rem'}}>No active trips.</p>
          <button className="btn-primary" onClick={() => navigate('/create')}>Plan a Trip Now</button>
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          {trips.map(trip => (
            <div 
              key={trip.trip_id} 
              className="glass-card" 
              style={{padding: '25px', cursor: 'pointer', transition: 'transform 0.2s'}}
              onClick={() => navigate(`/itinerary/${trip.itinerary_id}`, { state: { existingTrip: trip } })}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div>
                  <h2 style={{margin: '0 0 5px 0', color: 'var(--text-main)'}}>
                    {trip.trip_name}
                  </h2>
                  <p style={{color: 'var(--text-light)', fontSize: '0.9rem', margin: 0}}>
                    {trip.Itinerary ? `Based on: ${trip.Itinerary.title}` : 'Custom Plan'}
                  </p>
                  
                  {/* --- NEW: DATE DISPLAY --- */}
                  <div style={{marginTop: '10px', display: 'flex', gap: '15px', alignItems: 'center'}}>
                    <span style={{background: '#e0f2fe', color: '#0284c7', padding: '5px 12px', borderRadius: '15px', fontSize: '0.85rem', fontWeight: '600'}}>
                      📅 {formatDate(trip.start_date)} — {formatDate(trip.end_date)}
                    </span>
                    <span style={{color: '#10b981', fontWeight: 'bold', fontSize: '0.9rem'}}>
                      {trip.Itinerary ? `₹${trip.Itinerary.total_est_cost}` : ''}
                    </span>
                  </div>

                </div>
                
                <button 
                  className="btn-primary" 
                  style={{fontSize: '0.8rem', padding: '8px 15px', zIndex: 10}} 
                  onClick={(e) => handleAddMember(e, trip.trip_id)}
                >
                  + Add Friend
                </button>
              </div>

              {/* Members Section */}
              <div style={{marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px'}}>
                <h4 style={{margin: '0 0 10px 0', fontSize: '0.85rem', color: '#888', textTransform: 'uppercase'}}>Group Members</h4>
                <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                  {trip.TripMembers && trip.TripMembers.map(member => (
                    <div key={member.user_id} style={{
                      background: '#f3f4f6', color: '#374151', padding: '5px 12px', 
                      borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold',
                      display: 'flex', alignItems: 'center', gap: '5px'
                    }}>
                      <span>👤</span> {member.User ? member.User.full_name : 'User'}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTrips;