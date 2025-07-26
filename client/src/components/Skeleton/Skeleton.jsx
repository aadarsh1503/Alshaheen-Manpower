// src/components/PersonalInfoStep/Dashboard/Skeleton.jsx

import React from "react";

const Skeleton = ({ darkMode }) => {
  return (
    <div className={`animate-pulse rounded-xl overflow-hidden shadow-lg p-5 transition-all ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-start space-x-4">
        <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
      </div>

      <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
      </div>
    </div>
  );
};

export default Skeleton;
