import React, { useRef, useState } from 'react';
import '../styles/Dashboard.css';
import adminLogo from '../assets/User Admin Logo.jpg'; // ✅ Admin logo
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronDown, LogOut, Settings, User,
  FileText, CheckSquare, ClipboardList, ClipboardEdit,
  Inbox, ShoppingCart, PackageCheck, LayoutDashboard, ClipboardType, ImagePlus
} from 'lucide-react';

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

  const tiles = [
    { label: "Sample Analysis Request", icon: <FileText />, route: "/sample-analysis-request" },
    { label: "Sample Analysis Form", icon: <CheckSquare />, route: "/sample-analysis-form" },
    { label: "Estimation Request", icon: <ClipboardList />, route: "/estimation-request" },
    { label: "Estimation Form", icon: <ClipboardEdit />, route: "/estimation-form" },
    { label: "Quotation Form", icon: <FileText />, route: "/quotation-form" },
    { label: "Sample Request", icon: <Inbox />, route: "/sample-request" },
    { label: "Sales Order", icon: <ShoppingCart />, route: "/sales-order" },
    { label: "Material Order", icon: <PackageCheck />, route: "/material-order" },
    { label: "Design Sheet", icon: <LayoutDashboard />, route: "/design-sheet" },
    { label: "Job Card", icon: <ClipboardType />, route: "/job-card" },
    { label: "Master Data", icon: <Settings />, route: "/master-data" }, // ✅ New tile for Master Data
  ];

  return (
    <div className="dashboard">
      <header
        className="dashboard-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 30px',
        }}
      >
        {/* ✅ Admin Logo and Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img
            src={adminLogo}
            alt="ProPackHub Admin Logo"
            style={{ width: '180px', height: '180px', objectFit: 'contain' }}
          />
          <h1 className="dashboard-title" style={{ color: '#002f6c', margin: 0 }}>
            Admin Dashboard
          </h1>
        </div>

        {/* ✅ Profile section */}
        <div className="dashboard-profile">
          <input type="file" accept="image/*" ref={fileRef} onChange={handleImageUpload} hidden />
          <div className="upload-wrapper" onClick={() => fileRef.current.click()}>
            {userImage ? (
              <img src={userImage} alt="Profile" className="profile-avatar" />
            ) : (
              <div className="upload-placeholder">Upload Your Image</div>
            )}
          </div>
          <div className="dropdown-hover">
            <ChevronDown />
            <div className="dropdown-menu">
              <div className="dropdown-item"><User size={16} /> Profile</div>
              <div className="dropdown-item"><Settings size={16} /> Settings</div>
              <Link to="/profile/settings" className="dropdown-item">
                <ImagePlus size={16} /> Upload Logo
              </Link>
              <div className="dropdown-item" onClick={handleLogout}><LogOut size={16} /> Logout</div>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-grid">
        {tiles.map((tile, index) => (
          <Link to={tile.route} key={index} className="dashboard-tile">
            <div className="dashboard-icon">{tile.icon}</div>
            <div className="dashboard-label">{tile.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
