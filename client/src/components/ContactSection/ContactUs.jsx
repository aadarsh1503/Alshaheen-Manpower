import React, { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaGlobe, FaCheckCircle } from 'react-icons/fa';
import ReCAPTCHA from 'react-google-recaptcha';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const ContactUs = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [website, setWebsite] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('973');
  const [message, setMessage] = useState('');
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);  
  const [loading, setLoading] = useState(false);  
  const [referenceId, setReferenceId] = useState('');

  const handleRecaptcha = (value) => {
    setRecaptchaValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!companyType) {
      alert("Please select a company type.");
      setLoading(false);
      return;
    }

    if (!recaptchaValue) {
      alert("Please complete the reCAPTCHA verification.");
      setLoading(false);
      return;
    }

    const formData = {
      firstName,
      lastName,
      email,
      company,
      companyType,
      website,
      phone: phoneNumber,
      countryCode,
      message,
      recaptchaValue,
    };

    try {
      const response = await fetch('https://gvs-services-b46k.vercel.app/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

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
          setCountryCode('973');
          setMessage('');
          setRecaptchaValue(null);
          setReferenceId('');
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
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto font-raleway bg-gray-100 p-8">
      {/* Left side: Contact Info */}
      <div className=" md:w-1/2 w-full lg:ml-0 ml- p-4 text-center md:text-left">
        <h2 className="text-4xl font-bold text-lightblue">REACH OUT <br />TO US!</h2>
        <p className="text-gray-600 mt-4">
          If you wish to speak to a GVS representative, kindly fill the form or contact an office close to you.
        </p>
        <div className="mt-8 flex flex-wrap justify-center md:justify-start space-x-8">
          <div className="flex items-center space-x-2">
            <FaPhoneAlt className="text-lightblue text-2xl mt-0  lg:-mt-4" />
            <div>
              <p className="text-gray-600 ml-8 lg:ml-0 font-bold">Head Office</p>
              <p className="text-black">+973 1330 3301</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FaEnvelope className="text-lightblue text-2xl mt-0 lg:-mt-4" />
            <div>
              <p className="text-gray-600 font-bold">Email</p>
              <p className="text-gray-600">
                <a href="mailto:info@alshaheen.pro" className="text-black hover:underline">
                  info@alshaheen.pro
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="w-full mt-4 flex items-center space-x-2">
          <FaGlobe className="text-lightblue text-2xl mt-0 lg:ml-0 ml-20 lg:-mt-4" />
          <p className="text-gray-600  font-bold">
            Website<br />
            <a href="https://www.alshaheen.pro" target="_blank" className=" text-black  font-normal hover:underline">www.alshaheen.pro</a>
          </p>
        </div>

        <a href="https://www.talentportal.bh/#pills-home" target="_blank" className="text-lightblue text-4xl underline font-bold mt-32 inline-block">
          Apply here for jobs
        </a>
      </div>

      {/* Right side: Contact Form */}
      {!formSubmitted ? (
        <div className="w-full md:w-1/2 p-4 bg-white shadow-md rounded-xl mt-8 md:mt-0">
          <h3 className="text-xl font-semibold text-gray-800">HOW CAN WE HELP YOU?</h3>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Company Type Dropdown */}
            <div>
              <select
                className="w-full border border-gray-300 p-2 rounded-md"
                value={companyType}
                onChange={(e) => setCompanyType(e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="I am an employer looking to Hire">I am an employer looking to Hire</option>
                <option value="I am a job seeker looking for jobs">I am a job seeker looking for jobs</option>
                <option value="I am a Supplier">I am a Supplier</option>
              </select>
            </div>
            
            {/* Conditionally render Company and Website fields */}
            {companyType !== 'I am a job seeker looking for jobs' && (
              <>
                <input
                  type="text"
                  placeholder="Company Name"
                  className="w-full border border-gray-300 p-2 rounded-md"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Website"
                  className="w-full border border-gray-300 p-2 rounded-md"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </>
            )}

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <input
                type="text"
                placeholder="First Name"
                className="w-full md:w-1/2 border border-gray-300 p-2 rounded-md"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full md:w-1/2 border border-gray-300 p-2 rounded-md"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 p-2 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Phone Input */}
            <div className="flex flex-col md:flex-row space-x-2 items-center">
              <div className="w-full md:w-1/3">
                <PhoneInput
                  country={'us'}
                  value={countryCode}
                  onChange={(value) => setCountryCode(value || '+1')}
                  placeholder="Select Country Code"
                  inputStyle={{
                    width: '100%',
                    height: '40px',
                    border: '1px solid #D1D5DB',
                    color: '#4B5563',
                  }}
                />
              </div>

              <input
                type="text"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full md:w-2/3 border border-gray-300 p-2 rounded-md"
              />
            </div>    

            {/* ReCAPTCHA */}
            <div className="flex justify-center mt-4">
              <ReCAPTCHA
                sitekey="6LeqpnkqAAAAAHNUm3Ey9gx-ly1-GdqlwWfrtn3O"
                onChange={handleRecaptcha}
              />
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className={`w-full md:w-1/2 bg-lightblue text-white py-2 rounded-md ${loading ? 'cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="w-full md:w-1/2 p-4 bg-white shadow-md rounded-xl mt-8 md:mt-0 flex flex-col items-center justify-center text-center">
          <h3 className="text-xl font-semibold text-gray-800">Thank you for contacting us!</h3>
          <p className="text-gray-600 mt-4">We have received your inquiry. A representative will contact you shortly.</p>
        </div>
      )}
    </div>
  );
};

export default ContactUs;
