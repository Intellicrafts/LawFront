import React, { useState, useEffect, useMemo } from 'react';
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
  X,
  Archive,
  Ban,
  Timer,
  Scale,
  Gavel,
  BookOpen,
  Settings,
  Send,
  DollarSign,
  Calendar as CalendarIcon,
  BarChart3,
  PieChart,
  TrendingDown,
  AlertTriangle,
  Bell,
  Bookmark,
  Tag,
  Globe,
  Lock,
  Unlock,
  Paperclip,
  Upload,
  FolderOpen,
  Files,
  Search as SearchIcon
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { casesAPI } from '../../api/apiService';

// Mock data for cases - replace with API call
const mockCases = [
  {
    id: 1,
    caseNumber: "CIV-2024-001",
    title: "Property Dispute Resolution",
    client: {
      name: "Rajesh Kumar",
      email: "rajesh.kumar@email.com",
      phone: "+91 98765 43210"
    },
    caseType: "Civil",
    status: "active",
    priority: "high",
    nextHearing: "2024-02-15",
    courtName: "Delhi High Court",
    judge: "Hon. Justice M.K. Sharma",
    filingDate: "2024-01-10",
    amount: 2500000,
    description: "Dispute regarding property inheritance and ownership rights between multiple parties.",
    documents: 12,
    lastActivity: "2024-02-01T10:30:00Z",
    progress: 65,
    category: "Property Law",
    opposing: "Sunita Devi & Others",
    lawyer: "Adv. Priya Sharma",
    tags: ["Property", "Inheritance", "Civil Court"],
    isStarred: true,
    isUrgent: false
  },
  {
    id: 2,
    caseNumber: "CRIM-2024-002",
    title: "Financial Fraud Investigation",
    client: {
      name: "Amit Enterprises Pvt Ltd",
      email: "legal@amitenterprises.com",
      phone: "+91 99887 66554"
    },
    caseType: "Criminal",
    status: "pending",
    priority: "critical",
    nextHearing: "2024-02-12",
    courtName: "Sessions Court",
    judge: "Hon. Justice R.K. Gupta",
    filingDate: "2024-01-20",
    amount: 5000000,
    description: "Investigation into alleged financial fraud and embezzlement of company funds.",
    documents: 25,
    lastActivity: "2024-02-02T14:45:00Z",
    progress: 30,
    category: "Criminal Law",
    opposing: "Ex-employees & Associates",
    lawyer: "Adv. Rohit Khanna",
    tags: ["Fraud", "Criminal", "Financial"],
    isStarred: false,
    isUrgent: true
  },
  {
    id: 3,
    caseNumber: "FAM-2024-003",
    title: "Child Custody & Maintenance",
    client: {
      name: "Kavita Sharma",
      email: "kavita.sharma@gmail.com",
      phone: "+91 97654 32108"
    },
    caseType: "Family",
    status: "completed",
    priority: "medium",
    nextHearing: null,
    courtName: "Family Court",
    judge: "Hon. Justice S.K. Verma",
    filingDate: "2023-11-15",
    amount: 500000,
    description: "Child custody dispute and maintenance claim following divorce proceedings.",
    documents: 18,
    lastActivity: "2024-01-30T16:20:00Z",
    progress: 100,
    category: "Family Law",
    opposing: "Vikash Sharma",
    lawyer: "Adv. Meera Singh",
    tags: ["Custody", "Family", "Maintenance"],
    isStarred: true,
    isUrgent: false
  },
  {
    id: 4,
    caseNumber: "LAB-2024-004",
    title: "Wrongful Termination Suit",
    client: {
      name: "Suresh Patel",
      email: "suresh.patel@techcorp.com",
      phone: "+91 96543 21087"
    },
    caseType: "Labor",
    status: "active",
    priority: "medium",
    nextHearing: "2024-02-18",
    courtName: "Labor Court",
    judge: "Hon. Justice A.K. Singh",
    filingDate: "2024-01-05",
    amount: 1200000,
    description: "Employment dispute regarding wrongful termination and unpaid compensation.",
    documents: 15,
    lastActivity: "2024-01-31T11:15:00Z",
    progress: 45,
    category: "Labor Law",
    opposing: "TechCorp Industries Ltd",
    lawyer: "Adv. Ankit Verma",
    tags: ["Employment", "Termination", "Labor"],
    isStarred: false,
    isUrgent: false
  },
  {
    id: 5,
    caseNumber: "TAX-2024-005",
    title: "Income Tax Appeal",
    client: {
      name: "Global Trading Co.",
      email: "accounts@globaltrading.in",
      phone: "+91 95432 10876"
    },
    caseType: "Tax",
    status: "on_hold",
    priority: "low",
    nextHearing: "2024-03-05",
    courtName: "Income Tax Appellate Tribunal",
    judge: "Hon. Member J.P. Agarwal",
    filingDate: "2023-12-20",
    amount: 3500000,
    description: "Appeal against income tax demand notice and penalty imposition.",
    documents: 30,
    lastActivity: "2024-01-28T09:45:00Z",
    progress: 20,
    category: "Tax Law",
    opposing: "Income Tax Department",
    lawyer: "Adv. Neha Agarwal",
    tags: ["Tax", "Appeal", "ITAT"],
    isStarred: false,
    isUrgent: false
  },
  {
    id: 6,
    caseNumber: "COM-2024-006",
    title: "Contract Breach & Damages",
    client: {
      name: "Metro Construction Ltd",
      email: "legal@metroconstruction.com",
      phone: "+91 94321 08765"
    },
    caseType: "Commercial",
    status: "active",
    priority: "high",
    nextHearing: "2024-02-20",
    courtName: "Commercial Court",
    judge: "Hon. Justice V.K. Malhotra",
    filingDate: "2024-01-12",
    amount: 8500000,
    description: "Breach of construction contract and claim for damages and compensation.",
    documents: 22,
    lastActivity: "2024-02-01T15:30:00Z",
    progress: 55,
    category: "Commercial Law",
    opposing: "Builder Associates Pvt Ltd",
    lawyer: "Adv. Ravi Kumar",
    tags: ["Contract", "Commercial", "Construction"],
    isStarred: true,
    isUrgent: false
  }
];

