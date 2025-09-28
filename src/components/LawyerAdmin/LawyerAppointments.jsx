import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Filter,
  Search,
  ChevronDown,
  MoreHorizontal,
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Shield,
  Video,
  FileText,
  Star,
  Calendar as CalendarIcon,
  Timer,
  Users,
  TrendingUp,
  DollarSign,
  X,
  FilterX,
  Activity,
  Play,
  Zap,
  Bell,
  Maximize2,
  ExternalLink,
  Edit3,
  Trash2,
  Save,
  RadioIcon
} from 'lucide-react';
import Avatar from '../common/Avatar';

// Sample appointment data with realistic today's appointments
const generateSampleAppointments = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Create appointments for different times relative to now
  const currentTime = new Date(today);
  currentTime.setHours(now.getHours() - 1); // Currently running
  
  const soonTime = new Date(today);
  soonTime.setHours(now.getHours(), now.getMinutes() + 30); // Starting soon
  
  const todayLater = new Date(today);
  todayLater.setHours(now.getHours() + 2); // Later today
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0);
  
  return [
    {
      id: 1,
      user_id: "24",
      lawyer_id: "07f53abd-83fc-4fc0-9c7a-d39a7856239a",
      appointment_time: currentTime.toISOString(),
      duration_minutes: 60,
      status: "scheduled",
      created_at: "2025-01-10T18:25:50.000000Z",
      updated_at: "2025-01-10T18:25:50.000000Z",
      user: {
        id: 24,
        name: "Devesh Yadav",
        email: "devesh.yadav@example.com",
        phone: "+91 9876543210"
      },
      lawyer: {
        id: "07f53abd-83fc-4fc0-9c7a-d39a7856239a",
        full_name: "Aditya Gupta"
      },
      consultation_fee: 3000,
      case_type: "Corporate Law",
      priority: "high",
      meeting_type: "video",
      notes: "Initial consultation for startup legal compliance - currently in progress"
    },
    {
      id: 2,
      user_id: "25",
      lawyer_id: "07f53abd-83fc-4fc0-9c7a-d39a7856239a",
      appointment_time: soonTime.toISOString(),
      duration_minutes: 45,
      status: "scheduled",
      created_at: "2025-01-08T10:15:30.000000Z",
      updated_at: "2025-01-15T15:00:00.000000Z",
      user: {
        id: 25,
        name: "Priya Sharma",
        email: "priya.sharma@example.com",
        phone: "+91 9876543211"
      },
      lawyer: {
        id: "07f53abd-83fc-4fc0-9c7a-d39a7856239a",
        full_name: "Aditya Gupta"
      },
      consultation_fee: 2500,
      case_type: "Family Law",
      priority: "medium",
      meeting_type: "video",
      notes: "Divorce proceedings consultation - starting soon"
    },
    {
      id: 3,
      user_id: "26",
      lawyer_id: "07f53abd-83fc-4fc0-9c7a-d39a7856239a",
      appointment_time: todayLater.toISOString(),
      duration_minutes: 30,
      status: "scheduled",
      created_at: "2025-01-12T16:45:20.000000Z",
      updated_at: "2025-01-14T09:30:00.000000Z",
      user: {
        id: 26,
        name: "Rahul Verma",
        email: "rahul.verma@example.com",
        phone: "+91 9876543212"
      },
      lawyer: {
        id: "07f53abd-83fc-4fc0-9c7a-d39a7856239a",
        full_name: "Aditya Gupta"
      },
      consultation_fee: 2000,
      case_type: "Criminal Law",
      priority: "urgent",
      meeting_type: "video",
      notes: "Criminal case consultation - today's appointment"
    },
    {
      id: 4,
      user_id: "27",
      lawyer_id: "07f53abd-83fc-4fc0-9c7a-d39a7856239a",
      appointment_time: tomorrow.toISOString(),
      duration_minutes: 90,
      status: "scheduled",
      created_at: "2025-01-11T12:30:45.000000Z",
      updated_at: "2025-01-13T14:20:00.000000Z",
      user: {
        id: 27,
        name: "Anjali Singh",
        email: "anjali.singh@example.com",
        phone: "+91 9876543213"
      },
      lawyer: {
        id: "07f53abd-83fc-4fc0-9c7a-d39a7856239a",
        full_name: "Aditya Gupta"
      },
      consultation_fee: 4000,
      case_type: "Civil Law",
      priority: "high",
      meeting_type: "office",
      notes: "Property dispute consultation - tomorrow's appointment"
    },
    {
      id: 5,
      user_id: "28",
      lawyer_id: "07f53abd-83fc-4fc0-9c7a-d39a7856239a",
      appointment_time: "2025-01-20T09:30:00.000000Z",
      duration_minutes: 60,
      status: "completed",
      created_at: "2025-01-15T18:25:50.000000Z",
      updated_at: "2025-01-20T10:30:00.000000Z",
      user: {
        id: 28,
        name: "Kartik Sharma",
        email: "kartik.sharma@example.com",
        phone: "+91 9876543214"
      },
      lawyer: {
        id: "07f53abd-83fc-4fc0-9c7a-d39a7856239a",
        full_name: "Aditya Gupta"
      },
      consultation_fee: 3500,
      case_type: "Business Law",
      priority: "medium",
      meeting_type: "office",
      notes: "Business partnership agreement consultation - completed successfully"
    }
  ];
};

