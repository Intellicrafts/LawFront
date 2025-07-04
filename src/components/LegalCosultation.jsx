import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { lawyerAPI, apiServices } from '../api/apiService';
import { MdLocationOn, MdMyLocation, MdLocationSearching } from 'react-icons/md';
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
  FaVideo
} from 'react-icons/fa';

// Professional color palette
const colors = {
  light: {
    background: '#F8F9FA',
    surface: '#FFFFFF',
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
      muted: '#94A3B8'
    },
    accent: {
      primary: '#0EA5E9',
      secondary: '#38BDF8',
      gradient: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)'
    },
    border: '#E2E8F0',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    text: {
      primary: '#F1F5F9',
      secondary: '#CBD5E1',
      muted: '#94A3B8'
    },
    accent: {
      primary: '#38BDF8',
      secondary: '#0EA5E9',
      gradient: 'linear-gradient(135deg, #38BDF8 0%, #0EA5E9 100%)'
    },
    border: '#334155',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  }
};

// Categories for filtering
const categories = [
  'All',
  'Criminal',
  'Family',
  'Corporate',
  'Immigration',
  'Civil',
  'Labor Law',
  'Tax Law',
  'Intellectual Property'
];

// Sample data for development and fallback
const sampleLawyers = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  full_name: [
    'Rajesh Kumar Demo Data',
    'Priya Sharma Demo Data',
    'Vikram Singh Demo Data',
    'Ananya Patel Demo Data',
    'Arjun Mehta Demo Data',
    'Neha Gupta Demo Data',
    'Sanjay Verma Demo Data',
    'Divya Joshi Demo Data',
    'Rahul Malhotra Demo Data',
    'Meera Kapoor Demo Data',
    'Aditya Reddy Demo Data',
    'Kavita Nair Demo Data'
  ][i],
  specialization: [
    'Criminal',
    'Family',
    'Corporate',
    'Immigration',
    'Civil',
    'Labor Law',
    'Tax Law',
    'Intellectual Property',
    'Criminal',
    'Family',
    'Corporate',
    'Immigration'
  ][i],
  years_of_experience: 5 + (i % 15),
  bar_association: [
    'Delhi Bar Association',
    'Mumbai Bar Association',
    'Bangalore Bar Association',
    'Chennai Bar Association',
    'Kolkata Bar Association',
    'Hyderabad Bar Association',
    'Pune Bar Association',
    'Ahmedabad Bar Association',
    'Lucknow Bar Association',
    'Jaipur Bar Association',
    'Chandigarh Bar Association',
    'Kochi Bar Association'
  ][i],
  consultation_fee: 1500 + (i * 500),
  phone_number: `+91 98765 4${i}${i}${i}${i}`,
  email: `lawyer${i+1}@example.com`,
  license_number: `BCI/${100000 + i}/${2010 + (i % 10)}`,
  is_verified: i % 3 === 0,
  profile_picture_url: null,
  reviews_count: i * 5,
  appointments_count: i * 3,
  bio: `Experienced ${['Criminal', 'Family', 'Corporate', 'Immigration', 'Civil', 'Labor Law', 'Tax Law', 'Intellectual Property'][i % 8]} lawyer with ${5 + (i % 15)} years of practice. Specializing in complex cases with a high success rate.`
}));

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
  
  // Fetch lawyers from API - initial load
  useEffect(() => {
    // Reset lawyers array and fetch from page 1 when filters change
    setLawyers([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchLawyers(1, true);
  }, [selectedCategory, locationEnabled, userLocation, searchQuery]);

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
      
      console.log('Fetching lawyers with params:', params);
      
      try {
        // Call the API using lawyerAPI service
        const response = await lawyerAPI.getLawyers(params);
        
        if (response && response.success) {
          const response = response.data;
          const lawyersData = response.data || [];
          
          // Update state based on whether this is a new search or loading more
          if (isNewSearch) {
            setLawyers(lawyersData);
          } else {
            setLawyers(prevLawyers => [...prevLawyers, ...lawyersData]);
          }
          
          // Calculate total pages
          const totalPagesCount = Math.ceil((response.total || 0) / (response.per_page || 6));
          setTotalPages(totalPagesCount);
          
          // Check if we have more data to load
          setHasMore(page < totalPagesCount);
          
          // Update current page
          setCurrentPage(page);
          
          // Preload background images for each lawyer
          console.log('Fetched lawyers data:', lawyersData);
          const newImages = preloadLawyerBackgroundImages(lawyersData);
          console.log('Setting background images:', newImages);
          
          // Merge new images with existing ones
          setBackgroundImages(prevImages => ({
            ...prevImages,
            ...newImages
          }));
        } else {
          throw new Error('Failed to fetch lawyers data');
        }
      } catch (apiError) {
        console.error('API Error:', apiError);
        
        // Fallback to sample data if API fails
        console.log('Falling back to sample data');
        
        // Filter the sample data based on category and search query
        let filteredData = [...sampleLawyers];
        
        if (selectedCategory !== 'All') {
          filteredData = filteredData.filter(lawyer => 
            lawyer.specialization === selectedCategory
          );
        }
        
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredData = filteredData.filter(lawyer => 
            lawyer.full_name.toLowerCase().includes(query) || 
            lawyer.specialization.toLowerCase().includes(query)
          );
        }
        
        // Calculate total pages
        const perPage = 6;
        const totalItems = filteredData.length;
        const totalPagesCount = Math.ceil(totalItems / perPage);
        
        // Get the current page of data
        const startIndex = (page - 1) * perPage;
        const paginatedData = filteredData.slice(startIndex, startIndex + perPage);
        
        // Update state based on whether this is a new search or loading more
        if (isNewSearch) {
          setLawyers(paginatedData);
        } else {
          setLawyers(prevLawyers => [...prevLawyers, ...paginatedData]);
        }
        
        setTotalPages(totalPagesCount);
        setHasMore(page < totalPagesCount);
        setCurrentPage(page);
        
        // Preload background images for sample data
        const newImages = preloadLawyerBackgroundImages(paginatedData);
        setBackgroundImages(prevImages => ({
          ...prevImages,
          ...newImages
        }));
      }
    } catch (err) {
      console.error('Error fetching lawyers:', err);
      setError('Failed to load lawyers. Please try again later.');
      if (isNewSearch) {
        setLawyers([]);
      }
    } finally {
      if (isNewSearch) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
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
    if (!userLocation) {
      getUserLocation();
      return;
    }
    
    setNearbyLoading(true);
    
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
      
      try {
        const response = await lawyerAPI.getLawyers(params);
        
        if (response && response.success) {
          const lawyersData = response.data.data || [];
          setLawyers(lawyersData);
          
          // Calculate total pages
          const totalPagesCount = Math.ceil((response.data.total || 0) / (response.data.per_page || 6));
          setTotalPages(totalPagesCount);
          
          // Check if we have more data to load
          setHasMore(1 < totalPagesCount);
          
          // Preload background images for each lawyer
          const newImages = preloadLawyerBackgroundImages(lawyersData);
          setBackgroundImages(newImages);
        } else {
          throw new Error('Failed to fetch nearby lawyers');
        }
      } catch (apiError) {
        console.error('API Error:', apiError);
        // Fallback to sample data
        setLawyers(sampleLawyers.slice(0, 6));
        setTotalPages(Math.ceil(sampleLawyers.length / 6));
        setHasMore(6 < sampleLawyers.length);
        
        // Generate background images for sample lawyers
        const sampleImages = preloadLawyerBackgroundImages(sampleLawyers.slice(0, 6));
        setBackgroundImages(sampleImages);
      }
    } catch (err) {
      console.error('Error fetching nearby lawyers:', err);
    } finally {
      setNearbyLoading(false);
    }
  };
  
  /**
   * Fetch top-rated lawyers
   */
  const fetchTopRatedLawyers = async () => {
    setTopRatedLoading(true);
    
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
      
      try {
        const response = await lawyerAPI.getLawyers(params);
        
        if (response && response.success) {
          const lawyersData = response.data.data || [];
          setLawyers(lawyersData);
          
          // Calculate total pages
          const totalPagesCount = Math.ceil((response.data.total || 0) / (response.data.per_page || 6));
          setTotalPages(totalPagesCount);
          
          // Check if we have more data to load
          setHasMore(1 < totalPagesCount);
          
          // Preload background images for each lawyer
          const newImages = preloadLawyerBackgroundImages(lawyersData);
          setBackgroundImages(newImages);
        } else {
          throw new Error('Failed to fetch top-rated lawyers');
        }
      } catch (apiError) {
        console.error('API Error:', apiError);
        // Sort sample data by reviews_count (as a proxy for rating)
        const sortedLawyers = [...sampleLawyers].sort((a, b) => b.reviews_count - a.reviews_count);
        setLawyers(sortedLawyers.slice(0, 6));
        setTotalPages(Math.ceil(sampleLawyers.length / 6));
        setHasMore(6 < sampleLawyers.length);
        
        // Generate background images for sample lawyers
        const sampleImages = preloadLawyerBackgroundImages(sortedLawyers.slice(0, 6));
        setBackgroundImages(sampleImages);
      }
    } catch (err) {
      console.error('Error fetching top-rated lawyers:', err);
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
   * Render different views based on the current state
   */
  const renderView = () => {
    if (view === 'lawyers') {
      return (
        <>
          {/* Quick Action Buttons - More Compact */}
          <div className="flex gap-3 mb-4 mt-14">
            <button 
              onClick={fetchNearbyLawyers}
              disabled={nearbyLoading}
              className={`relative flex items-center flex-1 py-3 px-4 rounded-xl shadow-sm border transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' 
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              {nearbyLoading ? (
                <div className="flex items-center justify-center">
                  <Lottie
                    loop
                    animationData={locationSearchAnimation}
                    play
                    style={{ width: 40, height: 40 }}
                  />
                  <span className={`ml-2 font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Loading...</span>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-md">
                    <MdLocationOn className="text-white text-lg" />
                  </div>
                  <div className="ml-3">
                    <h3 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      Nearby Lawyers
                    </h3>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Find lawyers in your area
                    </p>
                  </div>
                </>
              )}
            </button>
            
            <button 
              onClick={fetchTopRatedLawyers}
              disabled={topRatedLoading}
              className={`relative flex items-center flex-1 py-3 px-4 rounded-xl shadow-sm border transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' 
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              {topRatedLoading ? (
                <div className="flex items-center justify-center">
                  <Lottie
                    loop
                    animationData={lawyerSearchAnimation}
                    play
                    style={{ width: 40, height: 40 }}
                  />
                  <span className={`ml-2 font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Loading...</span>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md">
                    <FaStar className="text-white text-lg" />
                  </div>
                  <div className="ml-3">
                    <h3 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      Top Rated
                    </h3>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Best reviewed lawyers
                    </p>
                  </div>
                </>
              )}
            </button>
          </div>
          
          {/* Professional Filter Bar */}
          <div
            className={`rounded-xl border transition-all duration-300 backdrop-blur-sm mb-5 overflow-hidden ${
              isDarkMode 
                ? `bg-slate-800/95 border-slate-700 ${isFilterSticky ? 'sticky z-30 shadow-lg border-sky-700/50 rounded-t-none border-t-0' : ''}` 
                : `bg-white border-slate-200 ${isFilterSticky ? 'sticky z-30 shadow-lg border-sky-200 rounded-t-none border-t-0' : ''}`
            }`}
            style={{ top: isFilterSticky ? '60px' : '0' }}
          >
            {/* Header with gradient background */}
            <div className={`py-3 px-4 flex items-center justify-between ${
              isDarkMode ? 'bg-gradient-to-r from-slate-800 to-slate-700' : 'bg-gradient-to-r from-sky-50 to-slate-50'
            }`}>
              <h2 className={`font-bold flex items-center ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                <FaUserTie className={`mr-2 ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`} />
                <span>Find Your Lawyer</span>
              </h2>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' 
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <FaFilter className="text-sm" />
                </button>
                
                <button
                  type="button"
                  onClick={toggleLocationSearch}
                  className={`p-2 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    locationEnabled
                      ? isDarkMode 
                        ? 'bg-sky-600 text-white' 
                        : 'bg-sky-500 text-white'
                      : isDarkMode 
                        ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' 
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {locationSearching ? (
                    <div className="animate-spin">
                      <FaRegClock className="text-sm" />
                    </div>
                  ) : (
                    locationEnabled ? <MdMyLocation className="text-sm" /> : <MdLocationSearching className="text-sm" />
                  )}
                </button>
              </div>
            </div>

            {/* Search Bar - Always visible */}
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
              <form onSubmit={handleSearch} className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                </div>
                <input
                  type="text"
                  placeholder="Search lawyers by name or expertise..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-9 pr-16 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 ${
                    isDarkMode 
                      ? 'border-slate-600 bg-slate-700 text-slate-200 placeholder-slate-500' 
                      : 'border-slate-300 bg-white text-slate-700 placeholder-slate-400'
                  }`}
                />
                <button 
                  type="submit" 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-sky-600 text-white text-xs font-medium rounded-md hover:bg-sky-700 transition-colors"
                >
                  Search
                </button>
              </form>
              
              {locationError && (
                <p className="text-red-500 text-xs mt-1">{locationError}</p>
              )}
            </div>

            {/* Filter Options - Collapsible */}
            <div
              className={`transition-all duration-300 overflow-hidden ${
                showFilters ? 'max-h-40' : 'max-h-0'
              }`}
            >
              {/* Category Pills */}
              <div className="p-3 overflow-x-auto">
                <div className="flex gap-2 min-w-max">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCurrentPage(1); // Reset to first page when changing category
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all duration-200 flex items-center ${
                        selectedCategory === cat
                          ? 'text-white bg-gradient-to-r from-sky-500 to-sky-600 shadow-sm'
                          : isDarkMode
                            ? 'text-slate-300 bg-slate-700 hover:bg-slate-600 hover:text-slate-200'
                            : 'text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-700'
                      }`}
                    >
                      {cat === 'All' && <FaFilter className="mr-1 text-xs" />}
                      {cat === 'Criminal' && <FaShieldAlt className="mr-1 text-xs" />}
                      {cat === 'Family' && <FaHeart className="mr-1 text-xs" />}
                      {cat === 'Corporate' && <FaBriefcase className="mr-1 text-xs" />}
                      {cat === 'Immigration' && <FaGraduationCap className="mr-1 text-xs" />}
                      {cat === 'Civil' && <FaUserCheck className="mr-1 text-xs" />}
                      {cat === 'Labor Law' && <FaMoneyBillWave className="mr-1 text-xs" />}
                      {cat === 'Tax Law' && <FaEnvelopeOpenText className="mr-1 text-xs" />}
                      {cat === 'Intellectual Property' && <FaBolt className="mr-1 text-xs" />}
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col justify-center items-center py-12">
              <Lottie
                loop
                animationData={lawyerSearchAnimation}
                play
                style={{ width: 120, height: 120 }}
              />
              <p className={`mt-4 font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Finding the best lawyers for you...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className={`rounded-xl p-6 mb-8 text-center ${
              isDarkMode ? 'bg-red-900/20 text-red-200' : 'bg-red-50 text-red-600'
            }`}>
              <FaTimes className="mx-auto text-3xl mb-2" />
              <p>{error}</p>
              <button 
                onClick={fetchLawyers}
                className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && lawyers.length === 0 && (
            <div className={`rounded-xl p-8 mb-8 text-center ${
              isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-600'
            }`}>
              <FaUserTie className="mx-auto text-5xl mb-4 opacity-30" />
              <h3 className="text-xl font-bold mb-2">No Lawyers Found</h3>
              <p>We couldn't find any lawyers matching your criteria.</p>
              <button 
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setCurrentPage(1);
                  fetchLawyers();
                }}
                className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Lawyers Grid - Improved Card Design */}
          {!loading && !error && lawyers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {lawyers.map((lawyer) => (
                <div
                  key={lawyer.id}
                  className={`group rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border ${
                    isDarkMode 
                      ? 'bg-slate-800 border-slate-700 hover:border-sky-700/50' 
                      : 'bg-white border-slate-200 hover:border-sky-200'
                  }`}
                >
                  <div className="relative">
                    {/* Professional Background Image */}
                    <div className="w-full h-32 overflow-hidden relative group-hover:scale-105 transition-transform duration-300">
                      <img 
                        src={backgroundImages[lawyer.id] || "https://t3.ftcdn.net/jpg/06/07/78/88/360_F_607788897_v79yS23PWXnwx4nF6dV415075ICLOZkn.jpg"} 
                        alt={`${lawyer.specialization} background`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          console.error('Image failed to load:', backgroundImages[lawyer.id]);
                          e.target.onerror = null; // Prevent infinite loop
                          e.target.src = "https://t3.ftcdn.net/jpg/06/07/78/88/360_F_607788897_v79yS23PWXnwx4nF6dV415075ICLOZkn.jpg";
                        }}
                      />
                      {/* Overlay for better text visibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>

                    {/* Status Badges - More Compact */}
                    <div className="absolute top-2 right-2 flex gap-1.5">
                      {lawyer.is_verified && (
                        <div className="bg-emerald-500 text-white px-1.5 py-0.5 rounded-md text-xs font-medium flex items-center gap-1 shadow-sm">
                          <FaCheckCircle className="text-[10px]" />
                          <span className="text-[10px]">Verified</span>
                        </div>
                      )}
                      <div className={`px-1.5 py-0.5 rounded-md text-xs font-medium shadow-sm backdrop-blur-sm ${
                        isDarkMode 
                          ? 'bg-slate-700/90 text-slate-200' 
                          : 'bg-white/90 text-slate-700'
                      }`}>
                        <span className="text-[10px]">₹{lawyer.consultation_fee}/hr</span>
                      </div>
                    </div>

                    {/* Profile Section - Repositioned */}
                    <div className="absolute -bottom-8 left-4">
                      {/* Profile image or initials */}
                      {lawyer.profile_picture_url ? (
                        <img
                          src={lawyer.profile_picture_url}
                          alt={lawyer.full_name}
                          className="w-16 h-16 rounded-full border-2 border-white shadow-md object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full border-2 border-white shadow-md bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                          {getInitials(lawyer.full_name)}
                        </div>
                      )}
                    </div>

                    {/* Rating - Repositioned */}
                    <div className="absolute bottom-2 right-2 flex items-center gap-0.5 bg-black/40 rounded-md px-1.5 py-0.5">
                      <div className="flex items-center">
                        {renderStars(lawyer.reviews_count > 0 ? 4.5 : 0).map((star, index) => (
                          <span key={index} className="text-xs">{star}</span>
                        ))}
                      </div>
                      <span className="text-white text-xs ml-0.5">
                        {lawyer.reviews_count > 0 ? `(${lawyer.reviews_count})` : '(New)'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 pt-10">
                    {/* Lawyer Name and Specialization */}
                    <div className="mb-2">
                      <h3 className={`font-bold flex items-center gap-1 ${
                        isDarkMode ? 'text-slate-200' : 'text-slate-800'
                      }`}>
                        <FaUserTie className={`text-xs ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`} />
                        {lawyer.full_name}
                      </h3>
                      <div className="flex items-center mt-1">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-gradient-to-r from-sky-500 to-sky-600 text-white text-xs">
                          {lawyer.specialization}
                        </span>
                        <span className={`ml-2 text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {lawyer.years_of_experience} years exp.
                        </span>
                      </div>
                    </div>
                    
                    {/* Lawyer Info - Compact List */}
                    <div className="space-y-1.5 mb-3">
                      <div className={`flex items-center text-xs ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        <FaMapMarkerAlt className={`w-3 h-3 mr-1.5 ${isDarkMode ? 'text-sky-400' : 'text-sky-500'}`} />
                        <span className="truncate">{lawyer.location || lawyer.bar_association}</span>
                        
                        {/* Distance Badge */}
                        {locationEnabled && lawyer.distance && (
                          <span className="ml-auto px-1.5 py-0.5 bg-sky-100 text-sky-700 text-[10px] rounded-md">
                            {lawyer.distance < 1 
                              ? `${(lawyer.distance * 1000).toFixed(0)}m` 
                              : `${lawyer.distance.toFixed(1)}km`}
                          </span>
                        )}
                      </div>
                      
                      <div className={`flex items-center text-xs ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        <FaPhoneAlt className={`w-3 h-3 mr-1.5 ${isDarkMode ? 'text-sky-400' : 'text-sky-500'}`} />
                        <span className="truncate">{lawyer.phone_number}</span>
                      </div>
                      
                      <div className={`flex items-center text-xs ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        <FaEnvelope className={`w-3 h-3 mr-1.5 ${isDarkMode ? 'text-sky-400' : 'text-sky-500'}`} />
                        <span className="truncate">{lawyer.email}</span>
                      </div>
                    </div>
                    
                    {/* Action Buttons - More Compact */}
                    <div className="flex gap-2 mt-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => viewLawyerDetails(lawyer)}
                        className={`flex-1 py-1.5 px-2 text-xs border rounded-md transition-all duration-200 flex items-center justify-center gap-1 ${
                          isDarkMode 
                            ? 'border-sky-500/50 text-sky-400 hover:bg-slate-700/50' 
                            : 'border-sky-600/50 text-sky-600 hover:bg-sky-50'
                        }`}
                      >
                        <FaUserCheck className="text-[10px]" />
                        Details
                      </button>
                      <button
                        onClick={() => startBooking(lawyer)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-gradient-to-r from-sky-600 to-sky-700 text-white text-xs rounded-md hover:from-sky-700 hover:to-sky-800 transition-all duration-200 shadow-sm"
                      >
                        <FaCalendarAlt className="text-[10px]" />
                        Book Now
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
        <div className={`rounded-2xl shadow-lg overflow-hidden mb-12 border transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="relative h-64 md:h-80">
            {/* Professional Background Image */}
            <div className="w-full h-full overflow-hidden">
              <img 
                src={backgroundImages[selectedLawyer.id] || "https://t4.ftcdn.net/jpg/08/52/61/01/360_F_852610192_mDCPHk42G9qHrROdQYx93eHuk5AMFpQQ.jpg"} 
                alt={`${selectedLawyer.specialization} background`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  console.error('Detail view image failed to load:', backgroundImages[selectedLawyer.id]);
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src = "https://t4.ftcdn.net/jpg/08/52/61/01/360_F_852610192_mDCPHk42G9qHrROdQYx93eHuk5AMFpQQ.jpg";
                }}
              />
            </div>
            
            <button
              onClick={goBack}
              className={`absolute top-6 left-6 p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 z-10 ${
                isDarkMode 
                  ? 'bg-slate-800 bg-opacity-90 hover:bg-opacity-100 hover:bg-sky-700' 
                  : 'bg-white bg-opacity-90 hover:bg-opacity-100 hover:bg-sky-50'
              }`}
              aria-label="Go back to lawyers list"
            >
              <FaArrowLeft className={`${isDarkMode ? 'text-sky-400' : 'text-sky-600'} text-lg`} />
            </button>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-white">{selectedLawyer.full_name}</h1>
                {selectedLawyer.is_verified && (
                  <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <FaShieldAlt />
                    Verified
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  {renderStars(selectedLawyer.reviews_count > 0 ? 4.5 : 0)}
                </div>
                <span className="text-white text-lg font-medium">
                  {selectedLawyer.reviews_count > 0 ? `(${selectedLawyer.reviews_count})` : '(New)'}
                </span>
                <span className="text-white/80">• {selectedLawyer.appointments_count || 0} appointments</span>
              </div>
              <p className="text-white/90 text-lg">{selectedLawyer.specialization} Specialist</p>
            </div>
          </div>
          
          <div className="p-8">
            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className={`rounded-xl p-4 text-center border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-slate-700/50 border-sky-800' 
                  : 'bg-gradient-to-br from-sky-50 to-sky-100 border-sky-200'
              }`}>
                <FaBriefcase className={`text-2xl mx-auto mb-2 ${
                  isDarkMode ? 'text-sky-400' : 'text-sky-600'
                }`} />
                <p className={`text-sm ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>Experience</p>
                <p className={`font-bold ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-800'
                }`}>{selectedLawyer.years_of_experience} years</p>
              </div>
              <div className={`rounded-xl p-4 text-center border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-slate-700/50 border-emerald-800' 
                  : 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200'
              }`}>
                <FaMoneyBillWave className={`text-2xl mx-auto mb-2 ${
                  isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                }`} />
                <p className={`text-sm ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>Rate</p>
                <p className={`font-bold ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-800'
                }`}>₹{selectedLawyer.consultation_fee}/hr</p>
              </div>
              <div className={`rounded-xl p-4 text-center border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-slate-700/50 border-amber-800' 
                  : 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200'
              }`}>
                <FaBolt className={`text-2xl mx-auto mb-2 ${
                  isDarkMode ? 'text-amber-400' : 'text-amber-600'
                }`} />
                <p className={`text-sm ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>License</p>
                <p className={`font-bold ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-800'
                }`}>{selectedLawyer.license_number}</p>
              </div>
              <div className={`rounded-xl p-4 text-center border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-slate-700/50 border-purple-800' 
                  : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'
              }`}>
                <FaRegClock className={`text-2xl mx-auto mb-2 ${
                  isDarkMode ? 'text-purple-400' : 'text-purple-600'
                }`} />
                <p className={`text-sm ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>Appointments</p>
                <p className={`font-bold ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-800'
                }`}>{selectedLawyer.appointments_count || 0}</p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-800'
                }`}>
                  <FaGraduationCap className={isDarkMode ? 'text-sky-400' : 'text-sky-600'} />
                  About {selectedLawyer.full_name.split(' ')[0]}
                </h3>
                <p className={`leading-relaxed text-lg ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>{selectedLawyer.bio || `${selectedLawyer.full_name} is an experienced ${selectedLawyer.specialization} lawyer with ${selectedLawyer.years_of_experience} years of practice.`}</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-800'
                  }`}>
                    <FaMapMarkerAlt className={isDarkMode ? 'text-sky-400' : 'text-sky-600'} />
                    Location & Contact
                  </h3>
                  <div className="space-y-3">
                    <p className={`flex items-center gap-2 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      <span className="w-2 h-2 bg-sky-500 rounded-full"></span>
                      {selectedLawyer.bar_association}
                    </p>
                    <p className={`flex items-center gap-2 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      <FaPhoneAlt className="text-sm" />
                      {selectedLawyer.phone_number}
                    </p>
                    <p className={`flex items-center gap-2 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      <FaEnvelope className="text-sm" />
                      {selectedLawyer.email}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-800'
                  }`}>
                    <FaRegClock className={isDarkMode ? 'text-sky-400' : 'text-sky-600'} />
                    Consultation Details
                  </h3>
                  <div className="space-y-3">
                    <p className={`flex items-center gap-2 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      <span className="w-2 h-2 bg-sky-500 rounded-full"></span>
                      Consultation Fee: ₹{selectedLawyer.consultation_fee}/hr
                    </p>
                    <p className={`flex items-center gap-2 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      <span className="w-2 h-2 bg-sky-500 rounded-full"></span>
                      Specialization: {selectedLawyer.specialization}
                    </p>
                    <p className={`flex items-center gap-2 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      <span className="w-2 h-2 bg-sky-500 rounded-full"></span>
                      License Number: {selectedLawyer.license_number}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Availability Slots */}
              <div>
                <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-800'
                }`}>
                  <FaCalendarAlt className={isDarkMode ? 'text-sky-400' : 'text-sky-600'} />
                  Available Slots
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-xl border text-center ${
                        isDarkMode 
                          ? 'bg-slate-700 border-slate-600 text-slate-300' 
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <p className="font-medium">{day}</p>
                      <p className="text-sm">9:00 AM - 5:00 PM</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Book Now Button */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => startBooking(selectedLawyer)}
                  className="px-8 py-4 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-xl shadow-lg transition-all duration-200 flex items-center gap-2 font-medium text-lg"
                >
                  <FaCalendarCheck />
                  Book Consultation Now
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (view === 'booking' && selectedLawyer) {
      return (
        <div className={''}>
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
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center mr-4 ${
                            isDarkMode ? 'bg-slate-700 text-sky-400 shadow-lg shadow-slate-900/50' : 'bg-sky-100 text-sky-600 shadow-md shadow-sky-200/50'
                          }`}>
                            {selectedLawyer.profile_picture_url ? (
                              <img 
                                src={selectedLawyer.profile_picture_url} 
                                alt={selectedLawyer.full_name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <FaUserTie className="text-2xl" />
                            )}
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
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8" ref={contentRef}>
        <div className="mb-8 sure">
          {/* <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Find Your Legal Expert
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Connect with experienced lawyers specialized in various legal domains
          </p> */}
        </div>
        
        {renderView()}
      </div>
    </div>
  );
};

export default LegalCosultation;