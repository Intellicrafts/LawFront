// ProfileTypeSelection.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaCheckCircle, FaExclamationCircle, FaShieldAlt } from 'react-icons/fa';
import { User, Scale, ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import { authAPI, tokenManager } from '../api/apiService';
import { useToast } from '../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';

// Toast notification component (unchanged)
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
        case 'success': return 'bg-gradient-to-r from-green-900 to-gray-900 text-green-100 border-l-4 border-green-500';
        case 'error': return 'bg-gradient-to-r from-red-900 to-gray-900 text-red-100 border-l-4 border-red-500';
        case 'warning': return 'bg-gradient-to-r from-yellow-900 to-gray-900 text-yellow-100 border-l-4 border-yellow-500';
        case 'info': return 'bg-gradient-to-r from-blue-900 to-gray-900 text-blue-100 border-l-4 border-blue-500';
        default: return 'bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 border-l-4 border-gray-500';
      }
    } else {
      switch (type) {
        case 'success': return 'bg-gradient-to-r from-green-50 to-white text-green-900 border-l-4 border-green-500';
        case 'error': return 'bg-gradient-to-r from-red-50 to-white text-red-900 border-l-4 border-red-500';
        case 'warning': return 'bg-gradient-to-r from-yellow-50 to-white text-yellow-900 border-l-4 border-yellow-500';
        case 'info': return 'bg-gradient-to-r from-blue-50 to-white text-blue-900 border-l-4 border-blue-500';
        default: return 'bg-gradient-to-r from-gray-50 to-white text-gray-900 border-l-4 border-gray-500';
      }
    }
  };

  return (
    <div
      className={`fixed top-16 right-4 flex items-center p-4 rounded-lg shadow-lg transition-all duration-300 z-50 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
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
        className={`ml-auto -mx-1.5 -my-1.5 ${isDarkMode
            ? 'bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700'
            : 'bg-white text-gray-400 hover:text-gray-900 hover:bg-gray-100'
          } rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex items-center justify-center h-8 w-8`}
      >
        <span className="sr-only">Close</span>
        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
        </svg>
      </button>
    </div>
  );
};

// Profile Type Selection Component
const ProfileTypeSelection = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    // Get user data from localStorage
    const user = tokenManager.getUser();
    if (user) {
      setUserData(user);
    } else {
      window.location.href = '/auth';
    }
  }, []);

  const handleProfileTypeSubmit = async () => {
    if (!selectedType) {
      showError('Please select your profile type');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        user_type: selectedType === 'personal' ? 1 : 2
      };

      const response = await authAPI.saveAdditionalDetails(payload);

      if (response.data.success) {
        const updatedUser = { ...userData, user_type: payload.user_type };
        tokenManager.setUser(updatedUser);

        window.dispatchEvent(new CustomEvent('auth-status-changed', {
          detail: { authenticated: true, user: updatedUser }
        }));

        showSuccess('Profile type saved successfully!');

        setTimeout(() => {
          if (selectedType === 'personal') {
            window.location.href = '/';
          } else {
            window.location.href = '/lawyer-admin';
          }
        }, 1500);
      } else {
        showError('Failed to save profile type. Please try again.');
      }
    } catch (error) {
      console.error('Profile type save error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save profile type. Please try again.';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative min-h-screen flex flex-col justify-center items-center overflow-hidden transition-colors duration-500 ${isDarkMode 
        ? 'bg-[#0A0A0A]' 
        : 'bg-gray-50'
      }`}>
      
      {/* Premium Animated Background Layer matching LegalAIPortfolio / Login */}
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
          className={`absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full blur-[100px] ${isDarkMode ? 'bg-purple-600' : 'bg-purple-300'}`}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full px-4 flex flex-col items-center"
      >
        {/* Adjusted scale and padding for a zoomed-out look */}
        <div className={`max-w-3xl w-full mx-auto p-4 sm:p-6 lg:p-8 transition-all duration-300 transform scale-[0.80] sm:scale-90 md:scale-95 ${
          isDarkMode ? 'text-white' : 'text-slate-900'
        }`}>
          
          {/* Header Section */}
          <div className="text-center mb-6 lg:mb-8">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="flex justify-center mb-4 lg:mb-5"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                <div className={`relative w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br ${isDarkMode ? 'from-blue-600 via-purple-600 to-pink-600' : 'from-blue-500 via-purple-500 to-pink-500'} rounded-xl flex items-center justify-center shadow-xl transform group-hover:scale-105 transition-transform duration-300 border border-white/20`}>
                  <UserCheck size={28} className="text-white lg:hidden" />
                  <UserCheck size={32} className="text-white hidden lg:block" />
                </div>
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 lg:w-6 lg:h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  <Sparkles size={10} className="text-white lg:hidden" />
                  <Sparkles size={14} className="text-white hidden lg:block" />
                </div>
              </div>
            </motion.div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black mb-2 tracking-tight">
              Welcome, <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">{userData?.name?.split(' ')[0] || 'User'}!</span>
            </h1>
            <p className={`text-sm md:text-base max-w-xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Please select your account type below to personalize your MeraBakil experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 lg:gap-6 max-w-2xl mx-auto w-full mb-8 text-left">
            {/* Regular User Option */}
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedType('personal')}
              className={`group relative overflow-hidden rounded-xl backdrop-blur-xl p-5 lg:p-6 border-2 text-left transition-all duration-300 w-full ${
                selectedType === 'personal'
                  ? isDarkMode 
                    ? 'border-blue-500 bg-blue-900/60 shadow-[0_0_30px_rgba(59,130,246,0.25)]' 
                    : 'border-blue-500 bg-white/90 shadow-[0_0_30px_rgba(59,130,246,0.2)]'
                  : isDarkMode 
                    ? 'border-gray-700/60 bg-gray-800/60 hover:bg-gray-800/90 hover:border-blue-500/50 shadow-md' 
                    : 'border-gray-200/80 bg-white/70 hover:bg-white/95 hover:border-blue-400/50 shadow-sm'
              }`}
            >
              {selectedType === 'personal' && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full blur-xl z-0" />
              )}
              <div className="relative z-10 flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300 shadow-lg ${
                  selectedType === 'personal' || !isDarkMode
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}>
                  <User size={22} />
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shadow-sm ${
                  selectedType === 'personal' 
                    ? 'border-blue-500 bg-blue-500' 
                    : isDarkMode ? 'border-gray-600' : 'border-gray-300'
                }`}>
                  {selectedType === 'personal' && <FaCheckCircle className="text-white w-2.5 h-2.5" />}
                </div>
              </div>
              <h3 className={`relative z-10 text-lg lg:text-xl font-bold mb-1.5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                I am a User
              </h3>
              <p className={`relative z-10 text-xs lg:text-sm ${isDarkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-600'}`}>
                I need legal services, consultations, or document reviews.
              </p>
            </motion.button>

            {/* Lawyer / Expert Option */}
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedType('business')}
              className={`group relative overflow-hidden rounded-xl backdrop-blur-xl p-5 lg:p-6 border-2 text-left transition-all duration-300 w-full ${
                selectedType === 'business'
                  ? isDarkMode 
                    ? 'border-purple-500 bg-purple-900/60 shadow-[0_0_30px_rgba(168,85,247,0.25)]' 
                    : 'border-purple-500 bg-white/90 shadow-[0_0_30px_rgba(168,85,247,0.2)]'
                  : isDarkMode 
                    ? 'border-gray-700/60 bg-gray-800/60 hover:bg-gray-800/90 hover:border-purple-500/50 shadow-md' 
                    : 'border-gray-200/80 bg-white/70 hover:bg-white/95 hover:border-purple-400/50 shadow-sm'
              }`}
            >
              {selectedType === 'business' && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-full blur-xl z-0" />
              )}
              <div className="relative z-10 flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300 shadow-lg ${
                  selectedType === 'business' || !isDarkMode
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}>
                  <Scale size={22} />
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shadow-sm ${
                  selectedType === 'business' 
                    ? 'border-purple-500 bg-purple-500' 
                    : isDarkMode ? 'border-gray-600' : 'border-gray-300'
                }`}>
                  {selectedType === 'business' && <FaCheckCircle className="text-white w-2.5 h-2.5" />}
                </div>
              </div>
              <h3 className={`relative z-10 text-lg lg:text-xl font-bold mb-1.5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Advocate / Expert
              </h3>
              <p className={`relative z-10 text-xs lg:text-sm ${isDarkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-600'}`}>
                I offer legal services, representation, and professional advice.
              </p>
            </motion.button>
          </div>

          <div className="max-w-xs mx-auto space-y-3 text-center">
            <motion.button
              whileHover={selectedType && !loading ? { scale: 1.02 } : {}}
              whileTap={selectedType && !loading ? { scale: 0.98 } : {}}
              onClick={handleProfileTypeSubmit}
              disabled={loading || !selectedType}
              className={`w-full py-3.5 px-6 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-md transition-all duration-300 relative overflow-hidden ${
                loading || !selectedType 
                  ? 'opacity-60 cursor-not-allowed bg-gray-500 shadow-none' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-[0_0_15px_rgba(124,58,237,0.4)]'
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Continue <ArrowRight size={18} />
                </span>
              )}
            </motion.button>

            <button
              onClick={() => window.location.href = '/'}
              className={`text-xs font-medium transition-colors duration-200 border-b border-transparent pb-0.5 mt-2 inline-block ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-white hover:border-white/30' 
                  : 'text-gray-500 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Skip setup for now
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileTypeSelection;