// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/themeSlice';
import { Link } from 'react-router-dom';
import { authAPI, tokenManager, apiServices } from '../api/apiService';
import Avatar from './common/Avatar';
import NotificationDropdown from './NotificationDropdown';
import MobileSidebar from './MobileSidebar';
import OnboardingTour from './OnboardingTour';

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
  Bell,
  AlertCircle,
  Loader,
  Compass,
  PlayCircle
} from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // We keep scrolled state for potential future use but it no longer affects navbar appearance
  const [scrolled, setScrolled] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState(null);
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);
  const [showOnboardingTour, setShowOnboardingTour] = useState(false);
  const { mode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const userDropdownRef = useRef(null);
  const notificationsDropdownRef = useRef(null);

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
    
    // Listen for avatar updates
    const handleAvatarUpdate = (event) => {
      if (user && event.detail.userId === (user.id || 'current')) {
        console.log('Navbar: Avatar updated, refreshing user data');
        checkAuthStatus();
      }
    };
    
    window.addEventListener('avatar-updated', handleAvatarUpdate);
    
    return () => {
      window.removeEventListener('avatar-updated', handleAvatarUpdate);
    };
  }, [user?.id]);

  // Watch for user authentication changes to trigger tour
  useEffect(() => {
    if (isAuthenticated && user && user.id) {
      // Only check tour for newly authenticated users (avoid multiple triggers)
      const previousUserId = sessionStorage.getItem('currentUserId');
      const currentUserId = user.id.toString();
      
      if (previousUserId !== currentUserId) {
        console.log('New user session detected, checking tour status');
        sessionStorage.setItem('currentUserId', currentUserId);
        checkAndStartTourForNewUser(user);
      }
    } else if (!isAuthenticated) {
      // Clear session when user logs out
      sessionStorage.removeItem('currentUserId');
    }
  }, [isAuthenticated, user?.id]);

  // Listen for avatar updates from Profile component
  useEffect(() => {
    const handleAvatarUpdate = (event) => {
      if (user && event.detail.userId === user.id) {
        console.log('Navbar: Avatar updated, refreshing user data');
        setUser(prev => ({ ...prev, avatar_url: event.detail.avatarUrl }));
        
        // Also update localStorage to persist the change
        const userData = localStorage.getItem('user');
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData);
            parsedUser.avatar_url = event.detail.avatarUrl;
            localStorage.setItem('user', JSON.stringify(parsedUser));
          } catch (error) {
            console.error('Error updating user avatar in localStorage:', error);
          }
        }
      }
    };
    
    window.addEventListener('profile-avatar-updated', handleAvatarUpdate);
    
    return () => {
      window.removeEventListener('profile-avatar-updated', handleAvatarUpdate);
    };
  }, [user?.id]);

  
  // Function to check if user is authenticated
  const checkAuthStatus = () => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');
    console.log('Navbar: Checking auth status - User:', userData, 'token:', token);
    
    if (token && userData) {
      setIsAuthenticated(true);
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Check if we should start tour for first-time user
        console.log('🔍 Auth check complete, checking tour for user:', parsedUser.id);
        checkAndStartTourForNewUser(parsedUser);
        
        // Fetch notifications if user is authenticated and has an ID
        if (parsedUser && parsedUser.id) {
          console.log('Fetching notifications for user ID:', parsedUser.id);
          fetchUserNotifications(parsedUser.id);
        } else {
          // For testing purposes, if user ID is not available, use the hardcoded ID 18
          console.log('User ID not found in user data, using default ID 18');
          fetchUserNotifications(18);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        handleLogout();
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };
  
  // Function to fetch user notifications
  const fetchUserNotifications = async (userId) => {
    if (!userId) return;
    
    console.log(`Fetching notifications for user ID: ${userId}`);
    setNotificationsLoading(true);
    setNotificationsError(null);
    
    try {
      // Make the API call with the provided user ID
      const response = await apiServices.getUserNotifications(userId);
      console.log('Notifications response:', response);
      
      // Process the response data
      if (response && Array.isArray(response.data)) {
        // If the API returns data in a nested 'data' property
        setNotifications(response.data);
        // Count unread notifications
        const unreadCount = response.data.filter(notification => !notification.read_at).length;
        setNotificationsCount(unreadCount);
        console.log(`Found ${response.data.length} notifications, ${unreadCount} unread`);
      } else if (response && Array.isArray(response)) {
        // If the API returns data directly as an array
        setNotifications(response);
        // Count unread notifications
        const unreadCount = response.filter(notification => !notification.read_at).length;
        setNotificationsCount(unreadCount);
        console.log(`Found ${response.length} notifications, ${unreadCount} unread`);
      } else {
        console.log('No notifications found or invalid response format:', response);
        setNotifications([]);
        setNotificationsCount(0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      
      // Detailed error logging
      if (error.response) {
        console.error('Error response:', error.response.status, error.response.data);
        setNotificationsError(`Failed to load notifications: ${error.response.status}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        setNotificationsError('Network error. Please check your connection.');
      } else {
        console.error('Error message:', error.message);
        setNotificationsError('Failed to load notifications');
      }
      
      setNotifications([]);
      setNotificationsCount(0);
    } finally {
      setNotificationsLoading(false);
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
    
    // Initial check on mount
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (notificationsDropdownRef.current && !notificationsDropdownRef.current.contains(event.target)) {
        setNotificationsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



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
        // { name: 'Virtual Assistant', path: '/', icon: <HelpCircle size={16} className="mr-2" /> },
        { name: 'Private Chat', path: '/virtual-bakil', icon: <Users size={16} className="mr-2" /> },
        { name: 'Legal Consultations', path: '/legal-consoltation', icon: <Scale size={16} className="mr-2" /> },
        // { name: 'Find Lawyers', path: '/lawyers', icon: <Users size={16} className="mr-2" /> },
        { name: 'Legal Task Automation', path: '/task-automation', icon: <Clock size={16} className="mr-2" /> },
        { name: 'Document Review', path: '/legal-documents-review', icon: <FileText size={16} className="mr-2" /> },
        { name: 'Personal Appointments', path: '/personal-room', icon: <Calendar size={16} className="mr-2" /> },
        { name: 'Information Hub', path: '/information-hub', icon: <HelpCircle size={16} className="mr-2" /> },
      ]
    },
    // { 
    //   name: 'Find Lawyers', 
    //   path: '/lawyers',
    //   icon: <Users size={18} className="mr-2" /> 
    // },
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

  // Set up periodic refresh for notifications
  useEffect(() => {
    // Only set up refresh if user is authenticated
    if (isAuthenticated) {
      // Determine which user ID to use
      const userId = user?.id || 18; // Use user ID if available, otherwise use 18
      console.log(`Setting up notification refresh for user ID: ${userId}`);
      
      // Initial fetch
      fetchUserNotifications(userId);
      
      // Set up interval to refresh notifications every 60 seconds
      const intervalId = setInterval(() => {
        console.log(`Refreshing notifications for user ID: ${userId}`);
        fetchUserNotifications(userId);
      }, 60000); // 60 seconds
      
      // Clean up interval on unmount
      return () => {
        console.log('Cleaning up notification refresh interval');
        clearInterval(intervalId);
      };
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto'; // Cleanup
    };
  }, []);

  // Get user initials for avatar fallback
  const getUserInitials = (name, lastName = '') => {
    if (!name && !lastName) return 'U';
    const firstInitial = name ? name.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`.trim() || 'U';
  };
  
  // Tour management functions
  // ===============================
  // AUTO-TOUR FUNCTIONALITY:
  // - When user logs in for first time (after cache clear), tour starts automatically
  // - Tour completion is stored per-user in localStorage with key: hasSeenOnboardingTour_{userId}
  // - Next login with same cache checks this flag and skips auto-tour
  // - Manual tour restart is always available via navbar button
  // ===============================
  
  const getTourStorageKey = (userId) => {
    return `hasSeenOnboardingTour_${userId || 'guest'}`;
  };

  const hasUserSeenTour = (userId) => {
    const storageKey = getTourStorageKey(userId);
    return localStorage.getItem(storageKey) === 'true';
  };

  const markTourAsCompleted = (userId) => {
    const storageKey = getTourStorageKey(userId);
    localStorage.setItem(storageKey, 'true');
    // Also set generic flag for backward compatibility
    localStorage.setItem('hasSeenOnboardingTour', 'true');
  };

  // Handle start tour
  const handleStartTour = () => {
    // Clear any existing tour completion flag to allow restart
    if (user?.id) {
      localStorage.removeItem(getTourStorageKey(user.id));
    }
    localStorage.removeItem('hasSeenOnboardingTour');
    setShowOnboardingTour(true);
    setIsMenuOpen(false); // Close mobile menu if open
  };

  const handleTourClose = () => {
    setShowOnboardingTour(false);
    console.log('Tour closed by user');
  };

  const handleTourComplete = () => {
    setShowOnboardingTour(false);
    if (user?.id) {
      markTourAsCompleted(user.id);
      console.log('✅ Tour completed and marked for user:', user.id);
    } else {
      localStorage.setItem('hasSeenOnboardingTour', 'true');
      console.log('✅ Tour completed (no user ID available)');
    }
  };

  // Auto-start tour for first-time users
  const checkAndStartTourForNewUser = (userData) => {
    if (!userData || !userData.id) {
      console.log('No user data or user ID available for tour check');
      return;
    }

    // Don't start tour if it's already open
    if (showOnboardingTour) {
      console.log('Tour is already open, skipping auto-start');
      return;
    }

    // Check if this user has seen the tour before
    const hasSeenTour = hasUserSeenTour(userData.id);
    const storageKey = getTourStorageKey(userData.id);
    
    console.log(`Tour check for user ${userData.id}:`, {
      hasSeenTour,
      storageKey,
      storageValue: localStorage.getItem(storageKey)
    });
    
    // Check if this is a fresh login (no previous tour data for this user)
    const isFirstTimeUser = !hasSeenTour;
    
    // Start tour automatically for first-time users
    if (isFirstTimeUser) {
      console.log('🎯 Starting tour for first-time user:', userData.id);
      // Small delay to ensure UI is ready
      setTimeout(() => {
        if (!showOnboardingTour) { // Double-check before starting
          setShowOnboardingTour(true);
        }
      }, 1500); // 1.5 second delay for smooth UX
    } else {
      console.log('✅ User has already seen tour:', userData.id);
    }
  };

  // Debug function to reset tour for current user (for testing)
  const resetTourForCurrentUser = () => {
    if (user?.id) {
      const storageKey = getTourStorageKey(user.id);
      localStorage.removeItem(storageKey);
      localStorage.removeItem('hasSeenOnboardingTour');
      console.log('🔄 Tour reset for user:', user.id);
      setShowOnboardingTour(true);
    }
  };

  // Add to window for debugging (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      window.resetTour = resetTourForCurrentUser;
      window.checkTourStatus = () => {
        if (user?.id) {
          console.log('Tour status for user:', user.id, {
            hasSeenTour: hasUserSeenTour(user.id),
            storageKey: getTourStorageKey(user.id),
            value: localStorage.getItem(getTourStorageKey(user.id))
          });
        } else {
          console.log('No user logged in to check tour status');
        }
      };
      window.simulateFirstLogin = () => {
        if (user?.id) {
          console.log('🧪 Simulating first login for user:', user.id);
          sessionStorage.removeItem('currentUserId');
          const storageKey = getTourStorageKey(user.id);
          localStorage.removeItem(storageKey);
          localStorage.removeItem('hasSeenOnboardingTour');
          checkAndStartTourForNewUser(user);
        } else {
          console.log('❌ No user logged in to simulate first login');
        }
      };
      
      // Log available commands
      console.log('🛠️ Development tour debugging commands available:');
      console.log('  window.resetTour() - Reset and start tour for current user');
      console.log('  window.checkTourStatus() - Check tour completion status');
      console.log('  window.simulateFirstLogin() - Simulate first-time login');
    }
  }, [user?.id]);

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    console.log('Notification clicked:', notification);
    
    if (!notification.read_at) {
      console.log(`Marking notification ${notification.id} as read`);
      
      try {
        // Use the updated endpoint for marking a notification as read
        await apiServices.markNotificationAsRead(notification.id);
        
        // Update local state to mark this notification as read
        setNotifications(prevNotifications => 
          prevNotifications.map(n => 
            n.id === notification.id ? { ...n, read_at: new Date().toISOString() } : n
          )
        );
        
        // Update unread count
        setNotificationsCount(prevCount => Math.max(0, prevCount - 1));
        console.log(`Notification ${notification.id} marked as read`);
      } catch (error) {
        console.error('Error marking notification as read:', error);
        
        // Detailed error logging
        if (error.response) {
          console.error('Error response:', error.response.status, error.response.data);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
      }
    }
    
    // Handle navigation or action based on notification type
    if (notification.link) {
      console.log(`Navigating to notification link: ${notification.link}`);
      // Close dropdown
      setNotificationsDropdownOpen(false);
      
      // Navigate to the link if it exists
      // If using react-router, you could use history.push here
      // For now, we'll just use window.location
      window.location.href = notification.link;
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    // Use user ID if available, otherwise use 18
    const userId = user?.id || 18;
    
    if (notifications.length === 0) return;
    
    console.log(`Marking all notifications as read for user ID: ${userId}`);
    setNotificationsLoading(true);
    
    try {
      // Call the updated endpoint
      await apiServices.markAllNotificationsAsRead(userId);
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
      );
      
      // Reset unread count
      setNotificationsCount(0);
      console.log('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      
      // Detailed error logging
      if (error.response) {
        console.error('Error response:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    } finally {
      setNotificationsLoading(false);
    }
  };

  return (
    <>
      <nav 
        className="fixed top-0 w-full z-40 transition-all duration-300 py-3 bg-white/95 backdrop-blur-sm shadow-md dark:bg-gray-900/95 dark:shadow-gray-800/30"
        data-tour="navbar"
        style={{
          borderBottom: '1px solid rgba(82, 152, 219, 0.1)',
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

            {/* Desktop Right Side - Auth & Theme */}
            <div className="hidden lg:flex lg:items-center lg:space-x-3">
              {/* Theme Toggle Button */}
              <button
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200
                          dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 focus:outline-none"
                onClick={() => dispatch(toggleTheme())}
                aria-label="Toggle dark mode"
                data-tour="theme-toggle"
              >
                {mode === 'dark' ? <Sun size={20} className="text-yellow-300" /> : <Moon size={20} />}
              </button>

              {/* Start Tour Button */}
              <button
                className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200
                          dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 focus:outline-none
                          relative group"
                onClick={handleStartTour}
                aria-label="Start tour"
                title="Take a tour of MeraBakil"
              >
                <Compass size={20} className="group-hover:rotate-12 transition-transform duration-200" />
                {/* Subtle glow effect */}
                <span className="absolute inset-0 rounded-full bg-blue-500/20 scale-0 group-hover:scale-110 
                                transition-transform duration-200 opacity-0 group-hover:opacity-100"></span>
              </button>

              {isAuthenticated ? (
                  <>
                    {/* Enhanced Notifications Dropdown */}
                    <div ref={notificationsDropdownRef}>
                      <NotificationDropdown 
                        notifications={notifications}
                        notificationsCount={notificationsCount}
                        notificationsLoading={notificationsLoading}
                        notificationsError={notificationsError}
                        isOpen={notificationsDropdownOpen}
                        onToggle={() => setNotificationsDropdownOpen(!notificationsDropdownOpen)}
                        onMarkAllAsRead={markAllAsRead}
                        onRefresh={fetchUserNotifications}
                        onNotificationClick={handleNotificationClick}
                        userId={user?.id || 18}
                      />
                      {/* <button 
                        className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 focus:outline-none relative"
                        onClick={() => setNotificationsDropdownOpen(!notificationsDropdownOpen)}
                      >
                        <Bell size={20} />
                        {notificationsLoading ? (
                          <span className="absolute -top-1 -right-1 h-4 w-4 bg-gray-300 dark:bg-gray-600 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                            <Loader size={10} className="animate-spin" />
                          </span>
                        ) : notificationsCount > 0 ? (
                          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            {notificationsCount > 9 ? '9+' : notificationsCount}
                          </span>
                        ) : null}
                      </button>
                      
                      {/* Notification Panel */}
                      
                    </div> 

                    {/* User Dropdown */}
                  <div className="relative" ref={userDropdownRef}>
  {/* Dropdown Button */}
  <button
    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
    className="flex items-center space-x-2 px-2 py-1 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-all duration-200 focus:outline-none"
  >
    <img
      src={user?.avatar_url || 'https://ui-avatars.com/api/?name=User&background=random'}
      alt={user?.name || 'User'}
      className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
    />
    <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
  </button>

  {/* Dropdown Menu */}
  <div
    className={`absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 transform transition-all duration-200 origin-top-right z-50
      ${userDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
  >
    {/* User Info */}
    <div className="flex items-center space-x-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
      <img
        src={user?.avatar_url || 'https://ui-avatars.com/api/?name=User&background=random'}
        alt={user?.name || 'User'}
        className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700 shadow-sm flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
          {user?.name || 'User'} {user?.last_name || ''}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate" title={user?.email || 'No email'}>
          {user?.email || 'No email'}
        </p>
      </div>
    </div>

    {/* Links */}
    <Link
      to="/profile"
      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800/70 transition-colors"
      onClick={() => setUserDropdownOpen(false)}
    >
      <User size={16} className="mr-2 text-gray-400" />
      Profile
    </Link>
    <Link
      to="/settings"
      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800/70 transition-colors"
      onClick={() => setUserDropdownOpen(false)}
    >
      <Settings size={16} className="mr-2 text-gray-400" />
      Settings
    </Link>

    {/* Logout */}
    <div className="border-t border-gray-100 dark:border-gray-800 mt-1">
      <button
        onClick={handleLogout}
        className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
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
                data-tour="theme-toggle"
              >
                {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              {/* Mobile Start Tour Button */}
              <button
                className="p-2 mr-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200
                          dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 focus:outline-none"
                onClick={handleStartTour}
                aria-label="Start tour"
                title="Take a tour of MeraBakil"
              >
                <Compass size={20} />
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

      {/* Professional Mobile Sidebar */}
      <MobileSidebar 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
        navItems={navItems}
        onStartTour={handleStartTour}
      />

      {/* Onboarding Tour */}
      <OnboardingTour
        isOpen={showOnboardingTour}
        onClose={handleTourClose}
        onComplete={handleTourComplete}
      />
    </>
  );
};

export default Navbar;