// apiService.js - Centralized API configuration

import axios from 'axios';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://chambersapi.logicera.in', // Changed from 127.0.0.1
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // 'X-Requested-With': 'XMLHttpRequest',
  },
});
// const apiClientforscrf = axios.create({
//   baseURL: 'http://127.0.0.1:8000', // Changed from 127.0.0.1 or for production use the API URL from .env
//   timeout: 10000,
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//     'X-Requested-With': 'XMLHttpRequest',
//   },
// });

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

/**
 * Lawyer API Service/
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
      const response = await apiClient.post('/appointments/', appointmentData);
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
      const response = await apiClient.get(`/lawyers/${lawyerId}/availability`, {
        params: { date }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching available time slots:', error);
      throw error;
    }
  },

  /**
   * Get nearby lawyers based on location
   * @param {Object} location - User location {latitude, longitude}
   * @param {number} radius - Search radius in meters
   * @returns {Promise} - API response
   */
  getNearbyLawyers: async (location, radius = 5000) => {
    try {
      const response = await apiClient.get('/lawyers/nearby', {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          radius: radius
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching nearby lawyers:', error);
      throw error;
    }
  },

  /**
   * Get lawyer's online status
   * @param {number} lawyerId - Lawyer ID
   * @returns {Promise} - API response
   */
  getLawyerStatus: async (lawyerId) => {
    try {
      const response = await apiClient.get(`/lawyers/${lawyerId}/status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lawyer status:', error);
      throw error;
    }
  },

  /**
   * Update lawyer's online status
   * @param {number} lawyerId - Lawyer ID
   * @param {boolean} isOnline - Online status
   * @returns {Promise} - API response
   */
  updateLawyerStatus: async (lawyerId, isOnline) => {
    try {
      const response = await apiClient.put(`/lawyers/${lawyerId}/status`, {
        is_online: isOnline
      });
      return response.data;
    } catch (error) {
      console.error('Error updating lawyer status:', error);
      throw error;
    }
  },

  /**
   * Start a call session with a lawyer
   * @param {number} lawyerId - Lawyer ID
   * @returns {Promise} - API response
   */
  startCallSession: async (lawyerId) => {
    try {
      const response = await apiClient.post(`/lawyers/${lawyerId}/call/start`);
      return response.data;
    } catch (error) {
      console.error('Error starting call session:', error);
      throw error;
    }
  },

  /**
   * End a call session with a lawyer
   * @param {number} lawyerId - Lawyer ID
   * @param {string} sessionId - Call session ID
   * @returns {Promise} - API response
   */
  endCallSession: async (lawyerId, sessionId) => {
    try {
      const response = await apiClient.post(`/lawyers/${lawyerId}/call/end`, {
        session_id: sessionId
      });
      return response.data;
    } catch (error) {
      console.error('Error ending call session:', error);
      throw error;
    }
  },

  /**
   * Start a chat session with a lawyer
   * @param {number} lawyerId - Lawyer ID
   * @returns {Promise} - API response
   */
  startChatSession: async (lawyerId) => {
    try {
      const response = await apiClient.post(`/lawyers/${lawyerId}/chat/start`);
      return response.data;
    } catch (error) {
      console.error('Error starting chat session:', error);
      throw error;
    }
  },

  /**
   * Send a message in chat session
   * @param {number} lawyerId - Lawyer ID
   * @param {string} sessionId - Chat session ID
   * @param {string} message - Message content
   * @returns {Promise} - API response
   */
  sendChatMessage: async (lawyerId, sessionId, message) => {
    try {
      const response = await apiClient.post(`/lawyers/${lawyerId}/chat/message`, {
        session_id: sessionId,
        message: message
      });
      return response.data;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  }
};

// API endpoints
export const authAPI = {
  // Get CSRF cookie for Laravel Sanctum
  getCsrfCookie: () => apiClient.get('https://chambersapi.logicera.in/sanctum/csrf-cookie'),

  // Register user
  register: async (userData) => {
    try {
      console.log('Registering user with data:', userData);
      const response = await apiClient.post('/register', userData);
      console.log('Registration API response:', response);
      return response;
    } catch (error) {
      console.error('Registration API error:', error.response || error);
      throw error;
    }
  },

  // Login user
  login: (credentials) => apiClient.post('/login', credentials),

  // Google OAuth login
  googleLogin: async (googleToken) => {
    try {
      console.log('Google login with token:', googleToken);
      const response = await apiClient.post('/auth/google', {
        token: googleToken
      });
      console.log('Google login API response:', response);
      return response;
    } catch (error) {
      console.error('Google login API error:', error.response || error);
      throw error;
    }
  },

  // Logout user
  logout: () => apiClient.post('/logout'),

  // Get authenticated user
  getUser: () => apiClient.get('/user'),

  // Refresh token (if your API supports it)
  refreshToken: () => apiClient.post('/refresh'),

  // Save additional user details (for Google users or profile completion)
  saveAdditionalDetails: async (payload) => {
    try {
      console.log('Saving additional details with payload:', payload);
      
      // Check if payload is FormData (for file uploads)
      const isFormData = payload instanceof FormData;
      
      const config = {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      };

      // Set appropriate content type for FormData
      if (isFormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
      } else {
        config.headers['Content-Type'] = 'application/json';
      }

      const response = await apiClient.post('/auth/save/additional', payload, config);
      console.log('Save additional details API response:', response);
      return response;
    } catch (error) {
      console.error('Save additional details API error:', error.response || error);
      throw error;
    }
  },
};

/**
 * Cases API Service
 * Handles all case-related API calls
 */
export const casesAPI = {
  /**
   * Get all cases for the authenticated lawyer
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response
   */
  getCases: async (params = {}) => {
    try {
      const response = await apiClient.get('/cases', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching cases:', error);
      throw error;
    }
  },

  /**
   * Get a specific case by ID
   * @param {number} id - Case ID
   * @returns {Promise} - API response
   */
  getCase: async (id) => {
    try {
      const response = await apiClient.get(`/cases/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching case with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new case
   * @param {Object} caseData - Case details
   * @returns {Promise} - API response
   */
  createCase: async (caseData) => {
    try {
      console.log('Creating case with data:', caseData);
      const response = await apiClient.post('/cases', caseData);
      console.log('Case creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating case:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  /**
   * Update an existing case
   * @param {number} id - Case ID
   * @param {Object} caseData - Updated case details
   * @returns {Promise} - API response
   */
  updateCase: async (id, caseData) => {
    try {
      console.log(`Updating case ${id} with data:`, caseData);
      const response = await apiClient.put(`/cases/${id}`, caseData);
      console.log('Case update response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating case ${id}:`, error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  /**
   * Delete a case
   * @param {number} id - Case ID
   * @returns {Promise} - API response
   */
  deleteCase: async (id) => {
    try {
      const response = await apiClient.delete(`/cases/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting case ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get case statistics for dashboard
   * @returns {Promise} - API response
   */
  getCaseStats: async () => {
    try {
      const response = await apiClient.get('/cases/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching case statistics:', error);
      throw error;
    }
  },

  /**
   * Update case status
   * @param {number} id - Case ID
   * @param {string} status - New status
   * @returns {Promise} - API response
   */
  updateCaseStatus: async (id, status) => {
    try {
      const response = await apiClient.patch(`/cases/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating case ${id} status:`, error);
      throw error;
    }
  },

  /**
   * Upload case document
   * @param {number} caseId - Case ID
   * @param {FormData} formData - Document form data
   * @returns {Promise} - API response
   */
  uploadDocument: async (caseId, formData) => {
    try {
      const response = await apiClient.post(`/cases/${caseId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error uploading document for case ${caseId}:`, error);
      throw error;
    }
  },

  /**
   * Get case documents
   * @param {number} caseId - Case ID
   * @returns {Promise} - API response
   */
  getCaseDocuments: async (caseId) => {
    try {
      const response = await apiClient.get(`/cases/${caseId}/documents`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching documents for case ${caseId}:`, error);
      throw error;
    }
  }
};

/**
 * Documents API Service
 * Handles all document-related API calls including drafting requests, case documents, and history
 */
export const documentsAPI = {
  /**
   * Get document drafting requests
   * @param {Object} params - Query parameters for filtering and sorting
   * @returns {Promise} - API response with drafting requests
   */
  getDraftingRequests: async (params = {}) => {
    try {
      const response = await apiClient.get('/documents/drafting-requests', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching drafting requests:', error);
      throw error;
    }
  },

  /**
   * Get specific drafting request details
   * @param {number} id - Request ID
   * @returns {Promise} - API response with request details
   */
  getDraftingRequest: async (id) => {
    try {
      const response = await apiClient.get(`/documents/drafting-requests/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching drafting request ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update drafting request status
   * @param {number} id - Request ID
   * @param {string} status - New status (pending, accepted, rejected, in_progress, review, completed)
   * @returns {Promise} - API response
   */
  updateRequestStatus: async (id, status) => {
    try {
      const response = await apiClient.patch(`/documents/drafting-requests/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating drafting request ${id} status:`, error);
      throw error;
    }
  },

  /**
   * Accept a drafting request bid
   * @param {number} id - Request ID
   * @param {Object} acceptanceData - Additional data for acceptance
   * @returns {Promise} - API response
   */
  acceptDraftingRequest: async (id, acceptanceData = {}) => {
    try {
      const response = await apiClient.post(`/documents/drafting-requests/${id}/accept`, acceptanceData);
      return response.data;
    } catch (error) {
      console.error(`Error accepting drafting request ${id}:`, error);
      throw error;
    }
  },

  /**
   * Reject a drafting request
   * @param {number} id - Request ID
   * @param {string} reason - Rejection reason
   * @returns {Promise} - API response
   */
  rejectDraftingRequest: async (id, reason = '') => {
    try {
      const response = await apiClient.post(`/documents/drafting-requests/${id}/reject`, { reason });
      return response.data;
    } catch (error) {
      console.error(`Error rejecting drafting request ${id}:`, error);
      throw error;
    }
  },

  /**
   * Submit completed document for review
   * @param {number} id - Request ID
   * @param {FormData} formData - Document files and completion data
   * @returns {Promise} - API response
   */
  submitCompletedDocument: async (id, formData) => {
    try {
      const response = await apiClient.post(`/documents/drafting-requests/${id}/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error submitting completed document for request ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get case documents
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response with case documents
   */
  getCaseDocuments: async (params = {}) => {
    try {
      const response = await apiClient.get('/documents/case-documents', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching case documents:', error);
      throw error;
    }
  },

  /**
   * Get documents for a specific case
   * @param {string} caseId - Case ID
   * @returns {Promise} - API response with case documents
   */
  getCaseDocumentsByCaseId: async (caseId) => {
    try {
      const response = await apiClient.get(`/documents/case-documents/case/${caseId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching documents for case ${caseId}:`, error);
      throw error;
    }
  },

  /**
   * Upload documents for a case
   * @param {string} caseId - Case ID
   * @param {FormData} formData - Document files and metadata
   * @returns {Promise} - API response
   */
  uploadCaseDocuments: async (caseId, formData) => {
    try {
      const response = await apiClient.post(`/documents/case-documents/case/${caseId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error uploading documents for case ${caseId}:`, error);
      throw error;
    }
  },

  /**
   * Update document status
   * @param {number} documentId - Document ID
   * @param {string} status - New status (pending_review, reviewed, verified, rejected)
   * @returns {Promise} - API response
   */
  updateDocumentStatus: async (documentId, status) => {
    try {
      const response = await apiClient.patch(`/documents/case-documents/${documentId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating document ${documentId} status:`, error);
      throw error;
    }
  },

  /**
   * Download document
   * @param {number} documentId - Document ID
   * @returns {Promise} - File blob
   */
  downloadDocument: async (documentId) => {
    try {
      const response = await apiClient.get(`/documents/case-documents/${documentId}/download`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error(`Error downloading document ${documentId}:`, error);
      throw error;
    }
  },

  /**
   * Delete document
   * @param {number} documentId - Document ID
   * @returns {Promise} - API response
   */
  deleteDocument: async (documentId) => {
    try {
      const response = await apiClient.delete(`/documents/case-documents/${documentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting document ${documentId}:`, error);
      throw error;
    }
  },

  /**
   * Get document history for the lawyer
   * @param {Object} params - Query parameters for filtering and pagination
   * @returns {Promise} - API response with document history
   */
  getDocumentHistory: async (params = {}) => {
    try {
      const response = await apiClient.get('/documents/history', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching document history:', error);
      throw error;
    }
  },

  /**
   * Get document drafting statistics
   * @returns {Promise} - API response with statistics
   */
  getDocumentStats: async () => {
    try {
      const response = await apiClient.get('/documents/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching document statistics:', error);
      throw error;
    }
  },

  /**
   * Search documents across all types
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise} - API response with search results
   */
  searchDocuments: async (query, filters = {}) => {
    try {
      const params = { query, ...filters };
      const response = await apiClient.get('/documents/search', { params });
      return response.data;
    } catch (error) {
      console.error('Error searching documents:', error);
      throw error;
    }
  },

  /**
   * Get document templates
   * @param {string} category - Document category
   * @returns {Promise} - API response with templates
   */
  getDocumentTemplates: async (category = null) => {
    try {
      const params = category ? { category } : {};
      const response = await apiClient.get('/documents/templates', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching document templates:', error);
      throw error;
    }
  },

  /**
   * Create document from template
   * @param {number} templateId - Template ID
   * @param {Object} templateData - Data to fill the template
   * @returns {Promise} - API response with generated document
   */
  createFromTemplate: async (templateId, templateData) => {
    try {
      const response = await apiClient.post(`/documents/templates/${templateId}/create`, templateData);
      return response.data;
    } catch (error) {
      console.error(`Error creating document from template ${templateId}:`, error);
      throw error;
    }
  },

  /**
   * Share document with client or other parties
   * @param {number} documentId - Document ID
   * @param {Object} shareData - Sharing permissions and recipients
   * @returns {Promise} - API response
   */
  shareDocument: async (documentId, shareData) => {
    try {
      const response = await apiClient.post(`/documents/case-documents/${documentId}/share`, shareData);
      return response.data;
    } catch (error) {
      console.error(`Error sharing document ${documentId}:`, error);
      throw error;
    }
  },

  /**
   * Get document versions/history
   * @param {number} documentId - Document ID
   * @returns {Promise} - API response with document versions
   */
  getDocumentVersions: async (documentId) => {
    try {
      const response = await apiClient.get(`/documents/case-documents/${documentId}/versions`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching versions for document ${documentId}:`, error);
      throw error;
    }
  },

  /**
   * Add comment/note to document
   * @param {number} documentId - Document ID
   * @param {string} comment - Comment text
   * @returns {Promise} - API response
   */
  addDocumentComment: async (documentId, comment) => {
    try {
      const response = await apiClient.post(`/documents/case-documents/${documentId}/comments`, { comment });
      return response.data;
    } catch (error) {
      console.error(`Error adding comment to document ${documentId}:`, error);
      throw error;
    }
  },

  /**
   * Get document comments
   * @param {number} documentId - Document ID
   * @returns {Promise} - API response with comments
   */
  getDocumentComments: async (documentId) => {
    try {
      const response = await apiClient.get(`/documents/case-documents/${documentId}/comments`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching comments for document ${documentId}:`, error);
      throw error;
    }
  }
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
      // Using the exact endpoint format you specified
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

  // Voice and Speech APIs for Enhanced Voice Modal Functionality
  startVoiceSession: async (sessionData = {}) => {
    try {
      const response = await apiClient.post('/voice/session/start', {
        user_id: sessionData.userId,
        session_type: sessionData.sessionType || 'legal_consultation',
        language: sessionData.language || 'en',
        ...sessionData
      });
      console.log('Voice session started:', response.data);
      return response.data;
    } catch (error) {
      console.error('Start voice session error:', error.response || error);
      throw error;
    }
  },

  endVoiceSession: async (sessionId, sessionSummary = {}) => {
    try {
      const response = await apiClient.post(`/voice/session/${sessionId}/end`, {
        duration: sessionSummary.duration,
        transcript: sessionSummary.transcript,
        summary: sessionSummary.summary,
        ...sessionSummary
      });
      console.log('Voice session ended:', response.data);
      return response.data;
    } catch (error) {
      console.error('End voice session error:', error.response || error);
      throw error;
    }
  },

  processVoiceTranscript: async (audioData, sessionId = null) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioData);
      if (sessionId) {
        formData.append('session_id', sessionId);
      }
      
      const response = await apiClient.post('/voice/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 seconds timeout for audio processing
      });
      console.log('Voice transcription response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Voice transcription error:', error.response || error);
      throw error;
    }
  },

  generateVoiceResponse: async (textData, voiceConfig = {}) => {
    try {
      const response = await apiClient.post('/voice/synthesize', {
        text: textData.text,
        voice: voiceConfig.voice || 'default',
        language: voiceConfig.language || 'en',
        speed: voiceConfig.speed || 1.0,
        pitch: voiceConfig.pitch || 1.0,
        session_id: textData.sessionId,
        ...voiceConfig
      });
      console.log('Voice synthesis response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Voice synthesis error:', error.response || error);
      throw error;
    }
  },

  getVoiceSessionHistory: async (userId, limit = 10) => {
    try {
      const response = await apiClient.get(`/voice/sessions/history`, {
        params: {
          user_id: userId,
          limit: limit
        }
      });
      console.log('Voice session history:', response.data);
      return response.data;
    } catch (error) {
      console.error('Voice session history error:', error.response || error);
      throw error;
    }
  },

  updateVoicePreferences: async (userId, preferences) => {
    try {
      const response = await apiClient.put(`/voice/preferences/${userId}`, {
        language: preferences.language || 'en',
        voice_type: preferences.voiceType || 'default',
        speech_speed: preferences.speechSpeed || 1.0,
        auto_transcribe: preferences.autoTranscribe !== undefined ? preferences.autoTranscribe : true,
        noise_reduction: preferences.noiseReduction !== undefined ? preferences.noiseReduction : true,
        ...preferences
      });
      console.log('Voice preferences updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Update voice preferences error:', error.response || error);
      throw error;
    }
  },

  // ======================================================================================================================================

  // Client Management APIs  in lawyer admin panel
  // These endpoints manage clients, their activities, cases, appointments, documents, and statistics.
  // They also include status updates and other client-related functionalities.
 
  // ======================================================================================================================================

  getClients: async (params = {}) => {
    try {
      const response = await apiClient.get('/clients', { params });
      console.log('Clients API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Clients API error:', error.response || error);
      throw error;
    }
  },

  getClient: async (clientId) => {
    try {
      const response = await apiClient.get(`/clients/${clientId}`);
      console.log('Client details response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Client details error:', error.response || error);
      throw error;
    }
  },

  createClient: async (clientData) => {
    try {
      const response = await apiClient.post('/clients', clientData);
      console.log('Create client response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Create client error:', error.response || error);
      throw error;
    }
  },

  updateClient: async (clientId, clientData) => {
    try {
      const response = await apiClient.put(`/clients/${clientId}`, clientData);
      console.log('Update client response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Update client error:', error.response || error);
      throw error;
    }
  },

  deleteClient: async (clientId) => {
    try {
      const response = await apiClient.delete(`/clients/${clientId}`);
      console.log('Delete client response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Delete client error:', error.response || error);
      throw error;
    }
  },

  getClientActivities: async (clientId, params = {}) => {
    try {
      const response = await apiClient.get(`/clients/${clientId}/activities`, { params });
      console.log('Client activities response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Client activities error:', error.response || error);
      throw error;
    }
  },

  getClientCases: async (clientId, params = {}) => {
    try {
      const response = await apiClient.get(`/clients/${clientId}/cases`, { params });
      console.log('Client cases response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Client cases error:', error.response || error);
      throw error;
    }
  },

  getClientAppointments: async (clientId, params = {}) => {
    try {
      const response = await apiClient.get(`/clients/${clientId}/appointments`, { params });
      console.log('Client appointments response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Client appointments error:', error.response || error);
      throw error;
    }
  },

  getClientDocuments: async (clientId, params = {}) => {
    try {
      const response = await apiClient.get(`/clients/${clientId}/documents`, { params });
      console.log('Client documents response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Client documents error:', error.response || error);
      throw error;
    }
  },

  updateClientStatus: async (clientId, status) => {
    try {
      const response = await apiClient.patch(`/clients/${clientId}/status`, { status });
      console.log('Update client status response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Update client status error:', error.response || error);
      throw error;
    }
  },

  getClientStatistics: async () => {
    try {
      const response = await apiClient.get('/clients/statistics');
      console.log('Client statistics response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Client statistics error:', error.response || error);
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
    console.warn('Using deprecated apiServices.logout. Please use authAPI.logout instead.');
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
        // ...no cleanedavatar logic needed...
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
        response = await apiClient.post('/avatar', formData, {
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
            const userResponse = await apiClient.get('/user/profile');
            const userId = userResponse.data.id || userResponse.data.data?.id;
            
            if (!userId) {
              throw new Error('Could not determine user ID for avatar upload');
            }
            
            // Then use the user-specific avatar endpoint
            response = await apiClient.post(`/${userId}/avatar`, formData, {
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
          // Prioritize avatar_url if available
          if (userData.avatar_url || userData.avatar) {
            // Determine which avatar field to use (prefer avatar_url if available)
            const avatarSource = userData.avatar_url || userData.avatar;
            
            // If it's a URL (not a data URL), store it directly
            if (typeof avatarSource === 'string' && !avatarSource.startsWith('data:')) {
              // Fix the avatar URL if it's a storage path
              let fixedAvatarUrl = avatarSource;
              
              // Handle escaped backslashes in URLs (like "https:\/\/chambersapi.logicera.in\/storage\/avatars\/...")
              if (fixedAvatarUrl.includes('\\/')) {
                // Replace escaped backslashes with forward slashes
                fixedAvatarUrl = fixedAvatarUrl.replace(/\\\//g, '/');
                console.log('Fixed escaped backslashes in avatar URL:', fixedAvatarUrl);
              }
              
              // First, check for duplicate /api prefixes and fix them
              if (fixedAvatarUrl.includes('/api')) {
                // Fix duplicate /api prefixes
                while (fixedAvatarUrl.includes('/api')) {
                  fixedAvatarUrl = fixedAvatarUrl.replace('/api', '/api');
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
                // Convert from /storage/avatars/file.jpg to /storage/avatars/file.jpg
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
              
              // Update both avatar fields in userData for consistency
              userData.avatar = fixedAvatarUrl;
              userData.avatar_url = fixedAvatarUrl;
              
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
      const response = await apiClient.get('/lawyers/', { params });
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
      const response = await apiClient.get(`/lawyers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching lawyer with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Book an appointment with a lawyer
  bookAppointment: async (lawyerId, appointmentData) => {
    console.log('Booking appointment for lawyer ID:', lawyerId);
    try {
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
      const response = await apiClient.post(`/lawyers/${lawyerId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  }
};

// Lawyer Verification API endpoints for User Onboarding
export const lawyerVerificationAPI = {
  // Submit lawyer verification application
  submitVerificationApplication: async (verificationData) => {
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add all text fields
      Object.keys(verificationData).forEach(key => {
        if (verificationData[key] && key !== 'identityDocument' && key !== 'profileImage') {
          if (Array.isArray(verificationData[key])) {
            formData.append(key, JSON.stringify(verificationData[key]));
          } else {
            formData.append(key, verificationData[key]);
          }
        }
      });
      
      // Add file uploads
      if (verificationData.identityDocument) {
        formData.append('identityDocument', verificationData.identityDocument);
      }
      if (verificationData.profileImage) {
        formData.append('profileImage', verificationData.profileImage);
      }
      
      console.log('Submitting lawyer verification application...');
      const response = await apiClient.post('/lawyers/verification/apply', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Lawyer verification application response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error submitting lawyer verification application:', error.response || error);
      throw error;
    }
  },
  
  // Get verification status
  getVerificationStatus: async (applicationId) => {
    try {
      const response = await apiClient.get(`/lawyers/verification/status/${applicationId}`);
      console.log('Verification status response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching verification status:', error.response || error);
      throw error;
    }
  },
  
  // Get list of verified lawyers (admin function)
  getVerificationApplications: async (params = {}) => {
    try {
      const response = await apiClient.get('/lawyers/verification/applications', { params });
      console.log('Verification applications response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching verification applications:', error.response || error);
      throw error;
    }
  },
  
  // Approve or reject verification application (admin function)
  updateVerificationStatus: async (applicationId, status, comments = '') => {
    try {
      const response = await apiClient.post(`/lawyers/verification/applications/${applicationId}/status`, {
        status, // 'approved', 'rejected', 'pending', 'under_review'
        admin_comments: comments
      });
      console.log('Update verification status response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating verification status:', error.response || error);
      throw error;
    }
  },
  
  // Check if Bar Council number is valid/available
  validateBarCouncilNumber: async (barCouncilNumber) => {
    try {
      const response = await apiClient.post('/lawyers/verification/validate-bar-council', {
        bar_council_number: barCouncilNumber
      });
      console.log('Bar Council validation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error validating Bar Council number:', error.response || error);
      throw error;
    }
  },
  
  // Upload additional documents
  uploadVerificationDocument: async (applicationId, documentType, file) => {
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('document_type', documentType);
      
      const response = await apiClient.post(
        `/lawyers/verification/applications/${applicationId}/documents`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Document upload response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error uploading verification document:', error.response || error);
      throw error;
    }
  },
  
  // Get user's own verification application
  getMyVerificationApplication: async () => {
    try {
      const response = await apiClient.get('/lawyers/verification/my-application');
      console.log('My verification application response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching my verification application:', error.response || error);
      throw error;
    }
  }
};

export default apiClient;
