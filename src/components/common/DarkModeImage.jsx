import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * A component that displays different images based on the current theme
 * 
 * @param {Object} props - Component props
 * @param {string} props.lightSrc - Source URL for the light mode image
 * @param {string} props.darkSrc - Source URL for the dark mode image
 * @param {string} props.alt - Alt text for the image
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} [props.imgProps] - Additional props to pass to the img element
 */
const DarkModeImage = ({ 
  lightSrc, 
  darkSrc, 
  alt, 
  className = '', 
  imgProps = {},
  ...props 
}) => {
  const { isDark } = useTheme();
  
  return (
    <img
      src={isDark ? darkSrc : lightSrc}
      alt={alt}
      className={`transition-opacity duration-300 ${className}`}
      {...imgProps}
      {...props}
    />
  );
};

export default DarkModeImage;