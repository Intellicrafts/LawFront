import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { cleanAvatarUrl, generateInitials, generateAvatarColor } from '../../utils/avatarUtils';

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

  // Generate initials from name using utility function
  const getInitials = () => {
    return generateInitials(name);
  };

  // Generate a consistent background color based on the name using utility function
  const getBackgroundColor = () => {
    return generateAvatarColor(name);
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

    // Process the URL using the smart avatar utilities
    try {
      console.log('Avatar: Processing URL with cleanAvatarUrl:', src);
      const processedSrc = cleanAvatarUrl(src);
      
      if (processedSrc) {
        // Add a cache-busting parameter to prevent browser caching
        const cacheBuster = `_cb=${refreshKey}`;
        const finalSrc = processedSrc.includes('?') 
          ? `${processedSrc}&${cacheBuster}` 
          : `${processedSrc}?${cacheBuster}`;
        
        console.log('Avatar: Successfully processed URL:', finalSrc);
        setImageSrc(finalSrc);
      } else {
        console.log('Avatar: Failed to process URL, will show initials');
        setHasError(true);
        setIsLoading(false);
      }
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