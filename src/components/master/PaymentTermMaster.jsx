import React, { useEffect, useState } from 'react';
import '../../styles/MasterSection.css';
import axios from 'axios';
import * as XLSX from 'xlsx';

const PaymentTermMaster = () => {
  const [terms, setTerms] = useState([]);
  const [newTerm, setNewTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pasteText, setPasteText] = useState('');

  const API_URL = '/api/payment-terms';

  const fetchTerms = async () => {
    try {
      const response = await axios.get(API_URL);
      setTerms(response.data);
    } catch (err) {
      console.error('Error fetching terms:', err);
    }
  };

  const handleAdd = async () => {
    if (newTerm.trim() === '') return;
    setLoading(true);
    try {
      await axios.post(API_URL, { name: newTerm });
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
      await axios.delete(`${API_URL}/${id}`);
      fetchTerms();
    } catch (err) {
      console.error('Error deleting term:', err);
    }
  };

  const handleExcelImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      const existingNames = terms.map((term) => term.name.toLowerCase());

      const newTerms = rows
        .map((row) => row.Name?.trim())
        .filter(
          (name) => name && !existingNames.includes(name.toLowerCase())
        );

      if (newTerms.length === 0) {
        alert('No new payment terms to import.');
        return;
      }

      try {
        await Promise.all(
          newTerms.map((name) =>
            axios.post(API_URL, { name }).catch(() => null)
          )
        );
        alert(`${newTerms.length} new payment term(s) imported successfully.`);
        fetchTerms();
      } catch (err) {
        alert('Error importing terms');
      }
    };

    reader.readAsArrayBuffer(file);
    event.target.value = '';
  };

  const handlePasteImport = async () => {
    const allLines = pasteText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '');

    const invalidLines = allLines.filter((line) =>
      line.includes('\t') || line.includes(',')
    );

    if (invalidLines.length > 0) {
      return alert(
        '❌ Invalid lines detected.\nPlease paste only one term per line with no commas or tabs.'
      );
    }

    const existingNames = terms.map((term) => term.name.toLowerCase());

    const newTerms = allLines.filter(
      (line) => !existingNames.includes(line.toLowerCase())
    );

    const duplicates = allLines.length - newTerms.length;

    if (newTerms.length === 0) {
      alert('No new payment terms to import. All entries are duplicates.');
      return;
    }

    try {
      await Promise.all(
        newTerms.map((name) =>
          axios.post(API_URL, { name }).catch(() => null)
        )
      );
      alert(
        `✅ Import Summary:\nTotal Pasted: ${allLines.length}\nNew Terms Added: ${newTerms.length}\nDuplicates Skipped: ${duplicates}`
      );
      setPasteText('');
      setShowModal(false);
      fetchTerms();
    } catch (err) {
      alert('Error importing pasted terms.');
    }
  };

  const openModal = () => {
    setPasteText(''); // reset textarea every time modal opens
    setShowModal(true);
  };

  const cancelModal = () => {
    setPasteText(''); // also clear when canceled
    setShowModal(false);
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
          <button className="import-btn" onClick={openModal}>
            Copy & Paste
          </button>
        </div>
      </div>

      {/* ✅ Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '90%',
              maxWidth: '500px',
            }}
          >
            <h3>Paste Payment Terms (one per line)</h3>
            <textarea
              rows="6"
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder={`Example:\nNet 30 Days\nAdvance 20%\nCredit 60 Days`}
              style={{ width: '100%', marginTop: '10px', padding: '10px' }}
            />
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={cancelModal} className="import-btn" style={{ backgroundColor: '#ccc', color: '#000' }}>
                Cancel
              </button>
              <button onClick={handlePasteImport} className="import-btn">
                Import Pasted Terms
              </button>
            </div>
          </div>
        </div>
      )}

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
