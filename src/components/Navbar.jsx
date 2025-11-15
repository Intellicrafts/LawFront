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
import { useGoogleLogin } from '@react-oauth/google';
import { FaGoogle } from 'react-icons/fa';

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
  PlayCircle,
  CheckCircle,
  Search,
  MoreVertical
} from 'lucide-react';

// Sleek One Tap Sign-in Prompt - Black, White & Silver Theme
const OneTapPrompt = ({ onGoogleLogin, onDismiss, isDarkMode }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleDismiss = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed top-20 right-6 z-50 transition-all duration-300 ${
        isAnimating ? 'opacity-0 translate-y-2 scale-95' : 'opacity-100 translate-y-0 scale-100'
      }`}
      style={{ maxWidth: '320px' }}
    >
      <div 
        className={`relative overflow-hidden rounded-lg shadow-2xl border ${
          isDarkMode 
            ? 'bg-black border-gray-800' 
            : 'bg-white border-gray-200'
        }`}
      >
        {/* Silver metallic shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-300/10 via-transparent to-gray-400/5 pointer-events-none"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-radial from-gray-200/20 to-transparent blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-radial from-gray-300/15 to-transparent blur-2xl pointer-events-none"></div>
        
        <div className="relative p-5">
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className={`absolute top-3 right-3 p-1 rounded-full transition-all duration-200 ${
              isDarkMode 
                ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-800' 
                : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
            }`}
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>

          {/* Google Logo & Header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center mb-3">
              <FaGoogle className="text-[#4285F4]" size={18} />
            </div>
            <p className={`text-xs font-medium ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Sign in to merabakil.com with google.com
            </p>
          </div>

          {/* Divider line with silver accent */}
          <div className="relative mb-4">
            <div className={`h-px ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
            <div className={`absolute inset-0 h-px bg-gradient-to-r from-transparent via-gray-400/30 to-transparent`}></div>
          </div>

          {/* Google Sign-in Button - Enhanced Silver Theme */}
          <button
            onClick={onGoogleLogin}
            className={`group relative w-full py-2.5 px-4 rounded-md flex items-center justify-center space-x-2.5 
                      text-sm font-medium transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]
                      shadow-md hover:shadow-lg overflow-hidden ${
              isDarkMode 
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400' 
                : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400'
            }`}
          >
            {/* Silver shine animation overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                          translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            
            <FaGoogle className="relative z-10" size={16} />
            <span className="relative z-10">Continue with Google</span>
          </button>

          {/* Privacy footer - Compact */}
          <p className={`mt-3 text-[10px] text-center leading-tight ${
            isDarkMode ? 'text-gray-600' : 'text-gray-500'
          }`}>
            To continue, Google will share your name, email address, and profile picture with this site.{' '}
            <a href="#" className="text-blue-500 hover:text-blue-400 underline">Learn more</a>
          </p>

          {/* Silver accent line at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-400/40 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

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
  const [showOneTapPrompt, setShowOneTapPrompt] = useState(false);
  const { mode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const userDropdownRef = useRef(null);
  const notificationsDropdownRef = useRef(null);

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
    checkFirstTimeVisitor();
    
    // Listen for avatar updates
    const handleAvatarUpdate = (event) => {
      if (user && event.detail.userId === (user.id || 'current')) {
        console.log('Navbar: Avatar updated, refreshing user data');
        checkAuthStatus();
      }
    };

    // Listen for authentication status changes
    const handleAuthStatusChange = (event) => {
      console.log('Navbar: Auth status changed, refreshing authentication state');
      checkAuthStatus();
      setShowOneTapPrompt(false); // Hide prompt after auth
    };
    
    window.addEventListener('avatar-updated', handleAvatarUpdate);
    window.addEventListener('auth-status-changed', handleAuthStatusChange);
    
    return () => {
      window.removeEventListener('avatar-updated', handleAvatarUpdate);
      window.removeEventListener('auth-status-changed', handleAuthStatusChange);
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

  // Check if user is first-time visitor
  const checkFirstTimeVisitor = () => {
    const hasSeenPrompt = localStorage.getItem('hasSeenOneTapPrompt');
    const hasDismissedPrompt = sessionStorage.getItem('dismissedOneTapPrompt');
    const isAuth = localStorage.getItem('auth_token');
    
    // Show prompt if:
    // 1. User has never seen it (first visit ever)
    // 2. User hasn't dismissed it in current session
    // 3. User is not authenticated
    if (!hasSeenPrompt && !hasDismissedPrompt && !isAuth) {
      console.log('First-time visitor detected, showing One Tap prompt');
      // Show after a short delay for better UX
      setTimeout(() => {
        setShowOneTapPrompt(true);
        localStorage.setItem('hasSeenOneTapPrompt', 'true');
      }, 2000); // Show after 2 seconds
    }
  };

  // Google Login Handler
  const handleGoogleLoginSuccess = async (accessToken) => {
    try {
      console.log('Google login successful, access token:', accessToken);
      
      // Call your backend API to authenticate with Google token
      const response = await authAPI.googleLogin(accessToken);
      
      if (response.data.token && response.data.user) {
        // Store token and user data
        tokenManager.setToken(response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Update state
        setIsAuthenticated(true);
        setUser(response.data.user);
        setShowOneTapPrompt(false);
        
        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('auth-status-changed', {
          detail: { authenticated: true, user: response.data.user }
        }));
        
        console.log('✅ Google login complete:', response.data.user);
      }
    } catch (error) {
      console.error('❌ Google login failed:', error);
      // You can show an error toast here
    }
  };

  // Initialize Google Login
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log('Google OAuth success:', tokenResponse);
      handleGoogleLoginSuccess(tokenResponse.access_token);
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
      // You can show an error toast here
    }
  });

  // Handle prompt dismissal
  const handleDismissOneTapPrompt = () => {
    setShowOneTapPrompt(false);
    sessionStorage.setItem('dismissedOneTapPrompt', 'true');
    console.log('One Tap prompt dismissed for current session');
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
      
      // Dispatch event to notify other components of authentication change
      window.dispatchEvent(new CustomEvent('auth-status-changed', {
        detail: { authenticated: false, user: null }
      }));
      
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
        // { name: 'Legal Task Automation', path: '/task-automation', icon: <Clock size={16} className="mr-2" /> },
        { name: 'Document Review', path: '/legal-documents-review', icon: <FileText size={16} className="mr-2" /> },
        // { name: 'Personal Appointments', path: '/personal-room', icon: <Calendar size={16} className="mr-2" /> },
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
        className="fixed top-0 w-full z-40 transition-all duration-300 py-2.5 
                   bg-white dark:bg-[#0A0A0A]"
        data-tour="navbar"
      >
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end gap-4">

            {/* Hidden Original Logo for reference */}
            <div className="hidden">
              <Link to="/" className="flex items-center group">
                {/* Professional Vakil Logo - Circular Design */}
                <div className="relative h-11 w-11 mr-3 transition-all duration-300 group-hover:scale-110">
                  {/* Outer circular ring with metallic gradient */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-black 
                                shadow-xl group-hover:shadow-2xl transition-all duration-300 overflow-hidden
                                ring-2 ring-gray-700 group-hover:ring-gray-600">
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent 
                                  -translate-x-full -translate-y-full group-hover:translate-x-full group-hover:translate-y-full 
                                  transition-transform duration-1000 ease-out"></div>
                  </div>
                  
                  {/* Inner content - Professional Vakil Icon */}
                  <div className="relative h-full w-full flex items-center justify-center">
                    <svg 
                      viewBox="0 0 48 48" 
                      fill="none" 
                      className="w-7 h-7 text-white transition-all duration-300"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <linearGradient id="vakilGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f3f4f6" />
                          <stop offset="50%" stopColor="#ffffff" />
                          <stop offset="100%" stopColor="#d1d5db" />
                        </linearGradient>
                        <linearGradient id="goldAccent" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#fbbf24" />
                          <stop offset="50%" stopColor="#fcd34d" />
                          <stop offset="100%" stopColor="#f59e0b" />
                        </linearGradient>
                      </defs>
                      
                      {/* Lawyer silhouette with briefcase */}
                      {/* Head */}
                      <circle cx="24" cy="10" r="4.5" fill="url(#vakilGradient)" className="drop-shadow-md"/>
                      
                      {/* Body - Professional Suit */}
                      <path 
                        d="M24 15 L19 19 L19 34 L29 34 L29 19 L24 15 Z" 
                        fill="url(#vakilGradient)" 
                        className="drop-shadow-md"
                      />
                      
                      {/* Coat lapels - detailed */}
                      <path 
                        d="M24 16 L20 20 L20 30 M24 16 L28 20 L28 30" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        strokeLinecap="round"
                        opacity="0.4"
                      />
                      
                      {/* Tie with prominent gold accent - more visible */}
                      <path 
                        d="M24 15 L24 30 L22.5 33 L24 36 L25.5 33 L24 30 Z" 
                        fill="url(#goldAccent)" 
                        className="drop-shadow-lg"
                      />
                      
                      {/* Tie knot */}
                      <circle cx="24" cy="16" r="1.5" fill="#f59e0b" className="drop-shadow-md"/>
                      
                      {/* Briefcase */}
                      <rect 
                        x="16" 
                        y="38" 
                        width="16" 
                        height="8" 
                        rx="1.5" 
                        fill="url(#vakilGradient)"
                        className="drop-shadow-lg"
                      />
                      
                      {/* Briefcase handle */}
                      <path 
                        d="M21 38 L21 36 C21 35 22 34 24 34 C26 34 27 35 27 36 L27 38" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        strokeLinecap="round"
                        opacity="0.5"
                      />
                      
                      {/* Briefcase lock detail - gold */}
                      <rect 
                        x="23" 
                        y="40" 
                        width="2" 
                        height="4" 
                        rx="0.5" 
                        fill="url(#goldAccent)"
                      />
                    </svg>
                  </div>
                  
                  {/* Professional badge indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 
                               rounded-full shadow-lg flex items-center justify-center ring-2 ring-gray-900
                               group-hover:scale-110 transition-transform duration-300">
                    <svg viewBox="0 0 24 24" fill="none" className="w-2.5 h-2.5 text-white">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                
                {/* Text Logo with Premium Metallic Effect */}
                <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-tight relative">
                    <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-black bg-clip-text text-transparent
                                   dark:from-gray-100 dark:via-white dark:to-gray-200
                                   group-hover:from-black group-hover:via-gray-800 group-hover:to-gray-900
                                   dark:group-hover:from-white dark:group-hover:via-gray-100 dark:group-hover:to-gray-300
                                   transition-all duration-300 font-extrabold drop-shadow-sm">
                      Mera Vakil
                    </span>
                  </span>
                  <span className="text-[11px] text-gray-600 dark:text-gray-400 -mt-0.5 font-semibold tracking-wider uppercase
                               group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors
                               flex items-center gap-1">
                    <Scale size={10} className="text-amber-500" />
                    Legal Hub
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-4 flex-1 justify-center ml-60">
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
                        className={`absolute top-full left-0 mt-1 py-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200/80
                                  dark:bg-[#2C2C2C] dark:border-[#3A3A3A]/80 transform transition-all duration-200 origin-top-left
                                  ${activeDropdown === index ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                      >
                        {item.dropdown.map(subItem => (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 dark:text-gray-200 
                                     dark:hover:bg-[#3A3A3A]/50 dark:hover:text-blue-400 transition-colors"
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
            <div className="hidden lg:flex lg:items-center lg:space-x-4 min-w-fit">
              {/* Elegant divider */}
              <div className="h-8 w-px bg-gray-300 dark:bg-gray-700"></div>
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
    className={`absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#1A1A1A] rounded-xl shadow-lg border border-gray-100 dark:border-[#3A3A3A] transform transition-all duration-200 origin-top-right z-50
      ${userDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
  >
    {/* User Info */}
    <div className="flex items-center space-x-3 px-4 py-3 border-b border-gray-100 dark:border-[#3A3A3A]">
      <img
        src={user?.avatar_url || 'https://ui-avatars.com/api/?name=User&background=random'}
        alt={user?.name || 'User'}
        className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-[#3A3A3A] shadow-sm flex-shrink-0"
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
      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-[#2C2C2C] transition-colors"
      onClick={() => setUserDropdownOpen(false)}
    >
      <User size={16} className="mr-2 text-gray-400" />
      Profile
    </Link>
    <Link
      to="/settings"
      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-[#2C2C2C] transition-colors"
      onClick={() => setUserDropdownOpen(false)}
    >
      <Settings size={16} className="mr-2 text-gray-400" />
      Settings
    </Link>

    {/* Logout */}
    <div className="border-t border-gray-100 dark:border-[#3A3A3A] mt-1">
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
                  {/* Premium Login Button - Black with Silver Shine */}
                  <Link
                    to="/Auth"
                    className="group relative px-6 py-2.5 rounded-xl text-white font-semibold transition-all duration-300 
                              hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 
                              hover:-translate-y-0.5 flex items-center gap-2.5 overflow-hidden
                              bg-gradient-to-br from-gray-900 via-black to-gray-900
                              shadow-lg hover:shadow-black/60 border border-gray-800/50
                              dark:border-gray-700/50"
                  >
                    {/* Silver shine animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/20 to-transparent 
                                  -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                    
                    {/* Icon container with metallic effect */}
                    <div className="relative flex items-center justify-center w-5 h-5 rounded-lg 
                                  bg-gradient-to-br from-gray-700 to-gray-800 
                                  shadow-inner transition-all duration-300 group-hover:scale-110">
                      <LogIn size={14} className="text-gray-200" strokeWidth={2.5} />
                    </div>
                    
                    {/* Text with silver glow */}
                    <span className="relative text-sm font-bold tracking-wide text-gray-100 group-hover:text-white transition-colors">
                      Login
                    </span>
                    
                    {/* Subtle highlight edge */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent via-transparent to-white/5"></div>
                  </Link>

                  {/* Premium Register Button - White/Silver with Shine */}
                  <Link
                    to="/signup"
                    className="group relative px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 
                              hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
                              hover:-translate-y-0.5 flex items-center gap-2.5 overflow-hidden
                              bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900
                              dark:from-gray-800 dark:via-gray-750 dark:to-gray-800 dark:text-white
                              shadow-lg hover:shadow-gray-400/50 dark:hover:shadow-gray-900/60
                              border border-gray-200/80 dark:border-gray-700/50"
                  >
                    {/* Silver shine animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-gray-600/30 to-transparent 
                                  -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                    
                    {/* Icon container with metallic effect */}
                    <div className="relative flex items-center justify-center w-5 h-5 rounded-lg 
                                  bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600
                                  shadow-inner transition-all duration-300 group-hover:scale-110">
                      <UserPlus size={14} className="text-gray-700 dark:text-gray-200" strokeWidth={2.5} />
                    </div>
                    
                    {/* Text with metallic effect */}
                    <span className="relative text-sm font-bold tracking-wide text-gray-900 dark:text-gray-100 
                                   group-hover:text-black dark:group-hover:text-white transition-colors">
                      Register
                    </span>
                    
                    {/* Subtle highlight edge */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent via-transparent to-white/20 dark:to-white/5"></div>
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

      {/* One Tap Sign-in Prompt */}
      {showOneTapPrompt && !isAuthenticated && (
        <OneTapPrompt
          onGoogleLogin={googleLogin}
          onDismiss={handleDismissOneTapPrompt}
          isDarkMode={mode === 'dark'}
        />
      )}
    </>
  );
};

export default Navbar;