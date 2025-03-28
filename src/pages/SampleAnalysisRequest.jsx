import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SampleAnalysisRequest.css';
import html2pdf from 'html2pdf.js';
import { PlusCircle, MinusCircle, X } from 'lucide-react';

function SampleAnalysisRequest() {
  const navigate = useNavigate();

  const user = {
    firstName: 'John',
    familyName: 'Doe',
    username: 'johndoe',
  };

  const generateSARPrefix = () => {
    if (user.firstName && user.familyName) {
      return (
        'SAR-' +
        user.firstName.substring(0, 3).toUpperCase() +
        user.familyName.charAt(0).toUpperCase()
      );
    } else {
      return 'SAR-' + user.username.substring(0, 4).toUpperCase();
    }
  };

  const [sarCount, setSarCount] = useState(1);
  const sarPrefix = generateSARPrefix();
  const sarNumber = `${sarPrefix}-${String(sarCount).padStart(5, '0')}`;

  const [samples, setSamples] = useState([]);
  const [customer, setCustomer] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const addSample = () => {
    setSamples(prev => [
      ...prev,
      {
        id: `${sarNumber}-${String(prev.length + 1).padStart(2, '0')}`,
        specAvailable: false,
        sampleAvailable: false,
        specFiles: [],
        sampleFiles: [],
        remarks: ''
      }
    ]);
  };

  const removeSample = () => {
    setSamples(prev => prev.slice(0, -1));
  };

  const handleCheckbox = (index, field) => {
    const updated = [...samples];
    updated[index][field] = !updated[index][field];
    setSamples(updated);
  };

  const handleFileUpload = (index, field, files) => {
    const updated = [...samples];
    updated[index][field] = Array.from(files);
    setSamples(updated);
  };

  const handleFileRemove = (sampleIndex, field, fileIndex) => {
    const updated = [...samples];
    updated[sampleIndex][field].splice(fileIndex, 1);
    setSamples([...updated]);
  };

  const handleRemarkChange = (index, value) => {
    const updated = [...samples];
    updated[index].remarks = value;
    setSamples(updated);
  };

  const isFormValid = () => {
    return (
      customer.trim() !== '' &&
      submissionDate.trim() !== '' &&
      samples.length > 0 &&
      samples.every(sample => sample.remarks.trim() !== '')
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    setLoading(true);
    setSubmitMessage('');

    setTimeout(() => {
      setLoading(false);
      setSubmitMessage(`SAR ${sarNumber} submitted successfully!`);
      setSarCount(prev => prev + 1);
    }, 1000);
  };

  const handleDownloadPDF = (sample) => {
    const pdfContent = `
      <div style="padding: 40px; font-family: Arial, sans-serif; background: white; line-height: 1.6; font-size: 14px; color: #032d60;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div style="width: 120px; height: 60px; background-color: #e0e0e0;">LOGO</div>
        </div>
        <h2 style="margin-top: 40px; margin-bottom: 24px;">Sample Request</h2>
        <p style="margin: 12px 0;"><strong>Customer Name:</strong> ${customer}</p>
        <p style="margin: 12px 0;"><strong>SAR No:</strong> ${sarNumber}</p>
        <p style="margin: 12px 0;"><strong>Date:</strong> ${submissionDate}</p>
        <p style="margin: 12px 0;"><strong>Product Description & Remarks:</strong></p>
        <p style="margin: 12px 0;">${sample.remarks}</p>
        <div style="margin-top: 60px; text-align: right;">
          <p style="font-weight: bold;">${user.firstName} ${user.familyName}</p>
        </div>
      </div>
    `;
    const opt = { margin: 0.5, filename: `Sample-${sample.id}.pdf` };
    html2pdf().set(opt).from(pdfContent).save();
  };

  return (
    <div className="sar-container">
      <div className="sar-header">
        <h1 className="sar-title">Sample Analysis Request</h1>
        <button className="sars-submitted-button" onClick={() => navigate('/sample-request-table')}>
          SARs Submitted
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="sar-meta-row">
          <div><strong>SAR No:</strong> {sarNumber}</div>
          <div><strong>Date:</strong>
            <input
              type="date"
              className="date-input"
              value={submissionDate}
              onChange={(e) => setSubmissionDate(e.target.value)}
              required
            />
          </div>
          <div><strong>Sales Rep:</strong> {user.firstName || user.username}</div>
        </div>

        <div className="sar-meta">
          <label htmlFor="customer"><strong>Customer Name:</strong></label>
          <select
            id="customer"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            required
            className="customer-select"
          >
            <option value="">Select Customer</option>
            <option value="Customer A">Customer A</option>
            <option value="Customer B">Customer B</option>
          </select>
        </div>

        <div className="sample-controls">
          <button type="button" onClick={addSample} className="icon-button">
            <PlusCircle size={20} /> Add Sample
          </button>
          <button type="button" onClick={removeSample} className="icon-button" disabled={samples.length === 0}>
            <MinusCircle size={20} /> Remove Sample
          </button>
        </div>

        {samples.map((sample, index) => (
          <div className="sample-form" key={sample.id} id={`sample-${sample.id}`}>
            <h3>Sample {index + 1} — <span className="ref">Ref: {sample.id}</span></h3>

            <div className="remarks">
              <label>Product Description & Remarks</label>
              <textarea
                rows="3"
                placeholder="Enter product remarks..."
                value={sample.remarks}
                onChange={(e) => handleRemarkChange(index, e.target.value)}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
              />
            </div>

            <label className="checkbox-group">
              <input
                type="checkbox"
                checked={sample.specAvailable}
                onChange={() => handleCheckbox(index, 'specAvailable')}
              />
              <span>Specification Available</span>
            </label>
            {sample.specAvailable && (
              <div className="file-upload">
                <label>Upload Specs:</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(index, 'specFiles', e.target.files)}
                />
                <ul>
                  {sample.specFiles.map((file, i) => (
                    <li key={i}>
                      {file.name} <X size={14} onClick={() => handleFileRemove(index, 'specFiles', i)} style={{ cursor: 'pointer', color: 'red' }} />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <label className="checkbox-group">
              <input
                type="checkbox"
                checked={sample.sampleAvailable}
                onChange={() => handleCheckbox(index, 'sampleAvailable')}
              />
              <span>Customer Sample Available</span>
            </label>
            {sample.sampleAvailable && (
              <>
                <div className="file-upload">
                  <label>Upload Photo:</label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload(index, 'sampleFiles', e.target.files)}
                  />
                  <ul>
                    {sample.sampleFiles.map((file, i) => (
                      <li key={i}>
                        {file.name} <X size={14} onClick={() => handleFileRemove(index, 'sampleFiles', i)} style={{ cursor: 'pointer', color: 'red' }} />
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  className="pdf-button"
                  onClick={() => handleDownloadPDF(sample)}
                >
                  Print Physical Sample Tag
                </button>
              </>
            )}
          </div>
        ))}

        <button type="submit" disabled={!isFormValid() || loading}>
          {loading ? 'Submitting...' : 'Submit SAR'}
        </button>
        {submitMessage && <div className="sar-success">{submitMessage}</div>}
      </form>
    </div>
  );
}

export default SampleAnalysisRequest;
