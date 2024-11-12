import React from 'react';


const TalentForYourBusiness = () => {
  return (
    <div>
    <section className="flex">
      {/* Left Side - Image */}
      <div className="w-1/2 h-full lg:h-[700px]">
        <img
          src="https://www.groupl.ae/images/ser_pic1.jpg"
          alt="Cabin Crew"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Content */}
      <div className="w-1/2 flex flex-col justify-center bg-darkgray px-12 lg:-mt-48">
        <h2 className="text-red-700 font-bold text-4xl mb-8">
          TALENT FOR YOUR <br /> BUSINESS
        </h2>
        <hr className="w-20 border-t-8 border-red-700 mb-8" />
        <p className="text-gray-600 text-lg  mb-4">
          We fulfill all talent requirements for the airline industry<br /> including aircraft manufacturing,
          research companies,<br /> military aviation, and much more, with both quality and<br /> quantity.
        </p>
        <div className="flex space-x-6 text-red-700 font-semibold text-md">
          <div className="flex flex-col space-y-2">
            <span>Customer service</span>
            <span>Check in</span>
          </div>
          <div className="flex flex-col space-y-2">
            <span>Cabin crew</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </section>

    <section className="flex bg-darkgray">
  {/* Left Side - Content */}
  <div className="w-1/2 flex flex-col  justify-center  bg-darkgray px-12 lg:-mt-48">
    <h2 className="text-red-700 font-bold lg:ml-32 text-4xl mb-8">
      SKILL FOR YOUR <br /> BUSINESS
    </h2>
    <hr className="w-20 border-t-8 lg:ml-32 border-red-700 mb-8" />
    <p className="text-gray-600 text-lg  lg:ml-32 mb-4">
    We deliver a reliable workforce that fulfills requirements<br /> encompassing all aspects and all activities of the airline industry
    </p>
    <div className="flex space-x-6 lg:ml-32 text-red-700 font-semibold text-md">
      <div className="flex flex-col space-y-2">
        <span>Customer service</span>
        <span>Check in</span>
      </div>
      <div className="flex flex-col space-y-2">
        <span>Cabin crew</span>
        <span>Security</span>
      </div>
    </div>
  </div>

  {/* Right Side - Image */}
  <div className="w-1/2 h-full lg:-mt-48 lg:h-[500px]">
    <img
      src="https://www.groupl.ae/images/ser_pic2.jpg"
      alt="Cabin Crew"
      className="w-full h-full object-cover"
    />
  </div>
</section>

    </div>
  );
};

export default TalentForYourBusiness;
