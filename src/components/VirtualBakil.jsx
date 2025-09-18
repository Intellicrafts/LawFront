import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { 
  User, 
  Phone, 
  Video, 
  MessageCircle, 
  MapPin, 
  Star, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  X,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
  UserCheck,
  Shield,
  Award,
  Globe,
  Navigation,
  RefreshCw,
  Users,
  Calendar,
  DollarSign,
  Briefcase,
  GraduationCap,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  BookOpen,
  CheckCircle2,
  XCircle,
  Loader2,
  Send,
  FileText,
  Paperclip,
  Smile,
  Settings,
  VideoOff,
  Building,
  Scale,
  Home,
  Move,
  Crosshair,
  Info,
  Eye,
  EyeOff,
  Zap,
  Target,
  Building2,
  Gavel,
  FileCheck,
  UserPlus,
  Camera,
  Archive,
  PlusCircle,
  Download
} from 'lucide-react';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import '../styles/virtualBakil.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Comprehensive Indian Lawyers Data - Multiple Cities & Specializations
const COMPREHENSIVE_LAWYERS = [
  // Delhi NCR Lawyers
  {
    id: 1, name: "Advocate Rajesh Kumar", specialization: "Civil Law",
    image: "/api/placeholder/150/150", rating: 4.8, reviews: 127, experience: 15,
    location: { lat: 28.6139, lng: 77.2090 }, consultationFee: 3000,
    isOnline: true, isInCall: false, responseTime: "5 min", successRate: 92,
    cases: 450, availability: "Available Now",
    expertise: ["Civil Law", "Property Law", "Contract Law"], city: "New Delhi",
    languages: ["English", "Hindi", "Punjabi"], courtAffiliation: "Delhi High Court"
  },
  {
    id: 2, name: "Advocate Priya Sharma", specialization: "Criminal Law",
    image: "/api/placeholder/150/150", rating: 4.9, reviews: 89, experience: 12,
    location: { lat: 28.6239, lng: 77.2190 }, consultationFee: 2500,
    isOnline: true, isInCall: false, responseTime: "3 min", successRate: 95,
    cases: 320, availability: "Available Now",
    expertise: ["Criminal Law", "Bail Applications", "Court Representation"], city: "New Delhi",
    languages: ["English", "Hindi", "Marathi"], courtAffiliation: "Tis Hazari Court"
  },
  
  // Mumbai Lawyers
  {
    id: 3, name: "Advocate Ankit Shah", specialization: "Corporate Law",
    image: "/api/placeholder/150/150", rating: 4.9, reviews: 245, experience: 16,
    location: { lat: 19.0760, lng: 72.8777 }, consultationFee: 4500,
    isOnline: true, isInCall: false, responseTime: "2 min", successRate: 96,
    cases: 580, availability: "Available Now",
    expertise: ["Corporate Law", "M&A", "Securities Law"], city: "Mumbai",
    languages: ["English", "Hindi", "Gujarati", "Marathi"], courtAffiliation: "Bombay High Court"
  },
  {
    id: 4, name: "Advocate Sneha Reddy", specialization: "Family Law",
    image: "/api/placeholder/150/150", rating: 4.7, reviews: 178, experience: 11,
    location: { lat: 19.0820, lng: 72.8920 }, consultationFee: 2800,
    isOnline: true, isInCall: true, responseTime: "4 min", successRate: 89,
    cases: 340, availability: "In Call",
    expertise: ["Family Law", "Divorce", "Child Custody", "Domestic Violence"], city: "Mumbai",
    languages: ["English", "Hindi", "Marathi", "Telugu"], courtAffiliation: "Family Court Mumbai"
  },
  
  // Bangalore Lawyers
  {
    id: 5, name: "Advocate Vikram Rao", specialization: "IP & Technology Law",
    image: "/api/placeholder/150/150", rating: 4.9, reviews: 312, experience: 14,
    location: { lat: 12.9716, lng: 77.5946 }, consultationFee: 4000,
    isOnline: true, isInCall: false, responseTime: "1 min", successRate: 94,
    cases: 690, availability: "Available Now",
    expertise: ["IP Law", "Technology Law", "Software Licensing", "Patents"], city: "Bangalore",
    languages: ["English", "Hindi", "Kannada", "Tamil"], courtAffiliation: "Karnataka High Court"
  },
  {
    id: 6, name: "Advocate Meera Iyer", specialization: "Employment Law",
    image: "/api/placeholder/150/150", rating: 4.6, reviews: 134, experience: 9,
    location: { lat: 12.9850, lng: 77.6050 }, consultationFee: 2200,
    isOnline: false, isInCall: false, responseTime: "15 min", successRate: 87,
    cases: 220, availability: "Offline",
    expertise: ["Employment Law", "Labor Disputes", "HR Compliance"], city: "Bangalore",
    languages: ["English", "Hindi", "Kannada", "Telugu"], courtAffiliation: "Labor Court Bangalore"
  },
  
  // Chennai Lawyers
  {
    id: 7, name: "Advocate Ravi Krishnan", specialization: "Constitutional Law",
    image: "/api/placeholder/150/150", rating: 4.8, reviews: 198, experience: 20,
    location: { lat: 13.0827, lng: 80.2707 }, consultationFee: 5000,
    isOnline: true, isInCall: false, responseTime: "6 min", successRate: 91,
    cases: 420, availability: "Available Now",
    expertise: ["Constitutional Law", "Public Interest", "Writ Petitions"], city: "Chennai",
    languages: ["English", "Tamil", "Hindi", "Telugu"], courtAffiliation: "Madras High Court"
  },
  
  // Kolkata Lawyers
  {
    id: 8, name: "Advocate Subrata Ghosh", specialization: "Tax Law",
    image: "/api/placeholder/150/150", rating: 4.7, reviews: 167, experience: 18,
    location: { lat: 22.5726, lng: 88.3639 }, consultationFee: 3200,
    isOnline: true, isInCall: false, responseTime: "7 min", successRate: 90,
    cases: 380, availability: "Available Now",
    expertise: ["Tax Law", "GST", "Income Tax", "Corporate Taxation"], city: "Kolkata",
    languages: ["English", "Bengali", "Hindi"], courtAffiliation: "Calcutta High Court"
  },
  
  // Pune Lawyers
  {
    id: 9, name: "Advocate Ashwin Patil", specialization: "Real Estate Law",
    image: "/api/placeholder/150/150", rating: 4.6, reviews: 89, experience: 13,
    location: { lat: 18.5204, lng: 73.8567 }, consultationFee: 2700,
    isOnline: true, isInCall: false, responseTime: "8 min", successRate: 88,
    cases: 290, availability: "Available Now",
    expertise: ["Real Estate Law", "Property Disputes", "RERA"], city: "Pune",
    languages: ["English", "Marathi", "Hindi"], courtAffiliation: "District Court Pune"
  },
  
  // Hyderabad Lawyers
  {
    id: 10, name: "Advocate Lakshmi Reddy", specialization: "Consumer Protection",
    image: "/api/placeholder/150/150", rating: 4.5, reviews: 156, experience: 10,
    location: { lat: 17.3850, lng: 78.4867 }, consultationFee: 2000,
    isOnline: true, isInCall: false, responseTime: "12 min", successRate: 85,
    cases: 180, availability: "Available Now",
    expertise: ["Consumer Protection", "Service Disputes", "E-commerce Issues"], city: "Hyderabad",
    languages: ["English", "Telugu", "Hindi"], courtAffiliation: "Consumer Forum Hyderabad"
  }
];

// Backwards compatibility
const mockLawyers = COMPREHENSIVE_LAWYERS;

// Try to import APIs with fallback
let lawyerAPI = null;
let apiServices = null;

try {
  const apiService = require('../api/apiService');
  lawyerAPI = apiService.lawyerAPI;
  apiServices = apiService.default || apiService;
} catch (error) {
  console.log('APIs not available, using mock data:', error);
  lawyerAPI = {
    getNearbyLawyers: () => Promise.resolve(COMPREHENSIVE_LAWYERS || []),
    bookLawyerAppointment: () => Promise.resolve({ success: true })
  };
  apiServices = {
    startCallSession: () => Promise.resolve({ sessionId: 'mock-call' }),
    startChatSession: () => Promise.resolve({ sessionId: 'mock-chat' })
  };
}

