import React, { useState, useEffect, useRef, useCallback } from 'react';
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

const DocumentReview = () => {
  const { isDark } = useDarkMode();
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
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBooking, setShowBooking] = useState(false);
  const [myCases, setMyCases] = useState([]);

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
    <div className="space-y-6">
      {/* AI Document Analyzer Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Brain size={28} className="text-white" />
                </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </div>
        </div>
      </div>
        
        <div className="space-y-1">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI Legal Document Analyzer
          </h2>
          <p className={`${isDark ? 'text-dark-text-secondary' : 'text-slate-600'} max-w-xl mx-auto text-sm transition-colors duration-300`}>
            Upload your legal documents for instant AI-powered analysis
              </p>
            </div>

        {/* Features Pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { icon: Zap, text: "Instant Analysis" },
            { icon: Shield, text: "Risk Assessment" },
            { icon: FileCheck, text: "Compliance Check" },
            { icon: Target, text: "Recommendations" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-sm transition-colors duration-300 ${
                isDark 
                  ? 'bg-gradient-to-r from-dark-bg-secondary to-dark-bg-tertiary border-dark-border'
                  : 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200'
              }`}
            >
              <feature.icon size={14} className="text-indigo-600" />
              <span className={`text-xs font-medium ${isDark ? 'text-dark-text-secondary' : 'text-slate-700'} transition-colors duration-300`}>{feature.text}</span>
            </motion.div>
          ))}
          </div>
      </motion.div>

            {/* Upload Area */}
      {!uploadedFiles.length && !isAnalyzing && !analysisResult && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              dragOver 
                ? 'border-indigo-400 scale-105'
                : isDark
                  ? 'border-dark-border hover:border-indigo-400'
                  : 'border-slate-300 hover:border-indigo-300'
            } ${
              dragOver
                ? isDark ? 'bg-indigo-900/20' : 'bg-indigo-50'
                : isDark 
                  ? 'bg-dark-bg-secondary hover:bg-dark-bg-tertiary/50' 
                  : 'bg-slate-50 hover:bg-indigo-50/50'
            }`}
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
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-md">
                  <Upload size={24} className="text-white" />
                </div>
            </div>

              <div className="space-y-1">
                <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                  isDark ? 'text-dark-text' : 'text-slate-800'
                }`}>
                  Drop your legal document here
                </h3>
                <p className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-dark-text-secondary' : 'text-slate-600'
                }`}>
                  or <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-indigo-600 hover:text-indigo-700 font-medium underline"
                  >
                    browse files
                  </button> to get started
                </p>
                </div>
                
              <div className={`flex flex-wrap justify-center gap-1.5 text-xs transition-colors duration-300 ${
                  isDark ? 'text-dark-text-muted' : 'text-slate-500'
                }`}>
                <span className={`px-2 py-1 rounded-full border transition-colors duration-300 ${
                  isDark ? 'bg-dark-bg-tertiary border-dark-border text-dark-text-secondary' : 'bg-white border-slate-200 text-slate-600'
                }`}>PDF</span>
                <span className={`px-2 py-1 rounded-full border transition-colors duration-300 ${
                  isDark ? 'bg-dark-bg-tertiary border-dark-border text-dark-text-secondary' : 'bg-white border-slate-200 text-slate-600'
                }`}>DOC</span>
                <span className={`px-2 py-1 rounded-full border transition-colors duration-300 ${
                  isDark ? 'bg-dark-bg-tertiary border-dark-border text-dark-text-secondary' : 'bg-white border-slate-200 text-slate-600'
                }`}>DOCX</span>
                <span className={`px-2 py-1 rounded-full border transition-colors duration-300 ${
                  isDark ? 'bg-dark-bg-tertiary border-dark-border text-dark-text-secondary' : 'bg-white border-slate-200 text-slate-600'
                }`}>TXT</span>
                  </div>
              </div>
          </div>
        </motion.div>
      )}

      {/* Analysis Progress */}
      {isAnalyzing && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          <div className={`rounded-xl shadow-lg border p-6 transition-colors duration-300 ${
            isDark ? 'bg-dark-bg-secondary border-dark-border' : 'bg-white border-slate-200'
          }`}>
            <div className="text-center space-y-4">
              {/* AI Brain Animation */}
              <div className="flex justify-center">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg"
                  >
                    <Brain size={28} className="text-white" />
                  </motion.div>
                  
                  {/* Floating particles */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [-8, -24, -8],
                        opacity: [0.3, 1, 0.3],
                        scale: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeInOut"
                      }}
                      className="absolute w-1.5 h-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                      style={{
                        top: `${20 + i * 15}%`,
                        left: `${30 + i * 20}%`
                      }}
                    />
                  ))}
              </div>
            </div>

              <div className="space-y-3">
                <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                  isDark ? 'text-dark-text' : 'text-slate-800'
                }`}>
                  Analyzing Your Document
                          </h3>
                
                <p className="text-indigo-600 font-medium text-sm">
                  {analysisStage}
                </p>

                {/* Progress Bar */}
                <div className={`w-full rounded-full h-1.5 overflow-hidden ${
                  isDark ? 'bg-dark-bg-tertiary' : 'bg-slate-200'
                }`}>
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${analysisProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                          </div>
                          
                <p className={`text-xs transition-colors duration-300 ${
                  isDark ? 'text-dark-text-secondary' : 'text-slate-600'
                }`}>
                  {Math.round(analysisProgress)}% Complete
                </p>
                        </div>

              {/* Processing Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
                {[
                  { icon: FileCheck, text: "Content Scan" },
                  { icon: Shield, text: "Risk Analysis" },
                  { icon: Cpu, text: "AI Review" },
                  { icon: Target, text: "Recommendations" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0.3 }}
                    animate={{ 
                      opacity: analysisProgress > (index + 1) * 25 ? 1 : 0.3,
                      scale: analysisProgress > (index + 1) * 25 ? 1.02 : 1
                    }}
                    className="space-y-1"
                  >
                    <div className={`w-6 h-6 mx-auto rounded-lg flex items-center justify-center ${
                      analysisProgress > (index + 1) * 25 
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white' 
                        : isDark ? 'bg-dark-bg-tertiary text-slate-400' : 'bg-slate-200 text-slate-400'
                    }`}>
                      <feature.icon size={12} />
                    </div>
                    <p className={`text-xs font-medium transition-colors duration-300 ${
                      isDark ? 'text-dark-text-secondary' : 'text-slate-600'
                    }`}>{feature.text}</p>
                  </motion.div>
                          ))}
                        </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto space-y-6"
        >
          {/* Results Header */}
          <div className={`rounded-2xl shadow-xl border p-6 transition-colors duration-300 ${
            isDark ? 'bg-dark-bg-secondary border-dark-border' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <CheckCircle size={24} className="text-white" />
                </div>
                          <div>
                  <h3 className={`text-xl font-bold transition-colors duration-300 ${
                    isDark ? 'text-dark-text' : 'text-slate-800'
                  }`}>Analysis Complete</h3>
                  <p className={`transition-colors duration-300 ${
                    isDark ? 'text-dark-text-secondary' : 'text-slate-600'
                  }`}>Document: {analysisResult.documentType}</p>
                </div>
                          </div>
                          
                            <button
                onClick={() => {
                  setUploadedFiles([]);
                  setAnalysisResult(null);
                }}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 font-medium"
              >
                Analyze New Document
                            </button>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { 
                  title: "Overall Score", 
                  value: analysisResult.overallScore, 
                  max: 100, 
                  color: "from-blue-500 to-cyan-500",
                  icon: TrendingUp 
                },
                { 
                  title: "Compliance", 
                  value: analysisResult.complianceScore, 
                  max: 100, 
                  color: "from-green-500 to-emerald-500",
                  icon: Shield 
                },
                { 
                  title: "Readability", 
                  value: analysisResult.readabilityScore, 
                  max: 100, 
                  color: "from-purple-500 to-pink-500",
                  icon: BookOpen 
                }
              ].map((score, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-xl p-4 border transition-colors duration-300 ${
                    isDark 
                      ? 'bg-gradient-to-br from-dark-bg-tertiary to-dark-bg border-dark-border' 
                      : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-medium transition-colors duration-300 ${
                      isDark ? 'text-dark-text-secondary' : 'text-slate-600'
                    }`}>{score.title}</span>
                    <score.icon size={16} className={`transition-colors duration-300 ${
                      isDark ? 'text-dark-text-muted' : 'text-slate-500'
                    }`} />
                          </div>
                  <div className="flex items-end gap-2">
                    <span className={`text-2xl font-bold bg-gradient-to-r ${score.color} bg-clip-text text-transparent`}>
                      {score.value}
                    </span>
                    <span className={`text-sm transition-colors duration-300 ${
                      isDark ? 'text-dark-text-muted' : 'text-slate-500'
                    }`}>/{score.max}</span>
                        </div>
                  <div className={`mt-2 w-full rounded-full h-2 transition-colors duration-300 ${
                    isDark ? 'bg-dark-bg' : 'bg-slate-200'
                  }`}>
                    <motion.div
                      className={`h-full bg-gradient-to-r ${score.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(score.value / score.max) * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                    />
                      </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Issues and Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Issues */}
            <div className={`rounded-2xl shadow-xl border p-6 transition-colors duration-300 ${
              isDark ? 'bg-dark-bg-secondary border-dark-border' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <AlertCircle size={16} className="text-white" />
                    </div>
                <h4 className={`text-lg font-bold transition-colors duration-300 ${
                  isDark ? 'text-dark-text' : 'text-slate-800'
                }`}>Issues Found</h4>
                  </div>

              <div className="space-y-4">
                {analysisResult.issues.map((issue, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border-l-4 ${
                      issue.severity === 'high' ? 'bg-red-50 border-red-500' :
                      issue.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                      'bg-blue-50 border-blue-500'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className={`font-semibold transition-colors duration-300 ${
                        isDark ? 'text-dark-text' : 'text-slate-800'
                      }`}>{issue.title}</h5>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        issue.severity === 'high' ? 'bg-red-100 text-red-700' :
                        issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {issue.type}
                      </span>
                    </div>
                    <p className={`text-sm mb-2 transition-colors duration-300 ${
                      isDark ? 'text-dark-text-secondary' : 'text-slate-600'
                    }`}>{issue.description}</p>
                    <p className={`text-sm font-medium transition-colors duration-300 ${
                      isDark ? 'text-dark-text-tertiary' : 'text-slate-700'
                    }`}>
                      💡 {issue.suggestion}
                    </p>
                  </motion.div>
                ))}
                    </div>
                  </div>

            {/* Recommendations */}
            <div className={`rounded-2xl shadow-xl border p-6 transition-colors duration-300 ${
              isDark ? 'bg-dark-bg-secondary border-dark-border' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <h4 className={`text-lg font-bold transition-colors duration-300 ${
                  isDark ? 'text-dark-text' : 'text-slate-800'
                }`}>Recommendations</h4>
                  </div>

              <div className="space-y-3">
                {analysisResult.suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-colors duration-300 ${
                      isDark 
                        ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-800/30' 
                        : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                    }`}
                  >
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle size={12} className="text-white" />
                </div>
                    <p className={`text-sm transition-colors duration-300 ${
                      isDark ? 'text-dark-text-tertiary' : 'text-slate-700'
                    }`}>{suggestion}</p>
                  </motion.div>
                ))}
          </div>

              {/* Summary */}
              <div className={`mt-6 p-4 rounded-xl border transition-colors duration-300 ${
                isDark 
                  ? 'bg-gradient-to-r from-dark-bg-tertiary to-dark-bg border-dark-border' 
                  : 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200'
              }`}>
                <h5 className={`font-semibold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-dark-text' : 'text-slate-800'
                }`}>Summary</h5>
                <p className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-dark-text-secondary' : 'text-slate-600'
                }`}>{analysisResult.summary}</p>
                    </div>
                  </div>
                </div>
                
          {/* Action Buttons */}
          <div className={`rounded-2xl shadow-xl border p-6 transition-colors duration-300 ${
            isDark ? 'bg-dark-bg-secondary border-dark-border' : 'bg-white border-slate-200'
          }`}>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg">
                <Download size={16} />
                Download Report
                  </button>
              
                <button
                onClick={() => setActiveTab('lawyers')}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-200 font-medium shadow-lg"
                >
                <Users size={16} />
                Consult Lawyer
                </button>
              
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-200 font-medium shadow-lg">
                <Send size={16} />
                Share Report
              </button>
                      </div>
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
            <Upload size={28} className="text-white" />
          </div>
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Document Bucket
          </h2>
          <p className={`text-sm transition-colors duration-300 ${
            isDark ? 'text-dark-text-secondary' : 'text-slate-600'
          }`}>
            Manage your uploaded documents
          </p>
        </div>
      </motion.div>

      {/* Upload New Document */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`${isDark ? 'bg-dark-bg-secondary border-dark-border' : 'bg-white border-slate-200'} rounded-xl shadow-lg border p-4 transition-colors duration-300`}
      >
        <h3 className={`text-base font-semibold mb-3 transition-colors duration-300 ${
          isDark ? 'text-dark-text' : 'text-slate-800'
        }`}>Upload New Document</h3>
        
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 cursor-pointer ${
            dragOver 
              ? 'border-indigo-400 scale-[1.02]'
              : isDark
                ? 'border-dark-border hover:border-indigo-400'
                : 'border-slate-300 hover:border-indigo-300'
          } ${
            dragOver
              ? isDark ? 'bg-indigo-900/20' : 'bg-indigo-50'
              : isDark 
                ? 'bg-dark-bg-tertiary hover:bg-dark-bg-tertiary/70' 
                : 'bg-slate-50 hover:bg-indigo-50/50'
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
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Upload size={20} className="text-white" />
              </div>
            </div>
            <p className={`text-sm font-medium transition-colors duration-300 ${
              isDark ? 'text-dark-text' : 'text-slate-800'
            }`}>
              Drop files here or click to browse
            </p>
            <p className={`text-xs transition-colors duration-300 ${
              isDark ? 'text-dark-text-muted' : 'text-slate-500'
            }`}>
              PDF, DOC, DOCX, TXT files supported
            </p>
          </div>
        </div>
      </motion.div>

      {/* Documents List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <h3 className={`text-lg font-bold transition-colors duration-300 ${
          isDark ? 'text-dark-text' : 'text-slate-800'
        }`}>Your Documents ({documentBucket.length})</h3>
        
        <div className="grid gap-3">
          {documentBucket.map((doc, index) => {
            const Icon = doc.icon;
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${isDark ? 'bg-dark-bg-secondary border-dark-border' : 'bg-white border-slate-200'} rounded-2xl shadow-lg border p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      doc.status === 'analyzed' ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                      doc.status === 'analyzing' ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
                      'bg-gradient-to-br from-slate-500 to-slate-600'
                    }`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className={`font-semibold transition-colors duration-300 ${
                        isDark ? 'text-dark-text' : 'text-slate-800'
                      }`}>{doc.name}</h4>
                      <p className={`text-sm transition-colors duration-300 ${
                        isDark ? 'text-dark-text-secondary' : 'text-slate-600'
                      }`}>{doc.type} • {doc.size} • {doc.uploadDate}</p>
                      
                      {doc.status === 'analyzed' && doc.analysisScore && (
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              doc.riskLevel === 'Low' ? 'bg-green-500' :
                              doc.riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></div>
                            <span className={`text-sm font-medium transition-colors duration-300 ${
                              isDark ? 'text-dark-text-tertiary' : 'text-slate-500'
                            }`}>Risk: {doc.riskLevel}</span>
                          </div>
                          <div className={`text-sm font-medium transition-colors duration-300 ${
                            isDark ? 'text-dark-text-tertiary' : 'text-slate-500'
                          }`}>Score: {doc.analysisScore}/100</div>
                        </div>
                      )}
                      
                      {doc.status === 'analyzing' && (
                        <div className="flex items-center gap-2 mt-2">
                          <Loader size={16} className="text-orange-500 animate-spin" />
                          <span className="text-sm text-orange-600 font-medium">Analyzing...</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                        doc.status === 'analyzed' 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg hover:shadow-xl transform hover:scale-105' 
                          : doc.status === 'analyzing'
                            ? 'bg-orange-100 text-orange-700 cursor-not-allowed'
                            : isDark
                              ? 'bg-dark-bg-tertiary text-dark-text-secondary hover:bg-indigo-600 hover:text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-indigo-600 hover:text-white'
                      }`}
                      disabled={doc.status === 'analyzing'}
                      onClick={() => {
                        if (doc.status === 'analyzed') {
                          setSelectedReport(doc);
                          setShowReportModal(true);
                        } else if (doc.status === 'pending') {
                          // Simulate analysis
                          setDocumentBucket(prev => 
                            prev.map(d => d.id === doc.id ? {...d, status: 'analyzing'} : d)
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
                       doc.status === 'analyzing' ? 'Analyzing...' : 'Analyze'}
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab('lawyers')}
                      className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Send to Lawyer
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {documentBucket.length === 0 && (
          <div className={`text-center py-12 transition-colors duration-300 ${
            isDark ? 'text-dark-text-muted' : 'text-slate-500'
          }`}>
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p>No documents uploaded yet. Upload your first document to get started!</p>
          </div>
        )}
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`${isDark ? 'bg-dark-bg-secondary border-dark-border' : 'bg-white border-slate-200'} rounded-3xl shadow-2xl border max-w-4xl w-full max-h-[90vh] overflow-hidden transition-colors duration-300`}
          >
            {/* Modal Header */}
            <div className={`px-8 py-6 border-b ${isDark ? 'border-dark-border bg-gradient-to-r from-dark-bg-tertiary to-dark-bg' : 'border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100'} transition-colors duration-300`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <FileCheck size={32} className="text-white" />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold transition-colors duration-300 ${isDark ? 'text-dark-text' : 'text-slate-800'}`}>Document Analysis Report</h2>
                    <p className={`transition-colors duration-300 ${isDark ? 'text-dark-text-secondary' : 'text-slate-600'}`}>Comprehensive legal document review</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className={`p-3 rounded-xl hover:bg-opacity-10 hover:bg-slate-500 transition-all duration-200 ${isDark ? 'text-dark-text hover:bg-dark-bg-tertiary' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="p-8 space-y-8">
                {/* Document Info */}
                <div className={`rounded-2xl p-6 border transition-colors duration-300 ${isDark ? 'bg-dark-bg-tertiary border-dark-border' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <FileText size={24} className="text-indigo-600" />
                    <div>
                      <h3 className={`text-lg font-bold transition-colors duration-300 ${isDark ? 'text-dark-text' : 'text-slate-800'}`}>{report.name}</h3>
                      <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-dark-text-secondary' : 'text-slate-600'}`}>Analyzed on {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {/* Score Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`text-center p-4 rounded-xl border transition-colors duration-300 ${isDark ? 'bg-dark-bg border-dark-border' : 'bg-white border-slate-200'}`}>
                      <div className={`text-3xl font-bold mb-1 ${report.analysisScore >= 80 ? 'text-green-500' : report.analysisScore >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {report.analysisScore}/100
                      </div>
                      <div className={`text-sm font-medium transition-colors duration-300 ${isDark ? 'text-dark-text-secondary' : 'text-slate-600'}`}>Overall Score</div>
                    </div>
                    <div className={`text-center p-4 rounded-xl border transition-colors duration-300 ${isDark ? 'bg-dark-bg border-dark-border' : 'bg-white border-slate-200'}`}>
                      <div className={`text-2xl font-bold mb-1 ${report.riskLevel === 'Low' ? 'text-green-500' : report.riskLevel === 'Medium' ? 'text-yellow-500' : 'text-red-500'}`}>
                        {report.riskLevel}
                      </div>
                      <div className={`text-sm font-medium transition-colors duration-300 ${isDark ? 'text-dark-text-secondary' : 'text-slate-600'}`}>Risk Level</div>
                    </div>
                    <div className={`text-center p-4 rounded-xl border transition-colors duration-300 ${isDark ? 'bg-dark-bg border-dark-border' : 'bg-white border-slate-200'}`}>
                      <div className="text-2xl font-bold mb-1 text-blue-500">
                        Legal
                      </div>
                      <div className={`text-sm font-medium transition-colors duration-300 ${isDark ? 'text-dark-text-secondary' : 'text-slate-600'}`}>Document Type</div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center pt-6 border-t border-slate-200 dark:border-dark-border">
                  <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
                    <Download size={18} />
                    Download Report
                  </button>
                  <button 
                    onClick={() => {
                      onClose();
                      setActiveTab('lawyers');
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Users size={18} />
                    Consult Expert Lawyer
                  </button>
                </div>
              </div>
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
          timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
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
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
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
          timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
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
            className={`${isDark ? 'bg-dark-bg-secondary border-dark-border' : 'bg-white border-slate-200'} rounded-2xl shadow-2xl border max-w-md w-full max-h-[80vh] flex flex-col transition-colors duration-300`}
          >
            {/* Chat Header */}
            <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-dark-border bg-dark-bg-tertiary' : 'border-slate-200 bg-slate-50'} rounded-t-2xl transition-colors duration-300`}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={lawyer?.avatar} alt={lawyer?.name} className="w-12 h-12 rounded-full border-2 border-white shadow-lg" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 className={`font-bold transition-colors duration-300 ${isDark ? 'text-dark-text' : 'text-slate-800'}`}>
                    {lawyer?.name || 'Legal Assistant'}
                  </h3>
                  <p className="text-sm text-green-500 font-medium">● Online - Ready to Help</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className={`p-2 rounded-xl hover:bg-opacity-10 hover:bg-slate-500 transition-all duration-200 ${isDark ? 'text-dark-text hover:bg-dark-bg' : 'text-slate-600 hover:bg-slate-200'}`}
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
                    : isDark ? 'bg-dark-bg-tertiary text-dark-text border border-dark-border' : 'bg-slate-100 text-slate-800 border border-slate-200'
                  } transition-colors duration-300`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <span className={`text-xs mt-2 block ${message.sender === 'user' ? 'text-indigo-100' : isDark ? 'text-dark-text-muted' : 'text-slate-500'} transition-colors duration-300`}>
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
                  <div className={`p-3 rounded-2xl ${isDark ? 'bg-dark-bg-tertiary border border-dark-border' : 'bg-slate-100 border border-slate-200'} transition-colors duration-300`}>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Chat Input */}
            <div className={`p-4 border-t ${isDark ? 'border-dark-border bg-dark-bg-tertiary' : 'border-slate-200 bg-slate-50'} rounded-b-2xl transition-colors duration-300`}>
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={localNewMessage}
                  onChange={(e) => setLocalNewMessage(e.target.value)}
                  placeholder="Ask about your document..."
                  className={`flex-1 px-4 py-3 rounded-xl border transition-all duration-300 ${isDark 
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className={`relative rounded-xl shadow-lg border transition-all duration-300 overflow-hidden ${
        isDark ? 'bg-dark-bg-secondary border-dark-border' : 'bg-white border-slate-200'
      } ${
        isSelected ? 'border-indigo-500 ring-2 ring-indigo-100' : isDark ? 'hover:border-indigo-400' : 'hover:border-indigo-300'
      }`}
      onClick={() => setSelectedLawyer(lawyer)}
    >
      {/* Premium Badge */}
      {lawyer.badges.includes("Senior Partner") && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
            PREMIUM
            </div>
          </div>
        )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="relative">
            <img
              src={lawyer.avatar}
              alt={lawyer.name}
              className="w-12 h-12 rounded-lg object-cover border-2 border-white shadow-md"
            />
            {lawyer.verified && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                <CheckCircle size={8} className="text-white" />
                  </div>
            )}
                </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={`text-base font-bold truncate transition-colors duration-300 ${
              isDark ? 'text-dark-text' : 'text-slate-800'
            }`}>{lawyer.name}</h3>
            <p className="text-indigo-600 font-medium text-xs">{lawyer.specialization}</p>
            
            {/* Rating */}
            <div className="flex items-center gap-1.5 mt-1">
              <div className="flex items-center gap-1">
                <Star size={12} className="text-yellow-400 fill-current" />
                <span className="text-xs font-semibold text-slate-700">{lawyer.rating}</span>
              </div>
              <span className={`text-xs transition-colors duration-300 ${
                isDark ? 'text-dark-text-muted' : 'text-slate-500'
              }`}>({lawyer.reviews})</span>
            </div>
                </div>
              </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className={`rounded-lg p-2 border transition-colors duration-300 ${
            isDark 
              ? 'bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border-blue-800/30' 
              : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
          }`}>
            <div className={`text-xs font-medium transition-colors duration-300 ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`}>Experience</div>
            <div className={`text-sm font-bold transition-colors duration-300 ${
              isDark ? 'text-blue-300' : 'text-blue-700'
            }`}>{lawyer.experience}+ yrs</div>
                  </div>
          
          <div className={`rounded-lg p-2 border transition-colors duration-300 ${
            isDark 
              ? 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-800/30' 
              : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
          }`}>
            <div className={`text-xs font-medium transition-colors duration-300 ${
              isDark ? 'text-green-400' : 'text-green-600'
            }`}>Success Rate</div>
            <div className={`text-sm font-bold transition-colors duration-300 ${
              isDark ? 'text-green-300' : 'text-green-700'
            }`}>{lawyer.successRate}%</div>
                      </div>
                    </div>

        {/* Highlights */}
        <div className="space-y-2 mb-4">
          {lawyer.highlights.slice(0, 2).map((highlight, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div className="w-1.5 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              <span className={`transition-colors duration-300 ${
                isDark ? 'text-dark-text-secondary' : 'text-slate-600'
              }`}>{highlight}</span>
            </div>
          ))}
              </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {lawyer.badges.slice(0, 2).map((badge, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-xs font-medium border border-indigo-200"
            >
              {badge}
            </span>
          ))}
                </div>

        {/* Footer */}
        <div className={`flex items-center justify-between pt-4 border-t transition-colors duration-300 ${
          isDark ? 'border-dark-border' : 'border-slate-200'
        }`}>
          <div className="text-center">
            <div className={`text-xs transition-colors duration-300 ${
              isDark ? 'text-dark-text-muted' : 'text-slate-500'
            }`}>Hourly Rate</div>
            <div className={`text-lg font-bold transition-colors duration-300 ${
              isDark ? 'text-dark-text' : 'text-slate-800'
            }`}>₹{lawyer.hourlyRate}</div>
              </div>
          
          <div className="text-center">
            <div className={`text-xs transition-colors duration-300 ${
              isDark ? 'text-dark-text-muted' : 'text-slate-500'
            }`}>Response</div>
            <div className="text-sm font-semibold text-green-600">{lawyer.responseTime}</div>
            </div>
          </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedLawyer(lawyer);
              setShowChat(true);
            }}
            className="flex-1 py-2 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <MessageCircle size={16} className="inline mr-2" />
            Chat Now
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedLawyer(lawyer);
              setShowVideoCall(true);
              setCallInProgress(true);
            }}
            className="flex-1 py-2 px-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Video size={16} className="inline mr-2" />
            Video Call
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
          <p className={`text-sm transition-colors duration-300 ${
            isDark ? 'text-dark-text-secondary' : 'text-slate-600'
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
              className={`${isDark ? 'bg-dark-bg-secondary border-dark-border' : 'bg-white border-slate-200'} rounded-xl shadow-lg border p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden`}
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
                  <h3 className={`text-base font-bold transition-colors duration-300 ${
                    isDark ? 'text-dark-text' : 'text-slate-800'
                  }`}>{service.title}</h3>
                  <p className={`text-xs transition-colors duration-300 ${
                    isDark ? 'text-dark-text-secondary' : 'text-slate-600'
                  }`}>{service.description}</p>
                </div>

                {/* Features */}
                <div className="space-y-1">
                  {service.features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className={`w-1 h-1 bg-gradient-to-r ${service.gradient} rounded-full`}></div>
                      <span className={`text-xs transition-colors duration-300 ${
                        isDark ? 'text-dark-text-tertiary' : 'text-slate-500'
                      }`}>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-dark-border">
                  <div className="space-y-0.5">
                    <div className={`text-lg font-bold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}>
                      {service.price}
                    </div>
                    <div className={`text-xs transition-colors duration-300 ${
                      isDark ? 'text-dark-text-muted' : 'text-slate-500'
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
        className={`${isDark ? 'bg-dark-bg-secondary border-dark-border' : 'bg-white border-slate-200'} rounded-xl shadow-lg border p-6 text-center transition-colors duration-300`}
      >
        <div className="space-y-4">
          <h3 className={`text-2xl font-bold transition-colors duration-300 ${
            isDark ? 'text-dark-text' : 'text-slate-800'
          }`}>Need Custom Legal Services?</h3>
          <p className={`transition-colors duration-300 ${
            isDark ? 'text-dark-text-secondary' : 'text-slate-600'
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
          <p className={`text-sm transition-colors duration-300 ${
            isDark ? 'text-dark-text-secondary' : 'text-slate-600'
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
              className={`${isDark ? 'bg-dark-bg-secondary border-dark-border' : 'bg-white border-slate-200'} rounded-xl shadow-lg border p-3 transition-colors duration-300`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon size={20} className="text-white" />
                </div>
                <div>
                  <div className={`text-xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className={`text-xs font-medium transition-colors duration-300 ${
                    isDark ? 'text-dark-text-secondary' : 'text-slate-600'
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
        <h3 className={`text-lg font-bold transition-colors duration-300 ${
          isDark ? 'text-dark-text' : 'text-slate-800'
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
                className={`${isDark ? 'bg-dark-bg-secondary border-dark-border' : 'bg-white border-slate-200'} rounded-xl shadow-lg border p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      case_.status === 'completed' ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                      case_.status === 'in-progress' ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
                      'bg-gradient-to-br from-slate-500 to-slate-600'
                    }`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className={`text-base font-bold transition-colors duration-300 ${
                        isDark ? 'text-dark-text' : 'text-slate-800'
                      }`}>{case_.title}</h4>
                      <p className={`text-xs transition-colors duration-300 ${
                        isDark ? 'text-dark-text-secondary' : 'text-slate-600'
                      } mb-2`}>{case_.description}</p>
                      
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            case_.status === 'completed' ? 'bg-green-500' :
                            case_.status === 'in-progress' ? 'bg-yellow-500' : 'bg-slate-500'
                          }`}></div>
                          <span className={`font-medium capitalize transition-colors duration-300 ${
                            isDark ? 'text-dark-text-tertiary' : 'text-slate-500'
                          }`}>{case_.status.replace('-', ' ')}</span>
                        </div>
                        
                        <div className={`transition-colors duration-300 ${
                          isDark ? 'text-dark-text-tertiary' : 'text-slate-500'
                        }`}>
                          {case_.type} • {case_.date}
                        </div>
                        
                        {case_.lawyer && (
                          <div className={`transition-colors duration-300 ${
                            isDark ? 'text-dark-text-tertiary' : 'text-slate-500'
                          }`}>
                            by {case_.lawyer}
                          </div>
                        )}
                      </div>
                      
                      {/* Documents */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {case_.documents.map((doc, idx) => (
                          <span key={idx} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${
                            isDark ? 'bg-dark-bg-tertiary text-dark-text-secondary border border-dark-border' : 'bg-slate-100 text-slate-600 border border-slate-200'
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
          <div className={`text-center py-12 transition-colors duration-300 ${
            isDark ? 'text-dark-text-muted' : 'text-slate-500'
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
    <div className={`${isDark ? 'bg-dark-bg-secondary border-dark-border' : 'bg-white border-slate-200'} rounded-xl shadow-lg border p-1 mb-6 transition-colors duration-300`}>
      <div className="flex space-x-1">
        {[
          { id: 'analyze', label: 'AI Analyzer', icon: Brain, gradient: 'from-indigo-500 to-purple-500' },
          { id: 'bucket', label: 'Documents', icon: Upload, gradient: 'from-violet-500 to-purple-500' },
          { id: 'lawyers', label: 'Lawyers', icon: Users, gradient: 'from-emerald-500 to-green-500' },
          { id: 'services', label: 'Services', icon: Briefcase, gradient: 'from-blue-500 to-cyan-500' },
          { id: 'status', label: 'My Cases', icon: FileText, gradient: 'from-orange-500 to-red-500' }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive
                  ? `bg-gradient-to-r ${tab.gradient} text-white shadow-md`
                  : isDark 
                    ? 'text-dark-text-secondary hover:bg-dark-bg-tertiary hover:text-dark-text' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </motion.button>
          );
        })}
              </div>
              </div>
  );

  return (
    <div className={`min-h-screen pt-16 transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-dark-bg via-dark-bg-secondary to-dark-bg-tertiary' 
        : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
    }`}>
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
        {/* Navigation */}
        <NavigationTabs />

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'analyze' && (
            <motion.div
              key="analyze"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DocumentAnalysisTab />
            </motion.div>
          )}

          {activeTab === 'bucket' && (
            <motion.div
              key="bucket"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DocumentBucketTab />
            </motion.div>
          )}

          {activeTab === 'lawyers' && (
            <motion.div
              key="lawyers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  Expert Lawyers
                </h2>
                <p className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-dark-text-secondary' : 'text-slate-600'
                }`}>
                  Connect with verified lawyers for document review
                </p>
            </div>

              {/* Search and Filters */}
              <div className={`rounded-xl shadow-lg border p-4 transition-colors duration-300 ${
                isDark ? 'bg-dark-bg-secondary border-dark-border' : 'bg-white border-slate-200'
              }`}>
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search lawyers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full pl-9 pr-4 py-2 rounded-lg border transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm ${
                        isDark 
                          ? 'bg-dark-bg-tertiary border-dark-border text-dark-text placeholder-dark-text-muted' 
                          : 'bg-white border-slate-300'
                      }`}
                    />
          </div>
                  
                  <div className="relative">
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className={`px-3 py-2 pr-8 rounded-lg border transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none cursor-pointer text-sm ${
                        isDark 
                          ? 'bg-dark-bg-tertiary border-dark-border text-dark-text' 
                          : 'bg-white border-slate-300'
                      }`}
                    >
                      <option value="all">🏛️ All Specializations</option>
                      <option value="corporate">🏢 Corporate Law</option>
                      <option value="employment">👥 Employment Law</option>
                      <option value="ip">💡 Intellectual Property</option>
                      <option value="real-estate">🏡 Real Estate Law</option>
                      <option value="family">👨‍👩‍👧‍👦 Family Law</option>
                      <option value="criminal">⚖️ Criminal Law</option>
                      <option value="tax">💰 Tax Law</option>
                      <option value="immigration">🌍 Immigration Law</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <ChevronDown size={20} className={`transition-colors duration-300 ${
                        isDark ? 'text-dark-text-muted' : 'text-slate-400'
                      }`} />
                    </div>
                  </div>
              </div>
            </div>

              {/* Lawyers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lawyers
                  .filter(lawyer => 
                    lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    lawyer.specialization.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((lawyer) => (
                    <LawyerCard 
                      key={lawyer.id} 
                      lawyer={lawyer} 
                      isSelected={selectedLawyer?.id === lawyer.id}
                    />
                  ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <LegalServicesTab />
            </motion.div>
          )}

          {activeTab === 'status' && (
            <motion.div
              key="status"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MyCasesTab />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Document Report Modal */}
        <DocumentReportModal 
          isOpen={showReportModal}
          onClose={() => {
            setShowReportModal(false);
            setSelectedReport(null);
          }}
          report={selectedReport}
        />
        
        {/* Chat Interface */}
        <ChatInterface 
          isOpen={showChat} 
          onClose={() => {
            setShowChat(false);
            setMessages([]);
            setNewMessage('');
          }} 
          lawyer={selectedLawyer}
        />
        
        {/* Video Call Interface */}
        <VideoCallInterface 
          isOpen={showVideoCall} 
          onClose={() => setShowVideoCall(false)} 
          lawyer={selectedLawyer}
        />
      </div>
    </div>
  );
};

export default DocumentReview;
