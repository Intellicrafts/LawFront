// SignupComponent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FaFacebook, FaGoogle, FaLinkedin, FaEye, FaEyeSlash, FaShieldAlt, FaUser, FaBriefcase, FaCheck, FaCheckCircle, FaExclamationCircle, FaUpload, FaFileAlt, FaIdCard, FaGavel } from 'react-icons/fa';
import axios from 'axios';
import { authAPI, tokenManager } from '../api/apiService'; // Import your API service

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';


// Toast notification component positioned at the right side
const Toast = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  // Get theme from Redux
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow time for fade out animation
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  const getToastStyles = () => {
    if (isDarkMode) {
      return type === 'success' 
        ? 'bg-green-900 text-green-100 border-l-4 border-green-500' 
        : 'bg-red-900 text-red-100 border-l-4 border-red-500';
    } else {
      return type === 'success' 
        ? 'bg-green-50 text-green-800 border-l-4 border-green-500' 
        : 'bg-red-50 text-red-800 border-l-4 border-red-500';
    }
  };
  
  return (
    <div 
      className={`fixed top-16 right-4 flex items-center p-4 rounded-lg shadow-lg transition-all duration-300 z-50 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
      } ${getToastStyles()}`}
      role="alert"
      style={{ maxWidth: '90%', width: '400px' }}
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 mr-3 rounded-lg">
        {type === 'success' ? (
          <FaCheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <FaExclamationCircle className="w-5 h-5 text-red-500" />
        )}
      </div>
      <div className="ml-3 text-sm font-medium">{message}</div>
      <button 
        type="button" 
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className={`ml-auto -mx-1.5 -my-1.5 ${
          isDarkMode 
            ? 'bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
            : 'bg-white text-gray-400 hover:text-gray-900 hover:bg-gray-100'
        } rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex items-center justify-center h-8 w-8`}
      >
        <span className="sr-only">Close</span>
        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
      </button>
    </div>
  );
};

// Legal strip component at the top
const LegalStrip = () => {
  return (
    <div className="w-full py-2 px-4 bg-gradient-to-r from-blue-900 to-blue-800 text-white text-xs font-light flex items-center justify-between">
      <div className="flex items-center">
        <FaShieldAlt className="mr-2" />
        <span>Secure Authentication | ISO 27001 Certified</span>
      </div>
      <div>
        <a href="#" className="hover:underline transition-all duration-200">Privacy Policy</a>
        <span className="mx-2">|</span>
        <a href="#" className="hover:underline transition-all duration-200">Terms of Service</a>
      </div>
    </div>
  );
};

// Enhanced Logo component with gradient
const Logo = () => {
  return (
    <div className="flex justify-center mb-6 animate-fadeIn">
      <div 
        className="w-20 h-20 rounded-lg flex items-center justify-center text-white text-3xl font-bold shadow-lg transform hover:rotate-3 transition-all duration-300"
        style={{ background: "linear-gradient(to right, rgb(34, 87, 122), rgb(92, 172, 222))" }}
      >
        <span className="drop-shadow-md">M</span>
      </div>
    </div>
  );
};

