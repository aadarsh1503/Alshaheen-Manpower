import React from 'react';

const HrSolutionsComponent = () => {
  return (
    <div className="flex w-full lg:h-[500px] bg-white">
      {/* Left Side with Images */}
      <div className="w-1/2 bg-lightgreen font-raleway  ">
      <div className=' p-12 space-y-8 grid ml-32 grid-cols-3'>
        {/* Image Items with unique sources */}
        <div className="flex flex-col items-center transform transition duration-300 lg:mt-8 hover:scale-110">
          <img src="https://www.groupl.ae/images/srvc_3.png" alt="Aviation" className="w-18 h-18 mb-2" />
          <p className="text-white text-11.2 font-semibold text-center">AVIATION</p>
        </div>
        <div className="flex flex-col items-center transform  transition duration-300 lg:mt-8 hover:scale-110">
          <img src="https://www.groupl.ae/images/srvc_4.png" alt="Construction" className="w-18 h-18 mb-2" />
          <p className="text-white text-11.2 font-semibold text-center">CONSTRUCTION</p>
        </div>
        <div className="flex flex-col items-center transform  transition duration-300 lg:mt-8 hover:scale-110">
          <img src="https://www.groupl.ae/images/srvc_9.png" alt="Events" className="w-18 h-18 mb-2" />
          <p className="text-white text-11.2 font-semibold text-center">EVENTS</p>
        </div>
        <div className="flex flex-col items-center transform transition duration-300 hover:scale-110">
          <img src="https://www.groupl.ae/images/srvc_11.png" alt="Healthcare" className="w-16 h-16 mb-2" />
          <p className="text-white  text-11.2 font-semibold text-center">HEALTHCARE</p>
        </div>
        <div className="flex flex-col items-center transform transition duration-300 hover:scale-110">
          <img src="https://www.groupl.ae/images/srvc_6.png" alt="Hospitality" className="w-16 h-16 mb-2" />
          <p className="text-white text-11.2 font-semibold text-center">HOSPITALITY</p>
        </div>
        <div className="flex flex-col items-center transform transition duration-300 hover:scale-110">
          <img src="https://www.groupl.ae/images/srvc_8.png" alt="Logistics" className="w-16 h-16 mb-2" />
          <p className="text-white text-11.2 font-semibold text-center">LOGISTICS</p>
        </div>
        <div className="flex flex-col items-center transform transition duration-300 hover:scale-110">
          <img src="https://www.groupl.ae/images/srvc_5.png" alt="Manufacturing" className="w-16 h-16 mb-2" />
          <p className="text-white text-11.2 font-semibold text-center">MANUFACTURING</p>
        </div>
        <div className="flex flex-col items-center transform  transition duration-300 hover:scale-110">
          <img src="https://www.groupl.ae/images/srvc_2.png" alt="Retail" className="w-16  -ml-6 h-16 mb-2" />
          <p className="text-white text-11.2 font-semibold text-center">RETAIL</p>
        </div>
        <div className="flex flex-col items-center transform transition duration-300 hover:scale-110">
          <img src="https://www.groupl.ae/images/srvc_1.png" alt="Security" className="w-16 h-16 mb-2" />
          <p className="text-white text-11.2 font-semibold text-center">SECURITY</p>
        </div>
        </div>
      </div>

      {/* Right Side with Content */}
      <div className="w-1/2 bg-gray-100 p-12 flex flex-col justify-center">
        <h1 className="text-lightblue text-3xl font-sans font-bold  mb-6">
          THE UAE'S LEADING<br /> PROVIDER OF UNIQUE AND<br /> INNOVATIVE HR SOLUTIONS
        </h1>
        <div className="h-2 w-16 bg-lightgreen mb-6"></div>
        <p className="text-gray-600 mb-6">
          We work with a broad range of industries such as Financial <br /> Services, Aviation, Logistics, Retail, IT, Oil & Gas, Call Centers, <br /> Construction, and can support organizations of any size— <br />start-up or large.
        </p>
        <button className="bg-lightgreen lg:w-[132px] text-white px-2 py-3 font-semibold uppercase hover:bg-DarkRed hover:text-white transition duration-300">
          Know More
        </button>
      </div>
    </div>
  );
};

export default HrSolutionsComponent;
