import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaWhatsapp, FaFileExcel, FaEye, FaFilter, FaTrash, FaCheckSquare, FaSquare, FaArrowLeft, FaEnvelope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import StageEmailModal from './StageEmailModal';

const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

const InternshipManager = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCustomEmailModal, setShowCustomEmailModal] = useState(false);
  const [showStageEmailModal, setShowStageEmailModal] = useState(false);
  const [pendingStageChange, setPendingStageChange] = useState(null);
  const [selectedForDelete, setSelectedForDelete] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [customEmailData, setCustomEmailData] = useState({
    subject: '',
    message: '',
    attachmentUrl: ''
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter states
  const [filters, setFilters] = useState({
    stage: '',
    department: '',
    university: ''
  });

  const stages = ['APPLIED', 'INTERVIEW', 'ACCEPTED', 'REJECTED', 'COMPLETION', 'CERTIFICATION'];
  const departments = ['IT', 'Finance', 'Admin', 'HR', 'Marketing', 'Operations'];

  // Get allowed next stages based on current stage (no going back)
  const getAllowedStages = (currentStage) => {
    const stageFlow = {
      'APPLIED': ['APPLIED', 'INTERVIEW'],
      'INTERVIEW': ['INTERVIEW', 'ACCEPTED', 'REJECTED'],
      'ACCEPTED': ['ACCEPTED', 'COMPLETION', 'CERTIFICATION'],
      'REJECTED': ['REJECTED'], // Terminal stage
      'COMPLETION': ['COMPLETION', 'CERTIFICATION'],
      'CERTIFICATION': ['CERTIFICATION'] // Terminal stage
    };
    
    return stageFlow[currentStage?.toUpperCase()] || ['APPLIED'];
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, applications]);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`/api/internships/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data.data);
      setFilteredApplications(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('❌ Failed to fetch applications');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...applications];
    let filterCount = 0;

    if (filters.stage) {
      filtered = filtered.filter(app => app.stage === filters.stage);
      filterCount++;
    }
    if (filters.department) {
      filtered = filtered.filter(app => app.department === filters.department);
      filterCount++;
    }
    if (filters.university) {
      filtered = filtered.filter(app => 
        app.university.toLowerCase().includes(filters.university.toLowerCase())
      );
      filterCount++;
    }

    setFilteredApplications(filtered);
    setCurrentPage(1); // Reset to first page when filters change
    
    if (filterCount > 0) {
      toast.info(`🔍 Showing ${filtered.length} of ${applications.length} applications`);
    }
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const updateStage = async (id, newStage) => {
    // Find the application
    const app = applications.find(a => a.id === id);
    if (!app) {
      toast.error('❌ Application not found');
      return;
    }

    // Check if trying to select same stage
    if (app.stage?.toUpperCase() === newStage) {
      toast.info('ℹ️ Application is already in this stage');
      return;
    }

    // Open email modal directly
    setPendingStageChange({ id, newStage });
    setSelectedApplication(app);
    setShowStageEmailModal(true);
  };

  const handleStageEmailSuccess = () => {
    // Refresh applications after email is sent and stage is updated
    toast.success('✅ Stage updated and email sent successfully!');
    fetchApplications();
    setPendingStageChange(null);
    setSelectedApplication(null);
  };

  // Open custom email modal
  const openCustomEmailModal = (application) => {
    setSelectedApplication(application);
    setCustomEmailData({
      subject: '',
      message: '',
      attachmentUrl: ''
    });
    setShowCustomEmailModal(true);
  };

  // Send custom email
  const sendCustomEmail = async () => {
    if (!customEmailData.subject.trim() || !customEmailData.message.trim()) {
      toast.error('❌ Subject and message are required');
      return;
    }

    setIsSendingEmail(true);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(
        `/api/internships/applications/send-custom-email`,
        {
          applicationIds: [selectedApplication.id],
          subject: customEmailData.subject,
          message: customEmailData.message,
          attachmentUrl: customEmailData.attachmentUrl
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('✅ Email sent successfully!');
      setShowCustomEmailModal(false);
      setSelectedApplication(null);
      setCustomEmailData({ subject: '', message: '', attachmentUrl: '' });
    } catch (error) {
      console.error('Send error:', error);
      toast.error(error.response?.data?.message || '❌ Failed to send email');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const exportToExcel = async () => {
    try {
      toast.info('📊 Preparing Excel file...');
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        `/api/internships/export`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `internship_applications_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('✅ Excel file downloaded successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('❌ Failed to export data');
    }
  };

  const openWhatsApp = (mobile) => {
    const cleanNumber = mobile.replace(/[^0-9]/g, '');
    if (cleanNumber) {
      window.open(`https://wa.me/${cleanNumber}`, '_blank');
      toast.success('📱 Opening WhatsApp...');
    } else {
      toast.error('❌ Invalid mobile number');
    }
  };

  const viewDetails = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  // Select/Deselect individual application
  const toggleSelectApplication = (id) => {
    setSelectedForDelete(prev => 
      prev.includes(id) ? prev.filter(appId => appId !== id) : [...prev, id]
    );
  };

  // Select/Deselect all applications
  const toggleSelectAll = () => {
    if (selectedForDelete.length === filteredApplications.length) {
      setSelectedForDelete([]);
    } else {
      setSelectedForDelete(filteredApplications.map(app => app.id));
    }
  };

  // Delete single application
  const handleDeleteSingle = (application) => {
    setDeleteTarget({ type: 'single', data: application });
    setShowDeleteConfirm(true);
  };

  // Delete multiple applications
  const handleDeleteBulk = () => {
    if (selectedForDelete.length === 0) {
      toast.warning('⚠️ Please select applications to delete');
      return;
    }
    setDeleteTarget({ type: 'bulk', data: selectedForDelete });
    setShowDeleteConfirm(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (deleteTarget.type === 'single') {
        await axios.delete(
          `/api/internships/applications/${deleteTarget.data.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('✅ Application deleted successfully');
      } else {
        await axios.post(
          `/api/internships/applications/bulk-delete`,
          { applicationIds: deleteTarget.data },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(`✅ ${deleteTarget.data.length} applications deleted successfully`);
        setSelectedForDelete([]);
      }
      
      fetchApplications();
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('❌ Failed to delete application(s)');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B91C1C]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-[#B91C1C] transition"
            >
              <FaArrowLeft size={20} />
              <span className="font-medium">Back</span>
            </button>
            <h1 className="text-3xl font-bold text-[#B91C1C]">Internship Applications</h1>
          </div>
          
          <div className="flex justify-end items-center gap-3">
            {selectedForDelete.length > 0 && (
              <button
                onClick={handleDeleteBulk}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                <FaTrash /> Delete Selected ({selectedForDelete.length})
              </button>
            )}
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <FaFileExcel /> Export to Excel
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-[#B91C1C]" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filters.stage}
              onChange={(e) => setFilters({ ...filters, stage: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">All Stages</option>
              {stages.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>

            <select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search University"
              value={filters.university}
              onChange={(e) => setFilters({ ...filters, university: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#B91C1C] text-white">
                <tr>
                  <th className="px-4 py-3 text-center w-12" title="Select for Delete">
                    <button
                      onClick={toggleSelectAll}
                      className="text-white hover:text-gray-200"
                      title={selectedForDelete.length === filteredApplications.length ? 'Deselect All' : 'Select All'}
                    >
                      {selectedForDelete.length === filteredApplications.length ? (
                        <FaCheckSquare size={18} />
                      ) : (
                        <FaSquare size={18} />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Department</th>
                  <th className="px-4 py-3 text-left">University</th>
                  <th className="px-4 py-3 text-left">Stage</th>
                  <th className="px-4 py-3 text-left">Applied Date</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentApplications.map((app) => (
                  <tr key={app.id} className={`border-b hover:bg-gray-50 ${selectedForDelete.includes(app.id) ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleSelectApplication(app.id)}
                        className="text-gray-600 hover:text-[#B91C1C]"
                        title="Select for Delete"
                      >
                        {selectedForDelete.includes(app.id) ? (
                          <FaCheckSquare size={18} className="text-[#B91C1C]" />
                        ) : (
                          <FaSquare size={18} />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">{app.name}</td>
                    <td className="px-4 py-3">{app.email}</td>
                    <td className="px-4 py-3">{app.department}</td>
                    <td className="px-4 py-3">{app.university}</td>
                    <td className="px-4 py-3">
                      <select
                        value={app.stage?.toUpperCase() || 'APPLIED'}
                        onChange={(e) => updateStage(app.id, e.target.value)}
                        className={`px-2 py-1 rounded text-sm font-semibold ${
                          app.stage?.toUpperCase() === 'APPLIED' ? 'bg-blue-100 text-blue-800' :
                          app.stage?.toUpperCase() === 'INTERVIEW' ? 'bg-yellow-100 text-yellow-800' :
                          app.stage?.toUpperCase() === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                          app.stage?.toUpperCase() === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          app.stage?.toUpperCase() === 'COMPLETION' ? 'bg-purple-100 text-purple-800' :
                          'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {stages.map(stage => {
                          const allowedStages = getAllowedStages(app.stage);
                          const isDisabled = !allowedStages.includes(stage);
                          return (
                            <option key={stage} value={stage} disabled={isDisabled}>
                              {stage}
                            </option>
                          );
                        })}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => viewDetails(app)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Details"
                        >
                          <FaEye size={18} />
                        </button>
                        <button
                          onClick={() => openCustomEmailModal(app)}
                          className="text-purple-600 hover:text-purple-800"
                          title="Send Email"
                        >
                          <FaEnvelope size={18} />
                        </button>
                        <button
                          onClick={() => openWhatsApp(app.mobile)}
                          className="text-green-500 hover:text-green-700"
                          title="WhatsApp"
                        >
                          <FaWhatsapp size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteSingle(app)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {filteredApplications.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-gray-200 gap-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredApplications.length)} of {filteredApplications.length} applications
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Show:</label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-[#B91C1C] focus:border-transparent"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="text-sm text-gray-600">per page</span>
                </div>
              </div>
              
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      // Show first page, last page, current page, and pages around current
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => paginate(pageNumber)}
                            className={`px-3 py-1 rounded-lg ${
                              currentPage === pageNumber
                                ? 'bg-[#B91C1C] text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return <span key={pageNumber} className="px-2">...</span>;
                      }
                      return null;
                    })}
                  </div>
                  
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Details Modal */}
        {showModal && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-[#B91C1C]">Application Details</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold">{selectedApplication.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="font-semibold">{new Date(selectedApplication.dob).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mobile</p>
                    <p className="font-semibold">{selectedApplication.mobile}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="font-semibold">{selectedApplication.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Qualification</p>
                    <p className="font-semibold">{selectedApplication.qualification}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">University</p>
                    <p className="font-semibold">{selectedApplication.university}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-semibold">{selectedApplication.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Internship Coordinator</p>
                    <p className="font-semibold">{selectedApplication.internship_coordinator}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Hours</p>
                    <p className="font-semibold">{selectedApplication.hours}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Joining Date</p>
                    <p className="font-semibold">{new Date(selectedApplication.joining_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Place</p>
                    <p className="font-semibold">{selectedApplication.place}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Disability</p>
                    <p className="font-semibold">{selectedApplication.disability === 'Yes' ? 'Yes' : 'No'}</p>
                  </div>
                  {selectedApplication.disability === 'Yes' && (
                    <div>
                      <p className="text-sm text-gray-600">Disability Type</p>
                      <p className="font-semibold">{selectedApplication.disability_type}</p>
                    </div>
                  )}
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Resume</p>
                    <a
                      href={selectedApplication.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Resume
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Modal */}
        {/* Custom Email Modal */}
        {showCustomEmailModal && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-[#B91C1C]">Send Custom Email</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      To: {selectedApplication.name} ({selectedApplication.email})
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowCustomEmailModal(false);
                      setSelectedApplication(null);
                    }}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customEmailData.subject}
                      onChange={(e) => setCustomEmailData({ ...customEmailData, subject: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#B91C1C] focus:border-transparent"
                      placeholder="Email subject"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={customEmailData.message}
                      onChange={(e) => setCustomEmailData({ ...customEmailData, message: e.target.value })}
                      rows="10"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#B91C1C] focus:border-transparent"
                      placeholder="Write your message here..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attachment URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={customEmailData.attachmentUrl}
                      onChange={(e) => setCustomEmailData({ ...customEmailData, attachmentUrl: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#B91C1C] focus:border-transparent"
                      placeholder="https://example.com/file.pdf"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Provide a direct URL to a file you want to attach
                    </p>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                      onClick={() => setShowCustomEmailModal(false)}
                      disabled={isSendingEmail}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={sendCustomEmail}
                      disabled={isSendingEmail}
                      className="px-6 py-2 bg-[#B91C1C] text-white rounded-lg hover:bg-[#991B1B] disabled:opacity-50 flex items-center gap-2 min-w-[140px] justify-center"
                    >
                      {isSendingEmail ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <FaEnvelope />
                          Send Email
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stage Email Modal */}
        <StageEmailModal
          isOpen={showStageEmailModal}
          onClose={() => {
            setShowStageEmailModal(false);
            setPendingStageChange(null);
          }}
          selectedApplications={selectedApplication ? [selectedApplication] : []}
          newStage={pendingStageChange?.newStage || ''}
          onSuccess={handleStageEmailSuccess}
        />

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-[#B91C1C] mb-4">Confirm Delete</h2>
              <p className="text-gray-700 mb-6">
                {deleteTarget?.type === 'single' 
                  ? `Are you sure you want to delete the application of ${deleteTarget.data.name}? This action cannot be undone.`
                  : `Are you sure you want to delete ${deleteTarget?.data.length} selected application(s)? This action cannot be undone.`
                }
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteTarget(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipManager;
