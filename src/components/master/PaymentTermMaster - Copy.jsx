import React, { useEffect, useState } from 'react';
import '../../styles/MasterSection.css';
import axios from 'axios';

const PaymentTermMaster = () => {
  const [terms, setTerms] = useState([]);
  const [newTerm, setNewTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTerms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/payment-terms');
      setTerms(response.data);
    } catch (err) {
      console.error('Error fetching terms:', err);
    }
  };

  const handleAdd = async () => {
    if (newTerm.trim() === '') return;
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/payment-terms', { name: newTerm });
      setNewTerm('');
      fetchTerms();
    } catch (err) {
      alert(err?.response?.data?.error || 'Error adding term');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/payment-terms/${id}`);
      fetchTerms();
    } catch (err) {
      console.error('Error deleting term:', err);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  return (
    <div className="master-section">
      <h2>Payment Terms</h2>
      <div className="master-form-wrapper">
        <div className="master-form">
          <input
            type="text"
            placeholder="Enter payment term"
            value={newTerm}
            onChange={(e) => setNewTerm(e.target.value)}
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
            <th>Term</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {terms.map((term, index) => (
            <tr key={term.id}>
              <td>{index + 1}</td>
              <td>{term.name}</td>
              <td>
                <button onClick={() => handleDelete(term.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentTermMaster;
