import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
  FaStarHalfAlt
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

// Example images
const demoImage = 'https://t4.ftcdn.net/jpg/08/52/61/01/360_F_852610192_mDCPHk42G9qHrROdQYx93eHuk5AMFpQQ.jpg';
const demoprofileImage = 'https://kanoongurus.com/public/lawyers_avatar/1636448766_lawyer-profile.png';

// Data 
const categories = [
  'All',
  'Criminal',
  'Family',
  'Corporate',
  'Immigration',
  'Civil',
];

const lawyers = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: `${['Sarah Johnson', 'Michael Chen', 'David Rodriguez', 'Emily Williams', 'James Thompson', 'Lisa Anderson', 'Robert Kim', 'Amanda Davis', 'Christopher Lee', 'Jennifer Brown', 'Daniel Wilson', 'Maria Garcia'][i]}`,
  category: categories[i % categories.length === 0 ? 1 : i % categories.length],
  location: ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA'][i % 6],
  experience: `${5 + (i % 8)} years`,
  rating: 4 + (i % 2 === 0 ? 0.5 : 0),
  image: demoImage,
  profileImage:demoprofileImage,
  hourlyRate: 150 + (i * 15),
  availability: ['Mon', 'Wed', 'Fri'],
  bio: `Experienced ${categories[i % categories.length === 0 ? 1 : i % categories.length]} lawyer with a proven track record of success. Specializing in complex cases with a client-centered approach and over ${5 + (i % 8)} years of dedicated practice.`,
  consultationLength: 60,
  verified: i % 3 === 0,
  responseTime: `${1 + (i % 4)} hours`,
  cases: 50 + (i * 10),
}));

// Time slots
const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

