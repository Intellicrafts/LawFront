import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { lawyerAPI, apiServices } from '../api/apiService';
import { MdLocationOn, MdMyLocation, MdLocationSearching, MdVerified } from 'react-icons/md';
import Lottie from 'react-lottie-player';
import { useToast } from '../context/ToastContext';
import { getLawyerBackgroundImage, preloadLawyerBackgroundImages } from '../utils/unsplashService';

// Import animation files
import locationSearchAnimation from '../assets/animations/location-search.json';
import lawyerSearchAnimation from '../assets/animations/lawyer-search.json';
import {
  FaFilter,
  FaUserTie,
  FaBriefcase,
  FaMapMarkerAlt,
  FaStar,
  FaClock,
  FaEnvelopeOpenText,
  FaCheckCircle,
  FaPhoneAlt,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaTimes,
  FaRegClock,
  FaUserCheck,
  FaMoneyBillWave,
  FaArrowLeft,
  FaHourglassHalf,
  FaCalendarCheck,
  FaLongArrowAltRight,
  FaGraduationCap,
  FaShieldAlt,
  FaBolt,
  FaHeart,
  FaStarHalfAlt,
  FaEnvelope,
  FaVideo,
  FaSpinner,
  FaExclamationTriangle,
  FaInfoCircle,
  FaSync,
  FaChartLine,
  FaTrophy,
  FaHandshake,
  FaBalanceScale
} from 'react-icons/fa';
import { 
  HiOutlineSparkles,
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineStar,
  HiOutlineLocationMarker
} from 'react-icons/hi';

// Premium Professional Color Palette matching Hero and Sidebar - Production App
const colors = {
  light: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceElevated: '#F3F4F6',
    text: {
      primary: '#111827',
      secondary: '#4B5563',
      muted: '#6B7280',
      inverse: '#FFFFFF'
    },
    accent: {
      primary: '#3B82F6',
      secondary: '#1D4ED8',
      tertiary: '#60A5FA',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
      gradientHover: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
      light: '#EFF6FF'
    },
    border: {
      light: '#E5E7EB',
      default: '#D1D5DB',
      medium: '#9CA3AF'
    },
    success: {
      primary: '#059669',
      light: '#ECFDF5',
      border: '#A7F3D0'
    },
    warning: {
      primary: '#D97706',
      light: '#FFFBEB',
      border: '#FED7AA'
    },
    error: {
      primary: '#DC2626',
      light: '#FEF2F2',
      border: '#FECACA'
    },
    premium: {
      gold: '#F59E0B',
      silver: '#6B7280',
      bronze: '#92400E'
    },
    shadow: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      default: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
    }
  },
  dark: {
    background: '#0A0A0A',
    surface: '#2C2C2C',
    surfaceElevated: '#3A3A3A',
    text: {
      primary: '#F8FAFC',
      secondary: '#CBD5E1',
      muted: '#94A3B8',
      inverse: '#0A0A0A'
    },
    accent: {
      primary: '#60A5FA',
      secondary: '#3B82F6',
      tertiary: '#93C5FD',
      gradient: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
      gradientHover: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      light: '#1E3A8A'
    },
    border: {
      light: '#3A3A3A',
      default: '#4A4A4A',
      medium: '#5A5A5A'
    },
    success: {
      primary: '#10B981',
      light: '#064E3B',
      border: '#065F46'
    },
    warning: {
      primary: '#F59E0B',
      light: '#78350F',
      border: '#92400E'
    },
    error: {
      primary: '#F87171',
      light: '#7F1D1D',
      border: '#991B1B'
    },
    premium: {
      gold: '#FBBF24',
      silver: '#9CA3AF',
      bronze: '#D97706'
    },
    shadow: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
      default: '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.4)'
    }
  }
};

// Professional Categories with Icons for Filtering
const categories = [
  { 
    name: 'All', 
    icon: FaBalanceScale, 
    color: '#3B82F6', 
    description: 'All legal specializations' 
  },
  { 
    name: 'Criminal', 
    icon: FaShieldAlt, 
    color: '#DC2626', 
    description: 'Criminal defense & prosecution' 
  },
  { 
    name: 'Family', 
    icon: FaHeart, 
    color: '#EC4899', 
    description: 'Divorce, custody & family matters' 
  },
  { 
    name: 'Corporate', 
    icon: FaBriefcase, 
    color: '#059669', 
    description: 'Business law & corporate affairs' 
  },
  { 
    name: 'Immigration', 
    icon: HiOutlineLocationMarker, 
    color: '#7C3AED', 
    description: 'Visa, citizenship & immigration' 
  },
  { 
    name: 'Civil', 
    icon: FaHandshake, 
    color: '#0891B2', 
    description: 'Civil disputes & litigation' 
  },
  { 
    name: 'Labor Law', 
    icon: FaUserTie, 
    color: '#EA580C', 
    description: 'Employment & labor disputes' 
  },
  { 
    name: 'Tax Law', 
    icon: FaChartLine, 
    color: '#16A34A', 
    description: 'Tax planning & disputes' 
  },
  { 
    name: 'Intellectual Property', 
    icon: HiOutlineSparkles, 
    color: '#9333EA', 
    description: 'Patents, trademarks & IP' 
  }
];

// Sample data removed - using only live API data for production

// Time slots
const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

/**
 * LegalCosultation Component
 * 
 * This component fetches and displays a list of lawyers from the API,
 * with filtering, pagination, location-based search, and detailed view functionality.
 */
