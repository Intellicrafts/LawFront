import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import { 
  User, 
  Phone, 
  Video, 
  MessageCircle, 
  MapPin, 
  Star, 
  Search, 
  Clock,
  CheckCircle,
  X,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Minimize2,
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
  BookOpen,
  CheckCircle2,
  Send,
  FileText,
  Paperclip,
  Smile,
  VideoOff,
  Zap,
  TrendingUp,
  Archive,
  Bell
} from 'lucide-react';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';

// Professional Premium Styles
const premiumStyles = {
  glassmorphism: "backdrop-blur-xl bg-white/10 border border-white/20",
  glassmorphismDark: "backdrop-blur-xl bg-gray-900/20 border border-gray-700/30",
  gradientPrimary: "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600",
  gradientSecondary: "bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600",
  gradientAccent: "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500",
  shadowProfessional: "shadow-xl shadow-blue-500/10 dark:shadow-purple-500/10",
  shadowHover: "hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-purple-500/20",
  buttonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
  buttonSecondary: "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300",
  textGradient: "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
  premiumCard: "bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700",
  mobileFirst: "transition-all duration-300 ease-out",
  hoverLift: "hover:transform hover:-translate-y-1 transition-all duration-300",
  premiumBorder: "border-gradient-to-r from-blue-500 to-purple-500",
  glowEffect: "relative before:absolute before:-inset-0.5 before:bg-gradient-to-r before:from-blue-600 before:to-purple-600 before:rounded-2xl before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
};

