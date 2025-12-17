import React, { useState, useEffect } from 'react';
import '../styles/global.css'; 

const AccountSettings = () => {
  const [user, setUser] = useState({ name: '', email: '', role: '' });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }} className="glass-card">
      <h2 style={{color: 'var(--primary)', marginBottom: '20px'}}>Account Settings</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{display: 'block', color: 'var(--text-light)', marginBottom: '5px'}}>Full Name</label>
        <input type="text" value={user.name} readOnly style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd'}} />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{display: 'block', color: 'var(--text-light)', marginBottom: '5px'}}>Email Address</label>
        <input type="text" value={user.email} readOnly style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#f9f9f9'}} />
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <label style={{display: 'block', color: 'var(--text-light)', marginBottom: '5px'}}>Account Type</label>
        <span style={{padding: '5px 10px', background: '#e6f7ff', color: '#0047ab', borderRadius: '15px', fontSize: '0.8rem'}}>{user.role}</span>
      </div>

      <button className="btn-primary" onClick={() => alert("Update feature coming in V2!")}>Save Changes</button>
    </div>
  );
};

export default AccountSettings;