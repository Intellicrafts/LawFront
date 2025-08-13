import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';
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
  ArrowDown,
  Loader,
  Info,
  Briefcase,
  Shield,
  Award,
  Zap,
  Clipboard,
  CheckSquare,
  FileCheck
} from "lucide-react";
import { apiServices } from "../api/apiService";

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

// Enhanced category icons
const categoryIcons = {
  GST: <FileText className="h-4 w-4" />,
  ITR: <FileSpreadsheet className="h-4 w-4" />,
  "Tax Payment": <DollarSign className="h-4 w-4" />,
  ESIC: <TrendingUp className="h-4 w-4" />,
  PF: <DollarSign className="h-4 w-4" />,
  Legal: <Briefcase className="h-4 w-4" />,
  Compliance: <Shield className="h-4 w-4" />,
  Certification: <Award className="h-4 w-4" />,
  Automation: <Zap className="h-4 w-4" />,
  Documentation: <Clipboard className="h-4 w-4" />,
  Verification: <CheckSquare className="h-4 w-4" />,
  Audit: <FileCheck className="h-4 w-4" />
};

export default function TaskAutomationComponent() {
  // Redux state
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';
  const dispatch = useDispatch();
  
  // Component state
  const [tasks, setTasks] = useState(mockTasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTaskModal, setNewTaskModal] = useState(false);
  const [editTaskModal, setEditTaskModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sortBy, setSortBy] = useState("dueDate");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState(Object.keys(categoryIcons));
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    dueDate: '',
    estimatedTime: ''
  });
  const [taskStats, setTaskStats] = useState({
    all: 0,
    completed: 0,
    in_progress: 0,
    pending: 0,
    overdue: 0
  });

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
  
  // Fetch tasks from API
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Prepare filter parameters
      const filters = {};
      if (filterStatus !== 'all') filters.status = filterStatus;
      if (filterPriority !== 'all') filters.priority = filterPriority;
      if (searchTerm) filters.search = searchTerm;
      
      // Add sorting parameters
      filters.sort_by = sortBy;
      filters.sort_order = sortOrder;
      
      // Call API
      const response = await apiServices.getTasks(filters);
      
      // Handle API response
      if (response && response.data) {
        setTasks(response.data);
        
        // Update task counts
        if (response.meta && response.meta.counts) {
          setTaskStats(response.meta.counts);
        } else {
          // Calculate counts from the data if not provided in meta
          const counts = {
            all: response.data.length,
            completed: response.data.filter(t => t.status === 'completed').length,
            in_progress: response.data.filter(t => t.status === 'in_progress').length,
            pending: response.data.filter(t => t.status === 'pending').length,
            overdue: response.data.filter(t => t.status === 'overdue').length
          };
          setTaskStats(counts);
        }
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again later.');
      
      // Fallback to mock data in case of API failure
      setTasks(mockTasks);
      
      // Calculate counts from mock data
      const counts = {
        all: mockTasks.length,
        completed: mockTasks.filter(t => t.status === 'completed').length,
        in_progress: mockTasks.filter(t => t.status === 'in_progress').length,
        pending: mockTasks.filter(t => t.status === 'pending').length,
        overdue: mockTasks.filter(t => t.status === 'overdue').length
      };
      setTaskStats(counts);
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus, filterPriority, searchTerm, sortBy, sortOrder]);
  
  // Fetch task categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await apiServices.getTaskCategories();
      if (response && response.data) {
        setCategories(response.data.map(cat => cat.name));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Keep using the default categories from categoryIcons
    }
  }, []);
  
  // Initial data loading
  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, [fetchTasks, fetchCategories]);
  
  // Refresh data
  const handleRefresh = () => {
    fetchTasks();
  };

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
  const handleCreateTask = async (taskData) => {
    setIsLoading(true);
    try {
      // Add default values
      const newTaskData = {
        ...taskData,
        progress: 0,
        assignee: "System Auto",
        status: 'pending'
      };
      
      // Call API
      const response = await apiServices.createTask(newTaskData);
      
      if (response && response.data) {
        // Add the new task to the state
        setTasks([...tasks, response.data]);
        // Update task counts
        setTaskStats({
          ...taskStats,
          all: taskStats.all + 1,
          pending: taskStats.pending + 1
        });
        // Close modal
        setNewTaskModal(false);
        // Reset form
        setNewTaskData({
          title: '',
          description: '',
          category: '',
          priority: '',
          dueDate: '',
          estimatedTime: ''
        });
      }
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Failed to create task. Please try again.');
      
      // Fallback to client-side creation if API fails
      const newTask = {
        id: tasks.length + 1,
        ...taskData,
        createdAt: new Date().toISOString().split('T')[0],
        progress: 0,
        assignee: "System Auto",
        status: 'pending'
      };
      setTasks([...tasks, newTask]);
      setNewTaskModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Update task status
  const updateTaskStatus = async (taskId, newStatus) => {
    setIsLoading(true);
    try {
      // Call API
      const response = await apiServices.updateTaskStatus(taskId, newStatus);
      
      if (response && response.data) {
        // Update task in state
        setTasks(tasks.map(task => 
          task.id === taskId 
            ? { ...response.data }
            : task
        ));
        
        // Update selected task if it's the one being updated
        if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask(response.data);
        }
        
        // Update task counts
        fetchTasks();
      }
    } catch (err) {
      console.error('Error updating task status:', err);
      alert('Failed to update task status. Please try again.');
      
      // Fallback to client-side update if API fails
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus, progress: newStatus === 'completed' ? 100 : task.progress }
          : task
      ));
    } finally {
      setIsLoading(false);
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    setIsLoading(true);
    try {
      // Call API
      await apiServices.deleteTask(taskId);
      
      // Remove task from state
      setTasks(tasks.filter(task => task.id !== taskId));
      
      // Close task detail modal if it's open
      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask(null);
      }
      
      // Update task counts
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task. Please try again.');
      
      // Fallback to client-side deletion if API fails
      setTasks(tasks.filter(task => task.id !== taskId));
      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask(null);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Edit task
  const handleEditTask = async (taskId, updatedData) => {
    setIsLoading(true);
    try {
      // Call API
      const response = await apiServices.updateTask(taskId, updatedData);
      
      if (response && response.data) {
        // Update task in state
        setTasks(tasks.map(task => 
          task.id === taskId 
            ? { ...response.data }
            : task
        ));
        
        // Update selected task if it's the one being edited
        if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask(response.data);
        }
        
        // Close edit modal
        setEditTaskModal(false);
      }
    } catch (err) {
      console.error('Error updating task:', err);
      alert('Failed to update task. Please try again.');
      
      // Fallback to client-side update if API fails
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, ...updatedData }
          : task
      ));
      setEditTaskModal(false);
    } finally {
      setIsLoading(false);
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

  // Theme classes for consistent styling
  const themeClasses = isDarkMode 
    ? 'bg-slate-900 text-slate-100' 
    : 'bg-gray-50 text-slate-800';

  const cardClasses = isDarkMode
    ? 'bg-slate-800 border-slate-700'
    : 'bg-white border-slate-200';

  const inputClasses = isDarkMode
    ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-400'
    : 'bg-white border-slate-300 text-slate-800 placeholder-slate-500';
    
  const buttonClasses = {
    primary: 'bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:from-sky-600 hover:to-sky-700',
    secondary: isDarkMode 
      ? 'border border-slate-600 text-slate-300 hover:bg-slate-700' 
      : 'border border-slate-300 text-slate-600 hover:bg-gray-50',
    danger: isDarkMode
      ? 'bg-red-600 text-white hover:bg-red-700'
      : 'bg-red-500 text-white hover:bg-red-600',
    success: isDarkMode
      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
      : 'bg-emerald-500 text-white hover:bg-emerald-600',
    warning: isDarkMode
      ? 'bg-amber-600 text-white hover:bg-amber-700'
      : 'bg-amber-500 text-white hover:bg-amber-600',
  };
  
  const iconButtonClasses = isDarkMode 
    ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-300' 
    : 'text-slate-500 hover:bg-gray-100 hover:text-slate-700';

  return (
   <div
      className={`flex flex-col h-screen transition-colors duration-300
        ${themeClasses}
        ${isFullScreen ? 'fixed inset-0 z-50' : ''}
        px-4 sm:px-6 lg:px-8 py-6
        max-w-screen-xl mx-auto
        overflow-auto
        space-y-4
      `}
    >
 
      {/* Header Component */}
     
      <div className="flex flex-1 mt-10 overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Error message if API fails */}
          {error && (
            <div className={`mb-6 p-4 rounded-xl border ${isDarkMode ? 'bg-red-900/30 border-red-800 text-red-200' : 'bg-red-50 border-red-200 text-red-800'} flex items-center`}>
              <AlertCircle className="mr-3 flex-shrink-0" size={20} />
              <p>{error}</p>
              <button 
                onClick={() => setError(null)} 
                className="ml-auto p-1 rounded-full hover:bg-red-200/20"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          )}
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                  Task Automation Dashboard
                </h2>
                <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Manage and monitor your automated compliance tasks
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-4 lg:mt-0">
                <button 
                  className={`flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 ${buttonClasses.secondary} shadow-sm`}
                  onClick={() => {
                    // Generate CSV and download
                    const headers = ['Title', 'Category', 'Status', 'Due Date', 'Priority'];
                    const csvContent = [
                      headers.join(','),
                      ...tasks.map(task => [
                        task.title,
                        task.category,
                        statusText[task.status],
                        task.dueDate,
                        task.priority
                      ].join(','))
                    ].join('\n');
                    
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.setAttribute('href', url);
                    link.setAttribute('download', 'tasks.csv');
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <Download size={16} className="mr-2" />
                  Export CSV
                </button>
                <button 
                  className={`flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 ${buttonClasses.primary} shadow-sm`}
                  onClick={() => setNewTaskModal(true)}
                >
                  <Plus size={16} className="mr-2" />
                  New Task
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {[
              { 
                title: "Total Tasks", 
                value: taskStats.all, 
                change: "+2", 
                icon: FileText, 
                color: "sky",
                bgLight: "from-sky-50 to-sky-100",
                bgDark: "from-sky-900/20 to-sky-800/20",
                borderLight: "border-sky-200",
                borderDark: "border-sky-800/50",
                textLight: "text-sky-600",
                textDark: "text-sky-400"
              },
              { 
                title: "Completed", 
                value: taskStats.completed, 
                change: "+1", 
                icon: CheckCircle, 
                color: "emerald",
                bgLight: "from-emerald-50 to-emerald-100",
                bgDark: "from-emerald-900/20 to-emerald-800/20",
                borderLight: "border-emerald-200",
                borderDark: "border-emerald-800/50",
                textLight: "text-emerald-600",
                textDark: "text-emerald-400"
              },
              { 
                title: "In Progress", 
                value: taskStats.in_progress, 
                change: "2 active", 
                icon: Clock, 
                color: "amber",
                bgLight: "from-amber-50 to-amber-100",
                bgDark: "from-amber-900/20 to-amber-800/20",
                borderLight: "border-amber-200",
                borderDark: "border-amber-800/50",
                textLight: "text-amber-600",
                textDark: "text-amber-400"
              },
              { 
                title: "Overdue", 
                value: taskStats.overdue, 
                change: "1 critical", 
                icon: AlertCircle, 
                color: "red",
                bgLight: "from-red-50 to-red-100",
                bgDark: "from-red-900/20 to-red-800/20",
                borderLight: "border-red-200",
                borderDark: "border-red-800/50",
                textLight: "text-red-600",
                textDark: "text-red-400"
              }
            ].map((stat, index) => (
              <div 
                key={index}
                className={`${cardClasses} rounded-xl p-6 border transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{stat.title}</h3>
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${
                    isDarkMode ? stat.bgDark : stat.bgLight
                  } ${
                    isDarkMode ? stat.borderDark : stat.borderLight
                  } border flex items-center justify-center shadow-sm`}>
                    <stat.icon size={22} className={isDarkMode ? stat.textDark : stat.textLight} />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className={`text-3xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                      {isLoading ? (
                        <span className="inline-block w-12 h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></span>
                      ) : (
                        stat.value
                      )}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className={`text-xs font-medium ${isDarkMode ? stat.textDark : stat.textLight}`}>
                        {stat.change}
                      </span>
                      <span className={`text-xs ml-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        this week
                      </span>
                    </div>
                  </div>
                  
                  {/* Mini progress indicator */}
                  {stat.title === "In Progress" && (
                    <div className="w-16 h-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 dark:bg-amber-500/70 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Filters and Search */}
          <div className={`${cardClasses} rounded-xl border shadow-sm p-6 mb-6 transition-colors duration-300`}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center">
                <Filter className={`mr-3 ${isDarkMode ? 'text-sky-400' : 'text-sky-500'}`} size={20} />
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                  Filter Tasks
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className="relative flex-grow max-w-md">
                  <input
                    type="text"
                    placeholder="Search tasks by title or category..."
                    className={`w-full pl-10 pr-4 py-3 text-sm border rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent ${inputClasses}`}
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // Reset to first page on search
                    }}
                  />
                  <Search className={`absolute left-3 top-3.5 h-4 w-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className={`absolute right-3 top-3.5 p-0.5 rounded-full ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'}`}
                      aria-label="Clear search"
                    >
                      <X size={14} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
                    </button>
                  )}
                </div>
                
                <div className="relative">
                  <select
                    className={`pl-4 pr-10 py-3 text-sm border rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent appearance-none ${inputClasses}`}
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e.target.value);
                      setCurrentPage(1); // Reset to first page on filter change
                    }}
                    aria-label="Filter by status"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                  </select>
                  <ChevronDown className={`absolute right-3 top-3.5 h-4 w-4 pointer-events-none ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                </div>
                
                <div className="relative">
                  <select
                    className={`pl-4 pr-10 py-3 text-sm border rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent appearance-none ${inputClasses}`}
                    value={filterPriority}
                    onChange={(e) => {
                      setFilterPriority(e.target.value);
                      setCurrentPage(1); // Reset to first page on filter change
                    }}
                    aria-label="Filter by priority"
                  >
                    <option value="all">All Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <ChevronDown className={`absolute right-3 top-3.5 h-4 w-4 pointer-events-none ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                </div>
                
                <div className="relative">
                  <select
                    className={`pl-4 pr-10 py-3 text-sm border rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent appearance-none ${inputClasses}`}
                    value={sortBy}
                    onChange={(e) => handleSort(e.target.value)}
                    aria-label="Sort by"
                  >
                    <option value="dueDate">Sort by Due Date</option>
                    <option value="title">Sort by Title</option>
                    <option value="priority">Sort by Priority</option>
                    <option value="status">Sort by Status</option>
                    <option value="createdAt">Sort by Created Date</option>
                  </select>
                  <ChevronDown className={`absolute right-3 top-3.5 h-4 w-4 pointer-events-none ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                </div>
                
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className={`p-3 border rounded-xl transition-colors ${inputClasses}`}
                  aria-label={sortOrder === 'asc' ? 'Sort ascending' : 'Sort descending'}
                  title={sortOrder === 'asc' ? 'Sort ascending' : 'Sort descending'}
                >
                  {sortOrder === 'asc' ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className={`${cardClasses} rounded-xl border overflow-hidden shadow-sm transition-colors duration-300`}>
            {isLoading && (
              <div className="absolute inset-0 bg-black/10 dark:bg-black/20 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-lg flex items-center space-x-3">
                  <Loader size={24} className="animate-spin text-sky-500" />
                  <p className="text-slate-800 dark:text-slate-200 font-medium">Loading tasks...</p>
                </div>
              </div>
            )}
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50'} transition-colors duration-300`}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      <button 
                        onClick={() => handleSort('title')}
                        className="flex items-center gap-1.5 hover:text-sky-500 transition-colors"
                        aria-label="Sort by task name"
                      >
                        <span>Task</span>
                        {sortBy === 'title' && (
                          <span className="bg-sky-100 dark:bg-sky-900/30 p-0.5 rounded">
                            {sortOrder === 'asc' ? <ArrowUp size={12} className="text-sky-500" /> : <ArrowDown size={12} className="text-sky-500" />}
                          </span>
                        )}
                      </button>
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      <button 
                        onClick={() => handleSort('category')}
                        className="flex items-center gap-1.5 hover:text-sky-500 transition-colors"
                        aria-label="Sort by category"
                      >
                        <span>Category</span>
                        {sortBy === 'category' && (
                          <span className="bg-sky-100 dark:bg-sky-900/30 p-0.5 rounded">
                            {sortOrder === 'asc' ? <ArrowUp size={12} className="text-sky-500" /> : <ArrowDown size={12} className="text-sky-500" />}
                          </span>
                        )}
                      </button>
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      <button 
                        onClick={() => handleSort('dueDate')}
                        className="flex items-center gap-1.5 hover:text-sky-500 transition-colors"
                        aria-label="Sort by due date"
                      >
                        <span>Due Date</span>
                        {sortBy === 'dueDate' && (
                          <span className="bg-sky-100 dark:bg-sky-900/30 p-0.5 rounded">
                            {sortOrder === 'asc' ? <ArrowUp size={12} className="text-sky-500" /> : <ArrowDown size={12} className="text-sky-500" />}
                          </span>
                        )}
                      </button>
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      <button 
                        onClick={() => handleSort('priority')}
                        className="flex items-center gap-1.5 hover:text-sky-500 transition-colors"
                        aria-label="Sort by priority"
                      >
                        <span>Priority</span>
                        {sortBy === 'priority' && (
                          <span className="bg-sky-100 dark:bg-sky-900/30 p-0.5 rounded">
                            {sortOrder === 'asc' ? <ArrowUp size={12} className="text-sky-500" /> : <ArrowDown size={12} className="text-sky-500" />}
                          </span>
                        )}
                      </button>
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      <button 
                        onClick={() => handleSort('progress')}
                        className="flex items-center gap-1.5 hover:text-sky-500 transition-colors"
                        aria-label="Sort by progress"
                      >
                        <span>Progress</span>
                        {sortBy === 'progress' && (
                          <span className="bg-sky-100 dark:bg-sky-900/30 p-0.5 rounded">
                            {sortOrder === 'asc' ? <ArrowUp size={12} className="text-sky-500" /> : <ArrowDown size={12} className="text-sky-500" />}
                          </span>
                        )}
                      </button>
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      <button 
                        onClick={() => handleSort('status')}
                        className="flex items-center gap-1.5 hover:text-sky-500 transition-colors"
                        aria-label="Sort by status"
                      >
                        <span>Status</span>
                        {sortBy === 'status' && (
                          <span className="bg-sky-100 dark:bg-sky-900/30 p-0.5 rounded">
                            {sortOrder === 'asc' ? <ArrowUp size={12} className="text-sky-500" /> : <ArrowDown size={12} className="text-sky-500" />}
                          </span>
                        )}
                      </button>
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
                      
                      // Calculate if task is due soon (within 3 days)
                      const dueSoon = task.status !== 'completed' && new Date(task.dueDate) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
                      
                      return (
                        <tr 
                          key={task.id}
                          onClick={() => setSelectedTask(task)}
                          className={`cursor-pointer transition-all duration-200 ${
                            isDarkMode 
                              ? 'hover:bg-slate-700/50' 
                              : 'hover:bg-sky-50/30'
                          } ${
                            task.status === 'overdue' 
                              ? isDarkMode ? 'bg-red-900/10' : 'bg-red-50/50' 
                              : ''
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div>
                                <div className={`text-sm font-medium ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                                  {task.title}
                                  {dueSoon && task.status !== 'overdue' && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                                      Due Soon
                                    </span>
                                  )}
                                </div>
                                <div className={`text-sm line-clamp-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                  {task.description}
                                </div>
                                <div className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                  <span className="inline-flex items-center">
                                    <User size={12} className="mr-1" />
                                    {task.assignee}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <span className={`flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-lg border ${
                                isDarkMode 
                                  ? 'bg-slate-800 border-slate-700 text-sky-400' 
                                  : 'bg-sky-50 border-sky-100 text-sky-600'
                              }`}>
                                {categoryIcons[task.category] || <FileText className="h-4 w-4" />}
                              </span>
                              <span className={`text-sm font-medium ml-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                {task.category}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <Calendar className={`h-4 w-4 mr-2 ${
                                task.status === 'overdue' 
                                  ? 'text-red-500' 
                                  : dueSoon 
                                    ? 'text-amber-500' 
                                    : isDarkMode ? 'text-slate-400' : 'text-slate-500'
                              }`} />
                              <span className={`text-sm ${
                                task.status === 'overdue' 
                                  ? 'text-red-500 font-medium' 
                                  : dueSoon 
                                    ? 'text-amber-500 font-medium' 
                                    : isDarkMode ? 'text-slate-300' : 'text-slate-700'
                              }`}>
                                {new Date(task.dueDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
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
                                <span className={`text-xs font-medium ${
                                  task.progress >= 80 
                                    ? isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                                    : isDarkMode ? 'text-slate-300' : 'text-slate-700'
                                }`}>
                                  {task.progress}%
                                </span>
                              </div>
                              <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                                <div 
                                  className={`h-2 rounded-full transition-all duration-500 ${
                                    task.progress < 30 
                                      ? 'bg-gradient-to-r from-red-500 to-red-600' 
                                      : task.progress < 70 
                                        ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                                        : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                                  }`}
                                  style={{ width: `${task.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${statusStyles.bg} ${statusStyles.text} ${statusStyles.border}`}>
                              <span className={`h-1.5 w-1.5 rounded-full mr-2 ${statusStyles.dot}`}></span>
                              {statusText[task.status]}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end space-x-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTask(task);
                                }}
                                className={`p-2 rounded-lg transition-colors ${iconButtonClasses}`}
                                title="View Details"
                                aria-label="View task details"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTask(task);
                                  setEditTaskModal(true);
                                }}
                                className={`p-2 rounded-lg transition-colors ${iconButtonClasses}`}
                                title="Edit Task"
                                aria-label="Edit task"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteTask(task.id);
                                }}
                                className={`p-2 rounded-lg transition-colors ${
                                  isDarkMode 
                                    ? 'text-red-400 hover:bg-red-900/30 hover:text-red-300' 
                                    : 'text-red-500 hover:bg-red-50 hover:text-red-700'
                                }`}
                                title="Delete Task"
                                aria-label="Delete task"
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
                          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                            isDarkMode 
                              ? 'bg-slate-800/80 border border-slate-700' 
                              : 'bg-sky-50 border border-sky-100'
                          }`}>
                            <FileText className={`w-8 h-8 ${
                              isDarkMode ? 'text-slate-400' : 'text-sky-400'
                            }`} />
                          </div>
                          <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            No tasks found
                          </h3>
                          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} max-w-md`}>
                            {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' 
                              ? 'Try adjusting your search or filter criteria'
                              : 'Create your first task to get started with task automation'
                            }
                          </p>
                          
                          {/* Show create button if no filters are applied */}
                          {!searchTerm && filterStatus === 'all' && filterPriority === 'all' && (
                            <button
                              onClick={() => setNewTaskModal(true)}
                              className={`mt-6 px-6 py-2.5 rounded-lg transition-all duration-200 ${buttonClasses.primary} shadow-sm flex items-center`}
                            >
                              <Plus size={16} className="mr-2" />
                              Create Task
                            </button>
                          )}
                          
                          {/* Show reset filters button if filters are applied */}
                          {(searchTerm || filterStatus !== 'all' || filterPriority !== 'all') && (
                            <button
                              onClick={() => {
                                setSearchTerm('');
                                setFilterStatus('all');
                                setFilterPriority('all');
                              }}
                              className={`mt-6 px-6 py-2.5 rounded-lg transition-all duration-200 ${buttonClasses.secondary} shadow-sm flex items-center`}
                            >
                              <RefreshCw size={16} className="mr-2" />
                              Reset Filters
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={`px-6 py-4 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                isDarkMode ? 'border-slate-700 bg-slate-800/30' : 'border-slate-200 bg-gray-50'
              }`}>
                <div className="flex items-center text-sm">
                  <span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(startIndex + itemsPerPage, sortedTasks.length)}</span> of <span className="font-medium">{sortedTasks.length}</span> results
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                      currentPage === 1 
                        ? isDarkMode ? 'border-slate-700 text-slate-500 cursor-not-allowed' : 'border-slate-300 text-slate-400 cursor-not-allowed'
                        : isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-600 hover:bg-gray-50'
                    }`}
                    aria-label="Previous page"
                  >
                    Previous
                  </button>
                  
                  {/* Show limited page numbers with ellipsis for large page counts */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Always show first and last page
                      if (page === 1 || page === totalPages) return true;
                      // Show pages around current page
                      if (Math.abs(page - currentPage) <= 1) return true;
                      return false;
                    })
                    .map((page, index, array) => {
                      // Add ellipsis if there's a gap
                      const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                      
                      return (
                        <React.Fragment key={page}>
                          {showEllipsisBefore && (
                            <span className={`px-3 py-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>...</span>
                          )}
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                              currentPage === page
                                ? 'bg-gradient-to-r from-sky-500 to-sky-600 border-sky-500 text-white shadow-sm'
                                : isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-600 hover:bg-gray-50'
                            }`}
                            aria-label={`Page ${page}`}
                            aria-current={currentPage === page ? 'page' : undefined}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      );
                    })
                  }
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                      currentPage === totalPages
                        ? isDarkMode ? 'border-slate-700 text-slate-500 cursor-not-allowed' : 'border-slate-300 text-slate-400 cursor-not-allowed'
                        : isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-600 hover:bg-gray-50'
                    }`}
                    aria-label="Next page"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div 
            className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${cardClasses} border transition-all duration-300 transform`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b bg-inherit rounded-t-2xl transition-colors duration-300 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border-slate-200 dark:border-slate-700">
              <div className="flex items-center">
                <div className={`h-10 w-10 rounded-xl mr-4 flex items-center justify-center ${
                  getStatusStyles(selectedTask.status, isDarkMode).bg
                } ${getStatusStyles(selectedTask.status, isDarkMode).border}`}>
                  {selectedTask.status === 'completed' ? (
                    <CheckCircle className={getStatusStyles(selectedTask.status, isDarkMode).text} size={20} />
                  ) : selectedTask.status === 'in_progress' ? (
                    <Clock className={getStatusStyles(selectedTask.status, isDarkMode).text} size={20} />
                  ) : selectedTask.status === 'pending' ? (
                    <Clock className={getStatusStyles(selectedTask.status, isDarkMode).text} size={20} />
                  ) : (
                    <AlertCircle className={getStatusStyles(selectedTask.status, isDarkMode).text} size={20} />
                  )}
                </div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                  Task Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className={`p-2 rounded-lg transition-colors ${iconButtonClasses}`}
                aria-label="Close details"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Task Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                    {selectedTask.title}
                  </h4>
                  <p className={`text-base mb-4 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {selectedTask.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusStyles(selectedTask.status, isDarkMode).bg} ${getStatusStyles(selectedTask.status, isDarkMode).text} ${getStatusStyles(selectedTask.status, isDarkMode).border}`}>
                      <span className={`h-2 w-2 rounded-full mr-2 ${getStatusStyles(selectedTask.status, isDarkMode).dot}`}></span>
                      {statusText[selectedTask.status]}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getPriorityStyles(selectedTask.priority, isDarkMode).bg} ${getPriorityStyles(selectedTask.priority, isDarkMode).text} ${getPriorityStyles(selectedTask.priority, isDarkMode).border}`}>
                      {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)} Priority
                    </span>
                    
                    {/* Created date badge */}
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm ${
                      isDarkMode ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      <Calendar className="h-3.5 w-3.5 mr-1.5" />
                      Created: {new Date(selectedTask.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button 
                    onClick={() => {
                      setSelectedTask(selectedTask);
                      setEditTaskModal(true);
                    }}
                    className={`p-2 rounded-lg transition-colors ${iconButtonClasses}`}
                    aria-label="Edit task"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => deleteTask(selectedTask.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'text-red-400 hover:bg-red-900/30 hover:text-red-300' 
                        : 'text-red-500 hover:bg-red-50 hover:text-red-700'
                    }`}
                    aria-label="Delete task"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Progress Section */}
              <div className={`rounded-xl p-5 border ${
                isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h5 className={`font-semibold flex items-center ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                    <TrendingUp className={`mr-2 ${isDarkMode ? 'text-sky-400' : 'text-sky-500'}`} size={18} />
                    Task Progress
                  </h5>
                  <span className={`text-2xl font-bold ${
                    selectedTask.progress >= 80 
                      ? isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                      : selectedTask.progress <= 20
                        ? isDarkMode ? 'text-red-400' : 'text-red-600'
                        : isDarkMode ? 'text-slate-100' : 'text-slate-800'
                  }`}>
                    {selectedTask.progress}%
                  </span>
                </div>
                <div className={`w-full h-3 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ease-out ${
                      selectedTask.progress < 30 
                        ? 'bg-gradient-to-r from-red-500 to-red-600' 
                        : selectedTask.progress < 70 
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                          : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                    }`}
                    style={{ width: `${selectedTask.progress}%` }}
                  ></div>
                </div>
                
                {/* Progress status text */}
                <p className={`mt-3 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {selectedTask.progress === 0 
                    ? 'Task not started yet' 
                    : selectedTask.progress < 30 
                      ? 'Task in early stages' 
                      : selectedTask.progress < 70 
                        ? 'Task in progress' 
                        : selectedTask.progress < 100 
                          ? 'Task almost complete' 
                          : 'Task completed'}
                </p>
              </div>

              {/* Task Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl border ${
                    isDarkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-white border-slate-200'
                  }`}>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Category
                    </label>
                    <div className="flex items-center">
                      <span className={`flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-lg border ${
                        isDarkMode 
                          ? 'bg-slate-800 border-slate-700 text-sky-400' 
                          : 'bg-sky-50 border-sky-100 text-sky-600'
                      }`}>
                        {categoryIcons[selectedTask.category] || <FileText className="h-4 w-4" />}
                      </span>
                      <span className={`font-medium ml-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        {selectedTask.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-xl border ${
                    isDarkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-white border-slate-200'
                  }`}>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Due Date
                    </label>
                    <div className="flex items-center">
                      <Calendar className={`h-5 w-5 mr-2 ${
                        selectedTask.status === 'overdue' 
                          ? 'text-red-500' 
                          : isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`} />
                      <span className={`${
                        selectedTask.status === 'overdue' 
                          ? 'text-red-500 font-medium' 
                          : isDarkMode ? 'text-slate-200' : 'text-slate-800'
                      }`}>
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
                  <div className={`p-4 rounded-xl border ${
                    isDarkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-white border-slate-200'
                  }`}>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Assigned To
                    </label>
                    <div className="flex items-center">
                      <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-full h-9 w-9 flex items-center justify-center mr-3 shadow-sm">
                        <User size={18} className="text-white" />
                      </div>
                      <span className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        {selectedTask.assignee}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-xl border ${
                    isDarkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-white border-slate-200'
                  }`}>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Estimated Time
                    </label>
                    <div className="flex items-center">
                      <Clock className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                      <span className={`${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        {selectedTask.estimatedTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`flex flex-col sm:flex-row gap-3 pt-4 border-t ${
                isDarkMode ? 'border-slate-700' : 'border-slate-200'
              }`}>
                <button
                  onClick={() => updateTaskStatus(selectedTask.id, 'completed')}
                  disabled={selectedTask.status === 'completed' || isLoading}
                  className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    selectedTask.status === 'completed'
                      ? isDarkMode ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : buttonClasses.success + ' hover:shadow-lg transform hover:scale-105'
                  }`}
                >
                  {isLoading ? (
                    <Loader size={18} className="animate-spin mr-2" />
                  ) : (
                    <CheckCircle size={18} className="mr-2" />
                  )}
                  Mark Complete
                </button>
                
                <button
                  onClick={() => updateTaskStatus(selectedTask.id, 'in_progress')}
                  disabled={selectedTask.status === 'in_progress' || isLoading}
                  className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    selectedTask.status === 'in_progress'
                      ? isDarkMode ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : buttonClasses.warning + ' hover:shadow-lg transform hover:scale-105'
                  }`}
                >
                  {isLoading ? (
                    <Loader size={18} className="animate-spin mr-2" />
                  ) : (
                    <Clock size={18} className="mr-2" />
                  )}
                  Start Progress
                </button>
                
                {selectedTask.status === 'overdue' && (
                  <button
                    onClick={() => updateTaskStatus(selectedTask.id, 'pending')}
                    disabled={isLoading}
                    className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${buttonClasses.secondary} hover:shadow-lg transform hover:scale-105`}
                  >
                    {isLoading ? (
                      <Loader size={18} className="animate-spin mr-2" />
                    ) : (
                      <RefreshCw size={18} className="mr-2" />
                    )}
                    Reset Status
                  </button>
                )}
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