import React, { useState, useEffect } from "react";
import { 
  Home, 
  ChevronRight, 
  FileText, 
  User, 
  Settings, 
  Bell, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Plus,
  Search,
  BarChart2,
  PieChart,
  FileSpreadsheet,
  DollarSign,
  TrendingUp,
  Menu,
  X,
  Maximize,
  Minimize,
  Eye,
  Edit2,
  Trash2,
  HelpCircle,
  Filter,
  Download,
  Moon,
  Sun,
  ChevronDown,
  RefreshCw,
  Upload,
  ArrowUp,
  ArrowDown
} from "lucide-react";

// Mock data for task automation
const mockTasks = [
  { 
    id: 1, 
    title: "GST Filing - April 2025", 
    category: "GST", 
    status: "completed", 
    dueDate: "2025-05-15", 
    priority: "high",
    progress: 100,
    createdAt: "2025-04-10",
    description: "Monthly GST filing for business operations",
    estimatedTime: "2-3 hours",
    assignee: "System Auto"
  },
  { 
    id: 2, 
    title: "ITR Filing - FY 2024-25", 
    category: "ITR", 
    status: "in_progress", 
    dueDate: "2025-07-31", 
    priority: "high",
    progress: 65,
    createdAt: "2025-05-01",
    description: "Annual income tax return filing",
    estimatedTime: "4-5 hours",
    assignee: "Tax Team"
  },
  { 
    id: 3, 
    title: "Pay Advance Tax - Q1", 
    category: "Tax Payment", 
    status: "pending", 
    dueDate: "2025-06-15", 
    priority: "medium",
    progress: 0,
    createdAt: "2025-05-10",
    description: "Quarterly advance tax payment",
    estimatedTime: "1-2 hours",
    assignee: "Finance Team"
  },
  { 
    id: 4, 
    title: "ESIC Payment - May 2025", 
    category: "ESIC", 
    status: "in_progress", 
    dueDate: "2025-05-21", 
    priority: "medium",
    progress: 80,
    createdAt: "2025-05-02",
    description: "Monthly ESIC contribution payment",
    estimatedTime: "1 hour",
    assignee: "HR Team"
  },
  { 
    id: 5, 
    title: "PF Challan Payment", 
    category: "PF", 
    status: "overdue", 
    dueDate: "2025-05-20", 
    priority: "high",
    progress: 15,
    createdAt: "2025-05-05",
    description: "Monthly provident fund payment",
    estimatedTime: "1 hour",
    assignee: "HR Team"
  }
];

// Status colors for light and dark modes
const getStatusStyles = (status, isDark) => {
  const styles = {
    completed: {
      bg: isDark ? 'bg-emerald-900/30' : 'bg-emerald-50',
      text: isDark ? 'text-emerald-300' : 'text-emerald-700',
      dot: isDark ? 'bg-emerald-400' : 'bg-emerald-500',
      border: isDark ? 'border-emerald-700' : 'border-emerald-200'
    },
    in_progress: {
      bg: isDark ? 'bg-amber-900/30' : 'bg-amber-50',
      text: isDark ? 'text-amber-300' : 'text-amber-700',
      dot: isDark ? 'bg-amber-400' : 'bg-amber-500',
      border: isDark ? 'border-amber-700' : 'border-amber-200'
    },
    pending: {
      bg: isDark ? 'bg-sky-900/30' : 'bg-sky-50',
      text: isDark ? 'text-sky-300' : 'text-sky-700',
      dot: isDark ? 'bg-sky-400' : 'bg-sky-500',
      border: isDark ? 'border-sky-700' : 'border-sky-200'
    },
    overdue: {
      bg: isDark ? 'bg-red-900/30' : 'bg-red-50',
      text: isDark ? 'text-red-300' : 'text-red-700',
      dot: isDark ? 'bg-red-400' : 'bg-red-500',
      border: isDark ? 'border-red-700' : 'border-red-200'
    }
  };
  return styles[status] || styles.pending;
};

