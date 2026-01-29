// ForgotPassword.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaShieldAlt, FaEnvelope, FaLock, FaCheck, FaEye, FaEyeSlash, FaExclamationCircle, FaClock, FaCheckCircle } from 'react-icons/fa';
import { Scale } from 'lucide-react';
import { apiServices } from '../api/apiService';

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

// Enhanced Toast notification component with different types
const Toast = ({ message, type = 'success', onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, type === 'error' ? 7000 : 5000);
    return () => clearTimeout(timer);
  }, [onClose, type]);

  const getToastStyles = () => {
    if (isDarkMode) {
      switch (type) {
        case 'success':
          return 'bg-gradient-to-r from-green-900 to-gray-900 text-green-100 border-l-4 border-green-500';
        case 'error':
          return 'bg-gradient-to-r from-red-900 to-gray-900 text-red-100 border-l-4 border-red-500';
        default:
          return 'bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 border-l-4 border-gray-500';
      }
    } else {
      switch (type) {
        case 'success':
          return 'bg-gradient-to-r from-green-50 to-white text-green-900 border-l-4 border-green-500';
        case 'error':
          return 'bg-gradient-to-r from-red-50 to-white text-red-900 border-l-4 border-red-500';
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

// Password requirements component
const PasswordRequirements = ({ password }) => {
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

// Enhanced ForgotPassword Component
export const ForgotPassword = ({ onBack }) => {
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';

  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
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
    <div className={`min-h-screen flex flex-col pt-16 ${isDarkMode ? 'bg-[#0A0A0A]' : 'bg-white'} relative overflow-hidden`}>
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

      <div className="flex-1 flex items-center justify-center p-4 z-10 overflow-y-auto">
        <div
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl p-6 w-full max-w-md`}
          style={{ boxShadow: isDarkMode ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)' : '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
        >
          <div className="text-center mb-5">
            <Logo />
            <h2 className={`text-xl font-bold mb-1.5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {step === 'email' && 'Forgot Password'}
              {step === 'verify' && 'Verify Your Identity'}
              {step === 'reset' && 'Create New Password'}
              {step === 'success' && 'Password Reset'}
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {step === 'email' && "We'll send you a verification code to reset your password"}
              {step === 'verify' && "Enter the verification code sent to your email"}
              {step === 'reset' && "Enter a new secure password"}
              {step === 'success' && "Your password has been reset successfully"}
            </p>
          </div>

          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isDarkMode
                      ? 'text-gray-500 group-focus-within:text-gray-300'
                      : 'text-gray-400 group-focus-within:text-gray-600'
                    } transition-colors duration-200`}>
                    <FaEnvelope className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full pl-9 pr-10 py-2.5 text-sm rounded-lg shadow-sm transition-all duration-300 ${isDarkMode
                        ? 'border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/30 focus:border-gray-500'
                        : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400'
                      }`}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !email}
                  className={`group w-full py-2.5 px-4 rounded-lg flex items-center justify-center text-white text-sm font-semibold shadow-md transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none border ${loading || !email ? '' : ''}`}
                  style={{
                    background: (loading || !email)
                      ? "linear-gradient(135deg, #4a5568 0%, #2d3748 100%)"
                      : "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 25%, #1a1a1a 50%, #2563eb 75%, #1e40af 100%)",
                    borderColor: !email ? "#4a5568" : "rgba(59, 130, 246, 0.3)"
                  }}
                >
                  {loading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  <span className="relative z-10">{loading ? 'Sending...' : 'Send Verification Code'}</span>
                </button>
              </div>

              <p className={`text-center text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-4`}>
                Remembered your password?{' '}
                <button
                  type="button"
                  onClick={onBack}
                  disabled={loading}
                  className={`font-medium ${isDarkMode ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-700'} transition-all duration-200 underline-offset-2 hover:underline focus:outline-none focus:underline disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  Sign in
                </button>
              </p>
            </form>
          )}

          {step === 'verify' && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-lg p-3 mb-4`}>
                <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  We sent a verification code to <strong>{email}</strong>
                </p>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="code" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Verification Code</label>
                <div className="flex gap-2 justify-center">
                  {[...Array(6)].map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength="1"
                      className={`w-10 h-10 text-center text-lg font-bold rounded-md shadow-sm focus:outline-none focus:ring-2 ${isDarkMode
                          ? 'border border-gray-600 bg-gray-700 text-white focus:ring-gray-500/30 focus:border-gray-500'
                          : 'border border-gray-300 bg-white text-gray-900 focus:ring-gray-400/30 focus:border-gray-400'
                        }`}
                      value={verificationCode[i] || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[0-9]$/.test(value) || value === '') {
                          const newCode = verificationCode.split('');
                          newCode[i] = value;
                          setVerificationCode(newCode.join(''));

                          if (value && i < 5) {
                            const nextInput = e.target.parentElement.children[i + 1];
                            nextInput.focus();
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !verificationCode[i] && i > 0) {
                          const prevInput = e.target.parentElement.children[i - 1];
                          prevInput.focus();
                        }
                      }}
                    />
                  ))}
                </div>
                {error && <p className="text-red-500 text-xs mt-1 text-center">{error}</p>}
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className={`flex items-center text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <FaClock className="mr-1" size={12} />
                  <span>Code expires in 10 minutes</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const e = { preventDefault: () => { } };
                    handleEmailSubmit(e);
                  }}
                  disabled={loading}
                  className={`text-xs ${isDarkMode ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-700'} transition-all duration-200 underline-offset-2 hover:underline focus:outline-none focus:underline disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  Resend code
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || verificationCode.length !== 6}
                  className={`group w-full py-2.5 px-4 rounded-lg flex items-center justify-center text-white text-sm font-semibold shadow-md transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none border`}
                  style={{
                    background: (loading || verificationCode.length !== 6)
                      ? "linear-gradient(135deg, #4a5568 0%, #2d3748 100%)"
                      : "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 25%, #1a1a1a 50%, #2563eb 75%, #1e40af 100%)",
                    borderColor: verificationCode.length !== 6 ? "#4a5568" : "rgba(59, 130, 246, 0.3)"
                  }}
                >
                  {loading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  <span className="relative z-10">{loading ? 'Verifying...' : 'Verify Code'}</span>
                </button>
              </div>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="new-password" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isDarkMode
                      ? 'text-gray-500 group-focus-within:text-gray-300'
                      : 'text-gray-400 group-focus-within:text-gray-600'
                    } transition-colors duration-200`}>
                    <FaLock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="new-password"
                    name="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`block w-full pl-9 pr-10 py-2.5 text-sm rounded-lg shadow-sm transition-all duration-300 ${isDarkMode
                        ? 'border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/30 focus:border-gray-500'
                        : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400'
                      }`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center ${isDarkMode
                        ? 'text-gray-400 hover:text-gray-300'
                        : 'text-gray-400 hover:text-gray-600'
                      } transition-colors duration-200`}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                  </button>
                </div>
                <PasswordRequirements password={newPassword} />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirm-password" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isDarkMode
                      ? 'text-gray-500 group-focus-within:text-gray-300'
                      : 'text-gray-400 group-focus-within:text-gray-600'
                    } transition-colors duration-200`}>
                    <FaLock className="h-4 w-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm-password"
                    name="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`block w-full pl-9 pr-10 py-2.5 text-sm rounded-lg shadow-sm transition-all duration-300 ${isDarkMode
                        ? 'border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/30 focus:border-gray-500'
                        : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400'
                      }`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center ${isDarkMode
                        ? 'text-gray-400 hover:text-gray-300'
                        : 'text-gray-400 hover:text-gray-600'
                      } transition-colors duration-200`}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                )}
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading || !newPassword || !isPasswordValid || !passwordsMatch}
                  className={`group w-full py-2.5 px-4 rounded-lg flex items-center justify-center text-white text-sm font-semibold shadow-md transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none border`}
                  style={{
                    background: (loading || !newPassword || !isPasswordValid || !passwordsMatch)
                      ? "linear-gradient(135deg, #4a5568 0%, #2d3748 100%)"
                      : "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 25%, #1a1a1a 50%, #2563eb 75%, #1e40af 100%)",
                    borderColor: !newPassword || !isPasswordValid || !passwordsMatch ? "#4a5568" : "rgba(59, 130, 246, 0.3)"
                  }}
                >
                  {loading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  <span className="relative z-10">{loading ? 'Resetting...' : 'Reset Password'}</span>
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-6">
              <div className={`w-16 h-16 rounded-full ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'} flex items-center justify-center mb-4 mx-auto`}>
                <FaCheck className={`${isDarkMode ? 'text-green-400' : 'text-green-500'} text-2xl`} />
              </div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>Password Reset Successful!</h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs mb-6`}>
                You can now log in with your new password
              </p>

              <button
                onClick={onBack}
                className={`group w-full py-2.5 px-4 rounded-lg flex items-center justify-center text-white text-sm font-semibold shadow-md transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg relative overflow-hidden border`}
                style={{
                  background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 25%, #1a1a1a 50%, #2563eb 75%, #1e40af 100%)",
                  borderColor: "rgba(59, 130, 246, 0.3)"
                }}
              >
                <span className="relative z-10">Back to Sign In</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
