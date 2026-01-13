import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { lawyerAPI, apiServices } from '../api/apiService';
import {
  User, Mail, Phone, MapPin, Calendar, Briefcase, Globe, Camera, X,
  Award, Settings, Lock, Bell, Share2, Download,
  AlertCircle, Loader, FileText, MessageSquare,
  Building, Pencil, Check, Eye, EyeOff,
  Trash2, RefreshCw, Github, Twitter, Linkedin, Facebook,
  Laptop, Video, Clock, Star, ArrowRight, ChevronRight,
  Sparkles, Shield, Lock as LockIcon, Zap, Search, Filter,
  ChevronLeft, Layout, CheckCircle, Info, HelpCircle, Scale, Heart
} from 'lucide-react';
import useToast from '../hooks/useToast';

// Premium Professional Color Palette matching Hero and Sidebar - Production App
const colors = {
  light: {
    background: '#FFFFFF',
    surface: '#F8FAFC',
    surfaceElevated: '#FFFFFF',
    text: {
      primary: '#0F172A',
      secondary: '#475569',
      muted: '#94A3B8',
      inverse: '#FFFFFF'
    },
    accent: {
      primary: '#3B82F6',
      secondary: '#2563EB',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    },
    border: '#E2E8F0',
    shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
  },
  dark: {
    background: '#0A0A0A',
    surface: '#1A1A1A',
    surfaceElevated: '#2C2C2C',
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
      muted: '#64748B',
      inverse: '#0A0A0A'
    },
    accent: {
      primary: '#3B82F6',
      secondary: '#2563EB',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    },
    border: '#2A2A2A',
    shadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)'
  }
};

