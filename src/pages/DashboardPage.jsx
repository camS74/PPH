import React, { useRef, useState } from 'react';
import '../styles/Dashboard.css';
import logoHeader from '../assets/Logo Header.png';
import { Link } from 'react-router-dom';
import {
  ChevronDown, LogOut, Settings, User,
  FileText, CheckSquare, ClipboardList, ClipboardEdit,
  Inbox, ShoppingCart, PackageCheck, LayoutDashboard, ClipboardType
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const [userImage, setUserImage] = useState(null);
  const fileRef = useRef();
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserImage(URL.createObjectURL(file));
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <img src={logoHeader} alt="ProPackHub" className="dashboard-logo" />
          <h1 className="dashboard-title">Admin Dashboard</h1>
        </div>
        <div className="dashboard-profile">
          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
          <div className="upload-wrapper" onClick={() => fileRef.current.click()}>
            {userImage ? (
              <img src={userImage} alt="Profile" className="profile-avatar" />
            ) : (
              <div className="upload-placeholder">Upload Image</div>
            )}
          </div>
          <div className="dropdown-hover">
            <ChevronDown />
            <div className="dropdown-menu">
              <div className="dropdown-item"><User size={16} /> <span>Profile</span></div>
              <div className="dropdown-item"><Settings size={16} /> <span>Settings</span></div>
              <div className="dropdown-item" onClick={handleLogout}><LogOut size={16} /> <span>Logout</span></div>
            </div>
          </div>
        </div>
      </header>
      <div className="dashboard-grid">

        <Link to="/sample-analysis-request" className="dashboard-tile">
          <div className="dashboard-icon"><FileText /></div>
          <div className="dashboard-label">Sample Analysis Request</div>
        </Link>
        <Link to="/sample-analysis-form" className="dashboard-tile">
          <div className="dashboard-icon"><CheckSquare /></div>
          <div className="dashboard-label">Sample Analysis Form</div>
        </Link>
        <Link to="/estimation-request" className="dashboard-tile">
          <div className="dashboard-icon"><ClipboardList /></div>
          <div className="dashboard-label">Estimation Request</div>
        </Link>
        <Link to="/estimation-form" className="dashboard-tile">
          <div className="dashboard-icon"><ClipboardEdit /></div>
          <div className="dashboard-label">Estimation Form</div>
        </Link>
        <Link to="/quotation-form" className="dashboard-tile">
          <div className="dashboard-icon"><FileText /></div>
          <div className="dashboard-label">Quotation Form</div>
        </Link>
        <Link to="/sample-request" className="dashboard-tile">
          <div className="dashboard-icon"><Inbox /></div>
          <div className="dashboard-label">Sample Request</div>
        </Link>
        <Link to="/sales-order" className="dashboard-tile">
          <div className="dashboard-icon"><ShoppingCart /></div>
          <div className="dashboard-label">Sales Order</div>
        </Link>
        <Link to="/material-order" className="dashboard-tile">
          <div className="dashboard-icon"><PackageCheck /></div>
          <div className="dashboard-label">Material Order</div>
        </Link>
        <Link to="/design-sheet" className="dashboard-tile">
          <div className="dashboard-icon"><LayoutDashboard /></div>
          <div className="dashboard-label">Design Sheet</div>
        </Link>
        <Link to="/job-card" className="dashboard-tile">
          <div className="dashboard-icon"><ClipboardType /></div>
          <div className="dashboard-label">Job Card</div>
        </Link>
      </div>
    </div>
  );
}

export default DashboardPage;
