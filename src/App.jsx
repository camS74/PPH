// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles.css';

// Public pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Dashboard pages
import DashboardPage from './pages/DashboardPage';
import SampleAnalysisRequest from './pages/SampleAnalysisRequest';
import SampleAnalysisForm from './pages/SampleAnalysisForm';
import EstimationRequest from './pages/EstimationRequest';
import EstimationForm from './pages/EstimationForm';
import QuotationForm from './pages/QuotationForm';
import SampleRequest from './pages/SampleRequest';
import SalesOrder from './pages/SalesOrder';
import MaterialOrder from './pages/MaterialOrder';
import DesignSheet from './pages/DesignSheet';
import JobCard from './pages/JobCard';
import SampleRequestTable from './pages/SampleRequestTable'; // ✅ Added route

// Shared layout
import DashboardLayout from './layouts/DashboardLayout';

function App() {
  return (
    <Routes>
      {/* Dashboard routes */}
      <Route path="/dashboard" element={<DashboardLayout><DashboardPage /></DashboardLayout>} />
      <Route path="/sample-analysis-request" element={<DashboardLayout><SampleAnalysisRequest /></DashboardLayout>} />
      <Route path="/sample-analysis-form" element={<DashboardLayout><SampleAnalysisForm /></DashboardLayout>} />
      <Route path="/estimation-request" element={<DashboardLayout><EstimationRequest /></DashboardLayout>} />
      <Route path="/estimation-form" element={<DashboardLayout><EstimationForm /></DashboardLayout>} />
      <Route path="/quotation-form" element={<DashboardLayout><QuotationForm /></DashboardLayout>} />
      <Route path="/sample-request" element={<DashboardLayout><SampleRequest /></DashboardLayout>} />
      <Route path="/sales-order" element={<DashboardLayout><SalesOrder /></DashboardLayout>} />
      <Route path="/material-order" element={<DashboardLayout><MaterialOrder /></DashboardLayout>} />
      <Route path="/design-sheet" element={<DashboardLayout><DesignSheet /></DashboardLayout>} />
      <Route path="/job-card" element={<DashboardLayout><JobCard /></DashboardLayout>} />
      <Route path="/sample-request-table" element={<DashboardLayout><SampleRequestTable /></DashboardLayout>} /> {/* ✅ New route */}

      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  );
}

export default App;
