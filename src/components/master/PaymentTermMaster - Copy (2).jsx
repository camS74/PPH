import React, { useEffect, useState } from 'react';
import '../../styles/MasterSection.css';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaymentTermMaster = () => {
  const [terms, setTerms] = useState([]);
  const [newTerm, setNewTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [pasteData, setPasteData] = useState('');

  const API_URL = '/api/payment-terms';

  // Fetch payment terms
  const fetchTerms = async () => {
    try {
      const response = await axios.get(API_URL);
      setTerms(response.data);
    } catch (err) {
      toast.error('Error fetching terms. Please try again.');
      console.error('Error fetching terms:', err);
    }
  };

  // Add a new term
  const handleAdd = async () => {
    if (newTerm.trim() === '') {
      toast.warning('Please enter a payment term.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(API_URL, { name: newTerm });
      setNewTerm('');
      fetchTerms();
      toast.success('Payment term added successfully!');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Error adding term.');
    } finally {
      setLoading(false);
    }
  };

  // Delete a term
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTerms();
      toast.success('Payment term deleted successfully!');
    } catch (err) {
      toast.error('Error deleting term. Please try again.');
      console.error('Error deleting term:', err);
    }
  };

  // Edit a term
  const handleEdit = (term) => {
    setEditingId(term.id);
    setEditValue(term.name);
  };

  // Save edited term
  const handleSave = async (id) => {
    if (editValue.trim() === '') {
      toast.warning('Payment term cannot be empty.');
      return;
    }
    try {
      await axios.put(`${API_URL}/${id}`, { name: editValue });
      fetchTerms();
      setEditingId(null);
      toast.success('Payment term updated successfully!');
    } catch (err) {
      toast.error('Error updating term. Please try again.');
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // Import from Excel
  const handleExcelImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);

        // Validate Excel structure (must have "Name" column)
        if (!rows.length || !rows[0].Name) {
          toast.error('Invalid Excel format. Ensure a "Name" column exists.');
          return;
        }

        const existingNames = terms.map((term) => term.name.toLowerCase());
        const newTerms = rows
          .map((row) => row.Name?.trim())
          .filter(
            (name) =>
              name &&
              !existingNames.includes(name.toLowerCase())
          );

        if (newTerms.length === 0) {
          toast.info('No new payment terms to import.');
          return;
        }

        // Batch import
        await Promise.all(
          newTerms.map((name) =>
            axios.post(API_URL, { name }).catch(() => null)
          )
        );
        toast.success(`${newTerms.length} term(s) imported successfully!`);
        fetchTerms();
      } catch (err) {
        toast.error('Error importing terms. Check the file format.');
        console.error('Import error:', err);
      }
    };
    reader.readAsArrayBuffer(file);
    event.target.value = ''; // Reset file input
  };

  // Copy & Paste from text
  const handlePaste = async () => {
    if (!pasteData.trim()) {
      toast.warning('Please paste payment terms.');
      return;
    }

    const pastedTerms = pasteData
      .split('\n')
      .map((term) => term.trim())
      .filter((term) => term);

    if (pastedTerms.length === 0) {
      toast.warning('No valid terms detected.');
      return;
    }

    const existingNames = terms.map((term) => term.name.toLowerCase());
    const newTerms = pastedTerms.filter(
      (term) => !existingNames.includes(term.toLowerCase())
    );

    if (newTerms.length === 0) {
      toast.info('All terms already exist.');
      return;
    }

    try {
      await Promise.all(
        newTerms.map((name) =>
          axios.post(API_URL, { name }).catch(() => null)
        )
      );
      toast.success(`${newTerms.length} term(s) added from paste!`);
      setPasteData('');
      fetchTerms();
    } catch (err) {
      toast.error('Error pasting terms.');
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
          <a
            href="/src/assets/payment_terms_template.xlsx"
            download="payment_terms_template.xlsx"
            className="import-btn"
          >
            Download Template
          </a>
          <label className="import-btn" style={{ cursor: 'pointer' }}>
            Import from Excel
            <input
              type="file"
              accept=".xlsx"
              onChange={handleExcelImport}
              style={{ display: 'none' }}
            />
          </label>
          <div className="paste-section">
            <textarea
              placeholder="Paste terms here (one per line)"
              value={pasteData}
              onChange={(e) => setPasteData(e.target.value)}
            />
            <button className="import-btn" onClick={handlePaste}>
              Import from Paste
            </button>
          </div>
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
              <td>
                {editingId === term.id ? (
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                ) : (
                  term.name
                )}
              </td>
              <td>
                {editingId === term.id ? (
                  <>
                    <button onClick={() => handleSave(term.id)}>Save</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(term)}>Edit</button>
                    <button onClick={() => handleDelete(term.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentTermMaster;