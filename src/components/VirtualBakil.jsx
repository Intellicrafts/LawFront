import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import {
  User, Phone, Video, MessageCircle, MapPin, Star, Search, Filter,
  Clock, CheckCircle, X, PhoneCall, Mic, MicOff, Volume2, VolumeX,
  Minimize2, Maximize2, UserCheck, Shield, Award, Globe, Navigation,
  RefreshCw, Users, Calendar, DollarSign, Briefcase, GraduationCap,
  AlertCircle, ChevronLeft, ChevronRight, Heart, Share2, BookOpen,
  CheckCircle2, XCircle, Loader2, Send, FileText, Paperclip, Smile,
  Settings, VideoOff, Building, Scale, Home, Move, Crosshair, Info,
  Eye, EyeOff, Zap, Target, Building2, Gavel, FileCheck, UserPlus,
  Camera, Archive, PlusCircle, Download, ChevronDown, Lock, Unlock,
  MapIcon, MoreVertical, TrendingUp, Award as AwardIcon, Verified, Plus, Minus, Mail
} from 'lucide-react';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import '../styles/virtualBakil.css';

// Real Indian Legal Bodies with Exact Coordinates - 25+ Courts & Institutions
const LEGAL_BODIES_INDIA = [
  // Supreme Court
  {
    id: 'sc_india',
    name: 'Supreme Court of India',
    type: 'supreme_court',
    location: { lat: 28.6245, lng: 77.2442 },
    address: 'Tilak Marg, New Delhi, Delhi 110001',
    phone: '+91-11-2338-2792',
    email: 'supremecourt@nic.in',
    jurisdiction: 'All India',
    workingHours: '10:30 AM - 4:00 PM',
    rating: 4.9,
    isActive: true,
    description: 'Highest judicial authority in India',
    judges: 34,
    established: 1950,
    services: ['Constitutional Matters', 'Appeals', 'Special Leave Petitions']
  },
  
  // High Courts
  {
    id: 'dhc',
    name: 'Delhi High Court',
    type: 'court',
    location: { lat: 28.6269, lng: 77.2395 },
    address: 'Sher Shah Road, New Delhi 110003',
    phone: '+91-11-2338-9596',
    email: 'delhi@highcourt.nic.in',
    jurisdiction: 'Delhi & NCR',
    workingHours: '10:00 AM - 5:00 PM',
    rating: 4.6,
    isActive: true,
    description: 'Principal court of National Capital Territory',
    judges: 45,
    established: 1966,
    services: ['Civil Cases', 'Criminal Appeals', 'Writ Petitions']
  },
  {
    id: 'bhc',
    name: 'Bombay High Court',
    type: 'court',
    location: { lat: 18.9270, lng: 72.8314 },
    address: 'Fort, Mumbai 400001',
    phone: '+91-22-2262-1612',
    email: 'registry@bombayHighcourt.nic.in',
    jurisdiction: 'Maharashtra & Goa',
    workingHours: '10:15 AM - 4:30 PM',
    rating: 4.7,
    isActive: true,
    description: 'One of the oldest High Courts in India',
    judges: 78,
    established: 1862,
    services: ['Civil Appeals', 'Corporate Law', 'IP Cases']
  },
  {
    id: 'khc',
    name: 'Karnataka High Court',
    type: 'court',
    location: { lat: 12.9722, lng: 77.5915 },
    address: 'Attara Kacheri, Bangalore 560001',
    phone: '+91-80-2221-3962',
    email: 'registry@karnatakaHighcourt.nic.in',
    jurisdiction: 'Karnataka',
    workingHours: '10:30 AM - 4:15 PM',
    rating: 4.5,
    isActive: true,
    description: 'High Court with IT & Corporate expertise',
    judges: 62,
    established: 1884,
    services: ['IT Law', 'Corporate Disputes', 'Land Matters']
  },
  {
    id: 'mhc',
    name: 'Madras High Court',
    type: 'court',
    location: { lat: 13.0825, lng: 80.2709 },
    address: 'High Court Campus, Chennai 600104',
    phone: '+91-44-2534-1722',
    email: 'registry@madrasHighcourt.nic.in',
    jurisdiction: 'Tamil Nadu & Puducherry',
    workingHours: '10:30 AM - 4:30 PM',
    rating: 4.6,
    isActive: true,
    description: 'Second oldest High Court in India',
    judges: 75,
    established: 1862,
    services: ['Constitutional Law', 'Service Matters', 'Criminal Appeals']
  },
  {
    id: 'chc',
    name: 'Calcutta High Court',
    type: 'court',
    location: { lat: 22.5726, lng: 88.3639 },
    address: 'Esplanade, Kolkata 700001',
    phone: '+91-33-2243-4289',
    email: 'registry@calcuttaHighcourt.nic.in',
    jurisdiction: 'West Bengal & AN Islands',
    workingHours: '10:30 AM - 4:30 PM',
    rating: 4.4,
    isActive: true,
    description: 'Oldest High Court in India',
    judges: 71,
    established: 1862,
    services: ['Commercial Law', 'IP Rights', 'Constitutional Matters']
  },
  {
    id: 'thc',
    name: 'Telangana High Court',
    type: 'court',
    location: { lat: 17.4126, lng: 78.4094 },
    address: 'Nayapul, Hyderabad 500001',
    phone: '+91-40-2340-4307',
    email: 'registry@telanganahighcourt.nic.in',
    jurisdiction: 'Telangana & Andhra Pradesh',
    workingHours: '10:15 AM - 4:00 PM',
    rating: 4.5,
    isActive: true,
    description: 'High Court for Telugu states',
    judges: 42,
    established: 1954,
    services: ['IT Disputes', 'Real Estate', 'PIL Cases']
  },
  {
    id: 'ghc',
    name: 'Gujarat High Court',
    type: 'court',
    location: { lat: 23.1815, lng: 72.6313 },
    address: 'Civil & Sessions Court, Ahmedabad 380001',
    phone: '+91-79-2754-6000',
    email: 'registry@gujarathighcourt.nic.in',
    jurisdiction: 'Gujarat & Daman Diu',
    workingHours: '10:00 AM - 4:45 PM',
    rating: 4.6,
    isActive: true,
    description: 'High Court serving Gujarat region',
    judges: 49,
    established: 1960,
    services: ['Commercial Disputes', 'Real Estate', 'Family Law']
  },
  {
    id: 'phc',
    name: 'Punjab High Court',
    type: 'court',
    location: { lat: 30.9050, lng: 75.8464 },
    address: 'Sector 17-C, Chandigarh 160017',
    phone: '+91-172-270-5050',
    email: 'registry@punjabhighcourt.nic.in',
    jurisdiction: 'Punjab & Haryana',
    workingHours: '10:00 AM - 4:30 PM',
    rating: 4.5,
    isActive: true,
    description: 'High Court for Punjab & Haryana',
    judges: 38,
    established: 1966,
    services: ['Constitutional Law', 'Agricultural Disputes', 'Criminal Appeals']
  },
  {
    id: 'rhc',
    name: 'Rajasthan High Court',
    type: 'court',
    location: { lat: 26.9124, lng: 75.7873 },
    address: 'Amar Jyoti Marg, Jaipur 302001',
    phone: '+91-141-237-4000',
    email: 'registry@rajasthanhighcourt.nic.in',
    jurisdiction: 'Rajasthan',
    workingHours: '10:00 AM - 4:30 PM',
    rating: 4.5,
    isActive: true,
    description: 'High Court serving Rajasthan state',
    judges: 32,
    established: 1949,
    services: ['Land Matters', 'Commercial Disputes', 'Civil Appeals']
  },
  
  // District Courts - Major Cities
  {
    id: 'dc_delhi',
    name: 'District Court of Delhi (Central)',
    type: 'court',
    location: { lat: 28.6355, lng: 77.2306 },
    address: 'Chandni Chowk, Delhi 110006',
    phone: '+91-11-2326-0610',
    jurisdiction: 'Central Delhi',
    workingHours: '10:00 AM - 5:00 PM',
    rating: 4.5,
    isActive: true,
    description: 'District court handling central Delhi cases',
    judges: 24,
    established: 1911,
    services: ['Civil Suits', 'Criminal Cases', 'Family Matters']
  },
  {
    id: 'dc_mumbai_south',
    name: 'District Court - Mumbai South',
    type: 'court',
    location: { lat: 18.9245, lng: 72.8367 },
    address: 'Fort, Mumbai 400001',
    phone: '+91-22-2261-2000',
    email: 'registry@mumbaidistrictcourt.nic.in',
    jurisdiction: 'South Mumbai',
    workingHours: '10:15 AM - 4:45 PM',
    rating: 4.6,
    isActive: true,
    description: 'District court for South Mumbai region',
    judges: 32,
    established: 1862,
    services: ['Corporate Cases', 'Civil Suits', 'Criminal Appeals']
  },
  {
    id: 'dc_bangalore',
    name: 'District Court - Bangalore',
    type: 'court',
    location: { lat: 12.9652, lng: 77.5722 },
    address: 'Trinity Circle, Bangalore 560001',
    phone: '+91-80-2559-0000',
    email: 'registry@bangaloredistrictcourt.nic.in',
    jurisdiction: 'Bangalore Urban',
    workingHours: '10:30 AM - 4:30 PM',
    rating: 4.6,
    isActive: true,
    description: 'Primary district court of Bangalore',
    judges: 28,
    established: 1881,
    services: ['IT Disputes', 'Civil Cases', 'Criminal Law']
  },
  {
    id: 'dc_hyderabad',
    name: 'District Court - Hyderabad',
    type: 'court',
    location: { lat: 17.3736, lng: 78.4740 },
    address: 'Nampally, Hyderabad 500001',
    phone: '+91-40-2345-7777',
    email: 'registry@hyderabaddistrictcourt.nic.in',
    jurisdiction: 'Hyderabad District',
    workingHours: '10:00 AM - 4:30 PM',
    rating: 4.5,
    isActive: true,
    description: 'District court serving Hyderabad',
    judges: 26,
    established: 1950,
    services: ['Civil Cases', 'Criminal Matters', 'Land Disputes']
  },
  {
    id: 'dc_chennai',
    name: 'District Court - Chennai',
    type: 'court',
    location: { lat: 13.0849, lng: 80.2708 },
    address: 'High Court, Chennai 600104',
    phone: '+91-44-2534-2222',
    email: 'registry@chennaididstrictcourt.nic.in',
    jurisdiction: 'Chennai District',
    workingHours: '10:30 AM - 4:30 PM',
    rating: 4.6,
    isActive: true,
    description: 'District court handling Chennai cases',
    judges: 30,
    established: 1862,
    services: ['Civil Appeals', 'Criminal Cases', 'Property Disputes']
  },
  {
    id: 'dc_kolkata',
    name: 'District Court - Kolkata',
    type: 'court',
    location: { lat: 22.5697, lng: 88.3639 },
    address: 'Esplanade, Kolkata 700001',
    phone: '+91-33-2241-1111',
    email: 'registry@kolkatadistrictcourt.nic.in',
    jurisdiction: 'Kolkata Metropolitan',
    workingHours: '10:30 AM - 4:30 PM',
    rating: 4.5,
    isActive: true,
    description: 'District court of Kolkata',
    judges: 27,
    established: 1862,
    services: ['Civil Cases', 'Criminal Law', 'Commercial Disputes']
  },
  {
    id: 'dc_pune',
    name: 'District Court - Pune',
    type: 'court',
    location: { lat: 18.5269, lng: 73.8567 },
    address: 'Shaniwar Wada, Pune 411002',
    phone: '+91-20-2605-0000',
    email: 'registry@punadistrictcourt.nic.in',
    jurisdiction: 'Pune District',
    workingHours: '10:00 AM - 4:30 PM',
    rating: 4.5,
    isActive: true,
    description: 'District court serving Pune region',
    judges: 22,
    established: 1949,
    services: ['Civil Cases', 'Criminal Appeals', 'Family Law']
  },
  {
    id: 'dc_ahmedabad',
    name: 'District Court - Ahmedabad',
    type: 'court',
    location: { lat: 23.1815, lng: 72.6313 },
    address: 'Law Garden, Ahmedabad 380001',
    phone: '+91-79-2644-0000',
    email: 'registry@ahmedabaddistrictcourt.nic.in',
    jurisdiction: 'Ahmedabad District',
    workingHours: '10:00 AM - 4:45 PM',
    rating: 4.5,
    isActive: true,
    description: 'District court of Ahmedabad',
    judges: 20,
    established: 1960,
    services: ['Business Disputes', 'Civil Cases', 'Criminal Law']
  },
  {
    id: 'dc_lucknow',
    name: 'District Court - Lucknow',
    type: 'court',
    location: { lat: 26.8467, lng: 80.9462 },
    address: 'Shaheed Path, Lucknow 226001',
    phone: '+91-522-2611-111',
    email: 'registry@lucknowdistrictcourt.nic.in',
    jurisdiction: 'Lucknow District',
    workingHours: '10:00 AM - 4:30 PM',
    rating: 4.4,
    isActive: true,
    description: 'District court serving Lucknow',
    judges: 18,
    established: 1947,
    services: ['Civil Cases', 'Criminal Law', 'Land Matters']
  },
  {
    id: 'dc_jaipur',
    name: 'District Court - Jaipur',
    type: 'court',
    location: { lat: 26.9124, lng: 75.7873 },
    address: 'Police Lines, Jaipur 302001',
    phone: '+91-141-510-5050',
    email: 'registry@jaipurdistrictcourt.nic.in',
    jurisdiction: 'Jaipur District',
    workingHours: '10:00 AM - 4:30 PM',
    rating: 4.5,
    isActive: true,
    description: 'Primary district court of Jaipur',
    judges: 19,
    established: 1949,
    services: ['Civil Cases', 'Criminal Appeals', 'Real Estate']
  },
  {
    id: 'dc_kochi',
    name: 'District Court - Kochi',
    type: 'court',
    location: { lat: 9.9312, lng: 76.2673 },
    address: 'Fort Kochi, Kochi 682001',
    phone: '+91-484-221-6666',
    email: 'registry@kochidistrictcourt.nic.in',
    jurisdiction: 'Ernakulathappan',
    workingHours: '10:00 AM - 4:30 PM',
    rating: 4.6,
    isActive: true,
    description: 'District court of Kochi',
    judges: 16,
    established: 1949,
    services: ['Civil Cases', 'Criminal Law', 'Commerce Matters']
  },
  {
    id: 'dc_indore',
    name: 'District Court - Indore',
    type: 'court',
    location: { lat: 22.7196, lng: 75.8577 },
    address: 'Indore City, MP 452001',
    phone: '+91-731-248-0000',
    email: 'registry@indoredistrictcourt.nic.in',
    jurisdiction: 'Indore District',
    workingHours: '10:00 AM - 4:30 PM',
    rating: 4.4,
    isActive: true,
    description: 'District court of Indore',
    judges: 15,
    established: 1950,
    services: ['Civil Cases', 'Criminal Law', 'Property Disputes']
  },
  
  // Bar Councils
  {
    id: 'bcd_delhi',
    name: 'Bar Council of Delhi',
    type: 'bar_council',
    location: { lat: 28.6358, lng: 77.2245 },
    address: 'Legal Aid Building, New Delhi 110003',
    phone: '+91-11-2338-7540',
    email: 'info@barcouncildelhi.org',
    jurisdiction: 'Delhi',
    workingHours: '9:00 AM - 5:30 PM',
    rating: 4.2,
    isActive: true,
    description: 'Regulatory body for legal profession in Delhi',
    members: 15000,
    established: 1958,
    services: ['Lawyer Registration', 'Legal Ethics', 'Disciplinary Actions']
  },
  {
    id: 'bci_mumbai',
    name: 'Bar Council of India - Mumbai',
    type: 'bar_council',
    location: { lat: 18.9270, lng: 72.8314 },
    address: 'Bar House, Mumbai 400001',
    phone: '+91-22-2262-5555',
    email: 'info@barcouncilofindia.org',
    jurisdiction: 'Maharashtra',
    workingHours: '9:00 AM - 5:30 PM',
    rating: 4.3,
    isActive: true,
    description: 'Bar Council serving Maharashtra',
    members: 28000,
    established: 1961,
    services: ['Professional Standards', 'Ethics Training', 'Lawyer Grievances']
  },
  {
    id: 'bci_bangalore',
    name: 'Bar Council of India - Bangalore',
    type: 'bar_council',
    location: { lat: 12.9722, lng: 77.5915 },
    address: 'Bar Building, Bangalore 560001',
    phone: '+91-80-2230-7777',
    email: 'info@barcouncilofindia.org',
    jurisdiction: 'Karnataka',
    workingHours: '9:00 AM - 5:30 PM',
    rating: 4.3,
    isActive: true,
    description: 'Bar Council of Karnataka',
    members: 18000,
    established: 1962,
    services: ['Professional Ethics', 'Legal Education', 'Advocate Rights']
  },
  
  // National Legal Services
  {
    id: 'nalsa',
    name: 'National Legal Services Authority',
    type: 'legal_aid',
    location: { lat: 28.6139, lng: 77.2090 },
    address: 'Jawahar Lal Nehru Marg, New Delhi 110002',
    phone: '+91-11-2338-8922',
    email: 'info@nalsa.gov.in',
    jurisdiction: 'All India',
    workingHours: '9:00 AM - 6:00 PM',
    rating: 4.7,
    isActive: true,
    description: 'Apex body for legal aid services',
    beneficiaries: 500000,
    established: 1987,
    services: ['Free Legal Aid', 'Policy Formation', 'Training Programs']
  },
  {
    id: 'slsa_delhi',
    name: 'State Legal Services Authority - Delhi',
    type: 'legal_aid',
    location: { lat: 28.6308, lng: 77.2197 },
    address: 'New Delhi 110002',
    phone: '+91-11-4121-8000',
    email: 'info@delhilsa.gov.in',
    jurisdiction: 'Delhi',
    workingHours: '9:00 AM - 6:00 PM',
    rating: 4.6,
    isActive: true,
    description: 'Free legal aid for Delhi residents',
    beneficiaries: 150000,
    established: 1987,
    services: ['Free Consultation', 'Legal Representation', 'Public Interest Cases']
  }
];

// Enhanced Professional Lawyers Data - 40+ Across India
const PROFESSIONAL_LAWYERS = [
  // Delhi NCR
  {
    id: 1,
    name: 'Advocate Rajesh Kumar',
    specialization: 'Corporate Law',
    image: null,
    rating: 4.9,
    reviews: 340,
    experience: 16,
    location: { lat: 28.6139, lng: 77.2090 },
    isOnline: true,
    isInCall: false,
    responseTime: '2 min',
    consultationFee: 3500,
    availability: 'Available Now',
    languages: ['English', 'Hindi', 'Punjabi'],
    expertise: ['Corporate Law', 'Contract Law', 'M&A', 'Compliance'],
    education: 'LLM, Delhi University',
    barCouncil: 'Delhi Bar Council',
    cases: 450,
    successRate: 94,
    city: 'New Delhi',
    contact: '+91-98765-43210',
    bio: 'Expert in corporate mergers and acquisitions with 16 years of experience'
  },
  {
    id: 2,
    name: 'Advocate Priya Sharma',
    specialization: 'Criminal Law',
    image: null,
    rating: 4.8,
    reviews: 267,
    experience: 12,
    location: { lat: 28.6239, lng: 77.2190 },
    isOnline: true,
    isInCall: false,
    responseTime: '3 min',
    consultationFee: 2800,
    availability: 'Available Now',
    languages: ['English', 'Hindi', 'Marathi'],
    expertise: ['Criminal Law', 'Bail Applications', 'Court Representation'],
    education: 'LLB, BHU',
    barCouncil: 'Delhi Bar Council',
    cases: 320,
    successRate: 92,
    city: 'New Delhi',
    contact: '+91-98765-43211',
    bio: 'Specializes in criminal defense with excellent bail record'
  },
  {
    id: 3,
    name: 'Advocate Sanjay Verma',
    specialization: 'Real Estate & Property',
    image: null,
    rating: 4.7,
    reviews: 289,
    experience: 13,
    location: { lat: 28.5921, lng: 77.2064 },
    isOnline: true,
    isInCall: false,
    responseTime: '4 min',
    consultationFee: 3000,
    availability: 'Available Now',
    languages: ['English', 'Hindi'],
    expertise: ['Property Disputes', 'Land Law', 'Registration', 'Inheritance'],
    education: 'LLB, Delhi University',
    barCouncil: 'Delhi Bar Council',
    cases: 380,
    successRate: 91,
    city: 'New Delhi',
    contact: '+91-98765-43215',
    bio: 'Experienced in complex real estate transactions and disputes'
  },
  {
    id: 4,
    name: 'Advocate Neha Singh',
    specialization: 'Family & Matrimonial',
    image: null,
    rating: 4.6,
    reviews: 245,
    experience: 11,
    location: { lat: 28.6308, lng: 77.2197 },
    isOnline: false,
    isInCall: false,
    responseTime: '12 min',
    consultationFee: 2500,
    availability: 'Offline',
    languages: ['English', 'Hindi', 'Punjabi'],
    expertise: ['Divorce', 'Alimony', 'Custody', 'Prenup'],
    education: 'LLB, Delhi University',
    barCouncil: 'Delhi Bar Council',
    cases: 290,
    successRate: 88,
    city: 'New Delhi',
    contact: '+91-98765-43216',
    bio: 'Compassionate family law advocate'
  },
  {
    id: 5,
    name: 'Advocate Arjun Patel',
    specialization: 'Business & Commercial',
    image: null,
    rating: 4.8,
    reviews: 312,
    experience: 14,
    location: { lat: 28.5494, lng: 77.2507 },
    isOnline: true,
    isInCall: false,
    responseTime: '3 min',
    consultationFee: 3200,
    availability: 'Available Now',
    languages: ['English', 'Hindi', 'Gujarati'],
    expertise: ['Business Law', 'Corporate Governance', 'Contracts'],
    education: 'LLM, Delhi University',
    barCouncil: 'Delhi Bar Council',
    cases: 420,
    successRate: 93,
    city: 'Gurugram',
    contact: '+91-98765-43217',
    bio: 'Expert corporate advisor'
  },
  
  // Mumbai
  {
    id: 6,
    name: 'Advocate Ankit Shah',
    specialization: 'Family Law',
    image: null,
    rating: 4.7,
    reviews: 198,
    experience: 10,
    location: { lat: 19.0760, lng: 72.8777 },
    isOnline: true,
    isInCall: false,
    responseTime: '4 min',
    consultationFee: 2500,
    availability: 'Available Now',
    languages: ['English', 'Hindi', 'Gujarati', 'Marathi'],
    expertise: ['Family Law', 'Divorce', 'Child Custody', 'Domestic Violence'],
    education: 'LLB, Mumbai University',
    barCouncil: 'Mumbai Bar Council',
    cases: 280,
    successRate: 89,
    city: 'Mumbai',
    contact: '+91-98765-43212',
    bio: 'Compassionate family law advocate with sensitive case handling'
  },
  {
    id: 7,
    name: 'Advocate Rajesh Desai',
    specialization: 'Criminal Law',
    image: null,
    rating: 4.9,
    reviews: 425,
    experience: 15,
    location: { lat: 19.0726, lng: 72.8862 },
    isOnline: true,
    isInCall: false,
    responseTime: '2 min',
    consultationFee: 3800,
    availability: 'Available Now',
    languages: ['English', 'Hindi', 'Marathi'],
    expertise: ['Criminal Defense', 'White Collar Crime', 'Appeals'],
    education: 'LLM, Mumbai University',
    barCouncil: 'Mumbai Bar Council',
    cases: 510,
    successRate: 95,
    city: 'Mumbai',
    contact: '+91-98765-43218',
    bio: 'Senior criminal law specialist with 15 years experience'
  },
  {
    id: 8,
    name: 'Advocate Pooja Gupta',
    specialization: 'Tax & Finance Law',
    image: null,
    rating: 4.8,
    reviews: 356,
    experience: 12,
    location: { lat: 19.0596, lng: 72.8295 },
    isOnline: true,
    isInCall: false,
    responseTime: '5 min',
    consultationFee: 4000,
    availability: 'Available Now',
    languages: ['English', 'Hindi', 'Marathi'],
    expertise: ['Income Tax', 'GST', 'Financial Compliance'],
    education: 'LLM (Tax), Mumbai University',
    barCouncil: 'Mumbai Bar Council',
    cases: 380,
    successRate: 94,
    city: 'Mumbai',
    contact: '+91-98765-43219',
    bio: 'Specializes in complex tax matters'
  },
  {
    id: 9,
    name: 'Advocate Vikram Nair',
    specialization: 'Intellectual Property',
    image: null,
    rating: 4.6,
    reviews: 267,
    experience: 11,
    location: { lat: 19.0827, lng: 72.8975 },
    isOnline: false,
    isInCall: false,
    responseTime: '18 min',
    consultationFee: 3500,
    availability: 'Offline',
    languages: ['English', 'Hindi', 'Tamil'],
    expertise: ['Patents', 'Trademarks', 'Copyrights', 'IP Strategy'],
    education: 'LLM (IP), IIT-B',
    barCouncil: 'Mumbai Bar Council',
    cases: 250,
    successRate: 91,
    city: 'Mumbai',
    contact: '+91-98765-43220',
    bio: 'IP law specialist with tech background'
  },
  
  // Bangalore
  {
    id: 10,
    name: 'Advocate Vikram Rao',
    specialization: 'IP & Tech Law',
    image: null,
    rating: 4.9,
    reviews: 412,
    experience: 14,
    location: { lat: 12.9716, lng: 77.5946 },
    isOnline: true,
    isInCall: false,
    responseTime: '1 min',
    consultationFee: 4000,
    availability: 'Available Now',
    languages: ['English', 'Hindi', 'Kannada', 'Tamil'],
    expertise: ['IP Law', 'Technology Law', 'Software Licensing', 'Patents', 'Copyrights'],
    education: 'LLM, IIT-B',
    barCouncil: 'Karnataka Bar Council',
    cases: 690,
    successRate: 96,
    city: 'Bangalore',
    contact: '+91-98765-43213',
    bio: 'Technology law expert with patent prosecution expertise'
  },
  {
    id: 11,
    name: 'Advocate Meera Iyer',
    specialization: 'Employment Law',
    image: null,
    rating: 4.6,
    reviews: 156,
    experience: 9,
    location: { lat: 12.9850, lng: 77.6050 },
    isOnline: false,
    isInCall: false,
    responseTime: '15 min',
    consultationFee: 2200,
    availability: 'Offline',
    languages: ['English', 'Hindi', 'Kannada', 'Telugu'],
    expertise: ['Employment Law', 'Labor Disputes', 'HR Compliance', 'Wrongful Termination'],
    education: 'LLB, Bangalore University',
    barCouncil: 'Karnataka Bar Council',
    cases: 220,
    successRate: 87,
    city: 'Bangalore',
    contact: '+91-98765-43214',
    bio: 'Employment law specialist protecting employee rights'
  },
  {
    id: 12,
    name: 'Advocate Harsha Nambiar',
    specialization: 'Corporate Law',
    image: null,
    rating: 4.8,
    reviews: 334,
    experience: 13,
    location: { lat: 12.9352, lng: 77.6245 },
    isOnline: true,
    isInCall: false,
    responseTime: '3 min',
    consultationFee: 3800,
    availability: 'Available Now',
    languages: ['English', 'Hindi', 'Kannada'],
    expertise: ['Corporate M&A', 'Startups', 'Venture Capital'],
    education: 'LLM, NLU Karnataka',
    barCouncil: 'Karnataka Bar Council',
    cases: 410,
    successRate: 92,
    city: 'Bangalore',
    contact: '+91-98765-43221',
    bio: 'M&A expert for tech startups'
  },
  {
    id: 13,
    name: 'Advocate Ramesh Kumar',
    specialization: 'Real Estate',
    image: null,
    rating: 4.7,
    reviews: 198,
    experience: 10,
    location: { lat: 13.0084, lng: 77.5718 },
    isOnline: true,
    isInCall: false,
    responseTime: '4 min',
    consultationFee: 2700,
    availability: 'Available Now',
    languages: ['English', 'Hindi', 'Kannada', 'Telugu'],
    expertise: ['Property Law', 'Land Disputes', 'Registration'],
    education: 'LLB, Bangalore University',
    barCouncil: 'Karnataka Bar Council',
    cases: 310,
    successRate: 89,
    city: 'Bangalore',
    contact: '+91-98765-43222',
    bio: 'Real estate law specialist'
  },
  
  // Hyderabad
  {
    id: 14,
    name: 'Advocate Arun Kumar',
    specialization: 'Criminal Law',
    image: null,
    rating: 4.7,
    reviews: 289,
    experience: 12,
    location: { lat: 17.3850, lng: 78.4867 },
    isOnline: true,
    isInCall: false,
    responseTime: '5 min',
    consultationFee: 2800,
    availability: 'Available Now',
    languages: ['English', 'Hindi', 'Telugu', 'Urdu'],
    expertise: ['Criminal Defense', 'Bail', 'Appeals'],
    education: 'LLB, NALSAR',
    barCouncil: 'Telangana Bar Council',
    cases: 380,
    successRate: 90,
    city: 'Hyderabad',
    contact: '+91-98765-43223',
    bio: 'Criminal law specialist in Telangana'
  },
  {
    id: 15,
    name: 'Advocate Sunaina Reddy',
    specialization: 'Corporate & Commercial',
    image: null,
    rating: 4.8,
    reviews: 312,
    experience: 13,
    location: { lat: 17.3608, lng: 78.4744 },
    isOnline: true,
    isInCall: false,
    responseTime: '2 min',
    consultationFee: 3600,
    availability: 'Available Now',
    languages: ['English', 'Hindi', 'Telugu'],
    expertise: ['Corporate Law', 'Contracts', 'Business Disputes'],
    education: 'LLM, NALSAR',
    barCouncil: 'Telangana Bar Council',
    cases: 450,
    successRate: 93,
    city: 'Hyderabad',
    contact: '+91-98765-43224',
    bio: 'Corporate law expert in Telangana'
  },
  {
    id: 16,
    name: 'Advocate Naveen Talwar',
    specialization: 'Family & Matrimonial',
    image: null,
    rating: 4.6,
    reviews: 167,
    experience: 9,
    location: { lat: 17.3940, lng: 78.4989 },
    isOnline: false,
    isInCall: false,
    responseTime: '20 min',
    consultationFee: 2400,
    availability: 'Offline',
    languages: ['English', 'Hindi', 'Telugu'],
    expertise: ['Family Law', 'Divorce', 'Custody'],
    education: 'LLB, Osmania University',
    barCouncil: 'Telangana Bar Council',
    cases: 240,
    successRate: 88,
    city: 'Hyderabad',
    contact: '+91-98765-43225',
    bio: 'Family law advocate'
  },
  
  // Chennai
  {
    id: 17,
    name: 'Advocate Srinivasan Murthy',
    specialization: 'Criminal & Civil Law',
    image: null,
    rating: 4.8,
    reviews: 298,
    experience: 14,
    location: { lat: 13.0827, lng: 80.2707 },
    isOnline: true,
    isInCall: false,
    responseTime: '3 min',
    consultationFee: 3200,
    availability: 'Available Now',
    languages: ['English', 'Tamil', 'Hindi'],
    expertise: ['Criminal Law', 'Civil Litigation', 'Appeals'],
    education: 'LLM, University of Madras',
    barCouncil: 'Madras Bar Council',
    cases: 520,
    successRate: 92,
    city: 'Chennai',
    contact: '+91-98765-43226',
    bio: 'Senior advocate in Chennai'
  },
  {
    id: 18,
    name: 'Advocate Priya Anand',
    specialization: 'Intellectual Property',
    image: null,
    rating: 4.7,
    reviews: 256,
    experience: 11,
    location: { lat: 13.0597, lng: 80.2185 },
    isOnline: true,
    isInCall: false,
    responseTime: '4 min',
    consultationFee: 3500,
    availability: 'Available Now',
    languages: ['English', 'Tamil', 'Hindi'],
    expertise: ['Patents', 'Copyrights', 'IP Strategy'],
    education: 'LLM (IP), University of Madras',
    barCouncil: 'Madras Bar Council',
    cases: 310,
    successRate: 91,
    city: 'Chennai',
    contact: '+91-98765-43227',
    bio: 'IP law specialist'
  },
  {
    id: 19,
    name: 'Advocate Vijay Kumar',
    specialization: 'Real Estate & Property',
    image: null,
    rating: 4.6,
    reviews: 178,
    experience: 10,
    location: { lat: 13.0649, lng: 80.2424 },
    isOnline: false,
    isInCall: false,
    responseTime: '16 min',
    consultationFee: 2600,
    availability: 'Offline',
    languages: ['English', 'Tamil'],
    expertise: ['Property Law', 'Land Disputes', 'Tenancy'],
    education: 'LLB, University of Madras',
    barCouncil: 'Madras Bar Council',
    cases: 280,
    successRate: 87,
    city: 'Chennai',
    contact: '+91-98765-43228',
    bio: 'Real estate specialist'
  },
  
  // Kolkata
  {
    id: 20,
    name: 'Advocate Debajyoti Bhattacharya',
    specialization: 'Corporate & Commercial',
    image: null,
    rating: 4.8,
    reviews: 334,
    experience: 13,
    location: { lat: 22.5726, lng: 88.3639 },
    isOnline: true,
    isInCall: false,
    responseTime: '2 min',
    consultationFee: 3400,
    availability: 'Available Now',
    languages: ['English', 'Bengali', 'Hindi'],
    expertise: ['Corporate Law', 'Business Disputes', 'Contracts'],
    education: 'LLM, University of Calcutta',
    barCouncil: 'Calcutta Bar Council',
    cases: 460,
    successRate: 93,
    city: 'Kolkata',
    contact: '+91-98765-43229',
    bio: 'Corporate law expert'
  },
  {
    id: 21,
    name: 'Advocate Rina Dey',
    specialization: 'Family & Criminal',
    image: null,
    rating: 4.7,
    reviews: 212,
    experience: 11,
    location: { lat: 22.5597, lng: 88.3787 },
    isOnline: true,
    isInCall: false,
    responseTime: '4 min',
    consultationFee: 2700,
    availability: 'Available Now',
    languages: ['English', 'Bengali', 'Hindi'],
    expertise: ['Family Law', 'Criminal Defense', 'Domestic Violence'],
    education: 'LLB, University of Calcutta',
    barCouncil: 'Calcutta Bar Council',
    cases: 340,
    successRate: 89,
    city: 'Kolkata',
    contact: '+91-98765-43230',
    bio: 'Family and criminal law advocate'
  },
  
  // Pune
  {
    id: 22,
    name: 'Advocate Abhijit Deshmukh',
    specialization: 'Corporate Law',
    image: null,
    rating: 4.7,
    reviews: 267,
    experience: 12,
    location: { lat: 18.5204, lng: 73.8567 },
    isOnline: true,
    isInCall: false,
    responseTime: '3 min',
    consultationFee: 3300,
    availability: 'Available Now',
    languages: ['English', 'Hindi', 'Marathi'],
    expertise: ['Corporate Law', 'Startups', 'M&A'],
    education: 'LLM, Pune University',
    barCouncil: 'Bombay Bar Council',
    cases: 390,
    successRate: 91,
    city: 'Pune',
    contact: '+91-98765-43231',
    bio: 'Corporate law specialist'
  },
  {
    id: 23,
    name: 'Advocate Swapna Kulkarni',
    specialization: 'Criminal Law',
    image: null,
    rating: 4.8,
    reviews: 289,
    experience: 10,
    location: { lat: 18.5195, lng: 73.8553 },
    isOnline: true,
    isInCall: false,
    responseTime: '4 min',
    consultationFee: 2900,
    availability: 'Available Now',
    languages: ['English', 'Hindi', 'Marathi'],
    expertise: ['Criminal Law', 'Women Issues', 'Defense'],
    education: 'LLB, Pune University',
    barCouncil: 'Bombay Bar Council',
    cases: 310,
    successRate: 90,
    city: 'Pune',
    contact: '+91-98765-43232',
    bio: 'Criminal law specialist'
  },
  
  // Ahmedabad
  {
    id: 24,
    name: 'Advocate Nitin Patel',
    specialization: 'Business & Commercial',
    image: null,
    rating: 4.8,
    reviews: 301,
    experience: 12,
    location: { lat: 23.1815, lng: 72.6313 },
    isOnline: true,
    isInCall: false,
    responseTime: '3 min',
    consultationFee: 3200,
    availability: 'Available Now',
    languages: ['English', 'Hindi', 'Gujarati'],
    expertise: ['Business Law', 'Corporate Disputes', 'Commercial Contracts'],
    education: 'LLM, Gujarat University',
    barCouncil: 'Gujarat Bar Council',
    cases: 420,
    successRate: 92,
    city: 'Ahmedabad',
    contact: '+91-98765-43233',
    bio: 'Business law specialist'
  },
  {
    id: 25,
    name: 'Advocate Divya Shah',
    specialization: 'Family Law',
    image: null,
    rating: 4.6,
    reviews: 189,
    experience: 9,
    location: { lat: 23.1880, lng: 72.6370 },
    isOnline: false,
    isInCall: false,
    responseTime: '14 min',
    consultationFee: 2400,
    availability: 'Offline',
    languages: ['English', 'Hindi', 'Gujarati'],
    expertise: ['Family Law', 'Divorce', 'Custody'],
    education: 'LLB, Gujarat University',
    barCouncil: 'Gujarat Bar Council',
    cases: 260,
    successRate: 88,
    city: 'Ahmedabad',
    contact: '+91-98765-43234',
    bio: 'Family law advocate'
  },
  
  // Lucknow
  {
    id: 26,
    name: 'Advocate Raj Singh Yadav',
    specialization: 'Criminal & Civil Law',
    image: null,
    rating: 4.7,
    reviews: 245,
    experience: 11,
    location: { lat: 26.8467, lng: 80.9462 },
    isOnline: true,
    isInCall: false,
    responseTime: '5 min',
    consultationFee: 2600,
    availability: 'Available Now',
    languages: ['English', 'Hindi', 'Urdu'],
    expertise: ['Criminal Law', 'Civil Litigation', 'Appeals'],
    education: 'LLB, Lucknow University',
    barCouncil: 'Allahabad High Court Bar',
    cases: 340,
    successRate: 89,
    city: 'Lucknow',
    contact: '+91-98765-43235',
    bio: 'Criminal and civil law advocate'
  },
  {
    id: 27,
    name: 'Advocate Anjali Verma',
    specialization: 'Employment Law',
    image: null,
    rating: 4.6,
    reviews: 156,
    experience: 8,
    location: { lat: 26.8553, lng: 80.9626 },
    isOnline: true,
    isInCall: false,
    responseTime: '6 min',
    consultationFee: 2200,
    availability: 'Available Now',
    languages: ['English', 'Hindi'],
    expertise: ['Employment Law', 'Labor Rights', 'HR Disputes'],
    education: 'LLB, Lucknow University',
    barCouncil: 'Allahabad High Court Bar',
    cases: 210,
    successRate: 86,
    city: 'Lucknow',
    contact: '+91-98765-43236',
    bio: 'Employment law specialist'
  },
  
  // Jaipur
  {
    id: 28,
    name: 'Advocate Mahesh Sharma',
    specialization: 'Corporate Law',
    image: null,
    rating: 4.7,
    reviews: 278,
    experience: 11,
    location: { lat: 26.9124, lng: 75.7873 },
    isOnline: true,
    isInCall: false,
    responseTime: '4 min',
    consultationFee: 3000,
    availability: 'Available Now',
    languages: ['English', 'Hindi'],
    expertise: ['Corporate Law', 'Business Disputes', 'Contracts'],
    education: 'LLM, Rajasthan University',
    barCouncil: 'Rajasthan Bar Council',
    cases: 360,
    successRate: 90,
    city: 'Jaipur',
    contact: '+91-98765-43237',
    bio: 'Corporate law specialist'
  },
  {
    id: 29,
    name: 'Advocate Neelam Singh',
    specialization: 'Real Estate & Property',
    image: null,
    rating: 4.6,
    reviews: 167,
    experience: 9,
    location: { lat: 26.9089, lng: 75.7997 },
    isOnline: false,
    isInCall: false,
    responseTime: '15 min',
    consultationFee: 2500,
    availability: 'Offline',
    languages: ['English', 'Hindi'],
    expertise: ['Property Law', 'Land Disputes', 'Registration'],
    education: 'LLB, Rajasthan University',
    barCouncil: 'Rajasthan Bar Council',
    cases: 240,
    successRate: 87,
    city: 'Jaipur',
    contact: '+91-98765-43238',
    bio: 'Real estate law specialist'
  },
  
  // Indore
  {
    id: 30,
    name: 'Advocate Rajeev Malwa',
    specialization: 'Business Law',
    image: null,
    rating: 4.6,
    reviews: 189,
    experience: 10,
    location: { lat: 22.7196, lng: 75.8577 },
    isOnline: true,
    isInCall: false,
    responseTime: '5 min',
    consultationFee: 2700,
    availability: 'Available Now',
    languages: ['English', 'Hindi'],
    expertise: ['Business Law', 'Commercial Contracts', 'Disputes'],
    education: 'LLB, Devi Ahilya University',
    barCouncil: 'Madhya Pradesh Bar Council',
    cases: 300,
    successRate: 88,
    city: 'Indore',
    contact: '+91-98765-43239',
    bio: 'Business law advocate'
  },
  
  // Kochi
  {
    id: 31,
    name: 'Advocate Arun Menon',
    specialization: 'Corporate & Commercial',
    image: null,
    rating: 4.7,
    reviews: 256,
    experience: 11,
    location: { lat: 9.9312, lng: 76.2673 },
    isOnline: true,
    isInCall: false,
    responseTime: '4 min',
    consultationFee: 3100,
    availability: 'Available Now',
    languages: ['English', 'Malayalam', 'Hindi'],
    expertise: ['Corporate Law', 'Business Disputes', 'Contracts'],
    education: 'LLM, Cochin University',
    barCouncil: 'Kerala Bar Council',
    cases: 380,
    successRate: 90,
    city: 'Kochi',
    contact: '+91-98765-43240',
    bio: 'Corporate law specialist in Kerala'
  },
  {
    id: 32,
    name: 'Advocate Sheela Nair',
    specialization: 'Family & Criminal',
    image: null,
    rating: 4.6,
    reviews: 178,
    experience: 9,
    location: { lat: 9.9456, lng: 76.2800 },
    isOnline: false,
    isInCall: false,
    responseTime: '13 min',
    consultationFee: 2500,
    availability: 'Offline',
    languages: ['English', 'Malayalam'],
    expertise: ['Family Law', 'Criminal Defense', 'Womens Rights'],
    education: 'LLB, Cochin University',
    barCouncil: 'Kerala Bar Council',
    cases: 260,
    successRate: 87,
    city: 'Kochi',
    contact: '+91-98765-43241',
    bio: 'Family and criminal law advocate'
  },
  
  // Guwahati
  {
    id: 33,
    name: 'Advocate Pranab Dutta',
    specialization: 'Criminal Law',
    image: null,
    rating: 4.6,
    reviews: 167,
    experience: 10,
    location: { lat: 26.1445, lng: 91.7362 },
    isOnline: true,
    isInCall: false,
    responseTime: '6 min',
    consultationFee: 2400,
    availability: 'Available Now',
    languages: ['English', 'Assamese', 'Bengali'],
    expertise: ['Criminal Law', 'Appeals', 'Defense'],
    education: 'LLB, Assam University',
    barCouncil: 'Gauhati High Court Bar',
    cases: 290,
    successRate: 88,
    city: 'Guwahati',
    contact: '+91-98765-43242',
    bio: 'Criminal law specialist'
  },
  
  // Chandigarh
  {
    id: 34,
    name: 'Advocate Raman Singh',
    specialization: 'Corporate & Commercial',
    image: null,
    rating: 4.7,
    reviews: 234,
    experience: 11,
    location: { lat: 30.7333, lng: 76.7794 },
    isOnline: true,
    isInCall: false,
    responseTime: '3 min',
    consultationFee: 3000,
    availability: 'Available Now',
    languages: ['English', 'Hindi', 'Punjabi'],
    expertise: ['Corporate Law', 'Business Disputes', 'Contracts'],
    education: 'LLM, Panjab University',
    barCouncil: 'Punjab Bar Council',
    cases: 340,
    successRate: 89,
    city: 'Chandigarh',
    contact: '+91-98765-43243',
    bio: 'Corporate law specialist in North India'
  },
  {
    id: 35,
    name: 'Advocate Harleen Kaur',
    specialization: 'Family Law',
    image: null,
    rating: 4.6,
    reviews: 156,
    experience: 8,
    location: { lat: 30.7372, lng: 76.7842 },
    isOnline: true,
    isInCall: false,
    responseTime: '5 min',
    consultationFee: 2300,
    availability: 'Available Now',
    languages: ['English', 'Hindi', 'Punjabi'],
    expertise: ['Family Law', 'Divorce', 'Custody'],
    education: 'LLB, Panjab University',
    barCouncil: 'Punjab Bar Council',
    cases: 220,
    successRate: 86,
    city: 'Chandigarh',
    contact: '+91-98765-43244',
    bio: 'Family law advocate'
  },
  
  // Bhopal
  {
    id: 36,
    name: 'Advocate Sanjay Mishra',
    specialization: 'Criminal & Civil',
    image: null,
    rating: 4.6,
    reviews: 178,
    experience: 10,
    location: { lat: 23.1815, lng: 77.4149 },
    isOnline: true,
    isInCall: false,
    responseTime: '5 min',
    consultationFee: 2500,
    availability: 'Available Now',
    languages: ['English', 'Hindi'],
    expertise: ['Criminal Law', 'Civil Litigation', 'Appeals'],
    education: 'LLB, Barkatullah University',
    barCouncil: 'Madhya Pradesh Bar Council',
    cases: 310,
    successRate: 88,
    city: 'Bhopal',
    contact: '+91-98765-43245',
    bio: 'Criminal and civil law advocate'
  },
  
  // Vadodara
  {
    id: 37,
    name: 'Advocate Nirmal Desai',
    specialization: 'Corporate Law',
    image: null,
    rating: 4.7,
    reviews: 212,
    experience: 11,
    location: { lat: 22.3072, lng: 73.1812 },
    isOnline: true,
    isInCall: false,
    responseTime: '4 min',
    consultationFee: 3000,
    availability: 'Available Now',
    languages: ['English', 'Hindi', 'Gujarati'],
    expertise: ['Corporate Law', 'Business Disputes', 'Contracts'],
    education: 'LLB, Gujarat University',
    barCouncil: 'Gujarat Bar Council',
    cases: 350,
    successRate: 89,
    city: 'Vadodara',
    contact: '+91-98765-43246',
    bio: 'Corporate law specialist'
  },
  
  // Surat
  {
    id: 38,
    name: 'Advocate Hemant Joshi',
    specialization: 'Commercial & Tax',
    image: null,
    rating: 4.8,
    reviews: 267,
    experience: 12,
    location: { lat: 21.1458, lng: 72.8355 },
    isOnline: true,
    isInCall: false,
    responseTime: '3 min',
    consultationFee: 3300,
    availability: 'Available Now',
    languages: ['English', 'Hindi', 'Gujarati'],
    expertise: ['Commercial Law', 'Tax Law', 'Disputes'],
    education: 'LLM, Veer Narmad University',
    barCouncil: 'Gujarat Bar Council',
    cases: 380,
    successRate: 91,
    city: 'Surat',
    contact: '+91-98765-43247',
    bio: 'Commercial and tax law specialist'
  },
  
  // Vizag
  {
    id: 39,
    name: 'Advocate Suresh Reddy',
    specialization: 'Corporate Law',
    image: null,
    rating: 4.6,
    reviews: 189,
    experience: 10,
    location: { lat: 17.6869, lng: 83.2185 },
    isOnline: false,
    isInCall: false,
    responseTime: '12 min',
    consultationFee: 2700,
    availability: 'Offline',
    languages: ['English', 'Telugu', 'Hindi'],
    expertise: ['Corporate Law', 'Business Disputes', 'Contracts'],
    education: 'LLB, Andhra University',
    barCouncil: 'Telangana Bar Council',
    cases: 300,
    successRate: 88,
    city: 'Vizag',
    contact: '+91-98765-43248',
    bio: 'Corporate law specialist'
  },
  
  // Nagpur
  {
    id: 40,
    name: 'Advocate Prakash Khare',
    specialization: 'Criminal Law',
    image: null,
    rating: 4.7,
    reviews: 223,
    experience: 11,
    location: { lat: 21.1458, lng: 79.0882 },
    isOnline: true,
    isInCall: false,
    responseTime: '4 min',
    consultationFee: 2600,
    availability: 'Available Now',
    languages: ['English', 'Hindi', 'Marathi'],
    expertise: ['Criminal Law', 'Appeals', 'Defense'],
    education: 'LLB, Nagpur University',
    barCouncil: 'Bombay Bar Council',
    cases: 340,
    successRate: 89,
    city: 'Nagpur',
    contact: '+91-98765-43249',
    bio: 'Criminal law specialist in Central India'
  }
];

// Fix Leaflet markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const UserLocationMarker = ({ position, isDark }) => {
  return (
    <Marker position={position} icon={L.divIcon({
      html: `
        <div style="position: relative; width: 48px; height: 48px;">
          <div style="position: absolute; width: 48px; height: 48px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border: 4px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.2), 0 8px 20px rgba(59, 130, 246, 0.4);" class="user-location-marker">
            <div style="width: 12px; height: 12px; background: white; border-radius: 50%;"></div>
          </div>
          <div style="position: absolute; width: 100%; height: 100%; border: 2px solid rgba(59, 130, 246, 0.5); border-radius: 50%; animation: pulse-location 2s infinite;"></div>
        </div>
      `,
      className: 'user-location-icon',
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    })}>
      <Popup className="you-are-here-popup">
        <div className={`p-4 rounded-xl text-center min-w-40 ${isDark ? 'bg-gradient-to-br from-blue-900 to-blue-800 text-white' : 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-900'}`}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span style={{fontSize: '24px'}}>📍</span>
            <p className="font-bold text-sm">You are here</p>
          </div>
          <p className={`text-xs ${isDark ? 'text-blue-100' : 'text-blue-700'}`}>Your current location</p>
        </div>
      </Popup>
    </Marker>
  );
};

// Create professional marker icons - NO JUMPING ON HOVER
const createLawyerMarker = (isOnline, isInCall, isSelected) => {
  const size = isSelected ? 40 : 32;
  
  return L.divIcon({
    html: `
      <div style="position: relative; width: ${size}px; height: ${size}px;" class="lawyer-marker-container">
        <div style="position: absolute; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;" class="marker-icon-wrapper">
          <div style="position: relative; width: ${size}px; height: ${size}px; background: white; border: 3px solid ${isInCall ? '#ef4444' : isOnline ? '#22c55e' : '#9ca3af'}; border-radius: 50%; display: flex; align-items: center; justify-center; box-shadow: 0 6px 20px rgba(0,0,0,0.25);" class="marker-circle">
            <div style="width: 100%; height: 100%; background: linear-gradient(135deg, ${isInCall ? '#ef4444' : isOnline ? '#22c55e' : '#9ca3af'}, ${isInCall ? '#dc2626' : isOnline ? '#16a34a' : '#6b7280'}); border-radius: 50%; display: flex; align-items: center; justify-center;">
              <svg style="width: 16px; height: 16px; color: white;" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            ${isOnline && !isInCall ? `<div style="position: absolute; top: -4px; right: -4px; width: 14px; height: 14px; background: #22c55e; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.3);" class="online-badge"></div>` : ''}
          </div>
        </div>
      </div>
    `,
    className: 'professional-lawyer-marker',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
    popupAnchor: [0, -(size/2 + 10)],
  });
};

