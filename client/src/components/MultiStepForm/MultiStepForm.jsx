import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaBriefcase, FaGraduationCap, FaCheck, FaFileUpload, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import React from 'react';
import PersonalInfoStep from '../PersonalInfoStep/PersonalInfoStep';
import EducationWorkStep from '../EducationWorkStep/EducationWorkStep';
import ReferencesStep from '../ReferencesStep/ReferencesStep';
import AdditionalInfoStep from '../AdditionalInfoStep/AdditionalInfoStep';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import '../../app.css';
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const MultiStepForm = () => {
  const { pathname } = useLocation();
 
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
      email: '',
      fullName: '',
      dateOfBirth: '',
      gender:'',
      nationality: '',
      mobileContact: '',
      whatsapp: '',
      currentAddress: '',
      cprNationalId: '',
      passportId: '',
      passportValidity: '',
      educationLevel: '',
      courseDegree: '',
      currentlyEmployed: '',
      employmentDesired: '',
      availableStart: '',
      shiftAvailable: '',
      canTravel: '',
      drivingLicense: '',
      skills: '',
      ref1Name: '',
      ref1Contact: '',
      ref1Email: '',
      ref2Name: '',
      ref2Contact: '',
      ref2Email: '',
      ref3Name: '',
      ref3Contact: '',
      ref3Email: '',
      visaStatus: '',
      visaValidity: '',
      expectedSalary: '',
      clientLeadsStrategy: '',
  });

  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedStep, setSubmittedStep] = useState(null);
  const [progressWidth, setProgressWidth] = useState('25%');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const steps = [
    { id: 1, name: 'Personal Info', icon: <FaUser />, color: '#FF0000' },        // Bright Red
    { id: 2, name: 'Education/Work', icon: <FaBriefcase />, color: '#E60000' },  // Crimson Red
    { id: 3, name: 'References', icon: <FaGraduationCap />, color: '#CC0000' },  // Darker Red
    { id: 4, name: 'Complete', icon: <FaCheck />, color: '#B30000' },            // Deep Red
  ];
  

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  useEffect(() => {
     
      // Update progress width when step changes
      const width = `${((step - 1) / (steps.length - 1)) * 100}%`;
      setProgressWidth(width);
  }, [step]);

  // Reset form after success message disappears
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        resetForm();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const resetForm = () => {
    setFormData({
      email: '',
      fullName: '',
      dateOfBirth: '',
      gender:'',
      nationality: '',
      mobileContact: '',
      whatsapp: '',
      currentAddress: '',
      cprNationalId: '',
      passportId: '',
      passportValidity: '',
      educationLevel: '',
      courseDegree: '',
      currentlyEmployed: '',
      employmentDesired: '',
      availableStart: '',
      shiftAvailable: '',
      canTravel: '',
      drivingLicense: '',
      skills: '',
      ref1Name: '',
      ref1Contact: '',
      ref1Email: '',
      ref2Name: '',
      ref2Contact: '',
      ref2Email: '',
      ref3Name: '',
      ref3Contact: '',
      ref3Email: '',
      visaStatus: '',
      visaValidity: '',
      expectedSalary: '',
      clientLeadsStrategy: '',
    });
    setFile(null);
    setFileError('');
    setErrors({});
    setStep(1);
    setSubmittedStep(null);
  };
  const validateStep1 = () => {
    const newErrors = {};
  
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
  
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    }
  
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
  
    if (!formData.nationality) {
      newErrors.nationality = 'Nationality is required';
    }
  
    if (!formData.mobileContact) {
      newErrors.mobileContact = 'Mobile number is required';
    } else if (!/^\+?\d{10,15}$/.test(formData.mobileContact)) {
      newErrors.mobileContact = 'Invalid mobile number';
    }
  
    if (!formData.whatsapp) {
      newErrors.whatsapp = 'WhatsApp number is required';
    } else if (!/^\+?\d{10,15}$/.test(formData.whatsapp)) {
      newErrors.whatsapp = 'Invalid WhatsApp number';
    }
  
    if (!formData.currentAddress) {
      newErrors.currentAddress = 'Current address is required';
    }
  
    if (!formData.cprNationalId) {
      newErrors.cprNationalId = 'CPR/National ID is required';
    }
  
    if (!formData.passportId) {
      newErrors.passportId = 'Passport ID is required';
    } else if (!/^[A-Z0-9]{6,9}$/i.test(formData.passportId)) {
      newErrors.passportId = 'Invalid Passport ID';
    }
  
    if (!formData.passportValidity) {
      newErrors.passportValidity = 'Passport validity date is required';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
     
      const { name, value } = e.target;
      setFormData((prevData) => ({
          ...prevData,
          [name]: value,
      }));
      setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
      }));
  };

  const handleFileChange = (e) => {
     
    const selectedFile = e.target.files[0];
    if (selectedFile) {
        // Changed 10 to 2 for the 2 MB limit
        if (selectedFile.size > 2 * 1024 * 1024) { 
           
            // Updated the error message to reflect the new limit
            setFileError('File size must be less than 2 MB'); 
            setFile(null);
            toast.error("📁 File too big! Max 2MB allowed.", { // Also updated this toast message
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                style: { backgroundColor: '#FEE2E2', color: '#B91C1C' }
            });
        } else {
           
            setFile(selectedFile);
            setFileError('');
            toast.success("📄 File selected successfully!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                style: { backgroundColor: '#D1FAE5', color: '#065F46' }
            });
        }
    }
};

  const validateStep = (step) => {
   
    const newErrors = {};
  
    if (step === 1) {
      
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
  
      if (!formData.fullName) newErrors.fullName = 'Full name is required';
      if (!formData.postalCode) newErrors.postalCode = 'PostalCode is required';
      if (!formData.country) newErrors.country = 'Country is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';


  
      if (!formData.mobileContact) newErrors.mobileContact = 'Mobile number is required';
      else if (!/^\+?\d{10,15}$/.test(formData.mobileContact)) newErrors.mobileContact = 'Invalid mobile number';
  
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.nationality) newErrors.nationality = 'Nationality is required';
  
      if (!formData.whatsapp) newErrors.whatsapp = 'WhatsApp number is required';
      else if (!/^\+?\d{10,15}$/.test(formData.whatsapp)) newErrors.whatsapp = 'Invalid WhatsApp number';
  
      if (!formData.currentAddress) newErrors.currentAddress = 'Current address is required';
      // if (!formData.cprNationalId) newErrors.cprNationalId = 'CPR/National ID is required';
  
      // if (!formData.passportId) newErrors.passportId = 'Passport ID is required';
      // else if (!/^[A-Z0-9]{6,9}$/i.test(formData.passportId)) newErrors.passportId = 'Invalid Passport ID';
  
      // if (!formData.passportValidity) newErrors.passportValidity = 'Passport validity date is required';
    }
  
    if (step === 2) {
     
      if (!formData.educationLevel) newErrors.educationLevel = 'Education level is required';
      if (!formData.employmentDesired) newErrors.employmentDesired = 'Employment desired field is required';
      if (!formData.courseDegree) newErrors.courseDegree = 'Course/Degree is required';
      if (!formData.currentlyEmployed) newErrors.currentlyEmployed = 'Employment status is required';
      if (!formData.availableStart) newErrors.availableStart = 'Available start date is required';
      if (!formData.shiftAvailable) newErrors.shiftAvailable = 'Shift availability is required';
      if (!formData.canTravel) newErrors.canTravel = 'Travel ability is required';
      if (!formData.drivingLicense) newErrors.drivingLicense = 'Driving license status is required';
      if (!formData.skills) newErrors.skills = 'Skills field is required';
    }
  
    if (step === 3) {
  
      for (let i = 1; i <= 3; i++) {
        const name = formData[`ref${i}Name`];
        const contact = formData[`ref${i}Contact`];
        const email = formData[`ref${i}Email`];
    
        const anyFieldFilled = name || contact || email;
    
        if (anyFieldFilled) {
          if (!name) newErrors[`ref${i}Name`] = 'Reference name is required';
    
          if (!contact) {
            newErrors[`ref${i}Contact`] = 'Reference contact is required';
          } else if (!/^\+?\d{10,15}$/.test(contact)) {
            newErrors[`ref${i}Contact`] = 'Invalid contact number';
          }
    
          if (!email) {
            newErrors[`ref${i}Email`] = 'Reference email is required';
          } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors[`ref${i}Email`] = 'Invalid email format';
          }
        }
      }
    }
    
    
    if (step === 4) {
     
      if (!formData.clientLeadsStrategy) newErrors.clientLeadsStrategy = 'Client leads strategy is required';
    
      if (!formData.expectedSalary) {
        newErrors.expectedSalary = 'Expected salary is required';
      } else if (!/^\d+$/.test(formData.expectedSalary)) {
        // regex /^\d+$/ ensures only digits (no decimals or letters)
        newErrors.expectedSalary = 'Expected salary must be a number';
      }
    
      // if (!formData.visaValidity) newErrors.visaValidity = 'Visa validity is required';
      // if (!formData.visaStatus) newErrors.visaStatus = 'Visa status is required';
      if (!file) newErrors.file = 'File upload is required';
      if (fileError) newErrors.file = fileError; // e.g., file type/size issues
    }
    
  
   
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const nextStep = (e) => {
    e?.preventDefault();
    
 
    const valid = validateStep(step);
    if (valid) {
        
        setSubmittedStep(false);
        setStep(prev => Math.min(prev + 1, steps.length));
    } else {
        
        setSubmittedStep(step);
        toast.error("🚨 Please complete all fields!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            style: { backgroundColor: '#FEE2E2', color: '#B91C1C' }
        });
    }
  };

  const prevStep = () => {
      
      setStep(prev => Math.max(prev - 1, 1));
  };

  const handleStepClick = (stepId) => {
     
      if (stepId < step) {
          setStep(stepId);
      }
  };

  const handleSubmit = async (e) => {
   
    e?.preventDefault();
    
    if (step !== 4 || isLoading) { // Prevent submission if already loading
      
        return;
    }
    
    const valid = validateStep(step);
    setSubmittedStep(step);

    if (!valid) {
       
        toast.error("Please complete all fields!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            style: { backgroundColor: '#FEE2E2', color: '#B91C1C' }
        });
        return;
    }

    try {
        setIsLoading(true); // Start loading
       
        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }
        if (file) formDataToSend.append('file', file);

       
        const response = await fetch(`${baseUrl}/api/submit-form`, {
            method: 'POST',
            body: formDataToSend,
        });

        if (!response.ok) {
            console.error('Submission failed with status:', response.status);
            throw new Error('Failed to submit');
        }
        
       
        setIsSubmitted(true);
        setShowSuccess(true);
        toast.success("🎉 Application submitted successfully!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            style: { backgroundColor: '#D1FAE5', color: '#065F46' }
        });
    } catch (error) {
        console.error('Submission error:', error);
        toast.error("⚠️ Submission failed! Please try again.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            style: { backgroundColor: '#FEE2E2', color: '#B91C1C' }
        });
    } finally {
        setIsLoading(false); // Stop loading regardless of success/error
    }
};
//   const handleSubmit = async (e) => {
//     console.log('Submit button clicked, current step:', step);
//     e?.preventDefault();
    
