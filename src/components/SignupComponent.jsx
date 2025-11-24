// SignupComponent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FaFacebook, FaGoogle, FaLinkedin, FaEye, FaEyeSlash, FaShieldAlt, FaUser, FaBriefcase, FaCheck, FaCheckCircle, FaExclamationCircle, FaUpload, FaFileAlt, FaIdCard, FaGavel, FaApple, FaMicrosoft } from 'react-icons/fa';
import { Scale, Check } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
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

// Premium Legal strip component with black/silver/blue accents
const LegalStrip = () => {
  return (
    <div className="relative w-full py-2.5 px-4 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-gray-200 text-xs font-light flex items-center justify-between overflow-hidden border-b border-gray-800">
      {/* Silver shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/10 to-transparent"></div>
      {/* Blue accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      
      <div className="relative z-10 flex items-center">
        <FaShieldAlt className="mr-2 text-blue-400" />
        <span className="text-gray-300">Secure Authentication | ISO 27001 Certified</span>
      </div>
      <div className="relative z-10">
        <a href="#" className="hover:text-blue-400 hover:underline transition-all duration-200">Privacy Policy</a>
        <span className="mx-2 text-gray-600">|</span>
        <a href="#" className="hover:text-blue-400 hover:underline transition-all duration-200">Terms of Service</a>
      </div>
    </div>
  );
};

// Premium Logo component with black/silver gradient and Scale icon
const Logo = () => {
  return (
    <div className="flex justify-center mb-4">
      <div 
        className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300 overflow-hidden border border-gray-700/50"
        style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)" }}
      >
        {/* Silver shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-400/10 to-transparent"></div>
        <Scale size={24} className="relative z-10 text-white drop-shadow-lg" strokeWidth={2} />
      </div>
    </div>
  );
};

// Premium Button component with black/silver/blue shine - Compact version
const Button = ({ children, loading, onClick, className, type = "button", disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      type={type}
      className={`group w-full py-2.5 px-4 rounded-lg flex items-center justify-center text-white text-sm font-semibold shadow-md transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none border ${className}`}
      style={{ 
        background: (loading || disabled) 
          ? "linear-gradient(135deg, #4a5568 0%, #2d3748 100%)" 
          : "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 25%, #1a1a1a 50%, #2563eb 75%, #1e40af 100%)",
        borderColor: disabled ? "#4a5568" : "rgba(59, 130, 246, 0.3)"
      }}
    >
      {/* Silver shine animation */}
      {!loading && !disabled && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
      )}
      
      {/* Blue accent glow */}
      {!loading && !disabled && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      )}
      
      {/* Top highlight for depth */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent via-transparent to-white/5"></div>
      
      <span className="relative z-10 flex items-center tracking-wide">
        {loading ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : null}
        {children}
      </span>
    </button>
  );
};

// Premium Custom Checkbox Component
const CustomCheckbox = ({ id, checked, onChange, label, disabled = false, isDarkMode }) => {
  return (
    <div className="flex items-center">
      <div className="relative flex items-center">
        {/* Hidden native checkbox for accessibility */}
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
        />
        {/* Custom checkbox visual */}
        <label
          htmlFor={id}
          className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-all duration-200 cursor-pointer ${
            disabled ? 'opacity-60 cursor-not-allowed' : 'hover:scale-110'
          } ${
            checked
              ? isDarkMode
                ? 'bg-white border-white'
                : 'bg-gray-900 border-gray-900'
              : isDarkMode
              ? 'bg-gray-800 border-gray-600 hover:border-gray-500'
              : 'bg-white border-gray-300 hover:border-gray-400'
          }`}
        >
          {/* Checkmark icon */}
          {checked && (
            <Check 
              size={14} 
              className={`${isDarkMode ? 'text-gray-900' : 'text-white'}`} 
              strokeWidth={3}
            />
          )}
        </label>
      </div>
      {/* Label text */}
      <label 
        htmlFor={id} 
        className={`ml-2.5 block text-xs cursor-pointer select-none ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        {label}
      </label>
    </div>
  );
};

