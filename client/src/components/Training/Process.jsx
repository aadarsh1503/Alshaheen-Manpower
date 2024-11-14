import React from 'react';

const Process = () => {
  return (
    <div className="bg-lightgreen text-white  flex justify-center items-center h-[500px]">
      <div className="container mx-auto flex max-w-7xl flex-col lg:flex-row w-full h-full lg:h-auto">
        {/* Text section */}
        <div className="lg:w-1/2 w-full flex flex-col justify-center px-8 space-y-4">
          <h2 className="text-4xl font-bold uppercase">The Process</h2>
          <div className="w-12 h-2 bg-white mb-4"></div>
          <p className="text-lg leading-relaxed">
            GVS delivers a diverse range of training services keeping in mind the needs of clients looking for job-ready candidates. That serves as a two-way process, empowering the youth with the best industry skills and knowledge and filling the talent gap in industries.
          </p>
          <p className="text-lg leading-relaxed">
            Our training can be customized to suit the clients’ requirements and be delivered prior to deployment of the workers. We also offer tailor-made training at clients’ worksites to bring up the standard of the workforce post-deployment.
          </p>
        </div>

        {/* Image section */}
        <div className="lg:w-1/2 w-full  lg:h-[800px] lg:-mt-28  flex items-center justify-center lg:justify-end">
          <img
            src="https://www.groupl.ae/images/ser_pic4.jpg" // Replace with your actual image URL
            alt="Process"
            className="object-cover max-w-full max-h-full  lg:max-h-[400px] lg:max-w-[900px] shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Process;
