import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getPublicItineraries, addComment, addLike } from '../services/api';
import '../styles/global.css';

const Discover = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [commentText, setCommentText] = useState('');
  
  // Track which posts the user liked in this session (Visual Only)
  const [likedPosts, setLikedPosts] = useState(new Set());

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const response = await getPublicItineraries();
      setTrips(response.data);
    } catch (error) {
      console.error("Failed to fetch feed", error);
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLE LIKE ---
  const handleLike = async (itineraryId) => {
    if (likedPosts.has(itineraryId)) return; // Prevent spamming likes

    // 1. Optimistic Update (Update UI instantly)
    setTrips(prevTrips => prevTrips.map(t => 
      t.itinerary_id === itineraryId ? { ...t, likes: (t.likes || 0) + 1 } : t
    ));
    setLikedPosts(prev => new Set(prev).add(itineraryId));

    // 2. Call API in background
    try {
      await addLike(itineraryId);
    } catch (err) {
      console.error("Like failed");
    }
  };

  // --- HANDLE COMMENT ---
  const handlePostComment = async (itineraryId) => {
    if (!commentText.trim()) return;
    
    const userString = localStorage.getItem('user');
    if (!userString) return alert("Please login to comment.");
    const user = JSON.parse(userString);

    // 1. Optimistic Update (Show comment instantly)
    const newCommentObj = {
      review_id: Date.now(), // Temp ID
      comment: commentText,
      User: { full_name: user.name }
    };

    setTrips(prevTrips => prevTrips.map(t => 
      t.itinerary_id === itineraryId 
        ? { ...t, SharedItineraryReviews: [...(t.SharedItineraryReviews || []), newCommentObj] } 
        : t
    ));

    setCommentText('');

    // 2. Call API
    try {
      await addComment(itineraryId, { userId: user.id, comment: commentText, rating: 5 });
      // Ideally we re-fetch here to get the real ID, but for UI flow it's fine
    } catch (err) {
      alert("Failed to post comment.");
    }
  };

  const toggleComments = (id) => {
    setActiveCommentId(activeCommentId === id ? null : id);
  };

  if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Loading Community Feed...</div>;

  return (
    <div style={{maxWidth: '800px', margin: '40px auto', padding: '0 20px'}}>
      
      <div style={{textAlign: 'center', marginBottom: '40px'}}>
        <h1 style={{color: 'var(--primary)', fontSize: '2.2rem', marginBottom: '5px'}}>Community Feed</h1>
        <p style={{color: 'var(--text-light)'}}>Stories & Trips from travelers like you.</p>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '40px'}}>
        {trips.map((trip, index) => {
          const userName = trip.User ? trip.User.full_name : 'WanderWise Traveler';
          const comments = trip.SharedItineraryReviews || [];
          const isLiked = likedPosts.has(trip.itinerary_id);

          return (
            <motion.div
              key={trip.itinerary_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card"
              style={{overflow: 'hidden', padding: '0', border: '1px solid rgba(255,255,255,0.6)'}}
            >
              {/* HEADER */}
              <div style={{padding: '15px 20px', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.5)'}}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%', 
                  background: 'linear-gradient(135deg, var(--secondary), var(--primary))', 
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold', marginRight: '12px'
                }}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{fontWeight: '700', color: 'var(--text-main)'}}>{userName}</div>
                  <div style={{fontSize: '0.8rem', color: 'var(--text-light)'}}>
                    Shared a trip to <strong>{trip.title.replace('My Trip to ', '').replace(/My .* Trip to /, '')}</strong>
                  </div>
                </div>
              </div>

              {/* NOTE */}
              {trip.public_note && (
                <div style={{padding: '0 20px 15px 20px', fontSize: '1rem', color: '#444', lineHeight: '1.5'}}>
                  {trip.public_note}
                </div>
              )}

              {/* IMAGE */}
              <Link to={`/itinerary/${trip.itinerary_id}`} style={{display: 'block', position: 'relative', height: '300px'}}>
                <img 
                  src={`https://loremflickr.com/800/500/travel,landmark?random=${trip.itinerary_id}`} 
                  alt={trip.title}
                  style={{width: '100%', height: '100%', objectFit: 'cover'}}
                />
              </Link>

              {/* ACTIONS */}
              <div style={{padding: '15px 20px', background: '#fff'}}>
                <div style={{display: 'flex', gap: '20px', marginBottom: '15px'}}>
                  
                  {/* LIKE BUTTON */}
                  <button 
                    onClick={() => handleLike(trip.itinerary_id)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer', 
                      fontSize: '0.95rem', color: isLiked ? '#e11d48' : '#555', 
                      display:'flex', alignItems:'center', gap:'5px', transition: 'transform 0.1s'
                    }}
                    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
                    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {isLiked ? '❤️' : '🤍'} <strong>{trip.likes || 0}</strong> Likes
                  </button>

                  {/* COMMENT BUTTON */}
                  <button 
                    onClick={() => toggleComments(trip.itinerary_id)}
                    style={{background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.95rem', color: '#555'}}
                  >
                    💬 <strong>{comments.length}</strong> Comments
                  </button>
                </div>

                {/* COMMENT SECTION */}
                <AnimatePresence>
                  {activeCommentId === trip.itinerary_id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{overflow: 'hidden'}}>
                      <div style={{background: '#f8fafc', padding: '15px', borderRadius: '12px', marginBottom: '10px'}}>
                        
                        {comments.length > 0 ? (
                          <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px', maxHeight: '200px', overflowY: 'auto'}}>
                            {comments.map((c, i) => (
                              <div key={i} style={{fontSize: '0.9rem'}}>
                                <strong style={{marginRight: '5px'}}>{c.User ? c.User.full_name : 'User'}:</strong>
                                {c.comment}
                              </div>
                            ))}
                          </div>
                        ) : <p style={{fontSize: '0.85rem', color: '#999', marginBottom: '15px'}}>No comments yet.</p>}

                        <div style={{display: 'flex', gap: '10px'}}>
                          <input type="text" placeholder="Add a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} style={{flex: 1, padding: '8px 12px', borderRadius: '20px', border: '1px solid #ddd', fontSize: '0.9rem'}} />
                          <button onClick={() => handlePostComment(trip.itinerary_id)} style={{background: 'var(--primary)', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold'}}>Post</button>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Discover;