// Enhanced Button component with gradient
const Button = ({ children, loading, onClick, className, type = "button", disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      type={type}
      className={`w-full py-3 px-4 rounded-md flex items-center justify-center text-white font-medium shadow-md transition-all duration-300 transform hover:scale-102 hover:shadow-xl relative overflow-hidden ${disabled && !loading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
      style={{ background: loading || disabled ? "#64a6db" : "linear-gradient(to right, rgb(34, 87, 122), rgb(92, 172, 222))" }}
    >
      <span className="relative z-10 flex items-center">
        {loading ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : null}
        {children}
      </span>
      <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-20 bg-white transform -translate-x-full hover:translate-x-0 transition-transform duration-500"></div>
    </button>
  );
};

// Enhanced Social login buttons
const SocialButtons = () => {
  return (
    <div className="flex justify-center space-x-5 mt-5">
      <button className="w-12 h-12 rounded-full bg-blue-800 flex items-center justify-center text-white transition-all duration-300 hover:bg-blue-900 hover:scale-110 hover:shadow-lg">
        <FaFacebook size={20} />
      </button>
      <button className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white transition-all duration-300 hover:bg-red-600 hover:scale-110 hover:shadow-lg">
        <FaGoogle size={20} />
      </button>
      <button className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white transition-all duration-300 hover:bg-blue-600 hover:scale-110 hover:shadow-lg">
        <FaLinkedin size={20} />
      </button>
    </div>
  );
};

// Enhanced Input Field component
const InputField = ({ type, id, name, value, onChange, placeholder, icon, rightIcon, onRightIconClick }) => {
  // Get theme from Redux
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';

  return (
    <div className="relative group">
      <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
        isDarkMode 
          ? 'text-gray-500 group-focus-within:text-blue-400' 
          : 'text-gray-400 group-focus-within:text-blue-500'
      } transition-colors duration-200`}>
        {icon}
      </div>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`block w-full pl-10 pr-10 py-3.5 rounded-lg shadow-sm transition-all duration-300 ${
          isDarkMode 
            ? 'border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
            : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400'
        }`}
        placeholder={placeholder}
        required
      />
      {rightIcon && (
        <button
          type="button"
          className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
            isDarkMode 
              ? 'text-gray-400 hover:text-gray-300' 
              : 'text-gray-400 hover:text-gray-600'
          } transition-colors duration-200`}
          onClick={onRightIconClick}
        >
          {rightIcon}
        </button>
      )}
    </div>
  );
};

// Password strength indicator
const PasswordStrengthIndicator = ({ password }) => {
  const getStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const strength = getStrength();
  const getColor = () => {
    if (strength === 0) return 'bg-gray-200';
    if (strength === 1) return 'bg-red-500';
    if (strength === 2) return 'bg-yellow-500';
    if (strength === 3) return 'bg-yellow-400';
    return 'bg-green-500';
  };

  const getLabel = () => {
    if (strength === 0) return '';
    if (strength === 1) return 'Weak';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Good';
    return 'Strong';
  };

  const getWidth = () => {
    return `${(strength / 4) * 100}%`;
  };

  return (
    <div className="mt-1">
      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-300`}
          style={{ width: getWidth() }}
        ></div>
      </div>
      <p className="text-xs mt-1 text-gray-500">
        {getLabel() && (
          <span className={`font-medium ${strength >= 3 ? 'text-green-600' : strength === 2 ? 'text-yellow-600' : 'text-red-600'}`}>
            {getLabel()}
          </span>
        )}
        {password && strength < 4 && (
          <span className="ml-1">
            {strength < 1 && "Use at least 8 characters. "}
            {!/[A-Z]/.test(password) && "Add uppercase letters. "}
            {!/[0-9]/.test(password) && "Add numbers. "}
            {!/[^A-Za-z0-9]/.test(password) && "Add special characters."}
          </span>
        )}
      </p>
    </div>
  );
};

