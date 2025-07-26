import React, { useState, useEffect } from 'react';

// Custom CSS (if you have it)
import './r.css'; // Assuming this file exists and contains the animation styles

const RecruitmentDays = () => {
  // --- STATE MANAGEMENT ---
  const [jobs, setJobs] = useState([]); // State to hold formatted data
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true); // State to handle loading UI
  const [error, setError] = useState(null); // State to handle API errors

  // --- API FETCHING LOGIC ---
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Fetch data from your API endpoint
        const response = await fetch('https://alshaheen-manpower.onrender.com/api/admin/vacancies'); 
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // --- DATA MAPPING ---
        // ✨ THIS IS THE FIX ✨
        // The API returns objects with `imageUrl` and `subject`.
        // Our component's JSX expects `src` and `subject`.
        // We use .map() to create a new array with the correct property names.
        const formattedData = data.map(apiItem => ({
          src: apiItem.imageUrl,  // Map API's 'imageUrl' to our component's 'src'
          subject: apiItem.subject // 'subject' is the same, so we just pass it through
        }));

        // Set the state with the new, correctly formatted array
        setJobs(formattedData);

      } catch (e) {
        console.error("Failed to fetch recruitment data:", e);
        setError("Could not load job vacancies. Please try again later.");
      } finally {
        setLoading(false); // Stop loading, whether successful or not
      }
    };

    fetchJobs();
  }, []); // The empty array [] ensures this effect runs only once on mount

  // --- UI FOR LOADING AND ERROR STATES ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl text-gray-600">Loading Vacancies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  // --- HANDLE NO DATA ---
  if (jobs.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl text-gray-600">No open vacancies at the moment.</p>
      </div>
    );
  }

  // Active job is derived from the 'jobs' state
  const activeJob = jobs[activeIndex];

  // --- RENDER THE ORIGINAL DESIGN WITH DYNAMIC DATA ---
  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 font-raleway py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          
          {/* --- LEFT PANEL: Main Display Screen --- */}
          <div className="lg:col-span-2 lg:sticky lg:top-28">
            <div className="relative p-2 bg-white rounded-xl shadow-2xl ring-1 ring-gray-200">
              <div className="relative">
                <img
                  key={activeJob.src} // Key ensures the animation re-runs on change
                  src={activeJob.src}
                  alt={activeJob.subject}
                  className="w-full h-auto rounded-lg object-cover animation-fade-in"
                />
              </div>
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-xl font-bold text-gray-800">{activeJob.subject}</h3>
              <a 
                href={`mailto:Hire@alshaheen.pro?subject=${encodeURIComponent(activeJob.subject)}`} 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 bg-DarkRed text-white font-bold py-3 px-10 rounded-full transition-all duration-300 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/40 transform hover:-translate-y-1"
              >
                Apply Now
              </a>
            </div>
          </div>
          
          {/* --- RIGHT PANEL: Selection Grid --- */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h2 className="text-3xl lg:text-5xl font-bold text-lightblue mb-3">
                RECRUITMENT DAYS
              </h2>
              <p className="text-gray-600 text-base lg:text-lg">
                Select a job opening from the grid below to view details and apply.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {jobs.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`relative rounded-lg overflow-hidden cursor-pointer group focus:outline-none transition-all duration-300
                    ${activeIndex === index ? 'ring-4 ring-DarkRed scale-105' : 'ring-2 ring-gray-200'}`
                  }
                >
                  <img 
                    src={item.src} 
                    alt={item.subject}
                    className={`w-full h-auto object-cover transition-all duration-300
                      ${activeIndex === index ? 'grayscale-0' : ''}`
                    }
                  />
                  {activeIndex !== index && (
                     <div className="absolute inset-0 bg-white/40 transition-colors"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RecruitmentDays;