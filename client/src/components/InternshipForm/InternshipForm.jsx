import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaGraduationCap, FaFileUpload, FaCheck, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

const InternshipForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    dob: '',
    gender: '',
    qualification: '',
    university: '',
    department: '',
    internship_coordinator: '',
    hours: '',
    joining_date: '',
    disability: 'No',
    disability_type: '',
    place: ''
  });

  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [defaultCountry, setDefaultCountry] = useState('bh'); // Default to Bahrain

  const departments = ['IT', 'Finance', 'Admin', 'HR', 'Marketing', 'Operations'];

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUserCountry();
  }, []);

  // Fetch user's country based on IP
  const fetchUserCountry = async () => {
    try {
      const response = await axios.get('https://ipapi.co/json/');
      const countryCode = response.data.country_code?.toLowerCase() || 'bh';
      setDefaultCountry(countryCode);
    } catch (error) {
      console.log('Could not fetch country, using default');
      setDefaultCountry('bh'); // Fallback to Bahrain
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 1 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, file: 'File size must be less than 1 MB' }));
        setFile(null);
        toast.error("📁 File too big! Max 1MB allowed.", {
          position: "top-right",
          theme: "colored",
          style: { backgroundColor: '#FEE2E2', color: '#0284C7' }
        });
      } else {
        setFile(selectedFile);
        setErrors(prev => ({ ...prev, file: '' }));
        toast.success("📄 File selected successfully!", {
          position: "top-right",
          theme: "colored",
          style: { backgroundColor: '#D1FAE5', color: '#065F46' }
        });
      }
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    if (!formData.mobile) newErrors.mobile = 'Mobile number is required';
    else if (!/^\+?\d{10,15}$/.test(formData.mobile)) newErrors.mobile = 'Invalid mobile number';
    
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.qualification) newErrors.qualification = 'Qualification is required';
    if (!formData.university) newErrors.university = 'University is required';
    if (!formData.department) newErrors.department = 'Department is required';
    
    if (formData.disability === 'Yes' && !formData.disability_type) {
      newErrors.disability_type = 'Please specify disability type';
    }

    if (!file) newErrors.file = 'Resume is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("🚨 Please complete all required fields!", {
        position: "top-right",
        theme: "colored",
        style: { backgroundColor: '#FEE2E2', color: '#0284C7' }
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Form data before sending:', formData);
      
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
        console.log(`Appending ${key}:`, formData[key]);
      });
      if (file) formDataToSend.append('resume', file);

      const response = await axios.post(
        `/api/internships/submit`,
        formDataToSend,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      if (response.data.success) {
        setShowSuccess(true);
        toast.success("🎉 Application submitted successfully!", {
          position: "top-right",
          theme: "colored",
          style: { backgroundColor: '#D1FAE5', color: '#065F46' }
        });

        setTimeout(() => {
          setShowSuccess(false);
          resetForm();
        }, 5000);
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error("⚠️ Submission failed! Please try again.", {
        position: "top-right",
        theme: "colored",
        style: { backgroundColor: '#FEE2E2', color: '#0284C7' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      mobile: '',
      dob: '',
      gender: '',
      qualification: '',
      university: '',
      department: '',
      internship_coordinator: '',
      hours: '',
      joining_date: '',
      disability: 'No',
      disability_type: '',
      place: ''
    });
    setFile(null);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#e2e3e6] py-12 px-4">
      <ToastContainer />

      <div className="max-w-4xl mx-auto">
        {/* Header with Logo */}
        <div className="text-center mb-10">
          {/* <img 
            src="https://res.cloudinary.com/ds1dt3qub/image/upload/v1771333289/gvs-Il-kmUlQ-removebg-preview_p33n0j.png" 
            alt="GVS Logo" 
            className="w-40 mx-auto mb-6"
          /> */}
          <h1 className="text-4xl font-bold mb-3 text-[#0284C7]">
            Internship Registration
          </h1>
          <p className="text-gray-600 text-lg">
            Join GVS and kickstart your career journey with us
          </p>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
                >
                  <FaCheck className="w-12 h-12 text-green-500" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
                <p className="text-gray-600 mb-6">
                  Your internship application has been submitted successfully. We'll review it and get back to you soon.
                </p>
                <p className="text-sm text-gray-500">
                  This message will close automatically...
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        {!showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200"
          >
            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#0284C7] mb-6 flex items-center gap-2">
                  <FaUser /> Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0284C7] focus:border-transparent ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0284C7] focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <PhoneInput
                      country={defaultCountry}
                      value={formData.mobile}
                      onChange={(phone) => {
                        setFormData(prev => ({ ...prev, mobile: phone }));
                        setErrors(prev => ({ ...prev, mobile: '' }));
                      }}
                      inputStyle={{
                        width: '100%',
                        height: '48px',
                        fontSize: '16px',
                        paddingLeft: '48px',
                        borderRadius: '8px',
                        border: errors.mobile ? '1px solid #ef4444' : '1px solid #d1d5db',
                      }}
                      buttonStyle={{
                        borderRadius: '8px 0 0 8px',
                        border: errors.mobile ? '1px solid #ef4444' : '1px solid #d1d5db',
                      }}
                      containerStyle={{
                        width: '100%',
                      }}
                      enableSearch={true}
                      searchPlaceholder="Search country"
                      preferredCountries={['bh', 'sa', 'ae', 'kw', 'qa', 'om']}
                    />
                    {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      max={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0284C7] focus:border-transparent ${
                        errors.dob ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0284C7] focus:border-transparent ${
                        errors.gender ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Place
                    </label>
                    <input
                      type="text"
                      name="place"
                      value={formData.place}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0284C7] focus:border-transparent"
                      placeholder="City/Location"
                    />
                  </div>
                </div>
              </div>

              {/* Education & Internship Details */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#0284C7] mb-6 flex items-center gap-2">
                  <FaGraduationCap /> Education & Internship Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qualification <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0284C7] focus:border-transparent ${
                        errors.qualification ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Bachelor's in Computer Science"
                    />
                    {errors.qualification && <p className="text-red-500 text-sm mt-1">{errors.qualification}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      University <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="university"
                      value={formData.university}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0284C7] focus:border-transparent ${
                        errors.university ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Your university name"
                    />
                    {errors.university && <p className="text-red-500 text-sm mt-1">{errors.university}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0284C7] focus:border-transparent ${
                        errors.department ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Internship Coordinator
                    </label>
                    <input
                      type="text"
                      name="internship_coordinator"
                      value={formData.internship_coordinator}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0284C7] focus:border-transparent"
                      placeholder="Coordinator name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hours per Week
                    </label>
                    <input
                      type="number"
                      name="hours"
                      value={formData.hours}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0284C7] focus:border-transparent"
                      placeholder="e.g., 20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Joining Date
                    </label>
                    <input
                      type="date"
                      name="joining_date"
                      value={formData.joining_date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0284C7] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Disability Information */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#0284C7] mb-6">Additional Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Do you have any disability?
                    </label>
                    <select
                      name="disability"
                      value={formData.disability}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0284C7] focus:border-transparent"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>

                  {formData.disability === 'Yes' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Disability Type <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="disability_type"
                        value={formData.disability_type}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0284C7] focus:border-transparent ${
                          errors.disability_type ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Please specify"
                      />
                      {errors.disability_type && <p className="text-red-500 text-sm mt-1">{errors.disability_type}</p>}
                    </div>
                  )}
                </div>
              </div>

              {/* Resume Upload */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Resume (PDF/Image, Max 1MB) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,image/*"
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className={`flex items-center justify-center gap-2 w-full px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition ${
                      errors.file ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <FaFileUpload className="text-2xl text-[#0284C7]" />
                    <span className="text-gray-600">
                      {file ? file.name : 'Click to upload your resume'}
                    </span>
                  </label>
                  {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-4 bg-[#0284C7] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-2"
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    Submit Application
                    <FaArrowRight />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default InternshipForm;

