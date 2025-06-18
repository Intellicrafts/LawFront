
import React, { useState } from 'react';
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
  Briefcase
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

// Enhanced Navbar Component
const NavbarComponent = ({ onMenuClick, isSidebarOpen, darkMode, toggleDarkMode }) => (
  <nav className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} shadow-lg border-b px-4 py-3 transition-all duration-300`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className={`lg:hidden p-2 rounded-xl ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} transition-all duration-200`}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Briefcase size={20} className="text-white" />
          </div>
          <h1 className={`text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
            LegalFlow
          </h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="hidden md:flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-2">
          <Search size={16} className="text-gray-500" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none text-sm w-40"
          />
        </div>
        
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-xl ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} transition-all duration-200`}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <button className={`relative p-2 ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} rounded-xl transition-all duration-200`}>
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">3</span>
        </button>
        
        <div className={`flex items-center space-x-3 cursor-pointer ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} rounded-xl p-2 transition-all duration-200`}>
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div className="hidden md:block">
            <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Sarah Johnson</p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Senior Partner</p>
          </div>
        </div>
      </div>
    </div>
  </nav>
);

// Enhanced Sidebar Component
const Sidebar = ({ isOpen, onClose, activeItem, setActiveItem, darkMode }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null, gradient: 'from-blue-500 to-blue-600' },
    { id: 'appointments', label: 'Appointments', icon: Calendar, badge: '5', gradient: 'from-green-500 to-green-600' },
    { id: 'clients', label: 'Clients', icon: Users, badge: null, gradient: 'from-purple-500 to-purple-600' },
    { id: 'cases', label: 'Cases', icon: FileText, badge: '12', gradient: 'from-orange-500 to-orange-600' },
    { id: 'documents', label: 'Documents', icon: FolderOpen, badge: null, gradient: 'from-teal-500 to-teal-600' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null, gradient: 'from-indigo-500 to-indigo-600' },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: '3', gradient: 'from-red-500 to-red-600' },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null, gradient: 'from-gray-500 to-gray-600' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-2xl transform transition-all duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none lg:border-r ${darkMode ? 'lg:border-gray-700' : 'lg:border-gray-200'}
        w-72
      `}>
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} lg:hidden`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Briefcase size={20} className="text-white" />
              </div>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>LegalFlow</h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} transition-all duration-200`}
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className={`${darkMode ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'} rounded-2xl p-4 border mb-6`}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Award size={20} className="text-white" />
              </div>
              <div>
                <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Premium Plan</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Valid until Dec 2025</p>
              </div>
            </div>
          </div>
        </div>
        
        <nav className="px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveItem(item.id);
                onClose();
              }}
              className={`
                w-full flex items-center justify-between px-4 py-3 text-left rounded-2xl transition-all duration-300 group
                ${activeItem === item.id 
                  ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg transform scale-105` 
                  : `${darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-xl transition-all duration-300 ${
                  activeItem === item.id 
                    ? 'bg-white/20' 
                    : `${darkMode ? 'bg-gray-800 group-hover:bg-gray-700' : 'bg-gray-100 group-hover:bg-white'}`
                }`}>
                  <item.icon size={18} className={activeItem === item.id ? 'text-white' : ''} />
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
          
          <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
            <button className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group`}>
              <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30 group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-all duration-200">
                <LogOut size={18} className="text-red-500" />
              </div>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

// Enhanced Stats Card Component
const StatsCard = ({ stat, darkMode }) => (
  <div className={`group relative overflow-hidden rounded-3xl ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} border shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2`}>
    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
    <div className="relative p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
          <stat.icon size={28} className="text-white" />
        </div>
        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
          stat.change.startsWith('+') 
            ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
            : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {stat.change.startsWith('+') ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
          <span>{stat.change}</span>
        </div>
      </div>
      <div>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{stat.title}</p>
        <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>{stat.value}</p>
        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>from last month</p>
      </div>
    </div>
  </div>
);

// Enhanced Dashboard Component
const LawyerDashboard = ({ darkMode }) => {
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
      {/* Welcome Section */}
      {/* <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 p-8 text-white`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Welcome back, Sarah! 👋</h2>
              <p className="text-blue-100 text-lg">Here's what's happening with your practice today.</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-center">
                <p className="text-2xl font-bold">92%</p>
                <p className="text-sm text-blue-200">Success Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-blue-200">Total Cases</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div> */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} stat={stat} darkMode={darkMode} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Appointments & Revenue Trend */}
        <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} rounded-3xl shadow-xl border p-8`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Appointment & Revenue Trends</h3>
            <button className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
              <TrendingUp size={18} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={appointmentData}>
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
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
              <XAxis dataKey="month" stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
              <YAxis stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area type="monotone" dataKey="appointments" stroke="#3B82F6" strokeWidth={3} fill="url(#appointmentGradient)" />
              <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fill="url(#revenueGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Case Types Distribution */}
        <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} rounded-3xl shadow-xl border p-8`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Case Types Distribution</h3>
            <button className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
              <PieChart size={18} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <RechartsPieChart>
              <Pie
                data={caseTypeData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={false}
              >
                {caseTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Appointments */}
        <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} rounded-3xl shadow-xl border p-8`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Today's Appointments</h3>
            <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-200">
              <Plus size={16} />
              <span className="text-sm font-medium">Add New</span>
            </button>
          </div>
          <div className="space-y-4">
            {recentAppointments.map((appointment) => (
              <div key={appointment.id} className={`group flex items-center justify-between p-4 ${darkMode ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100'} rounded-2xl transition-all duration-200 cursor-pointer`}>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-semibold">
                    {appointment.avatar}
                  </div>
                  <div>
                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{appointment.client}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{appointment.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{appointment.time}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    appointment.status === 'confirmed' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Clients */}
        <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} rounded-3xl shadow-xl border p-8`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Clients</h3>
            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
              <span className="text-sm">View All</span>
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {recentClients.map((client) => (
              <div key={client.id} className={`group flex items-center justify-between p-4 ${darkMode ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100'} rounded-2xl transition-all duration-200 cursor-pointer`}>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white font-semibold">
                    {client.avatar}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{client.name}</p>
                      <div className="flex items-center">
                        {[...Array(client.rating)].map((_, i) => (
                          <Star key={i} size={12} className="text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{client.case}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className={`p-2 ${darkMode ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'} rounded-xl transition-all duration-200`}>
                    <Phone size={16} />
                  </button>
                  <button className={`p-2 ${darkMode ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'} rounded-xl transition-all duration-200`}>
                    <Mail size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PlaceholderComponent = ({ title, darkMode }) => (
  <div className="p-6">
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-8 text-center`}>
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>{title}</h2>
      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>This section is coming soon...</p>
    </div>
  </div>
);

// Main Layout Component
const LawyerAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return <LawyerDashboard darkMode={darkMode} />;
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
        return <LawyerDashboard darkMode={darkMode} />;
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        darkMode={darkMode}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <NavbarComponent 
          onMenuClick={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        
        {/* Page Content */}
        <main className={`flex-1 overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default LawyerAdmin;