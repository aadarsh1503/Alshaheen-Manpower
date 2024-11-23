import React from 'react';
import i2 from "./i2.png"
import i3 from "./i3.png"

const ConstructionMiddle = () => {
  return (
    <div>
      <section className="flex flex-col lg:flex-row">
        {/* Left Side - Image */}
        <div className="w-full lg:w-1/2 h-[300px] md:h-[400px] lg:h-[700px]">
          <img
            src={i2}
            alt="Cabin Crew"
            className="w-full h-full lg:h-[532px] object-cover"
          />
        </div>

        {/* Right Side - Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center bg-darkgray px-6 py-8 md:py-12 lg:px-12 lg:-mt-48">
          <h2 className="text-lightblue font-bold text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-8">
            TALENT FOR YOUR <br /> BUSINESS
          </h2>
          <hr className="w-12 md:w-16 lg:w-20 border-t-4 md:border-t-6 lg:border-t-8 border-lightgreen mb-4 md:mb-8" />
          <p className="text-gray-600 text-base md:text-lg mb-4">
          At AL SHAHEEN MANPOWER, we understand that the foundation of every successful construction project is the strength, skill, and dedication of the people behind it. That’s why we take great pride in providing highly skilled and experienced manpower to meet the diverse needs of your construction projects.
          
            
          </p>
          <div className="flex space-x-6 font-raleway text-DarkRed font-semibold text-sm md:text-md">
            <div className="flex flex-col space-y-2">
              <span>| Project</span>
              <span>| Management</span>
              <span>| Engineers</span>
            </div>
            <div className="flex flex-col space-y-2">
              <span>| Estimation</span>
              <span>| Contacts</span>
              <span>| Architect</span>
     
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col lg:flex-row bg-darkgray">
        {/* Left Side - Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-8 md:py-12 bg-darkgray lg:px-12 lg:-mt-48">
          <h2 className="text-lightblue font-bold text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-8 lg:ml-32">
            SKILL FOR YOUR <br /> BUSINESS
          </h2>
          <hr className="w-12 md:w-16 lg:w-20 border-t-4 md:border-t-6 lg:border-t-8 border-lightgreen mb-4 md:mb-8 lg:ml-32" />
          <p className="text-gray-600 text-base md:text-lg mb-4 lg:ml-32">
          Our team consists of qualified professionals, including laborers, engineers, project managers, carpenters, electricians, masons, and skilled craftsmen, all trained to meet the highest industry standards. We ensure that our workforce is equipped with the latest tools and technologies.
          </p>
          <div className="flex space-x-6 font-raleway text-DarkRed font-semibold text-sm md:text-md lg:ml-32">
            <div className="flex flex-col space-y-2">
              <span>| MEP </span>
              <span>| Civil</span>
            </div>
            <div className="flex flex-col space-y-2">
              <span>| Foreman</span>
              <span>| Supervisor</span>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-full lg:w-1/2 h-[300px] md:h-[400px] lg:h-[500px] lg:-mt-48">
          <img
            src={i3}
            alt="Cabin Crew"
            className="w-full h-full object-cover"
          />
        </div>
      </section>
    </div>
  );
};

export default ConstructionMiddle;
