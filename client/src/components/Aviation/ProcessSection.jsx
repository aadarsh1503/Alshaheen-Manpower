import React from 'react';
import i1 from "./i1.png"

const ProcessSection = () => {
  return (
    <div className="flex items-center justify-center w-full min-h-screen mt-32 bg-white px-4">
      <div className="w-full md:w-3/4 h-full bg-white">
        
        {/* Heading with large underline */}
        <div className="text-left mb-4 md:mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-raleway font-bold text-lightblue pb-2 relative inline-block">
            PROCESS
            {/* Large underline */}
            <div className="hidden lg:block absolute bottom-0 lg:w-[956px] left-40 border-b-4 border-lightblue"></div>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Left side: Image */}
          <div className="w-full lg:w-1/2 h-[200px] sm:h-[300px] md:h-[350px] lg:h-[438px] mb-4 lg:mb-0">
            <img 
              src={i1} 
              alt="Process" 
              className="w-full h-full object-cover" 
            />
          </div>

          {/* Right side: Heading and Text */}
          <div className="w-full lg:w-1/2 flex flex-col justify-start">
            
            {/* Red Block with Text */}
            <div className="bg-lightgreen text-white p-4 sm:p-8 md:p-12 lg:p-16">
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base md:text-lg">
                <li><span className="text-white">|</span> English Test</li>
                <li><span className="text-white">|</span> Demand for workers is raised</li>
                <li><span className="text-white">|</span> Source potential candidates</li>
                <li><span className="text-white">|</span> Pre-screening</li>
                <li><span className="text-white">|</span> Interview by employer</li>
                <li><span className="text-white">|</span> Training of selected staff</li>
                <li><span className="text-white">|</span> Visas</li>
                <li><span className="text-white">|</span> Mobilisation to country of employment</li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessSection;
