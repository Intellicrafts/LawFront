import React from 'react';

const ProfileSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Profile Header */}
      <div className="bg-gray-200 dark:bg-gray-700 h-32 rounded-t-xl"></div>
      
      {/* Avatar */}
      <div className="relative -mt-16 px-6">
        <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-600 border-4 border-white dark:border-gray-800"></div>
      </div>
      
      {/* Profile Info */}
      <div className="px-6 py-4">
        <div className="h-7 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
        
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="text-center">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
          </div>
          <div className="text-center">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
          </div>
          <div className="text-center">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
          </div>
        </div>
        
        {/* Social Links */}
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-3"></div>
          <div className="flex justify-center space-x-4">
            <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-6 flex space-x-3">
          <div className="flex-1 h-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="flex-1 h-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;