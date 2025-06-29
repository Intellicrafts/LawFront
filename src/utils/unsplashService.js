// unsplashService.js - Utility for fetching images from Unsplash API

// Collection of professional background images for lawyer cards
const LAWYER_BACKGROUND_IMAGES = [
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=200&fit=crop&crop=focalpoint&fp-y=.6',
  'https://images.unsplash.com/photo-1568992688065-536aad8a12f6?w=800&h=200&fit=crop&crop=focalpoint&fp-y=.4',
  'https://images.unsplash.com/photo-1575505586569-646b2ca898fc?w=800&h=200&fit=crop&crop=focalpoint&fp-y=.45',
  'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&h=200&fit=crop&crop=focalpoint&fp-y=.6',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=200&fit=crop&crop=focalpoint&fp-y=.4',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=200&fit=crop&crop=focalpoint&fp-y=.6',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=200&fit=crop&crop=focalpoint&fp-y=.45',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=200&fit=crop&crop=focalpoint&fp-y=.5',
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&h=200&fit=crop&crop=focalpoint&fp-y=.5',
  'https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?w=800&h=200&fit=crop&crop=focalpoint&fp-y=.5',
  'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=200&fit=crop&crop=focalpoint&fp-y=.5',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=200&fit=crop&crop=focalpoint&fp-y=.5',
  'https://images.unsplash.com/photo-1577415124269-fc1140a69e91?w=800&h=200&fit=crop&crop=focalpoint&fp-y=.5',
  'https://images.unsplash.com/photo-1606836576983-8b458e75221d?w=800&h=200&fit=crop&crop=focalpoint&fp-y=.5',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=200&fit=crop&crop=focalpoint&fp-y=.5'
];

// Default image as fallback if something goes wrong
const DEFAULT_LAWYER_BACKGROUND = 'https://t4.ftcdn.net/jpg/08/52/61/01/360_F_852610192_mDCPHk42G9qHrROdQYx93eHuk5AMFpQQ.jpg';

/**
 * Get a professional background image URL for a lawyer card
 * 
 * @param {Object} lawyer - Lawyer object with id and specialization
 * @returns {string} - URL of the professional image
 */
export const getLawyerBackgroundImage = (lawyer) => {
  if (!lawyer) return DEFAULT_LAWYER_BACKGROUND;
  
  try {
    // Use lawyer's ID to select a consistent image for each lawyer
    const lawyerId = lawyer.id || Math.floor(Math.random() * 1000);
    const imageIndex = lawyerId % LAWYER_BACKGROUND_IMAGES.length;
    return LAWYER_BACKGROUND_IMAGES[imageIndex];
  } catch (error) {
    console.error('Error selecting lawyer background image:', error);
    return DEFAULT_LAWYER_BACKGROUND;
  }
};

/**
 * Get a collection of professional background images for lawyer cards
 * This function pre-fetches images to avoid loading delays
 * 
 * @param {Array} lawyers - Array of lawyer objects
 * @returns {Object} - Object mapping lawyer IDs to image URLs
 */
export const preloadLawyerBackgroundImages = (lawyers) => {
  if (!lawyers || !Array.isArray(lawyers)) {
    console.log('No lawyers provided to preloadLawyerBackgroundImages');
    return {};
  }
  
  const imageMap = {};
  
  lawyers.forEach(lawyer => {
    if (lawyer && lawyer.id) {
      imageMap[lawyer.id] = getLawyerBackgroundImage(lawyer);
    } else {
      console.warn('Invalid lawyer object:', lawyer);
    }
  });
  
  return imageMap;
};