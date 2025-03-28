import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/DashboardToolbar.css';

function DashboardButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on dashboard
  if (location.pathname === '/dashboard') return null;

  return (
    <div className="floating-dashboard-button">
      <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
    </div>
  );
}

export default DashboardButton;