const sampleAppointments = generateSampleAppointments();

// Generate additional appointments for load more functionality
const generateMoreAppointments = (existingCount, batchSize = 5) => {
  const now = new Date();
  const additionalAppointments = [];
  
  const names = [
    'Arjun Patel', 'Kavya Reddy', 'Rohit Gupta', 'Sneha Iyer', 'Vikram Singh',
    'Pooja Sharma', 'Akash Kumar', 'Meera Joshi', 'Siddharth Rao', 'Nisha Agarwal',
    'Kiran Mehta', 'Deepak Verma', 'Riya Malhotra', 'Varun Kapoor', 'Tanya Sinha'
  ];
  
  const caseTypes = [
    'Corporate Law', 'Family Law', 'Criminal Law', 'Civil Law', 'Business Law',
    'Property Law', 'Labor Law', 'Tax Law', 'Immigration Law', 'Intellectual Property'
  ];
  
  const priorities = ['urgent', 'high', 'medium', 'low'];
  const meetingTypes = ['video', 'office', 'phone'];
  const statuses = ['scheduled', 'completed', 'rescheduled'];
  
  for (let i = 0; i < batchSize; i++) {
    const id = existingCount + i + 1;
    const name = names[Math.floor(Math.random() * names.length)];
    const caseType = caseTypes[Math.floor(Math.random() * caseTypes.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const meetingType = meetingTypes[Math.floor(Math.random() * meetingTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Generate random future dates
    const futureDate = new Date(now);
    futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30) + 1);
    futureDate.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60));
    
    additionalAppointments.push({
      id: id,
      user_id: (23 + id).toString(),
      lawyer_id: "07f53abd-83fc-4fc0-9c7a-d39a7856239a",
      appointment_time: futureDate.toISOString(),
      duration_minutes: [30, 45, 60, 90][Math.floor(Math.random() * 4)],
      status: status,
      created_at: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: 23 + id,
        name: name,
        email: name.toLowerCase().replace(' ', '.') + '@example.com',
        phone: `+91 ${9800000000 + id}`
      },
      lawyer: {
        id: "07f53abd-83fc-4fc0-9c7a-d39a7856239a",
        full_name: "Aditya Gupta"
      },
      consultation_fee: [2000, 2500, 3000, 3500, 4000][Math.floor(Math.random() * 5)],
      case_type: caseType,
      priority: priority,
      meeting_type: meetingType,
      notes: `${caseType} consultation - ${status === 'completed' ? 'Successfully completed' : status === 'rescheduled' ? 'Rescheduled by client' : 'Upcoming consultation'}`
    });
  }
  
  return additionalAppointments;
};

// Status configurations
const statusConfig = {
  scheduled: {
    color: 'blue',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    textColor: 'text-blue-800 dark:text-blue-300',
    borderColor: 'border-blue-200 dark:border-blue-700',
    icon: Calendar,
    label: 'Scheduled'
  },
  completed: {
    color: 'green',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    textColor: 'text-green-800 dark:text-green-300',
    borderColor: 'border-green-200 dark:border-green-700',
    icon: CheckCircle,
    label: 'Completed'
  },
  cancelled: {
    color: 'red',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    textColor: 'text-red-800 dark:text-red-300',
    borderColor: 'border-red-200 dark:border-red-700',
    icon: XCircle,
    label: 'Cancelled'
  },
  rescheduled: {
    color: 'orange',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    textColor: 'text-orange-800 dark:text-orange-300',
    borderColor: 'border-orange-200 dark:border-orange-700',
    icon: AlertCircle,
    label: 'Rescheduled'
  }
};

// Priority configurations
const priorityConfig = {
  urgent: {
    color: 'red',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    textColor: 'text-red-800 dark:text-red-300',
    label: 'Urgent'
  },
  high: {
    color: 'orange',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    textColor: 'text-orange-800 dark:text-orange-300',
    label: 'High'
  },
  medium: {
    color: 'yellow',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    textColor: 'text-yellow-800 dark:text-yellow-300',
    label: 'Medium'
  },
  low: {
    color: 'gray',
    bgColor: 'bg-gray-100 dark:bg-gray-900/30',
    textColor: 'text-gray-800 dark:text-gray-300',
    label: 'Low'
  }
};

