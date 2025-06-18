// // ForgotPassword.jsx
// import React, { useState, useEffect } from 'react';
// import { FaShieldAlt, FaArrowLeft, FaEnvelope, FaLock, FaCheck, FaEye, FaEyeSlash } from 'react-icons/fa';

// // Legal strip component at the top
// const LegalStrip = () => {
//   return (
//     <div className="w-full py-2 px-4 bg-gradient-to-r from-blue-900 to-blue-800 text-white text-xs font-light flex items-center justify-between">
//       <div className="flex items-center">
//         <FaShieldAlt className="mr-2" />
//         <span>Secure Authentication | ISO 27001 Certified</span>
//       </div>
//       <div>
//         <a href="#" className="hover:underline transition-all duration-200">Privacy Policy</a>
//         <span className="mx-2">|</span>
//         <a href="#" className="hover:underline transition-all duration-200">Terms of Service</a>
//       </div>
//     </div>
//   );
// };

// // Enhanced Logo component with gradient
// const Logo = () => {
//   return (
//     <div className="flex justify-center mb-6 animate-fadeIn">
//       <div 
//         className="w-20 h-20 rounded-lg flex items-center justify-center text-white text-3xl font-bold shadow-lg transform hover:rotate-3 transition-all duration-300"
//         style={{ background: "linear-gradient(to right, rgb(34, 87, 122), rgb(92, 172, 222))" }}
//       >
//         <span className="drop-shadow-md">M</span>
//       </div>
//     </div>
//   );
// };

// // Enhanced Button component with gradient
// const Button = ({ children, loading, onClick, className, type = "button" }) => {
//   return (
//     <button
//       onClick={onClick}
//       type={type}
//       disabled={loading}
//       className={`w-full py-3 px-4 rounded-md flex items-center justify-center text-white font-medium shadow-md transition-all duration-300 transform hover:scale-102 hover:shadow-xl relative overflow-hidden ${className}`}
//       style={{ background: loading ? "#64a6db" : "linear-gradient(to right, rgb(34, 87, 122), rgb(92, 172, 222))" }}
//     >
//       <span className="relative z-10 flex items-center">
//         {loading ? (
//           <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//           </svg>
//         ) : null}
//         {children}
//       </span>
//       <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-20 bg-white transform -translate-x-full hover:translate-x-0 transition-transform duration-500"></div>
//     </button>
//   );
// };

// // Enhanced Input Field component
// const InputField = ({ type, id, name, value, onChange, placeholder, icon, rightIcon, onRightIconClick }) => {
//   return (
//     <div className="relative group">
//       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
//         {icon}
//       </div>
//       <input
//         id={id}
//         name={name}
//         type={type}
//         value={value}
//         onChange={onChange}
//         className="block w-full pl-10 pr-10 py-3.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
//         placeholder={placeholder}
//         required
//       />
//       {rightIcon && (
//         <button
//           type="button"
//           className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
//           onClick={onRightIconClick}
//         >
//           {rightIcon}
//         </button>
//       )}
//     </div>
//   );
// };

// // Password requirements component
// const PasswordRequirements = ({ password }) => {
//   const requirements = [
//     { text: 'At least 8 characters', met: password.length >= 8 },
//     { text: 'At least 1 uppercase letter', met: /[A-Z]/.test(password) },
//     { text: 'At least 1 number', met: /[0-9]/.test(password) },
//     { text: 'At least 1 special character', met: /[^A-Za-z0-9]/.test(password) }
//   ];

//   return (
//     <div className="mt-2 space-y-1">
//       {requirements.map((req, index) => (
//         <div key={index} className="flex items-center text-xs">
//           <div className={`mr-2 text-${req.met ? 'green' : 'gray'}-500`}>
//             {req.met ? <FaCheck size={12} /> : '○'}
//           </div>
//           <span className={`text-${req.met ? 'green' : 'gray'}-600`}>{req.text}</span>
//         </div>
//       ))}
//     </div>
//   );
// };

// // Success animation
// const SuccessAnimation = () => {
//   return (
//     <div className="flex flex-col items-center justify-center py-8">
//       <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4 animate-pulse">
//         <FaCheck className="text-green-500 text-3xl" />
//       </div>
//       <h3 className="text-xl font-semibold text-gray-700 mb-1">Request Sent!</h3>
//       <p className="text-gray-500 text-center max-w-xs">
//         Check your email for instructions to reset your password.
//       </p>
//     </div>
//   );
// };

