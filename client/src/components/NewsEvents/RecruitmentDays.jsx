import React, { useState } from 'react';
import i1 from "./i1.png";
import i2 from "./i2.png";
import i3 from "./i3.png";
import i4 from "./i4.png";
import i5 from "./i5.png";
import i6 from "./i6.png";

// Custom CSS (if you have it)
import './r.css';

const RecruitmentDays = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const recruitmentData = [
    { src: i1, subject: "Application For Driver" },
    { src: i2, subject: "Application For Welder" },
    { src: i3, subject: "Application For Sales Executive" },
    { src: i4, subject: "Application For Accountant" },
    { src: i5, subject: "Application For Chef" },
    { src: i6, subject: "Application For Delivery Man" },
  ];
  
  const activeJob = recruitmentData[activeIndex];

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
              {recruitmentData.map((item, index) => (
                <button
                  key={index}
                  // ✨ CHANGE: onMouseEnter has been completely removed. Only onClick remains.
                  onClick={() => setActiveIndex(index)}
                  className={`relative rounded-lg overflow-hidden cursor-pointer group focus:outline-none transition-all duration-300
                    ${activeIndex === index ? 'ring-4 ring-DarkRed scale-105' : 'ring-2 ring-gray-200'}`
                  }
                >
                  <img 
                    src={item.src} 
                    alt={item.subject}
                    // ✨ CHANGE: The image is now grayscaled if it's NOT active. No hover effect.
                    className={`w-full h-auto object-cover transition-all duration-300
                      ${activeIndex === index ? 'grayscale-0' : ''}`
                    }
                  />
                  {/* ✨ CHANGE: This overlay is now only shown on inactive items, with no hover effect. */}
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