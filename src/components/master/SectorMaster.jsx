import React, { useEffect, useState } from 'react';
import '../../styles/MasterSection.css';
import axios from 'axios';

const SectorMaster = () => {
  const [sectors, setSectors] = useState([]);
  const [newSector, setNewSector] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

 const API_URL = '/api/customer-sectors';

  const fetchSectors = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching sectors from:", API_URL);
      const response = await axios.get(API_URL);
      console.log("Sectors data received:", response.data);
      setSectors(response.data);
    } catch (err) {
      console.error('Error fetching sectors:', err);
      setError(`Failed to fetch sectors: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (newSector.trim() === '') return;

    try {
      setLoading(true);
      setError(null);
      console.log("Adding sector:", newSector);
      const response = await axios.post(API_URL, { name: newSector });
      console.log("Add sector response:", response.data);
      setNewSector('');
      fetchSectors(); // Refresh the list
    } catch (err) {
      console.error('Error adding sector:', err);
      setError(`Failed to add sector: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      setError(null);
      console.log("Deleting sector ID:", id);
      await axios.delete(`${API_URL}/${id}`);
      console.log("Delete successful");
      fetchSectors(); // Refresh the list
    } catch (err) {
      console.error('Error deleting sector:', err);
      setError(`Failed to delete sector: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSectors();
  }, []);

  return (
    <div className="master-section">
      <h2>Customer Sectors</h2>

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

      {/* Add sector form */}
      <div className="master-form-wrapper">
        <div className="master-form">
          <input
            type="text"
            value={newSector}
            onChange={(e) => setNewSector(e.target.value)}
            placeholder="Enter sector name"
            disabled={loading}
          />
          <button 
            onClick={handleAdd} 
            disabled={loading || newSector.trim() === ''}
          >
            {loading ? 'Adding...' : 'Add Sector'}
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

      {/* Sectors table */}
      {!loading && sectors.length > 0 && (
        <table className="master-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Sector</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sectors.map((sector, index) => (
              <tr key={sector.id || index}>
                <td>{index + 1}</td>
                <td>{sector.name}</td>
                <td>
                  <button 
                    onClick={() => handleDelete(sector.id)}
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
      {!loading && sectors.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          color: '#666', 
          padding: '20px' 
        }}>
          No sectors found
        </div>
      )}
    </div>
  );
};

export default SectorMaster;