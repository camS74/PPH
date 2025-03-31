import React, { useState } from 'react';
import '../styles/MasterDataDashboard.css';
import CountryMaster from '../components/master/CountryMaster';
import SectorMaster from '../components/master/SectorMaster';
import PaymentTermMaster from '../components/master/PaymentTermMaster';

const MasterDataDashboard = () => {
  const [activeSection, setActiveSection] = useState('countries');

  const renderSection = () => {
    switch (activeSection) {
      case 'countries':
        return <CountryMaster />;
      case 'sectors':
        return <SectorMaster />;
      case 'paymentTerms':
        return <PaymentTermMaster />;
      default:
        return null;
    }
  };

  return (
    <div className="master-dashboard-container">
      <aside className="master-sidebar">
        <h2>Master Data</h2>
        <ul>
          <li onClick={() => setActiveSection('countries')}>Countries</li>
          <li onClick={() => setActiveSection('sectors')}>Customer Sectors</li>
          <li onClick={() => setActiveSection('paymentTerms')}>Payment Terms</li>
        </ul>
      </aside>
      <main className="master-content">
        {renderSection()}
      </main>
    </div>
  );
};

export default MasterDataDashboard;
