import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit3, 
  Download, 
  Share2, 
  Upload, 
  Calendar, 
  Clock, 
  User, 
  Users, 
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Timer,
  FileCheck,
  FilePlus,
  FileX,
  Briefcase,
  Star,
  IndianRupee,
  Phone,
  Mail,
  MapPin,
  Building2,
  Tag,
  Layers,
  Archive,
  History,
  TrendingUp,
  Activity,
  Award,
  Target,
  Zap,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  RefreshCw,
  Send,
  MessageCircle,
  Bell,
  Bookmark,
  FolderOpen,
  Files,
  Paperclip,
  Globe,
  Lock,
  Unlock,
  Ban,
  Scale,
  Gavel,
  BookOpen,
  Settings,
  X,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Copy,
  Trash2,
  Edit,
  PlayCircle,
  PauseCircle,
  StopCircle,
  RotateCcw,
  CheckSquare,
  Square,
  AlertTriangle,
  Info,
  Sparkles,
  Crown,
  Shield,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Coffee,
  Handshake,
  Receipt,
  CreditCard
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { documentsAPI } from '../../api/apiService';

// Mock data for document drafting requests
const mockDraftingRequests = [
  {
    id: 1,
    clientName: "Rajesh Kumar",
    clientEmail: "rajesh.kumar@email.com",
    clientPhone: "+91 98765 43210",
    documentType: "Property Sale Agreement",
    description: "Need a comprehensive property sale agreement for residential flat in Gurgaon",
    bidAmount: 5000,
    urgency: "high",
    deadline: "2024-02-20",
    submittedDate: "2024-02-05",
    status: "pending",
    estimatedTime: "3-5 days",
    requirements: ["Property documents", "NOC from society", "Tax clearance"],
    category: "Property Law",
    complexity: "medium",
    isUrgent: true,
    attachments: 3,
    clientRating: 4.8,
    previousProjects: 12
  },
  {
    id: 2,
    clientName: "Priya Sharma",
    clientEmail: "priya.sharma@techcorp.com",
    clientPhone: "+91 99887 66554",
    documentType: "Employment Contract",
    description: "Employment agreement for senior software engineer position with confidentiality clauses",
    bidAmount: 3500,
    urgency: "medium",
    deadline: "2024-02-25",
    submittedDate: "2024-02-06",
    status: "accepted",
    estimatedTime: "2-3 days",
    requirements: ["Job description", "Salary structure", "Company policies"],
    category: "Corporate Law",
    complexity: "low",
    isUrgent: false,
    attachments: 5,
    clientRating: 4.5,
    previousProjects: 8
  },
  {
    id: 3,
    clientName: "Amit Enterprises Pvt Ltd",
    clientEmail: "legal@amitenterprises.com",
    clientPhone: "+91 97654 32108",
    documentType: "Partnership Deed",
    description: "Partnership agreement for new business venture with profit-sharing clauses",
    bidAmount: 8000,
    urgency: "critical",
    deadline: "2024-02-18",
    submittedDate: "2024-02-04",
    status: "in_progress",
    estimatedTime: "5-7 days",
    requirements: ["Partner details", "Capital contribution", "Business plan"],
    category: "Corporate Law",
    complexity: "high",
    isUrgent: true,
    attachments: 8,
    clientRating: 4.9,
    previousProjects: 25
  },
  {
    id: 4,
    clientName: "Kavita Singh",
    clientEmail: "kavita.singh@gmail.com",
    clientPhone: "+91 96543 21087",
    documentType: "Divorce Petition",
    description: "Mutual consent divorce petition with child custody arrangements",
    bidAmount: 6500,
    urgency: "medium",
    deadline: "2024-03-01",
    submittedDate: "2024-02-03",
    status: "completed",
    estimatedTime: "4-6 days",
    requirements: ["Marriage certificate", "Address proof", "Income documents"],
    category: "Family Law",
    complexity: "high",
    isUrgent: false,
    attachments: 6,
    clientRating: 4.7,
    previousProjects: 15
  },
  {
    id: 5,
    clientName: "Global Trading Co.",
    clientEmail: "contracts@globaltrading.in",
    clientPhone: "+91 95432 10876",
    documentType: "Non-Disclosure Agreement",
    description: "NDA for business partnership negotiations with international clients",
    bidAmount: 2500,
    urgency: "low",
    deadline: "2024-02-28",
    submittedDate: "2024-02-07",
    status: "review",
    estimatedTime: "1-2 days",
    requirements: ["Company incorporation docs", "Business details"],
    category: "Corporate Law",
    complexity: "low",
    isUrgent: false,
    attachments: 2,
    clientRating: 4.6,
    previousProjects: 20
  }
];

