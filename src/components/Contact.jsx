import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  ArrowLeft,
  ChevronRight,
  Star
} from 'lucide-react';

// Mock API service for demonstration
const mockApiClient = {
  post: async (url, data) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (!data.name || !data.email || !data.message) {
      throw new Error('Validation failed');
    }
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
const Toast = ({ toast, onClose, isDarkMode }) => {
  return (
    <AnimatePresence>
      {toast.show && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
          className={`fixed top-6 right-6 z-[100] max-w-sm w-full`}
        >
          <div className={`p-4 rounded-xl border shadow-2xl backdrop-blur-xl ${toast.type === 'success'
              ? 'bg-green-500/10 border-green-500/20 text-green-500'
              : toast.type === 'error'
                ? 'bg-red-500/10 border-red-500/20 text-red-500'
                : 'bg-blue-500/10 border-blue-500/20 text-blue-500'
            }`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold tracking-tight">{toast.title}</p>
                {toast.message && (
                  <p className="text-xs opacity-80 mt-1 leading-relaxed">{toast.message}</p>
                )}
              </div>
              <button onClick={onClose} className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Contact = () => {
  const navigate = useNavigate();
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';

  const [formData, setFormData] = useState({
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
  const [user, setUser] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const userData = tokenManager.getUser();
    if (userData) {
      setUser(userData);
      setFormData(prev => ({
        ...prev,
        name: userData.name || userData.username || '',
        email: userData.email || '',
        phone: userData.phone || ''
      }));
    }
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const showToast = (type, title, message = '') => {
    setToast({ show: true, type, title, message });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return !value || value.length < 2 ? 'Full name is required' : '';
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Enter a valid email address' : '';
      case 'message':
        return !value || value.length < 10 ? 'Message must be at least 10 characters' : '';
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

    const newErrors = {};
    ['name', 'email', 'message'].forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ name: true, email: true, message: true });
      showToast('error', 'Validation Error', 'Please check the required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await mockApiClient.post('/api/contact', formData);
      showToast('success', 'Message Sent!', 'We have received your message and will get back to you soon.');
      setFormData(prev => ({
        ...prev,
        subject: '',
        message: '',
        company: '',
        service: ''
      }));
      setTouched({});
    } catch (error) {
      showToast('error', 'Sending Failed', 'Could not send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] overflow-x-hidden">
      <Toast toast={toast} onClose={() => setToast(prev => ({ ...prev, show: false }))} isDarkMode={isDarkMode} />

      {/* Content wrapper with scale for "zoomed out" look */}
      <div className="relative z-10 scale-90 origin-top">

        {/* Navigation Header */}
        <div className="sticky top-0 z-50 bg-white/70 dark:bg-[#0A0A0A]/70 backdrop-blur-xl border-b border-transparent">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
            <button
              onClick={handleBack}
              className="group flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <section className="pt-12 pb-16 px-4 md:px-6">
          <div className="max-w-7xl mx-auto text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                <MessageSquare className="w-3.5 h-3.5" />
                Contact Us
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent tracking-tight">
                Let's Build Something <span className="text-blue-600 dark:text-blue-400">Great</span>
              </h1>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
                Whether you have a question about services, pricing, or anything else, our team is ready to help you navigate your legal journey.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Info Grid */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* Sidebar with contact info */}
            <div className="lg:col-span-4 space-y-6">
              {[
                { icon: MapPin, title: 'Visit Us', value: 'Greater Noida, India', sub: 'Main Office Branch', color: 'blue' },
                { icon: Phone, title: 'Call Support', value: '+91 7017858269', sub: 'Mon-Sat, 9AM-6PM', color: 'purple' },
                { icon: Mail, title: 'Email Address', value: 'info@meravakil.com', sub: 'We reply in 24h', color: 'pink' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative p-6 rounded-2xl bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-sm hover:shadow-xl"
                >
                  <div className="flex items-center gap-5">
                    <div className={`p-3 rounded-xl bg-${item.color}-500/10 text-${item.color}-500 group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.title}</h3>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{item.value}</p>
                      <p className="text-sm text-gray-500 font-medium mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Success Indicators */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white space-y-6 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 transform translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-700">
                  <Globe className="w-40 h-40 opacity-10" />
                </div>
                <div className="relative space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">Why Mera Vakil?</h3>
                    <p className="text-blue-100 text-sm">Join 50,000+ satisfied clients today.</p>
                  </div>
                  <div className="space-y-4">
                    {[
                      { icon: Shield, text: 'Military-Grade Security' },
                      { icon: Zap, text: 'Instant AI Consultations' },
                      { icon: Users, text: '1000+ Verified Partners' }
                    ].map((feat, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm font-semibold">
                        <div className="p-1.5 rounded-lg bg-white/10">
                          <feat.icon className="w-4 h-4" />
                        </div>
                        {feat.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-8"
            >
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl p-10 shadow-2xl relative overflow-hidden">

                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative mb-8 text-left">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Send a Message</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Fill out the form below and we'll respond as soon as possible.</p>
                </div>

                <form onSubmit={handleSubmit} className="relative space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Full Name *</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="John Doe"
                          className={`w-full bg-gray-50 dark:bg-gray-800/50 border ${errors.name && touched.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 rounded-xl py-3 pl-12 pr-4 text-sm font-medium transition-all outline-none`}
                        />
                      </div>
                      {errors.name && touched.name && <p className="text-[11px] text-red-500 font-bold ml-1">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address *</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="john@example.com"
                          className={`w-full bg-gray-50 dark:bg-gray-800/50 border ${errors.email && touched.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 rounded-xl py-3 pl-12 pr-4 text-sm font-medium transition-all outline-none`}
                        />
                      </div>
                      {errors.email && touched.email && <p className="text-[11px] text-red-500 font-bold ml-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Subject */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Case Consultation"
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 rounded-xl py-3 px-4 text-sm font-medium transition-all outline-none"
                      />
                    </div>

                    {/* Service Select */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Service</label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 rounded-xl py-3 px-4 text-sm font-medium transition-all outline-none appearance-none cursor-pointer"
                      >
                        <option value="">Select a service</option>
                        <option value="legal">Legal Consultation</option>
                        <option value="documents">Document Drafting</option>
                        <option value="business">Business Services</option>
                        <option value="tax">Tax & Compliance</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Your Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows="5"
                      placeholder="Tell us how we can help you..."
                      className={`w-full bg-gray-50 dark:bg-gray-800/50 border ${errors.message && touched.message ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 rounded-2xl p-4 text-sm font-medium transition-all outline-none resize-none`}
                    />
                    {errors.message && touched.message && <p className="text-[11px] text-red-500 font-bold ml-1">{errors.message}</p>}
                  </div>

                  {/* Submit */}
                  <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold">
                      <Shield className="w-3 h-3 text-green-500" />
                      Your data is 256-bit SSL encrypted.
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full md:w-auto min-w-[180px] px-8 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white rounded-xl font-bold shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>SENDING...</span>
                        </>
                      ) : (
                        <>
                          <span>SEND MESSAGE</span>
                          <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>

        {/* FAQ Section Shortcut */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
          <div className="bg-gray-50 dark:bg-gray-900/30 rounded-3xl p-10 border border-gray-100 dark:border-gray-800/50 text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-500 text-sm mb-6">Can't find what you're looking for? Try our Help Center.</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Pricing & Plans', 'AI Consultant Help', 'Verified Lawyer Search', 'Document Management'].map((tag, i) => (
                <button key={i} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-bold text-gray-600 dark:text-gray-400 hover:border-blue-500 transition-colors">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Contact;