import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiEdit2, FiTrash2, FiShield, FiAlertCircle } from 'react-icons/fi';

const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

const BlacklistManager = () => {
  const [blacklistedEntries, setBlacklistedEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showUnblockConfirm, setShowUnblockConfirm] = useState(false);
  const [entryToUnblock, setEntryToUnblock] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchBlacklistedEntries = async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');

    if (!token) {
      toast.error("Access denied. Please log in.");
      return;
    }

    try {
      const response = await axios.get(`/api/admin/form-entries`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Filter only blacklisted entries
      const blacklisted = response.data.filter(entry => entry.isBlacklisted);
      setBlacklistedEntries(blacklisted);
    } catch (err) {
      console.error('Failed to fetch entries:', err);
      toast.error("Failed to fetch blacklisted candidates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlacklistedEntries();
  }, []);

  const openModal = (entry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEntry(null);
    document.body.style.overflow = 'auto';
  };

  const handleUnblacklist = async (entry) => {
    setEntryToUnblock(entry);
    setShowUnblockConfirm(true);
  };

  const confirmUnblacklist = async () => {
    const token = localStorage.getItem('adminToken');
    
    try {
      await axios.patch(
        `/api/admin/form-entries/${entryToUnblock.id}/blacklist`,
        { isBlacklisted: false },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      toast.success('✅ Candidate removed from blacklist');
      fetchBlacklistedEntries();
      setShowUnblockConfirm(false);
      setEntryToUnblock(null);
      if (isModalOpen && selectedEntry?.id === entryToUnblock.id) {
        closeModal();
      }
    } catch (err) {
      toast.error('❌ Failed to update blacklist status');
    }
  };

  const handleDelete = async (entry) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${entry.fullName}?`)) {
      return;
    }

    const token = localStorage.getItem('adminToken');
    
    try {
      await axios.delete(
        `/api/admin/form-entries/${entry.id}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      toast.success('✅ Candidate deleted successfully');
      fetchBlacklistedEntries();
      if (isModalOpen && selectedEntry?.id === entry.id) {
        closeModal();
      }
    } catch (err) {
      toast.error('❌ Failed to delete candidate');
    }
  };

  const renderField = (label, value) => {
    if (!value) return null;
    return (
      <p className={`mt-1 text-sm font-noto-serif ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        <strong className={darkMode ? 'text-[#DC2626]' : 'text-[#DC2626]'}>{label}:</strong> {value}
      </p>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DC2626]"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors font-noto-serif duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Toaster 
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: darkMode ? '#1F2937' : '#FFFFFF',
            color: darkMode ? '#F9FAFB' : '#111827',
            border: darkMode ? '1px solid #374151' : '1px solid #E5E7EB',
          },
          success: {
            iconTheme: {
              primary: '#DC2626',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
      
      <div className="p-6 max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-3xl font-noto-serif font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}
        >
          Blacklisted Candidates
        </motion.h1>

        {blacklistedEntries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FiShield className={`mx-auto text-6xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No blacklisted candidates
            </p>
            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Candidates you blacklist will appear here
            </p>
          </motion.div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Showing <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{blacklistedEntries.length}</span> blacklisted candidates
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
              <AnimatePresence>
                {blacklistedEntries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className={`rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-xl ${
                      darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}
                  >
                    <div className="p-5">
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${
                          darkMode ? 'bg-red-900' : 'bg-red-50'
                        }`}>
                          <span className={darkMode ? 'text-red-300' : 'text-[#DC2626]'}>
                            {entry.fullName?.charAt(0) || '?'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <h2 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {entry.fullName || 'No Name'}
                          </h2>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {entry.nationality} • {String(entry.currentlyEmployed).toUpperCase() === 'YES' ? 'Employed' : 'Not Employed'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        {renderField('Email', entry.email)}
                        {renderField('Contact', entry.mobileContact)}
                        {renderField('Education', entry.educationLevel)}
                        
                        {entry.skills && (
                          <div className="mt-2">
                            <p className={`text-xs ${darkMode ? 'text-[#DC2626]' : 'text-[#DC2626]'}`}>SKILLS</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {entry.skills.split(',').slice(0, 3).map((skill, i) => (
                                <span 
                                  key={i} 
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {skill.trim()}
                                </span>
                              ))}
                              {entry.skills.split(',').length > 3 && (
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-500'
                                }`}>
                                  +{entry.skills.split(',').length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className={`mt-6 pt-4 ${
                        darkMode ? 'border-gray-700' : 'border-gray-200'
                      } border-t`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {entry.resumeFile && (
                              <a
                                href={entry.resumeFile}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-xs flex items-center ${
                                  darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-[#DC2626] hover:text-[#DC2626]/80'
                                }`}
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Resume
                              </a>
                            )}
                          </div>
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {new Date(entry.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className={`px-5 pb-5 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <div className="flex items-center justify-between space-x-2">
                        <button
                          onClick={() => handleUnblacklist(entry)}
                          className="flex-1 p-2 cursor-pointer rounded-lg transition-colors bg-green-600 text-white hover:bg-green-700"
                          title="Remove from Blacklist"
                        >
                          <FiShield className="w-4 h-4 mx-auto" />
                        </button>
                        <button
                          onClick={() => handleDelete(entry)}
                          className="flex-1 p-2 cursor-pointer bg-[#DC2626] text-white rounded-lg hover:bg-[#DC2626]/80 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4 mx-auto" />
                        </button>
                        <button
                          onClick={() => openModal(entry)}
                          className="flex-1 px-4 py-2 cursor-pointer bg-[#DC2626] text-white text-sm rounded-lg hover:bg-[#DC2626]/80 transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}

        {/* Details Modal */}
        <AnimatePresence>
          {isModalOpen && selectedEntry && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className={`relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={closeModal}
                  className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                  }`}
                >
                  <svg className={`w-6 h-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <FiAlertCircle className="text-red-600 text-3xl" />
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Blacklisted Candidate Details
                    </h2>
                  </div>

                  <div className="flex items-start mb-6">
                    <div className={`flex-shrink-0 h-20 w-20 rounded-full flex items-center justify-center ${
                      darkMode ? 'bg-red-900' : 'bg-red-50'
                    }`}>
                      <span className={`text-2xl ${darkMode ? 'text-red-50' : 'text-[#FF0000]'}`}>
                        {selectedEntry.fullName?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div className="ml-6">
                      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {selectedEntry.fullName || 'No Name'}
                      </h2>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`px-3 py-1 text-sm rounded-full ${
                          darkMode ? 'bg-red-900 text-red-200' : 'bg-red-50 text-[#FF0000]'
                        }`}>
                          {selectedEntry.nationality}
                        </span>
                        <span className="px-3 py-1 text-sm rounded-full bg-red-600 text-white">
                          BLACKLISTED
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className={`font-semibold text-lg mb-3 ${darkMode ? 'text-[#FF0000]' : 'text-[#FF0000]'}`}>
                          Personal Details
                        </h3>
                        {renderField('Full Name', selectedEntry.fullName)}
                        {renderField('Email', selectedEntry.email)}
                        {renderField('Nationality', selectedEntry.nationality)}
                        {renderField('Date of Birth', selectedEntry.dateOfBirth?.slice(0, 10))}
                        {renderField('Gender', selectedEntry.gender)}
                        {renderField('Mobile Contact', selectedEntry.mobileContact)}
                        {renderField('WhatsApp', selectedEntry.whatsapp)}
                        {renderField('Current Address', selectedEntry.currentAddress)}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className={`font-semibold text-lg mb-3 ${darkMode ? 'text-[#FF0000]' : 'text-[#FF0000]'}`}>
                          Professional Details
                        </h3>
                        {renderField('Education Level', selectedEntry.educationLevel)}
                        {renderField('Course/Degree', selectedEntry.courseDegree)}
                        {renderField('Currently Employed', selectedEntry.currentlyEmployed)}
                        {renderField('Employment Desired', selectedEntry.employmentDesired)}
                        {renderField('Years of Experience', selectedEntry.yearsOfExperience)}
                        {renderField('Skills', selectedEntry.skills)}
                        {renderField('Expected Salary', selectedEntry.expectedSalary)}
                      </div>
                    </div>
                  </div>

                  <div className={`pt-8 mt-8 border-t flex justify-end space-x-3 ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <button
                      onClick={() => handleUnblacklist(selectedEntry)}
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Remove from Blacklist
                    </button>
                    <button
                      onClick={() => handleDelete(selectedEntry)}
                      className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Delete Permanently
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unblock Confirmation Modal */}
        {showUnblockConfirm && entryToUnblock && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className={`rounded-2xl shadow-2xl p-8 max-w-md w-full text-center ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <FiShield size={32} className="text-green-600" />
                </div>
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Confirm Unblock
              </h2>
              <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Are you sure you want to remove <strong>{entryToUnblock.fullName}</strong> from the blacklist? 
                They will appear in the main dashboard again.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setShowUnblockConfirm(false);
                    setEntryToUnblock(null);
                  }}
                  className={`px-6 py-2 font-semibold rounded-lg transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmUnblacklist}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Unblock
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlacklistManager;
