import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { 
  Bookmark, Share2, 
  Building, Scale, FileText, AlertCircle, TrendingUp, Heart, MessageCircle, 
  Play, Pause, Volume2, VolumeX, MoreVertical, Award,
  Send, Filter, Flame, X, Music, Headphones, 
  Reply, Flag, Crown
} from 'lucide-react';

const InformationHub = () => {
  // Reels state management
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [showComments, setShowComments] = useState(false);
  const [currentCommentPost, setCurrentCommentPost] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [newComment, setNewComment] = useState('');
  
  // Touch and gesture handling for Instagram-style scrolling
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0, time: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0, time: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  // Refs
  const reelsContainerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Spring animation for smooth scrolling
  const springConfig = { stiffness: 300, damping: 30, mass: 1 };
  const scrollY = useSpring(0, springConfig);

  // Enhanced legal content data for reels-like interface
  const legalReelsData = [
    {
      id: 1,
      title: "New Data Protection Regulations: GDPR 2024 Updates",
      summary: "Important changes to data protection laws affecting businesses processing personal information. New compliance requirements and penalties that every business owner must know.",
      category: "Data Protection",
      type: "regulation",
      contentType: "video",
      date: "2024-05-20",
      readTime: "5 min read",
      priority: "high",
      source: "European Commission",
      author: "Legal Expert Team",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=600&fit=crop&crop=center",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      views: 12470,
      likes: 892,
      comments: 156,
      shares: 89,
      tags: ["GDPR", "Privacy", "Compliance", "EU Law"],
      keyPoints: [
        "New consent requirements for data processing",
        "Increased penalties up to €20 million",
        "Enhanced individual rights protection",
        "Mandatory data breach notifications"
      ],
      trending: true,
      featured: false
    },
    {
      id: 2,
      title: "Corporate Governance Guidelines: SEC New Requirements",
      summary: "The Securities and Exchange Commission introduces enhanced corporate governance standards for publicly traded companies. Essential updates for board members and executives.",
      category: "Corporate Law",
      type: "guideline",
      contentType: "video",
      date: "2024-05-18",
      readTime: "8 min read",
      priority: "medium",
      source: "SEC Legal Updates",
      author: "Corporate Law Specialist",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center",
      video: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      views: 8920,
      likes: 445,
      comments: 78,
      shares: 34,
      tags: ["SEC", "Corporate", "Governance", "Public Companies"],
      keyPoints: [
        "New board independence requirements",
        "Enhanced disclosure obligations",
        "Revised audit committee standards",
        "Executive compensation transparency"
      ],
      trending: false,
      featured: true
    },
    {
      id: 3,
      title: "Employment Law Changes: Remote Work Policies 2024",
      summary: "New legislation addressing remote work arrangements, employee rights, and employer obligations in the post-pandemic era. Critical updates for HR professionals.",
      category: "Employment Law",
      type: "policy",
      contentType: "audio",
      date: "2024-05-15",
      readTime: "6 min read",
      priority: "high",
      source: "Department of Labor",
      author: "Employment Law Expert",
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=600&fit=crop&crop=center",
      video: null,
      audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      views: 21560,
      likes: 1205,
      comments: 289,
      shares: 156,
      tags: ["Employment", "Remote Work", "Labor Rights", "Policy"],
      keyPoints: [
        "Right to disconnect legislation",
        "Home office expense reimbursements",
        "Digital surveillance limitations",
        "Flexible work arrangement protections"
      ],
      trending: true,
      featured: false
    },
    {
      id: 4,
      title: "Environmental Compliance: New ESG Reporting Standards",
      summary: "Updated environmental, social, and governance reporting requirements for corporations above certain thresholds. Sustainability meets legal compliance.",
      category: "Environmental Law",
      type: "standard",
      contentType: "article",
      date: "2024-05-12",
      readTime: "7 min read",
      priority: "medium",
      source: "EPA Regulatory Updates",
      author: "Environmental Law Team",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop&crop=center",
      video: null,
      views: 7430,
      likes: 298,
      comments: 45,
      shares: 67,
      tags: ["ESG", "Environment", "Reporting", "Sustainability"],
      keyPoints: [
        "Mandatory climate risk disclosures",
        "Supply chain sustainability reporting",
        "Carbon footprint calculations",
        "Third-party verification requirements"
      ],
      trending: false,
      featured: false
    },
    {
      id: 5,
      title: "Financial Services Reform: Banking Compliance Updates",
      summary: "Comprehensive overview of new banking regulations affecting financial institutions and their compliance obligations. Major changes in financial oversight.",
      category: "Financial Services",
      type: "reform",
      contentType: "video",
      date: "2024-05-10",
      readTime: "9 min read",
      priority: "high",
      source: "Federal Reserve",
      author: "Banking Law Specialist",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=600&fit=crop&crop=center",
      video: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
      views: 15340,
      likes: 723,
      comments: 134,
      shares: 89,
      tags: ["Banking", "Finance", "Compliance", "Regulation"],
      keyPoints: [
        "Enhanced capital requirements",
        "Stress testing modifications",
        "Digital asset regulations",
        "Consumer protection measures"
      ],
      trending: false,
      featured: true
    },
    {
      id: 6,
      title: "Healthcare Privacy: HIPAA Amendment Analysis",
      summary: "Analysis of recent HIPAA amendments affecting healthcare providers and patient data protection requirements. Critical updates for medical professionals.",
      category: "Healthcare Law",
      type: "analysis",
      contentType: "article",
      date: "2024-05-08",
      readTime: "4 min read",
      priority: "medium",
      source: "HHS Privacy Office",
      author: "Healthcare Privacy Expert",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=600&fit=crop&crop=center",
      video: null,
      views: 10890,
      likes: 456,
      comments: 67,
      shares: 45,
      tags: ["HIPAA", "Healthcare", "Privacy", "Medical Data"],
      keyPoints: [
        "Telehealth privacy protections",
        "Patient access rights expansion",
        "Breach notification updates",
        "Third-party app regulations"
      ],
      trending: false,
      featured: false
    },
    {
      id: 7,
      title: "AI in Legal Practice: Regulatory Framework 2024",
      summary: "Groundbreaking regulations governing AI use in legal services.",
      category: "Technology Law",
      type: "framework",
      contentType: "video",
      date: "2024-05-25",
      readTime: "3 min",
      priority: "high",
      source: "Legal Tech Authority",
      author: "AI Law Pioneer",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=1200&fit=crop&crop=center",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      views: 25670,
      likes: 1834,
      comments: 345,
      shares: 234,
      tags: ["AI", "Legal Tech", "Innovation"],
      keyPoints: [
        "AI ethics in legal decision making",
        "Liability for AI-generated advice"
      ],
      trending: true,
      featured: true
    },
    {
      id: 8,
      title: "Cryptocurrency Legal Status: Global Update",
      summary: "Latest developments in cryptocurrency regulations worldwide.",
      category: "Financial Technology",
      type: "update",
      contentType: "audio",
      date: "2024-05-22",
      readTime: "4 min",
      priority: "high",
      source: "Global Crypto Council",
      author: "Crypto Law Expert",
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=1200&fit=crop&crop=center",
      video: null,
      audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      views: 18920,
      likes: 967,
      comments: 198,
      shares: 145,
      tags: ["Cryptocurrency", "Blockchain", "Fintech"],
      keyPoints: [
        "Central bank digital currencies (CBDCs)",
        "Tax implications for crypto transactions"
      ],
      trending: true,
      featured: false
    },
    {
      id: 9,
      title: "Supreme Court Landmark Judgment: Privacy Rights",
      summary: "Historic ruling on digital privacy and data protection rights.",
      category: "Constitutional Law",
      type: "judgment",
      contentType: "video",
      date: "2024-05-28",
      readTime: "6 min",
      priority: "high",
      source: "Supreme Court of India",
      author: "Constitutional Law Expert",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=1200&fit=crop&crop=center",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      views: 34560,
      likes: 2145,
      comments: 567,
      shares: 389,
      tags: ["Privacy", "Supreme Court", "Digital Rights"],
      keyPoints: [
        "Fundamental right to privacy reaffirmed",
        "Digital surveillance limitations"
      ],
      trending: true,
      featured: true
    },
    {
      id: 10,
      title: "Startup Legal Compliance: Essential Checklist",
      summary: "Complete legal compliance guide for new startups.",
      category: "Startup Law",
      type: "guide",
      contentType: "infographic",
      date: "2024-05-26",
      readTime: "5 min",
      priority: "medium",
      source: "Startup Legal Hub",
      author: "Startup Law Advisor",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=1200&fit=crop&crop=center",
      video: null,
      views: 12340,
      likes: 678,
      comments: 123,
      shares: 89,
      tags: ["Startup", "Compliance", "Business Law"],
      keyPoints: [
        "Company registration requirements",
        "Intellectual property protection"
      ],
      trending: false,
      featured: false
    },
    {
      id: 11,
      title: "Contract Law Essentials: Digital Age Updates",
      summary: "Modern contract law principles for digital businesses.",
      category: "Contract Law",
      type: "education",
      contentType: "video",
      date: "2024-05-24",
      readTime: "7 min",
      priority: "medium",
      source: "Contract Law Institute",
      author: "Contract Law Professor",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=1200&fit=crop&crop=center",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      views: 9876,
      likes: 445,
      comments: 87,
      shares: 56,
      tags: ["Contracts", "Digital Business", "Legal Tech"],
      keyPoints: [
        "Electronic signature validity",
        "Smart contract implications"
      ],
      trending: false,
      featured: false
    },
    {
      id: 12,
      title: "Real Estate Law: New Housing Regulations",
      summary: "Latest updates in real estate and housing law.",
      category: "Real Estate Law",
      type: "regulation",
      contentType: "article",
      date: "2024-05-21",
      readTime: "4 min",
      priority: "medium",
      source: "Housing Ministry",
      author: "Real Estate Legal Expert",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=1200&fit=crop&crop=center",
      video: null,
      audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      views: 7654,
      likes: 234,
      comments: 45,
      shares: 23,
      tags: ["Real Estate", "Housing", "Property Law"],
      keyPoints: [
        "RERA compliance updates",
        "Tenant protection measures"
      ],
      trending: false,
      featured: false
    },
    {
      id: 13,
      title: "Legal Podcast: Weekly Legal Briefs",
      summary: "Audio-only legal briefings covering the week's most important legal developments and case studies.",
      category: "Legal Education",
      type: "podcast",
      contentType: "audio",
      date: "2024-05-30",
      readTime: "15 min",
      priority: "medium",
      source: "Legal Briefs Podcast",
      author: "Legal Briefs Team",
      image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=1200&fit=crop&crop=center",
      video: null,
      audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      views: 12500,
      likes: 456,
      comments: 89,
      shares: 67,
      tags: ["Podcast", "Legal Education", "Weekly Briefs"],
      keyPoints: [
        "Weekly legal updates",
        "Case study analysis",
        "Expert interviews"
      ],
      trending: false,
      featured: true
    }
  ];

  const categories = [
    { id: 'all', name: 'For You', icon: Flame, count: legalReelsData.length },
    { id: 'Data Protection', name: 'Privacy', icon: AlertCircle, count: 1 },
    { id: 'Corporate Law', name: 'Corporate', icon: Building, count: 1 },
    { id: 'Employment Law', name: 'Employment', icon: Scale, count: 1 },
    { id: 'Technology Law', name: 'Tech Law', icon: TrendingUp, count: 1 },
    { id: 'Financial Technology', name: 'Fintech', icon: Award, count: 1 },
    { id: 'Constitutional Law', name: 'Constitutional', icon: Scale, count: 1 },
    { id: 'Startup Law', name: 'Startup', icon: TrendingUp, count: 1 },
    { id: 'Contract Law', name: 'Contracts', icon: FileText, count: 1 },
    { id: 'Legal Education', name: 'Audio', icon: Headphones, count: 1 }
  ];

  const filteredPosts = legalReelsData.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    return matchesCategory;
  });

  // Utility function for number formatting
  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Premium Instagram-style ReelsCard component with audio support
  const ReelsCard = ({ post, index, isActive }) => {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isLikeAnimating, setIsLikeAnimating] = useState(false);
    const videoRef = useRef(null);
    const audioRef = useRef(null);

    // Stable video/audio management that doesn't reset on theme changes
    useEffect(() => {
      if (videoRef.current && post.video) {
        if (isActive && isAutoPlay) {
          videoRef.current.play().catch(console.log);
          setIsVideoPlaying(true);
        } else {
          videoRef.current.pause();
          setIsVideoPlaying(false);
        }
      }
    }, [isActive, post.video, isAutoPlay]);

    useEffect(() => {
      if (audioRef.current && post.audio) {
        if (isActive && isAutoPlay) {
          audioRef.current.play().catch(console.log);
          setIsAudioPlaying(true);
        } else {
          audioRef.current.pause();
          setIsAudioPlaying(false);
        }
      }
    }, [isActive, post.audio, isAutoPlay]);

    const toggleVideoPlay = () => {
      if (videoRef.current) {
        if (isVideoPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsVideoPlaying(!isVideoPlaying);
      }
    };

    const toggleAudioPlay = () => {
      if (audioRef.current) {
        if (isAudioPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsAudioPlaying(!isAudioPlaying);
      }
    };

    const handleDoubleTap = (e) => {
      e.preventDefault();
      if (!likedPosts.has(post.id)) {
        handleLike(post.id);
        setIsLikeAnimating(true);
        setTimeout(() => setIsLikeAnimating(false), 1000);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ 
          opacity: isActive ? 1 : 0.7,
          y: 0,
          scale: isActive ? 1 : 0.95
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black overflow-hidden snap-start flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleTap}
      >
        {/* Professional Container with better scaling */}
        <div className="relative w-full max-w-lg h-full mx-auto bg-black overflow-hidden rounded-2xl shadow-2xl">
          {/* Elegant frame for larger screens */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none z-10">
            <div className="w-full h-full border-4 border-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl shadow-2xl"></div>
          </div>
          {/* HD Background Media with Auto-play */}
          <div className="absolute inset-0">
            {post.video ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  loop
                  muted={isMuted}
                  playsInline
                  autoPlay={isActive}
                  poster={post.image}
                  preload="metadata"
                >
                  <source src={post.video} type="video/mp4" />
                </video>
                
                {/* Elegant Video Controls */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300">
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleVideoPlay}
                    className="w-20 h-20 bg-black/30 backdrop-blur-2xl rounded-full flex items-center justify-center text-white border border-white/40 shadow-2xl hover:bg-black/40 transition-all duration-300"
                  >
                    {isVideoPlaying ? 
                      <Pause size={28} className="drop-shadow-xl" /> : 
                      <Play size={28} className="ml-1 drop-shadow-xl" />
                    }
                  </motion.button>
                </div>
                
                {/* Professional Sound Toggle */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMuted(!isMuted)}
                  className="absolute top-6 right-6 w-12 h-12 bg-black/30 backdrop-blur-2xl rounded-full flex items-center justify-center text-white border border-white/40 shadow-2xl hover:bg-black/40 transition-all duration-300"
                >
                  {isMuted ? 
                    <VolumeX size={18} className="drop-shadow-xl" /> : 
                    <Volume2 size={18} className="drop-shadow-xl" />
                  }
                </motion.button>
              </div>
            ) : post.audio ? (
              <div className="relative w-full h-full">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                
                {/* Audio Visualizer */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 shadow-2xl">
                    <motion.div
                      animate={isAudioPlaying ? { 
                        scale: [1, 1.2, 1],
                        rotate: [0, 360]
                      } : {}}
                      transition={{ 
                        duration: 2, 
                        repeat: isAudioPlaying ? Infinity : 0,
                        ease: "linear"
                      }}
                      className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center"
                    >
                      <Headphones size={32} className="text-white drop-shadow-xl" />
                    </motion.div>
                  </div>
                </div>
                
                {/* Audio Controls */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300">
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleAudioPlay}
                    className="w-20 h-20 bg-black/30 backdrop-blur-2xl rounded-full flex items-center justify-center text-white border border-white/40 shadow-2xl hover:bg-black/40 transition-all duration-300"
                  >
                    {isAudioPlaying ? 
                      <Pause size={28} className="drop-shadow-xl" /> : 
                      <Play size={28} className="ml-1 drop-shadow-xl" />
                    }
                  </motion.button>
                </div>
                
                {/* Audio Indicator */}
                <motion.div
                  animate={isAudioPlaying ? { 
                    scale: [1, 1.1, 1],
                    opacity: [0.6, 1, 0.6]
                  } : {}}
                  transition={{ 
                    duration: 1.5, 
                    repeat: isAudioPlaying ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                  className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-r from-purple-500/40 to-pink-500/40 backdrop-blur-2xl rounded-full flex items-center justify-center border border-purple-400/50 shadow-2xl"
                >
                  <Music size={18} className="text-white drop-shadow-xl" />
                </motion.div>
                
                <audio
                  ref={audioRef}
                  loop
                  muted={isMuted}
                  preload="metadata"
                >
                  <source src={post.audio} type="audio/wav" />
                </audio>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
            </div>
            )}
            
            {/* Professional Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/30"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
            
            {/* Double-tap Heart Animation */}
            <AnimatePresence>
              {isLikeAnimating && (
                <motion.div
                  initial={{ scale: 0, opacity: 0, rotate: -30 }}
                  animate={{ scale: 1.8, opacity: 1, rotate: 0 }}
                  exit={{ scale: 2.5, opacity: 0, rotate: 30 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div className="relative">
                    <Heart size={100} className="text-red-500 fill-current drop-shadow-2xl" />
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                      transition={{ duration: 1, repeat: 2 }}
                      className="absolute inset-0 rounded-full bg-red-500/20"
                    />
            </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Optimized Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-between text-white">
            {/* Minimal Top Header */}
            <div className="flex items-start justify-between p-4 pt-8">
              <div className="flex items-center gap-2">
                {post.trending && (
                  <motion.div
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, 2, -2, 0]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2,
                      ease: "easeInOut"
                    }}
                    className="px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-pink-500/40 to-orange-500/40 border border-pink-400/60 text-white backdrop-blur-xl shadow-xl"
                  >
                    <div className="flex items-center gap-1.5">
                      <Flame size={12} className="text-orange-300" />
                      <span>TRENDING</span>
        </div>
                  </motion.div>
                )}
                
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-xl border shadow-lg ${
                    post.priority === 'high' 
                      ? 'bg-red-500/30 border-red-400/50 text-red-200'
                      : post.priority === 'medium'
                      ? 'bg-yellow-500/30 border-yellow-400/50 text-yellow-200'
                      : 'bg-green-500/30 border-green-400/50 text-green-200'
                  }`}
                >
                  {post.priority.toUpperCase()}
                </motion.div>
            </div>

              <motion.button 
                whileHover={{ scale: 1.1, rotate: 45 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 bg-black/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 shadow-xl hover:bg-black/40 transition-all duration-300"
              >
                <MoreVertical size={18} />
              </motion.button>
            </div>

            {/* Compact Bottom Content */}
            <div className="p-4 pb-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
              {/* Compact Author Section */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="relative w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold shadow-xl border-2 border-white/30"
                  >
                    {post.author?.charAt(0) || 'L'}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border border-black"></div>
                  </motion.div>
            <div>
                    <p className="font-bold text-sm">{post.author || 'Legal Expert'}</p>
                    <p className="text-xs text-white/60">{post.source}</p>
            </div>
          </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-xs font-bold backdrop-blur-xl border border-white/30 shadow-lg"
                >
                  Follow
                </motion.button>
        </div>

              {/* Compact Content */}
              <div className="space-y-2">
                <h2 className="text-lg font-bold leading-tight line-clamp-2">
                  {post.title}
                </h2>
                
                <p className="text-sm text-white/80 line-clamp-1">
                  {post.summary}
                </p>
                
                {/* Compact Tags */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                  {post.tags.slice(0, 3).map((tag, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 bg-white/15 backdrop-blur-xl rounded-full text-xs font-medium border border-white/20 whitespace-nowrap"
                    >
                      #{tag}
                    </span>
                  ))}
                  </div>
                  
                {/* Compact Stats */}
                <div className="flex items-center justify-between text-xs text-white/60 pt-2">
                  <div className="flex items-center gap-4">
                    <span>{formatNumber(post.views)} views</span>
                    <span>{post.readTime}</span>
                  </div>
                  <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Professional Side Actions with Enhanced Design */}
          <div className="absolute right-4 bottom-32 flex flex-col gap-6">
            {/* Enhanced Like Button */}
            <motion.div
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center gap-2"
            >
              <motion.button
                onClick={() => handleLike(post.id)}
                className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-2xl border-2 shadow-2xl transition-all duration-500 ${
                  likedPosts.has(post.id)
                    ? 'bg-gradient-to-br from-red-500/60 to-pink-500/60 border-red-300/80 text-red-100 shadow-red-500/40'
                    : 'bg-white/20 border-white/50 text-white hover:bg-white/30 hover:border-white/70 hover:shadow-white/30'
                }`}
                animate={likedPosts.has(post.id) ? { 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                } : {}}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Heart 
                  size={24} 
                  className={`${likedPosts.has(post.id) ? 'fill-current text-red-200' : ''} drop-shadow-xl`} 
                />
              </motion.button>
              <motion.span 
                animate={{ scale: likedPosts.has(post.id) ? [1, 1.1, 1] : 1 }}
                className="text-xs font-bold text-white drop-shadow-lg bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm"
              >
                {formatNumber(post.likes + (likedPosts.has(post.id) ? 1 : 0))}
              </motion.span>
            </motion.div>
            
            {/* Enhanced Comment Button */}
            <motion.div
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center gap-2"
            >
              <motion.button
                onClick={() => {
                  setCurrentCommentPost(post);
                  setShowComments(true);
                }}
                className="w-14 h-14 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-2xl border-2 border-white/50 text-white hover:bg-white/30 hover:border-white/70 shadow-2xl hover:shadow-white/30 transition-all duration-500"
                whileHover={{ rotate: 15 }}
                transition={{ duration: 0.3 }}
              >
                <MessageCircle size={24} className="drop-shadow-xl" />
              </motion.button>
              <span className="text-xs font-bold text-white drop-shadow-lg bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
                {formatNumber(post.comments)}
                          </span>
            </motion.div>
            
            {/* Enhanced Save Button */}
            <motion.div
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center gap-2"
            >
              <motion.button
                onClick={() => handleSave(post.id)}
                className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-2xl border-2 shadow-2xl transition-all duration-500 ${
                  savedPosts.has(post.id)
                    ? 'bg-gradient-to-br from-yellow-500/60 to-orange-500/60 border-yellow-300/80 text-yellow-100 shadow-yellow-500/40'
                    : 'bg-white/20 border-white/50 text-white hover:bg-white/30 hover:border-white/70 hover:shadow-white/30'
                }`}
                animate={savedPosts.has(post.id) ? { 
                  scale: [1, 1.2, 1],
                  rotate: [0, -10, 10, 0]
                } : {}}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Bookmark 
                  size={24} 
                  className={`${savedPosts.has(post.id) ? 'fill-current text-yellow-200' : ''} drop-shadow-xl`} 
                />
              </motion.button>
            </motion.div>
            
            {/* Enhanced Share Button */}
            <motion.div
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center gap-2"
            >
              <motion.button
                onClick={() => handleShare(post)}
                className="w-14 h-14 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-2xl border-2 border-white/50 text-white hover:bg-white/30 hover:border-white/70 shadow-2xl hover:shadow-white/30 transition-all duration-500"
                whileHover={{ rotate: -15 }}
                transition={{ duration: 0.3 }}
              >
                <Share2 size={24} className="drop-shadow-xl" />
              </motion.button>
              <span className="text-xs font-bold text-white drop-shadow-lg bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
                {formatNumber(post.shares)}
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Handle post interactions
  const handleLike = useCallback((postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  }, []);

  const handleSave = useCallback((postId) => {
    setSavedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  }, []);

  const handleShare = useCallback((post) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.summary,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${post.title}\n${post.summary}\n${window.location.href}`);
    }
  }, []);

  // Instagram-style jump scrolling implementation
  const jumpToReel = useCallback((index) => {
    if (index >= 0 && index < filteredPosts.length) {
      setCurrentIndex(index);
      setIsScrolling(true);
      
      // Smooth scroll to the reel
      if (reelsContainerRef.current) {
        const targetScroll = index * window.innerHeight;
        scrollY.set(targetScroll);
        reelsContainerRef.current.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      }
      
      // Clear scrolling state after animation
      setTimeout(() => setIsScrolling(false), 500);
    }
  }, [filteredPosts.length, scrollY]);

  // Enhanced touch handling for Instagram-style gestures
  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    });
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setTouchEnd({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    });
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging || !touchStart.time || !touchEnd.time) return;
    
    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;
    const deltaTime = touchEnd.time - touchStart.time;
    const velocity = Math.abs(deltaY) / deltaTime;
    
    setIsDragging(false);
    
    // Instagram-style jump detection
    const minSwipeDistance = 80;
    const minVelocity = 0.3;
    
    if (Math.abs(deltaY) > Math.abs(deltaX) && 
        (Math.abs(deltaY) > minSwipeDistance || velocity > minVelocity)) {
      
      if (deltaY > 0 && currentIndex < filteredPosts.length - 1) {
        // Swipe up - next reel with jump animation
        jumpToReel(currentIndex + 1);
      } else if (deltaY < 0 && currentIndex > 0) {
        // Swipe down - previous reel with jump animation
        jumpToReel(currentIndex - 1);
      }
    }
  }, [isDragging, touchStart, touchEnd, currentIndex, filteredPosts.length, jumpToReel]);

  // Scroll event handler for jump scrolling
  const handleScroll = useCallback((e) => {
    if (isScrolling) return;
    
    const container = e.target;
    const scrollTop = container.scrollTop;
    const reelHeight = window.innerHeight;
    const newIndex = Math.round(scrollTop / reelHeight);
    
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < filteredPosts.length) {
      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Debounce scroll updates
      scrollTimeoutRef.current = setTimeout(() => {
        setCurrentIndex(newIndex);
      }, 100);
    }
  }, [currentIndex, filteredPosts.length, isScrolling]);

  // Keyboard navigation for desktop
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowUp' && currentIndex > 0) {
      e.preventDefault();
      jumpToReel(currentIndex - 1);
    } else if (e.key === 'ArrowDown' && currentIndex < filteredPosts.length - 1) {
      e.preventDefault();
      jumpToReel(currentIndex + 1);
    }
  }, [currentIndex, filteredPosts.length, jumpToReel]);

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-black overflow-hidden">
      {/* Enhanced Reels Container with Better Scaling */}
      <div 
        ref={reelsContainerRef}
        className="h-full w-full overflow-y-auto snap-y snap-mandatory scrollbar-hide"
        onScroll={handleScroll}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        <AnimatePresence mode="wait">
          {filteredPosts.map((post, index) => (
            <ReelsCard 
              key={post.id} 
              post={post} 
              index={index}
              isActive={index === currentIndex}
            />
          ))}
        </AnimatePresence>
                        </div>
                        
      {/* Professional Navigation Dots */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40">
        <div className="flex flex-col gap-4">
          {filteredPosts.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((_, idx) => {
            const actualIndex = Math.max(0, currentIndex - 2) + idx;
            return (
              <motion.button
                key={actualIndex}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => jumpToReel(actualIndex)}
                className={`w-3 h-8 rounded-full backdrop-blur-xl border-2 transition-all duration-500 ${
                  actualIndex === currentIndex
                    ? 'bg-gradient-to-b from-purple-400 via-pink-400 to-red-400 border-white/60 shadow-lg shadow-purple-500/40'
                    : 'bg-white/20 border-white/50 hover:bg-white/30 hover:border-white/70'
                }`}
              />
            );
          })}
                        </div>
                      </div>

      {/* Professional Floating Controls */}
      <div className="fixed top-6 right-6 z-40 flex flex-col gap-3">
        {/* Enhanced Filter Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowFilters(!showFilters)}
          className={`w-12 h-12 backdrop-blur-2xl rounded-full flex items-center justify-center text-white border-2 shadow-2xl transition-all duration-500 ${
            showFilters
              ? 'bg-gradient-to-r from-purple-500/50 to-pink-500/50 border-purple-400/60 shadow-purple-500/30'
              : 'bg-black/30 border-white/50 hover:bg-black/40 hover:border-white/70'
          }`}
        >
          <Filter size={20} />
        </motion.button>
      </div>

      {/* Enhanced Filter Overlay */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-4 right-4 z-50 bg-black/90 backdrop-blur-2xl rounded-3xl border border-white/30 p-6 shadow-2xl"
          >
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.id;
                return (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setShowFilters(false);
                    }}
                    className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-medium backdrop-blur-xl border-2 transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-500/50 to-purple-500/50 border-indigo-400/70 text-indigo-100 shadow-lg shadow-indigo-500/30'
                        : 'bg-white/15 border-white/30 text-white hover:bg-white/25 hover:border-white/50'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{category.name}</span>
                    {category.count > 0 && (
                      <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold">
                        {category.count}
                          </span>
                        )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

        {/* Enhanced Comments Modal */}
        <AnimatePresence>
          {showComments && currentCommentPost && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-50 flex items-end"
              onClick={() => setShowComments(false)}
            >
              <motion.div
                initial={{ y: '100%', scale: 0.9 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: '100%', scale: 0.9 }}
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                className="w-full max-h-[85vh] rounded-t-3xl overflow-hidden bg-gradient-to-b from-slate-900/95 to-black/95 border-t-2 border-gradient-to-r from-purple-500/50 to-pink-500/50 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Enhanced Comments Header */}
                <div className="p-6 border-b border-white/20 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
                        <MessageCircle size={28} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          Comments
                        </h3>
                        <p className="text-sm text-white/70">{formatNumber(currentCommentPost.comments)} comments</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowComments(false)}
                      className="w-12 h-12 rounded-full flex items-center justify-center bg-white/15 backdrop-blur-xl border border-white/30 text-white hover:bg-white/25 transition-all duration-300"
                    >
                      <X size={20} />
                    </motion.button>
                  </div>
                          </div>
                          
                {/* Enhanced Comments List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {[
                    { 
                      user: 'Legal Professional', 
                      avatar: 'LP',
                      comment: 'Excellent breakdown of the new regulations! This will definitely help our compliance team understand the implications better.', 
                      time: '2h ago',
                      likes: 24,
                      verified: true,
                      replies: 3
                    },
                    { 
                      user: 'Business Owner', 
                      avatar: 'BO',
                      comment: 'Thank you for sharing this. The key points are extremely helpful for understanding the implications for small businesses.', 
                      time: '4h ago',
                      likes: 12,
                      verified: false,
                      replies: 1
                    },
                    { 
                      user: 'Law Student', 
                      avatar: 'LS',
                      comment: 'Amazing content! This makes complex legal concepts so much easier to understand. Great work!', 
                      time: '6h ago',
                      likes: 8,
                      verified: false,
                      replies: 0
                    },
                    { 
                      user: 'Corporate Counsel', 
                      avatar: 'CC',
                      comment: 'This is exactly what we needed for our quarterly compliance review. The practical examples are invaluable.', 
                      time: '8h ago',
                      likes: 15,
                      verified: true,
                      replies: 2
                    }
                  ].map((comment, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-xl border-2 border-white/30">
                          {comment.avatar}
                          </div>
                        {comment.verified && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-black">
                            <Crown size={10} className="text-white" />
                          </div>
                        )}
                          </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-bold text-white text-base">{comment.user}</span>
                          {comment.verified && (
                            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full border border-blue-400/30">
                              Verified
                            </span>
                          )}
                          <span className="text-xs text-white/50">{comment.time}</span>
                        </div>
                        <p className="text-sm text-white/90 leading-relaxed mb-3">{comment.comment}</p>
                        <div className="flex items-center gap-6">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="flex items-center gap-2 text-xs text-white/70 hover:text-white/90 transition-colors bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm"
                          >
                            <Heart size={14} />
                            <span>{comment.likes}</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 text-xs text-white/70 hover:text-white/90 transition-colors bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm"
                          >
                            <Reply size={14} />
                            <span>Reply {comment.replies > 0 && `(${comment.replies})`}</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-xs text-white/70 hover:text-white/90 transition-colors"
                          >
                            <Flag size={14} />
                          </motion.button>
                      </div>
                    </div>
                    </motion.div>
              ))}
            </div>

                {/* Enhanced Comment Input */}
                <div className="p-6 border-t border-white/20 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-xl">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-xl border-2 border-white/30">
                      You
            </div>
                    <div className="flex-1 flex gap-3">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts on this legal update..."
                        className="flex-1 px-6 py-4 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 transition-all duration-300 text-sm"
                      />
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all duration-300 ${
                          newComment.trim() 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-2xl' 
                            : 'bg-white/20 cursor-not-allowed'
                        }`}
                        disabled={!newComment.trim()}
                      >
                        <Send size={20} />
                      </motion.button>
          </div>
        </div>
      </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

    </div>
  );
};

export default InformationHub;