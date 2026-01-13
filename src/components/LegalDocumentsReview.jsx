import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '../hooks/useDarkMode';
import {
  Upload, FileText, User, Star, MessageCircle, Clock, DollarSign,
  Filter, Search, Calendar, CheckCircle, AlertCircle, Eye, Download,
  Send, Phone, Video, Shield, Award, BookOpen, Briefcase, Scale,
  Building, Users, Heart, ChevronRight, X, Paperclip, ArrowRight,
  Edit, Sparkles, Brain, Zap, FileCheck, Cpu, Target, TrendingUp,
  Loader, RefreshCw, ChevronDown, MoreVertical, Globe, MapPin
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
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollProgress(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  // Document Analysis Component
  const DocumentAnalysisTab = () => (
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

      {!uploadedFiles.length && !isAnalyzing && !analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${dragOver
              ? 'border-blue-500 bg-blue-500/5 scale-[1.01]'
              : isDarkMode
                ? 'border-[#2A2A2A] bg-[#1A1A1A]/30 hover:border-blue-500/50 hover:bg-[#1A1A1A]/50'
                : 'border-slate-200 bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/30'
              }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />

            <div className="space-y-3">
              <div className="flex justify-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                  <Upload size={18} className="text-white" />
                </div>
              </div>

              <div className="space-y-0.5">
                <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  Drop your document here
                </h3>
                <p className={`text-[11px] ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                  or <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-500 hover:underline font-bold"
                  >
                    browse files
                  </button> to get started
                </p>
              </div>

              <div className="flex justify-center gap-2 pt-1">
                {['PDF', 'DOC', 'DOCX', 'TXT'].map(ext => (
                  <span key={ext} className={`px-2 py-0.5 rounded text-[9px] font-bold border ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-slate-200 text-slate-500'
                    }`}>
                    {ext}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl mx-auto"
        >
          <div className={`rounded-2xl border p-6 backdrop-blur-md ${isDarkMode ? 'bg-[#1A1A1A]/80 border-[#2A2A2A]' : 'bg-white border-slate-200 shadow-xl'}`}>
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
                  >
                    <Brain size={20} className="text-white" />
                  </motion.div>

                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [-5, -15, -5],
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1.1, 0.8]
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: i * 0.6,
                        ease: "easeInOut"
                      }}
                      className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full"
                      style={{
                        top: `${20 + i * 15}%`,
                        left: `${30 + i * 25}%`
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  Analyzing Document
                </h3>

                <p className="text-blue-500 font-bold text-[10px] uppercase tracking-wider">
                  {analysisStage}
                </p>

                <div className={`w-full rounded-full h-1 overflow-hidden ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${analysisProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <p className={`text-[9px] font-bold ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                  {Math.round(analysisProgress)}% COMPLETE
                </p>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-2">
                {[
                  { icon: FileCheck, text: "Structure" },
                  { icon: Shield, text: "Risk" },
                  { icon: Cpu, text: "AI Core" },
                  { icon: Target, text: "Advice" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    animate={{
                      opacity: analysisProgress > (index + 1) * 25 ? 1 : 0.4,
                      y: analysisProgress > (index + 1) * 25 ? 0 : 2
                    }}
                    className="space-y-1"
                  >
                    <div className={`w-7 h-7 mx-auto rounded-lg flex items-center justify-center ${analysisProgress > (index + 1) * 25
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : isDarkMode ? 'bg-white/5 text-gray-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                      <feature.icon size={12} />
                    </div>
                    <p className={`text-[8px] font-bold uppercase tracking-tight ${isDarkMode ? 'text-gray-500' : 'text-slate-500'
                      }`}>{feature.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto space-y-4"
        >
          <div className={`rounded-2xl border p-4 backdrop-blur-md transition-all duration-300 ${isDarkMode ? 'bg-[#1A1A1A]/80 border-[#2A2A2A]' : 'bg-white border-slate-100 shadow-xl'
            }`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle size={20} className="text-white" />
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Analysis Complete</h3>
                  <p className={`text-[10px] uppercase font-bold tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                    Type: <span className="text-blue-500">{analysisResult.documentType}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setUploadedFiles([]);
                  setAnalysisResult(null);
                }}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-white border border-[#2A2A2A]' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                  }`}
              >
                New Analysis
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              {[
                { title: "OVERALL SCORE", value: analysisResult.overallScore, max: 100, color: "text-blue-500", bar: "bg-blue-500", icon: TrendingUp },
                { title: "COMPLIANCE", value: analysisResult.complianceScore, max: 100, color: "text-emerald-500", bar: "bg-emerald-500", icon: Shield },
                { title: "READABILITY", value: analysisResult.readabilityScore, max: 100, color: "text-purple-500", bar: "bg-purple-500", icon: BookOpen }
              ].map((score, index) => (
                <div key={index} className={`rounded-xl p-3 border transition-all ${isDarkMode ? 'bg-[#0F0F0F]/50 border-[#2A2A2A]' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-slate-500'}`}>{score.title}</span>
                    <score.icon size={11} className={score.color} />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-lg font-bold ${score.color}`}>{score.value}</span>
                    <span className={`text-[9px] font-bold ${isDarkMode ? 'text-gray-600' : 'text-slate-400'}`}>/ {score.max}</span>
                  </div>
                  <div className={`mt-2 w-full rounded-full h-1 ${isDarkMode ? 'bg-white/5' : 'bg-slate-200'}`}>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`rounded-2xl border p-4 ${isDarkMode ? 'bg-[#1A1A1A]/50 border-[#2A2A2A]' : 'bg-white border-slate-100 shadow-lg'}`}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <AlertCircle size={14} className="text-red-500" />
                </div>
                <h4 className={`text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Detected Issues</h4>
              </div>

              <div className="space-y-3">
                {analysisResult.issues.map((issue, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-3 rounded-xl border-l-2 ${issue.severity === 'high' ? 'bg-red-500/5 border-red-500' :
                      issue.severity === 'medium' ? 'bg-yellow-500/5 border-yellow-500' :
                        'bg-blue-500/5 border-blue-500'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <h5 className={`text-[11px] font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{issue.title}</h5>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${issue.severity === 'high' ? 'bg-red-500/10 text-red-500' :
                        issue.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                          'bg-blue-500/10 text-blue-500'
                        }`}>
                        {issue.type}
                      </span>
                    </div>
                    <p className={`text-[10px] leading-relaxed mb-2 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>{issue.description}</p>
                    <div className={`p-2 rounded-lg text-[10px] font-medium leading-relaxed ${isDarkMode ? 'bg-white/[0.03] text-blue-400' : 'bg-blue-50 text-blue-700'}`}>
                      <span className="font-bold">Advice:</span> {issue.suggestion}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className={`rounded-2xl border p-4 ${isDarkMode ? 'bg-[#1A1A1A]/50 border-[#2A2A2A]' : 'bg-white border-slate-100 shadow-lg'}`}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Sparkles size={14} className="text-blue-500" />
                </div>
                <h4 className={`text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Recommendations</h4>
              </div>

              <div className="space-y-2">
                {analysisResult.suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all ${isDarkMode
                      ? 'bg-[#0F0F0F]/30 border-[#2A2A2A]'
                      : 'bg-slate-50/50 border-slate-100'
                      }`}
                  >
                    <div className="w-4 h-4 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle size={10} className="text-emerald-500" />
                    </div>
                    <p className={`text-[10px] leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>{suggestion}</p>
                  </motion.div>
                ))}
              </div>

              <div className={`mt-4 p-3 rounded-xl border ${isDarkMode ? 'bg-white/[0.02] border-[#2A2A2A]' : 'bg-slate-50 border-slate-100'}`}>
                <h5 className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? 'text-gray-500' : 'text-slate-500'}`}>Executive Summary</h5>
                <p className={`text-[10px] leading-relaxed italic ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>"{analysisResult.summary}"</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center pt-2">
            {[
              { icon: Download, text: "Download Report", color: "bg-blue-600 hover:bg-blue-700 text-white" },
              { icon: Users, text: "Consult Expert", color: "bg-emerald-600 hover:bg-emerald-700 text-white", action: () => setActiveTab('lawyers') },
              { icon: Send, text: "Share Analysis", color: isDarkMode ? "bg-white/5 hover:bg-white/10 border border-[#2A2A2A] text-white" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm" }
            ].map((btn, i) => (
              <button
                key={i}
                onClick={btn.action}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-lg ${btn.color}`}
              >
                <btn.icon size={12} />
                {btn.text}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );

  // Document Bucket Component
  const DocumentBucketTab = () => (
    <div className="space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2 py-4"
      >
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Paperclip size={20} className="text-white" />
          </div>
        </div>
        <div className="space-y-1">
          <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Document Repository
          </h2>
          <p className={`text-[11px] ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
            Securely manage and track your legal documents
          </p>
        </div>
      </motion.div>

      {/* Upload New Document */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-2xl mx-auto"
      >
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer ${dragOver
            ? 'border-blue-500 bg-blue-500/5 scale-[1.01]'
            : isDarkMode
              ? 'border-[#2A2A2A] bg-[#1A1A1A]/30 hover:border-blue-500/50 hover:bg-[#1A1A1A]/50'
              : 'border-slate-200 bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/30'
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

          <div className="space-y-2">
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <Upload size={18} className="text-white" />
              </div>
            </div>
            <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              Click or drag to upload new document
            </p>
            <p className={`text-[10px] uppercase font-bold tracking-tighter ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
              MAX FILE SIZE 10MB • PDF, DOC, DOCX
            </p>
          </div>
        </div>
      </motion.div>

      {/* Documents List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between px-2">
          <h3 className={`text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-slate-500'}`}>
            Documents ({documentBucket.length})
          </h3>
          <div className="flex items-center gap-2">
            {/* Filter icons or buttons could go here */}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {documentBucket.map((doc, index) => {
            const Icon = doc.icon;
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`group relative rounded-2xl border p-4 transition-all duration-300 ${isDarkMode
                  ? 'bg-[#1A1A1A]/50 border-[#2A2A2A] hover:bg-[#1A1A1A] hover:border-blue-500/50'
                  : 'bg-white border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-400'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${doc.status === 'analyzed' ? 'bg-emerald-500/10 text-emerald-500' :
                    doc.status === 'analyzing' ? 'bg-orange-500/10 text-orange-500' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                    <Icon size={20} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className={`text-xs font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      {doc.name}
                    </h4>
                    <p className={`text-[9px] uppercase font-bold tracking-tight mt-0.5 ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                      {doc.size} • {doc.uploadDate}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      {doc.status === 'analyzed' && doc.analysisScore ? (
                        <>
                          <div className="flex items-center gap-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${doc.riskLevel === 'Low' ? 'bg-green-500' :
                              doc.riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                              }`}></div>
                            <span className={`text-[9px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                              {doc.riskLevel} Risk
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp size={10} className="text-blue-500" />
                            <span className={`text-[9px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                              Score: {doc.analysisScore}/100
                            </span>
                          </div>
                        </>
                      ) : doc.status === 'analyzing' ? (
                        <div className="flex items-center gap-1.5">
                          <Loader size={12} className="text-orange-500 animate-spin" />
                          <span className="text-[9px] font-bold text-orange-500">ANALYZING...</span>
                        </div>
                      ) : (
                        <span className={`text-[9px] font-bold ${isDarkMode ? 'text-gray-600' : 'text-slate-400'}`}>
                          PENDING ANALYSIS
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-dashed border-gray-100 dark:border-white/5">
                  <button
                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${doc.status === 'analyzed'
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                      : doc.status === 'analyzing'
                        ? 'bg-orange-500/10 text-orange-500 cursor-not-allowed border border-orange-500/20'
                        : isDarkMode
                          ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-[#2A2A2A]'
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-slate-100'
                      }`}
                    disabled={doc.status === 'analyzing'}
                    onClick={() => {
                      if (doc.status === 'analyzed') {
                        setSelectedReport(doc);
                        setShowReportModal(true);
                      } else if (doc.status === 'pending') {
                        setDocumentBucket(prev =>
                          prev.map(d => d.id === doc.id ? { ...d, status: 'analyzing' } : d)
                        );
                        setTimeout(() => {
                          setDocumentBucket(prev =>
                            prev.map(d => d.id === doc.id ? {
                              ...d,
                              status: 'analyzed',
                              analysisScore: Math.floor(Math.random() * 20) + 80,
                              riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)]
                            } : d)
                          );
                        }, 3000);
                      }
                    }}
                  >
                    {doc.status === 'analyzed' ? 'View Report' :
                      doc.status === 'analyzing' ? 'Processing' : 'Analyze Now'}
                  </button>

                  <button
                    onClick={() => setActiveTab('lawyers')}
                    className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20 shadow-sm"
                    title="Send to Lawyer"
                  >
                    <Users size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}

          {documentBucket.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-100 dark:border-white/5">
                <FileText size={24} className="text-gray-400" />
              </div>
              <p className={`text-[11px] font-bold ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                NO DOCUMENTS FOUND
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 text-[10px] font-bold text-blue-500 uppercase tracking-wider hover:underline"
              >
                Upload your first document
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

  // Enhanced Chat Interface with Proper State Management
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
          content: `Hello! I'm ${lawyer.name}. I've reviewed your document. How can I help you with your legal concerns?`,
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
    }, [localMessages]);

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
          "I understand your concern. Based on the document analysis, I recommend addressing the liability clauses first.",
          "That's a valid point. Let me explain the legal implications and suggest some protective measures.",
          "I can help you with that. The document shows some areas that need immediate attention for better legal protection.",
          "Excellent question. From my analysis, here are the key risks and how we can mitigate them effectively."
        ];

        const lawyerResponse = {
          id: Date.now() + 1,
          content: responses[Math.floor(Math.random() * responses.length)],
          sender: 'lawyer',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setLocalMessages(prev => [...prev, lawyerResponse]);
        setIsTypingIndicator(false);
      }, 1500 + Math.random() * 1000);
    }, [localNewMessage]);

    if (!isOpen) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`${isDarkMode ? 'bg-dark-bg-secondary border-dark-border' : 'bg-white border-slate-200'} rounded-2xl shadow-2xl border max-w-md w-full max-h-[80vh] flex flex-col transition-colors duration-300`}
          >
            {/* Chat Header */}
            <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? 'border-dark-border bg-dark-bg-tertiary' : 'border-slate-200 bg-slate-50'} rounded-t-2xl transition-colors duration-300`}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={lawyer?.avatar} alt={lawyer?.name} className="w-12 h-12 rounded-full border-2 border-white shadow-lg" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 className={`font-bold transition-colors duration-300 ${isDarkMode ? 'text-dark-text' : 'text-slate-800'}`}>
                    {lawyer?.name || 'Legal Assistant'}
                  </h3>
                  <p className="text-sm text-green-500 font-medium">● Online - Ready to Help</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-xl hover:bg-opacity-10 hover:bg-slate-500 transition-all duration-200 ${isDarkMode ? 'text-dark-text hover:bg-dark-bg' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto min-h-0">
              {localMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-start gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${message.sender === 'user' ? 'bg-gradient-to-br from-indigo-500 to-purple-500' : 'bg-gradient-to-br from-emerald-500 to-green-500'}`}>
                    {message.sender === 'user' ?
                      <User size={16} className="text-white" /> :
                      <MessageCircle size={16} className="text-white" />
                    }
                  </div>
                  <div className={`max-w-[75%] p-3 rounded-2xl shadow-sm ${message.sender === 'user'
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'
                    : isDarkMode ? 'bg-dark-bg-tertiary text-dark-text border border-dark-border' : 'bg-slate-100 text-slate-800 border border-slate-200'
                    } transition-colors duration-300`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <span className={`text-xs mt-2 block ${message.sender === 'user' ? 'text-indigo-100' : isDarkMode ? 'text-dark-text-muted' : 'text-slate-500'} transition-colors duration-300`}>
                      {message.timestamp}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTypingIndicator && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                    <MessageCircle size={16} className="text-white" />
                  </div>
                  <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-dark-bg-tertiary border border-dark-border' : 'bg-slate-100 border border-slate-200'} transition-colors duration-300`}>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className={`p-4 border-t ${isDarkMode ? 'border-dark-border bg-dark-bg-tertiary' : 'border-slate-200 bg-slate-50'} rounded-b-2xl transition-colors duration-300`}>
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={localNewMessage}
                  onChange={(e) => setLocalNewMessage(e.target.value)}
                  placeholder="Ask about your document..."
                  className={`flex-1 px-4 py-3 rounded-xl border transition-all duration-300 ${isDarkMode
                    ? 'bg-dark-bg border-dark-border text-dark-text placeholder-dark-text-muted focus:border-indigo-500'
                    : 'bg-white border-slate-300 text-slate-800 placeholder-slate-500 focus:border-indigo-500'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                  disabled={isTypingIndicator}
                />
                <button
                  type="submit"
                  disabled={!localNewMessage.trim() || isTypingIndicator}
                  className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                >
                  <Send size={16} />
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`relative rounded-2xl border p-4 transition-all duration-300 ${isDarkMode
        ? 'bg-[#1A1A1A]/50 border-[#2A2A2A] hover:bg-[#1A1A1A] hover:border-blue-500/50'
        : 'bg-white border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-400'
        } ${isSelected ? 'ring-2 ring-blue-500/50 border-blue-500' : ''}`}
      onClick={() => setSelectedLawyer(lawyer)}
    >
      {lawyer.badges.includes("Senior Partner") && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 rounded-full text-[8px] font-bold shadow-md uppercase tracking-wider">
            PREMIUM
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="relative">
            <img
              src={lawyer.avatar}
              alt={lawyer.name}
              className="w-10 h-10 rounded-xl object-cover border border-white/10 shadow-lg"
            />
            {lawyer.verified && (
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center border-2 ${isDarkMode ? 'border-[#1A1A1A]' : 'border-white'}`}>
                <CheckCircle size={8} className="text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className={`text-xs font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{lawyer.name}</h3>
            <p className="text-blue-500 font-bold text-[10px] uppercase tracking-tight">{lawyer.specialization}</p>

            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="flex items-center gap-0.5">
                <Star size={10} className="text-yellow-400 fill-current" />
                <span className={`text-[10px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>{lawyer.rating}</span>
              </div>
              <span className={`text-[10px] font-bold ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>({lawyer.reviews})</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'EXP', value: `${lawyer.experience}+`, color: 'text-blue-400', bg: 'bg-blue-500/5' },
            { label: 'SUCCESS', value: `${lawyer.successRate}%`, color: 'text-emerald-400', bg: 'bg-emerald-500/5' }
          ].map((stat, i) => (
            <div key={i} className={`rounded-xl p-2 border ${isDarkMode ? 'border-white/5' : 'border-slate-100'} ${stat.bg}`}>
              <div className={`text-[8px] font-bold uppercase tracking-tighter ${isDarkMode ? 'text-gray-500' : 'text-slate-500'}`}>{stat.label}</div>
              <div className={`text-xs font-bold ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {lawyer.badges.slice(0, 2).map((badge, index) => (
            <span
              key={index}
              className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-tight ${isDarkMode ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-slate-50 text-slate-500 border border-slate-100'
                }`}
            >
              {badge}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-dashed border-gray-100 dark:border-white/5">
          <div>
            <p className={`text-[9px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-600' : 'text-slate-400'}`}>HOURLY RATE</p>
            <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>₹{lawyer.hourlyRate}</p>
          </div>
          <div className="text-right">
            <p className={`text-[9px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-600' : 'text-slate-400'}`}>RESPONSE</p>
            <p className="text-[10px] font-bold text-emerald-500">{lawyer.responseTime}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedLawyer(lawyer);
              setShowChat(true);
            }}
            className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-blue-600/20 transition-all"
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
            className="flex-1 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all"
          >
            Video
          </button>
        </div>
      </div>
    </motion.div>
  );

  // Legal Services Component
  const LegalServicesTab = () => (
    <div className="space-y-6">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            id: 1,
            title: "Contract Review & Analysis",
            description: "Comprehensive contract review with AI analysis and lawyer expertise",
            icon: FileCheck,
            features: ["AI-powered analysis", "Risk assessment", "Legal compliance", "Expert review"],
            price: "₹2,999",
            gradient: "from-indigo-500 to-purple-500",
            popular: true
          },
          {
            id: 2,
            title: "Document Creation",
            description: "Custom legal document creation tailored to your specific needs",
            icon: Edit,
            features: ["Custom templates", "Legal compliance", "Multiple formats", "Quick turnaround"],
            price: "₹4,999",
            gradient: "from-emerald-500 to-green-500"
          },
          {
            id: 3,
            title: "NDA & Confidentiality",
            description: "Non-disclosure agreements and confidentiality document services",
            icon: Shield,
            features: ["Standard templates", "Custom clauses", "Multi-party NDAs", "Industry specific"],
            price: "₹1,999",
            gradient: "from-orange-500 to-red-500"
          },
          {
            id: 4,
            title: "Employment Contracts",
            description: "Employment agreement creation and review services",
            icon: Users,
            features: ["Employment terms", "Benefits structure", "Termination clauses", "Compliance check"],
            price: "₹3,499",
            gradient: "from-purple-500 to-pink-500"
          },
          {
            id: 5,
            title: "Corporate Documentation",
            description: "Business formation and corporate document services",
            icon: Building,
            features: ["Company formation", "Board resolutions", "Shareholder agreements", "Compliance docs"],
            price: "₹7,999",
            gradient: "from-cyan-500 to-blue-500"
          },
          {
            id: 6,
            title: "IP & Patent Services",
            description: "Intellectual property protection and patent application services",
            icon: Award,
            features: ["Patent filing", "Trademark registration", "Copyright protection", "IP strategy"],
            price: "₹9,999",
            gradient: "from-teal-500 to-emerald-500"
          }
        ].map((service, index) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${isDarkMode ? 'bg-dark-bg-secondary border-dark-border' : 'bg-white border-slate-200'} rounded-xl shadow-lg border p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden`}
            >
              {service.popular && (
                <div className="absolute top-3 right-3">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    POPULAR
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {/* Service Icon */}
                <div className={`w-12 h-12 bg-gradient-to-br ${service.gradient} rounded-lg flex items-center justify-center shadow-md`}>
                  <Icon size={24} className="text-white" />
                </div>

                {/* Service Info */}
                <div className="space-y-1">
                  <h3 className={`text-base font-bold transition-colors duration-300 ${isDarkMode ? 'text-dark-text' : 'text-slate-800'
                    }`}>{service.title}</h3>
                  <p className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-dark-text-secondary' : 'text-slate-600'
                    }`}>{service.description}</p>
                </div>

                {/* Features */}
                <div className="space-y-1">
                  {service.features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 bg-gradient-to-r ${service.gradient} rounded-full`}></div>
                      <span className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-dark-text-tertiary' : 'text-slate-500'
                        }`}>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Price & Action */}
                <div className={`flex items-center justify-between pt-3 border-t ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                  <div className="space-y-0.5">
                    <div className={`text-lg font-bold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}>
                      {service.price}
                    </div>
                    <div className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-dark-text-muted' : 'text-slate-500'
                      }`}>Starting from</div>
                  </div>
                  <button
                    onClick={() => setSelectedService(service)}
                    className={`px-3 py-1.5 bg-gradient-to-r ${service.gradient} text-white rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200 transform hover:scale-105`}
                  >
                    Get Started
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
        transition={{ delay: 0.6 }}
        className={`${isDarkMode ? 'bg-dark-bg-secondary border-dark-border' : 'bg-white border-slate-200'} rounded-xl shadow-lg border p-6 text-center transition-colors duration-300`}
      >
        <div className="space-y-4">
          <h3 className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-dark-text' : 'text-slate-800'
            }`}>Need Custom Legal Services?</h3>
          <p className={`transition-colors duration-300 ${isDarkMode ? 'text-dark-text-secondary' : 'text-slate-600'
            }`}>
            Can't find what you're looking for? Our expert lawyers can provide customized legal solutions for your specific needs.
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg">
            Contact Our Legal Experts
          </button>
        </div>
      </motion.div>
    </div>
  );

  // My Cases Component
  const MyCasesTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <FileText size={28} className="text-white" />
          </div>
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
            My Cases & History
          </h2>
          <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-dark-text-secondary' : 'text-slate-600'
            }`}>
            Track your legal cases and document reviews
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { title: "Total Cases", value: myCases.length, icon: FileText, color: "from-blue-500 to-cyan-500" },
          { title: "Completed", value: myCases.filter(c => c.status === 'completed').length, icon: CheckCircle, color: "from-green-500 to-emerald-500" },
          { title: "In Progress", value: myCases.filter(c => c.status === 'in-progress').length, icon: Clock, color: "from-yellow-500 to-orange-500" },
          { title: "Documents", value: documentBucket.length, icon: Upload, color: "from-purple-500 to-pink-500" }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${isDarkMode ? 'bg-dark-bg-secondary border-dark-border' : 'bg-white border-slate-200'} rounded-xl shadow-lg border p-3 transition-colors duration-300`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon size={20} className="text-white" />
                </div>
                <div>
                  <div className={`text-xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className={`text-xs font-medium transition-colors duration-300 ${isDarkMode ? 'text-dark-text-secondary' : 'text-slate-600'
                    }`}>{stat.title}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Cases List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <h3 className={`text-lg font-bold transition-colors duration-300 ${isDarkMode ? 'text-dark-text' : 'text-slate-800'
          }`}>Recent Cases</h3>

        <div className="space-y-3">
          {myCases.map((case_, index) => {
            const Icon = case_.icon;
            return (
              <motion.div
                key={case_.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${isDarkMode ? 'bg-dark-bg-secondary border-dark-border' : 'bg-white border-slate-200'} rounded-xl shadow-lg border p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${case_.status === 'completed' ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                      case_.status === 'in-progress' ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
                        'bg-gradient-to-br from-slate-500 to-slate-600'
                      }`}>
                      <Icon size={20} className="text-white" />
                    </div>

                    <div className="flex-1">
                      <h4 className={`text-base font-bold transition-colors duration-300 ${isDarkMode ? 'text-dark-text' : 'text-slate-800'
                        }`}>{case_.title}</h4>
                      <p className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-dark-text-secondary' : 'text-slate-600'
                        } mb-2`}>{case_.description}</p>

                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${case_.status === 'completed' ? 'bg-green-500' :
                            case_.status === 'in-progress' ? 'bg-yellow-500' : 'bg-slate-500'
                            }`}></div>
                          <span className={`font-medium capitalize transition-colors duration-300 ${isDarkMode ? 'text-dark-text-tertiary' : 'text-slate-500'
                            }`}>{case_.status.replace('-', ' ')}</span>
                        </div>

                        <div className={`transition-colors duration-300 ${isDarkMode ? 'text-dark-text-tertiary' : 'text-slate-500'
                          }`}>
                          {case_.type} • {case_.date}
                        </div>

                        {case_.lawyer && (
                          <div className={`transition-colors duration-300 ${isDarkMode ? 'text-dark-text-tertiary' : 'text-slate-500'
                            }`}>
                            by {case_.lawyer}
                          </div>
                        )}
                      </div>

                      {/* Documents */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {case_.documents.map((doc, idx) => (
                          <span key={idx} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${isDarkMode ? 'bg-dark-bg-tertiary text-dark-text-secondary border border-dark-border' : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                            📄 {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:from-indigo-600 hover:to-purple-600 transition-all duration-200">
                      View Details
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
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-green-600 transition-all duration-200"
                      >
                        Contact Lawyer
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {myCases.length === 0 && (
          <div className={`text-center py-12 transition-colors duration-300 ${isDarkMode ? 'text-dark-text-muted' : 'text-slate-500'
            }`}>
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p>No cases found. Start by uploading a document for analysis!</p>
          </div>
        )}
      </motion.div>
    </div>
  );

  // Main Navigation Tabs
  const NavigationTabs = () => (
    <div className={`sticky top-0 z-40 mb-6 py-2 backdrop-blur-md ${isDarkMode ? 'bg-[#0A0A0A]/50' : 'bg-[#F8FAFC]/50'}`}>
      <div className={`p-1 rounded-2xl border transition-all max-w-2xl mx-auto ${isDarkMode ? 'bg-[#1A1A1A]/80 border-[#2A2A2A]' : 'bg-white border-slate-100 shadow-xl'
        }`}>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pt-20">
        <NavigationTabs />

        <div className="mt-8">
          <AnimatePresence mode="wait">
            {activeTab === 'analyze' && (
              <motion.div
                key="analyze"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <DocumentAnalysisTab />
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
                <DocumentBucketTab />
              </motion.div>
            )}

            {activeTab === 'lawyers' && (
              <motion.div
                key="lawyers"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Expert Legal Consultation</h2>
                  <p className={`text-[11px] ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>Connect with verified legal professionals for expert analysis</p>
                </div>

                <div className={`rounded-2xl border p-4 backdrop-blur-md ${isDarkMode ? 'bg-[#1A1A1A]/80 border-[#2A2A2A]' : 'bg-white border-slate-100 shadow-xl'}`}>
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Search by name or specialization..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium border transition-all ${isDarkMode
                          ? 'bg-black/20 border-white/5 text-white focus:border-blue-500'
                          : 'bg-slate-50 border-slate-200 focus:border-blue-400'
                          }`}
                      />
                    </div>

                    <div className="flex gap-2">
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${isDarkMode
                          ? 'bg-black/20 border-white/5 text-gray-400'
                          : 'bg-slate-50 border-slate-200'
                          }`}
                      >
                        <option value="All">All Categories</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>

                      <button className={`p-2 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-slate-200'}`}>
                        <Filter size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredLawyers.map(lawyer => (
                    <LawyerCard key={lawyer.id} lawyer={lawyer} isSelected={selectedLawyer?.id === lawyer.id} />
                  ))}
                </div>

                {filteredLawyers.length === 0 && (
                  <div className="py-20 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-100 dark:border-white/5">
                      <Users size={24} className="text-gray-600" />
                    </div>
                    <p className={`text-[11px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>No lawyers found matching your search</p>
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
                <LegalServicesTab />
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
                <MyCasesTab />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
        {scrollProgress > 300 && (
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
