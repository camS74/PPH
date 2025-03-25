// src/components/signup/StepThree.jsx

import React, { useState, useEffect } from 'react';

function StepThree({ formData, handleChange, nextStep, prevStep, formErrors }) {
  const [localErrors, setLocalErrors] = useState({});
  const [canProceed, setCanProceed] = useState(true); // This step has optional fields
  
  const companyTypes = [
    "Flexible Packaging Manufacturers",
    "Printing & Converting Companies",
    "Raw Material Suppliers",
    "Packaging Design & Development Firms",
    "Brand Owners & FMCG Companies",
    "Industrial Packaging Suppliers",
    "Consulting",
    "Cost Control",
    "Accounting",
    "Other"
  ];
  
  // Custom handler for company type changes
  const handleCompanyTypeChange = (e) => {
    const value = e.target.value;
    // Only validate other company type if "Other" is selected
    if (value !== "Other") {
      setFormData({
        ...formData,
        companyType: value,
        otherCompanyType: ''
      });
    } else {
      setFormData({
        ...formData,
        companyType: value
      });
    }
  };
  
  // Website validation
  const validateWebsite = (url) => {
    if (!url) return true; // Optional field
    
    // Simple URL validation
    try {
      // Add http:// if missing protocol
      const urlToCheck = url.startsWith('http') ? url : `http://${url}`;
      new URL(urlToCheck);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  // Validate fields
  const validateFields = () => {
    let errors = {};
    
    // Company type validation for "Other"
    if (formData.companyType === "Other" && !formData.otherCompanyType.trim()) {
      errors.otherCompanyType = 'Please specify your company type';
    }
    
    // Website validation if provided
    if (formData.companyWebsite && !validateWebsite(formData.companyWebsite)) {
      errors.companyWebsite = 'Please enter a valid website URL';
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
  
  return (
    <form className="signup-form">
      <div className="form-section">
        <h2>Company Information <span className="optional">(Optional)</span></h2>
        
        <div className="form-group">
          <label htmlFor="companyName">
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Your company name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="jobTitle">
            Job Title
          </label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            placeholder="Your position at the company"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="companyType">
            Company Type
          </label>
          <select
            id="companyType"
            name="companyType"
            value={formData.companyType}
            onChange={handleChange}
          >
            <option value="">Select company type</option>
            {companyTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        {formData.companyType === "Other" && (
          <div className="form-group">
            <label htmlFor="otherCompanyType">
              Specify Company Type <span className="required">*</span>
            </label>
            <input
              type="text"
              id="otherCompanyType"
              name="otherCompanyType"
              value={formData.otherCompanyType}
              onChange={handleChange}
              className={localErrors.otherCompanyType ? 'error' : ''}
              placeholder="Please specify your company type"
            />
            {localErrors.otherCompanyType && (
              <div className="error-message">{localErrors.otherCompanyType}</div>
            )}
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="companyWebsite">
            Company Website
          </label>
          <input
            type="text"
            id="companyWebsite"
            name="companyWebsite"
            value={formData.companyWebsite}
            onChange={handleChange}
            className={localErrors.companyWebsite ? 'error' : ''}
            placeholder="https://www.example.com"
          />
          {localErrors.companyWebsite && (
            <div className="error-message">{localErrors.companyWebsite}</div>
          )}
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
          title={!canProceed ? "Please correct any errors before continuing" : ""}
        >
          Continue
        </button>
      </div>
    </form>
  );
}

export default StepThree;