// LawyerAdditionalDetails.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FaFileAlt, FaUpload, FaCheckCircle, FaExclamationCircle, FaShieldAlt, FaIdCard, FaDollarSign, FaGraduationCap, FaUser } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { authAPI, tokenManager } from '../api/apiService';
import { buildAppointmentConsultationFee } from '../utils/consultationFee';
import { useToast } from '../context/ToastContext';

// Toast notification component
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
          return 'bg-green-900/80 backdrop-blur-md text-green-100 border-l-4 border-green-500 shadow-[0_4px_30px_rgba(34,197,94,0.2)]';
        case 'error':
          return 'bg-red-900/80 backdrop-blur-md text-red-100 border-l-4 border-red-500 shadow-[0_4px_30px_rgba(239,68,68,0.2)]';
        case 'warning':
          return 'bg-yellow-900/80 backdrop-blur-md text-yellow-100 border-l-4 border-yellow-500 shadow-[0_4px_30px_rgba(234,179,8,0.2)]';
        case 'info':
        default:
          return 'bg-blue-900/80 backdrop-blur-md text-blue-100 border-l-4 border-blue-500 shadow-[0_4px_30px_rgba(59,130,246,0.2)]';
      }
    } else {
      switch (type) {
        case 'success':
          return 'bg-white/90 backdrop-blur-md text-green-900 border-l-4 border-green-500 shadow-[0_4px_30px_rgba(34,197,94,0.1)]';
        case 'error':
          return 'bg-white/90 backdrop-blur-md text-red-900 border-l-4 border-red-500 shadow-[0_4px_30px_rgba(239,68,68,0.1)]';
        case 'warning':
          return 'bg-white/90 backdrop-blur-md text-yellow-900 border-l-4 border-yellow-500 shadow-[0_4px_30px_rgba(234,179,8,0.1)]';
        case 'info':
        default:
          return 'bg-white/90 backdrop-blur-md text-blue-900 border-l-4 border-blue-500 shadow-[0_4px_30px_rgba(59,130,246,0.1)]';
      }
    }
  };

  return (
    <div
      className={`fixed top-16 right-4 flex items-center p-4 rounded-lg transition-all duration-300 z-50 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'} ${getToastStyles()}`}
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
        onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }}
        className={`ml-auto -mx-1.5 -my-1.5 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800/50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'} rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex items-center justify-center h-8 w-8 transition-colors`}
      >
        <span className="sr-only">Close</span>
        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
        </svg>
      </button>
    </div>
  );
};

// Legal strip component at the top
const LegalStrip = () => {
  return (
    <div className="w-full py-2.5 px-6 backdrop-blur-md bg-white/5 border-b border-white/10 text-white text-xs font-medium flex items-center justify-between z-20 shadow-sm relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-blue-900/40 pointer-events-none"></div>
      <div className="flex items-center relative z-10">
        <FaShieldAlt className="mr-2 text-blue-400" />
        <span className="opacity-90 tracking-wide">Secure Profile Setup | ISO 27001 Certified</span>
      </div>
      <div className="relative z-10 flex gap-4 hidden sm:flex">
        <button className="hover:text-blue-300 transition-colors duration-200 opacity-80 hover:opacity-100">Privacy Policy</button>
        <span className="opacity-30">|</span>
        <button className="hover:text-blue-300 transition-colors duration-200 opacity-80 hover:opacity-100">Terms of Service</button>
      </div>
    </div>
  );
};