const LawyerCases = ({ darkMode, userData }) => {
  // Use darkMode prop if provided, otherwise use theme context
  const { isDark: themeIsDark } = useTheme();
  const isDark = darkMode !== undefined ? darkMode : themeIsDark;
  const [cases, setCases] = useState(mockCases);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('lastActivity');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cases from API
  const fetchCases = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        priority: selectedPriority !== 'all' ? selectedPriority : undefined,
        caseType: selectedType !== 'all' ? selectedType : undefined,
        search: searchQuery || undefined,
        sortBy,
        sortOrder
      };

      const response = await casesAPI.getCases(params);
      if (response?.success && response?.data) {
        setCases(response.data);
      } else {
        // Fallback to mock data if API doesn't return expected format
        setCases(mockCases);
      }
    } catch (err) {
      console.error('Error fetching cases:', err);
      setError('Failed to load cases. Showing sample data.');
      // Fallback to mock data on error
      setCases(mockCases);
    } finally {
      setIsLoading(false);
    }
  };

  // Load cases on component mount and when filters change
  useEffect(() => {
    fetchCases();
  }, [selectedStatus, selectedPriority, selectedType, sortBy, sortOrder]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length >= 0) { // Search even for empty string to reset
        fetchCases();
      }
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Filter and sort cases
  const filteredAndSortedCases = useMemo(() => {
    let filtered = cases.filter(caseItem => {
      const matchesSearch = 
        caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseItem.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseItem.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseItem.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = selectedStatus === 'all' || caseItem.status === selectedStatus;
      const matchesPriority = selectedPriority === 'all' || caseItem.priority === selectedPriority;
      const matchesType = selectedType === 'all' || caseItem.caseType === selectedType;

      return matchesSearch && matchesStatus && matchesPriority && matchesType;
    });

    // Sort cases
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch(sortBy) {
        case 'lastActivity':
          aValue = new Date(a.lastActivity);
          bValue = new Date(b.lastActivity);
          break;
        case 'nextHearing':
          aValue = a.nextHearing ? new Date(a.nextHearing) : new Date('2099-12-31');
          bValue = b.nextHearing ? new Date(b.nextHearing) : new Date('2099-12-31');
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'progress':
          aValue = a.progress;
          bValue = b.progress;
          break;
        case 'filingDate':
          aValue = new Date(a.filingDate);
          bValue = new Date(b.filingDate);
          break;
        default:
          aValue = a.title;
          bValue = b.title;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [cases, searchQuery, selectedStatus, selectedPriority, selectedType, sortBy, sortOrder]);

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700',
      completed: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
      on_hold: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700/30 dark:text-gray-300 dark:border-gray-600',
      cancelled: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700'
    };

    const labels = {
      active: 'Active',
      pending: 'Pending',
      completed: 'Completed',
      on_hold: 'On Hold',
      cancelled: 'Cancelled'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  // Get priority badge styling
  const getPriorityBadge = (priority) => {
    const styles = {
      critical: 'bg-red-500 text-white',
      high: 'bg-orange-500 text-white',
      medium: 'bg-blue-500 text-white',
      low: 'bg-gray-500 text-white'
    };

    const icons = {
      critical: AlertTriangle,
      high: Flame,
      medium: Clock,
      low: Timer
    };

    const Icon = icons[priority];

    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[priority]}`}>
        <Icon size={12} />
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </div>
    );
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get time ago
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  // Toggle case favorite
  const toggleFavorite = async (caseId) => {
    try {
      const caseItem = cases.find(c => c.id === caseId);
      if (caseItem) {
        // Optimistically update UI
        setCases(prevCases => 
          prevCases.map(item => 
            item.id === caseId 
              ? { ...item, isStarred: !item.isStarred }
              : item
          )
        );

        // Update on server (this would need to be implemented in your API)
        // await casesAPI.updateCase(caseId, { isStarred: !caseItem.isStarred });
      }
    } catch (err) {
      console.error('Error updating favorite status:', err);
      // Revert optimistic update on error
      setCases(prevCases => 
        prevCases.map(item => 
          item.id === caseId 
            ? { ...item, isStarred: !item.isStarred }
            : item
        )
      );
    }
  };

  // Refresh data
  const handleRefresh = () => {
    fetchCases();
  };

  // Case card component
  const CaseCard = ({ caseItem }) => (
    <div className={`group relative p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg
                   ${isDark 
                     ? 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70 hover:border-gray-600' 
                     : 'bg-white border-gray-200 hover:bg-gray-50/50 hover:border-gray-300'}`}>
      
      {/* Top section with case number and actions */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-lg text-xs font-mono font-semibold
                          ${isDark 
                            ? 'bg-blue-900/30 text-blue-300 border border-blue-700/50' 
                            : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
            {caseItem.caseNumber}
          </span>
          {caseItem.isUrgent && (
            <div className="flex items-center gap-1 px-2 py-1 bg-red-500/10 text-red-500 rounded-lg text-xs">
              <AlertTriangle size={10} />
              Urgent
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavorite(caseItem.id)}
            className={`p-1.5 rounded-lg transition-colors
                      ${caseItem.isStarred 
                        ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20' 
                        : 'text-gray-400 hover:text-yellow-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          >
            <Star size={14} className={caseItem.isStarred ? 'fill-current' : ''} />
          </button>
          
          <div className="relative">
            <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Case title and type */}
      <div className="mb-3">
        <h3 className={`font-semibold text-sm mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 cursor-pointer
                       ${isDark ? 'text-gray-200' : 'text-gray-800'}`}
            onClick={() => { setSelectedCase(caseItem); setShowCaseModal(true); }}>
          {caseItem.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-lg text-xs font-medium
                          ${isDark 
                            ? 'bg-purple-900/30 text-purple-300 border border-purple-700/50' 
                            : 'bg-purple-50 text-purple-700 border border-purple-200'}`}>
            {caseItem.caseType}
          </span>
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {caseItem.category}
          </span>
        </div>
      </div>

      {/* Client info */}
      <div className="mb-3 p-2 rounded-lg bg-gray-50/50 dark:bg-gray-700/30">
        <div className="flex items-center gap-2 mb-1">
          <User size={12} className="text-gray-500" />
          <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {caseItem.client.name}
          </span>
        </div>
        <p className={`text-xs line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {caseItem.description}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Progress
          </span>
          <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {caseItem.progress}%
          </span>
        </div>
        <div className={`w-full h-1.5 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div 
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
            style={{ width: `${caseItem.progress}%` }}
          />
        </div>
      </div>

      {/* Status and Priority */}
      <div className="flex items-center justify-between mb-3">
        {getStatusBadge(caseItem.status)}
        {getPriorityBadge(caseItem.priority)}
      </div>

      {/* Key details */}
      <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
        <div className="flex items-center gap-1">
          <Calendar size={12} className="text-blue-500" />
          <div>
            <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Next Hearing</div>
            <div className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {formatDate(caseItem.nextHearing)}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <IndianRupee size={12} className="text-green-500" />
          <div>
            <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Amount</div>
            <div className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {formatCurrency(caseItem.amount)}
            </div>
          </div>
        </div>
      </div>

      {/* Court info */}
      <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-blue-50/50 dark:bg-blue-900/20">
        <Building2 size={12} className="text-blue-500" />
        <div className="text-xs">
          <div className={`font-medium ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
            {caseItem.courtName}
          </div>
          <div className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            {caseItem.judge}
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <FileText size={12} />
            {caseItem.documents}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock size={12} />
            {getTimeAgo(caseItem.lastActivity)}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            <Eye size={14} />
          </button>
          <button className="p-2 rounded-lg text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
            <Edit3 size={14} />
          </button>
          <button className="p-2 rounded-lg text-gray-500 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
            <MessageCircle size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  // List view component
  const CaseListItem = ({ caseItem }) => (
    <div className={`group p-4 rounded-xl border transition-all duration-300 hover:shadow-md mb-3
                   ${isDark 
                     ? 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70' 
                     : 'bg-white border-gray-200 hover:bg-gray-50/50'}`}>
      
      <div className="flex items-center gap-4">
        {/* Case number and favorite */}
        <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
          <button
            onClick={() => toggleFavorite(caseItem.id)}
            className={`p-1 rounded transition-colors
                      ${caseItem.isStarred 
                        ? 'text-yellow-500' 
                        : 'text-gray-400 hover:text-yellow-500'}`}
          >
            <Star size={14} className={caseItem.isStarred ? 'fill-current' : ''} />
          </button>
          <span className={`px-2 py-1 rounded text-xs font-mono font-semibold
                          ${isDark 
                            ? 'bg-blue-900/30 text-blue-300' 
                            : 'bg-blue-50 text-blue-700'}`}>
            {caseItem.caseNumber}
          </span>
        </div>

        {/* Case title and client */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-sm mb-1 truncate cursor-pointer group-hover:text-blue-600 dark:group-hover:text-blue-400
                         ${isDark ? 'text-gray-200' : 'text-gray-800'}`}
              onClick={() => { setSelectedCase(caseItem); setShowCaseModal(true); }}>
            {caseItem.title}
          </h3>
          <div className="flex items-center gap-2">
            <User size={12} className="text-gray-500" />
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {caseItem.client.name}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs
                            ${isDark 
                              ? 'bg-purple-900/30 text-purple-300' 
                              : 'bg-purple-50 text-purple-700'}`}>
              {caseItem.caseType}
            </span>
          </div>
        </div>

        {/* Status and Priority */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {getStatusBadge(caseItem.status)}
          {getPriorityBadge(caseItem.priority)}
        </div>

        {/* Next hearing */}
        <div className="flex items-center gap-1 flex-shrink-0 min-w-0">
          <Calendar size={12} className="text-blue-500" />
          <div className="text-xs">
            <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Next Hearing</div>
            <div className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {formatDate(caseItem.nextHearing)}
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className="flex items-center gap-1 flex-shrink-0 min-w-0">
          <IndianRupee size={12} className="text-green-500" />
          <div className="text-xs text-right">
            <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Amount</div>
            <div className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {formatCurrency(caseItem.amount)}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button className="p-2 rounded-lg text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            <Eye size={14} />
          </button>
          <button className="p-2 rounded-lg text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
            <Edit3 size={14} />
          </button>
          <div className="relative">
            <button className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen p-4 sm:p-6 transition-colors duration-300
                   ${isDark 
                     ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800' 
                     : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-3 rounded-2xl ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                <Scale size={24} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Cases Management
                </h1>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Manage and track all your legal cases efficiently
                </p>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="flex items-center gap-6 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  {cases.filter(c => c.status === 'active').length} Active
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  {cases.filter(c => c.status === 'pending').length} Pending
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  {cases.filter(c => c.status === 'completed').length} Completed
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  {cases.filter(c => c.status === 'on_hold').length} On Hold
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button 
              onClick={handleRefresh}
              disabled={isLoading}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2
                        ${isLoading 
                          ? 'opacity-50 cursor-not-allowed' 
                          : ''} 
                        ${isDark 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              <RefreshCw size={16} className={`${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
            
            <button className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors
                              ${isDark 
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              <Download size={16} className="inline mr-2" />
              Export
            </button>
            
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
              <Plus size={16} className="inline mr-2" />
              New Case
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className={`p-4 rounded-2xl border mb-6 transition-colors
                       ${isDark 
                         ? 'bg-gray-800/50 border-gray-700/50' 
                         : 'bg-white border-gray-200'}`}>
          
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search size={18} className={`absolute left-3 top-1/2 transform -translate-y-1/2 
                                          ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search cases by title, number, client, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm transition-colors
                          ${isDark 
                            ? 'bg-gray-700/50 border-gray-600 text-gray-200 placeholder-gray-400 focus:bg-gray-700' 
                            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:bg-white'} 
                          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50`}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className={`flex items-center border rounded-lg p-1
                             ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${viewMode === 'grid' 
                    ? (isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                    : (isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')}`}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${viewMode === 'list' 
                    ? (isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                    : (isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')}`}
                >
                  <List size={16} />
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                          ${showFilters 
                            ? (isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                            : (isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}`}
              >
                <Filter size={16} />
                Filters
              </button>

              {/* Sort */}
              <div className="relative">
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className={`px-3 py-2 rounded-lg border text-sm transition-colors appearance-none pr-8
                            ${isDark 
                              ? 'bg-gray-700 border-gray-600 text-gray-300' 
                              : 'bg-gray-100 border-gray-200 text-gray-700'}`}
                >
                  <option value="lastActivity-desc">Latest Activity</option>
                  <option value="nextHearing-asc">Next Hearing (Soon)</option>
                  <option value="amount-desc">Amount (High to Low)</option>
                  <option value="progress-desc">Progress (High to Low)</option>
                  <option value="filingDate-desc">Filing Date (Recent)</option>
                  <option value="title-asc">Title (A-Z)</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {/* Status Filter */}
              <div>
                <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors
                            ${isDark 
                              ? 'bg-gray-700 border-gray-600 text-gray-300' 
                              : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="on_hold">On Hold</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Priority
                </label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors
                            ${isDark 
                              ? 'bg-gray-700 border-gray-600 text-gray-300' 
                              : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                >
                  <option value="all">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Case Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors
                            ${isDark 
                              ? 'bg-gray-700 border-gray-600 text-gray-300' 
                              : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                >
                  <option value="all">All Types</option>
                  <option value="Civil">Civil</option>
                  <option value="Criminal">Criminal</option>
                  <option value="Family">Family</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Labor">Labor</option>
                  <option value="Tax">Tax</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-4">
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing {filteredAndSortedCases.length} of {cases.length} cases
            {error && (
              <span className={`ml-3 px-2 py-1 rounded-lg text-xs
                              ${isDark 
                                ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-700/50' 
                                : 'bg-yellow-100 text-yellow-700 border border-yellow-200'}`}>
                <AlertTriangle size={12} className="inline mr-1" />
                {error}
              </span>
            )}
          </div>
          
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className={`text-sm text-blue-500 hover:text-blue-700 dark:hover:text-blue-300`}
            >
              Clear search
            </button>
          )}
        </div>

        {/* Cases Display */}
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`p-6 rounded-2xl border animate-pulse
                                     ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="space-y-3">
                  <div className={`h-4 rounded w-1/4 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                  <div className={`h-6 rounded w-3/4 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                  <div className={`h-4 rounded w-1/2 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedCases.length === 0 ? (
          // Empty state
          <div className={`text-center py-12 rounded-2xl border
                         ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
            <Scale size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              No cases found
            </h3>
            <p className={`text-sm mb-4 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              {searchQuery ? 'Try adjusting your search terms or filters' : 'Get started by creating your first case'}
            </p>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
              <Plus size={16} className="inline mr-2" />
              Create New Case
            </button>
          </div>
        ) : (
          // Cases grid/list
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6'
            : 'space-y-3'}>
            {filteredAndSortedCases.map((caseItem) => 
              viewMode === 'grid' ? (
                <CaseCard key={caseItem.id} caseItem={caseItem} />
              ) : (
                <CaseListItem key={caseItem.id} caseItem={caseItem} />
              )
            )}
          </div>
        )}
      </div>

      {/* Case Detail Modal */}
      {showCaseModal && selectedCase && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border
                         ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            {/* Modal Header */}
            <div className="sticky top-0 p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {selectedCase.title}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg text-sm font-mono font-semibold
                                    ${isDark 
                                      ? 'bg-blue-900/30 text-blue-300 border border-blue-700/50' 
                                      : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                      {selectedCase.caseNumber}
                    </span>
                    {getStatusBadge(selectedCase.status)}
                    {getPriorityBadge(selectedCase.priority)}
                  </div>
                </div>
                
                <button
                  onClick={() => setShowCaseModal(false)}
                  className={`p-2 rounded-lg transition-colors
                            ${isDark 
                              ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Client and Case Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Client Information */}
                <div className={`p-4 rounded-xl border
                               ${isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Client Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-blue-500" />
                      <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {selectedCase.client.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-green-500" />
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {selectedCase.client.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-purple-500" />
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {selectedCase.client.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Case Details */}
                <div className={`p-4 rounded-xl border
                               ${isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Case Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Filing Date</span>
                      <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {formatDate(selectedCase.filingDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Category</span>
                      <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {selectedCase.category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Amount</span>
                      <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {formatCurrency(selectedCase.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Documents</span>
                      <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {selectedCase.documents} files
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Court Information */}
              <div className={`p-4 rounded-xl border mb-6
                             ${isDark ? 'bg-blue-900/20 border-blue-700/50' : 'bg-blue-50 border-blue-200'}`}>
                <h3 className={`font-semibold mb-3 ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>
                  Court Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-blue-500" />
                    <div>
                      <div className={`text-sm ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>Court</div>
                      <div className={`font-medium ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>
                        {selectedCase.courtName}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gavel size={16} className="text-purple-500" />
                    <div>
                      <div className={`text-sm ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>Judge</div>
                      <div className={`font-medium ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>
                        {selectedCase.judge}
                      </div>
                    </div>
                  </div>
                  {selectedCase.nextHearing && (
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-orange-500" />
                      <div>
                        <div className={`text-sm ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>Next Hearing</div>
                        <div className={`font-medium ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>
                          {formatDate(selectedCase.nextHearing)}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-red-500" />
                    <div>
                      <div className={`text-sm ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>Opposing Party</div>
                      <div className={`font-medium ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>
                        {selectedCase.opposing}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className={`p-4 rounded-xl border mb-6
                             ${isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Case Description
                </h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {selectedCase.description}
                </p>
              </div>

              {/* Progress */}
              <div className={`p-4 rounded-xl border mb-6
                             ${isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Case Progress
                  </h3>
                  <span className={`text-lg font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    {selectedCase.progress}%
                  </span>
                </div>
                <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                    style={{ width: `${selectedCase.progress}%` }}
                  />
                </div>
              </div>

              {/* Tags */}
              {selectedCase.tags && selectedCase.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCase.tags.map((tag, index) => (
                      <span key={index} 
                            className={`px-3 py-1 rounded-full text-xs font-medium
                                      ${isDark 
                                        ? 'bg-purple-900/30 text-purple-300 border border-purple-700/50' 
                                        : 'bg-purple-100 text-purple-700 border border-purple-200'}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <Edit3 size={16} />
                  Edit Case
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                  <MessageCircle size={16} />
                  Contact Client
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                  <FileText size={16} />
                  View Documents
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                  <Calendar size={16} />
                  Schedule Hearing
                </button>
                <button className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                                  ${isDark 
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  <Download size={16} />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LawyerCases;