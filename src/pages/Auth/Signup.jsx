import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Scale, Check, User as UserIcon, Briefcase as BriefcaseIcon, Shield, Mail, Lock,
  Upload, FileText, CheckCircle, ArrowRight, ArrowLeft, Eye, EyeOff, AlertCircle, Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import axios from 'axios';
import { authAPI, tokenManager, walletAPI } from '../../api/apiService';
import { useToast } from '../../context/ToastContext';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';




// Minimal legal strip
const LegalStrip = () => {
  return (
    <div className="relative w-full py-2 px-4 bg-gradient-to-r from-brand-900 via-brand-950 to-brand-900 text-gray-300 text-xs font-light flex items-center justify-between overflow-hidden border-b border-brand-800">
      <div className="relative z-10 flex items-center gap-2">
        <Lock className="h-3 w-3 text-brand-400" />
        <span>Secure · 256-bit Encrypted</span>
      </div>
      <div className="relative z-10 flex items-center gap-3">
        <a href="/privacy-policy" className="hover:text-brand-300 transition-colors">Privacy Policy</a>
        <span className="text-gray-600">·</span>
        <a href="/terms-of-service" className="hover:text-brand-300 transition-colors">Terms of Service</a>
      </div>
    </div>
  );
};

// Brand Logo component
const Logo = () => {
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';
  return (
    <div className="flex justify-center mb-4">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${isDarkMode ? 'bg-brand-500/10' : 'bg-brand-50'}`}>
        <Scale size={22} className="text-brand-500" strokeWidth={2.5} />
        <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-brand-900'}`}>MeraBakil</span>
      </div>
    </div>
  );
};

// Brand Button component
const Button = ({ children, loading, onClick, className, type = "button", disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      type={type}
      className={`group w-full py-2.5 px-4 rounded-xl flex items-center justify-center text-white text-sm font-semibold shadow-md transition-all duration-200 hover:shadow-lg relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed bg-brand-500 hover:bg-brand-600 ${className}`}
    >
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

  useGoogleOneTapLogin({
    onSuccess: (tokenResponse) => {
      console.log('Google One Tap signup successful:', tokenResponse);
      if (onGoogleLogin) {
        onGoogleLogin(tokenResponse.credential);
      }
    },
    onError: (error) => {
      console.log('Google One Tap signup failed or dismissed:', error);
    },
    auto_select: true
  });

  const socialButtonClass = `w-full py-2.5 px-4 rounded-lg flex items-center justify-center space-x-3 font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none ${isDarkMode
    ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 hover:border-gray-500'
    : 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300 shadow-sm'
    }`;

  return (
    <div className="space-y-2.5">
      <button
        type="button"
        onClick={() => googleLogin()}
        disabled={loading}
        className={socialButtonClass}
        aria-label="Continue with Google"
      >
        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
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
            ? 'border-brand-500 bg-brand-500/10'
            : 'border-brand-500 bg-brand-50'
          : isDarkMode
            ? 'border-gray-700 hover:border-gray-600'
            : 'border-gray-200 hover:border-gray-300'
          }`}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 ${selectedType === 'personal'
          ? 'bg-brand-500 text-white'
          : isDarkMode
            ? 'bg-gray-800 text-gray-400'
            : 'bg-gray-100 text-gray-500'
          }`}>
          <UserIcon size={14} />
        </div>
        <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Client</span>
        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>I need legal help</span>
      </button>

      <button
        type="button"
        onClick={() => setSelectedType('business')}
        className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 ${selectedType === 'business'
          ? isDarkMode
            ? 'border-brand-500 bg-brand-500/10'
            : 'border-brand-500 bg-brand-50'
          : isDarkMode
            ? 'border-gray-700 hover:border-gray-600'
            : 'border-gray-200 hover:border-gray-300'
          }`}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 ${selectedType === 'business'
          ? 'bg-brand-500 text-white'
          : isDarkMode
            ? 'bg-gray-800 text-gray-400'
            : 'bg-gray-100 text-gray-500'
          }`}>
          <BriefcaseIcon size={14} />
        </div>
        <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Lawyer</span>
        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>I provide legal services</span>
      </button>
    </div>
  );
};

