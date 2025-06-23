// apiService.js - Centralized API configuration

import axios from 'axios';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000', // Changed from 127.0.0.1
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
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
    //   window.location.href = '/auth';
    }

    // Handle network errors
    if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  // Get CSRF cookie for Laravel Sanctum
  getCsrfCookie: () => apiClient.get('/sanctum/csrf-cookie'),

  // Register user
  register: (userData) => apiClient.post('/register', userData),

  // Login user
  login: (credentials) => apiClient.post('/login', credentials),

  // Logout user
  logout: () => apiClient.post('/api/logout'),

  // Get authenticated user
  getUser: () => apiClient.get('/api/user'),

  // Refresh token (if your API supports it)
  refreshToken: () => apiClient.post('/api/refresh'),
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
  // Notifications API
  getUserNotifications: async (userId) => {
    try {
      // Using the exact endpoint format you specified
      const response = await apiClient.get(`http://127.0.0.1:8000/api/notifications/user/${userId}`);
      console.log('Notifications API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Notifications API error:', error.response || error);
      throw error;
    }
  },
  
  markNotificationAsRead: async (notificationId) => {
    try {
      const response = await apiClient.post(`http://127.0.0.1:8000/api/notifications/${notificationId}/mark-as-read`);
      console.log('Mark notification as read response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Mark notification as read error:', error.response || error);
      throw error;
    }
  },
  
  markAllNotificationsAsRead: async (userId) => {
    try {
      const response = await apiClient.post(`http://127.0.0.1:8000/api/notifications/user/${userId}/mark-all-read`);
      console.log('Mark all notifications as read response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Mark all notifications as read error:', error.response || error);
      throw error;
    }
  },

  // Authentication APIs
  register: async (userData) => {
    try {
      const response = await apiClient.post('/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await apiClient.post('/login', credentials);
      
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await apiClient.post('/logout');
      
      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get authenticated user
  getUser: async () => {
    try {
      const response = await apiClient.get('/user/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get CSRF cookie for Laravel Sanctum
  getCsrfCookie: async () => {
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
        // If avatar is present, store it separately to avoid large localStorage objects
        const avatarUrl = userData.avatar;
        if (avatarUrl && !avatarUrl.startsWith('data:')) {
          try {
            // Check if it's a relative path and prepend API base URL if needed
            const fullAvatarUrl = avatarUrl.startsWith('http') 
              ? avatarUrl 
              : `${process.env.REACT_APP_API_URL || ''}/${avatarUrl}`;
              
            // Fetch the image and convert to base64 for localStorage
            const imageResponse = await fetch(fullAvatarUrl);
            const blob = await imageResponse.blob();
            const reader = new FileReader();
            
            reader.onloadend = function() {
              localStorage.setItem('user_avatar', reader.result);
              console.log('Avatar stored in localStorage');
            };
            
            reader.readAsDataURL(blob);
          } catch (imgError) {
            console.error('Failed to store avatar in localStorage:', imgError);
          }
        } else if (avatarUrl && avatarUrl.startsWith('data:')) {
          // If it's already a data URL, store directly
          localStorage.setItem('user_avatar', avatarUrl);
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
        const profile = JSON.parse(cachedProfile);
        const avatar = localStorage.getItem('user_avatar');
        if (avatar) {
          profile.avatar = avatar;
        }
        return profile;
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
      
      const response = await apiClient.post('/user/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload avatar response:', response.data);
      
      // Extract the actual user data from the response
      const userData = response.data.data || response.data;
      
      // Store avatar in localStorage
      if (userData && userData.avatar) {
        try {
          // Convert the file to base64 for localStorage
          const reader = new FileReader();
          reader.onloadend = function() {
            localStorage.setItem('user_avatar', reader.result);
            
            // Also update the avatar in the user object if it exists
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              try {
                const parsedUser = JSON.parse(storedUser);
                parsedUser.avatar = reader.result;
                localStorage.setItem('user', JSON.stringify(parsedUser));
              } catch (e) {
                console.error('Error updating user avatar in localStorage:', e);
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
};



export default apiClient;
