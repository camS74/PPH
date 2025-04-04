// src/layouts/DashboardLayout.jsx

import React from 'react';
import DashboardToolbar from '../components/DashboardToolbar';

function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout-wrapper">
      {/* ✅ Layout now handles structure only, no logo */}
      {children}

      <DashboardToolbar />
    </div>
  );
}

export default DashboardLayout;
