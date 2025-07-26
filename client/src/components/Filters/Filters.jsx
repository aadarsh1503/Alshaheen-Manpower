import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Filters = ({ filters, setFilters, darkMode, clearAllFilters }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showExperienceOptions, setShowExperienceOptions] = useState(false);
  const handleCustomDateChange = (date, field) => {
    setFilters({
      ...filters,
      [field]: date ? date.toISOString() : ''
    });
  };
  
  const handleDateRangeChange = (range) => {
    let startDate = null;
    let endDate = new Date();
    
    switch (range) {
      case 'today':
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        break;
      case '24h':
        startDate = new Date();
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7d':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '1y':
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case 'custom':
        // Don't set dates for custom, let user pick them
        break;
      default:
        startDate = null;
        endDate = null;
    }

    setFilters({
      ...filters,
      dateRange: range,
      customStart: range === 'custom' ? filters.customStart : startDate?.toISOString() || '',
      customEnd: range === 'custom' ? filters.customEnd : endDate?.toISOString() || ''
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl p-5 shadow-md mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className={`text-lg font-semibold text-gray-800 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Filters</h2>
        <button
          onClick={clearAllFilters}
          className="text-sm text-indigo-600 cursor-pointer hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Search</label>
          <input
            type="text"
            placeholder="Name, email, skills..."
            value={filters.searchTerm}
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            className={`w-full px-3 py-2 rounded-lg border text-gray-800 placeholder-gray-500 ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
            }`}
          />
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Nationality</label>
          <input
            type="text"
            placeholder="Any nationality"
            value={filters.nationality}
            onChange={(e) => setFilters({ ...filters, nationality: e.target.value })}
            className={`w-full px-3 py-2 rounded-lg border text-gray-800 placeholder-gray-500 ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
            }`}
          />
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Employment</label>
          <select
            value={filters.currentlyEmployed}
            onChange={(e) => setFilters({ ...filters, currentlyEmployed: e.target.value })}
            className={`w-full px-3 py-2 rounded-lg border text-gray-800 ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-800'
            }`}
          >
            <option value="">Any status</option>
            <option value="YES">Employed</option>
            <option value="NO">Not Employed</option>
          </select>
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Date Range</label>
          <select
            value={filters.dateRange}
            onChange={(e) => {
              setFilters({
                ...filters,
                dateRange: e.target.value,
                customStart: '',
                customEnd: ''
              });
            }}
            className={`w-full px-3 py-2 rounded-lg border text-gray-800 ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-800'
            }`}
          >
            <option value="all">All time</option>
            <option value="today">Today</option>
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="mt-4 text-sm text-indigo-600 cursor-pointer hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center"
      >
        {showAdvanced ? 'Hide' : 'Show'} advanced filters
        <svg
          className={`ml-1 h-4 w-4 transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Education Level</label>
            <select
              value={filters.educationLevel}
              onChange={(e) => setFilters({ ...filters, educationLevel: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border text-gray-800 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
              }`}
            >
              <option value="" className={` ${darkMode ? 'text-white' : 'text-gray-800'}`}>Any education</option>
              <option value="Secondary Level" className={` ${darkMode ? 'text-white' : 'text-gray-800'}`}>Secondary Level</option>
              <option value="College Graduate" className={` ${darkMode ? 'text-white' : 'text-gray-800'}`}>College Graduate</option>
              <option value="Post Graduate" className={` ${darkMode ? 'text-white' : 'text-gray-800'}`}>Post Graduate</option>
              <option value="Vocational" className={` ${darkMode ? 'text-white' : 'text-gray-800'}`}>Vocational</option>
              <option value="Technical" className={` ${darkMode ? 'text-white' : 'text-gray-800'}`}>Technical</option>
              <option value="Associate Diploma" className={` ${darkMode ? 'text-white' : 'text-gray-800'}`}>Associate Diploma</option>
              <option value="Others" className={` ${darkMode ? 'text-white' : 'text-gray-800'}`}>Others</option>
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Desired Position</label>
            <select
              value={filters.employmentDesired}
              onChange={(e) => setFilters({ ...filters, employmentDesired: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border text-gray-800 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
              }`}
            >
              <option value="">Any position</option>
              <option value="Logistic Officer">Logistic Officer</option>
              <option value="Office Admin">Office Admin</option>
              <option value="Accountant">Accountant</option>
              <option value="Business Development Manager">Business Development Manager</option>
              <option value="Freight Forwarder Agent">Freight Forwarder Agent</option>
              <option value="Others">Others</option>
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Driving License</label>
            <select
              value={filters.drivingLicense}
              onChange={(e) => setFilters({ ...filters, drivingLicense: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border text-gray-800 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
              }`}
            >
              <option value="">Any</option>
              <option value="YES">Yes</option>
              <option value="NO">No</option>
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Gender</label>
            <select
              value={filters.gender}
              onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border text-gray-800 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
              }`}
            >
              <option value="">Any gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Can Travel</label>
            <select
              value={filters.canTravel}
              onChange={(e) => setFilters({ ...filters, canTravel: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border text-gray-800 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
              }`}
            >
              <option value="">Any</option>
              <option value="YES">Yes</option>
              <option value="NO">No</option>
            </select>
          </div>

          <div>
  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
    Years of Experience
  </label>
  <div className="relative">
    <input
      type="text"
      placeholder="Fresher or number (e.g. 1, 2, 5)"
      value={filters.yearsOfExperience}
      onChange={(e) => {
        const value = e.target.value.trim().toLowerCase();
        setFilters({ 
          ...filters, 
          yearsOfExperience: e.target.value 
        });

        // Show option if starts with 'f' or '0'
        setShowExperienceOptions(value.startsWith('f') || value.startsWith('0'));
      }}
      className={`w-full px-3 py-2 rounded-lg border text-gray-800 placeholder-gray-500 ${
        darkMode
          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
          : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
      }`}
    />

    {showExperienceOptions && (
      <div
        className={`absolute z-10 mt-1 w-full rounded-md shadow-lg ${
          darkMode ? 'bg-gray-700' : 'bg-white'
        }`}
      >
        <div className="py-1">
          <div
            className={`px-4 py-2 text-sm cursor-pointer ${
              darkMode ? 'text-white hover:bg-gray-600' : 'text-gray-800 hover:bg-gray-100'
            }`}
            onClick={() => {
              setFilters({
                ...filters,
                yearsOfExperience: 'Fresher'
              });
              setShowExperienceOptions(false);
            }}
          >
            Fresher (0 years)
          </div>
        </div>
      </div>
    )}
  </div>
</div>


          {filters.dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">From</label>
                <DatePicker
                  selected={filters.customStart ? new Date(filters.customStart) : null}
                  onChange={(date) => handleCustomDateChange(date, 'customStart')}
                  selectsStart
                  startDate={filters.customStart ? new Date(filters.customStart) : null}
                  endDate={filters.customEnd ? new Date(filters.customEnd) : null}
                  className={`w-full px-3 py-2 rounded-lg border text-gray-800 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">To</label>
                <DatePicker
                  selected={filters.customEnd ? new Date(filters.customEnd) : null}
                  onChange={(date) => handleCustomDateChange(date, 'customEnd')}
                  selectsEnd
                  startDate={filters.customStart ? new Date(filters.customStart) : null}
                  endDate={filters.customEnd ? new Date(filters.customEnd) : null}
                  minDate={filters.customStart ? new Date(filters.customStart) : null}
                  className={`w-full px-3 py-2 rounded-lg border text-gray-800 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Filters;