// Mock data for case documents
const mockCaseDocuments = [
  {
    id: 1,
    caseId: "CIV-2024-001",
    caseTitle: "Property Dispute Resolution",
    clientName: "Rajesh Kumar",
    documentName: "Property Title Deed",
    documentType: "Legal Document",
    fileType: "PDF",
    fileSize: "2.3 MB",
    uploadedDate: "2024-02-01",
    status: "verified",
    category: "Evidence",
    description: "Original property title deed with all legal documents",
    isConfidential: true,
    tags: ["Property", "Title", "Legal"],
    version: "v1.0",
    lastModified: "2024-02-01T10:30:00Z"
  },
  {
    id: 2,
    caseId: "CRIM-2024-002",
    caseTitle: "Financial Fraud Investigation",
    clientName: "Amit Enterprises Pvt Ltd",
    documentName: "Bank Statements",
    documentType: "Financial Document",
    fileType: "XLSX",
    fileSize: "5.7 MB",
    uploadedDate: "2024-02-02",
    status: "pending_review",
    category: "Financial Evidence",
    description: "Bank statements for the period under investigation",
    isConfidential: true,
    tags: ["Financial", "Bank", "Evidence"],
    version: "v2.1",
    lastModified: "2024-02-02T14:45:00Z"
  },
  {
    id: 3,
    caseId: "FAM-2024-003",
    caseTitle: "Child Custody & Maintenance",
    clientName: "Kavita Sharma",
    documentName: "Marriage Certificate",
    documentType: "Legal Document",
    fileType: "PDF",
    fileSize: "1.2 MB",
    uploadedDate: "2024-01-30",
    status: "verified",
    category: "Personal Documents",
    description: "Official marriage certificate from registrar office",
    isConfidential: false,
    tags: ["Marriage", "Personal", "Official"],
    version: "v1.0",
    lastModified: "2024-01-30T16:20:00Z"
  },
  {
    id: 4,
    caseId: "LAB-2024-004",
    caseTitle: "Wrongful Termination Suit",
    clientName: "Suresh Patel",
    documentName: "Employment Contract",
    documentType: "Contract",
    fileType: "PDF",
    fileSize: "3.1 MB",
    uploadedDate: "2024-01-31",
    status: "reviewed",
    category: "Employment Documents",
    description: "Original employment contract with terms and conditions",
    isConfidential: true,
    tags: ["Employment", "Contract", "Legal"],
    version: "v1.3",
    lastModified: "2024-01-31T11:15:00Z"
  },
  {
    id: 5,
    caseId: "COM-2024-006",
    caseTitle: "Contract Breach & Damages",
    clientName: "Metro Construction Ltd",
    documentName: "Construction Agreement",
    documentType: "Contract",
    fileType: "PDF",
    fileSize: "4.8 MB",
    uploadedDate: "2024-02-01",
    status: "verified",
    category: "Commercial Contracts",
    description: "Main construction agreement with all annexures",
    isConfidential: true,
    tags: ["Construction", "Commercial", "Contract"],
    version: "v2.0",
    lastModified: "2024-02-01T15:30:00Z"
  }
];

// Mock data for document history
const mockDocumentHistory = [
  {
    id: 1,
    clientName: "Rajesh Kumar",
    documentType: "Property Sale Agreement",
    completedDate: "2024-01-25",
    amount: 5000,
    status: "completed",
    rating: 5,
    feedback: "Excellent work, very professional and timely delivery",
    category: "Property Law",
    duration: "4 days"
  },
  {
    id: 2,
    clientName: "Tech Solutions Pvt Ltd",
    documentType: "Service Agreement",
    completedDate: "2024-01-20",
    amount: 4500,
    status: "completed",
    rating: 4,
    feedback: "Good quality work, satisfied with the outcome",
    category: "Corporate Law",
    duration: "3 days"
  },
  {
    id: 3,
    clientName: "Kavita Singh",
    documentType: "Will & Testament",
    completedDate: "2024-01-15",
    amount: 3500,
    status: "completed",
    rating: 5,
    feedback: "Very thorough and well-drafted document",
    category: "Personal Law",
    duration: "5 days"
  },
  {
    id: 4,
    clientName: "Manufacturing Co.",
    documentType: "Lease Agreement",
    completedDate: "2024-01-10",
    amount: 6000,
    status: "completed",
    rating: 4,
    feedback: "Professional service, minor revisions needed",
    category: "Commercial Law",
    duration: "6 days"
  },
  {
    id: 5,
    clientName: "Startup Innovations",
    documentType: "Founder's Agreement",
    completedDate: "2024-01-05",
    amount: 7500,
    status: "completed",
    rating: 5,
    feedback: "Outstanding work, highly recommended",
    category: "Corporate Law",
    duration: "7 days"
  }
];

