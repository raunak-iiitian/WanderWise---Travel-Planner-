// src/components/user/PreferenceSelector.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getPreferences, saveUserPreferences } from '../../services/api'; 
import { useNavigate } from 'react-router-dom';

// --- Styling ---
const styles = {
  container: {
    maxWidth: '900px',
    margin: '40px auto',
    padding: '30px',
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: '700',
    color: '#333',
    marginBottom: '10px',
  },
  subtitle: {
    color: '#666',
    fontSize: '1.1rem',
  },
  categorySection: {
    marginBottom: '40px',
  },
  categoryTitle: {
    fontSize: '1.4rem',
    fontWeight: '600',
    color: '#444',
    marginBottom: '20px',
    borderBottom: '2px solid #eee',
    paddingBottom: '10px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '15px',
  },
  card: {
    padding: '15px 10px',
    borderRadius: '12px',
    backgroundColor: '#fff',
    border: '2px solid #e0e0e0',
    textAlign: 'center',
    cursor: 'pointer',
    fontWeight: '500',
    color: '#555',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    transition: 'all 0.2s ease',
  },
  selectedCard: {
    borderColor: '#667eea',
    backgroundColor: '#667eea',
    color: '#fff',
    boxShadow: '0 5px 15px rgba(102, 126, 234, 0.4)',
  },
  saveButton: {
    display: 'block',
    width: '100%',
    maxWidth: '300px',
    margin: '50px auto 0',
    padding: '16px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#28a745',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0 10px 20px rgba(40, 167, 69, 0.3)',
  }
};

const PreferenceSelector = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState([]); // All data from DB
  const [selectedIds, setSelectedIds] = useState(new Set()); // User selection
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data on Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPreferences();
        setPreferences(response.data); // Set the real data
        setLoading(false);
      } catch (error) {
        console.error("Failed to load preferences", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Handle Toggle Selection
  const toggleSelection = (id) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // 3. Handle Save (Stub for now)
  const handleSave = async () => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      alert("Please log in to save preferences.");
      navigate('/auth');
      return;
    }

    const user = JSON.parse(userString);
    const idArray = Array.from(selectedIds);

    try {
      // NOTE: We haven't built this backend endpoint yet!
      // await saveUserPreferences(user.id, idArray); 
      await saveUserPreferences(user.id, idArray);

      console.log("Saving preferences for user", user.id, idArray);
      alert(`Preferences Saved! (IDs: ${idArray.join(', ')})`);
      navigate('/create'); // Go to itinerary creator
    } catch (error) {
      console.error("Save failed", error);
      alert("Failed to save preferences. Check console.");
    }
  };

  // 4. Helper to Group Data by Category
  const groupedPreferences = preferences.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  if (loading) return <div style={{textAlign:'center', marginTop: '50px'}}>Loading options...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <motion.h1 
          style={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Customize Your Experience
        </motion.h1>
        <p style={styles.subtitle}>Select what matters to you for a perfect trip.</p>
      </div>

      {/* Render Dynamic Categories */}
      {Object.keys(groupedPreferences).map(category => (
        <motion.div 
          key={category} 
          style={styles.categorySection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 style={styles.categoryTitle}>{category}</h3>
          <div style={styles.grid}>
            {groupedPreferences[category].map(pref => {
              const isSelected = selectedIds.has(pref.preference_id);
              return (
                <motion.div
                  key={pref.preference_id}
                  style={{
                    ...styles.card,
                    ...(isSelected ? styles.selectedCard : {})
                  }}
                  onClick={() => toggleSelection(pref.preference_id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {pref.name}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}

      <motion.button 
        style={styles.saveButton}
        onClick={handleSave}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Save & Continue
      </motion.button>
    </div>
  );
};

export default PreferenceSelector;