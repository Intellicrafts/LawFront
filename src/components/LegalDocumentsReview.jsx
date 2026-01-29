import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '../hooks/useDarkMode';
import {
  Upload, FileText, User, Star, MessageCircle, Clock, DollarSign,
  Filter, Search, Calendar, CheckCircle, AlertCircle, Eye, Download,
  Send, Phone, Video, Shield, Award, BookOpen, Briefcase, Scale,
  Building, Users, Check, Heart, ChevronRight, X, Paperclip, ArrowRight,
  Edit, Sparkles, Brain, Zap, FileCheck, Cpu, Target, TrendingUp,
  Loader, RefreshCw, ChevronDown, MoreVertical, Globe, MapPin, Camera,
  Quote, Share2
} from 'lucide-react';

const colors = {
  light: {
    background: '#FFFFFF',
    surface: '#F8FAFC',
    surfaceElevated: '#FFFFFF',
    text: {
      primary: '#0F172A',
      secondary: '#475569',
      muted: '#94A3B8',
      inverse: '#FFFFFF'
    },
    accent: {
      primary: '#3B82F6',
      secondary: '#2563EB',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    },
    border: '#E2E8F0',
    shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
  },
  dark: {
    background: '#0A0A0A',
    surface: '#1A1A1A',
    surfaceElevated: '#2C2C2C',
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
      muted: '#64748B',
      inverse: '#0A0A0A'
    },
    accent: {
      primary: '#3B82F6',
      secondary: '#2563EB',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    },
    border: '#2A2A2A',
    shadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)'
  }
};
// Analysis stages for simulation
const analysisStages = [
  { stage: 'Uploading document...', duration: 1000 },
  { stage: 'Scanning document structure...', duration: 1500 },
  { stage: 'Analyzing legal content...', duration: 2000 },
  { stage: 'Reviewing clauses and terms...', duration: 1800 },
  { stage: 'Checking compliance requirements...', duration: 1200 },
  { stage: 'Generating recommendations...', duration: 1000 },
  { stage: 'Finalizing analysis report...', duration: 800 }
];

// Enhanced lawyer data with professional styling
const lawyers = [
  {
    id: 1,
    name: "Adv. Rahul Sharma",
    specialization: "Corporate Law",
    rating: 4.9,
    reviews: 342,
    experience: 15,
    hourlyRate: 4500,
    avatar: "https://t4.ftcdn.net/jpg/10/88/94/95/360_F_1088949502_CcUgYnnDv5rTYrH3E6ddq8V3Sgi8ApMq.jpg",
    verified: true,
    languages: ["English", "Hindi", "Marathi"],
    availability: "Available Now",
    badges: ["Senior Partner", "Corporate Expert", "Quick Response"],
    completedCases: 2147,
    successRate: 96,
    location: "Mumbai, Maharashtra",
    bio: "Senior Corporate Lawyer with expertise in M&A, contract drafting, and regulatory compliance. Previously worked with top law firms.",
    services: ["Contract Review", "Corporate Formation", "M&A Documents", "Compliance Review", "IPO Documentation"],
    highlights: ["₹500Cr+ deals handled", "100+ IPOs", "Top 1% lawyers"],
    responseTime: "< 30 minutes"
  },
  {
    id: 2,
    name: "Adv. Priya Patel",
    specialization: "Intellectual Property",
    rating: 4.8,
    reviews: 218,
    experience: 12,
    hourlyRate: 3800,
    avatar: "https://www.shutterstock.com/image-photo/portrait-successful-indian-business-woman-260nw-2127913421.jpg",
    verified: true,
    languages: ["English", "Hindi", "Gujarati"],
    availability: "Available Today",
    badges: ["IP Specialist", "Patent Expert", "Top Rated"],
    completedCases: 1563,
    successRate: 94,
    location: "Delhi, NCR",
    bio: "Specialized in intellectual property law, patent filing, trademark registration, and IP litigation with global experience.",
    services: ["Patent Filing", "Trademark Registration", "Copyright Protection", "IP Litigation"],
    highlights: ["5000+ Patents filed", "Global IP practice", "Tech expertise"],
    responseTime: "< 1 hour"
  },
  {
    id: 3,
    name: "Adv. Arjun Singh",
    specialization: "Employment Law",
    rating: 4.7,
    reviews: 156,
    experience: 10,
    hourlyRate: 3200,
    avatar: "https://www.shutterstock.com/image-photo/happy-young-indian-arabic-businessman-260nw-2187607295.jpg",
    verified: true,
    languages: ["English", "Hindi", "Punjabi"],
    availability: "Available Tomorrow",
    badges: ["Employment Expert", "HR Specialist"],
    completedCases: 987,
    successRate: 92,
    location: "Bangalore, Karnataka",
    bio: "Expert in employment law, HR compliance, labor disputes, and workplace policies with multinational corporate experience.",
    services: ["Employment Contracts", "HR Policies", "Labor Disputes", "Compliance Audit"],
    highlights: ["Fortune 500 clients", "HR compliance expert", "Quick resolution"],
    responseTime: "< 2 hours"
  }
];

const categories = ["Corporate Law", "Intellectual Property", "Employment Law", "Real Estate", "Tax Law", "Family Law"];

const DocumentReview = () => {
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';
  const [activeTab, setActiveTab] = useState('analyze');
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [documentBucket, setDocumentBucket] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [callInProgress, setCallInProgress] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBooking, setShowBooking] = useState(false);
  const [myCases, setMyCases] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > 300;
      setShowScrollTop(prev => {
        if (prev !== shouldShow) return shouldShow;
        return prev;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Ensure camera is stopped on unmount
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesSearch = lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || lawyer.specialization.includes(filterCategory);
    return matchesSearch && matchesCategory;
  });

  // Document Analysis States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Camera States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Prefer back camera on mobile
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `captured_doc_${Date.now()}.jpg`, { type: 'image/jpeg' });
          handleFileUpload([file]);
          stopCamera();
        }
      }, 'image/jpeg', 0.95);
    }
  };

  // Modal States
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatInputValue, setChatInputValue] = useState('');
  const [chatInputFocused, setChatInputFocused] = useState(false);

  // Document analysis simulation
  const simulateDocumentAnalysis = async (file) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisResult(null);

    for (let i = 0; i < analysisStages.length; i++) {
      setAnalysisStage(analysisStages[i].stage);

      // Simulate progress
      const startProgress = (i / analysisStages.length) * 100;
      const endProgress = ((i + 1) / analysisStages.length) * 100;

      const duration = analysisStages[i].duration;
      const steps = 20;
      const stepDuration = duration / steps;

      for (let step = 0; step <= steps; step++) {
        const progress = startProgress + (step / steps) * (endProgress - startProgress);
        setAnalysisProgress(progress);
        await new Promise(resolve => setTimeout(resolve, stepDuration));
      }
    }

    // Simulate API response
    const mockAnalysisResult = {
      documentType: "Service Agreement",
      overallScore: 85,
      riskLevel: "Medium",
      issues: [
        {
          type: "Critical",
          title: "Ambiguous Termination Clause",
          description: "Section 8.2 lacks specific termination notice period",
          suggestion: "Specify exact notice period (e.g., 30 days written notice)",
          severity: "high"
        },
        {
          type: "Warning",
          title: "Missing Liability Cap",
          description: "No limitation on liability amount specified",
          suggestion: "Add liability cap clause to limit financial exposure",
          severity: "medium"
        },
        {
          type: "Info",
          title: "Jurisdiction Clarification",
          description: "Consider specifying governing law jurisdiction",
          suggestion: "Add governing law clause for legal clarity",
          severity: "low"
        }
      ],
      suggestions: [
        "Add force majeure clause for unforeseen circumstances",
        "Include dispute resolution mechanism",
        "Specify intellectual property ownership",
        "Add confidentiality provisions"
      ],
      complianceScore: 78,
      readabilityScore: 82,
      summary: "This service agreement covers the basic terms but needs improvements in risk management and legal clarity. The document is generally well-structured but lacks some critical protective clauses."
    };

    setAnalysisResult(mockAnalysisResult);
    setIsAnalyzing(false);

    // Update document bucket status
    if (uploadedFiles.length > 0) {
      setDocumentBucket(prev =>
        prev.map(doc =>
          doc.name === uploadedFiles[0].name
            ? { ...doc, status: "analyzed", analysisScore: mockAnalysisResult.overallScore, riskLevel: mockAnalysisResult.riskLevel }
            : doc
        )
      );
    }
  };

  // Initialize sample data
  useEffect(() => {
    // Sample document bucket data
    setDocumentBucket([
      {
        id: 1,
        name: "Service Agreement.pdf",
        type: "Contract",
        size: "2.4 MB",
        uploadDate: "2024-01-15",
        status: "analyzed",
        analysisScore: 85,
        riskLevel: "Medium",
        icon: FileText
      },
      {
        id: 2,
        name: "Employment Contract.docx",
        type: "Legal Document",
        size: "1.8 MB",
        uploadDate: "2024-01-10",
        status: "pending",
        analysisScore: null,
        riskLevel: null,
        icon: Briefcase
      },
      {
        id: 3,
        name: "NDA Template.pdf",
        type: "Template",
        size: "980 KB",
        uploadDate: "2024-01-08",
        status: "analyzed",
        analysisScore: 92,
        riskLevel: "Low",
        icon: Shield
      }
    ]);

    // Sample my cases data
    setMyCases([
      {
        id: 1,
        title: "Service Agreement Review",
        type: "AI Analysis",
        lawyer: null,
        date: "2024-01-15",
        status: "completed",
        documents: ["Service Agreement.pdf"],
        icon: Brain,
        description: "AI-powered contract analysis with risk assessment"
      },
      {
        id: 2,
        title: "Employment Law Consultation",
        type: "Lawyer Review",
        lawyer: "Adv. Arjun Singh",
        date: "2024-01-12",
        status: "in-progress",
        documents: ["Employment Contract.docx", "Company Policy.pdf"],
        icon: Users,
        description: "Legal review of employment contracts and policies"
      },
      {
        id: 3,
        title: "NDA Template Creation",
        type: "Document Generation",
        lawyer: "Adv. Priya Patel",
        date: "2024-01-08",
        status: "completed",
        documents: ["NDA Template.pdf"],
        icon: FileCheck,
        description: "Custom NDA template creation for tech startups"
      }
    ]);
  }, []);

  // File upload handlers
  const handleFileUpload = (files) => {
    const file = files[0];
    if (file) {
      // Set analyzing state IMMEDIATELY to prevent UI flickering
      setIsAnalyzing(true);
      setAnalysisResult(null);
      setUploadedFiles([file]);

      // Add to document bucket
      const newDocument = {
        id: documentBucket.length + 1,
        name: file.name,
        type: "Legal Document",
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        status: "analyzing",
        analysisScore: null,
        riskLevel: null,
        icon: FileText
      };
      setDocumentBucket(prev => [newDocument, ...prev]);
      simulateDocumentAnalysis(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  // Document Analysis Render Function
  const renderDocumentAnalysisTab = () => (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2 py-4"
      >
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain size={20} className="text-white" />
            </div>
            <div className={`absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 ${isDarkMode ? 'border-[#0A0A0A]' : 'border-[#F8FAFC]'}`}>
              <Sparkles size={10} className="text-white" />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            AI Legal Document Analyzer
          </h2>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-slate-600'} max-w-md mx-auto text-[11px]`}>
            Upload your legal documents for instant AI-powered analysis and risk assessment
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-1.5 pt-2">
          {[
            { icon: Zap, text: "Instant Analysis", color: 'text-blue-500' },
            { icon: Shield, text: "Risk Assessment", color: 'text-emerald-500' },
            { icon: FileCheck, text: "Compliance Check", color: 'text-purple-500' },
            { icon: Target, text: "Recommendations", color: 'text-orange-500' }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-sm ${isDarkMode
                ? 'bg-[#1A1A1A]/50 border-[#2A2A2A]'
                : 'bg-white border-slate-200'
                }`}
            >
              <feature.icon size={10} className={feature.color} />
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>{feature.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        layout="position"
        className="relative overflow-hidden"
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {(!isAnalyzing && !analysisResult) ? (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <AnimatePresence mode="wait">
                {isCameraActive ? (
                  <motion.div
                    key="camera-view"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative rounded-[2.5rem] overflow-hidden bg-black aspect-[3/4] sm:aspect-[4/3] max-w-lg mx-auto shadow-2xl border-8 border-white/5"
                  >
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Scanning Guide Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-8">
                      <div className="w-full h-full border-2 border-dashed border-blue-500/40 rounded-3xl relative">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-xl" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-xl" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl" />

                        {/* Shimmer line */}
                        <motion.div
                          animate={{ top: ['0%', '100%', '0%'] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"
                        />
                      </div>
                    </div>

                    <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
                      <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Scanner</span>
                      </div>
                      <button
                        onClick={stopCamera}
                        className="w-10 h-10 bg-black/60 backdrop-blur-md rounded-full text-white flex items-center justify-center hover:bg-red-500 transition-all"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    {/* Camera Controls */}
                    <div className="absolute bottom-10 left-0 right-0 flex items-center justify-center">
                      <button
                        onClick={captureImage}
                        className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl p-1.5 active:scale-95 transition-all group"
                      >
                        <div className="w-full h-full rounded-full border-4 border-black/5 flex items-center justify-center">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Camera size={24} className="text-white" />
                          </div>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="drop-interface"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`relative border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-500 ${dragOver
                      ? 'border-blue-500 bg-blue-500/5 lg:scale-[1.02]'
                      : isDarkMode
                        ? 'border-white/10 bg-[#141414] hover:border-blue-500/50 hover:bg-[#1A1A1A]'
                        : 'border-slate-200 bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/30'
                      }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,image/*"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                    />

                    <div className="space-y-6">
                      <div className="flex justify-center">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/20 transform transition-all group-hover:scale-110 group-hover:rotate-3">
                            <Upload size={28} className="text-white" />
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center border-4 border-white dark:border-[#141414] shadow-lg">
                            <Check size={14} className="text-white" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          Drop Legal Assets
                        </h3>
                        <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-500'} max-w-[240px] mx-auto`}>
                          Select a document file from your storage or use our smart scanner
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-8 py-3.5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
                        >
                          <Upload size={14} />
                          Browse Files
                        </button>
                        <button
                          onClick={startCamera}
                          className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 ${isDarkMode ? 'bg-white/5 text-white hover:bg-white/10 border border-white/5' : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 shadow-sm'
                            }`}
                        >
                          <Camera size={14} />
                          Scan Document
                        </button>
                      </div>

                      <div className={`pt-6 border-t ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                        <div className="flex justify-center gap-3">
                          {['PDF', 'DOC', 'TXT', 'IMG'].map(ext => (
                            <span key={ext} className={`px-4 py-1.5 rounded-xl text-[10px] font-black border transition-all ${isDarkMode
                              ? 'bg-black/40 border-white/5 text-gray-500 hover:text-blue-500 hover:border-blue-500/20'
                              : 'bg-white border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-400 shadow-sm'
                              }`}>
                              {ext}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : isAnalyzing ? (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-xl mx-auto"
            >
              <div className={`rounded-3xl border p-8 backdrop-blur-xl relative overflow-hidden ${isDarkMode ? 'bg-[#1A1A1A]/90 border-white/5' : 'bg-white border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.08)]'}`}>
                {/* Background Glow */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/10 blur-[80px] pointer-events-none`} />

                <div className="text-center space-y-6 relative z-10">
                  <div className="flex justify-center">
                    <div className="relative">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20"
                      >
                        <Cpu size={28} className="text-white" />
                      </motion.div>

                      <div className="absolute -top-3 -right-3">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white dark:border-[#1A1A1A] shadow-md"
                        >
                          <Zap size={10} className="text-white fill-white" />
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <h3 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        Engine Processing
                      </h3>
                      <p className="text-blue-500 font-bold text-[11px] uppercase tracking-[0.2em]">
                        {analysisStage || "Initializing Analysis..."}
                      </p>
                    </div>

                    <div className="relative pt-2">
                      <div className={`w-full rounded-full h-2 overflow-hidden ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${analysisProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>

                      {/* Pulse effect on progress bar */}
                      <motion.div
                        animate={{ opacity: [0, 0.5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 bg-white/20 rounded-full pointer-events-none"
                        style={{ width: `${analysisProgress}%` }}
                      />
                    </div>

                    <p className={`text-[10px] font-black tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                      {Math.round(analysisProgress)}% TOTAL PROGRESS
                    </p>
                  </div>

                  <div className="grid grid-cols-4 gap-3 pt-4">
                    {[
                      { icon: FileCheck, text: "Structure" },
                      { icon: Shield, text: "Risk" },
                      { icon: Brain, text: "Context" },
                      { icon: Target, text: "Clauses" }
                    ].map((feature, index) => (
                      <div key={index} className="space-y-2">
                        <motion.div
                          animate={{
                            scale: analysisProgress > (index + 1) * 25 ? 1 : 0.9,
                            opacity: analysisProgress > (index + 1) * 25 ? 1 : 0.3
                          }}
                          className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center transition-all ${analysisProgress > (index + 1) * 25
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                            : isDarkMode ? 'bg-white/5 text-gray-600' : 'bg-slate-100 text-slate-400'
                            }`}
                        >
                          <feature.icon size={16} />
                        </motion.div>
                        <p className={`text-[8px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-500'
                          }`}>{feature.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : analysisResult && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-4xl mx-auto space-y-4"
            >
              {/* Header Section */}
              <div className={`rounded-2xl border p-3 md:p-4 backdrop-blur-md transition-all duration-300 ${isDarkMode ? 'bg-[#1A1A1A]/90 border-[#2A2A2A]' : 'bg-white border-slate-100 shadow-xl'
                }`}>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/10">
                      <CheckCircle size={18} className="text-white" />
                    </div>
                    <div>
                      <h3 className={`text-sm font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>ANALYSIS COMPLETE</h3>
                      <p className={`text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                        Document Type: <span className="text-blue-500">{analysisResult.documentType}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setUploadedFiles([]);
                      setAnalysisResult(null);
                    }}
                    className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-white border border-[#2A2A2A]' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                  >
                    New Analysis
                  </button>
                </div>

                {/* Score Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                  {[
                    { title: "RISK SCORE", value: analysisResult.overallScore, max: 100, color: "text-blue-500", bar: "bg-blue-500", icon: TrendingUp },
                    { title: "LEGAL COMPLIANCE", value: analysisResult.complianceScore, max: 100, color: "text-emerald-500", bar: "bg-emerald-500", icon: Shield },
                    { title: "CLARITY INDEX", value: analysisResult.readabilityScore, max: 100, color: "text-purple-500", bar: "bg-purple-500", icon: BookOpen }
                  ].map((score, index) => (
                    <div key={index} className={`rounded-xl p-2.5 border transition-all ${isDarkMode ? 'bg-[#0A0A0A]/50 border-white/5' : 'bg-slate-50/50 border-slate-100'}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>{score.title}</span>
                        <score.icon size={10} className={score.color} />
                      </div>
                      <div className="flex items-baseline gap-1 mb-1.5">
                        <span className={`text-base font-black ${score.color}`}>{score.value}</span>
                        <span className={`text-[8px] font-bold ${isDarkMode ? 'text-gray-600' : 'text-slate-400'}`}>/ 100</span>
                      </div>
                      <div className={`w-full rounded-full h-1 ${isDarkMode ? 'bg-white/5' : 'bg-slate-200'}`}>
                        <motion.div
                          className={`h-full ${score.bar} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(score.value / score.max) * 100}%` }}
                          transition={{ delay: index * 0.1, duration: 1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Issues Panel */}
                <div className={`rounded-2xl border p-4 ${isDarkMode ? 'bg-[#1A1A1A]/80 border-[#2A2A2A]' : 'bg-white border-slate-100 shadow-lg'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-red-500/10 rounded-lg flex items-center justify-center">
                      <AlertCircle size={12} className="text-red-500" />
                    </div>
                    <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Refinements Needed</h4>
                  </div>

                  <div className="space-y-2.5">
                    {analysisResult.issues.map((issue, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-2.5 rounded-xl border-l-[3px] ${issue.severity === 'high' ? 'bg-red-500/5 border-red-500' :
                          issue.severity === 'medium' ? 'bg-yellow-500/5 border-yellow-500' :
                            'bg-blue-500/5 border-blue-500'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h5 className={`text-[9px] font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{issue.title}</h5>
                          <span className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider ${issue.severity === 'high' ? 'bg-red-500/10 text-red-500' :
                            issue.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                              'bg-blue-500/10 text-blue-500'
                            }`}>
                            {issue.severity}
                          </span>
                        </div>
                        <p className={`text-[9px] leading-relaxed mb-1.5 opacity-80 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>{issue.description}</p>
                        <div className={`px-2 py-1 rounded-lg text-[8px] font-medium ${isDarkMode ? 'bg-white/[0.03] text-blue-400' : 'bg-white border border-slate-100 text-blue-600'}`}>
                          <span className="font-bold">FIX:</span> {issue.suggestion}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Recommendations Panel */}
                <div className={`rounded-2xl border p-4 ${isDarkMode ? 'bg-[#1A1A1A]/80 border-[#2A2A2A]' : 'bg-white border-slate-100 shadow-lg'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Sparkles size={12} className="text-blue-500" />
                    </div>
                    <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Strategic Insights</h4>
                  </div>

                  <div className="space-y-2">
                    {analysisResult.suggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-start gap-2 p-2 rounded-xl border transition-all ${isDarkMode
                          ? 'bg-[#0F0F0F]/30 border-white/5'
                          : 'bg-slate-50/50 border-slate-100'
                          }`}
                      >
                        <div className="w-3.5 h-3.5 bg-emerald-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle size={8} className="text-emerald-500" />
                        </div>
                        <p className={`text-[9px] leading-relaxed font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>{suggestion}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className={`mt-4 p-3 rounded-xl border relative overflow-hidden ${isDarkMode ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/5 border-blue-500/20' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100'}`}>
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                      <Quote size={24} className={isDarkMode ? 'text-white' : 'text-blue-900'} />
                    </div>
                    <h5 className={`text-[8px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>AI Summary</h5>
                    <p className={`text-[9px] leading-relaxed italic ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>"{analysisResult.summary}"</p>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                {[
                  { icon: Download, text: "Download Report", color: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20" },
                  { icon: Users, text: "Consult Expert", color: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20", action: () => setActiveTab('lawyers') },
                  { icon: Share2, text: "Share", color: isDarkMode ? "bg-white/5 hover:bg-white/10 border border-[#2A2A2A] text-white" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50" }
                ].map((btn, i) => (
                  <button
                    key={i}
                    onClick={btn.action}
                    className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 ${btn.color}`}
                  >
                    <btn.icon size={12} />
                    {btn.text}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );

  // Document Bucket Render Function
  const renderDocumentBucketTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-3 py-6"
      >
        <div className="flex justify-center">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20">
            <Paperclip size={24} className="text-white" />
          </div>
        </div>
        <div className="space-y-1">
          <h2 className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Secure Legal Vault
          </h2>
          <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
            Military-grade encryption for all your legal documents
          </p>
        </div>
      </motion.div>

      {/* Upload New Document */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`group border-2 border-dashed rounded-3xl p-8 text-center transition-all duration-500 cursor-pointer ${dragOver
            ? 'border-blue-500 bg-blue-500/5 lg:scale-[1.01]'
            : isDarkMode
              ? 'border-white/10 bg-white/[0.02] hover:border-blue-500/40 hover:bg-white/[0.04]'
              : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/30'
            }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
          />

          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                <Upload size={20} />
              </div>
            </div>
            <div className="space-y-1">
              <p className={`text-sm font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                Add New Document
              </p>
              <p className={`text-[10px] font-bold uppercase tracking-[0.1em] ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                PDF • DOCX • MAX 10MB
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Documents List */}
      <motion.div layout className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className={`text-[11px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-gray-500' : 'text-slate-500'}`}>
            DOCUMENTS <span className="text-blue-500">[{documentBucket.length}]</span>
          </h3>
          <div className="flex items-center gap-4">
            <div className="h-0.5 w-12 bg-blue-500/20 rounded-full hidden sm:block"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {documentBucket.map((doc, index) => {
              const Icon = doc.icon;
              return (
                <motion.div
                  key={doc.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`group relative rounded-3xl border p-5 transition-all duration-500 ${isDarkMode
                    ? 'bg-[#141414] border-white/5 hover:border-blue-500/40 hover:bg-[#1A1A1A] hover:shadow-2xl hover:shadow-blue-500/5'
                    : 'bg-white border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-blue-200'
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:-rotate-6 ${doc.status === 'analyzed' ? 'bg-emerald-500/10 text-emerald-500' :
                      doc.status === 'analyzing' ? 'bg-orange-500/10 text-orange-500' :
                        'bg-blue-500/10 text-blue-500'
                      }`}>
                      <Icon size={22} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className={`text-xs font-extrabold truncate leading-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        {doc.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-bold ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                          {doc.size}
                        </span>
                        <div className="w-1 h-1 bg-gray-500 rounded-full opacity-30"></div>
                        <span className={`text-[10px] font-bold ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                          {doc.uploadDate}
                        </span>
                      </div>

                      <div className="mt-3">
                        {doc.status === 'analyzed' ? (
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/5 border border-blue-500/10">
                              <TrendingUp size={10} className="text-blue-500" />
                              <span className="text-[9px] font-black text-blue-500">{doc.analysisScore}%</span>
                            </div>
                            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${doc.riskLevel === 'Low' ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500' :
                              doc.riskLevel === 'Medium' ? 'bg-yellow-500/5 border-yellow-500/10 text-yellow-500' :
                                'bg-red-500/5 border-red-500/10 text-red-500'
                              }`}>
                              <Shield size={10} />
                              <span className="text-[9px] font-black uppercase">{doc.riskLevel}</span>
                            </div>
                          </div>
                        ) : doc.status === 'analyzing' ? (
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/5 border border-orange-500/10 w-fit">
                            <Loader size={10} className="text-orange-500 animate-spin" />
                            <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Processing...</span>
                          </div>
                        ) : (
                          <span className={`text-[9px] font-black tracking-widest uppercase ${isDarkMode ? 'text-gray-600' : 'text-slate-400'}`}>
                            Queued
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-6">
                    <button
                      className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${doc.status === 'analyzed'
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-600/20 active:scale-95'
                        : doc.status === 'analyzing'
                          ? 'bg-gray-500/10 text-gray-500 cursor-not-allowed border border-gray-500/10'
                          : isDarkMode
                            ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                            : 'bg-slate-50 text-slate-500 hover:bg-slate-800 hover:text-white border border-slate-100 hover:border-slate-800'
                        }`}
                      disabled={doc.status === 'analyzing'}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (doc.status === 'analyzed') {
                          setSelectedReport(doc);
                          setShowReportModal(true);
                        } else if (doc.status === 'pending') {
                          // Trigger analysis flow if needed
                        }
                      }}
                    >
                      {doc.status === 'analyzed' ? 'View Findings' :
                        doc.status === 'analyzing' ? 'Analyzing...' : 'Begin AI Review'}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('lawyers');
                      }}
                      className="p-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-90"
                      title="Send to Lawyer"
                    >
                      <Users size={16} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {documentBucket.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <div className="w-20 h-20 bg-blue-500/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-blue-500/20">
                <FileText size={32} className="text-blue-500 opacity-40" />
              </div>
              <p className={`text-sm font-black tracking-wide ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                YOUR VAULT IS EMPTY
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all"
              >
                Upload First File
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );

  // Professional Document Analysis Report Modal
  const DocumentReportModal = ({ isOpen, onClose, report }) => {
    if (!isOpen || !report) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className={`${isDarkMode ? 'bg-[#1A1A1A] border-[#2A2A2A]' : 'bg-white border-slate-200'} rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border max-w-2xl w-full max-h-[85vh] overflow-hidden`}
          >
            {/* Modal Header */}
            <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FileCheck size={20} className="text-white" />
                </div>
                <div>
                  <h2 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Analysis Report</h2>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>AI PREVIEW • v1.0</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-xl transition-all ${isDarkMode ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-slate-400 hover:bg-slate-100'}`}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(85vh-140px)] p-6">
              <div className="space-y-6">
                {/* Document Status Card */}
                <div className={`rounded-2xl p-4 border ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <FileText size={18} className="text-blue-500" />
                    <div>
                      <h3 className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{report.name}</h3>
                      <p className={`text-[9px] font-bold uppercase tracking-tight ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>Analyzed on {report.uploadDate}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {
                        label: 'SCORE',
                        value: `${report.analysisScore}%`,
                        color: report.analysisScore >= 80 ? 'text-emerald-500' : 'text-orange-500'
                      },
                      {
                        label: 'RISK',
                        value: report.riskLevel.toUpperCase(),
                        color: report.riskLevel === 'Low' ? 'text-emerald-500' : report.riskLevel === 'Medium' ? 'text-orange-500' : 'text-red-500'
                      },
                      {
                        label: 'TYPE',
                        value: 'LEGAL',
                        color: 'text-blue-500'
                      }
                    ].map((stat, i) => (
                      <div key={i} className={`p-2 rounded-xl text-center border ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-white border-slate-200/50'}`}>
                        <p className={`text-[8px] font-bold uppercase tracking-tighter mb-1 ${isDarkMode ? 'text-gray-600' : 'text-slate-400'}`}>{stat.label}</p>
                        <p className={`text-[11px] font-bold ${stat.color}`}>{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Simulated Content Sections */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>Key Findings</h4>
                    <div className={`p-4 rounded-xl border leading-relaxed text-[11px] ${isDarkMode ? 'bg-white/[0.01] border-white/5 text-gray-400' : 'bg-slate-50/50 border-slate-100 text-slate-600'}`}>
                      The document has been scanned for potential vulnerabilities and legal inconsistencies. Our AI detected an overall score of {report.analysisScore}% which suggests a {report.riskLevel.toLowerCase()} level of legal exposure.
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>Actionable Advice</h4>
                    <ul className="space-y-2">
                      {[1, 2, 3].map(i => (
                        <li key={i} className="flex gap-2 text-[11px]">
                          <CheckCircle size={12} className="text-emerald-500 mt-0.5" />
                          <span className={isDarkMode ? 'text-gray-300' : 'text-slate-700'}>Review section {i}.4 for potential ambiguity in termination clauses.</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`px-6 py-4 border-t flex items-center justify-center gap-3 ${isDarkMode ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50'}`}>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-blue-600/20 transition-all">
                <Download size={14} />
                Download PDF
              </button>
              <button
                onClick={() => {
                  onClose();
                  setActiveTab('lawyers');
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${isDarkMode ? 'bg-white/5 border-[#2A2A2A] text-white hover:bg-white/10' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
              >
                <Users size={14} />
                Expert Review
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // Enhanced Chat Interface with Professional UI
  const ChatInterface = ({ isOpen, onClose, lawyer }) => {
    const [localMessages, setLocalMessages] = useState([]);
    const [localNewMessage, setLocalNewMessage] = useState('');
    const [isTypingIndicator, setIsTypingIndicator] = useState(false);
    const messagesEndRef = useRef(null);

    // Initialize messages when modal opens
    useEffect(() => {
      if (isOpen && lawyer) {
        setLocalMessages([{
          id: 1,
          sender: 'lawyer',
          content: `Hello! I'm ${lawyer.name}. I've reviewed your document. How can I assist you further?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        setLocalMessages([]);
        setLocalNewMessage('');
      }
    }, [isOpen, lawyer]);

    // Auto scroll to bottom
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [localMessages, isTypingIndicator]);

    const handleSendMessage = useCallback((e) => {
      e?.preventDefault();
      if (!localNewMessage.trim()) return;

      const userMessage = {
        id: Date.now(),
        content: localNewMessage,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setLocalMessages(prev => [...prev, userMessage]);
      setLocalNewMessage('');
      setIsTypingIndicator(true);

      // Simulate lawyer response
      setTimeout(() => {
        const responses = [
          "I see. Based on the liability clause, we should definitely renegotiate that term.",
          "Good point. I can draft an amendment to address this specific concern for you.",
          "Legally speaking, that provision is quite standard, but we can add a rider for extra protection.",
          "I recommend we schedule a brief call to discuss the finer details of this agreement."
        ];

        const lawyerResponse = {
          id: Date.now() + 1,
          content: responses[Math.floor(Math.random() * responses.length)],
          sender: 'lawyer',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setLocalMessages(prev => [...prev, lawyerResponse]);
        setIsTypingIndicator(false);
      }, 2000);
    }, [localNewMessage]);

    if (!isOpen) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 sm:p-6"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`flex flex-col w-full max-w-lg h-[600px] max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden border ${isDarkMode
              ? 'bg-[#141414] border-white/10'
              : 'bg-white border-white/40'
              }`}
          >
            {/* Header */}
            <div className={`relative px-6 py-4 border-b flex items-center justify-between shrink-0 ${isDarkMode
              ? 'bg-[#1A1A1A] border-white/5'
              : 'bg-white/80 border-slate-100 backdrop-blur-xl'
              }`}>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-br from-blue-500 to-purple-600">
                    <img
                      src={lawyer?.avatar}
                      alt={lawyer?.name}
                      className="w-full h-full rounded-full object-cover border-2 border-[#141414]"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-[#141414] rounded-full">
                    <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75"></span>
                  </div>
                </div>
                <div>
                  <h3 className={`font-bold text-sm flex items-center gap-1.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {lawyer?.name}
                    <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                  </h3>
                  <p className={`text-[10px] font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                    {lawyer?.specialization || 'Legal Expert'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className={`p-2 rounded-full transition-all active:scale-95 ${isDarkMode
                    ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                    : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'
                    }`}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className={`flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hidden ${isDarkMode ? 'bg-[#0A0A0A]' : 'bg-[#F8FAFC]'}`}>
              <div className="text-center py-4">
                <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${isDarkMode
                  ? 'bg-white/5 border-white/5 text-gray-500'
                  : 'bg-slate-100 border-slate-200 text-slate-400'
                  }`}>
                  Session Started
                </span>
              </div>

              {localMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`relative max-w-[80%] px-5 py-3.5 rounded-2xl shadow-sm text-xs leading-relaxed ${message.sender === 'user'
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-sm'
                    : isDarkMode
                      ? 'bg-[#1A1A1A] text-gray-200 border border-white/5 rounded-tl-sm'
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm shadow-sm'
                    }`}>
                    <p>{message.content}</p>
                    <span className={`text-[9px] mt-1.5 block opacity-60 font-medium ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                      }`}>
                      {message.timestamp}
                    </span>
                  </div>
                </motion.div>
              ))}

              {isTypingIndicator && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className={`px-4 py-3 rounded-2xl rounded-tl-sm border ${isDarkMode
                    ? 'bg-[#1A1A1A] border-white/5'
                    : 'bg-white border-slate-100'
                    }`}>
                    <div className="flex gap-1.5">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0 }}
                        className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-gray-500' : 'bg-slate-400'}`}
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                        className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-gray-500' : 'bg-slate-400'}`}
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.4 }}
                        className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-gray-500' : 'bg-slate-400'}`}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className={`p-4 border-t ${isDarkMode ? 'bg-[#141414] border-white/5' : 'bg-white border-slate-100'}`}>
              <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={localNewMessage}
                    onChange={(e) => setLocalNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className={`w-full pl-5 pr-12 py-3.5 rounded-xl text-xs font-medium transition-all outline-none ${isDarkMode
                      ? 'bg-[#1A1A1A] text-white placeholder-gray-600 focus:bg-[#202020]'
                      : 'bg-slate-50 text-slate-800 placeholder-slate-400 focus:bg-white focus:shadow-md border-transparent border focus:border-blue-100'
                      }`}
                    disabled={isTypingIndicator}
                  />
                  <button
                    type="button"
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${isDarkMode
                      ? 'text-gray-500 hover:text-white'
                      : 'text-slate-400 hover:text-slate-600'
                      }`}
                  >
                    <Paperclip size={16} />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!localNewMessage.trim() || isTypingIndicator}
                  className="p-3.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
                >
                  <Send size={18} className={localNewMessage.trim() ? 'ml-0.5' : ''} />
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  const VideoCallInterface = ({ isOpen, onClose, lawyer }) => {
    if (!isOpen) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full aspect-video relative overflow-hidden"
        >
          {/* Video Area */}
          <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            {/* Lawyer Video */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <img src={lawyer?.avatar} alt={lawyer?.name} className="w-56 h-56 rounded-full object-cover" />
              </div>
            </div>

            {/* User Video (Picture in Picture) */}
            <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-xl border-2 border-gray-600 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                <User size={32} className="text-gray-400" />
              </div>
            </div>

            {/* Call Status */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Connected with {lawyer?.name}</span>
              </div>
            </div>

            {/* Call Duration */}
            <div className="absolute top-16 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg">
              <span className="text-sm">05:23</span>
            </div>
          </div>

          {/* Call Controls */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
            <button className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-white transition-colors">
              <MessageCircle size={20} />
            </button>
            <button className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-white transition-colors">
              <Video size={20} />
            </button>
            <button
              onClick={() => {
                setCallInProgress(false);
                onClose();
              }}
              className="w-14 h-14 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <Phone size={24} className="rotate-[135deg]" />
            </button>
            <button className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-white transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 p-2 rounded-full"
          >
            <X size={20} />
          </button>
        </motion.div>
      </motion.div>
    );
  };

  // Enhanced Lawyer Card Component
  const LawyerCard = ({ lawyer, isSelected }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className={`group relative rounded-2xl border p-4 transition-all duration-500 overflow-hidden ${isSelected
        ? 'ring-2 ring-blue-500 border-blue-500 shadow-xl shadow-blue-500/10'
        : isDarkMode
          ? 'bg-[#141414] border-white/5 hover:border-blue-500/20'
          : 'bg-white border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-blue-200'
        }`}
      onClick={() => setSelectedLawyer(lawyer)}
    >
      {lawyer.badges.includes("Senior Partner") && (
        <div className="absolute top-0 right-0 z-10">
          <div className="bg-gradient-to-l from-amber-500 to-orange-600 text-white px-2.5 py-1 rounded-bl-xl text-[8px] font-black uppercase tracking-widest shadow-lg">
            PREMIUM
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white/10 shadow-lg transition-transform group-hover:rotate-3">
              <img
                src={lawyer.avatar}
                alt={lawyer.name}
                className="w-full h-full object-cover"
              />
            </div>
            {lawyer.verified && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white dark:border-[#141414] shadow-lg">
                <CheckCircle size={8} className="text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className={`text-xs font-black tracking-tight truncate leading-none mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {lawyer.name}
            </h3>
            <p className="text-blue-500 font-black text-[9px] uppercase tracking-wider mb-1.5">
              {lawyer.specialization}
            </p>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                <Star size={8} className="text-yellow-500 fill-yellow-500" />
                <span className="text-[9px] font-black text-yellow-600">{lawyer.rating}</span>
              </div>
              <span className={`text-[9px] font-bold ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                ({lawyer.reviews})
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          {[
            { label: 'EXPERIENCE', value: `${lawyer.experience}+ Years`, color: 'text-blue-500', bg: 'bg-blue-500/5' },
            { label: 'SUCCESS', value: `${lawyer.successRate}% Rate`, color: 'text-emerald-500', bg: 'bg-emerald-500/5' }
          ].map((stat, i) => (
            <div key={i} className={`rounded-lg p-2 border ${isDarkMode ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50/50'} ${stat.bg}`}>
              <div className={`text-[7px] font-black uppercase tracking-widest mb-0.5 ${isDarkMode ? 'text-gray-500' : 'text-slate-500'}`}>
                {stat.label}
              </div>
              <div className={`text-[10px] font-black ${stat.color}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1">
          {lawyer.badges.slice(0, 2).map((badge, index) => (
            <span
              key={index}
              className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${isDarkMode
                ? 'bg-white/5 text-gray-400 border border-white/5'
                : 'bg-slate-50 text-slate-500 border border-slate-100'
                }`}
            >
              {badge}
            </span>
          ))}
        </div>

        <div className={`flex items-center justify-between pt-3 border-t border-dashed ${isDarkMode ? 'border-white/10' : 'border-slate-100'}`}>
          <div>
            <p className={`text-[8px] font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-600' : 'text-slate-400'}`}>RATE</p>
            <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{lawyer.hourlyRate}/hr</p>
          </div>
          <div className="text-right">
            <p className={`text-[8px] font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-600' : 'text-slate-400'}`}>STATUS</p>
            <div className="flex items-center gap-1 justify-end">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <p className="text-[9px] font-black text-emerald-500 uppercase">Online</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedLawyer(lawyer);
              setShowChat(true);
            }}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
          >
            Chat
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedLawyer(lawyer);
              setShowVideoCall(true);
              setCallInProgress(true);
            }}
            className={`flex-none p-2.5 rounded-lg border transition-all active:scale-95 ${isDarkMode
              ? 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
          >
            <Video size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );

  // Legal Services Render Function
  const renderLegalServicesTab = () => (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
            <Briefcase size={28} className="text-white" />
          </div>
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
            Legal Services
          </h2>
          <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-dark-text-secondary' : 'text-slate-600'
            }`}>
            Professional legal services for your business
          </p>
        </div>
      </motion.div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            id: 1,
            title: "Expert Document Review",
            description: "Detailed manual review by senior legal partners with trackable changes.",
            icon: Search,
            features: ["Personalized advice", "Risk mitigation", "Clause optimization", "24/48h delivery"],
            price: "₹2,999",
            popular: true,
            gradient: "from-blue-600 to-indigo-700"
          },
          {
            id: 2,
            title: "Legal Drafting",
            description: "Custom contract drafting from scratch based on your specific requirements.",
            icon: Edit,
            features: ["Custom templates", "Compliance ready", "Multiple revisions", "Quick turnaround"],
            price: "₹4,999",
            gradient: "from-emerald-600 to-teal-700"
          },
          {
            id: 3,
            title: "IP & Trademark",
            description: "Comprehensive protection for your intellectual property and brand assets.",
            icon: Award,
            features: ["Search & filing", "Copyright protection", "Portfolio audit", "Global advisory"],
            price: "₹9,999",
            gradient: "from-amber-600 to-orange-700"
          },
          {
            id: 4,
            title: "Employment Law",
            description: "Employee agreements, ESOP structures, and HR compliance review.",
            icon: Users,
            features: ["Offer letters", "ESOP docs", "Policy handbook", "Termination docs"],
            price: "₹3,499",
            gradient: "from-purple-600 to-pink-700"
          },
          {
            id: 5,
            title: "Startup Package",
            description: "Foundational legal suite for new ventures and fundraising support.",
            icon: Zap,
            features: ["Incorporation", "SHA drafting", "Founder agreements", "Compliance kit"],
            price: "₹14,999",
            gradient: "from-cyan-600 to-blue-700"
          },
          {
            id: 6,
            title: "Real Estate Legal",
            description: "Property due diligence, lease review, and registration assistance.",
            icon: MapPin,
            features: ["Title search", "Deed review", "RERA compliance", "Lease drafting"],
            price: "₹5,499",
            gradient: "from-rose-600 to-red-700"
          }
        ].map((service, index) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className={`group relative rounded-2xl border p-4 transition-all duration-500 overflow-hidden ${isDarkMode
                ? 'bg-[#141414] border-white/5 hover:border-blue-500/20 hover:shadow-xl hover:shadow-blue-500/5'
                : 'bg-white border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]'
                }`}
            >
              {service.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-gradient-to-l from-blue-600 to-indigo-600 text-white px-2.5 py-1 rounded-bl-xl text-[8px] font-black tracking-widest uppercase">
                    BEST VALUE
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {/* Service Icon */}
                <div className={`w-10 h-10 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
                  <Icon size={18} className="text-white" />
                </div>

                {/* Service Info */}
                <div className="space-y-1">
                  <h3 className={`text-sm font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{service.title}</h3>
                  <p className={`text-[10px] leading-relaxed font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>{service.description}</p>
                </div>

                {/* Features */}
                <div className="space-y-1.5 py-1">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${service.gradient}`}></div>
                      <span className={`text-[9px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Price & Action */}
                <div className={`flex items-center justify-between pt-3 border-t border-dashed ${isDarkMode ? 'border-white/10' : 'border-slate-100'}`}>
                  <div>
                    <div className={`text-base font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {service.price}
                    </div>
                    <div className={`text-[8px] font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>Starting Rate</div>
                  </div>
                  <button
                    onClick={() => setSelectedService(service)}
                    className={`px-4 py-2 bg-gradient-to-r ${service.gradient} text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg transition-all hover:brightness-110 active:scale-95`}
                  >
                    Select
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`rounded-2xl border p-6 text-center transition-all duration-500 ${isDarkMode
          ? 'bg-gradient-to-br from-[#1A1A1A] to-[#141414] border-white/5'
          : 'bg-white border-slate-100 shadow-xl'
          }`}
      >
        <div className="max-w-xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <Sparkles size={10} className="text-indigo-500" />
            <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em]">Bespoke Solutions</span>
          </div>
          <h3 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Need Custom Legal Protection?</h3>
          <p className={`text-xs font-medium leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
            Can't find a service that fits your specific needs? Our network of verified experts can provide tailored documentation and advice.
          </p>
          <div className="pt-2">
            <button className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 transition-all active:scale-95">
              Contact Senior Partner
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // My Cases Render Function
  const renderMyCasesTab = () => (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-3 py-6"
      >
        <div className="flex justify-center">
          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/20">
            <Clock size={24} className="text-white" />
          </div>
        </div>
        <div className="space-y-1">
          <h2 className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Case Tracker
          </h2>
          <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
            Real-time status and history of your legal interactions
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Total Cases", value: myCases.length, icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
          { title: "Completed", value: myCases.filter(c => c.status === 'completed').length, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { title: "In Progress", value: myCases.filter(c => c.status === 'in-progress').length, icon: Loader, color: "text-orange-500", bg: "bg-orange-500/10" },
          { title: "Documents", value: documentBucket.length, icon: Paperclip, color: "text-purple-500", bg: "bg-purple-500/10" }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-3xl border p-4 transition-all duration-300 ${isDarkMode
                ? 'bg-[#141414] border-white/5 shadow-xl'
                : 'bg-white border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
                }`}
            >
              <div className="flex flex-col gap-3">
                <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon size={18} className={stat.icon === Loader ? 'animate-spin-slow' : ''} />
                </div>
                <div>
                  <div className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {stat.value}
                  </div>
                  <div className={`text-[10px] font-black uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                    {stat.title}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Cases List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className={`text-[11px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-gray-500' : 'text-slate-500'}`}>
            RECENT ACTIVITY
          </h3>
        </div>

        <div className="space-y-4">
          {myCases.map((case_, index) => {
            const Icon = case_.icon;
            return (
              <motion.div
                key={case_.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`group relative rounded-3xl border p-5 transition-all duration-500 ${isDarkMode
                  ? 'bg-[#141414] border-white/5 hover:bg-[#1A1A1A] hover:border-blue-500/30'
                  : 'bg-white border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-blue-200'
                  }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:-rotate-3 transition-transform ${case_.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                      case_.status === 'in-progress' ? 'bg-orange-500/10 text-orange-500' :
                        'bg-blue-500/10 text-blue-500'
                      }`}>
                      <Icon size={22} />
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h4 className={`text-base font-black tracking-tight truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{case_.title}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${case_.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                          'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                          }`}>
                          {case_.status.replace('-', ' ')}
                        </span>
                      </div>
                      <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>{case_.description}</p>

                      <div className="flex flex-wrap items-center gap-4 mt-3">
                        <div className="flex items-center gap-1.5">
                          <Brain size={12} className="text-blue-500" />
                          <span className={`text-[10px] font-bold ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>{case_.type}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-gray-400" />
                          <span className={`text-[10px] font-bold ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>{case_.date}</span>
                        </div>
                        {case_.lawyer && (
                          <div className="flex items-center gap-1.5">
                            <User size={12} className="text-emerald-500" />
                            <span className={`text-[10px] font-bold ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>Lead: {case_.lawyer}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center">
                    <button className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'bg-white/5 text-white hover:bg-white/10 border border-white/5' : 'bg-slate-50 text-slate-900 hover:bg-slate-900 hover:text-white border border-slate-100'
                      }`}>
                      Details
                    </button>
                    {case_.status === 'in-progress' && (
                      <button
                        onClick={() => {
                          setActiveTab('lawyers');
                          if (case_.lawyer) {
                            const lawyer = lawyers.find(l => l.name === case_.lawyer);
                            if (lawyer) setSelectedLawyer(lawyer);
                          }
                        }}
                        className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
                      >
                        Contact
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {myCases.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-blue-500/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-blue-500/20">
                <FileText size={24} className="text-blue-500 opacity-40" />
              </div>
              <p className={`text-[11px] font-black tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>NO ACTIVE CASES FOUND</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderNavigationTabs = () => (
    <div
      style={{ transform: 'translateZ(0)' }}
      className={`sticky top-[56px] sm:top-[64px] z-[40] mb-5 py-1.5 transition-all duration-500 backdrop-blur-md ${isDarkMode ? 'bg-[#0A0A0A]/95' : 'bg-[#F8FAFC]/95'}`}
    >
      <div className={`relative p-1 rounded-xl border transition-all max-w-xl mx-auto backdrop-blur-xl ${isDarkMode ? 'bg-[#1A1A1A]/80 border-white/5 shadow-xl' : 'bg-white/80 border-slate-100 shadow-lg'
        }`}>

        {/* Beta Status Tag */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg z-50">
          <div className="flex items-center gap-1">
            <Star size={8} className="text-white fill-white animate-pulse" />
            <span className="text-[8px] font-black text-white uppercase tracking-widest">Beta Module</span>
          </div>
        </div>
        <div className="flex">
          {[
            { id: 'analyze', label: 'AI', icon: Brain, color: 'text-blue-500' },
            { id: 'bucket', label: 'Vault', icon: Paperclip, color: 'text-purple-500' },
            { id: 'lawyers', label: 'Experts', icon: Users, color: 'text-emerald-500' },
            { id: 'services', label: 'Services', icon: Briefcase, color: 'text-orange-500' },
            { id: 'status', label: 'Tracker', icon: FileText, color: 'text-pink-500' }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : isDarkMode
                    ? 'text-gray-500 hover:text-white hover:bg-white/5'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
              >
                <Icon size={14} />
                <span className="hidden xs:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#0A0A0A]' : 'bg-[#F8FAFC]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pt-[72px]">
        {renderNavigationTabs()}

        <motion.div
          className="mt-6 min-h-[500px]"
        >
          <AnimatePresence mode="wait" initial={false}>
            {activeTab === 'analyze' && (
              <motion.div
                key="analyze"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                {renderDocumentAnalysisTab()}
              </motion.div>
            )}

            {activeTab === 'bucket' && (
              <motion.div
                key="bucket"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                {renderDocumentBucketTab()}
              </motion.div>
            )}

            {activeTab === 'lawyers' && (
              <motion.div
                key="lawyers"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-2 py-3"
                >
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-xl shadow-emerald-500/20">
                        <Users size={18} className="text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border-4 border-[#0A0A0A]">
                        <Check size={8} className="text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <h2 className={`text-sm font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Expert Consultation
                    </h2>
                    <p className={`text-[9px] font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      Verified legal professionals ready to review your case
                    </p>
                  </div>
                </motion.div>

                {/* Filter Bar */}
                <div className={`sticky top-[115px] z-30 mb-6 p-3 rounded-2xl border backdrop-blur-xl transition-all duration-500 ${isDarkMode
                  ? 'bg-[#141414]/95 border-white/5 shadow-2xl'
                  : 'bg-white/95 border-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.05)]'
                  }`}>
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                      <Search size={12} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-600' : 'text-slate-400'}`} />
                      <input
                        type="text"
                        placeholder="Search by name, expertise or firm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-9 pr-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${isDarkMode
                          ? 'bg-black/40 border-white/5 text-white focus:border-blue-500 placeholder-gray-700'
                          : 'bg-slate-50 border-slate-200 focus:border-blue-400 placeholder-slate-400'
                          }`}
                      />
                    </div>

                    <div className="flex gap-2">
                      <div className="relative">
                        <Filter size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-500" />
                        <select
                          value={filterCategory}
                          onChange={(e) => setFilterCategory(e.target.value)}
                          className={`pl-9 pr-8 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border transition-all appearance-none cursor-pointer ${isDarkMode
                            ? 'bg-black/40 border-white/5 text-gray-400 hover:text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                        >
                          <option value="All">All Categories</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <button className={`p-3 rounded-xl border transition-all hover:scale-105 active:scale-95 ${isDarkMode
                        ? 'bg-white/5 border-white/10 text-gray-400 hover:text-blue-500 hover:border-blue-500/20'
                        : 'bg-white border-slate-200 text-slate-400 hover:text-blue-500'
                        }`}>
                        <Zap size={14} className="fill-current" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Lawyer Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredLawyers.map(lawyer => (
                    <LawyerCard key={lawyer.id} lawyer={lawyer} isSelected={selectedLawyer?.id === lawyer.id} />
                  ))}
                </div>

                {filteredLawyers.length === 0 && (
                  <div className="py-20 text-center">
                    <div className="w-16 h-16 bg-blue-500/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-blue-500/20">
                      <Users size={24} className="text-blue-500 opacity-40" />
                    </div>
                    <p className={`text-xs font-black tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                      NO MATCHING PROFESSIONALS FOUND
                    </p>
                    <button
                      onClick={() => { setSearchTerm(''); setFilterCategory('All'); }}
                      className="mt-4 text-[9px] font-black text-blue-500 uppercase tracking-widest hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'services' && (
              <motion.div
                key="services"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                {renderLegalServicesTab()}
              </motion.div>
            )}

            {activeTab === 'status' && (
              <motion.div
                key="status"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                {renderMyCasesTab()}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modals */}
      <DocumentReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        report={selectedReport}
      />
      <ChatInterface
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        lawyer={selectedLawyer}
      />
      <VideoCallInterface
        isOpen={showVideoCall}
        onClose={() => setShowVideoCall(false)}
        lawyer={selectedLawyer}
      />

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 p-3 bg-blue-600 text-white rounded-full shadow-2xl z-50 hover:bg-blue-700 transition-all"
          >
            <ChevronDown className="rotate-180" size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentReview;
