import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaGlobe } from 'react-icons/fa';
import ReCAPTCHA from 'react-google-recaptcha';

const ContactUs = () => {
  return (
    <div>
      <div className="flex flex-wrap max-w-7xl mx-auto font-raleway bg-gray-100 p-8">
        {/* Left side: Contact Info */}
        <div className="w-full md:w-1/2 p-4 text-center md:text-left">
          <h2 className="text-4xl font-bold text-lightblue">REACH OUT <br /><span></span>TO US!</h2>
          <p className="text-gray-600 mt-4">
            If you wish to speak to a GroupL representative, kindly fill the form or contact an office close to you.
          </p>
          <div className="mt-8 flex flex-wrap space-x-8">
            <div className="flex items-center space-x-2">
              <FaPhoneAlt className="text-lightblue text-2xl mt-0 lg:-mt-4" /> {/* Increased size */}
              <div>
                <p className="text-gray-600 font-bold">Head Office</p>
                <p className="text-gray-600">+973 1330 3301</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaEnvelope className="text-lightblue text-2xl mt-0 lg:-mt-4" /> {/* Increased size */}
              <div>
                <p className="text-gray-600 font-bold">Email</p>
                <p className="text-gray-600">
                  <a href="mailto:info@alshaheen.pro" className="text-black hover:underline">info@alshaheen.pro</a>
                </p>
              </div>
            </div>
          </div>

          <div className="w-full mt-4 flex items-center space-x-2">
            <FaGlobe className="text-lightblue text-2xl mt-0 lg:-mt-4" /> {/* Increased size */}
            <p className="text-gray-600 font-bold">
              Website<br />
              <a href="https://www.alshaheen.pro" target="_blank" rel="noopener noreferrer" className="text-black hover:underline">
                www.alshaheen.pro
              </a>
            </p>
          </div>

          <a href="#" className="text-lightblue text-4xl underline font-bold mt-32 ml-10 inline-block">Apply here for jobs</a>
        </div>

        {/* Right side: Contact Form */}
        <div className="w-full max-w-xl p-4 bg-white shadow-md rounded-xl">
          <h3 className="text-xl font-semibold text-gray-800">HOW CAN WE HELP YOU?</h3>
          <form className="mt-6 space-y-4">
            <div>
              <select className="w-full border border-gray-300 p-2 rounded-md" placeholder="Select">
                <option value="">Select</option>
                <option value="option1">I am an employer looking to Hire</option>
                <option value="option2">i am a job seeker looking for jobs</option>
                <option value="option2">I am a Supplier</option>
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

            <button type="submit" className="w-full bg-lightgreen hover:bg-DarkRed text-white p-2 rounded-md font-semibold mt-4">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
