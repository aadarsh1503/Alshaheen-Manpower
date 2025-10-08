import React, { useState, useEffect } from 'react';
import { AiFillRightCircle } from 'react-icons/ai';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios'; // Import Axios

// --- Icon Components (No changes needed here) ---
const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D9232D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
);
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="white" stroke="#D9232D" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M1.5 6A2.5 2.5 0 014 3.5h16A2.5 2.5 0 0122.5 6v12A2.5 2.5 0 0120 20.5H4A2.5 2.5 0 011.5 18V6zm1.91.58l8.09 5.06 8.09-5.06a.5.5 0 00-.59-.81L12 10.96 4 5.77a.5.5 0 00-.59.81z" /></svg>
);
const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#D9232D] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
);

const inputStyle = "w-full bg-gray-50 border border-gray-200 rounded-lg px-5 py-3 text-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-300";

const RegistrationPage = () => {
  const [countries, setCountries] = useState([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);

  // --- State for all form fields ---
  const [formData, setFormData] = useState({
    title: '', firstName: '', lastName: '', email: '',
    residenceCountry: '', nationality: '', originDestination: '',
    visaExpiry: '', licenseExpiry: '', experience: '',
  });
  const [phone, setPhone] = useState('');
  const [cprFile, setCprFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);
  
  // --- State for submission status ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ message: '', type: '' }); // type: 'success' or 'error'

  // --- Fetch countries on component mount ---
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca3');
        if (!response.ok) throw new Error('Network response was not ok');
        let data = await response.json();
        data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        setCountries(data);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      } finally {
        setIsLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  // --- Handlers for form inputs ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'cprDoc') setCprFile(files[0]);
    if (name === 'licenseDoc') setLicenseFile(files[0]);
  };

  // --- Form submission handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ message: '', type: '' });

    const submissionData = new FormData();
    Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));
    submissionData.append('phone', `+${phone}`);
    if (cprFile) submissionData.append('cprDoc', cprFile);
    if (licenseFile) submissionData.append('licenseDoc', licenseFile);
    
    try {
      // Make sure this URL matches your backend server's port
      const API_URL = 'https://alshaheen-manpower.onrender.com/api/riders/register';
      await axios.post(API_URL, submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSubmitStatus({ message: 'Registration successful! Thank you for your application.', type: 'success' });
      e.target.reset(); // Clear form fields
      setFormData({ title: '', firstName: '', lastName: '', email: '', residenceCountry: '', nationality: '', originDestination: '', visaExpiry: '', licenseExpiry: '', experience: ''});
      setPhone('');
      setCprFile(null);
      setLicenseFile(null);

    } catch (error) {
      console.error("Submission failed:", error);
      const errorMessage = error.response?.data?.message || 'Submission failed. Please check your details and try again.';
      setSubmitStatus({ message: errorMessage, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 font-raleway min-h-screen mt-10 text-gray-800">
      <div className="container mx-auto p-4 md:p-8 lg:p-12">
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-x-16 gap-y-12">
          
          <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-2xl shadow-lg animate-fadeInUp">
            <h1 className="text-4xl font-bold mb-2">Become a Rider</h1>
            <p className="text-gray-500 mb-10">Fill in your details below to join our team.</p>
            
            {submitStatus.message && (
              <div className={`p-4 mb-6 rounded-lg text-center font-semibold ${submitStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {submitStatus.message}
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

          {/* === RIGHT COLUMN: SUPPORT INFO (Unchanged) === */}
          <div className="lg:col-span-1 animate-fadeInUp [animation-delay:200ms]">
            <div className="sticky top-12">
                <h2 className="text-2xl font-bold mb-8">Need Help?</h2>
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <PhoneIcon />
                    <div><p className="text-sm text-gray-500 font-semibold tracking-wider">PHONE</p><a href="tel:+97313303301" className="text-xl font-semibold text-[#D9232D] mt-1 hover:underline">+973 13303301 (Ext. 100 / 102 / 103)</a></div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MailIcon />
                    <div><p className="text-sm text-gray-500 font-semibold tracking-wider">EMAIL</p><a href="mailto:info@alshaheen.pro" className="text-xl font-semibold text-[#D9232D] mt-1 hover:underline">info@alshaheen.pro</a></div>
                  </div>
                </div>
                {/* <div className="mt-12 pt-8 border-t border-gray-200">
                  <button className="w-full border-2 border-gray-600 text-gray-800 font-bold py-3 px-6 rounded-full flex items-center justify-center hover:bg-gray-800 hover:text-white transition-colors duration-300"><LocationIcon />BIA LOCATION MAP</button>
                </div> */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RegistrationPage;