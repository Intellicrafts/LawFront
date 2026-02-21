import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Mail, Lock, Eye, EyeOff, Scale, Check, AlertCircle, CheckCircle, Smartphone, Globe, Shield } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { authAPI, tokenManager } from '../../api/apiService';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';

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
const Button = ({ children, loading, onClick, type = "button", className = "", disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
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
        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
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
  const navigate = useNavigate();

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
  const { showSuccess, showError, showInfo, showWarning } = useToast();

  useEffect(() => {
    // Check if user is already authenticated
    if (tokenManager.isAuthenticated()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

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
      errors.email = 'Email address is required to proceed.';
      showWarning('Email address is required.');
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid professional email address.';
      showWarning('Invalid email format.');
    }

    if (!formData.password) {
      errors.password = 'Password is required for security.';
      showWarning('Password is required.');
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
      showWarning('Password too short.');
    }

    setFormState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
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
      return;
    }

    setFormState(prev => ({ ...prev, loading: true }));

    try {
      // Step 1: Get CSRF cookie for Laravel Sanctum
      showInfo('Initializing secure connection...');
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

        showSuccess(
          `Welcome back${response.data.user?.name ? `, ${response.data.user.name}` : ''}! Redirecting...`
        );

        // Call parent callback if provided
        if (onLoginSuccess) {
          onLoginSuccess(response.data);
        }

        // Redirect after showing success message
        setTimeout(() => {
          // Determine final redirect destination
          let redirectUrl = '/';

          const user = response?.data?.user;
          const userType = user?.user_type;
          const role = user?.role?.toLowerCase();

          // If a redirect URL is explicitly provided in query string, use that
          const urlRedirectParam = new URLSearchParams(window.location.search).get('redirect');

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

          console.log(`Redirecting user (type: ${userType}, role: ${role}) to: ${redirectUrl}`);
          navigate(redirectUrl, { replace: true });
        }, 1500);

      } else {
        showWarning('Login completed but authentication token was not received. Please try again.');
      }


    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = parseApiError(error);
      showError(errorMessage);

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
      showError(error.error || 'Social login failed');
      return;
    }

    if (provider !== 'google') {
      showInfo(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login coming soon!`);
    }
    // Google login is handled by onGoogleLogin function
  };

  // Handle Google OAuth login
  const handleGoogleLogin = async (googleToken) => {
    if (formState.loading) return;

    setFormState(prev => ({ ...prev, loading: true }));

    try {
      showInfo('Signing in with Google...');

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

        showSuccess(
          `Welcome${response.data.data.user?.name ? `, ${response.data.data.user.name}` : ''}! Redirecting...`
        );

        // Call parent callback if provided
        if (onLoginSuccess) {
          onLoginSuccess(response.data);
        }

        // Redirect after showing success message
        setTimeout(() => {
          // Determine final redirect destination
          let redirectUrl = '/';

          const user = response?.data?.data?.user;
          const userType = user?.user_type;
          const role = user?.role?.toLowerCase();

          // If a redirect URL is explicitly provided in query string, use that
          const urlRedirectParam = new URLSearchParams(window.location.search).get('redirect');

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

          console.log(`Google Login - Redirecting user (type: ${userType}, role: ${role}) to: ${redirectUrl}`);
          navigate(redirectUrl, { replace: true });
        }, 1500);

      } else {
        showWarning('Google login completed but authentication token was not received. Please try again.');
      }

    } catch (error) {
      console.error('Google login error:', error);
      const errorMessage = parseApiError(error);
      showError(errorMessage);
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
      navigate('/register');
    }
  };

  return (
    <div className={`relative flex flex-col pt-20 pb-10 ${isDarkMode ? 'bg-[#0A0A0A]' : 'bg-gray-50/30'}`}>

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
              Sign in to your MeraBakil account
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
              <span className="flex-shrink mx-4 text-xs font-medium text-gray-400 dark:text-gray-500">
                or sign in with email
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
                    Password
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-xs font-medium text-brand-500 hover:text-brand-600 transition-colors"
                  >
                    Forgot Password?
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
                  label="Remember me"
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
                  {formState.loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </motion.div>
            </form>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                New to MeraBakil?{' '}
                <button
                  type="button"
                  onClick={handleSwitchToRegister}
                  disabled={formState.loading}
                  className="font-bold text-brand-500 hover:text-brand-600 transition-colors focus:outline-none"
                >
                  Create an Account
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