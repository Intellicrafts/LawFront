import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Base64 encoded default avatar (a simple gray user silhouette)
const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzlFOUU5RSI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MyLjY3IDAgOCAyLjY3IDggOHYyYzAgMi42Ny01LjMzIDUtOCA1cy04LTIuMzMtOC01di0yYzAtNS4zMyA1LjMzLTggOC04em0wIDJjLTEuMSAwLTIgLjktMiAyczAuOSAyIDIgMiAyLS45IDItMi0uOS0yLTItMnoiLz48L3N2Zz4=';

/**
 * Avatar component that handles various avatar URL formats and provides fallback
 * 
 * @param {Object} props Component props
 * @param {string} props.src Avatar URL or filename
 * @param {string} props.alt Alt text for the avatar
 * @param {string} props.className Additional CSS classes
 * @param {number} props.size Size of the avatar in pixels
 * @param {string} props.style Additional inline styles
 * @returns {JSX.Element} Avatar component
 */
const Avatar = ({ src, alt, className, size, style, forceRefresh, ...rest }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(Date.now()); // Used to force refresh

  // Update refreshKey when forceRefresh prop changes
  useEffect(() => {
    if (forceRefresh) {
      setRefreshKey(Date.now());
      setHasError(false);
    }
  }, [forceRefresh]);

  // Process the avatar URL to ensure it's valid
  useEffect(() => {
    if (!src) {
      setImageSrc(defaultAvatar);
      return;
    }

    // If it's already a data URL, use it directly
    if (typeof src === 'string' && src.startsWith('data:')) {
      setImageSrc(src);
      return;
    }

    // Reset error state when src changes
    setHasError(false);

    // Process the URL
    let processedSrc = src;

    try {
      // First, check for duplicate /api prefixes and fix them
      if (typeof processedSrc === 'string' && processedSrc.includes('/api/api')) {
        // Fix duplicate /api prefixes
        while (processedSrc.includes('/api/api')) {
          processedSrc = processedSrc.replace('/api/api', '/api');
        }
        console.log('Avatar: Fixed duplicate /api prefixes:', processedSrc);
      }

      // Check if it's just a filename (no slashes)
      if (typeof processedSrc === 'string' && !processedSrc.includes('/') && 
          (processedSrc.includes('.jpg') || processedSrc.includes('.jpeg') || processedSrc.includes('.png') || 
           processedSrc.includes('.gif') || processedSrc.includes('.webp'))) {
        
        // It's just a filename, construct the full path
        // Try both storage paths that Laravel might use
        processedSrc = `/storage/avatars/${processedSrc}`;
        console.log('Avatar: Converted filename to storage path:', processedSrc);
      }
      
      // Fix the avatar URL if it's a storage path
      if (typeof processedSrc === 'string' && processedSrc.includes('/storage/')) {
        // We'll keep the storage path as is, as Laravel's public storage is directly accessible
        console.log('Avatar: Using storage path:', processedSrc);
      }

      // Ensure the URL is absolute
      if (typeof processedSrc === 'string' && !processedSrc.startsWith('data:') && !processedSrc.startsWith('http')) {
        const baseUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
        
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
        const cacheBuster = `_cb=${new Date().getTime()}`;
        processedSrc = processedSrc.includes('?') 
          ? `${processedSrc}&${cacheBuster}` 
          : `${processedSrc}?${cacheBuster}`;
        console.log('Avatar: Added cache-busting parameter:', processedSrc);
      }

      setImageSrc(processedSrc);
    } catch (error) {
      console.error('Avatar: Error processing avatar URL:', error);
      setHasError(true);
      setImageSrc(defaultAvatar);
    }
  }, [src]);

  // Handle image load error
  const handleError = () => {
    console.error('Avatar: Failed to load image:', imageSrc);
    setHasError(true);
    setImageSrc(defaultAvatar);
    
    // Try to load from localStorage as a fallback
    const cachedAvatar = localStorage.getItem('user_avatar_offline');
    if (cachedAvatar && cachedAvatar.startsWith('data:')) {
      console.log('Avatar: Using cached avatar from localStorage after load error');
      setImageSrc(cachedAvatar);
      setHasError(false);
    }
  };

  // Combine styles
  const combinedStyle = {
    width: size ? `${size}px` : '40px',
    height: size ? `${size}px` : '40px',
    objectFit: 'cover',
    borderRadius: '50%',
    ...style
  };

  return (
    <img
      src={hasError ? defaultAvatar : (imageSrc || defaultAvatar)}
      alt={alt || 'User avatar'}
      className={`avatar-image ${className || ''}`}
      style={combinedStyle}
      onError={handleError}
      {...rest}
    />
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.number,
  style: PropTypes.object
};

Avatar.defaultProps = {
  size: 40,
  alt: 'User avatar'
};

export default Avatar;