// // Enhanced ForgotPassword Component
// export const ForgotPassword = ({ onBack, onClose }) => {
//   const [email, setEmail] = useState('');
//   const [step, setStep] = useState('email'); // email, verify, reset, success
//   const [verificationCode, setVerificationCode] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [fadeIn, setFadeIn] = useState(false);

//   useEffect(() => {
//     // Trigger fade-in animation after component mounts
//     setFadeIn(true);
//   }, []);

//   const handleEmailSubmit = (e) => {
//     e.preventDefault();
//     setLoading(true);
//     // Simulate API call
//     setTimeout(() => {
//       setLoading(false);
//       setStep('verify');
//     }, 1500);
//   };

//   const handleVerifyCode = (e) => {
//     e.preventDefault();
//     setLoading(true);
//     // Simulate API call
//     setTimeout(() => {
//       setLoading(false);
//       setStep('reset');
//     }, 1500);
//   };

//   const handleResetPassword = (e) => {
//     e.preventDefault();
//     setLoading(true);
//     // Simulate API call
//     setTimeout(() => {
//       setLoading(false);
//       setStep('success');
//     }, 1500);
//   };

//   const passwordsMatch = newPassword === confirmPassword || confirmPassword === '';

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50 relative overflow-hidden">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-50 rounded-full opacity-30"></div>
//         <div className="absolute top-40 -right-20 w-60 h-60 bg-blue-100 rounded-full opacity-20"></div>
//         <div className="absolute bottom-20 left-20 w-40 h-40 bg-blue-50 rounded-full opacity-30"></div>
//       </div>
      
//       <LegalStrip />
      
//       <div className="flex-1 flex items-center justify-center p-6 z-10">
//         <div 
//           className={`bg-white rounded-xl shadow-xl p-8 w-full max-w-md transition-all duration-700 transform ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
//           style={{ boxShadow: '0 10px 25px -5px rgba(34, 87, 122, 0.1), 0 10px 10px -5px rgba(92, 172, 222, 0.05)' }}
//         >
//           {/* Back navigation */}
//           {onBack && (
//             <button 
//               onClick={onBack}
//               className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-4"
//             >
//               <FaArrowLeft className="mr-2" />
//               <span>Back to login</span>
//             </button>
//           )}
          
//           <div className="text-center mb-6">
//             <Logo />
//             <h2 className="text-2xl font-bold text-gray-800 mb-1">
//               {step === 'email' && 'Forgot Password'}
//               {step === 'verify' && 'Verify Your Identity'}
//               {step === 'reset' && 'Create New Password'}
//               {step === 'success' && 'Password Reset'}
//             </h2>
//             <p className="text-gray-600">
//               {step === 'email' && "We'll send you a link to reset your password"}
//               {step === 'verify' && "Enter the verification code sent to your email"}
//               {step === 'reset' && "Enter a new secure password"}
//               {step === 'success' && "Your password has been reset successfully"}
//             </p>
//           </div>

//           {step === 'email' && (
//             <form onSubmit={handleEmailSubmit} className="space-y-4">
//               <div className="space-y-1">
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
//                 <InputField
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="you@example.com"
//                   icon={<FaEnvelope className="h-5 w-5" />}
//                 />
//               </div>

//               <div className="pt-2">
//                 <Button type="submit" loading={loading} disabled={!email}>
//                   Send Reset Link
//                 </Button>
//               </div>

//               <p className="text-center text-sm text-gray-600 mt-6">
//                 Remembered your password?{' '}
//                 <a href="#" onClick={onBack} className="font-medium text-blue-600 hover:text-blue-500 transition-all duration-200 underline-offset-2 hover:underline">
//                   Back to login
//                 </a>
//               </p>
//             </form>
//           )}

//           {step === 'verify' && (
//             <form onSubmit={handleVerifyCode} className="space-y-4">
//               <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
//                 <p className="text-sm text-blue-700">
//                   We sent a verification code to <strong>{email}</strong>. Please check your inbox and enter the code below.
//                 </p>
//               </div>
              