// Professional Animation Presets
const animations = {
  slideUpFade: {
    initial: { opacity: 0, y: 60, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 60, scale: 0.9 },
    transition: { type: "spring", damping: 25, stiffness: 300 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  slideFromRight: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
    transition: { type: "spring", damping: 20, stiffness: 300 }
  }
};

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Sample lawyers data with premium demo images
const mockLawyers = [
  {
    id: 1,
    name: "Advocate Rajesh Kumar",
    specialization: "Civil Law",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 4.8,
    reviews: 127,
    experience: 15,
    location: { lat: 28.6139, lng: 77.2090 },
    consultationFee: 3000,
    isOnline: true,
    isInCall: false,
    responseTime: "5 min",
    successRate: 92,
    cases: 450,
    availability: "Available Now",
    expertise: ["Civil Law", "Property Law", "Contract Law"],
    languages: ["English", "Hindi", "Punjabi"],
    education: "LLB, Delhi University",
    barCouncil: "Delhi Bar Council",
    officeAddress: "Tis Hazari Courts, Delhi"
  },
  {
    id: 2,
    name: "Advocate Priya Sharma",
    specialization: "Criminal Law",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b377?w=150&h=150&fit=crop&crop=face",
    rating: 4.9,
    reviews: 89,
    experience: 12,
    location: { lat: 28.6239, lng: 77.2190 },
    consultationFee: 2500,
    isOnline: true,
    isInCall: false,
    responseTime: "3 min",
    successRate: 95,
    cases: 320,
    availability: "Available Now",
    expertise: ["Criminal Law", "Bail Applications", "Court Representation"],
    languages: ["English", "Hindi", "Marathi"],
    education: "LLM Criminal Law, JNU",
    barCouncil: "Delhi Bar Council",
    officeAddress: "Patiala House Courts, Delhi"
  },
  {
    id: 3,
    name: "Advocate Amit Verma",
    specialization: "Family Law",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 4.7,
    reviews: 156,
    experience: 18,
    location: { lat: 28.6339, lng: 77.2290 },
    consultationFee: 2800,
    isOnline: false,
    isInCall: false,
    responseTime: "10 min",
    successRate: 88,
    cases: 380,
    availability: "Offline",
    expertise: ["Family Law", "Divorce", "Child Custody"],
    languages: ["English", "Hindi", "Bengali"],
    education: "LLB, Calcutta University",
    barCouncil: "West Bengal Bar Council",
    officeAddress: "Rohini Courts, Delhi"
  },
  {
    id: 4,
    name: "Advocate Neha Gupta",
    specialization: "Corporate Law",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 4.8,
    reviews: 203,
    experience: 14,
    location: { lat: 28.6439, lng: 77.2390 },
    consultationFee: 3500,
    isOnline: true,
    isInCall: true,
    responseTime: "2 min",
    successRate: 93,
    cases: 520,
    availability: "In Call",
    expertise: ["Corporate Law", "Company Formation", "Compliance"],
    languages: ["English", "Hindi", "Gujarati"],
    education: "LLM Corporate Law, NLSIU",
    barCouncil: "Delhi Bar Council",
    officeAddress: "Saket Courts, Delhi"
  },
  {
    id: 5,
    name: "Advocate Suresh Patel",
    specialization: "Property Law",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    rating: 4.6,
    reviews: 98,
    experience: 20,
    location: { lat: 28.6539, lng: 77.2490 },
    consultationFee: 3200,
    isOnline: true,
    isInCall: false,
    responseTime: "7 min",
    successRate: 90,
    cases: 600,
    availability: "Available Now",
    expertise: ["Property Law", "Real Estate", "Land Disputes"],
    languages: ["English", "Hindi", "Gujarati"],
    education: "LLB, Gujarat University",
    barCouncil: "Gujarat Bar Council",
    officeAddress: "Dwarka Courts, Delhi"
  },
  {
    id: 6,
    name: "Advocate Kavya Reddy",
    specialization: "Labour Law",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    rating: 4.9,
    reviews: 134,
    experience: 11,
    location: { lat: 28.5439, lng: 77.1990 },
    consultationFee: 2200,
    isOnline: true,
    isInCall: false,
    responseTime: "4 min",
    successRate: 94,
    cases: 280,
    availability: "Available Now",
    expertise: ["Labour Law", "Employment Disputes", "Industrial Relations"],
    languages: ["English", "Hindi", "Telugu"],
    education: "LLM Labour Law, NALSAR",
    barCouncil: "Telangana Bar Council",
    officeAddress: "Karkardooma Courts, Delhi"
  }
];

// Indian Legal Buildings and Courts Data
const legalBuildings = [
  // Supreme Court and High Courts
  {
    id: 'sc_001',
    name: 'Supreme Court of India',
    type: 'supreme_court',
    location: { lat: 28.6217, lng: 77.2387 },
    address: 'Tilak Marg, New Delhi - 110001',
    established: 1950,
    jurisdiction: 'National',
    icon: '🏛️',
    description: 'Apex Court and Constitutional Guardian of India',
    phone: '+91-11-23388922',
    email: 'registrar@sci.nic.in',
    website: 'https://main.sci.gov.in',
    timings: {
      weekdays: '10:30 AM - 5:00 PM',
      saturday: '10:30 AM - 1:00 PM',
      sunday: 'Closed'
    },
    currentStatus: 'Open',
    todayCases: 127,
    chiefJustice: 'Hon\'ble Mr. Justice D.Y. Chandrachud',
    totalJudges: 34,
    facilities: ['Digital Court', 'Live Streaming', 'E-Filing', 'Library', 'Museum'],
    nearbyLawyers: 450,
    avgConsultationFee: 5000,
    languages: ['English', 'Hindi'],
    specialCourts: ['Constitutional Bench', 'Criminal Appeals', 'Civil Appeals'],
    recentUpdates: [
      { date: '2024-01-15', update: 'E-filing system upgraded with new features' },
      { date: '2024-01-10', update: 'Live streaming extended to all courts' }
    ]
  },
  {
    id: 'hc_001',
    name: 'Delhi High Court',
    type: 'high_court',
    location: { lat: 28.6280, lng: 77.2297 },
    address: 'Sher Shah Road, New Delhi - 110003',
    established: 1966,
    jurisdiction: 'National Capital Territory of Delhi',
    icon: '🏛️',
    description: 'Principal Civil Court of Original Jurisdiction for Delhi',
    phone: '+91-11-23885792',
    email: 'registrargeneral.dhc@nic.in',
    website: 'https://delhihighcourt.nic.in',
    timings: {
      weekdays: '10:15 AM - 4:30 PM',
      saturday: '10:15 AM - 2:00 PM',
      sunday: 'Closed'
    },
    currentStatus: 'Open',
    todayCases: 89,
    chiefJustice: 'Hon\'ble Mr. Justice Satish Chandra Sharma',
    totalJudges: 45,
    facilities: ['E-Court Services', 'Video Conferencing', 'Digital Filing', 'Cause Lists Online'],
    nearbyLawyers: 320,
    avgConsultationFee: 3500,
    languages: ['English', 'Hindi', 'Punjabi'],
    specialCourts: ['Commercial Court', 'Family Court', 'Company Law', 'Tax Appeals'],
    recentUpdates: [
      { date: '2024-01-16', update: 'New commercial court benches established' },
      { date: '2024-01-12', update: 'Fast-track courts for family matters launched' }
    ]
  },
  // District Courts in Delhi
  {
    id: 'dc_001',
    name: 'Tis Hazari Courts Complex',
    type: 'district_court',
    location: { lat: 28.6842, lng: 77.2215 },
    address: 'Civil Lines, Delhi - 110054',
    established: 1918,
    jurisdiction: 'North Delhi, Civil Lines, Model Town',
    icon: '⚖️',
    description: 'One of the largest court complexes in Asia',
    phone: '+91-11-23817359',
    email: 'registrar.tishazari@delhicourts.nic.in',
    website: 'https://delhicourts.nic.in/tishazari',
    timings: {
      weekdays: '10:00 AM - 5:00 PM',
      saturday: '10:00 AM - 2:00 PM',  
      sunday: 'Closed'
    },
    currentStatus: 'Open',
    todayCases: 456,
    totalCourts: 67,
    totalJudges: 78,
    facilities: ['Lok Adalat', 'Mediation Centre', 'Legal Aid', 'E-Filing', 'Canteen'],
    nearbyLawyers: 890,
    avgConsultationFee: 2500,
    languages: ['English', 'Hindi', 'Punjabi', 'Urdu'],
    specialCourts: ['Family Court', 'Motor Accident Claims', 'Consumer Court', 'Labour Court'],
    recentUpdates: [
      { date: '2024-01-17', update: 'New mediation centre operational' },
      { date: '2024-01-14', update: 'Digital cause list system launched' },
      { date: '2024-01-08', update: 'Weekend Lok Adalat sessions started' }
    ],
    practiceAreas: [
      { area: 'Civil Cases', cases: 156, avgTime: '8 months' },
      { area: 'Criminal Cases', cases: 234, avgTime: '6 months' },
      { area: 'Family Matters', cases: 66, avgTime: '4 months' }
    ]
  },
  {
    id: 'dc_002',
    name: 'Patiala House Courts',
    type: 'district_court',
    location: { lat: 28.6139, lng: 77.2172 },
    address: 'Patiala House, New Delhi',
    established: 1975,
    jurisdiction: 'Central Delhi',
    icon: '⚖️',
    description: 'Handles criminal cases and special courts'
  },
  {
    id: 'dc_003',
    name: 'Saket Courts Complex',
    type: 'district_court',
    location: { lat: 28.5245, lng: 77.2066 },
    address: 'Saket, New Delhi',
    established: 2009,
    jurisdiction: 'South Delhi',
    icon: '⚖️',
    description: 'Modern integrated court complex'
  },
  {
    id: 'dc_004',
    name: 'Rohini Courts',
    type: 'district_court',
    location: { lat: 28.7041, lng: 77.1025 },
    address: 'Rohini, Delhi',
    established: 2000,
    jurisdiction: 'North West Delhi',
    icon: '⚖️',
    description: 'Serves northern parts of Delhi'
  },
  {
    id: 'dc_005',
    name: 'Dwarka Courts',
    type: 'district_court',
    location: { lat: 28.5822, lng: 77.0458 },
    address: 'Dwarka, New Delhi',
    established: 2011,
    jurisdiction: 'South West Delhi',
    icon: '⚖️',
    description: 'Modern court complex serving Dwarka and nearby areas'
  },
  {
    id: 'dc_006',
    name: 'Karkardooma Courts',
    type: 'district_court',
    location: { lat: 28.6501, lng: 77.2900 },
    address: 'Karkardooma, Delhi',
    established: 1995,
    jurisdiction: 'East Delhi',
    icon: '⚖️',
    description: 'Major court complex for East Delhi'
  },
  // Tehsil and Subordinate Courts
  {
    id: 'tc_001',
    name: 'Civil Court Janakpuri',
    type: 'civil_court',
    location: { lat: 28.6219, lng: 77.0916 },
    address: 'Janakpuri, New Delhi',
    established: 1985,
    jurisdiction: 'Janakpuri area',
    icon: '🏢',
    description: 'Civil cases and revenue matters'
  },
  {
    id: 'tc_002',
    name: 'Civil Court Lajpat Nagar',
    type: 'civil_court',
    location: { lat: 28.5678, lng: 77.2439 },
    address: 'Lajpat Nagar, New Delhi',
    established: 1970,
    jurisdiction: 'South Central Delhi',
    icon: '🏢',
    description: 'Local civil and revenue court'
  },
  // Police Stations (as part of legal infrastructure)
  {
    id: 'ps_001',
    name: 'Connaught Place Police Station',
    type: 'police_station',
    location: { lat: 28.6304, lng: 77.2177 },
    address: 'Connaught Place, New Delhi',
    established: 1911,
    jurisdiction: 'Central Delhi',
    icon: '👮',
    description: 'Central police station for CP area'
  },
  {
    id: 'ps_002',
    name: 'Parliament Street Police Station',
    type: 'police_station',
    location: { lat: 28.6234, lng: 77.2086 },
    address: 'Parliament Street, New Delhi',
    established: 1920,
    jurisdiction: 'VIP area',
    icon: '👮',
    description: 'High-security police station'
  },
  // Legal Aid Offices
  {
    id: 'la_001',
    name: 'Delhi State Legal Services Authority',
    type: 'legal_aid',
    location: { lat: 28.6305, lng: 77.2246 },
    address: 'High Court Premises, Delhi',
    established: 1987,
    jurisdiction: 'Delhi',
    icon: '⚖️',
    description: 'Free legal aid and services'
  },
  // Bar Associations
  {
    id: 'ba_001',
    name: 'Delhi Bar Association',
    type: 'bar_association',
    location: { lat: 28.6289, lng: 77.2278 },
    address: 'High Court Premises, Delhi',
    established: 1950,
    jurisdiction: 'Delhi',
    icon: '👨‍💼',
    description: 'Professional body of advocates'
  },
  // Additional Courts and Legal Infrastructure
  {
    id: 'dc_007',
    name: 'Rouse Avenue Courts Complex',
    type: 'district_court',
    location: { lat: 28.6456, lng: 77.2428 },
    address: 'Rouse Avenue, New Delhi',
    established: 2019,
    jurisdiction: 'Central Delhi',
    icon: '⚖️',
    description: 'State-of-the-art court complex'
  },
  {
    id: 'tc_003',
    name: 'Mayur Vihar Courts',
    type: 'civil_court',
    location: { lat: 28.6093, lng: 77.3011 },
    address: 'Mayur Vihar Phase 1, Delhi',
    established: 1990,
    jurisdiction: 'East Delhi',
    icon: '🏢',
    description: 'Civil and revenue matters for East Delhi'
  },
  {
    id: 'ps_003',
    name: 'India Gate Police Station',
    type: 'police_station',
    location: { lat: 28.6129, lng: 77.2295 },
    address: 'India Gate, New Delhi',
    established: 1931,
    jurisdiction: 'Central Delhi',
    icon: '👮',
    description: 'Tourist area police station'
  },
  {
    id: 'ps_004',
    name: 'Karol Bagh Police Station',
    type: 'police_station',
    location: { lat: 28.6519, lng: 77.1909 },
    address: 'Karol Bagh, New Delhi',
    established: 1960,
    jurisdiction: 'Central Delhi',
    icon: '👮',
    description: 'Commercial area police station'
  },
  {
    id: 'la_002',
    name: 'National Legal Services Authority',
    type: 'legal_aid',
    location: { lat: 28.6217, lng: 77.2387 },
    address: 'Supreme Court Premises, New Delhi',
    established: 1987,
    jurisdiction: 'National',
    icon: '⚖️',
    description: 'National body for legal aid services'
  },
  {
    id: 'ba_002',
    name: 'Supreme Court Bar Association',
    type: 'bar_association',
    location: { lat: 28.6217, lng: 77.2387 },
    address: 'Supreme Court Premises, Delhi',
    established: 1951,
    jurisdiction: 'National',
    icon: '👨‍💼',
    description: 'Premier bar association of India'
  },
  // Tehsil Courts and Revenue Offices
  {
    id: 'tc_004',
    name: 'Revenue Office Shahdara',
    type: 'revenue_office',
    location: { lat: 28.6698, lng: 77.2854 },
    address: 'Shahdara, Delhi',
    established: 1975,
    jurisdiction: 'North East Delhi',
    icon: '🏛️',
    description: 'Revenue and land records office'
  },
  {
    id: 'tc_005',
    name: 'Sub-Divisional Magistrate Office',
    type: 'magistrate_office',
    location: { lat: 28.6304, lng: 77.2177 },
    address: 'Connaught Place, New Delhi',
    established: 1911,
    jurisdiction: 'Central Delhi',
    icon: '🏛️',
    description: 'Administrative and judicial functions'
  },
  // Mumbai High Court (for reference when map expands)
  {
    id: 'hc_002',
    name: 'Bombay High Court',
    type: 'high_court',
    location: { lat: 18.9299, lng: 72.8302 },
    address: 'Fort, Mumbai',
    established: 1862,
    jurisdiction: 'Maharashtra, Goa',
    icon: '🏛️',
    description: 'High Court of Bombay'
  },
  // Additional Legal Aid Centers
  {
    id: 'la_003',
    name: 'Legal Aid Clinic Lajpat Nagar',
    type: 'legal_aid',
    location: { lat: 28.5678, lng: 77.2439 },
    address: 'Lajpat Nagar, New Delhi',
    established: 1995,
    jurisdiction: 'South Delhi',
    icon: '⚖️',
    description: 'Community legal aid services'
  },

  // Major High Courts across India
  {
    id: 'hc_002',
    name: 'Bombay High Court',
    type: 'high_court',
    location: { lat: 18.9272, lng: 72.8311 },
    address: 'Fort, Mumbai, Maharashtra - 400001',
    established: 1862,
    jurisdiction: 'Maharashtra, Goa, Dadra and Nagar Haveli',
    icon: '🏛️',
    description: 'One of the oldest High Courts in India',
    phone: '+91-22-22701591',
    email: 'registrar.bombay@nic.in',
    website: 'https://bombayhighcourt.nic.in',
    timings: {
      weekdays: '10:30 AM - 4:45 PM',
      saturday: '10:30 AM - 1:30 PM',
      sunday: 'Closed'
    },
    currentStatus: 'Open',
    todayCases: 245,
    chiefJustice: 'Hon\'ble Mr. Justice Devendra Kumar Upadhyaya',
    totalJudges: 94,
    facilities: ['E-Court', 'Digital Filing', 'Live Streaming', 'Court Library'],
    nearbyLawyers: 680,
    avgConsultationFee: 4000,
    languages: ['English', 'Hindi', 'Marathi'],
    specialCourts: ['Commercial Division', 'Intellectual Property', 'Tax Appeals'],
    recentUpdates: [
      { date: '2024-01-15', update: 'New commercial court benches operational' },
      { date: '2024-01-08', update: 'Digital case management system upgraded' }
    ]
  },
  
  {
    id: 'hc_003',
    name: 'Calcutta High Court',
    type: 'high_court',
    location: { lat: 22.5697, lng: 88.3636 },
    address: 'Esplanade, Kolkata, West Bengal - 700001',
    established: 1862,
    jurisdiction: 'West Bengal, Jharkhand, Andaman & Nicobar Islands',
    icon: '🏛️',
    description: 'Oldest High Court in India with original jurisdiction',
    phone: '+91-33-22305065',
    email: 'registrar.calcutta@nic.in',
    website: 'https://calcuttahighcourt.gov.in',
    timings: {
      weekdays: '10:30 AM - 4:30 PM',
      saturday: '10:30 AM - 1:00 PM',
      sunday: 'Closed'
    },
    currentStatus: 'Open',
    todayCases: 198,
    chiefJustice: 'Hon\'ble Mr. Justice T.S. Sivagnanam',
    totalJudges: 71,
    facilities: ['Digital Courts', 'E-Filing', 'Video Conference', 'Legal Library'],
    nearbyLawyers: 520,
    avgConsultationFee: 3200,
    languages: ['English', 'Hindi', 'Bengali'],
    specialCourts: ['Commercial Court', 'Company Law Board', 'Admiralty Court'],
    recentUpdates: [
      { date: '2024-01-12', update: 'Digital cause list system launched' },
      { date: '2024-01-05', update: 'New fast-track commercial courts' }
    ]
  },

  {
    id: 'hc_004',
    name: 'Madras High Court',
    type: 'high_court',
    location: { lat: 13.0827, lng: 80.2707 },
    address: 'Parry\'s Corner, Chennai, Tamil Nadu - 600104',
    established: 1862,
    jurisdiction: 'Tamil Nadu and Puducherry',
    icon: '🏛️',
    description: 'High Court of Judicature at Madras',
    phone: '+91-44-25341897',
    email: 'registrar.madras@nic.in',
    website: 'https://hcmadras.nic.in',
    timings: {
      weekdays: '10:15 AM - 4:30 PM',
      saturday: '10:15 AM - 1:00 PM',
      sunday: 'Closed'
    },
    currentStatus: 'Open',
    todayCases: 312,
    chiefJustice: 'Hon\'ble Mr. Justice Sanjay V. Gangapurwala',
    totalJudges: 75,
    facilities: ['E-Courts', 'Virtual Courts', 'Digital Filing', 'Cause List Online'],
    nearbyLawyers: 890,
    avgConsultationFee: 3800,
    languages: ['English', 'Tamil', 'Hindi'],
    specialCourts: ['Commercial Court', 'Green Bench', 'Taxation'],
    recentUpdates: [
      { date: '2024-01-14', update: 'AI-powered case scheduling system' },
      { date: '2024-01-07', update: 'Virtual reality courtroom for training' }
    ]
  },

  {
    id: 'hc_005',
    name: 'Karnataka High Court',
    type: 'high_court',
    location: { lat: 12.9716, lng: 77.5946 },
    address: 'Ambedkar Veedhi, Bengaluru, Karnataka - 560001',
    established: 1884,
    jurisdiction: 'Karnataka State',
    icon: '🏛️',
    description: 'High Court of Karnataka',
    phone: '+91-80-22253627',
    email: 'registrar.karnataka@nic.in',
    website: 'https://karnatakajudiciary.kar.nic.in',
    timings: {
      weekdays: '10:30 AM - 4:30 PM',
      saturday: '10:30 AM - 1:00 PM',
      sunday: 'Closed'
    },
    currentStatus: 'Open',
    todayCases: 156,
    chiefJustice: 'Hon\'ble Mr. Justice Prasanna B. Varale',
    totalJudges: 62,
    facilities: ['Virtual Courts', 'E-Filing', 'Digital Library', 'Video Conferencing'],
    nearbyLawyers: 750,
    avgConsultationFee: 3500,
    languages: ['English', 'Kannada', 'Hindi'],
    specialCourts: ['IT Tribunal', 'Commercial Courts', 'Consumer Forums']
  },

  // Specialized Tribunals and Courts
  {
    id: 'ngt_001', 
    name: 'National Green Tribunal',
    type: 'tribunal',
    location: { lat: 28.6139, lng: 77.2290 },
    address: 'Faridkot House, New Delhi - 110003',
    established: 2010,
    jurisdiction: 'Pan India - Environmental Cases',
    icon: '🌱',
    description: 'Specialized tribunal for environmental protection',
    phone: '+91-11-43102111',
    email: 'registrar.ngt@gov.in',
    website: 'https://greentribunal.gov.in',
    timings: {
      weekdays: '10:30 AM - 4:00 PM',
      saturday: 'Closed',
      sunday: 'Closed'
    },
    currentStatus: 'Open',
    todayCases: 45,
    totalJudges: 20,
    facilities: ['Virtual Hearings', 'Online Filing', 'Environmental Library', 'Expert Panels'],
    nearbyLawyers: 180,
    avgConsultationFee: 4500,
    languages: ['English', 'Hindi'],
    specialCourts: ['Principal Bench', 'Regional Benches'],
    recentUpdates: [
      { date: '2024-01-16', update: 'New guidelines for industrial pollution cases' },
      { date: '2024-01-10', update: 'Fast-track disposal for air quality matters' }
    ]
  },

  // Legal Aid Centers
  {
    id: 'lac_001',
    name: 'Delhi State Legal Services Authority',
    type: 'legal_aid',
    location: { lat: 28.6219, lng: 77.2419 },
    address: 'High Court of Delhi, New Delhi - 110003',
    established: 1987,
    jurisdiction: 'Delhi State',
    icon: '🏛️',
    description: 'Free Legal Aid and Assistance to underprivileged',
    phone: '+91-11-23388922',
    email: 'dslsa@nic.in',
    website: 'https://dslsa.org',
    timings: {
      weekdays: '10:00 AM - 5:00 PM',
      saturday: '10:00 AM - 2:00 PM',
      sunday: 'Closed'
    },
    currentStatus: 'Open',
    facilities: ['Free Legal Consultation', 'Document Preparation', 'Court Representation', 'Mediation Services'],
    nearbyLawyers: 200,
    avgConsultationFee: 0,
    languages: ['English', 'Hindi', 'Punjabi', 'Urdu'],
    specialServices: ['Women Rights', 'Labor Disputes', 'Consumer Protection', 'Family Matters'],
    recentUpdates: [
      { date: '2024-01-17', update: 'New mobile legal aid units launched' },
      { date: '2024-01-11', update: 'Free legal literacy programs started' }
    ]
  },

  // Bar Associations
  {
    id: 'bar_001',
    name: 'Delhi Bar Association',
    type: 'bar_association',
    location: { lat: 28.6280, lng: 77.2250 },
    address: 'Tis Hazari Courts, Delhi - 110054',
    established: 1925,
    jurisdiction: 'Delhi',
    icon: '⚖️',
    description: 'Premier Bar Association of Delhi',
    phone: '+91-11-23817359',
    email: 'delhi.bar@gmail.com',
    website: 'https://delhibar.org',
    timings: {
      weekdays: '9:00 AM - 6:00 PM',
      saturday: '9:00 AM - 2:00 PM',
      sunday: 'Closed'
    },
    currentStatus: 'Open',
    facilities: ['Lawyer Directory', 'Legal Library', 'CLE Programs', 'Grievance Cell'],
    nearbyLawyers: 2500,
    avgConsultationFee: 2000,
    languages: ['English', 'Hindi'],
    specialServices: ['Lawyer Referral', 'Legal Education', 'Professional Ethics', 'Member Services']
  }
];

// Try to import lawyerAPI with fallback
let lawyerAPI = null;
try {
  const apiService = require('../api/apiService');
  lawyerAPI = apiService.lawyerAPI;
} catch (error) {
  console.log('lawyerAPI not available, using mock data:', error);
  lawyerAPI = {
    getNearbyLawyers: () => Promise.resolve(mockLawyers || [])
  };
}

// Premium Enhanced Lawyer Marker Icon with Professional Animations
const createLawyerIcon = (lawyer, isSelected) => {
  const { isOnline, isInCall, image } = lawyer;
  const size = isSelected ? 60 : 50;
  
  // Animation classes based on status
  const animationClass = isOnline 
    ? (isInCall ? 'animate-pulse-ring-busy' : 'animate-pulse-ring-online')
    : 'animate-pulse-slow';
    
  const borderColor = isInCall 
    ? '#ef4444' // Red for in-call
    : isOnline 
      ? '#10b981' // Green for online
      : '#6b7280'; // Gray for offline
      
  const pulseColor = isInCall 
    ? 'rgba(239, 68, 68, 0.4)' // Red pulse
    : isOnline 
      ? 'rgba(16, 185, 129, 0.4)' // Green pulse
      : 'rgba(107, 114, 128, 0.2)'; // Gray pulse
  
  return L.divIcon({
    html: `
      <div class="relative lawyer-marker-container" style="width: ${size}px; height: ${size}px;">
        ${isOnline ? `
          <!-- Online Status Rings -->
          <div class="absolute inset-0 ${animationClass}" style="
            background: ${pulseColor}; 
            border-radius: 50%; 
            animation-duration: ${isInCall ? '1.5s' : '2s'};
          "></div>
          <div class="absolute inset-1 ${animationClass}" style="
            background: ${pulseColor}; 
            border-radius: 50%; 
            animation-duration: ${isInCall ? '1.8s' : '2.5s'};
            animation-delay: 0.3s;
          "></div>
        ` : `
          <!-- Offline Status - Gentle Pulse -->
          <div class="absolute inset-0 animate-pulse" style="
            background: ${pulseColor}; 
            border-radius: 50%;
            animation-duration: 3s;
          "></div>
        `}
        
        <!-- Main Avatar Container -->
        <div class="relative bg-white rounded-full shadow-xl border-4" style="
          width: ${size}px; 
          height: ${size}px; 
          border-color: ${borderColor};
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08);
        ">
          <!-- Profile Image -->
          <div class="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative">
            <img 
              src="${image}" 
              alt="${lawyer.name}"
              class="w-full h-full object-cover transition-all duration-300 hover:scale-110"
              style="border-radius: inherit;"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
            />
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm" style="display: none;">
              ${lawyer.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          
          <!-- Status Badge -->
          <div class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs" style="
            background: ${isInCall ? 'linear-gradient(135deg, #ef4444, #dc2626)' : isOnline ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #6b7280, #4b5563)'};
          ">
            ${isInCall ? '📞' : isOnline ? '✅' : '⏸️'}
          </div>
          
          <!-- Specialization Badge (for selected) -->
          ${isSelected ? `
            <div class="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-2 py-1 rounded-full shadow-lg whitespace-nowrap">
              ${lawyer.specialization}
            </div>
          ` : ''}
        </div>
        
        <!-- Floating Action Indicators -->
        ${isOnline && !isInCall ? `
          <div class="absolute -top-1 -left-1 w-4 h-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
            <span class="text-white text-xs">⚡</span>
          </div>
        ` : ''}
        
        ${isInCall ? `
          <div class="absolute -top-1 -left-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
            <span class="text-white text-xs">🔴</span>
          </div>
        ` : ''}
      </div>
      
      <style>
        @keyframes pulse-ring-online {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        
        @keyframes pulse-ring-busy {
          0% { transform: scale(0.9); opacity: 1; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        .animate-pulse-ring-online {
          animation: pulse-ring-online 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }
        
        .animate-pulse-ring-busy {
          animation: pulse-ring-busy 1.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .lawyer-marker-container:hover {
          z-index: 1000;
        }
        
        .lawyer-marker-container:hover > div:first-child {
          transform: scale(1.1);
          transition: transform 0.2s ease-out;
        }
      </style>
    `,
    className: 'custom-premium-lawyer-marker',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
    popupAnchor: [0, -size/2],
  });
};

// Legal Building Marker Icon Creator
const createLegalBuildingIcon = (building) => {
  const getIconConfig = (type) => {
    switch (type) {
      case 'supreme_court':
        return { color: '#dc2626', bgColor: '#fef2f2', icon: '🏛️', size: 42, priority: 1 };
      case 'high_court':
        return { color: '#ea580c', bgColor: '#fff7ed', icon: '🏛️', size: 38, priority: 2 };
      case 'district_court':
        return { color: '#1d4ed8', bgColor: '#eff6ff', icon: '⚖️', size: 34, priority: 3 };
      case 'civil_court':
        return { color: '#059669', bgColor: '#f0fdf4', icon: '🏢', size: 30, priority: 4 };
      case 'police_station':
        return { color: '#dc2626', bgColor: '#fef2f2', icon: '👮', size: 26, priority: 5 };
      case 'legal_aid':
        return { color: '#7c3aed', bgColor: '#faf5ff', icon: '⚖️', size: 30, priority: 4 };
      case 'bar_association':
        return { color: '#0f766e', bgColor: '#f0fdfa', icon: '👨‍💼', size: 28, priority: 4 };
      case 'revenue_office':
        return { color: '#b45309', bgColor: '#fefbf3', icon: '🏛️', size: 28, priority: 5 };
      case 'magistrate_office':
        return { color: '#7c2d12', bgColor: '#fff7ed', icon: '🏛️', size: 30, priority: 4 };
      default:
        return { color: '#6b7280', bgColor: '#f9fafb', icon: '🏢', size: 24, priority: 6 };
    }
  };

  const config = getIconConfig(building.type);
  
  return L.divIcon({
    html: `
      <div class="legal-building-marker relative">
        <div class="animate-float" style="
          width: ${config.size}px;
          height: ${config.size}px;
          background: ${config.bgColor};
          border: 3px solid ${config.color};
          border-radius: 50%;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${config.size * 0.4}px;
        ">
          ${config.icon}
        </div>
        <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-2 rounded-full shadow-sm" style="border-color: ${config.color};"></div>
      </div>
      
      <style>
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .legal-building-marker:hover > div:first-child {
          transform: scale(1.1) translateY(-2px);
          transition: transform 0.2s ease-out;
        }
      </style>
    `,
    className: 'legal-building-icon',
    iconSize: [config.size, config.size + 4],
    iconAnchor: [config.size/2, config.size + 2],
    popupAnchor: [0, -(config.size + 4)],
  });
};

// Professional status indicators
const LawyerStatusIndicator = ({ isOnline, isInCall, responseTime }) => {
  if (isInCall) {
    return (
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-red-500 rounded-full status-busy"></div>
        <span className="text-xs text-red-600">In Call</span>
      </div>
    );
  }
  
  if (isOnline) {
    return (
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-green-500 rounded-full status-online"></div>
        <span className="text-xs text-green-600">Online • {responseTime}</span>
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

// ConnectionModal component with proper variable definitions
const ConnectionModal = ({ isOpen, onClose, onComplete, theme }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const connectionSteps = [
    { icon: Shield, text: "Verifying lawyer credentials", color: "text-emerald-500", bgColor: "bg-emerald-100 dark:bg-emerald-900/30" },
    { icon: PhoneCall, text: "Establishing secure connection", color: "text-blue-500", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
    { icon: Video, text: "Setting up live session", color: "text-purple-500", bgColor: "bg-purple-100 dark:bg-purple-900/30" },
    { icon: CheckCircle, text: "Preparing consultation room", color: "text-orange-500", bgColor: "bg-orange-100 dark:bg-orange-900/30" },
    { icon: Users, text: "Ready for legal consultation", color: "text-indigo-500", bgColor: "bg-indigo-100 dark:bg-indigo-900/30" }
  ];

  useEffect(() => {
    if (isOpen) {
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
      }, 800);
      
      return () => clearInterval(stepInterval);
    }
  }, [isOpen, onComplete, connectionSteps.length]);

  if (!isOpen) return null;
  

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 max-w-md w-full text-center`}
        >
          <h3 className="text-xl font-bold mb-6">Establishing Connection</h3>
          
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {connectionStep === 0 ? 'Connecting...' : 'Connected!'}
            </p>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep + 1) / connectionSteps.length * 100}%` }}
            ></div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Premium Enhanced Lawyer Search Animation with Advanced UI
const EnhancedSearchAnimation = ({ isVisible, userLocation, onComplete }) => {
  const [searchStep, setSearchStep] = useState(0);
  const [foundLawyers, setFoundLawyers] = useState(0);
  const [searchingText, setSearchingText] = useState("Initializing search...");
  
  useEffect(() => {
    if (isVisible) {
      const steps = [
        { delay: 0, step: 0, lawyers: 0, text: "Analyzing your location" },
        { delay: 1200, step: 1, lawyers: 3, text: "Scanning legal database" },
        { delay: 2400, step: 2, lawyers: 7, text: "Verifying credentials" },
        { delay: 3600, step: 3, lawyers: 12, text: "Ranking by expertise" },
        { delay: 4800, step: 4, lawyers: 15, text: "Preparing results" }
      ];
      
      steps.forEach(({ delay, step, lawyers, text }) => {
        setTimeout(() => {
          setSearchStep(step);
          setFoundLawyers(lawyers);
          setSearchingText(text);
        }, delay);
      });
      
      setTimeout(() => {
        onComplete();
      }, 6000);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  const searchSteps = [
    { 
      icon: MapPin, 
      text: "Analyzing your location", 
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      description: "Determining optimal search radius"
    },
    { 
      icon: Search, 
      text: "Searching for nearby lawyers", 
      color: "text-emerald-500",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      description: "Scanning legal professional database"
    },
    { 
      icon: Shield, 
      text: "Verifying lawyer credentials", 
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      description: "Checking bar council registrations"
    },
    { 
      icon: TrendingUp, 
      text: "Matching with available experts", 
      color: "text-orange-500",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      description: "Finding best matches for your needs"
    },
    { 
      icon: Star, 
      text: "Ranking by expertise & ratings", 
      color: "text-yellow-500",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      description: "Sorting by success rate and reviews"
    }
  ];

  return (
    <AnimatePresence>
      <motion.div
        {...animations.scaleIn}
        className="fixed inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-blue-900/30 backdrop-blur-2xl z-[9999] flex items-center justify-center p-4"
      >
        <motion.div
          {...animations.slideUpFade}
          className={`${premiumStyles.premiumCard} ${premiumStyles.shadowProfessional} max-w-lg w-full mx-4 overflow-hidden`}
        >
          {/* Premium Search Header */}
          <div className={`${premiumStyles.gradientSecondary} p-6 sm:p-8 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            
            {/* Animated Search Icon Container */}
            <div className="relative mb-6">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto">
                {/* Radar Animation */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400/20 to-blue-400/20 border border-emerald-400/40"
                />
                <motion.div
                  animate={{ 
                    scale: [1, 1.4, 1],
                    opacity: [0.2, 0.6, 0.2]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/10 to-purple-400/10 border border-blue-400/30"
                />
                
                {/* Rotating Border */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 rounded-full border-2 border-dashed border-white/50"
                />
                
                {/* Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Search className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </motion.div>
                  </div>
                </div>

                {/* Floating Search Indicators */}
                <motion.div
                  animate={{ 
                    y: [-5, 5, -5],
                    x: [-2, 2, -2]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </motion.div>
                
                <motion.div
                  animate={{ 
                    y: [5, -5, 5],
                    x: [2, -2, 2]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute -bottom-1 -left-1 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                </motion.div>
              </div>
            </div>
            
            <div className="text-center relative z-10">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Finding Legal Experts
              </h3>
              <p className="text-emerald-100 text-sm">
                Discovering the best lawyers in your area
              </p>
            </div>
          </div>

          {/* Premium Search Progress */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Live Search Stats */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {searchingText}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {userLocation ? `${userLocation[0].toFixed(2)}, ${userLocation[1].toFixed(2)}` : "Locating..."}
                </div>
              </div>
              
              {/* Professional Counter */}
              <div className="text-center">
                <motion.div
                  key={foundLawyers}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent"
                >
                  {foundLawyers}
                </motion.div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  qualified lawyers found
                </div>
              </div>
            </div>
            
            {/* Premium Search Steps */}
            <div className="space-y-3">
              {searchSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index <= searchStep;
                const isCompleted = index < searchStep;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ 
                      opacity: isActive ? 1 : 0.4, 
                      x: 0,
                      scale: isActive ? 1 : 0.95
                    }}
                    transition={{ 
                      delay: index * 0.2,
                      type: "spring",
                      damping: 20,
                      stiffness: 300 
                    }}
                    className={`relative p-4 rounded-xl transition-all duration-500 ${
                      isActive 
                        ? `${step.bgColor} ${premiumStyles.shadowProfessional}` 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {/* Progress Line */}
                    {index < searchSteps.length - 1 && (
                      <div className="absolute left-7 top-16 w-0.5 h-8 bg-gray-200 dark:bg-gray-700">
                        {isCompleted && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: '100%' }}
                            transition={{ delay: 0.3 }}
                            className="w-full bg-gradient-to-b from-emerald-500 to-blue-500 rounded-full"
                          />
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-start space-x-4">
                      {/* Step Icon */}
                      <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
                          : isActive 
                            ? `${premiumStyles.gradientSecondary}` 
                            : 'bg-gray-200 dark:bg-gray-700'
                      }`}>
                        {isCompleted ? (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", damping: 15, stiffness: 300 }}
                          >
                            <CheckCircle className="w-6 h-6 text-white" />
                          </motion.div>
                        ) : (
                          <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                        )}
                        
                        {/* Active pulse effect */}
                        {isActive && !isCompleted && (
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 animate-pulse opacity-20"></div>
                        )}
                      </div>
                      
                      {/* Step Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-semibold transition-colors duration-300 ${
                            isActive 
                              ? step.color 
                              : 'text-gray-400 dark:text-gray-500'
                          }`}>
                            {step.text}
                          </h4>
                          
                          {/* Status Indicator */}
                          {isActive && !isCompleted && (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full"
                            />
                          )}
                          
                          {isCompleted && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center"
                            >
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                            </motion.div>
                          )}
                        </div>
                        
                        <p className={`text-xs mt-1 transition-colors duration-300 ${
                          isActive 
                            ? 'text-gray-600 dark:text-gray-400' 
                            : 'text-gray-400 dark:text-gray-500'
                        }`}>
                          {step.description}
                        </p>
                        
                        {/* Progress indicator */}
                        {isCompleted && (
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ delay: 0.3 }}
                            className="h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mt-2"
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Professional Progress Bar */}
            <div className="relative pt-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((searchStep + 1) / searchSteps.length) * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-full ${premiumStyles.gradientSecondary} rounded-full relative`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </motion.div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>Starting</span>
                <span className="font-medium">{Math.round(((searchStep + 1) / searchSteps.length) * 100)}% Complete</span>
                <span>Ready</span>
              </div>
            </div>
            
            <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                🔍 Searching {Math.ceil(Math.random() * 500 + 200)} legal professionals in your area
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
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

// Location component to center map on user location
const LocationMarker = ({ position, setPosition }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 13);
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        <div className="text-center">
          <MapPin className="w-4 h-4 inline mr-1" />
          Your Location
        </div>
      </Popup>
    </Marker>
  );
};

// Premium Zoom Handler Component for Legal Buildings Visibility
const ZoomHandler = ({ onZoomChange }) => {
  const map = useMap();

  useEffect(() => {
    const handleZoomEnd = () => {
      const zoom = map.getZoom();
      onZoomChange(zoom);
    };

    map.on('zoomend', handleZoomEnd);
    
    // Set initial zoom
    handleZoomEnd();

    return () => {
      map.off('zoomend', handleZoomEnd);
    };
  }, [map, onZoomChange]);

  return null;
};

// Professional Map Overlay Component with Premium UI
const MapOverlay = ({ onlineLawyersCount, theme, onToggleFilters, showLegalBuildings, onToggleLegalBuildings, mapZoom, visibleBuildingsCount }) => {
  return (
    <div className="absolute top-6 left-6 right-6 z-[1000] pointer-events-none">
      <div className="flex items-start justify-between">
        {/* Online Lawyers Count & Legal Buildings Info */}
        <div className="space-y-4 pointer-events-auto">
          {/* Online Lawyers Card */}
          <div className={`px-5 py-4 rounded-2xl shadow-xl backdrop-blur-xl ${
            theme === 'dark' 
              ? 'bg-black/70 text-white border border-gray-700/50' 
              : 'bg-white/95 text-gray-900 border border-white/50'
          } ${premiumStyles.mobileFirst} premium-card-hover gpu-accelerated`}>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse-glow shadow-lg"></div>
              </div>
              <div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    {onlineLawyersCount}
                  </span>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Online Lawyers
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Available for consultation
                </p>
              </div>
            </div>
          </div>
          
          {/* Legal Buildings Card - Show when there are visible buildings */}
          {mapZoom >= 12 && (
            <div className={`px-5 py-4 rounded-2xl shadow-xl backdrop-blur-xl ${
              theme === 'dark' 
                ? 'bg-black/70 text-white border border-gray-700/50' 
                : 'bg-white/95 text-gray-900 border border-white/50'
            } ${premiumStyles.mobileFirst} premium-card-hover gpu-accelerated animate-slide-up-fade`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                                   <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Legal Infrastructure</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-3 leading-relaxed">
                      {showLegalBuildings ? `${visibleBuildingsCount} Buildings` : 'Hidden'} • Nearby
                    </p>
                  </div>
                </div>
                <button 
                  onClick={onToggleLegalBuildings}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    showLegalBuildings 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  } hover:scale-110`}
                >
                  {showLegalBuildings ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Simplified Controls */}
        <div className="flex items-center space-x-3 pointer-events-auto">
          <button 
            onClick={onToggleLegalBuildings}
            className={`px-4 py-3 rounded-2xl shadow-xl backdrop-blur-xl font-medium transition-all duration-300 hover:scale-105 ${
              showLegalBuildings
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/25'
                : theme === 'dark' 
                  ? 'bg-black/70 text-white border border-gray-700/50 hover:bg-black/80' 
                  : 'bg-white/95 text-gray-900 border border-white/50 hover:bg-white'
            } premium-card-hover gpu-accelerated`}
          >
            <div className="flex items-center space-x-2">
              <Navigation className="w-4 h-4" />
              <span className="text-sm">Nearby Legal Help</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

// Professional animated lawyer marker with wave animation for active lawyers only
const LawyerMarker = ({ lawyer, isSelected, onSelect, theme, onShowDirections }) => {
  const icon = createLawyerIcon(lawyer, isSelected);
  
  return (
    <Marker 
      position={[lawyer.location.lat, lawyer.location.lng]} 
      icon={icon}
      eventHandlers={{
        click: () => onSelect(lawyer),
      }}
    >
      <Popup>
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
            
            {/* Professional status indicator with wave animation */}
            <div className="absolute -bottom-2 -right-2">
              {lawyer.isOnline && !lawyer.isInCall && (
                <div className="relative">
                  <div className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-40 scale-150"></div>
                  <div className="absolute inset-0 rounded-full animate-ping bg-green-300 opacity-30 scale-125" style={{animationDelay: '0.5s'}}></div>
                  <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}
              
              {lawyer.isOnline && lawyer.isInCall && (
                <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
              
              {!lawyer.isOnline && (
                <div className="w-6 h-6 bg-gray-400 rounded-full border-2 border-white"></div>
              )}
            </div>
            
            {/* Professional badge */}
            <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
            
            {/* Verification badge */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <UserCheck className="w-3 h-3 text-white" />
            </div>
          </div>
          
          {/* Professional Info */}
          <div className="text-center mb-4">
            <h3 className="font-bold text-lg mb-1">{lawyer.name}</h3>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{lawyer.specialization}</p>
            </div>
            
            {/* Professional stats */}
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
              <div className="space-y-2">
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
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onShowDirections(lawyer, 'lawyer');
                  }}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <Navigation className="w-3 h-3" />
                    <span>Get Directions</span>
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

// Premium Enhanced Legal Building Marker with Professional Animations & Detailed Modal
const LegalBuildingMarker = ({ building, theme, onBuildingSelect, onShowDirections }) => {
  const handleBuildingClick = () => {
    onBuildingSelect(building);
  };

  return (
    <Marker
      position={[building.location.lat, building.location.lng]}
      icon={createLegalBuildingIcon(building)}
      eventHandlers={{
        click: handleBuildingClick,
      }}
    >
      <Popup className="legal-building-popup" maxWidth={350} closeButton={false}>
        <div className={`${premiumStyles.premiumCard} p-5 rounded-2xl overflow-hidden shadow-2xl`}>
          {/* Building Header with Status */}
          <div className="flex items-start space-x-4 mb-5">
            <div className="relative">
              <div className="text-4xl drop-shadow-lg">{building.icon}</div>
              {building.currentStatus && (
                <div className="absolute -bottom-1 -right-1">
                  <div className={`w-3 h-3 rounded-full border-2 border-white shadow-lg ${
                    building.currentStatus === 'Open' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                  }`}></div>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-lg leading-tight">
                {building.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                {building.description}
              </p>
              
              {/* Enhanced Status & Info */}
              <div className="flex items-center justify-between mb-3">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  building.type === 'supreme_court' 
                    ? 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-200 dark:from-red-900/30 dark:to-red-800/20 dark:text-red-400 dark:border-red-700/30' 
                    : building.type === 'high_court'
                      ? 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 border border-orange-200 dark:from-orange-900/30 dark:to-orange-800/20 dark:text-orange-400 dark:border-orange-700/30'
                      : building.type === 'district_court'
                        ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200 dark:from-blue-900/30 dark:to-blue-800/20 dark:text-blue-400 dark:border-blue-700/30'
                        : 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border border-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/20 dark:text-emerald-400 dark:border-emerald-700/30'
                }`}>
                  {building.type.replace(/_/g, ' ').toUpperCase()}
                </div>
                
                {building.currentStatus && (
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    building.currentStatus === 'Open' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {building.currentStatus}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Quick Stats Grid */}
          {building.todayCases && (
            <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{building.todayCases}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Today's Cases</div>
              </div>
              {building.nearbyLawyers && (
                <div className="text-center border-x border-gray-200 dark:border-gray-700">
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{building.nearbyLawyers}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Nearby Lawyers</div>
                </div>
              )}
              {building.avgConsultationFee && (
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">₹{building.avgConsultationFee}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Avg. Fee</div>
                </div>
              )}
            </div>
          )}
          
          {/* Quick Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-400 truncate">{building.address}</span>
            </div>
            
            {building.timings && (
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">{building.timings.weekdays}</span>
              </div>
            )}
            
            {building.phone && (
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-purple-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">{building.phone}</span>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-3">
            <button 
              onClick={handleBuildingClick}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all transform hover:scale-105"
            >
              <BookOpen className="w-4 h-4" />
              <span>View Detailed Information</span>
            </button>
            
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => onShowDirections(building, 'building')}
                className="flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 hover:from-emerald-100 hover:to-emerald-200 dark:hover:from-emerald-800/30 dark:hover:to-emerald-700/30 rounded-lg text-emerald-700 dark:text-emerald-400 text-xs font-medium transition-all hover:scale-105"
              >
                <Navigation className="w-3 h-3" />
                <span>Directions</span>
              </button>
              <button className="flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30 rounded-lg text-blue-700 dark:text-blue-400 text-xs font-medium transition-all hover:scale-105">
                <Users className="w-3 h-3" />
                <span>Find Lawyers</span>
              </button>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

// Location Request Modal for Nearby Legal Buildings
const LocationRequestModal = ({ isOpen, onClose, onRequestLocation, theme }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`w-full max-w-md rounded-3xl shadow-2xl ${
            theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
          } overflow-hidden`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Navigation className="w-6 h-6" />
                <h3 className="text-xl font-bold">Nearby Legal Help</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Find Legal Services Near You</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Allow location access to discover courts, legal aid centers, and law enforcement agencies in your area.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Find nearby courts and legal centers</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Discover legal infrastructure within your area</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Get directions and contact info</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Navigate to legal offices with one click</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Connect with local lawyers</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Find legal professionals in your vicinity</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={onRequestLocation}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Navigation className="w-4 h-4" />
                <span>Allow Location Access</span>
              </button>
              
              <button
                onClick={onClose}
                className={`w-full px-4 py-2 rounded-xl font-medium transition-all ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                View All Legal Buildings
              </button>
            </div>
            
            {/* Privacy Note */}
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
              🔒 Your location data is kept private and secure
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Professional Comprehensive Building Details Modal with Real-time Information
const BuildingDetailsModal = ({ building, isOpen, onClose, theme, onShowDirections }) => {
  if (!isOpen || !building) return null;

  const getCurrentTime = () => {
    const now = new Date();
    const day = now.getDay();
    const isWeekend = day === 0 || day === 6;
    const currentHour = now.getHours();
    
    // Simple court hour check (10 AM to 5 PM weekdays)
    const isOpenNow = !isWeekend && currentHour >= 10 && currentHour < 17;
    return isOpenNow ? 'Open Now' : 'Closed';
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl ${
            theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
          } ${premiumStyles.mobileFirst}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Professional Header with Gradient */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-90"></div>
            <div className="relative p-6 text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-5">
                  <div className="text-6xl drop-shadow-xl">{building.icon}</div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2 leading-tight">{building.name}</h2>
                    <p className="text-blue-100 text-lg mb-3">{building.description}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
    return isOpenNow ? 'Open Now' : 'Closed';
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl ${
            theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
          } ${premiumStyles.mobileFirst}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Professional Header with Gradient */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-90"></div>
            <div className="relative p-6 text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-5">
                  <div className="text-6xl drop-shadow-xl">{building.icon}</div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2 leading-tight">{building.name}</h2>
                    <p className="text-blue-100 text-lg mb-3">{building.description}</p>
                    <div className="flex items-center space-x-4">
                      <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        building.type === 'supreme_court' ? 'bg-red-500/20 text-red-100 border border-red-400/30' :
                        building.type === 'high_court' ? 'bg-orange-500/20 text-orange-100 border border-orange-400/30' :
                        'bg-blue-500/20 text-blue-100 border border-blue-400/30'
                      }`}>
                        {building.type.replace(/_/g, ' ').toUpperCase()}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        getCurrentTime() === 'Open Now' 
                          ? 'bg-green-500/20 text-green-100 border border-green-400/30' 
                          : 'bg-red-500/20 text-red-100 border border-red-400/30'
                      }`}>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            getCurrentTime() === 'Open Now' ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                          }`}></div>
                          <span>{getCurrentTime()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Professional Content */}
          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
            <div className="p-6 space-y-8">
              
              {/* Real-time Stats Dashboard */}
              {building.todayCases && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-br from-blue-50 to-blue-100'} border border-blue-200/50 premium-card-hover`}>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">{building.todayCases}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Today's Cases</div>
                    </div>
                  </div>
                  
                  {building.totalJudges && (
                    <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-br from-emerald-50 to-emerald-100'} border border-emerald-200/50 premium-card-hover`}>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">{building.totalJudges}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Judges</div>
                      </div>
                    </div>
                  )}
                  
                  {building.nearbyLawyers && (
                    <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-br from-purple-50 to-purple-100'} border border-purple-200/50 premium-card-hover`}>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">{building.nearbyLawyers}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Nearby Lawyers</div>
                      </div>
                    </div>
                  )}
                  
                  {building.avgConsultationFee && (
                    <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-br from-orange-50 to-orange-100'} border border-orange-200/50 premium-card-hover`}>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">₹{building.avgConsultationFee}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Avg. Fee</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Contact & Location Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} border premium-card-hover`}>
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                    Location & Contact
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Address</p>
                      <p className="text-gray-900 dark:text-white">{building.address}</p>
                    </div>
                    
                    {building.phone && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                        <p className="text-blue-600 dark:text-blue-400 font-medium">{building.phone}</p>
                      </div>
                    )}
                    
                    {building.email && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                        <p className="text-blue-600 dark:text-blue-400 font-medium">{building.email}</p>
                      </div>
                    )}
                    
                    {building.website && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Website</p>
                        <p className="text-blue-600 dark:text-blue-400 font-medium truncate">{building.website}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Operating Hours */}
                {building.timings && (
                  <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} border premium-card-hover`}>
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-emerald-500" />
                      Operating Hours
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Weekdays</span>
                        <span className="font-medium">{building.timings.weekdays}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Saturday</span>
                        <span className="font-medium">{building.timings.saturday}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Sunday</span>
                        <span className="font-medium text-red-500">{building.timings.sunday}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Facilities & Services */}
              {building.facilities && (
                <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} border premium-card-hover`}>
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-purple-500" />
                    Facilities & Services
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {building.facilities.map((facility, index) => (
                      <div key={index} className={`p-3 rounded-xl border transition-all hover:scale-105 ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                          : 'bg-white border-gray-200 hover:bg-blue-50'
                      }`}>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm font-medium">{facility}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Updates */}
              {building.recentUpdates && (
                <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} border premium-card-hover`}>
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-orange-500" />
                    Recent Updates
                  </h3>
                  <div className="space-y-3">
                    {building.recentUpdates.map((update, index) => (
                      <div key={index} className={`p-4 rounded-xl border-l-4 border-blue-500 ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{update.date}</p>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{update.update}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => onShowDirections(building, 'building')}
                  className={`p-4 rounded-2xl font-medium transition-all hover:scale-105 ${premiumStyles.buttonPrimary} text-white shadow-xl`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Navigation className="w-5 h-5" />
                    <span>Get Directions</span>
                  </div>
                </button>
                
                <button className={`p-4 rounded-2xl font-medium transition-all hover:scale-105 ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border border-gray-700 hover:bg-gray-700' 
                    : 'bg-white border border-gray-200 hover:bg-gray-50'
                } shadow-lg`}>
                  <div className="flex items-center justify-center space-x-2">
                    <Users className="w-5 h-5 text-emerald-600" />
                    <span>Find Lawyers Nearby</span>
                  </div>
                </button>
                
                <button className={`p-4 rounded-2xl font-medium transition-all hover:scale-105 ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border border-gray-700 hover:bg-gray-700' 
                    : 'bg-white border border-gray-200 hover:bg-gray-50'
                } shadow-lg`}>
                  <div className="flex items-center justify-center space-x-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <span>Check Case Status</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
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
              <div className="absolute inset-0 p-6">
                {/* Premium Video Call Interface with Both Participants */}
                <div className="h-full flex flex-col">
                  {/* Main Video Area */}
                  <div className="flex-1 relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl overflow-hidden mb-6 shadow-2xl">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_theme(colors.blue.600),_transparent_50%)]"></div>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_theme(colors.purple.600),_transparent_50%)]"></div>
                    </div>
                    
                    {/* Lawyer Video (Main) */}
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="relative">
                        {/* Premium Lawyer Video Frame */}
                        <div className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 p-1 shadow-2xl">
                          <div className="w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 relative">
                            <img 
                              src={lawyer.image} 
                              alt={lawyer.name}
                              className="w-full h-full object-cover"
                            />
                            
                            {/* Professional Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                            
                            {/* Lawyer Info Overlay */}
                            <div className="absolute bottom-6 left-6 right-6">
                              <div className="bg-black/70 backdrop-blur-xl rounded-2xl p-4">
                                <h3 className="text-white text-xl lg:text-2xl font-bold mb-1">{lawyer.name}</h3>
                                <p className="text-blue-300 text-sm lg:text-base mb-2">{lawyer.specialization}</p>
                                <div className="flex items-center space-x-4 text-sm">
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-yellow-400 font-medium">{lawyer.rating}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Briefcase className="w-4 h-4 text-emerald-400" />
                                    <span className="text-emerald-400 font-medium">{lawyer.experience}Y</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <CheckCircle className="w-4 h-4 text-purple-400" />
                                    <span className="text-purple-400 font-medium">{lawyer.successRate}%</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Status Indicators */}
                            <div className="absolute top-6 left-6 right-6 flex justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2 bg-emerald-500/20 backdrop-blur-xl rounded-full px-3 py-2 border border-emerald-500/30">
                                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                  <span className="text-emerald-400 text-sm font-medium">Live</span>
                                </div>
                                <div className="flex items-center space-x-2 bg-blue-500/20 backdrop-blur-xl rounded-full px-3 py-2 border border-blue-500/30">
                                  <Clock className="w-3 h-3 text-blue-400" />
                                  <span className="text-blue-400 text-sm font-medium">{formatDuration(callDuration)}</span>
                                </div>
                              </div>
                              
                              {/* Connection Quality */}
                              <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-xl rounded-full px-3 py-2">
                                <div className={`w-2 h-2 rounded-full ${getConnectionColor()}`}></div>
                                <span className={`text-sm font-medium ${getConnectionColor()}`}>{connectionQuality}</span>
                              </div>
                            </div>
                            
                            {/* Audio/Video Status */}
                            <div className="absolute top-6 right-6 flex space-x-2">
                              {!isAudioMuted && (
                                <div className="w-10 h-10 bg-emerald-500/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-emerald-500/30">
                                  <Mic className="w-4 h-4 text-emerald-400" />
                                </div>
                              )}
                              {isVideoOn && (
                                <div className="w-10 h-10 bg-blue-500/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-blue-500/30">
                                  <Video className="w-4 h-4 text-blue-400" />
                                </div>
                              )}
                              {isRecording && (
                                <div className="w-10 h-10 bg-red-500/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-red-500/30">
                                  <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* User Video (Picture-in-Picture) */}
                      <div className="absolute bottom-8 right-8">
                        <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 p-1 shadow-xl">
                          <div className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-700 relative">
                            {/* User Image (You can replace with actual user data) */}
                            <img 
                              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" 
                              alt="You"
                              className="w-full h-full object-cover"
                            />
                            
                            {/* User Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            
                            {/* User Label */}
                            <div className="absolute bottom-2 left-2 right-2">
                              <div className="bg-black/70 backdrop-blur-md rounded-lg px-2 py-1">
                                <p className="text-white text-xs font-medium text-center">You</p>
                              </div>
                            </div>
                            
                            {/* User Status */}
                            <div className="absolute top-2 right-2">
                              <div className="w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating Legal Document Access */}
                    <div className="absolute top-1/2 left-8 transform -translate-y-1/2">
                      <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                        <h4 className="text-white text-sm font-medium mb-3">Quick Access</h4>
                        <div className="space-y-2">
                          <button className="w-full flex items-center space-x-2 text-left px-3 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 transition-colors">
                            <FileText className="w-4 h-4 text-blue-400" />
                            <span className="text-blue-400 text-sm">Case Files</span>
                          </button>
                          <button className="w-full flex items-center space-x-2 text-left px-3 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 transition-colors">
                            <Archive className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-400 text-sm">Documents</span>
                          </button>
                          <button className="w-full flex items-center space-x-2 text-left px-3 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors">
                            <BookOpen className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400 text-sm">Legal Guide</span>
                          </button>
                        </div>
                      </div>
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

// Premium Enhanced Location Permission Modal
const LocationModal = ({ isOpen, onAllow, onDeny, theme }) => {
  if (!isOpen) return null;

  const benefits = [
    {
      icon: Search,
      title: "Find Nearby Lawyers",
      description: "Discover top-rated legal experts in your area instantly",
      color: "blue",
      bgGradient: "from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20"
    },
    {
      icon: Zap,
      title: "Lightning Fast Response",
      description: "Get connected with available lawyers in under 30 seconds",
      color: "emerald",
      bgGradient: "from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your location data is encrypted and never shared",
      color: "purple",
      bgGradient: "from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20"
    }
  ];

  return (
    <AnimatePresence>
      <motion.div
        {...animations.scaleIn}
        className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-indigo-900/20 backdrop-blur-2xl z-[9999] flex items-center justify-center p-4"
      >
        <motion.div
          {...animations.slideUpFade}
          className={`relative w-full max-w-md ${premiumStyles.premiumCard} ${premiumStyles.shadowProfessional} overflow-hidden`}
        >
          {/* Premium Header with Animated Background */}
          <div className={`${premiumStyles.gradientPrimary} p-6 sm:p-8 relative overflow-hidden`}>
            {/* Background Pattern */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/2"></div>
            </div>
            
            {/* Location Icon with Animation */}
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto relative">
                {/* Pulsing Background */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-white/20 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                  className="absolute inset-0 bg-white/10 rounded-full"
                />
                
                {/* Rotating Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 border-2 border-dashed border-white/40 rounded-full"
                />
                
                {/* Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <MapPin className="w-7 h-7 text-white" />
                    </motion.div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [-3, 3, -3], rotate: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Zap className="w-3 h-3 text-white" />
                </motion.div>
                
                <motion.div
                  animate={{ y: [3, -3, 3], rotate: [0, -10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute -bottom-1 -left-1 w-5 h-5 bg-emerald-400 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Navigation className="w-2.5 h-2.5 text-white" />
                </motion.div>
              </div>
            </div>
            
            <div className="text-center relative z-10">
              <h3 className="text-2xl font-bold text-white mb-3">
                Enable Location Access
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Help us find the perfect legal experts in your area for instant consultation
              </p>
            </div>
          </div>
          
          {/* Benefits Section */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, type: "spring", damping: 20, stiffness: 300 }}
                    className={`flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r ${benefit.bgGradient} ${premiumStyles.hoverLift}`}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${
                      benefit.color === 'blue' ? 'from-blue-500 to-blue-600' :
                      benefit.color === 'emerald' ? 'from-emerald-500 to-emerald-600' :
                      'from-purple-500 to-purple-600'
                    } rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                        {benefit.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Privacy Notice */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    Privacy Protected
                  </h5>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Location used only for finding nearby lawyers. Never stored or shared.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <motion.button
                onClick={onAllow}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full ${premiumStyles.buttonPrimary} text-white py-4 px-6 rounded-2xl font-semibold ${premiumStyles.shadowProfessional} ${premiumStyles.mobileFirst} relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -skew-x-12 translate-x-[-100%] animate-shimmer"></div>
                <div className="flex items-center justify-center space-x-3">
                  <MapPin className="w-5 h-5" />
                  <span>Allow Location Access</span>
                </div>
              </motion.button>
              
              <motion.button
                onClick={onDeny}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`w-full ${premiumStyles.buttonSecondary} dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-4 px-6 rounded-2xl font-medium ${premiumStyles.mobileFirst} border border-gray-200 dark:border-gray-600`}
              >
                <div className="flex items-center justify-center space-x-3">
                  <Globe className="w-5 h-5" />
                  <span>Continue Without Location</span>
                </div>
              </motion.button>
            </div>
            
            {/* Footer Note */}
            <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                🔒 All data protected with enterprise-grade encryption
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Main VirtualBakil component - Full Page Professional System
const VirtualBakil = () => {
  const [lawyers, setLawyers] = useState([]);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showSearchingModal, setShowSearchingModal] = useState(false);
  const [showLawyerModal, setShowLawyerModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [searchRadius] = useState(5000); // 5km
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStep, setConnectionStep] = useState('');
  const [onlineLawyersCount, setOnlineLawyersCount] = useState(0);
  const [showMapOverlay] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [mapZoom, setMapZoom] = useState(13);
  const [showLegalBuildings, setShowLegalBuildings] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [showBuildingModal, setShowBuildingModal] = useState(false);
  const [showLocationRequest, setShowLocationRequest] = useState(false);
  const [allLegalBuildings, setAllLegalBuildings] = useState(true); // Show all initially
  const [showDirections, setShowDirections] = useState(false);
  const [directionsTarget, setDirectionsTarget] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  // Handle theme with fallback
  const themeState = useSelector((state) => state?.theme?.currentTheme || 'light');
  const theme = themeState;

  useEffect(() => {
    initializeComponent();
  }, []);

  // Calculate online lawyers count whenever lawyers data changes
  useEffect(() => {
    const onlineCount = lawyers.filter(lawyer => lawyer.isOnline && !lawyer.isInCall).length;
    setOnlineLawyersCount(onlineCount);
  }, [lawyers]);

  const initializeComponent = async () => {
    try {
      setLoading(true);
      
      // Initialize with mock data first for immediate UI response
      setLawyers(mockLawyers);
      setUserLocation([28.6139, 77.2090]); // Default Delhi location
      
      // Check if user has location permission
      if (navigator.geolocation) {
        // Try to get location automatically first
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const userPos = [latitude, longitude];
            setUserLocation(userPos);
            
            // Smart API Integration: Try to fetch real lawyers data
            try {
              if (lawyerAPI && lawyerAPI.getNearbyLawyers) {
                const response = await lawyerAPI.getNearbyLawyers(
                  { latitude, longitude },
                  searchRadius
                );
                
                // Merge API data with existing structure
                if (response && response.length > 0) {
                  const formattedLawyers = response.map(lawyer => ({
                    ...lawyer,
                    // Ensure required fields exist with fallbacks
                    isOnline: lawyer.isOnline ?? lawyer.is_online ?? Math.random() > 0.3,
                    isInCall: lawyer.isInCall ?? lawyer.is_in_call ?? false,
                    location: lawyer.location ?? { 
                      lat: latitude + (Math.random() - 0.5) * 0.1, 
                      lng: longitude + (Math.random() - 0.5) * 0.1 
                    },
                    image: lawyer.image ?? lawyer.profile_image ?? "/api/placeholder/150/150",
                    consultationFee: lawyer.consultationFee ?? lawyer.consultation_fee ?? Math.floor(Math.random() * 2000 + 1500),
                    responseTime: lawyer.responseTime ?? lawyer.response_time ?? `${Math.floor(Math.random() * 10 + 1)} min`,
                    successRate: lawyer.successRate ?? lawyer.success_rate ?? Math.floor(Math.random() * 15 + 85),
                    cases: lawyer.cases ?? lawyer.total_cases ?? Math.floor(Math.random() * 400 + 100),
                    availability: lawyer.isOnline ? "Available Now" : "Offline",
                    expertise: lawyer.expertise ?? lawyer.specializations ?? [lawyer.specialization ?? "General Law"],
                    languages: lawyer.languages ?? ["English", "Hindi"],
                    education: lawyer.education ?? "LLB, University",
                    barCouncil: lawyer.barCouncil ?? lawyer.bar_council ?? "State Bar Council"
                  }));
                  
                  setLawyers(formattedLawyers);
                  console.log('✅ Successfully loaded lawyers from API:', formattedLawyers.length);
                } else {
                  console.log('ℹ️ No lawyers from API, using mock data');
                }
              }
            } catch (apiError) {
              console.log('⚠️ API unavailable, using mock data:', apiError.message);
              // Keep using mock data - no error shown to user
            }
            
            setLoading(false);
          },
          (error) => {
            console.log('Location permission needed:', error);
            setShowLocationModal(true);
            setLoading(false);
          },
          { 
            enableHighAccuracy: true, 
            timeout: 8000, 
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

  // Smart API Integration for Location-based Search
  const fetchNearbyLawyers = async (location, radius = 5000) => {
    try {
      if (lawyerAPI && lawyerAPI.getNearbyLawyers) {
        const response = await lawyerAPI.getNearbyLawyers(
          { latitude: location[0], longitude: location[1] },
          radius
        );
        
        if (response && response.length > 0) {
          const formattedLawyers = response.map(lawyer => ({
            ...lawyer,
            // Smart mapping with fallbacks
            id: lawyer.id ?? Math.random().toString(36).substr(2, 9),
            name: lawyer.name ?? lawyer.full_name ?? "Advocate Name",
            specialization: lawyer.specialization ?? lawyer.practice_area ?? "General Law",
            rating: lawyer.rating ?? (Math.random() * 1 + 4).toFixed(1),
            reviews: lawyer.reviews ?? lawyer.total_reviews ?? Math.floor(Math.random() * 200 + 50),
            experience: lawyer.experience ?? lawyer.years_of_experience ?? Math.floor(Math.random() * 15 + 5),
            isOnline: lawyer.isOnline ?? lawyer.is_online ?? Math.random() > 0.3,
            isInCall: lawyer.isInCall ?? lawyer.is_in_call ?? false,
            location: lawyer.location ?? { 
              lat: location[0] + (Math.random() - 0.5) * 0.1, 
              lng: location[1] + (Math.random() - 0.5) * 0.1 
            },
            consultationFee: lawyer.consultationFee ?? lawyer.consultation_fee ?? Math.floor(Math.random() * 2000 + 1500),
            image: lawyer.image ?? lawyer.profile_image ?? "/api/placeholder/150/150",
            responseTime: lawyer.responseTime ?? lawyer.response_time ?? `${Math.floor(Math.random() * 10 + 1)} min`,
            successRate: lawyer.successRate ?? lawyer.success_rate ?? Math.floor(Math.random() * 15 + 85),
            cases: lawyer.cases ?? lawyer.total_cases ?? Math.floor(Math.random() * 400 + 100),
            availability: lawyer.isOnline ? "Available Now" : "Offline",
            expertise: lawyer.expertise ?? lawyer.specializations ?? [lawyer.specialization],
            languages: lawyer.languages ?? ["English", "Hindi"],
            education: lawyer.education ?? "LLB, University",
            barCouncil: lawyer.barCouncil ?? lawyer.bar_council ?? "State Bar Council"
          }));
          
          return formattedLawyers;
        }
      }
      
      // Fallback to mock data
      return mockLawyers;
    } catch (error) {
      console.log('API call failed, using mock data:', error);
      return mockLawyers;
    }
  };

  const handleLocationAllow = async () => {
    setShowLocationModal(false);
    setShowSearchingModal(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userPos = [position.coords.latitude, position.coords.longitude];
        setUserLocation(userPos);
        
        // Smart API Integration: Fetch lawyers for new location
        const nearbyLawyers = await fetchNearbyLawyers(userPos, searchRadius);
        setLawyers(nearbyLawyers);
        
        setShowSearchingModal(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setShowSearchingModal(false);
        // Continue with default location instead of showing error
        setUserLocation([28.6139, 77.2090]); // Default Delhi location
      }
    );
  };

  const handleLocationDeny = () => {
    setShowLocationModal(false);
    // Continue with default location and mock data
  };

  const handleLawyerSelect = (lawyer) => {
    setSelectedLawyer(lawyer);
    setShowLawyerModal(true);
  };

  // Removed unused handleCall function

// Zoom Tracker Component for Map Events
const ZoomTracker = ({ onZoomChange }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!map || !onZoomChange) return;

    const handleZoomEnd = () => {
      const currentZoom = map.getZoom();
      onZoomChange(currentZoom);
    };

    map.on('zoomend', handleZoomEnd);
    
    // Set initial zoom
    handleZoomEnd();

    return () => {
      map.off('zoomend', handleZoomEnd);
    };
  }, [map, onZoomChange]);

  return null; // This component doesn't render anything
};

// Professional Searching Modal Component
const SearchingModal = ({ isOpen, onClose, lawyers, theme }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 max-w-md w-full`}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-bold mb-4">Finding Legal Experts...</h3>
          <div className="flex items-center space-x-4 mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span>Searching for available lawyers...</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Professional Lawyer Profile Modal Component  
const LawyerProfileModal = ({ lawyer, isOpen, onClose, theme }) => {
  if (!isOpen || !lawyer) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Lawyer Profile</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="text-center mb-6">
            <img src={lawyer.image} alt={lawyer.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
            <h3 className="text-xl font-bold">{lawyer.name}</h3>
            <p className="text-gray-600 dark:text-gray-400">{lawyer.specialization}</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Experience:</span>
              <span className="font-medium">{lawyer.experience} years</span>
            </div>
            <div className="flex justify-between">
              <span>Success Rate:</span>
              <span className="font-medium">{lawyer.successRate}%</span>
            </div>
            <div className="flex justify-between">
              <span>Consultation Fee:</span>
              <span className="font-medium">₹{lawyer.consultationFee}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Professional Connection Modal Component
const ConnectionModal = ({ isOpen, onClose, onComplete, theme }) => {
  const [connectionStep, setConnectionStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setConnectionStep(1);
            setTimeout(() => onComplete(), 1000);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 max-w-md w-full text-center`}
        >
          <h3 className="text-xl font-bold mb-6">Establishing Connection</h3>
          
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {connectionStep === 0 ? 'Connecting...' : 'Connected!'}
            </p>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

  // Handle zoom changes for legal buildings visibility
  const handleZoomChange = (zoom) => {
    setMapZoom(zoom);
    // Show legal buildings when there are nearby lawyers or when zoomed in enough
    const shouldShowBuildings = zoom >= 12 && (onlineLawyersCount > 0 || userLocation);
    setShowLegalBuildings(shouldShowBuildings);
  };

  // Calculate distance between two coordinates
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Filter legal buildings based on user preferences and location
  const getVisibleLegalBuildings = () => {
    if (!showLegalBuildings) return [];
    
    // If showing all buildings (initial view), return all
    if (allLegalBuildings) {
      return legalBuildings;
    }
    
    // If user location is available, show nearby buildings
    if (userLocation) {
      const radiusKm = searchRadius / 1000; // Convert to km
      
      return legalBuildings.filter(building => {
        const distanceToUser = calculateDistance(
          userLocation[0], userLocation[1],
          building.location.lat, building.location.lng
        );
        
        // Show buildings within search radius or if there are lawyers very close to the building
        const isWithinRadius = distanceToUser <= radiusKm;
        const hasNearbyLawyers = lawyers.some(lawyer => {
          const distanceToBuilding = calculateDistance(
            lawyer.location.lat, lawyer.location.lng,
            building.location.lat, building.location.lng
          );
          return distanceToBuilding <= 2; // Show if lawyer within 2km of building
        });
        
        return isWithinRadius || hasNearbyLawyers;
      });
    }
    
    // Default: show all buildings
    return legalBuildings;
  };

  // Handle legal buildings toggle with location request
  const handleLegalBuildingsToggle = () => {
    if (!showLegalBuildings) {
      // Enabling legal buildings
      setShowLegalBuildings(true);
      
      // If no user location and not showing all buildings, show location request
      if (!userLocation && !allLegalBuildings) {
        setShowLocationRequest(true);
      }
    } else {
      // Disabling legal buildings
      setShowLegalBuildings(false);
    }
  };

  // Request user location
  const requestUserLocation = async () => {
    try {
      if ("geolocation" in navigator) {
        setLoading(true);
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
          });
        });
        
        const newLocation = [position.coords.latitude, position.coords.longitude];
        setUserLocation(newLocation);
        setAllLegalBuildings(false); // Switch to nearby mode
        setShowLocationRequest(false);
        setLoading(false);
        
        // Success notification could be added here
      } else {
        throw new Error("Geolocation not supported");
      }
    } catch (error) {
      console.error("Location request failed:", error);
      setLoading(false);
      // Keep showing all buildings if location fails
      setAllLegalBuildings(true);
      setShowLocationRequest(false);
    }
  };

  // Generate route coordinates (simple straight line for demo)
  const generateRoute = (start, end) => {
    const steps = 20; // Number of points in the route
    const route = [];
    
    for (let i = 0; i <= steps; i++) {
      const ratio = i / steps;
      const lat = start[0] + (end[0] - start[0]) * ratio;
      const lng = start[1] + (end[1] - start[1]) * ratio;
      route.push([lat, lng]);
    }
    
    return route;
  };

  // Show directions to a location (lawyer or building)
  const showDirectionsTo = (target, type = 'building') => {
    if (!userLocation) {
      setShowLocationRequest(true);
      return;
    }

    const targetLocation = type === 'building' 
      ? [target.location.lat, target.location.lng]
      : [target.location.lat, target.location.lng];

    const route = generateRoute(userLocation, targetLocation);
    
    setDirectionsTarget({ ...target, type });
    setRouteCoordinates(route);
    setShowDirections(true);
  };

  // Clear directions
  const clearDirections = () => {
    setShowDirections(false);
    setDirectionsTarget(null);
    setRouteCoordinates([]);
  };

  const handleConnectionComplete = () => {
    setShowConnectionModal(false);
    if (connectionStep === 'call') {
      setShowCallModal(true);
    } else if (connectionStep === 'chat') {
      setShowChatModal(true);
    }
  };

  // Handle building selection and modal opening
  const handleBuildingSelect = (building) => {
    setSelectedBuilding(building);
    setShowBuildingModal(true);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ 
              x: [-100, window.innerWidth + 100],
              y: [window.innerHeight * 0.1, window.innerHeight * 0.9]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute w-32 h-32 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{ 
              x: [window.innerWidth + 100, -100],
              y: [window.innerHeight * 0.7, window.innerHeight * 0.3]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 2 }}
            className="absolute w-24 h-24 bg-gradient-to-r from-indigo-200/20 to-pink-200/20 rounded-full blur-xl"
          />
        </div>

        <motion.div
          {...animations.slideUpFade}
          className="text-center relative z-10"
        >
          {/* Premium Loading Animation */}
          <div className="relative mb-8">
            <div className="relative w-24 h-24 mx-auto">
              {/* Multiple rotating rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 border-4 border-purple-500/30 border-r-purple-500 rounded-full"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border-4 border-indigo-500/30 border-b-indigo-500 rounded-full"
              />
              
              {/* Center logo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center"
                >
                  <Users className="w-5 h-5 text-white" />
                </motion.div>
              </div>
            </div>
            
            {/* Floating elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Zap className="w-3 h-3 text-white" />
            </motion.div>
            
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute -bottom-2 -left-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Shield className="w-2.5 h-2.5 text-white" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Loading Virtual Bakil
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Initializing your premium legal consultation platform
            </p>
            
            {/* Loading steps */}
            <div className="space-y-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"
                style={{ maxWidth: '200px' }}
              />
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Connecting to legal experts...
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-red-900 dark:to-orange-900 flex items-center justify-center p-4">
        <motion.div
          {...animations.slideUpFade}
          className={`${premiumStyles.premiumCard} ${premiumStyles.shadowProfessional} max-w-md w-full text-center p-8`}
        >
          {/* Error Icon with Animation */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <AlertCircle className="w-10 h-10 text-white" />
          </motion.div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            Oops! Something went wrong
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            {error}
          </p>
          
          <div className="space-y-3">
            <motion.button
              onClick={() => window.location.reload()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full ${premiumStyles.buttonPrimary} text-white py-3 px-6 rounded-xl font-semibold ${premiumStyles.shadowProfessional} ${premiumStyles.mobileFirst}`}
            >
              <div className="flex items-center justify-center space-x-2">
                <RefreshCw className="w-5 h-5" />
                <span>Try Again</span>
              </div>
            </motion.button>
            
            <button
              onClick={() => setError(null)}
              className="w-full text-gray-600 dark:text-gray-400 py-3 px-6 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* Premium CSS Styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-ring {
          0% {
            transform: scale(0.33);
            opacity: 1;
          }
          80%, 100% {
            transform: scale(2.33);
            opacity: 0;
          }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-pulse-ring {
          animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }
        
        .animate-gradient {
          background-size: 400% 400%;
          animation: gradient-shift 4s ease infinite;
        }
        
        .professional-blur {
          backdrop-filter: blur(20px) saturate(180%);
        }
        
        .modal-scroll::-webkit-scrollbar {
          width: 4px;
        }
        
        .modal-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .modal-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 4px;
        }
        
        .status-online {
          animation: pulse 2s infinite;
        }
        
        .status-busy {
          animation: pulse 1s infinite;
        }
        
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .btn-professional {
          position: relative;
          overflow: hidden;
          transform: perspective(1px) translateZ(0);
        }
        
        .btn-professional:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transform: translateX(-100%);
          transition: transform 0.5s;
        }
        
        .btn-professional:hover:before {
          transform: translateX(100%);
        }
        
        .premium-card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .gpu-accelerated {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
        
        .btn-glow:hover {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }
        `}</style>

        <div className="relative w-full h-screen overflow-hidden">
          <div className="absolute inset-0">
            <div className="w-full h-full">
              {showMapOverlay && (
                <MapOverlay
                  onlineLawyersCount={onlineLawyersCount}
                  theme={theme}
                  onToggleFilters={() => setShowFilters(!showFilters)}
                  showLegalBuildings={showLegalBuildings}
                  onToggleLegalBuildings={handleLegalBuildingsToggle}
                  mapZoom={mapZoom}
                  visibleBuildingsCount={getVisibleLegalBuildings().length}
                />
              )}
              
              <MapContainer
                center={userLocation && Array.isArray(userLocation) ? userLocation : [28.6139, 77.2090]}
                zoom={mapZoom}
                className="w-full h-full z-[1]"
                zoomControl={false}
                attributionControl={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                <ZoomTracker onZoomChange={handleZoomChange} />
                
                {userLocation && Array.isArray(userLocation) && (
                  <Circle
                    center={userLocation}
                    radius={searchRadius}
                    pathOptions={{
                      fillColor: 'blue',
                      fillOpacity: 0.1,
                      color: 'blue',
                      weight: 2,
                      opacity: 0.5
                    }}
                  />
                )}
                
                {lawyers.map((lawyer) => (
                  <LawyerMarker
                    key={lawyer.id}
                    lawyer={lawyer}
                    isSelected={selectedLawyer?.id === lawyer.id}
                    onSelect={handleLawyerSelect}
                    theme={theme}
                    onShowDirections={showDirectionsTo}
                  />
                ))}
                
                {getVisibleLegalBuildings().map((building) => (
                  <LegalBuildingMarker
                    key={building.id}
                    building={building}
                    theme={theme}
                    onBuildingSelect={handleBuildingSelect}
                    onShowDirections={showDirectionsTo}
                  />
                ))}
                
                {showDirections && routeCoordinates.length > 0 && (
                  <Polyline
                    positions={routeCoordinates}
                    pathOptions={{
                      color: '#3b82f6',
                      weight: 4,
                      opacity: 0.8,
                      dashArray: '10, 10',
                      lineJoin: 'round',
                      lineCap: 'round'
                    }}
                  />
                )}
              </MapContainer>
            </div>
          </div>
        </div>

        <SearchingModal
          isOpen={showSearchingModal}
          onClose={() => setShowSearchingModal(false)}
          lawyers={lawyers}
          theme={theme}
        />

        <LawyerProfileModal
          lawyer={selectedLawyer}
          isOpen={showLawyerModal}
          onClose={() => setShowLawyerModal(false)}
          theme={theme}
        />

        <ConnectionModal
          isOpen={showConnectionModal}
          onClose={() => setShowConnectionModal(false)}
          onComplete={handleConnectionComplete}
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

        <BuildingDetailsModal
          building={selectedBuilding}
          isOpen={showBuildingModal}
          onClose={() => setShowBuildingModal(false)}
          theme={theme}
          onShowDirections={showDirectionsTo}
        />

        <LocationRequestModal
          isOpen={showLocationRequest}
          onClose={() => setShowLocationRequest(false)}
          onRequestLocation={requestUserLocation}
          theme={theme}
        />

        {showDirections && directionsTarget && (
          <div className="fixed bottom-6 left-6 z-[9998] pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className={`px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl max-w-sm ${
                theme === 'dark'
                  ? 'bg-gray-900/95 text-white border border-gray-700/50'
                  : 'bg-white/95 text-gray-900 border border-white/50'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Directions</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Route to destination</p>
                  </div>
                </div>
                <button
                  onClick={clearDirections}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{directionsTarget.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {directionsTarget.type === 'lawyer' ? directionsTarget.specialization : directionsTarget.type}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Calculating...</span>
                </div>
                
                <button
                  onClick={() => {
                    const lat = directionsTarget.location?.lat;
                    const lng = directionsTarget.location?.lng;
                    if (lat && lng) {
                      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
                    }
                  }}
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium text-sm transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Globe className="w-4 h-4" />
                  <span>Open in Maps</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
    </>
  );
};

export default VirtualBakil;