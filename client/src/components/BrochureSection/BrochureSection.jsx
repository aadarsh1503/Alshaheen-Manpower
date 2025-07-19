import React from 'react';
import { BsBuilding, BsPeopleFill } from 'react-icons/bs';

// Import our custom CSS for the background animation
import './b.css';

const BrochureSection = () => {
  return (
    // ✨ Here's the new background with your brand color!
    <div className="bg-animated-grid bg-gradient-to-br from-[#1A9C2C] to-[#115e2c]">
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-20 md:py-24">
        <h2 className="text-white text-3xl md:text-5xl font-bold">
          RECEIVE COMPANY BROCHURE
        </h2>
        <p className="text-white/80 mt-3 text-lg">
          Choose your area of interest to get started.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6 mt-10">
          <a href="/contactUs">
            <button 
              className="flex items-center gap-3 w-64 justify-center text-lg bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold py-3 px-6 rounded-lg shadow-lg 
              hover:bg-white/20 hover:border-[#1A9C2C] hover:shadow-lg hover:shadow-[#1A9C2C]/50 transition-all duration-300"
            >
              <BsBuilding size={20} />
              <span>Corporate Hiring</span>
            </button>
          </a>

          <a href="/contactUs">
            <button 
              className="flex items-center gap-3 w-72 justify-center text-lg bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold py-3 px-6 rounded-lg shadow-lg
              hover:bg-white/20 hover:border-[#1A9C2C] hover:shadow-lg hover:shadow-[#1A9C2C]/50 transition-all duration-300"
            >
              <BsPeopleFill size={20} />
              <span>Manpower Recruitment</span>
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default BrochureSection;