// Enhanced Signup Component with Integrated API Service
export const Signup = ({ onSignupSuccess }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState('personal');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { showSuccess, showError, showInfo, showWarning } = useToast();
  const navigate = useNavigate();

  // Lawyer-specific fields
  const [enrollmentNo, setEnrollmentNo] = useState('');

  // Reset lawyer-specific fields when account type changes
  useEffect(() => {
    if (accountType === 'personal') {
      setEnrollmentNo('');
    }
  }, [accountType]);

  useEffect(() => {
    if (tokenManager.isAuthenticated()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

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
      showError('Please fill in all required fields and agree to the terms');
      return;
    }

    // Email format validation
    if (!isValidEmail(email)) {
      showError('Please enter a valid email address');
      return;
    }

    // Password strength validation - All 4 requirements must be met
    if (getPasswordStrength(password) < 4) {
      showError('Password must contain 8+ characters, uppercase, number, and special character');
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
    if (!firstName.trim() || !lastName.trim() || !phoneNumber.trim() || !passwordsMatch || password !== confirmPassword) {
      showError('Please fill in all required fields correctly');
      return;
    }

    if (phoneNumber.replace(/\D/g, '').length < 10) {
      showError('Please enter a valid phone number (min. 10 digits)');
      return;
    }

    // Additional validation for lawyer account type
    if (accountType === 'business') {
      if (!enrollmentNo.trim()) {
        showError('Please enter your Enrollment Number');
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
      formData.append('phone', phoneNumber.trim());
      formData.append('password', password);
      formData.append('password_confirmation', confirmPassword);
      formData.append('account_type', accountType);

      // Convert to regular object for API that doesn't handle FormData
      const registrationData = {
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim().toLowerCase(),
        phone: phoneNumber.trim(),
        password: password,
        password_confirmation: confirmPassword,
        account_type: accountType === 'personal' ? 1 : 2
      };

      // Add lawyer-specific fields to the regular object
      if (accountType === 'business') {
        registrationData.enrollment_no = enrollmentNo.trim();
      }

      // Step 3: Send registration request using centralized API
      let response;

      // Use regular JSON request for standard registration
      try {
        response = await authAPI.register(registrationData);
        console.log('JSON registration response:', response);
      } catch (jsonError) {
        console.error('JSON registration error:', jsonError);
        throw jsonError;
      }

      console.log('Registration response:', response.data);

      // Step 4: Handle successful registration
      if (response.data && (response.data.access_token || response.data.token)) {

        // Store tokens silently first so they are ready for wallet creation
        const token = response.data.access_token || response.data.token;
        tokenManager.setToken(token);
        if (response.data.user) {
          tokenManager.setUser(response.data.user);
        }

        // === START: Auto-create Wallet ===
        try {
          if (response.data.user && response.data.user.id) {
            const userTypeStr = accountType === 'business' ? 'LAWYER' : 'CUSTOMER';
            const walletPayload = {
              user_id: response.data.user.id.toString(),
              user_type: userTypeStr,
              currency: 'INR'
            };
            await walletAPI.createWallet(walletPayload);
            
            // The backend automatically grants 499 INR promotional Welcome Bonus upon creation
            // We just need to trigger the frontend ceremony
            sessionStorage.setItem('showPromoCeremony', '499');
            
            // showSuccess('Wallet initialized successfully'); // Hiding to avoid double-toasts
          }
        } catch (walletError) {
          console.error('Error auto-creating wallet:', walletError.message);
          let errorMsg = 'Failed to initialize wallet.';
          if (walletError.response && walletError.response.data) {
            errorMsg = `Wallet Error: ${walletError.response.data.detail || JSON.stringify(walletError.response.data)}`;
          }
          // Soft fail - allow the user to complete signup and login flow
          console.warn('Wallet creation failed, but proceeding with login:', errorMsg);
        }
        // === END: Auto-create Wallet ===

        // Set flag to trigger onboarding tour for new signups
        sessionStorage.setItem('isSignupSession', 'true');

        // For lawyer signups, store enrollment number so the verification
        // banner can auto-trigger Satyapan API even if the profile endpoint
        // doesn't return enrollment_no in the response object
        if (accountType === 'business' && enrollmentNo.trim()) {
          sessionStorage.setItem('lawyerEnrollmentNo', enrollmentNo.trim());
        }

        showSuccess('Registration successful! Welcome to MeraBakil!');

        // Wait for the user to see the success message before doing ANY state changes
        // that would unmount the signup component and cause flickering
        setTimeout(() => {
          // Dispatch event to notify other components of authentication change
          // Doing this inside the timeout prevents the Navbar/Router from instantly
          // jerking the user away while the toast is still trying to render
          window.dispatchEvent(new CustomEvent('auth-status-changed', {
            detail: { authenticated: true, user: response.data.user }
          }));

          const user = response?.data?.user;
          const userType = user?.user_type;
          const role = user?.role?.toLowerCase();

          // If a redirect URL is explicitly provided in query string, use that
          const urlRedirectParam = new URLSearchParams(window.location.search).get('redirect');
          let redirectUrl = '/';

          if (urlRedirectParam) {
            redirectUrl = urlRedirectParam;
          } else if (userType === 2 || userType === 'business' || userType === 'lawyer' || role === 'lawyer') {
            redirectUrl = '/lawyer-admin';
          } else if (userType === 1 || userType === 'personal' || userType === 'user' || role === 'user' || role === 'client') {
            redirectUrl = '/';
          } else if (userType === null || userType === undefined || userType === 0) {
            redirectUrl = '/profile-setup/type-selection';
          }

          console.log(`Signup - Redirecting user (type: ${userType}, role: ${role}) to: ${redirectUrl}`);

          if (onSignupSuccess) {
            onSignupSuccess(response.data);
          }

          navigate(redirectUrl, { replace: true });
        }, 1500);

      } else {
        showWarning('Registration completed but authentication failed. Please try logging in.');
        setTimeout(() => {
          navigate('/auth');
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
          showError(firstErrorMessage || 'Please check your input and try again');
          console.log('Validation errors:', validationErrors);
        } else {
          showError('Please check your input and try again');
        }
      } else if (error.response?.status === 409) {
        // Conflict - email already exists
        showError('This email is already registered. Please use a different email or try logging in.');
      } else if (error.response?.status === 429) {
        // Too many requests
        showError('Too many registration attempts. Please try again later.');
      } else if (error.response?.data?.message) {
        // Other API errors with message
        showError(error.response.data.message);
        console.log('API error message:', error.response.data);
      } else if (error.message === 'Network error. Please check your connection.') {
        // Network error handled by interceptor
        showError('Network error. Please check your internet connection and try again.');
      } else if (error.message && error.message.includes('Assignment to constant variable')) {
        // Handle the specific error we were fixing
        showError('There was an issue with the form submission. Please try again.');
        console.error('Assignment to constant variable error:', error);
      } else {
        // Generic error
        showError('Registration failed. Please try again later.');
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
      showError(error.error || 'Social signup failed');
      return;
    }

    if (provider !== 'google') {
      showInfo(`${provider.charAt(0).toUpperCase() + provider.slice(1)} signup coming soon!`);
    }
    // Google signup is handled by onGoogleSignup function
  };

  // Handle Google OAuth signup
  const handleGoogleSignup = async (googleToken) => {
    if (loading) return;

    setLoading(true);

    try {
      // Call the Google login API (which can also handle signup)
      const response = await authAPI.googleLogin(googleToken);

      console.log('Google signup successful:', response.data);

      if (response.data.data && (response.data.data.token || response.data.data.access_token)) {
        // Store authentication data
        const token = response.data.data.token || response.data.data.access_token;
        tokenManager.setToken(token);

        if (response.data.data.user) {
          tokenManager.setUser(response.data.data.user);
        }

        // Dispatch event to notify other components of authentication change
        window.dispatchEvent(new CustomEvent('auth-status-changed', {
          detail: { authenticated: true, user: response.data.data.user }
        }));

        showSuccess(
          `Welcome${response.data.data.user?.name ? `, ${response.data.data.user.name}` : ''}! Registration successful!`
        );

        // === START: Auto-create Wallet ===
        try {
          if (response.data.data.user && response.data.data.user.id) {
            const gUser = response.data.data.user;
            const userTypeStr = (gUser.user_type === 2 || gUser.user_type === 'business' || gUser.user_type === 'lawyer' || gUser?.role?.toLowerCase() === 'lawyer') ? 'LAWYER' : 'CUSTOMER';
            const walletPayload = {
              user_id: gUser.id.toString(),
              user_type: userTypeStr,
              currency: 'INR'
            };
            await walletAPI.createWallet(walletPayload);

            // The backend automatically grants 499 INR promotional Welcome Bonus upon creation
            sessionStorage.setItem('showPromoCeremony', '499');
          }
        } catch (walletError) {
          console.error('Error auto-creating wallet on Google signup:', walletError);
        }
        // === END: Auto-create Wallet ===

        // Call parent callback if provided
        if (onSignupSuccess) {
          onSignupSuccess(response.data);
        }

        // Redirect after showing success message
        setTimeout(() => {
          const user = response?.data?.data?.user;
          const userType = user?.user_type;
          const role = user?.role?.toLowerCase();

          // If a redirect URL is explicitly provided in query string, use that
          const urlRedirectParam = new URLSearchParams(window.location.search).get('redirect');

          let redirectUrl = '/';

          if (urlRedirectParam) {
            redirectUrl = urlRedirectParam;
          } else if (userType === 2 || userType === 'business' || userType === 'lawyer' || role === 'lawyer') {
            // Lawyer / Business account - redirect to Lawyer Admin Dashboard
            redirectUrl = '/lawyer-admin';
          } else if (userType === 1 || userType === 'personal' || userType === 'user' || role === 'user' || role === 'client') {
            // Normal user / Client - redirect to homepage
            redirectUrl = '/';
          } else if (userType === null || userType === undefined || userType === 0) {
            // User has no user_type set (null, undefined, or 0), redirect to profile type selection
            redirectUrl = '/profile-setup/type-selection';
          } else {
            // Default fallback
            redirectUrl = '/';
          }

          console.log(`Google Signup - Redirecting user (type: ${userType}, role: ${role}) to: ${redirectUrl}`);
          navigate(redirectUrl, { replace: true });
        }, 2000); // Wait 2 seconds before redirecting so user can see Toasts

      } else {
        // Unexpected response format without token
        throw new Error('Registration failed. Please try again.');
      }


    } catch (error) {
      console.error('Google signup error:', error);

      // Handle different types of errors
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        if (validationErrors) {
          const firstErrorField = Object.keys(validationErrors)[0];
          const firstErrorMessage = validationErrors[firstErrorField][0];
          showError(firstErrorMessage || 'Please check your input and try again');
        } else {
          showError('Please check your input and try again');
        }
      } else if (error.response?.status === 409) {
        showError('This Google account is already registered. Please try logging in instead.');
      } else if (error.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError('Google signup failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Get theme from Redux
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';

  return (
    <div className={`relative flex flex-col min-h-screen pt-20 pb-12 ${isDarkMode ? 'bg-[#0A0A0A]' : 'bg-gray-50/30'}`}>
      <AnimatePresence mode="wait">
        {/* Toast rendered globally by ToastProvider, referencing locally not needed */}
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
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Join MeraBakil's professional legal network</p>
          </div>

          <div className="flex items-center justify-center mb-8 gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step >= 1 ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                {step > 1 ? <Check size={14} /> : '1'}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= 1 ? 'text-brand-500' : 'text-gray-400'}`}>Account</span>
            </div>
            <div className={`h-px w-8 ${step > 1 ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-800'}`}></div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step === 2 ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                2
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${step === 2 ? 'text-brand-500' : 'text-gray-400'}`}>Personal</span>
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
                      <span className="flex-shrink mx-4 text-xs font-medium text-gray-400">or sign up with email</span>
                      <div className="flex-grow border-t border-gray-100 dark:border-gray-800"></div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">I'm a:</label>
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
                        placeholder="lawyer@merabakil.com"
                        icon={<Mail size={16} />}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="password" className="text-xs font-bold uppercase text-gray-500 tracking-wider">Password</label>
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

                    <div className="flex items-start py-2">
                      <CustomCheckbox
                        id="agree-terms"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        label={
                          <span>
                            I agree to the{' '}
                            <a href="/terms-of-service" className="text-brand-500 hover:underline">Terms of Service</a>{' '}
                            and{' '}
                            <a href="/privacy-policy" className="text-brand-500 hover:underline">Privacy Policy</a>
                          </span>
                        }
                        isDarkMode={isDarkMode}
                      />
                    </div>

                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                      <Button type="submit" disabled={!email || password.length < 8 || !agreeTerms || loading}>
                        Continue <ArrowRight size={18} className="ml-2" />
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

                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <InputField
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9+\s-]/g, ''))}
                      placeholder="+91 9876543210"
                      icon={<Smartphone size={16} />}
                    />
                    <p className={`text-[11px] flex items-center gap-1 ${isDarkMode ? 'text-green-400/70' : 'text-green-600/80'}`}>
                      <svg viewBox="0 0 24 24" className="w-3 h-3 flex-shrink-0" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Appointment reminders & updates will be sent to this WhatsApp number
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Confirm Password</label>
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
                      <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">Passwords do not match</p>
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
                        disabled={!firstName.trim() || !lastName.trim() || !phoneNumber.trim() || !passwordsMatch || loading}
                      >
                        Create Account
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <div className="pt-8 text-center border-t border-gray-100 dark:border-gray-800 mt-6">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Already have an account? <a href="/auth" className="font-bold text-brand-500 hover:text-brand-600 transition-colors">Sign In</a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};