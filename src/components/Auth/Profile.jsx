import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  User, Mail, Phone, MapPin, Calendar, Briefcase, Globe, Camera, Edit3, Save, X, 
  Crown, Shield, Star, Award, Settings, Lock, Bell, Heart, Share2, Download, 
  AlertCircle, CheckCircle, Loader2, Code, FileText, MessageSquare, Verified
} from 'lucide-react';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// API Service
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthToken() {
    return localStorage.getItem('auth_token');
  }

  getHeaders() {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          throw new Error('Authentication failed');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User Profile APIs
  async getUserProfile() {
    return this.request('/user/profile');
  }

  async updateUserProfile(userData) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const token = this.getAuthToken();
    const response = await fetch(`${this.baseURL}/user/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  }

  async getUser() {
    return this.request('/user');
  }
}

const apiService = new ApiService();

const UserProfile = () => {
  const [isDarkMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});
  const messageTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  // Demo profile as fallback
  const demoProfile = {
    id: 'demo-001',
    name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    joinDate: 'January 15, 2023',
    company: 'Tech Solutions Inc.',
    bio: 'Full-stack developer passionate about creating innovative solutions.',
    title: 'Senior Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    account_type: 'premium',
    email_verified_at: '2023-01-15T10:30:00Z',
    stats: { projects: 24, followers: 1247, following: 189, likes: 3428 },
    skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
    achievements: ['Top Contributor 2024', 'Hackathon Winner'],
    recentActivity: [
      { id: 'act1', type: 'project', description: 'Completed Project X', date: '2025-06-01' },
      { id: 'act2', type: 'comment', description: 'Commented on Project Y', date: '2025-05-28' }
    ]
  };

  const [userInfo, setUserInfo] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Fetch user data from API
  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Try to get user profile first
      let userData;
      try {
        userData = await apiService.getUserProfile();
      } catch (profileError) {
        // If profile endpoint fails, try general user endpoint
        console.log('Profile endpoint failed, trying user endpoint');
        userData = await apiService.getUser();
      }
      
      // Transform API data to match our component structure
      const transformedData = {
        id: userData.id,
        name: userData.name || userData.first_name || '',
        last_name: userData.last_name || userData.surname || '',
        email: userData.email || '',
        phone: userData.phone || userData.phone_number || '',
        location: userData.location || userData.address || '',
        website: userData.website || userData.website_url || '',
        joinDate: userData.created_at ? new Date(userData.created_at).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) : 'Not available',
        company: userData.company || userData.organization || '',
        bio: userData.bio || userData.description || 'No bio available',
        title: userData.title || userData.job_title || userData.position || '',
        avatar: userData.avatar || userData.profile_image || userData.photo || null,
        account_type: userData.account_type || userData.subscription || 'free',
        email_verified_at: userData.email_verified_at,
        stats: {
          projects: userData.projects_count || 0,
          followers: userData.followers_count || 0,
          following: userData.following_count || 0,
          likes: userData.likes_count || 0
        },
        skills: userData.skills || [],
        achievements: userData.achievements || [],
        recentActivity: userData.recent_activity || []
      };

      setUserInfo(transformedData);
      setEditForm(transformedData);
      showMessage('success', 'Profile loaded successfully');
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setUserInfo(demoProfile);
      setEditForm(demoProfile);
      showMessage('error', 'Failed to load profile. Using demo data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
    return () => {
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    };
  }, [fetchUserData]);

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!editForm.name?.trim()) {
      newErrors.name = 'First name is required';
    }
    
    if (!editForm.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (editForm.phone && !/^[+]?[1-9][\d\s\-\(\)]{7,15}$/.test(editForm.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    
    if (editForm.website && !/^https?:\/\/.+\..+/.test(editForm.website)) {
      newErrors.website = 'Invalid URL format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [editForm]);

  // Show message
  const showMessage = useCallback((type, text, duration = 5000) => {
    setMessage({ type, text });
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    if (duration > 0) {
      messageTimeoutRef.current = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, duration);
    }
  }, []);

  // Handle image upload
  const handleImageUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      showMessage('error', 'Image size must be less than 2MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showMessage('error', 'Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    try {
      setIsUploadingAvatar(true);
      
      const result = await apiService.uploadAvatar(file);
      
      const avatarUrl = result.avatar_url || result.url || result.path;
      setImagePreview(avatarUrl);
      setUserInfo(prev => ({ ...prev, avatar: avatarUrl }));
      setEditForm(prev => ({ ...prev, avatar: avatarUrl }));
      showMessage('success', 'Avatar updated successfully!');
    } catch (error) {
      console.error('Avatar upload failed:', error);
      showMessage('error', 'Failed to upload avatar. Please try again.');
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [showMessage]);

  // Save profile changes
  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      showMessage('error', 'Please fix the errors in the form');
      return;
    }

    try {
      setIsSaving(true);
      
      // Prepare data for API
      const updateData = {
        name: editForm.name,
        last_name: editForm.last_name,
        email: editForm.email,
        phone: editForm.phone,
        location: editForm.location,
        website: editForm.website,
        company: editForm.company,
        bio: editForm.bio,
        title: editForm.title,
        avatar: editForm.avatar
      };

      const updatedProfile = await apiService.updateUserProfile(updateData);
      
      // Transform the response back to our component structure
      const transformedData = {
        ...editForm,
        ...updatedProfile,
        name: updatedProfile.name || updatedProfile.first_name || editForm.name,
        last_name: updatedProfile.last_name || updatedProfile.surname || editForm.last_name,
      };

      setUserInfo(transformedData);
      setIsEditing(false);
      setImagePreview(null);
      showMessage('success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Profile update failed:', error);
      showMessage('error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [editForm, validateForm, showMessage]);

  // Cancel editing
  const handleCancel = useCallback(() => {
    setEditForm(userInfo);
    setImagePreview(null);
    setIsEditing(false);
    setErrors({});
    setMessage({ type: '', text: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [userInfo]);

  // Handle share
  const handleShare = useCallback(async () => {
    try {
      const shareData = {
        title: `${userInfo.name} ${userInfo.last_name}'s Profile`,
        text: userInfo.bio,
        url: window.location.href
      };

      if (navigator.share) {
        await navigator.share(shareData);
        showMessage('success', 'Profile shared successfully!');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        showMessage('success', 'Profile link copied to clipboard!');
      } else {
        showMessage('error', 'Sharing not supported on this device');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        showMessage('error', 'Failed to share profile');
      }
    }
  }, [userInfo, showMessage]);

  // Handle export
  const handleExport = useCallback(() => {
    try {
      const exportData = {
        ...userInfo,
        exportDate: new Date().toISOString(),
        exportVersion: '1.0'
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', `${userInfo.name}_${userInfo.last_name}_profile.json`);
      linkElement.click();
      showMessage('success', 'Profile exported successfully!');
    } catch (error) {
      showMessage('error', 'Failed to export profile');
    }
  }, [userInfo, showMessage]);

  // Handle form input changes
  const handleInputChange = useCallback((field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load profile</p>
          <button 
            onClick={fetchUserData}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen mt-20 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} p-4 sm:p-6 md:p-8 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto">
        {/* Message Alert */}
        {message.text && (
          <div className={`fixed top-4 right-4 max-w-sm w-full p-4 rounded-lg shadow-lg flex items-center space-x-2 z-50 ${
            message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`} role="alert">
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="flex-1">{message.text}</span>
            <button 
              onClick={() => setMessage({ type: '', text: '' })} 
              className="ml-auto p-1 rounded-full hover:bg-white hover:bg-opacity-20"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 sm:p-8 transform hover:scale-105 transition-transform duration-300`}>
              <div className="relative mb-6">
                <img
                  src={imagePreview || userInfo.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.name + ' ' + userInfo.last_name)}&size=150&background=0ea5e9&color=ffffff`}
                  alt="Profile"
                  className="w-32 h-32 mx-auto rounded-full object-cover shadow-md"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.name + ' ' + userInfo.last_name)}&size=150&background=0ea5e9&color=ffffff`;
                  }}
                />
                {isEditing && (
                  <div className="absolute bottom-0 right-1/4 flex space-x-2">
                    <label className="bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                      <Camera className="w-4 h-4" />
                      <input 
                        ref={fileInputRef} 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="hidden" 
                      />
                    </label>
                    {userInfo.avatar && (
                      <button 
                        onClick={() => handleInputChange('avatar', null)} 
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
                {userInfo.account_type === 'premium' && (
                  <span className="absolute top-0 right-1/4 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                    <Crown className="w-3 h-3 mr-1" /> Premium
                  </span>
                )}
              </div>
              
              <h2 className="text-2xl font-bold text-center">{userInfo.name} {userInfo.last_name}</h2>
              <p className="text-blue-500 text-center mb-4">{userInfo.title}</p>
              <p className="text-center text-sm text-gray-500 mb-6">{userInfo.bio}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <p className="font-bold">{userInfo.stats.followers.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Followers</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">{userInfo.stats.following}</p>
                  <p className="text-sm text-gray-500">Following</p>
                </div>
              </div>
              
              {!isEditing ? (
                <div className="space-y-3">
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center transition-colors"
                  >
                    <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={handleShare} 
                      className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} py-2 rounded-lg flex items-center justify-center transition-colors`}
                    >
                      <Share2 className="w-4 h-4 mr-2" /> Share
                    </button>
                    <button 
                      onClick={handleExport} 
                      className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} py-2 rounded-lg flex items-center justify-center transition-colors`}
                    >
                      <Download className="w-4 h-4 mr-2" /> Export
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleSave} 
                    disabled={isSaving} 
                    className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    onClick={handleCancel} 
                    disabled={isSaving} 
                    className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 sm:p-8`}>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-500" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoRow 
                  icon={User} 
                  label="First Name" 
                  value={userInfo.name} 
                  isEditing={isEditing} 
                  field="name" 
                  required 
                  editForm={editForm}
                  handleInputChange={handleInputChange}
                  errors={errors}
                  isDarkMode={isDarkMode}
                />
                <InfoRow 
                  icon={User} 
                  label="Last Name" 
                  value={userInfo.last_name} 
                  isEditing={isEditing} 
                  field="last_name" 
                  editForm={editForm}
                  handleInputChange={handleInputChange}
                  errors={errors}
                  isDarkMode={isDarkMode}
                />
                <InfoRow 
                  icon={Mail} 
                  label="Email" 
                  value={userInfo.email} 
                  isEditing={isEditing} 
                  field="email" 
                  type="email" 
                  required 
                  editForm={editForm}
                  handleInputChange={handleInputChange}
                  errors={errors}
                  isDarkMode={isDarkMode}
                />
                <InfoRow 
                  icon={Phone} 
                  label="Phone" 
                  value={userInfo.phone} 
                  isEditing={isEditing} 
                  field="phone" 
                  type="tel" 
                  editForm={editForm}
                  handleInputChange={handleInputChange}
                  errors={errors}
                  isDarkMode={isDarkMode}
                />
                <InfoRow 
                  icon={MapPin} 
                  label="Location" 
                  value={userInfo.location} 
                  isEditing={isEditing} 
                  field="location" 
                  editForm={editForm}
                  handleInputChange={handleInputChange}
                  errors={errors}
                  isDarkMode={isDarkMode}
                />
                <InfoRow 
                  icon={Globe} 
                  label="Website" 
                  value={userInfo.website} 
                  isEditing={isEditing} 
                  field="website" 
                  type="url" 
                  editForm={editForm}
                  handleInputChange={handleInputChange}
                  errors={errors}
                  isDarkMode={isDarkMode}
                />
                <InfoRow 
                  icon={Briefcase} 
                  label="Company" 
                  value={userInfo.company} 
                  isEditing={isEditing} 
                  field="company" 
                  editForm={editForm}
                  handleInputChange={handleInputChange}
                  errors={errors}
                  isDarkMode={isDarkMode}
                />
                <InfoRow 
                  icon={Award} 
                  label="Job Title" 
                  value={userInfo.title} 
                  isEditing={isEditing} 
                  field="title" 
                  editForm={editForm}
                  handleInputChange={handleInputChange}
                  errors={errors}
                  isDarkMode={isDarkMode}
                />
                <InfoRow 
                  icon={Calendar} 
                  label="Member Since" 
                  value={userInfo.joinDate} 
                  isEditing={false} 
                  field="joinDate" 
                  editForm={editForm}
                  handleInputChange={handleInputChange}
                  errors={errors}
                  isDarkMode={isDarkMode}
                />
              </div>
              
              {isEditing && (
                <div className="mt-4 pt-4 border-t">
                  <InfoRow 
                    icon={FileText} 
                    label="Bio" 
                    value={userInfo.bio} 
                    isEditing={isEditing} 
                    field="bio" 
                    type="textarea" 
                    editForm={editForm}
                    handleInputChange={handleInputChange}
                    errors={errors}
                    isDarkMode={isDarkMode}
                  />
                </div>
              )}
            </div>

            {/* Skills & Achievements */}
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 sm:p-8`}>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-blue-500" /> Skills & Achievements
              </h3>
              <div className="mb-4">
                <h4 className="font-semibold flex items-center mb-2">
                  <Code className="w-4 h-4 mr-2" /> Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {userInfo.skills?.length > 0 ? (
                    userInfo.skills.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No skills added yet</span>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-semibold flex items-center mb-2">
                  <Award className="w-4 h-4 mr-2" /> Achievements
                </h4>
                {userInfo.achievements?.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {userInfo.achievements.map((achievement, index) => (
                      <li key={index} className="text-sm">{achievement}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-500 text-sm">No achievements added yet</span>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 sm:p-8`}>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-500" /> Recent Activity
              </h3>
              <div className="space-y-3">
                {userInfo.recentActivity?.length > 0 ? (
                  userInfo.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <MessageSquare className="w-4 h-4 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No recent activity</p>
                )}
              </div>
            </div>
            
            {/* Account Settings */}
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 sm:p-8`}>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-blue-500" /> Account Settings
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3">
                  <Lock className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Privacy Settings</p>
                    <p className="text-sm text-gray-500">Manage your privacy</p>
                  </div>
                </button>
                <button className="p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Notifications</p>
                    <p className="text-sm text-gray-500">Configure alerts</p>
                  </div>
                </button>
                <button className="p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3">
                  <Verified className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Verification</p>
                    <p className="text-sm text-gray-500">Verify your account</p>
                  </div>
                </button>
                <button className="p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3">
                  <Crown className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Subscription</p>
                    <p className="text-sm text-gray-500">Manage your plan</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function InfoRow({ icon: Icon, label, value, isEditing, field, type = 'text', required = false }) {
    const handleChange = (e) => setEditForm(prev => ({ ...prev, [field]: e.target.value }));
    return (
      <div className="flex flex-col">
        <label className="text-sm text-gray-500 flex items-center">
          <Icon className="w-4 h-4 mr-2" /> {label} {required && <span className="text-red-500">*</span>}
        </label>
        {isEditing ? (
          <div>
            {type === 'textarea' ? (
              <textarea
                value={editForm[field] || ''}
                onChange={handleChange}
                className={`mt-1 p-2 w-full rounded-lg border ${errors[field] ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                rows="3"
              />
            ) : (
              <input
                type={type}
                value={editForm[field] || ''}
                onChange={handleChange}
                className={`mt-1 p-2 w-full rounded-lg border ${errors[field] ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
              />
            )}
            {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
          </div>
        ) : (
          <p className="mt-1">{value || 'Not specified'}</p>
        )}
      </div>
    );
  }
};

export default UserProfile;