import React, { useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '../hooks/useDarkMode';
import { useNavigate } from 'react-router-dom';
import { lawyerVerificationAPI } from '../api/apiService';
import { 
  User, Briefcase, Upload, CheckCircle, AlertCircle, Eye, Download, 
  Send, Shield, Award, BookOpen, Scale, Building, Users, Heart, 
  ChevronRight, X, Paperclip, ArrowRight, Edit, Sparkles, Brain, 
  Zap, FileCheck, Cpu, Target, TrendingUp, Loader, RefreshCw, 
  ChevronDown, MoreVertical, Globe, MapPin, Camera, UserCheck,
  FileText, GraduationCap, IdCard, Calendar, Phone, Mail,
  Star, Clock, Info, Car, ChevronLeft
} from 'lucide-react';

const UserOnboarding = () => {
  const { isDark } = useDarkMode();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // State management (optimized to prevent unnecessary re-renders)
  const [currentStep, setCurrentStep] = useState('userType'); // userType -> lawyerVerification -> verification
  const [degreeCategory, setDegreeCategory] = useState(''); // 'indian' or 'international'
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  
  // Form states for lawyer verification
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    
    // Identity Verification
    identityType: '',
    identityNumber: '',
    identityDocument: null,
    
    // Education & Qualifications
    lawDegree: '',
    university: '',
    graduationYear: '',
    barCouncilNumber: '',
    experienceYears: '',
    
    // Professional Details
    specializations: [],
    languages: [],
    courtsPracticed: [],
    
    // Contact & Location
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Profile
    profileImage: null,
    bio: '',
    consultationFee: '',
    availability: 'weekdays'
  });

  // Static data (moved outside component to prevent re-creation)
  const indianLawDegrees = useMemo(() => [
    { value: 'LLB-3', label: 'LLB (3 Year)', desc: 'Bachelor of Laws - 3 Year Program' },
    { value: 'LLB-5', label: 'LLB (5 Year)', desc: 'Bachelor of Laws - 5 Year Program' },
    { value: 'BA-LLB', label: 'BA LLB (5 Year)', desc: 'Bachelor of Arts + Laws' },
    { value: 'BCOM-LLB', label: 'BCom LLB (5 Year)', desc: 'Bachelor of Commerce + Laws' },
    { value: 'BSC-LLB', label: 'BSc LLB (5 Year)', desc: 'Bachelor of Science + Laws' },
    { value: 'BBA-LLB', label: 'BBA LLB (5 Year)', desc: 'Business Administration + Laws' },
    { value: 'LLM', label: 'LLM', desc: 'Master of Laws' },
    { value: 'PhD-Law', label: 'PhD in Law', desc: 'Doctor of Philosophy in Law' }
  ], []);

  const internationalLawDegrees = useMemo(() => [
    { value: 'JD', label: 'JD (Juris Doctor)', desc: 'United States Law Degree' },
    { value: 'LLB-UK', label: 'LLB (UK)', desc: 'United Kingdom Bachelor of Laws' },
    { value: 'LLM-UK', label: 'LLM (UK)', desc: 'United Kingdom Master of Laws' },
    { value: 'LLM-US', label: 'LLM (US)', desc: 'United States Master of Laws' },
    { value: 'MJ', label: 'Master of Jurisprudence', desc: 'Professional Law Degree' },
    { value: 'SJD', label: 'Doctor of Juridical Science', desc: 'Research Doctorate in Law' }
  ], []);

  const identityTypes = useMemo(() => [
    { value: 'aadhaar', label: 'Aadhaar Card', icon: IdCard },
    { value: 'pan', label: 'PAN Card', icon: FileText },
    { value: 'passport', label: 'Passport', icon: BookOpen },
    { value: 'driving_license', label: 'Driving License', icon: Car },
    { value: 'voter_id', label: 'Voter ID', icon: Users }
  ], []);

  const practiceAreas = useMemo(() => [
    'Corporate Law', 'Criminal Law', 'Civil Law', 'Family Law', 'Property Law', 
    'Tax Law', 'Labour Law', 'IP Law', 'Constitutional Law', 'Banking Law',
    'Immigration Law', 'Environmental Law', 'Consumer Law', 'Cyber Law', 'Maritime Law'
  ], []);

  const languages = useMemo(() => [
    'Hindi', 'English', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Gujarati', 
    'Kannada', 'Malayalam', 'Punjabi', 'Odia', 'Urdu'
  ], []);

  // Stable className computations
  const inputClassName = useMemo(() => {
    const base = 'w-full px-3 py-2 rounded-lg border h-10 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm';
    return isDark 
      ? `${base} bg-gray-800/50 border-gray-700 text-white focus:border-purple-500`
      : `${base} bg-white border-gray-300 text-gray-900 focus:border-purple-500`;
  }, [isDark]);

  const selectClassName = useMemo(() => {
    return `${inputClassName} appearance-none cursor-pointer`;
  }, [inputClassName]);

  const labelClassName = useMemo(() => {
    return isDark 
      ? 'block text-xs font-medium text-gray-300'
      : 'block text-xs font-medium text-gray-700';
  }, [isDark]);

  // Optimized event handlers with useCallback
  const handleUserTypeSelect = useCallback((type) => {
    if (type === 'user') {
      navigate('/');
    } else {
      setCurrentStep('lawyerVerification');
    }
  }, [navigate]);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleArrayFieldToggle = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  }, []);

  // File upload handlers
  const handleFileUpload = useCallback((field, file) => {
    if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
      setFormData(prev => ({ ...prev, [field]: file }));
    } else {
      alert('File size must be less than 5MB');
    }
  }, []);

  const handleDrop = useCallback((e, field) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files[0]) handleFileUpload(field, files[0]);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  // Form validation
  const validateForm = useCallback(() => {
    const requiredFields = [
      'fullName', 'email', 'phone', 'dateOfBirth',
      'identityType', 'identityNumber', 'identityDocument',
      'lawDegree', 'university', 'graduationYear', 'barCouncilNumber', 'experienceYears'
    ];
    
    for (let field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
        return false;
      }
    }
    
    if (formData.specializations.length === 0) {
      alert('Please select at least one practice area.');
      return false;
    }
    
    return true;
  }, [formData]);



  // API submission
  const submitVerificationApplication = useCallback(async () => {
    if (!validateForm()) return;
    
    setIsVerifying(true);
    setVerificationProgress(0);
    
    const steps = [
      { text: 'Uploading documents...', duration: 1000, progress: 20 },
      { text: 'Verifying identity...', duration: 1500, progress: 40 },
      { text: 'Checking qualifications...', duration: 1200, progress: 60 },
      { text: 'Validating Bar Council...', duration: 1500, progress: 80 },
      { text: 'Finalizing application...', duration: 600, progress: 100 }
    ];
    
    try {
      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, steps[i].duration));
        setVerificationProgress(steps[i].progress);
      }
      
      console.log('Submitting verification application with data:', formData);
      const response = await lawyerVerificationAPI.submitVerificationApplication(formData);
      
      console.log('Verification application submitted successfully:', response);
      
      setTimeout(() => {
        alert(`Verification application submitted successfully! 
        Your application ID is: ${response.application_id || 'PENDING'}
        
        We will review your application within 24-48 hours and notify you via email.`);
        
        if (response.redirect_url) {
          window.location.href = response.redirect_url;
        } else {
          navigate('/lawyer-admin');
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error submitting verification application:', error);
      
      let errorMessage = 'Failed to submit verification application. ';
      if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Please try again later.';
      }
      
      alert(errorMessage);
    } finally {
      setIsVerifying(false);
      setVerificationProgress(0);
    }
  }, [validateForm, formData, navigate]);

  // User Type Selection Component (Optimized)
  const UserTypeSelection = React.memo(() => (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto h-full flex flex-col justify-center"
    >
      {/* Header */}
      <div className="text-center mb-6 lg:mb-8">
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="flex justify-center mb-3 lg:mb-4"
        >
          <div className="relative">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg lg:rounded-xl flex items-center justify-center shadow-md">
              <UserCheck size={20} className="text-white lg:hidden" />
              <UserCheck size={24} className="text-white hidden lg:block" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Sparkles size={8} className="text-white lg:hidden" />
              <Sparkles size={10} className="text-white hidden lg:block" />
            </div>
          </div>
        </motion.div>
        
        <h1 className={`text-xl md:text-2xl lg:text-3xl font-bold mb-2 lg:mb-3 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Welcome to <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">MeraBakil</span>
        </h1>
        

      </div>

      {/* User Type Cards */}
      <div className="grid lg:grid-cols-2 gap-3 lg:gap-5 max-w-4xl mx-auto px-4">
        {/* I am a User Card */}
        <motion.div
          whileHover={{ scale: 1.005, y: -2 }}
          whileTap={{ scale: 0.995 }}
          className={`relative overflow-hidden rounded-lg lg:rounded-xl ${
            isDark 
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
              : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
          } border shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg`}
          onClick={() => handleUserTypeSelect('user')}
        >
          <div className="absolute top-0 right-0 w-16 h-16 lg:w-18 lg:h-18 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full -translate-y-3 translate-x-3 lg:-translate-y-4 lg:translate-x-4" />
          
          <div className="relative p-3 lg:p-4">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-md lg:rounded-lg flex items-center justify-center shadow-sm">
                <User size={16} className="text-white lg:hidden" />
                <User size={20} className="text-white hidden lg:block" />
              </div>
              <ArrowRight size={16} className={`${isDark ? 'text-gray-400' : 'text-gray-500'} transition-transform lg:size-5`} />
            </div>
            
            <h3 className={`text-lg lg:text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              I am a User
            </h3>
            
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-3 lg:mb-4 text-xs lg:text-sm leading-relaxed`}>
              Access legal services, find lawyers, book consultations, and get expert legal advice.
            </p>
            
            <div className="space-y-1 lg:space-y-1.5">
              {[
                'Find Qualified Lawyers',
                'Book Consultations', 
                'Document Review',
                'AI Legal Assistance'
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle size={10} className="text-blue-500 flex-shrink-0 lg:size-3" />
                  <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* I am a Lawyer Card */}
        <motion.div
          whileHover={{ scale: 1.005, y: -2 }}
          whileTap={{ scale: 0.995 }}
          className={`relative overflow-hidden rounded-lg lg:rounded-xl ${
            isDark 
              ? 'bg-gradient-to-br from-purple-900 to-indigo-900 border-purple-700' 
              : 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200'
          } border shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg`}
          onClick={() => handleUserTypeSelect('lawyer')}
        >
          <div className="absolute top-0 right-0 w-16 h-16 lg:w-18 lg:h-18 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full -translate-y-3 translate-x-3 lg:-translate-y-4 lg:translate-x-4" />
          
          <div className="relative p-3 lg:p-4">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md lg:rounded-lg flex items-center justify-center shadow-sm">
                <Scale size={16} className="text-white lg:hidden" />
                <Scale size={20} className="text-white hidden lg:block" />
              </div>
              <ArrowRight size={16} className={`${isDark ? 'text-gray-400' : 'text-gray-500'} transition-transform lg:size-5`} />
            </div>
            
            <h3 className={`text-lg lg:text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              I am a Lawyer
            </h3>
            
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-3 lg:mb-4 text-xs lg:text-sm leading-relaxed`}>
              Join our platform to expand your practice, connect with clients, and grow your career.
            </p>
            
            <div className="space-y-1 lg:space-y-1.5">
              {[
                'Verified Lawyer Profile',
                'Client Management', 
                'Automated Scheduling',
                'Premium Marketing'
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle size={10} className="text-purple-500 flex-shrink-0 lg:size-3" />
                  <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mt-5 lg:mt-7 px-4"
      >
        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-2 lg:mb-3`}>
          Trusted by 10,000+ users and 500+ verified lawyers across India
        </p>
        
        <div className="flex justify-center space-x-3 lg:space-x-5">
          {[
            { icon: Shield, text: 'Secure' },
            { icon: Award, text: 'Verified' },
            { icon: Users, text: 'Trusted' },
            { icon: Heart, text: 'Reliable' }
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-1">
              <item.icon size={10} className="text-purple-500 lg:size-3" />
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  ));

  // Education Section Component (New optimized design)
  const EducationSection = React.memo(() => (
    <div className="space-y-4">
      <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Educational Qualifications
      </h3>

      {/* Degree Category Selection */}
      {!degreeCategory && (
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Select your law degree category:
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setDegreeCategory('indian')}
              className={`p-3 rounded-lg border-2 border-dashed ${
                isDark 
                  ? 'border-purple-600 bg-purple-900/20 hover:bg-purple-900/30' 
                  : 'border-purple-300 bg-purple-50 hover:bg-purple-100'
              } transition-all duration-300 text-center`}
            >
              <GraduationCap size={18} className="mx-auto mb-1.5 text-purple-500" />
              <div className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Indian Law Degree
              </div>
              <div className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                LLB, BA LLB, LLM, etc.
              </div>
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setDegreeCategory('international')}
              className={`p-3 rounded-lg border-2 border-dashed ${
                isDark 
                  ? 'border-indigo-600 bg-indigo-900/20 hover:bg-indigo-900/30' 
                  : 'border-indigo-300 bg-indigo-50 hover:bg-indigo-100'
              } transition-all duration-300 text-center`}
            >
              <Globe size={18} className="mx-auto mb-1.5 text-indigo-500" />
              <div className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                International Degree
              </div>
              <div className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                JD, LLB (UK), LLM (US), etc.
              </div>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Degree Selection based on category */}
      {degreeCategory && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setDegreeCategory('')}
              className={`p-1 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <ChevronLeft size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
            </button>
            <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {degreeCategory === 'indian' ? 'Indian Law Degrees' : 'International Law Degrees'}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {(degreeCategory === 'indian' ? indianLawDegrees : internationalLawDegrees).map((degree) => (
              <motion.button
                key={degree.value}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleInputChange('lawDegree', degree.value)}
                className={`p-3 rounded-lg border text-left transition-all duration-300 ${
                  formData.lawDegree === degree.value
                    ? (isDark 
                        ? 'border-purple-500 bg-purple-900/30 shadow-lg' 
                        : 'border-purple-500 bg-purple-50 shadow-lg')
                    : (isDark 
                        ? 'border-gray-700 bg-gray-800/50 hover:border-gray-600' 
                        : 'border-gray-200 bg-white hover:border-gray-300')
                }`}
              >
                <div className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {degree.label}
                </div>
                <div className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                  {degree.desc}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Additional fields when degree is selected */}
          {formData.lawDegree && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-1.5">
                <label className={labelClassName}>
                  University/Institution
                </label>
                <input
                  type="text"
                  value={formData.university || ''}
                  onChange={(e) => handleInputChange('university', e.target.value)}
                  className={inputClassName}
                  placeholder="Enter your university name"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className={labelClassName}>
                  Graduation Year
                </label>
                <input
                  type="number"
                  min="1950"
                  max={new Date().getFullYear()}
                  value={formData.graduationYear || ''}
                  onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                  className={inputClassName}
                  placeholder="YYYY"
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  ));

  // File Upload Component
  // Memoized styles for file upload
  const uploadAreaStyles = useMemo(() => ({
    dragOver: isDark ? 'border-purple-400 bg-purple-900/20' : 'border-purple-400 bg-purple-50',
    hasFile: isDark ? 'border-green-500 bg-green-900/20' : 'border-green-500 bg-green-50',
    default: isDark ? 'border-gray-600 bg-gray-800/30' : 'border-gray-300 bg-gray-50',
    hover: isDark ? 'hover:border-purple-500 hover:bg-purple-900/30' : 'hover:border-purple-400 hover:bg-purple-50'
  }), [isDark]);

  // Stable file upload component
  const renderFileUpload = useCallback((field, label, accept = "image/*,.pdf", required = false) => {
    const hasFile = formData[field];
    const currentStyles = dragOver ? uploadAreaStyles.dragOver : hasFile ? uploadAreaStyles.hasFile : uploadAreaStyles.default;
    
    return (
      <div className="space-y-2" key={field}>
        <label className={labelClassName}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        <div
          className={`relative border-2 border-dashed rounded-xl p-6 cursor-pointer ${currentStyles} ${uploadAreaStyles.hover}`}
          onDrop={(e) => handleDrop(e, field)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={(e) => e.target.files[0] && handleFileUpload(field, e.target.files[0])}
            className="hidden"
          />
          
          <div className="text-center">
            {hasFile ? (
              <div className="space-y-2">
                <CheckCircle size={32} className="mx-auto text-green-500" />
                <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  File uploaded successfully
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {hasFile.name}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload size={32} className={`mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Drop your file here or click to browse
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Supports PDF, JPG, PNG (Max 5MB)
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }, [formData, dragOver, uploadAreaStyles, labelClassName, handleDrop, handleDragOver, handleDragLeave, handleFileUpload, isDark]);

  // Personal Information Form Section
  const PersonalInfoSection = React.memo(() => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <label className={labelClassName}>
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.fullName || ''}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          className={inputClassName}
          placeholder="Enter your full name"
        />
      </div>
      
      <div className="space-y-1.5">
        <label className={labelClassName}>
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={formData.email || ''}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={inputClassName}
          placeholder="Enter your email"
        />
      </div>

      <div className="space-y-1.5">
        <label className={labelClassName}>
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={formData.phone || ''}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          className={inputClassName}
          placeholder="Enter your phone number"
        />
      </div>

      <div className="space-y-1.5">
        <label className={labelClassName}>
          Bar Council Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.barCouncilNumber || ''}
          onChange={(e) => handleInputChange('barCouncilNumber', e.target.value)}
          className={inputClassName}
          placeholder="Enter Bar Council registration number"
        />
      </div>
    </div>
  ));

  // Experience Section
  const ExperienceSection = React.memo(() => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[4rem]">
      <div className="space-y-1.5">
        <label className={labelClassName}>
          Professional Experience <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.experienceYears || ''}
          onChange={(e) => handleInputChange('experienceYears', e.target.value)}
          className={selectClassName}
        >
          <option value="">Select your experience level</option>
          <option value="fresher">🌟 Fresher (0-1 years) - New to Practice</option>
          <option value="2-5">⚖️ 2-5 years - Junior Level</option>
          <option value="6-10">🎯 6-10 years - Mid-Level</option>
          <option value="11-15">🏆 11-15 years - Senior Level</option>
          <option value="16-20">💼 16-20 years - Expert Level</option>
          <option value="20+">👨‍⚖️ 20+ years - Master Level</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className={labelClassName}>
          Date of Birth <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={formData.dateOfBirth || ''}
          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          className={inputClassName}
        />
      </div>
    </div>
  ));

  // Lawyer Verification Form Component
  const LawyerVerification = React.memo(() => (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className={`rounded-xl ${
        isDark ? 'bg-gray-800/80' : 'bg-white/80'
      } backdrop-blur-sm border ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      } shadow-lg overflow-hidden`}>
        
        {/* Header */}
        <div className={`p-4 lg:p-6 ${
          isDark ? 'bg-gradient-to-r from-purple-900/50 to-indigo-900/50' : 'bg-gradient-to-r from-purple-50 to-indigo-50'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Lawyer Verification
              </h2>
              <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Complete your professional verification to join MeraBakil
              </p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4 lg:p-6 space-y-6">
          {/* Personal Information */}
          <PersonalInfoSection />

          {/* Education Section */}
          <EducationSection />

          {/* Identity Verification */}
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Identity Verification
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {identityTypes.map((type) => (
                <motion.button
                  key={type.value}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleInputChange('identityType', type.value)}
                  className={`p-4 rounded-xl border text-center transition-all duration-300 ${
                    formData.identityType === type.value
                      ? (isDark 
                          ? 'border-purple-500 bg-purple-900/30 shadow-lg' 
                          : 'border-purple-500 bg-purple-50 shadow-lg')
                      : (isDark 
                          ? 'border-gray-700 bg-gray-800/50 hover:border-gray-600' 
                          : 'border-gray-200 bg-white hover:border-gray-300')
                  }`}
                >
                  <type.icon size={20} className="mx-auto mb-2 text-purple-500" />
                  <div className={`font-medium text-xs ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {type.label}
                  </div>
                </motion.button>
              ))}
            </div>

            {formData.identityType && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <div className="space-y-1.5">
                  <label className={labelClassName}>
                    Identity Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.identityNumber || ''}
                    onChange={(e) => handleInputChange('identityNumber', e.target.value)}
                    className={inputClassName}
                    placeholder="Enter identity number"
                  />
                </div>
                