// Enhanced Logo component with gradient
const Logo = () => {
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';
  return (
    <motion.div 
      initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="flex justify-center mb-6 lg:mb-8"
    >
      <div className="relative group mx-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
        <div className={`relative w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br ${isDarkMode ? 'from-blue-600 via-purple-600 to-pink-600' : 'from-blue-500 via-purple-500 to-pink-500'} rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-105 transition-transform duration-300 border border-white/20`}>
          <span className="text-white text-3xl font-black drop-shadow-md">M</span>
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
          <Sparkles size={14} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
};

// File Upload component
const FileUploadField = ({ id, name, label, icon, onChange, required = false, accept = "application/pdf,image/*" }) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [hasFile, setHasFile] = useState(false);
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
    <div className="space-y-2">
      <label htmlFor={id} className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        onClick={triggerFileInput}
        className={`relative border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden group ${
          hasFile
            ? isDarkMode ? 'border-green-500/50 bg-green-900/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'border-green-400 bg-green-50 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
            : isDarkMode ? 'border-gray-600/60 bg-white/5 hover:border-blue-500/50 hover:bg-blue-900/20 backdrop-blur-md' : 'border-blue-200 bg-white/60 hover:border-blue-400 hover:bg-blue-50 backdrop-blur-md shadow-sm'
        }`}
      >
        <input type="file" id={id} name={name} ref={fileInputRef} onChange={handleFileChange} className="hidden" accept={accept} required={required} />
        
        {hasFile ? (
          <div className="flex flex-col items-center relative z-10">
            <div className={`p-3 rounded-full mb-3 shadow-md ${isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'}`}>
              <FaCheckCircle className="h-6 w-6" />
            </div>
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-center truncate max-w-full px-2`}>{fileName}</span>
            <span className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{fileSize}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center relative z-10">
            <div className={`p-3 rounded-full mb-3 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 text-gray-400 group-hover:bg-blue-900/50 group-hover:text-blue-400' : 'bg-white shadow-sm text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
              {icon || <FaUpload className="h-6 w-6" />}
            </div>
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} group-hover:text-blue-500 transition-colors`}>Click to browse or drag and drop</span>
            <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>PDF, JPG, PNG up to 5MB</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Input Field component
const InputField = ({ type, id, name, value, onChange, placeholder, icon, required = false }) => {
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';

  return (
    <div className="relative group">
      <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${isDarkMode ? 'text-gray-500 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-blue-500'}`}>
        {icon}
      </div>
      <input
        id={id} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
        className={`block w-full pl-11 pr-4 py-3.5 rounded-xl shadow-sm transition-all duration-300 backdrop-blur-md ${
          isDarkMode
            ? 'border-gray-600/60 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10'
            : 'border-gray-200 bg-white/70 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 focus:bg-white'
        }`}
      />
    </div>
  );
};

// Textarea Field component
const TextareaField = ({ id, name, value, onChange, placeholder, rows = 4, required = false }) => {
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';

  return (
    <textarea
      id={id} name={name} value={value} onChange={onChange} rows={rows} placeholder={placeholder} required={required}
      className={`block w-full px-4 py-3.5 rounded-xl shadow-sm transition-all duration-300 resize-none backdrop-blur-md ${
        isDarkMode
          ? 'border-gray-600/60 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10'
          : 'border-gray-200 bg-white/70 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 focus:bg-white'
      }`}
    />
  );
};

