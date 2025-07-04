
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiServices, authAPI, tokenManager } from '../../api/apiService';
import NotificationDropdown from '../NotificationDropdown';
import Avatar from '../common/Avatar';
import { 
  Home, 
  Calendar, 
  Users, 
  FileText, 
  FolderOpen, 
  Bell, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  User,
  DollarSign,
  Clock,
  TrendingUp,
  Phone,
  Mail,
  MapPin,
  Sun,
  Moon,
  Search,
  Filter,
  Plus,
  ArrowUp,
  ArrowDown,
  Activity,
  BarChart3,
  PieChart,
  Star,
  Award,
  Target,
  Briefcase,
  Sparkles,
  MoreHorizontal,
  Zap,
  Shield,
  Layers,
  Bookmark,
  Flame
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts';

// Enhanced sample data
const appointmentData = [
  { month: 'Jan', appointments: 45, revenue: 15000 },
  { month: 'Feb', appointments: 52, revenue: 18500 },
  { month: 'Mar', appointments: 48, revenue: 16800 },
  { month: 'Apr', appointments: 61, revenue: 22400 },
  { month: 'May', appointments: 55, revenue: 19800 },
  { month: 'Jun', appointments: 67, revenue: 25600 }
];

const caseTypeData = [
  { name: 'Corporate', value: 35, color: '#3B82F6' },
  { name: 'Criminal', value: 25, color: '#EF4444' },
  { name: 'Family', value: 20, color: '#10B981' },
  { name: 'Civil', value: 20, color: '#F59E0B' }
];

const performanceData = [
  { month: 'Jan', cases: 12, success: 10 },
  { month: 'Feb', cases: 15, success: 13 },
  { month: 'Mar', cases: 11, success: 9 },
  { month: 'Apr', cases: 18, success: 16 },
  { month: 'May', cases: 14, success: 12 },
  { month: 'Jun', cases: 20, success: 18 }
];

// Enhanced Navbar Component with premium styling and MeraBakil branding
const NavbarComponent = ({ 
  onMenuClick, 
  isSidebarOpen, 
  darkMode, 
  toggleDarkMode, 
  userData, 
  handleLogout,
  notifications,
  notificationsCount,
  notificationsLoading,
  notificationsError,
  notificationsDropdownOpen,
  setNotificationsDropdownOpen,
  notificationsDropdownRef,
  fetchUserNotifications,
  handleNotificationClick,
  markAllAsRead
}) => (
  <nav 
    className={`${
      darkMode 
        ? 'bg-gray-900/80 border-gray-800/80 backdrop-blur-lg' 
        : 'bg-white/90 border-gray-200/80 backdrop-blur-lg'
    } shadow-lg border-b px-4 py-3 transition-all duration-300 sticky top-0 z-30`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className={`lg:hidden p-2 rounded-xl ${
            darkMode 
              ? 'text-gray-300 hover:text-white hover:bg-gray-800/70' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
          } transition-all duration-200 focus:outline-none focus:ring-2 ${
            darkMode ? 'focus:ring-blue-600/50' : 'focus:ring-blue-500/50'
          }`}
        >
          {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg relative group overflow-hidden">
            <Briefcase size={18} className="text-white relative z-10" />
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 blur-sm opacity-0 group-hover:opacity-70 transition-opacity duration-300 -z-10"></div>
          </div>
          <h1 className={`text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
            MeraBakil
          </h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className={`hidden md:flex items-center space-x-2 ${
          darkMode 
            ? 'bg-gray-800/70 border border-gray-700/50' 
            : 'bg-gray-100/70 border border-gray-200/50'
        } rounded-xl px-4 py-2 transition-all duration-200 focus-within:ring-2 ${
          darkMode ? 'focus-within:ring-blue-600/50' : 'focus-within:ring-blue-500/50'
        }`}>
          <Search size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
          <input 
            type="text" 
            placeholder="Search cases, clients..." 
            className={`bg-transparent border-none outline-none text-sm w-48 ${
              darkMode ? 'text-gray-200 placeholder-gray-500' : 'text-gray-700 placeholder-gray-400'
            }`}
          />
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-xl ${
              darkMode 
                ? 'text-gray-300 hover:text-yellow-300 hover:bg-gray-800/70' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100/70'
            } transition-all duration-200 focus:outline-none focus:ring-2 ${
              darkMode ? 'focus:ring-blue-600/50' : 'focus:ring-blue-500/50'
            } relative overflow-hidden group`}
          >
            {darkMode ? (
              <>
                <Sun size={18} className="relative z-10" />
                <div className="absolute inset-0 bg-yellow-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              </>
            ) : (
              <>
                <Moon size={18} className="relative z-10" />
                <div className="absolute inset-0 bg-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              </>
            )}
          </button>
          
          <div ref={notificationsDropdownRef}>
            <NotificationDropdown 
              notifications={notifications}
              notificationsCount={notificationsCount}
              notificationsLoading={notificationsLoading}
              notificationsError={notificationsError}
              isOpen={notificationsDropdownOpen}
              onToggle={() => setNotificationsDropdownOpen(!notificationsDropdownOpen)}
              onMarkAllAsRead={markAllAsRead}
              onRefresh={fetchUserNotifications}
              onNotificationClick={handleNotificationClick}
              userId={userData?.id}
            />
          </div>
        </div>
        
        <div className="relative group">
          <div className={`flex items-center space-x-3 cursor-pointer ${
            darkMode 
              ? 'hover:bg-gray-800/70 border border-gray-800' 
              : 'hover:bg-gray-50/70 border border-gray-200'
          } rounded-xl p-2 transition-all duration-200`}>
            <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md relative group overflow-hidden">
              <Avatar
                src={userData?.profileImage}
                name={userData?.name || "User"}
                alt={userData?.name || "User"}
                size={36}
                className="w-full h-full rounded-xl"
              />
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            <div className="hidden md:block">
              <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {userData?.name || "User"}
              </p>
              <div className="flex items-center">
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {userData?.role || "Lawyer"}
                </p>
                {userData?.isPremium && (
                  <div className={`ml-2 flex items-center ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    <Shield size={10} className="mr-1" />
                    <span className="text-[10px] font-medium">Premium</span>
                  </div>
                )}
              </div>
            </div>
            <ChevronRight size={16} className={`hidden md:block transform group-hover:rotate-90 transition-transform duration-200 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
          
          {/* Dropdown menu */}
          <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg overflow-hidden transition-all duration-200 opacity-0 invisible transform scale-95 origin-top-right group-hover:opacity-100 group-hover:visible group-hover:scale-100 ${
            darkMode 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white border border-gray-200'
          }`}>
            <div className={`p-3 ${darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
              <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {userData?.name || "User"}
              </p>
              <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {userData?.email || ""}
              </p>
            </div>
            
            <div className="p-2">
              <a href="/profile" className={`flex items-center px-3 py-2 text-sm rounded-lg ${
                darkMode 
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}>
                <User size={16} className="mr-2" />
                Profile
              </a>
              <a href="#" className={`flex items-center px-3 py-2 text-sm rounded-lg ${
                darkMode 
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}>
                <Settings size={16} className="mr-2" />
                Settings
              </a>
              <button 
                onClick={handleLogout}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-lg ${
                  darkMode 
                    ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300' 
                    : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                }`}
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
);

// Enhanced Sidebar Component with premium styling and MeraBakil branding
const Sidebar = ({ isOpen, onClose, activeItem, setActiveItem, darkMode, userData, handleLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null, gradient: 'from-blue-500 to-blue-600', description: 'Overview of your practice' },
    { id: 'appointments', label: 'Appointments', icon: Calendar, badge: '5', gradient: 'from-green-500 to-green-600', description: 'Manage your schedule' },
    { id: 'clients', label: 'Clients', icon: Users, badge: null, gradient: 'from-purple-500 to-purple-600', description: 'Client database' },
    { id: 'cases', label: 'Cases', icon: FileText, badge: '12', gradient: 'from-orange-500 to-orange-600', description: 'Active and archived cases' },
    { id: 'documents', label: 'Documents', icon: FolderOpen, badge: null, gradient: 'from-teal-500 to-teal-600', description: 'Legal documents and files' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null, gradient: 'from-indigo-500 to-indigo-600', description: 'Performance metrics' },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: '3', gradient: 'from-red-500 to-red-600', description: 'Updates and alerts' },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null, gradient: 'from-gray-500 to-gray-600', description: 'Account preferences' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-all duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full ${
          darkMode 
            ? 'bg-gray-900/95 backdrop-blur-sm border-r border-gray-800/80' 
            : 'bg-white/95 backdrop-blur-sm border-r border-gray-200/80'
        } shadow-2xl transform transition-all duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none
        w-72
      `}>
        <div className={`p-5 border-b ${darkMode ? 'border-gray-800/80' : 'border-gray-200/80'} lg:hidden`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md relative group overflow-hidden">
                <Briefcase size={18} className="text-white relative z-10" />
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
              <h2 className={`text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>MeraBakil</h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl ${
                darkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800/70' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
              } transition-all duration-200 focus:outline-none focus:ring-2 ${
                darkMode ? 'focus:ring-blue-600/50' : 'focus:ring-blue-500/50'
              }`}
            >
              <X size={18} />
            </button>
          </div>
        </div>
        
        <div className="p-5">
          <div className={`${
            darkMode 
              ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800/30' 
              : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50'
          } rounded-xl p-4 mb-5 relative overflow-hidden group transition-all duration-300 hover:shadow-md`}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center space-x-3 relative z-10">
              <div className="w-11 h-11 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md relative overflow-hidden">
                <Sparkles size={18} className="text-white absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                <Award size={18} className="text-white group-hover:scale-0 transition-transform duration-300" />
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
              <div>
                <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Premium Plan</p>
                <div className="flex items-center">
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Valid until Dec 2025</p>
                  <div className={`ml-2 flex items-center ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    <Zap size={10} className="mr-0.5" />
                    <span className="text-[10px] font-medium">Pro</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`px-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs font-medium uppercase tracking-wider ml-2 mb-2`}>
          Main Menu
        </div>
        
        <nav className="px-3 space-y-1.5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`
                w-full flex items-center justify-between px-3 py-2.5 text-left rounded-xl transition-all duration-300 group
                ${activeItem === item.id 
                  ? `bg-gradient-to-r ${item.gradient} text-white shadow-md` 
                  : `${darkMode 
                      ? 'text-gray-300 hover:bg-gray-800/70 hover:text-white' 
                      : 'text-gray-700 hover:bg-gray-100/70 hover:text-gray-900'
                    }`
                }
                focus:outline-none ${
                  activeItem !== item.id && (darkMode 
                    ? 'focus:ring-1 focus:ring-gray-700' 
                    : 'focus:ring-1 focus:ring-gray-200')
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg transition-all duration-300 ${
                  activeItem === item.id 
                    ? 'bg-white/20' 
                    : `${darkMode 
                        ? 'bg-gray-800/70 group-hover:bg-gray-700/70' 
                        : 'bg-gray-100/70 group-hover:bg-white'
                      }`
                }`}>
                  <item.icon size={16} className={activeItem === item.id ? 'text-white' : ''} />
                </div>
                <div>
                  <span className="font-medium text-sm">{item.label}</span>
                  {activeItem === item.id && (
                    <p className="text-xs text-white/70 mt-0.5">{item.description}</p>
                  )}
                </div>
              </div>
              {item.badge && (
                <span className={`bg-gradient-to-r ${
                  activeItem === item.id 
                    ? 'from-white/30 to-white/20 text-white' 
                    : 'from-red-500 to-pink-500 text-white'
                } text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center ${
                  activeItem !== item.id ? 'animate-pulse' : ''
                } shadow-sm`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
          
          <div className={`pt-4 mt-4 border-t ${darkMode ? 'border-gray-800/80' : 'border-gray-200/80'}`}>
            <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs font-medium uppercase tracking-wider ml-2 mb-2`}>
              Account
            </div>
            <button className={`w-full flex items-center space-x-3 px-3 py-2.5 text-left rounded-xl ${
              darkMode 
                ? 'text-red-400 hover:bg-red-900/20' 
                : 'text-red-500 hover:bg-red-50/70'
            } transition-all duration-200 group focus:outline-none ${
              darkMode ? 'focus:ring-1 focus:ring-red-900/30' : 'focus:ring-1 focus:ring-red-100'
            }`}>
              <div className={`p-2 rounded-lg ${
                darkMode 
                  ? 'bg-red-900/30 group-hover:bg-red-900/40' 
                  : 'bg-red-100/70 group-hover:bg-red-100'
              } transition-all duration-200`}>
                <LogOut size={16} className={darkMode ? 'text-red-400' : 'text-red-500'} />
              </div>
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        </nav>
        
        {/* User profile section at bottom */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${
          darkMode ? 'border-gray-800/80' : 'border-gray-200/80'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md relative overflow-hidden">
              <Avatar
                src={userData?.profileImage}
                name={userData?.name || "User"}
                alt={userData?.name || "User"}
                size={40}
                className="w-full h-full rounded-xl"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {userData?.name || "User"}
              </p>
              <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {userData?.email || ""}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <button 
                onClick={onClose}
                className={`p-1.5 rounded-lg ${
                  darkMode 
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/70' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/70'
                } transition-all duration-200`}
              >
                <MoreHorizontal size={16} />
              </button>
              <button 
                onClick={handleLogout}
                className={`p-1.5 rounded-lg ${
                  darkMode 
                    ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' 
                    : 'text-red-500 hover:text-red-700 hover:bg-red-100/70'
                } transition-all duration-200`}
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Enhanced Stats Card Component with premium styling
const StatsCard = ({ stat, darkMode }) => (
  <div className={`group relative overflow-hidden rounded-2xl ${
    darkMode 
      ? 'bg-gray-800/40 border-gray-700/50 hover:bg-gray-800/60' 
      : 'bg-white/90 border-gray-200/50 hover:bg-white'
    } border shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1`}
  >
    {/* Animated gradient background on hover */}
    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
    
    {/* Decorative corner accent */}
    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-bl-full transform translate-x-1/2 -translate-y-1/2`}></div>
    
    <div className="relative p-5">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg relative group-hover:scale-105 transition-transform duration-300 overflow-hidden`}>
          <stat.icon size={22} className="text-white relative z-10" />
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </div>
        <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${
          stat.change.startsWith('+') 
            ? darkMode
              ? 'bg-green-900/30 text-green-400 border border-green-800/30' 
              : 'bg-green-50 text-green-600 border border-green-100'
            : darkMode
              ? 'bg-red-900/30 text-red-400 border border-red-800/30' 
              : 'bg-red-50 text-red-600 border border-red-100'
        } transition-all duration-300 group-hover:scale-105`}>
          {stat.change.startsWith('+') ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          <span>{stat.change}</span>
        </div>
      </div>
      <div>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1.5 group-hover:text-opacity-80 transition-colors duration-300`}>{stat.title}</p>
        <div className="flex items-end space-x-1">
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-0.5 group-hover:text-opacity-90 transition-colors duration-300`}>{stat.value}</p>
          <div className={`h-6 w-px mx-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} self-center`}></div>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} pb-1`}>vs last month</p>
        </div>
        
        {/* Progress indicator */}
        <div className="mt-3 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full bg-gradient-to-r ${stat.gradient}`} 
            style={{ 
              width: stat.change.startsWith('+') 
                ? `${Math.min(parseInt(stat.change.replace('+', '').replace('%', '')) * 2, 100)}%` 
                : '30%' 
            }}
          ></div>
        </div>
      </div>
    </div>
  </div>
);

// Enhanced Dashboard Component with premium styling
const LawyerDashboard = ({ darkMode, userData }) => {
  const stats = [
    { title: 'Active Cases', value: '24', change: '+12%', icon: FileText, gradient: 'from-blue-500 to-blue-600' },
    { title: 'Upcoming Appointments', value: '8', change: '+5%', icon: Calendar, gradient: 'from-green-500 to-green-600' },
    { title: 'Pending Documents', value: '15', change: '-8%', icon: FolderOpen, gradient: 'from-orange-500 to-orange-600' },
    { title: 'Monthly Revenue', value: '$45,230', change: '+18%', icon: DollarSign, gradient: 'from-purple-500 to-purple-600' }
  ];

  const recentAppointments = [
    { id: 1, client: 'John Anderson', type: 'Consultation', time: '2:00 PM', status: 'confirmed', avatar: 'JA' },
    { id: 2, client: 'Maria Rodriguez', type: 'Case Review', time: '3:30 PM', status: 'pending', avatar: 'MR' },
    { id: 3, client: 'David Kim', type: 'Contract Signing', time: '4:15 PM', status: 'confirmed', avatar: 'DK' },
    { id: 4, client: 'Emma Wilson', type: 'Initial Meeting', time: '5:00 PM', status: 'confirmed', avatar: 'EW' }
  ];

  const recentClients = [
    { id: 1, name: 'Robert Chen', email: 'robert.chen@email.com', phone: '+1 (555) 123-4567', case: 'Corporate Law', avatar: 'RC', rating: 5 },
    { id: 2, name: 'Lisa Thompson', email: 'lisa.t@email.com', phone: '+1 (555) 987-6543', case: 'Family Law', avatar: 'LT', rating: 4 },
    { id: 3, name: 'Michael Brown', email: 'mbrown@email.com', phone: '+1 (555) 456-7890', case: 'Criminal Defense', avatar: 'MB', rating: 5 }
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Section with premium styling */}
      <div className={`relative overflow-hidden rounded-2xl ${
        darkMode 
          ? 'bg-gradient-to-r from-gray-800 via-gray-800/95 to-gray-800 border border-gray-700/50' 
          : 'bg-gradient-to-r from-white via-white/95 to-white border border-gray-200/50'
        } p-6 shadow-lg`}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-0 right-0 w-64 h-64 rounded-full ${
            darkMode 
              ? 'bg-blue-600/5' 
              : 'bg-blue-100/50'
            } blur-3xl transform translate-x-1/3 -translate-y-1/2`}
          ></div>
          <div className={`absolute bottom-0 left-0 w-64 h-64 rounded-full ${
            darkMode 
              ? 'bg-purple-600/5' 
              : 'bg-purple-100/50'
            } blur-3xl transform -translate-x-1/3 translate-y-1/2`}
          ></div>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center">
              <div className="mr-4 p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
                <Flame size={24} className="text-white" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Welcome back, {userData?.name?.split(' ')[0] || 'Lawyer'}! 👋
                </h2>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                  Here's what's happening with your practice today.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className={`flex-1 min-w-[140px] p-3 rounded-xl ${
              darkMode 
                ? 'bg-gray-800/70 border border-gray-700/50' 
                : 'bg-white/70 border border-gray-200/50'
              } backdrop-blur-sm`}
            >
              <div className="flex items-center mb-1">
                <Target size={16} className={`mr-2 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Success Rate</p>
              </div>
              <div className="flex items-baseline">
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {userData?.success_rate || '0%'}
                </p>
                <p className={`ml-2 text-xs ${darkMode ? 'text-green-400' : 'text-green-500'}`}>
                  {userData?.success_rate_change || '+0%'}
                </p>
              </div>
            </div>
            
            <div className={`flex-1 min-w-[140px] p-3 rounded-xl ${
              darkMode 
                ? 'bg-gray-800/70 border border-gray-700/50' 
                : 'bg-white/70 border border-gray-200/50'
              } backdrop-blur-sm`}
            >
              <div className="flex items-center mb-1">
                <Layers size={16} className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Cases</p>
              </div>
              <div className="flex items-baseline">
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {userData?.cases_handled || '0'}
                </p>
                <p className={`ml-2 text-xs ${darkMode ? 'text-blue-400' : 'text-blue-500'}`}>
                  {userData?.new_cases ? `+${userData.new_cases} new` : '+0 new'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lawyer Profile Card */}
      <div className={`relative overflow-hidden rounded-2xl ${
        darkMode 
          ? 'bg-gradient-to-r from-gray-800 via-gray-800/95 to-gray-800 border border-gray-700/50' 
          : 'bg-gradient-to-r from-white via-white/95 to-white border border-gray-200/50'
        } p-6 shadow-lg`}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-0 right-0 w-64 h-64 rounded-full ${
            darkMode 
              ? 'bg-purple-600/5' 
              : 'bg-purple-100/50'
            } blur-3xl transform translate-x-1/3 -translate-y-1/2`}
          ></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <div className={`p-5 rounded-xl ${
                darkMode 
                  ? 'bg-gray-800/70 border border-gray-700/50' 
                  : 'bg-white/70 border border-gray-200/50'
                } backdrop-blur-sm`}
              >
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden mb-4">
                    <Avatar
                      src={userData?.profileImage}
                      name={userData?.name || "Lawyer"}
                      alt={userData?.name || "Lawyer"}
                      size={96}
                      className="w-full h-full rounded-xl"
                    />
                  </div>
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {userData?.name || "Lawyer"}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'} font-medium`}>
                    {userData?.role || "Lawyer"}
                  </p>
                  <div className="flex items-center mt-2">
                    <Award size={16} className={`mr-1 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {userData?.experience || "0 years"} experience
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-center">
                    <Mail size={16} className={`mr-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {userData?.email || "email@merabakil.com"}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Phone size={16} className={`mr-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {userData?.phone || "Not provided"}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className={`mr-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {userData?.location || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <div className={`p-5 rounded-xl h-full ${
                darkMode 
                  ? 'bg-gray-800/70 border border-gray-700/50' 
                  : 'bg-white/70 border border-gray-200/50'
                } backdrop-blur-sm`}
              >
                <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Professional Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Specialization
                    </h4>
                    <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {userData?.specialization || "General Law"}
                    </p>
                    
                    <h4 className={`text-sm font-medium mb-2 mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Bar Association
                    </h4>
                    <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {userData?.bar_association || "Not provided"}
                    </p>
                    
                    <h4 className={`text-sm font-medium mb-2 mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      License Number
                    </h4>
                    <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {userData?.license_number || "Not provided"}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Education
                    </h4>
                    <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {userData?.education || "Not provided"}
                    </p>
                    
                    <h4 className={`text-sm font-medium mb-2 mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Languages
                    </h4>
                    <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {userData?.languages || "Not provided"}
                    </p>
                    
                    <h4 className={`text-sm font-medium mb-2 mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Availability
                    </h4>
                    <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {userData?.availability || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <StatsCard key={index} stat={stat} darkMode={darkMode} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments & Revenue Trend */}
        <div className={`${
          darkMode 
            ? 'bg-gray-800/40 border-gray-700/50' 
            : 'bg-white/90 border-gray-200/50'
          } rounded-2xl shadow-lg border p-5 transition-all duration-300 hover:shadow-xl`}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Appointment & Revenue Trends
              </h3>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>
                Last 6 months performance
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Appointments</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Revenue</span>
              </div>
              <button className={`p-1.5 rounded-lg ${
                darkMode 
                  ? 'bg-blue-900/20 text-blue-400 hover:bg-blue-900/30' 
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                } transition-colors ml-2`}
              >
                <TrendingUp size={16} />
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={appointmentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="appointmentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={darkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(229, 231, 235, 0.8)'} 
                vertical={false}
              />
              <XAxis 
                dataKey="month" 
                stroke={darkMode ? '#9CA3AF' : '#6B7280'} 
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: darkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.8)' }}
                tickLine={false}
              />
              <YAxis 
                stroke={darkMode ? '#9CA3AF' : '#6B7280'} 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  color: darkMode ? '#F9FAFB' : '#111827',
                  padding: '12px'
                }}
                itemStyle={{
                  color: darkMode ? '#F9FAFB' : '#111827',
                  fontSize: '12px',
                  padding: '2px 0'
                }}
                labelStyle={{
                  color: darkMode ? '#D1D5DB' : '#4B5563',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  marginBottom: '6px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="appointments" 
                stroke="#3B82F6" 
                strokeWidth={2} 
                fill="url(#appointmentGradient)" 
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10B981" 
                strokeWidth={2} 
                fill="url(#revenueGradient)" 
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Case Types Distribution */}
        <div className={`${
          darkMode 
            ? 'bg-gray-800/40 border-gray-700/50' 
            : 'bg-white/90 border-gray-200/50'
          } rounded-2xl shadow-lg border p-5 transition-all duration-300 hover:shadow-xl`}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Case Types Distribution
              </h3>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>
                Current active cases by category
              </p>
            </div>
            <button className={`p-1.5 rounded-lg ${
              darkMode 
                ? 'bg-purple-900/20 text-purple-400 hover:bg-purple-900/30' 
                : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
              } transition-colors`}
            >
              <PieChart size={16} />
            </button>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center">
            <ResponsiveContainer width="100%" height={240}>
              <RechartsPieChart>
                <Pie
                  data={caseTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={55}
                  dataKey="value"
                  strokeWidth={2}
                  stroke={darkMode ? '#1F2937' : '#FFFFFF'}
                >
                  {caseTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    color: darkMode ? '#F9FAFB' : '#111827',
                    padding: '12px'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
            
            <div className="flex flex-col space-y-3 md:w-1/3">
              {caseTypeData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.name}</span>
                  <span className={`ml-auto text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <div className={`${
          darkMode 
            ? 'bg-gray-800/40 border-gray-700/50' 
            : 'bg-white/90 border-gray-200/50'
          } rounded-2xl shadow-lg border p-5 transition-all duration-300 hover:shadow-xl`}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Today's Appointments
              </h3>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>
                {recentAppointments.length} appointments scheduled
              </p>
            </div>
            <button className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl ${
              darkMode 
                ? 'bg-gradient-to-r from-blue-600/90 to-purple-600/90 hover:from-blue-600 hover:to-purple-600' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              } text-white text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200`}
            >
              <Plus size={14} />
              <span>Add New</span>
            </button>
          </div>
          <div className="space-y-3">
            {recentAppointments.map((appointment) => (
              <div 
                key={appointment.id} 
                className={`group flex items-center justify-between p-3 ${
                  darkMode 
                    ? 'bg-gray-700/30 hover:bg-gray-700/50 border border-gray-700/50' 
                    : 'bg-gray-50/70 hover:bg-gray-100/70 border border-gray-200/50'
                  } rounded-xl transition-all duration-200 cursor-pointer hover:shadow-sm`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold shadow-sm group-hover:shadow-md transition-all duration-200 relative overflow-hidden">
                    <span className="relative z-10">{appointment.avatar}</span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                  <div>
                    <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{appointment.client}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{appointment.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{appointment.time}</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    appointment.status === 'confirmed' 
                      ? darkMode
                        ? 'bg-green-900/30 text-green-400 border border-green-800/30' 
                        : 'bg-green-50 text-green-600 border border-green-100'
                      : darkMode
                        ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/30' 
                        : 'bg-yellow-50 text-yellow-600 border border-yellow-100'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <button className={`text-xs font-medium ${
              darkMode 
                ? 'text-blue-400 hover:text-blue-300' 
                : 'text-blue-600 hover:text-blue-700'
              } transition-colors`}
            >
              View All Appointments
            </button>
          </div>
        </div>

        {/* Recent Clients */}
        <div className={`${
          darkMode 
            ? 'bg-gray-800/40 border-gray-700/50' 
            : 'bg-white/90 border-gray-200/50'
          } rounded-2xl shadow-lg border p-5 transition-all duration-300 hover:shadow-xl`}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Recent Clients
              </h3>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>
                {recentClients.length} clients recently active
              </p>
            </div>
            <button className={`flex items-center space-x-1 ${
              darkMode 
                ? 'text-blue-400 hover:text-blue-300' 
                : 'text-blue-600 hover:text-blue-700'
              } transition-colors text-sm font-medium`}
            >
              <span>View All</span>
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="space-y-3">
            {recentClients.map((client) => (
              <div 
                key={client.id} 
                className={`group flex items-center justify-between p-3 ${
                  darkMode 
                    ? 'bg-gray-700/30 hover:bg-gray-700/50 border border-gray-700/50' 
                    : 'bg-gray-50/70 hover:bg-gray-100/70 border border-gray-200/50'
                  } rounded-xl transition-all duration-200 cursor-pointer hover:shadow-sm`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-semibold shadow-sm group-hover:shadow-md transition-all duration-200 relative overflow-hidden">
                    <span className="relative z-10">{client.avatar}</span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{client.name}</p>
                      <div className="flex items-center">
                        {[...Array(client.rating)].map((_, i) => (
                          <Star key={i} size={10} className="text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center mt-0.5">
                      <Bookmark size={10} className={`mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{client.case}</p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button className={`p-1.5 rounded-lg ${
                    darkMode 
                      ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 border border-gray-700/50' 
                      : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50/70 border border-gray-200/50'
                    } transition-all duration-200`}
                  >
                    <Phone size={14} />
                  </button>
                  <button className={`p-1.5 rounded-lg ${
                    darkMode 
                      ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 border border-gray-700/50' 
                      : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50/70 border border-gray-200/50'
                    } transition-all duration-200`}
                  >
                    <Mail size={14} />
                  </button>
                  <button className={`p-1.5 rounded-lg ${
                    darkMode 
                      ? 'text-gray-400 hover:text-purple-400 hover:bg-purple-900/20 border border-gray-700/50' 
                      : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50/70 border border-gray-200/50'
                    } transition-all duration-200`}
                  >
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <button className={`text-xs font-medium ${
              darkMode 
                ? 'text-blue-400 hover:text-blue-300' 
                : 'text-blue-600 hover:text-blue-700'
              } transition-colors`}
            >
              View All Clients
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Placeholder Component with premium styling
const PlaceholderComponent = ({ title, darkMode }) => (
  <div className="p-6 max-w-7xl mx-auto">
    <div className={`${
      darkMode 
        ? 'bg-gradient-to-r from-gray-800 via-gray-800/95 to-gray-800 border border-gray-700/50' 
        : 'bg-gradient-to-r from-white via-white/95 to-white border border-gray-200/50'
      } rounded-2xl shadow-lg p-8 text-center relative overflow-hidden`}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full ${
          darkMode 
            ? 'bg-blue-600/5' 
            : 'bg-blue-100/50'
          } blur-3xl transform translate-x-1/3 -translate-y-1/2`}
        ></div>
        <div className={`absolute bottom-0 left-0 w-64 h-64 rounded-full ${
          darkMode 
            ? 'bg-purple-600/5' 
            : 'bg-purple-100/50'
          } blur-3xl transform -translate-x-1/3 translate-y-1/2`}
        ></div>
      </div>
      
      <div className="relative z-10">
        <div className="inline-flex items-center justify-center p-4 mb-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
          <Sparkles size={28} className="text-white" />
        </div>
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>{title}</h2>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-md mx-auto mb-6`}>
          This section is currently in development and will be available soon. We're working hard to bring you the best experience.
        </p>
        <button className={`inline-flex items-center px-4 py-2 rounded-xl ${
          darkMode 
            ? 'bg-gradient-to-r from-blue-600/90 to-purple-600/90 hover:from-blue-600 hover:to-purple-600' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
          } text-white text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200`}
        >
          <Zap size={16} className="mr-2" />
          Get Notified When Ready
        </button>
      </div>
    </div>
  </div>
);

// Main Layout Component with its own navbar
const LawyerAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(() => {
    // Check if user has a preference stored
    const savedPreference = localStorage.getItem('darkMode');
    if (savedPreference !== null) {
      return JSON.parse(savedPreference);
    }
    // Otherwise check system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  // Add subtle animation effect for page transitions
  const [pageTransition, setPageTransition] = useState(false);
  
  // User data state
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState(null);
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);
  const notificationsDropdownRef = useRef(null);
  
  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        // First try to get from localStorage for immediate display
        const cachedUser = tokenManager.getUser();
        if (cachedUser) {
          setUserData({
            name: cachedUser.name || "User",
            email: cachedUser.email || "",
            role: cachedUser.role || "Lawyer",
            profileImage: cachedUser.avatar || cachedUser.profile_image || null,
            isPremium: cachedUser.is_premium || cachedUser.isPremium || false,
            experience: cachedUser.experience || "0 years",
            specialization: cachedUser.specialization || "General Law",
            cases_handled: cachedUser.cases_handled || 0,
            success_rate: cachedUser.success_rate || "0%",
            id: cachedUser.id,
            phone: cachedUser.phone || cachedUser.contact_number || "",
            location: cachedUser.location || cachedUser.address || "",
            bar_association: cachedUser.bar_association || "",
            license_number: cachedUser.license_number || "",
            education: cachedUser.education || "",
            languages: cachedUser.languages || "English",
            availability: cachedUser.availability || "Weekdays 9AM-5PM",
            rating: cachedUser.rating || "4.8"
          });
        }
        
        // Then fetch fresh data from API using the apiServices
        const profileData = await apiServices.getUserProfile();
        
        // Update state with fresh data
        setUserData({
          name: profileData.name || "User",
          email: profileData.email || "",
          role: profileData.role || "Lawyer",
          profileImage: profileData.avatar || profileData.profile_image || null,
          isPremium: profileData.is_premium || profileData.isPremium || false,
          experience: profileData.experience || "0 years",
          specialization: profileData.specialization || "General Law",
          cases_handled: profileData.cases_handled || 0,
          success_rate: profileData.success_rate || "0%",
          id: profileData.id,
          phone: profileData.phone || profileData.contact_number || "",
          location: profileData.location || profileData.address || "",
          bar_association: profileData.bar_association || "",
          license_number: profileData.license_number || "",
          education: profileData.education || "",
          languages: profileData.languages || "English",
          availability: profileData.availability || "Weekdays 9AM-5PM",
          rating: profileData.rating || "4.8"
        });
        
        // Update localStorage with fresh data
        tokenManager.setUser(profileData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load profile data");
        setLoading(false);
        
        // If no data in state yet, set default values
        if (!userData) {
          setUserData({
            name: "User",
            email: "",
            role: "Lawyer",
            profileImage: null,
            isPremium: false,
            experience: "0 years",
            specialization: "General Law",
            cases_handled: 0,
            success_rate: "0%",
            phone: "",
            location: "",
            bar_association: "",
            license_number: "",
            education: "",
            languages: "English",
            availability: "Weekdays 9AM-5PM",
            rating: "4.8"
          });
        }
      }
    };
    
    fetchUserProfile();
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (localStorage.getItem('darkMode') === null) {
        setDarkMode(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    
    // Apply dark mode to document for global styling
    if (darkMode) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }, [darkMode]);
  
  // Fetch notifications when user data is loaded
  useEffect(() => {
    if (userData?.id) {
      console.log('User data loaded, fetching notifications for user ID:', userData.id);
      fetchUserNotifications(userData.id);
      
      // Set up interval to refresh notifications every 60 seconds
      const intervalId = setInterval(() => {
        console.log('Refreshing notifications for user ID:', userData.id);
        fetchUserNotifications(userData.id);
      }, 60000); // 60 seconds
      
      return () => clearInterval(intervalId);
    }
  }, [userData?.id]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Handle page transitions with animation
  const handlePageChange = (itemId) => {
    setPageTransition(true);
    setTimeout(() => {
      setActiveItem(itemId);
      setPageTransition(false);
    }, 300);
    closeSidebar();
  };
  
  // Navigation hook for redirects
  const navigate = useNavigate();
  
  // Fetch user notifications
  const fetchUserNotifications = async (userId) => {
    if (!userId) return;
    
    console.log(`Fetching notifications for user ID: ${userId}`);
    setNotificationsLoading(true);
    setNotificationsError(null);
    
    try {
      // Make the API call with the provided user ID
      const response = await apiServices.getUserNotifications(userId);
      console.log('Notifications response:', response);
      
      // Process the response data
      if (response && Array.isArray(response.data)) {
        // If the API returns data in a nested 'data' property
        setNotifications(response.data);
        // Count unread notifications
        const unreadCount = response.data.filter(notification => !notification.read_at).length;
        setNotificationsCount(unreadCount);
        console.log(`Found ${response.data.length} notifications, ${unreadCount} unread`);
      } else if (response && Array.isArray(response)) {
        // If the API returns data directly as an array
        setNotifications(response);
        // Count unread notifications
        const unreadCount = response.filter(notification => !notification.read_at).length;
        setNotificationsCount(unreadCount);
        console.log(`Found ${response.length} notifications, ${unreadCount} unread`);
      } else {
        console.log('No notifications found or invalid response format:', response);
        setNotifications([]);
        setNotificationsCount(0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      
      // Detailed error logging
      if (error.response) {
        console.error('Error response:', error.response.status, error.response.data);
        setNotificationsError(`Failed to load notifications: ${error.response.status}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        setNotificationsError('Network error. Please check your connection.');
      } else {
        console.error('Error message:', error.message);
        setNotificationsError('Failed to load notifications');
      }
      
      setNotifications([]);
      setNotificationsCount(0);
    } finally {
      setNotificationsLoading(false);
    }
  };
  
  // Handle notification click
  const handleNotificationClick = async (notification) => {
    console.log('Notification clicked:', notification);
    
    if (!notification.read_at) {
      console.log(`Marking notification ${notification.id} as read`);
      
      try {
        // Use the updated endpoint for marking a notification as read
        await apiServices.markNotificationAsRead(notification.id);
        
        // Update local state to mark this notification as read
        setNotifications(prevNotifications => 
          prevNotifications.map(n => 
            n.id === notification.id ? { ...n, read_at: new Date().toISOString() } : n
          )
        );
        
        // Update unread count
        setNotificationsCount(prevCount => Math.max(0, prevCount - 1));
        console.log(`Notification ${notification.id} marked as read`);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
    
    // Handle navigation based on notification type or link
    if (notification.link) {
      // Navigate to the link
      navigate(notification.link);
    }
    
    // Close the dropdown
    setNotificationsDropdownOpen(false);
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    // Use user ID if available, otherwise use default
    const userId = userData?.id;
    
    if (!userId || notifications.length === 0) return;
    
    console.log(`Marking all notifications as read for user ID: ${userId}`);
    setNotificationsLoading(true);
    
    try {
      // Call the updated endpoint
      await apiServices.markAllNotificationsAsRead(userId);
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
      );
      
      // Reset unread count
      setNotificationsCount(0);
      console.log('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    } finally {
      setNotificationsLoading(false);
    }
  };
  
  // Handle user logout
  const handleLogout = async () => {
    try {
      // Show loading state if needed
      setLoading(true);
      
      // Call logout API
      await authAPI.logout();
      
      // Clear local storage
      tokenManager.removeToken();
      
      // Redirect to login page
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if API fails, clear local storage and redirect
      tokenManager.removeToken();
      navigate('/auth');
    }
  };

  const renderContent = () => {
    // Show loading state if user data is still loading
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Loading your dashboard...</p>
            </div>
          </div>
        </div>
      );
    }
    
    // Show error state if there was an error loading user data
    if (error) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-red-900/20' : 'bg-red-50'} border ${darkMode ? 'border-red-800' : 'border-red-200'} shadow-lg`}>
            <p className={darkMode ? 'text-red-300' : 'text-red-700'}>{error}</p>
          </div>
        </div>
      );
    }
    
    // Render the appropriate component based on the active menu item
    switch (activeItem) {
      case 'dashboard':
        return <LawyerDashboard darkMode={darkMode} userData={userData} />;
      case 'appointments':
        return <PlaceholderComponent title="Appointments" darkMode={darkMode} />;
      case 'clients':
        return <PlaceholderComponent title="Clients" darkMode={darkMode} />;
      case 'cases':
        return <PlaceholderComponent title="Cases" darkMode={darkMode} />;
      case 'documents':
        return <PlaceholderComponent title="Documents" darkMode={darkMode} />;
      case 'analytics':
        return <PlaceholderComponent title="Analytics" darkMode={darkMode} />;
      case 'notifications':
        return <PlaceholderComponent title="Notifications" darkMode={darkMode} />;
      case 'settings':
        return <PlaceholderComponent title="Settings" darkMode={darkMode} />;
      default:
        return <LawyerDashboard darkMode={darkMode} userData={userData} />;
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100'} transition-colors duration-300`}>
      {/* Background decorative elements for premium look */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br ${darkMode ? 'from-blue-900/10 to-purple-900/5' : 'from-blue-200/20 to-purple-200/10'} rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/2`}></div>
        <div className={`absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr ${darkMode ? 'from-purple-900/10 to-blue-900/5' : 'from-purple-200/20 to-blue-200/10'} rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/2`}></div>
      </div>
      
      {/* Sidebar with user data */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar}
        activeItem={activeItem}
        setActiveItem={handlePageChange}
        darkMode={darkMode}
        userData={userData}
        handleLogout={handleLogout}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Custom Navbar with user data */}
        <NavbarComponent 
          onMenuClick={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          userData={userData}
          handleLogout={handleLogout}
          notifications={notifications}
          notificationsCount={notificationsCount}
          notificationsLoading={notificationsLoading}
          notificationsError={notificationsError}
          notificationsDropdownOpen={notificationsDropdownOpen}
          setNotificationsDropdownOpen={setNotificationsDropdownOpen}
          notificationsDropdownRef={notificationsDropdownRef}
          fetchUserNotifications={fetchUserNotifications}
          handleNotificationClick={handleNotificationClick}
          markAllAsRead={markAllAsRead}
        />
        
        {/* Page Content with transition effect */}
        <main 
          className={`flex-1 overflow-y-auto ${
            darkMode 
              ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800' 
              : 'bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100'
          } transition-all duration-300 ${
            pageTransition ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default LawyerAdmin;