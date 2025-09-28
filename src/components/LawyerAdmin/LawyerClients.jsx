import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit3, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  FileText, 
  TrendingUp, 
  Activity, 
  Star, 
  Clock, 
  Shield, 
  User, 
  Users, 
  Briefcase,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Share2,
  MessageCircle,
  History,
  IndianRupee,
  Award,
  Target,
  Zap,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  UserCheck,
  UserX,
  Sparkles,
  Crown,
  Heart,
  ThumbsUp,
  Compass,
  Layers,
  Building2,
  GraduationCap,
  Flame,
  TrendingDown,
  X,
  ArrowUpDown
} from 'lucide-react';
import Avatar from '../common/Avatar';
import { apiServices } from '../../api/apiService';

/**
 * LawyerClients Component - Premium Professional Design
 * 
 * Features:
 * - Compact, zoomed-out view for maximum information density
 * - Live search with instant filtering
 * - Advanced sorting with beautiful icons
 * - Professional premium cards
 * - Smooth animations and engaging UI
 * - Clean, structured layout
 * - Mobile-responsive design
 */

// Enhanced sample client data - Updated for Indian context
const sampleClients = [
  {
    id: 1,
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 98765 43210",
    avatar: null,
    status: "active",
    premium: true,
    location: "Mumbai, Maharashtra",
    caseType: "Corporate Law",
    joinDate: "2024-01-15",
    totalCases: 8,
    activeCases: 3,
    rating: 4.9,
    lastActivity: "2h ago",
    totalRevenue: 1875000, // ₹18.75 Lakhs
    upcomingAppointment: "Tomorrow 2:00 PM",
    priority: "high",
    company: "Reliance Industries Ltd.",
    satisfaction: 98
  },
  {
    id: 2,
    name: "Arjun Patel",
    email: "arjun.patel@email.com",
    phone: "+91 87654 32109",
    avatar: null,
    status: "active",
    premium: false,
    location: "Bangalore, Karnataka",
    caseType: "Criminal Defense",
    joinDate: "2024-02-20",
    totalCases: 5,
    activeCases: 2,
    rating: 4.7,
    lastActivity: "1d ago",
    totalRevenue: 1125000, // ₹11.25 Lakhs
    upcomingAppointment: "Monday 10:00 AM",
    priority: "medium",
    company: null,
    satisfaction: 92
  },
  {
    id: 3,
    name: "Sneha Gupta",
    email: "sneha.gupta@email.com",
    phone: "+91 76543 21098",
    avatar: null,
    status: "inactive",
    premium: true,
    location: "Delhi, NCR",
    caseType: "Family Law",
    joinDate: "2023-11-10",
    totalCases: 12,
    activeCases: 0,
    rating: 4.8,
    lastActivity: "1w ago",
    totalRevenue: 2250000, // ₹22.5 Lakhs
    upcomingAppointment: null,
    priority: "low",
    company: null,
    satisfaction: 95
  },
  {
    id: 4,
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 65432 10987",
    avatar: null,
    status: "active",
    premium: false,
    location: "Chennai, Tamil Nadu",
    caseType: "Personal Injury",
    joinDate: "2024-03-05",
    totalCases: 3,
    activeCases: 2,
    rating: 4.6,
    lastActivity: "3h ago",
    totalRevenue: 600000, // ₹6 Lakhs
    upcomingAppointment: "Friday 3:30 PM",
    priority: "high",
    company: null,
    satisfaction: 88
  },
  {
    id: 5,
    name: "Kavya Reddy",
    email: "kavya.reddy@email.com",
    phone: "+91 54321 09876",
    avatar: null,
    status: "active",
    premium: true,
    location: "Hyderabad, Telangana",
    caseType: "IP Law",
    joinDate: "2024-01-30",
    totalCases: 6,
    activeCases: 4,
    rating: 4.9,
    lastActivity: "30m ago",
    totalRevenue: 3375000, // ₹33.75 Lakhs
    upcomingAppointment: "Today 4:00 PM",
    priority: "high",
    company: "Infosys Technologies",
    satisfaction: 99
  },
  {
    id: 6,
    name: "Amit Singh",
    email: "amit.singh@email.com",
    phone: "+91 43210 98765",
    avatar: null,
    status: "pending",
    premium: false,
    location: "Pune, Maharashtra",
    caseType: "Real Estate",
    joinDate: "2024-12-15",
    totalCases: 1,
    activeCases: 1,
    rating: null,
    lastActivity: "5h ago",
    totalRevenue: 150000, // ₹1.5 Lakhs
    upcomingAppointment: "Next week",
    priority: "medium",
    company: "Singh Properties",
    satisfaction: null
  }
];

const LawyerClients = ({ darkMode, userData }) => {
  const [clients, setClients] = useState(sampleClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showActivityModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showActivityModal]);

  // Live search and filtering
  const filteredClients = clients.filter(client => {
    const matchesSearch = searchQuery === '' || 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.caseType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery);
    
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'rating' || sortBy === 'totalRevenue' || sortBy === 'totalCases') {
      aValue = aValue || 0;
      bValue = bValue || 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Statistics calculations
  const stats = {
    totalClients: clients.length,
    activeClients: clients.filter(c => c.status === 'active').length,
    premiumClients: clients.filter(c => c.premium).length,
    totalRevenue: clients.reduce((sum, c) => sum + c.totalRevenue, 0),
    avgRating: clients.filter(c => c.rating).reduce((sum, c, _, arr) => sum + c.rating / arr.length, 0),
    avgSatisfaction: clients.filter(c => c.satisfaction).reduce((sum, c, _, arr) => sum + c.satisfaction / arr.length, 0)
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return darkMode ? 'text-red-400' : 'text-red-600';
      case 'medium': return darkMode ? 'text-yellow-400' : 'text-yellow-600';
      case 'low': return darkMode ? 'text-green-400' : 'text-green-600';
      default: return darkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <UserCheck size={14} className="text-green-500" />;
      case 'inactive': return <UserX size={14} className="text-gray-500" />;
      case 'pending': return <Clock size={14} className="text-yellow-500" />;
      default: return <User size={14} className="text-gray-500" />;
    }
  };

  // Premium Statistics Cards
  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
    <div className={`${
      darkMode 
        ? 'bg-gray-800/60 border-gray-700/50 hover:bg-gray-800/80' 
        : 'bg-white/80 border-gray-200/50 hover:bg-white/95'
    } rounded-xl p-4 border backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color} group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={18} className="text-white" />
          </div>
          <div>
            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{title}</h3>
            <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
          </div>
        </div>
        {trend && (
          <div className="flex items-center">
            {trend > 0 ? <TrendingUp size={14} className="text-green-500" /> : <TrendingDown size={14} className="text-red-500" />}
            <span className={`text-xs ml-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(trend)}%
            </span>
          </div>
        )}
      </div>
      {subtitle && (
        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{subtitle}</p>
      )}
    </div>
  );

  // Enhanced Client Card Component
  const ClientCard = ({ client }) => (
    <div className={`${
      darkMode 
        ? 'bg-gray-800/70 border-gray-700/50 hover:bg-gray-800/90' 
        : 'bg-white/90 border-gray-200/60 hover:bg-white'
    } rounded-xl p-5 border backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.03] group relative overflow-hidden`}>
      
      {/* Premium Badge */}
      {client.premium && (
        <div className="absolute top-2 right-2">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-1.5">
            <Crown size={12} className="text-white" />
          </div>
        </div>
      )}

      {/* Priority Indicator */}
      <div className={`absolute top-2 left-2 w-2 h-2 rounded-full ${
        client.priority === 'high' ? 'bg-red-500' :
        client.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
      } animate-pulse`}></div>

      <div className="flex items-start space-x-3 mt-2">
        {/* Avatar */}
        <div className="relative">
          <Avatar
            src={client.avatar}
            name={client.name}
            size={44}
            className="rounded-xl shadow-md"
          />
          <div className="absolute -bottom-1 -right-1">
            {getStatusIcon(client.status)}
          </div>
        </div>

        {/* Client Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>
              {client.name}
            </h3>
            {client.rating && (
              <div className="flex items-center space-x-1">
                <Star size={12} className="text-yellow-500 fill-current" />
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {client.rating}
                </span>
              </div>
            )}
          </div>
          
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} truncate mt-0.5`}>
            {client.email}
          </p>
          
          <div className="flex items-center space-x-3 mt-1">
            <span className={`text-xs px-2 py-1 rounded-full ${
              client.status === 'active' ? 'bg-green-100 text-green-700' :
              client.status === 'inactive' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {client.caseType}
            </span>
            <div className="flex items-center space-x-1">
              <MapPin size={10} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
              <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} truncate`}>
                {client.location}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200/30">
        <div className="flex items-center space-x-5 text-xs">
          <div className="flex items-center space-x-2">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
              <Briefcase size={12} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
            </div>
            <div>
              <span className={`font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{client.activeCases}</span>
              <span className={`ml-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>active</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${darkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
              <IndianRupee size={12} className={darkMode ? 'text-green-400' : 'text-green-600'} />
            </div>
            <span className={`font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              {(client.totalRevenue / 100000).toFixed(1)}L
            </span>
          </div>
          {client.satisfaction && (
            <div className="flex items-center space-x-2">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${darkMode ? 'bg-red-500/20' : 'bg-red-100'}`}>
                <Heart size={12} className={darkMode ? 'text-red-400' : 'text-red-600'} />
              </div>
              <span className={`font-semibold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{client.satisfaction}%</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button 
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              darkMode ? 'bg-gray-700/50 hover:bg-blue-600 text-gray-400 hover:text-white' : 'bg-gray-100 hover:bg-blue-500 text-gray-600 hover:text-white'
            } transition-all duration-200 hover:scale-110`}
            onClick={() => window.open(`tel:${client.phone}`)}
          >
            <Phone size={14} />
          </button>
          <button 
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              darkMode ? 'bg-gray-700/50 hover:bg-green-600 text-gray-400 hover:text-white' : 'bg-gray-100 hover:bg-green-500 text-gray-600 hover:text-white'
            } transition-all duration-200 hover:scale-110`}
            onClick={() => window.open(`mailto:${client.email}`)}
          >
            <Mail size={14} />
          </button>
          <button 
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              darkMode ? 'bg-gray-700/50 hover:bg-purple-600 text-gray-400 hover:text-white' : 'bg-gray-100 hover:bg-purple-500 text-gray-600 hover:text-white'
            } transition-all duration-200 hover:scale-110`}
            onClick={() => {
              setSelectedClient(client);
              setShowActivityModal(true);
            }}
          >
            <Activity size={14} />
          </button>
        </div>
      </div>

      {/* Last Activity & Next Appointment */}
      <div className="mt-3 pt-3 border-t border-gray-200/30">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <div className={`w-5 h-5 rounded flex items-center justify-center ${darkMode ? 'bg-gray-600/30' : 'bg-gray-200/70'}`}>
              <Clock size={10} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
            </div>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              Last: {client.lastActivity}
            </span>
          </div>
          {client.upcomingAppointment && (
            <div className="flex items-center space-x-2">
              <div className={`w-5 h-5 rounded flex items-center justify-center ${darkMode ? 'bg-purple-600/20' : 'bg-purple-100'}`}>
                <Calendar size={10} className={darkMode ? 'text-purple-400' : 'text-purple-600'} />
              </div>
              <span className={`${darkMode ? 'text-purple-400' : 'text-purple-600'} truncate max-w-24 font-medium`}>
                {client.upcomingAppointment}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`px-6 py-4 space-y-4 ${darkMode ? 'text-white' : 'text-gray-900'} min-h-screen max-w-7xl mx-auto`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Users size={16} className="text-white" />
          </div>
          <div>
            <h1 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Client Management
            </h1>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your clients efficiently
            </p>
          </div>
        </div>
        <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
          <Plus size={14} />
          <span>Add Client</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <StatCard
          icon={Users}
          title="Total Clients"
          value={stats.totalClients}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          trend={12}
        />
        <StatCard
          icon={UserCheck}
          title="Active"
          value={stats.activeClients}
          color="bg-gradient-to-r from-green-500 to-green-600"
          trend={8}
        />
        <StatCard
          icon={Crown}
          title="Premium"
          value={stats.premiumClients}
          color="bg-gradient-to-r from-yellow-500 to-orange-500"
          trend={5}
        />
        <StatCard
          icon={IndianRupee}
          title="Revenue"
          value={`₹${(stats.totalRevenue / 100000).toFixed(1)}L`}
          color="bg-gradient-to-r from-emerald-500 to-teal-600"
          trend={15}
        />
        <StatCard
          icon={Star}
          title="Avg Rating"
          value={stats.avgRating.toFixed(1)}
          color="bg-gradient-to-r from-amber-500 to-yellow-600"
          trend={3}
        />
        <StatCard
          icon={Heart}
          title="Satisfaction"
          value={`${stats.avgSatisfaction.toFixed(0)}%`}
          color="bg-gradient-to-r from-rose-500 to-pink-600"
          trend={7}
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search size={16} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Search clients by name, email, case type, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm ${
              darkMode 
                ? 'bg-gray-800/60 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500' 
                : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200`}
          />
        </div>

        {/* Filters Row */}
        <div className="flex items-center space-x-3">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`px-3 py-2 rounded-lg border text-sm ${
              darkMode 
                ? 'bg-gray-800/60 border-gray-700 text-white' 
                : 'bg-white/80 border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-3 py-2 rounded-lg border text-sm ${
              darkMode 
                ? 'bg-gray-800/60 border-gray-700 text-white' 
                : 'bg-white/80 border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          >
            <option value="name">Name</option>
            <option value="rating">Rating</option>
            <option value="totalRevenue">Revenue</option>
            <option value="totalCases">Cases</option>
            <option value="lastActivity">Activity</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className={`p-2 rounded-lg border ${
              darkMode 
                ? 'bg-gray-800/60 border-gray-700 text-white hover:bg-gray-700' 
                : 'bg-white/80 border-gray-300 text-gray-900 hover:bg-gray-50'
            } transition-all duration-200`}
          >
            {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
          </button>

          {/* View Mode Toggle */}
          <div className="flex rounded-lg border overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${
                viewMode === 'grid'
                  ? 'bg-blue-500 text-white'
                  : darkMode ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-600 hover:text-gray-900'
              } transition-all duration-200`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${
                viewMode === 'list'
                  ? 'bg-blue-500 text-white'
                  : darkMode ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-600 hover:text-gray-900'
              } transition-all duration-200`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Showing {filteredClients.length} of {clients.length} clients
          {searchQuery && ` for "${searchQuery}"`}
        </p>
        <div className="flex items-center space-x-2 text-xs">
          <Sparkles size={12} className="text-yellow-500" />
          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Live search active</span>
        </div>
      </div>

      {/* Clients Grid */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          : 'grid-cols-1'
      }`}>
        {filteredClients.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${
            darkMode ? 'bg-gray-800' : 'bg-gray-100'
          } flex items-center justify-center`}>
            <Users size={32} className={darkMode ? 'text-gray-600' : 'text-gray-400'} />
          </div>
          <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            No clients found
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {searchQuery ? 'Try adjusting your search terms' : 'Start by adding your first client'}
          </p>
        </div>
      )}

      {/* Activity Modal */}
      {showActivityModal && selectedClient && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowActivityModal(false);
            }
          }}
        >
          <div className={`max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-xl mx-4 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-2xl`}>
            <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={selectedClient.avatar}
                    name={selectedClient.name}
                    size={48}
                    className="rounded-xl"
                  />
                  <div>
                    <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedClient.name}
                    </h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Recent Activities & Timeline
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowActivityModal(false)}
                  className={`p-2 rounded-lg ${
                    darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                  } transition-colors duration-200`}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedClient.totalCases}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Total Cases
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedClient.activeCases}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Active Cases
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      ₹{(selectedClient.totalRevenue / 100000).toFixed(1)}L
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Revenue
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedClient.rating || 'N/A'}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Rating
                    </div>
                  </div>
                </div>

                {/* Sample Activities */}
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center space-x-2`}>
                    <Activity size={18} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                    <span>Recent Activities</span>
                  </h3>
                  <div className="space-y-3">
                    {/* Appointment Activity */}
                    <div className={`flex items-center space-x-4 p-4 rounded-xl ${
                      darkMode ? 'bg-gray-700/60 border-gray-600/30' : 'bg-gray-50 border-gray-200/50'
                    } border hover:shadow-md transition-all duration-200`}>
                      <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center shadow-md">
                        <Calendar size={16} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Consultation completed
                        </div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          2 hours ago
                        </div>
                      </div>
                      <div className="px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                        Completed
                      </div>
                    </div>

                    {/* Document Activity */}
                    <div className={`flex items-center space-x-4 p-4 rounded-xl ${
                      darkMode ? 'bg-gray-700/60 border-gray-600/30' : 'bg-gray-50 border-gray-200/50'
                    } border hover:shadow-md transition-all duration-200`}>
                      <div className="w-10 h-10 rounded-lg bg-yellow-500 flex items-center justify-center shadow-md">
                        <FileText size={16} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Contract review pending
                        </div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          1 day ago
                        </div>
                      </div>
                      <div className="px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">
                        Pending
                      </div>
                    </div>

                    {/* Payment Activity */}
                    <div className={`flex items-center space-x-4 p-4 rounded-xl ${
                      darkMode ? 'bg-gray-700/60 border-gray-600/30' : 'bg-gray-50 border-gray-200/50'
                    } border hover:shadow-md transition-all duration-200`}>
                      <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center shadow-md">
                        <IndianRupee size={16} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Invoice payment received
                        </div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          3 days ago
                        </div>
                      </div>
                      <div className="px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                        Completed
                      </div>
                    </div>

                    {/* Call Activity */}
                    <div className={`flex items-center space-x-4 p-4 rounded-xl ${
                      darkMode ? 'bg-gray-700/60 border-gray-600/30' : 'bg-gray-50 border-gray-200/50'
                    } border hover:shadow-md transition-all duration-200`}>
                      <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center shadow-md">
                        <Phone size={16} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Phone consultation
                        </div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          1 week ago
                        </div>
                      </div>
                      <div className="px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                        Completed
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LawyerClients;