// Priority colors
const getPriorityStyles = (priority, isDark) => {
  const styles = {
    high: {
      bg: isDark ? 'bg-red-900/30' : 'bg-red-50',
      text: isDark ? 'text-red-300' : 'text-red-700',
      border: isDark ? 'border-red-700' : 'border-red-200'
    },
    medium: {
      bg: isDark ? 'bg-amber-900/30' : 'bg-amber-50',
      text: isDark ? 'text-amber-300' : 'text-amber-700',
      border: isDark ? 'border-amber-700' : 'border-amber-200'
    },
    low: {
      bg: isDark ? 'bg-gray-800' : 'bg-gray-100',
      text: isDark ? 'text-gray-300' : 'text-gray-600',
      border: isDark ? 'border-gray-600' : 'border-gray-300'
    }
  };
  return styles[priority] || styles.medium;
};

// Status display text
const statusText = {
  completed: "Completed",
  in_progress: "In Progress",
  pending: "Pending",
  overdue: "Overdue"
};

// Category icons
const categoryIcons = {
  GST: <FileText className="h-4 w-4" />,
  ITR: <FileSpreadsheet className="h-4 w-4" />,
  "Tax Payment": <DollarSign className="h-4 w-4" />,
  ESIC: <TrendingUp className="h-4 w-4" />,
  PF: <DollarSign className="h-4 w-4" />
};

