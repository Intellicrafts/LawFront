import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ProfileSkeleton = () => {
  const { isDark } = useTheme();

  return (
    <div className="animate-pulse transition-colors duration-300">
      
      {/* Profile Header */}
      <div className={`h-32 rounded-t-xl ${isDark ? 'bg-[#3A3A3A]' : 'bg-gray-100'}`}></div>
      
      {/* Avatar */}
      <div className="relative -mt-16 px-6">
        <div className={`w-32 h-32 rounded-full border-4 ${
          isDark 
            ? 'bg-[#3A3A3A] border-[#0A0A0A]' 
            : 'bg-gray-200 border-white'
        }`}></div>
      </div>
      
      {/* Profile Info */}
      <div className="px-6 py-4">
        <div className={`h-7 rounded w-1/3 mb-2 ${isDark ? 'bg-[#3A3A3A]' : 'bg-gray-200'}`}></div>
        <div className={`h-4 rounded w-1/4 mb-4 ${isDark ? 'bg-[#2C2C2C]' : 'bg-gray-100'}`}></div>
        
        <div className={`h-20 rounded mb-6 ${isDark ? 'bg-[#2C2C2C]' : 'bg-gray-100'}`}></div>
        
        {/* Contact Information */}
        <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-[#1A1A1A]' : 'bg-gray-50'}`}>
          <div className={`h-4 rounded w-1/3 mb-3 ${isDark ? 'bg-[#3A3A3A]' : 'bg-gray-200'}`}></div>
          <div className={`h-3 rounded w-2/3 mb-2 ${isDark ? 'bg-[#2C2C2C]' : 'bg-gray-100'}`}></div>
          <div className={`h-3 rounded w-1/2 ${isDark ? 'bg-[#2C2C2C]' : 'bg-gray-100'}`}></div>
        </div>
        
        {/* Achievements/Stats */}
        <div className={`grid grid-cols-3 gap-4 border-t border-b pt-4 pb-4 ${
          isDark ? 'border-[#2C2C2C]' : 'border-gray-200'
        }`}>
          <div className={`p-3 rounded-lg text-center ${isDark ? 'bg-[#1A1A1A]' : 'bg-gray-50'}`}>
            <div className={`h-6 rounded w-1/2 mx-auto mb-2 ${isDark ? 'bg-[#3A3A3A]' : 'bg-gray-200'}`}></div>
            <div className={`h-3 rounded w-2/3 mx-auto ${isDark ? 'bg-[#2C2C2C]' : 'bg-gray-100'}`}></div>
          </div>
          <div className={`p-3 rounded-lg text-center ${isDark ? 'bg-[#1A1A1A]' : 'bg-gray-50'}`}>
            <div className={`h-6 rounded w-1/2 mx-auto mb-2 ${isDark ? 'bg-[#3A3A3A]' : 'bg-gray-200'}`}></div>
            <div className={`h-3 rounded w-2/3 mx-auto ${isDark ? 'bg-[#2C2C2C]' : 'bg-gray-100'}`}></div>
          </div>
          <div className={`p-3 rounded-lg text-center ${isDark ? 'bg-[#1A1A1A]' : 'bg-gray-50'}`}>
            <div className={`h-6 rounded w-1/2 mx-auto mb-2 ${isDark ? 'bg-[#3A3A3A]' : 'bg-gray-200'}`}></div>
            <div className={`h-3 rounded w-2/3 mx-auto ${isDark ? 'bg-[#2C2C2C]' : 'bg-gray-100'}`}></div>
          </div>
        </div>
        
        {/* Social Links */}
        <div className={`mt-6 mb-6 p-4 rounded-lg ${isDark ? 'bg-[#1A1A1A]' : 'bg-gray-50'}`}>
          <div className={`h-4 rounded w-1/4 mb-3 ${isDark ? 'bg-[#3A3A3A]' : 'bg-gray-200'}`}></div>
          <div className="flex justify-center space-x-4">
            <div className={`w-5 h-5 rounded-full ${isDark ? 'bg-[#3A3A3A]' : 'bg-gray-200'}`}></div>
            <div className={`w-5 h-5 rounded-full ${isDark ? 'bg-[#3A3A3A]' : 'bg-gray-200'}`}></div>
            <div className={`w-5 h-5 rounded-full ${isDark ? 'bg-[#3A3A3A]' : 'bg-gray-200'}`}></div>
            <div className={`w-5 h-5 rounded-full ${isDark ? 'bg-[#3A3A3A]' : 'bg-gray-200'}`}></div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <div className={`flex-1 h-10 rounded-lg ${isDark ? 'bg-[#3A3A3A]' : 'bg-gray-200'}`}></div>
          <div className={`flex-1 h-10 rounded-lg ${isDark ? 'bg-[#3A3A3A]' : 'bg-gray-200'}`}></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;