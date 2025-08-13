import React from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import OurStory from './OurStory';
import OurTeam from './OurTeam';

const TestEnhancedComponents = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              Enhanced Components Test
            </h1>
            
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                1. Our Story Component
              </h2>
              <OurStory />
            </div>
            
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                2. Our Team Component
              </h2>
              <OurTeam />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default TestEnhancedComponents;