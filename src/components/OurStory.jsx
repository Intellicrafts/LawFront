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
  Heart
} from "lucide-react";

export default function OurStoryTimeline() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeStory, setActiveStory] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const timelineRef = useRef(null);
  
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
    
    // Check for dark mode preference
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(darkModeQuery.matches);
    
    const darkModeHandler = (e) => setIsDarkMode(e.matches);
    darkModeQuery.addEventListener("change", darkModeHandler);
    
    return () => {
      elements.forEach(el => observer.unobserve(el));
      darkModeQuery.removeEventListener("change", darkModeHandler);
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
    <div className={`w-full py-16 mt-20 transition-colors duration-300`}
         style={{
           backgroundColor: isDarkMode ? '#0F172A' : '#F8F9FA',
           color: isDarkMode ? '#E2E8F0' : '#1E293B'
         }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center mb-4"
               style={{ color: isDarkMode ? '#38BDF8' : '#0EA5E9' }}>
            <Calendar className="w-6 h-6 mr-2" />
            <span className="text-sm font-semibold uppercase tracking-wider">Our Journey</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6"
              style={{ color: isDarkMode ? '#94A3B8' : '#64748B' }}>
            The MeraBakil Story
          </h2>
          
          <p className="text-lg max-w-3xl mx-auto">
            From vision to reality: how we're transforming legal services through technology and expertise,
            making justice accessible for everyone.
          </p>
          
          {/* Stats Overview */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: isDarkMode ? '#38BDF8' : '#0EA5E9' }}>
                50K+
              </div>
              <div className="text-sm font-medium">Clients Served</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: isDarkMode ? '#38BDF8' : '#0EA5E9' }}>
                400+
              </div>
              <div className="text-sm font-medium">Legal Experts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: isDarkMode ? '#38BDF8' : '#0EA5E9' }}>
                12
              </div>
              <div className="text-sm font-medium">Regions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: isDarkMode ? '#38BDF8' : '#0EA5E9' }}>
                99.5%
              </div>
              <div className="text-sm font-medium">Security Rating</div>
            </div>
          </div>
        </div>
        
        {/* Interactive Year Navigation */}
        <div className="hidden md:block mb-16">
          <div className="flex justify-between items-center relative mx-auto max-w-5xl"
               style={{ color: isDarkMode ? '#94A3B8' : '#64748B' }}>
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 transform -translate-y-1/2"
                 style={{ backgroundColor: isDarkMode ? '#334155' : '#E2E8F0' }}></div>
            
            {/* Progress Line */}
            <div className="absolute top-1/2 left-0 h-1 transform -translate-y-1/2 transition-all duration-500"
                 style={{ 
                   backgroundColor: isDarkMode ? '#38BDF8' : '#0EA5E9',
                   width: `${(activeStory / (timelineData.length - 1)) * 100}%`
                 }}></div>
            
            {/* Year Markers */}
            {timelineData.map((item, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`relative z-10 transition-all duration-300 group ${
                  activeStory === index ? 'scale-110' : 'opacity-70 hover:opacity-100 hover:scale-105'
                }`}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
                     style={{
                       backgroundColor: activeStory === index 
                         ? (isDarkMode ? '#38BDF8' : '#0EA5E9')
                         : (isDarkMode ? '#1E293B' : 'white'),
                       color: activeStory === index 
                         ? (isDarkMode ? '#0F172A' : 'white')
                         : (isDarkMode ? '#38BDF8' : '#0EA5E9'),
                       border: `2px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`
                     }}>
                  {item.year.substring(2)}
                </div>
                <span className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-medium whitespace-nowrap transition-opacity duration-200 ${
                  activeStory === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'
                }`}>
                  {item.year}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Timeline Content */}
        <div ref={timelineRef} className="relative">
          {timelineData.map((item, index) => (
            <div 
              key={index}
              data-index={index}
              className={`timeline-item opacity-0 -translate-y-4 mb-16 last:mb-0 transition-all duration-700 ${
                index % 2 === 0 ? "md:ml-[5%]" : "md:ml-[15%]"
              }`}
            >
              <div className="rounded-2xl overflow-hidden shadow-xl max-w-4xl relative"
                   style={{
                     backgroundColor: isDarkMode ? '#1E293B' : 'white',
                     border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`
                   }}>
                
                {/* Sparkle Effect */}
                {isVisible[index] && (
                  <div className="absolute top-4 right-4 animate-pulse">
                    <Sparkles className="w-5 h-5" style={{ color: isDarkMode ? '#38BDF8' : '#0EA5E9' }} />
                  </div>
                )}
                
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Left Column - Visual */}
                  <div className="md:w-2/5 p-8 flex flex-col justify-center items-center text-center"
                       style={{ backgroundColor: isDarkMode ? 'rgba(56, 189, 248, 0.1)' : 'rgba(14, 165, 233, 0.05)' }}>
                    
                    {/* Icon with glow effect */}
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-lg relative"
                         style={{
                           backgroundColor: isDarkMode ? '#1E293B' : 'white',
                           color: isDarkMode ? '#38BDF8' : '#0EA5E9',
                           border: `2px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`
                         }}>
                      {item.icon}
                      <div className="absolute inset-0 rounded-full animate-pulse"
                           style={{
                             background: `radial-gradient(circle, ${isDarkMode ? 'rgba(56, 189, 248, 0.2)' : 'rgba(14, 165, 233, 0.2)'} 0%, transparent 70%)`
                           }}></div>
                    </div>
                    
                    <span className="text-sm font-bold mb-1"
                          style={{ color: isDarkMode ? '#38BDF8' : '#0EA5E9' }}>
                      {item.year}
                    </span>
                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                    
                    {/* Highlight Badge */}
                    <div className="flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4"
                         style={{
                           backgroundColor: isDarkMode ? 'rgba(56, 189, 248, 0.2)' : 'rgba(14, 165, 233, 0.1)',
                           color: isDarkMode ? '#38BDF8' : '#0EA5E9'
                         }}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {item.highlight}
                    </div>
                    
                    {/* Metrics */}
                    <div className="flex gap-4 text-center">
                      <div>
                        <div className="font-bold text-lg" style={{ color: isDarkMode ? '#38BDF8' : '#0EA5E9' }}>
                          {item.metrics.clients}
                        </div>
                        <div className="text-xs">Clients</div>
                      </div>
                      <div>
                        <div className="font-bold text-lg" style={{ color: isDarkMode ? '#38BDF8' : '#0EA5E9' }}>
                          {item.metrics.lawyers}
                        </div>
                        <div className="text-xs">Lawyers</div>
                      </div>
                      <div>
                        <div className="font-bold text-lg" style={{ color: isDarkMode ? '#38BDF8' : '#0EA5E9' }}>
                          {item.metrics.regions}
                        </div>
                        <div className="text-xs">Regions</div>
                      </div>
                    </div>
                    
                    {/* Mobile only description */}
                    <p className="md:hidden text-sm mt-4"
                       style={{ color: isDarkMode ? '#94A3B8' : '#64748B' }}>
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Right Column - Content */}
                  <div className="md:w-3/5 p-8 flex items-center">
                    <div>
                      <p className="hidden md:block text-lg leading-relaxed"
                         style={{ color: isDarkMode ? '#94A3B8' : '#64748B' }}>
                        {item.description}
                      </p>
                      
                      {/* Enhanced achievements for certain years */}
                      {(index === 4 || index === 6) && (
                        <div className="mt-6 py-4 px-6 rounded-lg"
                             style={{ backgroundColor: isDarkMode ? '#334155' : '#F8F9FA' }}>
                          <div className="flex items-center mb-2">
                            <Award className="w-4 h-4 mr-2" style={{ color: isDarkMode ? '#38BDF8' : '#0EA5E9' }} />
                            <h4 className="font-semibold"
                                style={{ color: isDarkMode ? '#38BDF8' : '#0EA5E9' }}>
                              Key Achievement
                            </h4>
                          </div>
                          <p className="text-sm">
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
          
          {/* Timeline vertical line (mobile only) */}
          <div className="absolute top-0 bottom-0 left-8 w-px md:hidden"
               style={{ backgroundColor: isDarkMode ? 'rgba(56, 189, 248, 0.3)' : 'rgba(14, 165, 233, 0.2)' }}></div>
        </div>
        
        {/* Enhanced Vision Statement */}
        <div className="mt-20 p-10 rounded-2xl shadow-xl max-w-5xl mx-auto text-center relative overflow-hidden"
             style={{
               backgroundColor: isDarkMode ? '#1E293B' : 'white',
               border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`
             }}>
          
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" 
                 style={{
                   backgroundImage: `radial-gradient(circle at 20% 80%, ${isDarkMode ? '#38BDF8' : '#0EA5E9'} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${isDarkMode ? '#38BDF8' : '#0EA5E9'} 0%, transparent 50%)`
                 }}></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <Target className="w-6 h-6 mr-2" style={{ color: isDarkMode ? '#38BDF8' : '#0EA5E9' }} />
              <h3 className="text-2xl font-bold"
                  style={{ color: isDarkMode ? '#38BDF8' : '#0EA5E9' }}>
                Our Continuing Mission
              </h3>
            </div>
            
            <p className="text-lg mb-8 max-w-3xl mx-auto">
              Bridging the gap between complex legal systems and everyday people through innovative
              technology and expert guidance. Making justice accessible, affordable, and understandable for all.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                   style={{
                     backgroundColor: isDarkMode ? '#334155' : '#F8F9FA',
                     color: isDarkMode ? '#E2E8F0' : '#1E293B'
                   }}>
                <Scale className="w-4 h-4 mr-2" /> 
                <span>Justice for All</span>
              </div>
              <div className="flex items-center px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                   style={{
                     backgroundColor: isDarkMode ? '#334155' : '#F8F9FA',
                     color: isDarkMode ? '#E2E8F0' : '#1E293B'
                   }}>
                <Globe className="w-4 h-4 mr-2" /> 
                <span>Global Accessibility</span>
              </div>
              <div className="flex items-center px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                   style={{
                     backgroundColor: isDarkMode ? '#334155' : '#F8F9FA',
                     color: isDarkMode ? '#E2E8F0' : '#1E293B'
                   }}>
                <TrendingUp className="w-4 h-4 mr-2" /> 
                <span>Continuous Innovation</span>
              </div>
              <div className="flex items-center px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                   style={{
                     backgroundColor: isDarkMode ? '#334155' : '#F8F9FA',
                     color: isDarkMode ? '#E2E8F0' : '#1E293B'
                   }}>
                <Shield className="w-4 h-4 mr-2" /> 
                <span>Secure & Reliable</span>
              </div>
              <div className="flex items-center px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                   style={{
                     backgroundColor: isDarkMode ? '#334155' : '#F8F9FA',
                     color: isDarkMode ? '#E2E8F0' : '#1E293B'
                   }}>
                <Heart className="w-4 h-4 mr-2" /> 
                <span>Community First</span>
              </div>
            </div>
            
            {/* Call to action */}
            <div className="mt-8">
              <button className="inline-flex items-center px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                      style={{
                        backgroundColor: isDarkMode ? '#38BDF8' : '#0EA5E9',
                        color: isDarkMode ? '#0F172A' : 'white'
                      }}>
                Join Our Journey
                <ArrowRight className="w-4 h-4 ml-2" />
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
          transform: translateY(-2px);
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(56, 189, 248, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(56, 189, 248, 0.5);
          }
        }
        
        .animate-pulse {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}