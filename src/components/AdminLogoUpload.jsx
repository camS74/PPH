// src/components/AdminLogoUpload.jsx

import React, { useState } from 'react';
import axios from 'axios';

const AdminLogoUpload = () => {
  const [logoFile, setLogoFile] = useState(null);
  const [uploadedLogoUrl, setUploadedLogoUrl] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setLogoFile(e.target.files[0]);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!logoFile) {
      setMessage('Please select a logo to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('logo', logoFile);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/logo/upload-logo', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadedLogoUrl(`http://localhost:5000${response.data.path}`);
      setMessage('✅ Logo uploaded successfully!');
    } catch (error) {
      console.error('Logo upload failed:', error);
      setMessage('❌ Upload failed. Please check your token or file type.');
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', maxWidth: '400px' }}>
      <h2>Upload Admin Logo</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br /><br />
      <button onClick={handleUpload} style={{ padding: '6px 14px', cursor: 'pointer' }}>
        Upload
      </button>
      <p>{message}</p>
      {uploadedLogoUrl && (
        <div style={{ marginTop: '15px' }}>
          <h4>Uploaded Logo Preview:</h4>
          <img src={uploadedLogoUrl} alt="Uploaded Logo" style={{ width: '120px', border: '1px solid #ccc' }} />
        </div>
      )}
    </div>
  );
};

export default AdminLogoUpload;
