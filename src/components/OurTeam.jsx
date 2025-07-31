import { useState, useEffect, useRef, useMemo } from "react";
import { 
  Users, Mail, Linkedin, Twitter, Globe, ChevronLeft, 
  ChevronRight, X, Award, Briefcase, MessageCircle,
  Star, Sparkles, ArrowRight, TrendingUp,
  Heart, Zap, Activity
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function EnhancedTeamComponent() {
  const { isDark, colors } = useTheme();
  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleTeam, setVisibleTeam] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(4);
  const [isVisible, setIsVisible] = useState({});
  const sliderRef = useRef(null);
  const teamSectionRef = useRef(null);
  
  // Team member data
  const teamMembers = useMemo(() => [
    {
      id: 1,
      name: "Aisha Patel",
      role: "Founder & CEO",
      categories: ["leadership", "legal"],
      bio: "With over 15 years of experience in corporate law and technology startups, Aisha founded MeraBakil with a vision to democratize legal services. She holds a J.D. from Harvard Law School and previously served as legal counsel for several Fortune 500 companies.",
      expertise: ["Corporate Law", "Legal Tech", "Strategic Leadership"],
      experience: "15+ years",
      rating: "5.0",
      casesHandled: "500+",
      image: "https://i0.wp.com/www.startuplanes.com/wp-content/uploads/2023/03/8.jpg?resize=800%2C800&ssl=1",
      social: {
        email: "aisha@merabakil.com",
        linkedin: "aishapatel",
        twitter: "aisha_merabakil"
      },
      quote: "Technology should bridge gaps, not create them. At MeraBakil, we're building bridges to justice."
    },
    {
      id: 2,
      name: "Dr. Rajiv Sharma",
      role: "Chief Legal Officer",
      categories: ["leadership", "legal"],
      bio: "Dr. Sharma brings 20+ years of legal expertise with specialization in constitutional law. He oversees all legal operations and ensures the accuracy of information provided through our platform. He's published numerous papers on the intersection of law and technology.",
      expertise: ["Constitutional Law", "Legal Education", "Policy Development"],
      experience: "20+ years",
      rating: "4.9",
      casesHandled: "1000+",
      image: "https://static.businessworld.in/rajiv%20sharma_20240901151236_original_image_47.webp",
      social: {
        email: "rajiv@merabakil.com",
        linkedin: "rajivsharma"
      },
      quote: "Our commitment to accuracy and clarity makes complex legal concepts accessible to everyone."
    },
    {
      id: 3,
      name: "Sophia Chen",
      role: "Chief Technology Officer",
      categories: ["leadership", "tech"],
      bio: "Sophia leads our technology innovation with expertise in AI and machine learning. Before joining MeraBakil, she developed AI solutions for legal document analysis at a leading tech firm. She holds a Ph.D. in Computer Science from MIT.",
      expertise: ["Artificial Intelligence", "Machine Learning", "Legal Tech Integration"],
      experience: "12+ years",
      rating: "4.8",
      casesHandled: "300+",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrTwzFHTF-AkNNmDQlknrYC2qd48i_dkro6A&s0",
      social: {
        email: "sophia@merabakil.com",
        linkedin: "sophiachen",
        twitter: "sophia_tech"
      },
      quote: "AI isn't just about automation—it's about augmentation, making legal expertise more accessible and effective."
    },
    {
      id: 4,
      name: "Marcus Johnson",
      role: "Head of User Experience",
      categories: ["tech", "design"],
      bio: "Marcus ensures our platform remains intuitive and accessible to all users regardless of their familiarity with legal systems. His human-centered design approach has been key to making complex legal information understandable.",
      expertise: ["UX/UI Design", "Accessibility", "User Research"],
      experience: "8+ years",
      rating: "4.7",
      casesHandled: "200+",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTTr9wR4w0U_WRNsvoO-432UsXR_bxmDSTng&s",
      social: {
        email: "marcus@merabakil.com",
        linkedin: "marcusjohnson"
      },
      quote: "Good design removes barriers. Great design creates pathways to empowerment."
    },
    {
      id: 5,
      name: "Priya Malhotra",
      role: "Senior Legal Advisor",
      categories: ["legal"],
      bio: "Specializing in family law and dispute resolution, Priya helps develop our educational content and consultation frameworks. She's passionate about making legal assistance accessible to underserved communities.",
      expertise: ["Family Law", "Dispute Resolution", "Legal Education"],
      experience: "10+ years",
      rating: "4.9",
      casesHandled: "600+",
      image: "https://img.freepik.com/premium-photo/portrait-young-indian-female-lawyer-smiling-happy-her-workplace-office-indian-lawyer-technologist-professional-face-female-lawyer-legal-consultant-law-firm_785351-3584.jpg?w=360",
      social: {
        email: "priya@merabakil.com",
        linkedin: "priyamalhotra"
      },
      quote: "Justice isn't just about winning cases—it's about finding resolutions that heal and empower."
    },
    {
      id: 6,
      name: "David Okafor",
      role: "AI Research Lead",
      categories: ["tech", "research"],
      bio: "David heads our AI research initiatives, focusing on improving natural language processing for legal inquiries. His innovations have significantly enhanced the accuracy of our automated legal information system.",
      expertise: ["Natural Language Processing", "Machine Learning", "Legal AI"],
      experience: "7+ years",
      rating: "4.8",
      casesHandled: "150+",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbM4kSFHRNM2Csfk1kibvs5pHNPpbVmt2pn8gtpuTDzP4rNpSQw_T5HXAqrdVPbUvjb80&usqp=CAU",
      social: {
        email: "david@merabakil.com",
        linkedin: "davidokafor",
        twitter: "david_ai_law"
      },
      quote: "The future of legal services lies at the intersection of human expertise and technological innovation."
    },
    {
      id: 7,
      name: "Elena Vasquez",
      role: "Community Outreach Director",
      categories: ["outreach", "legal"],
      bio: "Elena builds partnerships with legal aid organizations and community centers to extend our services to those who need them most. Her background in public interest law informs her approach to accessibility initiatives.",
      expertise: ["Public Interest Law", "Community Engagement", "Access to Justice"],
      experience: "9+ years",
      rating: "4.9",
      casesHandled: "400+",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy_Jmbsw732Z6mzuK-TI9gqh-0YJSle3oew4N80qkIa0cwXETlTwX1lehb-a-LxvbJFZI&usqp=CAU",
      social: {
        email: "elena@merabakil.com",
        linkedin: "elenavasquez"
      },
      quote: "True access to justice requires meeting people where they are, both digitally and in their communities."
    },
    {
      id: 8,
      name: "Hiroshi Tanaka",
      role: "International Legal Specialist",
      categories: ["legal", "international"],
      bio: "Hiroshi specializes in international law and cross-border legal issues. As we expand globally, his expertise ensures our platform adapts to different legal frameworks while maintaining accuracy and relevance.",
      expertise: ["International Law", "Cross-Border Compliance", "Legal Localization"],
      experience: "14+ years",
      rating: "4.8",
      casesHandled: "800+",
      image: "https://superlawyer.in/wp-content/uploads/2023/07/image_6483441-1000x600.jpg",
      social: {
        email: "hiroshi@merabakil.com",
        linkedin: "hiroshitanaka",
        twitter: "hiroshi_intlaw"
      },
      quote: "Law transcends borders, but its application is always local. Our challenge is to bridge that gap."
    }
  ], []);
  
  // Categories for filtering
  const categories = [
    { id: "all", name: "All Team" },
    { id: "leadership", name: "Leadership" },
    { id: "legal", name: "Legal Experts" },
    { id: "tech", name: "Technology" },
    { id: "research", name: "Research" },
    { id: "outreach", name: "Community Outreach" },
    { id: "international", name: "International" }
  ];

  // Handle window resize and intersection observer
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerSlide(1);
      } else if (width < 1024) {
        setItemsPerSlide(2);
      } else if (width < 1280) {
        setItemsPerSlide(3);
      } else {
        setItemsPerSlide(4);
      }
    };
    
    // Intersection Observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = entry.target.getAttribute('data-index');
            setIsVisible(prev => ({ ...prev, [index]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const teamCards = document.querySelectorAll('.team-card');
    teamCards.forEach(card => observer.observe(card));
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      teamCards.forEach(card => observer.unobserve(card));
    };
  }, []);
  
  // Initialize visible team on mount
  useEffect(() => {
    setVisibleTeam(teamMembers);
  }, [teamMembers]);
  
  // Filter team members based on active category
  useEffect(() => {
    if (activeCategory === "all") {
      setVisibleTeam(teamMembers);
    } else {
      setVisibleTeam(teamMembers.filter(member => member.categories.includes(activeCategory)));
    }
    setCurrentSlide(0);
  }, [activeCategory, teamMembers]);
  
  // Slider functions
  const nextSlide = () => {
    const maxSlides = Math.ceil((visibleTeam?.length || 0) / itemsPerSlide) - 1;
    setCurrentSlide(current => current < maxSlides ? current + 1 : 0);
  };
  
  const prevSlide = () => {
    const maxSlides = Math.ceil((visibleTeam?.length || 0) / itemsPerSlide) - 1;
    setCurrentSlide(current => current > 0 ? current - 1 : maxSlides);
  };
  
  // Scroll to team section
  const scrollToTeam = () => {
    teamSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Close team member detail modal
  const closeModal = () => {
    setSelectedMember(null);
  };

  // Don't render until team members are loaded
  if (!visibleTeam || visibleTeam.length === 0) {
    return (
      <div className={`min-h-screen py-16 flex items-center justify-center`}
        style={{
          backgroundColor: isDark ? colors.background : colors.backgroundSecondary,
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: colors.primary }}
          ></div>
          <p style={{ color: colors.textSecondary }}>Loading team members...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={teamSectionRef}
      className={`w-full py-16 mt-20 transition-all duration-500 relative overflow-hidden`}
      style={{
        backgroundColor: isDark ? colors.background : colors.backgroundSecondary,
        color: isDark ? colors.textPrimary : colors.textPrimary
      }}
    >
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 rounded-full"
             style={{
               background: `radial-gradient(circle, ${colors.primary} 0%, transparent 50%)`,
               animation: 'float 8s ease-in-out infinite'
             }}></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full"
             style={{
               background: `radial-gradient(circle, ${colors.accent} 0%, transparent 50%)`,
               animation: 'float 10s ease-in-out infinite reverse'
             }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Enhanced Header Section */}
        <div className="text-center mb-20 relative">
          
          {/* Floating Elements */}
          <div className="absolute -top-4 -right-4 opacity-20">
            <Star className="w-8 h-8 animate-pulse" style={{ color: colors.primary }} />
          </div>
          <div className="absolute -bottom-4 -left-4 opacity-20">
            <Sparkles className="w-6 h-6 animate-bounce" style={{ color: colors.accent }} />
          </div>
          
          <div className="inline-flex items-center justify-center mb-6 px-6 py-3 rounded-full backdrop-blur-sm border-2 border-opacity-20"
               style={{ 
                 backgroundColor: isDark ? 'rgba(56, 189, 248, 0.1)' : 'rgba(14, 165, 233, 0.1)',
                 color: colors.primary,
                 borderColor: colors.primary
               }}>
            <Users className="w-5 h-5 mr-2" />
            <span className="text-sm font-semibold uppercase tracking-wider">Meet Our Team</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
              style={{ 
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
            The People Behind MeraBakil
          </h1>
          
          <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-12 leading-relaxed" 
             style={{ color: colors.textSecondary }}>
            Our diverse team of legal experts, technologists, and community advocates 
            work together to make legal services accessible, understandable, and effective for everyone.
          </p>
          
          <button 
            onClick={scrollToTeam}
            className="group inline-flex items-center px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl border-2"
            style={{ 
              backgroundColor: colors.primary, 
              color: colors.background,
              borderColor: colors.primary
            }}
          >
            <span>Meet The Experts</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        {/* Enhanced Category Filter Tabs */}
        <div className="sticky top-0 z-30 py-6 backdrop-blur-md -mx-4 px-4 sm:static sm:py-0 sm:backdrop-blur-none sm:mx-0 sm:px-0 mb-16"
             style={{ 
               backgroundColor: isDark ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
               borderRadius: '0 0 24px 24px'
             }}
        >
          <div className="flex flex-nowrap overflow-x-auto md:flex-wrap md:overflow-visible justify-start md:justify-center gap-3 md:gap-4 pb-2 md:pb-0 scrollbar-hide">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`group relative px-6 py-3 rounded-2xl text-sm md:text-base font-medium whitespace-nowrap transition-all duration-300 border-2 backdrop-blur-sm ${
                  activeCategory === category.id 
                    ? "shadow-xl transform scale-105"
                    : "hover:scale-102 hover:shadow-lg"
                }`}
                style={{ 
                  backgroundColor: activeCategory === category.id 
                    ? colors.primary
                    : (isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.8)'),
                  color: activeCategory === category.id 
                    ? colors.background 
                    : colors.textPrimary,
                  borderColor: activeCategory === category.id 
                    ? colors.primary 
                    : colors.border,
                  boxShadow: activeCategory === category.id 
                    ? `0 10px 30px ${colors.primary}30` 
                    : 'none'
                }}
              >
                <span className="relative z-10">{category.name}</span>
                
                {/* Animated background for active state */}
                {activeCategory === category.id && (
                  <div className="absolute inset-0 rounded-2xl animate-pulse"
                       style={{
                         background: `linear-gradient(135deg, ${colors.primary}90, ${colors.accent}90)`,
                         opacity: 0.2
                       }}></div>
                )}
                
                {/* Hover effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                     style={{
                       background: `linear-gradient(135deg, ${colors.primary}10, ${colors.accent}10)`
                     }}></div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Enhanced Team Members Section */}
        <div className="relative">
          
          {/* Enhanced Section Header */}
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center">
              <div className="w-1 h-12 rounded-full mr-4"
                   style={{ backgroundColor: colors.primary }}></div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold" style={{ color: colors.primary }}>
                  {activeCategory === "all" ? "Our Expert Team" : categories.find(c => c.id === activeCategory)?.name}
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  {visibleTeam?.length || 0} {(visibleTeam?.length || 0) === 1 ? 'member' : 'members'}
                </p>
              </div>
            </div>
            
            {/* Enhanced Desktop Navigation */}
            <div className="hidden md:flex gap-3">
              <button 
                onClick={prevSlide}
                className="group w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 border-2 backdrop-blur-sm"
                style={{
                  backgroundColor: isDark ? colors.backgroundSecondary : colors.background,
                  color: colors.primary,
                  borderColor: colors.border
                }}
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={nextSlide}
                className="group w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 border-2 backdrop-blur-sm"
                style={{
                  backgroundColor: isDark ? colors.backgroundSecondary : colors.background,
                  color: colors.primary,
                  borderColor: colors.border
                }}
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          
          {/* Enhanced Mobile Navigation */}
          <div className="absolute top-1/2 -left-4 md:-left-8 transform -translate-y-1/2 z-20">
            <button 
              onClick={prevSlide}
              className="group w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-xl border-2 backdrop-blur-sm hover:scale-110 transition-all duration-300"
              style={{
                backgroundColor: isDark ? colors.backgroundSecondary : colors.background,
                color: colors.primary,
                borderColor: colors.border
              }}
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="absolute top-1/2 -right-4 md:-right-8 transform -translate-y-1/2 z-20">
            <button 
              onClick={nextSlide}
              className="group w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-xl border-2 backdrop-blur-sm hover:scale-110 transition-all duration-300"
              style={{
                backgroundColor: isDark ? colors.backgroundSecondary : colors.background,
                color: colors.primary,
                borderColor: colors.border
              }}
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          {/* Team Cards Carousel */}
          <div 
            ref={sliderRef}
            className="overflow-hidden"
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ 
                transform: `translateX(-${currentSlide * (100 / Math.min(itemsPerSlide, visibleTeam?.length || 1))}%)`,
              }}
            >
              {visibleTeam?.map((member, index) => (
                <div 
                  key={member.id} 
                  data-index={index}
                  className="team-card w-full min-w-full sm:min-w-[50%] lg:min-w-[33.333%] xl:min-w-[25%] p-3"
                  style={{
                    width: `${100 / Math.min(itemsPerSlide, visibleTeam?.length || 1)}%`,
                  }}
                >
                  <div 
                    onClick={() => setSelectedMember(member)}
                    className={`group h-full cursor-pointer relative overflow-hidden rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 backdrop-blur-sm border border-opacity-20 hover:border-opacity-40 ${
                      isVisible[index] ? 'animate-fadeIn' : 'opacity-0'
                    }`}
                    style={{ 
                      backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.95)',
                      borderColor: colors.border,
                      borderTop: `4px solid ${colors.primary}`,
                    }}
                  >
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                         style={{
                           background: `radial-gradient(circle at 50% 0%, ${colors.primary}10 0%, transparent 70%)`
                         }}></div>
                    
                    {/* Sparkle Effect */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Sparkles className="w-5 h-5 animate-pulse" style={{ color: colors.primary }} />
                    </div>
                    
                    <div className="p-6 flex flex-col items-center text-center h-full relative z-10">
                      
                      {/* Enhanced Member Image */}
                      <div className="relative mb-6 group">
                        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 group-hover:scale-105 group-hover:rotate-2 transition-all duration-300" 
                             style={{ 
                               borderColor: colors.primary,
                               boxShadow: `0 10px 30px ${colors.primary}20`
                             }}
                        >
                          <img 
                            src={member.image} 
                            alt={member.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Online Status Indicator */}
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                        
                        {/* Rating Badge */}
                        <div className="absolute -top-2 -left-2 px-3 py-1 rounded-full text-xs font-bold border-2"
                             style={{
                               backgroundColor: colors.primary,
                               color: colors.background,
                               borderColor: colors.background
                             }}>
                          ★ {member.rating}
                        </div>
                      </div>
                      
                      {/* Enhanced Member Info */}
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-opacity-80 transition-all duration-300"
                            style={{ color: colors.primary }}
                        >
                          {member.name}
                        </h3>
                        
                        <p className="text-sm mb-3 font-medium" style={{ color: colors.textSecondary }}>
                          {member.role}
                        </p>
                        
                        {/* Experience Badge */}
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm"
                             style={{
                               backgroundColor: isDark ? 'rgba(56, 189, 248, 0.1)' : 'rgba(14, 165, 233, 0.1)',
                               color: colors.primary,
                               borderColor: colors.primary
                             }}>
                          <Award className="w-3 h-3 mr-1" />
                          {member.experience}
                        </div>
                      </div>
                      
                      {/* Enhanced Specialties */}
                      <div className="flex flex-wrap gap-2 mb-4 justify-center">
                        {member.expertise?.slice(0, 2).map((specialty, idx) => (
                          <span 
                            key={idx} 
                            className="px-3 py-1 text-xs rounded-full border border-opacity-20 backdrop-blur-sm"
                            style={{ 
                              backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                              color: colors.textPrimary,
                              borderColor: colors.border
                            }}
                          >
                            {specialty}
                          </span>
                        ))}
                        {member.expertise?.length > 2 && (
                          <span 
                            className="px-3 py-1 text-xs rounded-full border border-opacity-20 backdrop-blur-sm"
                            style={{ 
                              backgroundColor: colors.primary + '20',
                              color: colors.primary,
                              borderColor: colors.primary
                            }}
                          >
                            +{member.expertise.length - 2} more
                          </span>
                        )}
                      </div>
                      
                      {/* Enhanced Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-6 w-full">
                        <div className="text-center p-3 rounded-xl border border-opacity-20 backdrop-blur-sm"
                             style={{
                               backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                               borderColor: colors.border
                             }}>
                          <div className="font-bold text-lg" style={{ color: colors.primary }}>
                            {member.casesHandled}
                          </div>
                          <div className="text-xs" style={{ color: colors.textSecondary }}>
                            Cases
                          </div>
                        </div>
                        <div className="text-center p-3 rounded-xl border border-opacity-20 backdrop-blur-sm"
                             style={{
                               backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                               borderColor: colors.border
                             }}>
                          <div className="font-bold text-lg" style={{ color: colors.primary }}>
                            {member.rating}
                          </div>
                          <div className="text-xs" style={{ color: colors.textSecondary }}>
                            Rating
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Action Buttons */}
                      <div className="flex gap-2 mt-auto w-full">
                        <button 
                          className="flex-1 p-3 rounded-xl transition-all duration-300 hover:scale-105 border-2 backdrop-blur-sm"
                          style={{ 
                            backgroundColor: 'transparent',
                            color: colors.primary,
                            borderColor: colors.primary
                          }}
                        >
                          <MessageCircle className="w-4 h-4 mx-auto" />
                        </button>
                        <button 
                          className="flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 border-2 group"
                          style={{ 
                            backgroundColor: colors.primary,
                            color: colors.background,
                            borderColor: colors.primary
                          }}
                        >
                          <span className="group-hover:scale-110 transition-transform inline-block">
                            View Profile
                          </span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Enhanced Carousel Indicators */}
          <div className="flex justify-center mt-10 gap-3">
            {Array.from({ length: Math.ceil((visibleTeam?.length || 0) / itemsPerSlide) }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-3 rounded-full transition-all duration-300 hover:scale-110 ${
                  currentSlide === idx ? "w-10" : "w-3"
                }`}
                style={{ 
                  backgroundColor: currentSlide === idx 
                    ? colors.primary 
                    : (isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'),
                  boxShadow: currentSlide === idx ? `0 0 10px ${colors.primary}40` : 'none'
                }}
                aria-label={`Go to slide ${idx + 1}`}
              ></button>
            ))}
          </div>
        </div>
        
        {/* Enhanced Team Stats Section */}
        <div className="mt-32 mb-20 relative overflow-hidden rounded-3xl p-8 md:p-12 backdrop-blur-sm border border-opacity-20"
             style={{
               backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.95)',
               borderColor: colors.border
             }}>
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" 
                 style={{
                   backgroundImage: `radial-gradient(circle at 30% 20%, ${colors.primary} 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${colors.accent} 0%, transparent 50%)`
                 }}></div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-8 right-8 opacity-20">
            <Activity className="w-8 h-8 animate-pulse" style={{ color: colors.primary }} />
          </div>
          <div className="absolute bottom-8 left-8 opacity-20">
            <TrendingUp className="w-8 h-8 animate-bounce" style={{ color: colors.accent }} />
          </div>
          
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4 border-2"
                   style={{
                     backgroundColor: colors.primary + '20',
                     color: colors.primary,
                     borderColor: colors.primary
                   }}>
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold" style={{ color: colors.primary }}>
                Team Impact
              </h3>
            </div>
            
            <p className="text-lg mb-12 max-w-2xl mx-auto" style={{ color: colors.textSecondary }}>
              Our diverse team of experts brings together years of experience and specialized knowledge to serve you better.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { value: "15+", label: "Legal Specialties", icon: <Briefcase className="w-6 h-6" />, color: colors.primary },
                { value: "25+", label: "Team Members", icon: <Users className="w-6 h-6" />, color: colors.accent },
                { value: "12+", label: "Years Experience", icon: <Award className="w-6 h-6" />, color: colors.primary },
                { value: "5", label: "Countries Represented", icon: <Globe className="w-6 h-6" />, color: colors.accent }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="group relative p-6 md:p-8 text-center transform transition-all duration-500 hover:scale-105 hover:shadow-xl rounded-2xl backdrop-blur-sm border border-opacity-20"
                  style={{
                    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                    borderColor: colors.border
                  }}
                >
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                       style={{
                         background: `linear-gradient(135deg, ${stat.color}10, transparent)`
                       }}></div>
                  
                  <div className="relative z-10">
                    <div 
                      className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center border-2 group-hover:scale-110 transition-transform duration-300"
                      style={{ 
                        backgroundColor: stat.color + '20', 
                        color: stat.color,
                        borderColor: stat.color
                      }}
                    >
                      {stat.icon}
                    </div>
                    <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: stat.color }}>
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Enhanced Team Culture Section */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl max-w-6xl mx-auto mt-20 backdrop-blur-sm border border-opacity-20"
             style={{
               backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.95)',
               borderColor: colors.border
             }}>
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" 
                 style={{
                   backgroundImage: `radial-gradient(circle at 20% 20%, ${colors.primary} 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${colors.accent} 0%, transparent 50%)`
                 }}></div>
          </div>
          
          <div className="grid md:grid-cols-2 relative z-10">
            {/* Enhanced Image Section */}
            <div className="h-80 md:h-auto overflow-hidden relative">
              <img 
                src="https://www.centurylawfirm.in/blog/wp-content/uploads/2021/05/08-1024x768.jpg" 
                alt="MeraBakil Team Collaboration" 
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
              />
              
              {/* Enhanced Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                <div className="p-8 text-white">
                  <div className="inline-flex items-center mb-3">
                    <Heart className="w-6 h-6 mr-2" style={{ color: colors.accent }} />
                    <h3 className="text-2xl font-bold">Our Culture</h3>
                  </div>
                  <p className="text-sm leading-relaxed">
                    Collaboration, innovation, and accessibility guide everything we do. We believe in creating an environment where every team member can thrive and contribute meaningfully.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Enhanced Content Section */}
            <div className="p-8 md:p-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4 border-2"
                     style={{
                       backgroundColor: colors.primary + '20',
                       color: colors.primary,
                       borderColor: colors.primary
                     }}>
                  <Star className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-bold" style={{ color: colors.primary }}>
                  What Makes Us Different
                </h3>
              </div>
              
              <ul className="space-y-6">
                {[
                  {
                    title: "Interdisciplinary Expertise",
                    description: "Our team combines legal knowledge with technological innovation to create truly accessible solutions.",
                    icon: <Zap className="w-5 h-5" />
                  },
                  {
                    title: "Continuous Learning",
                    description: "We invest in ongoing education to stay ahead of both legal changes and technological advancements.",
                    icon: <TrendingUp className="w-5 h-5" />
                  },
                  {
                    title: "User-Centered Approach",
                    description: "Everything we build is designed with our users' needs and experiences at the forefront.",
                    icon: <Heart className="w-5 h-5" />
                  }
                ].map((item, index) => (
                  <li key={index} className="group flex items-start p-4 rounded-2xl transition-all duration-300 hover:shadow-lg border border-opacity-20"
                      style={{
                        backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                        borderColor: colors.border
                      }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4 border-2 group-hover:scale-110 transition-transform duration-300"
                         style={{
                           backgroundColor: colors.primary + '20',
                           color: colors.primary,
                           borderColor: colors.primary
                         }}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2 text-lg" style={{ color: colors.primary }}>
                        {item.title}
                      </h4>
                      <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8">
                <button className="group inline-flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 border-2"
                        style={{
                          backgroundColor: 'transparent',
                          color: colors.primary,
                          borderColor: colors.primary
                        }}>
                  <span>Learn more about our culture</span>
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Join Our Team CTA */}
        <div className="mt-32 text-center relative overflow-hidden rounded-3xl p-12 md:p-16 backdrop-blur-sm border border-opacity-20"
             style={{
               backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.95)',
               borderColor: colors.border
             }}>
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" 
                 style={{
                   backgroundImage: `radial-gradient(circle at 50% 50%, ${colors.primary} 0%, transparent 50%)`
                 }}></div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-8 left-8 opacity-20">
            <Users className="w-8 h-8 animate-pulse" style={{ color: colors.primary }} />
          </div>
          <div className="absolute bottom-8 right-8 opacity-20">
            <Briefcase className="w-8 h-8 animate-bounce" style={{ color: colors.accent }} />
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4 border-2"
                   style={{
                     backgroundColor: colors.primary + '20',
                     color: colors.primary,
                     borderColor: colors.primary
                   }}>
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold" style={{ color: colors.primary }}>
                Join Our Team
              </h3>
            </div>
            
            <p className="max-w-3xl mx-auto mb-8 text-lg md:text-xl leading-relaxed" style={{ color: colors.textSecondary }}>
              We're always looking for passionate individuals who share our mission of making legal services accessible to everyone. 
              Be part of a team that's revolutionizing the legal industry.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                className="group inline-flex items-center px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl border-2"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.background,
                  borderColor: colors.primary
                }}
              >
                <span>View Open Positions</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                className="group inline-flex items-center px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl border-2"
                style={{
                  backgroundColor: 'transparent',
                  color: colors.primary,
                  borderColor: colors.primary
                }}
              >
                <span>Learn About Benefits</span>
                <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Testimonial Section - Completing from where it was cut off */}
        <div 
          className={`mt-16 p-6 md:p-8 rounded-2xl relative overflow-hidden ${
            isDark ? "bg-slate-800" : "bg-slate-50"
          }`}
        >
          <div 
            className="absolute top-0 left-0 w-32 h-32 -translate-x-16 -translate-y-16 rounded-full opacity-20"
            style={{ backgroundColor: colors.primary }}
          ></div>
          
          <div className="relative z-10">
            <div className="text-4xl mb-4" style={{ color: colors.primary }}>"</div>
            <p className="text-lg md:text-xl italic mb-6">
              Working at MeraBakil means being part of a team that truly believes in using technology to democratize access to legal resources. Every day, I see how our collective expertise helps people navigate complex legal issues with confidence.
            </p>
            
            <div className="flex items-center">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRftjU02q_WV7OD17ku8aUmWNNH6FeHQa12pSYu1xUNYxvqtndn-EW67WXOdB5XBS2LTRA&usqp=CAU" 
                alt="Team Member" 
                className="w-12 h-12 rounded-full object-cover mr-4 border-2"
                style={{ borderColor: colors.primary }}
              />
              <div>
                <h4 className="font-bold">Michael Wong</h4>
                <p className="text-sm" style={{ color: colors.primary }}>Software Engineer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal for Team Member Details */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          ></div>
          
          {/* Modal Content */}
          <div 
            className={`relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
              isDark ? "bg-slate-900" : "bg-white"
            } transition-all duration-300 animate-fadeIn`}
          >
            {/* Close Button */}
            <button 
              onClick={closeModal}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center z-20 ${
                isDark ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-slate-100 text-slate-800 hover:bg-slate-200"
              } transition-all duration-200`}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="grid md:grid-cols-5 gap-4">
              {/* Left Column - Photo & Contact */}
              <div className="md:col-span-2 p-6 md:p-8 flex flex-col items-center md:items-start text-center md:text-left relative">
                {/* Background Decoration */}
                <div 
                  className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 rounded-full opacity-10 -translate-y-1/2 translate-x-1/4"
                  style={{ backgroundColor: colors.primary }}
                ></div>
                
                {/* Image */}
                <div className="relative mb-6 w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 shadow-lg z-10" 
                  style={{ 
                    borderColor: colors.primary,
                    boxShadow: `0 8px 32px ${isDark ? 'rgba(92, 172, 222, 0.3)' : 'rgba(92, 172, 222, 0.2)'}`
                  }}
                >
                  <img 
                    src={selectedMember.image} 
                    alt={selectedMember.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Name & Title */}
                <h2 className="text-2xl md:text-3xl font-bold mb-1 relative z-10">{selectedMember.name}</h2>
                <p className="text-lg mb-6 relative z-10" style={{ color: colors.primary }}>{selectedMember.role}</p>
                
                {/* Expertise */}
                <div className="w-full mb-6 relative z-10">
                  <h3 className="text-sm uppercase tracking-wider font-semibold mb-3 opacity-80">Areas of Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.expertise.map((skill, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 text-sm rounded-full" 
                        style={{ 
                          backgroundColor: isDark ? colors.primary + '20' : colors.primary + '10',
                          color: colors.primary 
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Social & Contact */}
                <div className="w-full relative z-10">
                  <h3 className="text-sm uppercase tracking-wider font-semibold mb-3 opacity-80">Connect</h3>
                  <div className="space-y-3">
                    {selectedMember.social.email && (
                      <a 
                        href={`mailto:${selectedMember.social.email}`} 
                        className="flex items-center group"
                      >
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                          style={{ backgroundColor: colors.primary + '20' }}
                        >
                          <Mail className="w-4 h-4" style={{ color: colors.primary }} />
                        </div>
                        <span className={`group-hover:underline ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                          {selectedMember.social.email}
                        </span>
                      </a>
                    )}
                    
                    {selectedMember.social.linkedin && (
                      <a 
                        href={`https://linkedin.com/in/${selectedMember.social.linkedin}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center group"
                      >
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                          style={{ backgroundColor: colors.primary + '20' }}
                        >
                          <Linkedin className="w-4 h-4" style={{ color: colors.primary }} />
                        </div>
                        <span className={`group-hover:underline ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                          linkedin.com/in/{selectedMember.social.linkedin}
                        </span>
                      </a>
                    )}
                    
                    {selectedMember.social.twitter && (
                      <a 
                        href={`https://twitter.com/${selectedMember.social.twitter}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center group"
                      >
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                          style={{ backgroundColor: colors.primary + '20' }}
                        >
                          <Twitter className="w-4 h-4" style={{ color: colors.primary }} />
                        </div>
                        <span className={`group-hover:underline ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                          @{selectedMember.social.twitter}
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Right Column - Bio & Details */}
              <div className="md:col-span-3 p-6 md:p-8 relative">
                {/* Background Decoration */}
                <div 
                  className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10 translate-y-1/2 -translate-x-1/2"
                  style={{ backgroundColor: colors.primary }}
                ></div>
                
                {/* Quote */}
                {selectedMember.quote && (
                  <div className="mb-8 relative">
                    <div 
                      className="text-4xl absolute -top-4 -left-2 opacity-30"
                      style={{ color: colors.primary }}
                    >
                      "
                    </div>
                    <p 
                      className="text-lg md:text-xl italic pl-6 relative z-10"
                      style={{ color: colors.primary }}
                    >
                      {selectedMember.quote}
                    </p>
                  </div>
                )}
                
                {/* Bio */}
                <div className="mb-8 relative z-10">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2 opacity-80" style={{ color: colors.primary }} />
                    Biography
                  </h3>
                  <p className={`leading-relaxed mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{selectedMember.bio}</p>
                </div>
                
                {/* Featured Projects */}
                <div className="mb-8 relative z-10">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 opacity-80" style={{ color: colors.primary }} />
                    Featured Work
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        title: "Legal Research Enhancement",
                        description: "Improved natural language processing algorithms for legal document analysis."
                      },
                      {
                        title: "Community Legal Workshops",
                        description: "Led educational workshops for underserved communities on basic legal rights."
                      }
                    ].map((project, index) => (
                      <div 
                        key={index} 
                        className={`p-4 rounded-lg border border-opacity-20 ${
                          isDark ? "border-slate-600 bg-slate-800/50" : "border-slate-300 bg-slate-50"
                        }`}
                      >
                        <h4 className="font-bold mb-2">{project.title}</h4>
                        <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                          {project.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Contact Button */}
                <div className="text-center sm:text-left relative z-10">
                  <button 
                    className="px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    style={{ backgroundColor: colors.primary, color: '#fff' }}
                  >
                    Schedule a Consultation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse-ring {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-slideIn {
          animation: slideIn 0.8s ease-out forwards;
        }
        
        .hover-scale {
          transition: all 0.3s ease;
        }
        
        .hover-scale:hover {
          transform: scale(1.05);
        }
        
        .glass-effect {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .dark .glass-effect {
          background: rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .team-card:hover {
          transform: translateY(-8px);
        }
        
        .team-card {
          transition: all 0.3s ease;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}