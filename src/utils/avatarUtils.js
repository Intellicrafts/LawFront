// avatarUtils.js - Utility functions for avatar handling

/**
 * Cleans and fixes malformed avatar URLs from API responses
 * @param {string} avatarUrl - The potentially malformed avatar URL
 * @returns {string|null} - The cleaned avatar URL or null if invalid
 */
export const cleanAvatarUrl = (avatarUrl) => {
  if (!avatarUrl || typeof avatarUrl !== 'string') {
    return null;
  }

  let cleanedUrl = avatarUrl;
  
  // Handle escaped backslashes (like "http:\/\/127.0.0.1:8000\/api\/api...")
  if (cleanedUrl.includes('\\/')) {
    cleanedUrl = cleanedUrl.replace(/\\\//g, '/');
    console.log('Fixed escaped backslashes:', cleanedUrl);
  }

  // Fix specific malformed URL pattern: extract the actual file path
  // Pattern: "http://127.0.0.1:8000/api/apihttp://127.0.0.1:8000/storage/avatars/filename.jpg"
  const malformedPattern = /^(https?:\/\/[^\/]+)\/api\/api(https?:\/\/[^\/]+)(\/storage\/avatars\/.+)$/;
  const malformedMatch = cleanedUrl.match(malformedPattern);
  
  if (malformedMatch) {
    // Extract the base URL and file path
    const baseUrl = malformedMatch[1];
    const filePath = malformedMatch[3];
    cleanedUrl = `${baseUrl}${filePath}`;
    console.log('Fixed malformed URL pattern:', cleanedUrl);
  }

  // Handle other duplicate URL patterns
  // Pattern: "http://127.0.0.1:8000http://127.0.0.1:8000/storage/avatars/filename.jpg"
  const duplicateBasePattern = /^(https?:\/\/[^\/]+)(https?:\/\/[^\/]+)(\/storage\/.+)$/;
  const duplicateMatch = cleanedUrl.match(duplicateBasePattern);
  
  if (duplicateMatch) {
    const baseUrl = duplicateMatch[1];
    const filePath = duplicateMatch[3];
    cleanedUrl = `${baseUrl}${filePath}`;
    console.log('Fixed duplicate base URL pattern:', cleanedUrl);
  }

  // Remove duplicate /api prefixes
  while (cleanedUrl.includes('/api/api')) {
    cleanedUrl = cleanedUrl.replace('/api/api', '/api');
    console.log('Removed duplicate /api prefix:', cleanedUrl);
  }

  // Extract storage path from complex URLs
  // Look for the actual storage path within the URL
  const storagePathMatch = cleanedUrl.match(/(\/storage\/avatars\/[^\/\s]+\.[a-zA-Z0-9]+)/);
  if (storagePathMatch) {
    const storagePath = storagePathMatch[1];
    const baseUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
    cleanedUrl = `${baseUrl}${storagePath}`;
    console.log('Extracted storage path and reconstructed URL:', cleanedUrl);
  }

  // Ensure it's a valid URL
  if (!cleanedUrl.startsWith('http')) {
    const baseUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
    cleanedUrl = cleanedUrl.startsWith('/') ? `${baseUrl}${cleanedUrl}` : `${baseUrl}/${cleanedUrl}`;
  }

  // Final validation - check if it looks like a valid avatar URL
  const isValidAvatarUrl = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(cleanedUrl);
  
  if (!isValidAvatarUrl) {
    console.warn('Invalid avatar URL after cleaning:', cleanedUrl);
    return null;
  }

  return cleanedUrl;
};

/**
 * Generates user initials from full name
 * @param {string} name - Full name
 * @param {string} lastName - Last name (optional)
 * @returns {string} - User initials (max 2 characters)
 */
export const generateInitials = (name, lastName = '') => {
  if (!name && !lastName) return '?';
  
  const fullName = `${name || ''} ${lastName || ''}`.trim();
  
  if (!fullName) return '?';
  
  const nameParts = fullName.split(/\s+/).filter(part => part.length > 0);
  
  if (nameParts.length === 0) return '?';
  
  if (nameParts.length === 1) {
    // Single name - return first and last character if long enough
    const singleName = nameParts[0];
    if (singleName.length === 1) {
      return singleName.toUpperCase();
    }
    return (singleName.charAt(0) + singleName.charAt(singleName.length - 1)).toUpperCase();
  }
  
  // Multiple names - return first character of first and last name
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Generates a consistent background color for avatar based on name
 * @param {string} name - User name
 * @returns {string} - Hex color code
 */
export const generateAvatarColor = (name) => {
  if (!name) return '#6B7280';
  
  const colors = [
    '#EF4444', // Red
    '#F97316', // Orange
    '#F59E0B', // Amber
    '#84CC16', // Lime
    '#10B981', // Emerald
    '#06B6D4', // Cyan
    '#3B82F6', // Blue
    '#6366F1', // Indigo
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#F43F5E', // Rose
    '#14B8A6', // Teal
  ];
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

/**
 * Caches avatar URL in localStorage with timestamp
 * @param {string} avatarUrl - Avatar URL to cache
 * @param {string} userId - User ID for cache key
 */
export const cacheAvatarUrl = (avatarUrl, userId = 'current') => {
  if (!avatarUrl) return;
  
  const cacheData = {
    url: avatarUrl,
    timestamp: Date.now(),
    userId: userId
  };
  
  localStorage.setItem(`avatar_cache_${userId}`, JSON.stringify(cacheData));
  // Also set the old key for backward compatibility
  localStorage.setItem('user_avatar', avatarUrl);
};

/**
 * Retrieves cached avatar URL from localStorage
 * @param {string} userId - User ID for cache key
 * @param {number} maxAge - Max age in milliseconds (default: 1 hour)
 * @returns {string|null} - Cached avatar URL or null if expired/not found
 */
export const getCachedAvatarUrl = (userId = 'current', maxAge = 3600000) => {
  try {
    const cached = localStorage.getItem(`avatar_cache_${userId}`);
    if (!cached) {
      // Try old format as fallback
      return localStorage.getItem('user_avatar');
    }
    
    const cacheData = JSON.parse(cached);
    
    // Check if cache is still valid
    if (Date.now() - cacheData.timestamp > maxAge) {
      localStorage.removeItem(`avatar_cache_${userId}`);
      return null;
    }
    
    return cacheData.url;
  } catch (error) {
    console.error('Error retrieving cached avatar:', error);
    return null;
  }
};

/**
 * Clears avatar cache for a specific user
 * @param {string} userId - User ID for cache key
 */
export const clearAvatarCache = (userId = 'current') => {
  localStorage.removeItem(`avatar_cache_${userId}`);
  if (userId === 'current') {
    localStorage.removeItem('user_avatar');
  }
};

/**
 * Updates avatar URL in real-time across all components
 * @param {string} newAvatarUrl - New avatar URL
 * @param {string} userId - User ID
 */
export const updateAvatarRealTime = (newAvatarUrl, userId = 'current') => {
  if (!newAvatarUrl) return;
  
  // Clean the URL first
  const cleanedUrl = cleanAvatarUrl(newAvatarUrl);
  if (!cleanedUrl) return;
  
  // Cache the new URL
  cacheAvatarUrl(cleanedUrl, userId);
  
  // Update localStorage for backward compatibility
  localStorage.setItem('user_avatar', cleanedUrl);
  
  // Update user object in localStorage
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      parsedUser.avatar = cleanedUrl;
      localStorage.setItem('user', JSON.stringify(parsedUser));
    } catch (e) {
      console.error('Error updating user avatar in localStorage:', e);
    }
  }
  
  // Trigger a storage event to notify other components
  window.dispatchEvent(new CustomEvent('avatar-updated', { 
    detail: { avatarUrl: cleanedUrl, userId } 
  }));
  
  console.log('Avatar updated in real-time:', cleanedUrl);
};