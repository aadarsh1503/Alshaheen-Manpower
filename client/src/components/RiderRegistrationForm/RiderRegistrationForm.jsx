import React, { useState, useEffect } from 'react';
import { AiFillRightCircle } from 'react-icons/ai';
import { FiCheckCircle } from 'react-icons/fi';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';
import './s.css'; 

// --- Icon Components (No changes needed here) ---
const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D9232D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
);
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="white" stroke="#D9232D" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M1.5 6A2.5 2.5 0 014 3.5h16A2.5 2.5 0 0122.5 6v12A2.5 2.5 0 0120 20.5H4A2.5 2.5 0 011.5 18V6zm1.91.58l8.09 5.06 8.09-5.06a.5.5 0 00-.59-.81L12 10.96 4 5.77a.5.5 0 00-.59.81z" /></svg>
);
const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#D9232D] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
);

const inputStyle = "w-full bg-gray-50 border border-gray-200 rounded-lg px-5 py-3 text-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-300";

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

const RegistrationPage = () => {
  // --- All the state and logic remains exactly the same ---
  const [countries, setCountries] = useState([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [formData, setFormData] = useState({ title: '', firstName: '', lastName: '', email: '', residenceCountry: '', nationality: '', originDestination: '', visaExpiry: '', licenseExpiry: '', experience: '', });
  const [phone, setPhone] = useState('');
  const [cprFile, setCprFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
  };
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'cprDoc') setCprFile(files[0]);
    if (name === 'licenseDoc') setLicenseFile(files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    const submissionData = new FormData();
    Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));
    submissionData.append('phone', `+${phone}`);
    if (cprFile) submissionData.append('cprDoc', cprFile);
    if (licenseFile) submissionData.append('licenseDoc', licenseFile);
    
    try {
      const API_URL = 'https://alshaheen-manpower.onrender.com/api/riders/register';
      await axios.post(API_URL, submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setShowSuccessModal(true);
      setTimeout(() => {
        window.location.reload();
      }, 3500);

    } catch (error) {
      console.error("Submission failed:", error);
      const message = error.response?.data?.message || 'Submission failed. Please check your details and try again.';
      setErrorMessage(message);
      setIsSubmitting(false);
      window.scrollTo(0, 0);
    } 
  };

  // --- The entire JSX return block is also exactly the same ---
  return (
    <>
      {showSuccessModal && <SuccessModal />}
      <div className="bg-gray-50 font-raleway min-h-screen mt-10 text-gray-800">
        <div className="container mx-auto p-4 md:p-8 lg:p-12">
          <main className="grid grid-cols-1 lg:grid-cols-3 gap-x-16 gap-y-12">
            <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-2xl shadow-lg animate-fadeInUp">
              <h1 className="text-4xl font-bold mb-2">Become a Rider</h1>
              <p className="text-gray-500 mb-10">Fill in your details below to join our team.</p>
              {errorMessage && (
                <div className={`p-4 mb-6 rounded-lg text-center font-semibold bg-red-100 text-red-800`}>
                  {errorMessage}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                 {/* Name section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="relative">
                    <select name="title" value={formData.title} onChange={handleInputChange} className={`${inputStyle} appearance-none`} required>
                      <option value="" disabled>Title</option>
                      <option value="Mr">Mr.</option>
                      <option value="Mrs">Mrs.</option>
                      <option value="Ms">Ms.</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"><svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div>
                  </div>
                  <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} className={inputStyle} required />
                  <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} className={inputStyle} required />
                </div>
                {/* Email */}
                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} className={inputStyle} required />
                {/* Residence & Mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <select name="residenceCountry" value={formData.residenceCountry} onChange={handleInputChange} className={`${inputStyle} appearance-none`} required>
                      <option value="" disabled>Residence Country</option>
                      {isLoadingCountries ? <option disabled>Loading countries...</option> : countries.map((c) => <option key={c.cca3} value={c.name.common}>{c.name.common}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"><svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div>
                  </div>
                  <div>
                      <PhoneInput country={'bh'} value={phone} onChange={setPhone} inputStyle={{ width: '100%', height: '50px', border: '1px solid #D1D5DB', color: '#4B5563'}} />
                  </div>
                </div>
                {/* Nationality */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <select name="nationality" value={formData.nationality} onChange={handleInputChange} className={`${inputStyle} appearance-none`} required>
                      <option value="" disabled>Nationality</option>
                      {isLoadingCountries ? <option disabled>Loading countries...</option> : countries.map((c) => <option key={c.cca3} value={c.name.common}>{c.name.common}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"><svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div>
                  </div>
                  <input type="text" name="originDestination" placeholder="Destination/Origin" value={formData.originDestination} onChange={handleInputChange} className={inputStyle} />
                </div>
                {/* Expiry Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative"><label className="absolute top-[-10px] left-4 bg-white px-1 text-xs text-gray-400">Visa Expiry Date</label><input type="date" name="visaExpiry" value={formData.visaExpiry} onChange={handleInputChange} className={inputStyle} required /></div>
                  <div className="relative"><label className="absolute top-[-10px] left-4 bg-white px-1 text-xs text-gray-400">Driving License Expiry</label><input type="date" name="licenseExpiry" value={formData.licenseExpiry} onChange={handleInputChange} className={inputStyle} required /></div>
                </div>
                {/* Message Box */}
                <div><textarea name="experience" placeholder="Tell us a bit about your experience..." rows="4" value={formData.experience} onChange={handleInputChange} className={`${inputStyle} resize-none`}></textarea></div>
                {/* Attachments */}
                <div className="pt-2">
                  <p className="text-gray-500 font-medium mb-3">Upload your documents</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label htmlFor="cpr-upload" className="w-full bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 flex flex-col items-center justify-center cursor-pointer hover:border-red-500 hover:text-red-500 transition-colors group">
                      <UploadIcon /><span className="mt-2 text-sm">{cprFile ? cprFile.name : 'CPR Document'}</span>
                      <input type="file" name="cprDoc" id="cpr-upload" onChange={handleFileChange} className="hidden" required />
                    </label>
                    <label htmlFor="license-upload" className="w-full bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 flex flex-col items-center justify-center cursor-pointer hover:border-red-500 hover:text-red-500 transition-colors group">
                      <UploadIcon /><span className="mt-2 text-sm">{licenseFile ? licenseFile.name : 'Driving License'}</span>
                      <input type="file" name="licenseDoc" id="license-upload" onChange={handleFileChange} className="hidden" required />
                    </label>
                  </div>
                </div>
                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <button type="submit" disabled={isSubmitting} className="bg-[#D9232D] text-white font-bold py-3 px-10 rounded-full hover:bg-red-700 hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300 flex items-center justify-center gap-2 disabled:bg-red-300 disabled:cursor-not-allowed">
                    <AiFillRightCircle size={20} />{isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
            <div className="lg:col-span-1 animate-fadeInUp [animation-delay:200ms]">
              <div className="sticky top-12">
                  <h2 className="text-2xl font-bold mb-8">Need Help?</h2>
                  <div className="space-y-8">
                    <div className="flex items-start gap-4"> <PhoneIcon /> <div><p className="text-sm text-gray-500 font-semibold tracking-wider">PHONE</p><a href="tel:+97313303301" className="text-xl font-semibold text-[#D9232D] mt-1 hover:underline">+973 13303301 (Ext. 100 / 102 / 103)</a></div> </div>
                    <div className="flex items-start gap-4"> <MailIcon /> <div><p className="text-sm text-gray-500 font-semibold tracking-wider">EMAIL</p><a href="mailto:info@alshaheen.pro" className="text-xl font-semibold text-[#D9232D] mt-1 hover:underline">info@alshaheen.pro</a></div> </div>
                  </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default RegistrationPage;