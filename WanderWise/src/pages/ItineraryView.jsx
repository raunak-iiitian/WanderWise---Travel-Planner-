import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getItinerary, updateItineraryVisibility, addReview, createTrip } from '../services/api';
import '../styles/global.css';

const ItineraryView = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // --- 1. DETERMINE CONTEXT ---
  const userString = localStorage.getItem('user');
  const currentUser = userString ? JSON.parse(userString) : null;
  
  // "Active Trip" means we came from 'My Trips' page with trip details
  const activeTripData = location.state?.existingTrip; 
  
  // "Draft Mode" means I created it, but I haven't started it (no activeTripData passed)
  const [isOwner, setIsOwner] = useState(false);

  // --- STATE ---
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [cityForImages, setCityForImages] = useState('travel'); 

  // Interactive State
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareNote, setShareNote] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getItinerary(id);
        const data = response.data;
        setItinerary(data);
        
        // Determine if Owner
        if (currentUser && data.creator_user_id === currentUser.id) {
          setIsOwner(true);
        }

        if(data.SharedItineraryReviews) setReviews(data.SharedItineraryReviews);
        if(data.public_note) setShareNote(data.public_note);

        // Extract City
        let city = "India";
        if (data.title && data.title.includes(' to ')) {
          city = data.title.split(' to ')[1];
        }
        setCityForImages(city);
        setWeather({ temp: 28, condition: 'Sunny', icon: '☀️', city: city });

      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, [id]);

  // --- HANDLERS ---
  const handleStartTrip = async () => {
    const tripName = prompt("Name your Trip:", `Trip to ${itinerary.title}`);
    if(!tripName) return;
    try {
      await createTrip({
        userId: currentUser.id, itineraryId: id, tripName: tripName,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      });
      alert("Trip Started! Check 'My Trips'.");
      navigate('/my-trips');
    } catch (err) { alert("Failed to start."); }
  };

  const handleShareToggle = async () => {
    try {
      if (itinerary.is_public) {
        if(!window.confirm("Make private?")) return;
        await updateItineraryVisibility(id, false, null);
        setItinerary({ ...itinerary, is_public: false, public_note: null });
        alert("Trip is now Private.");
      } else {
        if (!shareNote.trim()) return alert("Write a note!");
        await updateItineraryVisibility(id, true, shareNote);
        setItinerary({ ...itinerary, is_public: true, public_note: shareNote });
        setShowShareModal(false);
        alert("Trip is now PUBLIC!");
      }
    } catch (err) { alert("Failed."); }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    const finalRating = rating === 0 ? 5 : rating; // Default 5 if just comment
    addReview(id, { userId: currentUser.id, rating: finalRating, comment: reviewText })
      .then(() => {
        setReviews([{ User: { full_name: currentUser.name }, rating: finalRating, comment: reviewText }, ...reviews]);
        setReviewText(''); setRating(0);
      })
      .catch(() => alert("Failed."));
  };

  const formatTime = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>Loading...</div>;
  if (!itinerary) return <div style={{textAlign:'center', marginTop:'50px'}}>Not Found.</div>;

  // --- DERIVED MODES ---
  const isDraftMode = isOwner && !activeTripData;
  const isActiveMode = activeTripData; // Coming from My Trips
  const isCommunityMode = !isOwner && !activeTripData;

  return (
    <div style={{maxWidth: '1000px', margin: '40px auto', padding: '0 20px'}}>
      
      {/* ================= HEADER SECTION ================= */}
      <div className="glass-card" style={{padding: '30px', marginBottom: '30px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{flex: 1}}>
          <h1 style={{color: 'var(--primary)', margin: '0 0 10px 0', fontSize: '2.5rem'}}>{itinerary.title}</h1>
          
          <div style={{display: 'flex', gap: '15px', color: 'var(--text-light)', fontSize: '1rem', alignItems:'center'}}>
            <span>💰 <strong>₹{itinerary.total_est_cost}</strong></span>
            <span>🌱 Score: <strong>{itinerary.carbon_footprint_score}</strong></span>
            
            {/* Show User Name only in Community Mode */}
            {isCommunityMode && (
              <span style={{fontSize:'0.9rem', background:'#f0f9ff', padding:'4px 10px', borderRadius:'10px', border:'1px solid #bae6fd'}}>
                👤 Created by {itinerary.User ? itinerary.User.full_name : 'Traveler'}
              </span>
            )}
          </div>
        </div>
        {weather && (
          <div style={{background: 'linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)', padding: '15px 25px', borderRadius: '16px', textAlign: 'center', minWidth: '120px'}}>
            <div style={{fontSize: '2.5rem'}}>{weather.icon}</div>
            <div style={{fontWeight: '800', color: '#006064', fontSize: '1.5rem'}}>{weather.temp}°C</div>
            <div style={{fontSize: '0.8rem', color: '#006064'}}>{weather.city}</div>
          </div>
        )}
      </div>

      {/* ================= DESCRIPTION (Community Mode Only) ================= */}
      {isCommunityMode && itinerary.public_note && (
        <div className="glass-card" style={{padding: '25px', marginBottom: '30px', borderLeft: '5px solid var(--secondary)', background:'rgba(255,255,255,0.8)'}}>
          <h3 style={{marginTop:0, color:'var(--text-main)', fontSize:'1.1rem'}}>📝 Experience Note</h3>
          <p style={{fontSize: '1rem', color: '#444', lineHeight: '1.6', fontStyle: 'italic', marginBottom:0}}>"{itinerary.public_note}"</p>
        </div>
      )}

      {/* ================= ACTION BAR ================= */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px'}}>
        <Link to={isActiveMode ? "/my-trips" : (isCommunityMode ? "/discover" : "/create")} style={{textDecoration: 'none', color: 'var(--text-light)', fontWeight: '600'}}>
          ← Back
        </Link>
        
        <div style={{display: 'flex', gap: '15px', alignItems:'center'}}>
          
          {/* MODE 1: DRAFT (Show Start Button) */}
          {isDraftMode && (
            <button className="btn-primary" style={{backgroundColor: '#8e44ad'}} onClick={handleStartTrip}>
              🚀 Start This Trip
            </button>
          )}

          {/* MODE 2: ACTIVE (Show Dates, Friends, Share) */}
          {isActiveMode && (
            <>
              <div style={{padding:'8px 15px', background:'#fff', borderRadius:'20px', border:'1px solid #ddd', fontSize:'0.9rem', color:'#555'}}>
                📅 {formatDate(activeTripData.start_date)} - {formatDate(activeTripData.end_date)}
              </div>
              <div style={{padding:'8px 15px', background:'#e0f7fa', borderRadius:'20px', color:'#006064', fontSize:'0.9rem', fontWeight:'bold'}}>
                👥 {activeTripData.TripMembers?.length || 1} Travelers
              </div>
              
              <div style={{position: 'relative'}}>
                <button 
                  className="btn-primary" 
                  style={{backgroundColor: itinerary.is_public ? 'transparent' : '#ff6b6b', color: itinerary.is_public ? '#555' : 'white', border: itinerary.is_public ? '1px solid #ccc' : 'none'}}
                  onClick={() => itinerary.is_public ? handleShareToggle() : setShowShareModal(true)}
                >
                  {itinerary.is_public ? '🔒 Make Private' : '🌍 Make Public'}
                </button>
                {/* Share Modal Popup */}
                {showShareModal && (
                  <div style={{position: 'absolute', top: '50px', right: 0, width: '300px', background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 15px 40px rgba(0,0,0,0.2)', zIndex: 100, border:'1px solid #ddd'}}>
                    <h4 style={{marginTop:0}}>Share Experience</h4>
                    <textarea rows="4" value={shareNote} onChange={e=>setShareNote(e.target.value)} placeholder="Write a note..." style={{width:'100%', padding:'10px', marginBottom:'10px', borderRadius:'8px', border:'1px solid #ddd', boxSizing:'border-box'}}/>
                    <div style={{display:'flex', gap:'10px'}}><button onClick={handleShareToggle} className="btn-primary" style={{flex:1}}>Post</button><button onClick={()=>setShowShareModal(false)} style={{flex:1, border:'none', background:'#eee', borderRadius:'50px', cursor:'pointer'}}>Cancel</button></div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* MODE 3: COMMUNITY (Clone Button) */}
          {isCommunityMode && (
            <button className="btn-primary" onClick={handleStartTrip}>
              ⚡ Steal this Plan
            </button>
          )}
        </div>
      </div>

      {/* ================= TIMELINE ================= */}
      <div style={{position: 'relative', paddingLeft: '40px', marginBottom: '60px'}}>
        <div style={{position: 'absolute', left: '14px', top: 0, bottom: 0, width: '2px', backgroundColor: '#e0e0e0'}}></div>
        {itinerary.ItineraryItems && itinerary.ItineraryItems.map((item, index) => (
          <motion.div key={item.item_id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} style={{marginBottom: '30px', position: 'relative'}}>
            <div style={{position: 'absolute', left: '-33px', top: '24px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--secondary)', border: '4px solid white', boxShadow: '0 0 0 2px var(--secondary)'}}></div>
            <div className="glass-card" style={{padding: '20px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                <span style={{fontWeight: '700', color: 'var(--primary)', fontSize: '0.9rem'}}>{formatTime(item.start_time)} - {formatTime(item.end_time)}</span>
                <span style={{backgroundColor: '#f1f2f6', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600', color: '#636e72'}}>{item.Activity?.type || 'Custom'}</span>
              </div>
              <h3 style={{margin: '5px 0', color: 'var(--text-main)', fontSize:'1.3rem'}}>{item.custom_title}</h3>
              <p style={{color: 'var(--text-light)', fontSize: '0.95rem', margin: '0 0 15px 0'}}>{item.Activity?.description}</p>
              <div style={{fontSize: '0.9rem', fontWeight: '600', color: '#2d3436'}}>Est. Cost: <span style={{color: '#27ae60'}}>₹{item.estimated_cost}</span></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ================= FOOTER CONTENT ================= */}
      
      {/* 1. DRAFT MODE: Show Visuals & Info (No Reviews) */}
      {isDraftMode && (
        <div style={{marginBottom: '60px'}}>
          <h2 style={{color: 'var(--primary)', textAlign: 'center', marginBottom: '30px'}}>Discover {cityForImages}</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '50px'}}>
            {[1, 2, 3].map((i) => (
              <motion.img key={i} src={`https://loremflickr.com/400/300/${cityForImages.toLowerCase().replace(' ', '')},travel?random=${i}`} style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '16px', boxShadow: 'var(--shadow)'}} whileHover={{scale: 1.05}} onError={(e) => {e.target.src = 'https://via.placeholder.com/400x300?text=Explore'}} />
            ))}
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px'}}>
            <div className="glass-card" style={{padding: '25px', textAlign: 'center'}}><div style={{fontSize: '2rem', marginBottom: '10px'}}>🧠</div><h3 style={{fontSize: '1.1rem', margin: '0 0 5px 0'}}>AI Powered</h3><p style={{fontSize: '0.9rem', color: '#666'}}>Curated based on your interests.</p></div>
            <div className="glass-card" style={{padding: '25px', textAlign: 'center'}}><div style={{fontSize: '2rem', marginBottom: '10px'}}>🌱</div><h3 style={{fontSize: '1.1rem', margin: '0 0 5px 0'}}>Eco Conscious</h3><p style={{fontSize: '0.9rem', color: '#666'}}>Calculated carbon scores.</p></div>
            <div className="glass-card" style={{padding: '25px', textAlign: 'center'}}><div style={{fontSize: '2rem', marginBottom: '10px'}}>👥</div><h3 style={{fontSize: '1.1rem', margin: '0 0 5px 0'}}>Community</h3><p style={{fontSize: '0.9rem', color: '#666'}}>Share with 10k+ travelers.</p></div>
          </div>
        </div>
      )}

      {/* 2. ACTIVE & COMMUNITY MODE: Show Reviews/Comments */}
      {(!isDraftMode) && (
        <div className="glass-card" style={{padding: '40px', marginBottom: '60px'}}>
          <h2 style={{color: 'var(--primary)', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '30px'}}>
            {isCommunityMode ? 'Community Discussion' : 'Rate Your Trip'}
          </h2>

          <form onSubmit={handleSubmitReview} style={{marginBottom: '40px', background: '#f8f9fa', padding: '25px', borderRadius: '16px', border:'1px solid #eee'}}>
            <div style={{marginBottom: '20px'}}>
              <label style={{display:'block', marginBottom:'8px', fontWeight:'600', color:'var(--text-light)'}}>Rating</label>
              <div style={{display:'flex', gap:'5px', cursor:'pointer'}}>
                {[1,2,3,4,5].map(star => <span key={star} style={{fontSize:'1.5rem', color: (hoverRating||rating)>=star?'#f59e0b':'#d1d5db'}} onClick={()=>setRating(star)} onMouseEnter={()=>setHoverRating(star)} onMouseLeave={()=>setHoverRating(0)}>★</span>)}
              </div>
            </div>
            <textarea value={reviewText} onChange={(e)=>setReviewText(e.target.value)} placeholder={isCommunityMode ? "Join the conversation..." : "How was your trip?"} style={{width:'100%', padding:'15px', borderRadius:'12px', border:'1px solid #ddd', minHeight:'100px', marginBottom:'15px', fontFamily:'inherit', boxSizing:'border-box'}} required/>
            <button type="submit" className="btn-primary">Post</button>
          </form>

          <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
            {reviews.length === 0 ? <p style={{color:'#999'}}>No comments yet.</p> : reviews.map((rev, i) => (
              <div key={i} style={{borderBottom: '1px solid #f0f0f0', paddingBottom: '20px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems:'center'}}>
                  <strong style={{color:'var(--text-main)', fontSize:'1.1rem'}}>{rev.User?.full_name || rev.user}</strong> 
                  <span style={{color: '#f59e0b'}}>{'★'.repeat(rev.rating)}</span>
                </div>
                <p style={{margin: '0', color: 'var(--text-light)', lineHeight:'1.5'}}>{rev.comment || rev.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ItineraryView;