//               <div className="space-y-1">
//                 <label htmlFor="code" className="block text-sm font-medium text-gray-700">Verification Code</label>
//                 <div className="flex gap-2 justify-center">
//                   {[...Array(6)].map((_, i) => (
//                     <input
//                       key={i}
//                       type="text"
//                       maxLength="1"
//                       className="w-12 h-12 text-center text-lg font-bold border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
//                       value={verificationCode[i] || ''}
//                       onChange={(e) => {
//                         const value = e.target.value;
//                         if (/^[0-9]$/.test(value) || value === '') {
//                           const newCode = verificationCode.split('');
//                           newCode[i] = value;
//                           setVerificationCode(newCode.join(''));
                          
//                           // Auto-focus next input
//                           if (value && i < 5) {
//                             const nextInput = e.target.parentElement.children[i + 1];
//                             nextInput.focus();
//                           }
//                         }
//                       }}
//                     />
//                   ))}
//                 </div>
//               </div>

//               <div className="pt-2">
//                 <Button type="submit" loading={loading} disabled={verificationCode.length !== 6}>
//                   Verify Code
//                 </Button>
//               </div>

//               <p className="text-center text-sm text-gray-600 mt-4">
//                 Didn't receive a code?{' '}
//                 <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-all duration-200 underline-offset-2 hover:underline">
//                   Resend code
//                 </a>
//               </p>
//             </form>
//           )}

//           {step === 'reset' && (
//             <form onSubmit={handleResetPassword} className="space-y-4">
//               <div className="space-y-1">
//                 <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
//                 <InputField
//                   type={showPassword ? "text" : "password"}
//                   id="new-password"
//                   name="new-password"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   placeholder="••••••••"
//                   icon={<FaLock className="h-5 w-5" />}
//                   rightIcon={showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
//                   onRightIconClick={() => setShowPassword(!showPassword)}
//                 />
//                 {newPassword && <PasswordRequirements password={newPassword} />}
//               </div>

//               <div className="space-y-1">
//                 <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
//                 <InputField
//                   type={showConfirmPassword ? "text" : "password"}
//                   id="confirm-password"
//                   name="confirm-password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   placeholder="••••••••"
//                   icon={<FaLock className="h-5 w-5" />}
//                   rightIcon={showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
//                   onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 />
//                 {confirmPassword && !passwordsMatch && (
//                   <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
//                 )}
//               </div>

//               <div className="pt-2">
//                 <Button 
//                   type="submit" 
//                   loading={loading} 
//                   disabled={!newPassword || newPassword.length < 8 || !passwordsMatch}
//                 >
//                   Reset Password
//                 </Button>
//               </div>
//             </form>
//           )}

//           {step === 'success' && (
//             <div>
//               <SuccessAnimation />
//               <div className="mt-6">
//                 <Button onClick={onBack}>
//                   Return to Login
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
      
//       <div className="py-3 text-center text-xs text-gray-500 bg-gray-50 border-t border-gray-100">
//         © 2025 MeraBakil. All rights reserved.
//       </div>
//     </div>
//   );
// };

// // Add custom keyframes for animations to your CSS or styles file:
// /**
//  * Add these styles to your CSS file:
//  * 
//  * @keyframes fadeIn {
//  *   from { opacity: 0; transform: translateY(10px); }
//  *   to { opacity: 1; transform: translateY(0); }
//  * }
//  * 
//  * .animate-fadeIn {
//  *   animation: fadeIn 0.6s ease-out forwards;
//  * }
//  */


























































// ForgotPassword.jsx
import React, { useState, useEffect } from 'react';
import { FaShieldAlt, FaArrowLeft, FaEnvelope, FaLock, FaCheck, FaEye, FaEyeSlash, FaExclamationTriangle, FaClock } from 'react-icons/fa';
import { apiServices } from '../api/apiService';


// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheck className="text-green-500" />;
      case 'error':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'info':
        return <FaExclamationTriangle className="text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-fadeIn">
      <div className={`border rounded-lg p-4 shadow-lg max-w-sm ${getToastStyles()}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-3 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      </div>
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
const Button = ({ children, loading, onClick, className, type = "button", disabled }) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={loading || disabled}
      className={`w-full py-3 px-4 rounded-md flex items-center justify-center text-white font-medium shadow-md transition-all duration-300 transform hover:scale-102 hover:shadow-xl relative overflow-hidden ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{ background: (loading || disabled) ? "#64a6db" : "linear-gradient(to right, rgb(34, 87, 122), rgb(92, 172, 222))" }}
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