// Enhanced Status Indicator Component - Shows status for all appointments
const AppointmentStatusIndicator = ({ appointment }) => {
  const now = new Date();
  const appointmentTime = new Date(appointment.appointment_time);
  const endTime = new Date(appointmentTime.getTime() + appointment.duration_minutes * 60000);
  const timeDiff = appointmentTime.getTime() - now.getTime();
  
  // Currently running
  const isLive = now >= appointmentTime && now <= endTime && appointment.status === 'scheduled';
  
  // Starting soon (within 1 hour)
  const isSoon = timeDiff > 0 && timeDiff <= 60 * 60 * 1000 && appointment.status === 'scheduled';
  
  // Already happened
  const isPast = now > endTime;
  
  // Future appointment
  const isFuture = timeDiff > 60 * 60 * 1000 && appointment.status === 'scheduled';
  
  // Calculate time ago for past appointments
  const getTimeAgo = () => {
    const diffMs = now - endTime;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMinutes > 0) return `${diffMinutes}m ago`;
    return 'Just now';
  };

  if (isLive) {
    return (
      <div className="flex items-center space-x-1.5 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full border border-red-300 dark:border-red-600">
        <div className="relative">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 w-2 h-2 bg-red-500 rounded-full animate-ping opacity-75"></div>
        </div>
        <span className="text-red-700 dark:text-red-300 font-bold text-xs uppercase tracking-wide whitespace-nowrap">
          LIVE
        </span>
      </div>
    );
  }
  
  if (isSoon) {
    return (
      <div className="flex items-center space-x-1.5 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full border border-orange-300 dark:border-orange-600">
        <div className="relative">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 w-2 h-2 bg-orange-400 rounded-full animate-ping opacity-50"></div>
        </div>
        <span className="text-orange-700 dark:text-orange-300 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
          SOON
        </span>
      </div>
    );
  }
  
  if (isPast && appointment.status === 'completed') {
    return (
      <div className="flex items-center space-x-1.5 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full border border-green-300 dark:border-green-600">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-green-700 dark:text-green-300 font-medium text-xs whitespace-nowrap">
          Held {getTimeAgo()}
        </span>
      </div>
    );
  }
  
  if (isFuture) {
    const hoursUntil = Math.ceil(timeDiff / (1000 * 60 * 60));
    const daysUntil = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    return (
      <div className="flex items-center space-x-1.5 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full border border-blue-300 dark:border-blue-600">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <span className="text-blue-700 dark:text-blue-300 font-medium text-xs whitespace-nowrap">
          {daysUntil > 1 ? `In ${daysUntil}d` : `In ${hoursUntil}h`}
        </span>
      </div>
    );
  }
  
  return null;
};

