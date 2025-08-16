import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from './common/Avatar';
import '../styles/MobileSidebar.css';
import {
  X, ChevronDown, ChevronRight, Home, Users, Clock, Briefcase, 
  Star, MessageSquare, History, Award, Scale, FileText, Calendar, HelpCircle,
  UserPlus, LogIn, LogOut, User, Settings, Bell, Zap, Shield, 
  Sparkles, Heart, Compass, Globe, Menu, TrendingUp, Target,
  BookOpen, Phone, Mail, MapPin, Instagram, Facebook, Twitter,
  Linkedin, Youtube, Coffee, Palette, Headphones, Camera
} from 'lucide-react';

const MobileSidebar = ({ 
  isOpen, 
  onClose, 
  isAuthenticated, 
  user, 
  onLogout, 
  navItems,
  onStartTour 
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const { mode } = useSelector((state) => state.theme);
  const sidebarRef = useRef(null);

  // Toggle dropdown
  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  // Enhanced quick actions for professional features
  const quickActions = [
    { 
      id: 'tour', 
      icon: <Compass size={16} className="text-white" />, 
      label: 'Start Tour', 
      action: onStartTour,
      gradient: 'from-indigo-500 to-blue-600',
      isGuide: true
    },
    { 
      id: 'consultation', 
      icon: <Scale size={16} className="text-white" />, 
      label: 'Quick Consult', 
      path: '/legal-consoltation',
      gradient: 'from-emerald-500 to-teal-600',
      isNew: true
    },
    { 
      id: 'document', 
      icon: <FileText size={16} className="text-white" />, 
      label: 'Document Review', 
      path: '/legal-documents-review',
      gradient: 'from-blue-500 to-indigo-600',
      isHot: true
    },
    { 
      id: 'appointment', 
      icon: <Calendar size={16} className="text-white" />, 
      label: 'Book Meeting', 
      path: '/personal-room',
      gradient: 'from-purple-500 to-pink-600'
    },
    { 
      id: 'chat', 
      icon: <MessageSquare size={16} className="text-white" />, 
      label: 'AI Assistant', 
      path: '/virtual-bakil',
      gradient: 'from-orange-500 to-red-600',
      isPro: true
    }
  ];

  // Social media links for professional presence
  const socialLinks = [
    { icon: <Instagram size={18} />, url: '#', color: 'text-pink-500' },
    { icon: <Facebook size={18} />, url: '#', color: 'text-blue-600' },
    { icon: <Twitter size={18} />, url: '#', color: 'text-sky-500' },
    { icon: <Linkedin size={18} />, url: '#', color: 'text-blue-700' },
    { icon: <Youtube size={18} />, url: '#', color: 'text-red-500' }
  ];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Animation variants for smooth transitions
  const sidebarVariants = {
    closed: {
      x: '100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    open: {
      x: '0%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  const backdropVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
  };

  const itemVariants = {
    closed: { x: 50, opacity: 0 },
    open: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    })
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop without blur effect */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/30"
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
          />

          {/* Professional Sidebar */}
          <motion.div
            ref={sidebarRef}
            className="fixed right-0 top-16 bottom-0 w-80 max-w-[85vw] z-50 overflow-hidden"
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Main container with solid background */}
            <div className="relative h-full bg-white dark:bg-gray-900 shadow-2xl theme-transition gpu-accelerated rounded-tl-2xl rounded-bl-lg rounded-tr-lg rounded-br-md border-l border-gray-200 dark:border-gray-700">

              {/* Header Section */}
              <div className="relative z-10 bg-gray-50 dark:bg-gray-800 px-4 py-5 border-b border-gray-200 dark:border-gray-700 rounded-tl-2xl rounded-tr-lg">
                
                {/* Close button */}
                <motion.button
                  onClick={onClose}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 shadow-sm border border-gray-200 dark:border-gray-600"
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={16} className="text-gray-600 dark:text-gray-300" />
                </motion.button>

                {/* User Profile Section */}
                <motion.div 
                  className="flex items-center space-x-3 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {isAuthenticated ? (
                    <>
                      <div className="relative">
                        <Avatar 
                          src={user?.avatar_url} 
                          alt={user?.name || 'User'} 
                          name={`${user?.name || ''} ${user?.last_name || ''}`.trim() || 'User'}
                          size={48} 
                          className="border-2 border-white/40 dark:border-gray-600/40 shadow-md"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white dark:border-gray-900 status-badge"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base text-gray-900 dark:text-white truncate">
                          {user?.name || 'User'}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate" title={user?.email || 'No email'}>
                          {user?.email || 'No email'}
                        </p>
                        <div className="flex items-center justify-between mt-0.5">
                          <div className="flex items-center">
                            <Shield size={10} className="text-emerald-500 mr-1" />
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                              Verified
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Star size={8} className="text-yellow-500 mr-0.5" />
                            <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                              Pro
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                          <User size={20} className="text-white" />
                        </div>
                        <motion.div 
                          className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-400 rounded-full border-2 border-white dark:border-gray-900 status-badge"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-base text-gray-900 dark:text-white">
                          Welcome Guest!
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Sign in to unlock features
                        </p>
                        <div className="flex items-center mt-0.5">
                          <LogIn size={10} className="text-blue-500 mr-1" />
                          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                            Get Started
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center">
                      <Zap size={12} className="mr-1.5 text-yellow-500" />
                      Quick Access
                    </h4>
                    <motion.button
                      onClick={() => setShowQuickActions(!showQuickActions)}
                      className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ChevronDown 
                        size={14} 
                        className={`text-gray-500 dark:text-gray-400 transition-transform duration-300 ${showQuickActions ? 'rotate-180' : ''}`} 
                      />
                    </motion.button>
                  </div>
                  
                  <AnimatePresence>
                    {showQuickActions && (
                      <motion.div
                        className="grid grid-cols-2 gap-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {quickActions.map((action, index) => (
                          <motion.div
                            key={action.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            {action.path ? (
                              <Link
                                to={action.path}
                                onClick={onClose}
                                className={`relative flex flex-col items-center p-2.5 rounded-lg bg-gradient-to-br ${action.gradient} text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 professional-card ripple-effect mobile-touch-target group overflow-hidden`}
                              >
                                {/* Badge indicators */}
                                {action.isNew && (
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                                    <Sparkles size={8} className="text-yellow-800" />
                                  </div>
                                )}
                                {action.isHot && (
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                                    <Zap size={8} className="text-white" />
                                  </div>
                                )}
                                {action.isPro && (
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                                    <Star size={8} className="text-white" />
                                  </div>
                                )}
                                {action.isGuide && (
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                    <Compass size={8} className="text-white" />
                                  </div>
                                )}
                                
                                <div className="mb-1.5 p-1 rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors">
                                  {action.icon}
                                </div>
                                <span className="text-xs font-semibold text-center leading-tight">
                                  {action.label}
                                </span>
                              </Link>
                            ) : (
                              <button
                                onClick={() => {
                                  if (action.action) action.action();
                                  onClose();
                                }}
                                className={`relative flex flex-col items-center p-2.5 rounded-lg bg-gradient-to-br ${action.gradient} text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 professional-card ripple-effect mobile-touch-target group overflow-hidden w-full`}
                              >
                                {/* Badge indicators */}
                                {action.isNew && (
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                                    <Sparkles size={8} className="text-yellow-800" />
                                  </div>
                                )}
                                {action.isHot && (
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                                    <Zap size={8} className="text-white" />
                                  </div>
                                )}
                                {action.isPro && (
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                                    <Star size={8} className="text-white" />
                                  </div>
                                )}
                                {action.isGuide && (
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                    <Compass size={8} className="text-white" />
                                  </div>
                                )}
                                
                                <div className="mb-1.5 p-1 rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors">
                                  {action.icon}
                                </div>
                                <span className="text-xs font-semibold text-center leading-tight">
                                  {action.label}
                                </span>
                              </button>
                            )}
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Navigation Items */}
              <div className="relative z-10 flex-1 overflow-y-auto px-4 py-3 pb-6 mobile-sidebar-content max-h-[calc(100vh-280px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                <div className="space-y-1.5 pb-6">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      custom={index}
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                      className="group"
                    >
                      {item.dropdown ? (
                        <div>
                          <motion.button
                            onClick={() => toggleDropdown(index)}
                            className="w-full flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm border border-gray-200 dark:border-gray-700 group-hover:shadow-md mobile-nav-item professional-hover mobile-touch-target"
                            whileHover={{ x: 2 }}
                          >
                            <div className="flex items-center">
                              <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900 mr-2.5">
                                {React.cloneElement(item.icon, { size: 16, className: "text-blue-600 dark:text-blue-400" })}
                              </div>
                              <span className="font-medium text-sm text-gray-800 dark:text-gray-200">
                                {item.name}
                              </span>
                            </div>
                            <motion.div
                              animate={{ rotate: activeDropdown === index ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ChevronDown size={14} className="text-gray-500 dark:text-gray-400" />
                            </motion.div>
                          </motion.button>
                          
                          <AnimatePresence>
                            {activeDropdown === index && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="ml-4 mt-1.5 space-y-1 overflow-hidden"
                              >
                                {item.dropdown.map((subItem, subIndex) => (
                                  <motion.div
                                    key={subItem.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: subIndex * 0.05 }}
                                  >
                                    <Link
                                      to={subItem.path}
                                      onClick={onClose}
                                      className="flex items-center p-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:translate-x-1 border border-gray-200 dark:border-gray-700"
                                    >
                                      <div className="p-1 rounded-sm bg-white dark:bg-gray-600 mr-2 shadow-sm">
                                        {React.cloneElement(subItem.icon, { size: 12, className: "text-gray-600 dark:text-gray-300" })}
                                      </div>
                                      <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                                        {subItem.name}
                                      </span>
                                    </Link>
                                  </motion.div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          to={item.path}
                          onClick={onClose}
                          className="flex items-center p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm border border-gray-200 dark:border-gray-700 group-hover:shadow-md hover:translate-x-1 mobile-nav-item professional-hover mobile-touch-target"
                        >
                          <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900 mr-2.5">
                            {React.cloneElement(item.icon, { size: 16, className: "text-blue-600 dark:text-blue-400" })}
                          </div>
                          <span className="font-medium text-sm text-gray-800 dark:text-gray-200">
                            {item.name}
                          </span>
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Authentication Section */}
                <motion.div
                  className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {isAuthenticated ? (
                    <div className="space-y-1.5">
                      {/* Profile Button */}
                      <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
                        <Link
                          to="/profile"
                          onClick={onClose}
                          className="flex items-center p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all duration-300 group"
                        >
                          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-emerald-100 dark:bg-emerald-800/50 mr-2.5 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-700/50">
                            <User size={14} className="text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <span className="font-medium text-sm text-emerald-700 dark:text-emerald-300">
                            My Profile
                          </span>
                        </Link>
                      </motion.div>
                      
                      {/* Settings Button */}
                      <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
                        <Link
                          to="/settings"
                          onClick={onClose}
                          className="flex items-center p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 group"
                        >
                          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-blue-100 dark:bg-blue-800/50 mr-2.5 group-hover:bg-blue-200 dark:group-hover:bg-blue-700/50">
                            <Settings size={14} className="text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="font-medium text-sm text-blue-700 dark:text-blue-300">
                            Settings
                          </span>
                        </Link>
                      </motion.div>
                      
                      {/* Logout Button */}
                      <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
                        <button
                          onClick={onLogout}
                          className="w-full flex items-center p-2 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-300 group"
                        >
                          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-red-100 dark:bg-red-800/50 mr-2.5 group-hover:bg-red-200 dark:group-hover:bg-red-700/50">
                            <LogOut size={14} className="text-red-600 dark:text-red-400" />
                          </div>
                          <span className="font-medium text-sm text-red-700 dark:text-red-300">
                            Logout
                          </span>
                        </button>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      {/* Sign In Button */}
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                        <Link
                          to="/Auth"
                          onClick={onClose}
                          className="flex items-center justify-center p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300 group"
                        >
                          <div className="flex items-center justify-center w-5 h-5 rounded-md bg-white/20 mr-1.5 group-hover:bg-white/30">
                            <LogIn size={12} className="text-white" />
                          </div>
                          <span className="text-xs font-semibold">Sign In</span>
                        </Link>
                      </motion.div>
                      
                      {/* Create Account Button */}
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                        <Link
                          to="/signup"
                          onClick={onClose}
                          className="flex items-center justify-center p-2 rounded-lg border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-all duration-300 group"
                        >
                          <div className="flex items-center justify-center w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-800/50 mr-1.5 group-hover:bg-blue-200 dark:group-hover:bg-blue-700/50">
                            <UserPlus size={12} className="text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="text-xs font-semibold">Register</span>
                        </Link>
                      </motion.div>
                    </div>
                  )}
                </motion.div>



                {/* Social Links */}
                <motion.div
                  className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center justify-center">
                    <Heart size={10} className="mr-1.5 text-red-500" />
                    Connect With Us
                  </h4>
                  <div className="flex justify-center space-x-3">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.url}
                        className={`p-1.5 rounded-md bg-white dark:bg-gray-700 ${social.color} hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 shadow-sm border border-gray-200 dark:border-gray-600`}
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {React.cloneElement(social.icon, { size: 14 })}
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </div>


            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;