export default function TaskAutomationComponent() {
  const [tasks, setTasks] = useState(mockTasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTaskModal, setNewTaskModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sortBy, setSortBy] = useState("dueDate");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Check if screen is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Filter and sort tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'dueDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTasks = sortedTasks.slice(startIndex, startIndex + itemsPerPage);

  // Task counts
  const taskCounts = {
    all: tasks.length,
    completed: tasks.filter(t => t.status === "completed").length,
    in_progress: tasks.filter(t => t.status === "in_progress").length,
    pending: tasks.filter(t => t.status === "pending").length,
    overdue: tasks.filter(t => t.status === "overdue").length
  };

  // Create a new task
  const handleCreateTask = (newTaskData) => {
    const newTask = {
      id: tasks.length + 1,
      ...newTaskData,
      createdAt: new Date().toISOString().split('T')[0],
      progress: 0,
      assignee: "System Auto"
    };
    setTasks([...tasks, newTask]);
    setNewTaskModal(false);
  };

  // Update task status
  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus, progress: newStatus === 'completed' ? 100 : task.progress }
        : task
    ));
  };

  // Delete task
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(null);
    }
  };

  // Toggle fullscreen mode
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Handle sort
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const themeClasses = isDarkMode 
    ? 'bg-slate-900 text-slate-100' 
    : 'bg-gray-50 text-slate-800';

  const cardClasses = isDarkMode
    ? 'bg-slate-800 border-slate-700'
    : 'bg-white border-slate-200';

  const inputClasses = isDarkMode
    ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-400'
    : 'bg-white border-slate-300 text-slate-800 placeholder-slate-500';

  return (
   <div
      className={`flex flex-col h-screen transition-colors duration-300
        ${themeClasses}
        ${isFullScreen ? 'fixed inset-0 z-50' : ''}
        px-16 sm:px-6 lg:px-8 py-6
        max-w-screen-xl mx-auto
        overflow-auto
        space-y-4
      `}
    >
 
      {/* Header Component */}
      <header className={`${cardClasses} border-b shadow-sm transition-colors duration-300`}>
        <div className="flex items-center justify-between px-4 lg:px-6 py-3">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`rounded-lg p-2 transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-300' : 'text-slate-500 hover:bg-gray-100 hover:text-slate-700'}`}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                <BarChart2 size={18} className="text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent">
                TaskFlow Pro
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`rounded-lg p-2 transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-300' : 'text-slate-500 hover:bg-gray-100 hover:text-slate-700'}`}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              onClick={toggleFullScreen}
              className={`rounded-lg p-2 transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-300' : 'text-slate-500 hover:bg-gray-100 hover:text-slate-700'}`}
            >
              {isFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
            <button className={`rounded-lg p-2 transition-colors relative ${isDarkMode ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-300' : 'text-slate-500 hover:bg-gray-100 hover:text-slate-700'}`}>
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
            </button>
            <button className={`rounded-lg p-2 transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-300' : 'text-slate-500 hover:bg-gray-100 hover:text-slate-700'}`}>
              <HelpCircle size={18} />
            </button>
            <div className="flex items-center space-x-3 pl-3 border-l border-slate-300 dark:border-slate-600">
              <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-full h-8 w-8 flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="hidden md:block">
                <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>John Doe</p>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
              <div>
                <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                  Task Automation Dashboard
                </h2>
                <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Manage and monitor your automated compliance tasks
                </p>
              </div>
              <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                <button className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-600 hover:bg-gray-50'}`}>
                  <Download size={16} className="mr-2" />
                  Export
                </button>
                <button className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-600 hover:bg-gray-50'}`}>
                  <RefreshCw size={16} className="mr-2" />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {[
              { title: "Total Tasks", value: taskCounts.all, change: "+2", icon: FileText, color: "sky" },
              { title: "Completed", value: taskCounts.completed, change: "+1", icon: CheckCircle, color: "emerald" },
              { title: "In Progress", value: taskCounts.in_progress, change: "2 active", icon: Clock, color: "amber" },
              { title: "Overdue", value: taskCounts.overdue, change: "1 critical", icon: AlertCircle, color: "red" }
            ].map((stat, index) => (
              <div 
                key={index}
                className={`${cardClasses} rounded-xl p-6 border transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{stat.title}</h3>
                  <div className={`h-10 w-10 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center`}>
                    <stat.icon size={20} className={`text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{stat.value}</p>
                    <div className="flex items-center mt-1">
                      <span className={`text-xs font-medium text-${stat.color}-600 dark:text-${stat.color}-400`}>{stat.change}</span>
                      <span className={`text-xs ml-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>this week</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters and Search */}
          <div className={`${cardClasses} rounded-xl border p-6 mb-6 transition-colors duration-300`}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Task Management</h3>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    className={`w-full sm:w-64 pl-10 pr-4 py-2.5 text-sm border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent ${inputClasses}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className={`absolute left-3 top-3 h-4 w-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                </div>
                
                <select
                  className={`px-4 py-2.5 text-sm border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent ${inputClasses}`}
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                </select>
                
                <select
                  className={`px-4 py-2.5 text-sm border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent ${inputClasses}`}
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                >
                  <option value="all">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                
                <button
                  className="flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-sky-500 to-sky-600 rounded-lg hover:from-sky-600 hover:to-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200 transform hover:scale-105"
                  onClick={() => setNewTaskModal(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </button>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className={`${cardClasses} rounded-xl border overflow-hidden transition-colors duration-300`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50'} transition-colors duration-300`}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      <button 
                        onClick={() => handleSort('title')}
                        className="flex items-center space-x-1 hover:text-sky-500 transition-colors"
                      >
                        <span>Task</span>
                        {sortBy === 'title' && (sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                      </button>
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      Category
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      <button 
                        onClick={() => handleSort('dueDate')}
                        className="flex items-center space-x-1 hover:text-sky-500 transition-colors"
                      >
                        <span>Due Date</span>
                        {sortBy === 'dueDate' && (sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                      </button>
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      Priority
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      Progress
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      Status
                    </th>
                    <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-200'} transition-colors duration-300`}>
                  {paginatedTasks.length > 0 ? (
                    paginatedTasks.map((task) => {
                      const statusStyles = getStatusStyles(task.status, isDarkMode);
                      const priorityStyles = getPriorityStyles(task.priority, isDarkMode);
                      
                      return (
                        <tr 
                          key={task.id}
                          onClick={() => setSelectedTask(task)}
                          className={`cursor-pointer transition-colors hover:${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className={`text-sm font-medium ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                                  {task.title}
                                </div>
                                <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                  {task.description}
                                </div>
                                <div className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                  Assigned to: {task.assignee}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <span className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 mr-3">
                                {categoryIcons[task.category]}
                              </span>
                              <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                {task.category}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <Calendar className={`h-4 w-4 mr-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                              <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${priorityStyles.bg} ${priorityStyles.text} ${priorityStyles.border}`}>
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="w-full">
                              <div className="flex items-center justify-between mb-1">
                                <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                  {task.progress}%
                                </span>
                              </div>
                              <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                                <div 
                                  className="h-2 rounded-full bg-gradient-to-r from-sky-500 to-sky-600 transition-all duration-300" 
                                  style={{ width: `${task.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </td><td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${statusStyles.bg} ${statusStyles.text} ${statusStyles.border}`}>
                              <span className={`h-1.5 w-1.5 rounded-full mr-2 ${statusStyles.dot}`}></span>
                              {statusText[task.status]}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTask(task);
                                }}
                                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-300' : 'text-slate-500 hover:bg-gray-100 hover:text-slate-700'}`}
                                title="View Details"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Handle edit task
                                }}
                                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-300' : 'text-slate-500 hover:bg-gray-100 hover:text-slate-700'}`}
                                title="Edit Task"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteTask(task.id);
                                }}
                                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-red-400 hover:bg-red-900/30 hover:text-red-300' : 'text-red-500 hover:bg-red-50 hover:text-red-700'}`}
                                title="Delete Task"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
                            <FileText className={`w-6 h-6 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`} />
                          </div>
                          <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            No tasks found
                          </h3>
                          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            Try adjusting your search or filter criteria
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={`px-6 py-4 border-t flex items-center justify-between ${isDarkMode ? 'border-slate-700 bg-slate-800/30' : 'border-slate-200 bg-gray-50'}`}>
                <div className="flex items-center text-sm">
                  <span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedTasks.length)} of {sortedTasks.length} results
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                      currentPage === 1 
                        ? isDarkMode ? 'border-slate-700 text-slate-500 cursor-not-allowed' : 'border-slate-300 text-slate-400 cursor-not-allowed'
                        : isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-600 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                        currentPage === page
                          ? 'bg-sky-500 border-sky-500 text-white'
                          : isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-600 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                      currentPage === totalPages
                        ? isDarkMode ? 'border-slate-700 text-slate-500 cursor-not-allowed' : 'border-slate-300 text-slate-400 cursor-not-allowed'
                        : isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-600 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm border-2 border-red-500">

          <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${cardClasses} border`}>
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-inherit rounded-t-2xl">
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                Task Details
              </h3>
              <button
                onClick={() => setSelectedTask(null)}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-300' : 'text-slate-500 hover:bg-gray-100 hover:text-slate-700'}`}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Task Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                    {selectedTask.title}
                  </h4>
                  <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {selectedTask.description}
                  </p>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusStyles(selectedTask.status, isDarkMode).bg} ${getStatusStyles(selectedTask.status, isDarkMode).text} ${getStatusStyles(selectedTask.status, isDarkMode).border}`}>
                      <span className={`h-2 w-2 rounded-full mr-2 ${getStatusStyles(selectedTask.status, isDarkMode).dot}`}></span>
                      {statusText[selectedTask.status]}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getPriorityStyles(selectedTask.priority, isDarkMode).bg} ${getPriorityStyles(selectedTask.priority, isDarkMode).text} ${getPriorityStyles(selectedTask.priority, isDarkMode).border}`}>
                      {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)} Priority
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-300' : 'text-slate-500 hover:bg-gray-100 hover:text-slate-700'}`}>
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => deleteTask(selectedTask.id)}
                    className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-red-400 hover:bg-red-900/30 hover:text-red-300' : 'text-red-500 hover:bg-red-50 hover:text-red-700'}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Progress Section */}
              <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-3">
                  <h5 className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Progress</h5>
                  <span className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                    {selectedTask.progress}%
                  </span>
                </div>
                <div className={`w-full h-3 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                  <div 
                    className="h-3 rounded-full bg-gradient-to-r from-sky-400 to-sky-600 transition-all duration-500 ease-out" 
                    style={{ width: `${selectedTask.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Task Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Category
                    </label>
                    <div className="flex items-center">
                      <span className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 mr-3">
                        {categoryIcons[selectedTask.category]}
                      </span>
                      <span className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        {selectedTask.category}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Due Date
                    </label>
                    <div className="flex items-center">
                      <Calendar className={`h-4 w-4 mr-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                      <span className={`${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        {new Date(selectedTask.dueDate).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Assigned To
                    </label>
                    <div className="flex items-center">
                      <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-full h-8 w-8 flex items-center justify-center mr-3">
                        <User size={16} className="text-white" />
                      </div>
                      <span className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        {selectedTask.assignee}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Estimated Time
                    </label>
                    <div className="flex items-center">
                      <Clock className={`h-4 w-4 mr-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                      <span className={`${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        {selectedTask.estimatedTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => updateTaskStatus(selectedTask.id, 'completed')}
                  disabled={selectedTask.status === 'completed'}
                  className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    selectedTask.status === 'completed'
                      ? isDarkMode ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg transform hover:scale-105'
                  }`}
                >
                  <CheckCircle size={18} className="mr-2" />
                  Mark Complete
                </button>
                
                <button
                  onClick={() => updateTaskStatus(selectedTask.id, 'in_progress')}
                  disabled={selectedTask.status === 'in_progress'}
                  className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    selectedTask.status === 'in_progress'
                      ? isDarkMode ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : isDarkMode ? 'bg-amber-600 text-white hover:bg-amber-700 hover:shadow-lg transform hover:scale-105' : 'bg-amber-500 text-white hover:bg-amber-600 hover:shadow-lg transform hover:scale-105'
                  }`}
                >
                  <Clock size={18} className="mr-2" />
                  Start Progress
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {newTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${cardClasses} border`}>
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-inherit rounded-t-2xl">
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                Create New Task
              </h3>
              <button
                onClick={() => setNewTaskModal(false)}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-300' : 'text-slate-500 hover:bg-gray-100 hover:text-slate-700'}`}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Task Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent ${inputClasses}`}
                  placeholder="Enter task title..."
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Description
                </label>
                <textarea
                  name="description"
                  rows="3"
                  className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none ${inputClasses}`}
                  placeholder="Enter task description..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Category *
                  </label>
                  <select
                    name="category"
                    required
                    className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent ${inputClasses}`}
                  >
                    <option value="">Select category</option>
                    <option value="GST">GST</option>
                    <option value="ITR">ITR</option>
                    <option value="Tax Payment">Tax Payment</option>
                    <option value="ESIC">ESIC</option>
                    <option value="PF">PF</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Priority *
                  </label>
                  <select
                    name="priority"
                    required
                    className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent ${inputClasses}`}
                  >
                    <option value="">Select priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Due Date *
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    required
                    className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent ${inputClasses}`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Estimated Time
                  </label>
                  <input
                    type="text"
                    name="estimatedTime"
                    className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent ${inputClasses}`}
                    placeholder="e.g., 2-3 hours"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setNewTaskModal(false)}
                  className={`flex-1 px-4 py-3 border rounded-lg font-medium transition-colors ${isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-600 hover:bg-gray-50'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Get form values
                    const title = document.querySelector('input[name="title"]').value;
                    const description = document.querySelector('textarea[name="description"]').value;
                    const category = document.querySelector('select[name="category"]').value;
                    const priority = document.querySelector('select[name="priority"]').value;
                    const dueDate = document.querySelector('input[name="dueDate"]').value;
                    const estimatedTime = document.querySelector('input[name="estimatedTime"]').value;
                    
                    if (!title || !category || !priority || !dueDate) {
                      alert('Please fill in all required fields');
                      return;
                    }
                    
                    const newTaskData = {
                      title,
                      description,
                      category,
                      priority,
                      dueDate,
                      estimatedTime: estimatedTime || '1-2 hours',
                      status: 'pending'
                    };
                    handleCreateTask(newTaskData);
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-lg font-medium hover:from-sky-600 hover:to-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200 transform hover:scale-105"
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}