// Professional Social Login Buttons
const SocialButtons = ({ onSocialLogin, loading, onGoogleLogin }) => {
  // Get theme from Redux
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log('Google signup successful:', tokenResponse);
      if (onGoogleLogin) {
        onGoogleLogin(tokenResponse.access_token);
      }
    },
    onError: (error) => {
      console.error('Google signup failed:', error);
      if (onSocialLogin) {
        onSocialLogin('google', { error: 'Google signup failed. Please try again.' });
      }
    }
  });

  const socialButtonClass = `w-full py-2.5 px-4 rounded-lg flex items-center justify-center space-x-3 font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none ${
    isDarkMode 
      ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 hover:border-gray-500' 
      : 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300 shadow-sm'
  }`;

  return (
    <div className="space-y-2.5">
      <button 
        onClick={() => googleLogin()}
        disabled={loading}
        className={socialButtonClass}
        aria-label="Continue with Google"
      >
        <FaGoogle className="text-red-500" size={18} />
        <span className="text-sm">Continue with Google</span>
      </button>
      
      {/* <button 
        onClick={() => onSocialLogin && onSocialLogin('apple')}
        disabled={loading}
        className={socialButtonClass}
        aria-label="Continue with Apple"
      >
        <FaApple className="text-gray-900" size={18} />
        <span className="text-sm">Continue with Apple</span>
      </button>
      
      <button 
        onClick={() => onSocialLogin && onSocialLogin('microsoft')}
        disabled={loading}
        className={socialButtonClass}
        aria-label="Continue with Microsoft"
      >
        <FaMicrosoft className="text-blue-600" size={16} />
        <span className="text-sm">Continue with Microsoft</span>
      </button>
      
      <button 
        onClick={() => onSocialLogin && onSocialLogin('facebook')}
        disabled={loading}
        className={socialButtonClass}
        aria-label="Continue with Facebook"
      >
        <FaFacebook className="text-blue-600" size={18} />
        <span className="text-sm">Continue with Facebook</span>
      </button> */}
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
          ? 'text-gray-500 group-focus-within:text-gray-300' 
          : 'text-gray-400 group-focus-within:text-gray-600'
      } transition-colors duration-200`}>
        {icon}
      </div>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`block w-full pl-9 pr-10 py-2.5 text-sm rounded-lg shadow-sm transition-all duration-300 ${
          isDarkMode 
            ? 'border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/30 focus:border-gray-500' 
            : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400'
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
    <div className="grid grid-cols-2 gap-3 mb-3">
      <button
        type="button"
        onClick={() => setSelectedType('personal')}
        className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 ${
          selectedType === 'personal' 
            ? isDarkMode
              ? 'border-white bg-gray-700' 
              : 'border-gray-900 bg-gray-50'
            : isDarkMode
              ? 'border-gray-700 hover:border-gray-600'
              : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 ${
          selectedType === 'personal' 
            ? isDarkMode
              ? 'bg-white text-gray-900'
              : 'bg-gray-900 text-white' 
            : isDarkMode
              ? 'bg-gray-800 text-gray-400'
              : 'bg-gray-100 text-gray-500'
        }`}>
          <FaUser size={14} />
        </div>
        <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Personal</span>
        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>I am User</span>
      </button>
      
      <button
        type="button"
        onClick={() => setSelectedType('business')}
        className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 ${
          selectedType === 'business' 
            ? isDarkMode
              ? 'border-white bg-gray-700' 
              : 'border-gray-900 bg-gray-50'
            : isDarkMode
              ? 'border-gray-700 hover:border-gray-600'
              : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 ${
          selectedType === 'business' 
            ? isDarkMode
              ? 'bg-white text-gray-900'
              : 'bg-gray-900 text-white' 
            : isDarkMode
              ? 'bg-gray-800 text-gray-400'
              : 'bg-gray-100 text-gray-500'
        }`}>
          <FaBriefcase size={14} />
        </div>
        <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Business</span>
        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>I am Lawyer</span>
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
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState(null);
  
  // Lawyer-specific fields
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [copCertificate, setCopCertificate] = useState(null);
  const [enrollmentCertificate, setEnrollmentCertificate] = useState(null);
  const [addressProof, setAddressProof] = useState(null);
  
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

    // Password strength validation - All 4 requirements must be met
    if (getPasswordStrength(password) < 4) {
      showToast('Password must contain 8+ characters, uppercase, number, and special character', 'error');
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

          if (userType === 1 || userType === 'personal') {
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

  // Handle social signup
  const handleSocialSignup = (provider, error = null) => {
    if (loading) return;
    
    if (error) {
      showToast(error.error || 'Social signup failed', 'error');
      return;
    }
    
    if (provider !== 'google') {
      showToast(`${provider.charAt(0).toUpperCase() + provider.slice(1)} signup coming soon!`, 'info');
    }
    // Google signup is handled by onGoogleSignup function
  };

  // Handle Google OAuth signup
  const handleGoogleSignup = async (googleToken) => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      showToast('Signing up with Google...', 'info');
      
      // Call the Google login API (which can also handle signup)
      const response = await authAPI.googleLogin(googleToken);
      
      console.log('Google signup successful:', response.data);
      
      if (response.data.access_token) {
        // Store authentication data
        tokenManager.setToken(response.data.access_token);
        
        if (response.data.user) {
          tokenManager.setUser(response.data.user);
        }

        showToast(
          `Welcome${response.data.user?.name ? `, ${response.data.user.name}` : ''}! Registration successful!`,
          'success'
        );

        // Call parent callback if provided
        if (onSignupSuccess) {
          onSignupSuccess(response.data);
        }

        // Redirect after showing success message
        setTimeout(() => {
          const userType = response?.data?.user?.user_type;

          if (userType === 1 || userType === 'personal') {
            // Normal user – stay on current route or go to homepage
            window.location.href = '/';
          } else {
            // Lawyer or other admin-type – redirect to Lawyer Admin Dashboard
            window.location.href = '/lawyer-admin';
          }
        }, 1500);

      } else {
        showToast('Google signup completed but authentication token was not received. Please try again.', 'warning');
      }
      
    } catch (error) {
      console.error('Google signup error:', error);
      
      // Handle different types of errors
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        if (validationErrors) {
          const firstErrorField = Object.keys(validationErrors)[0];
          const firstErrorMessage = validationErrors[firstErrorField][0];
          showToast(firstErrorMessage || 'Please check your input and try again', 'error');
        } else {
          showToast('Please check your input and try again', 'error');
        }
      } else if (error.response?.status === 409) {
        showToast('This Google account is already registered. Please try logging in instead.', 'error');
      } else if (error.response?.data?.message) {
        showToast(error.response.data.message, 'error');
      } else {
        showToast('Google signup failed. Please try again later.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Get theme from Redux
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';

  return (
    <div className={`min-h-screen mt-6 flex flex-col relative overflow-hidden ${isDarkMode ? 'bg-[#0A0A0A]' : 'bg-white'}`}>
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
      
      <div className="flex-1 flex items-center justify-center p-4 z-10">
        <div 
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl p-6 w-full max-w-md`}
          style={{ boxShadow: isDarkMode ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)' : '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
        >
          <div className="text-center mb-5">
            <Logo />
            <h2 className={`text-xl font-bold mb-1.5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Create Account</h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Join Mera Vakil today</p>
          </div>
          
          {/* Step indicator */}
          {step === 2 && (
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'}`}>
                    <FaCheck size={10} />
                  </div>
                  <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Account</span>
                </div>
                <div className={`w-6 h-0.5 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                <div className="flex items-center space-x-1">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'}`}>
                    2
                  </div>
                  <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Details</span>
                </div>
              </div>
            </div>
          )}

          {/* Social Login Buttons Section - Only show on step 1 */}
          {step === 1 && (
            <>
              <div className="mb-4">
                <SocialButtons 
                  onSocialLogin={handleSocialSignup} 
                  onGoogleLogin={handleGoogleSignup}
                  loading={loading} 
                />
              </div>

              {/* OR Divider */}
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className={`px-3 ${isDarkMode ? 'bg-gray-800 text-gray-500' : 'bg-white text-gray-500'} font-medium`}>OR</span>
                </div>
              </div>
            </>
          )}

          <form onSubmit={step === 1 ? goToNextStep : handleSignup} className="space-y-4">
            {step === 1 ? (
              <>
                <AccountTypeSelector selectedType={accountType} setSelectedType={setAccountType} />
                
                <div className="space-y-1.5">
                  <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                  <InputField
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    icon={
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="password" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Create Password</label>
                  <InputField
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    icon={
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    }
                    rightIcon={showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                    onRightIconClick={() => setShowPassword(!showPassword)}
                  />
                  <PasswordStrengthIndicator password={password} />
                  {password && <PasswordRequirements password={password} />}
                </div>

                <div className="flex items-center">
                  <div className="relative flex items-center">
                    {/* Hidden native checkbox for accessibility */}
                    <input
                      id="agree-terms"
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="sr-only"
                      required
                    />
                    {/* Custom checkbox visual */}
                    <label
                      htmlFor="agree-terms"
                      className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-all duration-200 cursor-pointer hover:scale-110 ${
                        agreeTerms
                          ? isDarkMode
                            ? 'bg-white border-white'
                            : 'bg-gray-900 border-gray-900'
                          : isDarkMode
                          ? 'bg-gray-800 border-gray-600 hover:border-gray-500'
                          : 'bg-white border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {/* Checkmark icon */}
                      {agreeTerms && (
                        <Check 
                          size={14} 
                          className={`${isDarkMode ? 'text-gray-900' : 'text-white'}`} 
                          strokeWidth={3}
                        />
                      )}
                    </label>
                  </div>
                  {/* Label text with links */}
                  <label htmlFor="agree-terms" className={`ml-2.5 block text-xs cursor-pointer select-none ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    I agree to the <a href="#" onClick={(e) => e.stopPropagation()} className={`${isDarkMode ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-700'} underline`}>Terms</a> and <a href="#" onClick={(e) => e.stopPropagation()} className={`${isDarkMode ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-700'} underline`}>Privacy Policy</a>
                  </label>
                </div>

                <div className="pt-1">
                  <Button type="submit" disabled={!email || getPasswordStrength(password) < 4 || !agreeTerms}>
                    Continue
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="first-name" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>First Name</label>
                    <InputField
                      type="text"
                      id="first-name"
                      name="first-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      icon={<FaUser className="h-4 w-4" />}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="last-name" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Last Name</label>
                    <InputField
                      type="text"
                      id="last-name"
                      name="last-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      icon={<FaUser className="h-4 w-4" />}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
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
                      <div className="space-y-2">
                        <label htmlFor="enrollment-no" className={`block text-base font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
                    className={`w-full py-2.5 px-4 rounded-lg flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
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
              <p className={`mt-8 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Already have an account?{' '}
                <a href="/auth" className={`font-medium ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-900 hover:text-gray-700'} transition-all duration-200 underline-offset-2 hover:underline`}>
                  Sign in instead
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};