const createLegalBodyMarker = (type, isSelected) => {
  const size = isSelected ? 44 : 36;
  const iconConfigs = {
    supreme_court: { icon: '⚖️' },
    court: { icon: '🏛️' },
    bar_council: { icon: '📋' },
    legal_aid: { icon: '🤝' }
  };
  
  const config = iconConfigs[type] || { icon: '🏢' };
  
  return L.divIcon({
    html: `<div style="font-size: ${size * 0.7}px; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2));">${config.icon}</div>`,
    className: 'professional-legal-body-marker',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
    popupAnchor: [0, -size/2 - 10],
  });
};

// Private Chat Modal Component
const PrivateChatModal = ({ lawyer, isOpen, onClose, isDark }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      setMessages([...messages, {
        id: Date.now(),
        sender: 'user',
        text: inputText,
        timestamp: new Date()
      }]);
      setInputText('');
    }
  };

  if (!isOpen || !lawyer) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-end md:items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 100 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 100 }}
          className={`w-full md:w-96 h-[90vh] md:h-[600px] rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col backdrop-blur-xl ${
            isDark 
              ? 'bg-gradient-to-br from-gray-800/95 to-gray-900/95 border border-gray-700/60'
              : 'bg-gradient-to-br from-white/95 to-gray-50/95 border border-gray-200/60'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`flex items-center justify-between p-4 border-b backdrop-blur-md ${isDark ? 'border-gray-700/40 bg-gradient-to-b from-gray-800/60 to-gray-900/30' : 'border-gray-200/40 bg-gradient-to-b from-white/60 to-gray-50/30'}`}>
            <div className="flex items-center gap-3">
              <img src={lawyer.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(lawyer.name)}&background=667eea&color=fff&size=40&bold=true`} alt={lawyer.name} className="w-10 h-10 rounded-full" />
              <div>
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{lawyer.name}</h3>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{lawyer.isOnline ? 'Online' : 'Offline'}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2"><X className="w-5 h-5" /></button>
          </div>
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isDark ? 'bg-gray-800/30' : 'bg-gray-50/50'}`}>
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Start a conversation</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-2xl backdrop-blur-sm ${msg.sender === 'user' ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg' : isDark ? 'bg-gray-700/70 text-gray-100 border border-gray-600/50' : 'bg-gray-200/70 text-gray-900 border border-gray-300/50'}`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className={`p-4 border-t ${isDark ? 'border-gray-700/30 bg-gradient-to-b from-gray-800/30 to-gray-900/50' : 'border-gray-200/30 bg-gradient-to-b from-white/30 to-gray-50/50'}`}>
            <div className={`glass-input-container ${isDark ? 'glass-input-container-dark' : 'glass-input-container-light'}`}>
              <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Type message..." className={`glass-input glass-input-message ${isDark ? 'glass-input-dark' : 'glass-input-light'}`} />
              <button onClick={handleSendMessage} className={`glass-button ${isDark ? 'glass-button-dark' : 'glass-button-light'}`}><Send className="w-5 h-5" /></button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Call Modal Component
