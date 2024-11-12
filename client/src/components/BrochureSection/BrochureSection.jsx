import React from "react";

const BrochureSection = () => {
  return (
    <div className="flex items-center justify-center h-[300px] mb-10 bg-lightgreen">
      <div className="text-white text-4xl font-bold">
        RECEIVE COMPANY BROCHURE
      </div>
      <div className="ml-8 flex flex-col space-y-2">
        <div className="bg-white text-xl hover:bg-DarkRed hover:text-white text-black font-semibold py-2 px-4 rounded-md shadow-md w-52"> {/* Decreased width for first button */}
          Corporate Hiring
        </div>
        <div className="bg-white text-xl  hover:bg-DarkRed hover:text-white text-black font-semibold py-2 px-4 rounded-md shadow-md w-full"> {/* Full width for second button */}
          Manpower Recruitment
        </div>
      </div>
    </div>
  );
};

export default BrochureSection;
