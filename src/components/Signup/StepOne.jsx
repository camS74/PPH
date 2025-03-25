// src/components/signup/StepOne.jsx

import React, { useState, useEffect } from 'react';

function StepOne({ formData, handleChange, nextStep, formErrors }) {
  const [localErrors, setLocalErrors] = useState({});
  const [canProceed, setCanProceed] = useState(false);
  
  // Validate the form fields
  const validateFields = () => {
    let errors = {};
    
    // Username validation
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    // First name validation
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (/[^a-zA-Z\s-]/.test(formData.firstName)) {
      errors.firstName = 'First name should not contain numbers or special characters';
    }
    
    // Last name validation
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (/[^a-zA-Z\s-]/.test(formData.lastName)) {
      errors.lastName = 'Last name should not contain numbers or special characters';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid';
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
  
  // Simulate checking if username is available
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  
  useEffect(() => {
    if (formData.username.length >= 3) {
      setCheckingUsername(true);
      
      // Simulate API call to check username availability
      const timer = setTimeout(() => {
        // Mock API response - in a real app, this would be an API call
        const available = !['admin', 'test', 'user'].includes(formData.username.toLowerCase());
        setUsernameAvailable(available);
        setCheckingUsername(false);
        
        if (!available) {
          setLocalErrors({
            ...localErrors,
            username: 'This username is already taken'
          });
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      setUsernameAvailable(null);
    }
  }, [formData.username]);
  
  return (
    <form className="signup-form">
      <div className="form-section">
        <h2>Basic Information</h2>
        
        <div className="form-group">
          <label htmlFor="username">
            Username <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={localErrors.username ? 'error' : ''}
              placeholder="Choose a unique username"
            />
            {checkingUsername && <div className="checking-username">Checking...</div>}
            {usernameAvailable === true && <div className="username-available">Available</div>}
          </div>
          {localErrors.username && <div className="error-message">{localErrors.username}</div>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">
              First Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={localErrors.firstName ? 'error' : ''}
              placeholder="Your first name"
            />
            {localErrors.firstName && <div className="error-message">{localErrors.firstName}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">
              Last Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={localErrors.lastName ? 'error' : ''}
              placeholder="Your last name"
            />
            {localErrors.lastName && <div className="error-message">{localErrors.lastName}</div>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="email">
            Email Address <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={localErrors.email ? 'error' : ''}
            placeholder="Your email address"
          />
          {localErrors.email && <div className="error-message">{localErrors.email}</div>}
        </div>
      </div>
      
      <div className="form-navigation">
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

export default StepOne;