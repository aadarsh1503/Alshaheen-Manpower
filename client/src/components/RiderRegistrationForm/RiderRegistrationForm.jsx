import React, { useState, useEffect } from 'react';
import { FaMotorcycle, FaCar, FaTruck } from 'react-icons/fa';
import { AiFillRightCircle } from 'react-icons/ai';
import { FiCheckCircle } from 'react-icons/fi';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './s.css';
const baseUrl = import.meta.env.VITE_API_BASE_URL;

// --- Icon Components (Unchanged) ---
const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D9232D]" fill="none" viewBox="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
);
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="white" stroke="#D9232D" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M1.5 6A2.5 2.5 0 014 3.5h16A2.5 2.5 0 0122.5 6v12A2.5 2.5 0 0120 20.5H4A2.5 2.5 0 011.5 18V6zm1.91.58l8.09 5.06 8.09-5.06a.5.5 0 00-.59-.81L12 10.96 4 5.77a.5.5 0 00-.59.81z" /></svg>
);
const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#D9232D] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
);

const inputStyle = "w-full bg-gray-50 border border-gray-200 rounded-lg px-5 py-3 text-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-300 disabled:bg-gray-200 disabled:cursor-not-allowed";

const SuccessModal = () => (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
    <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center transform animate-scaleIn">
      <FiCheckCircle className="text-green-500 text-7xl mx-auto mb-6" />
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Application Sent!</h2>
      <p className="text-lg text-gray-500">
        Thank you for your interest. We will review your application and get back to you shortly.
      </p>
      <p className="text-sm text-gray-400 mt-8">This page will reload shortly...</p>
    </div>
  </div>
);

const DeliveryOption = ({ icon, label, isSelected, onSelect }) => (
  <div
    onClick={() => onSelect(label)}
    className={`border-2 rounded-lg p-6 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-200 ${
      isSelected
        ? 'border-red-500 bg-red-50 text-red-600 shadow-md'
        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-400'
    }`}
  >
    {icon}
    <span className="font-semibold">{label}</span>
  </div>
);