// Professional Categories with Icons for Filtering
const categories = [
  {
    name: 'All',
    icon: Scale,
    color: '#3B82F6',
    description: 'All legal specializations'
  },
  {
    name: 'Criminal',
    icon: Shield,
    color: '#DC2626',
    description: 'Criminal defense & prosecution'
  },
  {
    name: 'Family',
    icon: Heart,
    color: '#EC4899',
    description: 'Divorce, custody & family matters'
  },
  {
    name: 'Corporate',
    icon: Briefcase,
    color: '#059669',
    description: 'Business law & corporate affairs'
  },
  {
    name: 'Immigration',
    icon: MapPin,
    color: '#7C3AED',
    description: 'Visa, citizenship & immigration'
  },
  {
    name: 'Civil',
    icon: Award,
    color: '#0891B2',
    description: 'Civil disputes & litigation'
  },
  {
    name: 'Labor Law',
    icon: User,
    color: '#EA580C',
    description: 'Employment & labor disputes'
  },
  {
    name: 'Tax Law',
    icon: Layout,
    color: '#16A34A',
    description: 'Tax planning & disputes'
  },
  {
    name: 'Intellectual Property',
    icon: Sparkles,
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

  /**
   * Returns a professional background image URL for a lawyer
   */
  const getLawyerBackgroundImage = (lawyer) => {
    const images = [
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1423592707957-3b212afa6733?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1473186578172-c141e6798ee4?q=80&w=2070&auto=format&fit=crop'
    ];
    const index = (lawyer.id || 0) % images.length;
    return images[index];
  };

  /**
   * Preloads background images for a list of lawyers
   */
  const preloadLawyerBackgroundImages = (lawyersList) => {
    const images = {};
    lawyersList.forEach(lawyer => {
      images[lawyer.id] = getLawyerBackgroundImage(lawyer);
    });
    return images;
  };

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
    if (!rating) return Array(5).fill(<Star size={12} className="text-slate-300" />);

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={12} className="text-amber-400 fill-amber-400" />);
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star size={12} className="text-slate-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star size={12} className="text-amber-400 fill-amber-400" />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={12} className="text-slate-300" />);
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
          <div className="pt-20 sm:pt-24 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  label: 'Nearby Experts',
                  desc: 'Available in your area',
                  icon: MapPin,
                  onClick: fetchNearbyLawyers,
                  loading: nearbyLoading,
                  color: 'text-blue-500'
                },
                {
                  label: 'Top Rated',
                  desc: 'Highest client reviews',
                  icon: Award,
                  onClick: fetchTopRatedLawyers,
                  loading: topRatedLoading,
                  color: 'text-amber-500'
                },
                {
                  label: 'Quick Call',
                  desc: 'Instant consultation',
                  icon: Zap,
                  onClick: bookWithRodgerProsacco,
                  color: 'text-violet-500'
                }
              ].map((card, i) => (
                <button
                  key={i}
                  onClick={card.onClick}
                  disabled={card.loading}
                  className={`group relative overflow-hidden rounded-xl p-3 transition-all duration-300 hover:scale-[1.02] border backdrop-blur-md ${isDarkMode
                    ? 'bg-white/5 border-[#2A2A2A] hover:bg-white/10'
                    : 'bg-white border-gray-100 hover:shadow-lg'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                      {card.loading ? <Loader size={14} className="animate-spin text-blue-500" /> : <card.icon size={14} className={card.color} />}
                    </div>
                    <div className="text-left">
                      <h3 className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{card.label}</h3>
                      <p className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>{card.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Professional Search & Filter Interface */}
          <div
            className={`rounded-2xl transition-all duration-300 backdrop-blur-xl mb-5 overflow-hidden border ${isDarkMode
              ? `bg-[#1A1A1A]/80 border-[#2A2A2A] ${isFilterSticky ? 'sticky z-30 shadow-2xl' : ''}`
              : `bg-white/90 border-gray-200 ${isFilterSticky ? 'sticky z-30 shadow-xl' : ''}`
              }`}
            style={{
              top: isFilterSticky ? '80px' : '0'
            }}
          >
            {/* Premium Search Header */}
            <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-[#2A2A2A]/50 bg-white/5' : 'border-gray-50/30'
              }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg bg-blue-500/10 text-blue-500`}>
                    <Search size={14} />
                  </div>
                  <div>
                    <h2 className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Legal Experts</h2>
                    <p className={`text-[9px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {lawyers.length} Verified Professionals
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 border ${showFilters
                      ? 'bg-blue-600 text-white border-blue-500'
                      : isDarkMode
                        ? 'bg-white/5 hover:bg-white/10 text-gray-400 border-[#2A2A2A]'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'
                      }`}
                  >
                    <Filter size={10} />
                    <span>Filter Experts</span>
                  </button>

                  <button
                    type="button"
                    onClick={toggleLocationSearch}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 border ${locationEnabled
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : isDarkMode
                        ? 'bg-white/5 hover:bg-white/10 text-gray-400 border-[#2A2A2A]'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'
                      }`}
                  >
                    {locationSearching ? (
                      <Loader size={10} className="animate-spin" />
                    ) : (
                      <MapPin size={10} />
                    )}
                    <span>{locationSearching ? 'Locating...' : locationEnabled ? 'Located' : 'Near Me'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Professional Search Bar */}
            <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-[#2A2A2A]/50' : 'border-gray-100'}`}>
              <form onSubmit={handleSearch} className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 size={14} ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder="Search by legal issue, lawyer name, or specialization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-24 py-2 text-xs rounded-xl border focus:outline-none transition-all duration-200 ${isDarkMode
                    ? 'bg-[#0D0D0D] border-[#2A2A2A] text-white placeholder-gray-600 focus:border-blue-500/50'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500/20'
                    }`}
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all"
                >
                  Find Expert
                </button>
              </form>

              {locationError && (
                <div className={`mt-2 p-2 rounded-lg flex items-center gap-2 text-[10px] font-medium ${isDarkMode ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'
                  }`}>
                  <AlertCircle size={10} />
                  <span>{locationError}</span>
                </div>
              )}
            </div>

            {/* Professional Category Filter */}
            <div
              className={`transition-all duration-300 overflow-hidden border-t ${isDarkMode ? 'border-[#2A2A2A]/50' : 'border-gray-100'}`}
              style={{ maxHeight: showFilters ? '500px' : '0px' }}
            >
              <div className={`p-4 ${isDarkMode ? 'bg-white/[0.02]' : 'bg-gray-50/50'}`}>
                <div className="flex items-center mb-3">
                  <Layout size={12} className={`mr-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <h3 className={`font-bold text-[10px] uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Filter by Specialization
                  </h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
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
                        className={`group p-2 rounded-xl text-left transition-all duration-200 border ${isSelected
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20'
                          : isDarkMode
                            ? 'bg-white/5 hover:bg-white/10 text-gray-400 border-[#2A2A2A]'
                            : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-200'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <IconComponent size={12} className={isSelected ? 'text-white' : 'text-blue-500'} />
                          <span className="font-bold text-[10px] tracking-tight truncate">{category.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Premium Loading State */}
          {loading && (
            <div className={`rounded-2xl p-12 text-center border backdrop-blur-md ${isDarkMode ? 'bg-white/5 border-[#2A2A2A]' : 'bg-white border-gray-100 shadow-xl'
              }`}>
              <div className="flex flex-col items-center">
                <Loader size={32} className="animate-spin text-blue-500 mb-4" />
                <h3 className={`text-sm font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Finding Best Legal Minds</h3>
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Scanning verified professional database...</p>
              </div>
            </div>
          )}

          {/* Premium Error State */}
          {error && !loading && (
            <div className={`rounded-2xl p-10 mb-8 text-center border backdrop-blur-md ${isDarkMode ? 'bg-white/5 border-[#2A2A2A]' : 'bg-white border-gray-100 shadow-xl'
              }`}>
              <div className="flex flex-col items-center">
                <div className="p-3 bg-red-500/10 rounded-full mb-4">
                  <AlertCircle size={32} className="text-red-500" />
                </div>
                <h3 className={`text-sm font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {error.includes('login') ? 'Authentication Required' : 'Service Interrupted'}
                </h3>
                <p className={`text-xs max-w-xs mb-6 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  {error.includes('login')
                    ? 'Accessing our legal network requires an active membership. Join now to find your perfect legal counsel.'
                    : 'We are currently optimizing our expert database. Please try again shortly.'}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchLawyers(1, true)}
                    className="px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-blue-600 text-white hover:bg-blue-700 transition-all"
                  >
                    Try Refreshing
                  </button>
                  {error.includes('login') && (
                    <button
                      onClick={() => window.location.href = '/auth'}
                      className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border ${isDarkMode ? 'bg-white/5 border-[#2A2A2A] text-white' : 'bg-gray-800 text-white'
                        }`}
                    >
                      Login
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Premium Empty State */}
          {!loading && !error && lawyers.length === 0 && (
            <div className={`rounded-2xl p-12 mb-8 text-center border backdrop-blur-md ${isDarkMode ? 'bg-white/5 border-[#2A2A2A]' : 'bg-white border-gray-100 shadow-xl'
              }`}>
              <div className="flex flex-col items-center">
                <div className="p-3 bg-blue-500/10 rounded-full mb-4">
                  <Search size={32} className="text-blue-500" />
                </div>
                <h3 className={`text-sm font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Expert Match Not Found</h3>
                <p className={`text-xs max-w-xs mb-6 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  No professionals currently match your specific criteria. Try adjusting your filters or location search.
                </p>

                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSearchQuery('');
                      setCurrentPage(1);
                      fetchLawyers(1, true);
                    }}
                    className="px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white hover:bg-blue-700 transition-all"
                  >
                    Clear All Filters
                  </button>
                  <button
                    onClick={() => setShowFilters(true)}
                    className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${isDarkMode ? 'bg-white/5 border-[#2A2A2A] text-gray-300' : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                  >
                    Adjust Filters
                  </button>
                </div>

                {selectedCategory !== 'All' && (
                  <div className={`mt-4 text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Active Category: <span className="text-blue-500">{selectedCategory}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Premium Lawyers Cards */}
          {
            !loading && !error && lawyers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {lawyers.map((lawyer) => (
                  <div
                    key={lawyer.id}
                    className={`group rounded-2xl transition-all duration-300 hover:shadow-2xl overflow-hidden border backdrop-blur-md ${isDarkMode
                      ? 'bg-white/5 border-[#2A2A2A] hover:bg-white/10'
                      : 'bg-white border-gray-100 hover:shadow-lg'
                      }`}
                  >
                    <div className="p-4">
                      {/* Header - Profile Picture & Info */}
                      <div className="flex gap-3 mb-3 items-start">
                        {/* Profile Picture */}
                        <div className="flex-shrink-0 relative">
                          {lawyer.profile_picture_url && lawyer.profile_picture_url.trim() !== '' ? (
                            <img
                              src={lawyer.profile_picture_url}
                              alt={lawyer.full_name}
                              className="w-12 h-12 rounded-xl object-cover border border-[#2A2A2A]/50"
                            />
                          ) : (
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                              style={{
                                background: `linear-gradient(135deg, ${getProfileGradient(lawyer.full_name).from}, ${getProfileGradient(lawyer.full_name).to})`
                              }}
                            >
                              {getInitials(lawyer.full_name)}
                            </div>
                          )}
                          {lawyer.is_verified && (
                            <div className={`absolute -bottom-1 -right-1 bg-blue-600 text-white p-0.5 rounded-full border-2 ${isDarkMode ? 'border-[#1A1A1A]' : 'border-white'}`}>
                              <Check size={8} strokeWidth={4} />
                            </div>
                          )}
                        </div>

                        {/* Name & Specialization */}
                        <div className="flex-1 min-w-0">
                          <h2 className={`text-xs font-bold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {lawyer.full_name}
                          </h2>
                          <p className={`text-[10px] ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} font-bold uppercase tracking-wider`}>
                            {lawyer.specialization}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Star size={10} className="text-amber-500 fill-amber-500" />
                            <span className={`text-[10px] font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>4.9</span>
                            <span className="text-[9px] text-gray-500">(120+)</span>
                          </div>
                        </div>
                      </div>

                      {/* Bio/Description */}
                      <p className={`text-[10px] leading-relaxed mb-3 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {lawyer.bio || `Specialized in ${lawyer.specialization} with ${lawyer.years_of_experience} years of professional practice.`}
                      </p>

                      {/* Compact Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-4 py-2 px-1 rounded-xl" style={{
                        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'
                      }}>
                        {[
                          { label: 'Exp', value: `${lawyer.years_of_experience}Y`, icon: Briefcase },
                          { label: 'Cases', value: lawyer.appointments_count || '0', icon: Shield },
                          { label: 'Fee', value: `₹${lawyer.consultation_fee}`, icon: Award }
                        ].map((stat, i) => (
                          <div key={i} className="text-center">
                            <div className={`text-[8px] font-bold uppercase tracking-tighter ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{stat.label}</div>
                            <div className={`text-xs font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{stat.value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => viewLawyerDetails(lawyer)}
                          className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${isDarkMode
                            ? 'bg-white/5 hover:bg-white/10 text-gray-300 border-[#2A2A2A]'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'
                            }`}
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => startBooking(lawyer)}
                          className="flex-[2] py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-lg shadow-blue-600/20"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          }

          {/* Infinite Scroll Loading Indicator */}
          {
            !loading && !error && lawyers.length > 0 && (
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
            )
          }
        </>
      );
    } else if (view === 'detail' && selectedLawyer) {
      return (
        <div className="pt-20 sm:pt-24 max-w-4xl mx-auto px-4">
          <div className={`rounded-2xl overflow-hidden mb-6 border backdrop-blur-md transition-all duration-300 ${isDarkMode ? 'bg-[#1A1A1A]/80 border-[#2A2A2A]' : 'bg-white border-gray-100 shadow-xl'
            }`}>
            {/* Header Banner */}
            <div className="relative h-32 md:h-40 overflow-hidden">
              <img
                src={backgroundImages[selectedLawyer.id] || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1000"}
                alt="header"
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${isDarkMode ? 'from-[#0A0A0A] via-[#0A0A0A]/40' : 'from-black/40 via-transparent'} to-transparent`} />

              <button
                onClick={goBack}
                className="absolute top-3 left-3 p-1.5 rounded-lg bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-all border border-white/10"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={selectedLawyer.profile_picture_url || "https://t4.ftcdn.net/jpg/03/46/93/61/360_F_346936114_RaxE6OQogOtOt9Wgc91G1oST5p5huzJS.jpg"}
                      alt={selectedLawyer.full_name}
                      className={`w-16 h-16 rounded-xl border-2 object-cover ${isDarkMode ? 'border-[#1A1A1A]' : 'border-white'}`}
                    />
                    {selectedLawyer.is_verified && (
                      <div className={`absolute -bottom-1 -right-1 bg-blue-600 text-white p-0.5 rounded-full border-2 ${isDarkMode ? 'border-[#1A1A1A]' : 'border-white'}`}>
                        <Check size={8} strokeWidth={4} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h1 className="text-sm font-bold text-white">{selectedLawyer.full_name}</h1>
                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">{selectedLawyer.specialization}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-1">
                        <Star size={10} className="text-amber-500 fill-amber-500" />
                        <span className="text-[10px] font-bold text-white">4.9</span>
                      </div>
                      <span className="text-[9px] text-gray-400">• {selectedLawyer.appointments_count || 0} Consultations</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => startBooking(selectedLawyer)}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all"
                >
                  Book Consult
                </button>
              </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Left Side: About & Stats */}
              <div className="md:col-span-2 space-y-4">
                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/[0.02] border-[#2A2A2A]' : 'bg-gray-50 border-gray-100'}`}>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-2">
                    <Info size={12} />
                    Professional Profile
                  </h3>
                  <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedLawyer.bio || `${selectedLawyer.full_name} is a distinguished legal expert with over ${selectedLawyer.years_of_experience} years of experience in ${selectedLawyer.specialization}.`}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Experience', value: `${selectedLawyer.years_of_experience}Y`, icon: Briefcase },
                    { label: 'Consultation', value: `₹${selectedLawyer.consultation_fee}`, icon: Award },
                    { label: 'License', value: selectedLawyer.license_number, icon: Shield }
                  ].map((stat, i) => (
                    <div key={i} className={`p-3 rounded-xl border text-center ${isDarkMode ? 'bg-white/[0.02] border-[#2A2A2A]' : 'bg-gray-50 border-gray-100'}`}>
                      <stat.icon size={12} className="mx-auto mb-1 text-blue-500" />
                      <div className="text-[8px] font-bold text-gray-500 uppercase">{stat.label}</div>
                      <div className={`text-[11px] font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: Quick Info */}
              <div className="space-y-4">
                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/[0.02] border-[#2A2A2A]' : 'bg-gray-50 border-gray-100'}`}>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                    <MapPin size={12} />
                    Location & Office
                  </h3>
                  <div className="space-y-2">
                    {[
                      { icon: Building, text: selectedLawyer.bar_association },
                      { icon: Phone, text: selectedLawyer.phone_number },
                      { icon: Mail, text: selectedLawyer.email }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <item.icon size={10} className="text-gray-600" />
                        <span className={`text-[10px] truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/[0.02] border-[#2A2A2A]' : 'bg-gray-50 border-gray-100'}`}>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                    <Clock size={12} />
                    Availability
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                      <div key={day} className={`px-2 py-1 rounded bg-blue-500/10 text-blue-500 text-[9px] font-bold`}>{day}</div>
                    ))}
                  </div>
                  <p className="text-[9px] text-gray-500 mt-2">Standard hours: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (view === 'booking' && selectedLawyer) {
      return (
        <div className="pt-20 sm:pt-24 max-w-3xl mx-auto px-4">
          <div className={`rounded-2xl overflow-hidden border backdrop-blur-md transition-all duration-300 ${isDarkMode ? 'bg-[#1A1A1A]/80 border-[#2A2A2A]' : 'bg-white border-gray-100 shadow-xl'
            }`}>
            {bookingComplete ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-600/10 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h2 className={`text-sm font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Appointment Confirmed!</h2>
                <p className={`text-[11px] mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your session with <span className="text-blue-500 font-bold">{selectedLawyer.full_name}</span> has been successfully scheduled.
                </p>
                <div className={`p-4 rounded-xl border text-left mb-6 ${isDarkMode ? 'bg-white/[0.02] border-[#2A2A2A]' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar size={14} className="text-blue-500" />
                    <span className={`text-[11px] font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{new Date(bookingDate).toLocaleDateString()} at {bookingTime}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Video size={14} className="text-blue-500" />
                    <span className="text-[11px] text-blue-500 font-bold">Encrypted Video Meeting Link Sent</span>
                  </div>
                </div>
                <button
                  onClick={goBack}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <button onClick={() => setBookingStep(1)} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                    <ChevronLeft size={16} className="text-gray-500" />
                  </button>
                  <div>
                    <h2 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Schedule Consultation</h2>
                    <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Step {bookingStep} of 2</p>
                  </div>
                </div>

                {bookingStep === 1 ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-3">Select Session Date</h3>
                      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                        {nextSevenDays.map((day) => (
                          <button
                            key={day.fullDate}
                            onClick={() => setBookingDate(day.fullDate)}
                            className={`p-2 rounded-xl border transition-all text-center ${bookingDate === day.fullDate
                              ? 'bg-blue-600 border-blue-500 text-white'
                              : isDarkMode ? 'bg-white/5 border-[#2A2A2A] text-gray-400 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50'
                              }`}
                          >
                            <p className="text-[8px] uppercase font-bold">{day.dayName.slice(0, 3)}</p>
                            <p className="text-xs font-bold my-0.5">{day.dayNumber}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-3">Select Time Slot</h3>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setBookingTime(time)}
                            className={`py-1.5 rounded-lg border text-[10px] font-bold transition-all ${bookingTime === time
                              ? 'bg-blue-600 border-blue-500 text-white'
                              : isDarkMode ? 'bg-white/5 border-[#2A2A2A] text-gray-400 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50'
                              }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        onClick={() => setBookingStep(2)}
                        disabled={!bookingDate || !bookingTime}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all"
                      >
                        Provide Details
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={bookingFormData.name}
                          onChange={(e) => setBookingFormData({ ...bookingFormData, name: e.target.value })}
                          className={`w-full px-3 py-2 text-[11px] rounded-xl border focus:outline-none focus:border-blue-500/50 transition-all ${isDarkMode ? 'bg-[#0D0D0D] border-[#2A2A2A] text-white' : 'bg-gray-50 border-gray-200'
                            }`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Contact Email</label>
                        <input
                          type="email"
                          required
                          value={bookingFormData.email}
                          onChange={(e) => setBookingFormData({ ...bookingFormData, email: e.target.value })}
                          className={`w-full px-3 py-2 text-[11px] rounded-xl border focus:outline-none focus:border-blue-500/50 transition-all ${isDarkMode ? 'bg-[#0D0D0D] border-[#2A2A2A] text-white' : 'bg-gray-50 border-gray-200'
                            }`}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Case Description</label>
                      <textarea
                        required
                        rows={3}
                        value={bookingFormData.caseDetails}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, caseDetails: e.target.value })}
                        className={`w-full px-3 py-2 text-[11px] rounded-xl border focus:outline-none focus:border-blue-500/50 transition-all ${isDarkMode ? 'bg-[#0D0D0D] border-[#2A2A2A] text-white' : 'bg-gray-50 border-gray-200'
                          }`}
                        placeholder="Briefly explain your legal requirement..."
                      />
                    </div>

                    <div className="flex justify-between items-center pt-4">
                      <div className="flex items-center gap-2">
                        <Shield size={12} className="text-emerald-500" />
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Secure Consultation</span>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-blue-600/20"
                      >
                        {loading ? 'Processing...' : 'Schedule Appointment'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#0A0A0A]' : 'bg-[#F8FAFC]'}`}>
      <div className="max-w-7xl mx-auto px-4 py-6" ref={contentRef}>
        {renderView()}
      </div>
    </div>
  );
};

export default LegalCosultation;