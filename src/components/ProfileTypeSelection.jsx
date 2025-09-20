// ProfileTypeSelection.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaUser, FaBriefcase, FaCheckCircle, FaExclamationCircle, FaShieldAlt } from 'react-icons/fa';
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

// Profile Type Selection Component
const ProfileTypeSelection = () => {
  const [selectedType, setSelectedType] = useState(null);
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

  const handleProfileTypeSubmit = async () => {
    if (!selectedType) {
      showToast('Please select your profile type', 'error');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        user_type: selectedType === 'personal' ? 1 : 2
      };

      // Call the additional details API
      const response = await authAPI.saveAdditionalDetails(payload);
      
      console.log('Profile type saved:', response.data);

      if (response.data.success) {
        // Update user data in localStorage
        const updatedUser = { ...userData, user_type: payload.user_type };
        tokenManager.setUser(updatedUser);

        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('auth-status-changed', {
          detail: { authenticated: true, user: updatedUser }
        }));

        showToast('Profile type saved successfully!', 'success');

        setTimeout(() => {
          if (selectedType === 'personal') {
            // Redirect regular user to home
            window.location.href = '/';
          } else {
            // Redirect lawyer to additional details form
            window.location.href = '/profile-setup/lawyer-details';
          }
        }, 1500);
      } else {
        showToast('Failed to save profile type. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Profile type save error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save profile type. Please try again.';
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
        <div className={`w-full max-w-md transform transition-all duration-1000 ${
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
              
              <div className="text-center mb-6">
                <h1 className={`text-2xl font-bold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Welcome, {userData?.name || 'User'}!
                </h1>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Please select your profile type to complete setup
                </p>
              </div>

              {/* Profile Type Selector */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedType('personal')}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedType === 'personal' 
                        ? isDarkMode
                          ? 'border-blue-600 bg-blue-900 bg-opacity-20' 
                          : 'border-blue-500 bg-blue-50'
                        : isDarkMode
                          ? 'border-gray-700 hover:border-gray-600'
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                        selectedType === 'personal' 
                          ? isDarkMode
                            ? 'bg-blue-800 text-blue-400'
                            : 'bg-blue-100 text-blue-600' 
                          : isDarkMode
                            ? 'bg-gray-800 text-gray-400'
                            : 'bg-gray-100 text-gray-500'
                      }`}>
                        <FaUser size={20} />
                      </div>
                      <div className="text-left">
                        <div className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Regular User
                        </div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          I need legal services
                        </div>
                      </div>
                    </div>
                    {selectedType === 'personal' && (
                      <FaCheckCircle className="text-blue-500 w-5 h-5" />
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setSelectedType('business')}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedType === 'business' 
                        ? isDarkMode
                          ? 'border-blue-600 bg-blue-900 bg-opacity-20' 
                          : 'border-blue-500 bg-blue-50'
                        : isDarkMode
                          ? 'border-gray-700 hover:border-gray-600'
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                        selectedType === 'business' 
                          ? isDarkMode
                            ? 'bg-blue-800 text-blue-400'
                            : 'bg-blue-100 text-blue-600' 
                          : isDarkMode
                            ? 'bg-gray-800 text-gray-400'
                            : 'bg-gray-100 text-gray-500'
                      }`}>
                        <FaBriefcase size={20} />
                      </div>
                      <div className="text-left">
                        <div className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Lawyer
                        </div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          I provide legal services
                        </div>
                      </div>
                    </div>
                    {selectedType === 'business' && (
                      <FaCheckCircle className="text-blue-500 w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Continue Button */}
                <button
                  onClick={handleProfileTypeSubmit}
                  disabled={loading || !selectedType}
                  className={`w-full py-3 px-4 rounded-md flex items-center justify-center text-white font-medium shadow-md transition-all duration-300 transform hover:scale-102 hover:shadow-xl relative overflow-hidden ${
                    loading || !selectedType ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  style={{ 
                    background: loading || !selectedType 
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
                    {loading ? 'Saving...' : 'Continue'}
                  </span>
                  <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-20 bg-white transform -translate-x-full hover:translate-x-0 transition-transform duration-500"></div>
                </button>
              </div>

              {/* Skip Link */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => window.location.href = '/'}
                  className={`text-sm ${
                    isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                  } transition-colors duration-200`}
                >
                  Skip for now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTypeSelection;