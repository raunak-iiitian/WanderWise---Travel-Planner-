import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAdminStats, getAllItinerariesAdmin, addCityAdmin, getDestinations } from '../services/api';
import '../styles/global.css';


import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  
  const [stats, setStats] = useState({ totalUsers: 0, totalTrips: 0, avgCost: 0, totalDestinations: 0 });
  const [allTrips, setAllTrips] = useState([]);
  const [allCities, setAllCities] = useState([]); 
  
  
  const [cityForm, setCityForm] = useState({ 
    name: '', location: '', description: '', seasonality: '',
    activities: [{ name: '', type: 'Sightseeing', estimated_cost: '', description: '' }] 
  });
  const [submitting, setSubmitting] = useState(false);

  
  const inputStyle = {
    width: '100%', 
    padding: '12px', 
    borderRadius: '8px', 
    border: '1px solid #ddd',
    boxSizing: 'border-box', 
    fontSize: '0.95rem'
  };

  // --- HANDLERS (Same as before) ---
  const handleActivityChange = (index, field, value) => {
    const newActivities = [...cityForm.activities];
    newActivities[index][field] = value;
    setCityForm({ ...cityForm, activities: newActivities });
  };

  const addActivityRow = () => {
    setCityForm({
      ...cityForm,
      activities: [...cityForm.activities, { name: '', type: 'Sightseeing', estimated_cost: '', description: '' }]
    });
  };

  const removeActivityRow = (index) => {
    if (cityForm.activities.length === 1) return; 
    const newActivities = cityForm.activities.filter((_, i) => i !== index);
    setCityForm({ ...cityForm, activities: newActivities });
  };

  // --- INITIAL LOAD ---
  useEffect(() => {
    const checkAuth = () => {
      const userString = localStorage.getItem('user');
      if (!userString) return navigate('/auth');
      const user = JSON.parse(userString);
      if (user.role !== 'ADMIN') {
        alert("⛔ ACCESS DENIED");
        navigate('/');
      }
    };
    checkAuth();
    fetchData();
    setLoading(false);
    const interval = setInterval(() => { fetchStatsOnly(); }, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  const fetchData = async () => {
    try {
      await fetchStatsOnly();
      const tripsRes = await getAllItinerariesAdmin();
      setAllTrips(tripsRes.data);
      const citiesRes = await getDestinations();
      setAllCities(citiesRes.data);
    } catch (error) { console.error("Admin Load Error", error); }
  };

  const fetchStatsOnly = async () => {
    try {
      const statsRes = await getAdminStats();
      setStats(statsRes.data);
    } catch (err) { console.error("Stats fail", err); }
  };

  const handleAddCity = async (e) => {
    e.preventDefault();
    if(!cityForm.name || !cityForm.location) return alert("City Name required");
    setSubmitting(true);
    try {
      const res = await addCityAdmin(cityForm);
      alert(res.data.message);
      setCityForm({ 
        name: '', location: '', description: '', seasonality: '',
        activities: [{ name: '', type: 'Sightseeing', estimated_cost: '', description: '' }]
      });
      fetchData(); 
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add data.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>Loading Panel...</div>;

  return (
    <div style={{maxWidth: '1200px', margin: '40px auto', padding: '0 20px'}}>
      
      {/* Header */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px'}}>
        <div>
          <h1 style={{color: 'var(--primary)', margin: 0}}>Admin Dashboard</h1>
          <p style={{color: 'var(--text-light)'}}>System Overview & Management</p>
        </div>
        <div style={{background: '#e0f2fe', color: '#0284c7', padding: '8px 16px', borderRadius: '30px', fontWeight: 'bold', fontSize: '0.9rem'}}>
          🛡️ Super Admin
        </div>
      </div>

      {/* --- STATS ROW --- */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px'}}>
        <div className="glass-card" style={{padding: '25px', textAlign: 'center'}}>
          <div style={{fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)', lineHeight: 1}}>{stats.totalUsers}</div>
          <div style={{color: 'var(--text-light)', fontWeight: '600', marginTop: '5px'}}>Users</div>
        </div>
        <div className="glass-card" style={{padding: '25px', textAlign: 'center'}}>
          <div style={{fontSize: '2.5rem', fontWeight: '800', color: 'var(--secondary)', lineHeight: 1}}>{stats.totalTrips}</div>
          <div style={{color: 'var(--text-light)', fontWeight: '600', marginTop: '5px'}}>Trips</div>
        </div>
        <div className="glass-card" style={{padding: '25px', textAlign: 'center'}}>
          <div style={{fontSize: '2.5rem', fontWeight: '800', color: '#8b5cf6', lineHeight: 1}}>{stats.totalDestinations}</div>
          <div style={{color: 'var(--text-light)', fontWeight: '600', marginTop: '5px'}}>Cities</div>
        </div>
        <div className="glass-card" style={{padding: '25px', textAlign: 'center'}}>
          <div style={{fontSize: '2.5rem', fontWeight: '800', color: '#10b981', lineHeight: 1}}>₹{stats.avgCost}</div>
          <div style={{color: 'var(--text-light)', fontWeight: '600', marginTop: '5px'}}>Avg. Cost</div>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start'}}>
        
        {/* --- LEFT: ADD CITY FORM --- */}
        <div className="glass-card" style={{padding: '30px'}}>
          <h3 style={{color: 'var(--text-main)', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #eee'}}>Add New Destination</h3>
          
          <form onSubmit={handleAddCity}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px'}}>
              <input type="text" placeholder="City Name" required 
                value={cityForm.name} onChange={e => setCityForm({...cityForm, name: e.target.value})} 
                style={inputStyle}
              />
              <input type="text" placeholder="State/Country" required 
                value={cityForm.location} onChange={e => setCityForm({...cityForm, location: e.target.value})}
                style={inputStyle}
              />
            </div>

            <div style={{marginBottom: '15px'}}>
              <input type="text" placeholder="Seasonality (e.g. Winter)" 
                value={cityForm.seasonality} onChange={e => setCityForm({...cityForm, seasonality: e.target.value})}
                style={inputStyle}
              />
            </div>
            
            <textarea placeholder="Description..." rows="2" style={{...inputStyle, fontFamily: 'inherit', marginBottom: '20px'}}
              value={cityForm.description} onChange={e => setCityForm({...cityForm, description: e.target.value})}
            />

            <h4 style={{color: 'var(--primary)', margin: '0 0 10px 0'}}>Activities</h4>
            <div style={{background: '#f8fafc', padding: '15px', borderRadius: '12px', maxHeight: '300px', overflowY: 'auto', marginBottom: '20px', border: '1px solid #e2e8f0'}}>
              <AnimatePresence>
                {cityForm.activities.map((act, idx) => (
                  <motion.div 
                    key={idx} initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}}
                    style={{marginBottom: '15px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px'}}
                  >
                    <div style={{display: 'flex', gap: '10px', marginBottom: '8px'}}>
                      <input type="text" placeholder="Activity Name" style={{...inputStyle, flex: 2}} required
                        value={act.name} onChange={e => handleActivityChange(idx, 'name', e.target.value)} />
                      <select style={{...inputStyle, flex: 1}} value={act.type} onChange={e => handleActivityChange(idx, 'type', e.target.value)}>
                        <option>Sightseeing</option><option>Adventure</option><option>Food</option><option>Heritage</option><option>Shopping</option>
                      </select>
                    </div>
                    <div style={{display: 'flex', gap: '10px'}}>
                      <input type="number" placeholder="Cost (₹)" style={{...inputStyle, flex: 1}} 
                        value={act.estimated_cost} onChange={e => handleActivityChange(idx, 'estimated_cost', e.target.value)} />
                      {cityForm.activities.length > 1 && (
                        <button type="button" onClick={() => removeActivityRow(idx)} style={{background:'#fee2e2', border:'none', borderRadius:'8px', padding: '0 15px', cursor: 'pointer'}}>❌</button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <button type="button" onClick={addActivityRow} style={{width:'100%', padding:'10px', border:'2px dashed #cbd5e1', background:'none', color:'#64748b', cursor:'pointer', borderRadius:'8px', fontWeight:'600'}}>
                + Add Another Activity
              </button>
            </div>

            <button disabled={submitting} type="submit" className="btn-primary" style={{width: '100%'}}>
              {submitting ? 'Adding...' : '🚀 Save to Database'}
            </button>
          </form>
        </div>

        {/* --- RIGHT: DATA TABLES --- */}
        <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
          
          {/* CITIES LIST */}
          <div className="glass-card" style={{padding: '20px', maxHeight: '350px', overflowY: 'auto'}}>
            <h3 style={{color: 'var(--text-main)', marginBottom: '15px', fontSize: '1.1rem'}}>Database Cities</h3>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead style={{position: 'sticky', top: 0, background: 'rgba(255,255,255,0.95)'}}>
                <tr style={{textAlign: 'left', color: 'var(--text-light)', fontSize: '0.85rem'}}>
                  <th style={{padding: '10px'}}>Name</th>
                  <th style={{padding: '10px'}}>Location</th>
                </tr>
              </thead>
              <tbody>
                {allCities.map(city => (
                  <tr key={city.destination_id} style={{borderBottom: '1px solid #f9f9f9'}}>
                    <td style={{padding: '10px', fontWeight: '600'}}>{city.name}</td>
                    <td style={{padding: '10px', fontSize: '0.9rem'}}>{city.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TRIPS LIST */}
          <div className="glass-card" style={{padding: '20px', maxHeight: '350px', overflowY: 'auto'}}>
            <h3 style={{color: 'var(--text-main)', marginBottom: '15px', fontSize: '1.1rem'}}>User Itineraries</h3>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{textAlign: 'left', color: 'var(--text-light)', fontSize: '0.85rem'}}>
                  <th style={{padding: '10px'}}>Title</th>
                  <th style={{padding: '10px'}}>Cost</th>
                </tr>
              </thead>
              <tbody>
                {allTrips.map(trip => (
                  <tr key={trip.itinerary_id} style={{borderBottom: '1px solid #f9f9f9'}}>
                    <td style={{padding: '10px', fontWeight: '600', fontSize: '0.9rem'}}>{trip.title}</td>
                    <td style={{padding: '10px', color: '#10b981'}}>₹{trip.total_est_cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;