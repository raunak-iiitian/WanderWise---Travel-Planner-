import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-wrapper">
      
      {/* Background Blobs */}
      <div className="aurora-blob blob-1"></div>
      <div className="aurora-blob blob-2"></div>
      <div className="aurora-blob blob-3"></div>

      {/* --- HERO SECTION --- */}
      <section className="hero-container">
        
        {/* Left: Text */}
        <motion.div 
          className="hero-text"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="hero-title">
            Travel India,<br /> <span>The Smart Way.</span>
          </h1>
          <p className="hero-subtitle">
            Experience the ultimate intelligent itinerary planner. 
            Curated domestic trips, real-time weather alerts, and budget tracking—all in one place.
          </p>
          <div className="hero-buttons">
            <Link to="/create" className="btn-primary btn-lg">Start Planning</Link>
            <Link to="/discover" className="btn-secondary">Community Feed</Link>
          </div>
        </motion.div>

        {/* Right: Floating 3D Card */}
        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="floating-card">
            {/* Mock Header */}
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px', alignItems:'center'}}>
              <div>
                <h3 style={{margin:0, color:'var(--primary)'}}>Trip to Kerala</h3>
                <span style={{fontSize:'0.8rem', color:'#666'}}>Dec 20 - Dec 25</span>
              </div>
              <div style={{background:'#d1fae5', color:'#065f46', padding:'5px 10px', borderRadius:'10px', fontSize:'0.8rem', fontWeight:'bold'}}>
                ₹24,500
              </div>
            </div>

            {/* Mock Items */}
            <div className="mock-row">
              <div className="mock-icon">🛶</div>
              <div>
                <h4 style={{margin:0}}>Alleppey Houseboat</h4>
                <p style={{margin:0, fontSize:'0.8rem', color:'#888'}}>10:00 AM • Backwaters</p>
              </div>
            </div>
            
            <div className="mock-row">
              <div className="mock-icon">🍵</div>
              <div>
                <h4 style={{margin:0}}>Munnar Tea Garden</h4>
                <p style={{margin:0, fontSize:'0.8rem', color:'#888'}}>02:00 PM • Tea Museum</p>
              </div>
            </div>

            <div className="mock-row" style={{border: 'none'}}>
              <div className="mock-icon">🍛</div>
              <div>
                <h4 style={{margin:0}}>Authentic Sadya</h4>
                <p style={{margin:0, fontSize:'0.8rem', color:'#888'}}>08:00 PM • Fort Kochi</p>
              </div>
            </div>

            {/* Floating Weather Badge */}
            <motion.div 
              style={{
                position:'absolute', bottom:'-20px', right:'-20px', 
                background:'#fff', padding:'15px', borderRadius:'15px',
                boxShadow:'0 10px 30px rgba(0,0,0,0.1)', display:'flex', gap:'10px', alignItems:'center'
              }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <span style={{fontSize:'1.5rem'}}>🌤️</span>
              <div>
                <div style={{fontWeight:'bold', color:'#333'}}>24°C</div>
                <div style={{fontSize:'0.8rem', color:'#888'}}>Pleasant</div>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="section" style={{marginTop: '0'}}>
        <div style={{textAlign:'center', marginBottom:'60px'}}>
          <motion.h2 
            className="section-title"
            style={{marginBottom: '10px'}}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Everything You Need
          </motion.h2>
          <p style={{color: 'var(--text-light)', fontSize: '1.1rem'}}>Built for the modern explorer.</p>
        </div>

        <div className="features-grid">
          <motion.div className="feature-box" whileHover={{ y: -5 }}>
            <div className="feature-icon">🧠</div>
            <h3>Intelligent Algorithm</h3>
            <p style={{color:'var(--text-light)', lineHeight:'1.6'}}>
              Our smart engine builds itineraries based on your budget, vibe, and live weather conditions.
            </p>
          </motion.div>

          <motion.div className="feature-box" whileHover={{ y: -5 }} transition={{delay: 0.1}}>
            <div className="feature-icon">🌦️</div>
            <h3>Live Weather Checks</h3>
            <p style={{color:'var(--text-light)', lineHeight:'1.6'}}>
              We integrate with OpenWeather API to ensure you never book a beach trip during a storm.
            </p>
          </motion.div>

          <motion.div className="feature-box" whileHover={{ y: -5 }} transition={{delay: 0.2}}>
            <div className="feature-icon">🤝</div>
            <h3>Community Sharing</h3>
            <p style={{color:'var(--text-light)', lineHeight:'1.6'}}>
              Share your trip experiences, read reviews, and clone itineraries from other travelers.
            </p>
          </motion.div>

          <motion.div className="feature-box" whileHover={{ y: -5 }} transition={{delay: 0.3}}>
            <div className="feature-icon">💰</div>
            <h3>Cost Estimation</h3>
            <p style={{color:'var(--text-light)', lineHeight:'1.6'}}>
              Real-time cost calculation in Rupees so you know exactly how much to save.
            </p>
          </motion.div>

          <motion.div className="feature-box" whileHover={{ y: -5 }} transition={{delay: 0.4}}>
            <div className="feature-icon">👥</div>
            <h3>Group Planning</h3>
            <p style={{color:'var(--text-light)', lineHeight:'1.6'}}>
              Start a trip, invite your friends via email, and manage your squad in one place.
            </p>
          </motion.div>

          <motion.div className="feature-box" whileHover={{ y: -5 }} transition={{delay: 0.5}}>
            <div className="feature-icon">🛡️</div>
            <h3>Secure & Private</h3>
            <p style={{color:'var(--text-light)', lineHeight:'1.6'}}>
              Your plans are private by default. You control what you share with the world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- CTA BOTTOM (Static / No Animation) --- */}
      <section className="cta-container">
        <div className="cta-box">
          <h2 style={{fontSize:'2.5rem', marginBottom:'20px', position:'relative', zIndex:2}}>Ready for your next adventure?</h2>
          <p style={{fontSize:'1.2rem', marginBottom:'40px', color:'#cbd5e1', position:'relative', zIndex:2}}>
            Join thousands of travelers planning their dream trips today.
          </p>
          <Link to="/create" className="btn-primary btn-lg" style={{position:'relative', zIndex:2}}>
            Get Started for Free
          </Link>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;