// Enhanced custom lawyer marker icon - smaller, more professional
const createLawyerIcon = (isOnline, isSelected, isInCall = false) => {
  const size = isSelected ? 36 : 32;
  
  return L.divIcon({
    html: `
      <div class="relative lawyer-marker">
        ${isOnline && !isInCall ? `
          <div class="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-40" style="width: ${size}px; height: ${size}px;"></div>
          <div class="absolute inset-0 bg-green-300 rounded-full animate-ping opacity-30" style="width: ${size}px; height: ${size}px; animation-delay: 0.5s"></div>
        ` : ''}
        <div class="relative bg-white rounded-full shadow-lg border-3 ${
          isInCall ? 'border-red-500' : isOnline ? 'border-green-500' : 'border-gray-400'
        }" style="width: ${size}px; height: ${size}px;">
          <div class="w-full h-full ${
            isInCall ? 'bg-red-500' : isOnline ? 'bg-green-500' : 'bg-gray-400'
          } rounded-full flex items-center justify-center p-1">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          ${isOnline && !isInCall ? `
            <div class="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          ` : isInCall ? `
            <div class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
          ` : ''}
        </div>
      </div>
    `,
    className: 'custom-lawyer-marker',
    iconSize: [size, size],
    iconAnchor: [size/2, size],
    popupAnchor: [0, -size],
  });
};

// Create legal body marker icons
const createLegalBodyIcon = (type, isSelected = false) => {
  const size = isSelected ? 36 : 32;
  const iconConfig = {
    court: { color: '#3b82f6', icon: 'gavel' },
    supreme_court: { color: '#7c3aed', icon: 'scale' },
    bar_council: { color: '#059669', icon: 'shield' },
    legal_aid: { color: '#dc2626', icon: 'heart' },
    notary: { color: '#d97706', icon: 'file-check' }
  };
  
  const config = iconConfig[type] || { color: '#6b7280', icon: 'building' };
  
  return L.divIcon({
    html: `
      <div class="relative legal-body-marker">
        <div class="relative bg-white rounded-lg shadow-lg border-2" style="width: ${size}px; height: ${size}px; border-color: ${config.color}">
          <div class="w-full h-full rounded-md flex items-center justify-center" style="background-color: ${config.color}">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              ${getIconSVG(config.icon)}
            </svg>
          </div>
        </div>
        <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent" style="border-top-color: ${config.color}"></div>
      </div>
    `,
    className: 'custom-legal-body-marker',
    iconSize: [size, size + 6],
    iconAnchor: [size/2, size + 6],
    popupAnchor: [0, -(size + 6)],
  });
};

// Helper function to get SVG paths for different icons
const getIconSVG = (iconType) => {
  const icons = {
    gavel: 'M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z',
    scale: 'M7 2v2h1l3.29 8.29-.29.71H4v2h16v-2h-7l1-2.59L17.71 4H19V2H7zM4 17v5h2v-3h12v3h2v-5H4z',
    shield: 'M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5H16V16H8V11.5H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,9.5V11.5H13.5V9.5C13.5,8.7 12.8,8.2 12,8.2Z',
    heart: 'M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.04L12,21.35Z',
    'file-check': 'M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z',
    building: 'M19,3H5C3.9,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.9 20.1,3 19,3M12,8A2,2 0 0,1 14,10A2,2 0 0,1 12,12A2,2 0 0,1 10,10A2,2 0 0,1 12,8M16,16H8V15C8,13.67 10.67,13 12,13C13.33,13 16,13.67 16,15V16Z'
  };
  return icons[iconType] || icons.building;
};

