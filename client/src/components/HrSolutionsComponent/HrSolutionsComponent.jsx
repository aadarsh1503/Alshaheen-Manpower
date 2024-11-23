import React from 'react';

const HrSolutionsComponent = () => {
  return (
    <div className="flex flex-col lg:flex-row w-full lg:h-[600px] bg-white">
      {/* Left Side with Images */}
      <div className="w-full  lg:w-1/2 bg-lightgreen font-raleway">
        <div className="p-6 sm:p-8 lg:p- space-y-8 grid grid-cols-2  sm:grid-cols-3 gap-4 sm:gap-8 ml-0 sm:ml-8 lg:ml-32">
          {/* Image Items with unique sources */}
          <a href='/aviation'>
          <div className="flex flex-col items-center transform transition duration-300 hover:scale-110">
            <img src="https://www.groupl.ae/images/srvc_3.png" alt="Aviation" className="w-14 h-14 lg:mt-8 mt-8 lg:w-20 lg:h-20 mb-2" />
            <p className="text-white text-sm lg:text-11.2 font-semibold text-center">AVIATION</p>
          </div>
          </a>
          <a href='/construction'>
          <div className="flex flex-col items-center transform transition duration-300 hover:scale-110">
            <img src="https://www.groupl.ae/images/srvc_4.png" alt="Construction" className="w-14 h-14 lg:w-20 lg:h-20 mb-2" />
            <p className="text-white text-sm lg:text-11.2 font-semibold text-center">CONSTRUCTION</p>
          </div>
          </a>
          <a href='/events'>
          <div className="flex flex-col items-center transform transition duration-300 hover:scale-110">
            <img src="https://www.groupl.ae/images/srvc_9.png" alt="Events" className="w-14 h-14 lg:w-20 lg:h-20 mb-2" />
            <p className="text-white text-sm lg:text-11.2 font-semibold text-center">EVENTS</p>
          </div>
          </a>
          <a href='/healthcare'>
          <div className="flex flex-col items-center transform transition duration-300 hover:scale-110">
            <img src="https://www.groupl.ae/images/srvc_11.png" alt="Healthcare" className="w-14 h-14 lg:w-20 lg:h-20 mb-2" />
            <p className="text-white text-sm lg:text-11.2 font-semibold text-center">HEALTHCARE</p>
          </div>
          </a>
          <a href='/hospitality'>
          <div className="flex flex-col items-center transform transition duration-300 hover:scale-110">
            <img src="https://www.groupl.ae/images/srvc_6.png" alt="Hospitality" className="w-14 h-14 lg:w-20 lg:h-20 mb-2" />
            <p className="text-white text-sm lg:text-11.2 font-semibold text-center">HOSPITALITY</p>
          </div>
          </a>
          <a href='/logistics'>
          <div className="flex flex-col items-center transform transition duration-300 hover:scale-110">
            <img src="https://www.groupl.ae/images/srvc_8.png" alt="Logistics" className="w-14 h-14 lg:w-20 lg:h-20 mb-2" />
            <p className="text-white text-sm lg:text-11.2 font-semibold text-center">LOGISTICS</p>
          </div>
          </a>
          <a href='/manufacturing'>
          <div className="flex flex-col items-center transform transition duration-300 hover:scale-110">
            <img src="https://www.groupl.ae/images/srvc_5.png" alt="Manufacturing" className="w-14 h-14 lg:w-20 lg:h-20 mb-2" />
            <p className="text-white text-sm lg:text-11.2 font-semibold text-center">MANUFACTURING</p>
          </div>
          </a>
          <a href='/retail'>
          <div className="flex flex-col items-center transform transition duration-300 hover:scale-110">
            <img src="https://www.groupl.ae/images/srvc_2.png" alt="Retail" className="w-14 h-14 lg:w-20 lg:h-20 mb-2" />
            <p className="text-white text-sm lg:text-11.2 font-semibold text-center">RETAIL</p>
          </div>
          </a>
          <a href='/security'>
          <div className="flex flex-col items-center transform transition duration-300 hover:scale-110">
            <img src="https://www.groupl.ae/images/srvc_1.png" alt="Security" className="w-14 h-14 lg:w-20 lg:h-20 mb-2" />
            <p className="text-white text-sm lg:text-11.2 font-semibold text-center">SECURITY</p>
          </div>
          </a>
        </div>
      </div>

      {/* Right Side with Content */}
      <div className="w-full lg:w-1/2 bg-gray-100 p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
        <h1 className="text-lightblue text-xl sm:text-2xl lg:text-3xl font-sans font-bold mb-4 lg:mb-6">
          THE UAE'S LEADING<br /> PROVIDER OF UNIQUE AND<br /> INNOVATIVE HR SOLUTIONS
        </h1>
        <div className="h-1 w-12 sm:h-2 sm:w-16 bg-lightgreen mb-4 lg:mb-6"></div>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-4 lg:mb-6">
          We work with a broad range of industries such as Financial <br /> Services, Aviation, Logistics, Retail, IT, Oil & Gas, Call Centers, <br /> Construction, and can support organizations of any size— <br />start-up or large.
        </p>
        <a href='/about'>
        <button className="bg-lightgreen w-[132px] sm:w-auto lg:w-[196px]  text-white px-4 py-2 sm:px-6 sm:py-3 font-semibold uppercase hover:bg-DarkRed hover:text-white transition duration-300">
          Know More
        </button>
        </a>
      </div>
    </div>
  );
};

export default HrSolutionsComponent;
