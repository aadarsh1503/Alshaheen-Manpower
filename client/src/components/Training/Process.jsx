import React from 'react';

const Process = () => {
  return (
    <div className="bg-lightgreen text-white lg:p-0 p-2 flex justify-center items-center h-[932px] lg:h-[500px]">
      <div className="container mx-auto flex max-w-7xl flex-col sm:flex-row lg:flex-row w-full h-full lg:h-auto">
        {/* Text section */}
        <div className="sm:w-1/2 w-full flex flex-col justify-center px-8 space-y-4">
          <h2 className="text-4xl font-bold uppercase">The Process</h2>
          <div className="w-12 h-2 bg-white mb-4"></div>
          <p className="text-lg leading-relaxed">
          AL SHAHEEN MANPOWER provides a wide array of training services that are specifically designed to meet the needs of clients seeking skilled, job-ready candidates. This approach benefits both the workforce and industries by empowering young individuals with valuable industry expertise while bridging the talent gap in various sectors.
          </p>
          <p className="text-lg leading-relaxed">
          Our training programs are adaptable to meet client specifications and can be delivered before workers are deployed. Additionally, we offer customized on-site training to enhance the skill set of employees after deployment, ensuring continuous improvement and industry-standard performance.
          </p>
        </div>

        {/* Image section */}
        <div className="sm:w-1/2 w-full sm:h-[300px] lg:h-[800px] lg:-mt-28 flex items-center justify-center sm:justify-center lg:justify-end">
          <img
            src="https://www.groupl.ae/images/ser_pic4.jpg" // Replace with your actual image URL
            alt="Process"
            className="object-cover max-w-full max-h-full lg:max-h-[400px] lg:max-w-[900px] shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Process;