//     if (step !== 4) {
//         console.log('Attempted submission from step', step, 'but only step 4 is allowed');
//         return;
//     }
    
//     const valid = validateStep(step);
//     setSubmittedStep(step);

//     if (!valid) {
//         console.log('Submission validation failed');
//         toast.error("Please complete all fields!", {
//             position: "top-right",
//             autoClose: 5000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//             theme: "colored",
//             style: { backgroundColor: '#FEE2E2', color: '#B91C1C' }
//         });
//         return;
//     }

//     try {
//         console.log('Skipping API call for testing purposes');
//         setIsSubmitted(true);
//         setShowSuccess(true);
//         toast.success("🎉 Application submitted successfully!", {
//             position: "top-right",
//             autoClose: 5000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//             theme: "colored",
//             style: { backgroundColor: '#D1FAE5', color: '#065F46' }
//         });
//     } catch (error) {
//         console.error('Error:', error);
//         toast.error("⚠️ Submission failed! Please try again.", {
//             position: "top-right",
//             autoClose: 5000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//             theme: "colored",
//             style: { backgroundColor: '#FEE2E2', color: '#B91C1C' }
//         });
//     }
// };
  const renderStep = () => {
     
      switch (step) {
          case 1:
              return (
                  <PersonalInfoStep
                      formData={formData}
                      errors={errors}
                      isSubmitted={submittedStep === 1}
                      handleChange={handleChange}
                  />
              );
          case 2:
              return (
                  <EducationWorkStep
                      formData={formData}
                      errors={errors}
                      isSubmitted={submittedStep === 2}
                      handleChange={handleChange}
                  />
              );
          case 3:
              return (
                  <ReferencesStep
                      formData={formData}
                      errors={errors}
                      handleChange={handleChange}
                  />
              );
          case 4:
              return (
                  <AdditionalInfoStep
                      formData={formData}
                      errors={errors}
                      isSubmitted={submittedStep === 4}
                      handleChange={handleChange}
                      file={file}
                      fileError={fileError}
                      handleFileChange={handleFileChange}
                  />
              );
          default:
              return null;
      }
  };

  return (
      <div className="max-w-5xl  mx-auto p-6 mt- font-noto-serif bg-gradient-to-br from-[#F9FAFB] to-[#e2e3e6] rounded-3xl shadow-2xl my-16 border border-opacity-10 border-gray-300">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none"></div>

          {/* Toast Container */}
          <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              toastStyle={{
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
              progressStyle={{
                  background: 'linear-gradient(to right, #3B82F6, #6366F1)'
              }}
          />

          {/* Header */}
          <div className="relative z-10 mt-8 text-center mb-10">
              <h1 className="text-4xl font-bold mb-3 bg-[#FF0000] bg-clip-text text-transparent">
                  Join Our Team
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Complete the form below to start your journey with us. We're excited to learn more about you!
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
                    <motion.svg
                      className="w-16 h-16 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </motion.svg>
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
                  <p className="text-gray-600 mb-6">
                    Your application has been submitted successfully. We'll get back to you soon.
                  </p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-sm text-gray-500"
                  >
                    This message will close automatically...
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Progress Timeline */}
          {!showSuccess && (
  <>
    <div className="relative mb-12 px-4">
      <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-6 relative z-10">
        {steps.map((stepItem, index) => (
          <div
            key={stepItem.id}
            className="flex   flex-col items-center cursor-pointer w-full lg:w-auto"
            onClick={() => handleStepClick(stepItem.id)}
          >
            <motion.div
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-lg ${
                step >= stepItem.id
                  ? 'bg-gradient-to-br from-[${stepItem.color}] to-[${stepItem.color}]'
                  : 'bg-gray-200'
              }`}
              style={{
                background:
                  step >= stepItem.id
                    ? `linear-gradient(135deg, ${stepItem.color}, ${stepItem.color})`
                    : '#E5E7EB',
              }}
              whileHover={{ scale: stepItem.id <= step ? 1.1 : 1 }}
              whileTap={{ scale: 0.95 }}
            >
              {step > stepItem.id ? (
                <FaCheck className="text-xl" />
              ) : React.cloneElement(stepItem.icon, { className: 'text-xl' })}
            </motion.div>
            <motion.span
              className={`text-md mt-3 font-semibold tracking-wide text-center ${
                step >= stepItem.id ? 'text-gray-900' : 'text-gray-500'
              }`}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              {stepItem.name}
            </motion.span>
          </div>
        ))}
      </div>

      {/* Animated Progress Bar - only show on large screens */}
      <div className="hidden lg:block absolute top-8 left-8 right-5 ml-4 h-3 bg-gray-100 rounded-full -z-0 overflow-hidden">
  <motion.div
    className="h-full bg-gradient-to-r from-[#FF0000] via-[#CC0000] to-[#B30000] rounded-full"
    initial={{ width: '0%' }}
    animate={{ width: progressWidth }}
    transition={{ duration: 0.5, ease: 'easeInOut' }}
  />
</div>

    </div>

              {/* Form Content */}
              <form onSubmit={(e) => {
                  e.preventDefault();
                  if (step === 4) handleSubmit();
              }} className="relative z-10 px-0 lg:px-4">
                  <AnimatePresence mode="wait">
                      <motion.div
                          key={step}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          className="bg-white rounded-xl p-8 shadow-lg border border-gray-100"
                      >
                          {renderStep()}
                      </motion.div>
                  </AnimatePresence>
                  
                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                      {step > 1 ? (
                          <motion.button
                              type="button"
                              onClick={prevStep}
                              className="px-6 py-3 cursor-pointer bg-white text-[#3B82F6] rounded-lg shadow-sm hover:shadow-md transition-all duration-300 font-medium flex items-center gap-2 border border-[#3B82F6] hover:bg-[#f0f4ff]"
                              whileHover={{ scale: 1.03, boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)' }}
                              whileTap={{ scale: 0.98 }}
                          >
                              <FaArrowLeft className="text-sm" />
                              Previous
                          </motion.button>
                      ) : (
                          <div></div>
                      )}
                     {step === 4 ? (
    <motion.button
        type="submit"
        disabled={isLoading}
        className="px-6 py-3 cursor-pointer bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 font-medium flex items-center justify-center gap-2 min-w-[180px]"
        whileHover={!isLoading ? { 
            scale: 1.03, 
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' 
        } : {}}
        whileTap={!isLoading ? { scale: 0.98 } : {}}
    >
        {isLoading ? (
            <div className="flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ 
                        repeat: Infinity, 
                        duration: 1, 
                        ease: "linear" 
                    }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
            </div>
        ) : (
            <>
                Submit Application
                <FaFileUpload className="text-sm" />
            </>
        )}
    </motion.button>
) : (
                        <motion.button
                        type="button"
                        onClick={(e) => nextStep(e)}
                              className="px-6 py-3 cursor-pointer bg-[#FF0000] text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 font-medium flex items-center gap-2"
                              whileHover={{ scale: 1.03, boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}
                              whileTap={{ scale: 0.98 }}
                          >
                              Next
                              <FaArrowRight className="text-sm" />
                          </motion.button>
                      )}
                  </div>
              </form>

              {/* Progress Indicator */}
              <div className="mt-6 text-center text-sm text-gray-500">
                  Step {step} of {steps.length} • {Math.round((step / steps.length) * 100)}% complete
              </div>
            </>
          )}
      </div>
  );
};

export default MultiStepForm;