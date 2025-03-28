// src/components/DashboardToolbar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardToolbar.css';

function DashboardToolbar() {
  const navigate = useNavigate();

  return (
    <div className="floating-dashboard-button">
      <button onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default DashboardToolbar;