const LegalCosultation = () => {
  // Get dark mode state from Redux
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';
  const currentTheme = isDarkMode ? colors.dark : colors.light;
  
  // State for lawyers data
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [backgroundImages, setBackgroundImages] = useState({});
  const [hasMore, setHasMore] = useState(true);
  
  // State for UI controls
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [isFilterSticky, setIsFilterSticky] = useState(false);
  const [view, setView] = useState('lawyers');
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingFormData, setBookingFormData] = useState({
    name: '',
    email: '',
    phone: '',
    caseDetails: '',
  });
  const [bookingStep, setBookingStep] = useState(1);
  
  // Auto-fill form data with user details when component mounts
  useEffect(() => {
    // Check if user is logged in
    const isAuthenticated = localStorage.getItem('auth_token');
    
    if (isAuthenticated) {
      try {
        // Try to get user data from different possible sources
        let userData = null;
        
        // First try the 'user' key which is set during login
        const userStr = localStorage.getItem('user');
        if (userStr) {
          userData = JSON.parse(userStr);
        }
        
        // If not found, try the 'user_profile' key which might have more details
        if (!userData || !userData.name) {
          const profileStr = localStorage.getItem('user_profile');
          if (profileStr) {
            userData = JSON.parse(profileStr);
          }
        }
        
        // If we have user data, pre-fill the form
        if (userData) {
          setBookingFormData({
            name: userData.name || userData.full_name || '',
            email: userData.email || '',
            phone: userData.phone || userData.phone_number || '',
            caseDetails: `I would like to schedule a legal consultation regarding my case. I need professional advice on legal matters.`
          });
          console.log('Pre-filled form with user data on component mount');
        }
      } catch (error) {
        console.error('Error pre-filling form with user data:', error);
      }
    }
  }, []);
  const [bookingComplete, setBookingComplete] = useState(false);
  
  // Function to handle booking with Rodger Prosacco
  const bookWithRodgerProsacco = () => {
    // Find Rodger Prosacco in the lawyers list
    const rodgerProsacco = lawyers.find(lawyer => lawyer.full_name === 'Rodger Prosacco');
    
    // If not found in the current list, create a sample lawyer object
    const defaultRodgerProsacco = {
      id: 999, // Use a unique ID
      full_name: 'Rodger Prosacco',
      specialization: 'Corporate',
      years_of_experience: 15,
      bar_association: 'Delhi Bar Association',
      consultation_fee: 3000,
      phone_number: '+91 98765 43210',
      email: 'rodger.prosacco@example.com',
      license_number: 'BCI/100999/2015',
      is_verified: true,
      profile_picture_url: null,
      reviews_count: 25,
      appointments_count: 120,
      bio: 'Experienced Corporate lawyer with 15 years of practice. Specializing in complex cases with a high success rate.'
    };
    
    // Set the selected lawyer
    const selectedLawyerData = rodgerProsacco || defaultRodgerProsacco;
    setSelectedLawyer(selectedLawyerData);
    
    // Generate background image for this lawyer if not already in state
    if (!backgroundImages[selectedLawyerData.id]) {
      setBackgroundImages(prev => ({
        ...prev,
        [selectedLawyerData.id]: getLawyerBackgroundImage(selectedLawyerData)
      }));
    }
    
    // Set view to booking
    setView('booking');
    
    // Pre-fill form with user data if logged in
    const isAuthenticated = localStorage.getItem('auth_token');
    
    if (isAuthenticated) {
      try {
        // Try to get user data from different possible sources
        let userData = null;
        
        // First try the 'user' key which is set during login
        const userStr = localStorage.getItem('user');
        if (userStr) {
          userData = JSON.parse(userStr);
        }
        
        // If not found, try the 'user_profile' key which might have more details
        if (!userData || !userData.name) {
          const profileStr = localStorage.getItem('user_profile');
          if (profileStr) {
            userData = JSON.parse(profileStr);
          }
        }
        
        // If we have user data, pre-fill the form
        if (userData) {
          setBookingFormData({
            name: userData.name || userData.full_name || '',
            email: userData.email || '',
            phone: userData.phone || userData.phone_number || '',
            caseDetails: 'I would like to book a consultation with Rodger Prosacco.' // Default case details
          });
          console.log('Pre-filled form with user data for Rodger Prosacco consultation');
        }
      } catch (error) {
        console.error('Error pre-filling form with user data:', error);
      }
    }
  };
  
  // Pre-fill form data when a user selects Rodger Prosacco for consultation
  useEffect(() => {
    if (selectedLawyer && selectedLawyer.full_name === 'Rodger Prosacco') {
      // Check if user is logged in
      const isAuthenticated = localStorage.getItem('auth_token');
      
      if (isAuthenticated) {
        // Get user data from localStorage
        try {
          // Try to get user data from different possible sources
          let userData = null;
          
          // First try the 'user' key which is set during login
          const userStr = localStorage.getItem('user');
          if (userStr) {
            userData = JSON.parse(userStr);
          }
          
          // If not found, try the 'user_profile' key which might have more details
          if (!userData || !userData.name) {
            const profileStr = localStorage.getItem('user_profile');
            if (profileStr) {
              userData = JSON.parse(profileStr);
            }
          }
          
          // If we have user data, pre-fill the form
          if (userData) {
            setBookingFormData({
              name: userData.name || userData.full_name || '',
              email: userData.email || '',
              phone: userData.phone || userData.phone_number || '',
              caseDetails: bookingFormData.caseDetails || 'I would like to book a consultation with Rodger Prosacco.' // Keep existing case details if any
            });
            console.log('Pre-filled form with user data for Rodger Prosacco consultation');
          }
        } catch (error) {
          console.error('Error pre-filling form with user data:', error);
        }
      }
    }
  }, [selectedLawyer]);
  
  // Location-based search state
  const [userLocation, setUserLocation] = useState(null);
  const [locationSearching, setLocationSearching] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [topRatedLoading, setTopRatedLoading] = useState(false);
  
  // Refs for scrolling
  const contentRef = useRef(null);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);
  
  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    // Only set up observer when in lawyers view
    if (view !== 'lawyers') return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading && !loadingMore) {
          // Load more data when the user scrolls to the bottom
          fetchLawyers(currentPage + 1, false);
        }
      },
      { threshold: 0.1 }
    );
    
    // Save observer to ref
    observerRef.current = observer;
    
    // Observe the load more element if it exists
    const currentLoadMoreRef = loadMoreRef.current;
    if (currentLoadMoreRef) {
      observer.observe(currentLoadMoreRef);
    }
    
    // Cleanup
    return () => {
      if (currentLoadMoreRef && observer) {
        observer.unobserve(currentLoadMoreRef);
      }
    };
  }, [view, hasMore, loading, loadingMore, currentPage]);
  
  // State for caching
  const [lawyersCache, setLawyersCache] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check if user is authenticated
  useEffect(() => {
    const authToken = localStorage.getItem('auth_token');
    setIsAuthenticated(!!authToken);
  }, []);

  // Fetch lawyers from API - initial load
  useEffect(() => {
    // Reset lawyers array and fetch from page 1 when filters change
    setLawyers([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchLawyers(1, true);
  }, [selectedCategory, locationEnabled, userLocation, searchQuery]);

  /**
   * Generate cache key based on current filters
   */
  const getCacheKey = (page, category, location, query) => {
    return `lawyers_${page}_${category}_${location ? `${location.latitude}_${location.longitude}` : 'noloc'}_${query || 'noquery'}`;
  };

  /**
   * Fetch lawyers from the API with optional filtering
   * @param {number} page - The page number to fetch
   * @param {boolean} isNewSearch - Whether this is a new search (reset data)
   */
  const fetchLawyers = async (page = currentPage, isNewSearch = false) => {
    if (isNewSearch) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);
    
    try {
      // Prepare parameters for API call
      const params = {
        page: page,
        per_page: 6
      };
      
      if (selectedCategory !== 'All') {
        params.specialization = selectedCategory;
      }
      
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      // Add location parameters if location is enabled
      if (locationEnabled && userLocation) {
        params.latitude = userLocation.latitude;
        params.longitude = userLocation.longitude;
        params.radius = 50; // Search radius in kilometers
      }
      
      // Generate cache key
      const cacheKey = getCacheKey(page, selectedCategory, locationEnabled ? userLocation : null, searchQuery);
      
      // Check if we have cached data for this query
      if (lawyersCache[cacheKey] && !isNewSearch) {
        console.log('Using cached lawyers data');
        const cachedData = lawyersCache[cacheKey];
        
        if (isNewSearch) {
          setLawyers(cachedData.lawyers);
        } else {
          setLawyers(prevLawyers => [...prevLawyers, ...cachedData.lawyers]);
        }
        
        setTotalPages(cachedData.totalPages);
        setHasMore(page < cachedData.totalPages);
        setCurrentPage(page);
        
        // Still update background images
        const newImages = preloadLawyerBackgroundImages(cachedData.lawyers);
        setBackgroundImages(prevImages => ({
          ...prevImages,
          ...newImages
        }));
        
        if (isNewSearch) {
          setLoading(false);
        } else {
          setLoadingMore(false);
        }
        
        return;
      }
      
      console.log('Fetching lawyers with params:', params);
      
      // Check if user is authenticated for premium features
      if (!isAuthenticated && (params.latitude || params.sort === 'rating')) {
        console.log('User not authenticated for premium features');
        setError('Please login to access premium features like location-based search and top-rated lawyers.');
        
        // Still show some sample data
        handleApiFailure(page, isNewSearch);
        return;
      }
      
      // Call the API using lawyerAPI service with retry logic
      let apiResponse = null;
      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount <= maxRetries && !apiResponse) {
        try {
          const response = await lawyerAPI.getLawyers(params);
          
          if (response && response.success) {
            apiResponse = response;
            break;
          } else {
            retryCount++;
            if (retryCount <= maxRetries) {
              console.log(`Retry attempt ${retryCount} for API call`);
              await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
            }
          }
        } catch (error) {
          retryCount++;
          if (retryCount <= maxRetries) {
            console.log(`Retry attempt ${retryCount} after error: ${error.message}`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
          } else {
            throw error; // Rethrow after max retries
          }
        }
      }
      
      if (apiResponse) {
        const responseData = apiResponse.data;
        const lawyersData = responseData.data || [];
        
        if (lawyersData.length === 0) {
          // API returned empty data
          console.log('API returned empty lawyers data');
          
          if (isNewSearch) {
            setLawyers([]);
          }
          
          setHasMore(false);
          
          // Cache the empty result to avoid unnecessary API calls
          setLawyersCache(prev => ({
            ...prev,
            [cacheKey]: {
              lawyers: [],
              totalPages: 0,
              timestamp: Date.now()
            }
          }));
        } else {
          // Update state based on whether this is a new search or loading more
          if (isNewSearch) {
            setLawyers(lawyersData);
          } else {
            setLawyers(prevLawyers => [...prevLawyers, ...lawyersData]);
          }
          
          // Calculate total pages
          const totalPagesCount = Math.ceil((responseData.total || 0) / (responseData.per_page || 6));
          setTotalPages(totalPagesCount);
          
          // Check if we have more data to load
          setHasMore(page < totalPagesCount);
          
          // Update current page
          setCurrentPage(page);
          
          // Preload background images for each lawyer
          console.log('Fetched lawyers data:', lawyersData);
          const newImages = preloadLawyerBackgroundImages(lawyersData);
          
          // Merge new images with existing ones
          setBackgroundImages(prevImages => ({
            ...prevImages,
            ...newImages
          }));
          
          // Cache the result
          setLawyersCache(prev => ({
            ...prev,
            [cacheKey]: {
              lawyers: lawyersData,
              totalPages: totalPagesCount,
              timestamp: Date.now()
            }
          }));
        }
      } else {
        // All retries failed
        throw new Error('Failed to fetch lawyers data after multiple attempts');
      }
    } catch (err) {
      console.error('Error fetching lawyers:', err);
      handleApiFailure(page, isNewSearch);
    } finally {
      if (isNewSearch) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };
  
  /**
   * Handle API failure by showing appropriate error
   */
  const handleApiFailure = (page, isNewSearch) => {
    console.log('API failure - showing error message');
    setError('Unable to load lawyers. Please check your connection and try again.');
    setLoading(false);
    setLoadingMore(false);
    setLawyers([]);
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    // Reset state for new search - the useEffect will trigger the actual search
    setLawyers([]);
    setCurrentPage(1);
    setHasMore(true);
  };
  
  /**
   * Get user's current location
   */
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }
    
    setLocationSearching(true);
    setLocationError(null);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setLocationEnabled(true);
        setLocationSearching(false);
        
        // Fetch lawyers with the new location
        setCurrentPage(1);
        fetchLawyers();
      },
      (error) => {
        setLocationSearching(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission denied. Please enable location services.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('The request to get user location timed out.');
            break;
          default:
            setLocationError('An unknown error occurred while getting location.');
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };
  
  /**
   * Toggle location-based search
   */
  const toggleLocationSearch = () => {
    if (locationEnabled) {
      setLocationEnabled(false);
      setCurrentPage(1);
      fetchLawyers();
    } else {
      getUserLocation();
    }
  };
  
  /**
   * Fetch nearby lawyers
   */
  const fetchNearbyLawyers = async () => {
    // Check if user is authenticated for location-based search
    if (!isAuthenticated) {
      setError('Please login to access location-based search features.');
        setNearbyLoading(false);
      return;
    }
    
    if (!userLocation) {
      getUserLocation();
      return;
    }
    
    setNearbyLoading(true);
    setError(null);
    
    try {
      // Reset state for new search
      setLawyers([]);
      setCurrentPage(1);
      setHasMore(true);
      
      const params = {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        radius: 25, // 25km radius
        sort: 'distance',
        page: 1,
        per_page: 6
      };
      
      // Generate cache key for nearby search
      const cacheKey = `nearby_${params.latitude}_${params.longitude}_${params.radius}`;
      
      // Check if we have cached data
      if (lawyersCache[cacheKey]) {
        console.log('Using cached nearby lawyers data');
        const cachedData = lawyersCache[cacheKey];
        
        setLawyers(cachedData.lawyers);
        setTotalPages(cachedData.totalPages);
        setHasMore(1 < cachedData.totalPages);
        
        // Still update background images
        const newImages = preloadLawyerBackgroundImages(cachedData.lawyers);
        setBackgroundImages(prevImages => ({
          ...prevImages,
          ...newImages
        }));
        
        setNearbyLoading(false);
        return;
      }
      
      // Call the API with retry logic
      let apiResponse = null;
      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount <= maxRetries && !apiResponse) {
        try {
          const response = await lawyerAPI.getLawyers(params);
          
          if (response && response.success) {
            apiResponse = response;
            break;
          } else {
            retryCount++;
            if (retryCount <= maxRetries) {
              console.log(`Retry attempt ${retryCount} for nearby lawyers API call`);
              await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
            }
          }
        } catch (error) {
          retryCount++;
          if (retryCount <= maxRetries) {
            console.log(`Retry attempt ${retryCount} after error: ${error.message}`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
          } else {
            throw error; // Rethrow after max retries
          }
        }
      }
      
      if (apiResponse) {
        const responseData = apiResponse.data;
        const lawyersData = responseData.data || [];
        
        if (lawyersData.length === 0) {
          // API returned empty data
          setLawyers([]);
          setHasMore(false);
          setError('No lawyers found in your area. Try expanding your search radius.');
        } else {
          setLawyers(lawyersData);
          
          // Calculate total pages
          const totalPagesCount = Math.ceil((responseData.total || 0) / (responseData.per_page || 6));
          setTotalPages(totalPagesCount);
          
          // Check if we have more data to load
          setHasMore(1 < totalPagesCount);
          
          // Preload background images for each lawyer
          const newImages = preloadLawyerBackgroundImages(lawyersData);
          setBackgroundImages(prevImages => ({
            ...prevImages,
            ...newImages
          }));
          
          // Cache the result
          setLawyersCache(prev => ({
            ...prev,
            [cacheKey]: {
              lawyers: lawyersData,
              totalPages: totalPagesCount,
              timestamp: Date.now()
            }
          }));
        }
      } else {
        // All retries failed
        throw new Error('Failed to fetch nearby lawyers after multiple attempts');
      }
    } catch (err) {
      console.error('Error fetching nearby lawyers:', err);
      setError('Unable to load nearby lawyers. Please try again.');
    } finally {
      setNearbyLoading(false);
    }
  };
  
  /**
   * Fetch top-rated lawyers
   */
  const fetchTopRatedLawyers = async () => {
    // Check if user is authenticated for premium features
    if (!isAuthenticated) {
      setError('Please login to access premium features like top-rated lawyers.');
        setTopRatedLoading(false);
      return;
    }
    
    setTopRatedLoading(true);
    setError(null);
    
    try {
      // Reset state for new search
      setLawyers([]);
      setCurrentPage(1);
      setHasMore(true);
      
      const params = {
        sort: 'rating',
        page: 1,
        per_page: 6
      };
      
      // Generate cache key for top-rated search
      const cacheKey = 'top_rated_lawyers';
      
      // Check if we have cached data that's less than 30 minutes old
      const currentTime = Date.now();
      if (lawyersCache[cacheKey] && 
          (currentTime - lawyersCache[cacheKey].timestamp) < 30 * 60 * 1000) { // 30 minutes cache
        console.log('Using cached top-rated lawyers data');
        const cachedData = lawyersCache[cacheKey];
        
        setLawyers(cachedData.lawyers);
        setTotalPages(cachedData.totalPages);
        setHasMore(1 < cachedData.totalPages);
        
        // Still update background images
        const newImages = preloadLawyerBackgroundImages(cachedData.lawyers);
        setBackgroundImages(prevImages => ({
          ...prevImages,
          ...newImages
        }));
        
        setTopRatedLoading(false);
        return;
      }
      
      // Call the API with retry logic
      let apiResponse = null;
      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount <= maxRetries && !apiResponse) {
        try {
          const response = await lawyerAPI.getLawyers(params);
          
          if (response && response.success) {
            apiResponse = response;
            break;
          } else {
            retryCount++;
            if (retryCount <= maxRetries) {
              console.log(`Retry attempt ${retryCount} for top-rated lawyers API call`);
              await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
            }
          }
        } catch (error) {
          retryCount++;
          if (retryCount <= maxRetries) {
            console.log(`Retry attempt ${retryCount} after error: ${error.message}`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
          } else {
            throw error; // Rethrow after max retries
          }
        }
      }
      
      if (apiResponse) {
        const responseData = apiResponse.data;
        const lawyersData = responseData.data || [];
        
        if (lawyersData.length === 0) {
          // API returned empty data
          setLawyers([]);
          setHasMore(false);
          setError('No top-rated lawyers found. Please try again later.');
        } else {
          setLawyers(lawyersData);
          
          // Calculate total pages
          const totalPagesCount = Math.ceil((responseData.total || 0) / (responseData.per_page || 6));
          setTotalPages(totalPagesCount);
          
          // Check if we have more data to load
          setHasMore(1 < totalPagesCount);
          
          // Preload background images for each lawyer
          const newImages = preloadLawyerBackgroundImages(lawyersData);
          setBackgroundImages(prevImages => ({
            ...prevImages,
            ...newImages
          }));
          
          // Cache the result
          setLawyersCache(prev => ({
            ...prev,
            [cacheKey]: {
              lawyers: lawyersData,
              totalPages: totalPagesCount,
              timestamp: Date.now()
            }
          }));
        }
      } else {
        // All retries failed
        throw new Error('Failed to fetch top-rated lawyers after multiple attempts');
      }
    } catch (err) {
      console.error('Error fetching top-rated lawyers:', err);
      setError('Unable to load top-rated lawyers. Please try again.');
    } finally {
      setTopRatedLoading(false);
    }
  };

  // Handle sticky filter bar
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsFilterSticky(offset > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get toast functions
  const { showSuccess, showError } = useToast();

  // Function to handle booking form submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (bookingStep === 1) {
      if (bookingDate && bookingTime) {
        setBookingStep(2);
        
        // If booking with Rodger Prosacco, pre-fill form data from localStorage
        if (selectedLawyer && selectedLawyer.full_name === 'Rodger Prosacco') {
          // Check if user is logged in
          const isAuthenticated = localStorage.getItem('auth_token');
          
          if (isAuthenticated) {
            // Get user data from localStorage
            try {
              // Try to get user data from different possible sources
              let userData = null;
              
              // First try the 'user' key which is set during login
              const userStr = localStorage.getItem('user');
              if (userStr) {
                userData = JSON.parse(userStr);
              }
              
              // If not found, try the 'user_profile' key which might have more details
              if (!userData || !userData.name) {
                const profileStr = localStorage.getItem('user_profile');
                if (profileStr) {
                  userData = JSON.parse(profileStr);
                }
              }
              
              // If we have user data, pre-fill the form
              if (userData) {
                setBookingFormData({
                  name: userData.name || userData.full_name || '',
                  email: userData.email || '',
                  phone: userData.phone || userData.phone_number || '',
                  caseDetails: bookingFormData.caseDetails // Keep existing case details if any
                });
                console.log('Pre-filled form with user data for Rodger Prosacco consultation');
              }
            } catch (error) {
              console.error('Error pre-filling form with user data:', error);
            }
          }
        }
      }
    } else if (bookingStep === 2) {
      try {
        // Check if user is authenticated
        const isAuthenticated = localStorage.getItem('auth_token');
        
        // Get the current user ID from localStorage if available
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = currentUser.id;
        
        // If not authenticated or no user ID, show error
        if (!isAuthenticated || !userId) {
          showError('Please log in to book an appointment.');
          return;
        }
        
        // Format the appointment time as a valid datetime string
        // Parse the time string (assuming format like "10:00 AM" or "14:00")
        let hours = 0;
        let minutes = 0;
        
        if (bookingTime.includes(':')) {
          // Handle time formats like "10:00 AM" or "14:00"
          const timeParts = bookingTime.replace(/\s+/g, ' ').trim().split(' ');
          const [hoursStr, minutesStr] = timeParts[0].split(':');
          
          hours = parseInt(hoursStr, 10);
          minutes = parseInt(minutesStr, 10);
          
          // Handle AM/PM if present
          if (timeParts.length > 1 && timeParts[1].toUpperCase() === 'PM' && hours < 12) {
            hours += 12;
          } else if (timeParts.length > 1 && timeParts[1].toUpperCase() === 'AM' && hours === 12) {
            hours = 0;
          }
        }
        
        // Create a date object with the combined date and time
        const dateObj = new Date(bookingDate);
        dateObj.setHours(hours, minutes, 0, 0);
        
        // Format as ISO string for the API
        const formattedDateTime = dateObj.toISOString();
        
        // Format the appointment time as required by the API (YYYY-MM-DD HH:MM:SS)
        const formattedDateTimeStr = dateObj.toISOString().replace('T', ' ').substring(0, 19);
        
        // Prepare appointment data according to the sample provided
        const googleMeetLink = "https://meet.google.com/cbx-twdp-qhm"; // Use the provided Google Meet link
        const appointmentData = {
          user_id: userId, // Required field - current logged in user
          lawyer_id: selectedLawyer.id,
          appointment_time: formattedDateTimeStr, // Format: "2025-06-29 17:03:02"
          duration_minutes: "50", // Duration in minutes as a string (as per sample)
          status: "scheduled", // Use the status from the sample
          meeting_link: googleMeetLink, // Use the Google Meet link
          notes: bookingFormData.caseDetails // Additional case details
        };
        
        console.log('Sending appointment data:', appointmentData);
        
        // Show loading state
        setLoading(true);
        
        try {
          // Call the API to book appointment with lawyer
          // Note: lawyer_id is already in appointmentData, but we still pass it separately
          // to the function for clarity and to maintain the API function signature
          const response = await lawyerAPI.bookLawyerAppointment(selectedLawyer.id, appointmentData);
          console.log('Booking response:', response);
          
          // Handle successful response
          if (response) {
            showSuccess('Appointment booked successfully!');
            
            // Store the appointment response data for reference
            try {
              localStorage.setItem('last_appointment', JSON.stringify(response));
              
              // Always store the Google Meet link
              localStorage.setItem('meeting_link', "https://meet.google.com/cbx-twdp-qhm");
            } catch (e) {
              console.error('Error storing appointment data:', e);
            }
            
            // Create notifications for both user and lawyer
            try {
              const appointmentDate = new Date(appointmentData.appointment_time).toLocaleDateString();
              const appointmentTime = new Date(appointmentData.appointment_time).toLocaleTimeString();
              
              // Create notification for the user
              const userNotification = {
                user_id: userId,
                title: 'Appointment Booked',
                description: `Your appointment with ${selectedLawyer.name || 'the lawyer'} has been scheduled for ${appointmentDate} at ${appointmentTime}.`,
                status: 'unread'
              };
              
              // Create notification for the lawyer
              const lawyerNotification = {
                user_id: selectedLawyer.id, // Lawyer's user ID
                title: 'New Appointment',
                description: `A new appointment has been scheduled for ${appointmentDate} at ${appointmentTime}.`,
                status: 'unread'
              };
              
              // Send notifications without waiting for response and without showing toasts
              apiServices.createNotification(userNotification)
                .then(result => console.log('User notification created:', result))
                .catch(err => console.error('Failed to create user notification:', err));
                
              apiServices.createNotification(lawyerNotification)
                .then(result => console.log('Lawyer notification created:', result))
                .catch(err => console.error('Failed to create lawyer notification:', err));
            } catch (notificationError) {
              // Just log the error but don't show to user since the appointment was successful
              console.error('Error creating notifications:', notificationError);
            }
            
            setBookingComplete(true);
          }
        } catch (error) {
          console.error('Error booking appointment:', error);
          
          // Even if the API call fails, we can still show the booking confirmation with the Google Meet link
          // This is a fallback mechanism for development/testing
          if (process.env.NODE_ENV === 'development') {
            console.log('Using fallback booking confirmation in development mode');
            localStorage.setItem('meeting_link', "https://meet.google.com/cbx-twdp-qhm");
            setBookingComplete(true);
            showSuccess('Appointment booked successfully (development mode)!');
            return;
          }
          
          // Handle validation errors from the API
          if (error.response && error.response.data) {
            // Check for different error formats
            if (error.response.data.errors) {
              const validationErrors = error.response.data.errors;
              
              // Format validation errors for display
              const errorMessages = Object.entries(validationErrors)
                .map(([field, messages]) => {
                  if (Array.isArray(messages)) {
                    return `${field}: ${messages.join(', ')}`;
                  } else {
                    return `${field}: ${messages}`;
                  }
                })
                .join('\n');
              
              showError(`Validation errors: ${errorMessages}`);
              
              // If user_id is missing and required, show a more user-friendly message
              if (validationErrors.user_id) {
                showError('You need to be logged in to book an appointment. Please log in and try again.');
              }
            } else if (error.response.data.message) {
              // Direct error message from API
              showError(error.response.data.message);
            } else if (typeof error.response.data === 'string') {
              // Plain string error
              showError(error.response.data);
            } else {
              // Unknown error format but we have a response
              showError('Failed to book appointment. Please check your information and try again.');
            }
          } else {
            // Generic error message for network or other issues
            showError(error.message || 'Failed to book appointment. Please try again later.');
          }
        } finally {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in booking process:', error);
        showError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  /**
   * Scroll to top of the content
   */
  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Function to view lawyer details
  const viewLawyerDetails = (lawyer) => {
    setSelectedLawyer(lawyer);
    
    // Ensure background image is loaded for this lawyer
    if (!backgroundImages[lawyer.id]) {
      setBackgroundImages(prev => ({
        ...prev,
        [lawyer.id]: getLawyerBackgroundImage(lawyer)
      }));
    }
    
    setView('detail');
    scrollToTop();
  };

  // Function to start booking process
  const startBooking = (lawyer) => {
    setSelectedLawyer(lawyer);
    
    // Ensure background image is loaded for this lawyer
    if (!backgroundImages[lawyer.id]) {
      setBackgroundImages(prev => ({
        ...prev,
        [lawyer.id]: getLawyerBackgroundImage(lawyer)
      }));
    }
    
    setView('booking');
    setBookingStep(1);
    setBookingComplete(false);
    scrollToTop();
  };

  // Function to go back to previous view
  const goBack = () => {
    console.log('Going back from view:', view);
    if (view === 'detail') {
      setView('lawyers');
      scrollToTop();
    } else if (view === 'booking') {
      if (bookingStep > 1 && !bookingComplete) {
        setBookingStep(bookingStep - 1);
      } else if (bookingComplete) {
        setView('lawyers');
        setBookingComplete(false);
        setBookingStep(1);
        scrollToTop();
      } else {
        setView('detail');
        scrollToTop();
      }
    }
  };

  // Generate dates for the next 7 days
  const nextSevenDays = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      fullDate: date.toISOString().split('T')[0],
    };
  });

  /**
   * Render star rating based on rating value
   * @param {number} rating - The rating value (e.g., 4.5)
   * @returns {Array} Array of star components
   */
  const renderStars = (rating) => {
    if (!rating) return Array(5).fill(<FaStar className="text-slate-300" />);
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-amber-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-amber-400" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-slate-300" />);
    }
    
    return stars;
  };

  /**
   * Generate initials from a name
   * @param {string} name - Full name
   * @returns {string} Initials (up to 2 characters)
   */
  const getInitials = (name) => {
    if (!name) return 'LA';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  /**
   * Generate professional gradient colors for profile avatars
   * @param {string} name - Full name to generate color from
   * @returns {object} Object with from and to colors
   */
  const getProfileGradient = (name) => {
    const gradients = [
      { from: '#10B981', to: '#34D399' }, // Emerald
      { from: '#059669', to: '#10B981' }, // Green
      { from: '#F59E0B', to: '#FCD34D' }, // Amber
      { from: '#8B5CF6', to: '#A78BFA' }, // Purple
      { from: '#EF4444', to: '#F87171' }, // Red
      { from: '#3B82F6', to: '#60A5FA' }, // Blue
      { from: '#EC4899', to: '#F472B6' }, // Pink
      { from: '#06B6D4', to: '#67E8F9' }, // Cyan
    ];
    
    const index = (name?.charCodeAt(0) || 0) % gradients.length;
    return gradients[index];
  };

  /**
   * Render different views based on the current state
   */
  const renderView = () => {
    if (view === 'lawyers') {
      return (
        <>
          {/* Premium Quick Action Cards */}
          <div className="pt-20 sm:pt-24 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button 
              onClick={fetchNearbyLawyers}
              disabled={nearbyLoading}
                className={`group relative overflow-hidden rounded-xl p-4 transition-all duration-200 hover:scale-[1.02] border ${
                isDarkMode 
                    ? 'bg-gradient-to-br from-slate-700/50 to-slate-600/50 hover:from-slate-700 hover:to-slate-600 border-slate-600/50 hover:border-slate-500' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-50 hover:from-gray-150 hover:to-gray-100 border-gray-300/50 hover:border-gray-400'
              }`}
                style={{ boxShadow: currentTheme.shadow.sm }}
            >
                <div className="flex items-center space-x-3">
              {nearbyLoading ? (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
                      <FaSpinner className="text-white text-xs animate-spin" />
                </div>
              ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
                      <HiOutlineLocationMarker className="text-white text-sm" />
                  </div>
                  )}
                  <div className="text-left">
                    <h3 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {nearbyLoading ? 'Finding...' : 'Nearby Lawyers'}
                    </h3>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      {nearbyLoading ? 'Locating lawyers' : 'In your area'}
                    </p>
                  </div>
                </div>
            </button>
            
            <button 
              onClick={fetchTopRatedLawyers}
              disabled={topRatedLoading}
                className={`group relative overflow-hidden rounded-xl p-4 transition-all duration-200 hover:scale-[1.02] border ${
                isDarkMode 
                    ? 'bg-gradient-to-br from-slate-700/50 to-slate-600/50 hover:from-slate-700 hover:to-slate-600 border-slate-600/50 hover:border-slate-500' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-50 hover:from-gray-150 hover:to-gray-100 border-gray-300/50 hover:border-gray-400'
              }`}
                style={{ boxShadow: currentTheme.shadow.sm }}
            >
                <div className="flex items-center space-x-3">
              {topRatedLoading ? (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
                      <FaSpinner className="text-white text-xs animate-spin" />
                </div>
              ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
                      <FaTrophy className="text-white text-sm" />
                  </div>
                  )}
                  <div className="text-left">
                    <h3 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {topRatedLoading ? 'Loading...' : 'Top Rated'}
                    </h3>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      {topRatedLoading ? 'Best lawyers' : 'Highest reviews'}
                    </p>
                  </div>
                </div>
            </button>

              <button 
                onClick={() => bookWithRodgerProsacco()}
                className={`group relative overflow-hidden rounded-xl p-4 transition-all duration-200 hover:scale-[1.02] border ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-slate-700/50 to-slate-600/50 hover:from-slate-700 hover:to-slate-600 border-slate-600/50 hover:border-slate-500' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-50 hover:from-gray-150 hover:to-gray-100 border-gray-300/50 hover:border-gray-400'
                }`}
                style={{ boxShadow: currentTheme.shadow.sm }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
                    <HiOutlineLightningBolt className="text-white text-sm" />
                  </div>
                  <div className="text-left">
                    <h3 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Quick Booking
                    </h3>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      Instant consultation
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
          
          {/* Professional Search & Filter Interface */}
          <div
            className={`rounded-2xl transition-all duration-300 backdrop-blur-sm mb-5 overflow-hidden border ${
              isDarkMode 
                ? `bg-gradient-to-br from-slate-800 to-slate-700/90 border-slate-700/50 ${isFilterSticky ? 'sticky z-30 shadow-xl' : ''}` 
                : `bg-gradient-to-br from-white to-gray-50 border-gray-300/50 ${isFilterSticky ? 'sticky z-30 shadow-xl' : ''}`
            }`}
            style={{ 
              top: isFilterSticky ? '80px' : '0',
              boxShadow: isFilterSticky ? currentTheme.shadow.lg : currentTheme.shadow.md
            }}
          >
            {/* Premium Search Header */}
            <div className={`px-5 py-4 border-b ${
              isDarkMode 
                ? 'border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-700/50' 
                : 'border-gray-200 bg-gradient-to-r from-gray-50 to-white'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center`}>
                    <FaSearch className="text-white text-xs" />
                  </div>
                  <div>
                    <h2 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Legal Experts
              </h2>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      {lawyers.length} available professionals
                    </p>
                  </div>
                </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${
                      showFilters
                        ? isDarkMode
                          ? 'bg-slate-600 text-white border-slate-500'
                          : 'bg-gray-800 text-white border-gray-700'
                        : isDarkMode 
                          ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 border-slate-600' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
                    }`}
                >
                    <FaFilter className="text-xs" />
                    <span className="hidden sm:inline">Filters</span>
                </button>
                
                <button
                  type="button"
                  onClick={toggleLocationSearch}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${
                    locationEnabled
                        ? isDarkMode
                          ? 'bg-slate-600 text-white border-slate-500'
                          : 'bg-gray-800 text-white border-gray-700'
                      : isDarkMode 
                        ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 border-slate-600' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
                  }`}
                >
                  {locationSearching ? (
                      <FaSpinner className="text-xs animate-spin" />
                  ) : (
                      locationEnabled ? <MdMyLocation className="text-xs" /> : <MdLocationSearching className="text-xs" />
                  )}
                    <span className="hidden sm:inline">
                      {locationSearching ? 'Finding...' : locationEnabled ? 'Located' : 'Location'}
                    </span>
                </button>
                </div>
              </div>
            </div>

            {/* Professional Search Bar */}
            <div className={`px-5 py-4 border-b ${isDarkMode ? 'border-slate-700/50' : 'border-gray-200'}`}>
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiOutlineSparkles className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} />
                </div>
                <input
                  type="text"
                  placeholder="Search lawyers by name, specialization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-24 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-500' 
                      : 'bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500'
                  }`}
                />
                <button 
                  type="submit" 
                  className={`absolute right-1 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white text-xs font-semibold rounded-md transition-all duration-200 border border-slate-500`}
                >
                  Search
                </button>
              </form>
              
              {locationError && (
                <div className={`mt-2 p-2 rounded-md flex items-center gap-2 text-xs ${
                  isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600'
                }`}>
                  <FaExclamationTriangle className="text-xs" />
                  <span>{locationError}</span>
                </div>
              )}
            </div>

            {/* Professional Category Filter */}
            <div
              className={`transition-all duration-300 overflow-hidden border-t ${isDarkMode ? 'border-slate-700/50' : 'border-gray-200'}`}
              style={{ maxHeight: showFilters ? '500px' : '0px' }}
            >
              <div className={`p-5 ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                <div className="flex items-center mb-4">
                  <FaBalanceScale className={`mr-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`} />
                  <h3 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Legal Specializations
                  </h3>
                </div>
                
                <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 max-h-64 overflow-y-auto transition-all duration-300 opacity-100`}>
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    const isSelected = selectedCategory === category.name;
                    
                    return (
                    <button
                        key={category.name}
                      onClick={() => {
                          setSelectedCategory(category.name);
                          setCurrentPage(1);
                        }}
                        className={`group relative p-3 rounded-lg text-left transition-all duration-200 border ${
                          isSelected
                            ? `text-white shadow-md border-slate-500`
                          : isDarkMode
                              ? 'bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 border-slate-600/30 hover:border-slate-600'
                              : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300/50 hover:border-gray-400'
                        }`}
                        style={{
                          backgroundColor: isSelected ? '#4B5563' : undefined,
                          boxShadow: isSelected ? `0 4px 12px -2px rgba(75, 85, 99, 0.3)` : undefined
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <IconComponent className={`text-sm ${
                            isSelected ? 'text-gray-200' : isDarkMode ? 'text-slate-400' : 'text-gray-600'
                          }`} />
                          {isSelected && (
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 opacity-70"></div>
                          )}
                        </div>
                        <h4 className={`font-semibold text-xs mb-0.5 ${
                          isSelected ? 'text-gray-100' : isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {category.name}
                        </h4>
                        <p className={`text-[10px] leading-tight ${
                          isSelected ? 'text-gray-200/80' : isDarkMode ? 'text-slate-500' : 'text-gray-600'
                        }`}>
                          {category.description.split(' ').slice(0, 2).join(' ')}
                        </p>
                    </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Premium Loading State */}
          {loading && (
            <div className={`rounded-2xl p-12 text-center border ${
              isDarkMode 
                ? 'bg-gradient-to-br from-slate-800 to-slate-700/50 border-slate-700/50' 
                : 'bg-gradient-to-br from-white to-gray-50 border-gray-300/50'
            }`} style={{ boxShadow: currentTheme.shadow.md }}>
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
              <Lottie
                loop
                animationData={lawyerSearchAnimation}
                play
                    style={{ width: 80, height: 80 }}
                  />
                </div>
                
                <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Finding Legal Experts
                </h3>
                <p className={`mb-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  Searching for qualified professionals...
                </p>
                
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${isDarkMode ? 'bg-slate-500' : 'bg-gray-600'}`}></div>
                  <div className={`w-2 h-2 rounded-full animate-pulse delay-100 ${isDarkMode ? 'bg-slate-500' : 'bg-gray-600'}`}></div>
                  <div className={`w-2 h-2 rounded-full animate-pulse delay-200 ${isDarkMode ? 'bg-slate-500' : 'bg-gray-600'}`}></div>
                </div>
              </div>
            </div>
          )}

          {/* Premium Error State */}
          {error && !loading && (
            <div className={`rounded-2xl p-12 mb-8 text-center border ${
              isDarkMode 
                ? 'bg-gradient-to-br from-slate-800 to-slate-700/50 border-slate-700/50' 
                : 'bg-gradient-to-br from-white to-gray-50 border-gray-300/50'
            }`} style={{ boxShadow: currentTheme.shadow.lg }}>
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                    isDarkMode ? 'bg-slate-700/50' : 'bg-gray-200'
                  }`}>
                    <FaExclamationTriangle className={`text-3xl ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`} />
                  </div>
                </div>
                
                <h3 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {error.includes('login') ? 'Authentication Required' : 'Service Temporarily Unavailable'}
                </h3>
                
                <p className={`mb-8 max-w-lg text-base leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-gray-700'}`}>
                  {error.includes('login') 
                    ? 'Please log in to access our comprehensive database of qualified lawyers and book consultations.'
                    : 'We\'re experiencing temporary difficulties loading lawyer profiles. Our team is working to resolve this quickly.'
                  }
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button 
                    onClick={() => fetchLawyers(1, true)}
                    className={`group px-6 py-2.5 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border ${
                      isDarkMode
                        ? 'bg-slate-700 hover:bg-slate-600 text-slate-100 border-slate-600'
                        : 'bg-gray-800 hover:bg-gray-900 text-white border-gray-700'
                    }`}
                  >
                    <FaSync className="text-sm group-hover:rotate-180 transition-transform duration-200" />
                    Try Again
                  </button>
                  
                  {error.includes('login') && (
                    <button 
                      onClick={() => {
                        window.location.href = '/auth';
                      }}
                      className={`px-6 py-2.5 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border ${
                        isDarkMode
                          ? 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white border-slate-600'
                          : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white border-gray-700'
                      }`}
                    >
                      <FaUserCheck className="text-sm" />
                      Login
                    </button>
                  )}
                </div>

                <div className={`mt-8 p-4 rounded-lg border ${
                  isDarkMode ? 'bg-slate-800/30 border-slate-700/50' : 'bg-gray-100 border-gray-300/50'
                }`}>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <FaInfoCircle className={isDarkMode ? 'text-slate-400' : 'text-gray-600'} />
                    <span className={isDarkMode ? 'text-slate-400' : 'text-gray-700'}>
                      Need assistance? Contact our support team
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Premium Empty State */}
          {!loading && !error && lawyers.length === 0 && (
            <div className={`rounded-2xl p-12 mb-8 text-center border ${
              isDarkMode 
                ? 'bg-gradient-to-br from-slate-800 to-slate-700/50 border-slate-700/50' 
                : 'bg-gradient-to-br from-white to-gray-50 border-gray-300/50'
            }`} style={{ boxShadow: currentTheme.shadow.lg }}>
              <div className="flex flex-col items-center justify-center">
                <div className="relative mb-8">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                    isDarkMode ? 'bg-slate-700/50' : 'bg-gray-200'
                  }`} style={{ boxShadow: currentTheme.shadow.md }}>
                    <FaUserTie className={`text-4xl ${isDarkMode ? 'text-slate-500' : 'text-gray-600'}`} />
                  </div>
                </div>
                
                <h3 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  No Lawyers Found
                </h3>
                <p className={`mb-8 max-w-lg text-base leading-relaxed ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-700'
                }`}>
                  We couldn't find any lawyers matching your current search criteria. Try expanding your search or exploring different specializations.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                  <button 
                    onClick={() => {
                      setSelectedCategory('All');
                      setSearchQuery('');
                      setCurrentPage(1);
                      fetchLawyers(1, true);
                    }}
                    className={`px-6 py-2.5 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border ${
                      isDarkMode
                        ? 'bg-slate-700 hover:bg-slate-600 text-slate-100 border-slate-600'
                        : 'bg-gray-800 hover:bg-gray-900 text-white border-gray-700'
                    }`}
                  >
                    <FaSync className="text-sm" />
                    Clear Filters
                  </button>
                  
                  <button 
                    onClick={() => setShowFilters(true)}
                    className={`px-6 py-2.5 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border ${
                      isDarkMode
                        ? 'bg-slate-700/50 hover:bg-slate-600 text-slate-200 border-slate-600/50 hover:border-slate-600'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300'
                    }`}
                  >
                    <FaFilter className="text-sm" />
                    Adjust Filters
                  </button>
                </div>

                <div className={`p-6 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-slate-800/30 border-slate-700/50' 
                    : 'bg-gray-100 border-gray-300/50'
                }`}>
                  <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Search Tips
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-slate-500' : 'bg-gray-600'}`}></div>
                      <span className={isDarkMode ? 'text-slate-400' : 'text-gray-700'}>
                        Try broader search terms
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-slate-500' : 'bg-gray-600'}`}></div>
                      <span className={isDarkMode ? 'text-slate-400' : 'text-gray-700'}>
                        Check different legal areas
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-slate-500' : 'bg-gray-600'}`}></div>
                      <span className={isDarkMode ? 'text-slate-400' : 'text-gray-700'}>
                        Expand location search
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-slate-500' : 'bg-gray-600'}`}></div>
                      <span className={isDarkMode ? 'text-slate-400' : 'text-gray-700'}>
                        Contact support for help
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 justify-center mt-6">
                  <button 
                    onClick={() => {
                      setSelectedCategory('All');
                      setSearchQuery('');
                      setCurrentPage(1);
                      fetchLawyers(1, true);
                    }}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center border ${
                      isDarkMode 
                        ? 'bg-slate-700/50 hover:bg-slate-700 text-slate-200 border-slate-600' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300'
                    }`}
                  >
                    <FaTimes className="mr-2" />
                    Reset
                  </button>
                  
                  {!isAuthenticated && (
                    <button 
                      onClick={() => {
                        window.location.href = '/auth';
                      }}
                      className={`px-4 py-2 rounded-lg transition-colors flex items-center border ${
                        isDarkMode
                          ? 'bg-slate-600 hover:bg-slate-700 text-white border-slate-500'
                          : 'bg-gray-800 hover:bg-gray-900 text-white border-gray-700'
                      }`}
                    >
                      <FaUserCheck className="mr-2" />
                      Login
                    </button>
                  )}
                </div>
                
                {selectedCategory !== 'All' && (
                  <div className={`mt-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-700'}`}>
                    <p>Filtering by: <span className="font-semibold">{selectedCategory}</span></p>
                  </div>
                )}
                
                {searchQuery && (
                  <div className={`mt-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-700'}`}>
                    <p>Search: <span className="font-semibold">"{searchQuery}"</span></p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Professional Lawyers Cards - Premium Silver Style */}
          {!loading && !error && lawyers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
              {lawyers.map((lawyer) => (
                <div
                  key={lawyer.id}
                  className={`rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-100 overflow-hidden ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-[#2C2C2C] to-[#262626] border border-[#3A3A3A]/50' 
                      : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200/60'
                  }`}
                  style={{ boxShadow: currentTheme.shadow.lg }}
                >
                  {/* Premium Top Accent Bar */}
                  <div className="h-1 bg-gradient-to-r from-slate-400 via-gray-300 to-slate-400"></div>

                  <div className="p-5">
                    {/* Header - Profile Picture & Info */}
                    <div className="flex gap-4 mb-4 items-start">
                      {/* Profile Picture - Circular */}
                      <div className="flex-shrink-0">
                        {lawyer.profile_picture_url && lawyer.profile_picture_url.trim() !== '' ? (
                          <img
                            src={lawyer.profile_picture_url}
                            alt={lawyer.full_name}
                            className="w-16 h-16 rounded-full object-cover shadow-md border-3 border-slate-200 dark:border-slate-600"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        
                        <div 
                          className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md border-3 border-slate-200 dark:border-slate-600 ${
                            lawyer.profile_picture_url && lawyer.profile_picture_url.trim() !== '' ? 'hidden' : 'flex'
                          }`}
                          style={{
                            background: `linear-gradient(135deg, ${getProfileGradient(lawyer.full_name).from}, ${getProfileGradient(lawyer.full_name).to})`
                          }}
                        >
                          {getInitials(lawyer.full_name)}
                        </div>
                      </div>

                      {/* Name & Specialization */}
                      <div className="flex-1 min-w-0">
                        <h2 className={`text-base font-bold truncate ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {lawyer.full_name}
                        </h2>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} truncate font-medium`}>
                          {lawyer.specialization}
                        </p>
                        {lawyer.is_verified && (
                          <div className="flex items-center gap-1 mt-1.5 text-xs">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            <span className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}>Verified</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bio/Description */}
                    <p className={`text-xs leading-relaxed mb-4 line-clamp-2 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {lawyer.bio || `Experienced ${lawyer.specialization} lawyer with ${lawyer.years_of_experience} years of practice.`}
                    </p>

                    {/* Stats Section - Professional Silver Style */}
                    <div className="grid grid-cols-3 gap-2 mb-4 py-3 px-2.5 rounded-lg" style={{
                      backgroundColor: isDarkMode ? 'rgba(55, 55, 55, 0.5)' : 'rgba(248, 250, 252, 0.8)'
                    }}>
                      {/* Experience */}
                      <div className="text-center">
                        <div className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Years</div>
                        <div className={`text-base font-bold ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-800'
                        }`}>
                          {lawyer.years_of_experience}
                        </div>
                      </div>

                      {/* Cases */}
                      <div className="text-center">
                        <div className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Cases</div>
                        <div className={`text-base font-bold ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-800'
                        }`}>
                          {lawyer.appointments_count || 0}
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="text-center">
                        <div className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Rating</div>
                        <div className={`text-base font-bold ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-800'
                        }`}>
                          4.5
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - Smooth Professional Styling */}
                    <div className="flex gap-2.5">
                      <button
                        onClick={() => viewLawyerDetails(lawyer)}
                        className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs transition-all duration-300 border ${
                          selectedLawyer?.id === lawyer.id && view === 'detail'
                            ? isDarkMode 
                              ? 'bg-gradient-to-br from-slate-600 to-slate-500 text-slate-50 border-slate-500 shadow-lg' 
                              : 'bg-gradient-to-br from-slate-400 to-slate-300 text-slate-900 border-slate-400 shadow-md'
                            : isDarkMode 
                              ? 'bg-gradient-to-br from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-slate-200 border-slate-600/70 hover:border-slate-500 hover:shadow-md' 
                              : 'bg-gradient-to-br from-slate-200 to-slate-100 hover:from-slate-300 hover:to-slate-200 text-slate-800 border-slate-300/70 hover:border-slate-400 hover:shadow-sm'
                        }`}
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => startBooking(lawyer)}
                        className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs transition-all duration-300 border ${
                          isDarkMode
                            ? 'bg-gradient-to-br from-slate-600 to-slate-500 hover:from-slate-500 hover:to-slate-400 text-slate-100 border-slate-500/70 hover:border-slate-400 hover:shadow-md'
                            : 'bg-gradient-to-br from-slate-300 to-slate-200 hover:from-slate-400 hover:to-slate-300 text-slate-800 border-slate-300/70 hover:border-slate-400 hover:shadow-sm'
                        }`}
                      >
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Infinite Scroll Loading Indicator */}
          {!loading && !error && lawyers.length > 0 && (
            <div 
              ref={loadMoreRef} 
              className="flex justify-center items-center py-6 mb-2"
            >
              {loadingMore ? (
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 border-t-2 border-b-2 border-sky-500 rounded-full animate-spin mb-2"></div>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Loading more lawyers...
                  </p>
                </div>
              ) : hasMore ? (
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Scroll for more lawyers
                </p>
              ) : (
                <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  No more lawyers to load
                </p>
              )}
            </div>
          )}
        </>
      );
    } else if (view === 'detail' && selectedLawyer) {
      return (
        <div className="pt-20 sm:pt-24">
        <div className={`rounded-2xl overflow-hidden mb-8 border transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-slate-800/95 to-slate-900/95 border-slate-700/60 shadow-2xl' 
            : 'bg-gradient-to-br from-white via-slate-50 to-gray-50 border-slate-200/60 shadow-xl'
        }`} style={{ boxShadow: currentTheme.shadow.xl }}>
          <div className="relative h-48 md:h-56">
            {/* Professional Background Image */}
            <div className="w-full h-full overflow-hidden">
              <img 
                src={backgroundImages[selectedLawyer.id] || "https://t4.ftcdn.net/jpg/08/52/61/01/360_F_852610192_mDCPHk42G9qHrROdQYx93eHuk5AMFpQQ.jpg"} 
                alt={`${selectedLawyer.specialization} background`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  console.error('Detail view image failed to load:', backgroundImages[selectedLawyer.id]);
                  e.target.onerror = null;
                  e.target.src = "https://t4.ftcdn.net/jpg/08/52/61/01/360_F_852610192_mDCPHk42G9qHrROdQYx93eHuk5AMFpQQ.jpg";
                }}
              />
            </div>
            
            <button
              onClick={goBack}
              className={`absolute top-4 left-4 p-2 rounded-full shadow-md backdrop-blur-sm transition-all duration-200 z-10 border ${
                isDarkMode 
                  ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 hover:border-slate-500 text-slate-300 hover:text-slate-200' 
                  : 'bg-white/80 hover:bg-white border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800'
              }`}
              aria-label="Go back to lawyers list"
            >
              <FaArrowLeft className="text-sm" />
            </button>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{selectedLawyer.full_name}</h1>
                {selectedLawyer.is_verified && (
                  <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                    isDarkMode
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white'
                      : 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-white'
                  }`}>
                    <FaShieldAlt />
                    Verified
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  {renderStars(selectedLawyer.reviews_count > 0 ? 4.5 : 0)}
                </div>
                <span className="text-white text-sm font-medium">
                  {selectedLawyer.reviews_count > 0 ? `(${selectedLawyer.reviews_count})` : '(New)'}
                </span>
                <span className="text-white/80 text-sm">• {selectedLawyer.appointments_count || 0} appointments</span>
              </div>
              <p className="text-white/95 text-base font-medium">{selectedLawyer.specialization} Specialist</p>
            </div>
          </div>
          
          <div className="p-4 md:p-6">
            {/* Key Stats - Premium Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className={`rounded-lg p-3 text-center border transition-all duration-200 hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-slate-700/50 to-slate-600/30 border-slate-600/40 hover:border-slate-500/60 shadow-md' 
                  : 'bg-gradient-to-br from-gray-100 to-gray-50 border-gray-300/60 hover:border-gray-400 shadow-sm'
              }`}>
                <FaBriefcase className={`text-lg mx-auto mb-1 ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`} />
                <p className={`text-xs font-semibold mb-1 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>Experience</p>
                <p className={`font-bold text-base ${
                  isDarkMode ? 'text-slate-200' : 'text-gray-800'
                }`}>{selectedLawyer.years_of_experience} yrs</p>
              </div>
              <div className={`rounded-lg p-3 text-center border transition-all duration-200 hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-slate-700/50 to-slate-600/30 border-slate-600/40 hover:border-slate-500/60 shadow-md' 
                  : 'bg-gradient-to-br from-gray-100 to-gray-50 border-gray-300/60 hover:border-gray-400 shadow-sm'
              }`}>
                <FaMoneyBillWave className={`text-lg mx-auto mb-1 ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`} />
                <p className={`text-xs font-semibold mb-1 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>Rate</p>
                <p className={`font-bold text-base ${
                  isDarkMode ? 'text-slate-200' : 'text-gray-800'
                }`}>₹{selectedLawyer.consultation_fee}</p>
              </div>
              <div className={`rounded-lg p-3 text-center border transition-all duration-200 hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-slate-700/50 to-slate-600/30 border-slate-600/40 hover:border-slate-500/60 shadow-md' 
                  : 'bg-gradient-to-br from-gray-100 to-gray-50 border-gray-300/60 hover:border-gray-400 shadow-sm'
              }`}>
                <FaBolt className={`text-lg mx-auto mb-1 ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`} />
                <p className={`text-xs font-semibold mb-1 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>License</p>
                <p className={`font-bold text-sm ${
                  isDarkMode ? 'text-slate-200' : 'text-gray-800'
                }`}>{selectedLawyer.license_number}</p>
              </div>
              <div className={`rounded-lg p-3 text-center border transition-all duration-200 hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-slate-700/50 to-slate-600/30 border-slate-600/40 hover:border-slate-500/60 shadow-md' 
                  : 'bg-gradient-to-br from-gray-100 to-gray-50 border-gray-300/60 hover:border-gray-400 shadow-sm'
              }`}>
                <FaRegClock className={`text-lg mx-auto mb-1 ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`} />
                <p className={`text-xs font-semibold mb-1 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>Cases</p>
                <p className={`font-bold text-base ${
                  isDarkMode ? 'text-slate-200' : 'text-gray-800'
                }`}>{selectedLawyer.appointments_count || 0}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className={`rounded-lg p-4 border transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-slate-700/30 border-slate-600/40' 
                  : 'bg-gray-100/50 border-gray-300/40'
              }`}>
                <h3 className={`text-base font-bold mb-2 flex items-center gap-2 ${
                  isDarkMode ? 'text-slate-200' : 'text-gray-800'
                }`}>
                  <FaGraduationCap className={isDarkMode ? 'text-slate-400' : 'text-gray-700'} />
                  About {selectedLawyer.full_name.split(' ')[0]}
                </h3>
                <p className={`leading-relaxed text-sm ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>{selectedLawyer.bio || `${selectedLawyer.full_name} is an experienced ${selectedLawyer.specialization} lawyer with ${selectedLawyer.years_of_experience} years of practice.`}</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`rounded-lg p-4 border transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-slate-700/30 border-slate-600/40' 
                    : 'bg-gray-100/50 border-gray-300/40'
                }`}>
                  <h3 className={`text-base font-bold mb-3 flex items-center gap-2 ${
                    isDarkMode ? 'text-slate-200' : 'text-gray-800'
                  }`}>
                    <FaMapMarkerAlt className={isDarkMode ? 'text-slate-400' : 'text-gray-700'} />
                    Location & Contact
                  </h3>
                  <div className="space-y-2">
                    <div className={`flex items-center gap-2 p-2 rounded-md text-sm ${
                      isDarkMode ? 'bg-slate-600/30' : 'bg-white/40'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        isDarkMode ? 'bg-slate-400' : 'bg-gray-600'
                      }`}></div>
                      <p className={`${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>{selectedLawyer.bar_association}</p>
                    </div>
                    <div className={`flex items-center gap-2 p-2 rounded-md text-sm ${
                      isDarkMode ? 'bg-slate-600/30' : 'bg-white/40'
                    }`}>
                      <FaPhoneAlt className={`text-xs flex-shrink-0 ${isDarkMode ? 'text-slate-400' : 'text-gray-700'}`} />
                      <p className={`${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>{selectedLawyer.phone_number}</p>
                    </div>
                    <div className={`flex items-center gap-2 p-2 rounded-md text-sm ${
                      isDarkMode ? 'bg-slate-600/30' : 'bg-white/40'
                    }`}>
                      <FaEnvelope className={`text-xs flex-shrink-0 ${isDarkMode ? 'text-slate-400' : 'text-gray-700'}`} />
                      <p className={`${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>{selectedLawyer.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className={`rounded-lg p-4 border transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-slate-700/30 border-slate-600/40' 
                    : 'bg-gray-100/50 border-gray-300/40'
                }`}>
                  <h3 className={`text-base font-bold mb-3 flex items-center gap-2 ${
                    isDarkMode ? 'text-slate-200' : 'text-gray-800'
                  }`}>
                    <FaRegClock className={isDarkMode ? 'text-slate-400' : 'text-gray-700'} />
                    Consultation Details
                  </h3>
                  <div className="space-y-2">
                    <div className={`flex items-center gap-2 p-2 rounded-md text-sm ${
                      isDarkMode ? 'bg-slate-600/30' : 'bg-white/40'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        isDarkMode ? 'bg-slate-400' : 'bg-gray-600'
                      }`}></div>
                      <p className={`${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>Fee: <span className="font-semibold">₹{selectedLawyer.consultation_fee}/hr</span></p>
                    </div>
                    <div className={`flex items-center gap-2 p-2 rounded-md text-sm ${
                      isDarkMode ? 'bg-slate-600/30' : 'bg-white/40'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        isDarkMode ? 'bg-slate-400' : 'bg-gray-600'
                      }`}></div>
                      <p className={`${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>Specialization: <span className="font-semibold">{selectedLawyer.specialization}</span></p>
                    </div>
                    <div className={`flex items-center gap-2 p-2 rounded-md text-sm ${
                      isDarkMode ? 'bg-slate-600/30' : 'bg-white/40'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        isDarkMode ? 'bg-slate-400' : 'bg-gray-600'
                      }`}></div>
                      <p className={`${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>License: <span className="font-semibold">{selectedLawyer.license_number}</span></p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Availability Slots */}
              <div className={`rounded-lg p-4 border transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-slate-700/30 border-slate-600/40' 
                  : 'bg-gray-100/50 border-gray-300/40'
              }`}>
                <h3 className={`text-base font-bold mb-3 flex items-center gap-2 ${
                  isDarkMode ? 'text-slate-200' : 'text-gray-800'
                }`}>
                  <FaCalendarAlt className={isDarkMode ? 'text-slate-400' : 'text-gray-700'} />
                  Available Slots
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => (
                    <div 
                      key={index}
                      className={`p-2 rounded-md border text-center transition-all duration-200 hover:scale-105 ${
                        isDarkMode 
                          ? 'bg-gradient-to-br from-slate-600/50 to-slate-600/30 border-slate-500/50 hover:border-slate-400/60 hover:shadow-md text-slate-200' 
                          : 'bg-gradient-to-br from-gray-200/60 to-gray-100/60 border-gray-300/60 hover:border-gray-400 hover:shadow-sm text-gray-800'
                      }`}
                    >
                      <p className="font-semibold text-xs">{day}</p>
                      <p className="text-xs mt-0.5 opacity-75">9AM-5PM</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Book Now Button - Premium Styling */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => startBooking(selectedLawyer)}
                  className={`px-6 py-3 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 font-semibold text-sm border ${
                    isDarkMode
                      ? 'bg-gradient-to-r from-gray-700 to-slate-600 hover:from-gray-600 hover:to-slate-500 text-gray-100 border-slate-600 hover:border-slate-500'
                      : 'bg-gradient-to-r from-gray-400 to-slate-300 hover:from-gray-500 hover:to-slate-400 text-gray-900 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <FaCalendarCheck className="text-base" />
                  Book Now
                </button>
              </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (view === 'booking' && selectedLawyer) {
      return (
        <div className="pt-20 sm:pt-24">
          {/* Booking Header - Uncomment and fix if needed */}
          
          {/* Add CSS animations */}
          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            
            @keyframes slideUp {
              from { 
                opacity: 0;
                transform: translateY(20px);
              }
              to { 
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
          
          {/* Booking Content */}
          <div className="p-6">
            {bookingComplete ? (
              <div className="py-6">
                {/* Premium Confirmation Card */}
                <div className={`max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl border backdrop-blur-sm transform transition-all duration-500 hover:shadow-3xl ${
                  isDarkMode ? 'border-slate-600/60 bg-gradient-to-br from-slate-800/90 to-slate-900/90' : 'border-slate-200 bg-white'
                }`}>
                  {/* Premium Header with Animation */}
                  <div className={`px-8 py-6 flex items-center gap-5 relative overflow-hidden ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-emerald-900/40 via-sky-900/30 to-indigo-900/40 border-b border-slate-700/80' 
                      : 'bg-gradient-to-r from-emerald-50 via-sky-50 to-indigo-50 border-b border-slate-200'
                  }`}>
                    {/* Animated Success Icon */}
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-500 animate-pulse ${
                        isDarkMode ? 'bg-gradient-to-br from-emerald-700 to-emerald-900 text-emerald-300 shadow-emerald-900/30' : 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-emerald-200'
                      }`}
                    >
                      <FaCheckCircle className="text-3xl" />
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 -mr-32 -mt-32 rounded-full bg-gradient-to-br from-sky-500/10 to-indigo-500/5 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 -ml-32 -mb-32 rounded-full bg-gradient-to-tr from-emerald-500/10 to-sky-500/5 blur-3xl"></div>
                    
                    {/* Header Text */}
                    <div className="relative z-10">
                      <h3 className={`text-3xl font-extrabold leading-tight tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        <span className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}>Booking Confirmed</span>
                      </h3>
                      <p className={`mt-1 text-lg ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        Your consultation with <span className={`font-semibold ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}>{selectedLawyer.full_name}</span> is scheduled
                      </p>
                    </div>
                  </div>
                  
                  {/* Main Content - Two Column Layout with Premium Styling */}
                  <div className="flex flex-col md:flex-row">
                    {/* Left Column - Appointment Details */}
                    <div className={`w-full md:w-1/2 p-8 ${isDarkMode ? 'bg-slate-800/90' : 'bg-white'}`}>
                      <h4 className={`text-xl font-bold mb-6 flex items-center ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        <FaCalendarCheck className={`mr-3 ${isDarkMode ? 'text-sky-400' : 'text-sky-500'}`} />
                        Appointment Details
                      </h4>
                      
                      {/* Premium Appointment Card */}
                      <div className={`rounded-xl overflow-hidden shadow-lg border ${
                        isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
                      }`}>
                        {/* Card Header */}
                        <div className={`px-6 py-4 ${
                          isDarkMode ? 'bg-gradient-to-r from-sky-900/50 to-indigo-900/50 border-b border-slate-700' : 'bg-gradient-to-r from-sky-50 to-indigo-50 border-b border-slate-200'
                        }`}>
                          <h5 className={`font-bold flex items-center ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                            <FaRegClock className="mr-2" /> Scheduled Time
                          </h5>
                        </div>
                        
                        {/* Date & Time Details with Premium Styling */}
                        <div className="p-6 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            {/* Date */}
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                              <div className="flex items-center mb-2">
                                <FaCalendarAlt className={`mr-2 ${isDarkMode ? 'text-sky-400' : 'text-sky-500'}`} />
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Date</span>
                              </div>
                              <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                {bookingDate ? new Date(bookingDate).toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  month: 'short', 
                                  day: 'numeric' 
                                }) : 'Date not selected'}
                              </p>
                            </div>
                            
                            {/* Time */}
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                              <div className="flex items-center mb-2">
                                <FaRegClock className={`mr-2 ${isDarkMode ? 'text-sky-400' : 'text-sky-500'}`} />
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Time</span>
                              </div>
                              <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                {bookingTime || 'Time not selected'}
                              </p>
                            </div>
                          </div>
                          
                          {/* Duration & Status */}
                          <div className="grid grid-cols-2 gap-4">
                            {/* Duration */}
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                              <div className="flex items-center mb-2">
                                <FaHourglassHalf className={`mr-2 ${isDarkMode ? 'text-sky-400' : 'text-sky-500'}`} />
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Duration</span>
                              </div>
                              <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                60 minutes
                              </p>
                            </div>
                            
                            {/* Status with Premium Styling */}
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-emerald-900/30' : 'bg-emerald-50'}`}>
                              <div className="flex items-center mb-2">
                                <FaBolt className={`mr-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-500'}`} />
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Status</span>
                              </div>
                              <p className={`text-lg font-semibold flex items-center ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                <FaCheckCircle className="mr-2" /> Confirmed
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Email Confirmation Notice with Premium Styling */}
                      <div className={`mt-6 p-4 rounded-xl border ${
                        isDarkMode ? 'bg-slate-700/30 border-slate-700' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div className="flex items-start">
                          <FaEnvelopeOpenText className={`mt-1 mr-3 text-lg ${isDarkMode ? 'text-sky-400' : 'text-sky-500'}`} />
                          <div>
                            <h5 className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Confirmation Email</h5>
                            <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                              A confirmation email with all details has been sent to <span className="font-medium">{bookingFormData.email}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Premium Video Meeting Button */}
                      <a 
                        href="https://meet.google.com/cbx-twdp-qhm" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open("https://meet.google.com/cbx-twdp-qhm", "_blank");
                          showSuccess("Video meeting link opened. You can now join the consultation.");
                        }}
                        className={`mt-6 block p-4 rounded-xl text-center font-medium shadow-lg ${
                          isDarkMode 
                            ? 'bg-gradient-to-r from-sky-600 to-sky-800 text-white hover:from-sky-500 hover:to-sky-700 shadow-sky-900/30' 
                            : 'bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:from-sky-400 hover:to-sky-500 shadow-sky-500/20'
                        } transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl`}
                      >
                        <div className="flex items-center justify-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                            isDarkMode ? 'bg-sky-500/30 text-white' : 'bg-white/20 text-white'
                          }`}>
                            <FaVideo className="text-xl" />
                          </div>
                          <span className="text-lg">Join Video Meeting</span>
                        </div>
                      </a>
                    </div>
                    
                    {/* Right Column - Lawyer Details with Premium Styling */}
                    <div className={`w-full md:w-1/2 p-8 ${
                      isDarkMode ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90' : 'bg-gradient-to-br from-slate-50 to-white'
                    }`}>
                      <h4 className={`text-xl font-bold mb-6 flex items-center ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        <FaUserTie className={`mr-3 ${isDarkMode ? 'text-sky-400' : 'text-sky-500'}`} />
                        Lawyer Information
                      </h4>
                      
                      {/* Premium Lawyer Card */}
                      <div className={`rounded-xl overflow-hidden shadow-lg border mb-6 ${
                        isDarkMode ? 'border-slate-700 bg-slate-800/80' : 'border-slate-200 bg-white'
                      }`}>
                        {/* Lawyer Header with Photo */}
                        <div className={`p-6 flex items-center ${
                          isDarkMode ? 'border-b border-slate-700' : 'border-b border-slate-200'
                        }`}>
                          <div className="mr-4 relative">
                            {selectedLawyer.profile_picture_url && selectedLawyer.profile_picture_url.trim() !== '' ? (
                              <img 
                                src={selectedLawyer.profile_picture_url} 
                                alt={selectedLawyer.full_name}
                                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-xl"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            
                            <div 
                              className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-xl border-4 ${
                                selectedLawyer.profile_picture_url && selectedLawyer.profile_picture_url.trim() !== '' ? 'hidden' : 'flex'
                              }`}
                              style={{
                                background: `linear-gradient(135deg, ${getProfileGradient(selectedLawyer.full_name).from}, ${getProfileGradient(selectedLawyer.full_name).to})`,
                                borderColor: isDarkMode ? '#1e293b' : '#ffffff'
                              }}
                            >
                              {getInitials(selectedLawyer.full_name)}
                            </div>
                          </div>
                          <div>
                            <h5 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                              {selectedLawyer.full_name}
                            </h5>
                            <p className={`${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}>
                              {selectedLawyer.specialization} Lawyer
                            </p>
                          </div>
                        </div>
                        
                        {/* Lawyer Details with Premium Styling */}
                        <div className="p-6 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FaBriefcase className={`mr-2 ${isDarkMode ? 'text-sky-400' : 'text-sky-500'}`} />
                              <span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Experience</span>
                            </div>
                            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                              {selectedLawyer.years_of_experience} years
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FaGraduationCap className={`mr-2 ${isDarkMode ? 'text-sky-400' : 'text-sky-500'}`} />
                              <span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Bar Association</span>
                            </div>
                            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                              {selectedLawyer.bar_association}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FaMoneyBillWave className={`mr-2 ${isDarkMode ? 'text-sky-400' : 'text-sky-500'}`} />
                              <span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Consultation Fee</span>
                            </div>
                            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                              ₹{selectedLawyer.consultation_fee}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FaPhoneAlt className={`mr-2 ${isDarkMode ? 'text-sky-400' : 'text-sky-500'}`} />
                              <span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Contact</span>
                            </div>
                            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                              {selectedLawyer.phone_number}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Premium Action Buttons */}
                      <div className="space-y-4">
                        {/* Premium Calendar Button */}
                        <button
                          type="button"
                          onClick={() => {
                            // Create calendar event
                            const startDate = new Date(bookingDate);
                            const [hours, minutes] = bookingTime.replace(/\s+/g, ' ').trim().split(' ')[0].split(':');
                            startDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
                            
                            const endDate = new Date(startDate);
                            endDate.setHours(endDate.getHours() + 1);
                            
                            const eventTitle = `Legal Consultation with ${selectedLawyer.full_name}`;
                            const eventDetails = `Video meeting link: https://meet.google.com/cbx-twdp-qhm`;
                            
                            // Format dates for Google Calendar
                            const formatDate = (date) => {
                              return date.toISOString().replace(/-|:|\.\d+/g, '');
                            };
                            
                            const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&details=${encodeURIComponent(eventDetails)}&dates=${formatDate(startDate)}/${formatDate(endDate)}`;
                            
                            window.open(googleCalendarUrl, '_blank');
                            showSuccess("Event added to your calendar");
                          }}
                          className={`block w-full p-4 rounded-xl text-center font-medium shadow-lg ${
                            isDarkMode 
                              ? 'bg-gradient-to-r from-emerald-700 to-emerald-900 text-white hover:from-emerald-600 hover:to-emerald-800 shadow-emerald-900/30' 
                              : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 shadow-emerald-500/20'
                          } transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl`}
                        >
                          <div className="flex items-center justify-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                              isDarkMode ? 'bg-emerald-500/30 text-white' : 'bg-white/20 text-white'
                            }`}>
                              <FaCalendarAlt className="text-xl" />
                            </div>
                            <span className="text-lg">Add to Calendar</span>
                          </div>
                        </button>
                        
                        {/* Back to Lawyers Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setView('lawyers');
                            setBookingComplete(false);
                            setBookingStep(1);
                          }}
                          className={`block w-full p-4 rounded-xl text-center font-medium ${
                            isDarkMode 
                              ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600' 
                              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-md'
                          } transition-all duration-300`}
                        >
                          <div className="flex items-center justify-center">
                            <FaArrowLeft className="mr-2" />
                            <span>Back to Lawyers</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : bookingStep === 1 ? (
              <form onSubmit={handleBookingSubmit} className="space-y-8 mt-6">
                {/* Booking Steps Indicator */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`flex items-center ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                        isDarkMode ? 'bg-sky-600 text-white' : 'bg-sky-500 text-white'
                      }`}>
                        <FaCalendarAlt />
                      </div>
                      <span className="font-medium">Schedule</span>
                    </div>
                    <div className={`flex-1 mx-2 h-1 rounded ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                      <div className={`h-full w-1/2 rounded ${isDarkMode ? 'bg-sky-600' : 'bg-sky-500'}`}></div>
                    </div>
                    <div className={`flex items-center ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                        isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'
                      }`}>
                        <FaUserCheck />
                      </div>
                      <span className="font-medium">Details</span>
                    </div>
                  </div>
                </div>
                
                {/* Date Selection */}
                <div>
                  <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    <FaCalendarAlt className="inline-block mr-2 text-sky-500" />
                    Select Date
                  </h3>
                  <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
                    {nextSevenDays.map((day) => (
                      <button
                        key={day.fullDate}
                        type="button"
                        onClick={() => setBookingDate(day.fullDate)}
                        className={`p-4 rounded-xl border transition-all duration-200 ${
                          bookingDate === day.fullDate
                            ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white border-transparent shadow-lg transform scale-105'
                            : isDarkMode
                              ? 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <p className="text-center font-medium">{day.dayName}</p>
                        <p className="text-center text-2xl font-bold my-1">{day.dayNumber}</p>
                        <p className="text-center text-sm">{day.month}</p>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Time Selection */}
                <div>
                  <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    <FaRegClock className="inline-block mr-2 text-sky-500" />
                    Select Time
                  </h3>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setBookingTime(time)}
                        className={`py-3 px-4 rounded-xl border transition-all duration-200 ${
                          bookingTime === time
                            ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white border-transparent shadow-lg transform scale-105'
                            : isDarkMode
                              ? 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <p className="text-center font-medium">{time}</p>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Continue Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!bookingDate || !bookingTime}
                    className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 ${
                      !bookingDate || !bookingTime
                        ? 'bg-slate-400 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-lg'
                    } transition-all duration-200`}
                  >
                    Continue
                    <FaLongArrowAltRight />
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-6 mt-6">
                {/* Professional Back Button */}
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={() => setBookingStep(1)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                      isDarkMode 
                        ? 'bg-slate-700/80 text-slate-300 hover:bg-slate-600/80 hover:text-white border border-slate-600/50' 
                        : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800 border border-slate-200 shadow-sm'
                    } hover:shadow-md hover:scale-[1.02]`}
                  >
                    <FaArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Schedule</span>
                  </button>
                </div>
                
                {/* Booking Steps Indicator */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`flex items-center ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                        isDarkMode ? 'bg-sky-600 text-white' : 'bg-sky-500 text-white'
                      }`}>
                        <FaCheckCircle />
                      </div>
                      <span className="font-medium">Schedule</span>
                    </div>
                    <div className={`flex-1 mx-2 h-1 rounded ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                      <div className={`h-full w-full rounded ${isDarkMode ? 'bg-sky-600' : 'bg-sky-500'}`}></div>
                    </div>
                    <div className={`flex items-center ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                        isDarkMode ? 'bg-sky-600 text-white' : 'bg-sky-500 text-white'
                      }`}>
                        <FaUserCheck />
                      </div>
                      <span className="font-medium">Details</span>
                    </div>
                  </div>
                </div>
                
                {/* Selected Date & Time Summary */}
                <div className={`p-4 rounded-xl ${
                  isDarkMode ? 'bg-slate-700' : 'bg-slate-100'
                } mb-6`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Selected Date & Time
                      </p>
                      <p className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        {bookingDate ? new Date(bookingDate).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'short', 
                          day: 'numeric' 
                        }) : 'Date not selected'} at {bookingTime || 'Time not selected'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBookingStep(1)}
                      className={`text-sm ${isDarkMode ? 'text-sky-400' : 'text-sky-600'} hover:underline`}
                    >
                      Change
                    </button>
                  </div>
                </div>
                
                {/* Personal Details Form */}
                <div className="space-y-5">
                  <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    <FaUserTie className="inline-block mr-2 text-sky-500" />
                    Your Information
                  </h3>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Full Name
                    </label>
                    <div className={`relative rounded-xl overflow-hidden border ${
                      isDarkMode ? 'border-slate-600' : 'border-slate-300'
                    }`}>
                      <div className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        <FaUserTie />
                      </div>
                      <input
                        type="text"
                        value={bookingFormData.name}
                        onChange={(e) => setBookingFormData({...bookingFormData, name: e.target.value})}
                        required
                        className={`w-full pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 ${
                          isDarkMode 
                            ? 'bg-slate-700 text-slate-200' 
                            : 'bg-white text-slate-800'
                        } border-0`}
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Email Address
                    </label>
                    <div className={`relative rounded-xl overflow-hidden border ${
                      isDarkMode ? 'border-slate-600' : 'border-slate-300'
                    }`}>
                      <div className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        <FaEnvelope />
                      </div>
                      <input
                        type="email"
                        value={bookingFormData.email}
                        onChange={(e) => setBookingFormData({...bookingFormData, email: e.target.value})}
                        required
                        className={`w-full pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 ${
                          isDarkMode 
                            ? 'bg-slate-700 text-slate-200' 
                            : 'bg-white text-slate-800'
                        } border-0`}
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Phone Number
                    </label>
                    <div className={`relative rounded-xl overflow-hidden border ${
                      isDarkMode ? 'border-slate-600' : 'border-slate-300'
                    }`}>
                      <div className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        <FaPhoneAlt />
                      </div>
                      <input
                        type="tel"
                        value={bookingFormData.phone}
                        onChange={(e) => setBookingFormData({...bookingFormData, phone: e.target.value})}
                        required
                        className={`w-full pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 ${
                          isDarkMode 
                            ? 'bg-slate-700 text-slate-200' 
                            : 'bg-white text-slate-800'
                        } border-0`}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Case Details
                    </label>
                    <div className={`relative rounded-xl overflow-hidden border ${
                      isDarkMode ? 'border-slate-600' : 'border-slate-300'
                    }`}>
                      <div className={`absolute top-3 left-0 flex items-start pl-3 ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        <FaEnvelopeOpenText />
                      </div>
                      <textarea
                        value={bookingFormData.caseDetails}
                        onChange={(e) => setBookingFormData({...bookingFormData, caseDetails: e.target.value})}
                        required
                        rows={4}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 ${
                          isDarkMode 
                            ? 'bg-slate-700 text-slate-200' 
                            : 'bg-white text-slate-800'
                        } border-0`}
                        placeholder="Briefly describe your case or legal issue"
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                {/* Confirm Booking Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-xl shadow-lg transition-all duration-200 font-medium flex items-center gap-2 ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <>
                        <FaHourglassHalf className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Confirm Booking
                        <FaCalendarCheck />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-[#0A0A0A]' 
        : 'bg-white'
    }`}>
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-0" ref={contentRef}>
        {/* Optimized Content Container */}
        <div className="w-full max-w-6xl mx-auto">
          {renderView()}
        </div>
        </div>
        
      {/* Subtle Background Elements - Professional Hero Style */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-32 -right-32 w-64 h-64 rounded-full opacity-[0.08] ${
          isDarkMode ? 'bg-blue-400' : 'bg-blue-100'
        } blur-3xl`}></div>
        <div className={`absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-[0.06] ${
          isDarkMode ? 'bg-blue-500' : 'bg-blue-50'
        } blur-3xl`}></div>
      </div>
    </div>
  );
};

export default LegalCosultation;