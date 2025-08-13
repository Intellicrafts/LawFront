import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/themeSlice';
import { Upload, FileText, User, Star, MessageCircle, Clock, DollarSign, Filter, Search, Calendar, CheckCircle, AlertCircle, Eye, Download, Send, Phone, Video, Shield, Award, BookOpen, Briefcase, Scale, Building, Users, Heart, ChevronRight, X, Paperclip, ArrowRight, Edit, Moon, Sun } from 'lucide-react';

const DocumentReview = () => {
  // Use Redux theme state instead of local state
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';
  const dispatch = useDispatch();
  
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBooking, setShowBooking] = useState(false);

  // Mock data for lawyers
  const lawyers = [
    {
      id: 1,
      name: "Rahul Gupta",
      specialization: "Corporate Law",
      rating: 4.9,
      reviews: 156,
      experience: 12,
      hourlyRate: 350,
      avatar: "https://t4.ftcdn.net/jpg/10/88/94/95/360_F_1088949502_CcUgYnnDv5rTYrH3E6ddq8V3Sgi8ApMq.jpg",
      verified: true,
      languages: ["English", "Spanish"],
      availability: "Available Today",
      badges: ["Top Rated", "Quick Response"],
      completedCases: 1247,
      bio: "Specialized in corporate governance, M&A, and contract review with Fortune 500 experience.",
      services: ["Contract Review", "Corporate Formation", "M&A Documents", "Compliance Review"]
    },
    {
      id: 2,
      name: "Pankaj Jain",
      specialization: "Employment Law",
      rating: 4.8,
      reviews: 89,
      experience: 8,
      hourlyRate: 280,
      avatar: "https://www.shutterstock.com/image-photo/happy-young-indian-arabic-businessman-260nw-2187607295.jpg",
      verified: true,
      languages: ["English", "Mandarin"],
      availability: "Available Tomorrow",
      badges: ["Employment Expert", "Fast Delivery"],
      completedCases: 892,
      bio: "Expert in employment contracts, workplace policies, and labor law compliance.",
      services: ["Employment Contracts", "Policy Review", "Termination Documents", "HR Compliance"]
    },
    {
      id: 3,
      name: "Vivek tyagi",
      specialization: "Intellectual Property",
      rating: 4.9,
      reviews: 203,
      experience: 15,
      hourlyRate: 420,
      avatar: "https://st4.depositphotos.com/13187390/26944/i/450/depositphotos_269449576-stock-photo-young-indian-asian-businessman-suit.jpg",
      verified: true,
      languages: ["English", "Portuguese"],
      availability: "Available Now",
      badges: ["IP Specialist", "Patent Expert"],
      completedCases: 1876,
      bio: "Leading IP attorney specializing in patents, trademarks, and licensing agreements.",
      services: ["Patent Applications", "Trademark Filing", "IP Agreements", "Licensing Contracts"]
    },
    {
      id: 4,
      name: "Rajesh Sharma",
      specialization: "Real Estate Law",
      rating: 4.7,
      reviews: 134,
      experience: 10,
      hourlyRate: 320,
      avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcE-T2vdvmW46LS4Vx4OEuT8QqOtGfSsuEwGyTTtzLgbZOlAWbO8Mj4arfmfGqprnyo_0&usqp=CAU",
      verified: true,
      languages: ["English", "French"],
      availability: "Available Today",
      badges: ["Real Estate Pro", "Contract Specialist"],
      completedCases: 1023,
      bio: "Comprehensive real estate legal services including transactions and property law.",
      services: ["Purchase Agreements", "Lease Contracts", "Property Transfers", "Zoning Issues"]
    }
  ];

  // Document services
  const documentServices = [
    {
      id: 1,
      name: "Contract Review",
      description: "Comprehensive review of existing contracts",
      price: 150,
      duration: "2-3 days",
      icon: FileText,
      category: "Review",
      features: ["Legal Analysis", "Risk Assessment", "Recommendations", "Summary Report"]
    },
    {
      id: 2,
      name: "Document Drafting",
      description: "Create new legal documents from scratch",
      price: 300,
      duration: "3-5 days",
      icon: Edit,
      category: "Creation",
      features: ["Custom Drafting", "Legal Compliance", "Multiple Revisions", "Final Review"]
    },
    {
      id: 3,
      name: "Compliance Check",
      description: "Ensure documents meet regulatory requirements",
      price: 200,
      duration: "1-2 days",
      icon: Shield,
      category: "Compliance",
      features: ["Regulatory Review", "Compliance Report", "Risk Mitigation", "Updates"]
    },
    {
      id: 4,
      name: "Legal Consultation",
      description: "One-on-one consultation with legal expert",
      price: 100,
      duration: "1 hour",
      icon: MessageCircle,
      category: "Consultation",
      features: ["Video Call", "Document Review", "Q&A Session", "Follow-up Notes"]
    }
  ];

  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesSearch = lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lawyer.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || lawyer.specialization.toLowerCase().includes(filterCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  // const handleFileUpload = (event) => {
  //   const files = Array.from(event.target.files);
  //   const newFiles = files.map(file => ({
  //     id: Date.now() + Math.random(),
  //     name: file.name,
  //     size: file.size,
  //     type: file.type,
  //     uploadedAt: new Date(),
  //     status: 'uploaded'
  //   }));

    

  //   setUploadedFiles([...uploadedFiles, ...newFiles]);
  // };

  const handleFileUpload = async (event) => {
  const files = Array.from(event.target.files);

    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
      status: 'uploaded'
    }));
  if (files.length === 0) return;

  const file = files[0]; // Assuming only the first file is to be uploaded

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('https://munsi-27296519338.asia-southeast1.run.app/analyze', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const result = await response.json();

    // Format the JSON response for display
    const formattedResult = JSON.stringify(result, null, 2);

    // Display the formatted response in an alert
    alert(`Analysis Result:\n\n${formattedResult}`);
  } catch (error) {
    console.error('Error uploading file:', error);
    alert(`Error uploading file: ${error.message}`);
  }
  setUploadedFiles([...uploadedFiles, ...newFiles]);
};

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: Date.now(),
        text: newMessage,
        sender: 'user',
        timestamp: new Date()
      }]);
      setNewMessage('');
      
      // Simulate lawyer response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: "Thank you for your message. I'll review your document and get back to you within 24 hours with initial feedback.",
          sender: 'lawyer',
          timestamp: new Date()
        }]);
      }, 2000);
    }
  };

  const BookingModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
              Book Service
            </h3>
            <button
              onClick={() => setShowBooking(false)}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-200' : 'text-slate-500 hover:bg-gray-100 hover:text-slate-700'}`}
              aria-label="Close booking modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {selectedLawyer && selectedService && (
            <div className="space-y-6">
              {/* Service Summary */}
              <div className={`p-4 rounded-lg border transition-colors duration-300 ${
                isDarkMode ? 'bg-slate-700/70 border-slate-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                  Service Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Service:</span>
                    <span className={`ml-2 font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      {selectedService.name}
                    </span>
                  </div>
                  <div>
                    <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Price:</span>
                    <span className={`ml-2 font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                      ${selectedService.price}
                    </span>
                  </div>
                  <div>
                    <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Duration:</span>
                    <span className={`ml-2 font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      {selectedService.duration}
                    </span>
                  </div>
                  <div>
                    <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Lawyer:</span>
                    <span className={`ml-2 font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      {selectedLawyer.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <form className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    Preferred Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-slate-100' 
                        : 'bg-white border-gray-300 text-slate-800'
                    } focus:ring-2 focus:ring-sky-500 focus:border-sky-500`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    Project Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Briefly describe your legal document needs..."
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400' 
                        : 'bg-white border-gray-300 text-slate-800 placeholder-slate-500'
                    } focus:ring-2 focus:ring-sky-500 focus:border-sky-500`}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBooking(false)}
                    className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                      isDarkMode 
                        ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' 
                        : 'bg-gray-200 hover:bg-gray-300 text-slate-700'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-6 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition-colors shadow-sm"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="mt-2 md:mt-4 lg:mt-16 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className={`mt-6 px-6 py-5 rounded-xl ${
              isDarkMode ? 'bg-slate-800/70 border border-slate-700' : 'bg-white shadow-sm border border-gray-200'
            } transition-colors duration-300`}>
              <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${
                isDarkMode ? 'text-slate-100' : 'text-slate-800'
              }`}>
                Legal Document Review
              </h1>
              
              <p className={`text-sm sm:text-base lg:text-lg mt-2 leading-relaxed ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                <span className="block sm:inline">
                  Connect with specialized lawyers
                </span>
                <span className="hidden sm:inline">
                  {' '}for document review and legal services
                </span>
              </p>
            </div>

            <button
              onClick={() => dispatch(toggleTheme())}
              className={`p-3 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700' 
                  : 'bg-white text-slate-600 hover:bg-gray-100 shadow-sm border'
              }`}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={`rounded-xl p-2 mb-8 transition-colors duration-300 ${
          isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white shadow-sm border'
        }`}>
          <div className="flex space-x-1">
            {[
              { id: 'upload', label: 'Upload Documents', icon: Upload },
              { id: 'lawyers', label: 'Find Lawyers', icon: Users },
              { id: 'services', label: 'Services', icon: Briefcase },
              { id: 'status', label: 'My Cases', icon: FileText }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-sky-500 text-white'
                      : isDarkMode
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                        : 'text-slate-600 hover:text-slate-800 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Upload Documents Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-8">
            {/* Upload Area */}
            <div className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors duration-300 ${
              isDarkMode 
                ? 'border-slate-600 bg-slate-800 hover:border-sky-400' 
                : 'border-gray-300 bg-white hover:border-sky-500'
            }`}>
              <Upload className={`mx-auto h-12 w-12 mb-4 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`} />
              <h3 className={`text-xl font-semibold mb-2 ${
                isDarkMode ? 'text-slate-100' : 'text-slate-800'
              }`}>
                Upload Your Legal Documents
              </h3>
              <p className={`mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Drag and drop files here, or click to browse
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.txt"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium cursor-pointer transition-colors shadow-sm"
              >
                <Paperclip className="w-5 h-5" />
                Choose Files
              </label>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Supported formats: PDF, DOC, DOCX, TXT (Max 10MB each)
              </p>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className={`rounded-xl p-6 transition-colors duration-300 ${
                isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border shadow-sm'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  isDarkMode ? 'text-slate-100' : 'text-slate-800'
                }`}>
                  Uploaded Documents ({uploadedFiles.length})
                </h3>
                <div className="space-y-3">
                  {uploadedFiles.map(file => (
                    <div key={file.id} className={`flex items-center justify-between p-4 rounded-lg transition-colors duration-300 ${
                      isDarkMode ? 'bg-slate-700/70' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center gap-3">
                        <FileText className={`w-8 h-8 ${
                          isDarkMode ? 'text-sky-400' : 'text-sky-600'
                        }`} />
                        <div>
                          <p className={`font-medium ${
                            isDarkMode ? 'text-slate-200' : 'text-slate-800'
                          }`}>
                            {file.name}
                          </p>
                          <p className={`text-sm ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            {(file.size / 1024 / 1024).toFixed(2)} MB • Uploaded {file.uploadedAt.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <button className={`p-2 rounded-lg transition-colors ${
                          isDarkMode ? 'hover:bg-slate-600 text-slate-300' : 'hover:bg-gray-200 text-slate-600'
                        }`}
                        aria-label="View document">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-4">
                    <button 
                      onClick={() => setActiveTab('lawyers')}
                      className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition-colors shadow-sm"
                    >
                      Find Lawyer for Review
                    </button>
                    <button 
                      onClick={() => setActiveTab('services')}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        isDarkMode 
                          ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' 
                          : 'bg-gray-200 hover:bg-gray-300 text-slate-700'
                      }`}
                    >
                      Browse Services
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Lawyers Tab */}
        {activeTab === 'lawyers' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className={`rounded-xl p-6 transition-colors duration-300 ${
              isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white shadow-sm border'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`} />
                  <input
                    type="text"
                    placeholder="Search lawyers by name or specialization..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400' 
                        : 'bg-gray-50 border-gray-200 text-slate-800 placeholder-slate-500'
                    } focus:ring-2 focus:ring-sky-500 focus:border-sky-500`}
                  />
                </div>
                
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className={`px-4 py-3 rounded-lg border transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-slate-100' 
                      : 'bg-gray-50 border-gray-200 text-slate-800'
                  } focus:ring-2 focus:ring-sky-500 focus:border-sky-500`}
                >
                  <option value="all">All Specializations</option>
                  <option value="corporate">Corporate Law</option>
                  <option value="employment">Employment Law</option>
                  <option value="intellectual">Intellectual Property</option>
                  <option value="real estate">Real Estate Law</option>
                </select>
              </div>
            </div>

            {/* Lawyers Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredLawyers.map(lawyer => (
                <div key={lawyer.id} className={`rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg ${
                  isDarkMode ? 'bg-slate-800 hover:bg-slate-750 border border-slate-700' : 'bg-white hover:shadow-xl border'
                } ${selectedLawyer?.id === lawyer.id ? 'ring-2 ring-sky-500' : ''}`}>
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={lawyer.avatar}
                        alt={lawyer.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`text-xl font-bold ${
                            isDarkMode ? 'text-slate-100' : 'text-slate-800'
                          }`}>
                            {lawyer.name}
                          </h3>
                          {lawyer.verified && (
                            <CheckCircle className="w-5 h-5 text-sky-500" />
                          )}
                        </div>
                        
                        <p className={`font-medium mb-2 ${
                          isDarkMode ? 'text-sky-400' : 'text-sky-600'
                        }`}>
                          {lawyer.specialization}
                        </p>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className={`font-medium ${
                              isDarkMode ? 'text-slate-200' : 'text-slate-800'
                            }`}>
                              {lawyer.rating}
                            </span>
                            <span className={`text-sm ${
                              isDarkMode ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                              ({lawyer.reviews} reviews)
                            </span>
                          </div>
                          
                          <div className={`text-sm ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            {lawyer.experience} years exp.
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {lawyer.badges.slice(0, 2).map(badge => (
                            <span key={badge} className={`px-2 py-1 rounded-full text-xs font-medium ${
                              isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-slate-600'
                            }`}>
                              {badge}
                            </span>
                          ))}
                        </div>

                        <p className={`text-sm mb-4 ${
                          isDarkMode ? 'text-slate-300' : 'text-slate-600'
                        }`}>
                          {lawyer.bio}
                        </p>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className={`text-2xl font-bold ${
                              isDarkMode ? 'text-green-400' : 'text-green-600'
                            }`}>
                              ${lawyer.hourlyRate}
                            </span>
                            <span className={`text-sm ${
                              isDarkMode ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                              /hour
                            </span>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLawyer(lawyer);
                                setShowChat(true);
                              }}
                              className={`p-2 rounded-lg transition-colors ${
                                isDarkMode 
                                  ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' 
                                  : 'bg-gray-100 hover:bg-gray-200 text-slate-600'
                              }`}
                              aria-label="Chat with lawyer"
                            >
                              <MessageCircle className="w-5 h-5" />
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLawyer(lawyer);
                              }}
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                selectedLawyer?.id === lawyer.id
                                  ? 'bg-sky-500 text-white'
                                  : isDarkMode
                                    ? 'bg-sky-500 hover:bg-sky-400 text-white'
                                    : 'bg-sky-500 hover:bg-sky-600 text-white'
                              }`}
                            >
                              {selectedLawyer?.id === lawyer.id ? 'Selected' : 'Select'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documentServices.map(service => {
              const Icon = service.icon;
              return (
                <div key={service.id} className={`rounded-xl p-6 transition-all duration-300 hover:shadow-lg ${
                  isDarkMode ? 'bg-slate-800 hover:bg-slate-750 border border-slate-700' : 'bg-white hover:shadow-xl border'
                } ${selectedService?.id === service.id ? 'ring-2 ring-sky-500' : ''}`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-lg ${
                      isDarkMode ? 'bg-slate-700' : 'bg-sky-50'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        isDarkMode ? 'text-sky-400' : 'text-sky-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold mb-2 ${
                        isDarkMode ? 'text-slate-100' : 'text-slate-800'
                      }`}>
                        {service.name}
                      </h3>
                      <p className={`mb-3 ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className={`text-2xl font-bold ${
                        isDarkMode ? 'text-green-400' : 'text-green-600'
                      }`}>
                        ${service.price}
                      </span>
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      <Clock className="w-4 h-4" />
                      {service.duration}
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className={`font-medium mb-2 ${
                      isDarkMode ? 'text-slate-200' : 'text-slate-700'
                    }`}>
                      Includes:
                    </h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, index) => (
                        <li key={index} className={`flex items-center gap-2 text-sm ${
                          isDarkMode ? 'text-slate-300' : 'text-slate-600'
                        }`}>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedService(service);
                      if (selectedLawyer) {
                        setShowBooking(true);
                      } else {
                        setActiveTab('lawyers');
                      }
                    }}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                      selectedService?.id === service.id
                        ? 'bg-sky-500 text-white'
                        : isDarkMode
                          ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-slate-700'
                    }`}
                  >
                    {selectedService?.id === service.id ? 'Selected' : 'Select Service'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* My Cases Tab */}
        {activeTab === 'status' && (
          <div className="space-y-6">
            {/* Active Cases */}
            <div className={`rounded-xl p-6 transition-colors duration-300 ${
              isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white shadow-sm border'
            }`}>
              <h3 className={`text-xl font-bold mb-6 ${
                isDarkMode ? 'text-slate-100' : 'text-slate-800'
              }`}>
                Active Cases
              </h3>
              
              {/* Sample Active Case */}
              <div className={`p-4 rounded-lg border mb-4 transition-colors duration-300 ${
                isDarkMode ? 'border-slate-600 bg-slate-700/70' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className={`font-semibold mb-2 ${
                      isDarkMode ? 'text-slate-100' : 'text-slate-800'
                    }`}>
                      Employment Contract Review
                    </h4>
                    <div className="flex items-center gap-4 text-sm">
                      <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                        Lawyer: Michael Chen
                      </span>
                      <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                        Started: May 20, 2025
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isDarkMode ? 'bg-amber-900/30 text-amber-300 border border-amber-700' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    In Progress
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                  <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isDarkMode 
                      ? 'bg-sky-500 hover:bg-sky-400 text-white' 
                      : 'bg-sky-500 hover:bg-sky-600 text-white'
                  }`}>
                    View Details
                  </button>
                  <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isDarkMode 
                      ? 'bg-slate-600 hover:bg-slate-500 text-slate-300' 
                      : 'bg-gray-200 hover:bg-gray-300 text-slate-700'
                  }`}>
                    Message Lawyer
                  </button>
                </div>
              </div>

              {/* No Active Cases State */}
              <div className={`text-center py-12 ${
                uploadedFiles.length === 0 ? 'block' : 'hidden'
              }`}>
                <FileText className={`mx-auto h-12 w-12 mb-4 ${
                  isDarkMode ? 'text-slate-500' : 'text-slate-400'
                }`} />
                <h4 className={`text-lg font-medium mb-2 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  No active cases yet
                </h4>
                <p className={`mb-4 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Upload documents and connect with lawyers to get started
                </p>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition-colors"
                >
                  Upload Documents
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`rounded-xl p-6 transition-colors duration-300 ${
              isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white shadow-sm border'
            }`}>
              <h3 className={`text-xl font-bold mb-6 ${
                isDarkMode ? 'text-slate-100' : 'text-slate-800'
              }`}>
                Recent Activity
              </h3>
              
              <div className="space-y-4">
                {[
                  {
                    action: "Document uploaded",
                    details: "Employment_Contract_v2.pdf",
                    time: "2 hours ago",
                    icon: Upload,
                    color: "text-green-500"
                  },
                  {
                    action: "Lawyer assigned",
                    details: "Michael Chen accepted your case",
                    time: "3 hours ago",
                    icon: User,
                    color: "text-blue-500"
                  },
                  {
                    action: "Payment processed",
                    details: "$280 for contract review service",
                    time: "1 day ago",
                    icon: DollarSign,
                    color: "text-green-500"
                  }
                ].map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${
                          isDarkMode ? 'text-slate-200' : 'text-slate-800'
                        }`}>
                          {activity.action}
                        </p>
                        <p className={`text-sm ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {activity.details}
                        </p>
                      </div>
                      <span className={`text-sm ${
                        isDarkMode ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        {activity.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Chat Modal */}
        {showChat && selectedLawyer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`rounded-xl max-w-2xl w-full h-[600px] flex flex-col shadow-xl transition-colors duration-300 ${
              isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'
            }`}>
              {/* Chat Header */}
              <div className={`p-4 border-b flex items-center justify-between transition-colors duration-300 ${
                isDarkMode ? 'border-slate-600' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <img
                    src={selectedLawyer.avatar}
                    alt={selectedLawyer.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className={`font-semibold ${
                      isDarkMode ? 'text-slate-100' : 'text-slate-800'
                    }`}>
                      {selectedLawyer.name}
                    </h3>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {selectedLawyer.specialization}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className={`p-2 rounded-lg transition-colors ${
                    isDarkMode ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-200' : 'text-slate-600 hover:bg-gray-100 hover:text-slate-800'
                  }`}
                  aria-label="Voice call">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className={`p-2 rounded-lg transition-colors ${
                    isDarkMode ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-200' : 'text-slate-600 hover:bg-gray-100 hover:text-slate-800'
                  }`}
                  aria-label="Video call">
                    <Video className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowChat(false)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-200' : 'text-slate-600 hover:bg-gray-100 hover:text-slate-800'
                    }`}
                    aria-label="Close chat"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className={`mx-auto h-12 w-12 mb-4 ${
                      isDarkMode ? 'text-slate-500' : 'text-slate-400'
                    }`} />
                    <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Start a conversation with {selectedLawyer.name}
                    </p>
                  </div>
                ) : (
                  messages.map(message => (
                    <div key={message.id} className={`flex ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-sky-500 text-white'
                          : isDarkMode
                            ? 'bg-slate-700 text-slate-200'
                            : 'bg-gray-200 text-slate-800'
                      }`}>
                        <p>{message.text}</p>
                        <p className={`text-xs mt-1 opacity-70`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div className={`p-4 border-t transition-colors duration-300 ${
                isDarkMode ? 'border-slate-600' : 'border-gray-200'
              }`}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                    className={`flex-1 px-4 py-2 rounded-lg border transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400' 
                        : 'bg-gray-50 border-gray-200 text-slate-800 placeholder-slate-500'
                    } focus:ring-2 focus:ring-sky-500 focus:border-sky-500`}
                  />
                  <button
                    onClick={sendMessage}
                    className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors shadow-sm"
                    aria-label="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Booking Modal */}
        {showBooking && <BookingModal />}

        {/* Quick Actions Floating Panel */}
        {(selectedLawyer || selectedService) && (
          <div className={`fixed bottom-6 right-6 p-4 rounded-xl shadow-lg transition-colors duration-300 ${
            isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
          }`}>
            <h4 className={`font-semibold mb-3 ${
              isDarkMode ? 'text-slate-100' : 'text-slate-800'
            }`}>
              Ready to Proceed?
            </h4>
            
            {selectedLawyer && (
              <div className={`text-sm mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Lawyer: {selectedLawyer.name}
              </div>
            )}
            
            {selectedService && (
              <div className={`text-sm mb-3 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Service: {selectedService.name}
              </div>
            )}
            
            <div className="flex gap-2">
              {selectedLawyer && selectedService ? (
                <button
                  onClick={() => setShowBooking(true)}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition-colors shadow-sm"
                >
                  Book Now
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab(selectedLawyer ? 'services' : 'lawyers')}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition-colors shadow-sm"
                >
                  {selectedLawyer ? 'Choose Service' : 'Choose Lawyer'}
                </button>
              )}
              
              <button
                onClick={() => {
                  setSelectedLawyer(null);
                  setSelectedService(null);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-slate-700'
                }`}
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Success/Error Notifications */}
        <div className="fixed top-4 right-4 space-y-2 z-40">
          {/* Success notification example */}
          {uploadedFiles.length > 0 && (
            <div className={`p-4 rounded-lg shadow-lg transition-colors duration-300 ${
              isDarkMode ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800'
            } transform transition-all duration-300`}>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Documents uploaded successfully!</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentReview;