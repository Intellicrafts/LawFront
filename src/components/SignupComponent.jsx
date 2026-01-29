import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Scale, Check, User as UserIcon, Briefcase as BriefcaseIcon, Shield, Mail, Lock,
  Upload, FileText, CheckCircle, ArrowRight, ArrowLeft, Eye, EyeOff, AlertCircle, Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { authAPI, tokenManager } from '../api/apiService';

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
      className={`fixed top-16 right-4 flex items-center p-4 rounded-lg shadow-lg transition-all duration-300 z-50 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
        } ${getToastStyles()}`}
      role="alert"
      style={{ maxWidth: '90%', width: '400px' }}
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 mr-3 rounded-lg">
        {type === 'success' ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-500" />
        )}
      </div>
      <div className="ml-3 text-sm font-medium">{message}</div>
      <button
        type="button"
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className={`ml-auto -mx-1.5 -my-1.5 ${isDarkMode
          ? 'bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700'
          : 'bg-white text-gray-400 hover:text-gray-900 hover:bg-gray-100'
          } rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex items-center justify-center h-8 w-8`}
      >
        <span className="sr-only">Close</span>
        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
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
        <Shield className="mr-2 text-blue-400" />
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
          className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-all duration-200 cursor-pointer ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:scale-110'
            } ${checked
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
        className={`ml-2.5 block text-xs cursor-pointer select-none ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
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

  const socialButtonClass = `w-full py-2.5 px-4 rounded-lg flex items-center justify-center space-x-3 font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none ${isDarkMode
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
        <Smartphone className="text-red-500" size={18} />
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
      <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isDarkMode
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
        className={`block w-full pl-9 pr-10 py-2.5 text-sm rounded-lg shadow-sm transition-all duration-300 ${isDarkMode
          ? 'border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/30 focus:border-gray-500'
          : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400'
          }`}
        placeholder={placeholder}
        required
      />
      {rightIcon && (
        <button
          type="button"
          className={`absolute inset-y-0 right-0 pr-3 flex items-center ${isDarkMode
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
            {req.met ? <Check size={12} /> : '○'}
          </div>
          <span className={`${req.met
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
        className={`relative border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${hasFile
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
            <FileText className={`h-8 w-8 ${isDarkMode ? 'text-green-400' : 'text-green-500'} mb-2`} />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center`}>{fileName}</span>
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{fileSize}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {icon || <Upload className={`h-8 w-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mb-2`} />}
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
        className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 ${selectedType === 'personal'
          ? isDarkMode
            ? 'border-white bg-gray-700'
            : 'border-gray-900 bg-gray-50'
          : isDarkMode
            ? 'border-gray-700 hover:border-gray-600'
            : 'border-gray-200 hover:border-gray-300'
          }`}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 ${selectedType === 'personal'
          ? isDarkMode
            ? 'bg-white text-gray-900'
            : 'bg-gray-900 text-white'
          : isDarkMode
            ? 'bg-gray-800 text-gray-400'
            : 'bg-gray-100 text-gray-500'
          }`}>
          <UserIcon size={14} />
        </div>
        <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Personal</span>
        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>I am User</span>
      </button>

      <button
        type="button"
        onClick={() => setSelectedType('business')}
        className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 ${selectedType === 'business'
          ? isDarkMode
            ? 'border-white bg-gray-700'
            : 'border-gray-900 bg-gray-50'
          : isDarkMode
            ? 'border-gray-700 hover:border-gray-600'
            : 'border-gray-200 hover:border-gray-300'
          }`}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 ${selectedType === 'business'
          ? isDarkMode
            ? 'bg-white text-gray-900'
            : 'bg-gray-900 text-white'
          : isDarkMode
            ? 'bg-gray-800 text-gray-400'
            : 'bg-gray-100 text-gray-500'
          }`}>
          <BriefcaseIcon size={14} />
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
    <div className={`relative flex flex-col pt-20 pb-12 ${isDarkMode ? 'bg-[#0A0A0A]' : 'bg-gray-50/30'}`}>
      <AnimatePresence mode="wait">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Premium Animated Background Layer */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.08, 0.05] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className={`absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full blur-[120px] ${isDarkMode ? 'bg-indigo-600' : 'bg-blue-200'}`}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 2 }}
          className={`absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full blur-[100px] ${isDarkMode ? 'bg-blue-500' : 'bg-indigo-200'}`}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-start justify-center px-4 sm:px-6 lg:px-8 z-10"
      >
        <div
          className={`w-full max-w-lg overflow-hidden transition-all duration-300
            ${isDarkMode ? 'bg-[#121212] border border-gray-800 shadow-2xl shadow-black/50' : 'bg-white border border-gray-100 shadow-2xl shadow-blue-500/5'}
            rounded-2xl p-6 sm:p-8`}
        >
          <div className="text-center mb-6">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}>
              <Logo />
            </motion.div>
            <h2 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>Create Account</h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Join Mera Vakil's professional legal network</p>
          </div>

          <div className="flex items-center justify-center mb-8 gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step >= 1 ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                {step > 1 ? <Check size={14} /> : '1'}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= 1 ? 'text-blue-500' : 'text-gray-400'}`}>Account</span>
            </div>
            <div className={`h-px w-8 ${step > 1 ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-800'}`}></div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step === 2 ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                2
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${step === 2 ? 'text-blue-500' : 'text-gray-400'}`}>Personal</span>
            </div>
          </div>

          <form onSubmit={step === 1 ? goToNextStep : handleSignup} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <SocialButtons onSocialLogin={handleSocialSignup} onGoogleLogin={handleGoogleSignup} loading={loading} />

                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-gray-100 dark:border-gray-800"></div>
                      <span className="flex-shrink mx-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Enroll With</span>
                      <div className="flex-grow border-t border-gray-100 dark:border-gray-800"></div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">I am a:</label>
                      <AccountTypeSelector selectedType={accountType} setSelectedType={setAccountType} />
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <label htmlFor="email" className="text-xs font-bold uppercase text-gray-500 tracking-wider">Email Address</label>
                      <InputField
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="lawyer@meravakil.com"
                        icon={<Mail size={16} />}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="password" className="text-xs font-bold uppercase text-gray-500 tracking-wider">Security Access</label>
                      <InputField
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        icon={<Lock size={16} />}
                        rightIcon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        onRightIconClick={() => setShowPassword(!showPassword)}
                      />
                      <PasswordStrengthIndicator password={password} />
                    </div>

                    <div className="flex items-center py-2">
                      <CustomCheckbox
                        id="agree-terms"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        label="I certify the accuracy of provided information"
                        isDarkMode={isDarkMode}
                      />
                    </div>

                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                      <Button type="submit" disabled={!email || password.length < 8 || !agreeTerms || loading}>
                        Proceed to Identity <ArrowRight size={18} className="ml-2" />
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">First Name</label>
                      <InputField type="text" id="firstName" name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} icon={<UserIcon size={16} />} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Last Name</label>
                      <InputField type="text" id="lastName" name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} icon={<UserIcon size={16} />} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Confirm Security Access</label>
                    <InputField
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      icon={<Lock size={16} />}
                      rightIcon={showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                    {!passwordsMatch && confirmPassword && (
                      <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">Credential mismatch detected</p>
                    )}
                  </div>

                  {accountType === 'business' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 pt-2"
                    >
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Bar Council Enrollment No.</label>
                        <InputField type="text" id="enrollmentNo" name="enrollmentNo" value={enrollmentNo} onChange={(e) => setEnrollmentNo(e.target.value)} icon={<Scale size={16} />} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FileUploadField id="enrollmentCert" label="Enrollment Cert." onChange={setEnrollmentCertificate} required />
                        <FileUploadField id="copCert" label="CoP Certificate" onChange={setCopCertificate} required />
                      </div>
                    </motion.div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={goBackToStep}
                      className={`flex-1 h-12 rounded-xl border font-bold text-sm flex items-center justify-center transition-all ${isDarkMode ? 'border-gray-800 text-gray-400 hover:bg-gray-800' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                    >
                      <ArrowLeft size={18} className="mr-2" /> Back
                    </button>
                    <motion.div className="flex-[2]" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        loading={loading}
                        disabled={!firstName.trim() || !lastName.trim() || !passwordsMatch || loading}
                      >
                        Finalize Enrollment
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <div className="pt-8 text-center border-t border-gray-100 dark:border-gray-800 mt-6">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Already part of the network? <a href="/auth" className="font-bold text-blue-500 hover:text-blue-600 transition-colors">Sign In Now</a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};