const LawyerAppointments = ({ darkMode = false, userData = {} }) => {
  // State management
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('appointment_time');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  
  // Modal state
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showTrackDropdown, setShowTrackDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Refs
  const loadMoreRef = useRef(null);
  const trackDropdownRef = useRef(null);
  const appointmentsListRef = useRef(null);
  const firstNewAppointmentRef = useRef(null);

  // Initialize appointments
  useEffect(() => {
    const initializeAppointments = () => {
      setLoading(true);
      setTimeout(() => {
        setAppointments(sampleAppointments);
        setFilteredAppointments(sampleAppointments);
        setLoading(false);
      }, 1000);
    };

    initializeAppointments();
  }, []);

  // Filter and search functionality
  const applyFilters = useCallback(() => {
    let filtered = [...appointments];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(appointment =>
        appointment.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.case_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.notes.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(appointment => appointment.priority === priorityFilter);
    }

    // Date filter
    const now = new Date();
    if (dateFilter !== 'all') {
      filtered = filtered.filter(appointment => {
        const appointmentDate = new Date(appointment.appointment_time);
        switch (dateFilter) {
          case 'today':
            return appointmentDate.toDateString() === now.toDateString();
          case 'tomorrow':
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return appointmentDate.toDateString() === tomorrow.toDateString();
          case 'this_week':
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            return appointmentDate >= weekStart && appointmentDate <= weekEnd;
          case 'this_month':
            return appointmentDate.getMonth() === now.getMonth() && 
                   appointmentDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    // Sort appointments
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'appointment_time':
          aValue = new Date(a.appointment_time);
          bValue = new Date(b.appointment_time);
          break;
        case 'created_at':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case 'client_name':
          aValue = a.user.name.toLowerCase();
          bValue = b.user.name.toLowerCase();
          break;
        case 'consultation_fee':
          aValue = a.consultation_fee;
          bValue = b.consultation_fee;
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredAppointments(filtered);
  }, [appointments, searchQuery, statusFilter, priorityFilter, dateFilter, sortBy, sortOrder]);

  // Enhanced Load More functionality with smooth scroll animation
  const handleLoadMore = useCallback(async () => {
    setLoadingMore(true);
    
    // Get the current scroll position and the position where new items will be added
    const currentScrollTop = window.pageYOffset;
    const appointmentsContainer = appointmentsListRef.current;
    
    if (appointmentsContainer) {
      // Mark the position where new content will be added
      const lastAppointment = appointmentsContainer.lastElementChild;
      if (lastAppointment) {
        firstNewAppointmentRef.current = lastAppointment.getBoundingClientRect().bottom + window.pageYOffset;
      }
    }
    
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Generate new appointments
    const newAppointments = generateMoreAppointments(appointments.length, 5);
    
    // Add new appointments to the existing list
    const updatedAppointments = [...appointments, ...newAppointments];
    setAppointments(updatedAppointments);
    
    // Check if we should stop showing load more (limit to 50 total appointments)
    if (updatedAppointments.length >= 50) {
      setHasMore(false);
    }
    
    setLoadingMore(false);
    
    // Smooth scroll animation to show new content
    setTimeout(() => {
      if (firstNewAppointmentRef.current && appointmentsContainer) {
        // Calculate the target scroll position
        const targetScrollTop = firstNewAppointmentRef.current - 100; // 100px offset from top
        
        // Smooth scroll to the first new appointment
        window.scrollTo({
          top: Math.max(0, targetScrollTop),
          behavior: 'smooth'
        });
        
        // Add a subtle highlight effect to new appointments
        const newAppointmentCards = appointmentsContainer.querySelectorAll('[data-appointment-id]');
        const totalCards = newAppointmentCards.length;
        const newCardsCount = Math.min(5, newAppointments.length);
        
        // Highlight the new cards with animation
        for (let i = totalCards - newCardsCount; i < totalCards; i++) {
          const card = newAppointmentCards[i];
          if (card) {
            // Add highlight animation
            card.classList.add('animate-pulse');
            card.style.transition = 'all 0.6s ease-in-out';
            card.style.transform = 'scale(1.02)';
            card.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.15)';
            
            // Remove highlight after animation
            setTimeout(() => {
              card.classList.remove('animate-pulse');
              card.style.transform = 'scale(1)';
              card.style.boxShadow = '';
            }, 2000);
          }
        }
      }
    }, 100);
    
  }, [appointments]);

  // Auto-scroll to load more when near bottom (optional enhancement)
  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || !hasMore) return;
      
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      
      // Trigger load more when user is 200px from bottom
      if (scrollTop + windowHeight >= docHeight - 200) {
        // Optional: Auto-load more when scrolling near bottom
        // Uncomment the line below to enable auto-loading
        // handleLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, handleLoadMore]);

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Helper functions for appointment status
  const isToday = (dateString) => {
    const appointmentDate = new Date(dateString);
    const today = new Date();
    return appointmentDate.toDateString() === today.toDateString();
  };

  const isStartingSoon = (dateString) => {
    const appointmentTime = new Date(dateString);
    const now = new Date();
    const timeDiff = appointmentTime.getTime() - now.getTime();
    return timeDiff > 0 && timeDiff <= 60 * 60 * 1000; // Within 1 hour
  };

  const isCurrentlyRunning = (appointment) => {
    const appointmentTime = new Date(appointment.appointment_time);
    const endTime = new Date(appointmentTime.getTime() + appointment.duration_minutes * 60000);
    const now = new Date();
    return now >= appointmentTime && now <= endTime && appointment.status === 'scheduled';
  };

  const canStartMeeting = (dateString) => {
    const appointmentTime = new Date(dateString);
    const now = new Date();
    const timeDiff = appointmentTime.getTime() - now.getTime();
    return timeDiff <= 5 * 60 * 1000 && timeDiff >= -5 * 60 * 1000;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get meeting type icon
  const getMeetingTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video size={14} className="text-blue-600 dark:text-blue-400" />;
      case 'office':
        return <MapPin size={14} className="text-green-600 dark:text-green-400" />;
      case 'phone':
        return <Phone size={14} className="text-orange-600 dark:text-orange-400" />;
      default:
        return <Calendar size={14} className="text-gray-600 dark:text-gray-400" />;
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setDateFilter('all');
    setSortBy('appointment_time');
    setSortOrder('desc');
  };

  // Open appointment detail modal
  const openDetailModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailModal(true);
    document.body.style.overflow = 'hidden';
  };

  // Close appointment detail modal
  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedAppointment(null);
    document.body.style.overflow = 'unset';
  };

  // Handle start meeting
  const handleStartMeeting = (appointment) => {
    console.log('Starting meeting for appointment:', appointment.id);
    alert(`Starting ${appointment.meeting_type} meeting with ${appointment.user.name}`);
  };

  // Professional Skeleton Component
  const AppointmentSkeleton = () => {
    return (
      <div className={`p-4 sm:p-5 rounded-xl border transition-all duration-300 ${
        darkMode 
          ? 'bg-gray-800 border-gray-700 shadow-lg' 
          : 'bg-white border-gray-200 shadow-sm hover:shadow-md'
      }`}>
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1">
            {/* Avatar Skeleton */}
            <div className={`w-12 h-12 rounded-xl animate-pulse ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
            
            {/* User Info Skeleton */}
            <div className="flex-1">
              <div className={`h-4 animate-pulse ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              } rounded-md mb-2 w-32`}></div>
              <div className={`h-3 animate-pulse ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              } rounded-md w-24`}></div>
            </div>
          </div>
          
          {/* Status Badge Skeleton */}
          <div className={`h-6 w-16 animate-pulse ${
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          } rounded-full`}></div>
        </div>

        {/* Time and Duration Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 animate-pulse ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            } rounded`}></div>
            <div className={`h-3 animate-pulse ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            } rounded-md w-20`}></div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 animate-pulse ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            } rounded`}></div>
            <div className={`h-3 animate-pulse ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            } rounded-md w-16`}></div>
          </div>
        </div>

        {/* Case Type and Priority Section */}
        <div className="flex items-center justify-between mb-4">
          <div className={`h-6 w-24 animate-pulse ${
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          } rounded-full`}></div>
          <div className={`h-6 w-16 animate-pulse ${
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          } rounded-full`}></div>
        </div>

        {/* Notes Section */}
        <div className="mb-4">
          <div className={`h-3 animate-pulse ${
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          } rounded-md mb-2 w-full`}></div>
          <div className={`h-3 animate-pulse ${
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          } rounded-md w-3/4`}></div>
        </div>

        {/* Action Buttons Section */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <div className={`h-8 w-20 animate-pulse ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            } rounded-lg`}></div>
            <div className={`h-8 w-16 animate-pulse ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            } rounded-lg`}></div>
          </div>
          
          <div className="flex space-x-2">
            <div className={`h-8 w-8 animate-pulse ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            } rounded-lg`}></div>
            <div className={`h-8 w-8 animate-pulse ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            } rounded-lg`}></div>
          </div>
        </div>
      </div>
    );
  };

  // Show professional loading state
  if (loading) {
    return (
      <div className={`min-h-screen p-2 sm:p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-6">
            <div className={`h-8 w-48 animate-pulse ${
              darkMode ? 'bg-gray-800' : 'bg-gray-200'
            } rounded-lg mb-4`}></div>
            
            {/* Search and Filters Skeleton */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <div className={`h-10 flex-1 animate-pulse ${
                darkMode ? 'bg-gray-800' : 'bg-gray-200'
              } rounded-lg`}></div>
              <div className={`h-10 w-32 animate-pulse ${
                darkMode ? 'bg-gray-800' : 'bg-gray-200'
              } rounded-lg`}></div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className={`p-4 rounded-xl border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`h-6 w-12 animate-pulse ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-300'
                      } rounded mb-2`}></div>
                      <div className={`h-3 w-16 animate-pulse ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-300'
                      } rounded`}></div>
                    </div>
                    <div className={`w-8 h-8 animate-pulse ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-300'
                    } rounded-lg`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Appointment Cards Skeleton */}
          <div className="grid gap-4">
            {[...Array(6)].map((_, index) => (
              <AppointmentSkeleton key={index} />
            ))}
          </div>
        </div>


      </div>
    );
  }

  return (
    <div className={`min-h-screen p-2 sm:p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        {/* Header - More Compact */}
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            My Appointments
          </h1>
          
          {/* Professional Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={18} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search by client name, case type, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border-2 transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-gray-750' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:shadow-lg'
                } focus:outline-none`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${
                    darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                  } transition-colors`}
                >
                  <X size={14} />
                </button>
              )}
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-xl border-2 transition-all duration-300 ${
                showFilters
                  ? darkMode 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/25' 
                    : 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : darkMode 
                    ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              <Filter size={16} />
              <span>Filters</span>
              {(statusFilter !== 'all' || priorityFilter !== 'all' || dateFilter !== 'all') && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  showFilters 
                    ? 'bg-blue-800 text-blue-100' 
                    : darkMode 
                      ? 'bg-blue-600 text-blue-100' 
                      : 'bg-blue-100 text-blue-600'
                }`}>
                  {[statusFilter, priorityFilter, dateFilter].filter(f => f !== 'all').length}
                </span>
              )}
              <ChevronDown size={16} className={`transform transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Professional Filters Panel */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showFilters ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'
          }`}>
            <div className={`p-5 rounded-xl border-2 backdrop-blur-sm ${
              darkMode 
                ? 'bg-gray-800/80 border-gray-700 shadow-xl' 
                : 'bg-white/80 border-gray-200 shadow-xl'
            }`}>
              {/* Filter Categories */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-5">
                {/* Status Filter */}
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`w-full px-3 py-2.5 text-sm rounded-lg border-2 transition-all duration-200 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:bg-gray-650' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:shadow-md'
                    } focus:outline-none`}
                  >
                    <option value="all">All Statuses</option>
                    <option value="scheduled">📅 Scheduled</option>
                    <option value="completed">✅ Completed</option>
                    <option value="cancelled">❌ Cancelled</option>
                    <option value="rescheduled">🔄 Rescheduled</option>
                  </select>
                </div>

                {/* Priority Filter */}
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Priority
                  </label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className={`w-full px-3 py-2.5 text-sm rounded-lg border-2 transition-all duration-200 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:bg-gray-650' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:shadow-md'
                    } focus:outline-none`}
                  >
                    <option value="all">All Priorities</option>
                    <option value="urgent">🔴 Urgent</option>
                    <option value="high">🟠 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">⚪ Low</option>
                  </select>
                </div>

                {/* Date Filter */}
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Date Range
                  </label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className={`w-full px-3 py-2.5 text-sm rounded-lg border-2 transition-all duration-200 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:bg-gray-650' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:shadow-md'
                    } focus:outline-none`}
                  >
                    <option value="all">All Dates</option>
                    <option value="today">📅 Today</option>
                    <option value="tomorrow">📅 Tomorrow</option>
                    <option value="this_week">📊 This Week</option>
                    <option value="this_month">📊 This Month</option>
                  </select>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Sort By
                  </label>
                  <select
                    value={`${sortBy}_${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('_');
                      setSortBy(field);
                      setSortOrder(order);
                    }}
                    className={`w-full px-3 py-2.5 text-sm rounded-lg border-2 transition-all duration-200 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:bg-gray-650' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:shadow-md'
                    } focus:outline-none`}
                  >
                    <option value="appointment_time_desc">📅 Date (Newest First)</option>
                    <option value="appointment_time_asc">📅 Date (Oldest First)</option>
                    <option value="client_name_asc">👤 Client (A-Z)</option>
                    <option value="client_name_desc">👤 Client (Z-A)</option>
                    <option value="consultation_fee_desc">💰 Fee (High to Low)</option>
                    <option value="consultation_fee_asc">💰 Fee (Low to High)</option>
                  </select>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''} found
                  </span>
                  {filteredAppointments.length !== appointments.length && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      darkMode 
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' 
                        : 'bg-blue-100 text-blue-600 border border-blue-200'
                    }`}>
                      Filtered
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={clearAllFilters}
                    className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      darkMode 
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700 border border-gray-600 hover:border-gray-500' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <FilterX size={14} />
                    <span>Clear Filters</span>
                  </button>
                  
                  <button
                    onClick={() => setShowFilters(false)}
                    className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      darkMode 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25'
                    }`}
                  >
                    <span>Apply</span>
                    <ChevronDown size={14} className="rotate-180" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments List - Compact Grid */}
        <div ref={appointmentsListRef} className="grid gap-3 sm:gap-4">
          {filteredAppointments.length === 0 ? (
            <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <Calendar size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No appointments found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredAppointments.map((appointment) => {
              const StatusIcon = statusConfig[appointment.status]?.icon || Calendar;
              const canStart = canStartMeeting(appointment.appointment_time);
              
              // Get card styling based on appointment state
              const getCardStyling = () => {
                const now = new Date();
                const appointmentTime = new Date(appointment.appointment_time);
                const endTime = new Date(appointmentTime.getTime() + appointment.duration_minutes * 60000);
                const timeDiff = appointmentTime.getTime() - now.getTime();
                
                // Currently running
                if (now >= appointmentTime && now <= endTime && appointment.status === 'scheduled') {
                  return `${darkMode ? 'bg-red-900/20 border-red-500/50' : 'bg-red-50 border-red-200'} shadow-lg ring-2 ring-red-500/20`;
                }
                
                // Starting soon (within 1 hour)
                if (timeDiff > 0 && timeDiff <= 60 * 60 * 1000 && appointment.status === 'scheduled') {
                  return `${darkMode ? 'bg-orange-900/20 border-orange-500/50' : 'bg-orange-50 border-orange-200'} ring-1 ring-orange-500/30`;
                }
                
                // Default styling
                return `${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`;
              };

              return (
                <div
                  key={appointment.id}
                  data-appointment-id={appointment.id}
                  className={`relative p-3 sm:p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${getCardStyling()}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    {/* Client Info */}
                    <div className="flex items-center space-x-3 flex-1">
                      <Avatar
                        name={appointment.user.name}
                        size="sm"
                        className="flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base truncate">
                          {appointment.user.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                          <span className="truncate">{appointment.case_type}</span>
                          <span>•</span>
                          <span>₹{appointment.consultation_fee.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Status Indicator, Priority & Status */}
                    <div className="flex items-start space-x-2">
                      {/* Enhanced Status Badge - Shows for ALL appointments */}
                      <div className="flex-shrink-0">
                        <AppointmentStatusIndicator appointment={appointment} />
                      </div>
                      
                      {/* Priority and Status Badges */}
                      <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityConfig[appointment.priority]?.bgColor} ${priorityConfig[appointment.priority]?.textColor}`}>
                          {priorityConfig[appointment.priority]?.label}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig[appointment.status]?.bgColor} ${statusConfig[appointment.status]?.textColor}`}>
                          <StatusIcon size={12} className="inline mr-1" />
                          {statusConfig[appointment.status]?.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Appointment Details - Compact */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar size={14} className="text-blue-500 flex-shrink-0" />
                      <span className="truncate">{formatDate(appointment.appointment_time)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock size={14} className="text-green-500 flex-shrink-0" />
                      <span>{formatTime(appointment.appointment_time)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      {getMeetingTypeIcon(appointment.meeting_type)}
                      <span className="capitalize">{appointment.meeting_type}</span>
                    </div>
                  </div>

                  {/* Notes - Compact */}
                  {appointment.notes && (
                    <div className={`text-xs p-2 rounded border-l-2 mb-3 ${
                      darkMode 
                        ? 'bg-gray-700/50 border-blue-500' 
                        : 'bg-blue-50 border-blue-400'
                    }`}>
                      <span className="line-clamp-2">{appointment.notes}</span>
                    </div>
                  )}

                  {/* Action Buttons - Compact */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => openDetailModal(appointment)}
                        className={`flex items-center space-x-1 px-2 py-1 text-xs rounded-md ${
                          darkMode 
                            ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30' 
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        } transition-colors`}
                      >
                        <Eye size={12} />
                        <span>Details</span>
                      </button>

                      {canStart && (
                        <button 
                          onClick={() => handleStartMeeting(appointment)}
                          className="flex items-center space-x-1 px-2 py-1 text-xs rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors animate-pulse"
                        >
                          <Play size={12} />
                          <span>Start</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 text-xs">
                      <Phone size={12} className="text-gray-400" />
                      <Mail size={12} className="text-gray-400" />
                      <MessageSquare size={12} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Load More Section */}
        {filteredAppointments.length > 0 && (
          <div ref={loadMoreRef} className="flex justify-center items-center py-6">
            {loadingMore ? (
              <div className="flex flex-col items-center space-y-4 py-8">
                {/* Professional Loading Spinner */}
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full border-4 ${
                    darkMode 
                      ? 'border-gray-700 border-t-blue-400' 
                      : 'border-gray-200 border-t-blue-500'
                  } animate-spin`}></div>
                </div>
                
                {/* Loading Text with Professional Styling */}
                <div className="text-center">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Loading more appointments...
                  </p>
                  <div className="flex items-center justify-center space-x-1 mt-3">
                    <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-500'} animate-bounce`}></div>
                    <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-500'} animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
                    <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-500'} animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            ) : (
              hasMore ? (
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-6 py-3 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
                >
                  <span>Load More Appointments</span>
                  {!loadingMore && <ArrowDown size={16} className="animate-bounce" />}
                </button>
              ) : (
                appointments.length > 5 && (
                  <div className="flex flex-col items-center space-y-3 py-6">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      darkMode ? 'bg-gray-700/50' : 'bg-gray-100'
                    }`}>
                      <CheckCircle size={24} className={darkMode ? 'text-green-400' : 'text-green-600'} />
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        All appointments loaded
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        You've reached the end of the list
                      </p>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        )}
      </div>

      {/* Professional Slide-in Detail Panel */}
      {showDetailModal && selectedAppointment && (
        <>
          {/* Subtle backdrop - no black overlay */}
          <div 
            className="fixed inset-0 z-40 backdrop-blur-sm bg-gray-900/10 transition-all duration-300"
            onClick={closeDetailModal}
          />
          
          {/* Slide-in panel from right */}
          <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 md:w-[28rem] lg:w-[32rem] overflow-y-auto">
            <div className={`h-full transition-all duration-300 transform translate-x-0 shadow-2xl ${
              darkMode ? 'bg-gray-800 text-white border-l border-gray-700' : 'bg-white text-gray-900 border-l border-gray-200'
            }`}>
              {/* Panel Header */}
              <div className={`sticky top-0 z-10 px-4 sm:px-6 py-4 border-b backdrop-blur-md ${
                darkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar name={selectedAppointment.user.name} size="md" />
                    <div>
                      <h2 className="text-lg font-semibold">{selectedAppointment.user.name}</h2>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {selectedAppointment.case_type}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeDetailModal}
                    className={`p-2 rounded-lg transition-colors ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <X size={20} />
                  </button>
                </div>
                
                {/* Status Indicator in Header */}
                <div className="mt-3 flex justify-center">
                  <AppointmentStatusIndicator appointment={selectedAppointment} />
                </div>
              </div>

              {/* Panel Body */}
              <div className="px-4 sm:px-6 py-6 space-y-6">

                {/* Appointment Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {/* Date & Time */}
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Calendar size={16} className="mr-2 text-blue-500" />
                      Date & Time
                    </h4>
                    <p className="text-sm font-semibold">{formatDate(selectedAppointment.appointment_time)}</p>
                    <p className="text-sm text-gray-500">{formatTime(selectedAppointment.appointment_time)}</p>
                    <p className="text-xs text-gray-400 mt-1">{selectedAppointment.duration_minutes} minutes</p>
                  </div>

                  {/* Contact */}
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <h4 className="font-medium mb-2 flex items-center">
                      <User size={16} className="mr-2 text-green-500" />
                      Contact
                    </h4>
                    <p className="text-sm font-semibold">{selectedAppointment.user.email}</p>
                    <p className="text-sm text-gray-500">{selectedAppointment.user.phone}</p>
                  </div>

                  {/* Meeting Type */}
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <h4 className="font-medium mb-2 flex items-center">
                      {getMeetingTypeIcon(selectedAppointment.meeting_type)}
                      <span className="ml-2">Meeting Type</span>
                    </h4>
                    <p className="text-sm font-semibold capitalize">{selectedAppointment.meeting_type}</p>
                  </div>

                  {/* Fee */}
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <h4 className="font-medium mb-2 flex items-center">
                      <DollarSign size={16} className="mr-2 text-yellow-500" />
                      Consultation Fee
                    </h4>
                    <p className="text-sm font-semibold">₹{selectedAppointment.consultation_fee.toLocaleString()}</p>
                  </div>
                </div>

                {/* Status & Priority */}
                <div className="flex items-center space-x-3 mb-6">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusConfig[selectedAppointment.status]?.bgColor} ${statusConfig[selectedAppointment.status]?.textColor}`}>
                    {statusConfig[selectedAppointment.status]?.label}
                  </span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${priorityConfig[selectedAppointment.priority]?.bgColor} ${priorityConfig[selectedAppointment.priority]?.textColor}`}>
                    {priorityConfig[selectedAppointment.priority]?.label} Priority
                  </span>
                </div>

                {/* Notes */}
                {selectedAppointment.notes && (
                  <div className={`p-4 rounded-lg mb-6 ${
                    darkMode ? 'bg-blue-900/20 border border-blue-700/30' : 'bg-blue-50 border border-blue-200'
                  }`}>
                    <h4 className="font-medium mb-2 flex items-center">
                      <MessageSquare size={16} className="mr-2 text-blue-500" />
                      Notes
                    </h4>
                    <p className="text-sm">{selectedAppointment.notes}</p>
                  </div>
                )}
              </div>

              {/* Panel Footer */}
              <div className={`sticky bottom-0 px-4 sm:px-6 py-4 border-t backdrop-blur-md ${
                darkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'
              }`}>
                <div className="flex flex-col space-y-3">
                  <div className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Created on {formatDate(selectedAppointment.created_at)}
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    {canStartMeeting(selectedAppointment.appointment_time) && (
                      <button 
                        onClick={() => {
                          handleStartMeeting(selectedAppointment);
                          closeDetailModal();
                        }}
                        className="flex items-center space-x-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all transform hover:scale-105"
                      >
                        <Play size={14} />
                        <span>Start Meeting</span>
                      </button>
                    )}
                    <button
                      className={`flex items-center space-x-2 px-4 py-2 text-sm rounded-lg border transition-all ${
                        darkMode 
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500' 
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                    >
                      <Edit3 size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={closeDetailModal}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LawyerAppointments;