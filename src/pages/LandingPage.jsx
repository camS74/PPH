import React from 'react';
import { Link } from 'react-router-dom';
import logoHeader from '../assets/Logo Header.png';

function LandingPage() {
  // Function to handle smooth scrolling to sections
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="full-width-container">
      <header className="site-header">
        <div className="logo-area">
          <img src={logoHeader} alt="ProPackHub Logo" className="header-logo" />
        </div>
        <nav className="main-nav">
          <ul>
            <li><a href="#features" onClick={(e) => scrollToSection(e, 'features')}>Features</a></li>
            <li><a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')}>Pricing</a></li>
            <li><a href="#about" onClick={(e) => scrollToSection(e, 'about')}>About Us</a></li>
            <li><a href="#tutorial" onClick={(e) => scrollToSection(e, 'tutorial')}>Tutorial</a></li>
            <li><a href="#contact" onClick={(e) => scrollToSection(e, 'contact')}>Contact</a></li>
          </ul>
        </nav>
        <div className="auth-area">
          <Link to="/login" className="btn-login">Log In</Link>
          <Link to="/signup" className="btn-signup">Sign Up</Link>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>Streamline Your Customer Relationships</h1>
            <p>ProPackHub helps businesses manage their customer relationships efficiently and effectively.</p>
            <Link to="/signup" className="btn-get-started">Get Started</Link>
          </div>
          <div className="hero-action">
            <div className="tutorial-container">
              <button className="btn-tutorial" onClick={(e) => scrollToSection(e, 'tutorial')}>
                Watch Tutorial
              </button>
            </div>
          </div>
        </section>

        <section id="features" className="features">
          <h2>Key Features</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <h3>Contact Management</h3>
              <p>Organize and track all your customer information in one place.</p>
            </div>
            <div className="feature-card">
              <h3>Deal Tracking</h3>
              <p>Monitor your sales pipeline and never miss an opportunity.</p>
            </div>
            <div className="feature-card">
              <h3>Task Management</h3>
              <p>Stay on top of your to-dos and follow-ups.</p>
            </div>
            <div className="feature-card">
              <h3>Analytics</h3>
              <p>Make data-driven decisions with powerful insights.</p>
            </div>
          </div>
        </section>
        
        <section id="pricing" className="features">
          {/* Pricing section content would go here */}
        </section>
        
        <section id="about" className="features">
          {/* About section content would go here */}
        </section>
        
        <section id="tutorial" className="features">
          {/* Tutorial section content would go here */}
        </section>
        
        <section id="contact" className="features">
          {/* Contact section content would go here */}
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <img src={logoHeader} alt="ProPackHub Logo" className="footer-logo" />
            <p>Simplifying customer relationships</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h3>Product</h3>
              <ul>
                <li><a href="#features" onClick={(e) => scrollToSection(e, 'features')}>Features</a></li>
                <li><a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')}>Pricing</a></li>
                <li><a href="#integrations">Integrations</a></li>
              </ul>
            </div>
            <div className="link-group">
              <h3>Company</h3>
              <ul>
                <li><a href="#about" onClick={(e) => scrollToSection(e, 'about')}>About Us</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#contact" onClick={(e) => scrollToSection(e, 'contact')}>Contact</a></li>
              </ul>
            </div>
            <div className="link-group">
              <h3>Resources</h3>
              <ul>
                <li><a href="#blog">Blog</a></li>
                <li><a href="#documentation">Documentation</a></li>
                <li><a href="#support">Support</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 ProPackHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;