const LawyerDocuments = ({ darkMode, userData }) => {
  // Use darkMode prop if provided, otherwise use theme context
  const { isDark: themeIsDark } = useTheme();
  const isDark = darkMode !== undefined ? darkMode : themeIsDark;
  
  // State management
  const [activeTab, setActiveTab] = useState('drafting');
  const [draftingRequests, setDraftingRequests] = useState(mockDraftingRequests);
  const [caseDocuments, setCaseDocuments] = useState(mockCaseDocuments);
  const [documentHistory, setDocumentHistory] = useState(mockDocumentHistory);
  
  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('submittedDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Modal states
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data based on active tab
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulated API calls - replace with actual API calls
      switch(activeTab) {
        case 'drafting':
          // const draftingResponse = await documentsAPI.getDraftingRequests();
          setDraftingRequests(mockDraftingRequests);
          break;
        case 'cases':
          // const documentsResponse = await documentsAPI.getCaseDocuments();
          setCaseDocuments(mockCaseDocuments);
          break;
        case 'history':
          // const historyResponse = await documentsAPI.getDocumentHistory();
          setDocumentHistory(mockDocumentHistory);
          break;
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Handle request status update
  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      // Update local state optimistically
      setDraftingRequests(prev => 
        prev.map(req => 
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );
      
      // Make API call
      // await documentsAPI.updateRequestStatus(requestId, newStatus);
    } catch (err) {
      console.error('Error updating status:', err);
      // Revert optimistic update on error
      fetchData();
    }
  };

  // Handle document upload
  const handleDocumentUpload = async (files, caseId) => {
    try {
      // Upload logic here
      // await documentsAPI.uploadDocuments(files, caseId);
      fetchData();
      setShowUploadModal(false);
    } catch (err) {
      console.error('Error uploading documents:', err);
    }
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700',
      accepted: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
      in_progress: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700',
      review: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
      completed: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
      rejected: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',
      verified: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
      pending_review: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700',
      reviewed: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700'
    };

    const labels = {
      pending: 'Pending',
      accepted: 'Accepted',
      in_progress: 'In Progress',
      review: 'Under Review',
      completed: 'Completed',
      rejected: 'Rejected',
      verified: 'Verified',
      pending_review: 'Pending Review',
      reviewed: 'Reviewed'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  // Get urgency badge styling
  const getUrgencyBadge = (urgency) => {
    const styles = {
      low: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700/30 dark:text-gray-300 dark:border-gray-600',
      medium: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
      high: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700',
      critical: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700'
    };

    const icons = {
      low: Clock,
      medium: Timer,
      high: AlertCircle,
      critical: AlertTriangle
    };

    const IconComponent = icons[urgency];
    const label = urgency.charAt(0).toUpperCase() + urgency.slice(1);

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${styles[urgency]}`}>
        <IconComponent size={12} className="mr-1" />
        {label}
      </span>
    );
  };

  // Tab navigation component
  const TabNavigation = () => (
    <div className={`flex space-x-1 p-1 rounded-xl ${
      isDark ? 'bg-gray-800/50' : 'bg-gray-100'
    } backdrop-blur-sm`}>
      {[
        { id: 'drafting', label: 'Document Drafting', icon: FilePlus, badge: draftingRequests.filter(r => r.status === 'pending').length },
        { id: 'cases', label: 'Case Documents', icon: FileText, badge: caseDocuments.filter(d => d.status === 'pending_review').length },
        { id: 'history', label: 'History', icon: History, badge: null }
      ].map((tab) => {
        const IconComponent = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
              activeTab === tab.id
                ? isDark
                  ? 'bg-gray-700 text-white shadow-lg'
                  : 'bg-white text-gray-900 shadow-md'
                : isDark
                ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
            }`}
          >
            <IconComponent size={16} />
            <span>{tab.label}</span>
            {tab.badge && tab.badge > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  // Search and filter bar
  const SearchAndFilterBar = () => (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-1 items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search size={20} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Search documents, clients, cases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border transition-all duration-200 focus:ring-2 ${
              isDark
                ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-600/50 focus:border-blue-600'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-blue-500/50 focus:border-blue-500'
            }`}
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border transition-all duration-200 ${
            isDark
              ? 'bg-gray-800/50 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700'
              : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Filter size={16} />
          <span className="text-sm font-medium">Filters</span>
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex rounded-lg overflow-hidden border">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 ${
              viewMode === 'grid'
                ? isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Grid3X3 size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 ${
              viewMode === 'list'
                ? isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <List size={16} />
          </button>
        </div>

        <button
          onClick={fetchData}
          className={`p-2.5 rounded-xl border transition-all duration-200 ${
            isDark
              ? 'bg-gray-800/50 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700'
              : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
        </button>

        {activeTab === 'cases' && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
          >
            <Upload size={16} />
            <span className="text-sm font-medium">Upload</span>
          </button>
        )}
      </div>
    </div>
  );

  // Filters panel
  const FiltersPanel = () => (
    showFilters && (
      <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl border ${
        isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'
      }`}>
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`w-full p-2.5 rounded-lg border ${
              isDark
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {activeTab === 'drafting' && (
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Urgency
            </label>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className={`w-full p-2.5 rounded-lg border ${
                isDark
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              <option value="all">All Urgency</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        )}

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`w-full p-2.5 rounded-lg border ${
              isDark
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <option value="all">All Categories</option>
            <option value="Property Law">Property Law</option>
            <option value="Corporate Law">Corporate Law</option>
            <option value="Family Law">Family Law</option>
            <option value="Criminal Law">Criminal Law</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`w-full p-2.5 rounded-lg border ${
              isDark
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <option value="submittedDate">Date Submitted</option>
            <option value="deadline">Deadline</option>
            <option value="bidAmount">Amount</option>
            <option value="urgency">Urgency</option>
          </select>
        </div>
      </div>
    )
  );

  // Document Drafting Request Card
  const DraftingRequestCard = ({ request }) => (
    <div className={`rounded-2xl border transition-all duration-300 hover:shadow-lg cursor-pointer ${
      isDark 
        ? 'bg-gray-800/50 border-gray-700 hover:shadow-gray-900/20' 
        : 'bg-white border-gray-200 hover:shadow-gray-200/60'
    }`} onClick={() => {
      setSelectedRequest(request);
      setShowRequestModal(true);
    }}>
      <div className="p-6">
        {/* Header with client info and urgency */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg">
              {request.clientName.charAt(0)}
            </div>
            <div>
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {request.clientName}
              </h3>
              <p className={`text-sm flex items-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <Star size={12} className="mr-1 text-yellow-500" />
                {request.clientRating} • {request.previousProjects} projects
              </p>
            </div>
          </div>
          <div className="text-right">
            {getUrgencyBadge(request.urgency)}
          </div>
        </div>

        {/* Document details */}
        <div className="mb-4">
          <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {request.documentType}
          </h4>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {request.description}
          </p>
        </div>

        {/* Status and category */}
        <div className="flex items-center justify-between mb-4">
          {getStatusBadge(request.status)}
          <span className={`text-xs px-2 py-1 rounded-full ${
            isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
          }`}>
            {request.category}
          </span>
        </div>

        {/* Amount and deadline */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <IndianRupee size={16} className="text-green-500" />
            <span className={`font-semibold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
              ₹{request.bidAmount.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Calendar size={14} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
              {new Date(request.deadline).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          {request.status === 'pending' && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusUpdate(request.id, 'accepted');
                }}
                className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusUpdate(request.id, 'rejected');
                }}
                className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
            </>
          )}
          {request.status === 'accepted' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStatusUpdate(request.id, 'in_progress');
              }}
              className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Start Working
            </button>
          )}
          {request.status === 'in_progress' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStatusUpdate(request.id, 'review');
              }}
              className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              Submit for Review
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Case Document Card
  const CaseDocumentCard = ({ document }) => (
    <div className={`rounded-2xl border transition-all duration-300 hover:shadow-lg cursor-pointer ${
      isDark 
        ? 'bg-gray-800/50 border-gray-700 hover:shadow-gray-900/20' 
        : 'bg-white border-gray-200 hover:shadow-gray-200/60'
    }`} onClick={() => {
      setSelectedDocument(document);
      setShowDocumentModal(true);
    }}>
      <div className="p-6">
        {/* Header with case info */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <FileText size={20} />
            </div>
            <div>
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {document.documentName}
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {document.caseId} • {document.clientName}
              </p>
            </div>
          </div>
          {document.isConfidential && (
            <div className="flex items-center space-x-1 text-orange-500">
              <Lock size={14} />
              <span className="text-xs font-medium">Confidential</span>
            </div>
          )}
        </div>

        {/* Document details */}
        <div className="mb-4">
          <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {document.description}
          </p>
        </div>

        {/* Status and category */}
        <div className="flex items-center justify-between mb-4">
          {getStatusBadge(document.status)}
          <span className={`text-xs px-2 py-1 rounded-full ${
            isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
          }`}>
            {document.category}
          </span>
        </div>

        {/* File info and date */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded ${
              isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}>
              {document.fileType}
            </span>
            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              {document.fileSize}
            </span>
          </div>
          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            {new Date(document.uploadedDate).toLocaleDateString()}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1">
            <Eye size={14} />
            <span>View</span>
          </button>
          <button className="bg-gray-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
            <Download size={14} />
          </button>
          <button className="bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
            <Share2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  // Document History Card
  const DocumentHistoryCard = ({ historyItem }) => (
    <div className={`rounded-2xl border transition-all duration-300 hover:shadow-lg ${
      isDark 
        ? 'bg-gray-800/50 border-gray-700 hover:shadow-gray-900/20' 
        : 'bg-white border-gray-200 hover:shadow-gray-200/60'
    }`}>
      <div className="p-6">
        {/* Header with client info */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg">
              {historyItem.clientName.charAt(0)}
            </div>
            <div>
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {historyItem.clientName}
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {historyItem.documentType}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill={i < historyItem.rating ? 'currentColor' : 'none'} />
              ))}
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="mb-4">
          <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            "{historyItem.feedback}"
          </p>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className={`block ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Amount</span>
            <span className={`font-semibold flex items-center ${isDark ? 'text-green-400' : 'text-green-600'}`}>
              <IndianRupee size={14} className="mr-1" />
              ₹{historyItem.amount.toLocaleString()}
            </span>
          </div>
          <div>
            <span className={`block ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Duration</span>
            <span className={isDark ? 'text-white' : 'text-gray-900'}>{historyItem.duration}</span>
          </div>
          <div>
            <span className={`block ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Category</span>
            <span className={isDark ? 'text-white' : 'text-gray-900'}>{historyItem.category}</span>
          </div>
          <div>
            <span className={`block ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Completed</span>
            <span className={isDark ? 'text-white' : 'text-gray-900'}>
              {new Date(historyItem.completedDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          {getStatusBadge(historyItem.status)}
          <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );

  // Main render method
  return (
    <div className={`p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Documents Management
            </h1>
            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage document drafting requests, case documents, and history
            </p>
          </div>
          
          {/* Stats */}
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <div className={`px-4 py-2 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="text-center">
                <p className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  {draftingRequests.filter(r => r.status === 'pending').length}
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Pending Requests
                </p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="text-center">
                <p className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  {documentHistory.length}
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Completed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <TabNavigation />

        {/* Search and Filter Bar */}
        <SearchAndFilterBar />

        {/* Filters Panel */}
        <FiltersPanel />

        {/* Error State */}
        {error && (
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`}>
            <p className={isDark ? 'text-red-300' : 'text-red-700'}>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`rounded-2xl p-6 ${isDark ? 'bg-gray-800/50' : 'bg-white'} animate-pulse`}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="h-16 bg-gray-300 rounded mb-4"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          /* Content based on active tab */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'drafting' && 
              draftingRequests.map(request => (
                <DraftingRequestCard key={request.id} request={request} />
              ))
            }
            
            {activeTab === 'cases' && 
              caseDocuments.map(document => (
                <CaseDocumentCard key={document.id} document={document} />
              ))
            }
            
            {activeTab === 'history' && 
              documentHistory.map(historyItem => (
                <DocumentHistoryCard key={historyItem.id} historyItem={historyItem} />
              ))
            }
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (
          (activeTab === 'drafting' && draftingRequests.length === 0) ||
          (activeTab === 'cases' && caseDocuments.length === 0) ||
          (activeTab === 'history' && documentHistory.length === 0)
        ) && (
          <div className="text-center py-12">
            <FileText size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              No {activeTab === 'drafting' ? 'drafting requests' : activeTab === 'cases' ? 'documents' : 'history'} found
            </h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {activeTab === 'drafting' ? 'New requests will appear here' : 
               activeTab === 'cases' ? 'Upload documents to get started' : 
               'Completed work will be shown here'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LawyerDocuments;