import React from "react";

const BrochureSection = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center h-auto lg:h-[300px] mb-10 bg-lightgreen px-4 py-6 lg:py-0">
      <div className="text-white text-2xl lg:text-4xl font-bold text-center lg:text-left mb-4 lg:mb-0">
        RECEIVE COMPANY BROCHURE
      </div>
      <a href="/contactUs">
      <div className="flex flex-col lg:ml-8 space-y-2 w-full lg:w-auto">
        <button className="bg-white text-lg lg:text-xl hover:bg-DarkRed hover:text-white text-black font-semibold py-2 px-4 rounded-md shadow-md w-full lg:w-52">
          Corporate Hiring
        </button>
        <button className="bg-white text-lg lg:text-xl hover:bg-DarkRed hover:text-white text-black font-semibold py-2 px-4 rounded-md shadow-md w-full">
          Manpower Recruitment
        </button>
      </div>
      </a>
    </div>
  );
};

export default BrochureSection;
