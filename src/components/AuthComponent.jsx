import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Mail, Lock, Eye, EyeOff, Scale, Check, AlertCircle, CheckCircle, Smartphone, Globe, Shield } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { authAPI, tokenManager } from '../api/apiService';
import { motion, AnimatePresence } from 'framer-motion';

// Enhanced Toast notification component with different types
const Toast = ({ message, type = 'success', onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Get theme from Redux
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, type === 'error' ? 7000 : 5000); // Show error messages longer
    return () => clearTimeout(timer);
  }, [onClose, type]);

  const getToastStyles = () => {
    if (isDarkMode) {
      switch (type) {
        case 'success':
          return 'bg-gradient-to-r from-green-900 to-gray-900 text-green-100 border-l-4 border-green-500';
        case 'error':
          return 'bg-gradient-to-r from-red-900 to-gray-900 text-red-100 border-l-4 border-red-500';
        case 'warning':
          return 'bg-gradient-to-r from-yellow-900 to-gray-900 text-yellow-100 border-l-4 border-yellow-500';
        case 'info':
          return 'bg-gradient-to-r from-blue-900 to-gray-900 text-blue-100 border-l-4 border-blue-500';
        default:
          return 'bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 border-l-4 border-gray-500';
      }
    } else {
      switch (type) {
        case 'success':
          return 'bg-gradient-to-r from-green-50 to-white text-green-900 border-l-4 border-green-500';
        case 'error':
          return 'bg-gradient-to-r from-red-50 to-white text-red-900 border-l-4 border-red-500';
        case 'warning':
          return 'bg-gradient-to-r from-yellow-50 to-white text-yellow-900 border-l-4 border-yellow-500';
        case 'info':
          return 'bg-gradient-to-r from-blue-50 to-white text-blue-900 border-l-4 border-blue-500';
        default:
          return 'bg-gradient-to-r from-gray-50 to-white text-gray-900 border-l-4 border-gray-500';
      }
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div
      className={`fixed top-16 right-6 max-w-sm w-full z-50 transform transition-all duration-500 ease-in-out 
        ${isVisible ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-95 translate-x-5'}
        ${getToastStyles()}
        rounded-lg shadow-xl flex items-start p-4 space-x-4`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>

      <div className="flex-1 text-sm font-medium leading-relaxed">
        {message}
      </div>

      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-700'} transition duration-200 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-gray-700' : 'focus:ring-gray-300'}`}
        aria-label="Close notification"
      >
        <svg className="w-4 h-4" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
        <a href="/privacy" className="hover:text-blue-400 hover:underline transition-all duration-200">Privacy Policy</a>
        <span className="mx-2 text-gray-600">|</span>
        <a href="/terms" className="hover:text-blue-400 hover:underline transition-all duration-200">Terms of Service</a>
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
const Button = ({ children, loading, onClick, type = "button", className = "", disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
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
const CustomCheckbox = ({ id, name, checked, onChange, label, disabled = false, isDarkMode }) => {
  return (
    <div className="flex items-center">
      <div className="relative flex items-center">
        {/* Hidden native checkbox for accessibility */}
        <input
          id={id}
          name={name || id}
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
      console.log('Google login successful:', tokenResponse);
      if (onGoogleLogin) {
        onGoogleLogin(tokenResponse.access_token);
      }
    },
    onError: (error) => {
      console.error('Google login failed:', error);
      if (onSocialLogin) {
        onSocialLogin('google', { error: 'Google login failed. Please try again.' });
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
        onClick={() => onSocialLogin('apple')}
        disabled={loading}
        className={socialButtonClass}
        aria-label="Continue with Apple"
      >
        <FaApple className="text-gray-900" size={18} />
        <span className="text-sm">Continue with Apple</span>
      </button>
      
      <button 
        onClick={() => onSocialLogin('microsoft')}
        disabled={loading}
        className={socialButtonClass}
        aria-label="Continue with Microsoft"
      >
        <FaMicrosoft className="text-blue-600" size={16} />
        <span className="text-sm">Continue with Microsoft</span>
      </button>
      
      <button 
        onClick={() => onSocialLogin('facebook')}
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

// Enhanced Input Field component with validation states
const InputField = ({
  type,
  id,
  name,
  value,
  onChange,
  placeholder,
  icon,
  rightIcon,
  onRightIconClick,
  error = false,
  disabled = false,
  autoComplete
}) => {
  // Get theme from Redux
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';

  return (
    <div className="relative group">
      <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${error ? 'text-red-400' : disabled ? 'text-gray-300' : isDarkMode ? 'text-gray-500 group-focus-within:text-gray-300' : 'text-gray-400 group-focus-within:text-gray-600'
        }`}>
        {icon}
      </div>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`block w-full pl-9 pr-10 py-2.5 text-sm rounded-lg shadow-sm transition-all duration-300 ${isDarkMode
          ? `${error
            ? 'border-2 border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-900 bg-gray-700 text-white placeholder-gray-400'
            : disabled
              ? 'border border-gray-700 bg-gray-800 text-gray-400 cursor-not-allowed placeholder-gray-600'
              : 'border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500/30 focus:border-gray-500 placeholder-gray-400'
          }`
          : `${error
            ? 'border-2 border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100 placeholder-gray-400'
            : disabled
              ? 'border border-gray-200 bg-gray-50 cursor-not-allowed placeholder-gray-400'
              : 'border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400 placeholder-gray-400'
          }`
          }`}
        placeholder={placeholder}
        required
        aria-invalid={error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {rightIcon && (
        <button
          type="button"
          className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-200 ${disabled
            ? 'text-gray-300 cursor-not-allowed'
            : isDarkMode
              ? 'text-gray-400 hover:text-gray-300'
              : 'text-gray-400 hover:text-gray-600'
            }`}
          onClick={onRightIconClick}
          disabled={disabled}
          aria-label={type === 'password' ? 'Toggle password visibility' : 'Toggle input'}
        >
          {rightIcon}
        </button>
      )}
    </div>
  );
};

// Enhanced Login Component with comprehensive API integration
export const Login = ({ onLoginSuccess, onSwitchToRegister }) => {
  // Get theme from Redux
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formState, setFormState] = useState({
    rememberMe: false,
    loading: false,
    showPassword: false,
    errors: {}
  });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Check if user is already authenticated
    if (tokenManager.isAuthenticated()) {
      window.location.href = '/';
    }
  }, []);

  // Input validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const validatePassword = (password) => {
    // Check all password requirements
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

    return hasMinLength && hasUppercase && hasNumber && hasSpecialChar;
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      errors.password = 'Password must contain 8+ characters, uppercase, number, and special character';
    }

    setFormState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field-specific error when user starts typing
    if (formState.errors[name]) {
      setFormState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [name]: ''
        }
      }));
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Parse API error messages
  const parseApiError = (error) => {
    if (error.response?.status === 401) {
      return 'Invalid email or password. Please check your credentials and try again.';
    } else if (error.response?.status === 422) {
      // Laravel validation errors
      const validationErrors = error.response.data.errors;
      if (validationErrors) {
        const firstErrorField = Object.keys(validationErrors)[0];
        const firstErrorMessage = validationErrors[firstErrorField][0];
        return firstErrorMessage || 'Please check your input and try again.';
      }
      return 'Please check your input and try again.';
    } else if (error.response?.status === 429) {
      return 'Too many login attempts. Please try again in a few minutes.';
    } else if (error.response?.status === 403) {
      return 'Account access denied. Please contact support if this continues.';
    } else if (error.response?.status >= 500) {
      return 'Server error occurred. Please try again later.';
    } else if (error.response?.data?.message) {
      return error.response.data.message;
    } else if (error.message === 'Network error. Please check your connection.') {
      return 'Network error. Please check your internet connection and try again.';
    } else if (!error.response) {
      return 'Unable to connect to server. Please check your internet connection.';
    }
    return 'Login failed. Please try again.';
  };

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      const firstErrorField = Object.keys(formState.errors)[0];
      showToast(formState.errors[firstErrorField], 'error');
      return;
    }

    setFormState(prev => ({ ...prev, loading: true }));

    try {
      // Step 1: Get CSRF cookie for Laravel Sanctum
      showToast('Initializing secure connection...', 'info');
      await authAPI.getCsrfCookie();

      // Step 2: Prepare login credentials
      const loginCredentials = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password

      };

      // Step 3: Send login request
      const response = await authAPI.login(loginCredentials);

      console.log('Login successful:', response.data);


      // Handel User Redirection after successful login

      if (response.data.access_token) {
        // Store authentication data
        tokenManager.setToken(response.data.access_token);

        if (response.data.user) {
          tokenManager.setUser(response.data.user);
        }

        // Dispatch event to notify other components of authentication change
        window.dispatchEvent(new CustomEvent('auth-status-changed', {
          detail: { authenticated: true, user: response.data.user }
        }));

        showToast(
          `Welcome back${response.data.user?.name ? `, ${response.data.user.name}` : ''}! Redirecting...`,
          'success'
        );

        // Call parent callback if provided
        if (onLoginSuccess) {
          onLoginSuccess(response.data);
        }

        // Redirect after showing success message
        setTimeout(() => {
          const userType = response?.data?.user?.user_type;

          // If a redirect URL is explicitly provided in query string, use that
          const urlRedirectParam = new URLSearchParams(window.location.search).get('redirect');

          // Determine final redirect destination
          let redirectUrl = '/';

          if (urlRedirectParam) {
            redirectUrl = urlRedirectParam;
          } else if (userType === null || userType === undefined || userType === 0) {
            // User has no user_type set (null, undefined, or 0), redirect to profile type selection
            redirectUrl = '/profile-setup/type-selection';
          } else if (userType === 1) {
            // Regular user, redirect to home
            redirectUrl = '/';
          } else if (userType === 2 || userType === 'business') {
            // Lawyer user, redirect to lawyer admin dashboard
            redirectUrl = '/lawyer-admin';
          } else {
            // Default fallback
            redirectUrl = '/';
          }

          window.location.href = redirectUrl;
        }, 1500);

      } else {
        showToast('Login completed but authentication token was not received. Please try again.', 'warning');
      }


    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = parseApiError(error);
      showToast(errorMessage, 'error');

      // Clear password on error for security
      setFormData(prev => ({ ...prev, password: '' }));

    } finally {
      setFormState(prev => ({ ...prev, loading: false }));
    }
  };

  // Handle social login
  const handleSocialLogin = (provider, error = null) => {
    if (formState.loading) return;

    if (error) {
      showToast(error.error || 'Social login failed', 'error');
      return;
    }

    if (provider !== 'google') {
      showToast(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login coming soon!`, 'info');
    }
    // Google login is handled by onGoogleLogin function
  };

  // Handle Google OAuth login
  const handleGoogleLogin = async (googleToken) => {
    if (formState.loading) return;

    setFormState(prev => ({ ...prev, loading: true }));

    try {
      showToast('Signing in with Google...', 'info');

      // Call the Google login API
      const response = await authAPI.googleLogin(googleToken);

      console.log('Google login successful:', response.data.data);

      if (response.data.data.token) {
        // Store authentication data
        tokenManager.setToken(response.data.data.token);

        if (response.data.data.user) {
          tokenManager.setUser(response.data.data.user);
        }

        // Dispatch event to notify other components of authentication change
        window.dispatchEvent(new CustomEvent('auth-status-changed', {
          detail: { authenticated: true, user: response.data.data.user }
        }));

        showToast(
          `Welcome${response.data.data.user?.name ? `, ${response.data.data.user.name}` : ''}! Redirecting...`,
          'success'
        );

        // Call parent callback if provided
        if (onLoginSuccess) {
          onLoginSuccess(response.data);
        }

        // Redirect after showing success message
        setTimeout(() => {
          const userType = response?.data?.data?.user?.user_type;

          // If a redirect URL is explicitly provided in query string, use that
          const urlRedirectParam = new URLSearchParams(window.location.search).get('redirect');

          // Determine final redirect destination
          let redirectUrl = '/';

          if (urlRedirectParam) {
            redirectUrl = urlRedirectParam;
          } else if (userType === null || userType === undefined || userType === 0) {
            // User has no user_type set (null, undefined, or 0), redirect to profile type selection
            redirectUrl = '/profile-setup/type-selection';
          } else if (userType === 1) {
            // Regular user, redirect to home
            redirectUrl = '/';
          } else if (userType === 2 || userType === 'business') {
            // Lawyer user, redirect to lawyer admin dashboard
            redirectUrl = '/lawyer-admin';
          } else {
            // Default fallback
            redirectUrl = '/';
          }

          window.location.href = redirectUrl;
        }, 1500);

      } else {
        showToast('Google login completed but authentication token was not received. Please try again.', 'warning');
      }

    } catch (error) {
      console.error('Google login error:', error);
      const errorMessage = parseApiError(error);
      showToast(errorMessage, 'error');
    } finally {
      setFormState(prev => ({ ...prev, loading: false }));
    }
  };

  // Handle navigation to register
  const handleSwitchToRegister = (e) => {
    e.preventDefault();
    if (onSwitchToRegister) {
      onSwitchToRegister();
    } else {
      window.location.href = '/register';
    }
  };

  return (
    <div className={`relative flex flex-col pt-20 pb-10 ${isDarkMode ? 'bg-[#0A0A0A]' : 'bg-gray-50/30'}`}>
      <AnimatePresence>
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
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className={`absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[120px] ${isDarkMode ? 'bg-blue-600' : 'bg-blue-300'}`}
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.03, 0.08, 0.03]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 1 }}
          className={`absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full blur-[100px] ${isDarkMode ? 'bg-blue-500' : 'bg-blue-200'}`}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex-1 flex items-start justify-center px-4 sm:px-6 lg:px-8 z-10"
      >
        <div
          className={`w-full max-w-md overflow-hidden transition-all duration-300
            ${isDarkMode
              ? 'bg-[#121212] border border-gray-800'
              : 'bg-white border border-gray-100 shadow-2xl shadow-blue-500/5'} 
            rounded-2xl p-6 sm:p-8`}
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Logo />
            </motion.div>
            <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              Welcome Back
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Sign in to manage your legal workspace
            </p>
          </div>

          <div className="space-y-6">
            {/* Social Login Section */}
            <div className="grid gap-3">
              <SocialButtons
                onSocialLogin={handleSocialLogin}
                onGoogleLogin={handleGoogleLogin}
                loading={formState.loading}
              />
            </div>

            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
              <span className="flex-shrink mx-4 text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                Protected Login
              </span>
              <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4" noValidate>
              <div className="space-y-2">
                <label htmlFor="email" className={`block text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Email Address
                </label>
                <InputField
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  autoComplete="email"
                  error={!!formState.errors.email}
                  disabled={formState.loading}
                  icon={<Mail size={16} />}
                />
                {formState.errors.email && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] font-bold text-red-500 uppercase tracking-tight"
                  >
                    {formState.errors.email}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className={`block text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Access Password
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-xs font-medium text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    Lost Access?
                  </a>
                </div>
                <InputField
                  type={formState.showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  error={!!formState.errors.password}
                  disabled={formState.loading}
                  icon={<Lock size={16} />}
                  rightIcon={formState.showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  onRightIconClick={() => setFormState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                />
                {formState.errors.password && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] font-bold text-red-500 uppercase tracking-tight"
                  >
                    {formState.errors.password}
                  </motion.p>
                )}
              </div>

              <div className="flex items-center justify-between pb-2">
                <CustomCheckbox
                  id="rememberMe"
                  name="rememberMe"
                  checked={formState.rememberMe}
                  onChange={handleCheckboxChange}
                  label="Stay connected"
                  disabled={formState.loading}
                  isDarkMode={isDarkMode}
                />
              </div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  loading={formState.loading}
                  disabled={formState.loading || !formData.email || !formData.password || !validatePassword(formData.password)}
                  className="rounded-xl h-11"
                >
                  {formState.loading ? 'Authenticating...' : 'Sign In Now'}
                </Button>
              </motion.div>
            </form>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                New to Mera Vakil?{' '}
                <button
                  type="button"
                  onClick={handleSwitchToRegister}
                  disabled={formState.loading}
                  className="font-bold text-blue-500 hover:text-blue-600 transition-colors focus:outline-none"
                >
                  Create Secure Account
                </button>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Add these CSS animations to your global CSS file or styled-components:
/*
@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(10px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

.animate-fadeIn {
  animation: fadeIn 0.6s ease-out forwards;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.1;
  }
}

.animate-pulse {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
*/