// Password requirements component
const PasswordRequirements = ({ password }) => {
  // Get theme from Redux
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';

  const requirements = [
    { text: 'At least 8 characters', met: password.length >= 8 },
    { text: 'At least 1 uppercase letter', met: /[A-Z]/.test(password) },
    { text: 'At least 1 number', met: /[0-9]/.test(password) },
    { text: 'At least 1 special character', met: /[^A-Za-z0-9]/.test(password) }
  ];

  return (
    <div className="mt-2 space-y-1">
      {requirements.map((req, index) => (
        <div key={index} className="flex items-center text-xs">
          <div className={`mr-2 ${req.met ? 'text-green-500' : isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            {req.met ? <FaCheck size={12} /> : '○'}
          </div>
          <span className={`${
            req.met 
              ? 'text-green-500' 
              : isDarkMode 
                ? 'text-gray-400' 
                : 'text-gray-600'
          }`}>{req.text}</span>
        </div>
      ))}
    </div>
  );
};

// File Upload component
const FileUploadField = ({ id, name, label, icon, onChange, required = false, accept = "application/pdf,image/*" }) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [hasFile, setHasFile] = useState(false);
  
  // Get theme from Redux
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFileSize((file.size / 1024 / 1024).toFixed(2) + ' MB');
      setHasFile(true);
      onChange(file);
    } else {
      setFileName('');
      setFileSize('');
      setHasFile(false);
      onChange(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="space-y-1">
      <label htmlFor={id} className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div 
        onClick={triggerFileInput}
        className={`relative border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
          hasFile 
            ? isDarkMode 
              ? 'border-green-600 bg-green-900 bg-opacity-20' 
              : 'border-green-300 bg-green-50'
            : isDarkMode
              ? 'border-gray-600 hover:border-blue-600 hover:bg-blue-900 hover:bg-opacity-20' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
      >
        <input
          type="file"
          id={id}
          name={name}
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept={accept}
          required={required}
        />
        
        {hasFile ? (
          <div className="flex flex-col items-center">
            <FaFileAlt className={`h-8 w-8 ${isDarkMode ? 'text-green-400' : 'text-green-500'} mb-2`} />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center`}>{fileName}</span>
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{fileSize}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {icon || <FaUpload className={`h-8 w-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mb-2`} />}
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Click to upload {label}</span>
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center mt-1`}>
              PDF, JPG, PNG (Max. 5MB)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Account type selector
const AccountTypeSelector = ({ selectedType, setSelectedType }) => {
  // Get theme from Redux
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';

  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <button
        type="button"
        onClick={() => setSelectedType('personal')}
        className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 ${
          selectedType === 'personal' 
            ? isDarkMode
              ? 'border-blue-600 bg-blue-900 bg-opacity-20' 
              : 'border-blue-500 bg-blue-50'
            : isDarkMode
              ? 'border-gray-700 hover:border-gray-600'
              : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
          selectedType === 'personal' 
            ? isDarkMode
              ? 'bg-blue-800 text-blue-400'
              : 'bg-blue-100 text-blue-600' 
            : isDarkMode
              ? 'bg-gray-800 text-gray-400'
              : 'bg-gray-100 text-gray-500'
        }`}>
          <FaUser size={18} />
        </div>
        <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Personal</span>
        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>I am User</span>
      </button>
      
      <button
        type="button"
        onClick={() => setSelectedType('business')}
        className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 ${
          selectedType === 'business' 
            ? isDarkMode
              ? 'border-blue-600 bg-blue-900 bg-opacity-20' 
              : 'border-blue-500 bg-blue-50'
            : isDarkMode
              ? 'border-gray-700 hover:border-gray-600'
              : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
          selectedType === 'business' 
            ? isDarkMode
              ? 'bg-blue-800 text-blue-400'
              : 'bg-blue-100 text-blue-600' 
            : isDarkMode
              ? 'bg-gray-800 text-gray-400'
              : 'bg-gray-100 text-gray-500'
        }`}>
          <FaBriefcase size={18} />
        </div>
        <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Business</span>
        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>I am Lawyer</span>
      </button>
    </div>
  );
};

// Enhanced Signup Component with Integrated API Service
export const Signup = ({ onSignupSuccess }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState('personal');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState(null);
  
  // Lawyer-specific fields
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [copCertificate, setCopCertificate] = useState(null);
  const [enrollmentCertificate, setEnrollmentCertificate] = useState(null);
  const [addressProof, setAddressProof] = useState(null);

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    setFadeIn(true);
  }, []);
  
  // Reset lawyer-specific fields when account type changes
  useEffect(() => {
    if (accountType === 'personal') {
      setEnrollmentNo('');
      setCopCertificate(null);
      setEnrollmentCertificate(null);
      setAddressProof(null);
    }
  }, [accountType]);

    if (tokenManager.isAuthenticated()) {
       window.location.href = '/';
    }

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    // Auto dismiss toast after 5 seconds
    setTimeout(() => setToast(null), 5000);
  };

  // Email validation helper
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password strength checker
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const goToNextStep = (e) => {
    e.preventDefault();
    
    // Validation for step 1
    if (!email || password.length < 8 || !agreeTerms) {
      showToast('Please fill in all required fields and agree to the terms', 'error');
      return;
    }

    // Email format validation
    if (!isValidEmail(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    // Password strength validation
    if (getPasswordStrength(password) < 3) {
      showToast('Please create a stronger password with uppercase, numbers, and special characters', 'error');
      return;
    }

    setStep(2);
  };

  const goBackToStep = (e) => {
    e.preventDefault();
    setStep(1);
  };

  const passwordsMatch = password === confirmPassword || confirmPassword === '';

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Final validation for step 2
    if (!firstName.trim() || !lastName.trim() || !passwordsMatch || password !== confirmPassword) {
      showToast('Please fill in all required fields correctly', 'error');
      return;
    }
    
    // Additional validation for lawyer account type
    if (accountType === 'business') {
      if (!enrollmentNo.trim()) {
        showToast('Please enter your Enrollment Number', 'error');
        return;
      }
      
      if (!enrollmentCertificate) {
        showToast('Please upload your Certificate of Enrollment', 'error');
        return;
      }
      
      if (!copCertificate) {
        showToast('Please upload your Certificate of Practice (CoP)', 'error');
        return;
      }
    }
    
    setLoading(true);
    
    try {
      // Step 1: Get CSRF cookie first
      try {
        console.log('Getting CSRF cookie...');
        await authAPI.getCsrfCookie();
        console.log('CSRF cookie obtained successfully');
      } catch (csrfError) {
        console.error('Error getting CSRF cookie:', csrfError);
        // Continue with registration even if CSRF cookie fails
        // Some APIs don't require it
      }
      
      // Step 2: Prepare registration data
      const formData = new FormData();
      formData.append('name', `${firstName.trim()} ${lastName.trim()}`);
      formData.append('email', email.trim().toLowerCase());
      formData.append('password', password);
      formData.append('password_confirmation', confirmPassword);
      formData.append('account_type', accountType);
      
      // Add lawyer-specific fields if account type is business
      if (accountType === 'business') {
        // Use a local variable instead of modifying the state directly
        const accountTypeValue = 2;
        formData.append('account_type', accountTypeValue);
        formData.append('enrollment_no', enrollmentNo.trim());
        
        if (enrollmentCertificate) {
          formData.append('enrollment_certificate', enrollmentCertificate);
        }
        
        if (copCertificate) {
          formData.append('cop_certificate', copCertificate);
        }
        
        if (addressProof) {
          formData.append('address_proof', addressProof);
        }
      }
      
      // Convert to regular object for API that doesn't handle FormData
      const registrationData = {
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim().toLowerCase(),
        password: password,
        password_confirmation: confirmPassword,
        account_type: accountType === 'personal' ? 1 : 2
      };
      
      // Add lawyer-specific fields to the regular object
      if (accountType === 'business') {
        registrationData.enrollment_no = enrollmentNo.trim();
        // Note: Files will be handled by FormData, not included in this object
      }


      // Step 3: Send registration request using centralized API
      let response;
      
      // Use FormData for lawyer registration (with file uploads)
      if (accountType === 'business' && (enrollmentCertificate || copCertificate || addressProof)) {
        // Create a custom axios request with FormData
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          withCredentials: true
        };
        
        try {
          response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/register`, formData, config);
          console.log('FormData registration response:', response);
        } catch (formDataError) {
          console.error('FormData registration error:', formDataError);
          throw formDataError;
        }
      } else {
        // Use regular JSON request for standard registration
        try {
          response = await authAPI.register(registrationData);
          console.log('JSON registration response:', response);
        } catch (jsonError) {
          console.error('JSON registration error:', jsonError);
          throw jsonError;
        }
      }
      
      console.log('Registration response:', response.data);
      
      // Step 4: Handle successful registration
      if (response.data && (response.data.access_token || response.data.token)) {
        // Use token manager to store authentication data
        const token = response.data.access_token || response.data.token;
        tokenManager.setToken(token);
        
        if (response.data.user) {
          tokenManager.setUser(response.data.user);
        }

        showToast('Registration successful! Welcome to MeraBakil!', 'success');

        // Conditional redirect based on user_type
        setTimeout(() => {
          const userType = response?.data?.user?.user_type;

          if (userType === 1 || userType == 'personal') {
            // Normal user – stay on current route or go to homepage
            window.location.href = '/';
          } else {
            // Lawyer or other admin-type – redirect to Lawyer Admin Dashboard
            window.location.href = '/lawyer-admin';
          }
        }, 2000);

        
        // Call parent callback if provided
        if (onSignupSuccess) {
          setTimeout(() => {
            onSignupSuccess(response.data);
          }, 1500);
        }
      } else {
        showToast('Registration completed but authentication failed. Please try logging in.', 'warning');
        setTimeout(() => {
          window.location.href = '/auth';
        }, 2000);
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle different types of errors
      if (error.response?.status === 422) {
        // Laravel validation errors
        const validationErrors = error.response.data.errors;
        if (validationErrors) {
          // Get the first error message
          const firstErrorField = Object.keys(validationErrors)[0];
          const firstErrorMessage = validationErrors[firstErrorField][0];
          showToast(firstErrorMessage || 'Please check your input and try again', 'error');
          console.log('Validation errors:', validationErrors);
        } else {
          showToast('Please check your input and try again', 'error');
        }
      } else if (error.response?.status === 409) {
        // Conflict - email already exists
        showToast('This email is already registered. Please use a different email or try logging in.', 'error');
      } else if (error.response?.status === 429) {
        // Too many requests
        showToast('Too many registration attempts. Please try again later.', 'error');
      } else if (error.response?.data?.message) {
        // Other API errors with message
        showToast(error.response.data.message, 'error');
        console.log('API error message:', error.response.data);
      } else if (error.message === 'Network error. Please check your connection.') {
        // Network error handled by interceptor
        showToast('Network error. Please check your internet connection and try again.', 'error');
      } else if (error.message && error.message.includes('Assignment to constant variable')) {
        // Handle the specific error we were fixing
        showToast('There was an issue with the form submission. Please try again.', 'error');
        console.error('Assignment to constant variable error:', error);
      } else {
        // Generic error
        showToast('Registration failed. Please try again later.', 'error');
        console.error('Unhandled error during registration:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Get theme from Redux
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';

  return (
    <div className={`min-h-screen mt-6 flex flex-col relative overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Toast notification positioned on the right */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {isDarkMode ? (
          <>
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-900/20 rounded-full opacity-20"></div>
            <div className="absolute top-40 -right-20 w-60 h-60 bg-indigo-900/20 rounded-full opacity-10"></div>
            <div className="absolute bottom-20 left-20 w-40 h-40 bg-blue-900/20 rounded-full opacity-20"></div>
          </>
        ) : (
          <>
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-50 rounded-full opacity-30"></div>
            <div className="absolute top-40 -right-20 w-60 h-60 bg-blue-100 rounded-full opacity-20"></div>
            <div className="absolute bottom-20 left-20 w-40 h-40 bg-blue-50 rounded-full opacity-30"></div>
          </>
        )}
      </div>
      
      <LegalStrip />
      
      <div className="flex-1 flex items-center justify-center p-6 z-10">
        <div 
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl p-8 w-full max-w-md transition-all duration-700 transform ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{ boxShadow: isDarkMode 
            ? '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' 
            : '0 10px 25px -5px rgba(34, 87, 122, 0.1), 0 10px 10px -5px rgba(92, 172, 222, 0.05)' 
          }}
        >
          <div className="text-center mb-6">
            <Logo />
            <h2 className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Create your account</h2>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Join MeraBakil and start your journey</p>
          </div>
          
          {/* Step indicator */}
          {step === 2 && (
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                    <FaCheck />
                  </div>
                  <span className="text-sm font-medium text-blue-500">Account</span>
                </div>
                <div className="w-8 h-0.5 bg-blue-500"></div>
                <div className="flex items-center space-x-1">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                    2
                  </div>
                  <span className="text-sm font-medium text-blue-500">Details</span>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={step === 1 ? goToNextStep : handleSignup} className="space-y-4">
            {step === 1 ? (
              <>
                <AccountTypeSelector selectedType={accountType} setSelectedType={setAccountType} />
                
                <div className="space-y-1">
                  <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                  <InputField
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    icon={
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    }
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Create Password</label>
                  <InputField
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    icon={
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    }
                    rightIcon={showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                    onRightIconClick={() => setShowPassword(!showPassword)}
                  />
                  <PasswordStrengthIndicator password={password} />
                  {password && <PasswordRequirements password={password} />}
                </div>

                <div className="flex items-center">
                  <input
                    id="agree-terms"
                    name="agree-terms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="agree-terms" className={`ml-2 block text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    I agree to the <a href="#" className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>Terms of Service</a> and <a href="#" className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>Privacy Policy</a>
                  </label>
                </div>

                <div className="pt-2">
                  <Button type="submit" disabled={!email || password.length < 8 || !agreeTerms}>
                    Continue
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="first-name" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>First Name</label>
                    <InputField
                      type="text"
                      id="first-name"
                      name="first-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      icon={<FaUser className="h-5 w-5" />}
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="last-name" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Last Name</label>
                    <InputField
                      type="text"
                      id="last-name"
                      name="last-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      icon={<FaUser className="h-5 w-5" />}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="confirm-password" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Confirm Password</label>
                  <InputField
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm-password"
                    name="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    icon={
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    }
                    rightIcon={showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                    onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                  {confirmPassword && !passwordsMatch && (
                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                  )}
                </div>

                {/* Lawyer-specific fields */}
                {accountType === 'business' && (
                  <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`text-lg font-medium mb-3 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      <FaGavel className={`mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                      Lawyer Verification Details
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label htmlFor="enrollment-no" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Enrollment Number <span className="text-red-500">*</span>
                        </label>
                        <InputField
                          type="text"
                          id="enrollment-no"
                          name="enrollment-no"
                          value={enrollmentNo}
                          onChange={(e) => setEnrollmentNo(e.target.value)}
                          placeholder="Enter your enrollment number"
                          icon={<FaIdCard className="h-5 w-5" />}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FileUploadField
                          id="enrollment-certificate"
                          name="enrollment-certificate"
                          label="Certificate of Enrollment"
                          icon={<FaFileAlt className="h-8 w-8 text-gray-400 mb-2" />}
                          onChange={setEnrollmentCertificate}
                          required={true}
                        />
                        
                        <FileUploadField
                          id="cop-certificate"
                          name="cop-certificate"
                          label="Certificate of Practice (CoP)"
                          icon={<FaFileAlt className="h-8 w-8 text-gray-400 mb-2" />}
                          onChange={setCopCertificate}
                          required={true}
                        />
                      </div>
                      
                      <FileUploadField
                        id="address-proof"
                        name="address-proof"
                        label="Address and Identity Proof"
                        icon={<FaIdCard className="h-8 w-8 text-gray-400 mb-2" />}
                        onChange={setAddressProof}
                        required={false}
                      />
                      
                      <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-blue-900/20 border border-blue-800/30' : 'bg-blue-50 border border-blue-100'}`}>
                        <p className={`text-xs ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                          <strong>Note:</strong> Your lawyer verification documents will be reviewed by our team. 
                          Enrollment Number and certificates are required for verification.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-4 pt-4 mt-2">
                  <button
                    type="button"
                    onClick={goBackToStep}
                    className={`w-full py-3 px-4 rounded-md flex items-center justify-center font-medium transition-all duration-300 ${
                      isDarkMode 
                        ? 'text-gray-300 border border-gray-700 hover:bg-gray-800' 
                        : 'text-gray-600 border border-gray-300 hover:bg-gray-50'
                    }`}
                    disabled={loading}
                  >
                    Back
                  </button>
                  <Button 
                    type="submit" 
                    loading={loading}
                    disabled={
                      !firstName.trim() || 
                      !lastName.trim() || 
                      !passwordsMatch || 
                      confirmPassword === '' || 
                      (accountType === 'business' && (!enrollmentNo.trim() || !enrollmentCertificate || !copCertificate)) || 
                      loading
                    }
                  >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </Button>
                </div>
              </>
            )}
          </form>

          {step === 1 && (
            <>
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className={`w-full border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className={`px-4 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>or sign up with</span>
                  </div>
                </div>
                
                <SocialButtons />
              </div>
              
              <p className={`mt-8 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Already have an account?{' '}
                <a href="/auth" className={`font-medium ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} transition-all duration-200 underline-offset-2 hover:underline`}>
                  Sign in instead
                </a>
              </p>
            </>
          )}
        </div>
      </div>
      
      <div className={`py-3 text-center text-xs ${isDarkMode ? 'text-gray-500 bg-gray-900 border-t border-gray-800' : 'text-gray-500 bg-gray-50 border-t border-gray-100'}`}>
        © 2025 MeraBakil. All rights reserved.
      </div>
    </div>
  );
};