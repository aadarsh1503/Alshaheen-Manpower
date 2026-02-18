import React, { useState, useEffect } from 'react';
import { FaFacebookF, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import { AiOutlinePhone, AiOutlineMail } from 'react-icons/ai';
import { GoLocation } from 'react-icons/go'; // A better icon for location
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [version, setVersion] = useState('1.0.0');
  const [settings, setSettings] = useState({
    contact_address: 'FLAT 22, BLDG 661, BLOCK 712, ROAD 1208, MANAMA, BAHRAIN',
    contact_phone: '+973 13303301 (Ext. 100 / 102 / 103)',
    contact_email: 'info@alshaheen.pro',
    social_facebook: 'https://www.facebook.com/Alshaheen.pro/',
    social_instagram: 'https://www.instagram.com/alshaheen_manpower/',
    social_linkedin: 'https://www.linkedin.com/in/alshaheen-manpower-144096339/',
    social_twitter: 'https://x.com/Alshaheen_Pro'
  });

  useEffect(() => {
    // Fetch settings from API
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/settings/public');
        setSettings(response.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();

    // Fetch version from public settings endpoint
    const fetchVersion = async () => {
      try {
        // Use proxy path when baseUrl is empty (development)
        const apiUrl = `/api/settings`;
        const response = await axios.get(apiUrl);
        if (response.data.version) {
          setVersion(response.data.version);
        }
      } catch (error) {
        console.error('Error fetching version:', error);
      }
    };
    fetchVersion();
    
    // Poll for version updates every 30 seconds
    const interval = setInterval(fetchVersion, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setMessage('Please enter a valid email address.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    setLoading(true);
    try {
      // Your form submission logic remains the same
      const formData = new FormData();
      formData.append('email', email);
      formData.append('list', 'DXjE7radFu0UOJSxeJgydg');
      formData.append('subform', 'yes');
      formData.append('hp', '');

      await fetch('https://send.alzyara.com/subscribe', {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      });
      setMessage('Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      console.error('Error:', error);
      setMessage('Subscription failed. Please try again.');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    // ✨ Using a sophisticated light gradient background
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-raleway">
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4  ">
          <img 
    src="https://alshaheen.pro/assets/i21-Bo7dbSjO.jpg"
    alt="Al Shaheen Manpower Logo" 
    className="h-20 w-auto mx-auto"
  />
            <p className="text-gray-500 text-center text-sm">
              Connecting global talent with premier opportunities. Committed to ethical, efficient, and excellent manpower solutions.
            </p>
          </div>

          {/* Column 2: Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-lightblue tracking-widest uppercase">Contact Us</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p className="flex items-start gap-3">
                <GoLocation className="text-DarkRed text-lg flex-shrink-0 mt-1" />
                <span>{settings.contact_address}</span>
              </p>
              <p className="flex items-center gap-3">
                <AiOutlinePhone className="text-DarkRed text-lg flex-shrink-0" />
                <span>{settings.contact_phone}</span>
              </p>
              <p className="flex items-center gap-3">
                <AiOutlineMail className="text-DarkRed text-lg flex-shrink-0" />
                <span>{settings.contact_email}</span>
              </p>
            </div>
          </div>

          {/* Column 3: Social & Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-lightblue tracking-widest uppercase">Follow Us</h3>
            <div className="flex space-x-5">
              {settings.social_facebook && (
                <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-DarkRed transition-colors duration-300 transform hover:scale-110">
                  <FaFacebookF size={22} />
                </a>
              )}
              {settings.social_instagram && (
                <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-DarkRed transition-colors duration-300 transform hover:scale-110">
                  <FaInstagram size={22} />
                </a>
              )}
              {settings.social_linkedin && (
                <a href={settings.social_linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-DarkRed transition-colors duration-300 transform hover:scale-110">
                  <FaLinkedinIn size={22} />
                </a>
              )}
              {settings.social_twitter && (
                <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-DarkRed transition-colors duration-300 transform hover:scale-110">
                  <FontAwesomeIcon icon={faXTwitter} size="lg" />
                </a>
              )}
            </div>
            <a href="/privacy-policy" className="inline-block text-sm text-gray-500 hover:text-DarkRed transition-colors mt-4">
              Privacy Policy
            </a>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-lightblue tracking-widest uppercase">Stay Updated</h3>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-gray-200/60 border border-gray-300 rounded-md p-3 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-lightblue focus:border-transparent focus:outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-DarkRed text-white font-bold rounded-md py-3 transition-all duration-300 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/40 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Subscribe'}
              </button>
              {message && <p className="text-sm text-DarkRed mt-2">{message}</p>}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Al Shaheen Manpower. All Rights Reserved.</p>
          <p className="mt-1 text-xs text-gray-400">Version {version}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;