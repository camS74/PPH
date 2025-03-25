// src/pages/SignupPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoHeader from '../assets/Logo Header.png';
import StepOne from '../components/Signup/StepOne.jsx';
import StepTwo from '../components/Signup/StepTwo.jsx';
import StepThree from '../components/Signup/StepThree.jsx';
import StepFour from '../components/Signup/StepFour.jsx';
import ProgressBar from '../components/Signup/ProgressBar.jsx';

function SignupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    jobTitle: '',
    companyType: '',
    otherCompanyType: '',
    companyWebsite: '',
    country: '',
    phoneNumber: '',
    agreeTerms: false
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) throw new Error('Signup failed');

    const result = await response.json();
    console.log('✅ Success:', result);
    alert('Signup successful!');
  } catch (error) {
    console.error('❌ Error:', error);
    alert('Signup failed!');
  } finally {
    setIsSubmitting(false);
  }
};
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOne
            formData={formData}
            handleChange={handleChange}
            nextStep={nextStep}
            formErrors={formErrors}
          />
        );
      case 2:
        return (
          <StepTwo
            formData={formData}
            handleChange={handleChange}
            nextStep={nextStep}
            prevStep={prevStep}
            formErrors={formErrors}
          />
        );
      case 3:
        return (
          <StepThree
            formData={formData}
            handleChange={handleChange}
            nextStep={nextStep}
            prevStep={prevStep}
            formErrors={formErrors}
          />
        );
      case 4:
        return (
          <StepFour
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            prevStep={prevStep}
            isSubmitting={isSubmitting}
            formErrors={formErrors}
          />
        );
      default:
        return (
          <StepOne
            formData={formData}
            handleChange={handleChange}
            nextStep={nextStep}
          />
        );
    }
  };

  return (
    <div className="auth-page">
      <div
        className="auth-page-background"
        style={{ backgroundImage: `url(${logoHeader})` }}
      ></div>
      <div className="auth-header-container">
        <div className="auth-header-logo">
          <Link to="/">
            <img
              src={logoHeader}
              alt="ProPackHub Logo"
              className="auth-top-logo"
            />
          </Link>
        </div>
      </div>

      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-header">
            <h1>Create an Account</h1>
            <p>Join ProPackHub to manage your customer relationships</p>
          </div>

          <ProgressBar currentStep={currentStep} totalSteps={4} />
          {renderStep()}
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
