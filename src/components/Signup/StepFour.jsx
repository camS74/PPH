// src/components/signup/StepFour.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function StepFour({ formData, handleChange, handleSubmit, prevStep, isSubmitting, formErrors }) {
  const [localErrors, setLocalErrors] = useState({});
  const [canSubmit, setCanSubmit] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  
  // Complete list of all countries in the world
  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", 
    "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", 
    "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", 
    "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", 
    "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", 
    "Fiji", "Finland", "France", 
    "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", 
    "Haiti", "Honduras", "Hungary", 
    "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", 
    "Jamaica", "Japan", "Jordan", 
    "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", 
    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", 
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", 
    "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", 
    "Oman", 
    "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", 
    "Qatar", 
    "Romania", "Russia", "Rwanda", 
    "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", 
    "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", 
    "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", 
    "Vanuatu", "Vatican City", "Venezuela", "Vietnam", 
    "Yemen", 
    "Zambia", "Zimbabwe"
  ];
  
  // Complete mapping of countries to their phone codes
  const countryCodes = {
    "Afghanistan": "+93",
    "Albania": "+355",
    "Algeria": "+213",
    "Andorra": "+376",
    "Angola": "+244",
    "Antigua and Barbuda": "+1-268",
    "Argentina": "+54",
    "Armenia": "+374",
    "Australia": "+61",
    "Austria": "+43",
    "Azerbaijan": "+994",
    "Bahamas": "+1-242",
    "Bahrain": "+973",
    "Bangladesh": "+880",
    "Barbados": "+1-246",
    "Belarus": "+375",
    "Belgium": "+32",
    "Belize": "+501",
    "Benin": "+229",
    "Bhutan": "+975",
    "Bolivia": "+591",
    "Bosnia and Herzegovina": "+387",
    "Botswana": "+267",
    "Brazil": "+55",
    "Brunei": "+673",
    "Bulgaria": "+359",
    "Burkina Faso": "+226",
    "Burundi": "+257",
    "Cabo Verde": "+238",
    "Cambodia": "+855",
    "Cameroon": "+237",
    "Canada": "+1",
    "Central African Republic": "+236",
    "Chad": "+235",
    "Chile": "+56",
    "China": "+86",
    "Colombia": "+57",
    "Comoros": "+269",
    "Congo": "+242",
    "Costa Rica": "+506",
    "Croatia": "+385",
    "Cuba": "+53",
    "Cyprus": "+357",
    "Czech Republic": "+420",
    "Democratic Republic of the Congo": "+243",
    "Denmark": "+45",
    "Djibouti": "+253",
    "Dominica": "+1-767",
    "Dominican Republic": "+1-809",
    "Ecuador": "+593",
    "Egypt": "+20",
    "El Salvador": "+503",
    "Equatorial Guinea": "+240",
    "Eritrea": "+291",
    "Estonia": "+372",
    "Eswatini": "+268",
    "Ethiopia": "+251",
    "Fiji": "+679",
    "Finland": "+358",
    "France": "+33",
    "Gabon": "+241",
    "Gambia": "+220",
    "Georgia": "+995",
    "Germany": "+49",
    "Ghana": "+233",
    "Greece": "+30",
    "Grenada": "+1-473",
    "Guatemala": "+502",
    "Guinea": "+224",
    "Guinea-Bissau": "+245",
    "Guyana": "+592",
    "Haiti": "+509",
    "Honduras": "+504",
    "Hungary": "+36",
    "Iceland": "+354",
    "India": "+91",
    "Indonesia": "+62",
    "Iran": "+98",
    "Iraq": "+964",
    "Ireland": "+353",
    "Israel": "+972",
    "Italy": "+39",
    "Ivory Coast": "+225",
    "Jamaica": "+1-876",
    "Japan": "+81",
    "Jordan": "+962",
    "Kazakhstan": "+7",
    "Kenya": "+254",
    "Kiribati": "+686",
    "Kuwait": "+965",
    "Kyrgyzstan": "+996",
    "Laos": "+856",
    "Latvia": "+371",
    "Lebanon": "+961",
    "Lesotho": "+266",
    "Liberia": "+231",
    "Libya": "+218",
    "Liechtenstein": "+423",
    "Lithuania": "+370",
    "Luxembourg": "+352",
    "Madagascar": "+261",
    "Malawi": "+265",
    "Malaysia": "+60",
    "Maldives": "+960",
    "Mali": "+223",
    "Malta": "+356",
    "Marshall Islands": "+692",
    "Mauritania": "+222",
    "Mauritius": "+230",
    "Mexico": "+52",
    "Micronesia": "+691",
    "Moldova": "+373",
    "Monaco": "+377",
    "Mongolia": "+976",
    "Montenegro": "+382",
    "Morocco": "+212",
    "Mozambique": "+258",
    "Myanmar": "+95",
    "Namibia": "+264",
    "Nauru": "+674",
    "Nepal": "+977",
    "Netherlands": "+31",
    "New Zealand": "+64",
    "Nicaragua": "+505",
    "Niger": "+227",
    "Nigeria": "+234",
    "North Korea": "+850",
    "North Macedonia": "+389",
    "Norway": "+47",
    "Oman": "+968",
    "Pakistan": "+92",
    "Palau": "+680",
    "Palestine": "+970",
    "Panama": "+507",
    "Papua New Guinea": "+675",
    "Paraguay": "+595",
    "Peru": "+51",
    "Philippines": "+63",
    "Poland": "+48",
    "Portugal": "+351",
    "Qatar": "+974",
    "Romania": "+40",
    "Russia": "+7",
    "Rwanda": "+250",
    "Saint Kitts and Nevis": "+1-869",
    "Saint Lucia": "+1-758",
    "Saint Vincent and the Grenadines": "+1-784",
    "Samoa": "+685",
    "San Marino": "+378",
    "Sao Tome and Principe": "+239",
    "Saudi Arabia": "+966",
    "Senegal": "+221",
    "Serbia": "+381",
    "Seychelles": "+248",
    "Sierra Leone": "+232",
    "Singapore": "+65",
    "Slovakia": "+421",
    "Slovenia": "+386",
    "Solomon Islands": "+677",
    "Somalia": "+252",
    "South Africa": "+27",
    "South Korea": "+82",
    "South Sudan": "+211",
    "Spain": "+34",
    "Sri Lanka": "+94",
    "Sudan": "+249",
    "Suriname": "+597",
    "Sweden": "+46",
    "Switzerland": "+41",
    "Syria": "+963",
    "Taiwan": "+886",
    "Tajikistan": "+992",
    "Tanzania": "+255",
    "Thailand": "+66",
    "Timor-Leste": "+670",
    "Togo": "+228",
    "Tonga": "+676",
    "Trinidad and Tobago": "+1-868",
    "Tunisia": "+216",
    "Turkey": "+90",
    "Turkmenistan": "+993",
    "Tuvalu": "+688",
    "Uganda": "+256",
    "Ukraine": "+380",
    "United Arab Emirates": "+971",
    "United Kingdom": "+44",
    "United States": "+1",
    "Uruguay": "+598",
    "Uzbekistan": "+998",
    "Vanuatu": "+678",
    "Vatican City": "+379",
    "Venezuela": "+58",
    "Vietnam": "+84",
    "Yemen": "+967",
    "Zambia": "+260",
    "Zimbabwe": "+263"
  };
  
  // Set country based on IP address (would typically come from an API)
  useEffect(() => {
    // Detect user's country (simplified example)
    // In a real app, you would use an IP geolocation service
    const userCountry = "United States"; // Default fallback
    
    if (!formData.country) {
      handleChange({
        target: {
          name: 'country',
          value: userCountry
        }
      });
    }
  }, []);
  
  // Handle phone input change
  const handlePhoneChange = (e) => {
    let value = e.target.value;
    
    // Remove any non-digit characters except parentheses
    value = value.replace(/[^\d()]/g, '');
    
    // Format with parentheses for leading zero
    if (value.startsWith('0')) {
      if (!value.startsWith('(0)')) {
        value = `(0)${value.substring(1)}`;
      }
    } else if (value.startsWith('(0)') && value.length <= 3) {
      value = '';
    }
    
    setPhoneInput(value);
    
    // Update form data with complete phone number
    const countryCode = countryCodes[formData.country] || '';
    const fullNumber = countryCode ? `${countryCode} ${value}` : value;
    
    handleChange({
      target: {
        name: 'phoneNumber',
        value: fullNumber
      }
    });
  };
  
  // Validate fields
  const validateFields = () => {
    let errors = {};
    
    // Country validation
    if (!formData.country) {
      errors.country = 'Please select your country';
    }
    
    // Phone number validation (optional)
    if (formData.phoneNumber && !/^\+[0-9\s()]{6,}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number with country code';
    }
    
    // Terms agreement validation
    if (!formData.agreeTerms) {
      errors.agreeTerms = 'You must agree to the Terms and Privacy Policy';
    }
    
    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Check if we can submit the form
  useEffect(() => {
    const isValid = validateFields() && recaptchaVerified;
    setCanSubmit(isValid);
  }, [formData, recaptchaVerified]);
  
  // Setup reCAPTCHA callback - MODIFIED FOR TESTING
  useEffect(() => {
    // FOR TESTING ONLY: Auto-validate reCAPTCHA
    setRecaptchaVerified(true);
    
    // Still keep the callback for when you're ready to implement real reCAPTCHA
    window.onRecaptchaVerified = (token) => {
      setRecaptchaVerified(true);
    };
    
    return () => {
      // Cleanup
      window.onRecaptchaVerified = undefined;
    };
  }, []);
  
  // Handle form submission
  const onSubmit = (e) => {
    e.preventDefault();
    if (validateFields() && recaptchaVerified) {
      handleSubmit(e);
    }
  };
  
  return (
    <form className="signup-form" onSubmit={onSubmit}>
      <div className="form-section">
        <h2>Contact Information</h2>
        
        <div className="form-group">
          <label htmlFor="country">
            Country <span className="required">*</span>
          </label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className={localErrors.country ? 'error' : ''}
          >
            <option value="">Select your country</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          {localErrors.country && <div className="error-message">{localErrors.country}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="phoneNumber">
            Phone Number <span className="optional">(Optional)</span>
          </label>
          <div className="phone-input-container">
            <div className="country-code">
              {countryCodes[formData.country] || '+'}
            </div>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneInput}
              onChange={handlePhoneChange}
              className={localErrors.phoneNumber ? 'error' : ''}
              placeholder="Phone number"
            />
          </div>
          {localErrors.phoneNumber && <div className="error-message">{localErrors.phoneNumber}</div>}
          <div className="field-hint">
            Include area code. Leading zero will appear in parentheses.
          </div>
        </div>
        
        <div className="form-group terms-group">
          <div className="checkbox-wrapper">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className={localErrors.agreeTerms ? 'error' : ''}
            />
            <label htmlFor="agreeTerms">
              I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
            </label>
          </div>
          {localErrors.agreeTerms && <div className="error-message">{localErrors.agreeTerms}</div>}
        </div>
        
        {/* reCAPTCHA - Modified for testing */}
        <div className="recaptcha-container">
          <div className="testing-recaptcha">
            reCAPTCHA verification auto-enabled for testing
          </div>
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
          type="submit" 
          className={`btn-submit ${isSubmitting ? 'loading' : ''}`}
          disabled={!canSubmit || isSubmitting}
          title={!canSubmit ? "Please fill all required fields" : ""}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
      </div>
    </form>
  );
}

export default StepFour;