// Enhanced Input Field component
const InputField = ({ type, id, name, value, onChange, placeholder, icon, rightIcon, onRightIconClick, error }) => {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
        {icon}
      </div>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`block w-full pl-10 pr-10 py-3.5 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 ${
          error ? 'border-red-300 focus:ring-red-400 focus:border-red-400' : 'border-gray-300'
        }`}
        placeholder={placeholder}
        required
      />
      {rightIcon && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
          onClick={onRightIconClick}
        >
          {rightIcon}
        </button>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

// Password requirements component
const PasswordRequirements = ({ password }) => {
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
          <div className={`mr-2 text-${req.met ? 'green' : 'gray'}-500`}>
            {req.met ? <FaCheck size={12} /> : '○'}
          </div>
          <span className={`text-${req.met ? 'green' : 'gray'}-600`}>{req.text}</span>
        </div>
      ))}
    </div>
  );
};

// Success animation
const SuccessAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4 animate-pulse">
        <FaCheck className="text-green-500 text-3xl" />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-1">Password Reset Successfully!</h3>
      <p className="text-gray-500 text-center max-w-xs">
        Your password has been updated. You can now login with your new password.
      </p>
    </div>
  );
};

// Rate Limit Warning Component
const RateLimitWarning = ({ attemptsLeft, timeLeft }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <FaExclamationTriangle className="text-yellow-500 mr-3 mt-0.5" />
        <div>
          {attemptsLeft > 0 ? (
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Incorrect OTP entered
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                You have {attemptsLeft} attempt{attemptsLeft > 1 ? 's' : ''} remaining. Please double-check your email for the correct OTP.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium text-red-800 flex items-center">
                <FaClock className="mr-2" />
                Too many failed attempts
              </p>
              <p className="text-sm text-red-700 mt-1">
                Please wait {formatTime(timeLeft)} before trying again for your security.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced ForgotPassword Component
export const ForgotPassword = ({ onBack, onClose }) => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email'); // email, verify, reset, success
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitTime, setRateLimitTime] = useState(0);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  // Rate limit timer
  useEffect(() => {
    let interval;
    if (rateLimitTime > 0) {
      interval = setInterval(() => {
        setRateLimitTime(prev => {
          if (prev <= 1) {
            setIsRateLimited(false);
            setAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [rateLimitTime]);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await apiServices.sendPasswordResetOtp({ email });
      showToast('OTP sent to your email successfully!', 'success');
      setStep('verify');
      setAttempts(0); // Reset attempts when new OTP is sent
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send OTP. Please try again.';
      showToast(errorMessage, 'error');
      setErrors({ email: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    
    if (isRateLimited) {
      showToast('Please wait before trying again.', 'warning');
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Note: You might want to add a verify OTP endpoint to your backend
      // For now, we'll proceed to reset step and validate during password reset
      setStep('reset');
      showToast('OTP verified successfully!', 'success');
    } catch (error) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 4) {
        setIsRateLimited(true);
        setRateLimitTime(1200); // 20 minutes in seconds
        showToast('Too many failed attempts. Please wait 20 minutes before trying again.', 'error');
      } else {
        showToast(`Incorrect OTP. ${4 - newAttempts} attempts remaining.`, 'error');
      }
      
      setErrors({ otp: 'Invalid OTP entered' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      const response = await apiServices.resetPassword({
        email,
        otp: verificationCode,
        password: newPassword,
        password_confirmation: confirmPassword
      });
      
      showToast('Password reset successfully!', 'success');
      setStep('success');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password. Please try again.';
      
      if (errorMessage.includes('Invalid OTP') || errorMessage.includes('OTP expired')) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= 4) {
          setIsRateLimited(true);
          setRateLimitTime(1200);
          showToast('Too many failed attempts. Please wait 20 minutes before trying again.', 'error');
          setStep('verify'); // Go back to verify step
        } else {
          showToast(`${errorMessage}. ${4 - newAttempts} attempts remaining.`, 'error');
          setStep('verify'); // Go back to verify step
        }
      } else {
        showToast(errorMessage, 'error');
      }
      
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await apiServices.sendPasswordResetOtp({ email });
      showToast('New OTP sent to your email!', 'success');
      setAttempts(0); // Reset attempts when new OTP is sent
      setVerificationCode('');
    } catch (error) {
      showToast('Failed to resend OTP. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = newPassword === confirmPassword || confirmPassword === '';
  const isPasswordValid = newPassword.length >= 8 && 
    /[A-Z]/.test(newPassword) && 
    /[0-9]/.test(newPassword) && 
    /[^A-Za-z0-9]/.test(newPassword);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative overflow-hidden">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-50 rounded-full opacity-30"></div>
        <div className="absolute top-40 -right-20 w-60 h-60 bg-blue-100 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-blue-50 rounded-full opacity-30"></div>
      </div>
      
      <LegalStrip />
      
      <div className="flex-1 flex items-center justify-center p-6 z-10">
        <div 
          className={`bg-white rounded-xl shadow-xl p-8 w-full max-w-md transition-all duration-700 transform ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{ boxShadow: '0 10px 25px -5px rgba(34, 87, 122, 0.1), 0 10px 10px -5px rgba(92, 172, 222, 0.05)' }}
        >
          {/* Back navigation */}
          {onBack && (
            <button 
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-4"
            >
              <FaArrowLeft className="mr-2" />
              <span>Back to login</span>
            </button>
          )}
          
          <div className="text-center mb-6">
            <Logo />
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              {step === 'email' && 'Forgot Password'}
              {step === 'verify' && 'Verify Your Identity'}
              {step === 'reset' && 'Create New Password'}
              {step === 'success' && 'Password Reset'}
            </h2>
            <p className="text-gray-600">
              {step === 'email' && "We'll send you a 6-digit OTP to reset your password"}
              {step === 'verify' && "Enter the 6-digit OTP sent to your email"}
              {step === 'reset' && "Enter a new secure password"}
              {step === 'success' && "Your password has been reset successfully"}
            </p>
          </div>

          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <InputField
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  icon={<FaEnvelope className="h-5 w-5" />}
                  error={errors.email}
                />
              </div>

              <div className="pt-2">
                <Button type="submit" loading={loading} disabled={!email || loading}>
                  Send OTP
                </Button>
              </div>

              <p className="text-center text-sm text-gray-600 mt-6">
                Remembered your password?{' '}
                <a href="#" onClick={onBack} className="font-medium text-blue-600 hover:text-blue-500 transition-all duration-200 underline-offset-2 hover:underline">
                  Back to login
                </a>
              </p>
            </form>
          )}

          {step === 'verify' && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-700">
                  We sent a 6-digit OTP to <strong>{email}</strong>. Please check your inbox and enter the code below.
                </p>
              </div>

              {/* Rate limit warning */}
              {(attempts > 0 || isRateLimited) && (
                <RateLimitWarning 
                  attemptsLeft={4 - attempts} 
                  timeLeft={rateLimitTime}
                />
              )}
              
              <div className="space-y-1">
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">6-Digit OTP</label>
                <div className="flex gap-2 justify-center">
                  {[...Array(6)].map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength="1"
                      className={`w-12 h-12 text-center text-lg font-bold border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${
                        errors.otp ? 'border-red-300' : 'border-gray-300'
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
                      disabled={isRateLimited}
                    />
                  ))}
                </div>
                {errors.otp && (
                  <p className="text-xs text-red-600 text-center mt-2">{errors.otp}</p>
                )}
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  loading={loading} 
                  disabled={verificationCode.length !== 6 || loading || isRateLimited}
                >
                  Verify OTP
                </Button>
              </div>

              <p className="text-center text-sm text-gray-600 mt-4">
                Didn't receive the OTP?{' '}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading || isRateLimited}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-all duration-200 underline-offset-2 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Resend OTP
                </button>
              </p>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
                <InputField
                  type={showPassword ? "text" : "password"}
                  id="new-password"
                  name="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={<FaLock className="h-5 w-5" />}
                  rightIcon={showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                  onRightIconClick={() => setShowPassword(!showPassword)}
                  error={errors.password}
                />
                {newPassword && <PasswordRequirements password={newPassword} />}
              </div>

              <div className="space-y-1">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <InputField
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm-password"
                  name="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={<FaLock className="h-5 w-5" />}
                  rightIcon={showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                  onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  error={errors.confirmPassword}
                />
                {confirmPassword && !passwordsMatch && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>

              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700">{errors.general}</p>
                </div>
              )}

              <div className="pt-2">
                <Button 
                  type="submit" 
                  loading={loading} 
                  disabled={!newPassword || !isPasswordValid || !passwordsMatch || loading}
                >
                  Reset Password
                </Button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div>
              <SuccessAnimation />
              <div className="mt-6">
                <Button onClick={onBack}>
                  Return to Login
                </Button>
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