import React, { useEffect, useState } from 'react';
import '../../styles/MasterSection.css';
import axios from 'axios';

const SectorMaster = () => {
  const [sectors, setSectors] = useState([]);
  const [newSector, setNewSector] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchSectors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/customer-sectors'); // fixed
      setSectors(response.data);
    } catch (err) {
      console.error('Error fetching sectors:', err);
    }
  };

  const handleAdd = async () => {
    if (newSector.trim() === '') return;
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/customer-sectors', { name: newSector }); // fixed
      setNewSector('');
      fetchSectors();
    } catch (err) {
      alert(err?.response?.data?.error || 'Error adding sector');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/customer-sectors/${id}`); // fixed
      fetchSectors();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  useEffect(() => {
    fetchSectors();
  }, []);

  return (
    <div className="master-section">
      <h2>Customer Sectors</h2>

      {/* NEW layout: form on left, import buttons on right */}
      <div className="master-form-wrapper">
        <div className="master-form">
          <input
            type="text"
            value={newSector}
            onChange={(e) => setNewSector(e.target.value)}
            placeholder="Enter sector name"
          />
          <button onClick={handleAdd} disabled={loading}>
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>

        <div className="import-buttons-vertical">
          <button className="import-btn">Import from Excel</button>
          <button className="import-btn">Copy & Paste</button>
          <button className="import-btn">Download Template</button>
        </div>
      </div>

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
            <tr key={sector.id}>
              <td>{index + 1}</td>
              <td>{sector.name}</td>
              <td>
                <button onClick={() => handleDelete(sector.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SectorMaster;
