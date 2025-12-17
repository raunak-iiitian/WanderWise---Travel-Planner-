// src/components/common/Navbar.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Inside src/components/common/Navbar.jsx
const styles = {
  navbar: {
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: '15px 40px', 
    // Ultra-modern glass navbar
    backgroundColor: 'rgba(255, 255, 255, 0.7)', 
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
    position: 'sticky', 
    top: 0, 
    zIndex: 1000
  },
  // ... rest of styles
  logo: { 
    fontSize: '1.6rem', fontWeight: '800', color: '#0047ab', textDecoration: 'none', 
    display: 'flex', alignItems: 'center', gap: '8px'
  },
  navLinks: { display: 'flex', gap: '30px', alignItems: 'center' },
  link: { textDecoration: 'none', color: '#555', fontWeight: '500', fontSize: '0.95rem', transition: 'color 0.2s' },
  activeLink: { color: '#0047ab', fontWeight: '700' },
  btn: { 
    padding: '10px 24px', borderRadius: '50px', backgroundColor: '#0047ab', color: '#fff', 
    textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600', 
    boxShadow: '0 4px 12px rgba(0, 71, 171, 0.25)'
  },
  // Profile Styles
  profileContainer: { position: 'relative' }, // Needed for absolute dropdown
  profileCircle: { 
    width: '40px', height: '40px', borderRadius: '50%', 
    background: 'linear-gradient(135deg, #00e5ff, #0047ab)', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', 
    fontWeight: 'bold', color: '#fff', cursor: 'pointer', fontSize: '1.1rem',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)', userSelect: 'none'
  },
  dropdown: {
    position: 'absolute',
    top: '50px',
    right: '0',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.15)',
    padding: '10px',
    width: '180px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    border: '1px solid #eee'
  },
  dropdownItem: {
    padding: '10px 15px',
    textDecoration: 'none',
    color: '#333',
    fontSize: '0.9rem',
    borderRadius: '8px',
    transition: 'background 0.2s',
    cursor: 'pointer',
    display: 'block'
  },
  dropdownItemHover: { backgroundColor: '#f4f7f6' } // Logic handled inline
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Ref to detect clicks outside dropdown
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    else setUser(null);
    
    // Close dropdown when route changes
    setShowDropdown(false);
  }, [location]);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowDropdown(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? styles.activeLink : {};

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.logo}><span>🌍</span> WanderWise.</Link>
      
      <div style={styles.navLinks}>
        {user && user.role === 'ADMIN' && (
  <Link to="/admin" style={{...styles.link, color: '#d63031', fontWeight: 'bold'}}>
    Admin Panel
  </Link>
)}
        <Link to="/discover" style={{...styles.link, ...isActive('/discover')}}>Community</Link>
        {user && <Link to="/my-trips" style={{...styles.link, ...isActive('/my-trips')}}>My Trips</Link>}
        <Link to="/create" style={{...styles.link, ...isActive('/create')}}>Plan Trip</Link>
        
        {user ? (
          <div style={styles.profileContainer} ref={dropdownRef}>
            {/* Profile Circle - Toggles Dropdown */}
            <div onClick={() => setShowDropdown(!showDropdown)} style={styles.profileCircle}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div style={styles.dropdown}>
                <div style={{padding: '5px 15px', fontSize: '0.8rem', color: '#888', borderBottom: '1px solid #eee', marginBottom: '5px'}}>
                  Signed in as <br/><strong>{user.name}</strong>
                </div>
                
                <Link to="/account" style={styles.dropdownItem} onMouseEnter={e => e.target.style.background = '#f4f7f6'} onMouseLeave={e => e.target.style.background = 'transparent'}>
                  ⚙️ Settings
                </Link>
                
                <div onClick={handleLogout} style={{...styles.dropdownItem, color: '#d63031'}} onMouseEnter={e => e.target.style.background = '#ffebee'} onMouseLeave={e => e.target.style.background = 'transparent'}>
                  🚪 Logout
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/auth" style={styles.btn}>Login / Sign Up</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;