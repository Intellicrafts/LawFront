import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Base64 encoded default avatar (a simple gray user silhouette)
const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzlFOUU5RSI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MyLjY3IDAgOCAyLjY3IDggOHYyYzAgMi42Ny01LjMzIDUtOCA1cy04LTIuMzMtOC01di0yYzAtNS4zMyA1LjMzLTggOC04em0wIDJjLTEuMSAwLTIgLjktMiAyczAuOSAyIDIgMiAyLS45IDItMi0uOS0yLTItMnoiLz48L3N2Zz4=';

/**
 * Avatar component that handles various avatar URL formats and provides fallback
 * Shows user initials when no image is available
 * 
 * @param {Object} props Component props
 * @param {string} props.src Avatar URL or filename
 * @param {string} props.alt Alt text for the avatar
 * @param {string} props.className Additional CSS classes
 * @param {number} props.size Size of the avatar in pixels
 * @param {string} props.style Additional inline styles
 * @param {string} props.name User's name (for initials fallback)
 * @returns {JSX.Element} Avatar component
 */
const Avatar = ({ src, alt, className, size, style, name, forceRefresh, ...rest }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(Date.now()); // Used to force refresh

  // Generate initials from name
  const getInitials = () => {
    if (!name) return '?';
    
    // Split the name by spaces
    const nameParts = name.trim().split(/\s+/);
    
    if (nameParts.length === 1) {
      const singleName = nameParts[0];
      // If only one name and it's long enough, return first and last character
      if (singleName.length > 1) {
        return (singleName.charAt(0) + singleName.charAt(singleName.length - 1)).toUpperCase();
      }
      // Otherwise just return the first character
      return singleName.charAt(0).toUpperCase();
    } else {
      // Return first character of first name and first character of last name
      return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    }
  };

  // Generate a consistent background color based on the name
  const getBackgroundColor = () => {
    if (!name) return '#6B7280'; // Default gray
    
    // List of colors to choose from
    const colors = [
      '#F87171', // Red
      '#FB923C', // Orange
      '#FBBF24', // Amber
      '#A3E635', // Lime
      '#34D399', // Emerald
      '#22D3EE', // Cyan
      '#60A5FA', // Blue
      '#818CF8', // Indigo
      '#A78BFA', // Violet
      '#E879F9', // Fuchsia
      '#F472B6', // Pink
    ];
    
    // Simple hash function to get a consistent index
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Get a positive index within the colors array
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  // Update refreshKey when forceRefresh prop changes
  useEffect(() => {
    if (forceRefresh) {
      setRefreshKey(Date.now());
      setHasError(false);
      setIsLoading(true);
    }
  }, [forceRefresh]);

  // Process the avatar URL to ensure it's valid
  useEffect(() => {
    setIsLoading(true);
    
    if (!src) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    // If it's already a data URL, use it directly
    if (typeof src === 'string' && src.startsWith('data:')) {
      setImageSrc(src);
      setIsLoading(false);
      return;
    }

    // Reset error state when src changes
    setHasError(false);

    // Process the URL
    let processedSrc = src;

    try {
      // Handle escaped backslashes in URLs (like "https:\/\/chambersapi.logicera.in\/storage\/avatars\/...")
      if (typeof processedSrc === 'string' && processedSrc.includes('\\/')) {
        // Replace escaped backslashes with forward slashes
        processedSrc = processedSrc.replace(/\\\//g, '/');
        console.log('Avatar: Fixed escaped backslashes in URL:', processedSrc);
      }

      // First, check for duplicate /api prefixes and fix them
      if (typeof processedSrc === 'string' && processedSrc.includes('/api/api')) {
        // Fix duplicate /api prefixes
        while (processedSrc.includes('/api/api')) {
          processedSrc = processedSrc.replace('/api/api', '/api');
        }
        console.log('Avatar: Fixed duplicate /api prefixes:', processedSrc);
      }

      // Handle Laravel storage URLs like "http://localhost:8000/storage/avatars/9qILjMIcOKOwGxInp0sRMP79f5xDoCp1UT4EbCgt.jpg"
      // or "https://chambersapi.logicera.in/storage/avatars/o7vyJNOhHqI6Nf7I8t6ErXT1dxcJnId6XniqnuIE.jpg"
      if (typeof processedSrc === 'string' && 
          (processedSrc.includes('/storage/avatars/') || processedSrc.includes('/storage/profile-photos/'))) {
        // This is already a storage path, just ensure it has the correct base URL
        console.log('Avatar: Detected Laravel storage path:', processedSrc);
        
        // If it's not an absolute URL, make it absolute
        if (!processedSrc.startsWith('http')) {
          const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
          processedSrc = processedSrc.startsWith('/') 
            ? `${baseUrl}${processedSrc}` 
            : `${baseUrl}/${processedSrc}`;
          console.log('Avatar: Converted storage path to absolute URL:', processedSrc);
        }
      }
      
      // Check if it's just a filename (no slashes)
      else if (typeof processedSrc === 'string' && !processedSrc.includes('/') && 
          (processedSrc.includes('.jpg') || processedSrc.includes('.jpeg') || processedSrc.includes('.png') || 
           processedSrc.includes('.gif') || processedSrc.includes('.webp'))) {
        
        // It's just a filename, construct the full path
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        processedSrc = `${baseUrl}/storage/avatars/${processedSrc}`;
        console.log('Avatar: Converted filename to storage path:', processedSrc);
      }
      
      // Ensure any other URL is absolute
      else if (typeof processedSrc === 'string' && !processedSrc.startsWith('data:') && !processedSrc.startsWith('http')) {
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        
        // Make sure we don't add the baseUrl if it's already in the URL
        if (!processedSrc.includes(baseUrl)) {
          processedSrc = processedSrc.startsWith('/') 
            ? `${baseUrl}${processedSrc}` 
            : `${baseUrl}/${processedSrc}`;
          console.log('Avatar: Converted to absolute URL:', processedSrc);
        }
      }

      // Add a cache-busting parameter to prevent browser caching
      if (typeof processedSrc === 'string' && !processedSrc.startsWith('data:')) {
        const cacheBuster = `_cb=${refreshKey}`;
        processedSrc = processedSrc.includes('?') 
          ? `${processedSrc}&${cacheBuster}` 
          : `${processedSrc}?${cacheBuster}`;
        console.log('Avatar: Added cache-busting parameter:', processedSrc);
      }

      setImageSrc(processedSrc);
    } catch (error) {
      console.error('Avatar: Error processing avatar URL:', error);
      setHasError(true);
      setIsLoading(false);
    }
  }, [src, refreshKey]);

  // Handle image load error
  const handleError = (e) => {
    console.error('Avatar: Failed to load image:', imageSrc);
    
    // Prevent further error callbacks
    if (e && e.target) {
      e.target.onerror = null;
    }
    
    setHasError(true);
    setIsLoading(false);
    
    // Try to load from localStorage as a fallback
    const cachedAvatar = localStorage.getItem('user_avatar_offline');
    if (cachedAvatar && cachedAvatar.startsWith('data:')) {
      console.log('Avatar: Using cached avatar from localStorage after load error');
      setImageSrc(cachedAvatar);
      setHasError(false);
    }
  };
  
  // Handle image load success
  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // Combine styles
  const combinedStyle = {
    width: size ? `${size}px` : '40px',
    height: size ? `${size}px` : '40px',
    objectFit: 'cover',
    borderRadius: '50%',
    ...style
  };
  
  // If showing initials and there's an error or no image
  if (hasError || !src) {
    // If we have a name, show initials
    if (name) {
      const bgColor = getBackgroundColor();
      const textSize = size ? Math.floor(size / 2.5) : 16;
      
      return (
        <div 
          className={`avatar-initials ${className || ''}`}
          style={{
            ...combinedStyle,
            backgroundColor: bgColor,
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: `${textSize}px`,
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
          }}
          title={alt || name || 'User avatar'}
          {...rest}
        >
          {getInitials()}
        </div>
      );
    } else {
      // If no name, show a generic user icon
      return (
        <div 
          className={`avatar-default ${className || ''}`}
          style={{
            ...combinedStyle,
            backgroundColor: '#6B7280',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title={alt || 'User avatar'}
          {...rest}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            style={{ width: '60%', height: '60%' }}
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c2.67 0 8 2.67 8 8v2c0 2.67-5.33 5-8 5s-8-2.33-8-5v-2c0-5.33 5.33-8 8-8zm0 2c-1.1 0-2 .9-2 2s0.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </div>
      );
    }
  }
  
  // If loading, show a skeleton loader
  if (isLoading) {
    return (
      <div 
        className={`avatar-skeleton ${className || ''}`}
        style={{
          ...combinedStyle,
          backgroundColor: '#e2e8f0',
          animation: 'pulse 1.5s infinite',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <style>
          {`
            @keyframes pulse {
              0% { opacity: 0.6; }
              50% { opacity: 1; }
              100% { opacity: 0.6; }
            }
          `}
        </style>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="#9ca3af" 
          style={{ width: '60%', height: '60%' }}
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c2.67 0 8 2.67 8 8v2c0 2.67-5.33 5-8 5s-8-2.33-8-5v-2c0-5.33 5.33-8 8-8zm0 2c-1.1 0-2 .9-2 2s0.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
      </div>
    );
  }

  // Otherwise, show the image
  return (
    <img
      src={imageSrc || defaultAvatar}
      alt={alt || name || 'User avatar'}
      className={`avatar-image ${className || ''}`}
      style={combinedStyle}
      onError={handleError}
      onLoad={handleLoad}
      {...rest}
    />
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.number,
  style: PropTypes.object,
  name: PropTypes.string,
  forceRefresh: PropTypes.bool
};

Avatar.defaultProps = {
  size: 40,
  alt: 'User avatar',
  forceRefresh: false
};

export default Avatar;