// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/themeSlice';
import { Link } from 'react-router-dom';
import { authAPI, tokenManager } from '../api/apiService';
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  ChevronDown, 
  Home, 
  Users, 
  Clock, 
  Briefcase, 
  Star, 
  MessageSquare,
  History,
  Award,
  Scale,
  FileText,
  Calendar,
  HelpCircle,
  UserPlus,
  LogIn,
  ChevronRight,
  LogOut,
  User,
  Settings,
  Bell
} from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const { mode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const mobileMenuRef = useRef(null);
  const userDropdownRef = useRef(null);


  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  
  // Function to check if user is authenticated
  const checkAuthStatus = () => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');
    console.log('User :', userData , 'token:', token);
    
    if (token && userData) {
      setIsAuthenticated(true);
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        handleLogout();
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // Optional: Call logout API endpoint
      const token = localStorage.getItem('auth_token');
      console.log('Logging out with token:', token);
      if (token) {
          // You can make an API call to logout endpoint here
          // await axios.post('http://127.0.0.1:8000/api/logout', {}, {
          //   headers: { Authorization: `Bearer ${token}` }
          // });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      
      // Update state
      setIsAuthenticated(false);
      setUser(null);
      setUserDropdownOpen(false);
      
      // Redirect to home page
      window.location.href = '/';
    }
  };

  // Track scroll position to add effects to navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navItems = [
    { 
      name: 'Home', 
      path: '/',
      icon: <Home size={18} className="mr-2" /> 
    },
    { 
      name: 'Services', 
      path: '/services',
      icon: <Briefcase size={18} className="mr-2" />,
      dropdown: [
        { name: 'Virtual Assistant', path: '/', icon: <HelpCircle size={16} className="mr-2" /> },
        { name: 'Virtual Bakil', path: '/virtual-bakil', icon: <Users size={16} className="mr-2" /> },
        { name: 'Legal Consultations', path: '/legal-consoltation', icon: <Scale size={16} className="mr-2" /> },
        { name: 'Legal Task Automation', path: '/task-automation', icon: <Clock size={16} className="mr-2" /> },
        { name: 'Document Review', path: '/legal-documents-review', icon: <FileText size={16} className="mr-2" /> },
        { name: 'Personal Appointments', path: '/personal-room', icon: <Calendar size={16} className="mr-2" /> },
        { name: 'Information Hub', path: '/information-hub', icon: <HelpCircle size={16} className="mr-2" /> },
      ]
    },
    { 
      name: 'Portfolio', 
      path: '/portfolio',
      icon: <Briefcase size={18} className="mr-2" /> 
    },
    { 
      name: 'Testimonials', 
      path: '/testimonials',
      icon: <Star size={18} className="mr-2" /> 
    },
    { 
      name: 'About', 
      path: '/about',
      icon: <Users size={18} className="mr-2" />,
      dropdown: [
        { name: 'Our Story', path: '/our-story', icon: <History size={16} className="mr-2" /> },
        { name: 'Our Team', path: '/our-team', icon: <Users size={16} className="mr-2" /> },
        { name: 'Vision & Mission', path: '/about/vision', icon: <Award size={16} className="mr-2" /> },
      ]
    },
    { 
      name: 'Contact', 
      path: '/contact',
      icon: <MessageSquare size={18} className="mr-2" /> 
    },
  ];

  const toggleDropdown = (index) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(index);
    }
  };

  const [isAppMode, setIsAppMode] = useState(false);

  const handleModeToggle = () => {
    const heroSection = document.getElementById('hero-section');
    
    if (!isAppMode) {
      // Switching to App Mode
      if (heroSection) {
        const heroTop = heroSection.getBoundingClientRect().top + window.scrollY;
        const currentScroll = window.scrollY;

        // If user is not at hero, scroll to it
        if (Math.abs(currentScroll - heroTop) > 10) {
          window.scrollTo({
            top: heroTop,
            behavior: 'smooth'
          });

          // Wait until scroll finishes before freezing
          const checkScroll = setInterval(() => {
            const scrolledTo = window.scrollY;
            if (Math.abs(scrolledTo - heroTop) < 5) {
              document.body.style.overflow = 'hidden';
              setIsAppMode(true);
              clearInterval(checkScroll);
            }
          }, 100);
        } else {
          // Already on hero, just freeze
          document.body.style.overflow = 'hidden';
          setIsAppMode(true);
        }
      }
    } else {
      // Switching back to Website Mode
      document.body.style.overflow = 'auto';
      setIsAppMode(false);
    }
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto'; // Cleanup
    };
  }, []);

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${
          scrolled 
            ? 'py-2 bg-white/95 backdrop-blur-sm shadow-lg dark:bg-gray-900/95 dark:shadow-gray-800/30' 
            : 'py-4 bg-white dark:bg-gray-900'
        }`}
        style={{
          borderBottom: scrolled ? '1px solid rgba(82, 152, 219, 0.1)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center group">
                <div 
                  className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold mr-3 overflow-hidden transition-all duration-300 group-hover:scale-105"
                  style={{ background: 'linear-gradient(to right, #22577a, #5cacde)' }}
                >
                  <span className="text-xl">M</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                    MeraBakil
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                    Professional Solutions
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-1">
              {navItems.map((item, index) => (
                <div key={item.name} className="relative group">
                  {item.dropdown ? (
                    <div 
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 cursor-pointer
                                dark:text-gray-200 dark:hover:text-blue-400 transition-colors duration-200"
                      onClick={() => toggleDropdown(index)}
                      onMouseEnter={() => setActiveDropdown(index)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span>{item.name}</span>
                      </div>
                      <ChevronDown size={16} className="ml-1" />
                      
                      {/* Dropdown Menu */}
                      <div 
                        className={`absolute top-full left-0 mt-1 py-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100
                                  dark:bg-gray-800 dark:border-gray-700 transform transition-all duration-200 origin-top-left
                                  ${activeDropdown === index ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                      >
                        {item.dropdown.map(subItem => (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 dark:text-gray-200 
                                     dark:hover:bg-gray-700 dark:hover:text-blue-400 transition-colors"
                            onClick={() => {setActiveDropdown(null); setIsMenuOpen(false);}}
                          >
                            {subItem.icon}
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className="relative flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200
                              dark:text-gray-200 dark:hover:text-blue-400 group"
                    >
                      {item.icon}
                      {item.name}
                      <span className="absolute -bottom-0 left-1/2 w-0 h-0.5 bg-blue-500 group-hover:w-1/2 group-hover:transition-all duration-300" 
                            style={{ background: 'linear-gradient(to right, #22577a, #5cacde)' }}></span>
                      <span className="absolute -bottom-0 right-1/2 w-0 h-0.5 bg-blue-500 group-hover:w-1/2 group-hover:transition-all duration-300"
                            style={{ background: 'linear-gradient(to right, #5cacde, #22577a)' }}></span>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* App/Website Mode Toggle */}
            <button
              onClick={handleModeToggle}
              className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-gray-800 focus:outline-none"
              aria-label="Toggle App/Website mode"
            >
              {isAppMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {/* Smartphone icon */}
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4h10M7 20h10M8 4v16m8-16v16M12 17h.01" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {/* Desktop icon */}
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17H6.75A2.25 2.25 0 014.5 14.75V5.25A2.25 2.25 0 016.75 3h10.5A2.25 2.25 0 0119.5 5.25v9.5a2.25 2.25 0 01-2.25 2.25h-3m-4.5 0v1.5m0 0h3m-3 0H9" />
                </svg>
              )}
            </button>

            {/* Desktop Right Side - Auth & Theme */}
            <div className="hidden lg:flex lg:items-center lg:space-x-3">
              <button
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200
                          dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 focus:outline-none"
                onClick={() => dispatch(toggleTheme())}
                aria-label="Toggle dark mode"
              >
                {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {isAuthenticated ? (
                  <>
                    {/* Notifications Dropdown */}
                    <div className="relative group">
                      <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 focus:outline-none relative">
                        <Bell size={20} />
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          3
                        </span>
                      </button>
                      {/* Notification Panel on Hover */}
                      <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-lg z-50 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform -translate-y-2 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
                        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-sm font-semibold text-gray-800 dark:text-white">Notifications</p>
                        </div>
                        <ul className="max-h-60 overflow-y-auto">
                          <li className="px-4 py-3 flex items-start hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-full dark:bg-blue-500/20 dark:text-blue-400">
                              <User size={18} />
                            </div>
                            <div className="ml-3 text-sm">
                              <p className="text-gray-800 dark:text-gray-200">New user registration</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</p>
                            </div>
                          </li>
                          <li className="px-4 py-3 flex items-start hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <div className="p-2 bg-green-100 text-green-600 rounded-full dark:bg-green-500/20 dark:text-green-400">
                              <Settings size={18} />
                            </div>
                            <div className="ml-3 text-sm">
                              <p className="text-gray-800 dark:text-gray-200">Settings updated</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">10 minutes ago</p>
                            </div>
                          </li>
                          <li className="px-4 py-3 flex items-start hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <div className="p-2 bg-red-100 text-red-600 rounded-full dark:bg-red-500/20 dark:text-red-400">
                              <LogOut size={18} />
                            </div>
                            <div className="ml-3 text-sm">
                              <p className="text-gray-800 dark:text-gray-200">Logged out from new device</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
                            </div>
                          </li>
                        </ul>
                        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 text-sm text-center">
                          <a href="/notifications" className="text-blue-600 dark:text-blue-400 hover:underline">
                            View all
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* User Dropdown */}
                    <div className="relative" ref={userDropdownRef}>
                      <button
                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                        className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:outline-none"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                          {getUserInitials(user?.name)}
                        </div>
                        <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
                      </button>

                      {/* User Dropdown Menu */}
                      <div
                        className={`absolute right-0 top-full mt-2 py-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100
                          dark:bg-gray-800 dark:border-gray-700 transform transition-all duration-200 origin-top-right z-50
                          ${userDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                      >
                        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'User'}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <User size={16} className="mr-2" />
                          Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <Settings size={16} className="mr-2" />
                          Settings
                        </Link>
                        <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <LogOut size={16} className="mr-2" />
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  </>

              ) : (
                <>
                  <Link
                    to="/Auth"
                    className="px-5 py-2 rounded-full text-white font-medium transition-all duration-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:scale-105 flex items-center"
                    style={{ background: 'linear-gradient(to right, #22577a, #5cacde)' }}
                  >
                    <LogIn size={18} className="mr-1.5" />
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-5 py-2 rounded-full bg-white text-gray-800 font-medium border border-gray-200 
                              hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 hover:shadow-md 
                              focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2
                              dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900 hover:scale-105 flex items-center"
                  >
                    <UserPlus size={18} className="mr-1.5" />
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex lg:hidden items-center">
              <button
                className="p-2 mr-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200
                          dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 focus:outline-none"
                onClick={() => dispatch(toggleTheme())}
                aria-label="Toggle dark mode"
              >
                {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200
                          dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Fixed at top with no layout shifting */}
      <div 
        className={`lg:hidden fixed  inset-0 z-30 ${isMenuOpen ? 'block' : 'hidden'}`}
      >
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        ></div>
        
        {/* Side drawer menu - Improved with rounded corners and better spacing */}
        <div 
          ref={mobileMenuRef}
          className={`fixed top-0 right-0 h-full max-h-screen pb-24 w-4/5 max-w-xs bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } overflow-y-auto rounded-l-2xl mt-16`}
          style={{ 
            maxHeight: 'calc(100% - 4rem)',
            boxShadow: mode === 'dark' ? '0 0 20px rgba(0, 0, 0, 0.5)' : '-10px 0 30px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Mobile Menu Toggle Button - Inside sidebar */}
          <button
            className="absolute left-0 top-4 -ml-10 flex items-center justify-center w-8 h-8 rounded-l-md bg-blue-600 text-white focus:outline-none"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            <ChevronRight size={20} />
          </button>

          <div className="pt-4 pb-2 px-4">
            {/* Profile Section */}
            <div className="flex items-center space-x-3 py-3 border-b border-gray-100 dark:border-gray-800 mb-2">
              {isAuthenticated ? (
                <>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-medium">
                    {getUserInitials(user?.name)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{user?.name || 'User'}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full overflow-hidden shadow-md">
                    <img 
                      src="https://icon-library.com/images/guest-account-icon/guest-account-icon-7.jpg" 
                      alt="Guest Icon"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Guest User</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Sign in to access your account</p>
                  </div>
                </>
              )}
            </div>
            
            {/* Mobile Navigation Items */}
            <div className="mt-4 space-y-1">
              {navItems.map((item, index) => (
                <div key={item.name} className="mb-1">
                  {item.dropdown ? (
                    <div className="mb-1">
                      <button
                        onClick={() => toggleDropdown(index)}
                        className="w-full flex justify-between items-center px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 hover:text-blue-600 rounded-lg
                                dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-blue-400 transition-colors"
                      >
                        <div className="flex items-center">
                          {item.icon}
                          <span>{item.name}</span>
                        </div>
                        <ChevronDown 
                          size={18} 
                          className={`transition-transform duration-300 ${activeDropdown === index ? 'rotate-180 text-blue-500' : ''}`}
                        />
                      </button>
                      
                      {/* Mobile Dropdown */}
                      <div 
                        className={`overflow-hidden transition-all duration-300 rounded-lg ${
                          activeDropdown === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg mx-2 pl-4 py-1">
                          {item.dropdown.map(subItem => (
                            <Link
                              key={subItem.name}
                              to={subItem.path}
                              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-lg my-0.5
                                      dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400 transition-colors"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {subItem.icon}
                              <span>{subItem.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 hover:text-blue-600 rounded-lg block
                                dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-blue-400 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            
            
                      {/* Auth Buttons */}
              {isAuthenticated ? (
                // Show Logout button when authenticated
                <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                // Show Login/Register when NOT authenticated
                <div className="space-y-3 mt-2 border-t border-gray-100 dark:border-gray-700 pt-3">
                  <Link
                    to="/Auth"
                    className="flex items-center justify-center w-full px-4 py-2.5 rounded-lg text-white font-medium text-center shadow-sm transition-transform hover:scale-[1.02] duration-200"
                    style={{ background: 'linear-gradient(to right, #22577a, #5cacde)' }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn size={18} className="mr-2" />
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 text-center transition-all shadow-sm hover:shadow-md dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserPlus size={18} className="mr-2" />
                    Register
                  </Link>
                </div>
              )}

            
            {/* Theme Toggle Button - Inside sidebar */}
            <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-4">
              <button
                onClick={() => dispatch(toggleTheme())}
                className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 rounded-lg
                        dark:text-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="flex items-center">
                  {mode === 'dark' ? <Sun size={18} className="mr-2" /> : <Moon size={18} className="mr-2" />}
                  {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
                <div className={`w-10 h-5 rounded-full p-1 duration-300 ease-in-out ${mode === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}>
                  <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${mode === 'dark' ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </button>
            </div>
            
            {/* Footer info */}
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                © 2025 MeraBakil Professional Solutions.<br />All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;