const RegistrationPage = () => {
  const [countries, setCountries] = useState([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);

  // --- MODIFICATION START ---
  // Updated formData state: 'title' -> 'gender', removed 'residenceCountry' and 'originDestination'
  const [formData, setFormData] = useState({
    gender: '', firstName: '', lastName: '', email: '', nationality: '',
    visaExpiry: '', licenseExpiry: '',
    currentAddress_flat: '', currentAddress_road: '', currentAddress_block: '', currentAddress_town: '',
    vehicleType: '',
    companyName: '',
    otherCompanyName: '',
    isVehicleOwner: '',
    readyToStartDate: '',
    previousExperience: '',
    experience: ''
  });
  // --- MODIFICATION END ---
  
  const [isFresher, setIsFresher] = useState(false);
  const [phone, setPhone] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  
  const [cprFrontFile, setCprFrontFile] = useState(null);
  const [cprBackFile, setCprBackFile] = useState(null);
  const [licenseFrontFile, setLicenseFrontFile] = useState(null);
  const [licenseBackFile, setLicenseBackFile] = useState(null);
  const [applicantPhotoFile, setApplicantPhotoFile] = useState(null);
  const [vehicleRegFile, setVehicleRegFile] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca3');
        if (!response.ok) throw new Error('Network response was not ok');
        let data = await response.json();
        data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        setCountries(data);
      } catch (error) { console.error("Failed to fetch countries:", error); }
      finally { setIsLoadingCountries(false); }
    };
    fetchCountries();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;

    const MAX_SIZE_MB = 1;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!ALLOWED_TYPES.includes(file.type)) { toast.error('Invalid file type. Please upload JPG, JPEG, or PNG images.'); e.target.value = null; return; }
    if (file.size > MAX_SIZE_BYTES) { toast.error(`File is too large. Each image must be ${MAX_SIZE_MB}MB or less.`); e.target.value = null; return; }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    switch (name) {
      case 'cprFrontDoc': setCprFrontFile(file); break;
      case 'cprBackDoc': setCprBackFile(file); break;
      case 'licenseFrontDoc': setLicenseFrontFile(file); break;
      case 'licenseBackDoc': setLicenseBackFile(file); break;
      case 'applicantPhoto': setApplicantPhotoFile(file); break;
      case 'vehicleRegDoc': setVehicleRegFile(file); break;
      default: break;
    }
  };
  
  // --- MODIFICATION START ---
  // Updated validation logic
  const validateForm = () => {
    const newErrors = {};

    if (!formData.gender) newErrors.gender = 'Gender is required.';
    if (!formData.firstName) newErrors.firstName = 'First Name is required.';
    if (!formData.lastName) newErrors.lastName = 'Last Name is required.';
    if (!formData.email) newErrors.email = 'Email is required.';
    if (!phone || phone.length < 7) newErrors.phone = 'A valid phone number is required.';
    if (!formData.vehicleType) newErrors.vehicleType = 'Please select a delivery method.';
    if (!formData.currentAddress_flat) newErrors.currentAddress_flat = 'Flat/Building is required.';
    if (!formData.currentAddress_road) newErrors.currentAddress_road = 'Road is required.';
    if (!formData.currentAddress_block) newErrors.currentAddress_block = 'Block is required.';
    if (!formData.currentAddress_town) newErrors.currentAddress_town = 'Town/City is required.';
    if (!formData.nationality) newErrors.nationality = 'Nationality is required.';
    if (!formData.visaExpiry) newErrors.visaExpiry = 'Visa Expiry is required.';
    if (!formData.licenseExpiry) newErrors.licenseExpiry = 'License Expiry is required.';
    if (!formData.readyToStartDate) newErrors.readyToStartDate = 'Start Date is required.';
    if (!formData.isVehicleOwner) newErrors.isVehicleOwner = 'Please answer this question.';
    if (!isFresher) {
        if (!formData.companyName) newErrors.companyName = 'Company Name is required.';
        if (formData.companyName === 'Others' && !formData.otherCompanyName) newErrors.otherCompanyName = 'Please specify your company.';
        if (!formData.previousExperience) newErrors.previousExperience = 'Years of experience is required.';
    }

    if (!applicantPhotoFile) newErrors.applicantPhoto = 'Your photo is required.';
    if (!vehicleRegFile) newErrors.vehicleRegDoc = 'Vehicle registration is required.';
    if (!cprFrontFile) newErrors.cprFrontDoc = 'CPR (Front) is required.';
    if (!cprBackFile) newErrors.cprBackDoc = 'CPR (Back) is required.';
    if (!licenseFrontFile) newErrors.licenseFrontDoc = 'License (Front) is required.';
    if (!licenseBackFile) newErrors.licenseBackDoc = 'License (Back) is required.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
        toast.error('Please fix the errors highlighted below.');
        return false;
    }

    return true;
  }
  // --- MODIFICATION END ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const submissionData = new FormData();
    const finalCompanyName = formData.companyName === 'Others' ? formData.otherCompanyName : formData.companyName;
    submissionData.append('companyName', isFresher ? 'Fresher' : finalCompanyName);
    submissionData.append('previousExperience', isFresher ? 'N/A' : formData.previousExperience); // Use 'N/A' for fresher, dropdown value otherwise
    submissionData.append('experience', isFresher ? 'N/A' : formData.experience);
    Object.keys(formData).forEach(key => { if (!['companyName', 'otherCompanyName', 'previousExperience', 'experience'].includes(key)) { submissionData.append(key, formData[key]); } });
    submissionData.append('phone', `+${phone}`);
    if (alternatePhone) { submissionData.append('alternatePhone', `+${alternatePhone}`); }
    if (cprFrontFile) submissionData.append('cprFrontDoc', cprFrontFile);
    if (cprBackFile) submissionData.append('cprBackDoc', cprBackFile);
    if (licenseFrontFile) submissionData.append('licenseFrontDoc', licenseFrontFile);
    if (licenseBackFile) submissionData.append('licenseBackDoc', licenseBackFile);
    if (applicantPhotoFile) submissionData.append('applicantPhoto', applicantPhotoFile);
    if (vehicleRegFile) submissionData.append('vehicleRegDoc', vehicleRegFile);

    try {
      const API_URL = `${baseUrl}/api/riders/register`; 
      await axios.post(API_URL, submissionData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setShowSuccessModal(true);
      setTimeout(() => { window.location.reload(); }, 3500);
    } catch (error) {
      console.error("Submission failed:", error);
      const message = error.response?.data?.error || error.response?.data?.message || 'Submission failed. Please check your details and try again.';
      toast.error(message);
      setIsSubmitting(false);
    }
  };
  
  // --- MODIFICATION START ---
  // Updated company options list
  const companyOptions = ["Talabat", "Jahez", "Ahlan", "Others"];
  // --- MODIFICATION END ---
  
  const getTodayString = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return (
    <>
      {showSuccessModal && <SuccessModal />}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      <div className="bg-gray-50 font-raleway min-h-screen text-gray-800">
        <div className="container mx-auto p-4 md:p-8 lg:p-12">
          <main className="grid grid-cols-1 mt-10 lg:grid-cols-3 gap-x-16 gap-y-12">
            <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-2xl shadow-lg animate-fadeInUp">
              <h1 className="text-4xl font-bold mb-2">Become a Rider</h1>
              <p className="text-gray-500 mb-10">Fill in your details below to join our team.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* --- MODIFICATION START: Title -> Gender --- */}
                  <div>
                    <div className="relative"><select name="gender" value={formData.gender} onChange={handleInputChange} className={`${inputStyle} appearance-none ${errors.gender ? 'border-red-500' : ''}`} required><option value="" disabled>Gender *</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select><div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"><svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div></div>
                    {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                  </div>
                   {/* --- MODIFICATION END --- */}
                  <div>
                    <input type="text" name="firstName" placeholder="First Name *" value={formData.firstName} onChange={handleInputChange} className={`${inputStyle} ${errors.firstName ? 'border-red-500' : ''}`} required />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <input type="text" name="lastName" placeholder="Last Name *" value={formData.lastName} onChange={handleInputChange} className={`${inputStyle} ${errors.lastName ? 'border-red-500' : ''}`} required />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                <div>
                  <input type="email" name="email" placeholder="Email Address *" value={formData.email} onChange={handleInputChange} className={`${inputStyle} ${errors.email ? 'border-red-500' : ''}`} required />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* --- MODIFICATION START: Residence Country removed --- */}
                  <div>
                    <div className="relative"><label className="absolute top-[-15px] bg-white px-1 text-xs text-gray-400">Primary Phone Number *</label><PhoneInput country={'bh'} value={phone} onChange={(phoneVal) => {setPhone(phoneVal); if(errors.phone) setErrors(p => ({...p, phone: undefined}))}} inputProps={{ name: 'phone', required: true }} containerStyle={{borderColor: errors.phone ? '#ef4444' : ''}} inputStyle={{ width: '100%', height: '50px', border: errors.phone ? '1px solid #ef4444' : '1px solid #e5e7eb', borderRadius: '0.5rem', color: '#374151'}} /></div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                   <div>
                    <div className="relative"><label className="absolute top-[-15px] bg-white px-1 text-xs text-gray-400">Alternate Phone (Optional)</label><PhoneInput country={'bh'} value={alternatePhone} onChange={setAlternatePhone} inputProps={{ name: 'alternatePhone' }} inputStyle={{ width: '100%', height: '50px', border: '1px solid #e5e7eb', borderRadius: '0.5rem', color: '#374151'}} /></div>
                  </div>
                  {/* --- MODIFICATION END --- */}
                </div>
                
                {/* --- Delivery Method --- */}
                <div>
                  <p className="font-medium text-gray-700 mb-3">How do you deliver? *</p>
                  <div className="grid grid-cols-3 gap-4">
                    <DeliveryOption icon={<FaMotorcycle size={32}/>} label="Motorcycle" isSelected={formData.vehicleType === 'Motorcycle'} onSelect={(val) => {setFormData(p => ({...p, vehicleType: val})); if(errors.vehicleType) setErrors(p => ({...p, vehicleType: undefined}))}} />
                    <DeliveryOption icon={<FaCar size={32}/>} label="Car" isSelected={formData.vehicleType === 'Car'} onSelect={(val) => {setFormData(p => ({...p, vehicleType: val})); if(errors.vehicleType) setErrors(p => ({...p, vehicleType: undefined}))}} />
                    <DeliveryOption icon={<FaTruck size={32}/>} label="Truck" isSelected={formData.vehicleType === 'Truck'} onSelect={(val) => {setFormData(p => ({...p, vehicleType: val})); if(errors.vehicleType) setErrors(p => ({...p, vehicleType: undefined}))}} />
                  </div>
                  {errors.vehicleType && <p className="text-red-500 text-xs mt-2">{errors.vehicleType}</p>}
                </div>
                
                {/* --- Address & Legal --- */}
                <div className="pt-2"><p className="font-medium text-gray-700 mb-3">Current Address *</p><div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><input type="text" name="currentAddress_flat" placeholder="Flat/Building No. *" value={formData.currentAddress_flat} onChange={handleInputChange} className={`${inputStyle} ${errors.currentAddress_flat ? 'border-red-500' : ''}`} required />{errors.currentAddress_flat && <p className="text-red-500 text-xs mt-1">{errors.currentAddress_flat}</p>}</div>
                  <div><input type="text" name="currentAddress_road" placeholder="Road *" value={formData.currentAddress_road} onChange={handleInputChange} className={`${inputStyle} ${errors.currentAddress_road ? 'border-red-500' : ''}`} required />{errors.currentAddress_road && <p className="text-red-500 text-xs mt-1">{errors.currentAddress_road}</p>}</div>
                  <div><input type="text" name="currentAddress_block" placeholder="Block *" value={formData.currentAddress_block} onChange={handleInputChange} className={`${inputStyle} ${errors.currentAddress_block ? 'border-red-500' : ''}`} required />{errors.currentAddress_block && <p className="text-red-500 text-xs mt-1">{errors.currentAddress_block}</p>}</div>
                  <div><input type="text" name="currentAddress_town" placeholder="Town/City *" value={formData.currentAddress_town} onChange={handleInputChange} className={`${inputStyle} ${errors.currentAddress_town ? 'border-red-500' : ''}`} required />{errors.currentAddress_town && <p className="text-red-500 text-xs mt-1">{errors.currentAddress_town}</p>}</div>
                </div></div>
                {/* --- MODIFICATION START: Destination/Origin removed --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><div className="relative"><select name="nationality" value={formData.nationality} onChange={handleInputChange} className={`${inputStyle} appearance-none ${errors.nationality ? 'border-red-500' : ''}`} required><option value="" disabled>Nationality *</option>{isLoadingCountries ? <option disabled>Loading countries...</option> : countries.map((c) => <option key={c.cca3} value={c.name.common}>{c.name.common}</option>)}</select><div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"><svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div></div>{errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>}</div>
                  <div><div className="relative"><label className="absolute top-[-10px] left-4 bg-white px-1 text-xs text-gray-400">Visa Expiry Date *</label><input type="date" name="visaExpiry" value={formData.visaExpiry} onChange={handleInputChange} className={`${inputStyle} ${errors.visaExpiry ? 'border-red-500' : ''}`} required /></div>{errors.visaExpiry && <p className="text-red-500 text-xs mt-1">{errors.visaExpiry}</p>}</div>
                </div>
                {/* --- MODIFICATION END --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><div className="relative"><label className="absolute top-[-10px] left-4 bg-white px-1 text-xs text-gray-400">Driving License Expiry *</label><input type="date" name="licenseExpiry" value={formData.licenseExpiry} onChange={handleInputChange} className={`${inputStyle} ${errors.licenseExpiry ? 'border-red-500' : ''}`} required /></div>{errors.licenseExpiry && <p className="text-red-500 text-xs mt-1">{errors.licenseExpiry}</p>}</div>
                  <div><div className="relative"><label className="absolute top-[-10px] left-4 bg-white px-1 text-xs text-gray-400">When are you ready to start? *</label><input type="date" name="readyToStartDate" value={formData.readyToStartDate} onChange={handleInputChange} className={`${inputStyle} ${errors.readyToStartDate ? 'border-red-500' : ''}`} required min={getTodayString()} /></div>{errors.readyToStartDate && <p className="text-red-500 text-xs mt-1">{errors.readyToStartDate}</p>}</div>
                </div>
                <div><p className="font-medium text-gray-700 mb-3">Are you the vehicle owner? *</p><div className="flex gap-6 items-center"><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="isVehicleOwner" value="Yes" checked={formData.isVehicleOwner === 'Yes'} onChange={handleInputChange} className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300" /> Yes</label><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="isVehicleOwner" value="No" checked={formData.isVehicleOwner === 'No'} onChange={handleInputChange} className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300" /> No</label></div>{errors.isVehicleOwner && <p className="text-red-500 text-xs mt-2">{errors.isVehicleOwner}</p>}</div>
                
                {/* --- Work Experience --- */}
                <div className="pt-2 space-y-6 border-t border-gray-200 pt-6">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-700">Work Experience</p>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                      <input type="checkbox" checked={isFresher} onChange={(e) => setIsFresher(e.target.checked)} className="h-4 w-4 rounded text-red-600 focus:ring-red-500 border-gray-300"/>I am a fresher
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="relative">
                        <select name="companyName" value={formData.companyName} onChange={handleInputChange} className={`${inputStyle} appearance-none ${errors.companyName ? 'border-red-500' : ''}`} required disabled={isFresher}>
                          <option value="" disabled>Current/Last Company *</option>
                          {companyOptions.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"><svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div>
                      </div>
                      {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                    </div>
                    {formData.companyName === 'Others' && !isFresher && (
                      <div>
                        <input type="text" name="otherCompanyName" placeholder="Please specify company *" value={formData.otherCompanyName} onChange={handleInputChange} className={`${inputStyle} animate-fadeIn ${errors.otherCompanyName ? 'border-red-500' : ''}`} required />
                        {errors.otherCompanyName && <p className="text-red-500 text-xs mt-1">{errors.otherCompanyName}</p>}
                      </div>
                    )}
                    {/* --- MODIFICATION START: Years of Experience dropdown --- */}
                    <div>
                        <div className="relative">
                            <select name="previousExperience" value={formData.previousExperience} onChange={handleInputChange} className={`${inputStyle} appearance-none ${errors.previousExperience ? 'border-red-500' : ''}`} required disabled={isFresher}>
                                <option value="" disabled>Total Years of Experience *</option>
                                <option value="Less than 1 year">Less than 1 year</option>
                                <option value="2-5 years">2-5 years</option>
                                <option value="6-10 years">6-10 years</option>
                                <option value="More than 10 years">More than 10 years</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"><svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div>
                        </div>
                        {errors.previousExperience && <p className="text-red-500 text-xs mt-1">{errors.previousExperience}</p>}
                    </div>
                     {/* --- MODIFICATION END --- */}
                  </div>
                  <div>
                    <textarea name="experience" placeholder="Tell us more about your experience..." rows="4" value={formData.experience} onChange={handleInputChange} className={`${inputStyle} resize-none`} disabled={isFresher}></textarea>
                  </div>
                </div>

                {/* Document Uploads */}
                <div className="pt-2">
                  <p className="text-gray-500 font-medium mb-3">Upload your documents (JPG, JPEG, PNG - 1MB Max per image)</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label htmlFor="applicant-photo-upload" className={`w-full bg-white border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-red-500 transition-colors group ${errors.applicantPhoto ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-500'}`}><UploadIcon /><span className="mt-2 text-sm text-center">{applicantPhotoFile ? applicantPhotoFile.name : 'Your Photo *'}</span><input type="file" name="applicantPhoto" id="applicant-photo-upload" onChange={handleFileChange} className="hidden" required accept="image/png, image/jpeg, image/jpg" /></label>{errors.applicantPhoto && <p className="text-red-500 text-xs mt-1">{errors.applicantPhoto}</p>}</div>
                    <div><label htmlFor="vehicle-reg-upload" className={`w-full bg-white border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-red-500 transition-colors group ${errors.vehicleRegDoc ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-500'}`}><UploadIcon /><span className="mt-2 text-sm text-center">{vehicleRegFile ? vehicleRegFile.name : 'Vehicle Registration Card *'}</span><input type="file" name="vehicleRegDoc" id="vehicle-reg-upload" onChange={handleFileChange} className="hidden" required accept="image/png, image/jpeg, image/jpg" /></label>{errors.vehicleRegDoc && <p className="text-red-500 text-xs mt-1">{errors.vehicleRegDoc}</p>}</div>
                    <div><label htmlFor="cpr-front-upload" className={`w-full bg-white border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-red-500 transition-colors group ${errors.cprFrontDoc ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-500'}`}><UploadIcon /><span className="mt-2 text-sm text-center">{cprFrontFile ? cprFrontFile.name : 'CPR (Front Side) *'}</span><input type="file" name="cprFrontDoc" id="cpr-front-upload" onChange={handleFileChange} className="hidden" required accept="image/png, image/jpeg, image/jpg" /></label>{errors.cprFrontDoc && <p className="text-red-500 text-xs mt-1">{errors.cprFrontDoc}</p>}</div>
                    <div><label htmlFor="cpr-back-upload" className={`w-full bg-white border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-red-500 transition-colors group ${errors.cprBackDoc ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-500'}`}><UploadIcon /><span className="mt-2 text-sm text-center">{cprBackFile ? cprBackFile.name : 'CPR (Back Side) *'}</span><input type="file" name="cprBackDoc" id="cpr-back-upload" onChange={handleFileChange} className="hidden" required accept="image/png, image/jpeg, image/jpg" /></label>{errors.cprBackDoc && <p className="text-red-500 text-xs mt-1">{errors.cprBackDoc}</p>}</div>
                    <div><label htmlFor="license-front-upload" className={`w-full bg-white border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-red-500 transition-colors group ${errors.licenseFrontDoc ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-500'}`}><UploadIcon /><span className="mt-2 text-sm text-center">{licenseFrontFile ? licenseFrontFile.name : 'Driving License (Front) *'}</span><input type="file" name="licenseFrontDoc" id="license-front-upload" onChange={handleFileChange} className="hidden" required accept="image/png, image/jpeg, image/jpg" /></label>{errors.licenseFrontDoc && <p className="text-red-500 text-xs mt-1">{errors.licenseFrontDoc}</p>}</div>
                    <div><label htmlFor="license-back-upload" className={`w-full bg-white border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-red-500 transition-colors group ${errors.licenseBackDoc ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-500'}`}><UploadIcon /><span className="mt-2 text-sm text-center">{licenseBackFile ? licenseBackFile.name : 'Driving License (Back) *'}</span><input type="file" name="licenseBackDoc" id="license-back-upload" onChange={handleFileChange} className="hidden" required accept="image/png, image/jpeg, image/jpg" /></label>{errors.licenseBackDoc && <p className="text-red-500 text-xs mt-1">{errors.licenseBackDoc}</p>}</div>
                  </div>
                </div>

                <div className="flex justify-end pt-4"><button type="submit" disabled={isSubmitting} className="bg-[#D9232D] text-white font-bold py-3 px-10 rounded-full hover:bg-red-700 hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300 flex items-center justify-center gap-2 disabled:bg-red-300 disabled:cursor-not-allowed"><AiFillRightCircle size={20} />{isSubmitting ? 'Submitting...' : 'Submit Application'}</button></div>
              </form>
            </div>
            <div className="lg:col-span-1 animate-fadeInUp [animation-delay:200ms]"><div className="sticky top-12"><h2 className="text-2xl font-bold mb-8">Need Help?</h2><div className="space-y-8"><div className="flex items-start gap-4"> <PhoneIcon /> <div><p className="text-sm text-gray-500 font-semibold tracking-wider">PHONE</p><a href="tel:+97313303301" className="text-xl font-semibold text-[#D9232D] mt-1 hover:underline">+973 13303301 (Ext. 100 / 102 / 103)</a></div> </div><div className="flex items-start gap-4"> <MailIcon /> <div><p className="text-sm text-gray-500 font-semibold tracking-wider">EMAIL</p><a href="mailto:info@alshaheen.pro" className="text-xl font-semibold text-[#D9232D] mt-1 hover:underline">info@alshaheen.pro</a></div> </div></div></div></div>
          </main>
        </div>
      </div>
    </>
  );
};

export default RegistrationPage;