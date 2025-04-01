// ✅ SectorMaster.jsx
import React, { useEffect, useState } from 'react';
import '../../styles/MasterSection.css';
import axios from 'axios';
import * as XLSX from 'xlsx';

const SectorMaster = () => {
  const [sectors, setSectors] = useState([]);
  const [newSector, setNewSector] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pasteText, setPasteText] = useState('');

  const API_URL = '/api/customer-sectors';

  const fetchSectors = async () => {
    try {
      const response = await axios.get(API_URL);
      setSectors(response.data);
    } catch (err) {
      console.error('Error fetching sectors:', err);
    }
  };

  const handleAdd = async () => {
    if (newSector.trim() === '') return;
    setLoading(true);
    try {
      await axios.post(API_URL, { name: newSector });
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
      await axios.delete(`${API_URL}/${id}`);
      fetchSectors();
    } catch (err) {
      console.error('Error deleting sector:', err);
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

      const existingNames = sectors.map((sector) => sector.name.toLowerCase());
      const newSectors = rows
        .map((row) => row.Sector?.trim())
        .filter((name) => name && !existingNames.includes(name.toLowerCase()));

      if (newSectors.length === 0) {
        alert('No new sectors to import.');
        return;
      }

      try {
        await Promise.all(
          newSectors.map((name) => axios.post(API_URL, { name }).catch(() => null))
        );
        alert(`${newSectors.length} new sector(s) imported successfully.`);
        fetchSectors();
      } catch (err) {
        alert('Error importing sectors');
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

    const invalidLines = allLines.filter((line) => line.includes('\t') || line.includes(','));
    if (invalidLines.length > 0) {
      return alert('Please paste only one sector per line (no commas or tabs).');
    }

    const existingNames = sectors.map((sector) => sector.name.toLowerCase());
    const newSectors = allLines.filter(
      (line) => !existingNames.includes(line.toLowerCase())
    );

    const duplicates = allLines.length - newSectors.length;

    if (newSectors.length === 0) {
      alert('No new sectors to import. All are duplicates.');
      return;
    }

    try {
      await Promise.all(
        newSectors.map((name) => axios.post(API_URL, { name }).catch(() => null))
      );
      alert(
        `\u2705 Import Summary:\nTotal Pasted: ${allLines.length}\nNew Sectors Added: ${newSectors.length}\nDuplicates Skipped: ${duplicates}`
      );
      setPasteText('');
      setShowModal(false);
      fetchSectors();
    } catch (err) {
      alert('Error importing pasted sectors.');
    }
  };

  const openModal = () => {
    setPasteText('');
    setShowModal(true);
  };

  const cancelModal = () => {
    setPasteText('');
    setShowModal(false);
  };

  useEffect(() => {
    fetchSectors();
  }, []);

  return (
    <div className="master-section">
      <h2>Customer Sectors</h2>
      <div className="master-form-wrapper">
        <div className="master-form">
          <input
            type="text"
            placeholder="Enter sector"
            value={newSector}
            onChange={(e) => setNewSector(e.target.value)}
          />
          <button onClick={handleAdd} disabled={loading}>
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
        <div className="import-buttons-vertical">
          <a
            href="/src/assets/customer_sectors_template.xlsx"
            download="customer_sectors_template.xlsx"
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

      {showModal && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0,
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
            <h3>Paste Customer Sectors (one per line)</h3>
            <textarea
              rows="6"
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder={`Example:\nFood\nPharmaceutical\nPackaging`}
              style={{ width: '100%', marginTop: '10px', padding: '10px' }}
            />
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={cancelModal} className="import-btn" style={{ backgroundColor: '#ccc', color: '#000' }}>
                Cancel
              </button>
              <button onClick={handlePasteImport} className="import-btn">
                Import Pasted Sectors
              </button>
            </div>
          </div>
        </div>
      )}

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
