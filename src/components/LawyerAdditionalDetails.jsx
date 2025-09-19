// LawyerAdditionalDetails.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FaFileAlt, FaUpload, FaCheckCircle, FaExclamationCircle, FaShieldAlt, FaIdCard } from 'react-icons/fa';
import { authAPI, tokenManager } from '../api/apiService';

// Toast notification component
const Toast = ({ message, type = 'success', onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  // Get theme from Redux
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
        ) : type === 'error' ? (
          <FaExclamationCircle className="w-5 h-5 text-red-500" />
        ) : type === 'warning' ? (
          <FaExclamationCircle className="w-5 h-5 text-yellow-500" />
        ) : (
          <FaExclamationCircle className="w-5 h-5 text-blue-500" />
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

// Legal strip component at the top
const LegalStrip = () => {
  return (
    <div className="w-full py-2 px-4 bg-gradient-to-r from-blue-900 to-blue-800 text-white text-xs font-light flex items-center justify-between">
      <div className="flex items-center">
        <FaShieldAlt className="mr-2" />
        <span>Secure Profile Setup | ISO 27001 Certified</span>
      </div>
      <div>
        <button className="hover:underline transition-all duration-200">Privacy Policy</button>
        <span className="mx-2">|</span>
        <button className="hover:underline transition-all duration-200">Terms of Service</button>
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

// Input Field component
const InputField = ({ type, id, name, value, onChange, placeholder, icon, required = false }) => {
  // Get theme from Redux
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';

  return (
    <div className="relative group">
      <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
        isDarkMode 
          ? 'text-gray-500 group-focus-within:text-blue-400' 
          : 'text-gray-400 group-focus-within:text-blue-500'
      } transition-colors duration-200`}>
        {icon}
      </div>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`block w-full pl-10 pr-4 py-3.5 rounded-lg shadow-sm transition-all duration-300 ${
          isDarkMode 
            ? 'border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/30 focus:border-gray-500' 
            : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400'
        }`}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

// Lawyer Additional Details Component
const LawyerAdditionalDetails = () => {
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [copCertificate, setCopCertificate] = useState(null);
  const [enrollmentCertificate, setEnrollmentCertificate] = useState(null);
  const [addressProof, setAddressProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // Get theme from Redux
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    setFadeIn(true);
    
    // Get user data from localStorage
    const user = tokenManager.getUser();
    if (user) {
      setUserData(user);
      // Check if user_type is not 2 (lawyer), redirect them back
      if (user.user_type !== 2 && user.user_type !== null) {
        window.location.href = '/';
      }
    } else {
      // If no user data, redirect to login
      window.location.href = '/auth';
    }
  }, []);

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
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

    setLoading(true);

    try {
      // Prepare FormData for file uploads
      const formData = new FormData();
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

      // Call the additional details API
      const response = await authAPI.saveAdditionalDetails(formData);
      
      console.log('Lawyer details saved:', response.data);

      if (response.data.success) {
        showToast('Lawyer details saved successfully! Redirecting...', 'success');

        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('auth-status-changed', {
          detail: { authenticated: true, user: userData }
        }));

        setTimeout(() => {
          // Redirect to lawyer admin dashboard
          window.location.href = '/lawyer-admin';
        }, 2000);
      } else {
        showToast('Failed to save lawyer details. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Lawyer details save error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save lawyer details. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-900 text-gray-100' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
    }`}>
      {/* Legal strip */}
      <LegalStrip />
      
      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        <div className={`w-full max-w-2xl transform transition-all duration-1000 ${
          fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          
          {/* Card container */}
          <div className={`rounded-2xl shadow-2xl overflow-hidden ${
            isDarkMode 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white'
          }`}>
            
            {/* Header */}
            <div className={`px-8 pt-8 pb-6 ${
              isDarkMode 
                ? 'bg-gray-800' 
                : 'bg-white'
            }`}>
              <Logo />
              
              <div className="text-center mb-8">
                <h1 className={`text-2xl font-bold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Lawyer Professional Details
                </h1>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Please provide your professional credentials to complete your lawyer profile
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Enrollment Number */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Bar Council Enrollment Number <span className="text-red-500">*</span>
                  </label>
                  <InputField
                    type="text"
                    id="enrollmentNo"
                    name="enrollmentNo"
                    value={enrollmentNo}
                    onChange={(e) => setEnrollmentNo(e.target.value)}
                    placeholder="Enter your enrollment number"
                    icon={<FaIdCard />}
                    required
                  />
                </div>

                {/* Certificate of Enrollment */}
                <FileUploadField
                  id="enrollmentCertificate"
                  name="enrollmentCertificate"
                  label="Certificate of Enrollment"
                  icon={<FaFileAlt />}
                  onChange={setEnrollmentCertificate}
                  required
                  accept="application/pdf,image/*"
                />

                {/* Certificate of Practice (CoP) */}
                <FileUploadField
                  id="copCertificate"
                  name="copCertificate"
                  label="Certificate of Practice (CoP)"
                  icon={<FaFileAlt />}
                  onChange={setCopCertificate}
                  required
                  accept="application/pdf,image/*"
                />

                {/* Address Proof (Optional) */}
                <FileUploadField
                  id="addressProof"
                  name="addressProof"
                  label="Address Proof (Optional)"
                  icon={<FaFileAlt />}
                  onChange={setAddressProof}
                  required={false}
                  accept="application/pdf,image/*"
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-md flex items-center justify-center text-white font-medium shadow-md transition-all duration-300 transform hover:scale-102 hover:shadow-xl relative overflow-hidden ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  style={{ 
                    background: loading 
                      ? "#64a6db" 
                      : "linear-gradient(to right, rgb(34, 87, 122), rgb(92, 172, 222))" 
                  }}
                >
                  <span className="relative z-10 flex items-center">
                    {loading ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : null}
                    {loading ? 'Saving Details...' : 'Complete Setup'}
                  </span>
                  <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-20 bg-white transform -translate-x-full hover:translate-x-0 transition-transform duration-500"></div>
                </button>
              </form>

              {/* Skip Link */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => window.location.href = '/lawyer-admin'}
                  className={`text-sm ${
                    isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                  } transition-colors duration-200`}
                >
                  Complete later
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerAdditionalDetails;