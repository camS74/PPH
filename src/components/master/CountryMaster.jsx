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

      // Use only valid country names
      const validCountries = response.data.map((country, index) => {
        if (typeof country === 'string') {
          return {
            id: index + 1,
            name: country,
          };
        }

        return {
          id: country.id || index + 1,
          name: country.name || country.country_name || `Country ${index + 1}`,
        };
      });

      console.log('Processed countries:', validCountries);
      setCountries(validCountries);
      setError(null);
    } catch (err) {
      console.error('Detailed fetch error:', {
        message: err.message,
        response: err.response,
        request: err.request,
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
      fetchCountries();
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
      fetchCountries();
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

      {/* Error Message */}
      {error && (
        <div style={{
          color: 'white',
          backgroundColor: 'red',
          padding: '10px',
          marginBottom: '15px',
          borderRadius: '5px',
        }}>
          Error: {error}
        </div>
      )}

      {/* Top Section: Form + Import Buttons */}
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

      {/* Loading State */}
      {loading && <p>Loading countries...</p>}

      {/* Table */}
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
          padding: '20px',
        }}>
          No countries found
        </div>
      )}
    </div>
  );
};

export default CountryMaster;
