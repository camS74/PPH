import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles.css';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import UserProfileSettings from './pages/UserProfileSettings';

import SampleAnalysisRequest from './pages/SampleAnalysisRequest';
import SampleAnalysisForm from './pages/SampleAnalysisForm';
import SampleAnalysisTable from './pages/SampleAnalysisTable';

import SampleRequest from './pages/SampleRequest';
import SampleRequestTable from './pages/SampleRequestTable';

import EstimationRequest from './pages/EstimationRequest';
import EstimationForm from './pages/EstimationForm';
import QuotationForm from './pages/QuotationForm';
import SalesOrder from './pages/SalesOrder';
import MaterialOrder from './pages/MaterialOrder';
import DesignSheet from './pages/DesignSheet';
import JobCard from './pages/JobCard';

import MasterDataDashboard from './pages/MasterDataDashboard';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Dashboard Home */}
      <Route path="/dashboard" element={
        <DashboardLayout>
          <DashboardPage />
        </DashboardLayout>
      } />

      {/* All Dashboard Pages Wrapped in Layout */}
      <Route path="/profile/settings" element={
        <DashboardLayout>
          <UserProfileSettings />
        </DashboardLayout>
      } />

      <Route path="/sample-analysis-request" element={
        <DashboardLayout>
          <SampleAnalysisRequest />
        </DashboardLayout>
      } />
      <Route path="/sample-analysis-form" element={
        <DashboardLayout>
          <SampleAnalysisForm />
        </DashboardLayout>
      } />
      <Route path="/sample-analysis-table" element={
        <DashboardLayout>
          <SampleAnalysisTable />
        </DashboardLayout>
      } />

      <Route path="/sample-request" element={
        <DashboardLayout>
          <SampleRequest />
        </DashboardLayout>
      } />
      <Route path="/sample-request-table" element={
        <DashboardLayout>
          <SampleRequestTable />
        </DashboardLayout>
      } />

      <Route path="/estimation-request" element={
        <DashboardLayout>
          <EstimationRequest />
        </DashboardLayout>
      } />
      <Route path="/estimation-form" element={
        <DashboardLayout>
          <EstimationForm />
        </DashboardLayout>
      } />
      <Route path="/quotation-form" element={
        <DashboardLayout>
          <QuotationForm />
        </DashboardLayout>
      } />
      <Route path="/sales-order" element={
        <DashboardLayout>
          <SalesOrder />
        </DashboardLayout>
      } />
      <Route path="/material-order" element={
        <DashboardLayout>
          <MaterialOrder />
        </DashboardLayout>
      } />
      <Route path="/design-sheet" element={
        <DashboardLayout>
          <DesignSheet />
        </DashboardLayout>
      } />
      <Route path="/job-card" element={
        <DashboardLayout>
          <JobCard />
        </DashboardLayout>
      } />
      <Route path="/master-data" element={
        <DashboardLayout>
          <MasterDataDashboard />
        </DashboardLayout>
      } />
    </Routes>
  );
}

export default App;
