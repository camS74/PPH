// src/components/signup/StepTwo.jsx

import React, { useState, useEffect } from 'react';

function StepTwo({ formData, handleChange, nextStep, prevStep, formErrors }) {
  const [localErrors, setLocalErrors] = useState({});
  const [canProceed, setCanProceed] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0); // 0: none, 1: weak, 2: medium, 3: strong
  
  // Password requirements check
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false
  });
  
  // Update password strength and checks
  useEffect(() => {
    const { password } = formData;
    
    // Check criteria
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password)
    };
    
    setPasswordChecks(checks);
    
    // Calculate strength
    const passedChecks = Object.values(checks).filter(Boolean).length;
    if (password.length === 0) {
      setPasswordStrength(0);
    } else if (passedChecks <= 2) {
      setPasswordStrength(1); // weak
    } else if (passedChecks <= 4) {
      setPasswordStrength(2); // medium
    } else {
      setPasswordStrength(3); // strong
    }
    
  }, [formData.password]);
  
  // Validate fields
  const validateFields = () => {
    let errors = {};
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (
      !(/[A-Z]/.test(formData.password) && 
      /[a-z]/.test(formData.password) && 
      /[0-9]/.test(formData.password) && 
      /[^A-Za-z0-9]/.test(formData.password))
    ) {
      errors.password = 'Password must meet all criteria';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Check if we can proceed to the next step
  useEffect(() => {
    const isValid = validateFields();
    setCanProceed(isValid);
  }, [formData]);
  
  // Handle continuing to the next step
  const handleContinue = (e) => {
    e.preventDefault();
    if (validateFields()) {
      nextStep();
    }
  };
  
  // Get strength label
  const getStrengthLabel = () => {
    switch(passwordStrength) {
      case 1: return 'Weak';
      case 2: return 'Medium';
      case 3: return 'Strong';
      default: return '';
    }
  };
  
  // Get strength color
  const getStrengthColor = () => {
    switch(passwordStrength) {
      case 1: return '#e53e3e'; // red
      case 2: return '#dd6b20'; // orange
      case 3: return '#38a169'; // green
      default: return '#e2e8f0'; // gray
    }
  };
  
  return (
    <form className="signup-form">
      <div className="form-section">
        <h2>Create a Secure Password</h2>
        
        <div className="form-group">
          <label htmlFor="password">
            Password <span className="required">*</span>
          </label>
          <div className="password-input-wrapper">
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={localErrors.password ? 'error' : ''}
              placeholder="Create a strong password"
            />
            <button 
              type="button" 
              className="toggle-password"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? 'Hide' : 'Show'}
            </button>
          </div>
          {localErrors.password && <div className="error-message">{localErrors.password}</div>}
          
          {/* Password strength meter */}
          {formData.password && (
            <div className="password-strength">
              <div className="strength-bars">
                <div 
                  className="strength-bar" 
                  style={{ 
                    width: '33%', 
                    backgroundColor: passwordStrength >= 1 ? getStrengthColor() : '#e2e8f0' 
                  }}
                ></div>
                <div 
                  className="strength-bar" 
                  style={{ 
                    width: '33%', 
                    backgroundColor: passwordStrength >= 2 ? getStrengthColor() : '#e2e8f0' 
                  }}
                ></div>
                <div 
                  className="strength-bar" 
                  style={{ 
                    width: '33%', 
                    backgroundColor: passwordStrength >= 3 ? getStrengthColor() : '#e2e8f0' 
                  }}
                ></div>
              </div>
              <div className="strength-label" style={{ color: getStrengthColor() }}>
                {getStrengthLabel()}
              </div>
            </div>
          )}
          
          {/* Password requirements */}
          <div className="password-requirements">
            <div className={`requirement ${passwordChecks.length ? 'met' : ''}`}>
              At least 8 characters
            </div>
            <div className={`requirement ${passwordChecks.uppercase ? 'met' : ''}`}>
              At least one uppercase letter
            </div>
            <div className={`requirement ${passwordChecks.lowercase ? 'met' : ''}`}>
              At least one lowercase letter
            </div>
            <div className={`requirement ${passwordChecks.number ? 'met' : ''}`}>
              At least one number
            </div>
            <div className={`requirement ${passwordChecks.symbol ? 'met' : ''}`}>
              At least one special character
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">
            Confirm Password <span className="required">*</span>
          </label>
          <div className="password-input-wrapper">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={localErrors.confirmPassword ? 'error' : ''}
              placeholder="Confirm your password"
            />
            <button 
              type="button" 
              className="toggle-password"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              {confirmPasswordVisible ? 'Hide' : 'Show'}
            </button>
          </div>
          {localErrors.confirmPassword && <div className="error-message">{localErrors.confirmPassword}</div>}
        </div>
      </div>
      
      <div className="form-navigation">
        <button 
          type="button" 
          className="btn-prev"
          onClick={prevStep}
        >
          Back
        </button>
        <button 
          type="button" 
          className="btn-next"
          onClick={handleContinue}
          disabled={!canProceed}
          title={!canProceed ? "Please fill all required fields correctly" : ""}
        >
          Continue
        </button>
      </div>
    </form>
  );
}

export default StepTwo;