const CallModal = ({ lawyer, isOpen, onClose, isDark, callType = 'call' }) => {
  const [isActive, setIsActive] = useState(false);
  const [callTime, setCallTime] = useState(0);

  useEffect(() => {
    if (isActive) {
      const timer = setInterval(() => setCallTime(t => t + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isActive]);

  if (!isOpen || !lawyer) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm ${isDark ? 'bg-black/70' : 'bg-black/40'}`}>
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className={`w-full max-w-sm p-8 text-center space-y-6 rounded-3xl ${isDark ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50' : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200/50'}`}>
        <div className="relative w-32 h-32 mx-auto">
          <img src={lawyer.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(lawyer.name)}&background=667eea&color=fff&size=128&bold=true`} alt={lawyer.name} className={`w-32 h-32 rounded-full object-cover border-4 shadow-2xl ${isActive ? 'border-green-500' : isDark ? 'border-gray-700' : 'border-gray-300'}`} />
          {isActive && <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-pulse"></div>}
        </div>
        <div>
          <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{lawyer.name}</h3>
          {isActive && <p className="text-lg font-mono font-bold text-green-500">{Math.floor(callTime / 60)}:{String(callTime % 60).padStart(2, '0')}</p>}
        </div>
        <div className="flex justify-center gap-6">
          {isActive && <button className="w-14 h-14 rounded-full bg-gray-700 text-white flex items-center justify-center"><MicOff className="w-6 h-6" /></button>}
          <button onClick={() => setIsActive(!isActive)} className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-lg font-bold ${isActive ? 'bg-red-500' : 'bg-green-500'}`}>{isActive ? <X className="w-8 h-8" /> : <PhoneCall className="w-8 h-8" />}</button>
          {!isActive && <button onClick={onClose} className="w-14 h-14 rounded-full bg-gray-700 text-white flex items-center justify-center"><X className="w-6 h-6" /></button>}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Scheduling Modal Component
const SchedulingModal = ({ lawyer, isOpen, onClose, isDark, locationGranted }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [visitType, setVisitType] = useState('online');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !lawyer) return null;

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime) { alert('Please select date and time'); return; }
    setIsSubmitting(true);
    setTimeout(() => { setIsSubmitting(false); onClose(); }, 1500);
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={`w-full max-w-md rounded-3xl shadow-2xl p-6 backdrop-blur-sm ${isDark ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50' : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200/50'}`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Schedule Appointment</h3>
          <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <img src={lawyer.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(lawyer.name)}&background=667eea&color=fff&size=48&bold=true`} alt={lawyer.name} className="w-12 h-12 rounded-full" />
            <div>
              <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{lawyer.name}</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{lawyer.specialization}</p>
            </div>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Appointment Type</label>
            <div className="flex gap-2">
              {['online', 'offline'].map((type) => (
                <button key={type} onClick={() => setVisitType(type)} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${visitType === type ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' : isDark ? 'bg-gray-700/50 text-gray-300 border border-gray-600/50 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'}`}>
                  {type === 'online' ? '💻 Online' : '🏢 Office'}
                </button>
              ))}
            </div>
            {visitType === 'offline' && !locationGranted && (
              <div className={`mt-2 p-2 text-xs flex gap-2 rounded-lg ${isDark ? 'bg-yellow-900/20 text-yellow-300' : 'bg-yellow-50 text-yellow-800'}`}>
                <AlertCircle className="w-4 h-4" /> Enable location access
              </div>
            )}
          </div>
          <div>
            <label className={`block text-sm font-bold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>📅 Select Date</label>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={minDate.toISOString().split('T')[0]} className={`w-full glass-input ${isDark ? 'glass-input-dark' : 'glass-input-light'}`} />
          </div>
          <div>
            <label className={`block text-sm font-bold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>🕐 Select Time</label>
            <input type="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className={`w-full glass-input ${isDark ? 'glass-input-dark' : 'glass-input-light'}`} />
          </div>
          <div className="flex gap-2 pt-4">
            <button onClick={onClose} className={`flex-1 glass-button ${isDark ? 'glass-button-dark' : 'glass-button-light'} opacity-70 hover:opacity-100`}>Cancel</button>
            <button onClick={handleSchedule} disabled={isSubmitting} className={`flex-1 glass-button ${isDark ? 'glass-button-dark' : 'glass-button-light'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Scheduling...</> : <><Calendar className="w-4 h-4" /> Schedule</>}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const LawyerCard = ({ lawyer, onSelect, onConnect, isDark }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.03 }}
    className={`relative group rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer ${
      isDark 
        ? 'professional-card-dark'
        : 'professional-card-light'
    }`}
    onClick={() => onSelect(lawyer)}
  >
    <div className="h-40 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-300">
        <div className="absolute top-4 right-4 w-20 h-20 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-0 left-4 w-24 h-24 bg-white rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>
    </div>
    
    <div className="px-6 pb-6">
      <div className="flex items-end justify-between -mt-14 mb-4">
        <div className="relative z-10">
          <img
            src={lawyer.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(lawyer.name)}&background=667eea&color=fff&size=112&bold=true&font-size=0.4`}
            alt={lawyer.name}
            className="w-28 h-28 rounded-2xl border-4 border-white/90 dark:border-gray-800 object-cover shadow-2xl"
          />
          <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-3 border-white flex items-center justify-center ${
            lawyer.isInCall ? 'bg-red-500 animate-pulse' : lawyer.isOnline ? 'bg-green-500' : 'bg-gray-500'
          }`}>
            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); }}
          className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 p-2 rounded-lg transition-colors"
        >
          <Heart className="w-5 h-5" />
        </motion.button>
      </div>
      
      <div className="mb-4">
        <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {lawyer.name}
        </h3>
        <p className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
          {lawyer.specialization}
        </p>
        <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {lawyer.experience} years experience • {lawyer.cases} cases
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {lawyer.rating}
          </span>
          <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            ({lawyer.reviews})
          </span>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
          lawyer.isOnline 
            ? 'bg-green-500/20 text-green-300'
            : 'bg-gray-500/20 text-gray-300'
        }`}>
          {lawyer.isOnline ? '🟢 Online' : '⚪ Offline'}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-5">
        {lawyer.expertise.slice(0, 3).map((exp, i) => (
          <span key={i} className={`text-xs px-3 py-1.5 rounded-lg font-semibold backdrop-blur-sm ${
            isDark 
              ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 text-blue-100 border border-blue-600/40 hover:border-blue-500/60'
              : 'bg-gradient-to-r from-blue-100/60 to-purple-100/60 text-blue-800 border border-blue-300/50 hover:border-blue-400'
          } transition-all duration-200`}>
            {exp}
          </span>
        ))}
      </div>
      
      <div className={`grid grid-cols-2 gap-3 mb-5 pb-5 border-b ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
        <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Consultation Fee</p>
          <p className={`font-bold text-lg ${isDark ? 'text-green-400' : 'text-green-600'}`}>₹{lawyer.consultationFee}</p>
        </div>
        <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Response Time</p>
          <p className={`font-bold text-lg text-blue-500`}>{lawyer.responseTime}</p>
        </div>
      </div>

      <div className={`grid grid-cols-2 gap-3 mb-5 pb-5 border-b ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
        <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Success Rate</p>
          <p className={`font-bold text-lg text-purple-500`}>{lawyer.successRate}%</p>
        </div>
        <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Bar Council</p>
          <p className={`font-bold text-xs text-orange-500`}>{lawyer.barCouncil.split(' ')[0]}</p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => { e.stopPropagation(); onConnect(lawyer, 'chat'); }}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-semibold text-sm shadow-lg"
        >
          <MessageCircle className="w-4 h-4" />
          Chat
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => { e.stopPropagation(); onConnect(lawyer, 'call'); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all font-semibold text-sm shadow-lg ${
            lawyer.isOnline
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
              : 'bg-gray-400/50 text-gray-600 cursor-not-allowed opacity-60'
          }`}
          disabled={!lawyer.isOnline}
        >
          <Phone className="w-4 h-4" />
          Call
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => { e.stopPropagation(); onConnect(lawyer, 'schedule'); }}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-semibold text-sm shadow-lg"
        >
          <Calendar className="w-4 h-4" />
          Book
        </motion.button>
      </div>
    </div>
  </motion.div>
);

const LegalBodyCard = ({ legalBody, onSelect, isDark }) => {
  const typeEmojis = {
    supreme_court: '⚖️',
    court: '🏛️',
    bar_council: '📋',
    legal_aid: '🤝'
  };
  
  const typeColors = {
    supreme_court: 'from-purple-600 to-indigo-700',
    court: 'from-blue-600 to-cyan-700',
    bar_council: 'from-green-600 to-emerald-700',
    legal_aid: 'from-red-600 to-pink-700'
  };
  
  const typeLabels = {
    supreme_court: 'Supreme Court',
    court: 'High Court',
    bar_council: 'Bar Council',
    legal_aid: 'Legal Services'
  };
  
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.03 }}
      onClick={() => onSelect(legalBody)}
      className={`group rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer ${
        isDark 
          ? 'professional-card-dark'
          : 'professional-card-light'
      }`}
    >
      <div className={`h-36 bg-gradient-to-br ${typeColors[legalBody.type] || 'from-gray-600 to-gray-700'} p-6 flex items-start justify-between relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full mix-blend-multiply filter blur-2xl -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full mix-blend-multiply filter blur-xl -ml-4 -mb-4 opacity-30"></div>
        </div>
        
        <div className="relative z-10">
          <p className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-gray-100' : 'text-white/80'}`}>
            {typeLabels[legalBody.type]}
          </p>
          <h3 className="text-2xl font-bold text-white mt-2 line-clamp-2">
            {legalBody.name}
          </h3>
        </div>
        <div className={`professional-section-circular ${isDark ? 'professional-section-circular-dark' : 'professional-section-circular-light'}`}>
          <span className="text-3xl drop-shadow-lg">{typeEmojis[legalBody.type] || '🏢'}</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {legalBody.jurisdiction || 'All India'}
            </span>
          </div>
          <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-full">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className={`text-sm font-bold ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>{legalBody.rating}</span>
          </div>
        </div>
        
        <p className={`text-sm mb-5 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {legalBody.description}
        </p>

        <div className={`grid grid-cols-3 gap-3 mb-5 pb-5 border-b ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
          <div className={`p-3 rounded-lg text-center ${isDark ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Hours</p>
            <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {legalBody.workingHours.split(' - ')[0]}
            </p>
          </div>
          <div className={`p-3 rounded-lg text-center ${isDark ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Est.</p>
            <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {legalBody.established}
            </p>
          </div>
          <div className={`p-3 rounded-lg text-center ${isDark ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Status</p>
            <p className={`text-sm font-bold ${legalBody.isActive ? 'text-green-500' : 'text-red-500'}`}>
              {legalBody.isActive ? '🟢 Open' : '🔴 Closed'}
            </p>
          </div>
        </div>
        
        <div className="space-y-2 mb-5">
          <p className={`text-xs font-bold uppercase ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Services</p>
          {legalBody.services?.slice(0, 3).map((service, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {service}
              </span>
            </div>
          ))}
        </div>
        
        <div className={`p-3 rounded-lg mb-5 ${isDark ? 'bg-gray-700/50 border border-gray-600/50' : 'bg-blue-50 border border-blue-200'}`}>
          <p className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>📞 Contact</p>
          <p className={`text-sm font-bold mt-1 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>{legalBody.phone}</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold text-sm transition-all shadow-lg"
        >
          View Details
        </motion.button>
      </div>
    </motion.div>
  );
};

// Map state handler to expose map instance to parent
const MapStateHandler = ({ onMapReady }) => {
  const map = useMap();
  
  useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);
  
  return null;
};

const VirtualBakil = () => {
  const { isDark } = useTheme();
  const [userLocation, setUserLocation] = useState([28.6139, 77.2090]);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [selectedLegalBody, setSelectedLegalBody] = useState(null);
  const [showLawyers, setShowLawyers] = useState(true);
  const [showLegalBodies, setShowLegalBodies] = useState(true);
  const [locationGranted, setLocationGranted] = useState(false);
  const mapRef = useRef(null);
  
  // Private section state
  const [chatOpen, setChatOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [videoCallOpen, setVideoCallOpen] = useState(false);
  const [schedulingOpen, setSchedulingOpen] = useState(false);
  const [activeCallType, setActiveCallType] = useState('call');
  
  const handleMapReady = useCallback((map) => {
    mapRef.current = map;
  }, []);
  
  // Request location permission
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setLocationGranted(true);
        },
        () => {
          setLocationGranted(false);
        }
      );
    }
  }, []);
  
  // Handle connection requests
  const handleConnect = useCallback((lawyer, connectionType) => {
    if (connectionType === 'chat') {
      setChatOpen(true);
    } else if (connectionType === 'call') {
      setActiveCallType('call');
      setCallOpen(true);
    } else if (connectionType === 'video') {
      setActiveCallType('video');
      setVideoCallOpen(true);
    } else if (connectionType === 'schedule') {
      setSchedulingOpen(true);
    }
  }, []);
  
  return (
    <div className={`w-full h-screen flex relative overflow-hidden transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-gray-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 to-blue-50'}`}>
      {/* Private Section Modals */}
      <PrivateChatModal
        lawyer={selectedLawyer}
        isOpen={chatOpen && !!selectedLawyer}
        onClose={() => setChatOpen(false)}
        isDark={isDark}
      />
      
      <CallModal
        lawyer={selectedLawyer}
        isOpen={callOpen && !!selectedLawyer}
        onClose={() => setCallOpen(false)}
        isDark={isDark}
        callType={activeCallType}
      />
      
      <SchedulingModal
        lawyer={selectedLawyer}
        isOpen={schedulingOpen && !!selectedLawyer}
        onClose={() => setSchedulingOpen(false)}
        isDark={isDark}
        locationGranted={locationGranted}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {locationGranted && (
          <div className="relative w-full h-full">
            <MapContainer center={userLocation} zoom={12} className={`w-full h-full z-0 ${isDark ? 'dark' : 'light'}`} zoomControl={false}>
              <TileLayer
                url={isDark 
                  ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                }
                attribution='&copy; OpenStreetMap contributors &copy; CARTO'
              />
              <MapStateHandler onMapReady={handleMapReady} />
            
            {/* User Location */}
            {locationGranted && <UserLocationMarker position={userLocation} isDark={isDark} />}

            {/* Lawyers */}
            {showLawyers && PROFESSIONAL_LAWYERS.map((lawyer) => (
              <Marker
                key={lawyer.id}
                position={[lawyer.location.lat, lawyer.location.lng]}
                icon={createLawyerMarker(lawyer.isOnline, lawyer.isInCall, selectedLawyer?.id === lawyer.id)}
                eventHandlers={{
                  click: () => {
                    setSelectedLawyer(lawyer);
                    setTimeout(() => {
                      const mapBounds = document.querySelector('.leaflet-container')?.getBoundingClientRect();
                      const popupElement = document.querySelector('.leaflet-popup');
                      if (mapBounds && popupElement) {
                        const popupRect = popupElement.getBoundingClientRect();
                        if (popupRect.right > mapBounds.right - 20 || popupRect.left < mapBounds.left + 20) {
                          const map = document.querySelector('.leaflet-container').__vue__?.map || 
                                      (window.map || {});
                        }
                      }
                    }, 100);
                  }
                }}
              >
                <Popup className="lawyer-popup">
                  <div className={`p-5 rounded-2xl min-w-xs backdrop-blur-lg ${isDark ? 'bg-gray-800/90 text-white border border-gray-700/50' : 'bg-white/95 text-gray-900 border border-gray-200/50'}`}>
                    <div className="flex items-start gap-3 mb-3">
                      <img src={lawyer.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(lawyer.name)}&background=667eea&color=fff&size=40&bold=true`} alt={lawyer.name} className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{lawyer.name}</h4>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{lawyer.specialization}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-semibold">{lawyer.rating}</span>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${lawyer.isOnline ? 'bg-green-500/20 text-green-600' : 'bg-gray-500/20 text-gray-600'}`}>
                        {lawyer.isOnline ? '🟢 Online' : '⚪ Offline'}
                      </span>
                    </div>
                    
                    <p className={`text-xs mb-3 pb-3 border-b ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'}`}>
                      {lawyer.experience}y exp • {lawyer.cases} cases • {lawyer.successRate}% success
                    </p>

                    <div className="flex gap-2">
                      {lawyer.isOnline ? (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedLawyer(lawyer);
                              handleConnect(lawyer, 'chat');
                            }}
                            className="flex-1 flex items-center justify-center gap-1 text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> Chat
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedLawyer(lawyer);
                              handleConnect(lawyer, 'call');
                            }}
                            className="flex-1 flex items-center justify-center gap-1 text-xs bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
                          >
                            <Phone className="w-3.5 h-3.5" /> Call
                          </motion.button>
                        </>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedLawyer(lawyer);
                            handleConnect(lawyer, 'chat');
                          }}
                          className="w-full flex items-center justify-center gap-1 text-xs bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> Leave Message
                        </motion.button>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedLawyer(lawyer);
                        handleConnect(lawyer, 'schedule');
                      }}
                      className={`w-full mt-2 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${isDark ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
                    >
                      📅 Schedule
                    </motion.button>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            {/* Legal Bodies */}
            {showLegalBodies && LEGAL_BODIES_INDIA.map((body) => (
              <Marker
                key={body.id}
                position={[body.location.lat, body.location.lng]}
                icon={createLegalBodyMarker(body.type, selectedLegalBody?.id === body.id)}
                eventHandlers={{
                  click: () => setSelectedLegalBody(body)
                }}
              >
                <Popup className="legal-body-popup">
                  <div className={`p-5 rounded-2xl min-w-sm backdrop-blur-lg ${isDark ? 'bg-gray-800/90 text-white border border-gray-700/50' : 'bg-white/95 text-gray-900 border border-gray-200/50'}`}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`professional-section-circular ${isDark ? 'professional-section-circular-dark' : 'professional-section-circular-light'}`} style={{width: '50px', height: '50px'}}>
                        <span className="text-xl">{body.type === 'supreme_court' ? '⚖️' : body.type === 'court' ? '🏛️' : body.type === 'bar_council' ? '📋' : '🤝'}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{body.name}</h4>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{body.jurisdiction}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-semibold">{body.rating}</span>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${body.isActive ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'}`}>
                        {body.isActive ? '🟢 Open' : '🔴 Closed'}
                      </span>
                    </div>

                    <p className={`text-xs mb-3 pb-3 border-b ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'}`}>
                      {body.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className={`p-2 rounded text-center ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Hours</p>
                        <p className="text-xs font-bold">{body.workingHours.split(' - ')[0]}</p>
                      </div>
                      <div className={`p-2 rounded text-center ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Est.</p>
                        <p className="text-xs font-bold">{body.established}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={`mailto:${body.email || 'contact@court.nic.in'}`}
                        className={`flex-1 flex items-center justify-center gap-1 text-xs font-medium px-3 py-2 rounded-lg transition-all duration-200 text-decoration-none ${isDark ? 'bg-gradient-to-r from-blue-600/75 to-blue-700/75 text-blue-50 hover:from-blue-500/85 hover:to-blue-600/85' : 'bg-gradient-to-r from-blue-400/85 to-blue-500/85 text-white hover:from-blue-300/90 hover:to-blue-400/90'}`}
                      >
                        <Mail className="w-3.5 h-3.5" /> Email
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={`https://maps.google.com/?q=${body.location.lat},${body.location.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-1 flex items-center justify-center gap-1 text-xs font-medium px-3 py-2 rounded-lg transition-all duration-200 text-decoration-none ${isDark ? 'bg-gradient-to-r from-emerald-600/75 to-emerald-700/75 text-emerald-50 hover:from-emerald-500/85 hover:to-emerald-600/85' : 'bg-gradient-to-r from-emerald-400/85 to-emerald-500/85 text-white hover:from-emerald-300/90 hover:to-emerald-400/90'}`}
                      >
                        <MapPin className="w-3.5 h-3.5" /> Directions
                      </motion.a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
            </MapContainer>
          </div>
        )}
      
        {!locationGranted && (
          <div className="w-full flex items-center justify-center">
            <div className={`text-center p-8 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <Lock className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h2 className="text-2xl font-bold mb-2">Location Access Required</h2>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6 text-lg`}>
                Please enable location access to use this feature
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      setUserLocation([position.coords.latitude, position.coords.longitude]);
                      setLocationGranted(true);
                    },
                    () => alert('Location access denied')
                  );
                }}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
              >
                Enable Location
              </motion.button>
            </div>
          </div>
        )}

      </div>
      
      {/* Professional Left Sidebar - All Controls Combined */}
      <div className="fixed left-4 top-1/2 z-[500] -translate-y-1/2 flex flex-col gap-2.5">
        {/* Zoom In */}
        <motion.button
          whileHover={{ scale: 1.1, x: 3 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => {
            if (mapRef.current) mapRef.current.zoomIn();
          }}
          className={`w-11 h-11 rounded-lg flex items-center justify-center backdrop-blur-sm transition-all shadow-md border ${
            isDark 
              ? 'bg-gradient-to-br from-slate-700/70 to-slate-800/70 border-slate-600/40 hover:from-slate-600/80 hover:to-slate-700/80 text-slate-200 hover:text-white' 
              : 'bg-gradient-to-br from-gray-100/80 to-gray-200/80 border-gray-300/40 hover:from-gray-200/90 hover:to-gray-300/90 text-gray-700 hover:text-gray-900'
          }`}
          title="Zoom In"
        >
          <Plus size={18} />
        </motion.button>

        {/* Zoom Out */}
        <motion.button
          whileHover={{ scale: 1.1, x: 3 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => {
            if (mapRef.current) mapRef.current.zoomOut();
          }}
          className={`w-11 h-11 rounded-lg flex items-center justify-center backdrop-blur-sm transition-all shadow-md border ${
            isDark 
              ? 'bg-gradient-to-br from-slate-700/70 to-slate-800/70 border-slate-600/40 hover:from-slate-600/80 hover:to-slate-700/80 text-slate-200 hover:text-white' 
              : 'bg-gradient-to-br from-gray-100/80 to-gray-200/80 border-gray-300/40 hover:from-gray-200/90 hover:to-gray-300/90 text-gray-700 hover:text-gray-900'
          }`}
          title="Zoom Out"
        >
          <Minus size={18} />
        </motion.button>

        {/* Locate Me */}
        <motion.button
          whileHover={{ scale: 1.1, x: 3 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => {
            if (mapRef.current && userLocation) {
              mapRef.current.flyTo([userLocation[0], userLocation[1]], 15, { duration: 1 });
            }
          }}
          className={`w-11 h-11 rounded-lg flex items-center justify-center backdrop-blur-sm transition-all shadow-md border ${
            isDark 
              ? 'bg-gradient-to-br from-slate-700/70 to-slate-800/70 border-slate-600/40 hover:from-slate-600/80 hover:to-slate-700/80 text-slate-300 hover:text-slate-100' 
              : 'bg-gradient-to-br from-gray-100/80 to-gray-200/80 border-gray-300/40 hover:from-gray-200/90 hover:to-gray-300/90 text-gray-600 hover:text-gray-800'
          }`}
          title="Locate Me"
        >
          <Crosshair size={18} />
        </motion.button>

        {/* Divider */}
        <div className={`w-8 h-px mx-auto ${isDark ? 'bg-slate-600/40' : 'bg-gray-300/40'}`}></div>

        {/* Show/Hide Advocates */}
        <motion.button
          whileHover={{ scale: 1.1, x: 3 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setShowLawyers(!showLawyers)}
          className={`w-11 h-11 rounded-lg flex items-center justify-center backdrop-blur-sm transition-all shadow-md border-2 ${
            showLawyers
              ? isDark
                ? 'bg-gradient-to-br from-cyan-600/80 to-cyan-700/80 border-cyan-500/50 text-white shadow-lg shadow-cyan-500/25'
                : 'bg-gradient-to-br from-cyan-500/80 to-cyan-600/80 border-cyan-400/50 text-white shadow-lg shadow-cyan-400/25'
              : isDark
              ? 'bg-slate-700/60 border-slate-600/40 text-slate-400 hover:bg-slate-700/70'
              : 'bg-gray-200/60 border-gray-300/40 text-gray-600 hover:bg-gray-200/70'
          }`}
          title={showLawyers ? 'Hide Advocates' : 'Show Advocates'}
        >
          <Users size={18} />
        </motion.button>

        {/* Show/Hide Courts */}
        <motion.button
          whileHover={{ scale: 1.1, x: 3 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setShowLegalBodies(!showLegalBodies)}
          className={`w-11 h-11 rounded-lg flex items-center justify-center backdrop-blur-sm transition-all shadow-md border-2 ${
            showLegalBodies
              ? isDark
                ? 'bg-gradient-to-br from-amber-600/80 to-amber-700/80 border-amber-500/50 text-white shadow-lg shadow-amber-500/25'
                : 'bg-gradient-to-br from-amber-500/80 to-amber-600/80 border-amber-400/50 text-white shadow-lg shadow-amber-400/25'
              : isDark
              ? 'bg-slate-700/60 border-slate-600/40 text-slate-400 hover:bg-slate-700/70'
              : 'bg-gray-200/60 border-gray-300/40 text-gray-600 hover:bg-gray-200/70'
          }`}
          title={showLegalBodies ? 'Hide Courts' : 'Show Courts'}
        >
          <Building2 size={18} />
        </motion.button>
      </div>
    </div>
  );
};

export default VirtualBakil;
