import { useState, useEffect, useRef } from "react";
import { 
  Scale, 
  Award, 
  Lightbulb, 
  Users, 
  BarChart, 
  TrendingUp, 
  Calendar, 
  Globe, 
  Briefcase,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  Shield,
  Heart,
  Star,
  Zap,
  Activity,
  Infinity
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function OurStoryTimeline() {
  const { isDark, colors } = useTheme();
  const [activeStory, setActiveStory] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  const timelineRef = useRef(null);
  const heroRef = useRef(null);
  
  // Observer for animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = entry.target.getAttribute('data-index');
            setIsVisible(prev => ({ ...prev, [index]: true }));
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.2 }
    );
    
    const elements = document.querySelectorAll('.timeline-item');
    elements.forEach(el => observer.observe(el));
    
    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);

  // Timeline data with enhanced metrics and achievements
  const timelineData = [
    {
      year: "2018",
      title: "The Genesis",
      icon: <Lightbulb />,
      description: "MeraBakil was founded with a vision to bridge the gap between complex legal systems and everyday people. We identified the challenge of inaccessible legal services and embarked on a mission to democratize legal assistance.",
      metrics: { clients: "0", lawyers: "3", regions: "1" },
      highlight: "Founded with a clear vision"
    },
    {
      year: "2019",
      title: "Building Foundations",
      icon: <Briefcase />,
      description: "Assembled our core team of legal professionals and technology experts. Developed the initial prototype of our AI-powered legal assistance platform, focusing on user experience and accurate information delivery.",
      metrics: { clients: "50", lawyers: "12", regions: "1" },
      highlight: "First AI prototype launched"
    },
    {
      year: "2020",
      title: "Digital Transformation",
      icon: <Globe />,
      description: "Launched our online platform during a critical time when remote legal services became essential. Introduced 24/7 legal information access and secured our first 1,000 users who helped shape our service through valuable feedback.",
      metrics: { clients: "1K", lawyers: "25", regions: "2" },
      highlight: "24/7 service availability"
    },
    {
      year: "2021",
      title: "Expert Network Growth",
      icon: <Users />,
      description: "Expanded our network of specialized lawyers across multiple legal domains. Implemented our personalized consultation system connecting users with the right legal experts for their specific needs.",
      metrics: { clients: "5K", lawyers: "75", regions: "3" },
      highlight: "Specialized legal domains"
    },
    {
      year: "2022",
      title: "Recognition & Expansion",
      icon: <Award />,
      description: "Received industry recognition for our innovative approach to legal services. Expanded operations to three new regions, making legal assistance accessible to diverse communities with different legal frameworks.",
      metrics: { clients: "15K", lawyers: "150", regions: "6" },
      highlight: "Industry recognition received"
    },
    {
      year: "2023",
      title: "Technology Advancement",
      icon: <BarChart />,
      description: "Enhanced our AI capabilities with advanced machine learning models to provide more accurate and contextual legal information. Achieved 99.5% security compliance certification for our platform.",
      metrics: { clients: "30K", lawyers: "250", regions: "8" },
      highlight: "99.5% security compliance"
    },
    {
      year: "2024",
      title: "Community Impact",
      icon: <Scale />,
      description: "Reached a milestone of helping over 50,000 individuals and small businesses with their legal challenges. Launched pro bono initiatives to provide free legal assistance to underserved communities.",
      metrics: { clients: "50K", lawyers: "400", regions: "12" },
      highlight: "Pro bono initiatives launched"
    },
    {
      year: "2025",
      title: "Future Vision",
      icon: <TrendingUp />,
      description: "Our roadmap includes expanding to international markets, developing specialized legal solution packages for industries with unique compliance needs, and further enhancing our AI technology to handle increasingly complex legal inquiries.",
      metrics: { clients: "100K+", lawyers: "500+", regions: "20+" },
      highlight: "International expansion"
    }
  ];

  const scrollToIndex = (index) => {
    setActiveStory(index);
    if (timelineRef.current) {
      const items = timelineRef.current.querySelectorAll('.timeline-item');
      if (items[index]) {
        items[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className={`w-full py-16 mt-20 transition-all duration-500 relative overflow-hidden`}
         style={{
           backgroundColor: isDark ? colors.background : colors.backgroundSecondary,
           color: isDark ? colors.textPrimary : colors.textPrimary
         }}>
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 rounded-full"
             style={{
               background: `radial-gradient(circle, ${colors.primary} 0%, transparent 50%)`,
               animation: 'float 6s ease-in-out infinite'
             }}></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full"
             style={{
               background: `radial-gradient(circle, ${colors.accent} 0%, transparent 50%)`,
               animation: 'float 8s ease-in-out infinite reverse'
             }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Enhanced Hero Section */}
        <div ref={heroRef} className="text-center mb-20 relative">
          
          {/* Floating Elements */}
          <div className="absolute -top-4 -right-4 opacity-20">
            <Star className="w-8 h-8 animate-pulse" style={{ color: colors.primary }} />
          </div>
          <div className="absolute -bottom-4 -left-4 opacity-20">
            <Zap className="w-6 h-6 animate-bounce" style={{ color: colors.accent }} />
          </div>
          
          <div className="inline-flex items-center justify-center mb-6 px-6 py-3 rounded-full backdrop-blur-sm border-2 border-opacity-20"
               style={{ 
                 backgroundColor: isDark ? 'rgba(56, 189, 248, 0.1)' : 'rgba(14, 165, 233, 0.1)',
                 color: colors.primary,
                 borderColor: colors.primary
               }}>
            <Calendar className="w-5 h-5 mr-2" />
            <span className="text-sm font-semibold uppercase tracking-wider">Our Journey</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
              style={{ 
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
            The MeraBakil Story
          </h1>
          
          <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-12 leading-relaxed" 
             style={{ color: colors.textSecondary }}>
            From vision to reality: how we're transforming legal services through technology and expertise,
            making justice accessible for everyone.
          </p>
          
          {/* Enhanced Stats with Interactive Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {[
              { value: "50K+", label: "Clients Served", icon: <Users className="w-8 h-8" /> },
              { value: "400+", label: "Legal Experts", icon: <Award className="w-8 h-8" /> },
              { value: "12", label: "Regions", icon: <Globe className="w-8 h-8" /> },
              { value: "99.5%", label: "Security Rating", icon: <Shield className="w-8 h-8" /> }
            ].map((stat, index) => (
              <div key={index} 
                   className="group relative p-6 rounded-2xl backdrop-blur-sm border border-opacity-20 hover:border-opacity-40 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                   style={{
                     backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                     borderColor: colors.border
                   }}>
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                     style={{
                       background: `linear-gradient(135deg, ${colors.primary}10, ${colors.accent}10)`
                     }}></div>
                <div className="relative z-10">
                  <div className="flex justify-center mb-4" style={{ color: colors.primary }}>
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: colors.primary }}>
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
        
        {/* Enhanced Interactive Year Navigation */}
        <div className="hidden md:block mb-20">
          <div className="relative mx-auto max-w-6xl">
            
            {/* Enhanced Timeline Line */}
            <div className="absolute top-1/2 left-0 right-0 h-2 transform -translate-y-1/2 rounded-full"
                 style={{ backgroundColor: isDark ? colors.backgroundTertiary : colors.border }}></div>
            
            {/* Animated Progress Line */}
            <div className="absolute top-1/2 left-0 h-2 transform -translate-y-1/2 transition-all duration-700 rounded-full"
                 style={{ 
                   background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                   width: `${(activeStory / (timelineData.length - 1)) * 100}%`,
                   boxShadow: `0 0 20px ${colors.primary}40`
                 }}></div>
            
            {/* Enhanced Year Markers */}
            <div className="flex justify-between items-center relative">
              {timelineData.map((item, index) => (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index)}
                  className={`relative z-10 transition-all duration-300 group ${
                    activeStory === index ? 'scale-110' : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 border-4"
                       style={{
                         backgroundColor: activeStory === index 
                           ? colors.primary
                           : (isDark ? colors.backgroundSecondary : colors.background),
                         color: activeStory === index 
                           ? colors.background
                           : colors.primary,
                         borderColor: activeStory === index ? colors.primary : colors.border,
                         boxShadow: activeStory === index ? `0 0 30px ${colors.primary}40` : 'none'
                       }}>
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold opacity-60">'{item.year.substring(2)}</span>
                      <div className="text-xs mt-1 opacity-80">{item.icon}</div>
                    </div>
                  </div>
                  
                  {/* Enhanced Year Label */}
                  <div className={`absolute -bottom-12 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
                    activeStory === index ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-70'
                  }`}>
                    <div className="px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm"
                         style={{
                           backgroundColor: isDark ? colors.backgroundTertiary : colors.background,
                           color: colors.textPrimary,
                           borderColor: colors.border
                         }}>
                      {item.year}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Enhanced Timeline Content */}
        <div ref={timelineRef} className="relative">
          {timelineData.map((item, index) => (
            <div 
              key={index}
              data-index={index}
              className={`timeline-item opacity-0 -translate-y-4 mb-20 last:mb-0 transition-all duration-700 ${
                index % 2 === 0 ? "md:ml-[5%]" : "md:ml-[15%]"
              }`}
            >
              <div className="group relative rounded-3xl overflow-hidden shadow-2xl max-w-5xl backdrop-blur-sm border border-opacity-20 hover:border-opacity-40 transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl"
                   style={{
                     backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.95)',
                     borderColor: colors.border
                   }}>
                
                {/* Floating Sparkle Effect */}
                {isVisible[index] && (
                  <div className="absolute top-6 right-6 animate-pulse z-20">
                    <Sparkles className="w-6 h-6" style={{ color: colors.primary }} />
                  </div>
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                     style={{
                       background: `radial-gradient(circle at 30% 30%, ${colors.primary}10 0%, transparent 60%)`
                     }}></div>
                
                <div className="flex flex-col md:flex-row relative z-10">
                  
                  {/* Left Column - Enhanced Visual */}
                  <div className="md:w-2/5 p-8 md:p-12 flex flex-col justify-center items-center text-center relative overflow-hidden"
                       style={{ 
                         backgroundColor: isDark ? 'rgba(56, 189, 248, 0.05)' : 'rgba(14, 165, 233, 0.03)',
                         borderRight: `1px solid ${colors.border}`
                       }}>
                    
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute top-0 right-0 w-32 h-32 rounded-full"
                           style={{ background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)` }}></div>
                    </div>
                    
                    {/* Enhanced Icon */}
                    <div className="relative mb-6 group">
                      <div className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 border-2"
                           style={{
                             backgroundColor: isDark ? colors.backgroundSecondary : colors.background,
                             color: colors.primary,
                             borderColor: colors.primary,
                             boxShadow: `0 10px 40px ${colors.primary}20`
                           }}>
                        <div className="text-2xl">{item.icon}</div>
                      </div>
                      
                      {/* Pulsing Ring */}
                      <div className="absolute inset-0 rounded-2xl border-2 animate-pulse"
                           style={{
                             borderColor: colors.primary,
                             animation: 'pulse-ring 2s infinite'
                           }}></div>
                    </div>
                    
                    {/* Year Badge */}
                    <div className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-2 border-2"
                         style={{
                           backgroundColor: colors.primary,
                           color: colors.background,
                           borderColor: colors.primary
                         }}>
                      {item.year}
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight" 
                        style={{ color: colors.textPrimary }}>
                      {item.title}
                    </h3>
                    
                    {/* Enhanced Highlight Badge */}
                    <div className="flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 border backdrop-blur-sm"
                         style={{
                           backgroundColor: isDark ? 'rgba(56, 189, 248, 0.1)' : 'rgba(14, 165, 233, 0.1)',
                           color: colors.primary,
                           borderColor: colors.primary
                         }}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {item.highlight}
                    </div>
                    
                    {/* Enhanced Metrics Grid */}
                    <div className="grid grid-cols-3 gap-4 text-center w-full max-w-xs">
                      <div className="p-3 rounded-xl backdrop-blur-sm border border-opacity-20"
                           style={{
                             backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                             borderColor: colors.border
                           }}>
                        <div className="font-bold text-xl" style={{ color: colors.primary }}>
                          {item.metrics.clients}
                        </div>
                        <div className="text-xs" style={{ color: colors.textSecondary }}>
                          Clients
                        </div>
                      </div>
                      <div className="p-3 rounded-xl backdrop-blur-sm border border-opacity-20"
                           style={{
                             backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                             borderColor: colors.border
                           }}>
                        <div className="font-bold text-xl" style={{ color: colors.primary }}>
                          {item.metrics.lawyers}
                        </div>
                        <div className="text-xs" style={{ color: colors.textSecondary }}>
                          Lawyers
                        </div>
                      </div>
                      <div className="p-3 rounded-xl backdrop-blur-sm border border-opacity-20"
                           style={{
                             backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                             borderColor: colors.border
                           }}>
                        <div className="font-bold text-xl" style={{ color: colors.primary }}>
                          {item.metrics.regions}
                        </div>
                        <div className="text-xs" style={{ color: colors.textSecondary }}>
                          Regions
                        </div>
                      </div>
                    </div>
                    
                    {/* Mobile only description */}
                    <p className="md:hidden text-sm mt-6 leading-relaxed"
                       style={{ color: colors.textSecondary }}>
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Right Column - Enhanced Content */}
                  <div className="md:w-3/5 p-8 md:p-12 flex items-center relative">
                    <div className="w-full">
                      <p className="hidden md:block text-lg md:text-xl leading-relaxed mb-8"
                         style={{ color: colors.textSecondary }}>
                        {item.description}
                      </p>
                      
                      {/* Enhanced achievements for certain years */}
                      {(index === 4 || index === 6) && (
                        <div className="mt-8 p-6 rounded-2xl border border-opacity-20"
                             style={{ 
                               backgroundColor: isDark ? colors.backgroundTertiary : colors.backgroundSecondary,
                               borderColor: colors.border
                             }}>
                          <div className="flex items-center mb-4">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                                 style={{ backgroundColor: colors.primary + '20', color: colors.primary }}>
                              <Award className="w-5 h-5" />
                            </div>
                            <h4 className="font-semibold text-lg"
                                style={{ color: colors.primary }}>
                              Key Achievement
                            </h4>
                          </div>
                          <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
                            {index === 4 
                              ? "Recognized as 'Legal Tech Innovator of the Year' for our AI-powered consultation approach."
                              : "Successfully helped over 5,000 small businesses navigate complex regulatory requirements."}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Enhanced Mobile Timeline Line */}
          <div className="absolute top-0 bottom-0 left-8 w-1 md:hidden rounded-full"
               style={{ 
                 background: `linear-gradient(to bottom, ${colors.primary} 0%, ${colors.accent} 100%)`,
                 opacity: 0.3
               }}></div>
        </div>
        
        {/* Enhanced Vision Statement */}
        <div className="mt-32 p-12 md:p-16 rounded-3xl shadow-2xl max-w-6xl mx-auto text-center relative overflow-hidden backdrop-blur-sm border border-opacity-20"
             style={{
               backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.95)',
               borderColor: colors.border
             }}>
          
          {/* Enhanced Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" 
                 style={{
                   backgroundImage: `radial-gradient(circle at 20% 80%, ${colors.primary} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${colors.accent} 0%, transparent 50%)`
                 }}></div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-8 left-8 opacity-20">
            <Activity className="w-8 h-8 animate-pulse" style={{ color: colors.primary }} />
          </div>
          <div className="absolute bottom-8 right-8 opacity-20">
            <Infinity className="w-8 h-8 animate-spin" style={{ color: colors.accent, animationDuration: '8s' }} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4 border-2"
                   style={{
                     backgroundColor: colors.primary + '20',
                     color: colors.primary,
                     borderColor: colors.primary
                   }}>
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold"
                  style={{ color: colors.primary }}>
                Our Continuing Mission
              </h3>
            </div>
            
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed"
               style={{ color: colors.textSecondary }}>
              Bridging the gap between complex legal systems and everyday people through innovative
              technology and expert guidance. Making justice accessible, affordable, and understandable for all.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
              {[
                { icon: Scale, text: "Justice for All", color: colors.primary },
                { icon: Globe, text: "Global Accessibility", color: colors.accent },
                { icon: TrendingUp, text: "Continuous Innovation", color: colors.primary },
                { icon: Shield, text: "Secure & Reliable", color: colors.accent },
                { icon: Heart, text: "Community First", color: colors.primary }
              ].map((item, index) => (
                <div key={index} 
                     className="group p-6 rounded-2xl border border-opacity-20 hover:border-opacity-40 transition-all duration-300 hover:scale-105 hover:shadow-xl backdrop-blur-sm"
                     style={{
                       backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                       borderColor: colors.border
                     }}>
                  <div className="flex items-center justify-center mb-3">
                    <item.icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Enhanced Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group inline-flex items-center px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl border-2"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.background,
                        borderColor: colors.primary
                      }}>
                <span>Join Our Journey</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="group inline-flex items-center px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl border-2"
                      style={{
                        backgroundColor: 'transparent',
                        color: colors.primary,
                        borderColor: colors.primary
                      }}>
                <span>Learn More</span>
                <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced custom CSS for animations */}
      <style jsx>{`
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        
        @media (min-width: 768px) {
          .timeline-item:nth-child(odd) {
            padding-right: 5%;
          }
          
          .timeline-item:nth-child(even) {
            padding-left: 5%;
          }
        }
        
        .timeline-item:hover {
          transform: translateY(-8px);
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
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
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(34, 87, 122, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(34, 87, 122, 0.5);
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
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-pulse {
          animation: pulse-glow 2s ease-in-out infinite;
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
      `}</style>
    </div>
  );
}