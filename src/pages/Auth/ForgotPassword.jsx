import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Mail, Lock, Eye, EyeOff, Scale, CheckCircle, ArrowLeft, KeyRound } from 'lucide-react';
import { apiServices } from '../../api/apiService';
import { useToast } from '../../context/ToastContext';
import { motion } from 'framer-motion';

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

// Enhanced Input Field component
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
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';

  return (
    <div className="relative group">
      <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${error ? 'text-red-400' : disabled ? 'text-gray-300' : isDarkMode ? 'text-gray-500 group-focus-within:text-gray-300' : 'text-gray-400 group-focus-within:text-gray-600'}`}>
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
        >
          {rightIcon}
        </button>
      )}
    </div>
  );
};

export const ForgotPassword = ({ onBack }) => {
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [step, setStep] = useState('email');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const { showSuccess, showError, showInfo } = useToast();

  useEffect(() => {
    let interval;
    if (step === 'verify' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleEmailSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const response = await apiServices.sendPasswordResetOtp({ email });

      // response might vary depending on Axios implementation. Assuming response.data or response directly.
      const resData = response.data || response;

      if (resData.success || resData.message === 'OTP sent to your email') {
        if (resData.user_name) {
          setUserName(resData.user_name);
        }
        setStep('verify');
        setTimer(60); // 1 minute professional expiry limit
      } else {
        showError(resData.message || 'Failed to send verification code.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      showError(error.response?.data?.message || 'Account not found or server error.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiServices.verifyOtp({ email, otp: verificationCode });
      const resData = response.data || response;

      if (resData.success || resData.message === 'OTP verified successfully!') {
        showSuccess('Code verified successfully.');
        setStep('reset');
      } else {
        showError(resData.message || 'Invalid verification code.');
      }
    } catch (error) {
      console.error('Verify code error:', error);
      showError(error.response?.data?.message || 'Invalid verification code or OTP expired.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await apiServices.resetPassword({
        email,
        otp: verificationCode,
        password: newPassword,
        password_confirmation: confirmPassword
      });
      const resData = response.data || response;

      if (resData.success || resData.message?.includes('successfully')) {
        showSuccess('Password reset successfully! Redirecting to login...');
        setStep('success');
        setTimeout(() => {
          if (onBack) {
             onBack();
          } else {
             navigate('/login');
          }
        }, 2000);
      } else {
        showError(resData.message || 'Failed to reset password.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      showError(error.response?.data?.message || 'An error occurred during reset.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = (e) => {
      e.preventDefault();
      if (onBack) {
          onBack();
      } else {
          navigate('/login');
      }
  };

  const passwordsMatch = newPassword === confirmPassword || confirmPassword === '';
  const isPasswordValid =
    newPassword.length >= 8 &&
    /[A-Z]/.test(newPassword) &&
    /[0-9]/.test(newPassword) &&
    /[^A-Za-z0-9]/.test(newPassword);

  return (
    <div className={`relative flex flex-col pt-20 pb-10 min-h-screen ${isDarkMode ? 'bg-[#0A0A0A]' : 'bg-gray-50/30'}`}>
      
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
              {step === 'email' && 'Forgot Password'}
              {step === 'verify' && (userName ? `Hi, ${userName}` : 'Verify Email')}
              {step === 'reset' && 'Create New Password'}
              {step === 'success' && 'Password Reset'}
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {step === 'email' && "We'll send you a secure OTP to reset your password"}
              {step === 'verify' && "Enter the 6-digit code sent to your email. Valid for 5 minutes."}
              {step === 'reset' && "Protect your account with a secure password"}
              {step === 'success' && "You can now log in securely with your new password"}
            </p>
          </div>

          <div className="space-y-6">
            {step === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <label htmlFor="email" className={`block text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Registered Email Address
                  </label>
                  <InputField
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    disabled={loading}
                    icon={<Mail size={16} />}
                  />
                </div>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    loading={loading}
                    disabled={loading || !email.includes('@')}
                    className="rounded-xl h-11 mt-2"
                  >
                    {loading ? 'Sending OTP...' : 'Send Verification Code'}
                  </Button>
                </motion.div>
                
                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
                   <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                     Remember your password?{' '}
                     <button
                       type="button"
                       onClick={handleBackToLogin}
                       disabled={loading}
                       className="font-bold text-brand-500 hover:text-brand-600 transition-colors focus:outline-none"
                     >
                       Sign In
                     </button>
                   </p>
                </div>
              </form>
            )}

            {step === 'verify' && (
               <form onSubmit={handleVerifyCode} className="space-y-6">
                <div className="flex gap-2 justify-center">
                  {[...Array(6)].map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength="1"
                      className={`w-12 h-12 text-center text-xl font-bold rounded-xl shadow-sm focus:outline-none transition-all duration-200 ${isDarkMode
                        ? 'border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500'
                        : 'border border-gray-300 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500'
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

                <div className="flex items-center justify-between text-sm px-1">
                   {timer > 0 ? (
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Resend Code in <span className="font-bold text-brand-500">{timer}s</span></span>
                   ) : (
                      <button
                        type="button"
                        onClick={(e) => handleEmailSubmit(e)}
                        className="font-bold text-brand-500 hover:text-brand-600 transition-colors"
                      >
                         Resend Code Now
                      </button>
                   )}
                </div>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    loading={loading}
                    disabled={loading || verificationCode.length !== 6}
                    className="rounded-xl h-11"
                  >
                    {loading ? 'Verifying...' : 'Verify Secure Code'}
                  </Button>
                </motion.div>
              </form>
            )}

            {step === 'reset' && (
              <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <label htmlFor="newPassword" className={`block text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    New Password
                  </label>
                  <InputField
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    icon={<Lock size={16} />}
                    rightIcon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    onRightIconClick={() => setShowPassword(!showPassword)}
                  />
                  
                  {/* Password requirements hint */}
                  {newPassword && !isPasswordValid && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[10px] font-medium text-brand-500 mt-1"
                    >
                      Must be 8+ chars and include a number, uppercase, and special character.
                    </motion.p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className={`block text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Confirm Password
                  </label>
                  <InputField
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    icon={<KeyRound size={16} />}
                    rightIcon={showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                  {confirmPassword && !passwordsMatch && (
                     <motion.p
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="text-[10px] font-bold text-red-500 uppercase tracking-tight"
                   >
                     Passwords do not match
                   </motion.p>
                  )}
                </div>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="pt-2">
                  <Button
                    type="submit"
                    loading={loading}
                    disabled={loading || !isPasswordValid || !passwordsMatch || !newPassword}
                    className="rounded-xl h-11"
                  >
                    {loading ? 'Resetting...' : 'Create New Password'}
                  </Button>
                </motion.div>
              </form>
            )}

            {step === 'success' && (
              <div className="text-center py-4">
                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-green-500" size={32} />
                 </div>
                 <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="mt-8">
                   <Button
                     onClick={handleBackToLogin}
                     className="rounded-xl h-11"
                   >
                     Back to Sign In
                   </Button>
                 </motion.div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
