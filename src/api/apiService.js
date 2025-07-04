// apiService.js - Centralized API configuration

import axios from 'axios';

/**
 * Environment Configuration
 * 
 * This setup allows switching between local and production environments:
 * 
 * 1. Production API: Uses REACT_APP_PROD_API_URL from .env.production
 *    - Default: https://chambersapi.logicera.in/api
 * 
 * 2. Local API: Uses REACT_APP_LOCAL_API_URL from .env.local
 *    - Default: http://127.0.0.1:8000/api
 * 
 * 3. Environment Selection: Uses REACT_APP_USE_PRODUCTION
 *    - When set to "true" - uses production API
 *    - When set to "false" or not set - uses local API
 * 
 * To switch environments:
 * - For local development: Set REACT_APP_USE_PRODUCTION=false in .env.local
 * - For production build: Set REACT_APP_USE_PRODUCTION=true in .env.production
 */

// Determine which environment to use
const useProduction = process.env.REACT_APP_USE_PRODUCTION === 'true';

// Get the appropriate base URL based on environment
const getBaseUrl = () => {
  if (useProduction) {
    return process.env.REACT_APP_PROD_API_URL || 'https://chambersapi.logicera.in/api';
  } else {
    return process.env.REACT_APP_LOCAL_API_URL || 'http://127.0.0.1:8000/api';
  }
};

// Get the base domain for cookies
const getBaseDomain = () => {
  if (useProduction) {
    return 'chambersapi.logicera.in';
  } else {
    return 'localhost';
  }
};

// Log which environment is being used (helpful for debugging)
console.log(`API Service using ${useProduction ? 'PRODUCTION' : 'LOCAL'} environment: ${getBaseUrl()}`);

// Create axios instance with environment-aware configuration
const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000, // Increased timeout for slower connections
  withCredentials: true, // Important for CSRF cookie handling
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add a timestamp to prevent caching issues
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized - token expired
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      // Optionally redirect to login
      // window.location.href = '/auth';
      console.warn('Authentication token expired or invalid. Please log in again.');
    }
    
    // Handle 419 CSRF token mismatch
    if (error.response?.status === 419) {
      console.warn('CSRF token mismatch. Refreshing CSRF token...');
      // Attempt to get a new CSRF token
      return axios.get(`${getBaseUrl().replace('/api', '')}/sanctum/csrf-cookie`, { 
        withCredentials: true 
      })
      .then(() => {
        // Retry the original request
        return apiClient(error.config);
      });
    }

    // Handle network errors with more detailed message
    if (!error.response) {
      error.message = 'Network error. Please check your internet connection and try again.';
      console.error('Network error details:', error);
    }

    return Promise.reject(error);
  }
);

/**
 * Lawyer API Service
 * Handles all lawyer-related API calls
 */
