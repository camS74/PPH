// src/pages/UserProfileSettings.jsx

import React from 'react';
import AdminLogoUpload from '../components/AdminLogoUpload';
import '../styles/UserProfileSettings.css';

const UserProfileSettings = () => {
  return (
    <div className="profile-settings-container" style={{ padding: '30px' }}>
      <h2>👤 Profile Settings</h2>

      <div className="logo-upload-box" style={{ marginBottom: '40px' }}>
        <h3>Upload Admin Logo</h3>
        <AdminLogoUpload />
      </div>

      <div className="user-management-placeholder">
        <h3>🧑‍💼 User Management (coming soon)</h3>
        <p>
          You will be able to invite users, assign roles, and manage permissions from this section.
        </p>
      </div>
    </div>
  );
};

export default UserProfileSettings;