{renderFileUpload('identityDocument', 'Upload Identity Document', 'image/*,.pdf', true)}
              </motion.div>
            )}
          </div>

          {/* Practice Areas */}
          <div className="space-y-3">
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Practice Areas <span className="text-red-500">*</span>
            </h3>
            
            <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              {practiceAreas.map((area) => (
                <motion.button
                  key={area}
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleArrayFieldToggle('specializations', area)}
                  className={`px-2.5 py-1.5 rounded-md border text-xs font-medium transition-all duration-300 ${
                    formData.specializations.includes(area)
                      ? (isDark 
                          ? 'border-purple-500 bg-purple-900/30 text-white' 
                          : 'border-purple-500 bg-purple-50 text-purple-700')
                      : (isDark 
                          ? 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600' 
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300')
                  }`}
                >
                  {area}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-3">
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Languages <span className="text-red-500">*</span>
            </h3>
            
            <div className="grid grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
              {languages.map((lang) => (
                <motion.button
                  key={lang}
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleArrayFieldToggle('languages', lang)}
                  className={`px-2 py-1.5 rounded-md border text-xs font-medium transition-all duration-300 text-center ${
                    formData.languages.includes(lang)
                      ? (isDark 
                          ? 'border-purple-500 bg-purple-900/30 text-white' 
                          : 'border-purple-500 bg-purple-50 text-purple-700')
                      : (isDark 
                          ? 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600' 
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300')
                  }`}
                >
                  {lang}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Experience & Additional Info */}
          <ExperienceSection />

          {/* Profile Image Upload */}
          <div className="space-y-3">
            <label className={`block text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Profile Image (Optional)
            </label>
            
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
              {/* Profile Preview */}
              <div className="flex-shrink-0">
                <div className="relative">
                  {formData.profileImage ? (
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-500 shadow-lg">
                      <img
                        src={URL.createObjectURL(formData.profileImage)}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className={`w-24 h-24 rounded-full border-2 border-dashed ${
                      isDark ? 'border-gray-600 bg-gray-800/30' : 'border-gray-300 bg-gray-50'
                    } flex items-center justify-center`}>
                      <User size={32} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                    </div>
                  )}
                  
                  {/* Upload Button Overlay */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Camera size={14} className="text-white" />
                  </motion.button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files[0] && handleFileUpload('profileImage', e.target.files[0])}
                    className="hidden"
                  />
                </div>
              </div>
              
              {/* Upload Instructions */}
              <div className="flex-1 text-center lg:text-left">
                <div className={`font-medium text-sm mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Professional Profile Photo
                </div>
                <div className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Upload a clear, professional headshot for your profile
                </div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  • JPG, PNG formats only
                  • Maximum file size: 5MB
                  • Recommended: 400x400px or higher
                </div>
                
                {formData.profileImage && (
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInputChange('profileImage', null)}
                    className={`mt-2 px-3 py-1 rounded-md text-xs font-medium transition-all duration-300 ${
                      isDark 
                        ? 'bg-red-900/30 border border-red-700 text-red-300 hover:bg-red-900/50' 
                        : 'bg-red-50 border border-red-200 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    Remove Image
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <motion.button
              type="button"
              onClick={submitVerificationApplication}
              disabled={isVerifying}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`px-6 py-3 rounded-lg font-medium text-white shadow-md transition-all duration-300 ${
                isVerifying
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-lg'
              }`}
            >
              {isVerifying ? (
                <div className="flex items-center space-x-1.5">
                  <RefreshCw size={16} className="animate-spin" />
                  <span className="text-sm">Verifying Application...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5">
                  <Send size={16} />
                  <span className="text-sm">Submit for Verification</span>
                </div>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  ));

  return (
    <div className={`min-h-screen transition-all duration-500 relative overflow-hidden ${
      isDark 
        ? 'bg-gray-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      {/* Background Animations for Dark Mode */}
      {isDark && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Glass Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/95 backdrop-blur-3xl"></div>
          
          {/* Floating Legal Icons */}
          <motion.div
            animate={{ 
              y: [-15, 15, -15],
              rotate: [0, 3, -3, 0],
              opacity: [0.05, 0.15, 0.05]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-1/4 text-purple-500/15"
          >
            <Scale size={50} />
          </motion.div>
          
          <motion.div
            animate={{ 
              y: [12, -12, 12],
              rotate: [0, -3, 3, 0],
              opacity: [0.05, 0.12, 0.05]
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-1/4 right-1/4 text-indigo-500/15"
          >
            <BookOpen size={40} />
          </motion.div>
          
          <motion.div
            animate={{ 
              y: [-10, 10, -10],
              rotate: [0, 5, -5, 0],
              opacity: [0.03, 0.1, 0.03]
            }}
            transition={{ 
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
            className="absolute top-1/2 left-1/6 text-violet-500/15"
          >
            <Shield size={45} />
          </motion.div>
          
          <motion.div
            animate={{ 
              y: [8, -8, 8],
              rotate: [0, -4, 4, 0],
              opacity: [0.05, 0.12, 0.05]
            }}
            transition={{ 
              duration: 11,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-1/3 left-3/4 text-pink-500/15"
          >
            <Award size={35} />
          </motion.div>
          
          <motion.div
            animate={{ 
              y: [-12, 12, -12],
              rotate: [0, 6, -6, 0],
              opacity: [0.03, 0.08, 0.03]
            }}
            transition={{ 
              duration: 13,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
            className="absolute top-3/4 right-1/6 text-purple-500/15"
          >
            <Building size={42} />
          </motion.div>

          {/* Subtle Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          ></div>
          
          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-0.5 bg-purple-500/15 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-30, 30, -30],
                  x: [-15, 15, -15],
                  opacity: [0, 0.4, 0],
                  scale: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 6
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Top Spacing for Navbar */}
      <div className="pt-16 pb-6 px-4 relative z-10">
        <div className="container mx-auto max-w-7xl">
          {/* Progress Indicator */}
          {currentStep === 'lawyerVerification' && (
            <motion.div 
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <div className="flex justify-center">
                <div className={`px-4 py-1.5 rounded-full ${
                  isDark ? 'bg-gray-800/80 text-white' : 'bg-white/80 text-gray-800'
                } backdrop-blur-sm border ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                } shadow-md`}>
                  <span className="text-xs font-medium">Step 2: Lawyer Verification</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Main Content */}
          <AnimatePresence mode="wait">
            {currentStep === 'userType' ? 
              <UserTypeSelection key="userType" /> : 
              <LawyerVerification key="lawyerVerification" />
            }
          </AnimatePresence>
          
          {/* Verification Progress Modal */}
          <AnimatePresence>
            {isVerifying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className={`max-w-md w-full mx-4 p-8 rounded-2xl ${
                    isDark ? 'bg-gray-800' : 'bg-white'
                  } shadow-2xl`}
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center"
                    >
                      <Shield size={32} className="text-white" />
                    </motion.div>
                    
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Verifying Your Application
                    </h3>
                    
                    <div className={`w-full bg-gray-200 rounded-full h-3 mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <motion.div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${verificationProgress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Please wait while we process your verification documents...
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default UserOnboarding;