export const lawyerAPI = {
  /**
   * Get a list of lawyers with optional filtering
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response
   */
  getLawyers: async (params = {}) => {
    try {
      const response = await apiClient.get('/lawyers', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching lawyers:', error);
      throw error;
    }
  },
  
  /**
   * Book an appointment with a lawyer
   * @param {string} lawyerId - Lawyer ID
   * @param {Object} appointmentData - Appointment details
   * @returns {Promise} - API response
   */
  bookLawyerAppointment: async (lawyerId, appointmentData) => {
    try {
      // Make sure lawyer_id is included in the appointment data
      const appointmentPayload = {
        ...appointmentData,
        lawyer_id: lawyerId // Ensure lawyer_id is in the payload
      };
      
      console.log('Booking appointment with data:', appointmentPayload);
      const response = await apiClient.post('/appointments', appointmentPayload);
      console.log('Booking response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Booking error:', error.response || error);
      throw error;
    }
  },

  /**
   * Get a specific lawyer by ID
   * @param {number} id - Lawyer ID
   * @returns {Promise} - API response
   */
  getLawyer: async (id) => {
    try {
      // Remove duplicate /api prefix
      const response = await apiClient.get(`/lawyers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching lawyer with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Book a consultation with a lawyer
   * @param {number} lawyerId - Lawyer ID
   * @param {Object} bookingData - Booking details
   * @returns {Promise} - API response
   */
  bookConsultation: async (lawyerId, bookingData) => {
    try {
      // Remove duplicate /api prefix
      const response = await apiClient.post(`/lawyers/${lawyerId}/book`, bookingData);
      return response.data;
    } catch (error) {
      console.error('Error booking consultation:', error);
      throw error;
    }
  },

  /**
   * Create a new appointment
   * @param {Object} appointmentData - Appointment details
   * @returns {Promise} - API response
   */
  createAppointment: async (appointmentData) => {
    try {
      console.log('Sending appointment data:', appointmentData);
      // Remove trailing slash
      const response = await apiClient.post('/appointments', appointmentData);
      console.log('Appointment creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  /**
   * Get available time slots for a lawyer
   * @param {number} lawyerId - Lawyer ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise} - API response
   */
  getAvailableTimeSlots: async (lawyerId, date) => {
    try {
      // Remove duplicate /api prefix
      const response = await apiClient.get(`/lawyers/${lawyerId}/availability`, {
        params: { date }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching available time slots:', error);
      throw error;
    }
  }
};

// API endpoints
export const authAPI = {
  // Get CSRF cookie for Laravel Sanctum
  getCsrfCookie: async () => {
    try {
      // Use the base URL without /api for CSRF cookie
      const baseUrl = getBaseUrl().replace('/api', '');
      console.log('Getting CSRF cookie from:', `${baseUrl}/sanctum/csrf-cookie`);
      
      // Create a custom axios instance for this request
      const csrfAxios = axios.create({
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      // Add request/response logging
      csrfAxios.interceptors.request.use(
        config => {
          console.log('CSRF request config:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            withCredentials: config.withCredentials
          });
          return config;
        },
        error => {
          console.error('CSRF request error:', error);
          return Promise.reject(error);
        }
      );
      
      csrfAxios.interceptors.response.use(
        response => {
          console.log('CSRF response headers:', response.headers);
          console.log('CSRF response cookies:', document.cookie);
          return response;
        },
        error => {
          console.error('CSRF response error:', error.response || error);
          return Promise.reject(error);
        }
      );
      
      // Make the request
      const response = await csrfAxios.get(`${baseUrl}/sanctum/csrf-cookie`);
      console.log('CSRF cookie response:', response);
      
      return response;
    } catch (error) {
      console.error('Error getting CSRF cookie:', error);
      throw error;
    }
  },

  // Register user
  register: async (userData) => {
    try {
      console.log('Registering user with data:', userData);
      
      // First get CSRF cookie
      await authAPI.getCsrfCookie();
      
      // Create a custom axios instance for registration
      const registerAxios = axios.create({
        baseURL: getBaseUrl().replace('/api', ''), // Use base URL without /api
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      // Add request/response logging
      registerAxios.interceptors.request.use(
        config => {
          console.log('Register request config:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            withCredentials: config.withCredentials
          });
          return config;
        },
        error => {
          console.error('Register request error:', error);
          return Promise.reject(error);
        }
      );
      
      // Then register
      const response = await registerAxios.post('/register', userData);
      console.log('Registration API response:', response);
      
      // Store token if available
      if (response.data && response.data.access_token) {
        localStorage.setItem('auth_token', response.data.access_token);
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }
      
      return response;
    } catch (error) {
      console.error('Registration API error:', error.response || error);
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      console.log('Logging in with credentials:', { email: credentials.email, password: '********' });
      
      // First get CSRF cookie
      await authAPI.getCsrfCookie();
      
      // Create a custom axios instance for login
      const loginAxios = axios.create({
        baseURL: getBaseUrl().replace('/api', ''), // Use base URL without /api
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      // Add request/response logging
      loginAxios.interceptors.request.use(
        config => {
          console.log('Login request config:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            withCredentials: config.withCredentials
          });
          return config;
        },
        error => {
          console.error('Login request error:', error);
          return Promise.reject(error);
        }
      );
      
      // Then login
      const response = await loginAxios.post('/login', credentials);
      console.log('Login API response:', response);
      
      // Store token if available
      if (response.data && response.data.access_token) {
        localStorage.setItem('auth_token', response.data.access_token);
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }
      
      return response;
    } catch (error) {
      console.error('Login API error:', error.response || error);
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      // First get CSRF cookie
      await authAPI.getCsrfCookie();
      
      // Create a custom axios instance for logout
      const logoutAxios = axios.create({
        baseURL: getBaseUrl().replace('/api', ''), // Use base URL without /api
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      // Add auth token to headers if available
      const token = localStorage.getItem('auth_token');
      if (token) {
        logoutAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      // Use the correct endpoint
      const response = await logoutAxios.post('/logout');
      console.log('Logout API response:', response);
      
      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_profile');
      localStorage.removeItem('user_avatar');
      localStorage.removeItem('user_avatar_offline');
      
      return response;
    } catch (error) {
      console.error('Logout API error:', error.response || error);
      
      // Even if the API call fails, clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_profile');
      localStorage.removeItem('user_avatar');
      localStorage.removeItem('user_avatar_offline');
      
      throw error;
    }
  },

  // Get authenticated user
  getUser: async () => {
    try {
      const response = await apiClient.get('/user/profile');
      return response;
    } catch (error) {
      console.error('Get user API error:', error.response || error);
      throw error;
    }
  },

  // Refresh token (if your API supports it)
  refreshToken: async () => {
    try {
      const response = await apiClient.post('/refresh');
      
      // Update token if available
      if (response.data && response.data.access_token) {
        localStorage.setItem('auth_token', response.data.access_token);
      }
      
      return response;
    } catch (error) {
      console.error('Refresh token API error:', error.response || error);
      throw error;
    }
  },
};

// Utility functions for token management
export const tokenManager = {
  setToken: (token) => {
    localStorage.setItem('auth_token', token);
  },

  getToken: () => {
    return localStorage.getItem('auth_token');
  },

  removeToken: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  }
};



// API Services
export const apiServices = {
  // Task Automation API
  getTasks: async (filters = {}) => {
    try {
      // Remove duplicate /api prefix
      const response = await apiClient.get('/tasks', { params: filters });
      console.log('Tasks API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Tasks API error:', error.response || error);
      throw error;
    }
  },
  
  getTask: async (taskId) => {
    try {
      // Remove duplicate /api prefix
      const response = await apiClient.get(`/tasks/${taskId}`);
      console.log('Task details response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Task details error:', error.response || error);
      throw error;
    }
  },
  
  createTask: async (taskData) => {
    try {
      // Remove duplicate /api prefix
      const response = await apiClient.post('/tasks', taskData);
      console.log('Create task response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Create task error:', error.response || error);
      throw error;
    }
  },
  
  updateTask: async (taskId, taskData) => {
    try {
      // Remove duplicate /api prefix
      const response = await apiClient.put(`/tasks/${taskId}`, taskData);
      console.log('Update task response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Update task error:', error.response || error);
      throw error;
    }
  },
  
  updateTaskStatus: async (taskId, status) => {
    try {
      // Remove duplicate /api prefix
      const response = await apiClient.patch(`/tasks/${taskId}/status`, { status });
      console.log('Update task status response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Update task status error:', error.response || error);
      throw error;
    }
  },
  
  deleteTask: async (taskId) => {
    try {
      // Remove duplicate /api prefix
      const response = await apiClient.delete(`/tasks/${taskId}`);
      console.log('Delete task response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Delete task error:', error.response || error);
      throw error;
    }
  },
  
  getTaskCategories: async () => {
    try {
      // Remove duplicate /api prefix
      const response = await apiClient.get('/task-categories');
      console.log('Task categories response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Task categories error:', error.response || error);
      throw error;
    }
  },
  
  getTaskStatistics: async () => {
    try {
      // Remove duplicate /api prefix
      const response = await apiClient.get('/tasks/statistics');
      console.log('Task statistics response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Task statistics error:', error.response || error);
      throw error;
    }
  },
  
  // Notifications API
  getUserNotifications: async (userId) => {
    try {
      // Using relative path instead of hardcoded URL to respect environment settings
      const response = await apiClient.get(`/notifications/user/${userId}`);
      console.log('Notifications API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Notifications API error:', error.response || error);
      throw error;
    }
  },
  
  createNotification: async (notificationData) => {
    try {
      const response = await apiClient.post('/notifications/', notificationData);
      console.log('Create notification response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Create notification error:', error.response || error);
      throw error;
    }
  },
  
  markNotificationAsRead: async (notificationId) => {
    try {
      const response = await apiClient.post(`/notifications/${notificationId}/read`);
      console.log('Mark notification as read response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Mark notification as read error:', error.response || error);
      throw error;
    }
  },
  
  markAllNotificationsAsRead: async (userId) => {
    try {
      const response = await apiClient.post(`/notifications/mark-all-read`, { user_id: userId });
      console.log('Mark all notifications as read response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Mark all notifications as read error:', error.response || error);
      throw error;
    }
  },

  // Authentication APIs - These are now handled by authAPI, keeping for backward compatibility
  register: async (userData) => {
    console.warn('Using deprecated apiServices.register. Please use authAPI.register instead.');
    try {
      const response = await authAPI.register(userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  login: async (credentials) => {
    console.warn('Using deprecated apiServices.login. Please use authAPI.login instead.');
    try {
      // Use the improved authAPI.login method
      const response = await authAPI.login(credentials);
      
      // Return the data part of the response
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    console.warn('Using deprecated apiServices.logout. Please use authAPI.logout instead.');
    try {
      // Use the improved authAPI.logout method
      const response = await authAPI.logout();
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get authenticated user
  getUser: async () => {
    console.warn('Using deprecated apiServices.getUser. Please use authAPI.getUser instead.');
    try {
      const response = await apiClient.get('/user/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get CSRF cookie for Laravel Sanctum
  getCsrfCookie: async () => {
    console.warn('Using deprecated apiServices.getCsrfCookie. Please use authAPI.getCsrfCookie instead.');
    try {
      const response = await apiClient.get('/sanctum/csrf-cookie');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Password Reset APIs
  sendPasswordResetOtp: async (data) => {
    try {
      const response = await apiClient.post('/password/send-otp', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verifyOtp: async (data) => {
    try {
      const response = await apiClient.get('/password/verify-otp', {
        params: data
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (data) => {
    try {
      const response = await apiClient.post('/password/reset', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Contact APIs (from your routes)
  getContacts: async () => {
    try {
      const response = await apiClient.get('/contacts');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createContact: async (contactData) => {
    try {
      const response = await apiClient.post('/contacts', contactData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateContact: async (id, contactData) => {
    try {
      const response = await apiClient.put(`/contacts/${id}`, contactData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteContact: async (id) => {
    try {
      const response = await apiClient.delete(`/contacts/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getContact: async (id) => {
    try {
      const response = await apiClient.get(`/contacts/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Refresh token (if your API supports it)
  refreshToken: async () => {
    try {
      const response = await apiClient.post('/refresh');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // User Profile APIs
  getUserProfile: async () => {
    try {
      const response = await apiClient.get('/user/profile');
      console.log('User profile response:', response.data);
      
      // Extract the actual user data from the response
      const userData = response.data.data || response.data;
      
      // Store user profile data in localStorage for offline access
      if (userData) {
        // Process avatar URL if present
        if (userData.avatar) {
          // Ensure avatar URL is absolute and correctly formatted
          if (typeof userData.avatar === 'string' && !userData.avatar.startsWith('data:')) {
            // Fix the avatar URL if it's a storage path
            let fixedAvatarUrl = userData.avatar;
            
            // First, check for duplicate /api prefixes and fix them
            if (fixedAvatarUrl.includes('/api/api')) {
              // Fix duplicate /api prefixes
              while (fixedAvatarUrl.includes('/api/api')) {
                fixedAvatarUrl = fixedAvatarUrl.replace('/api/api', '/api');
              }
              console.log('Fixed duplicate /api prefixes:', fixedAvatarUrl);
            }
            
            // Check if it's just a filename (no slashes)
            if (!fixedAvatarUrl.includes('/') && (fixedAvatarUrl.includes('.jpg') || fixedAvatarUrl.includes('.jpeg') || 
                fixedAvatarUrl.includes('.png') || fixedAvatarUrl.includes('.gif') || fixedAvatarUrl.includes('.webp'))) {
              // It's just a filename, construct the full path
              fixedAvatarUrl = `/storage/avatars/${fixedAvatarUrl}`;
              console.log('Converted filename to full path:', fixedAvatarUrl);
            }
            // Check if it's a storage path that needs to be fixed
            else if (fixedAvatarUrl.includes('/storage/')) {
              // We'll keep the storage path as is, as Laravel's public storage is directly accessible
              console.log('Using storage path:', fixedAvatarUrl);
            }
            
            // Ensure the URL is absolute
            if (!fixedAvatarUrl.startsWith('http')) {
              const baseUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
              
              // Make sure we don't add the baseUrl if it's already in the URL
              if (!fixedAvatarUrl.includes(baseUrl)) {
                fixedAvatarUrl = fixedAvatarUrl.startsWith('/') 
                  ? `${baseUrl}${fixedAvatarUrl}` 
                  : `${baseUrl}/${fixedAvatarUrl}`;
                console.log('Converted to absolute URL:', fixedAvatarUrl);
              }
            }
            
            // Add a cache-busting parameter to prevent browser caching
            const cacheBuster = `_cb=${new Date().getTime()}`;
            fixedAvatarUrl = fixedAvatarUrl.includes('?') 
              ? `${fixedAvatarUrl}&${cacheBuster}` 
              : `${fixedAvatarUrl}?${cacheBuster}`;
            console.log('Added cache-busting parameter:', fixedAvatarUrl);
            
            console.log('Using fixed avatar URL:', fixedAvatarUrl);
            userData.avatar = fixedAvatarUrl;
          }
          
          // Store the avatar URL in localStorage
          localStorage.setItem('user_avatar', userData.avatar);
          console.log('Avatar URL stored in localStorage:', userData.avatar);
          
          // Also update the avatar in the user object if it exists
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              parsedUser.avatar = userData.avatar;
              localStorage.setItem('user', JSON.stringify(parsedUser));
            } catch (e) {
              console.error('Error updating user avatar in localStorage:', e);
            }
          }
          
          // If it's a URL (not a data URL), also fetch and store as data URL for offline use
          if (typeof userData.avatar === 'string' && !userData.avatar.startsWith('data:')) {
            try {
              console.log('Fetching avatar image for offline storage:', userData.avatar);
              fetch(userData.avatar)
                .then(response => response.blob())
                .then(blob => {
                  const reader = new FileReader();
                  reader.onloadend = function() {
                    localStorage.setItem('user_avatar_offline', reader.result);
                    console.log('Avatar stored as data URL for offline use');
                  };
                  reader.readAsDataURL(blob);
                })
                .catch(err => console.error('Failed to fetch avatar for offline storage:', err));
            } catch (imgError) {
              console.error('Failed to process avatar for offline storage:', imgError);
            }
          }
        }
        
        // Store the rest of the profile data
        localStorage.setItem('user_profile', JSON.stringify(userData));
      }
      
      return userData;
    } catch (error) {
      console.error('Get user profile error:', error.response || error);
      
      // Try to get profile from localStorage if API fails
      const cachedProfile = localStorage.getItem('user_profile');
      if (cachedProfile) {
        try {
          const profile = JSON.parse(cachedProfile);
          
          // Try to get avatar from various localStorage keys
          const avatar = localStorage.getItem('user_avatar') || 
                         localStorage.getItem('user_avatar_offline');
          
          if (avatar) {
            profile.avatar = avatar;
            console.log('Using cached avatar from localStorage');
          }
          
          return profile;
        } catch (parseError) {
          console.error('Error parsing cached profile:', parseError);
          throw error;
        }
      }
      
      throw error;
    }
  },
  
  updateUserProfile: async (userData) => {
    try {
      // Create a copy of userData without the avatar if it's a data URL
      // to avoid sending large payloads
      const dataToSend = { ...userData };
      if (dataToSend.avatar && dataToSend.avatar.startsWith('data:')) {
        // Don't send the data URL in the JSON payload
        delete dataToSend.avatar;
      }
      
      const response = await apiClient.put('/user/profile', dataToSend);
      console.log('Update profile response:', response.data);
      
      // Extract the actual user data from the response
      const updatedUserData = response.data.data || response.data;
      
      // Update localStorage
      if (updatedUserData) {
        localStorage.setItem('user_profile', JSON.stringify(updatedUserData));
        
        // Update user in localStorage if it exists
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            const updatedUser = {
              ...parsedUser,
              name: updatedUserData.name || userData.name,
              email: updatedUserData.email || userData.email,
              phone: updatedUserData.phone || userData.phone,
              address: updatedUserData.address || userData.address
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
          } catch (e) {
            console.error('Error updating user in localStorage:', e);
          }
        }
      }
      
      return updatedUserData;
    } catch (error) {
      console.error('Update profile error:', error.response || error);
      throw error;
    }
  },
  
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      // Try the endpoints from the Laravel routes in sequence
      let response;
      let userData;
      
      try {
        // First attempt: Try the /avatar endpoint
        response = await apiClient.post('/api/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Upload avatar response (method 1):', response.data);
        userData = response.data.data || response.data;
      } catch (error1) {
        console.log('First avatar upload method failed, trying alternative:', error1);
        
        try {
          // Second attempt: Try the /update-avatar endpoint
          response = await apiClient.post('/update-avatar', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log('Upload avatar response (method 2):', response.data);
          userData = response.data.data || response.data;
        } catch (error2) {
          console.log('Second avatar upload method failed, trying final method:', error2);
          
          try {
            // Third attempt: Try with user ID
            // First get the user ID
            const userResponse = await apiClient.get('/api/user/profile');
            const userId = userResponse.data.id || userResponse.data.data?.id;
            
            if (!userId) {
              throw new Error('Could not determine user ID for avatar upload');
            }
            
            // Then use the user-specific avatar endpoint
            response = await apiClient.post(`/api/${userId}/avatar`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            console.log('Upload avatar response (method 3):', response.data);
            userData = response.data.data || response.data;
          } catch (error3) {
            console.log('Third avatar upload method failed, trying without /api prefix:', error3);
            
            try {
              // Fourth attempt: Try the endpoints without /api prefix
              response = await apiClient.post('/avatar', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
              console.log('Upload avatar response (method 4):', response.data);
              userData = response.data.data || response.data;
            } catch (error4) {
              console.log('Fourth avatar upload method failed, trying update-avatar without prefix:', error4);
              
              try {
                response = await apiClient.post('/update-avatar', formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                });
                console.log('Upload avatar response (method 5):', response.data);
                userData = response.data.data || response.data;
              } catch (error5) {
                console.error('All avatar upload methods failed:', error5);
                throw new Error('Could not upload avatar: ' + (error5.message || 'Unknown error'));
              }
            }
          }
        }
      }
      
      // Store avatar in localStorage
      if (userData) {
        try {
          // If we have an avatar URL from the server response, store it
          if (userData.avatar) {
            // If it's a URL (not a data URL), store it directly
            if (typeof userData.avatar === 'string' && !userData.avatar.startsWith('data:')) {
              // Fix the avatar URL if it's a storage path
              let fixedAvatarUrl = userData.avatar;
              
              // First, check for duplicate /api prefixes and fix them
              if (fixedAvatarUrl.includes('/api/api')) {
                // Fix duplicate /api prefixes
                while (fixedAvatarUrl.includes('/api/api')) {
                  fixedAvatarUrl = fixedAvatarUrl.replace('/api/api', '/api');
                }
                console.log('Fixed duplicate /api prefixes:', fixedAvatarUrl);
              }
              
              // Check if it's just a filename (no slashes)
              if (!fixedAvatarUrl.includes('/') && (fixedAvatarUrl.includes('.jpg') || fixedAvatarUrl.includes('.jpeg') || 
                  fixedAvatarUrl.includes('.png') || fixedAvatarUrl.includes('.gif') || fixedAvatarUrl.includes('.webp'))) {
                // It's just a filename, construct the full path
                fixedAvatarUrl = `/api/storage/avatars/${fixedAvatarUrl}`;
                console.log('Converted filename to full path:', fixedAvatarUrl);
              }
              // Check if it's a storage path that needs to be fixed
              else if (fixedAvatarUrl.includes('/storage/')) {
                // Convert from /storage/avatars/file.jpg to /api/storage/avatars/file.jpg
                if (!fixedAvatarUrl.startsWith('/api')) {
                  fixedAvatarUrl = '/api' + fixedAvatarUrl;
                  console.log('Fixed storage path by adding /api prefix:', fixedAvatarUrl);
                }
              }
              
              // Ensure the URL is absolute
              if (!fixedAvatarUrl.startsWith('http')) {
                const baseUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
                
                // Make sure we don't add the baseUrl if it's already in the URL
                if (!fixedAvatarUrl.includes(baseUrl)) {
                  fixedAvatarUrl = fixedAvatarUrl.startsWith('/') 
                    ? `${baseUrl}${fixedAvatarUrl}` 
                    : `${baseUrl}/${fixedAvatarUrl}`;
                  console.log('Converted to absolute URL:', fixedAvatarUrl);
                }
              }
              
              console.log('Storing fixed avatar URL in localStorage:', fixedAvatarUrl);
              localStorage.setItem('user_avatar', fixedAvatarUrl);
              
              // Update the avatar in userData for further processing
              userData.avatar = fixedAvatarUrl;
              
              // Also update the avatar in the user object if it exists
              const storedUser = localStorage.getItem('user');
              if (storedUser) {
                try {
                  const parsedUser = JSON.parse(storedUser);
                  parsedUser.avatar = fixedAvatarUrl;
                  localStorage.setItem('user', JSON.stringify(parsedUser));
                } catch (e) {
                  console.error('Error updating user avatar URL in localStorage:', e);
                }
              }
            }
          }
          
          // Also convert the file to base64 for localStorage as a backup
          const reader = new FileReader();
          reader.onloadend = function() {
            // Only store as data URL if we don't have a URL from the server
            if (!userData.avatar || userData.avatar.startsWith('data:')) {
              console.log('Storing avatar as data URL in localStorage');
              localStorage.setItem('user_avatar', reader.result);
              
              // Also update the avatar in the user object if it exists
              const storedUser = localStorage.getItem('user');
              if (storedUser) {
                try {
                  const parsedUser = JSON.parse(storedUser);
                  parsedUser.avatar = reader.result;
                  localStorage.setItem('user', JSON.stringify(parsedUser));
                } catch (e) {
                  console.error('Error updating user avatar data URL in localStorage:', e);
                }
              }
            }
          };
          reader.readAsDataURL(file);
        } catch (e) {
          console.error('Error storing avatar in localStorage:', e);
        }
      }
      
      return userData;
    } catch (error) {
      console.error('Upload avatar error:', error.response || error);
      throw error;
    }
  },
  
  // Lawyer API endpoints
  getLawyers: async (params = {}) => {
    try {
      console.log('Fetching lawyers with params:', params);
      // Remove duplicate /api prefix and trailing slash
      const response = await apiClient.get('/lawyers', { params });
      console.log('Lawyers API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Lawyers API error:', error.response || error);
      throw error;
    }
  },
  
  getLawyerById: async (lawyerId) => {
    try {
      console.log(`Fetching lawyer with ID: ${lawyerId}`);
      // Remove duplicate /api prefix
      const response = await apiClient.get(`/lawyers/${lawyerId}`);
      console.log('Lawyer details response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Lawyer details error:', error.response || error);
      throw error;
    }
  },
  
  getLawyerAppointments: async (lawyerId) => {
    try {
      console.log(`Fetching appointments for lawyer ID: ${lawyerId}`);
      // Remove duplicate /api prefix
      const response = await apiClient.get(`/lawyers/${lawyerId}/appointments`);
      console.log('Lawyer appointments response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Lawyer appointments error:', error.response || error);
      throw error;
    }
  },
  
  getLawyerReviews: async (lawyerId) => {
    try {
      console.log(`Fetching reviews for lawyer ID: ${lawyerId}`);
      // Remove duplicate /api prefix
      const response = await apiClient.get(`/lawyers/${lawyerId}/reviews`);
      console.log('Lawyer reviews response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Lawyer reviews error:', error.response || error);
      throw error;
    }
  },
  
  submitLawyerReview: async (lawyerId, reviewData) => {
    try {
      console.log(`Submitting review for lawyer ID: ${lawyerId}`, reviewData);
      // Remove duplicate /api prefix
      const response = await apiClient.post(`/lawyers/${lawyerId}/reviews`, reviewData);
      console.log('Review submission response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Review submission error:', error.response || error);
      throw error;
    }
  },
};



// Lawyer API endpoints
export const lawyerAPI2 = {
  // Get all lawyers with optional filtering
  getLawyers: async (params = {}) => {
    try {
      // Remove duplicate /api prefix
      const response = await apiClient.get('/lawyers', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching lawyers:', error);
      throw error;
    }
  },
  
  // Get a specific lawyer by ID
  getLawyerById: async (id) => {
    try {
      // Remove duplicate /api prefix
      const response = await apiClient.get(`/lawyers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching lawyer with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Book an appointment with a lawyer
  bookAppointment: async (lawyerId, appointmentData) => {
    try {
      // Remove duplicate /api prefix
      const response = await apiClient.post(`/lawyers/${lawyerId}/appointments`, appointmentData);
      return response.data;
    } catch (error) {
      console.error('Error booking appointment:', error);
      throw error;
    }
  },
  
  // Get lawyer reviews
  getLawyerReviews: async (lawyerId) => {
    try {
      // Remove duplicate /api prefix
      const response = await apiClient.get(`/lawyers/${lawyerId}/reviews`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lawyer reviews:', error);
      throw error;
    }
  },
  
  // Submit a review for a lawyer
  submitReview: async (lawyerId, reviewData) => {
    try {
      // Remove duplicate /api prefix
      const response = await apiClient.post(`/lawyers/${lawyerId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  }
};

export default apiClient;
