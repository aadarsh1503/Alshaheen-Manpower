import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
// const baseUrl = import.meta.env.VITE_API_BASE_URL; // This is no longer needed for the IP lookup

const PersonalInfoStep = ({ formData, errors, handleChange }) => {
  const [countries, setCountries] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [defaultCountry, setDefaultCountry] = useState('us'); // Default to 'us' initially
  const [nationalitySuggestions, setNationalitySuggestions] = useState([]);
  const [showNationalitySuggestions, setShowNationalitySuggestions] = useState(false);
  const [countrySuggestions, setCountrySuggestions] = useState([]);
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const locationInputRef = useRef(null);


    // Fetch country data and detect user's location
    useEffect(() => {
      // Fetch country list for nationality and country dropdowns
      fetch('https://restcountries.com/v3.1/all?fields=name')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const countryNames = data
              .map(c => c.name?.common)
              .filter(Boolean) // Remove undefined/null names
              .sort();
            setCountries(countryNames);
          } else {
            console.error("Country API did not return an array", data);
            setCountries([]);
          }
        })
        .catch(err => {
          console.error("Error fetching countries:", err);
          setCountries([]);
        });
    
      // Detect user's country code for phone input default using ipapi.co
      const fetchUserCountry = async () => {
        try {
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          // ipapi.co provides 'country_code' (e.g., "US", "IN")
          if (data && data.country_code) {
            setDefaultCountry(data.country_code.toLowerCase());
          } else {
            setDefaultCountry('bh'); // Fallback to 'bh' (Bahrain) if detection fails
          }
        } catch (error) {
          console.error("Error fetching user's country:", error);
          setDefaultCountry('bh'); // Fallback to 'bh' (Bahrain) on error
        }
      };
      
      fetchUserCountry();
    }, []); // Empty dependency array ensures this runs only once on mount
    

  const fetchLocationSuggestions = async (query, type) => {
    if (query.length < 2) {
      setLocationSuggestions([]);
      return;
    }

    setIsFetchingLocation(true);
    try {
      // NOTE: Replace 'YOUR_API_KEY' with your actual LocationIQ API key
      let url = `https://api.locationiq.com/v1/autocomplete.php?key=pk.YOUR_API_KEY&q=${query}&limit=5`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      const suggestions = data.map(item => ({
        city: item.address?.city || item.address?.town || item.address?.village || item.display_name.split(',')[0],
        postalCode: item.address?.postcode,
        country: item.address?.country,
        countryCode: item.address?.country_code
      })).filter(item => item.city && item.country);

      setLocationSuggestions(suggestions);
      setShowLocationSuggestions(true);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      // Fallback mock data for demonstration
      setLocationSuggestions([
        { city: 'New York', postalCode: '10001', country: 'United States', countryCode: 'us' },
        { city: 'London', postalCode: 'SW1A', country: 'United Kingdom', countryCode: 'gb' },
        { city: 'Paris', postalCode: '75000', country: 'France', countryCode: 'fr' },
      ].filter(item => 
        (item.city && item.city.toLowerCase().includes(query.toLowerCase())) ||
        (item.country && item.country.toLowerCase().includes(query.toLowerCase()))
      ));
      setShowLocationSuggestions(true);
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const handleNationalityChange = (e) => {
    const input = e.target.value;
    handleChange(e);

    if (input.length > 0) {
      const filtered = countries.filter(country =>
        country.toLowerCase().startsWith(input.toLowerCase())
      );
      setNationalitySuggestions(filtered.slice(0, 5));
      setShowNationalitySuggestions(true);
    } else {
      setShowNationalitySuggestions(false);
      setNationalitySuggestions([]);
    }
  };

  const handleNationalitySuggestionClick = (suggestion) => {
    handleChange({ target: { name: 'nationality', value: suggestion } });
    setShowNationalitySuggestions(false);
    setNationalitySuggestions([]);
  };

  const handleCountryChange = (e) => {
    const input = e.target.value;
    handleChange(e);

    if (input.length > 0) {
      const filtered = countries.filter(country =>
        country.toLowerCase().startsWith(input.toLowerCase())
      );
      setCountrySuggestions(filtered.slice(0, 5));
      setShowCountrySuggestions(true);
    } else {
      setShowCountrySuggestions(false);
      setCountrySuggestions([]);
    }
  };

  const handleCountrySuggestionClick = (suggestion) => {
    handleChange({ target: { name: 'country', value: suggestion } });
    setShowCountrySuggestions(false);
    setCountrySuggestions([]);
  };

  const handlePhoneChange = (value, name) => {
    handleChange({ target: { name, value } });
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    handleChange(e);
    
    if (name === 'city' || name === 'postalCode') {
      fetchLocationSuggestions(value, name);
    }
  };

  const handleLocationSuggestionClick = (suggestion) => {
    // Update all location fields when a suggestion is selected
    handleChange({ target: { name: 'city', value: suggestion.city } });
    if (suggestion.postalCode) {
      handleChange({ target: { name: 'postalCode', value: suggestion.postalCode } });
    }
    handleChange({ target: { name: 'country', value: suggestion.country } });
    
    setShowLocationSuggestions(false);
    setLocationSuggestions([]);
  };

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold text-dark mb-6">Personal Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="your@email.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-transparent ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="As printed on passport/ID"
          />
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-transparent ${
              errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.dateOfBirth && (
            <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>
          )}
        </div>
      
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Gender</label>
          <div className="flex gap-6">
            {['male', 'female'].map((option) => (
              <label
                key={option}
                className={`cursor-pointer flex items-center gap-3 px-4 py-2 rounded-lg border transition duration-200
                  ${
                    formData.gender === option
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 hover:border-blue-400'
                  }`}
              >
                <input
                  type="radio"
                  name="gender"
                  value={option}
                  checked={formData.gender === option}
                  onChange={handleChange}
                  className="form-radio text-blue-600 focus:ring-0"
                />
                <span className="capitalize font-medium">{option}</span>
              </label>
            ))}
          </div>
          {errors.gender && <p className="text-red-500 text-xs mt-2">{errors.gender}</p>}
        </div>

        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
          <div className="relative">
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleNationalityChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-transparent ${errors.nationality ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Your nationality"
              autoComplete="off"
            />
            {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>}

            {showNationalitySuggestions && nationalitySuggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded max-h-40 overflow-auto">
                {nationalitySuggestions.map((suggestion, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleNationalitySuggestionClick(suggestion)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Contact</label>
          <PhoneInput
            country={defaultCountry}
            value={formData.mobileContact}
            onChange={(value) => handlePhoneChange(value, 'mobileContact')}
            inputProps={{
              name: 'mobileContact',
              required: true,
            }}
            inputStyle={{
              width: '100%',
              height: '42px',
              border: '1px solid #D1D5DB',
              borderRadius: '0.5rem',
              color: '#4B5563',
            }}
            containerClass={errors.mobileContact ? 'phone-input-error' : ''}
          />
          {errors.mobileContact && <p className="text-red-500 text-xs mt-1">{errors.mobileContact}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
          <PhoneInput
            country={defaultCountry}
            value={formData.whatsapp}
            onChange={(value) => handlePhoneChange(value, 'whatsapp')}
            inputProps={{
              name: 'whatsapp',
              required: true,
            }}
            inputStyle={{
              width: '100%',
              height: '42px',
              border: '1px solid #D1D5DB',
              borderRadius: '0.5rem',
              color: '#4B5563',
            }}
            containerClass={errors.whatsapp ? 'phone-input-error' : ''}
          />
          {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Current Address</label>
        <input
          type="text"
          name="currentAddress"
          value={formData.currentAddress}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-transparent ${errors.currentAddress ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Street address, apartment, floor, etc."
        />
        {errors.currentAddress && <p className="text-red-500 text-xs mt-1">{errors.currentAddress}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
          <div className="relative">
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleLocationChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-transparent ${errors.postalCode ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter postal code"
              ref={locationInputRef}
            />
            {isFetchingLocation && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </div>
          {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <div className="relative">
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleLocationChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-transparent ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter city name"
            />
          </div>
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <div className="relative">
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleCountryChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-transparent ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter country"
              autoComplete="off"
            />
            {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}

            {showCountrySuggestions && countrySuggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded max-h-40 overflow-auto">
                {countrySuggestions.map((suggestion, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleCountrySuggestionClick(suggestion)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {showLocationSuggestions && locationSuggestions.length > 0 && (
        <ul className="z-10 bg-white border border-gray-300 w-full mt-1 rounded max-h-60 overflow-auto shadow-lg">
          {locationSuggestions.map((suggestion, idx) => (
            <li
              key={idx}
              onClick={() => handleLocationSuggestionClick(suggestion)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium">{suggestion.city} {suggestion.postalCode && `(${suggestion.postalCode})`}</div>
              <div className="text-sm text-gray-600">{suggestion.country}</div>
            </li>
          ))}
        </ul>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CPR/National ID</label>
          <input
            type="text"
            name="cprNationalId"
            value={formData.cprNationalId}
            onChange={handleChange}
            required
            inputMode="numeric"
            pattern="[0-9]+"
            maxLength={15}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-transparent ${errors.cprNationalId ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Your national ID number"
          />
          {errors.cprNationalId && <p className="text-red-500 text-xs mt-1">{errors.cprNationalId}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Passport ID Number</label>
          <input
            type="text"
            name="passportId"
            value={formData.passportId}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-transparent ${errors.passportId ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Your passport number"
          />
          {errors.passportId && <p className="text-red-500 text-xs mt-1">{errors.passportId}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Passport Validity Date</label>
          <input
            type="date"
            name="passportValidity"
            value={formData.passportValidity}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-transparent ${errors.passportValidity ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.passportValidity && <p className="text-red-500 text-xs mt-1">{errors.passportValidity}</p>}
        </div>
      </div>
    </motion.div>
  );
};

export default PersonalInfoStep;