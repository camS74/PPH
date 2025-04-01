import React, { useEffect, useState } from 'react';
import '../../styles/MasterSection.css';
import axios from 'axios';

const CountryMaster = () => {
  const [countries, setCountries] = useState([]);
  const [newCountry, setNewCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5000/api/countries');
      
      // Simply use the data as-is since it already has the correct format
      setCountries(response.data);
    } catch (err) {
      console.error('Error fetching countries:', err);
      setError('Failed to fetch countries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (newCountry.trim() === '') return;

    try {
      setLoading(true);
      setError(null);
      await axios.post('http://localhost:5000/api/countries', { name: newCountry });
      setNewCountry('');
      fetchCountries(); // Refresh the list
    } catch (err) {
      console.error('Error adding country:', err);
      setError('Failed to add country. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await axios.delete(`http://localhost:5000/api/countries/${id}`);
      fetchCountries(); // Refresh the list
    } catch (err) {
      console.error('Error deleting country:', err);
      setError('Failed to delete country. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  return (
    <div className="master-section">
      <h2>Country List</h2>

      {/* Error display */}
      {error && (
        <div style={{ 
          color: 'white', 
          backgroundColor: '#dc3545', 
          padding: '10px', 
          marginBottom: '15px',
          borderRadius: '5px'
        }}>
          {error}
        </div>
      )}

      {/* Add country form */}
      <div className="master-form-wrapper">
        <div className="master-form">
          <input
            type="text"
            value={newCountry}
            onChange={(e) => setNewCountry(e.target.value)}
            placeholder="Enter country name"
            disabled={loading}
          />
          <button 
            onClick={handleAdd} 
            disabled={loading || newCountry.trim() === ''}
          >
            {loading ? 'Adding...' : 'Add Country'}
          </button>
        </div>

        <div className="import-buttons-vertical">
          <button className="import-btn" disabled>Import from Excel</button>
          <button className="import-btn" disabled>Copy & Paste</button>
          <button className="import-btn" disabled>Download Template</button>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && <p>Loading...</p>}

      {/* Countries table */}
      {!loading && countries.length > 0 && (
        <table className="master-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Country</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {countries.map((country, index) => (
              <tr key={country.id}>
                <td>{index + 1}</td>
                <td>{country.name}</td>
                <td>
                  <button 
                    onClick={() => handleDelete(country.id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Empty state */}
      {!loading && countries.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          color: '#666', 
          padding: '20px' 
        }}>
          No countries found
        </div>
      )}
    </div>
  );
};

export default CountryMaster;