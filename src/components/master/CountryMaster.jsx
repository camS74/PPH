// ✅ CountryMaster.jsx (with searchable input + blank template support)
import React, { useEffect, useState } from 'react';
import '../../styles/MasterSection.css';
import axios from 'axios';
import * as XLSX from 'xlsx';

const CountryMaster = () => {
  const [countries, setCountries] = useState([]);
  const [newCountry, setNewCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pasteText, setPasteText] = useState('');

  const API_URL = '/api/countries';

  const fetchCountries = async () => {
    try {
      const response = await axios.get(API_URL);
      setCountries(response.data);
    } catch (err) {
      console.error('Error fetching countries:', err);
    }
  };

  const handleAdd = async () => {
    if (newCountry.trim() === '') return;
    setLoading(true);
    try {
      await axios.post(API_URL, { name: newCountry });
      setNewCountry('');
      fetchCountries();
    } catch (err) {
      alert(err?.response?.data?.error || 'Error adding country');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchCountries();
    } catch (err) {
      console.error('Error deleting country:', err);
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

      const existingNames = countries.map((c) => c.name.toLowerCase());
      const newCountries = rows
        .map((row) => row.Country?.trim())
        .filter((name) => name && !existingNames.includes(name.toLowerCase()));

      if (newCountries.length === 0) {
        alert('No new countries to import.');
        return;
      }

      try {
        await Promise.all(
          newCountries.map((name) => axios.post(API_URL, { name }).catch(() => null))
        );
        alert(`${newCountries.length} new country(ies) imported successfully.`);
        fetchCountries();
      } catch (err) {
        alert('Error importing countries');
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
      return alert('Please paste only one country per line (no commas or tabs).');
    }

    const existingNames = countries.map((c) => c.name.toLowerCase());
    const newCountries = allLines.filter(
      (line) => !existingNames.includes(line.toLowerCase())
    );

    const duplicates = allLines.length - newCountries.length;

    if (newCountries.length === 0) {
      alert('No new countries to import. All are duplicates.');
      return;
    }

    try {
      await Promise.all(
        newCountries.map((name) => axios.post(API_URL, { name }).catch(() => null))
      );
      alert(
        `\u2705 Import Summary:\nTotal Pasted: ${allLines.length}\nNew Countries Added: ${newCountries.length}\nDuplicates Skipped: ${duplicates}`
      );
      setPasteText('');
      setShowModal(false);
      fetchCountries();
    } catch (err) {
      alert('Error importing pasted countries.');
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
    fetchCountries();
  }, []);

  return (
    <div className="master-section">
      <h2>Countries</h2>
      <div className="master-form-wrapper">
        <div className="master-form">
          <input
            list="country-options"
            placeholder="Search or enter country"
            value={newCountry}
            onChange={(e) => setNewCountry(e.target.value)}
          />
          <datalist id="country-options">
            {countries.map((country) => (
              <option key={country.id} value={country.name} />
            ))}
          </datalist>
          <button onClick={handleAdd} disabled={loading}>
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
        <div className="import-buttons-vertical">
          <a
            href="/src/assets/countries_template.xlsx"
            download="countries_template.xlsx"
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
            <h3>Paste Countries (one per line)</h3>
            <textarea
              rows="6"
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder={`Example:\nIndia\nUAE\nGermany`}
              style={{ width: '100%', marginTop: '10px', padding: '10px' }}
            />
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={cancelModal} className="import-btn" style={{ backgroundColor: '#ccc', color: '#000' }}>
                Cancel
              </button>
              <button onClick={handlePasteImport} className="import-btn">
                Import Pasted Countries
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default CountryMaster;
