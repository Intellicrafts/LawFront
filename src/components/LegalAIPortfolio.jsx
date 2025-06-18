import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  FileText,
  Calendar,
  Shield,
  Users,
  TrendingUp,
  CheckCircle,
  Star,
  ArrowRight,
  Bot,
  Scale,
  Clock,
  Award,
  Globe,
  Heart,
  Zap,
  Search,
  Download,
  Upload,
  Eye,
  Sparkles,
  Play,
  Phone,
  Video,
  MessageCircle,
  BookOpen,
  Target,
  BarChart3,
  Layers,
  Scan,
  FileCheck,
  UserCheck,
  Lightbulb
} from 'lucide-react';

// Custom Link component that scrolls to top before navigation
const ScrollToTopLink = ({ to, children, ...props }) => {
  const navigate = useNavigate();
  
  const handleClick = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Navigate after a short delay to allow smooth scrolling
    setTimeout(() => {
      navigate(to);
    }, 300);
  };
  
  return (
    <Link to={to} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
};

const LegalAIPortfolio = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [scanningProgress, setScanningProgress] = useState(0);
  const [chatMessageIndex, setChatMessageIndex] = useState(0);
  const [appointmentStep, setAppointmentStep] = useState(0);
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Memoized chat messages to prevent recreation on every render
  const chatMessages = useMemo(() => [
    { text: "What are my rights as a tenant?", isUser: true },
    { text: "As a tenant, you have several key rights including privacy, habitability, and protection from discrimination.", isUser: false },
    { text: "Can you help with contract review?", isUser: true },
    { text: "Absolutely! I can analyze contracts instantly and highlight key terms and potential issues.", isUser: false }
  ], []);

  // Optimized document scanning animation with proper cleanup
  useEffect(() => {
    if (isAnimationPaused) return;
    
    const interval = setInterval(() => {
      setScanningProgress(prev => {
        if (prev >= 100) return 0;
        return prev + 1.5; // Smoother animation
      });
    }, 80); // More consistent timing
    
    return () => clearInterval(interval);
  }, [isAnimationPaused]);

  // Optimized chat animation with proper message cycling
  useEffect(() => {
    if (isAnimationPaused) return;
    
    const interval = setInterval(() => {
      setChatMessageIndex(prev => (prev + 1) % chatMessages.length);
    }, 3000); // Longer display time for better readability
    
    return () => clearInterval(interval);
  }, [chatMessages.length, isAnimationPaused]);

  // Optimized appointment steps animation
  useEffect(() => {
    if (isAnimationPaused) return;
    
    const interval = setInterval(() => {
      setAppointmentStep(prev => (prev + 1) % 4);
    }, 2000); // Better timing for step visibility
    
    return () => clearInterval(interval);
  }, [isAnimationPaused]);

  // Pause animations when not visible (performance optimization)
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsAnimationPaused(document.hidden);
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Memoized theme configuration
  const theme = useMemo(() => ({
    light: {
      bg: '#F8F9FA',
      text: '#1E293B',
      textSecondary: '#64748B',
      accent: '#0EA5E9',
      cardBg: '#FFFFFF',
      cardBorder: '#E2E8F0'
    },
    dark: {
      bg: '#0F172A',
      text: '#E2E8F0',
      textSecondary: '#94A3B8',
      accent: '#38BDF8',
      cardBg: '#1E293B',
      cardBorder: '#334155'
    }
  }), []);

  const currentTheme = darkMode ? theme.dark : theme.light;

  // Memoized services configuration
  const services = useMemo(() => [
    {
      icon: <Bot className="w-10 h-10" />,
      title: "AI Legal Chatbot",
      subtitle: "Instant Legal Assistance",
      description: "Get immediate answers to complex legal questions with 99.5% accuracy",
      stats: "50K+ Daily Queries",
      gradient: "from-blue-500 via-purple-500 to-pink-500",
      bgGradient: "from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950",
      route: "/"
    },
    {
      icon: <FileText className="w-10 h-10" />,
      title: "Document Review System",
      subtitle: "AI-Powered Analysis",
      description: "Advanced document scanning and review with complete privacy protection",
      stats: "10K+ Documents Processed",
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      bgGradient: "from-emerald-50 to-cyan-50 dark:from-emerald-950 dark:to-cyan-950",
      route: "/legal-documents-review"
    },
    {
      icon: <Calendar className="w-10 h-10" />,
      title: "Expert Consultations",
      subtitle: "Professional Legal Guidance",
      description: "Connect with specialized lawyers for personalized legal support",
      stats: "98% Satisfaction Rate",
      gradient: "from-orange-500 via-red-500 to-pink-500",
      bgGradient: "from-orange-50 to-pink-50 dark:from-orange-950 dark:to-pink-950",
      route: "/legal-consoltation"
    }
  ], []);

  // Memoized stats configuration
  const stats = useMemo(() => [
    { label: "Happy Clients", value: "25K+", icon: <Heart className="w-8 h-8" />, color: "text-pink-500" },
    { label: "Legal Queries", value: "100K+", icon: <MessageSquare className="w-8 h-8" />, color: "text-blue-500" },
    { label: "Documents", value: "50K+", icon: <FileText className="w-8 h-8" />, color: "text-green-500" },
    { label: "Success Rate", value: "99.5%", icon: <Award className="w-8 h-8" />, color: "text-yellow-500" }
  ], []);

  const features = useMemo(() => [
    { icon: <Shield className="w-6 h-6" />, title: "100% Privacy Protected", desc: "Your documents stay secure" },
    { icon: <Clock className="w-6 h-6" />, title: "24/7 Availability", desc: "Legal help anytime" },
    { icon: <Globe className="w-6 h-6" />, title: "Global Coverage", desc: "Border-free legal services" },
    { icon: <Sparkles className="w-6 h-6" />, title: "AI-Powered", desc: "Cutting-edge technology" }
  ], []);

  const testimonials = useMemo(() => [
    {
      name: "Sarah Johnson",
      role: "Business Owner",
      content: "The AI chatbot solved my complex contract issues in minutes!",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Startup Founder",
      content: "Document review system saved me thousands in legal fees.",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "Freelancer",
      content: "Perfect lawyer match through their consultation platform!",
      rating: 5,
      avatar: "ER"
    }
  ], []);

  const appointmentSteps = useMemo(() => [
    { icon: <Search className="w-6 h-6" />, title: "Find Lawyer", active: appointmentStep === 0 },
    { icon: <Calendar className="w-6 h-6" />, title: "Schedule", active: appointmentStep === 1 },
    { icon: <Video className="w-6 h-6" />, title: "Consult", active: appointmentStep === 2 },
    { icon: <CheckCircle className="w-6 h-6" />, title: "Resolve", active: appointmentStep === 3 }
  ], [appointmentStep]);

  // Optimized Chat Animation Component
  const ChatAnimation = useCallback(() => {
    const currentMessage = chatMessages[chatMessageIndex];
    
    return (
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl">
          <div className="p-6 h-full flex flex-col justify-end">
            <div className="space-y-3">
              <div className={`flex ${currentMessage.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm transition-all duration-500 transform ${
                  currentMessage.isUser 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white ml-4' 
                    : 'bg-white dark:bg-gray-800 mr-4 shadow-lg'
                } animate-fade-in-up`}>
                  {currentMessage.text}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center mt-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [chatMessages, chatMessageIndex]);

  // Optimized Document Scanning Animation
  const DocumentScanAnimation = useCallback(() => (
    <div className="relative h-64 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-2xl">
        <div className="p-6 h-full flex flex-col items-center justify-center">
          <div className="relative w-32 h-40 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-gray-200 dark:border-gray-700 transform hover:scale-105 transition-transform duration-300">
            <div className="absolute inset-2 space-y-2">
              <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
              <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-3/4 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
              <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-1/2 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-5/6 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
              <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-2/3 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            
            {/* Enhanced scanning line animation */}
            <div 
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80 transition-all duration-200 ease-out"
              style={{ 
                top: `${Math.min((scanningProgress / 100) * 88, 88)}%`,
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.8)',
                filter: 'blur(0.5px)'
              }}
            />
          </div>
          
          <div className="mt-6 flex items-center space-x-3">
            <Scan className="w-6 h-6 text-emerald-500 animate-pulse" />
            <div className="text-sm font-medium">
              Scanning Document... {Math.floor(scanningProgress)}%
            </div>
          </div>
          
          <div className="mt-3 w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-200 ease-out"
              style={{ width: `${scanningProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  ), [scanningProgress]);

  // Optimized Appointment Flow Animation
  const AppointmentAnimation = useCallback(() => (
    <div className="relative h-64 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-2xl">
        <div className="p-6 h-full flex flex-col items-center justify-center">
          <div className="flex items-center justify-between w-full max-w-sm mb-8">
            {appointmentSteps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 ease-out ${
                  step.active 
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white scale-110 shadow-lg shadow-orange-500/30' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 hover:scale-105'
                }`}>
                  {step.icon}
                </div>
                <div className={`text-xs mt-2 transition-all duration-700 ${
                  step.active ? 'text-orange-500 font-semibold transform scale-110' : 'text-gray-400'
                }`}>
                  {step.title}
                </div>
                {idx < appointmentSteps.length - 1 && (
                  <div className="absolute top-6 left-1/2 w-16 h-0.5 bg-gray-300 dark:bg-gray-600 -translate-y-1/2 translate-x-6">
                    <div 
                      className={`h-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-700 ${
                        appointmentStep > idx ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold mb-2 transition-all duration-500">
              {appointmentSteps[appointmentStep].title}
            </div>
            <div className="text-sm text-gray-500">
              Step {appointmentStep + 1} of 4
            </div>
          </div>
        </div>
      </div>
    </div>
  ), [appointmentSteps, appointmentStep]);

  // Optimized service change handler
  const handleServiceChange = useCallback((index) => {
    setActiveService(index);
  }, []);

  // Optimized theme toggle
  const toggleTheme = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  return (
    <div style={{ backgroundColor: currentTheme.bg, color: currentTheme.text }} className="min-h-screen transition-colors duration-300">
      {/* Header Controls */}
      <div className="sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300" style={{ 
        backgroundColor: `${currentTheme.cardBg}95`, 
        borderColor: currentTheme.cardBorder 
      }}>
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-200">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg">LegalAI Pro</div>
              <div className="text-xs opacity-60">AI-Powered Legal Platform</div>
            </div>
          </div>
          
          <button
            onClick={toggleTheme}
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ backgroundColor: `${currentTheme.accent}20` }}
          >
            <div className="text-2xl">{darkMode ? '☀️' : '🌙'}</div>
          </button>
        </div> */}
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 mt-4 lg:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-pink-950/50 transition-colors duration-500"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold mb-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200 dark:border-blue-800 animate-fade-in-up">
              <Sparkles className="w-5 h-5 mr-2 text-blue-500 animate-pulse" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Legal Revolution
              </span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black mb-8 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Smart Legal
              </span>
              <br />
              <span>Solutions</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up" 
               style={{ color: currentTheme.textSecondary, animationDelay: '0.2s' }}>
              Experience the future of legal services with our AI chatbot, intelligent document review, 
              and expert lawyer consultations. Making legal help accessible, instant, and powerful.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <button className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center">
                <Zap className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                Try AI Assistant
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              
              <button className="flex items-center px-10 py-5 rounded-2xl font-semibold text-lg border-2 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg" style={{
                borderColor: currentTheme.accent,
                color: currentTheme.accent
              }}>
                <Play className="w-6 h-6 mr-3" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Dashboard */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative p-8 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-100" style={{
                  backgroundColor: `${currentTheme.cardBg}90`,
                  borderColor: currentTheme.cardBorder
                }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 shadow-lg ${stat.color} transform group-hover:scale-110 transition-transform duration-300`}>
                      {stat.icon}
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-500 animate-pulse" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-black mb-2">{stat.value}</div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Showcase */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Revolutionary
              </span>{' '}
              Services
            </h2>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed" style={{ color: currentTheme.textSecondary }}>
              Powered by cutting-edge AI technology, transforming how legal services are delivered
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative cursor-pointer"
                onClick={() => handleServiceChange(index)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-all duration-500`}></div>
                
                <ScrollToTopLink to={service.route}>
                  <div className={`relative p-8 rounded-3xl border-2 backdrop-blur-sm transition-all duration-500 hover:scale-105 active:scale-100 ${
                    activeService === index ? 'ring-4 shadow-2xl' : 'hover:shadow-xl'
                  }`} style={{
                  backgroundColor: `${currentTheme.cardBg}95`,
                  borderColor: activeService === index ? currentTheme.accent : currentTheme.cardBorder,
                  ringColor: activeService === index ? `${currentTheme.accent}40` : 'transparent'
                }}>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {service.icon}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold opacity-60">{service.subtitle}</div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-lg mb-6 leading-relaxed" style={{ color: currentTheme.textSecondary }}>
                    {service.description}
                  </p>
                  
                  {/* Service-specific animations */}
                  <div className="mb-6">
                    {index === 0 && <ChatAnimation />}
                    {index === 1 && <DocumentScanAnimation />}
                    {index === 2 && <AppointmentAnimation />}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5" style={{ color: currentTheme.accent }} />
                      <span className="font-semibold" style={{ color: currentTheme.accent }}>
                        {service.stats}
                      </span>
                    </div>
                    <ArrowRight className={`w-6 h-6 transition-transform duration-300 ${
                      activeService === index ? 'translate-x-1' : ''
                    }`} style={{ color: currentTheme.accent }} />
                  </div>
                </div>
                </ScrollToTopLink>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 transition-colors duration-500" style={{ backgroundColor: `${currentTheme.accent}05` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Why Choose Our Platform?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group text-center">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-all duration-300"></div>
                  <div className="relative w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 active:scale-105 transition-transform duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p style={{ color: currentTheme.textSecondary }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
     {/* Testimonials */}
       <section className="py-20">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="text-4xl md:text-5xl font-black mb-6">
               Client Success Stories
             </h2>
           </div>

           <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                
                <div className="relative p-8 rounded-3xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl" style={{
                  backgroundColor: `${currentTheme.cardBg}95`,
                  borderColor: currentTheme.cardBorder
                }}>
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="text-lg mb-6 leading-relaxed" style={{ color: currentTheme.textSecondary }}>
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-lg">{testimonial.name}</div>
                      <div className="text-sm opacity-60">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
       <div className={`absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-20`}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold mb-8">
            <Lightbulb className="w-5 h-5 mr-2" />
            Ready to Transform Your Legal Experience?
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
            Join 25,000+ Happy Clients
          </h2>
          
          <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Experience the power of AI-driven legal solutions. Start your journey today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="group px-12 py-6 bg-white text-blue-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center">
              <Zap className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
              Start Free Trial
            </button>
            
            <button className="px-12 py-6 border-2 border-white rounded-2xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center">
              <Calendar className="w-6 h-6 mr-3" />
              Book Demo
            </button>
          </div>
        </div>
      </section> */}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LegalAIPortfolio;  