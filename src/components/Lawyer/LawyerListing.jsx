import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
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
  FaEnvelope
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
    'Rajesh Kumar',
    'Priya Sharma',
    'Vikram Singh',
    'Ananya Patel',
    'Arjun Mehta',
    'Neha Gupta',
    'Sanjay Verma',
    'Divya Joshi',
    'Rahul Malhotra',
    'Meera Kapoor',
    'Aditya Reddy',
    'Kavita Nair'
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
 * LawyerListing Component
 * 
 * This component fetches and displays a list of lawyers from the API,
 * with filtering, pagination, and detailed view functionality.
 */
const LawyerListing = () => {
  // Get dark mode state from Redux
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';
  const currentTheme = isDarkMode ? colors.dark : colors.light;
  
  // State for lawyers data
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
  const [bookingComplete, setBookingComplete] = useState(false);
  
  // API base URL - should be configured in your environment
  const baseUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
  
  // Fetch lawyers from API
  useEffect(() => {
    fetchLawyers();
  }, [currentPage, selectedCategory]);

  /**
   * Fetch lawyers from the API with optional filtering
   */
  const fetchLawyers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use the sample data
      console.log('Fetching lawyers with category:', selectedCategory, 'and page:', currentPage);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
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
      
      // Paginate the data
      const perPage = 6;
      const totalItems = filteredData.length;
      const totalPagesCount = Math.ceil(totalItems / perPage);
      
      // Get the current page of data
      const startIndex = (currentPage - 1) * perPage;
      const paginatedData = filteredData.slice(startIndex, startIndex + perPage);
      
      // Set the data in state
      setLawyers(paginatedData);
      setTotalPages(totalPagesCount);
      
      // In a real implementation with a backend API, you would do something like:
      /*
      const params = new URLSearchParams();
      if (currentPage > 1) {
        params.append('page', currentPage);
      }
      if (selectedCategory !== 'All') {
        params.append('specialization', selectedCategory);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      const response = await axios.get(`${baseUrl}/api/lawyers?${params.toString()}`);
      
      if (response.data && response.data.success) {
        const responseData = response.data.data;
        setLawyers(responseData.data || []);
        setTotalPages(Math.ceil((responseData.total || responseData.data.length) / (responseData.per_page || 10)));
        
        if (responseData.current_page) {
          setCurrentPage(responseData.current_page);
        }
      } else {
        throw new Error('Failed to fetch lawyers data');
      }
      */
    } catch (err) {
      console.error('Error fetching lawyers:', err);
      setError('Failed to load lawyers. Please try again later.');
      setLawyers([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchLawyers();
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

  // Function to handle booking form submission
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (bookingStep === 1) {
      if (bookingDate && bookingTime) {
        setBookingStep(2);
      }
    } else if (bookingStep === 2) {
      setBookingComplete(true);
    }
  };

  // Function to view lawyer details
  const viewLawyerDetails = (lawyer) => {
    setSelectedLawyer(lawyer);
    setView('detail');
    
    // Scroll to top when viewing details
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Function to start booking process
  const startBooking = (lawyer) => {
    setSelectedLawyer(lawyer);
    setView('booking');
    setBookingStep(1);
    setBookingComplete(false);
    
    // Scroll to top when starting booking
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Function to go back to previous view
  const goBack = () => {
    if (view === 'detail') {
      setView('lawyers');
    } else if (view === 'booking') {
      if (bookingStep > 1 && !bookingComplete) {
        setBookingStep(bookingStep - 1);
      } else if (bookingComplete) {
        setView('lawyers');
        setBookingComplete(false);
        setBookingStep(1);
      } else {
        setView('detail');
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
          {/* Enhanced Filter Bar */}
          <div
            className={`rounded-2xl border p-3 mb-4 mt-0 transition-all duration-300 backdrop-blur-sm ${
              isDarkMode 
                ? `bg-slate-800/90 border-slate-700 ${isFilterSticky ? 'sticky z-30 shadow-2xl border-sky-700 rounded-t-none border-t-0' : ''}` 
                : `bg-gray-100 border-slate-200 ${isFilterSticky ? 'sticky z-30 shadow-2xl border-sky-200 rounded-t-none border-t-0' : ''}`
            }`}
            style={{ top: isFilterSticky ? '60px' : '0' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <div className="md:hidden">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 rounded-xl text-white flex items-center gap-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 transition-all duration-200 shadow-lg"
                >
                  {showFilters ? <FaTimes /> : <FaSearch />}
                  {showFilters ? 'Close' : 'Filter'}
                </button>
              </div>
            </div>

            {/* Filter Inputs */}
            <div
              className={`flex flex-col md:flex-row items-center gap-6 w-full transition-all duration-300 ${
                showFilters
                  ? 'max-h-96 opacity-100'
                  : 'max-h-0 md:max-h-96 overflow-hidden md:overflow-visible opacity-0 md:opacity-100'
              }`}
            >
              {/* Enhanced Search Input */}
              <form onSubmit={handleSearch} className="relative w-full mt-3 md:flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className={`${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                </div>
                <input
                  type="text"
                  placeholder="Search lawyers by name or expertise..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent shadow-sm transition-all duration-200 ${
                    isDarkMode 
                      ? 'border-slate-600 bg-slate-700 text-slate-200 placeholder-slate-500' 
                      : 'border-slate-300 bg-white text-slate-700 placeholder-slate-400'
                  }`}
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                >
                  Search
                </button>
              </form>

              {/* Enhanced Category Buttons */}
              <div className="w-full mb-6 md:w-auto overflow-x-auto">
                <div className="flex gap-3 py-2 min-w-max">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCurrentPage(1); // Reset to first page when changing category
                      }}
                      className={`px-6 py-3 text-sm font-medium rounded-xl whitespace-nowrap transition-all duration-200 ${
                        selectedCategory === cat
                          ? 'text-white bg-gradient-to-r from-sky-500 to-sky-600 shadow-lg transform scale-105'
                          : isDarkMode
                            ? 'text-slate-300 bg-slate-700 hover:bg-slate-600 hover:text-slate-200 border border-slate-600'
                            : 'text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-700 border border-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
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

          {/* Lawyers Grid */}
          {!loading && !error && lawyers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {lawyers.map((lawyer) => (
                <div
                  key={lawyer.id}
                  className={`group rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border transform hover:-translate-y-1 ${
                    isDarkMode 
                      ? 'bg-slate-800 border-slate-700 hover:border-sky-700' 
                      : 'bg-white border-slate-200 hover:border-sky-200'
                  }`}
                >
                  <div className="relative">
                    {/* Background Image */}
                    <div className="w-full h-48 bg-gradient-to-r from-sky-500 to-indigo-600 group-hover:scale-105 transition-transform duration-300"></div>

                    {/* Top right badges */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      {lawyer.is_verified && (
                        <div className="bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
                          <FaShieldAlt className="text-xs" />
                          Verified
                        </div>
                      )}
                      <div className={`px-2 py-1 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm ${
                        isDarkMode 
                          ? 'bg-slate-700 bg-opacity-90 text-slate-200' 
                          : 'bg-white bg-opacity-90 text-slate-700'
                      }`}>
                        ₹{lawyer.consultation_fee}/hr
                      </div>
                    </div>

                    {/* Bottom overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex justify-between items-end">
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

                      {/* Rating on the right */}
                      <div className="flex items-center gap-1 text-white text-sm">
                        {renderStars(lawyer.reviews_count > 0 ? 4.5 : 0)}
                        <span className="ml-1">
                          {lawyer.reviews_count > 0 ? `(${lawyer.reviews_count})` : '(New)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`text-xl font-bold flex items-center gap-2 ${
                        isDarkMode ? 'text-slate-200' : 'text-slate-800'
                      }`}>
                        <FaUserTie className={isDarkMode ? 'text-sky-400' : 'text-sky-600'} />
                        {lawyer.full_name}
                      </h3>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className={`flex items-center gap-2 ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        <FaBriefcase className={isDarkMode ? 'text-sky-400 text-sm' : 'text-sky-500 text-sm'} />
                        <span className="text-sm">{lawyer.years_of_experience} years • {lawyer.specialization}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        <FaMapMarkerAlt className={isDarkMode ? 'text-sky-400 text-sm' : 'text-sky-500 text-sm'} />
                        <span className="text-sm">{lawyer.bar_association}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        <FaEnvelope className={isDarkMode ? 'text-sky-400 text-sm' : 'text-sky-500 text-sm'} />
                        <span className="text-sm">{lawyer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-sky-500 to-sky-600 text-white text-xs font-medium">
                          {lawyer.specialization}
                        </span>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                          isDarkMode 
                            ? 'bg-slate-700 text-slate-300' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          <FaPhoneAlt className="text-xs" />
                          {lawyer.phone_number}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => viewLawyerDetails(lawyer)}
                        className={`flex-1 py-3 px-4 border rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium ${
                          isDarkMode 
                            ? 'border-sky-500 text-sky-400 hover:bg-slate-700' 
                            : 'border-sky-600 text-sky-600 hover:bg-sky-50'
                        }`}
                      >
                        <FaUserCheck />
                        View Details
                      </button>
                      <button
                        onClick={() => startBooking(lawyer)}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-sky-700 text-white text-sm rounded-lg hover:bg-sky-800 transition-all duration-200 shadow-md font-medium"
                      >
                        <FaCalendarAlt className="text-xs" />
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Enhanced Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mb-12">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-xl border disabled:opacity-50 transition-all duration-200 shadow-sm ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' 
                    : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FaChevronLeft />
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                // Calculate page numbers to show (centered around current page)
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else {
                  const startPage = Math.max(1, currentPage - 2);
                  const endPage = Math.min(totalPages, startPage + 4);
                  pageNum = startPage + i;
                  
                  // Adjust if we're at the end
                  if (pageNum > totalPages) {
                    return null;
                  }
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg'
                        : isDarkMode
                          ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
                          : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className={`text-${isDarkMode ? 'slate-400' : 'slate-600'}`}>...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
                        : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-xl border disabled:opacity-50 transition-all duration-200 shadow-sm ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' 
                    : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FaChevronRight />
              </button>
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
            {/* Background gradient instead of image */}
            <div className="w-full h-full bg-gradient-to-r from-sky-500 to-indigo-600"></div>
            
            <button
              onClick={goBack}
              className={`absolute top-6 left-6 p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-slate-800 bg-opacity-90 hover:bg-opacity-100' 
                  : 'bg-white bg-opacity-90 hover:bg-opacity-100'
              }`}
            >
              <FaArrowLeft className={isDarkMode ? 'text-slate-300' : 'text-slate-700'} />
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
        <div className={`rounded-2xl shadow-lg overflow-hidden mb-12 border transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200'
        }`}>
          {/* Booking Header */}
          <div className={`p-6 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <div className="flex items-center gap-4">
              <button
                onClick={goBack}
                className={`p-3 rounded-xl ${
                  isDarkMode 
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                } transition-all duration-200`}
              >
                <FaArrowLeft />
              </button>
              <div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  {bookingComplete ? 'Booking Confirmed' : `Book Consultation with ${selectedLawyer.full_name}`}
                </h2>
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                  {bookingComplete 
                    ? 'Your consultation has been scheduled successfully' 
                    : bookingStep === 1 
                      ? 'Step 1: Select Date & Time' 
                      : 'Step 2: Enter Your Details'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Booking Content */}
          <div className="p-6">
            {bookingComplete ? (
              <div className="text-center py-8">
                <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 ${
                  isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'
                }`}>
                  <FaCheckCircle className="text-4xl" />
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  Booking Confirmed!
                </h3>
                <p className={`mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Your consultation with {selectedLawyer.full_name} has been scheduled for:
                </p>
                <div className={`inline-block rounded-xl p-6 mb-8 ${
                  isDarkMode ? 'bg-slate-700' : 'bg-slate-100'
                }`}>
                  <p className={`text-xl font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    {bookingDate ? new Date(bookingDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'Date not selected'}
                  </p>
                  <p className={`text-lg ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    {bookingTime || 'Time not selected'}
                  </p>
                </div>
                <p className={`mb-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  You will receive a confirmation email with all the details shortly.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      setView('lawyers');
                      setBookingComplete(false);
                      setBookingStep(1);
                    }}
                    className={`px-6 py-3 rounded-xl font-medium ${
                      isDarkMode 
                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    } transition-all duration-200`}
                  >
                    Back to Lawyers
                  </button>
                  <button
                    onClick={() => {
                      // Here you would implement calendar integration
                      alert('Calendar integration would be implemented here');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-xl shadow-lg transition-all duration-200 font-medium"
                  >
                    Add to Calendar
                  </button>
                </div>
              </div>
            ) : bookingStep === 1 ? (
              <form onSubmit={handleBookingSubmit} className="space-y-8">
                {/* Date Selection */}
                <div>
                  <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
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
              <form onSubmit={handleBookingSubmit} className="space-y-6">
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
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={bookingFormData.name}
                      onChange={(e) => setBookingFormData({...bookingFormData, name: e.target.value})}
                      required
                      className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 ${
                        isDarkMode 
                          ? 'bg-slate-700 border-slate-600 text-slate-200' 
                          : 'bg-white border-slate-300 text-slate-800'
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={bookingFormData.email}
                      onChange={(e) => setBookingFormData({...bookingFormData, email: e.target.value})}
                      required
                      className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 ${
                        isDarkMode 
                          ? 'bg-slate-700 border-slate-600 text-slate-200' 
                          : 'bg-white border-slate-300 text-slate-800'
                      }`}
                      placeholder="Enter your email address"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={bookingFormData.phone}
                      onChange={(e) => setBookingFormData({...bookingFormData, phone: e.target.value})}
                      required
                      className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 ${
                        isDarkMode 
                          ? 'bg-slate-700 border-slate-600 text-slate-200' 
                          : 'bg-white border-slate-300 text-slate-800'
                      }`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Case Details
                    </label>
                    <textarea
                      value={bookingFormData.caseDetails}
                      onChange={(e) => setBookingFormData({...bookingFormData, caseDetails: e.target.value})}
                      required
                      rows={4}
                      className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 ${
                        isDarkMode 
                          ? 'bg-slate-700 border-slate-600 text-slate-200' 
                          : 'bg-white border-slate-300 text-slate-800'
                      }`}
                      placeholder="Briefly describe your case or legal issue"
                    ></textarea>
                  </div>
                </div>
                
                {/* Confirm Booking Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-xl shadow-lg transition-all duration-200 font-medium flex items-center gap-2"
                  >
                    Confirm Booking
                    <FaCalendarCheck />
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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Find Your Legal Expert
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Connect with experienced lawyers specialized in various legal domains
          </p>
        </div>
        
        {renderView()}
      </div>
    </div>
  );
};

export default LawyerListing;