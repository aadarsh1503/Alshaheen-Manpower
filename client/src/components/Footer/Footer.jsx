import React, { useState } from 'react';
import { FaFacebookF, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import { AiOutlinePhone, AiOutlineMail } from 'react-icons/ai';
import { MdOutlineBusinessCenter } from 'react-icons/md';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }
  
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('email', email);
      formData.append('list', 'DXjE7radFu0UOJSxeJgydg'); // Your list ID
      formData.append('subform', 'yes');
      formData.append('hp', '');
  
      await fetch('https://send.alzyara.com/subscribe', {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      });
  
      setMessage('Thank you for subscribing!');
      setEmail('');
  
      // ⏱️ Hide message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
      setMessage('Subscription failed. Please try again.');
  
      // Hide error message after 3 seconds (optional)
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <footer className="bg-white max-w-5xl mx-auto lg:h-[280px] text-gray-800 py-6">
      <div className="container mx-auto flex lg:flex-row flex-col lg:justify-between lg:items-center px-4">
{/* div */}
        {/* Left Section */}
        <div className="text-center lg:text-left mb-4 lg:mb-0">
          <h2 className="text-lightblue mt-6 lg:mt-10 font-bold text-2xl lg:text-3xl">CONTACT US</h2>
          <div className="mt-2 text-sm lg:text-base text-gray-700 space-y-2">
            <p className="flex items-start">
              <MdOutlineBusinessCenter className="text-DarkRed text-lg mr-2 mt-1" />
              <span>
                FLAT 22, BUILDING 661, BLOCK 712,<br />
                ROAD 1208, P.O BOX 54121,<br />
                MANAMA, KINGDOM OF BAHRAIN
              </span>
            </p>
            <p className="flex items-center">
              <AiOutlinePhone className="text-DarkRed text-lg mr-2" />
              +973 13303301 (Ext. 100 / 102 / 103)
            </p>
            <p className="flex items-center">
              <AiOutlineMail className="text-DarkRed text-lg mr-2" />
              info@alshaheen.pro
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="text-center lg:text-left">
          <h3 className="text-lightblue font-bold mt-4 lg:mt-0">Follow us</h3>
          <div className="flex justify-center lg:justify-start space-x-4 mt-2 mb-2">
            <a href="https://www.facebook.com/Alshaheen.pro/" target="_blank" rel="noopener noreferrer">
              <FaFacebookF className="text-gray-400 text-2xl hover:text-DarkRed" />
            </a>
            <a href="https://www.instagram.com/alshaheen_manpower/" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-gray-400 text-2xl hover:text-DarkRed" />
            </a>
            <a href="https://www.linkedin.com/in/alshaheen-manpower-144096339/" target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn className="text-gray-400 text-2xl hover:text-DarkRed" />
            </a>
            <a href="https://x.com/Alshaheen_Pro" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faXTwitter} className="text-gray-400 text-2xl hover:text-DarkRed" />
            </a>
          </div>

          {/* Newsletter Form */}
          <form onSubmit={handleSubscribe} className="flex flex-col w-full max-w-sm mt-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-2 border border-gray-300 rounded text-gray-700 mb-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-DarkRed text-white rounded-full py-2 transition hover:bg-red-600"
            >
              {loading ? 'Submitting...' : 'Subscribe'}
            </button>
            {message && <p className="text-sm text-gray-600 mt-2">{message}</p>}
          </form>

          <a href="/privacy-policy">
            <p className="text-gray-500 hover:text-DarkRed text-xs lg:text-sm mt-3">Privacy Policy</p>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
