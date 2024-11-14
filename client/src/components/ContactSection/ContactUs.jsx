import React from 'react';
import { FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import ReCAPTCHA from 'react-google-recaptcha';

const ContactUs = () => {
  return (
    <div>
    <div className="flex flex-wrap max-w-7xl mx-auto bg-gray-100 p-8">
      {/* Left side: Contact Info */}
      <div className="w-full md:w-1/2 p-4 text-center md:text-left">
        <h2 className="text-4xl font-bold text-DarkRed">REACH OUT <br /><span></span>TO US!</h2>
        <p className="text-gray-600 mt-4">
          If you wish to speak to a GroupL representative, kindly fill the form or contact an office close to you.
        </p>
        <div className="mt-8 flex flex-wrap space-x-8">
  <div className="flex items-center space-x-2">
    <FaPhoneAlt className="text-red-600" />
    <div>
      <p className="text-gray-600 font-bold">Head Office</p>
      <p className="text-gray-600">+971 4330 3373</p>
    </div>
  </div>
  <div className="flex items-center space-x-2">
    <FaPhoneAlt className="text-red-600" />
    <div>
      <p className="text-gray-600 font-bold">Job Center</p>
      <p className="text-gray-600">+971 4547 7239</p>
    </div>
  </div>
  <div className="flex items-center space-x-2">
    <FaPhoneAlt className="text-red-600" />
    <div>
      <p className="text-gray-600 font-bold">Bahrain Office</p>
      <p className="text-gray-600">+40 741 555 566</p>
    </div>
  </div> 
  </div>

  <div className="w-full mt-4  flex items-center space-x-2">
    <FaWhatsapp className="text-red-600" />
    <p className="text-gray-600 font-bold">Click here to WhatsApp us:<br /> <span className='font-normal'>+973 17491222</span> </p>
  </div>


       
        <a href="#" className="text-DarkRed text-4xl  underline font-bold mt-32 ml-10 inline-block">Apply here for jobs</a>
      </div>
      


      <div className="w-full  max-w-xl p-4  bg-white shadow-md rounded-xl">
        <h3 className="text-xl font-semibold text-gray-800">HOW CAN WE HELP YOU?</h3>
        <form className="mt-6 space-y-4">
          <div>
            <select className="w-full border border-gray-300 p-2 rounded-md" placeholder="Select">
              <option value="">Select</option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
            </select>
          </div>
          <div className="flex space-x-4">
            <input type="text" placeholder="First Name" className="w-1/2 border border-gray-300 p-2 rounded-md" />
            <input type="text" placeholder="Last Name" className="w-1/2 border border-gray-300 p-2 rounded-md" />
          </div>
          <input type="email" placeholder="Email" className="w-full border border-gray-300 p-2 rounded-md" />
          <input type="text" placeholder="Company Name" className="w-full border border-gray-300 p-2 rounded-md" />
          <input type="text" placeholder="Website" className="w-full border border-gray-300 p-2 rounded-md" />
          <input type="text" placeholder="Contact Number" className="w-full border border-gray-300 p-2 rounded-md" />

          {/* reCAPTCHA */}
          <div className="flex justify-center mt-4">
            <ReCAPTCHA sitekey="YOUR_SITE_KEY" />
          </div>

          <button type="submit" className="w-full bg-red-600 text-white p-2 rounded-md font-semibold mt-4">
            Submit
          </button>
        </form>
      </div>
    </div>
    </div>

  );
};

export default ContactUs;
