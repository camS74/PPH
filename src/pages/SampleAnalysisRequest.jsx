import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SampleAnalysisRequest.css';
import html2pdf from 'html2pdf.js';
import { PlusCircle, MinusCircle, X } from 'lucide-react';
import adminLogo from '../assets/User Admin Logo.jpg';

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

  // Create PDF content for a specific sample
  const createPdfContent = (sample) => {
    const fullName =
      user?.firstName && user?.familyName
        ? `${user.firstName} ${user.familyName}`
        : user?.username || "User";

    // Process the remarks to ensure proper text wrapping
    // Replace new lines with <br> tags for proper line breaks
    const formattedRemarks = sample.remarks
      .replace(/\n/g, '<br>')
      .trim();

    return `
      <div style="padding: 40px; font-family: Arial, sans-serif; background: white; font-size: 14px; line-height: 1.8; color: black;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <img src="${adminLogo}" alt="Admin Logo" style="width: 120px;" />
          <h2 style="flex: 1; text-align: center; font-size: 20px; margin: 0;">Sample Analysis Request</h2>
          <div style="width: 120px;"></div>
        </div>

        <p style="margin-top: 40px;"><strong>Customer Name:</strong> ${customer}</p>
        <p><strong>SAR No:</strong> ${sample.id}</p>
        <p><strong>Date:</strong> ${submissionDate}</p>
        <p style="margin-top: 24px;"><strong>Product Description & Remarks:</strong></p>
        <div style="text-align: justify; max-width: 100%; word-wrap: break-word; white-space: normal; border: 1px solid #ddd; padding: 10px; background-color: #f9f9f9; border-radius: 4px;">
          ${formattedRemarks}
        </div>

        <div style="margin-top: 60px; text-align: right;">
          <p style="font-weight: bold;">${fullName}</p>
        </div>
      </div>
    `;
  };

  // Handle saving PDF file
  const handleSavePDF = (sample) => {
    const pdfContent = createPdfContent(sample);
    
    const opt = {
      margin: 0.5,
      filename: `Sample-${sample.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    html2pdf().set(opt).from(pdfContent).save();
  };
  
  // Handle printing PDF directly
  const handlePrintPDF = (sample) => {
    const pdfContent = createPdfContent(sample);
    
    // Open a new window for printing
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      // Write the content to the new window
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Sample Tag - ${sample.id}</title>
            <style>
              body { margin: 0; padding: 0; }
              @media print {
                @page { size: letter; margin: 0.5in; }
              }
              /* Ensure text wrapping */
              p, div { 
                max-width: 100%;
                word-wrap: break-word;
                white-space: normal;
              }
              /* Style for the remarks box */
              .remarks-box {
                border: 1px solid #ddd;
                padding: 10px;
                background-color: #f9f9f9;
                border-radius: 4px;
                margin-bottom: 20px;
                text-align: justify;
                word-wrap: break-word;
                white-space: normal;
              }
            </style>
          </head>
          <body>
            ${pdfContent}
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  setTimeout(function() {
                    window.close();
                  }, 500);
                }, 300);
              }
            </script>
          </body>
        </html>
      `);
      
      printWindow.document.close();
    } else {
      alert('Please allow pop-ups to print the tag');
    }
  };

  // Add container styles to prevent the page from stretching edge to edge
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '15px 20px',
    backgroundColor: 'white',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px 8px 0 0',
    margin: '20px auto 0'
  };

  const formStyle = {
    backgroundColor: 'white',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '0 0 8px 8px'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle} className="sar-header-top">
        <img src={adminLogo} alt="Admin Logo" className="sar-admin-logo" />
        <h1 className="sar-title">Sample Analysis Request</h1>
        <button className="sars-submitted-button" onClick={() => navigate('/sample-request-table')}>
          SARs Submitted
        </button>
      </div>

      <form onSubmit={handleSubmit} style={formStyle}>
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
                <div style={{ display: 'flex', gap: '10px', marginLeft: '25px' }}>
                  <button
                    type="button"
                    className="pdf-button"
                    onClick={() => handleSavePDF(sample)}
                    style={{ backgroundColor: '#4a90e2' }}
                  >
                    Save PDF Tag
                  </button>
                  <button
                    type="button"
                    className="pdf-button"
                    onClick={() => handlePrintPDF(sample)}
                  >
                    Print Tag
                  </button>
                </div>
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