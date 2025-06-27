import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  User, Mail, Phone, MapPin, Calendar, Briefcase, Globe, Camera, Edit3, Save, X, 
  Crown, Shield, Star, Award, Settings, Lock, Bell, Heart, Share2, Download, 
  AlertCircle, CheckCircle, Loader, Code, FileText, MessageSquare, Verified,
  Building, Pencil, Check, Image, Upload, ChevronDown, ChevronUp, Eye, EyeOff,
  Trash2, RefreshCw, Link, Clipboard, Github, Twitter, Linkedin, Facebook,
  Laptop, AlertTriangle
} from 'lucide-react';
import { apiServices } from '../../api/apiService';
import { useSelector } from 'react-redux';
import Toast from '../common/Toast';
import useToast from '../../hooks/useToast';
import ProfileSkeleton from '../common/ProfileSkeleton';
import Avatar from '../common/Avatar';

const UserProfile = () => {
  // Get theme from Redux store
  const { mode } = useSelector((state) => state.theme);
  const isDarkMode = mode === 'dark';
  
  // State management
  const [activeTab, setActiveTab] = useState('profile'); // profile, security, notifications, preferences
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState('personal'); // For mobile accordion
  const [skillInput, setSkillInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Toast notifications
  const { 
    toast, 
    showToast, 
    hideToast, 
    showSuccess, 
    showError, 
    showWarning, 
    showInfo 
  } = useToast();
  
  // Refs
  const fileInputRef = useRef(null);
  const skillInputRef = useRef(null);

  // Demo profile as fallback
  const demoProfile = {
    id: 'demo-001',
    name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New Delhi, India',
    website: 'https://johndoe.dev',
    joinDate: 'January 15, 2023',
    company: 'MeraBakil Legal Solutions',
    bio: 'Legal professional with expertise in corporate law and intellectual property. Passionate about using technology to make legal services more accessible.',
    title: 'Senior Legal Consultant',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    account_type: 'premium',
    email_verified_at: '2023-01-15T10:30:00Z',
    stats: { projects: 24, followers: 1247, following: 189, likes: 3428 },
    skills: ['Corporate Law', 'Intellectual Property', 'Contract Drafting', 'Legal Research', 'Negotiation'],
    achievements: ['Top Legal Advisor 2023', 'Published in Legal Journal', '100+ Cases Resolved'],
    social: {
      twitter: 'https://twitter.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      facebook: 'https://facebook.com/johndoe'
    },
    recentActivity: [
      { id: 'act1', type: 'case', description: 'Successfully resolved Case #12345', date: '2023-06-01' },
      { id: 'act2', type: 'document', description: 'Created new contract template', date: '2023-05-28' },
      { id: 'act3', type: 'consultation', description: 'Provided legal consultation to Client XYZ', date: '2023-05-15' }
    ]
  };

  const [userInfo, setUserInfo] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Show message - updated to use our toast system
  const showMessage = useCallback((type, text, duration = 5000) => {
    const title = type === 'success' ? 'Success!' : 
                 type === 'error' ? 'Error!' : 
                 type === 'warning' ? 'Warning!' : 'Information';
    
    switch(type) {
      case 'success':
        showSuccess(title, text, duration);
        break;
      case 'error':
        showError(title, text, duration);
        break;
      case 'warning':
        showWarning(title, text, duration);
        break;
      case 'info':
      default:
        showInfo(title, text, duration);
        break;
    }
  }, [showSuccess, showError, showWarning, showInfo]);
  
  // Simple function to get avatar URL from API response
  const getAvatarUrl = useCallback((userData) => {
    // Directly use avatar_url if available (preferred method)
    if (userData && userData.avatar_url) {
      console.log('Using avatar_url from API response:', userData.avatar_url);
      return userData.avatar_url;
    }
    
    // Fallback to avatar if avatar_url is not available
    if (userData && userData.avatar) {
      console.log('Using avatar from API response:', userData.avatar);
      return userData.avatar;
    }
    
    // Return null if no avatar is found
    return null;
  }, []);

  // Fetch user data from API - simplified with direct avatar_url usage
  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Get user profile data
      const response = await apiServices.getUserProfile();
      console.log('Profile data fetched successfully:', response);
      
      // Extract the user data from the response
      // API returns data in format: { status: "success", data: {...}, message: "..." }
      const userData = response.data || response;
      
      // Extract skills from API response if available
      let skills = [];
      if (userData.skills) {
        if (Array.isArray(userData.skills)) {
          skills = userData.skills;
        } else if (typeof userData.skills === 'string') {
          // If skills is a comma-separated string
          skills = userData.skills.split(',').map(skill => skill.trim()).filter(Boolean);
        } else if (typeof userData.skills === 'object') {
          // If skills is an object with values
          skills = Object.values(userData.skills).filter(Boolean);
        }
      }
      
      // Extract social links if available
      const social = {
        twitter: userData.twitter_url || userData.social?.twitter || '',
        linkedin: userData.linkedin_url || userData.social?.linkedin || '',
        github: userData.github_url || userData.social?.github || '',
        facebook: userData.facebook_url || userData.social?.facebook || ''
      };
      
      // Get the avatar URL using our helper function
      const avatarUrl = getAvatarUrl(userData);
      
      // Transform API data to match our component structure
      const transformedData = {
        id: userData.id,
        name: userData.name || userData.first_name || '',
        last_name: userData.last_name || userData.surname || '',
        email: userData.email || '',
        phone: userData.phone || userData.phone_number || '',
        location: userData.address || '',
        city: userData.city || '',
        state: userData.state || '',
        country: userData.country || '',
        zip_code: userData.zip_code || userData.postal_code || '',
        website: userData.website || '',
        joinDate: userData.created_at ? new Date(userData.created_at).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) : 'Not available',
        company: userData.company || userData.organization || '',
        bio: userData.bio || userData.about || 'No bio available',
        title: userData.title || userData.job_title || userData.profession || '',
        // Use the avatar URL directly from our helper function
        avatar: avatarUrl,
        account_type: userData.user_type === 1 ? 'Client' : 
                     userData.user_type === 2 ? 'Lawyer' : 
                     userData.user_type_name || userData.account_type || 'User',
        is_verified: userData.is_verified || userData.verified || false,
        email_verified_at: userData.email_verified_at,
        active: userData.active || userData.is_active || true,
        stats: {
          appointments: userData.recent_activity?.appointment_summary?.total || 0,
          queries: userData.recent_activity?.legal_queries?.length || 0,
          reviews: userData.recent_activity?.reviews?.length || 0
        },
        skills: skills,
        achievements: userData.achievements || [],
        social: social,
        appointments: userData.recent_activity?.appointments || [],
        legal_queries: userData.recent_activity?.legal_queries || [],
        reviews: userData.recent_activity?.reviews || []
      };

      setUserInfo(transformedData);
      setEditForm(transformedData);
      // showSuccess('Profile Loaded', 'Your profile information has been loaded successfully');
      
      // Store the avatar URL in localStorage for offline access
      if (avatarUrl) {
        localStorage.setItem('user_avatar', avatarUrl);
      }
      
      // Store the transformed data in localStorage for offline access
      localStorage.setItem('user_profile_transformed', JSON.stringify(transformedData));
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      
      // Try to get from localStorage first before falling back to demo data
      const cachedProfile = localStorage.getItem('user_profile_transformed');
      if (cachedProfile) {
        try {
          const parsedProfile = JSON.parse(cachedProfile);
          setUserInfo(parsedProfile);
          setEditForm(parsedProfile);
          showInfo('Offline Mode', 'Using cached profile data. Some features may be limited.');
        } catch (parseError) {
          console.error('Error parsing cached profile:', parseError);
          setUserInfo(demoProfile);
          setEditForm(demoProfile);
          showError('Profile Error', 'Failed to load your profile. Using demo data instead.');
        }
      } else {
        setUserInfo(demoProfile);
        setEditForm(demoProfile);
        showError('Connection Error', 'Could not connect to the server. Using demo profile data.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [showSuccess, showInfo, showError, getAvatarUrl]);

  // Function to ensure avatar is loaded - simplified
  const ensureAvatarLoaded = useCallback(() => {
    // This function is now much simpler since we're using avatar_url directly
    if (userInfo && !userInfo.avatar) {
      // If no avatar in userInfo, try to get from localStorage
      const cachedAvatar = localStorage.getItem('user_avatar');
      
      if (cachedAvatar) {
        console.log('Restoring avatar from localStorage:', cachedAvatar);
        setUserInfo(prev => ({ ...prev, avatar: cachedAvatar }));
        setEditForm(prev => ({ ...prev, avatar: cachedAvatar }));
      }
    }
  }, [userInfo]);

  useEffect(() => {
    fetchUserData();
    // No need for cleanup as our toast component handles its own timeouts
  }, [fetchUserData]);
  
  // Additional effect to ensure avatar is loaded after profile data is fetched
  useEffect(() => {
    if (!isLoading && userInfo) {
      ensureAvatarLoaded();
    }
  }, [isLoading, userInfo, ensureAvatarLoaded]);

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

  // Helper function to update localStorage with the new avatar - simplified
  const updateLocalStorageWithAvatar = useCallback((avatarUrl) => {
    if (!avatarUrl) return;
    
    // Store the avatar URL in localStorage
    localStorage.setItem('user_avatar', avatarUrl);
    console.log('Avatar URL stored in localStorage:', avatarUrl);
    
    // Update the user object if it exists
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        parsedUser.avatar = avatarUrl;
        localStorage.setItem('user', JSON.stringify(parsedUser));
      } catch (e) {
        console.error('Error updating user avatar in localStorage:', e);
      }
    }
    
    // Update the transformed profile data if it exists
    const storedTransformedProfile = localStorage.getItem('user_profile_transformed');
    if (storedTransformedProfile) {
      try {
        const parsedProfile = JSON.parse(storedTransformedProfile);
        parsedProfile.avatar = avatarUrl;
        localStorage.setItem('user_profile_transformed', JSON.stringify(parsedProfile));
      } catch (e) {
        console.error('Error updating profile avatar in localStorage:', e);
      }
    }
  }, []);

  // Handle image upload - simplified to use avatar_url directly
  const handleImageUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (2MB limit)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      showError(
        'File Too Large', 
        `Image size must be less than 2MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`
      );
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showError(
        'Invalid File Type', 
        `Please select a valid image file (JPEG, PNG, GIF, WebP). You uploaded: ${file.type}`
      );
      return;
    }

    try {
      setIsUploadingAvatar(true);
      
      // Show a loading toast
      showInfo('Uploading Avatar', 'Please wait while we upload your profile picture...', 0);
      
      // Create a local preview immediately for better UX
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result;
        setImagePreview(previewUrl);
      };
      reader.readAsDataURL(file);
      
      // Upload to server
      const result = await apiServices.uploadAvatar(file);
      
      // Hide the loading toast
      hideToast();
      
      // Get the avatar URL from the response using our helper function
      // First check if result has data property (API response format)
      const responseData = result.data || result;
      
      // Try to get avatar_url directly from the response
      let avatarUrl = responseData.avatar_url;
      
      if (avatarUrl) {
        console.log('Using avatar_url from upload response:', avatarUrl);
      } else {
        // If no avatar_url, try to get avatar
        avatarUrl = responseData.avatar;
        console.log('Using avatar from upload response:', avatarUrl);
      }
      
      if (avatarUrl) {
        // Update localStorage with the new avatar URL
        updateLocalStorageWithAvatar(avatarUrl);
        
        // Update the UI with the new avatar
        setUserInfo(prev => ({ ...prev, avatar: avatarUrl }));
        setEditForm(prev => ({ ...prev, avatar: avatarUrl }));
        
        showSuccess('Avatar Updated', 'Your profile picture has been updated successfully!');
      } else {
        // If no avatar URL was returned, try to fetch the profile to get it
        console.log('No avatar URL in upload response, fetching profile');
        try {
          const profileResponse = await apiServices.getUserProfile();
          const profileData = profileResponse.data || profileResponse;
          
          // Try to get avatar_url from profile
          const profileAvatarUrl = profileData.avatar_url || profileData.avatar;
          
          if (profileAvatarUrl) {
            console.log('Using avatar URL from profile:', profileAvatarUrl);
            // Update localStorage with the new avatar URL
            updateLocalStorageWithAvatar(profileAvatarUrl);
            
            // Update the UI with the new avatar
            setUserInfo(prev => ({ ...prev, avatar: profileAvatarUrl }));
            setEditForm(prev => ({ ...prev, avatar: profileAvatarUrl }));
            
            showSuccess('Avatar Updated', 'Your profile picture has been updated successfully!');
          } else {
            // If still no avatar URL, use the local preview
            console.warn('No avatar URL returned from server, using local preview');
            if (imagePreview) {
              updateLocalStorageWithAvatar(imagePreview);
              setUserInfo(prev => ({ ...prev, avatar: imagePreview }));
              setEditForm(prev => ({ ...prev, avatar: imagePreview }));
              
              showWarning(
                'Partial Success', 
                'Your avatar has been saved locally but we couldn\'t get the server URL. It will be synced when you refresh.'
              );
            }
          }
        } catch (profileError) {
          console.error('Failed to fetch profile after avatar upload:', profileError);
          
          // Use the local preview as fallback
          if (imagePreview) {
            updateLocalStorageWithAvatar(imagePreview);
            setUserInfo(prev => ({ ...prev, avatar: imagePreview }));
            setEditForm(prev => ({ ...prev, avatar: imagePreview }));
            
            showWarning(
              'Partial Success', 
              'Your avatar has been uploaded but we couldn\'t verify it. It will appear correctly when you refresh.'
            );
          }
        }
      }
    } catch (error) {
      console.error('Avatar upload failed:', error);
      
      // Hide the loading toast
      hideToast();
      
      // Even if the upload fails, keep the local preview
      if (imagePreview) {
        setUserInfo(prev => ({ ...prev, avatar: imagePreview }));
        setEditForm(prev => ({ ...prev, avatar: imagePreview }));
        showWarning(
          'Offline Mode', 
          'Your avatar has been saved locally but failed to upload to the server. It will be synced when your connection is restored.'
        );
      } else {
        showError(
          'Upload Failed', 
          'We couldn\'t upload your profile picture. Please check your connection and try again.'
        );
      }
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [showSuccess, showError, showWarning, showInfo, hideToast, imagePreview, updateLocalStorageWithAvatar]);

  // Save profile changes - enhanced with better error handling and UX
  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      showError('Validation Error', 'Please fix the errors in the form before saving.');
      return;
    }

    try {
      setIsSaving(true);
      
      // Show a loading toast
      showInfo('Saving Profile', 'Please wait while we update your profile information...', 0);
      
      // Prepare data for API based on your API structure
      const updateData = {
        name: editForm.name,
        last_name: editForm.last_name,
        email: editForm.email,
        phone: editForm.phone,
        address: editForm.location,
        city: editForm.city,
        state: editForm.state,
        country: editForm.country,
        zip_code: editForm.zip_code,
        website: editForm.website,
        company: editForm.company,
        bio: editForm.bio,
        title: editForm.title,
        // Don't send avatar in the JSON payload if it's a data URL
        avatar: editForm.avatar && editForm.avatar.startsWith('data:') ? undefined : editForm.avatar,
        // Format skills based on API expectations
        skills: Array.isArray(editForm.skills) ? editForm.skills : [],
        // Format social links based on API expectations
        social: editForm.social || {
          twitter: '',
          linkedin: '',
          github: '',
          facebook: ''
        }
      };

      // Save to localStorage first for offline capability
      const currentProfile = { ...userInfo, ...updateData };
      localStorage.setItem('user_profile_transformed', JSON.stringify(currentProfile));
      
      // Update user in localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          const updatedUser = {
            ...parsedUser,
            name: updateData.name,
            last_name: updateData.last_name,
            email: updateData.email,
            avatar: editForm.avatar // Use the avatar from editForm to include data URLs
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (e) {
          console.error('Error updating user in localStorage:', e);
        }
      }

      // Send to server
      const updatedProfile = await apiServices.updateUserProfile(updateData);
      
      // Hide the loading toast
      hideToast();
      
      // Transform the response back to our component structure
      const transformedData = {
        ...editForm,
        ...updatedProfile,
        name: updatedProfile.name || updatedProfile.first_name || editForm.name,
        last_name: updatedProfile.last_name || updatedProfile.surname || editForm.last_name,
        // Handle social links
        social: updatedProfile.social || {
          twitter: updatedProfile.twitter_url || editForm.social?.twitter || '',
          linkedin: updatedProfile.linkedin_url || editForm.social?.linkedin || '',
          github: updatedProfile.github_url || editForm.social?.github || '',
          facebook: updatedProfile.facebook_url || editForm.social?.facebook || ''
        },
        // Preserve the avatar if it's not in the response
        avatar: updatedProfile.avatar || updatedProfile.profile_picture || editForm.avatar
      };

      // Update state
      setUserInfo(transformedData);
      setIsEditing(false);
      setImagePreview(null);
      
      // Update localStorage with the server response
      localStorage.setItem('user_profile_transformed', JSON.stringify(transformedData));
      
      showSuccess('Profile Updated', 'Your profile has been updated successfully!');
    } catch (error) {
      console.error('Profile update failed:', error);
      
      // Hide the loading toast
      hideToast();
      
      // Even if the server update fails, keep the local changes
      setUserInfo(prev => ({ ...prev, ...editForm }));
      setIsEditing(false);
      setImagePreview(null);
      
      // Check if it's a validation error from the server
      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        const errorMessage = Object.values(serverErrors).flat().join(', ');
        showError('Validation Error', errorMessage);
      } else if (error.response?.status === 401) {
        showError('Authentication Error', 'Your session has expired. Please log in again.');
      } else if (error.response?.status === 403) {
        showError('Permission Denied', 'You don\'t have permission to update this profile.');
      } else if (!navigator.onLine) {
        showWarning(
          'Offline Mode', 
          'Your profile has been saved locally but couldn\'t be updated on the server. Changes will be synced when your connection is restored.'
        );
      } else {
        showError(
          'Update Failed', 
          'We couldn\'t update your profile on the server. Please try again later.'
        );
      }
    } finally {
      setIsSaving(false);
    }
  }, [editForm, validateForm, showSuccess, showError, showWarning, showInfo, hideToast, userInfo]);

  // Cancel editing - improved with confirmation for unsaved changes
  const handleCancel = useCallback(() => {
    // Check if there are unsaved changes
    const hasChanges = JSON.stringify(editForm) !== JSON.stringify(userInfo);
    
    if (hasChanges && isEditing) {
      // Show confirmation toast
      showWarning(
        'Unsaved Changes', 
        'You have unsaved changes. Are you sure you want to cancel?',
        10000
      );
      
      // We could implement a proper confirmation dialog here,
      // but for now we'll just show a warning toast and proceed
    }
    
    setEditForm(userInfo);
    setImagePreview(null);
    setIsEditing(false);
    setErrors({});
    hideToast(); // Hide any active toasts
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [userInfo, isEditing, editForm, hideToast, showWarning]);

  // Handle share - improved with better error handling and UX
  const handleShare = useCallback(async () => {
    try {
      const shareData = {
        title: `${userInfo.name} ${userInfo.last_name}'s Profile`,
        text: userInfo.bio,
        url: window.location.href
      };

      if (navigator.share) {
        showInfo('Sharing', 'Opening share dialog...', 2000);
        await navigator.share(shareData);
        showSuccess('Shared', 'Profile shared successfully!');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        showSuccess('Link Copied', 'Profile link copied to clipboard!');
      } else {
        showError(
          'Sharing Not Supported', 
          'Your device or browser doesn\'t support sharing. Try copying the URL manually.'
        );
      }
    } catch (error) {
      console.error('Share error:', error);
      if (error.name !== 'AbortError') {
        if (error.name === 'NotAllowedError') {
          showWarning('Share Cancelled', 'You cancelled the share operation.');
        } else {
          showError('Share Failed', 'We couldn\'t share your profile. Please try again.');
        }
      }
    }
  }, [userInfo, showSuccess, showError, showWarning, showInfo]);

  // Handle export - improved with better error handling and UX
  const handleExport = useCallback(() => {
    try {
      showInfo('Preparing Export', 'Preparing your profile data for export...', 2000);
      
      const exportData = {
        ...userInfo,
        exportDate: new Date().toISOString(),
        exportVersion: '1.0',
        exportSource: 'MeraBakil Legal Solutions'
      };
      
      // Remove any circular references or large data
      const sanitizedData = {
        ...exportData,
        avatar: exportData.avatar && exportData.avatar.startsWith('data:') 
          ? '[Base64 Image Data Removed]' 
          : exportData.avatar
      };
      
      const dataStr = JSON.stringify(sanitizedData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      
      // Format filename with date for better organization
      const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const safeFileName = `${userInfo.name || 'User'}_${userInfo.last_name || ''}_Profile_${date}`.replace(/\s+/g, '_');
      
      linkElement.setAttribute('download', `${safeFileName}.json`);
      linkElement.click();
      
      showSuccess('Export Complete', 'Your profile data has been exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      showError(
        'Export Failed', 
        'We couldn\'t export your profile data. Please try again later.'
      );
    }
  }, [userInfo, showSuccess, showError, showInfo]);

  // Handle form input changes
  const handleInputChange = useCallback((field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);
  
  // Handle social media input changes
  const handleSocialInputChange = useCallback((platform, value) => {
    setEditForm(prev => ({
      ...prev,
      social: {
        ...prev.social,
        [platform]: value
      }
    }));
  }, []);
  
  // Add a new skill
  const handleAddSkill = useCallback(() => {
    if (!skillInput.trim()) return;
    
    // Check if skill already exists
    if (editForm.skills?.includes(skillInput.trim())) {
      showMessage('error', 'This skill already exists');
      return;
    }
    
    setEditForm(prev => ({
      ...prev,
      skills: [...(prev.skills || []), skillInput.trim()]
    }));
    
    setSkillInput('');
    if (skillInputRef.current) {
      skillInputRef.current.focus();
    }
  }, [skillInput, editForm.skills, showMessage]);
  
  // Remove a skill
  const handleRemoveSkill = useCallback((skillToRemove) => {
    setEditForm(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  }, []);
  
  // Handle skill input keypress (add on Enter)
  const handleSkillKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  }, [handleAddSkill]);

  // Loading state - improved with skeleton loading
  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/5 mt-2 animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Card Skeleton */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <ProfileSkeleton />
              </div>
            </div>
            
            {/* Right Column - Details Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information Skeleton */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Skills Skeleton */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-24"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 rounded-xl bg-white dark:bg-gray-800 shadow-xl max-w-md w-full animate-bounce-in">
          <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Failed to Load Profile</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">We couldn't load your profile information. This could be due to a network issue or server problem.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={fetchUserData}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Retry
            </button>
            <button 
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-md flex items-center justify-center"
            >
              <X className="w-4 h-4 mr-2" /> Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main UI
  return (
    <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300 relative`}>
      {/* Toast Notification */}
      <Toast toast={toast} onClose={hideToast} />
      
      {/* Close Button */}
      <button 
        onClick={() => window.history.back()}
        className="fixed top-24 right-6 z-40 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 group"
        aria-label="Close profile"
      >
        <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your personal information and account settings</p>
        </div>

        {/* Tabs - Desktop */}
        <div className="hidden md:flex mb-8 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 font-medium text-sm focus:outline-none ${
              activeTab === 'profile'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-6 py-3 font-medium text-sm focus:outline-none ${
              activeTab === 'security'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Lock className="w-4 h-4 inline mr-2" />
            Security
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-6 py-3 font-medium text-sm focus:outline-none ${
              activeTab === 'notifications'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Bell className="w-4 h-4 inline mr-2" />
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-6 py-3 font-medium text-sm focus:outline-none ${
              activeTab === 'preferences'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Preferences
          </button>
        </div>

        {/* Tabs - Mobile */}
        <div className="md:hidden mb-6">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
          >
            <option value="profile">Profile</option>
            <option value="security">Security</option>
            <option value="notifications">Notifications</option>
            <option value="preferences">Preferences</option>
          </select>
        </div>

        {/* Profile Tab Content */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                {/* Profile Header with Cover Image */}
                <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                  {userInfo.account_type === 'Lawyer' && (
                    <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                      <Briefcase className="w-3 h-3 mr-1" /> Legal Professional
                    </div>
                  )}
                  
                  {!isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="absolute top-4 left-4 bg-white bg-opacity-20 text-white p-2 rounded-full hover:bg-opacity-30 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="absolute top-4 left-4 flex space-x-2">
                      <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors disabled:opacity-50 shadow-md"
                      >
                        {isSaving ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50 shadow-md"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Avatar */}
                <div className="relative -mt-16 px-6">
                  <div className="relative inline-block">
                    <Avatar
                      src={imagePreview || userInfo.avatar}
                      alt={`${userInfo.name} ${userInfo.last_name}`}
                      size={128}
                      className="border-4 border-white dark:border-gray-800 shadow-md transition-all duration-300 hover:shadow-lg"
                      style={{
                        objectFit: 'cover',
                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                        <Camera className="w-4 h-4" />
                        <input 
                          ref={fileInputRef} 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload} 
                          className="hidden" 
                        />
                      </label>
                    )}
                    
                    {isUploadingAvatar && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <Loader className="w-6 h-6 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Profile Info */}
                <div className="px-6 py-4">
                  {isEditing ? (
                    <div className="space-y-3 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={editForm.name || ''}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={editForm.last_name || ''}
                          onChange={(e) => handleInputChange('last_name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Job Title
                        </label>
                        <input
                          type="text"
                          value={editForm.title || ''}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{userInfo.name} {userInfo.last_name}</h2>
                      <p className="text-blue-600 dark:text-blue-400">{userInfo.title || 'No title specified'}</p>
                    </>
                  )}
                  
                  <div className="mt-4">
                    {isEditing ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Bio
                        </label>
                        <textarea
                          value={editForm.bio || ''}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          rows="4"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        ></textarea>
                      </div>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{userInfo.bio}</p>
                    )}
                  </div>
                  
                  {/* Stats */}
                  <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{userInfo.stats.appointments.toLocaleString()}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Appointments</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{userInfo.stats.queries.toLocaleString()}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Queries</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{userInfo.stats.reviews.toLocaleString()}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Reviews</p>
                    </div>
                  </div>
                  
                  {/* Social Links */}
                  <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Social Profiles</h3>
                    
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Linkedin className="w-5 h-5 text-blue-600 mr-2" />
                          <input
                            type="url"
                            placeholder="LinkedIn URL"
                            value={editForm.social?.linkedin || ''}
                            onChange={(e) => handleSocialInputChange('linkedin', e.target.value)}
                            className="flex-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="flex items-center">
                          <Twitter className="w-5 h-5 text-blue-400 mr-2" />
                          <input
                            type="url"
                            placeholder="Twitter URL"
                            value={editForm.social?.twitter || ''}
                            onChange={(e) => handleSocialInputChange('twitter', e.target.value)}
                            className="flex-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="flex items-center">
                          <Github className="w-5 h-5 text-gray-800 dark:text-white mr-2" />
                          <input
                            type="url"
                            placeholder="GitHub URL"
                            value={editForm.social?.github || ''}
                            onChange={(e) => handleSocialInputChange('github', e.target.value)}
                            className="flex-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="flex items-center">
                          <Facebook className="w-5 h-5 text-blue-800 mr-2" />
                          <input
                            type="url"
                            placeholder="Facebook URL"
                            value={editForm.social?.facebook || ''}
                            onChange={(e) => handleSocialInputChange('facebook', e.target.value)}
                            className="flex-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center space-x-4">
                        {userInfo.social?.linkedin && (
                          <a href={userInfo.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                            <Linkedin className="w-5 h-5" />
                          </a>
                        )}
                        {userInfo.social?.twitter && (
                          <a href={userInfo.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400 dark:text-gray-400 dark:hover:text-blue-400">
                            <Twitter className="w-5 h-5" />
                          </a>
                        )}
                        {userInfo.social?.github && (
                          <a href={userInfo.social.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
                            <Github className="w-5 h-5" />
                          </a>
                        )}
                        {userInfo.social?.facebook && (
                          <a href={userInfo.social.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-800 dark:text-gray-400 dark:hover:text-blue-400">
                            <Facebook className="w-5 h-5" />
                          </a>
                        )}
                        {!userInfo.social?.linkedin && !userInfo.social?.twitter && !userInfo.social?.github && !userInfo.social?.facebook && !isEditing && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">No social profiles added</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  {!isEditing && (
                    <div className="mt-6 flex space-x-3">
                      <button 
                        onClick={handleShare} 
                        className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                      >
                        <Share2 className="w-4 h-4 mr-2" /> Share
                      </button>
                      <button 
                        onClick={handleExport} 
                        className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                      >
                        <Download className="w-4 h-4 mr-2" /> Export
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Member Since Card */}
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Member Since</h3>
                    <p className="text-gray-900 dark:text-white font-medium">{userInfo.joinDate}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Contact Information</h2>
                  {!isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center text-sm"
                    >
                      <Pencil className="w-4 h-4 mr-1" /> Edit
                    </button>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email */}
                    <div>
                      {isEditing ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            value={editForm.email || ''}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                          />
                          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                        </div>
                      ) : (
                        <div className="flex">
                          <Mail className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                            <p className="text-gray-900 dark:text-white">{userInfo.email}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Phone */}
                    <div>
                      {isEditing ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={editForm.phone || ''}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                          />
                          {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                        </div>
                      ) : (
                        <div className="flex">
                          <Phone className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                            <p className="text-gray-900 dark:text-white">{userInfo.phone || 'Not specified'}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Location */}
                    <div>
                      {isEditing ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Address
                          </label>
                          <input
                            type="text"
                            value={editForm.location || ''}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-2"
                            placeholder="Street address"
                          />
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <input
                              type="text"
                              value={editForm.city || ''}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="City"
                            />
                            <input
                              type="text"
                              value={editForm.state || ''}
                              onChange={(e) => handleInputChange('state', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="State/Province"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={editForm.country || ''}
                              onChange={(e) => handleInputChange('country', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="Country"
                            />
                            <input
                              type="text"
                              value={editForm.zip_code || ''}
                              onChange={(e) => handleInputChange('zip_code', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="Zip/Postal Code"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex">
                          <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                            <p className="text-gray-900 dark:text-white">
                              {userInfo.location ? (
                                <>
                                  {userInfo.location}
                                  {(userInfo.city || userInfo.state || userInfo.country) && (
                                    <span className="block mt-1 text-sm">
                                      {[
                                        userInfo.city,
                                        userInfo.state,
                                        userInfo.country,
                                        userInfo.zip_code
                                      ].filter(Boolean).join(', ')}
                                    </span>
                                  )}
                                </>
                              ) : (
                                'Not specified'
                              )}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Website */}
                    <div>
                      {isEditing ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Website
                          </label>
                          <input
                            type="url"
                            value={editForm.website || ''}
                            onChange={(e) => handleInputChange('website', e.target.value)}
                            className={`w-full px-3 py-2 border ${errors.website ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                          />
                          {errors.website && <p className="mt-1 text-sm text-red-500">{errors.website}</p>}
                        </div>
                      ) : (
                        <div className="flex">
                          <Globe className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Website</p>
                            {userInfo.website ? (
                              <a 
                                href={userInfo.website} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                {userInfo.website}
                              </a>
                            ) : (
                              <p className="text-gray-900 dark:text-white">Not specified</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Company */}
                    <div>
                      {isEditing ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Company
                          </label>
                          <input
                            type="text"
                            value={editForm.company || ''}
                            onChange={(e) => handleInputChange('company', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      ) : (
                        <div className="flex">
                          <Building className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Company</p>
                            <p className="text-gray-900 dark:text-white">{userInfo.company || 'Not specified'}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Skills */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Skills</h2>
                  {!isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center text-sm"
                    >
                      <Pencil className="w-4 h-4 mr-1" /> Edit
                    </button>
                  )}
                </div>
                
                <div className="p-6">
                  {isEditing ? (
                    <div>
                      <div className="flex mb-4">
                        <input
                          type="text"
                          ref={skillInputRef}
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyPress={handleSkillKeyPress}
                          placeholder="Add a skill..."
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <button
                          onClick={handleAddSkill}
                          className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none"
                        >
                          Add
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {editForm.skills?.length > 0 ? (
                          editForm.skills.map((skill, index) => (
                            <div 
                              key={index} 
                              className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm flex items-center"
                            >
                              {skill}
                              <button 
                                onClick={() => handleRemoveSkill(skill)}
                                className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 focus:outline-none"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400 text-sm">No skills added yet</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {userInfo.skills?.length > 0 ? (
                        userInfo.skills.map((skill, index) => (
                          <span 
                            key={index} 
                            className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No skills added yet</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Achievements */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Achievements</h2>
                </div>
                
                <div className="p-6">
                  {userInfo.achievements?.length > 0 ? (
                    <ul className="space-y-3">
                      {userInfo.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start">
                          <Award className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />
                          <span className="text-gray-900 dark:text-white">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No achievements added yet</p>
                  )}
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
                </div>
                
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {userInfo.recentActivity?.length > 0 ? (
                    userInfo.recentActivity.map((activity) => (
                      <div key={activity.id} className="p-6 flex items-start">
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-4">
                          {activity.type === 'case' ? (
                            <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          ) : activity.type === 'document' ? (
                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-gray-900 dark:text-white">{activity.description}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activity.date}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6">
                      <p className="text-gray-500 dark:text-gray-400 text-sm">No recent activity</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Security Tab Content */}
        {activeTab === 'security' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Security Settings</h2>
            </div>
            
            <div className="p-6">
              <p className="text-gray-500 dark:text-gray-400 mb-6">Manage your account security settings and connected devices</p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Change Password</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Enter current password"
                        />
                        <button 
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter new password"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Confirm new password"
                      />
                    </div>
                    
                    <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none">
                      Update Password
                    </button>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Add an extra layer of security to your account by enabling two-factor authentication
                  </p>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none">
                    Enable 2FA
                  </button>
                </div>
                
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Connected Devices</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Devices that have logged into your account
                  </p>
                  
                  <div className="mt-3 space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3">
                          <Laptop className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">MacBook Pro</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Last active: Today</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Current</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Notifications Tab Content */}
        {activeTab === 'notifications' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Notification Preferences</h2>
            </div>
            
            <div className="p-6">
              <p className="text-gray-500 dark:text-gray-400 mb-6">Manage how and when you receive notifications</p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Email Notifications</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-900 dark:text-white">Account updates</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive emails about your account activity</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-900 dark:text-white">New messages</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive emails when you get new messages</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-900 dark:text-white">Marketing emails</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive promotional emails and updates</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Push Notifications</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-900 dark:text-white">New messages</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive push notifications for new messages</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-900 dark:text-white">Account activity</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive push notifications for account activity</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Preferences Tab Content */}
        {activeTab === 'preferences' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Account Preferences</h2>
            </div>
            
            <div className="p-6">
              <p className="text-gray-500 dark:text-gray-400 mb-6">Customize your account settings and preferences</p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Language</h3>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="hi">हिन्दी</option>
                  </select>
                </div>
                
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Time Zone</h3>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="IST">IST (Indian Standard Time)</option>
                    <option value="EST">EST (Eastern Standard Time)</option>
                    <option value="PST">PST (Pacific Standard Time)</option>
                    <option value="GMT">GMT (Greenwich Mean Time)</option>
                  </select>
                </div>
                
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Privacy</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-900 dark:text-white">Profile visibility</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Make your profile visible to others</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-900 dark:text-white">Show online status</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Let others see when you're online</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Account Actions</h3>
                  
                  <div className="space-y-3">
                    <button className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none flex items-center justify-center">
                      <RefreshCw className="w-4 h-4 mr-2" /> Request Data Export
                    </button>
                    
                    <button className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none flex items-center justify-center">
                      <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;