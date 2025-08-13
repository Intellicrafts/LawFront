// ForgotPassword.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaShieldAlt, FaArrowLeft, FaEnvelope, FaLock, FaCheck, FaEye, FaEyeSlash, FaExclamationTriangle, FaClock } from 'react-icons/fa';
import { apiServices } from '../api/apiService';

// Toast Notification Component
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
          <FaCheck className="w-5 h-5 text-green-500" />
        ) : (
          <FaExclamationTriangle className="w-5 h-5 text-red-500" />
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

// Success animation component
const SuccessAnimation = ({ isDarkMode }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className={`w-20 h-20 rounded-full ${isDarkMode ? 'bg-green-900' : 'bg-green-100'} flex items-center justify-center mb-4 animate-pulse`}>
        <FaCheck className={`${isDarkMode ? 'text-green-400' : 'text-green-500'} text-3xl`} />
      </div>
      <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>Password Reset Successful!</h3>
      <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center max-w-xs`}>
        Your password has been reset successfully. You can now log in with your new password.
      </p>
    </div>
  );
};

// Enhanced ForgotPassword Component
export const ForgotPassword = ({ onBack, onClose }) => {
  // Get theme from Redux
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';
  
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email'); // email, verify, reset, success
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    setFadeIn(true);
  }, []);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Call the forgot password API
      const response = await apiServices.sendPasswordResetOtp({ email });
      
      if (response.success) {
        setToast({
          message: 'Verification code sent to your email',
          type: 'success'
        });
        setStep('verify');
      } else {
        setError(response.message || 'Failed to send verification code. Please try again.');
        setToast({
          message: response.message || 'Failed to send verification code',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('An error occurred. Please try again later.');
      setToast({
        message: error.response?.data?.message || 'An error occurred. Please try again later.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Call the verify code API
      const response = await apiServices.verifyOtp({
        email,
        otp: verificationCode
      });
      
      if (response.success) {
        setToast({
          message: 'Code verified successfully',
          type: 'success'
        });
        setStep('reset');
      } else {
        setError(response.message || 'Invalid verification code. Please try again.');
        setToast({
          message: response.message || 'Invalid verification code',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Verify code error:', error);
      setError('An error occurred. Please try again later.');
      setToast({
        message: error.response?.data?.message || 'An error occurred. Please try again later.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setToast({
        message: 'Passwords do not match',
        type: 'error'
      });
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Call the reset password API
      const response = await apiServices.resetPassword({
        email,
        otp: verificationCode,
        password: newPassword,
        password_confirmation: confirmPassword
      });
      
      if (response.success) {
        setToast({
          message: 'Password reset successfully',
          type: 'success'
        });
        setStep('success');
      } else {
        setError(response.message || 'Failed to reset password. Please try again.');
        setToast({
          message: response.message || 'Failed to reset password',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('An error occurred. Please try again later.');
      setToast({
        message: error.response?.data?.message || 'An error occurred. Please try again later.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = newPassword === confirmPassword || confirmPassword === '';
  const isPasswordValid = 
    newPassword.length >= 8 && 
    /[A-Z]/.test(newPassword) && 
    /[0-9]/.test(newPassword) && 
    /[^A-Za-z0-9]/.test(newPassword);

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
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -left-40 w-80 h-80 ${isDarkMode ? 'bg-blue-900' : 'bg-blue-50'} rounded-full opacity-10`}></div>
        <div className={`absolute top-40 -right-20 w-60 h-60 ${isDarkMode ? 'bg-blue-800' : 'bg-blue-100'} rounded-full opacity-10`}></div>
        <div className={`absolute bottom-20 left-20 w-40 h-40 ${isDarkMode ? 'bg-blue-900' : 'bg-blue-50'} rounded-full opacity-10`}></div>
      </div>
      
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
      
      <div className="flex-1 flex items-center justify-center p-6 z-10">
        <div 
          className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-xl shadow-xl p-8 w-full max-w-md transition-all duration-700 transform ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{ boxShadow: isDarkMode ? '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' : '0 10px 25px -5px rgba(34, 87, 122, 0.1), 0 10px 10px -5px rgba(92, 172, 222, 0.05)' }}
        >
          {/* Back navigation */}
          {onBack && (
            <button 
              onClick={onBack}
              className={`flex items-center ${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors mb-4`}
            >
              <FaArrowLeft className="mr-2" />
              <span>Back to login</span>
            </button>
          )}
          
          <div className="text-center mb-6">
            <div className="flex justify-center mb-6 animate-fadeIn">
              <div 
                className="w-20 h-20 rounded-lg flex items-center justify-center text-white text-3xl font-bold shadow-lg transform hover:rotate-3 transition-all duration-300"
                style={{ background: "linear-gradient(to right, rgb(34, 87, 122), rgb(92, 172, 222))" }}
              >
                <span className="drop-shadow-md">M</span>
              </div>
            </div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-1`}>
              {step === 'email' && 'Forgot Password'}
              {step === 'verify' && 'Verify Your Identity'}
              {step === 'reset' && 'Create New Password'}
              {step === 'success' && 'Password Reset'}
            </h2>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {step === 'email' && "We'll send you a verification code to reset your password"}
              {step === 'verify' && "Enter the verification code sent to your email"}
              {step === 'reset' && "Enter a new secure password"}
              {step === 'success' && "Your password has been reset successfully"}
            </p>
          </div>

          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                <div className="relative group">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                    isDarkMode ? 'text-gray-500 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-blue-500'
                  } transition-colors duration-200`}>
                    <FaEnvelope className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full pl-10 pr-10 py-3.5 rounded-lg shadow-sm transition-all duration-300 ${
                      isDarkMode 
                        ? 'border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                        : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400'
                    }`}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !email}
                  className={`w-full py-3 px-4 rounded-md flex items-center justify-center text-white font-medium shadow-md transition-all duration-300 transform hover:shadow-xl relative overflow-hidden ${
                    loading || !email ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'
                  }`}
                  style={{ background: loading ? "#64a6db" : "linear-gradient(to right, rgb(34, 87, 122), rgb(92, 172, 222))" }}
                >
                  <span className="relative z-10 flex items-center">
                    {loading ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : null}
                    Send Verification Code
                  </span>
                  <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-20 bg-white transform -translate-x-full hover:translate-x-0 transition-transform duration-500"></div>
                </button>
              </div>

              <p className={`text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-6`}>
                Remembered your password?{' '}
                <button
                  type="button"
                  onClick={onBack}
                  className={`font-medium ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} transition-all duration-200 underline-offset-2 hover:underline focus:outline-none focus:underline`}
                >
                  Back to login
                </button>
              </p>
            </form>
          )}

          {step === 'verify' && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className={`${isDarkMode ? 'bg-blue-900 bg-opacity-20 border-blue-800' : 'bg-blue-50 border-blue-100'} border rounded-lg p-4 mb-4`}>
                <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                  We sent a verification code to <strong>{email}</strong>. Please check your inbox and enter the code below.
                </p>
              </div>
              
              <div className="space-y-1">
                <label htmlFor="code" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Verification Code</label>
                <div className="flex gap-2 justify-center">
                  {[...Array(6)].map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength="1"
                      className={`w-12 h-12 text-center text-lg font-bold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${
                        isDarkMode 
                          ? 'border border-gray-600 bg-gray-700 text-white' 
                          : 'border border-gray-300 bg-white text-gray-900'
                      }`}
                      value={verificationCode[i] || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[0-9]$/.test(value) || value === '') {
                          const newCode = verificationCode.split('');
                          newCode[i] = value;
                          setVerificationCode(newCode.join(''));
                          
                          // Auto-focus next input
                          if (value && i < 5) {
                            const nextInput = e.target.parentElement.children[i + 1];
                            nextInput.focus();
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        // Handle backspace to go to previous input
                        if (e.key === 'Backspace' && !verificationCode[i] && i > 0) {
                          const prevInput = e.target.parentElement.children[i - 1];
                          prevInput.focus();
                        }
                      }}
                    />
                  ))}
                </div>
                {error && <p className="text-red-500 text-sm mt-1 text-center">{error}</p>}
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className={`flex items-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <FaClock className="mr-1" />
                  <span>Code expires in 10 minutes</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const e = { preventDefault: () => {} };
                    handleEmailSubmit(e);
                  }}
                  className={`text-sm ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} transition-all duration-200 underline-offset-2 hover:underline`}
                >
                  Resend code
                </button>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || verificationCode.length !== 6}
                  className={`w-full py-3 px-4 rounded-md flex items-center justify-center text-white font-medium shadow-md transition-all duration-300 transform hover:shadow-xl relative overflow-hidden ${
                    loading || verificationCode.length !== 6 ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'
                  }`}
                  style={{ background: loading ? "#64a6db" : "linear-gradient(to right, rgb(34, 87, 122), rgb(92, 172, 222))" }}
                >
                  <span className="relative z-10 flex items-center">
                    {loading ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : null}
                    Verify Code
                  </span>
                  <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-20 bg-white transform -translate-x-full hover:translate-x-0 transition-transform duration-500"></div>
                </button>
              </div>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="new-password" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  New Password
                </label>
                <div className="relative group">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                    isDarkMode ? 'text-gray-500 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-blue-500'
                  } transition-colors duration-200`}>
                    <FaLock className="h-5 w-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="new-password"
                    name="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`block w-full pl-10 pr-10 py-3.5 rounded-lg shadow-sm transition-all duration-300 ${
                      isDarkMode 
                        ? 'border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                        : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400'
                    }`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                      isDarkMode 
                        ? 'text-gray-400 hover:text-gray-300' 
                        : 'text-gray-400 hover:text-gray-600'
                    } transition-colors duration-200`}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                  </button>
                </div>
                <PasswordRequirements password={newPassword} />
              </div>

              <div className="space-y-1">
                <label htmlFor="confirm-password" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                    isDarkMode ? 'text-gray-500 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-blue-500'
                  } transition-colors duration-200`}>
                    <FaLock className="h-5 w-5" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm-password"
                    name="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`block w-full pl-10 pr-10 py-3.5 rounded-lg shadow-sm transition-all duration-300 ${
                      isDarkMode 
                        ? 'border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                        : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400'
                    }`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                      isDarkMode 
                        ? 'text-gray-400 hover:text-gray-300' 
                        : 'text-gray-400 hover:text-gray-600'
                    } transition-colors duration-200`}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                  </button>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                )}
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || !newPassword || !isPasswordValid || !passwordsMatch}
                  className={`w-full py-3 px-4 rounded-md flex items-center justify-center text-white font-medium shadow-md transition-all duration-300 transform hover:shadow-xl relative overflow-hidden ${
                    loading || !newPassword || !isPasswordValid || !passwordsMatch ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'
                  }`}
                  style={{ background: loading ? "#64a6db" : "linear-gradient(to right, rgb(34, 87, 122), rgb(92, 172, 222))" }}
                >
                  <span className="relative z-10 flex items-center">
                    {loading ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : null}
                    Reset Password
                  </span>
                  <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-20 bg-white transform -translate-x-full hover:translate-x-0 transition-transform duration-500"></div>
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div>
              <SuccessAnimation isDarkMode={isDarkMode} />
              <div className="mt-6">
                <button
                  onClick={onBack}
                  className={`w-full py-3 px-4 rounded-md flex items-center justify-center text-white font-medium shadow-md transition-all duration-300 transform hover:shadow-xl relative overflow-hidden hover:scale-[1.02]`}
                  style={{ background: "linear-gradient(to right, rgb(34, 87, 122), rgb(92, 172, 222))" }}
                >
                  <span className="relative z-10">Return to Login</span>
                  <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-20 bg-white transform -translate-x-full hover:translate-x-0 transition-transform duration-500"></div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="py-3 text-center text-xs text-gray-500 bg-gray-50 border-t border-gray-100">
        © 2025 MeraBakil. All rights reserved.
      </div>
    </div>
  );
};