// src/layouts/DashboardLayout.jsx
import React from 'react';
import DashboardToolbar from '../components/DashboardToolbar'; // adjust path if needed

function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout-wrapper">
      {children}
      <DashboardToolbar />
    </div>
  );
}

export default DashboardLayout;
