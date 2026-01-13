import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Calendar, Briefcase, Globe, Camera, X,
  Award, Settings, Lock, Bell, Share2, Download,
  AlertCircle, Loader, FileText, MessageSquare, MessageCircle,
  Building, Pencil, Check, CheckCircle, Eye, EyeOff,
  Trash2, RefreshCw, Github, Twitter, Linkedin, Facebook,
  Laptop, Video, Clock, Star, ArrowRight, ChevronRight,
  Sparkles, Shield, Lock as LockIcon, Zap
} from 'lucide-react';
import { apiServices } from '../../api/apiService';
import { useSelector } from 'react-redux';
import Toast from '../common/Toast';
import useToast from '../../hooks/useToast';



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
  // const [activeSection, setActiveSection] = useState('personal'); // For mobile accordion
  const [skillInput, setSkillInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Toast notifications
  const {
    toast,
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
  const demoProfile = useMemo(() => ({
    id: 'demo-001',
    name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: 'Sector 15',
    location: 'New Delhi, India',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    zip_code: '110001',
    joinDate: 'January 15, 2023',
    bio: 'Legal professional with expertise in corporate law and intellectual property. Passionate about using technology to make legal services more accessible.',
    title: 'Senior Legal Consultant',
    avatar_url: null, // No default avatar - will show initials
    account_type: 'premium',
    email_verified_at: '2023-01-15T10:30:00Z',
    stats: { projects: 24, followers: 1247, following: 189, likes: 3428 },
    skills: ['Corporate Law', 'Intellectual Property', 'Contract Drafting', 'Legal Research', 'Negotiation'],
    achievements: ['Top Legal Advisor 2023', 'Published in Legal Journal', '100+ Cases Resolved'],
    social: {
      twitter: 'https://twitter.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      facebook: 'https://facebook.com/johndoe',
    },
    recentActivity: [
      { id: 'act1', type: 'case', description: 'Successfully resolved Case #12345', date: '2023-06-01' },
      { id: 'act2', type: 'document', description: 'Created new contract template', date: '2023-05-28' },
      { id: 'act3', type: 'consultation', description: 'Provided legal consultation to Client XYZ', date: '2023-05-15' }
    ]
  }), []);

  const [userInfo, setUserInfo] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState([]);
  const [showQueriesModal, setShowQueriesModal] = useState(false);
  const [queriesDetails, setQueriesDetails] = useState([]);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [reviewsDetails, setReviewsDetails] = useState([]);

  // Show message - updated to use our toast system
  const showMessage = useCallback((type, text, duration = 5000) => {
    const title = type === 'success' ? 'Success!' :
      type === 'error' ? 'Error!' :
        type === 'warning' ? 'Warning!' : 'Information';

    switch (type) {
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



  // Background fetch without showing loading state
  const fetchUserDataInBackground = useCallback(async () => {
    try {
      const response = await apiServices.getUserProfile();
      const userData = response.data || response;

      let skills = [];
      if (userData.skills) {
        if (Array.isArray(userData.skills)) {
          skills = userData.skills;
        } else if (typeof userData.skills === 'string') {
          skills = userData.skills.split(',').map(skill => skill.trim()).filter(Boolean);
        } else if (typeof userData.skills === 'object') {
          skills = Object.values(userData.skills).filter(Boolean);
        }
      }

      const social = {
        twitter: userData.twitter_url || userData.social?.twitter || '',
        linkedin: userData.linkedin_url || userData.social?.linkedin || '',
        github: userData.github_url || userData.social?.github || '',
        facebook: userData.facebook_url || userData.social?.facebook || ''
      };

      const transformedData = {
        id: userData.id,
        name: userData.name || userData.first_name || '',
        last_name: userData.last_name || userData.surname || '',
        email: userData.email || '',
        phone: userData.phone || userData.phone_number || '',
        address: userData.address || '',
        location: userData.full_address || '',
        city: userData.city || '',
        state: userData.state || '',
        country: userData.country || '',
        zip_code: userData.zip_code || userData.postal_code || '',
        joinDate: userData.created_at ? new Date(userData.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : 'Not available',
        bio: userData.bio || userData.about || 'No bio available',
        title: userData.title || userData.job_title || userData.profession || '',
        avatar_url: userData.avatar_url || null,
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
      localStorage.setItem('user_profile_transformed', JSON.stringify(transformedData));
    } catch (error) {
      console.error('Background fetch failed (non-critical):', error);
    }
  }, []);

  // Fetch user data from API - simplified with direct avatar_url usage
  const fetchUserData = useCallback(async (skipLoading = false) => {
    // Check if we have cached data first - if yes, skip loading state
    if (skipLoading) {
      const cachedProfile = localStorage.getItem('user_profile_transformed');
      if (cachedProfile) {
        try {
          const parsedProfile = JSON.parse(cachedProfile);
          setUserInfo(parsedProfile);
          setEditForm(parsedProfile);
          setIsLoading(false);
          // Fetch fresh data in background without showing loading
          fetchUserDataInBackground();
          return;
        } catch (parseError) {
          console.error('Error parsing cached profile:', parseError);
        }
      }
    }

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

      // Transform API data to match our component structure
      const transformedData = {
        id: userData.id,
        name: userData.name || userData.first_name || '',
        last_name: userData.last_name || userData.surname || '',
        email: userData.email || '',
        phone: userData.phone || userData.phone_number || '',
        address: userData.address || '',
        location: userData.full_address || '',
        city: userData.city || '',
        state: userData.state || '',
        country: userData.country || '',
        zip_code: userData.zip_code || userData.postal_code || '',
        joinDate: userData.created_at ? new Date(userData.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : 'Not available',
        bio: userData.bio || userData.about || 'No bio available',
        title: userData.title || userData.job_title || userData.profession || '',
        avatar_url: userData.avatar_url || null,
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

      // Update localStorage with fresh profile data including avatar
      try {
        const existingUserData = localStorage.getItem('user');
        if (existingUserData) {
          const parsedUser = JSON.parse(existingUserData);
          const updatedUser = {
            ...parsedUser,
            avatar_url: transformedData.avatar_url,
            name: transformedData.name,
            last_name: transformedData.last_name
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));

          // Dispatch event to update navbar with fresh data
          window.dispatchEvent(new CustomEvent('profile-avatar-updated', {
            detail: { avatarUrl: transformedData.avatar_url, userId: transformedData.id }
          }));
        }
      } catch (error) {
        console.error('Error updating localStorage with profile data:', error);
      }

      // showSuccess('Profile Loaded', 'Your profile information has been loaded successfully');

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
  }, [showInfo, showError, demoProfile]);

  // Handle appointment count click - show appointment details
  const handleAppointmentClick = useCallback(async () => {
    console.log('Appointment count clicked, showing appointment details');

    try {
      // Get appointment details from user profile data
      const appointments = userInfo?.appointments || [];

      if (appointments.length === 0) {
        setAppointmentDetails([]);
      } else {
        // Process appointments data - show all appointments but check if today for join button
        const processedAppointments = appointments.map(apt => {
          const appointmentTime = apt.appointment_time; // Use the correct field from API
          const isToday = isAppointmentToday(appointmentTime);

          return {
            ...apt,
            isToday,
            canJoin: isToday && apt.status === 'scheduled' // Only allow join if today and scheduled
          };
        });

        // Sort appointments by date - today's appointments first, then by date
        const sortedAppointments = processedAppointments.sort((a, b) => {
          const dateA = new Date(a.appointment_time);
          const dateB = new Date(b.appointment_time);

          // Today's appointments first
          if (a.isToday && !b.isToday) return -1;
          if (!a.isToday && b.isToday) return 1;

          // Then sort by date (earliest first)
          return dateA - dateB;
        });

        setAppointmentDetails(sortedAppointments);
        console.log('Processed appointments:', sortedAppointments);
      }

      setShowAppointmentModal(true);
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      showError('Error', 'Failed to fetch appointment details');
    }
  }, [userInfo, showError]);

  // Helper function to check if appointment is today
  const isAppointmentToday = (appointmentTime) => {
    if (!appointmentTime) return false;

    try {
      const today = new Date();
      const appointment = new Date(appointmentTime);

      // Reset time to compare only dates
      today.setHours(0, 0, 0, 0);
      appointment.setHours(0, 0, 0, 0);

      return today.getTime() === appointment.getTime();
    } catch (error) {
      console.error('Error parsing appointment time:', error);
      return false;
    }
  };

  // Handle appointment join with Google Meet redirect
  const handleJoinAppointment = (appointment) => {
    console.log('Joining appointment:', appointment);

    // Check if appointment has Google Meet link
    if (appointment.google_meet_link) {
      // Open Google Meet link in new tab
      window.open(appointment.google_meet_link, '_blank', 'noopener,noreferrer');
      showSuccess('Joining', 'Opening Google Meet...');
    } else {
      // Fallback: show message that no meeting link is available
      showWarning('No Meeting Link', 'This appointment does not have a meeting link available.');
    }
  };

  // Handle queries count click - show queries details
  const handleQueriesClick = useCallback(async () => {
    console.log('Queries count clicked, showing queries details');

    try {
      // Get queries details from user profile data
      const queries = userInfo?.legal_queries || [];

      if (queries.length === 0) {
        setQueriesDetails([]);
      } else {
        // Process queries data
        const processedQueries = queries.map(query => ({
          ...query,
          formattedDate: new Date(query.created_at || query.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        }));

        setQueriesDetails(processedQueries);
        console.log('Processed queries:', processedQueries);
      }

      setShowQueriesModal(true);
    } catch (error) {
      console.error('Error fetching queries details:', error);
      showError('Error', 'Failed to fetch queries details');
    }
  }, [userInfo, showError]);

  // Handle reviews count click - show reviews details
  const handleReviewsClick = useCallback(async () => {
    console.log('Reviews count clicked, showing reviews details');

    try {
      // Get reviews details from user profile data
      const reviews = userInfo?.reviews || [];

      if (reviews.length === 0) {
        setReviewsDetails([]);
      } else {
        // Process reviews data
        const processedReviews = reviews.map(review => ({
          ...review,
          formattedDate: new Date(review.created_at || review.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        }));

        setReviewsDetails(processedReviews);
        console.log('Processed reviews:', processedReviews);
      }

      setShowReviewsModal(true);
    } catch (error) {
      console.error('Error fetching reviews details:', error);
      showError('Error', 'Failed to fetch reviews details');
    }
  }, [userInfo, showError]);

  useEffect(() => {
    fetchUserData(true);
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

    if (editForm.phone && !/^[+]?[1-9][\d\s\-()]{7,15}$/.test(editForm.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [editForm]);



  // Simplified image upload handler
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

      // Create image preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Show loading toast
      showInfo('Uploading Avatar', 'Please wait while we upload your profile picture...', 0);

      // Upload to server
      const result = await apiServices.uploadAvatar(file);
      const response = result.data || result;

      // Get avatar URL from response
      const avatarUrl = response.avatar_url || response.avatar;

      if (avatarUrl) {
        // Update localStorage first (for navbar sync)
        const userData = localStorage.getItem('user');
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData);
            parsedUser.avatar_url = avatarUrl;
            localStorage.setItem('user', JSON.stringify(parsedUser));
          } catch (error) {
            console.error('Error updating user avatar in localStorage:', error);
          }
        }

        // Update both userInfo and editForm with new avatar
        setUserInfo(prev => ({ ...prev, avatar_url: avatarUrl }));
        setEditForm(prev => ({ ...prev, avatar_url: avatarUrl }));

        // Dispatch event to update navbar immediately
        window.dispatchEvent(new CustomEvent('profile-avatar-updated', {
          detail: { avatarUrl, userId: userInfo?.id }
        }));

        // Also dispatch the legacy event for compatibility
        window.dispatchEvent(new CustomEvent('avatar-updated', {
          detail: { avatarUrl, userId: userInfo?.id }
        }));

        // Clear the preview since we have the actual URL now
        setImagePreview(null);

        hideToast();
        showSuccess('Avatar Updated', 'Your profile picture has been updated successfully!');

        // Reload page after a short delay to show the success message
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        // Keep the preview if no URL returned
        hideToast();
        showWarning('Upload Complete', 'Avatar uploaded. The image will update after refresh.');
      }
    } catch (error) {
      console.error('Avatar upload failed:', error);
      hideToast();
      showError('Upload Failed', 'Failed to upload your profile picture. Please try again.');
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [showSuccess, showError, showWarning, showInfo, hideToast, userInfo?.id]);

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
        address: editForm.address,
        city: editForm.city,
        state: editForm.state,
        country: editForm.country,
        zip_code: editForm.zip_code,
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

      // Also update the main user object that navbar uses
      const currentUser = localStorage.getItem('user');
      if (currentUser) {
        try {
          const parsedUser = JSON.parse(currentUser);
          const updatedUser = {
            ...parsedUser,
            ...transformedData,
            // Map profile fields to user fields that navbar expects
            avatar_url: transformedData.avatar_url,
            first_name: transformedData.name,
            last_name: transformedData.last_name
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));

          // Dispatch event to update navbar
          window.dispatchEvent(new CustomEvent('profile-avatar-updated', {
            detail: { avatarUrl: transformedData.avatar_url, userId: transformedData.id }
          }));
        } catch (e) {
          console.error('Error updating user object in localStorage:', e);
        }
      }

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

  // Loading state - minimal clean loading
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-[#0A0A0A]' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
        <div className="flex flex-col items-center gap-4">
          <div className={`w-12 h-12 border-4 rounded-full animate-spin ${isDarkMode ? 'border-[#3A3A3A] border-t-blue-500' : 'border-gray-200 border-t-blue-500'}`}></div>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading profile...</p>
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
              className="px-6 py-3 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-lg hover:from-slate-600 hover:to-slate-700 transition-colors shadow-md flex items-center justify-center"
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

  // Main UI with Professional Premium Design
  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#0A0A0A]' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
      {/* Toast Notification */}
      <Toast toast={toast} onClose={hideToast} />
      <div className="max-w-7xl mx-auto px-4 sm:px-3 lg:px-8 pt-24 sm:pt-24 pb-4 sm:pb-4 md:h-[calc(100vh-120px)] md:overflow-y-auto md:pr-2">
        {/* Premium Tab Navigation with Framer Motion */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-4 rounded-xl border backdrop-blur-md transition-all duration-300 ${isDarkMode ? 'bg-[#1A1A1A]/60 border-[#2A2A2A]' : 'bg-white/70 border-gray-200'} p-1 flex gap-1`}
        >
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'preferences', label: 'Preferences', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-semibold rounded-lg transition-all duration-300 ${isActive
                  ? 'text-white shadow-sm'
                  : isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-black/5'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80 rounded-lg -z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon size={13} className="relative z-10" />
                <span className="relative z-10 hidden sm:inline">{tab.label}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Profile Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5"
            >
              {/* Left Column - Premium Profile Card */}
              <div className="lg:col-span-1 space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`rounded-2xl overflow-hidden backdrop-blur-md border shadow-2xl transition-all duration-300 ${isDarkMode ? 'bg-[#1A1A1A]/40 border-[#2A2A2A]' : 'bg-white/40 border-gray-200'}`}
                >
                  {/* Header Decoration */}
                  <div className="h-20 bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-pink-600/30 relative">
                    <div className="absolute inset-0 backdrop-blur-[2px]" />
                  </div>

                  {/* Avatar Section */}
                  <div className="relative px-4 pb-6">
                    <div className="flex flex-col items-center -mt-10">
                      <div className="relative group">
                        <div className="p-1 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-xl">
                          <div className={`rounded-full p-0.5 ${isDarkMode ? 'bg-[#0A0A0A]' : 'bg-white'}`}>
                            <img
                              src={imagePreview || userInfo?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo?.name || 'User')}&background=3182ce&color=ffffff&size=128`}
                              alt="Avatar"
                              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        </div>

                        {/* Single Edit Icon - Cute Small Icon on Profile Pic */}
                        {!isEditing ? (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsEditing(true)}
                            className="absolute bottom-0 right-0 p-1.5 rounded-full bg-blue-600 text-white shadow-lg border-2 border-[#1A1A1A] hover:bg-blue-500 transition-colors z-20 group/edit"
                            title="Edit Profile"
                          >
                            <Pencil size={12} className="group-hover/edit:rotate-12 transition-transform" />
                          </motion.button>
                        ) : (
                          <div className="absolute -right-2 -bottom-2 flex flex-col gap-1.5 z-20">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={handleSave}
                              disabled={isSaving}
                              className="p-1.5 rounded-full bg-green-600 text-white shadow-lg border-2 border-[#1A1A1A] hover:bg-green-500 transition-colors"
                              title="Save Changes"
                            >
                              {isSaving ? <Loader size={12} className="animate-spin" /> : <Check size={12} />}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={handleCancel}
                              className="p-1.5 rounded-full bg-gray-600 text-white shadow-lg border-2 border-[#1A1A1A] hover:bg-gray-500 transition-colors"
                              title="Cancel"
                            >
                              <X size={12} />
                            </motion.button>
                          </div>
                        )}

                        {/* Avatar Overlay for Uploading */}
                        <div
                          className={`absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer ${isUploadingAvatar ? 'opacity-100' : ''}`}
                          onClick={() => !isUploadingAvatar && fileInputRef.current?.click()}
                        >
                          <div className="bg-black/40 backdrop-blur-[2px] w-full h-full rounded-full flex items-center justify-center overflow-hidden">
                            {isUploadingAvatar ? (
                              <Loader size={18} className="text-white animate-spin" />
                            ) : (
                              <div className="flex flex-col items-center">
                                <Camera size={18} className="text-white" />
                                <span className="text-[8px] text-white font-bold uppercase mt-1">Upload</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

                      <div className="mt-3 text-center">
                        <h2 className={`text-lg font-bold truncate max-w-[200px] ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{userInfo.name} {userInfo.last_name}</h2>
                        <div className="flex items-center justify-center gap-1 mt-0.5">
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                            {userInfo.account_type || 'User'}
                          </span>
                          {userInfo.is_verified && (
                            <div className="flex items-center gap-0.5 text-green-500">
                              <CheckCircle size={10} fill="currentColor" fillOpacity={0.2} />
                              <span className="text-[9px] font-bold uppercase tracking-wider">Verified</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bio and Stats */}
                  <div className="px-4 py-2 space-y-4">
                    {isEditing ? (
                      <div className="space-y-2">
                        <label className={`text-[10px] uppercase tracking-wider font-bold ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>About Me</label>
                        <textarea
                          value={editForm.bio || ''}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          rows="3"
                          className={`w-full p-2 text-xs rounded-lg border focus:ring-1 focus:outline-none transition-all ${isDarkMode ? 'bg-[#1A1A1A]/60 border-[#2A2A2A] text-gray-200 focus:ring-blue-500/50' : 'bg-gray-50 border-gray-200 text-gray-900 focus:ring-blue-500/20'}`}
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <label className={`text-[10px] uppercase tracking-wider font-bold ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>About Me</label>
                        <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{userInfo.bio || 'No bio available'}</p>
                      </div>
                    )}

                    {/* Compact Stats */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#2A2A2A]/20">
                      {[
                        { label: 'Appointments', count: userInfo?.stats?.appointments || 0, icon: Calendar, color: 'text-blue-500', onClick: handleAppointmentClick },
                        { label: 'Queries', count: userInfo?.stats?.queries || 0, icon: MessageCircle, color: 'text-purple-500', onClick: handleQueriesClick },
                        { label: 'Reviews', count: userInfo?.stats?.reviews || 0, icon: Star, color: 'text-amber-500', onClick: handleReviewsClick }
                      ].map((stat, i) => (
                        <button key={i} onClick={stat.onClick} className={`flex flex-col items-center gap-1 group transition-transform active:scale-95`}>
                          <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-white/5 group-hover:bg-white/10' : 'bg-gray-100 group-hover:bg-gray-200'} transition-colors`}>
                            <stat.icon size={12} className={stat.color} />
                          </div>
                          <span className={`text-[11px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stat.count}</span>
                          <span className={`text-[8px] uppercase tracking-tighter ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{stat.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Social Section */}
                    <div className="space-y-2">
                      <label className={`text-[10px] uppercase tracking-wider font-bold ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Professional Links</label>
                      {isEditing ? (
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'linkedin', icon: Linkedin, placeholder: 'LinkedIn' },
                            { id: 'twitter', icon: Twitter, placeholder: 'Twitter' },
                            { id: 'github', icon: Github, placeholder: 'GitHub' },
                            { id: 'facebook', icon: Facebook, placeholder: 'Facebook' }
                          ].map((s) => (
                            <div key={s.id} className="relative">
                              <s.icon size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
                              <input
                                type="text"
                                placeholder={s.placeholder}
                                value={editForm.social?.[s.id] || ''}
                                onChange={(e) => handleSocialInputChange(s.id, e.target.value)}
                                className={`w-full pl-6 pr-2 py-1.5 text-[10px] rounded-md border focus:outline-none transition-all ${isDarkMode ? 'bg-[#1A1A1A]/60 border-[#2A2A2A] text-gray-300 focus:ring-1 focus:ring-blue-500/50' : 'bg-gray-50 border-gray-200 focus:ring-1 focus:ring-blue-500/20'}`}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          {[
                            { id: 'linkedin', icon: Linkedin },
                            { id: 'twitter', icon: Twitter },
                            { id: 'github', icon: Github },
                            { id: 'facebook', icon: Facebook }
                          ].map((s) => (
                            userInfo.social?.[s.id] && (
                              <a key={s.id} href={userInfo.social[s.id]} target="_blank" rel="noopener noreferrer" className={`p-1.5 rounded-md transition-all ${isDarkMode ? 'bg-[#2A2A2A] hover:bg-blue-600/20 text-gray-400 hover:text-blue-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>
                                <s.icon size={12} />
                              </a>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Trust Card */}
                  <div className={`p-4 rounded-2xl border transition-all duration-300 ${isDarkMode ? 'bg-[#1A1A1A]/40 border-[#2A2A2A]' : 'bg-white/40 border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                        <Shield size={14} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-[11px] font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Verified Professional</h4>
                        <p className={`text-[9px] truncate ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Member since {userInfo.joinDate}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Premium Details Grid */}
              <div className="lg:col-span-2 space-y-4">
                {/* Contact & Personal Details Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`rounded-2xl border backdrop-blur-md overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-[#1A1A1A]/40 border-[#2A2A2A]' : 'bg-white/40 border-gray-200'}`}
                >
                  <div className={`px-4 py-3 border-b flex justify-between items-center ${isDarkMode ? 'bg-[#2A2A2A]/40 border-[#2A2A2A]' : 'bg-gray-50/50 border-gray-200'}`}>
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-blue-500" />
                      <h3 className={`text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Professional Information</h3>
                    </div>
                  </div>

                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {[
                      { label: 'Full Name', value: `${userInfo.name} ${userInfo.last_name}`, icon: User, key: 'name', secondaryKey: 'last_name' },
                      { label: 'Professional Title', value: userInfo.title || 'Not specified', icon: Briefcase, key: 'title' },
                      { label: 'Email Address', value: userInfo.email, icon: Mail, key: 'email', required: true },
                      { label: 'Phone Number', value: userInfo.phone || 'Not specified', icon: Phone, key: 'phone' },
                      { label: 'Primary Location', value: userInfo.location || 'Not specified', icon: MapPin, key: 'location' },
                      { label: 'Full Address', value: userInfo.address || 'Not specified', icon: Building, key: 'address' }
                    ].map((field) => (
                      <div key={field.label} className="space-y-1.5 group/field relative">
                        <div className="flex items-center gap-2">
                          <field.icon size={11} className={isDarkMode ? 'text-gray-600' : 'text-gray-400'} />
                          <label className={`text-[9px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{field.label}</label>
                        </div>

                        {isEditing && field.key !== 'email' ? (
                          <div className="space-y-1">
                            {field.key === 'name' ? (
                              <div className="flex gap-1">
                                <input
                                  type="text"
                                  value={editForm.name || ''}
                                  onChange={(e) => handleInputChange('name', e.target.value)}
                                  className={`w-1/2 p-1.5 text-xs rounded border focus:outline-none transition-all ${isDarkMode ? 'bg-[#0D0D0D] border-[#2A2A2A] text-white focus:border-blue-500/50' : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500/20'}`}
                                  placeholder="First"
                                />
                                <input
                                  type="text"
                                  value={editForm.last_name || ''}
                                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                                  className={`w-1/2 p-1.5 text-xs rounded border focus:outline-none transition-all ${isDarkMode ? 'bg-[#0D0D0D] border-[#2A2A2A] text-white focus:border-blue-500/50' : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500/20'}`}
                                  placeholder="Last"
                                />
                              </div>
                            ) : (
                              <input
                                type="text"
                                value={editForm[field.key] || ''}
                                onChange={(e) => handleInputChange(field.key, e.target.value)}
                                className={`w-full p-1.5 text-xs rounded border focus:outline-none transition-all ${isDarkMode ? 'bg-[#0D0D0D] border-[#2A2A2A] text-white focus:border-blue-500/50' : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500/20'}`}
                              />
                            )}
                          </div>
                        ) : (
                          <p className={`text-xs font-medium pl-5 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{field.value}</p>
                        )}
                      </div>
                    ))}

                    {/* Location Details for Edit Mode */}
                    {isEditing && (
                      <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {['city', 'state', 'country', 'zip_code'].map((sub) => (
                          <div key={sub} className="space-y-1">
                            <label className={`text-[8px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>{sub.replace('_', ' ')}</label>
                            <input
                              type="text"
                              value={editForm[sub] || ''}
                              onChange={(e) => handleInputChange(sub, e.target.value)}
                              className={`w-full p-1.5 text-xs rounded border focus:outline-none transition-all ${isDarkMode ? 'bg-[#0D0D0D] border-[#2A2A2A] text-white focus:border-blue-500/50' : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500/20'}`}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Skills/Expertise */}
                  <div className={`rounded-xl border backdrop-blur-md transition-all duration-300 ${isDarkMode ? 'bg-[#1A1A1A]/40 border-[#2A2A2A]' : 'bg-white/40 border-gray-200'}`}>
                    <div className="px-4 py-2 border-b flex items-center gap-2 border-[#2A2A2A]/20">
                      <Zap size={11} className="text-amber-500" />
                      <h3 className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Expertise</h3>
                    </div>
                    <div className="p-3">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div className="flex gap-1">
                            <input
                              type="text"
                              ref={skillInputRef}
                              value={skillInput}
                              onChange={(e) => setSkillInput(e.target.value)}
                              onKeyPress={handleSkillKeyPress}
                              placeholder="Add skill..."
                              className={`flex-1 p-1.5 text-[10px] rounded border focus:outline-none ${isDarkMode ? 'bg-[#0D0D0D] border-[#2A2A2A] text-white' : 'bg-white border-gray-200'}`}
                            />
                            <button onClick={handleAddSkill} className="px-2 bg-blue-600 text-white rounded text-[10px] font-bold">Add</button>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {editForm.skills?.map((s, i) => (
                              <span key={i} className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${isDarkMode ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                                {s}
                                <X size={10} className="cursor-pointer hover:text-red-500" onClick={() => handleRemoveSkill(s)} />
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {userInfo.skills?.length > 0 ? userInfo.skills.map((s, i) => (
                            <span key={i} className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-tight ${isDarkMode ? 'bg-[#2A2A2A] text-blue-400 border border-blue-500/10' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                              {s}
                            </span>
                          )) : <p className="text-[10px] text-gray-500 italic">No expertise areas listed</p>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Achievements Card */}
                  <div className={`rounded-xl border backdrop-blur-md transition-all duration-300 ${isDarkMode ? 'bg-[#1A1A1A]/40 border-[#2A2A2A]' : 'bg-white/40 border-gray-200'}`}>
                    <div className="px-4 py-2 border-b flex items-center gap-2 border-[#2A2A2A]/20">
                      <Award size={11} className="text-purple-500" />
                      <h3 className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Recognitions</h3>
                    </div>
                    <div className="p-3">
                      <ul className="space-y-2">
                        {userInfo.achievements?.length > 0 ? userInfo.achievements.map((a, i) => (
                          <li key={i} className="flex gap-2 items-start">
                            <div className="mt-1 w-1 h-1 rounded-full bg-purple-500 flex-shrink-0" />
                            <span className={`text-[10px] leading-tight ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{a}</span>
                          </li>
                        )) : <p className="text-[10px] text-gray-500 italic">No recognitions found</p>}
                      </ul>
                    </div>
                  </div>

                  {/* Activity Card */}
                  <div className={`md:col-span-2 rounded-xl border backdrop-blur-md transition-all duration-300 ${isDarkMode ? 'bg-[#1A1A1A]/40 border-[#2A2A2A]' : 'bg-white/40 border-gray-200'}`}>
                    <div className="px-4 py-2 border-b flex items-center justify-between border-[#2A2A2A]/20">
                      <div className="flex items-center gap-2">
                        <Clock size={11} className="text-green-500" />
                        <h3 className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Performance Track</h3>
                      </div>
                      <button className={`text-[8px] font-bold uppercase ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}>View Timeline</button>
                    </div>
                    <div className="p-3">
                      <div className="flex flex-col gap-2">
                        {userInfo.recentActivity?.length > 0 ? userInfo.recentActivity.slice(0, 3).map((act, i) => (
                          <div key={i} className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                            <div className={`p-1.5 rounded bg-blue-600/10 text-blue-500`}>
                              {act.type === 'case' ? <Briefcase size={12} /> : act.type === 'document' ? <FileText size={12} /> : <MessageSquare size={12} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-[11px] font-semibold truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{act.description}</p>
                              <span className={`text-[9px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{act.date}</span>
                            </div>
                            <ChevronRight size={10} className="text-gray-500" />
                          </div>
                        )) : <p className="text-[10px] py-4 text-center text-gray-500 italic">Initiate your first activity to track performance</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Security Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl border ${isDarkMode ? 'bg-gradient-to-br from-[#1A1A1A] to-[#2C2C2C] border-[#3A3A3A]' : 'bg-gradient-to-br from-white to-slate-50 border-slate-200/50'}`}
            >
              <div className={`px-6 py-6 border-b ${isDarkMode ? 'border-[#3A3A3A] bg-gradient-to-r from-[#1A1A1A] to-[#2C2C2C]' : 'border-slate-200/50 bg-gradient-to-r from-white to-slate-50'}`}>
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-600/20' : 'bg-slate-100'}`}>
                    <LockIcon className={`w-6 h-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Security Settings</h2>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Protect your account with advanced security options</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className={`rounded-xl border backdrop-blur-md overflow-hidden ${isDarkMode ? 'bg-[#1A1A1A]/40 border-[#2A2A2A]' : 'bg-white/40 border-gray-200'}`}>
                    <div className="px-4 py-2 border-b border-[#2A2A2A]/20 flex items-center gap-2">
                      <Lock size={12} className="text-blue-500" />
                      <h3 className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Authentication</h3>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className={`text-[9px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Current Password</label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              className={`w-full p-1.5 text-xs rounded border focus:outline-none transition-all ${isDarkMode ? 'bg-[#0D0D0D] border-[#2A2A2A] text-white focus:border-blue-500/50' : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500/20'}`}
                              placeholder="••••••••"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500">
                              {showPassword ? <EyeOff size={10} /> : <Eye size={10} />}
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className={`text-[9px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>New Password</label>
                            <input type="password" className={`w-full p-1.5 text-xs rounded border focus:outline-none transition-all ${isDarkMode ? 'bg-[#0D0D0D] border-[#2A2A2A] text-white' : 'bg-white border-gray-200'}`} />
                          </div>
                          <div className="space-y-1">
                            <label className={`text-[9px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Confirm</label>
                            <input type="password" className={`w-full p-1.5 text-xs rounded border focus:outline-none transition-all ${isDarkMode ? 'bg-[#0D0D0D] border-[#2A2A2A] text-white' : 'bg-white border-gray-200'}`} />
                          </div>
                        </div>
                        <button className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold uppercase tracking-wider transition-colors">Update Password</button>
                      </div>

                      <div className="space-y-4 border-l border-[#2A2A2A]/20 pl-4">
                        <div className="space-y-1">
                          <h4 className={`text-[10px] font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Two-Factor Security</h4>
                          <p className={`text-[9px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Secure your account with 2FA via email or SMS.</p>
                          <button className="mt-2 px-3 py-1 bg-green-600/10 text-green-500 border border-green-500/20 rounded text-[9px] font-bold uppercase hover:bg-green-600/20 transition-all">Enable 2FA</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`rounded-xl border backdrop-blur-md overflow-hidden ${isDarkMode ? 'bg-[#1A1A1A]/40 border-[#2A2A2A]' : 'bg-white/40 border-gray-200'}`}>
                    <div className="px-4 py-2 border-b border-[#2A2A2A]/20 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Laptop size={12} className="text-purple-500" />
                        <h3 className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Active Sessions</h3>
                      </div>
                      <button className="text-[8px] font-bold uppercase text-red-500 hover:text-red-400 transition-colors">Logout All Devices</button>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-[#2A2A2A]/20">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded bg-blue-600/10 text-blue-500"><Laptop size={12} /></div>
                          <div>
                            <p className={`text-[11px] font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>MacBook Pro (Current)</p>
                            <p className={`text-[9px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>San Francisco, USA • Active now</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[8px] font-bold uppercase">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notifications Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`rounded-2xl border backdrop-blur-md overflow-hidden ${isDarkMode ? 'bg-[#1A1A1A]/40 border-[#2A2A2A]' : 'bg-white border-gray-200 shadow-sm'}`}
            >
              <div className="px-4 py-3 border-b border-[#2A2A2A]/20 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-600/10 text-purple-500"><Bell size={14} /></div>
                <div>
                  <h2 className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Notification Center</h2>
                  <p className={`text-[9px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Manage your alerts across all channels</p>
                </div>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Email Alerts', fields: [
                      { label: 'Security Updates', desc: 'Critical account and security alerts' },
                      { label: 'Messages', desc: 'New messages from legal advisors' },
                      { label: 'Newsletters', desc: 'Weekly legal insights and updates' }
                    ]
                  },
                  {
                    title: 'Push Notifications', fields: [
                      { label: 'Real-time Chat', desc: 'Instant alerts for live sessions' },
                      { label: 'Case Milestones', desc: 'Updates on your ongoing cases' }
                    ]
                  }
                ].map((group, i) => (
                  <div key={i} className="space-y-4">
                    <h3 className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>{group.title}</h3>
                    <div className="space-y-3">
                      {group.fields.map((f, j) => (
                        <div key={j} className="flex items-center justify-between group">
                          <div className="max-w-[80%]">
                            <p className={`text-[11px] font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{f.label}</p>
                            <p className={`text-[9px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{f.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked={j < 2} />
                            <div className="w-8 h-4 bg-gray-600/30 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preferences Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'preferences' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`rounded-2xl border backdrop-blur-md overflow-hidden ${isDarkMode ? 'bg-[#1A1A1A]/40 border-[#2A2A2A]' : 'bg-white border-gray-200 shadow-sm'}`}
            >
              <div className="px-4 py-3 border-b border-[#2A2A2A]/20 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-600/10 text-emerald-500"><Settings size={14} /></div>
                <div>
                  <h2 className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>System Preferences</h2>
                  <p className={`text-[9px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Tailor your dashboard experience</p>
                </div>
              </div>
              <div className="p-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={`text-[9px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>Display Language</label>
                    <select className={`w-full p-1.5 text-xs rounded border focus:outline-none ${isDarkMode ? 'bg-[#0D0D0D] border-[#2A2A2A] text-white' : 'bg-white/50 border-gray-200 text-gray-900'}`}>
                      <option>English (US)</option>
                      <option>Hindi (India)</option>
                      <option>French (France)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-[9px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>Timezone</label>
                    <select className={`w-full p-1.5 text-xs rounded border focus:outline-none ${isDarkMode ? 'bg-[#0D0D0D] border-[#2A2A2A] text-white' : 'bg-white/50 border-gray-200 text-gray-900'}`}>
                      <option>UTC (Coordinated Universal Time)</option>
                      <option>IST (Indian Standard Time)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#2A2A2A]/20 space-y-4">
                  <h3 className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Privacy Controls</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                    {[
                      { label: 'Profile Visibility', desc: 'Allow others to view your professional profile' },
                      { label: 'Activity Status', desc: 'Display when you are active on the platform' },
                      { label: 'Read Receipts', desc: 'Show when you have read messages' },
                      { label: 'Public Indexing', desc: 'Allow search engines to index your profile' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <p className={`text-[11px] font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{item.label}</p>
                          <p className={`text-[9px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} />
                          <div className="w-8 h-4 bg-gray-600/30 rounded-full peer peer-checked:bg-emerald-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-red-500/20 flex gap-2">
                  <button className="flex-1 py-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/20 rounded text-[9px] font-bold uppercase tracking-tighter transition-all flex items-center justify-center gap-1.5">
                    <Trash2 size={10} /> Delete My Account
                  </button>
                  <button className="flex-1 py-1.5 bg-gray-600/10 hover:bg-gray-600/20 text-gray-400 border border-gray-600/20 rounded text-[9px] font-bold uppercase tracking-tighter transition-all flex items-center justify-center gap-1.5">
                    <RefreshCw size={10} /> Export All Data
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Premium Detail Modals */}
      <AnimatePresence>
        {/* Premium Appointment Details Modal */}
        {showAppointmentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
            onClick={(e) => e.target === e.currentTarget && setShowAppointmentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className={`w-full max-w-lg rounded-3xl border shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden ${isDarkMode ? 'bg-[#1A1A1A] border-white/10' : 'bg-white border-slate-200'}`}
            >
              <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Calendar size={18} className="text-white" />
                  </div>
                  <div>
                    <h2 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>My Appointments</h2>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>{appointmentDetails.length} Scheduled</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAppointmentModal(false)}
                  className={`p-2 rounded-xl transition-all ${isDarkMode ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-slate-400 hover:bg-slate-100'}`}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {appointmentDetails.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar size={40} className="mx-auto text-gray-600 mb-4 opacity-20" />
                    <p className={`text-[11px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>No appointments found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointmentDetails.map((appt, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`p-4 rounded-2xl border transition-all ${isDarkMode ? 'bg-white/[0.02] border-white/5 hover:border-blue-500/30' : 'bg-slate-50 border-slate-100 hover:border-blue-500/20'}`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md">
                              <img src={appt.lawyer?.avatar || "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg"} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className={`text-xs font-bold ${isDarkMode ? 'text-gray-200' : 'text-slate-800'}`}>Legal Consultation</p>
                              <p className="text-[10px] text-blue-500 font-bold uppercase tracking-tight">{appt.lawyer?.full_name || 'Expert Advisor'}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider ${appt.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
                            {appt.status || 'Scheduled'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className={`p-2 rounded-xl border ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-white border-slate-200'}`}>
                            <p className={`text-[8px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-gray-600' : 'text-slate-400'}`}>DATE</p>
                            <div className={`flex items-center gap-1.5 text-[10px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                              <Calendar size={12} className="text-blue-500" />
                              {appt.appointment_time ? new Date(appt.appointment_time).toLocaleDateString() : 'TBD'}
                            </div>
                          </div>
                          <div className={`p-2 rounded-xl border ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-white border-slate-200'}`}>
                            <p className={`text-[8px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-gray-600' : 'text-slate-400'}`}>TIME</p>
                            <div className={`flex items-center gap-1.5 text-[10px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                              <Clock size={12} className="text-blue-500" />
                              {appt.appointment_time ? new Date(appt.appointment_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                            </div>
                          </div>
                        </div>

                        {appt.canJoin && (
                          <button
                            onClick={() => handleJoinAppointment(appt)}
                            className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                          >
                            <Video size={14} /> Join Video Conference
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
              <div className={`px-6 py-3 border-t text-center ${isDarkMode ? 'border-white/5 bg-white/[0.01]' : 'border-slate-100 bg-slate-50'}`}>
                <p className={`text-[9px] font-bold uppercase tracking-tighter ${isDarkMode ? 'text-gray-600' : 'text-slate-400'}`}>Calls can be joined 5 minutes before scheduled time</p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Premium Queries Details Modal */}
        {showQueriesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
            onClick={(e) => e.target === e.currentTarget && setShowQueriesModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className={`w-full max-w-lg rounded-3xl border shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden ${isDarkMode ? 'bg-[#1A1A1A] border-white/10' : 'bg-white border-slate-200'}`}
            >
              <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <MessageSquare size={18} className="text-white" />
                  </div>
                  <div>
                    <h2 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Legal Queries</h2>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>{queriesDetails.length} Active</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowQueriesModal(false)}
                  className={`p-2 rounded-xl transition-all ${isDarkMode ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-slate-400 hover:bg-slate-100'}`}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {queriesDetails.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare size={40} className="mx-auto text-gray-600 mb-4 opacity-20" />
                    <p className={`text-[11px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>No active queries</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {queriesDetails.map((query, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-100'}`}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-purple-500/10 text-purple-500 rounded-lg flex items-center justify-center">
                              <MessageSquare size={14} />
                            </div>
                            <p className={`text-xs font-bold ${isDarkMode ? 'text-gray-200' : 'text-slate-800'}`}>{query.title || 'Inquiry'}</p>
                          </div>
                          <span className={`text-[9px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-600' : 'text-slate-400'}`}>{query.formattedDate}</span>
                        </div>
                        <div className={`p-4 rounded-xl border leading-relaxed text-[10px] ${isDarkMode ? 'bg-black/40 border-white/5 text-gray-400' : 'bg-white border-slate-200 text-slate-600'}`}>
                          {query.question || query.content}
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-[9px] font-bold uppercase border border-emerald-500/20">{query.status || 'Active'}</span>
                          <button className="text-[10px] font-bold text-blue-500 uppercase tracking-widest hover:underline">View Thread</button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Premium Reviews Details Modal */}
        {showReviewsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
            onClick={(e) => e.target === e.currentTarget && setShowReviewsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className={`w-full max-w-lg rounded-3xl border shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden ${isDarkMode ? 'bg-[#1A1A1A] border-white/10' : 'bg-white border-slate-200'}`}
            >
              <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Star size={18} className="text-white fill-current" />
                  </div>
                  <div>
                    <h2 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Experience Reviews</h2>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>{reviewsDetails.length} Total</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReviewsModal(false)}
                  className={`p-2 rounded-xl transition-all ${isDarkMode ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-slate-400 hover:bg-slate-100'}`}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {reviewsDetails.length === 0 ? (
                  <div className="text-center py-12">
                    <Star size={40} className="mx-auto text-gray-600 mb-4 opacity-20" />
                    <p className={`text-[11px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>No reviews yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviewsDetails.map((review, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-100'}`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex gap-0.5 mb-1.5">
                              {[...Array(5)].map((_, idx) => (
                                <Star key={idx} size={10} className={`${idx < (review.rating || 5) ? 'text-amber-500 fill-amber-500' : 'text-gray-600'}`} />
                              ))}
                            </div>
                            <h4 className={`text-xs font-bold ${isDarkMode ? 'text-gray-200' : 'text-slate-800'}`}>{review.title || 'Excellent Consultation'}</h4>
                          </div>
                          <span className={`text-[9px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-600' : 'text-slate-400'}`}>{review.formattedDate}</span>
                        </div>
                        <div className={`p-4 rounded-xl italic leading-relaxed text-[10px] border ${isDarkMode ? 'bg-black/40 border-white/5 text-gray-400' : 'bg-white border-slate-200 text-slate-600'}`}>
                          "{review.comment || review.content}"
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                              <User size={12} className="text-blue-500" />
                            </div>
                            <span className={`text-[9px] font-bold ${isDarkMode ? 'text-gray-500' : 'text-slate-700'}`}>Consulted with {review.attorney || 'Senior Partner'}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-500 text-[9px] font-bold uppercase border border-amber-500/20">{review.type || 'Review'}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;