import React from "react";
import L1 from "./L1.jpg"; // Replace with the correct path to your image

const LicenseModel = () => {
  return (
    <div className="flex flex-col h-[256px] lg:h-full justify-center lg:min-h-screen ">
      {/* Heading */}
      <h1 className="text-3xl font-raleway ml-1 lg:ml-40 sm:text-3xl font-bold  text-lightblue lg:mb-6 ">
        OUR LICENSE
      </h1>
      <div className="h-2 w-10 lg:w-16 bg-lightblue ml-2 lg:ml-40 mt-0 lg:-mt-3"></div>

      {/* License Image */}
      <div className="w-full  lg:h-auto flex justify-center mb-0 p-2 lg:p-2 lg:mb-10 items-center">
        <img
          src={L1}
          alt="Company License"
          className="w-auto h-56 lg:h-screen max-w-full object-contain border shadow-lg"
        />
      </div>
    </div>
  );
};

export default LicenseModel;
