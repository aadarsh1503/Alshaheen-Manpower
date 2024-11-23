import React from 'react';
import i2 from "./i2.png"
import i3 from "./i3.png"

const Events2Middle = () => {
  return (
    <div>
      <section className="flex flex-col lg:flex-row">
        {/* Left Side - Image */}
        <div className="w-full lg:w-1/2 h-[300px] md:h-[400px] lg:h-[700px]">
          <img
            src={i2}
            alt="Cabin Crew"
            className="w-full h-full lg:h-[696px] object-cover"
          />
        </div>

        {/* Right Side - Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center bg-darkgray px-6 py-8 md:py-12 lg:px-12 lg:-mt-48">
          <h2 className="text-lightblue font-bold text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-8">
            TALENT FOR YOUR <br /> BUSINESS
          </h2>
          <hr className="w-12 md:w-16 lg:w-20 border-t-4 md:border-t-6 lg:border-t-8 border-lightgreen mb-4 md:mb-8" />
          <p className="text-gray-600 text-base md:text-lg mb-4">
          Are you ready to be part of an exciting event experience? We're looking for motivated and enthusiastic individuals to join our team as manpower candidates for AL SHAHEEN MANPOWER. As a key member of the event crew, you'll play an essential role in ensuring the smooth execution of this event, gaining valuable hands-on experience in the event industry.
          
            
          </p>
          <div className="flex space-x-6 font-raleway text-DarkRed font-semibold text-sm md:text-md">
            <div className="flex flex-col space-y-2">
              <span>| Host</span>
              <span>| Venue Crew</span>
              <span>| Ushers</span>
              <span>| Admin</span>
            </div>
            <div className="flex flex-col space-y-2">
              <span>| HSE</span>
              <span>| Production</span>
              <span>| Operations</span>
              <span>| Site Management</span>
     
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
          We provide the best trained candidates for building, maintaining, and repairing structures, as required by your business.
          </p>
          <div className="flex space-x-6 font-raleway text-DarkRed font-semibold text-sm md:text-md lg:ml-32">
            <div className="flex flex-col space-y-2">
              <span>| Security </span>
              <span>| Cleaners</span>
              <span>| Maintenance</span>
            </div>
           
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-full lg:w-1/2 h-[300px] md:h-[400px] lg:h-[600px] lg:-mt-48">
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

export default Events2Middle;
