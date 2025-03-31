import React, { useEffect, useState } from 'react';
import '../../styles/MasterSection.css';
import axios from 'axios';

const CountryMaster = () => {
  const [countries, setCountries] = useState([]);
  const [newCountry, setNewCountry] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCountries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/countries');
      setCountries(response.data);
    } catch (err) {
      console.error('Error fetching countries:', err);
    }
  };

  const handleAdd = async () => {
    if (newCountry.trim() === '') return;
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/countries', { name: newCountry });
      setNewCountry('');
      fetchCountries(); // Refresh list
    } catch (err) {
      alert(err?.response?.data?.error || 'Error adding country');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/countries/${id}`);
      fetchCountries(); // Refresh list
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  return (
    <div className="master-section">
      <h2>Country List</h2>

      <div className="master-form">
        <input
          type="text"
          value={newCountry}
          onChange={(e) => setNewCountry(e.target.value)}
          placeholder="Enter country name"
        />
        <button onClick={handleAdd} disabled={loading}>
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>

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
                <button onClick={() => handleDelete(country.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="import-section">
        <button>Import from Excel</button>
        <button>Copy & Paste</button>
        <button>Download Template</button>
      </div>
    </div>
  );
};

export default CountryMaster;
