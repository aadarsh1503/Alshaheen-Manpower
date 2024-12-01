import React, { useState,useEffect } from 'react';
import { FaPhoneAlt, FaEnvelope, FaGlobe, FaCheckCircle } from 'react-icons/fa';
import ReCAPTCHA from 'react-google-recaptcha';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import i2 from "./i2.png"

const ContactUs = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [website, setWebsite] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [message, setMessage] = useState('');
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [file, setFile] = useState(null);

  // Fetch user country code using a geolocation service
  useEffect(() => {
    const fetchCountryCode = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setCountryCode(data.country_calling_code.replace('+', '') || '+973'); // Default to US if unavailable
      } catch (error) {
        console.error('Error fetching country code:', error);
        setCountryCode('1'); // Default to US on error
      }
    };

    fetchCountryCode();
  }, []);

  const handleRecaptcha = (value) => {
    setRecaptchaValue(value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!companyType) {
      alert('Please select a company type.');
      setLoading(false);
      return;
    }

    if (!recaptchaValue) {
      alert('Please complete the reCAPTCHA verification.');
      setLoading(false);
      return;
    }

    if (companyType === 'I am a job seeker looking for jobs' && !file) {
      alert('Please upload a document.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('company', company);
    formData.append('companyType', companyType);
    formData.append('website', website);
    formData.append('phone', phoneNumber);
    formData.append('countryCode', countryCode);
    formData.append('message', message);
    formData.append('recaptchaValue', recaptchaValue);
    formData.append('document', file);

    try {
      const response = await fetch('http://localhost:5000/contact', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setReferenceId(result.referenceId);
        setFormSubmitted(true);
        setLoading(false);

        setTimeout(() => {
          setFormSubmitted(false);
          setFirstName('');
          setLastName('');
          setEmail('');
          setCompany('');
          setCompanyType('');
          setWebsite('');
          setPhoneNumber('');
          setMessage('');
          setRecaptchaValue(null);
          setReferenceId('');
          setFile(null);
        }, 3000);
      } else {
        alert('Error submitting form. Please try again later.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again later.');
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-wrap max-w-7xl mx-auto font-raleway  p-4 md:p-8">
 <div className="w-full md:w-1/2 p-4 text-center sm:text-left">
  <h2 className="text-3xl sm:text-4xl font-bold text-lightblue">REACH OUT <br /> TO US!</h2>
  <p className="text-gray-600 mt-4 text-sm sm:text-base">
    If you wish to speak to a AL SHAHEEN MANPOWER representative, kindly fill the form or contact an office close to you.
  </p>
  <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row space-y-4 lg:ml-0 ml-10 sm:space-y-0 sm:space-x-8">
    <div className="flex items-center space-x-2">
      <FaPhoneAlt className="text-lightblue text-xl sm:text-2xl" />
      <div>
        <p className="text-gray-600 font-bold text-sm sm:text-base">Head Office</p>
        <p className="text-black text-sm sm:text-base">+973 1330 3301(Ext. 202)</p>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <FaEnvelope className="text-lightblue text-xl sm:text-2xl" />
      <div>
        <p className="text-gray-600 font-bold text-sm sm:text-base">Email</p>
        <p className="text-gray-600 ">
          <a href="mailto:info@alshaheen.pro" className="text-black text-sm sm:text-base hover:underline">
            info@alshaheen.pro
          </a>
        </p>
      </div>
    </div>
  </div>
  <div className="w-full mt-4 flex lg:ml-0 ml-8 items-center space-x-2">
    <FaGlobe className="text-lightblue text-xl sm:text-2xl" />
    <p className="text-gray-600 font-bold text-sm sm:text-base">
      Website<br />
      <a href="https://www.alshaheen.pro" target="_blank" className="text-black font-normal hover:underline">
        www.alshaheen.pro
      </a>
    </p>
  </div>
  <div className="mt-10  flex justify-center">
  <a href="mailto:Hire@alshaheen.pro" target="_blank">
      <img
        src={i2} 
        alt="Apply here for jobs"
        className="w-80 sm:w-96 hover:opacity-80 transition-opacity"
      />
    </a>
  </div>
</div>

  {!formSubmitted ? (
    <div className="w-full md:w-1/2 p-4 bg-white shadow-md rounded-xl mt-8 sm:mt-0">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 text-center sm:text-left">HOW CAN WE HELP YOU?</h3>
      <form onSubmit={handleSubmit} className="mt-4 sm:mt-6 space-y-4">
        <div>
          <select className="w-full border border-gray-300 p-2 rounded-md text-sm sm:text-base" value={companyType} onChange={(e) => setCompanyType(e.target.value)} required>
            <option value="">Select</option>
            <option value="I am an employer looking to Hire">I am an employer looking to Hire</option>
            <option value="I am a job seeker looking for jobs">I am a job seeker looking for jobs</option>
            <option value="I am a Supplier">I am a Supplier</option>
          </select>
        </div>
        {companyType !== 'I am a job seeker looking for jobs' && (
          <>
            <input type="text" placeholder="Company Name" className="w-full border border-gray-300 p-2 rounded-md text-sm sm:text-base" value={company} onChange={(e) => setCompany(e.target.value)} />
            <input type="text" placeholder="Website" className="w-full border border-gray-300 p-2 rounded-md text-sm sm:text-base" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </>
        )}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <input type="text" placeholder="First Name" className="w-full sm:w-1/2 border border-gray-300 p-2 rounded-md text-sm sm:text-base" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <input type="text" placeholder="Last Name" className="w-full sm:w-1/2 border border-gray-300 p-2 rounded-md text-sm sm:text-base" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <input type="email" placeholder="Email" className="w-full border border-gray-300 p-2 rounded-md text-sm sm:text-base" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-2 items-center">
          <div className="w-full sm:w-1/3">
          <PhoneInput
            country={'us'}
            value={countryCode}
            onChange={(value) => setCountryCode(value || '1')}
            placeholder="Select Country Code"
            inputStyle={{
              width: '100%',
              height: '40px',
              border: '1px solid #D1D5DB',
              color: '#4B5563',
            }}
          />
          </div>
          <input type="text" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full sm:w-2/3 border border-gray-300 p-2 rounded-md text-sm sm:text-base" />
        </div>
        <div className="flex justify-center sm:justify-start mt-4">
          <ReCAPTCHA sitekey="6LeqpnkqAAAAAHNUm3Ey9nv2T0hmhl0Ym4L_yaTS" onChange={handleRecaptcha} />
        </div>

        {/* File Upload Input: Only show if job seeker is selected */}
        {companyType === 'I am a job seeker looking for jobs' && (
         <div className="mt-4">
         <p className="text-sm text-gray-600 mb-2">File should not exceed 5MB in size. Only .pdf, .doc, and .docx files are allowed.</p>
         <input
           type="file"
           className="w-full border border-gray-300 p-2 rounded-md text-sm sm:text-base"
           onChange={handleFileChange}
           accept=".pdf,.doc,.docx" // Restrict to allowed file types
         />
       </div>
       
        )}

        <div className="mt-4 text-center sm:text-left">
          <button type="submit" className="w-full sm:w-auto bg-lightblue text-white font-semibold py-2 px-4 rounded-md hover:bg-DarkRed focus:outline-none focus:ring focus:ring-lightblue" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  ) : (
    <div className="w-full md:w-1/2 p-4 bg-white shadow-md rounded-xl flex items-center justify-center flex-col mt-8 sm:mt-0">
      <FaCheckCircle className="text-green-500 text-5xl sm:text-6xl" />
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mt-4">Thank You for Contacting Us!</h3>
      <p className="mt-2 text-gray-600 text-sm sm:text-base">Your reference ID is: <strong>{referenceId}</strong></p>
      <p className="mt-2 text-gray-600 text-sm sm:text-base">We will get back to you as soon as possible.</p>
    </div>
  )}
</div>

  );
};

export default ContactUs;
