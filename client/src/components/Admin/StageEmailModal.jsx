import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaFileUpload } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

const StageEmailModal = ({ isOpen, onClose, selectedApplications, newStage, onSuccess }) => {
  const [formData, setFormData] = useState({
    subject: '',
    emailContent: '',
    date: '',
    time: '',
    venue: ''
  });
  
  const [certificate, setCertificate] = useState(null);
  const [certificateData, setCertificateData] = useState(null); // Store complete certificate info
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && selectedApplications.length > 0) {
      // Reset all fields
      setFormData({
        subject: '',
        emailContent: '',
        date: '',
        time: '',
        venue: ''
      });
      setCertificate(null);
      setCertificateData(null);
      
      // Then generate default content
      generateDefaultContent();
    }
  }, [isOpen, newStage, selectedApplications]);

  // Update email content when date/time/venue changes (for Interview stage)
  useEffect(() => {
    if (newStage === 'INTERVIEW' && (formData.date || formData.time || formData.venue)) {
      updateInterviewContent();
    }
  }, [formData.date, formData.time, formData.venue]);

  const updateInterviewContent = () => {
    const applicant = selectedApplications[0];
    const isBulk = selectedApplications.length > 1;
    
    const dateStr = formData.date ? new Date(formData.date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) : '[Please fill in the date]';
    
    const timeStr = formData.time || '[Please fill in the time]';
    const venueStr = formData.venue || '[Please fill in the venue]';

    const content = `Dear ${isBulk ? 'Candidate' : applicant.name},

We are pleased to inform you that your application for the internship position${isBulk ? '' : ` in the ${applicant.department} department`} has been shortlisted.

Interview Details:
Date: ${dateStr}
Time: ${timeStr}
Venue: ${venueStr}

Please confirm your attendance by replying to this email.

We look forward to meeting you!

Best regards,
GVS Internship Team`;

    setFormData(prev => ({ ...prev, emailContent: content }));
  };

  const generateDefaultContent = () => {
    const applicant = selectedApplications[0];
    const isBulk = selectedApplications.length > 1;

    const templates = {
      'INTERVIEW': {
        subject: 'Interview Invitation - GVS Internship Program',
        content: `Dear ${isBulk ? 'Candidate' : applicant.name},

We are pleased to inform you that your application for the internship position${isBulk ? '' : ` in the ${applicant.department} department`} has been shortlisted.

Interview Details:
Date: [Please fill in the date]
Time: [Please fill in the time]
Venue: [Please fill in the venue]

Please confirm your attendance by replying to this email.

We look forward to meeting you!

Best regards,
GVS Internship Team`
      },
      'ACCEPTED': {
        subject: 'Congratulations! Internship Offer - GVS',
        content: `Dear ${isBulk ? 'Candidate' : applicant.name},

We are delighted to inform you that you have been selected for the internship position${isBulk ? '' : ` in the ${applicant.department} department`} at GVS.

Further details regarding your joining date and onboarding process will be shared with you shortly.

We look forward to having you on our team!

Best regards,
GVS Internship Team`
      },
      'REJECTED': {
        subject: 'Update on Your Internship Application - GVS',
        content: `Dear ${isBulk ? 'Candidate' : applicant.name},

Thank you for your interest in the internship position at GVS and for taking the time to apply.

After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.

We appreciate your interest in GVS and wish you all the best in your future endeavors.

Best regards,
GVS Internship Team`
      },
      'COMPLETION': {
        subject: 'Internship Completion - GVS',
        content: `Dear ${isBulk ? 'Candidate' : applicant.name},

Congratulations on successfully completing your internship with GVS${isBulk ? '' : ` in the ${applicant.department} department`}!

We appreciate your hard work and dedication during your time with us.

We wish you all the best in your future career!

Best regards,
GVS Internship Team`
      },
      'CERTIFICATION': {
        subject: 'Your Internship Certificate - GVS',
        content: `Dear ${isBulk ? 'Candidate' : applicant.name},

Please find attached your internship completion certificate for your successful completion of the internship program at GVS.

We are proud of your achievements and wish you continued success in your career.

Thank you for being a part of GVS!

Best regards,
GVS Internship Team`
      }
    };

    const template = templates[newStage] || templates['ACCEPTED'];
    setFormData(prev => ({
      ...prev,
      subject: template.subject,
      emailContent: template.content
    }));
  };

  const handleCertificateUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      e.target.value = ''; // Reset input
      return;
    }

    setCertificate(file); // Set file immediately to show name
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('certificate', file);

      const token = localStorage.getItem('adminToken');
      const response = await axios.post(
        `${baseUrl}/api/internships/upload-certificate`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Store complete certificate data including original filename and type
      setCertificateData({
        url: response.data.url,
        filename: response.data.filename,
        contentType: response.data.contentType
      });
      
      toast.success('✅ Certificate uploaded successfully');
    } catch (error) {
      toast.error('❌ Failed to upload certificate');
      console.error(error);
      setCertificate(null); // Clear on error
      setCertificateData(null);
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input to allow re-selection
    }
  };

  const validateForm = () => {
    if (!formData.subject.trim()) {
      toast.error('Subject is required');
      return false;
    }

    if (newStage === 'INTERVIEW') {
      if (!formData.date || !formData.time || !formData.venue) {
        toast.error('Date, time, and venue are required for interview stage');
        return false;
      }
    }

    if (newStage === 'CERTIFICATION' && !certificateData) {
      toast.error('Certificate upload is required for certification stage');
      return false;
    }

    return true;
  };

  const handleSend = async () => {
    if (!validateForm()) return;

    setIsSending(true);
    try {
      const token = localStorage.getItem('adminToken');
      
      if (selectedApplications.length === 1) {
        // Single email
        await axios.post(
          `${baseUrl}/api/internships/applications/${selectedApplications[0].id}/send-stage-email`,
          {
            stage: newStage,
            subject: formData.subject,
            customMessage: formData.emailContent,
            date: formData.date,
            time: formData.time,
            venue: formData.venue,
            certificateUrl: certificateData?.url,
            certificateFilename: certificateData?.filename,
            certificateContentType: certificateData?.contentType
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Bulk email
        await axios.post(
          `${baseUrl}/api/internships/applications/bulk-send-email`,
          {
            applicationIds: selectedApplications.map(app => app.id),
            stage: newStage,
            subject: formData.subject,
            customMessage: formData.emailContent,
            date: formData.date,
            time: formData.time,
            venue: formData.venue,
            certificateUrl: certificateData?.url,
            certificateFilename: certificateData?.filename,
            certificateContentType: certificateData?.contentType
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      toast.success(`Email${selectedApplications.length > 1 ? 's' : ''} sent successfully!`);
      
      // Reset form after successful send
      setFormData({
        subject: '',
        emailContent: '',
        date: '',
        time: '',
        venue: ''
      });
      setCertificate(null);
      setCertificateData(null);
      
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to send email');
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#8B4513]">
                Send {newStage} Email
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {selectedApplications.length} recipient{selectedApplications.length > 1 ? 's' : ''} selected
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              <FaTimes />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
                placeholder="Email subject"
              />
            </div>

            {/* Interview specific fields */}
            {newStage === 'INTERVIEW' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
                    placeholder="Interview venue"
                  />
                </div>
              </div>
            )}

            {/* Certificate upload */}
            {newStage === 'CERTIFICATION' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certificate Document <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleCertificateUpload}
                    accept=".pdf,image/*"
                    className="hidden"
                    id="certificate-upload"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="certificate-upload"
                    className={`flex items-center justify-center gap-2 w-full px-4 py-6 border-2 border-dashed rounded-lg transition ${
                      isUploading 
                        ? 'cursor-not-allowed bg-gray-100 border-gray-200' 
                        : 'cursor-pointer hover:bg-gray-50 border-gray-300 hover:border-[#8B4513]'
                    } ${certificate && certificateData ? 'bg-green-50 border-green-300' : ''}`}
                  >
                    <FaFileUpload className={`text-2xl ${certificate && certificateData ? 'text-green-600' : 'text-[#8B4513]'}`} />
                    <span className={`${certificate && certificateData ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                      {isUploading 
                        ? 'Uploading...' 
                        : certificate 
                          ? `✓ ${certificate.name}` 
                          : 'Click to upload certificate (PDF/Image, max 5MB)'}
                    </span>
                  </label>
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B4513]"></div>
                        <span className="text-sm text-gray-600">Uploading...</span>
                      </div>
                    </div>
                  )}
                </div>
                {certificate && certificateData && (
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                    ✓ Certificate ready to send
                  </p>
                )}
              </div>
            )}

            {/* Additional Message (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Message (Optional)
              </label>
              <textarea
                value={formData.emailContent}
                onChange={(e) => setFormData({ ...formData, emailContent: e.target.value })}
                rows="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0284C7] focus:border-transparent"
                placeholder="Add any additional message or instructions here (optional)..."
              />
              <p className="text-xs text-gray-500 mt-1">
                This message will be added to the professional email template
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              disabled={isSending}
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={isSending}
              className="px-6 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#6d3410] transition flex items-center gap-2"
            >
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Sending...
                </>
              ) : (
                `Send Email${selectedApplications.length > 1 ? 's' : ''}`
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StageEmailModal;
