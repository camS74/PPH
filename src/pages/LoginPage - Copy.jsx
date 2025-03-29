import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoHeader from '../assets/Logo Header.png';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const navigate = useNavigate(); // ✅ Add this for redirection

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setFormData({
        email: 'Admin@propackhub.com',
        password: 'Test654883!'
      });

      setTimeout(() => {
        document.getElementById('login-form')?.dispatchEvent(
          new Event('submit', { bubbles: true, cancelable: true })
        );
      }, 500);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (loginError) setLoginError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);

    console.log('Login attempt with:', formData);

    setTimeout(() => {
      if (formData.password.length < 6) {
        setLoginError("Invalid email or password. Please try again.");
        setIsLoading(false);
      } else {
        setLoginSuccess(true);
        setTimeout(() => {
          const loggedInUser = {
  	name: 'Admin', // replace with real name from response if available
  	email: formData.email
	};
	localStorage.setItem("user", JSON.stringify(loggedInUser));
        navigate('/dashboard'); // ✅ Navigate to dashboard
        }, 1500);
      }
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="auth-page">
      <div className="auth-page-background" style={{ backgroundImage: `url(${logoHeader})` }}></div>
      <div className="auth-header-container">
        <div className="auth-header-logo">
          <Link to="/">
            <img src={logoHeader} alt="ProPackHub Logo" className="auth-top-logo" />
          </Link>
        </div>
      </div>

      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Log in to your ProPackHub account</p>
          </div>

          {loginSuccess && (
            <div className="success-message">
              Login successful! Redirecting to your dashboard...
            </div>
          )}

          {loginError && (
            <div className="error-alert">
              <div className="error-icon">!</div>
              <div className="error-message">{loginError}</div>
            </div>
          )}

          <form id="login-form" className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-field-wrapper large-field">
                <span className="input-icon email-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                  className={loginError ? "error" : ""}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-field-wrapper large-field">
                <span className="input-icon lock-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className={loginError ? "error" : ""}
                />
                <button 
                  type="button" 
                  className="password-toggle-btn inside-field"
                  onClick={togglePasswordVisibility}
                  tabIndex="-1"
                  aria-label={passwordVisible ? "Hide password" : "Show password"}
                >
                  {passwordVisible ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="form-footer">
              <div className="remember-me-container">
                <input type="checkbox" id="remember" className="remember-checkbox" />
                <label htmlFor="remember" className="remember-label">Remember me</label>
              </div>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit" 
              className={`btn-submit enhanced-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>

            <div className="auth-redirect">
              <p>
                Don't have an account?{' '}
                <Link to="/signup" className="redirect-link">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
