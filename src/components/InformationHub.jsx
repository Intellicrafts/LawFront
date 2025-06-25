import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/themeSlice';
import { Search, Filter, Calendar, Clock, ExternalLink, Bell, Bookmark, Share2, Eye, ChevronRight, Tag, Building, Scale, FileText, AlertCircle, TrendingUp, Moon, Sun } from 'lucide-react';

const InformationHub = () => {
  // Use Redux theme state
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';
  const dispatch = useDispatch();
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Dummy data for legal compliance and government policies
  const dummyPosts = [
    {
      id: 1,
      title: "New Data Protection Regulations: GDPR 2024 Updates",
      summary: "Important changes to data protection laws affecting businesses processing personal information. New compliance requirements and penalties.",
      category: "Data Protection",
      type: "regulation",
      date: "2024-05-20",
      readTime: "5 min read",
      priority: "high",
      source: "European Commission",
      image: "https://www.investopedia.com/thmb/j-Te5s88JZF_96k1qCoB2RwoNtU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/general-data-protection-regulation-gdpr.asp-final-1b12e02aa4d149b9af4fcd8aec409a89.png",
      views: 1247,
      tags: ["GDPR", "Privacy", "Compliance", "EU Law"]
    },
    {
      id: 2,
      title: "Corporate Governance Guidelines: SEC New Requirements",
      summary: "The Securities and Exchange Commission introduces enhanced corporate governance standards for publicly traded companies.",
      category: "Corporate Law",
      type: "guideline",
      date: "2024-05-18",
      readTime: "8 min read",
      priority: "medium",
      source: "SEC",
      image: "https://media.licdn.com/dms/image/v2/D5612AQHKCqFSoOjfpQ/article-cover_image-shrink_720_1280/B56ZXQ2HNdGUAM-/0/1742965602828?e=2147483647&v=beta&t=lnACVbsw39lV8s44FMMlJXuHrjLOOXws4hZ796YaJPE",
      views: 892,
      tags: ["SEC", "Corporate", "Governance", "Public Companies"]
    },
    {
      id: 3,
      title: "Employment Law Changes: Remote Work Policies 2024",
      summary: "New legislation addressing remote work arrangements, employee rights, and employer obligations in the post-pandemic era.",
      category: "Employment Law",
      type: "policy",
      date: "2024-05-15",
      readTime: "6 min read",
      priority: "high",
      source: "Department of Labor",
      image: "https://boundlesshq.com/wp-content/uploads/2024/02/Legislative-updates-2024-ebook.png",
      views: 2156,
      tags: ["Employment", "Remote Work", "Labor Rights", "Policy"]
    },
    {
      id: 4,
      title: "Environmental Compliance: New ESG Reporting Standards",
      summary: "Updated environmental, social, and governance reporting requirements for corporations above certain thresholds.",
      category: "Environmental Law",
      type: "standard",
      date: "2024-05-12",
      readTime: "7 min read",
      priority: "medium",
      source: "EPA",
      image: "https://cdn.azeusconvene.com/wp-content/uploads/image-1_The-ESG-Reporting-Frameworks-and-Standards-Explained.jpg",
      views: 743,
      tags: ["ESG", "Environment", "Reporting", "Sustainability"]
    },
    {
      id: 5,
      title: "Financial Services Reform: Banking Compliance Updates",
      summary: "Comprehensive overview of new banking regulations affecting financial institutions and their compliance obligations.",
      category: "Financial Services",
      type: "reform",
      date: "2024-05-10",
      readTime: "9 min read",
      priority: "high",
      source: "Federal Reserve",
      image: "https://www.upscprep.com/content/images/size/w1200/2024/05/AA---Website-Images--10-.png",
      views: 1534,
      tags: ["Banking", "Finance", "Compliance", "Regulation"]
    },
    {
      id: 6,
      title: "Healthcare Privacy: HIPAA Amendment Analysis",
      summary: "Analysis of recent HIPAA amendments affecting healthcare providers and patient data protection requirements.",
      category: "Healthcare Law",
      type: "analysis",
      date: "2024-05-08",
      readTime: "4 min read",
      priority: "medium",
      source: "HHS",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7eAdUbbN1bpBuFRNadkCXO5kmlREy4qGbcA&s",
      views: 1089,
      tags: ["HIPAA", "Healthcare", "Privacy", "Medical Data"]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', icon: FileText, count: dummyPosts.length },
    { id: 'Data Protection', name: 'Data Protection', icon: AlertCircle, count: 1 },
    { id: 'Corporate Law', name: 'Corporate Law', icon: Building, count: 1 },
    { id: 'Employment Law', name: 'Employment Law', icon: Scale, count: 1 },
    { id: 'Environmental Law', name: 'Environmental Law', icon: TrendingUp, count: 1 },
    { id: 'Financial Services', name: 'Financial Services', icon: Building, count: 1 },
    { id: 'Healthcare Law', name: 'Healthcare Law', icon: AlertCircle, count: 1 }
  ];

  const filteredPosts = dummyPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'high' && post.priority === 'high') ||
                         (activeFilter === 'recent' && new Date(post.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesCategory && matchesFilter;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return isDarkMode ? 'text-red-400' : 'text-red-600';
      case 'medium': return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
      default: return isDarkMode ? 'text-green-400' : 'text-green-600';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'regulation': return <Scale className="w-4 h-4" />;
      case 'policy': return <FileText className="w-4 h-4" />;
      case 'guideline': return <Building className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50'
    }`}>
     <div className="max-w-7xl mx-auto px-8 sm:px-6 lg:px-8 py-8 mt-8 sm:mt-12 lg:mt-16">

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className={`text-3xl lg:text-4xl font-bold ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
                Legal Information Hub
              </h1>
              <p className={`text-lg mt-2 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Stay updated with the latest compliance requirements and government policies
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => dispatch(toggleTheme())}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-700 hover:bg-slate-600 text-yellow-300' 
                    : 'bg-white text-blue-600 hover:bg-gray-100 shadow-sm border'
                }`}
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/20' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'
              }`}>
                <Bell className="w-4 h-4" />
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className={`rounded-xl p-6 mb-8 shadow-lg transition-colors duration-300 ${
          isDarkMode ? 'bg-slate-800/90 backdrop-blur-sm border border-slate-700' : 'bg-white/90 backdrop-blur-sm shadow-sm border border-gray-200'
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-500'
              }`} />
              <input
                type="text"
                placeholder="Search articles, policies, regulations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-slate-700/80 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                    : 'bg-gray-50 border-gray-200 text-slate-800 placeholder-slate-500 focus:border-blue-500'
                } focus:ring-2 ${isDarkMode ? 'focus:ring-blue-500/20' : 'focus:ring-blue-500/20'} focus:outline-none`}
              />
            </div>

            {/* Filter by Priority */}
            <div>
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-slate-700/80 border-slate-600 text-white focus:border-blue-500' 
                    : 'bg-gray-50 border-gray-200 text-slate-800 focus:border-blue-500'
                } focus:ring-2 ${isDarkMode ? 'focus:ring-blue-500/20' : 'focus:ring-blue-500/20'} focus:outline-none`}
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="recent">Recent Updates</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-slate-700/80 border-slate-600 text-white focus:border-blue-500' 
                    : 'bg-gray-50 border-gray-200 text-slate-800 focus:border-blue-500'
                } focus:ring-2 ${isDarkMode ? 'focus:ring-blue-500/20' : 'focus:ring-blue-500/20'} focus:outline-none`}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className={`rounded-xl p-6 sticky top-8 shadow-lg transition-colors duration-300 ${
              isDarkMode ? 'bg-slate-800/90 backdrop-blur-sm border border-slate-700' : 'bg-white/90 backdrop-blur-sm shadow-sm border border-gray-200'
            }`}>
              <h3 className={`font-semibold text-lg mb-4 ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
                Categories
              </h3>
              
              <div className="space-y-2">
                {categories.map(category => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors duration-300 text-left ${
                        selectedCategory === category.id
                          ? isDarkMode 
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                            : 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                          : isDarkMode
                            ? 'hover:bg-slate-700 text-slate-300'
                            : 'hover:bg-gray-100 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        selectedCategory === category.id
                          ? 'bg-white bg-opacity-20'
                          : isDarkMode
                            ? 'bg-slate-700 text-slate-300'
                            : 'bg-gray-200 text-slate-600'
                      }`}>
                        {category.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Stats */}
              <div className={`mt-8 pt-6 border-t transition-colors duration-300 ${
                isDarkMode ? 'border-slate-700' : 'border-slate-200'
              }`}>
                <h4 className={`font-medium mb-4 ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}>
                  Quick Stats
                </h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                      Total Articles
                    </span>
                    <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      {dummyPosts.length}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                      High Priority
                    </span>
                    <span className={`font-semibold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                      {dummyPosts.filter(p => p.priority === 'high').length}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                      This Week
                    </span>
                    <span className={`font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                      3
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`text-xl font-semibold ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}>
                  {filteredPosts.length} Articles Found
                </h2>
                <p className={`text-sm ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Latest updates and compliance information
                </p>
              </div>
            </div>

            {/* Articles Grid */}
            <div className="space-y-6">
              {filteredPosts.map(post => (
                <article
                  key={post.id}
                  className={`rounded-xl overflow-hidden transition-all duration-300 shadow-lg ${
                    isDarkMode 
                      ? 'bg-slate-800/90 backdrop-blur-sm border border-slate-700 hover:shadow-xl hover:shadow-blue-900/10' 
                      : 'bg-white/90 backdrop-blur-sm border border-gray-200 hover:shadow-xl hover:shadow-blue-500/10'
                  }`}
                >
                  <div className="lg:flex">
                    {/* Image */}
                    <div className="lg:w-1/3 relative">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 lg:h-full object-cover"
                      />
                      {isDarkMode && (
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/30 to-transparent"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="lg:w-2/3 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`p-1.5 rounded-lg ${
                            isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
                          }`}>
                            {getTypeIcon(post.type)}
                          </span>
                          <span className={`text-sm font-medium capitalize ${
                            isDarkMode ? 'text-blue-400' : 'text-blue-600'
                          }`}>
                            {post.type}
                          </span>
                          <span className={`w-2 h-2 rounded-full ${getPriorityColor(post.priority)} bg-current`}></span>
                          <span className={`text-sm font-medium capitalize ${getPriorityColor(post.priority)}`}>
                            {post.priority} Priority
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button className={`p-2 rounded-lg transition-colors ${
                            isDarkMode 
                              ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-300' 
                              : 'hover:bg-gray-100 text-slate-500 hover:text-slate-600'
                          }`}
                          aria-label="Bookmark">
                            <Bookmark className="w-4 h-4" />
                          </button>
                          <button className={`p-2 rounded-lg transition-colors ${
                            isDarkMode 
                              ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-300' 
                              : 'hover:bg-gray-100 text-slate-500 hover:text-slate-600'
                          }`}
                          aria-label="Share">
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h3 className={`text-xl font-bold mb-3 line-clamp-2 ${
                        isDarkMode ? 'text-white' : 'text-slate-800'
                      }`}>
                        {post.title}
                      </h3>

                      <p className={`text-base mb-4 line-clamp-3 ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        {post.summary}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300 ${
                              isDarkMode 
                                ? 'bg-slate-700 text-blue-300 border border-slate-600' 
                                : 'bg-blue-50 text-blue-600 border border-blue-100'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            +{post.tags.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className={`flex items-center gap-1 ${
                            isDarkMode ? 'text-slate-300' : 'text-slate-500'
                          }`}>
                            <Calendar className="w-4 h-4" />
                            {new Date(post.date).toLocaleDateString()}
                          </div>
                          
                          <div className={`flex items-center gap-1 ${
                            isDarkMode ? 'text-slate-300' : 'text-slate-500'
                          }`}>
                            <Clock className="w-4 h-4" />
                            {post.readTime}
                          </div>
                          
                          <div className={`flex items-center gap-1 ${
                            isDarkMode ? 'text-slate-300' : 'text-slate-500'
                          }`}>
                            <Eye className="w-4 h-4" />
                            {post.views.toLocaleString()}
                          </div>
                          
                          <div className={`font-medium ${
                            isDarkMode ? 'text-white' : 'text-slate-600'
                          }`}>
                            {post.source}
                          </div>
                        </div>

                        <button className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                          isDarkMode 
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/20' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'
                        }`}>
                          Read More
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <button className={`px-8 py-3 rounded-lg font-medium transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600' 
                  : 'bg-white hover:bg-gray-100 text-slate-700 border border-gray-200 shadow-sm'
              }`}>
                Load More Articles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationHub;