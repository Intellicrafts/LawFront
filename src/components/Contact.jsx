import React, { useState, useEffect } from 'react';
import { authAPI,  } from '../api/apiService';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle,
  AlertCircle,
  Loader2,
  User,
  MessageSquare,
  Globe,
  Shield,
  Zap,
  Users,
  X,
  Rocket,
  AlertTriangle,
  Info
} from 'lucide-react';

// Mock API service for demonstration
const mockApiClient = {
  post: async (url, data) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate different responses based on data
    if (!data.name || !data.email || !data.message) {
      throw new Error('Validation failed');
    }
    
    // Simulate success
    return {
      data: {
        success: true,
        message: 'Message sent successfully!',
        id: Math.random().toString(36).substr(2, 9)
      }
    };
  }
};

// Token manager for user authentication
const tokenManager = {
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  }
};

// Toast Component
const Toast = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const iconColors = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full transition-all duration-300 transform ${
      toast.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`p-4 rounded-lg border shadow-lg backdrop-blur-sm ${colors[toast.type]}`}>
        <div className="flex items-start space-x-3">
          <div className={`flex-shrink-0 ${iconColors[toast.type]}`}>
            {icons[toast.type]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{toast.title}</p>
            {toast.message && (
              <p className="text-sm opacity-90 mt-1">{toast.message}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Rocket animation component
const RocketAnimation = ({ show, onComplete }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
      <div className="relative">
        <Rocket className={`w-8 h-8 text-sky-500 transition-all duration-2000 ${
          show ? 'transform -translate-y-96 opacity-0' : 'transform translate-y-0 opacity-100'
        }`} />
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className={`w-1 bg-gradient-to-t from-orange-400 to-transparent transition-all duration-1000 ${
            show ? 'h-24 opacity-100' : 'h-0 opacity-0'
          }`} />
        </div>
      </div>
    </div>
  );
};

const Contact = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    service: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [toast, setToast] = useState({ show: false, type: 'info', title: '', message: '' });
  const [showRocket, setShowRocket] = useState(false);
  const [user, setUser] = useState(null);

  // Load user data on component mount
  useEffect(() => {
    const userData = tokenManager.getUser();
    if (userData) {
      setUser(userData);
      setFormData(prev => ({
        ...prev,
        userId: userData.id || '',
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || ''
      }));
    }
  }, []);

  const showToast = (type, title, message = '') => {
    setToast({ show: true, type, title, message });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.length < 2 ? 'Name must be at least 2 characters' : '';
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Please enter a valid email' : '';
      case 'phone':
        return value && !/^[\d\s\-\+\(\)]{10,}$/.test(value) ? 'Please enter a valid phone number' : '';
      case 'message':
        return value.length < 10 ? 'Message must be at least 10 characters' : '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!tokenManager.isAuthenticated()) {
      showToast('warning', 'Authentication Required', 'Please log in to send a message.');
      return;
    }

    // Validate all required fields
    const newErrors = {};
    ['name', 'email', 'message'].forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      showToast('error', 'Validation Error', 'Please fix the errors in the form.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare data for API call
      const contactData = {
        ...formData,
        user_id: user?.id
        
      };

      // Make API call
      const response = await mockApiClient.post('/api/contact', contactData);
      
      // Show success animation
      setShowRocket(true);
      
      // Show success toast
      showToast('success', 'Message Sent Successfully!', 'We\'ll get back to you within 24 hours.');
      
      // Reset form
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        company: '',
        subject: '',
        message: '',
        service: ''
      });
      setErrors({});
      setTouched({});
      
    } catch (error) {
      console.error('Contact form error:', error);
      
      // Handle different types of errors
      if (error.response?.status === 401) {
        showToast('error', 'Authentication Failed', 'Please log in again to send a message.');
      } else if (error.response?.status === 422) {
        showToast('error', 'Validation Error', 'Please check your form data and try again.');
      } else if (error.response?.status >= 500) {
        showToast('error', 'Server Error', 'Something went wrong on our end. Please try again later.');
      } else if (!error.response) {
        showToast('error', 'Network Error', 'Please check your internet connection and try again.');
      } else {
        showToast('error', 'Failed to Send Message', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-5 h-5" />,
      title: 'Our Location',
      content: 'Greater Noida, India',
      subContent: 'Visit our office for in-person consultations',
      color: 'text-blue-500'
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: 'Call Us',
      content: '+91 7017858269',
      subContent: 'Available Monday to Saturday',
      color: 'text-green-500'
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: 'Email Us',
      content: 'info@MeraBakil.com',
      subContent: 'We respond within 24 hours',
      color: 'text-purple-500'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: 'Working Hours',
      content: 'Mon - Sat: 9:00 AM - 6:00 PM',
      subContent: 'Sunday: Emergency support only',
      color: 'text-orange-500'
    }
  ];

  const services = [
    'ITR Filing',
    'GST Registration',
    'GST Return Filing',
    'Company Registration (Private Limited, LLP, etc.)',
    'Trademark Registration',
    'Legal Document Preparation',
    'Business Compliance & Advisory',
    'Contract Drafting & Review',
    'PAN/TAN Application',
    'MSME Registration',
    'Import Export Code (IEC) Registration',
    'Accounting & Bookkeeping',
    'Digital Signature Certificate (DSC)',
    'Startup Legal Support',
    'Other'
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Quick Response',
      description: '24-hour response guarantee'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure & Private',
      description: 'Your data is fully protected'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Expert Team',
      description: 'Dedicated professionals ready to help'
    }
  ];

  const inputClass = (fieldName) => `
    w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 
    ${errors[fieldName] && touched[fieldName]
      ? 'border-red-300 focus:border-red-500' 
      : isDarkMode 
        ? 'border-slate-600 bg-slate-800 text-slate-200 placeholder-slate-400 focus:border-sky-400' 
        : 'border-slate-200 bg-white text-slate-700 placeholder-slate-500 focus:border-sky-500'
    }
    focus:outline-none focus:ring-4 focus:ring-opacity-20
    ${errors[fieldName] && touched[fieldName]
      ? 'focus:ring-red-500' 
      : 'focus:ring-sky-500'
    }
  `;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      {/* Toast Notification */}
      <Toast 
        toast={toast} 
        onClose={() => setToast(prev => ({ ...prev, show: false }))} 
      />

      {/* Rocket Animation */}
      <RocketAnimation 
        show={showRocket} 
        onComplete={() => setShowRocket(false)} 
      />

      <section className="py-16 px-4 mt-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 mt-10">
            <div className="inline-flex items-center px-4 py-2 rounded-full border mb-6">
              <MessageSquare className={`w-4 h-4 mr-2 ${
                isDarkMode ? 'text-sky-400' : 'text-sky-600'
              }`} />
              <span className={`text-sm font-medium ${
                isDarkMode ? 'text-slate-300 border-slate-700' : 'text-slate-600 border-slate-200'
              }`}>
                Get In Touch
              </span>
            </div>
            
            {user && (
              <div className={`inline-flex items-center px-4 py-2 rounded-full mb-4 ${
                isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-600'
              } border`}>
                <User className="w-4 h-4 mr-2" />
                <span className="text-sm">Welcome back, {user.name}!</span>
              </div>
            )}
            
            <p className={`text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Ready to get started? Our expert team is here to help you with all your legal and business needs.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-700 hover:border-slate-600' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`inline-flex p-3 rounded-xl mb-4 ${
                  isDarkMode ? 'bg-sky-500/10 text-sky-400' : 'bg-sky-50 text-sky-600'
                }`}>
                  {feature.icon}
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className={`text-2xl font-bold mb-6 ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-900'
                }`}>
                  Contact Information
                </h2>
                
                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <div
                      key={index}
                      className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-md ${
                        isDarkMode 
                          ? 'bg-slate-800 border-slate-700 hover:border-slate-600' 
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`inline-flex p-3 rounded-xl ${item.color} ${
                          isDarkMode ? 'bg-slate-700' : 'bg-slate-50'
                        }`}>
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold mb-1 ${
                            isDarkMode ? 'text-slate-200' : 'text-slate-900'
                          }`}>
                            {item.title}
                          </h3>
                          <p className={`font-medium mb-1 ${
                            isDarkMode ? 'text-slate-300' : 'text-slate-700'
                          }`}>
                            {item.content}
                          </p>
                          <p className={`text-sm ${
                            isDarkMode ? 'text-slate-500' : 'text-slate-500'
                          }`}>
                            {item.subContent}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className={`p-6 rounded-2xl border ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600' 
                  : 'bg-gradient-to-br from-sky-50 to-blue-50 border-sky-200'
              }`}>
                <h3 className={`font-semibold mb-4 ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-900'
                }`}>
                  Why Choose Us?
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      isDarkMode ? 'text-sky-400' : 'text-sky-600'
                    }`}>
                      500+
                    </div>
                    <div className={`text-sm ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Projects Completed
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      isDarkMode ? 'text-sky-400' : 'text-sky-600'
                    }`}>
                      24h
                    </div>
                    <div className={`text-sm ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Response Time
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className={`p-8 rounded-2xl border ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700' 
                  : 'bg-white border-slate-200'
              } shadow-xl`}>
                <div className="mb-8">
                  <h2 className={`text-2xl font-bold mb-2 ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-900'
                  }`}>
                    Send us a Message
                  </h2>
                  <p className={`${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                          isDarkMode ? 'text-slate-500' : 'text-slate-400'
                        }`} />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter your full name"
                          className={`${inputClass('name')} pl-12`}
                        />
                      </div>
                      {errors.name && touched.name && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                          isDarkMode ? 'text-slate-500' : 'text-slate-400'
                        }`} />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter your email"
                          className={`${inputClass('email')} pl-12`}
                        />
                      </div>
                      {errors.email && touched.email && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone and Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                          isDarkMode ? 'text-slate-500' : 'text-slate-400'
                        }`} />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter your phone number"
                          className={`${inputClass('phone')} pl-12`}
                        />
                      </div>
                      {errors.phone && touched.phone && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Company
                      </label>
                      <div className="relative">
                        <Globe className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                          isDarkMode ? 'text-slate-500' : 'text-slate-400'
                        }`} />
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Your company name"
                          className={`${inputClass('company')} pl-12`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Service and Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Service Interested In
                      </label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className={inputClass('service')}
                      >
                        <option value="">Select a service</option>
                        {services.map((service, index) => (
                          <option key={index} value={service}>{service}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Brief subject line"
                        className={inputClass('subject')}
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Tell us about your project requirements..."
                      rows="6"
                      className={inputClass('message')}
                    />
                    {errors.message && touched.message && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4">
                    <p className={`text-sm ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      * Required fields
                    </p>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative inline-flex items-center justify-center px-8 py-3 font-medium text-white bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl hover:from-sky-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-sky-500/20 transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
                
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;