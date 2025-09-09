// AuthComponents.jsx - Production Ready
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaFacebook, FaGoogle, FaLinkedin, FaEye, FaEyeSlash, FaShieldAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { authAPI, tokenManager } from '../api/apiService';

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
        return <FaCheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <FaExclamationCircle className="w-6 h-6 text-red-500" />;
      case 'warning':
        return <FaExclamationCircle className="w-6 h-6 text-yellow-500" />;
      case 'info':
        return <FaCheckCircle className="w-6 h-6 text-blue-500" />;
      default:
        return <FaCheckCircle className="w-6 h-6 text-gray-500" />;
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

// Legal strip component
const LegalStrip = () => {
  return (
    <div className="w-full py-2 px-4 bg-gradient-to-r from-blue-900 to-blue-800 text-white text-xs font-light flex items-center justify-between">
      <div className="flex items-center">
        <FaShieldAlt className="mr-2" />
        <span>Secure Authentication | ISO 27001 Certified</span>
      </div>
      <div>
        <a href="/privacy" className="hover:underline transition-all duration-200">Privacy Policy</a>
        <span className="mx-2">|</span>
        <a href="/terms" className="hover:underline transition-all duration-200">Terms of Service</a>
      </div>
    </div>
  );
};

// Logo component
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

// Enhanced Button component
const Button = ({ children, loading, onClick, type = "button", className = "", disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`w-full py-3 px-4 rounded-md flex items-center justify-center text-white font-medium shadow-md transition-all duration-300 transform hover:scale-102 hover:shadow-xl relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none ${className}`}
      style={{ 
        background: (loading || disabled) ? "#64a6db" : "linear-gradient(to right, rgb(34, 87, 122), rgb(92, 172, 222))" 
      }}
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
      {!loading && !disabled && (
        <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-20 bg-white transform -translate-x-full hover:translate-x-0 transition-transform duration-500"></div>
      )}
    </button>
  );
};

// Social login buttons
const SocialButtons = ({ onSocialLogin, loading }) => {
  return (
    <div className="flex justify-center space-x-5 mt-5">
      <button 
        onClick={() => onSocialLogin('facebook')}
        disabled={loading}
        className="w-12 h-12 rounded-full bg-blue-800 flex items-center justify-center text-white transition-all duration-300 hover:bg-blue-900 hover:scale-110 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        aria-label="Sign in with Facebook"
      >
        <FaFacebook size={20} />
      </button>
      <button 
        onClick={() => onSocialLogin('google')}
        disabled={loading}
        className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white transition-all duration-300 hover:bg-red-600 hover:scale-110 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        aria-label="Sign in with Google"
      >
        <FaGoogle size={20} />
      </button>
      <button 
        onClick={() => onSocialLogin('linkedin')}
        disabled={loading}
        className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white transition-all duration-300 hover:bg-blue-600 hover:scale-110 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        aria-label="Sign in with LinkedIn"
      >
        <FaLinkedin size={20} />
      </button>
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
      <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
        error ? 'text-red-400' : disabled ? 'text-gray-300' : isDarkMode ? 'text-gray-500 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-blue-500'
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
        className={`block w-full pl-10 pr-10 py-3.5 rounded-lg shadow-sm transition-all duration-300 ${
          isDarkMode 
            ? `${error 
                ? 'border-2 border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-900 bg-gray-700 text-white placeholder-gray-400' 
                : disabled
                  ? 'border border-gray-700 bg-gray-800 text-gray-400 cursor-not-allowed placeholder-gray-600'
                  : 'border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400'
              }`
            : `${error 
                ? 'border-2 border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100 placeholder-gray-400' 
                : disabled
                  ? 'border border-gray-200 bg-gray-50 cursor-not-allowed placeholder-gray-400'
                  : 'border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 placeholder-gray-400'
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
          className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-200 ${
            disabled 
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
    fadeIn: false,
    errors: {}
  });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    setFormState(prev => ({ ...prev, fadeIn: true }));

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
    return password.length >= 6; // Minimum 6 characters
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
      errors.password = 'Password must be at least 6 characters long';
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
    } else if (userType !== 1 || userType =='business') {
      // If not a normal user, send to lawyer admin dashboard
      redirectUrl = '/lawyer-admin';
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
  const handleSocialLogin = (provider) => {
    if (formState.loading) return;
    
    showToast(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login coming soon!`, 'info');
    // Implement social login logic here
    // window.location.href = `/auth/${provider}`;
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
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} relative overflow-hidden`}>
      {/* Toast notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -left-40 w-80 h-80 ${isDarkMode ? 'bg-blue-900' : 'bg-blue-50'} rounded-full opacity-10 animate-pulse`}></div>
        <div className={`absolute top-40 -right-20 w-60 h-60 ${isDarkMode ? 'bg-blue-800' : 'bg-blue-100'} rounded-full opacity-10 animate-pulse`} style={{ animationDelay: '1s' }}></div>
        <div className={`absolute bottom-20 left-20 w-40 h-40 ${isDarkMode ? 'bg-blue-900' : 'bg-blue-50'} rounded-full opacity-10 animate-pulse`} style={{ animationDelay: '2s' }}></div>
      </div>
      
      <LegalStrip />
      
      <div className="flex-1 flex items-center justify-center p-6 z-10">
        <div 
          className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-xl shadow-xl p-8 w-full max-w-md transition-all duration-700 transform ${
            formState.fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ boxShadow: isDarkMode ? '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' : '0 10px 25px -5px rgba(34, 87, 122, 0.1), 0 10px 10px -5px rgba(92, 172, 222, 0.05)' }}
        >
          <div className="text-center mb-8">
            <Logo />
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Welcome to MeraBakil</h1>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5" noValidate>
            <div className="space-y-1">
              <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email Address <span className="text-red-500">*</span>
              </label>
              <InputField
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                autoComplete="email"
                error={!!formState.errors.email}
                disabled={formState.loading}
                icon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                }
              />
              {formState.errors.email && (
                <p id="email-error" className="text-sm text-red-600 mt-1">{formState.errors.email}</p>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Password <span className="text-red-500">*</span>
                </label>
                <a 
                  href="/forgot-password" 
                  className={`text-sm ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} transition-colors duration-200 focus:outline-none focus:underline`}
                  tabIndex={formState.loading ? -1 : 0}
                >
                  Forgot password?
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
                icon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                }
                rightIcon={formState.showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                onRightIconClick={() => setFormState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
              />
              {formState.errors.password && (
                <p id="password-error" className="text-sm text-red-600 mt-1">{formState.errors.password}</p>
              )}
            </div>

            <div className="flex items-center">
              <div className="relative flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formState.rememberMe}
                  onChange={handleCheckboxChange}
                  disabled={formState.loading}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-60"
                />
                <label htmlFor="rememberMe" className={`ml-2 block text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Remember me for 30 days
                </label>
              </div>
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                loading={formState.loading}
                disabled={formState.loading}
              >
                {formState.loading ? 'Signing in...' : 'Sign in to account'}
              </Button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-4 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>or continue with</span>
              </div>
            </div>

            <SocialButtons onSocialLogin={handleSocialLogin} loading={formState.loading} />
          </div>

          <p className={`mt-8 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={handleSwitchToRegister}
              disabled={formState.loading}
              className={`font-medium ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} transition-all duration-200 underline-offset-2 hover:underline focus:outline-none focus:underline disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              Create a free account
            </button>
          </p>
        </div>
      </div>
      

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