// Enhanced Location Picker Component
const LocationPicker = ({ position, onLocationChange, isDragging, setIsDragging, theme }) => {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.setView(position, 13);
    }
  }, [position, map]);

  const handleDragEnd = (e) => {
    const newPosition = [e.target.getLatLng().lat, e.target.getLatLng().lng];
    onLocationChange(newPosition);
    setIsDragging(false);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const locationIcon = L.divIcon({
    html: `
      <div class="relative user-location-marker">
        <div class="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-40" style="width: 40px; height: 40px;"></div>
        <div class="relative bg-white rounded-full shadow-xl border-4 border-blue-500" style="width: 40px; height: 40px;">
          <div class="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
        </div>
        <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs bg-blue-500 text-white px-2 py-1 rounded whitespace-nowrap font-medium shadow-lg">
          ${isDragging ? 'Drop here' : 'You are here'}
        </div>
      </div>
    `,
    className: 'user-location-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  return position === null ? null : (
    <Marker 
      position={position} 
      icon={locationIcon}
      draggable={true}
      eventHandlers={{
        dragstart: handleDragStart,
        dragend: handleDragEnd,
      }}
    >
      <Popup>
        <div className="text-center p-2">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-blue-500" />
            <span className="font-bold text-blue-600">Your Current Location</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Drag this marker to explore legal services in different areas
          </p>
          <div className="text-xs text-gray-500">
            Lat: {position[0].toFixed(4)}, Lng: {position[1].toFixed(4)}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

// Professional status indicators with enhanced animations
const LawyerStatusIndicator = ({ isOnline, isInCall, responseTime }) => {
  if (isInCall) {
    return (
      <div className="flex items-center space-x-1">
        <div className="relative">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <div className="absolute inset-0 w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
        </div>
        <span className="text-xs text-red-600 font-medium">In Call</span>
      </div>
    );
  }
  
  if (isOnline) {
    return (
      <div className="flex items-center space-x-1">
        <div className="relative">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
        </div>
        <span className="text-xs text-green-600 font-medium">Online • {responseTime}</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center space-x-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
      <span className="text-xs text-gray-500">Offline</span>
    </div>
  );
};

// Enhanced Legal Body Info Component
const LegalBodyInfoModal = ({ legalBody, isOpen, onClose, theme }) => {
  if (!isOpen || !legalBody) return null;

  const getTypeIcon = (type) => {
    const icons = {
      court: Gavel,
      supreme_court: Scale,
      bar_council: Shield,
      legal_aid: Heart,
      notary: FileCheck
    };
    return icons[type] || Building;
  };

  const getTypeLabel = (type) => {
    const labels = {
      court: 'Court',
      supreme_court: 'Supreme Court',
      bar_council: 'Bar Council',
      legal_aid: 'Legal Aid',
      notary: 'Notary Public'
    };
    return labels[type] || 'Legal Office';
  };

  const TypeIcon = getTypeIcon(legalBody.type);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`relative w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <TypeIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{legalBody.name}</h2>
                  <p className="text-indigo-100">{getTypeLabel(legalBody.type)}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {legalBody.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {legalBody.contact}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {legalBody.workingHours}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Jurisdiction: {legalBody.jurisdiction}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Established: {legalBody.established}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Rating: {legalBody.rating}/5.0
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                About
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {legalBody.description}
              </p>
            </div>

            {/* Services */}
            <div>
              <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Services Offered
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {legalBody.services.map((service, index) => (
                  <div 
                    key={index}
                    className={`flex items-center space-x-2 p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
                  >
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {service}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className={`p-4 rounded-lg ${legalBody.isActive ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
              <div className="flex items-center space-x-2">
                {legalBody.isActive ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className={`font-medium ${legalBody.isActive ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                  {legalBody.isActive ? 'Currently Operational' : 'Temporarily Closed'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Professional rating component
const ProfessionalRating = ({ rating, reviews, size = 'sm' }) => {
  const starSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  
  return (
    <div className="flex items-center space-x-1">
      <div className="flex items-center space-x-0.5">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`${starSize} ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
      <span className={`${textSize} font-medium text-gray-700 dark:text-gray-300`}>
        {rating}
      </span>
      <span className={`${textSize} text-gray-500 dark:text-gray-400`}>
        ({reviews})
      </span>
    </div>
  );
};

// Professional connection animation with enhanced live session preparation
const ConnectionAnimation = ({ isVisible, lawyerName, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [connectionType, setConnectionType] = useState('call');
  
  const connectionSteps = [
    { icon: Shield, text: "Verifying lawyer credentials", color: "text-green-500" },
    { icon: PhoneCall, text: "Establishing secure connection", color: "text-blue-500" },
    { icon: Video, text: "Setting up live session", color: "text-purple-500" },
    { icon: CheckCircle, text: "Preparing consultation room", color: "text-orange-500" },
    { icon: Users, text: "Ready for legal consultation", color: "text-teal-500" }
  ];

  useEffect(() => {
    if (isVisible) {
      const stepInterval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= connectionSteps.length - 1) {
            clearInterval(stepInterval);
            setTimeout(() => {
              onComplete();
            }, 1000);
            return prev;
          }
          return prev + 1;
        });
      }, 600);
      
      return () => clearInterval(stepInterval);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 bg-black bg-opacity-70 z-[9999] flex items-center justify-center professional-blur"
    >
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-lg mx-4 text-center shadow-2xl">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 rounded-full mx-auto flex items-center justify-center relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 border-4 border-white border-t-transparent rounded-full absolute"
            />
            <div className="relative">
              <Phone className="w-10 h-10 text-white animate-pulse" />
            </div>
          </div>
          
          {/* Professional badges */}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full animate-ping flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-500 rounded-full animate-bounce flex items-center justify-center">
            <Shield className="w-3 h-3 text-white" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Connecting to {lawyerName}
        </h3>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Preparing your live legal consultation session
          </p>
          
          <div className="space-y-3">
            {connectionSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: isActive ? 1 : 0.3, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 ${
                    isActive ? 'bg-white dark:bg-gray-600 shadow-sm' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted ? 'bg-green-500' : isActive ? 'bg-blue-500' : 'bg-gray-300'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${isActive ? step.color : 'text-gray-400'}`}>
                    {step.text}
                  </span>
                  {isActive && !isCompleted && (
                    <div className="ml-auto">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / connectionSteps.length) * 100}%` }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 rounded-full"
          />
        </div>
        
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Shield className="w-3 h-3" />
            <span>Secure Connection</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Live Session</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>1-on-1 Consultation</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          Your consultation session is being prepared with end-to-end encryption
        </p>
      </div>
    </motion.div>
  );
};

// Enhanced lawyer search animation
const EnhancedSearchAnimation = ({ isVisible, userLocation, onComplete }) => {
  const [searchStep, setSearchStep] = useState(0);
  const [foundLawyers, setFoundLawyers] = useState(0);
  
  useEffect(() => {
    if (isVisible) {
      const steps = [
        { delay: 0, step: 0, lawyers: 0 },
        { delay: 1000, step: 1, lawyers: 2 },
        { delay: 2000, step: 2, lawyers: 5 },
        { delay: 3000, step: 3, lawyers: 8 },
        { delay: 4000, step: 4, lawyers: 12 }
      ];
      
      steps.forEach(({ delay, step, lawyers }) => {
        setTimeout(() => {
          setSearchStep(step);
          setFoundLawyers(lawyers);
        }, delay);
      });
      
      setTimeout(() => {
        onComplete();
      }, 5000);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  const searchSteps = [
    { icon: MapPin, text: "Analyzing your location", color: "text-blue-500" },
    { icon: Search, text: "Searching for nearby lawyers", color: "text-green-500" },
    { icon: Users, text: "Verifying lawyer credentials", color: "text-purple-500" },
    { icon: CheckCircle2, text: "Matching with available experts", color: "text-orange-500" },
    { icon: Star, text: "Ranking by expertise & ratings", color: "text-yellow-500" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-70 z-[9999] flex items-center justify-center"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Finding Legal Experts
        </h3>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {userLocation ? `${userLocation[0].toFixed(4)}, ${userLocation[1].toFixed(4)}` : "Getting location..."}
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {foundLawyers} lawyers found
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          {searchSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= searchStep;
            const isCompleted = index < searchStep;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isActive ? 1 : 0.3, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`flex items-center space-x-3 p-2 rounded-lg ${
                  isActive ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-green-500' : isActive ? 'bg-blue-500' : 'bg-gray-300'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  )}
                </div>
                <span className={`text-sm ${isActive ? step.color : 'text-gray-500'} ${
                  isActive ? 'font-medium' : ''
                }`}>
                  {step.text}
                </span>
                {isActive && !isCompleted && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(searchStep + 1) * 20}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
          />
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          Searching in your area for the best legal experts
        </p>
      </div>
    </motion.div>
  );
};

// Sample lawyer data (in production, this would come from API)
const SAMPLE_LAWYERS = [
  {
    id: 1,
    name: "Adv. Priya Sharma",
    specialization: "Corporate Law",
    experience: 12,
    rating: 4.9,
    reviews: 245,
    location: { lat: 28.6139, lng: 77.2090 },
    isOnline: true,
    isInCall: false,
    languages: ["English", "Hindi"],
    consultationFee: 2500,
    image: "/api/placeholder/150/150",
    expertise: ["Corporate Law", "Contract Law", "Compliance"],
    education: "LLM, Delhi University",
    barCouncil: "Delhi Bar Council",
    cases: 450,
    availability: "Available Now",
    responseTime: "2 min",
    successRate: 94
  },
  {
    id: 2,
    name: "Adv. Rajesh Kumar",
    specialization: "Criminal Law",
    experience: 15,
    rating: 4.8,
    reviews: 189,
    location: { lat: 28.6289, lng: 77.2065 },
    isOnline: true,
    isInCall: false,
    languages: ["English", "Hindi", "Punjabi"],
    consultationFee: 3000,
    image: "/api/placeholder/150/150",
    expertise: ["Criminal Law", "Bail Matters", "Appeals"],
    education: "LLB, Punjab University",
    barCouncil: "Punjab Bar Council",
    cases: 380,
    availability: "Available Now",
    responseTime: "1 min",
    successRate: 92
  },
  {
    id: 3,
    name: "Adv. Meera Patel",
    specialization: "Family Law",
    experience: 8,
    rating: 4.7,
    reviews: 156,
    location: { lat: 28.6219, lng: 77.2197 },
    isOnline: false,
    isInCall: false,
    languages: ["English", "Hindi", "Gujarati"],
    consultationFee: 2000,
    image: "/api/placeholder/150/150",
    expertise: ["Family Law", "Divorce", "Child Custody"],
    education: "LLB, Gujarat University",
    barCouncil: "Gujarat Bar Council",
    cases: 280,
    availability: "Available in 15 min",
    responseTime: "5 min",
    successRate: 89
  },
  {
    id: 4,
    name: "Adv. Amit Singh",
    specialization: "Property Law",
    experience: 10,
    rating: 4.8,
    reviews: 203,
    location: { lat: 28.6129, lng: 77.2295 },
    isOnline: true,
    isInCall: false,
    languages: ["English", "Hindi"],
    consultationFee: 2200,
    image: "/api/placeholder/150/150",
    expertise: ["Property Law", "Real Estate", "Documentation"],
    education: "LLM, BHU",
    barCouncil: "UP Bar Council",
    cases: 320,
    availability: "Available Now",
    responseTime: "3 min",
    successRate: 91
  },
  {
    id: 5,
    name: "Adv. Sunita Reddy",
    specialization: "Labor Law",
    experience: 14,
    rating: 4.9,
    reviews: 167,
    location: { lat: 28.6169, lng: 77.2310 },
    isOnline: true,
    isInCall: false,
    languages: ["English", "Hindi", "Telugu"],
    consultationFee: 2800,
    image: "/api/placeholder/150/150",
    expertise: ["Labor Law", "Employment", "Industrial Relations"],
    education: "LLB, Osmania University",
    barCouncil: "Telangana Bar Council",
    cases: 400,
    availability: "Available Now",
    responseTime: "2 min",
    successRate: 96
  }
];

// Comprehensive Indian Legal Bodies Data - All Major Cities
const COMPREHENSIVE_LEGAL_BODIES = [
  // Delhi Legal Bodies
  {
    id: 1, name: "Supreme Court of India", type: "supreme_court",
    location: { lat: 28.6245, lng: 77.2442 },
    address: "Tilak Marg, New Delhi, Delhi 110001",
    phone: "+91-11-2338-2792", email: "supremecourt@nic.in",
    website: "https://www.sci.gov.in/", jurisdiction: "All India",
    workingHours: "10:30 AM - 4:00 PM", rating: 4.9, isActive: true,
    services: ["Constitutional Matters", "Appeals from High Courts", "Special Leave Petitions"],
    establishedYear: 1950, totalJudges: 34, city: "New Delhi",
    description: "Highest judicial authority in India"
  },
  {
    id: 2, name: "Delhi High Court", type: "court",
    location: { lat: 28.6269, lng: 77.2395 },
    address: "Sher Shah Road, New Delhi, Delhi 110003",
    phone: "+91-11-2338-9596", email: "registrar@delhihighcourt.nic.in",
    website: "https://www.delhihighcourt.nic.in/", jurisdiction: "Delhi",
    workingHours: "10:00 AM - 5:00 PM", rating: 4.6, isActive: true,
    services: ["Civil Cases", "Criminal Appeals", "Writ Petitions", "Company Matters"],
    establishedYear: 1966, totalJudges: 45, city: "New Delhi",
    description: "Principal court of the National Capital Territory of Delhi"
  },
  {
    id: 3, name: "Bar Council of Delhi", type: "bar_council",
    location: { lat: 28.6358, lng: 77.2245 },
    address: "Legal Aid Building, Near High Court, New Delhi 110003",
    phone: "+91-11-2338-7540", email: "bcddelhi@gmail.com",
    website: "https://www.barcouncilofdelhi.com/", jurisdiction: "Delhi",
    workingHours: "9:00 AM - 5:30 PM", rating: 4.2, isActive: true,
    services: ["Lawyer Registration", "Legal Ethics", "Disciplinary Actions"],
    establishedYear: 1958, totalMembers: 15000, city: "New Delhi",
    description: "Regulatory body for legal profession in Delhi"
  },
  
  // Mumbai Legal Bodies
  {
    id: 4, name: "Bombay High Court", type: "court",
    location: { lat: 18.9270, lng: 72.8314 },
    address: "Fort, Mumbai, Maharashtra 400001",
    phone: "+91-22-2262-1612", email: "registrar@bombayhighcourt.nic.in",
    website: "https://bombayhighcourt.nic.in/", jurisdiction: "Maharashtra & Goa",
    workingHours: "10:15 AM - 4:30 PM", rating: 4.7, isActive: true,
    services: ["Civil Appeals", "Criminal Appeals", "Writ Petitions", "Corporate Law"],
    establishedYear: 1862, totalJudges: 78, city: "Mumbai",
    description: "One of the oldest High Courts in India"
  },
  {
    id: 5, name: "Bar Council of Maharashtra & Goa", type: "bar_council",
    location: { lat: 18.9320, lng: 72.8347 },
    address: "High Court Premises, Mumbai 400001",
    phone: "+91-22-2262-3628", email: "info@bcmg.org",
    website: "https://www.bcmg.org/", jurisdiction: "Maharashtra & Goa",
    workingHours: "9:30 AM - 6:00 PM", rating: 4.1, isActive: true,
    services: ["Advocate Enrollment", "Professional Standards", "Legal Education"],
    establishedYear: 1961, totalMembers: 45000, city: "Mumbai",
    description: "Regulates legal profession in Maharashtra and Goa"
  },
  
  // Bangalore Legal Bodies
  {
    id: 6, name: "Karnataka High Court", type: "court",
    location: { lat: 12.9722, lng: 77.5915 },
    address: "Attara Kacheri, Bangalore, Karnataka 560001",
    phone: "+91-80-2221-3962", email: "registrar@karnatakajudiciary.kar.nic.in",
    website: "https://www.karnatakajudiciary.kar.nic.in/", jurisdiction: "Karnataka",
    workingHours: "10:30 AM - 4:15 PM", rating: 4.5, isActive: true,
    services: ["IT Law", "Corporate Disputes", "Constitutional Matters", "Land Disputes"],
    establishedYear: 1884, totalJudges: 62, city: "Bangalore",
    description: "High Court with expertise in technology and corporate law"
  },
  {
    id: 7, name: "Karnataka State Legal Services Authority", type: "legal_aid",
    location: { lat: 12.9750, lng: 77.5980 },
    address: "MS Building, Bangalore, Karnataka 560001",
    phone: "+91-80-2235-4501", email: "karnataka@nalsa.gov.in",
    website: "https://kelsa.kar.nic.in/", jurisdiction: "Karnataka",
    workingHours: "9:00 AM - 5:30 PM", rating: 4.3, isActive: true,
    services: ["Free Legal Aid", "Legal Literacy", "Lok Adalat", "Mediation"],
    establishedYear: 1987, beneficiaries: 50000, city: "Bangalore",
    description: "Provides free legal services to the underprivileged"
  },
  
  // Chennai Legal Bodies  
  {
    id: 8, name: "Madras High Court", type: "court",
    location: { lat: 13.0825, lng: 80.2709 },
    address: "High Court Campus, Chennai, Tamil Nadu 600104",
    phone: "+91-44-2534-1722", email: "registrar@mhc.tn.gov.in",
    website: "https://www.mhc.tn.gov.in/", jurisdiction: "Tamil Nadu & Puducherry",
    workingHours: "10:30 AM - 4:30 PM", rating: 4.6, isActive: true,
    services: ["Constitutional Law", "Service Matters", "Land Revenue", "Criminal Appeals"],
    establishedYear: 1862, totalJudges: 75, city: "Chennai",
    description: "Second oldest High Court in India"
  },
  {
    id: 9, name: "Tamil Nadu State Legal Services Authority", type: "legal_aid",
    location: { lat: 13.0850, lng: 80.2750 },
    address: "High Court Buildings, Chennai 600104",
    phone: "+91-44-2534-2750", email: "tnslsa@tn.gov.in",
    website: "https://www.tnslsa.tn.gov.in/", jurisdiction: "Tamil Nadu",
    workingHours: "9:30 AM - 5:00 PM", rating: 4.2, isActive: true,
    services: ["Legal Aid Services", "Alternative Dispute Resolution", "Legal Awareness"],
    establishedYear: 1987, beneficiaries: 75000, city: "Chennai",
    description: "Tamil Nadu's premier legal aid organization"
  },
  
  // Kolkata Legal Bodies
  {
    id: 10, name: "Calcutta High Court", type: "court",
    location: { lat: 22.5726, lng: 88.3639 },
    address: "Esplanade, Kolkata, West Bengal 700001",
    phone: "+91-33-2243-4289", email: "registrar@calcuttahighcourt.nic.in",
    website: "https://www.calcuttahighcourt.nic.in/", jurisdiction: "West Bengal & Andaman & Nicobar",
    workingHours: "10:30 AM - 4:30 PM", rating: 4.4, isActive: true,
    services: ["Commercial Law", "Intellectual Property", "Constitutional Matters"],
    establishedYear: 1862, totalJudges: 71, city: "Kolkata",
    description: "Oldest High Court in India"
  },
  
  // Hyderabad Legal Bodies
  {
    id: 11, name: "Telangana High Court", type: "court",
    location: { lat: 17.4126, lng: 78.4094 },
    address: "Nayapul, Hyderabad, Telangana 500001",
    phone: "+91-40-2340-4307", email: "registrar@hcts.nic.in",
    website: "https://www.hcts.nic.in/", jurisdiction: "Telangana & Andhra Pradesh",
    workingHours: "10:15 AM - 4:00 PM", rating: 4.5, isActive: true,
    services: ["IT Disputes", "Real Estate", "Public Interest Litigation", "Tax Matters"],
    establishedYear: 1954, totalJudges: 42, city: "Hyderabad",
    description: "High Court serving the Telugu states"
  },
  
  // Additional Important Legal Bodies
  {
    id: 12, name: "National Legal Services Authority (NALSA)", type: "legal_aid",
    location: { lat: 28.6139, lng: 77.2090 },
    address: "Jawahar Lal Nehru Marg, New Delhi 110002",
    phone: "+91-11-2338-8922", email: "nalsa@nic.in",
    website: "https://nalsa.gov.in/", jurisdiction: "All India",
    workingHours: "9:00 AM - 6:00 PM", rating: 4.7, isActive: true,
    services: ["National Legal Aid", "Policy Formation", "Training Programs"],
    establishedYear: 1987, beneficiaries: 500000, city: "New Delhi",
    description: "Apex body for legal aid services in India"
  }
];

// Backwards compatibility
const mockLegalBodies = COMPREHENSIVE_LEGAL_BODIES;

// Legal Body Marker Component
const LegalBodyMarker = ({ legalBody, isSelected, onSelect, theme }) => {
  const icon = createLegalBodyIcon(legalBody.type, isSelected);
  
  const getTypeIcon = (type) => {
    const icons = {
      court: Gavel,
      supreme_court: Scale,
      bar_council: Shield,
      legal_aid: Heart,
      notary: FileCheck
    };
    return icons[type] || Building;
  };

  const TypeIcon = getTypeIcon(legalBody.type);
  
  return (
    <Marker 
      position={[legalBody.location.lat, legalBody.location.lng]} 
      icon={icon}
      eventHandlers={{
        click: () => onSelect(legalBody),
      }}
    >
      <Popup className="legal-body-popup">
        <div className={`p-3 min-w-[250px] max-w-[300px] ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
          {/* Header */}
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
              <TypeIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm">{legalBody.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{legalBody.type.replace('_', ' ').toUpperCase()}</p>
            </div>
          </div>
          
          {/* Quick Info */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center space-x-2 text-xs">
              <MapPin className="w-3 h-3 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-300 truncate">{legalBody.jurisdiction}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <Clock className="w-3 h-3 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-300">{legalBody.workingHours}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <Star className="w-3 h-3 text-yellow-500" />
              <span className="text-gray-600 dark:text-gray-300">{legalBody.rating}/5.0</span>
            </div>
          </div>
          
          {/* Status */}
          <div className={`flex items-center space-x-2 p-2 rounded-lg mb-3 ${legalBody.isActive ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            {legalBody.isActive ? (
              <CheckCircle className="w-3 h-3 text-green-500" />
            ) : (
              <XCircle className="w-3 h-3 text-red-500" />
            )}
            <span className={`text-xs font-medium ${legalBody.isActive ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              {legalBody.isActive ? 'Operational' : 'Closed'}
            </span>
          </div>
          
          {/* Action Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(legalBody);
            }}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors"
          >
            View Details
          </button>
        </div>
      </Popup>
    </Marker>
  );
};

// Compact Bottom Stats Bar - No Header Interference  
const CompactStatsBar = ({ 
  onlineLawyersCount, 
  legalBodiesCount, 
  theme,
  isDragging,
  searchRadius 
}) => {
  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-[1000] pointer-events-none">
      <div className="pointer-events-auto">
        <div className={`flex items-center space-x-4 px-6 py-3 rounded-full shadow-xl backdrop-blur-md border ${
          theme === 'dark' 
            ? 'bg-black/90 text-white border-gray-600' 
            : 'bg-white/95 text-gray-900 border-gray-300'
        }`}>
          {/* Online Lawyers */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75"></div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-sm font-semibold">{onlineLawyersCount}</div>
          </div>
          
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
          
          {/* Legal Bodies */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm font-semibold">{legalBodiesCount}</div>
          </div>
          
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
          
          {/* Status */}
          <div className="flex items-center space-x-2">
            {isDragging ? (
              <>
                <Move className="w-4 h-4 text-blue-500 animate-bounce" />
                <span className="text-sm font-medium text-blue-600">Exploring...</span>
              </>
            ) : (
              <>
                <Target className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{searchRadius/1000}km</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Floating Side Controls - Right Side Only
const FloatingSideControls = ({ 
  theme, 
  onToggleFilters, 
  showLegalBodies, 
  onToggleLegalBodies 
}) => {
  return (
    <div className="absolute top-20 right-4 z-[1000] pointer-events-none">
      <div className="pointer-events-auto space-y-3">
        {/* Toggle Legal Bodies */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleLegalBodies}
          className={`p-3 rounded-2xl shadow-lg backdrop-blur-md transition-all duration-200 border ${
            showLegalBodies
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-500/25'
              : theme === 'dark' 
                ? 'bg-black/70 text-white border-gray-700 hover:bg-gray-800/80' 
                : 'bg-white/90 text-gray-900 border-gray-200 hover:bg-gray-50/90'
          }`}
          title="Toggle Legal Bodies"
        >
          <Building2 className="w-5 h-5" />
        </motion.button>

        {/* Filters */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleFilters}
          className={`p-3 rounded-2xl shadow-lg backdrop-blur-md transition-all duration-200 border ${
            theme === 'dark' 
              ? 'bg-black/70 text-white border-gray-700 hover:bg-gray-800/80' 
              : 'bg-white/90 text-gray-900 border-gray-200 hover:bg-gray-50/90'
          }`}
          title="Filters & Settings"
        >
          <Settings className="w-5 h-5" />
        </motion.button>

        {/* Compact Legend */}
        <div className={`p-3 rounded-2xl shadow-lg backdrop-blur-md border ${
          theme === 'dark' 
            ? 'bg-black/80 text-white border-gray-700' 
            : 'bg-white/95 text-gray-900 border-gray-200'
        }`}>
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
              <span className="text-xs">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
              <span className="text-xs">Busy</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-indigo-600 rounded-sm"></div>
              <span className="text-xs">Legal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fixed Smooth Zoom Controls - No Infinite Tiles Issue
const CustomZoomControls = ({ theme }) => {
  const map = useMap();
  
  const handleZoomIn = () => {
    try {
      const currentZoom = map.getZoom();
      if (currentZoom < 18) { // Max zoom limit
        map.setZoom(currentZoom + 1, { animate: true });
      }
    } catch (error) {
      console.log('Zoom in error:', error);
    }
  };
  
  const handleZoomOut = () => {
    try {
      const currentZoom = map.getZoom();
      if (currentZoom > 3) { // Min zoom limit
        map.setZoom(currentZoom - 1, { animate: true });
      }
    } catch (error) {
      console.log('Zoom out error:', error);
    }
  };
  
  return (
    <div className="absolute bottom-20 right-4 z-[1000] pointer-events-none">
      <div className="pointer-events-auto custom-zoom-controls">
        <div className={`flex flex-col rounded-2xl shadow-xl backdrop-blur-md border overflow-hidden ${
          theme === 'dark' 
            ? 'bg-black/90 border-gray-600' 
            : 'bg-white/95 border-gray-300'
        }`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleZoomIn}
            className={`p-4 transition-all duration-150 border-b active:scale-95 ${
              theme === 'dark' 
                ? 'text-white hover:bg-gray-800/80 active:bg-gray-700/80 border-gray-600' 
                : 'text-gray-900 hover:bg-gray-50/80 active:bg-gray-100/80 border-gray-200'
            }`}
            title="Zoom In"
            aria-label="Zoom In"
          >
            <PlusCircle className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleZoomOut}
            className={`p-4 transition-all duration-150 active:scale-95 ${
              theme === 'dark' 
                ? 'text-white hover:bg-gray-800/80 active:bg-gray-700/80' 
                : 'text-gray-900 hover:bg-gray-50/80 active:bg-gray-100/80'
            }`}
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="w-4 h-0.5 bg-current rounded-full"></div>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// Click-to-Move Map Handler
const MapClickHandler = ({ onLocationChange, setIsDragging }) => {
  const map = useMap();
  
  useEffect(() => {
    const handleClick = (e) => {
      const newPosition = [e.latlng.lat, e.latlng.lng];
      setIsDragging(true);
      
      // Smooth animation to new position
      setTimeout(() => {
        onLocationChange(newPosition);
        setIsDragging(false);
      }, 300);
    };
    
    map.on('click', handleClick);
    
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onLocationChange, setIsDragging]);
  
  return null;
};

// Enhanced Professional animated lawyer marker
const LawyerMarker = ({ lawyer, isSelected, onSelect, theme }) => {
  const icon = createLawyerIcon(lawyer.isOnline, isSelected, lawyer.isInCall);
  
  return (
    <Marker 
      position={[lawyer.location.lat, lawyer.location.lng]} 
      icon={icon}
      eventHandlers={{
        click: () => onSelect(lawyer),
      }}
    >
      <Popup className="lawyer-popup">
        <div className={`p-4 min-w-[280px] max-w-[320px] ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-xl shadow-2xl`}>
          {/* Professional Header */}
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-full mx-auto overflow-hidden border-4 border-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
              <img 
                src={lawyer.image} 
                alt={lawyer.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Enhanced status indicator with premium animations */}
            <div className="absolute -bottom-2 -right-2">
              {lawyer.isOnline && !lawyer.isInCall && (
                <div className="relative">
                  <div className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-40 scale-150"></div>
                  <div className="absolute inset-0 rounded-full animate-ping bg-green-300 opacity-30 scale-125" style={{animationDelay: '0.5s'}}></div>
                  <div className="w-7 h-7 bg-green-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}
              
              {lawyer.isOnline && lawyer.isInCall && (
                <div className="relative">
                  <div className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-40"></div>
                  <div className="w-7 h-7 bg-red-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              )}
              
              {!lawyer.isOnline && (
                <div className="w-7 h-7 bg-gray-400 rounded-full border-3 border-white shadow-lg"></div>
              )}
            </div>
            
            {/* Professional rating badge */}
            <div className="absolute -top-2 -left-2 w-9 h-9 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
              {lawyer.rating}
            </div>
            
            {/* Enhanced verification badge */}
            <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              <UserCheck className="w-4 h-4 text-white" />
            </div>
          </div>
          
          {/* Professional Info */}
          <div className="text-center mb-4">
            <h3 className="font-bold text-lg mb-1">{lawyer.name}</h3>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{lawyer.specialization}</p>
            </div>
            
            {/* Enhanced professional stats */}
            <div className="flex items-center justify-center space-x-4 mb-3">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">{lawyer.experience}Y</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">{lawyer.cases}</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">{lawyer.successRate}%</span>
              </div>
            </div>
            
            {/* Rating */}
            <div className="flex items-center justify-center space-x-2 mb-3">
              <ProfessionalRating rating={lawyer.rating} reviews={lawyer.reviews} size="sm" />
            </div>
            
            {/* Status */}
            <div className="flex items-center justify-center space-x-2 mb-4">
              <LawyerStatusIndicator 
                isOnline={lawyer.isOnline} 
                isInCall={lawyer.isInCall} 
                responseTime={lawyer.responseTime}
              />
            </div>
            
            {/* Consultation fee */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-center space-x-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">
                  ₹{lawyer.consultationFee}/consultation
                </span>
              </div>
            </div>
          </div>
          
          {/* Professional Action Buttons */}
          <div className="space-y-2">
            <button 
              onClick={() => onSelect(lawyer)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-center space-x-2">
                <User className="w-4 h-4" />
                <span>View Full Profile</span>
              </div>
            </button>
            
            {lawyer.isOnline && !lawyer.isInCall && (
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle quick call
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </div>
                </button>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle quick chat
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>Chat</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

// Professional Lawyer Details Modal with enhanced UI
const LawyerDetailsModal = ({ lawyer, isOpen, onClose, onCall, onChat, onBooking, theme }) => {
  if (!isOpen || !lawyer) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 z-[9999] flex items-center justify-center p-4 professional-blur"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`relative w-full max-w-3xl mx-4 rounded-3xl shadow-2xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} hover-lift`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Professional Header with Gradient */}
          <div className={`px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Legal Consultation</h2>
                  <p className="text-blue-100 text-sm">Professional Legal Services</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[70vh] overflow-y-auto modal-scroll">
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              {/* Professional Profile Header */}
              <div className="flex items-start space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gradient-to-r from-blue-500 to-purple-500 p-1">
                    <img 
                      src={lawyer.image} 
                      alt={lawyer.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white ${lawyer.isOnline ? 'bg-green-500' : 'bg-gray-400'} flex items-center justify-center`}>
                    {lawyer.isOnline && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                  </div>
                  
                  {/* Professional Badge */}
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {lawyer.name}
                    </h3>
                    <div className="flex items-center space-x-1 bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full">
                      <UserCheck className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">Verified</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    <p className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {lawyer.specialization}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-6 mb-3">
                    <ProfessionalRating rating={lawyer.rating} reviews={lawyer.reviews} size="md" />
                    <LawyerStatusIndicator 
                      isOnline={lawyer.isOnline} 
                      isInCall={lawyer.isInCall} 
                      responseTime={lawyer.responseTime}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{lawyer.experience} years experience</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{lawyer.cases} cases handled</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`text-center p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <Briefcase className="w-6 h-6 mx-auto mb-1 text-blue-500" />
                  <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {lawyer.experience} Years
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Experience
                  </div>
                </div>
                <div className={`text-center p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <Users className="w-6 h-6 mx-auto mb-1 text-green-500" />
                  <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {lawyer.cases}
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Cases
                  </div>
                </div>
                <div className={`text-center p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-purple-500" />
                  <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {lawyer.successRate}%
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Success Rate
                  </div>
                </div>
                <div className={`text-center p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <DollarSign className="w-6 h-6 mx-auto mb-1 text-yellow-500" />
                  <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    ₹{lawyer.consultationFee}
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Consultation
                  </div>
                </div>
              </div>

              {/* Expertise */}
              <div>
                <h4 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Areas of Expertise
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(lawyer.expertise || [lawyer.specialization]).map((skill, index) => (
                    <span 
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm ${theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Education & Credentials */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Education
                  </h4>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-5 h-5 text-blue-500" />
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {lawyer.education}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Bar Council
                  </h4>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {lawyer.barCouncil}
                    </span>
                  </div>
                </div>
              </div>

              {/* Languages */}
              <div>
                <h4 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Languages
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(lawyer.languages || ['English', 'Hindi']).map((language, index) => (
                    <span 
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm ${theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`}
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>

              {/* Response Time */}
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Average Response Time: {lawyer.responseTime}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Action Buttons */}
          <div className={`px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800`}>
            <div className="space-y-3">
              {/* Primary Action - Available Status */}
              {lawyer.isOnline && !lawyer.isInCall && (
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-600">Available for Instant Connection</span>
                </div>
              )}
              
              {lawyer.isInCall && (
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-red-600">Currently in a Call</span>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => onCall(lawyer)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-semibold btn-professional hover-lift transition-all duration-300 ${
                    lawyer.isOnline && !lawyer.isInCall
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!lawyer.isOnline || lawyer.isInCall}
                >
                  <Phone className="w-5 h-5" />
                  <span>Call Now</span>
                  {lawyer.isOnline && !lawyer.isInCall && (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse ml-1"></div>
                  )}
                </button>
                
                <button
                  onClick={() => onChat(lawyer)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-semibold btn-professional hover-lift transition-all duration-300 ${
                    lawyer.isOnline && !lawyer.isInCall
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!lawyer.isOnline || lawyer.isInCall}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat</span>
                  {lawyer.isOnline && !lawyer.isInCall && (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse ml-1"></div>
                  )}
                </button>
                
                <button
                  onClick={() => onBooking(lawyer)}
                  className="flex-1 flex items-center justify-center space-x-2 py-4 px-6 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-semibold btn-professional hover-lift transition-all duration-300 shadow-lg"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book</span>
                </button>
              </div>
              
              {/* Quick Info */}
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 mt-3">
                <div className="flex items-center space-x-1">
                  <Shield className="w-3 h-3" />
                  <span>Secure & Encrypted</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Verified Lawyer</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Professional Call interface modal with enhanced UI
const CallModal = ({ lawyer, isOpen, onClose, theme }) => {
  const [callStatus, setCallStatus] = useState('connecting'); // connecting, connected, ended
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState('excellent');
  const [isRecording, setIsRecording] = useState(false);
  const [callNotes, setCallNotes] = useState('');
  const [showCallNotes, setShowCallNotes] = useState(false);

  useEffect(() => {
    let interval;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  useEffect(() => {
    if (isOpen) {
      setCallStatus('connecting');
      setCallDuration(0);
      setIsRecording(false);
      setCallNotes('');
      setShowCallNotes(false);
      
      // Simulate connection process
      setTimeout(() => {
        setCallStatus('connected');
        setConnectionQuality('excellent');
      }, 3000);
    }
  }, [isOpen]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      onClose();
      setCallStatus('connecting');
      setCallDuration(0);
      setIsRecording(false);
      setCallNotes('');
    }, 2000);
  };

  const getConnectionColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const saveCallNotes = () => {
    // Here you can save the call notes to your backend
    console.log('Saving call notes:', callNotes);
    setShowCallNotes(false);
  };

  if (!isOpen || !lawyer) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-95 z-[9999] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: isMinimized ? 0.3 : 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`relative w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl overflow-hidden ${theme === 'dark' ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'}`}
          style={{ 
            transform: isMinimized ? 'translate(50%, 40%)' : 'translate(0, 0)',
            transformOrigin: 'top right'
          }}
        >
          {/* Professional Call Header */}
          <div className={`px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img 
                    src={lawyer.image} 
                    alt={lawyer.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white ${lawyer.isOnline ? 'bg-green-500' : 'bg-gray-400'} flex items-center justify-center`}>
                    {lawyer.isOnline && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{lawyer.name}</h3>
                  <p className="text-blue-100 text-sm">{lawyer.specialization}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${getConnectionColor()}`}></div>
                    <span className="text-sm text-blue-100">
                      {callStatus === 'connecting' ? 'Establishing secure connection...' : 
                       callStatus === 'connected' ? `Live Session - ${formatDuration(callDuration)}` : 
                       'Call Ended'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Call Status & Quality */}
              <div className="flex items-center space-x-4">
                {callStatus === 'connected' && (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${getConnectionColor()}`}></div>
                      <span className="text-sm text-blue-100 capitalize">{connectionQuality}</span>
                    </div>
                    {isRecording && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-red-200">Recording</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleEndCall}
                    className="p-2 rounded-full hover:bg-red-500/20 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Call Interface */}
          <div className="flex-1 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
            </div>
            
            {callStatus === 'connecting' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Phone className="w-8 h-8 text-blue-500 animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-white text-2xl font-bold mb-2">Connecting to {lawyer.name}</h3>
                  <p className="text-gray-300 text-lg">Establishing secure connection...</p>
                  <div className="mt-4 flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            {callStatus === 'connected' && (
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Professional Video Call Interface */}
                <div className="text-center">
                  <div className="relative mb-8">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-1 mx-auto">
                      <img 
                        src={lawyer.image} 
                        alt={lawyer.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-white text-3xl font-bold mb-2">{lawyer.name}</h3>
                  <p className="text-blue-200 text-lg mb-4">{lawyer.specialization}</p>
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-sm font-medium">Live Session</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 text-sm font-medium">{formatDuration(callDuration)}</span>
                    </div>
                  </div>
                  
                  {/* Professional stats during call */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{lawyer.rating}</div>
                      <div className="text-gray-400 text-sm">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{lawyer.cases}</div>
                      <div className="text-gray-400 text-sm">Cases</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{lawyer.experience}Y</div>
                      <div className="text-gray-400 text-sm">Experience</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {callStatus === 'ended' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PhoneOff className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-white text-2xl font-bold mb-2">Call Ended</h3>
                  <p className="text-gray-300 text-lg">Thank you for using Virtual Bakil</p>
                </div>
              </div>
            )}
            
            {/* Professional Call Controls */}
            {callStatus === 'connected' && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center space-x-4 bg-black/70 backdrop-blur-md rounded-2xl p-4">
                  <button
                    onClick={() => setIsAudioMuted(!isAudioMuted)}
                    className={`p-4 rounded-full transition-colors ${
                      isAudioMuted 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {isAudioMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
                  </button>
                  
                  <button
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className={`p-4 rounded-full transition-colors ${
                      !isVideoOn 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {isVideoOn ? <Video className="w-6 h-6 text-white" /> : <VideoOff className="w-6 h-6 text-white" />}
                  </button>
                  
                  <button
                    onClick={toggleRecording}
                    className={`p-4 rounded-full transition-colors ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-white animate-pulse' : 'bg-white'}`}></div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setShowCallNotes(!showCallNotes)}
                    className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                  >
                    <FileText className="w-6 h-6 text-white" />
                  </button>
                  
                  <button
                    onClick={handleEndCall}
                    className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                  >
                    <PhoneOff className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Call Notes Modal */}
            {showCallNotes && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
                  <h3 className="text-lg font-bold mb-4">Call Notes</h3>
                  <textarea
                    value={callNotes}
                    onChange={(e) => setCallNotes(e.target.value)}
                    placeholder="Add notes about this consultation..."
                    className="w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      onClick={() => setShowCallNotes(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveCallNotes}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Professional Chat interface modal with enhanced UI
const ChatModal = ({ lawyer, isOpen, onClose, theme }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [chatDuration, setChatDuration] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && lawyer) {
      setMessages([
        {
          id: 1,
          sender: 'lawyer',
          text: `Hello! I'm ${lawyer.name}. How can I help you with your legal concern today?`,
          timestamp: new Date(),
          type: 'text'
        }
      ]);
      setChatDuration(0);
      
      const interval = setInterval(() => {
        setChatDuration(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isOpen, lawyer]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: newMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate lawyer response
    setTimeout(() => {
      const lawyerResponse = {
        id: Date.now() + 1,
        sender: 'lawyer',
        text: "I understand your concern. Let me help you with that legal matter. Based on what you've shared, here's my professional advice...",
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, lawyerResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen || !lawyer) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`relative w-full max-w-4xl h-[85vh] rounded-3xl shadow-2xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Professional Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img 
                    src={lawyer.image} 
                    alt={lawyer.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white"
                  />
                  <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}>
                    {isOnline && <div className="w-2 h-2 bg-white rounded-full animate-pulse mx-auto mt-0.5"></div>}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold">{lawyer.name}</h3>
                  <p className="text-blue-100 text-sm">{lawyer.specialization}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-blue-100">Chat Session - {formatDuration(chatDuration)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-blue-100">Rating: {lawyer.rating}</div>
                  <div className="text-sm text-blue-200">{lawyer.cases} cases</div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 h-[calc(100%-140px)] modal-scroll">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`flex items-end space-x-2 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      {message.sender === 'user' ? (
                        <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <img 
                          src={lawyer.image} 
                          alt={lawyer.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className={`px-4 py-3 rounded-2xl max-w-sm ${
                      message.sender === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : theme === 'dark' 
                          ? 'bg-gray-700 text-white' 
                          : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' 
                          ? 'text-blue-100' 
                          : theme === 'dark' 
                            ? 'text-gray-400' 
                            : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-end space-x-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img 
                      src={lawyer.image} 
                      alt={lawyer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className={`px-4 py-3 rounded-2xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className={`px-6 py-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your legal question..."
                    className={`w-full px-4 py-3 rounded-2xl border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Paperclip className="w-5 h-5 text-gray-500" />
                </button>
                <button className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Smile className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Enhanced Location permission modal
const LocationModal = ({ isOpen, onAllow, onDeny, theme }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Enable Location Access</h3>
            <p className="text-blue-100 text-sm">
              We need your location to find the best lawyers near you and provide accurate legal assistance.
            </p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Search className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Find Nearby Lawyers</div>
                  <div className="text-sm text-gray-500">Discover legal experts in your area</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium">Quick Response</div>
                  <div className="text-sm text-gray-500">Get faster legal assistance</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium">Secure & Private</div>
                  <div className="text-sm text-gray-500">Your location is protected</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={onAllow}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Allow Location Access
              </button>
              
              <button
                onClick={onDeny}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Continue Without Location
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Main VirtualBakil component - Full Page Professional System
const VirtualBakil = () => {
  // Enhanced state management
  const [lawyers, setLawyers] = useState([]);
  const [legalBodies, setLegalBodies] = useState([]);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [selectedLegalBody, setSelectedLegalBody] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Modal states
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showSearchingModal, setShowSearchingModal] = useState(false);
  const [showLawyerModal, setShowLawyerModal] = useState(false);
  const [showLegalBodyModal, setShowLegalBodyModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  
  // UI states
  const [searchRadius, setSearchRadius] = useState(20000); // 20km for legal bodies
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStep, setConnectionStep] = useState('');
  const [onlineLawyersCount, setOnlineLawyersCount] = useState(0);
  const [legalBodiesCount, setLegalBodiesCount] = useState(0);
  const [showMapOverlay, setShowMapOverlay] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showLegalBodies, setShowLegalBodies] = useState(true);

  // Handle theme with fallback
  const themeState = useSelector((state) => state?.theme?.currentTheme || 'light');
  const theme = themeState;

  useEffect(() => {
    initializeComponent();
  }, []);

  // Calculate counts whenever data changes
  useEffect(() => {
    const onlineCount = lawyers.filter(lawyer => lawyer.isOnline && !lawyer.isInCall).length;
    setOnlineLawyersCount(onlineCount);
  }, [lawyers]);

  useEffect(() => {
    const activeBodiesCount = legalBodies.filter(body => body.isActive).length;
    setLegalBodiesCount(activeBodiesCount);
  }, [legalBodies]);

  const initializeComponent = async () => {
    try {
      setLoading(true);
      
      // Initialize with enhanced mock data
      setLawyers(COMPREHENSIVE_LAWYERS);
      setLegalBodies(COMPREHENSIVE_LEGAL_BODIES);
      setUserLocation([28.6139, 77.2090]); // Default Delhi location
      
      // Try to fetch real data from API
      try {
        if (lawyerAPI) {
          const nearbyLawyers = await lawyerAPI.getNearbyLawyers(
            { latitude: 28.6139, longitude: 77.2090 },
            searchRadius
          );
          if (nearbyLawyers && nearbyLawyers.length > 0) {
            setLawyers(nearbyLawyers);
          }
        }
      } catch (apiError) {
        console.log('API unavailable, using mock data:', apiError);
      }
      
      // Check if user has location permission
      if (navigator.geolocation) {
        // Try to get location automatically first
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const newLocation = [latitude, longitude];
            setUserLocation(newLocation);
            
            // Update lawyers and legal bodies for new location
            updateForNewLocation(newLocation);
            setLoading(false);
          },
          (error) => {
            console.log('Location permission needed:', error);
            setShowLocationModal(true);
            setLoading(false);
          },
          { 
            enableHighAccuracy: true, 
            timeout: 5000, 
            maximumAge: 0 
          }
        );
      } else {
        console.log('Geolocation not supported');
        setLoading(false);
      }
    } catch (err) {
      console.error('Initialization error:', err);
      setError('Failed to initialize Virtual Bakil');
      setLoading(false);
    }
  };

  const updateForNewLocation = async (newLocation) => {
    try {
      // Simulate fetching nearby lawyers and legal bodies for new location
      // In production, this would call actual APIs
      if (lawyerAPI) {
        const nearbyLawyers = await lawyerAPI.getNearbyLawyers(
          { latitude: newLocation[0], longitude: newLocation[1] },
          searchRadius
        );
        if (nearbyLawyers && nearbyLawyers.length > 0) {
          setLawyers(nearbyLawyers);
        }
      }
      
      // Filter legal bodies within radius of new location
      const nearbyLegalBodies = COMPREHENSIVE_LEGAL_BODIES.filter(body => {
        const distance = calculateDistance(
          newLocation[0], newLocation[1],
          body.location.lat, body.location.lng
        );
        return distance <= searchRadius;
      });
      setLegalBodies(nearbyLegalBodies);
      
    } catch (error) {
      console.log('Error updating for new location:', error);
    }
  };

  // Calculate distance between two points in meters
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const handleLocationAllow = () => {
    setShowLocationModal(false);
    setShowSearchingModal(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPos = [position.coords.latitude, position.coords.longitude];
        setUserLocation(userPos);
        updateForNewLocation(userPos);
        setShowSearchingModal(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setShowSearchingModal(false);
        // Continue with default location instead of showing error
        const defaultLocation = [28.6139, 77.2090];
        setUserLocation(defaultLocation);
        updateForNewLocation(defaultLocation);
      }
    );
  };

  const handleLocationDeny = () => {
    setShowLocationModal(false);
    // Continue with default location
  };

  const handleLawyerSelect = (lawyer) => {
    setSelectedLawyer(lawyer);
    setShowLawyerModal(true);
  };

  const handleLegalBodySelect = (legalBody) => {
    setSelectedLegalBody(legalBody);
    setShowLegalBodyModal(true);
  };

  const handleLocationChange = (newLocation) => {
    setUserLocation(newLocation);
    updateForNewLocation(newLocation);
  };

  const handleCall = async (lawyer) => {
    try {
      setSelectedLawyer(lawyer);
      setShowLawyerModal(false);
      
      // Show connection animation
      setConnectionStep('call');
      setShowConnectionModal(true);
      
      // Integrate with existing call API
      if (apiServices && apiServices.startCallSession) {
        try {
          const callSession = await apiServices.startCallSession(lawyer.id);
          console.log('Call session started:', callSession);
        } catch (apiError) {
          console.log('API call failed, proceeding with mock:', apiError);
        }
      }
      
      console.log('Starting call with:', lawyer);
      
      // Connection animation will auto-close and show call modal
    } catch (error) {
      console.error('Error starting call:', error);
      setSelectedLawyer(lawyer);
      setShowLawyerModal(false);
      setConnectionStep('call');
      setShowConnectionModal(true);
    }
  };

  const handleChat = async (lawyer) => {
    try {
      setSelectedLawyer(lawyer);
      setShowLawyerModal(false);
      
      // Show connection animation
      setConnectionStep('chat');
      setShowConnectionModal(true);
      
      // Integrate with existing chat API
      if (apiServices && apiServices.startChatSession) {
        try {
          const chatSession = await apiServices.startChatSession(lawyer.id);
          console.log('Chat session started:', chatSession);
        } catch (apiError) {
          console.log('API chat failed, proceeding with mock:', apiError);
        }
      }
      
      console.log('Starting chat with:', lawyer);
      
      // Connection animation will auto-close and show chat modal
    } catch (error) {
      console.error('Error starting chat:', error);
      setSelectedLawyer(lawyer);
      setShowLawyerModal(false);
      setConnectionStep('chat');
      setShowConnectionModal(true);
    }
  };

  const handleBooking = async (lawyer) => {
    try {
      console.log('Booking appointment with:', lawyer);
      setShowLawyerModal(false);
      
      // Integrate with existing booking API
      if (lawyerAPI && lawyerAPI.bookLawyerAppointment) {
        try {
          const appointmentData = {
            date: new Date().toISOString().split('T')[0],
            time: '14:00',
            type: 'consultation',
            notes: 'Virtual Bakil booking'
          };
          
          const booking = await lawyerAPI.bookLawyerAppointment(lawyer.id, appointmentData);
          console.log('Appointment booked:', booking);
          alert('Appointment booked successfully!');
        } catch (apiError) {
          console.log('API booking failed:', apiError);
          alert('Appointment request sent! You will receive confirmation shortly.');
        }
      } else {
        alert('Appointment request sent! You will receive confirmation shortly.');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      setShowLawyerModal(false);
      alert('Failed to book appointment. Please try again.');
    }
  };

  const handleConnectionComplete = () => {
    setShowConnectionModal(false);
    if (connectionStep === 'call') {
      setShowCallModal(true);
    } else if (connectionStep === 'chat') {
      setShowChatModal(true);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading Virtual Bakil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Full Page Professional Map Container */}
      <div className="absolute inset-0">
        {/* Enhanced Map Container - Header Friendly */}
        <div className="w-full h-full relative">
          
          {/* No Header Interference - Floating Side Controls Only */}
          <FloatingSideControls 
            theme={theme}
            onToggleFilters={() => setShowFilters(!showFilters)}
            showLegalBodies={showLegalBodies}
            onToggleLegalBodies={() => setShowLegalBodies(!showLegalBodies)}
          />

          {/* Bottom Stats Bar - No Header Conflict */}
          <CompactStatsBar 
            onlineLawyersCount={onlineLawyersCount}
            legalBodiesCount={legalBodiesCount}
            theme={theme}
            isDragging={isDragging}
            searchRadius={searchRadius}
          />
          
          {/* Enhanced Map with Click-to-Move & Smooth Zoom */}
          <MapContainer 
            center={userLocation || [28.6139, 77.2090]} 
            zoom={13}
            minZoom={3}
            maxZoom={18}
            className="w-full h-full z-0"
            zoomControl={false}
            scrollWheelZoom={true}
            doubleClickZoom={true}
            touchZoom={true}
            dragging={true}
            zoomAnimation={true}
            fadeAnimation={true}
            markerZoomAnimation={true}
            zoomSnap={1}
            zoomDelta={1}
            wheelPxPerZoomLevel={120}
            style={{ background: 'transparent' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              maxZoom={18}
              minZoom={3}
              keepBuffer={2}
              updateWhenZooming={false}
              updateWhenIdle={true}
            />

            {/* Click-to-Move Location Handler */}
            <MapClickHandler 
              onLocationChange={handleLocationChange}
              setIsDragging={setIsDragging}
            />

            {/* Smooth Custom Zoom Controls Inside Map */}
            <CustomZoomControls theme={theme} />
            
            {/* Enhanced user location picker */}
            {userLocation && (
              <LocationPicker 
                position={userLocation} 
                onLocationChange={handleLocationChange}
                isDragging={isDragging}
                setIsDragging={setIsDragging}
                theme={theme}
              />
            )}
            
            {/* Search radius circle - more subtle */}
            {userLocation && (
              <Circle
                center={userLocation}
                radius={searchRadius}
                fillColor={theme === 'dark' ? '#3b82f6' : '#6366f1'}
                fillOpacity={0.05}
                color={theme === 'dark' ? '#3b82f6' : '#6366f1'}
                weight={2}
                dashArray="5, 5"
              />
            )}
            
            {/* Enhanced lawyer markers */}
            {lawyers.map((lawyer) => (
              <LawyerMarker
                key={lawyer.id}
                lawyer={lawyer}
                isSelected={selectedLawyer?.id === lawyer.id}
                onSelect={handleLawyerSelect}
                theme={theme}
              />
            ))}

            {/* Legal body markers */}
            {showLegalBodies && legalBodies.map((legalBody) => (
              <LegalBodyMarker
                key={legalBody.id}
                legalBody={legalBody}
                isSelected={selectedLegalBody?.id === legalBody.id}
                onSelect={handleLegalBodySelect}
                theme={theme}
              />
            ))}
          </MapContainer>
        </div>
      </div>
      
      {/* Enhanced Professional Modals */}
      <LocationModal
        isOpen={showLocationModal}
        onAllow={handleLocationAllow}
        onDeny={handleLocationDeny}
        theme={theme}
      />
      
      <EnhancedSearchAnimation
        isVisible={showSearchingModal}
        userLocation={userLocation}
        onComplete={() => setShowSearchingModal(false)}
      />
      
      <ConnectionAnimation
        isVisible={showConnectionModal}
        lawyerName={selectedLawyer?.name || 'Legal Professional'}
        onComplete={handleConnectionComplete}
      />
      
      <LawyerDetailsModal
        lawyer={selectedLawyer}
        isOpen={showLawyerModal}
        onClose={() => setShowLawyerModal(false)}
        onCall={handleCall}
        onChat={handleChat}
        onBooking={handleBooking}
        theme={theme}
      />

      <LegalBodyInfoModal
        legalBody={selectedLegalBody}
        isOpen={showLegalBodyModal}
        onClose={() => setShowLegalBodyModal(false)}
        theme={theme}
      />
      
      <CallModal
        lawyer={selectedLawyer}
        isOpen={showCallModal}
        onClose={() => setShowCallModal(false)}
        theme={theme}
      />
      
      <ChatModal
        lawyer={selectedLawyer}
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        theme={theme}
      />
    </div>
  );
};

export default VirtualBakil;