// Multi-select component
const MultiSelectField = ({ id, name, label, options, selectedValues, onChange, required = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';

  const handleOptionToggle = (option) => {
    const newValues = selectedValues.includes(option)
      ? selectedValues.filter(val => val !== option)
      : [...selectedValues, option];
    onChange(newValues);
  };

  return (
    <div className="relative">
      <label htmlFor={id} className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3.5 text-left rounded-xl shadow-sm transition-all duration-300 backdrop-blur-md flex items-center justify-between ${
            isDarkMode
              ? 'border-gray-600/60 bg-white/5 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50'
              : 'border-gray-200 bg-white/70 text-gray-900 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400'
          }`}
        >
          <span className={`block truncate ${selectedValues.length === 0 ? (isDarkMode ? 'text-gray-400' : 'text-gray-500') : ''}`}>
            {selectedValues.length === 0 ? `Select ${label}` : `${selectedValues.length} item${selectedValues.length > 1 ? 's' : ''} selected`}
          </span>
          <svg className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
              className={`absolute z-30 w-full mt-2 rounded-xl shadow-xl backdrop-blur-xl border ${
                isDarkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'
              }`}
            >
              <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                {options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleOptionToggle(option)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors duration-200 flex items-center ${
                      selectedValues.includes(option)
                        ? isDarkMode ? 'bg-blue-600/30 text-blue-300' : 'bg-blue-50 text-blue-700 font-medium'
                        : isDarkMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border mr-3 flex items-center justify-center transition-colors ${
                      selectedValues.includes(option)
                        ? 'bg-blue-500 border-blue-500'
                        : isDarkMode ? 'border-gray-500' : 'border-gray-300'
                    }`}>
                      {selectedValues.includes(option) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selectedValues.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedValues.map((value) => (
            <span
              key={value}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium shadow-sm transition-colors ${
                isDarkMode ? 'bg-blue-900/40 text-blue-300 border border-blue-800/50 hover:bg-blue-800/50' : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
              }`}
            >
              {value}
              <button
                type="button"
                onClick={() => handleOptionToggle(value)}
                className={`ml-2 rounded-full p-0.5 transition-colors ${isDarkMode ? 'hover:bg-blue-800 text-blue-400' : 'hover:bg-blue-200 text-blue-600'}`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// Lawyer Additional Details Component
const LawyerAdditionalDetails = () => {
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [copCertificate, setCopCertificate] = useState(null);
  const [enrollmentCertificate, setEnrollmentCertificate] = useState(null);
  const [addressProof, setAddressProof] = useState(null);

  // Additional profile fields
  const [practiceAreas, setPracticeAreas] = useState([]);
  const [experience, setExperience] = useState('');
  const [courtPractice, setCourtPractice] = useState([]);
  const [bio, setBio] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const [languages, setLanguages] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // Get theme from Redux
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';

  // Global toast system
  const { showSuccess, showError } = useToast();

  // Practice areas options
  const practiceAreasOptions = [
    'Corporate Law', 'Criminal Law', 'Family Law', 'Property Law', 'Tax Law',
    'Labor Law', 'Intellectual Property', 'Constitutional Law', 'Environmental Law',
    'Banking Law', 'Insurance Law', 'Immigration Law', 'Consumer Protection',
    'Cyber Law', 'Real Estate Law'
  ];

  // Court practice options
  const courtOptions = [
    'Supreme Court', 'High Court', 'District Court', 'Sessions Court',
    'Magistrate Court', 'Family Court', 'Commercial Court', 'Tribunal',
    'Consumer Court', 'NCLT', 'NCLAT'
  ];

  // Languages options
  const languageOptions = [
    'English', 'Hindi', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Gujarati',
    'Kannada', 'Malayalam', 'Punjabi', 'Assamese', 'Odia', 'Urdu'
  ];

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!enrollmentNo.trim()) {
      showError('Please enter your Enrollment Number', 'error');
      return;
    }

    if (!experience || experience < 0) {
      showError('Please enter valid years of experience', 'error');
      return;
    }

    if (!consultationFee || consultationFee < 0) {
      showError('Please enter a valid consultation fee per minute', 'error');
      return;
    }

    if (practiceAreas.length === 0) {
      showError('Please select at least one practice area', 'error');
      return;
    }

    if (courtPractice.length === 0) {
      showError('Please select at least one court of practice', 'error');
      return;
    }

    if (languages.length === 0) {
      showError('Please select at least one language', 'error');
      return;
    }

    if (!bio.trim() || bio.trim().length < 50) {
      showError('Please provide a professional bio with at least 50 characters', 'error');
      return;
    }

    setLoading(true);

    try {
      // Prepare FormData for file uploads
      const formData = new FormData();
      formData.append('enrollment_no', enrollmentNo.trim());
      formData.append('experience_years', experience);
      formData.append('consultation_fee', JSON.stringify(buildAppointmentConsultationFee(consultationFee)));
      formData.append('practice_areas', JSON.stringify(practiceAreas));
      formData.append('court_practice', JSON.stringify(courtPractice));
      formData.append('languages_spoken', JSON.stringify(languages));
      formData.append('professional_bio', bio.trim());

      if (enrollmentCertificate) {
        formData.append('enrollment_certificate', enrollmentCertificate);
      }

      if (copCertificate) {
        formData.append('cop_certificate', copCertificate);
      }

      if (addressProof) {
        formData.append('address_proof', addressProof);
      }

      if (profilePhoto) {
        formData.append('profile_photo', profilePhoto);
      }

      // Call the additional details API
      const response = await authAPI.saveAdditionalDetails(formData);

      console.log('Lawyer details saved:', response.data);

      if (response.data.success) {
        showSuccess('Lawyer profile created successfully! Redirecting to your dashboard...');

        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('auth-status-changed', {
          detail: { authenticated: true, user: userData }
        }));

        setTimeout(() => {
          // Redirect to lawyer admin dashboard
          window.location.href = '/lawyer-admin';
        }, 2500);
      } else {
        showError('Failed to save lawyer details. Please try again.');
      }
    } catch (error) {
      console.error('Lawyer details save error:', error);

      // Handle validation errors from server
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        if (validationErrors) {
          const firstError = Object.values(validationErrors)[0][0];
          showError(firstError);
        } else {
          showError('Please check your form data and try again.');
        }
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to save lawyer details. Please try again.';
        showError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative min-h-screen flex flex-col items-center overflow-x-hidden transition-colors duration-500 ${
      isDarkMode ? 'bg-[#0A0A0A]' : 'bg-gray-50'
    }`}>
      {/* Premium Animated Background Layer */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className={`absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[120px] ${isDarkMode ? 'bg-blue-600' : 'bg-blue-300'}`}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 1 }}
          className={`absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full blur-[100px] ${isDarkMode ? 'bg-purple-600' : 'bg-purple-300'}`}
        />
      </div>

      <div className="relative z-10 w-full flex flex-col min-h-screen">
        {/* Legal strip */}
        <LegalStrip />

        {/* Toasts handled by global ToastProvider */}

        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`w-full max-w-4xl transform scale-[0.90] md:scale-95 lg:scale-100 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            {/* Glassmorphic Card container */}
            <div className={`rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl transition-all duration-300 border ${
              isDarkMode 
                ? 'bg-gradient-to-br from-blue-950/50 via-gray-900/80 to-purple-950/50 border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.1)]' 
                : 'bg-white/80 border-white/40 shadow-[0_0_50px_rgba(168,85,247,0.05)]'
            }`}>

              {/* Header */}
              <div className="px-6 py-8 sm:px-10 sm:py-10 border-b border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <Logo />
                <div className="text-center relative z-10">
                  <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-tight">
                    Lawyer Professional <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Details</span>
                  </h1>
                  <p className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Please provide your professional credentials to complete your lawyer profile
                  </p>
                </div>
              </div>

              {/* Form Content */}
              <div className="px-6 py-8 sm:px-10">
                <form onSubmit={handleSubmit} className="space-y-8">

                  {/* Basic Information Section */}
                  <div className={`p-6 rounded-2xl border transition-all duration-300 ${
                    isDarkMode ? 'bg-gray-800/40 border-gray-700/50 hover:border-blue-500/30' : 'bg-blue-50/50 border-blue-100/50 hover:border-blue-300/50'
                  }`}>
                    <h3 className={`text-xl font-bold mb-6 flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
                        <FaIdCard size={18} />
                      </div>
                      Basic Professional Information
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Bar Council Enrollment Number <span className="text-red-500">*</span>
                        </label>
                        <InputField
                          type="text" id="enrollmentNo" name="enrollmentNo" value={enrollmentNo}
                          onChange={(e) => setEnrollmentNo(e.target.value)}
                          placeholder="Enter your enrollment number" icon={<FaIdCard />} required
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Years of Experience <span className="text-red-500">*</span>
                        </label>
                        <InputField
                          type="number" id="experience" name="experience" value={experience}
                          onChange={(e) => setExperience(e.target.value)}
                          placeholder="Years of experience" icon={<FaGraduationCap />} required
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Consultation Fee (₹ / min) <span className="text-red-500">*</span>
                        </label>
                        <InputField
                          type="number" id="consultationFee" name="consultationFee" value={consultationFee}
                          onChange={(e) => setConsultationFee(e.target.value)}
                          placeholder="Fee per minute" icon={<FaDollarSign />} required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Practice Areas and Courts */}
                  <div className={`p-6 rounded-2xl border transition-all duration-300 ${
                    isDarkMode ? 'bg-gray-800/40 border-gray-700/50 hover:border-purple-500/30' : 'bg-purple-50/50 border-purple-100/50 hover:border-purple-300/50'
                  }`}>
                    <h3 className={`text-xl font-bold mb-6 flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                        <FaGraduationCap size={18} />
                      </div>
                      Practice Details
                    </h3>

                    <div className="space-y-6">
                      <MultiSelectField
                        id="practiceAreas" name="practiceAreas" label="Practice Areas"
                        options={practiceAreasOptions} selectedValues={practiceAreas}
                        onChange={setPracticeAreas} required
                      />
                      <MultiSelectField
                        id="courtPractice" name="courtPractice" label="Courts of Practice"
                        options={courtOptions} selectedValues={courtPractice}
                        onChange={setCourtPractice} required
                      />
                      <MultiSelectField
                        id="languages" name="languages" label="Languages Spoken"
                        options={languageOptions} selectedValues={languages}
                        onChange={setLanguages} required
                      />
                    </div>
                  </div>

                  {/* Professional Bio */}
                  <div className={`p-6 rounded-2xl border transition-all duration-300 ${
                    isDarkMode ? 'bg-gray-800/40 border-gray-700/50 hover:border-pink-500/30' : 'bg-pink-50/50 border-pink-100/50 hover:border-pink-300/50'
                  }`}>
                    <h3 className={`text-xl font-bold mb-6 flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-white shadow-lg">
                        <FaUser size={18} />
                      </div>
                      Professional Profile
                    </h3>

                    <div className="space-y-6">
                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Professional Bio <span className="text-red-500">*</span>
                        </label>
                        <TextareaField
                          id="bio" name="bio" value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Write a brief description about your expertise, achievements, and what makes you unique as a lawyer..."
                          rows={4} required
                        />
                      </div>
                      <FileUploadField
                        id="profilePhoto" name="profilePhoto" label="Profile Photo"
                        icon={<FaUser />} onChange={setProfilePhoto} required={false} accept="image/*"
                      />
                    </div>
                  </div>

                  {/* Documents Section */}
                  <div className={`p-6 rounded-2xl border transition-all duration-300 ${
                    isDarkMode ? 'bg-gray-800/40 border-gray-700/50 hover:border-green-500/30' : 'bg-green-50/50 border-green-100/50 hover:border-green-300/50'
                  }`}>
                    <h3 className={`text-xl font-bold mb-6 flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-white shadow-lg">
                        <FaFileAlt size={18} />
                      </div>
                      Required Documents
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <FileUploadField
                        id="enrollmentCertificate" name="enrollmentCertificate" label="Certificate of Enrollment"
                        icon={<FaFileAlt />} onChange={setEnrollmentCertificate} required={false} accept="application/pdf,image/*"
                      />
                      <FileUploadField
                        id="copCertificate" name="copCertificate" label="Certificate of Practice (CoP)"
                        icon={<FaFileAlt />} onChange={setCopCertificate} required={false} accept="application/pdf,image/*"
                      />
                      <div className="md:col-span-2">
                        <FileUploadField
                          id="addressProof" name="addressProof" label="Address Proof (Optional)"
                          icon={<FaFileAlt />} onChange={setAddressProof} required={false} accept="application/pdf,image/*"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`group w-full py-4 px-6 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg transition-all duration-300 relative overflow-hidden ${
                        loading ? 'opacity-70 cursor-not-allowed bg-gray-600' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-[0_0_25px_rgba(124,58,237,0.4)] hover:scale-[1.02]'
                      }`}
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        {loading ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Your Profile...
                          </>
                        ) : (
                          <>Complete Lawyer Setup <FaCheckCircle className="transform group-hover:scale-110 transition-transform" /></>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-shine"></div>
                    </button>
                    
                    {/* Skip Link */}
                    <div className="mt-6 text-center">
                      <button
                        type="button"
                        onClick={() => window.location.href = '/lawyer-admin'}
                        className={`text-sm font-medium border-b border-transparent pb-0.5 transition-colors duration-200 ${
                          isDarkMode ? 'text-gray-400 hover:text-white hover:border-white/30' : 'text-gray-500 hover:text-gray-900 hover:border-gray-400'
                        }`}
                      >
                        Complete later &rarr;
                      </button>
                    </div>
                  </div>

                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LawyerAdditionalDetails;
