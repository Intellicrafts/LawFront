import { useState, useEffect, useRef } from "react";
import { 
  Users, Mail, Linkedin, Twitter, Globe, ChevronLeft, 
  ChevronRight, X, Award, Briefcase, MessageCircle
} from "lucide-react";

export default function EnhancedTeamComponent() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleTeam, setVisibleTeam] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(4);
  const sliderRef = useRef(null);
  const teamSectionRef = useRef(null);
  
  // Team member data
  const teamMembers = [
    {
      id: 1,
      name: "Aisha Patel",
      role: "Founder & CEO",
      categories: ["leadership", "legal"],
      bio: "With over 15 years of experience in corporate law and technology startups, Aisha founded MeraBakil with a vision to democratize legal services. She holds a J.D. from Harvard Law School and previously served as legal counsel for several Fortune 500 companies.",
      expertise: ["Corporate Law", "Legal Tech", "Strategic Leadership"],
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
      image: "https://superlawyer.in/wp-content/uploads/2023/07/image_6483441-1000x600.jpg",
      social: {
        email: "hiroshi@merabakil.com",
        linkedin: "hiroshitanaka",
        twitter: "hiroshi_intlaw"
      },
      quote: "Law transcends borders, but its application is always local. Our challenge is to bridge that gap."
    }
  ];
  
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

  // Check for dark mode preference and handle window resize
  useEffect(() => {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(darkModeQuery.matches);
    
    const darkModeHandler = (e) => setIsDarkMode(e.matches);
    darkModeQuery.addEventListener("change", darkModeHandler);
    
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
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      darkModeQuery.removeEventListener("change", darkModeHandler);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Filter team members based on active category
  useEffect(() => {
    if (activeCategory === "all") {
      setVisibleTeam(teamMembers);
    } else {
      setVisibleTeam(teamMembers.filter(member => member.categories.includes(activeCategory)));
    }
    setCurrentSlide(0);
  }, [activeCategory]);
  
  // Color styles
  const baseColor = "rgb(92, 172, 222)";
  const darkModeBaseColor = "rgba(92, 172, 222, 0.9)";
  const primaryColor = isDarkMode ? darkModeBaseColor : baseColor;
  const primaryBgLight = isDarkMode ? "rgba(92, 172, 222, 0.15)" : "rgba(92, 172, 222, 0.1)";
  const primaryBgMedium = isDarkMode ? "rgba(92, 172, 222, 0.25)" : "rgba(92, 172, 222, 0.2)";
  
  // Slider functions
  const nextSlide = () => {
    const maxSlides = Math.ceil(visibleTeam.length / itemsPerSlide) - 1;
    setCurrentSlide(current => current < maxSlides ? current + 1 : 0);
  };
  
  const prevSlide = () => {
    const maxSlides = Math.ceil(visibleTeam.length / itemsPerSlide) - 1;
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

  return (
    <div 
      ref={teamSectionRef}
      className={`w-full py-16 ${
        isDarkMode ? "bg-slate-900 text-white" : "bg-gradient-to-b from-white to-slate-50 text-slate-800"
      } transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section with parallax effect */}
        <div className="text-center mb-16 relative overflow-hidden">
          <div 
            className="absolute inset-0 -z-10 opacity-10"
            style={{ 
              backgroundImage: `url('/api/placeholder/1200/800')`,
              backgroundSize: 'cover', 
              backgroundPosition: 'center',
              transform: 'scale(1.1)'
            }}
          ></div>
          
          {/* <div className="relative py-12">
            <div 
              className="inline-flex items-center justify-center mb-4 px-4 py-2 rounded-full"
              style={{ backgroundColor: primaryBgLight, color: primaryColor }}
            >
              <Users className="w-5 h-5 mr-2" />
              <span className="text-sm font-semibold uppercase tracking-wider">Meet Our Team</span>
            </div>
            
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text"
              style={{ 
                color: primaryColor,
                textShadow: isDarkMode ? '0 2px 4px rgba(0,0,0,0.3)' : 'none'
              }}
            >
              The People Behind MeraBakil
            </h2>
            
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
              Our diverse team of legal experts, technologists, and community advocates 
              work together to make legal services accessible, understandable, and effective for everyone.
            </p>
            
            <button 
              onClick={scrollToTeam}
              className="px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: primaryColor, color: '#fff' }}
            >
              Meet The Experts
            </button>
          </div> */}
        </div>
        
        {/* Category Filter Tabs - Sticky on mobile scroll */}
        <div className="sticky top-0 z-30 py-4 backdrop-blur-md bg-opacity-80 -mx-4 px-4 sm:static sm:py-0 sm:backdrop-blur-none sm:bg-opacity-100 sm:mx-0 sm:px-0"
          style={{ backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)' }}
        >
          <div className="flex flex-nowrap overflow-x-auto md:flex-wrap md:overflow-visible justify-start md:justify-center gap-2 md:gap-4 mb-8 md:mb-12 pb-2 md:pb-0 scrollbar-hide">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm md:text-base font-medium whitespace-nowrap transition-all duration-300 ${
                  activeCategory === category.id 
                    ? "shadow-lg transform scale-105"
                    : `${isDarkMode ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"} hover:bg-slate-100/10`
                }`}
                style={{ 
                  backgroundColor: activeCategory === category.id 
                    ? primaryColor 
                    : isDarkMode ? "rgba(30, 41, 59, 0.5)" : "rgba(241, 245, 249, 0.8)",
                  color: activeCategory === category.id ? "#fff" : undefined,
                  borderBottom: activeCategory === category.id ? `2px solid ${primaryColor}` : undefined
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Team Members Section */}
        <div className="relative">
          {/* Team Members Heading */}
          <div className="flex justify-between items-center mb-8">
            {/* <h3 className="text-2xl font-bold" style={{ color: primaryColor }}>
              {activeCategory === "all" ? "Our Experts" : categories.find(c => c.id === activeCategory)?.name}
            </h3> */}
            
            {/* Slider Navigation on desktop */}
            {/* <div className="hidden md:flex gap-3">
              <button 
                onClick={prevSlide}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 ${
                  isDarkMode ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-white text-slate-800 hover:bg-slate-50"
                }`}
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button 
                onClick={nextSlide}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 ${
                  isDarkMode ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-white text-slate-800 hover:bg-slate-50"
                }`}
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div> */}
          </div>
          
          {/* Slider Arrow - Mobile */}
          <div className="absolute top-1/2 -left-2 md:-left-6 transform -translate-y-1/2 z-10">
            <button 
              onClick={prevSlide}
              className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-lg ${
                isDarkMode ? "bg-slate-800 text-white" : "bg-white text-slate-800"
              } hover:scale-110 transition-all duration-200`}
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
          
          <div className="absolute top-1/2 -right-2 md:-right-6 transform -translate-y-1/2 z-10">
            <button 
              onClick={nextSlide}
              className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-lg ${
                isDarkMode ? "bg-slate-800 text-white" : "bg-white text-slate-800"
              } hover:scale-110 transition-all duration-200`}
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
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
                transform: `translateX(-${currentSlide * (100 / Math.min(itemsPerSlide, visibleTeam.length))}%)`,
              }}
            >
              {visibleTeam.map((member) => (
                <div 
                  key={member.id} 
                  className="w-full min-w-full sm:min-w-[50%] lg:min-w-[33.333%] xl:min-w-[25%] px-3"
                  style={{
                    width: `${100 / Math.min(itemsPerSlide, visibleTeam.length)}%`,
                  }}
                >
                  <div 
                    onClick={() => setSelectedMember(member)}
                    className={`group h-full cursor-pointer relative overflow-hidden rounded-xl shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-2 ${
                      isDarkMode ? "bg-slate-800" : "bg-white"
                    }`}
                    style={{ 
                      borderTop: `4px solid ${primaryColor}`,
                    }}
                  >
                    <div className="p-5 sm:p-6 flex flex-col items-center text-center h-full">
                      {/* Member Image with animated border */}
                      <div className="relative mb-4 w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 group-hover:scale-105 transition-transform duration-300" 
                        style={{ 
                          borderColor: primaryColor,
                          boxShadow: `0 0 20px ${isDarkMode ? 'rgba(92, 172, 222, 0.3)' : 'rgba(92, 172, 222, 0.2)'}`
                        }}
                      >
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Decorative circles */}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                        <div className="absolute -top-1 -left-1 w-4 h-4 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                      </div>
                      
                      {/* Member Info */}
                      <h3 className="text-lg sm:text-xl font-bold mb-1">{member.name}</h3>
                      <p className="text-sm mb-3" style={{ color: primaryColor }}>{member.role}</p>
                      
                      {/* Expertise Tags */}
                      <div className="flex flex-wrap justify-center gap-1 mb-3">
                        {member.expertise.slice(0, 2).map((skill, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 text-xs rounded-full" 
                            style={{ 
                              backgroundColor: isDarkMode ? primaryBgMedium : primaryBgLight,
                              color: primaryColor 
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      
                      {/* Bio Preview */}
                      <p className={`text-xs sm:text-sm line-clamp-3 mb-4 ${
                        isDarkMode ? "text-slate-300" : "text-slate-600"
                      }`}>
                        {member.bio}
                      </p>
                      
                      {/* View Profile Button */}
                      <div 
                        className="mt-auto px-4 py-2 rounded-lg text-sm font-medium group-hover:bg-opacity-100 transition-all duration-300 flex items-center justify-center gap-2" 
                        style={{ 
                          color: primaryColor,
                          backgroundColor: isDarkMode ? primaryBgMedium : primaryBgLight
                        }}
                      >
                        <span>View Profile</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                    
                    {/* Animated hover gradient overlay */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ 
                        background: `linear-gradient(to bottom, transparent 70%, ${isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)'} 100%)` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Carousel Indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: Math.ceil(visibleTeam.length / itemsPerSlide) }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? "w-8" : "w-2"
                }`}
                style={{ 
                  backgroundColor: currentSlide === idx 
                    ? primaryColor 
                    : isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.2)" 
                }}
                aria-label={`Go to slide ${idx + 1}`}
              ></button>
            ))}
          </div>
        </div>
        
        {/* Team Stats Section with subtle animation */}
        <div className="mt-20 mb-16 relative overflow-hidden rounded-2xl py-4">
          <div 
            className="absolute inset-0 -z-10"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)',
              backgroundImage: isDarkMode ? 
                'radial-gradient(circle at 30% 20%, rgba(92, 172, 222, 0.1) 0%, transparent 50%)' : 
                'radial-gradient(circle at 30% 20%, rgba(92, 172, 222, 0.2) 0%, transparent 60%)'
            }}
          ></div>
          
          <h3 className="text-center text-2xl font-bold mb-8" style={{ color: primaryColor }}>Team Impact</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto px-4">
            {[
              { value: "15+", label: "Legal Specialties", icon: <Briefcase className="w-5 h-5" /> },
              { value: "25+", label: "Team Members", icon: <Users className="w-5 h-5" /> },
              { value: "12+", label: "Years Experience", icon: <Award className="w-5 h-5" /> },
              { value: "5", label: "Countries Represented", icon: <Globe className="w-5 h-5" /> }
            ].map((stat, index) => (
              <div 
                key={index}
                className={`rounded-xl p-4 md:p-6 text-center transform transition-all duration-500 hover:scale-105 ${
                  isDarkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-white hover:bg-slate-50"
                } shadow-lg`}
              >
                <div 
                  className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: primaryBgLight, color: primaryColor }}
                >
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-1" style={{ color: primaryColor }}>{stat.value}</div>
                <div className="text-xs md:text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Team Culture Section */}
        <div 
          className={`rounded-2xl overflow-hidden shadow-xl max-w-5xl mx-auto mt-16 bg-gradient-to-br ${
            isDarkMode ? "from-slate-800 to-slate-900" : "from-white to-slate-50"
          }`}
        >
          <div className="grid md:grid-cols-2">
            {/* Image Section with overlay */}
            <div className="h-64 md:h-auto overflow-hidden relative">
              <img 
                src="https://www.centurylawfirm.in/blog/wp-content/uploads/2021/05/08-1024x768.jpg" 
                alt="MeraBakil Team Collaboration" 
                className="w-full h-full object-cover transition-transform duration-10000 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Our Culture</h3>
                  <p className="text-sm">Collaboration, innovation, and accessibility guide everything we do</p>
                </div>
              </div>
            </div>
            
            {/* Content Section */}
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>
                What Makes Us Different
              </h3>
              
              <ul className="space-y-4">
                {[
                  {
                    title: "Interdisciplinary Expertise",
                    description: "Our team combines legal knowledge with technological innovation to create truly accessible solutions."
                  },
                  {
                    title: "Continuous Learning",
                    description: "We invest in ongoing education to stay ahead of both legal changes and technological advancements."
                  },
                  {
                    title: "User-Centered Approach",
                    description: "Everything we build is designed with our users' needs and experiences at the forefront."
                  }
                ].map((item, index) => (
                  <li key={index} className="flex items-start transition-all duration-300 hover:translate-x-1">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0" 
                      style={{ backgroundColor: primaryBgMedium }}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                    </div>
                    <div>
                      <h4 className="font-medium">{item.title}</h4>
                      <p className={`text-sm ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6">
                <a 
                  href="#" 
                  className="inline-flex items-center text-sm font-medium transition-all duration-300 hover:translate-x-1"
                  style={{ color: primaryColor }}
                >
                  <span>Learn more about our culture</span>
                  <ChevronRight className="ml-1 w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Join Our Team CTA */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>Join Our Team</h3>
          <p className="max-w-2xl mx-auto mb-6 text-sm md:text-base">
            We're always looking for passionate individuals who share our mission of making legal services accessible to everyone.
          </p>
          <button 
            className="px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: primaryColor, color: '#fff' }}
          >
            View Open Positions
          </button>
        </div>
        
        {/* Testimonial Section - Completing from where it was cut off */}
        <div 
          className={`mt-16 p-6 md:p-8 rounded-2xl relative overflow-hidden ${
            isDarkMode ? "bg-slate-800" : "bg-slate-50"
          }`}
        >
          <div 
            className="absolute top-0 left-0 w-32 h-32 -translate-x-16 -translate-y-16 rounded-full opacity-20"
            style={{ backgroundColor: primaryColor }}
          ></div>
          
          <div className="relative z-10">
            <div className="text-4xl mb-4" style={{ color: primaryColor }}>"</div>
            <p className="text-lg md:text-xl italic mb-6">
              Working at MeraBakil means being part of a team that truly believes in using technology to democratize access to legal resources. Every day, I see how our collective expertise helps people navigate complex legal issues with confidence.
            </p>
            
            <div className="flex items-center">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRftjU02q_WV7OD17ku8aUmWNNH6FeHQa12pSYu1xUNYxvqtndn-EW67WXOdB5XBS2LTRA&usqp=CAU" 
                alt="Team Member" 
                className="w-12 h-12 rounded-full object-cover mr-4 border-2"
                style={{ borderColor: primaryColor }}
              />
              <div>
                <h4 className="font-bold">Michael Wong</h4>
                <p className="text-sm" style={{ color: primaryColor }}>Software Engineer</p>
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
              isDarkMode ? "bg-slate-900" : "bg-white"
            } transition-all duration-300 animate-fadeIn`}
          >
            {/* Close Button */}
            <button 
              onClick={closeModal}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center z-20 ${
                isDarkMode ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-slate-100 text-slate-800 hover:bg-slate-200"
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
                  style={{ backgroundColor: primaryColor }}
                ></div>
                
                {/* Image */}
                <div className="relative mb-6 w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 shadow-lg z-10" 
                  style={{ 
                    borderColor: primaryColor,
                    boxShadow: `0 8px 32px ${isDarkMode ? 'rgba(92, 172, 222, 0.3)' : 'rgba(92, 172, 222, 0.2)'}`
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
                <p className="text-lg mb-6 relative z-10" style={{ color: primaryColor }}>{selectedMember.role}</p>
                
                {/* Expertise */}
                <div className="w-full mb-6 relative z-10">
                  <h3 className="text-sm uppercase tracking-wider font-semibold mb-3 opacity-80">Areas of Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.expertise.map((skill, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 text-sm rounded-full" 
                        style={{ 
                          backgroundColor: isDarkMode ? primaryBgMedium : primaryBgLight,
                          color: primaryColor 
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
                          style={{ backgroundColor: primaryBgLight }}
                        >
                          <Mail className="w-4 h-4" style={{ color: primaryColor }} />
                        </div>
                        <span className={`group-hover:underline ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
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
                          style={{ backgroundColor: primaryBgLight }}
                        >
                          <Linkedin className="w-4 h-4" style={{ color: primaryColor }} />
                        </div>
                        <span className={`group-hover:underline ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
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
                          style={{ backgroundColor: primaryBgLight }}
                        >
                          <Twitter className="w-4 h-4" style={{ color: primaryColor }} />
                        </div>
                        <span className={`group-hover:underline ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
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
                  style={{ backgroundColor: primaryColor }}
                ></div>
                
                {/* Quote */}
                {selectedMember.quote && (
                  <div className="mb-8 relative">
                    <div 
                      className="text-4xl absolute -top-4 -left-2 opacity-30"
                      style={{ color: primaryColor }}
                    >
                      "
                    </div>
                    <p 
                      className="text-lg md:text-xl italic pl-6 relative z-10"
                      style={{ color: primaryColor }}
                    >
                      {selectedMember.quote}
                    </p>
                  </div>
                )}
                
                {/* Bio */}
                <div className="mb-8 relative z-10">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2 opacity-80" style={{ color: primaryColor }} />
                    Biography
                  </h3>
                  <p className={`leading-relaxed mb-4 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>{selectedMember.bio}</p>
                </div>
                
                {/* Featured Projects */}
                <div className="mb-8 relative z-10">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 opacity-80" style={{ color: primaryColor }} />
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
                          isDarkMode ? "border-slate-600 bg-slate-800/50" : "border-slate-300 bg-slate-50"
                        }`}
                      >
                        <h4 className="font-bold mb-2">{project.title}</h4>
                        <p className={`text-sm ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
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
                    style={{ backgroundColor: primaryColor, color: '#fff' }}
                  >
                    Schedule a Consultation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}