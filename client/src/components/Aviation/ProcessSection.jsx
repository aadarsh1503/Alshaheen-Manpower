import React from 'react';

const ProcessSection = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen mt-32 bg-white">
      <div className="w-3/4 h-3/4 bg-white">
        
        {/* Heading with large underline */}
        <div className="text-left mb-8">
          <h2 className="text-4xl font-raleway font-bold text-DarkRed pb-2 relative inline-block">
            PROCESS
            {/* Large underline */}
            <div className="absolute bottom-0 lg:w-[972px] left-40  border-b-4 border-DarkRed"></div>
          </h2>
        </div>

        <div className="flex">
          {/* Left side: Image */}
          <div className="w-1/2 lg:h-[438px]">
            <img src="https://www.groupl.ae/images/ser_pic3.jpg" alt="Process" className="w-full h-full object-cover" />
          </div>

          {/* Right side: Heading and Text */}
          <div className="w-1/2 h-full flex flex-col justify-start">
            
            {/* Red Block with Text */}
            <div className="bg-DarkRed text-white p-16">
              <ul className="space-y-3 text-lg">
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
