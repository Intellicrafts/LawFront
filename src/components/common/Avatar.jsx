import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { cleanAvatarUrl, generateInitials, generateAvatarColor } from '../../utils/avatarUtils';

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
  const [refreshKey, setRefreshKey] = useState(Date.now());

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
      setHasError(false);
      setIsLoading(false);
      return;
    }

    // Reset error state when src changes
    setHasError(false);

    // Process the URL using the smart avatar utilities
    try {
      const processedSrc = cleanAvatarUrl(src);

      if (processedSrc) {
        // Add a cache-busting parameter to prevent browser caching
        const cacheBuster = `_cb=${refreshKey}`;
        const finalSrc = processedSrc.includes('?')
          ? `${processedSrc}&${cacheBuster}`
          : `${processedSrc}?${cacheBuster}`;

        setImageSrc(finalSrc);
        // Don't set isLoading to false here — wait for onLoad/onError
      } else {
        // cleanAvatarUrl returned null — show initials instead
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
    // Prevent further error callbacks
    if (e && e.target) {
      e.target.onerror = null;
    }

    setHasError(true);
    setIsLoading(false);

    // Try to load from localStorage as a fallback
    const cachedAvatar = localStorage.getItem('user_avatar_offline');
    if (cachedAvatar && cachedAvatar.startsWith('data:')) {
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

  // PRIORITY 1: If there's an error or no src, show initials or default icon
  if (hasError || !src) {
    if (name) {
      const bgColor = getBackgroundColor();
      const textSize = size ? Math.floor(size / 2.5) : 16;

      // Generate a complementary darker shade for gradient
      const darkerShade = bgColor + 'CC';

      return (
        <div
          className={`avatar-initials ${className || ''}`}
          style={{
            ...combinedStyle,
            background: `linear-gradient(135deg, ${bgColor} 0%, ${darkerShade} 100%)`,
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: `${textSize}px`,
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
            letterSpacing: '0.5px',
            fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
            boxShadow: `inset 0 -2px 6px rgba(0, 0, 0, 0.15), 0 2px 8px ${bgColor}40`,
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
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
      );
    }
  }

  // PRIORITY 2: Show the image (with a hidden loading state instead of skeleton)
  // We render the img tag even during loading but with opacity transition
  // This avoids the "white skeleton" flash that looks unprofessional
  return (
    <div
      className={`avatar-wrapper ${className || ''}`}
      style={{
        ...combinedStyle,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Show initials behind the image as a backdrop during loading */}
      {isLoading && name && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${getBackgroundColor()} 0%, ${getBackgroundColor()}CC 100%)`,
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: `${size ? Math.floor(size / 2.5) : 16}px`,
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
            letterSpacing: '0.5px',
            fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
            borderRadius: '50%',
          }}
        >
          {getInitials()}
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt || name || 'User avatar'}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '50%',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
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