// Main App Component
const LawyerBookingApp = () => {
  // Get dark mode state from Redux
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';
  const currentTheme = isDarkMode ? colors.dark : colors.light;
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
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
  const perPage = 6;

  // Filter lawyers
  const filteredLawyers = lawyers.filter(
    (lawyer) =>
      (selectedCategory === 'All' || lawyer.category === selectedCategory) &&
      lawyer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginate lawyers
  const paginatedLawyers = filteredLawyers.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );
  const totalPages = Math.ceil(filteredLawyers.length / perPage);

  // Handle sticky filter bar
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      // Lower threshold to make filter bar stick sooner
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
  };

  // Function to start booking process
  const startBooking = (lawyer) => {
    setSelectedLawyer(lawyer);
    setView('booking');
    setBookingStep(1);
    setBookingComplete(false);
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

  // Render star rating
  const renderStars = (rating) => {
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

  // Render different views based on the current state
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
              {/* <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-lg">
                  <FaFilter className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                    Find Your Lawyer
                  </h2>
                  <p className="text-slate-600 text-sm">Discover expert legal professionals tailored to your needs</p>
                </div>
              </div> */}

              {/* Mobile Toggle */}
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
              <div className="relative w-full mt-3 md:flex-1">
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
              </div>

              {/* Enhanced Category Buttons */}
              <div className="w-full mb6 md:w-auto overflow-x-auto">
                <div className="flex gap-3 py-2 min-w-max">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
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

          {/* Results Summary */}
      
          {/* Enhanced Lawyers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {paginatedLawyers.map((lawyer) => (
              <div
                key={lawyer.id}
                className={`group rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border transform hover:-translate-y-1 ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-700 hover:border-sky-700' 
                    : 'bg-white border-slate-200 hover:border-sky-200'
                }`}
              >
                <div className="relative">
                  <img
                    src={lawyer.image}
                    alt={lawyer.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-md"
                  />

                  {/* Top right badges */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    {lawyer.verified && (
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
                      ₹{lawyer.hourlyRate}/hr
                    </div>
                  </div>

                  {/* Bottom overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex justify-between items-end">
                    
                    {/* Circular profile image */}
                    <img
                      src={lawyer.profileImage || lawyer.image} // fallback if profileImage is not provided
                      alt={lawyer.name}
                      className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                    />

                    {/* Rating on the right */}
                    <div className="flex items-center gap-1 text-white text-sm">
                      {renderStars(lawyer.rating)}
                      <span className="ml-1">({lawyer.rating})</span>
                    </div>
                  </div>
                </div>

                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-xl font-bold flex items-center gap-2 ${
                      isDarkMode ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      <FaUserTie className={isDarkMode ? 'text-sky-400' : 'text-sky-600'} />
                      {lawyer.name}
                    </h3>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className={`flex items-center gap-2 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      <FaBriefcase className={isDarkMode ? 'text-sky-400 text-sm' : 'text-sky-500 text-sm'} />
                      <span className="text-sm">{lawyer.experience} • {lawyer.cases}+ cases</span>
                    </div>
                    <div className={`flex items-center gap-2 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      <FaMapMarkerAlt className={isDarkMode ? 'text-sky-400 text-sm' : 'text-sky-500 text-sm'} />
                      <span className="text-sm">{lawyer.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-sky-500 to-sky-600 text-white text-xs font-medium">
                        {lawyer.category} Law
                      </span>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                        isDarkMode 
                          ? 'bg-slate-700 text-slate-300' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        <FaBolt className="text-xs" />
                        {lawyer.responseTime}
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

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
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
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    currentPage === i + 1
                      ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg'
                      : isDarkMode
                        ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
                        : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
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
            <img
              src={selectedLawyer.image}
              alt={selectedLawyer.name}
              className="w-full h-full object-cover"
            />
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
                <h1 className="text-3xl md:text-4xl font-bold text-white">{selectedLawyer.name}</h1>
                {selectedLawyer.verified && (
                  <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <FaShieldAlt />
                    Verified
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  {renderStars(selectedLawyer.rating)}
                </div>
                <span className="text-white text-lg font-medium">({selectedLawyer.rating})</span>
                <span className="text-white/80">• {selectedLawyer.cases}+ cases won</span>
              </div>
              <p className="text-white/90 text-lg">{selectedLawyer.category} Law Specialist</p>
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
                }`}>{selectedLawyer.experience}</p>
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
                }`}>₹{selectedLawyer.hourlyRate}/hr</p>
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
                }`}>Response</p>
                <p className={`font-bold ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-800'
                }`}>{selectedLawyer.responseTime}</p>
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
                }`}>Consultation</p>
                <p className={`font-bold ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-800'
                }`}>{selectedLawyer.consultationLength} min</p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-800'
                }`}>
                  <FaGraduationCap className={isDarkMode ? 'text-sky-400' : 'text-sky-600'} />
                  About {selectedLawyer.name.split(' ')[0]}
                </h3>
                <p className={`leading-relaxed text-lg ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>{selectedLawyer.bio}</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-800'
                  }`}>
                    <FaMapMarkerAlt className={isDarkMode ? 'text-sky-400' : 'text-sky-600'} />
                    Location & Availability
                  </h3>
                  <div className="space-y-3">
                    <p className={`flex items-center gap-2 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      <span className="w-2 h-2 bg-sky-500 rounded-full"></span>
                      {selectedLawyer.location}
                    </p>
                    <div className="flex gap-2">
                      {selectedLawyer.availability.map((day) => (
                        <span key={day} className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          isDarkMode 
                            ? 'bg-sky-900/50 text-sky-300' 
                            : 'bg-sky-100 text-sky-700'
                        }`}>
                          {day}
                        </span>
                      ))}
                    </div>
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
                    <div className={`flex items-center justify-between p-3 rounded-lg ${
                      isDarkMode ? 'bg-slate-700' : 'bg-slate-50'
                    }`}>
                      <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>Duration</span>
                      <span className={`font-medium ${
                        isDarkMode ? 'text-slate-200' : 'text-slate-800'
                      }`}>{selectedLawyer.consultationLength} minutes</span>
                    </div>
                    <div className={`flex items-center justify-between p-3 rounded-lg ${
                      isDarkMode ? 'bg-slate-700' : 'bg-slate-50'
                    }`}>
                      <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>Fee</span>
                      <span className={`font-medium ${
                        isDarkMode ? 'text-slate-200' : 'text-slate-800'
                      }`}>₹{selectedLawyer.hourlyRate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`mt-10 pt-8 border-t ${
              isDarkMode ? 'border-slate-700' : 'border-slate-200'
            }`}>
              <button
                onClick={() => startBooking(selectedLawyer)}
                className="w-full py-4 px-6 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl flex items-center justify-center gap-3 hover:from-sky-600 hover:to-sky-700 transition-all duration-200 text-lg font-semibold shadow-lg"
              >
                <FaCalendarAlt />
                Book Consultation with {selectedLawyer.name.split(' ')[0]}
              </button>
            </div>
          </div>
        </div>
      );
    } else if (view === 'booking' && selectedLawyer) {
     if (bookingComplete) {
        return (
          <div className={`rounded-2xl shadow-lg p-8 md:p-12 mb-12 text-center border transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-slate-200'
          }`}>
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <FaCheckCircle className="text-white text-3xl" />
            </div>
            <h2 className={`text-3xl font-bold mb-4 ${
              isDarkMode ? 'text-slate-200' : 'text-slate-800'
            }`}>Booking Confirmed!</h2>
            <p className={`mb-8 text-lg leading-relaxed ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Your consultation with <span className={`font-semibold ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>{selectedLawyer.name}</span> has been successfully scheduled for{' '}
              <span className={`font-semibold ${
                isDarkMode ? 'text-sky-400' : 'text-sky-600'
              }`}>
                {bookingDate && new Date(bookingDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>{' '}
              at <span className={`font-semibold ${
                isDarkMode ? 'text-sky-400' : 'text-sky-600'
              }`}>{bookingTime}</span>.
            </p>
            
            <div className={`rounded-2xl p-8 mb-8 border transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-slate-700 border-slate-600' 
                : 'bg-gradient-to-br from-sky-50 to-sky-100 border-sky-200'
            }`}>
              <h3 className="text-xl font-bold text-slate-800 mb-6">Appointment Summary</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500 uppercase tracking-wide">Lawyer</p>
                    <p className="font-semibold text-slate-800 text-lg">{selectedLawyer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 uppercase tracking-wide">Specialization</p>
                    <p className="font-semibold text-slate-800">{selectedLawyer.category} Law</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500 uppercase tracking-wide">Date & Time</p>
                    <p className="font-semibold text-slate-800">
                      {bookingDate && new Date(bookingDate).toLocaleDateString()} at {bookingTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 uppercase tracking-wide">Duration</p>
                    <p className="font-semibold text-slate-800">{selectedLawyer.consultationLength} minutes</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setView('lawyers')}
                className="px-8 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all duration-200 font-medium"
              >
                Find More Lawyers
              </button>
              <button className="px-8 py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl hover:from-sky-600 hover:to-sky-700 transition-all duration-200 font-medium shadow-lg">
                View My Bookings
              </button>
            </div>
          </div>
        );
      } else {
        return (
          <div className={`rounded-2xl shadow-lg overflow-hidden mb-12 border transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-slate-200'
          }`}>
            <div className={`relative p-6 border-b transition-colors duration-300 ${
              isDarkMode 
                ? 'border-slate-700 bg-gradient-to-r from-slate-800 to-slate-700' 
                : 'border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100'
            }`}>
              <button
                onClick={goBack}
                className={`absolute top-6 left-6 p-2 rounded-full shadow-md transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-slate-700 hover:bg-slate-600' 
                    : 'bg-white hover:bg-slate-50'
                }`}
              >
                <FaArrowLeft className={isDarkMode ? 'text-slate-300' : 'text-slate-600'} />
              </button>
              <h2 className={`text-2xl font-bold text-center ${
                isDarkMode ? 'text-slate-200' : 'text-slate-800'
              }`}>
                Book Consultation
              </h2>
              <p className={`text-center mt-2 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Schedule your appointment with {selectedLawyer?.name}
              </p>
            </div>
            
            {/* Booking Progress */}
            <div className={`p-6 border-b transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-slate-700 to-slate-800 border-slate-700' 
                : 'bg-gradient-to-r from-sky-50 to-sky-100 border-slate-200'
            }`}>
              <div className="flex items-center justify-between max-w-md mx-auto">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold transition-all duration-300 ${
                    bookingStep >= 1 
                      ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg' 
                      : isDarkMode
                        ? 'bg-slate-600 text-slate-400'
                        : 'bg-slate-200 text-slate-500'
                  }`}>
                    1
                  </div>
                  <span className={`text-xs mt-2 font-medium ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>Date & Time</span>
                </div>
                
                <div className={`h-1 flex-1 mx-3 rounded-full transition-all duration-300 ${
                  bookingStep >= 2 
                    ? 'bg-gradient-to-r from-sky-400 to-sky-600' 
                    : isDarkMode ? 'bg-slate-600' : 'bg-slate-300'
                }`}></div>
                
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold transition-all duration-300 ${
                    bookingStep >= 2 
                      ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg' 
                      : isDarkMode
                        ? 'bg-slate-600 text-slate-400'
                        : 'bg-slate-200 text-slate-500'
                  }`}>
                    2
                  </div>
                  <span className={`text-xs mt-2 font-medium ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>Your Details</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 md:p-8">
              <div className={`flex items-center gap-4 mb-8 p-4 rounded-2xl border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-slate-700 border-slate-600' 
                  : 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200'
              }`}>
                <img
                  src={selectedLawyer.image}
                  alt={selectedLawyer.name}
                  className={`w-16 h-16 rounded-full object-cover shadow-md border-2 ${
                    isDarkMode ? 'border-slate-600' : 'border-white'
                  }`}
                />
                <div>
                  <h3 className={`font-bold text-xl ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-800'
                  }`}>{selectedLawyer.name}</h3>
                  <p className={`flex items-center gap-2 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    <FaBriefcase className={isDarkMode ? 'text-sky-400' : 'text-sky-500'} />
                    {selectedLawyer.category} Law Specialist
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex text-amber-400">
                      {Array.from({ length: selectedLawyer.rating }).map((_, idx) => (
                        <FaStar key={idx} className="text-sm" />
                      ))}
                    </div>
                    <span className={`text-sm ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>({selectedLawyer.rating}/5)</span>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleBookingSubmit}>
                {bookingStep === 1 ? (
                  <div className="space-y-8">
                    <div>
                      <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${
                        isDarkMode ? 'text-slate-200' : 'text-slate-800'
                      }`}>
                        <FaCalendarAlt className={isDarkMode ? 'text-sky-400' : 'text-sky-500'} /> Select Date
                      </h3>
                      <div className="grid grid-cols-7 gap-2 mb-6">
                        {nextSevenDays.map((day) => (
                          <button
                            type="button"
                            key={day.fullDate}
                            onClick={() => setBookingDate(day.fullDate)}
                            className={`p-3 flex flex-col items-center rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                              bookingDate === day.fullDate
                                ? 'bg-gradient-to-br from-sky-500 to-sky-600 border-sky-400 text-white shadow-lg'
                                : isDarkMode
                                  ? 'bg-slate-700 border-slate-600 text-slate-300 hover:border-sky-700 hover:bg-slate-600'
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-sky-300 hover:bg-sky-50'
                            }`}
                          >
                            <span className={`text-xs font-medium ${
                              bookingDate === day.fullDate ? '' : isDarkMode ? 'text-slate-400' : ''
                            }`}>{day.dayName}</span>
                            <span className="text-xl font-bold">{day.dayNumber}</span>
                            <span className={`text-xs opacity-80 ${
                              bookingDate === day.fullDate ? '' : isDarkMode ? 'text-slate-400' : ''
                            }`}>{day.month}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${
                        isDarkMode ? 'text-slate-200' : 'text-slate-800'
                      }`}>
                        <FaClock className={isDarkMode ? 'text-sky-400' : 'text-sky-500'} /> Select Time
                      </h3>
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                        {timeSlots.map((time) => (
                          <button
                            type="button"
                            key={time}
                            onClick={() => setBookingTime(time)}
                            className={`py-3 px-2 rounded-xl border-2 text-center font-medium transition-all duration-200 hover:shadow-md ${
                              bookingTime === time
                                ? 'bg-gradient-to-br from-sky-500 to-sky-600 border-sky-400 text-white shadow-lg'
                                : isDarkMode
                                  ? 'bg-slate-700 border-slate-600 text-slate-300 hover:border-sky-700 hover:bg-slate-600'
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-sky-300 hover:bg-sky-50'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className={`rounded-2xl p-6 border transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-slate-700 border-slate-600' 
                        : 'bg-gradient-to-br from-sky-50 to-sky-100 border-sky-200'
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full shadow-md ${
                          isDarkMode ? 'bg-slate-800' : 'bg-white'
                        }`}>
                          <FaRegClock className={isDarkMode ? 'text-sky-400 text-xl' : 'text-sky-500 text-xl'} />
                        </div>
                        <div>
                          <h4 className={`font-bold ${
                            isDarkMode ? 'text-slate-200' : 'text-slate-800'
                          }`}>Consultation Details</h4>
                          <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                            Duration: <span className={`font-semibold ${
                              isDarkMode ? 'text-slate-300' : ''
                            }`}>{selectedLawyer.consultationLength} minutes</span>
                          </p>
                          <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                            Fee: <span className={`font-semibold ${
                              isDarkMode ? 'text-sky-400' : 'text-sky-600'
                            }`}>₹{selectedLawyer.hourlyRate}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={!bookingDate || !bookingTime}
                      className="w-full py-4 px-6 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-sky-600 hover:to-sky-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      Continue to Details <FaLongArrowAltRight className="text-lg" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <label className={`block font-semibold mb-3 ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>Full Name *</label>
                      <input
                        type="text"
                        required
                        value={bookingFormData.name}
                        onChange={(e) => setBookingFormData({...bookingFormData, name: e.target.value})}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 ${
                          isDarkMode 
                            ? 'border-slate-600 bg-slate-700 text-slate-200 placeholder-slate-400' 
                            : 'border-slate-200 text-slate-800 placeholder-slate-400'
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label className={`block font-semibold mb-3 ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>Email Address *</label>
                      <input
                        type="email"
                        required
                        value={bookingFormData.email}
                        onChange={(e) => setBookingFormData({...bookingFormData, email: e.target.value})}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 ${
                          isDarkMode 
                            ? 'border-slate-600 bg-slate-700 text-slate-200 placeholder-slate-400' 
                            : 'border-slate-200 text-slate-800 placeholder-slate-400'
                        }`}
                        placeholder="Enter your email address"
                      />
                    </div>
                    
                    <div>
                      <label className={`block font-semibold mb-3 ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={bookingFormData.phone}
                        onChange={(e) => setBookingFormData({...bookingFormData, phone: e.target.value})}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 ${
                          isDarkMode 
                            ? 'border-slate-600 bg-slate-700 text-slate-200 placeholder-slate-400' 
                            : 'border-slate-200 text-slate-800 placeholder-slate-400'
                        }`}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    
                    <div>
                      <label className={`block font-semibold mb-3 ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>Case Details</label>
                      <textarea
                        rows={4}
                        value={bookingFormData.caseDetails}
                        onChange={(e) => setBookingFormData({...bookingFormData, caseDetails: e.target.value})}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 resize-none ${
                          isDarkMode 
                            ? 'border-slate-600 bg-slate-700 text-slate-200 placeholder-slate-400' 
                            : 'border-slate-200 text-slate-800 placeholder-slate-400'
                        }`}
                        placeholder="Briefly describe your legal matter..."
                      ></textarea>
                    </div>
                    
                    <div className={`rounded-2xl p-6 border transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-slate-700 border-slate-600' 
                        : 'bg-gradient-to-br from-sky-50 to-sky-100 border-sky-200'
                    }`}>
                      <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${
                        isDarkMode ? 'text-slate-200' : 'text-slate-800'
                      }`}>
                        <FaCalendarCheck className={isDarkMode ? 'text-sky-400' : 'text-sky-500'} /> Appointment Summary
                      </h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className={`text-sm uppercase tracking-wide mb-1 ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>Date</p>
                          <p className={`font-semibold ${
                            isDarkMode ? 'text-slate-200' : 'text-slate-800'
                          }`}>
                            {bookingDate && new Date(bookingDate).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className={`text-sm uppercase tracking-wide mb-1 ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>Time</p>
                          <p className={`font-semibold ${
                            isDarkMode ? 'text-slate-200' : 'text-slate-800'
                          }`}>{bookingTime}</p>
                        </div>
                        <div className="text-center">
                          <p className={`text-sm uppercase tracking-wide mb-1 ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>Duration</p>
                          <p className={`font-semibold ${
                            isDarkMode ? 'text-slate-200' : 'text-slate-800'
                          }`}>{selectedLawyer.consultationLength} min</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        type="button"
                        onClick={() => setBookingStep(1)}
                        className={`flex-1 px-6 py-3 border-2 rounded-xl transition-all duration-200 font-medium ${
                          isDarkMode 
                            ? 'border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500' 
                            : 'border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                        }`}
                      >
                        <FaArrowLeft className="inline mr-2" />
                        Back to Date & Time
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-sky-600 hover:to-sky-700 transition-all duration-200 shadow-lg"
                      >
                        Confirm Booking <FaCheckCircle />
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 to-slate-800' 
        : 'bg-gradient-to-br from-slate-50 to-slate-100'
    }`}>
      {/* Main Content */}
      <main className="container mx-auto max-w-6xl px-10 py-8 pt-20">
        {renderView()}
      </main>

      {/* Enhanced Mobile Bottom Navigation - Only visible on mobile */}
      {/* <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t border-slate-200 z-50">
        <div className="flex justify-around items-center p-3">
          <button className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-slate-50 transition-colors duration-200">
            <FaUserTie className="text-xl text-sky-500" />
            <span className="text-xs text-slate-600 font-medium">Lawyers</span>
          </button>
          <button className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-slate-50 transition-colors duration-200">
            <FaEnvelopeOpenText className="text-xl text-slate-400" />
            <span className="text-xs text-slate-600 font-medium">Messages</span>
          </button>
          <button className="flex flex-col items-center space-y-1 p-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-sky-500 to-sky-600 flex items-center justify-center shadow-lg -mt-5 hover:from-sky-600 hover:to-sky-700 transition-all duration-200">
              <FaSearch className="text-white text-xl" />
            </div>
          </button>
          <button className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-slate-50 transition-colors duration-200">
            <FaCalendarAlt className="text-xl text-slate-400" />
            <span className="text-xs text-slate-600 font-medium">Bookings</span>
          </button>
          <button className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-slate-50 transition-colors duration-200">
            <FaUserCheck className="text-xl text-slate-400" />
            <span className="text-xs text-slate-600 font-medium">Profile</span>
          </button>
        </div>
      </div> */}
    </div>
  );
};
export default LawyerBookingApp;