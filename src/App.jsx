// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles.css';

// Import pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
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

function App() {
  return (
    <Routes>

        <Route path="/sample-analysis-request" element={<SampleAnalysisRequest />} />
        <Route path="/sample-analysis-form" element={<SampleAnalysisForm />} />
        <Route path="/estimation-request" element={<EstimationRequest />} />
        <Route path="/estimation-form" element={<EstimationForm />} />
        <Route path="/quotation-form" element={<QuotationForm />} />
        <Route path="/sample-request" element={<SampleRequest />} />
        <Route path="/sales-order" element={<SalesOrder />} />
        <Route path="/material-order" element={<MaterialOrder />} />
        <Route path="/design-sheet" element={<DesignSheet />} />
        <Route path="/job-card" element={<JobCard />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}

export default App;