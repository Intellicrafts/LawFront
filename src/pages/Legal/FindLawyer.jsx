import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchWalletBalance as syncWalletBalance, processServicePayment } from '../../redux/walletSlice';
import { useToast } from '../../context/ToastContext';
import config from '../../config';
import {
  User, Mail, Phone, MapPin, Calendar, Briefcase, Globe, Camera, X,
  Award, Settings, Lock, Bell, Share2, Download,
  AlertCircle, Loader, FileText, MessageSquare,
  Building, Pencil, Check, Eye, EyeOff,
  Trash2, RefreshCw, Github, Twitter, Linkedin, Facebook,
  Laptop, Video, Clock, Star, ArrowRight, ChevronRight,
  Mic, MicOff, PhoneOff, Headphones, Wallet,
  Scale, Shield, Heart, Layout, Sparkles, Zap, Search, Filter,
  ChevronLeft, Info, CheckCircle, Plus
} from 'lucide-react';
import { lawyerAPI, apiServices } from '../../api/apiService';
import walletServices from '../../services/walletService';
import MyAppointments from '../../components/MyAppointments';
import { formatRatePerMinuteLabel, buildAppointmentConsultationFee, getAppointmentRatePerMinute } from '../../utils/consultationFee';

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
  // Get dark mode state from Redux
  const { mode } = useSelector((state) => state.theme);
  const { showError: showToastError, showInfo } = useToast();
  const navigate = useNavigate();
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
  const [customTime, setCustomTime] = useState('');
  const [useCustomTime, setUseCustomTime] = useState(false);
  const [activeTab, setActiveTab] = useState('experts'); // 'experts' or 'appointments'

  // Sync active tab with URL query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam === 'appointments') {
      setActiveTab('appointments');
    } else {
      setActiveTab('experts');
    }
  }, []);

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

  // Auto-open booking modal from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lawyerIdParam = params.get('lawyerId');
    const actionParam = params.get('action');

    if (lawyerIdParam && actionParam === 'book' && !selectedLawyer) {
      let foundLawyer = lawyers.find(l => l.id.toString() === lawyerIdParam);

      if (!foundLawyer) {
        foundLawyer = {
          id: parseInt(lawyerIdParam),
          user_id: parseInt(lawyerIdParam),
          full_name: 'Selected Lawyer',
          specialization: 'Legal Counsel',
          consultation_fee: buildAppointmentConsultationFee(1500),
          is_verified: true,
          bio: 'Online Lawyer ready for consultation.'
        };
      }

      setSelectedLawyer(foundLawyer);
      setView('booking');
      setBookingStep(1);
      setBookingComplete(false);

      // Clean up URL to avoid re-triggering on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [lawyers, selectedLawyer]);

  // Wallet State from Redux
  const dispatch = useDispatch();
  const { balance: reduxWalletBalance } = useSelector((state) => state.wallet);
  const totalReduxBalance = (reduxWalletBalance?.earned_balance || 0) + (reduxWalletBalance?.promotional_balance || 0);
  
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [customRechargeAmount, setCustomRechargeAmount] = useState('');

  // Wallet Sync Logic removed - using totalReduxBalance directly

  // Fetch Wallet Balance on mount
  useEffect(() => {
    dispatch(syncWalletBalance());
  }, [dispatch]);

  const bookWithRodgerProsacco = () => {
    // Find Rodger Prosacco in the lawyers list
    const rodgerProsacco = lawyers.find(lawyer => lawyer.full_name === 'Rodger Prosacco');

    const defaultRodgerProsacco = {
      id: 999, // Use a unique ID
      user_id: 999, // Ensure wallet linking works for mock
      full_name: 'Rodger Prosacco',
      specialization: 'Corporate',
      years_of_experience: 15,
      bar_association: 'Delhi Bar Association',
      consultation_fee: buildAppointmentConsultationFee(3000),
      phone_number: '+91 98765 43210',
      email: 'rodger.prosacco@example.com',
      enrollment_no: 'BCI/100999/2015',
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
    setBookingStep(1);
    setBookingComplete(false);

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
    setIsAuthenticated(!!authToken);
  }, []);

  // State for appointment count
  const [appointmentsCount, setAppointmentsCount] = useState(0);

  // Fetch appointment count on mount
  useEffect(() => {
    const fetchAppointmentCount = async () => {
      if (!isAuthenticated) return;
      try {
        const response = await apiServices.getUserProfile();
        const userData = response.data || response;
        const count = userData.recent_activity?.appointment_summary?.total ||
          userData.recent_activity?.appointments?.length || 0;
        setAppointmentsCount(count);
      } catch (err) {
        console.error('Error fetching appointment count:', err);
      }
    };

    fetchAppointmentCount();
  }, [isAuthenticated]);

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

      // Check if user is authenticated for premium features like location
      if (!isAuthenticated && params.latitude) {
        console.log('User not authenticated for location features');
        // Remove location params but still fetch lawyers
        delete params.latitude;
        delete params.longitude;
        delete params.radius;
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
   * Handle API failure by showing appropriate error and mock data
   */
  const handleApiFailure = (page, isNewSearch) => {
    console.log('API failure - showing error message and mock data');
    setError('Unable to load lawyers live data. Showing verified experts instead.');
    setLoading(false);
    setLoadingMore(false);

    // Add mock data instead of clearing so lawyers are always visible
    const mockData = [
      {
        id: 1,
        full_name: 'Sarah Jenkins',
        specialization: 'Family Law',
        profile_picture_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
        rating: 4.9,
        reviews_count: 124,
        location: 'Mumbai, MH',
        is_verified: true,
        consultation_fee: buildAppointmentConsultationFee(1500)
      },
      {
        id: 2,
        full_name: 'David Chen',
        specialization: 'Corporate Law',
        profile_picture_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop',
        rating: 4.8,
        reviews_count: 89,
        location: 'Delhi, DL',
        is_verified: true,
        consultation_fee: buildAppointmentConsultationFee(2500)
      },
      {
        id: 3,
        full_name: 'Priya Sharma',
        specialization: 'Civil Litigation',
        profile_picture_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
        rating: 4.7,
        reviews_count: 56,
        location: 'Bangalore, KA',
        is_verified: true,
        consultation_fee: buildAppointmentConsultationFee(2000)
      },
      {
        id: 4,
        full_name: 'Michael Ross',
        specialization: 'Criminal Defense',
        profile_picture_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop',
        rating: 4.9,
        reviews_count: 210,
        location: 'Pune, MH',
        is_verified: true,
        consultation_fee: buildAppointmentConsultationFee(3000)
      },
      {
        id: 5,
        full_name: 'Anita Desai',
        specialization: 'Tax Law',
        profile_picture_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop',
        rating: 4.8,
        reviews_count: 145,
        location: 'Chennai, TN',
        is_verified: true,
        consultation_fee: buildAppointmentConsultationFee(1800)
      },
      {
        id: 6,
        full_name: 'Vikram Singh',
        specialization: 'Immigration',
        profile_picture_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
        rating: 4.6,
        reviews_count: 78,
        location: 'Hyderabad, TS',
        is_verified: true,
        consultation_fee: buildAppointmentConsultationFee(1200)
      }
    ];

    if (isNewSearch) {
      setLawyers(mockData);
    } else {
      setHasMore(false);
    }
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
      if (bookingDate && (bookingTime || (useCustomTime && customTime))) {
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
        // Parse the time string
        let hours = 0;
        let minutes = 0;

        const timeStringToParse = useCustomTime ? customTime : bookingTime;

        if (timeStringToParse) {
          // Handle 24h format (from input type="time") or "10:00 AM" format
          if (timeStringToParse.toLowerCase().includes('m')) {
            // 12-hour format with AM/PM
            const timeParts = timeStringToParse.replace(/\s+/g, ' ').trim().split(' ');
            const [hoursStr, minutesStr] = timeParts[0].split(':');

            hours = parseInt(hoursStr, 10);
            minutes = parseInt(minutesStr, 10);

            if (timeParts.length > 1 && timeParts[1].toUpperCase() === 'PM' && hours < 12) {
              hours += 12;
            } else if (timeParts.length > 1 && timeParts[1].toUpperCase() === 'AM' && hours === 12) {
              hours = 0;
            }
          } else {
            // 24-hour format (e.g., "14:30" or "09:00")
            const [hoursStr, minutesStr] = timeStringToParse.split(':');
            hours = parseInt(hoursStr, 10);
            minutes = parseInt(minutesStr, 10);
          }
        }

        // Create a date object in Local Time correctly
        const dateParts = bookingDate.split('-').map(num => parseInt(num, 10));
        const y = dateParts[0];
        const m = dateParts[1];
        const d = dateParts[2];
        const dateObj = new Date(y, m - 1, d, hours, minutes, 0);

        // Send standardized UTC format derived from our correctly constructed Local object
        const formattedDateTimeStr = dateObj.toISOString().replace('T', ' ').substring(0, 19);

        // Format date and time for display
        const displayDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const displayTime = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

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

        // Calculated Consultation Fee
        const ratePerMinute = getAppointmentRatePerMinute(selectedLawyer.consultation_fee) || 1500;
        const duration = 1; // For now assuming flat fee or minimum 1 unit for demonstration
        const TOTAL_FEE = ratePerMinute * duration;

        console.log(`Checking credits: Balance=${totalReduxBalance}, Required=${TOTAL_FEE}`);

        // Credit Guard: Check if user has sufficient balance
        if (totalReduxBalance < TOTAL_FEE) {
          showError(`Insufficient wallet balance. Total fee is ₹${TOTAL_FEE.toLocaleString('en-IN')}. Please top up your account.`);
          setShowRechargeModal(true);
          setLoading(false);
          return;
        }

        try {
          // Process Wallet Payment using Kuberdhan
          try {
            const commissionRate = 0.10; // 10% platform commission
            const commissionAmount = TOTAL_FEE * commissionRate;
            
            await dispatch(processServicePayment({
              payerUserId: userId,
              receiverUserId: selectedLawyer.user_id || selectedLawyer.id,
              amount: TOTAL_FEE,
              commissionAmount: commissionAmount,
              category: 'APPOINTMENT_BOOKING_CHARGE',
              description: `Booking with ${selectedLawyer.name} for ${displayDate} at ${displayTime}`
            })).unwrap();
            
            // Payment successful, continue to book appointment
            console.log('Payment processed successfully');
          } catch (paymentError) {
            console.error('Payment processing failed:', paymentError);
            showError(paymentError?.message || 'Payment failed. Please try again.');
            setLoading(false);
            return; // Stop booking if payment fails
          }
          
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
                user_id: selectedLawyer.user_id || selectedLawyer.id, // Lawyer's user ID
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

            // Save to local storage for "My Appointments" view
            try {
              const newAppointment = {
                id: Date.now(),
                lawyer: selectedLawyer,
                date: displayDate,
                time: displayTime,
                status: 'Scheduled',
                meetingLink: "https://meet.google.com/cbx-twdp-qhm",
                type: 'Video Consultation'
              };

              const existingAppointments = JSON.parse(localStorage.getItem('user_appointments') || '[]');
              localStorage.setItem('user_appointments', JSON.stringify([newAppointment, ...existingAppointments]));
              console.log('Saved appointment to local storage:', newAppointment);
            } catch (err) {
              console.error('Error saving appointment locally:', err);
            }
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
    // Gate: require login before booking
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: '/legal-consoltation', message: 'Please sign in to book a consultation with a verified lawyer.' } });
      return;
    }

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

    // Create local YYYY-MM-DD string instead of using toISOString() which can return the wrong date due to UTC
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const fullDateStr = `${year}-${month}-${day}`;

    return {
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      fullDate: fullDateStr,
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
   * Render Appointments View
   */
  // renderAppointments has been replaced by the standalone MyAppointments component


  /**
   * Render different views based on the current state
   */
  const renderView = () => {
    if (view === 'appointments') {
      return (
        <div className="pt-20 sm:pt-24 min-h-screen">
          <MyAppointments onBack={() => {
            setActiveTab('experts');
            setView('lawyers');
            const url = new URL(window.location);
            url.searchParams.delete('view');
            window.history.pushState({}, '', url);
          }} />
        </div>
      );
    }

    if (view === 'lawyers') {
      const visibleLawyers = lawyers;

      return (
        <>
          {/* Premium Tab Switcher / Navigation */}
          <div className="pt-24 sm:pt-28 flex justify-center mb-6 sm:mb-8">
            <div className={`p-1.5 rounded-full flex gap-1 border backdrop-blur-md ${isDarkMode ? 'bg-[#1A1A1A]/80 border-[#2A2A2A]' : 'bg-white/90 border-gray-200 shadow-sm'}`}>
              <button
                onClick={() => {
                  setActiveTab('experts');
                  // Update URL without reloading
                  const url = new URL(window.location);
                  url.searchParams.delete('view');
                  window.history.pushState({}, '', url);
                }}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'experts'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20'
                  : isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
              >
                <Search size={14} strokeWidth={2.5} />
                Find Experts
              </button>
              <button
                onClick={() => {
                  setActiveTab('appointments');
                  // Update URL without reloading
                  const url = new URL(window.location);
                  url.searchParams.set('view', 'appointments');
                  window.history.pushState({}, '', url);
                }}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'appointments'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20'
                  : isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
              >
                <Calendar size={14} strokeWidth={2.5} />
                My Appointments
              </button>
            </div>
          </div>

          {activeTab === 'experts' ? (
            <>
              {/* Professional Search & Filter Interface */}
              <div
                className={`transition-all duration-300 mb-5 overflow-hidden border ${isDarkMode
                  ? `bg-[#1A1A1A]/98 backdrop-blur-2xl border-[#2A2A2A] ${isFilterSticky ? 'sticky z-30 shadow-2xl rounded-b-3xl rounded-t-none border-t-0 -mt-2 pt-2' : 'rounded-2xl'}`
                  : `bg-white/98 backdrop-blur-2xl border-gray-200 ${isFilterSticky ? 'sticky z-30 shadow-xl rounded-b-3xl rounded-t-none border-t-0 -mt-2 pt-2' : 'rounded-2xl'}`
                  }`}
                style={{
                  top: isFilterSticky ? '64px' : '0',
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
                    <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
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

              {/* Premium Error State - Show only if we have NO lawyers to display */}
              {error && !loading && visibleLawyers.length === 0 && (
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
              {!loading && !error && visibleLawyers.length === 0 && (
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
                !loading && !error && visibleLawyers.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {visibleLawyers.map((lawyer) => (
                      <div
                        key={lawyer.id}
                        className={`group rounded-2xl transition-all duration-300 hover:shadow-2xl overflow-hidden border backdrop-blur-md ${isDarkMode
                          ? 'bg-white/5 border-[#2A2A2A] hover:bg-white/10'
                          : 'bg-white border-gray-100 hover:shadow-lg'
                          }`}
                      >
                        <div className="p-4 relative">
                          {/* Header - Profile Picture & Premium Info */}
                          <div className="flex gap-4 mb-4 items-start">
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
                                <div className={`absolute -bottom-1 -right-1 bg-gradient-to-tr from-emerald-600 to-teal-400 text-white p-1 rounded-full border-2 shadow-sm ${isDarkMode ? 'border-[#1A1A1A] shadow-emerald-500/20' : 'border-white shadow-emerald-500/30'}`}>
                                  <Check size={10} strokeWidth={4} />
                                </div>
                              )}
                            </div>

                            {/* Name, Tier & Specialization */}
                            <div className="flex-1 min-w-0 pt-1">
                              <div className="flex items-center justify-between mb-1">
                                <h2 className={`text-base font-black truncate font-display tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                  {lawyer.full_name}
                                </h2>
                                {/* Algorithmic Tier Badge */}
                                {(lawyer.rating >= 4.5 || lawyer.appointments_count > 50) && (
                                  <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border flex items-center gap-1 ${isDarkMode ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                                    <Award size={8} /> Elite
                                  </div>
                                )}
                              </div>
                              <p className={`text-[11px] ${isDarkMode ? 'text-teal-400' : 'text-teal-700'} font-bold uppercase tracking-wider mb-1`}>
                                {lawyer.specialization || 'General Practice'}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded">
                                  <Star size={10} className="text-amber-500 fill-amber-500" />
                                  <span className={`text-[10px] font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{lawyer.rating || 'New'}</span>
                                </div>
                                {lawyer.reviews_count ? <span className="text-[10px] font-medium text-slate-500">{lawyer.reviews_count} Reviews</span> : <span className="text-[10px] font-medium text-slate-500">No reviews yet</span>}
                              </div>
                            </div>
                          </div>

                          {/* Bio/Description */}
                          <p className={`text-xs leading-relaxed mb-4 line-clamp-2 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            {lawyer.bio || `${lawyer.specialization ? `Specialized in ${lawyer.specialization}` : 'Legal professional'}${lawyer.years_of_experience ? ` with ${lawyer.years_of_experience} years of experience` : ''}.`}
                          </p>

                          {/* Trust Signals */}
                          <div className="grid grid-cols-2 gap-2 mb-5">
                            <div className={`py-2 px-3 rounded-lg flex items-center gap-2 ${isDarkMode ? 'bg-white/[0.03]' : 'bg-slate-50'}`}>
                              <Briefcase size={14} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
                              <div>
                                <div className={`text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Experience</div>
                                <div className={`text-xs font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{lawyer.years_of_experience ? `${lawyer.years_of_experience} Years` : 'New'}</div>
                              </div>
                            </div>
                            <div className={`py-2 px-3 rounded-lg flex items-center gap-2 ${isDarkMode ? 'bg-white/[0.03]' : 'bg-slate-50'}`}>
                              <Zap size={14} className={isDarkMode ? 'text-amber-500' : 'text-amber-600'} />
                              <div>
                                <div className={`text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Response</div>
                                <div className={`text-xs font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{lawyer.appointments_count > 10 ? '< 1 Hour' : 'Usually fast'}</div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons with Productized Pricing */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => viewLawyerDetails(lawyer)}
                              className={`px-3 py-2 rounded-xl text-[11px] font-bold transition-all border flex items-center justify-center ${isDarkMode
                                ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-[#2A2A2A]'
                                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                                }`}
                            >
                              <Info size={14} />
                            </button>
                            <button
                              onClick={() => startBooking(lawyer)}
                              className="flex-1 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white transition-all shadow-lg shadow-teal-900/20 flex items-center justify-center gap-2 group"
                            >
                              <Calendar size={14} className="group-hover:scale-110 transition-transform" />
                              Book • {formatRatePerMinuteLabel(lawyer.consultation_fee)}
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
                !loading && !error && visibleLawyers.length > 0 && (
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
          ) : (
            <MyAppointments onBack={() => setActiveTab('experts')} />
          )}
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
                  <div className="relative mt-2">
                    <img
                      src={selectedLawyer.profile_picture_url || "https://t4.ftcdn.net/jpg/03/46/93/61/360_F_346936114_RaxE6OQogOtOt9Wgc91G1oST5p5huzJS.jpg"}
                      alt={selectedLawyer.full_name}
                      className={`w-20 h-20 rounded-2xl border-2 object-cover shadow-lg ${isDarkMode ? 'border-[#1A1A1A] shadow-black/50' : 'border-white shadow-slate-200/50'}`}
                    />
                    {selectedLawyer.is_verified && (
                      <div className={`absolute -bottom-2 -right-2 bg-gradient-to-tr from-emerald-600 to-teal-400 text-white p-1.5 rounded-full border-2 shadow-md ${isDarkMode ? 'border-[#1A1A1A]' : 'border-white'}`}>
                        <Check size={12} strokeWidth={4} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-white font-display tracking-tight drop-shadow-md">{selectedLawyer.full_name}</h1>
                    <p className="text-xs text-teal-300 font-bold uppercase tracking-widest mt-1 drop-shadow-md">{selectedLawyer.specialization || 'General Practice'}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1 bg-black/30 backdrop-blur-md px-2 py-1 rounded shadow-inner">
                        <Star size={10} className="text-amber-500 fill-amber-500" />
                        <span className="text-xs font-black text-white">{selectedLawyer.rating || 'New'}</span>
                      </div>
                      <span className="text-[10px] text-white/80 font-medium bg-black/20 backdrop-blur px-2 py-1 rounded">
                        {selectedLawyer.appointments_count || 0} Consultations
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => startBooking(selectedLawyer)}
                  className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-teal-900/30 flex items-center gap-2 mb-2"
                >
                  <Calendar size={14} />
                  Book Consult • {formatRatePerMinuteLabel(selectedLawyer.consultation_fee)}
                </button>
              </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Left Side: About & Stats */}
              <div className="md:col-span-2 space-y-4">
                <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-white/[0.02] border-[#2A2A2A]' : 'bg-slate-50 border-slate-100'}`}>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                    <Info size={14} className={isDarkMode ? 'text-teal-500' : 'text-teal-600'} />
                    Professional Profile
                  </h3>
                  <p className={`text-xs leading-loose font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    {selectedLawyer.bio || `${selectedLawyer.full_name || 'This attorney'} is a ${selectedLawyer.specialization ? `distinguished ${selectedLawyer.specialization} expert` : 'legal professional'}${selectedLawyer.years_of_experience ? ` with over ${selectedLawyer.years_of_experience} years of experience` : ''}.`}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Experience', value: selectedLawyer.years_of_experience ? `${selectedLawyer.years_of_experience}Y` : 'New', icon: Briefcase },
                    { label: 'Consult Fees', value: formatRatePerMinuteLabel(selectedLawyer.consultation_fee), icon: Award },
                    { label: 'License No.', value: selectedLawyer.enrollment_no || '—', icon: Shield }
                  ].map((stat, i) => (
                    <div key={i} className={`p-4 rounded-2xl border text-center ${isDarkMode ? 'bg-white/[0.02] border-[#2A2A2A]' : 'bg-white border-slate-100 shadow-sm'}`}>
                      <stat.icon size={16} className={`mx-auto mb-2 ${isDarkMode ? 'text-teal-500' : 'text-teal-600'}`} />
                      <div className="text-[9px] font-black tracking-widest text-slate-400 uppercase mb-1">{stat.label}</div>
                      <div className={`text-sm font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: Quick Info */}
              <div className="space-y-4">
                <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-white/[0.02] border-[#2A2A2A]' : 'bg-slate-50 border-slate-100'}`}>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                    <MapPin size={14} className={isDarkMode ? 'text-teal-500' : 'text-teal-600'} />
                    Location & Office
                  </h3>
                  <div className="space-y-3">
                    {[
                      { icon: Building, text: selectedLawyer.bar_association },
                      { icon: Phone, text: selectedLawyer.phone_number },
                      { icon: Mail, text: selectedLawyer.email }
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <item.icon size={14} className={`mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                        <span className={`text-xs font-medium break-all ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-white/[0.02] border-[#2A2A2A]' : 'bg-slate-50 border-slate-100'}`}>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                    <Clock size={14} className={isDarkMode ? 'text-teal-500' : 'text-teal-600'} />
                    Availability
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                      <div key={day} className={`px-2.5 py-1 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] font-black uppercase tracking-wider`}>{day}</div>
                    ))}
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 mt-4">Standard hours: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (view === 'booking' && selectedLawyer) {
      return (
        <div className="pt-20 sm:pt-24 max-w-3xl mx-auto px-4">
          <div className={`rounded-2xl overflow-hidden border backdrop-blur-md transition-all duration-300 ${isDarkMode ? 'bg-[#1A1A1A]/80 border-[#2A2A2A]' : 'bg-white border-gray-100 shadow-xl'}`}>
            {bookingComplete ? (
              <div className="p-8 text-center">
                <div className="flex items-center justify-center p-3 mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle size={20} className="mr-3" />
                  <span className="text-xs font-black uppercase tracking-wider">Transaction Successful</span>
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
                <div className="flex items-center justify-center mt-2">
                  <button
                    onClick={() => {
                      setActiveTab('appointments');
                      setView('lawyers');
                      // Update URL without reloading
                      const url = new URL(window.location);
                      url.searchParams.set('view', 'appointments');
                      window.history.pushState({}, '', url);
                    }}
                    className="flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[15px] font-bold rounded-2xl transition-all shadow-xl shadow-blue-600/20 hover:-translate-y-1"
                  >
                    <Calendar size={18} strokeWidth={2.5} />
                    My Appointments
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <button onClick={goBack} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
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
                        {nextSevenDays.map((day) => {
                          const isSelected = bookingDate === day.fullDate;
                          return (
                            <button
                              key={day.fullDate}
                              onClick={() => setBookingDate(day.fullDate)}
                              className={`p-2 rounded-xl border transition-all text-center ${isSelected
                                ? 'bg-blue-600 border-blue-500 text-white'
                                : isDarkMode ? 'bg-white/5 border-[#2A2A2A] text-gray-400 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                              <p className="text-[8px] uppercase font-bold">{day.dayName.slice(0, 3)}</p>
                              <p className="text-xs font-bold my-0.5">{day.dayNumber}</p>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-3">Select Time Slot</h3>

                      {/* Standard Slots */}
                      <div className={`grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4 ${useCustomTime ? 'opacity-50 pointer-events-none' : ''}`}>
                        {timeSlots.map((time) => {
                          // Check if slot has already passed for today
                          let isPast = false;
                          const now = new Date();
                          const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

                          if (bookingDate === todayStr) {
                            // Parse slot time
                            let hours = 0;
                            let minutes = 0;
                            const timeParts = time.replace(/\s+/g, ' ').trim().split(' ');
                            const [h, min] = timeParts[0].split(':');
                            hours = parseInt(h, 10);
                            minutes = parseInt(min, 10);

                            if (timeParts[1].toUpperCase() === 'PM' && hours < 12) hours += 12;
                            else if (timeParts[1].toUpperCase() === 'AM' && hours === 12) hours = 0;

                            const slotTime = new Date();
                            slotTime.setHours(hours, minutes, 0, 0);

                            // If slot is in the past (or within the next 5 mins to be safe)
                            if (slotTime < now) {
                              isPast = true;
                            }
                          }

                          return (
                            <button
                              key={time}
                              disabled={isPast}
                              onClick={() => {
                                setBookingTime(time);
                                setUseCustomTime(false);
                              }}
                              className={`py-1.5 rounded-lg border text-[10px] font-bold transition-all ${bookingTime === time && !useCustomTime
                                ? 'bg-blue-600 border-blue-500 text-white'
                                : isDarkMode
                                  ? `bg-white/5 border-[#2A2A2A] ${isPast ? 'text-gray-700 opacity-30 cursor-not-allowed' : 'text-gray-400 hover:bg-white/10'}`
                                  : `bg-white border-gray-200 ${isPast ? 'text-gray-300 opacity-50 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`
                                }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom Time Toggle & Input */}
                      <div className={`p-3 rounded-xl border transition-all ${useCustomTime
                        ? (isDarkMode ? 'bg-blue-900/20 border-blue-500/50' : 'bg-blue-50 border-blue-200')
                        : (isDarkMode ? 'bg-white/5 border-[#2A2A2A]' : 'bg-gray-50 border-gray-200')
                        }`}>
                        <div className="flex items-center justify-between mb-2">
                          <label className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <input
                              type="checkbox"
                              checked={useCustomTime}
                              onChange={() => setUseCustomTime(!useCustomTime)}
                              className="accent-blue-600 rounded"
                            />
                            Enter Custom Time
                          </label>
                          {useCustomTime && (
                            <span className="text-[9px] text-blue-500 font-bold animate-pulse">Custom Mode Active</span>
                          )}
                        </div>

                        <div className={`transition-all duration-300 ${useCustomTime ? 'opacity-100 max-h-20' : 'opacity-40 max-h-0 overflow-hidden'}`}>
                          <div className="flex gap-2 items-center mt-2">
                            <input
                              type="time"
                              value={customTime}
                              onChange={(e) => setCustomTime(e.target.value)}
                              className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none focus:border-blue-500 transition-all ${isDarkMode ? 'bg-[#0A0A0A] border-[#2A2A2A] text-white' : 'bg-white border-gray-200 text-gray-900'
                                }`}
                            />
                            <span className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              (Select AM/PM in picker)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        onClick={() => setBookingStep(2)}
                        disabled={!bookingDate || (!bookingTime && !useCustomTime) || (useCustomTime && !customTime)}
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
                        className="flex items-center justify-center gap-2 min-w-[190px] px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[11px] font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-blue-600/30 disabled:opacity-80 disabled:cursor-not-allowed disabled:hover:translate-y-0 hover:-translate-y-0.5"
                      >
                        {loading ? (
                          <>
                            <Loader size={14} className="animate-spin" />
                            Processing...
                          </>
                        ) : 'Schedule Appointment'}
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

      {/* Recharge Modal */}
      {/* Premium Professional Recharge Modal */}
      {showRechargeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0A0A0A]/80 backdrop-blur-xl p-4 sm:p-6 animate-in fade-in duration-300">
          <div 
            className={`relative w-full max-w-md overflow-hidden rounded-[2.5rem] shadow-2xl border transition-all duration-500 animate-in zoom-in-95 slide-in-from-bottom-10 ${
              isDarkMode 
                ? 'bg-[#121212] border-white/10 shadow-blue-900/20' 
                : 'bg-white border-slate-200 shadow-slate-200/50'
            }`}
          >
            {/* Background Accent Gradients */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600/20 via-transparent to-transparent opacity-50" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-indigo-600/10 via-transparent to-transparent opacity-30 blur-3xl" />

            <div className="relative p-7 sm:p-9">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-2xl ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                    <Wallet size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Wallet Top-up
                    </h3>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      Instant & Secure
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRechargeModal(false)}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-white/5 hover:bg-white/10 text-slate-400' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-500'
                  }`}
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>

              {/* Balance Display Card */}
              <div className={`mb-8 p-6 rounded-3xl border text-center relative overflow-hidden group ${
                isDarkMode 
                  ? 'bg-white/[0.02] border-white/5' 
                  : 'bg-slate-50 border-slate-100'
              }`}>
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Sparkles size={40} />
                </div>
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  Available Credits
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className={`text-4xl font-black font-display tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    ₹{totalReduxBalance.toLocaleString('en-IN')}
                  </span>
                  <Zap size={20} className="text-amber-500 animate-pulse" />
                </div>
              </div>

              {/* Insufficient Funds Warning (If applicable) */}
              {selectedLawyer && totalReduxBalance < (getAppointmentRatePerMinute(selectedLawyer.consultation_fee) || 1500) && (
                <div className={`mb-6 p-4 rounded-2xl border flex items-start gap-4 animate-bounce-subtle ${
                  isDarkMode ? 'bg-red-500/5 border-red-500/20 text-red-400' : 'bg-red-50 border-red-100 text-red-600'
                }`}>
                  <div className="mt-0.5">
                    <AlertCircle size={14} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-black uppercase tracking-wider">Insufficient Funds</p>
                    <p className="text-[10px] leading-relaxed opacity-80 font-medium">
                      You need at least ₹{(getAppointmentRatePerMinute(selectedLawyer.consultation_fee) || 1500).toLocaleString('en-IN')} to book this session.
                    </p>
                  </div>
                </div>
              )}

              {/* Amount Selection */}
              <div className="space-y-6">
                <div>
                  <label className={`text-[10px] font-black uppercase tracking-widest mb-4 block ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    Select Top-up Amount
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[500, 1000, 2500].map(amount => (
                      <button
                        key={amount}
                        onClick={async () => {
                          try {
                            setLoading(true);
                            const userStr = localStorage.getItem('user');
                            const userId = userStr ? JSON.parse(userStr).id : null;
                            
                            if (!userId) {
                              showError("Session expired. Please login again.");
                              return;
                            }

                            const response = await walletServices.recharge(userId, amount);

                            if (response.success || response.status === 'success') {
                              dispatch(syncWalletBalance());
                              showSuccess(`₹${amount} added successfully! Your new balance is ₹${(totalReduxBalance + amount).toLocaleString('en-IN')}`);
                              setShowRechargeModal(false);
                            } else {
                              throw new Error(response.message || 'Recharge failed');
                            }
                          } catch (err) {
                            console.error('Recharge error:', err);
                            showError('Transaction failed. Please try again.');
                          } finally {
                            setLoading(false);
                          }
                        }}
                        className={`group relative py-4 rounded-2xl border font-black text-sm transition-all duration-300 hover:-translate-y-1 active:scale-95 ${
                          isDarkMode 
                            ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-blue-500/30 text-white' 
                            : 'bg-white border-slate-100 hover:bg-slate-50 hover:border-blue-500/30 text-slate-700 shadow-sm'
                        }`}
                      >
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus size={10} className="text-blue-500" />
                        </div>
                        ₹{amount.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount Option */}
                <div className="relative pt-2">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    <Plus size={14} />
                  </div>
                  <input
                    type="number"
                    placeholder="Enter custom amount..."
                    value={customRechargeAmount}
                    onChange={(e) => setCustomRechargeAmount(e.target.value)}
                    className={`w-full pl-10 pr-24 py-3.5 text-xs font-bold rounded-2xl border outline-none transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-white/5 border-white/5 focus:border-blue-500/50 text-white placeholder-slate-600' 
                        : 'bg-slate-50 border-slate-100 focus:border-blue-500/30 text-slate-900 placeholder-slate-400 shadow-inner'
                    }`}
                  />
                  {customRechargeAmount && parseInt(customRechargeAmount) > 0 && (
                    <button
                      onClick={async () => {
                        const amount = parseInt(customRechargeAmount);
                        try {
                          setLoading(true);
                          const userStr = localStorage.getItem('user');
                          const userId = userStr ? JSON.parse(userStr).id : null;
                          
                          const response = await walletServices.recharge(userId, amount);

                          if (response.success || response.status === 'success') {
                            dispatch(syncWalletBalance());
                            showSuccess(`₹${amount} added successfully!`);
                            setShowRechargeModal(false);
                            setCustomRechargeAmount('');
                          } else {
                            throw new Error(response.message || 'Recharge failed');
                          }
                        } catch (err) {
                          showError('Custom recharge failed');
                        } finally {
                          setLoading(false);
                        }
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-blue-600/20"
                    >
                      Add
                    </button>
                  )}
                </div>

                {/* Secure Payment Footer */}
                <div className="flex flex-col items-center gap-4 pt-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/10">
                    <Shield size={12} className="text-emerald-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                      256-bit SSL Secure Payment
                    </span>
                  </div>
                  <p className={`text-[10px] text-center font-medium leading-relaxed opacity-30 px-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    By topping up, you agree to our Terms of Service. Funds are instantly credited to your Mera Bakil account.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LegalCosultation;
