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
      const response = await axios.get('http://localhost:5000/api/countries');
      
      console.log('Raw response:', response);
      console.log('Response data:', response.data);
      console.log('Countries count:', response.data.length);

      // Robust country processing
      const validCountries = response.data.map((country, index) => {
        // Handle string countries
        if (typeof country === 'string') {
          return { 
            id: index + 1, 
            name: country 
          };
        }
        
        // Handle object countries
        return {
          id: country.id || index + 1,
          name: country.name || country.country_name || `Country ${index + 1}`
        };
      });

      console.log('Processed countries:', validCountries);
      setCountries(validCountries);
      setError(null);
    } catch (err) {
      console.error('Detailed fetch error:', {
        message: err.message,
        response: err.response,
        request: err.request
      });
      setError(err.message || 'Failed to fetch countries');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (newCountry.trim() === '') return;
    
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/countries', { name: newCountry });
      console.log('Added country:', response.data);
      
      setNewCountry('');
      fetchCountries(); // Refresh list
    } catch (err) {
      console.error('Error adding country:', err);
      setError(err.message || 'Error adding country');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/countries/${id}`);
      fetchCountries(); // Refresh list
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message || 'Failed to delete country');
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

      {/* Error Handling */}
      {error && (
        <div style={{
          color: 'white', 
          backgroundColor: 'red', 
          padding: '10px', 
          marginBottom: '15px',
          borderRadius: '5px'
        }}>
          Error: {error}
        </div>
      )}

      {/* Add Country Form */}
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

      {/* Loading State */}
      {loading && <p>Loading countries...</p>}

      {/* Countries Table */}
      {!loading && (
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
              <tr key={country.id || `country-${index}`}>
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

      {/* Empty State */}
      {!loading && countries.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          color: '#666', 
          padding: '20px' 
        }}>
          No countries found
        </div>
      )}

      {/* Import Buttons */}
      <div className="import-section">
        <button disabled>Import from Excel</button>
        <button disabled>Copy & Paste</button>
        <button disabled>Download Template</button>
      </div>
    </div>
  );
};

export default CountryMaster;