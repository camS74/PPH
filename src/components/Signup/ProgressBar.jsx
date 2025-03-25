// src/components/signup/ProgressBar.jsx

import React from 'react';

function ProgressBar({ currentStep, totalSteps }) {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
  
  return (
    <div className="progress-container">
      <div className="step-indicators">
        {[...Array(totalSteps)].map((_, index) => (
          <div 
            key={index} 
            className={`step-indicator ${index + 1 <= currentStep ? 'active' : ''}`}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-label">
              {index === 0 && 'Basic Info'}
              {index === 1 && 'Security'}
              {index === 2 && 'Company'}
              {index === 3 && 'Contact'}
            </div>
          </div>
        ))}
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${progressPercentage}%` }} 
        ></div>
      </div>
    </div>
  );
}

export default ProgressBar;