import React from 'react';

const Methodology = () => {
  const steps = [
    { number: "1", title: "IDENTIFY", description: "Robust network to identify the most suitable candidates across numerous countries simultaneously" },
    { number: "2", title: "TRAIN", description: "Dedicated training facilities for skill-based and technical training, creating a job-ready workforce" },
    { number: "3", title: "DEPLOY", description: "Development of job-ready resources to the Client within the prescribed deployment timeline" },
    { number: "4", title: "RECRUIT", description: "Screen, assess and recruit against specific skill standards and competencies" },
    { number: "5", title: "TEST", description: "Comprehensive testing to assess skills, competencies, and English language proficiency. 100% online test records" },
    { number: "6", title: "MAINTAIN", description: "Post-deployment welfare to ensure resources are engaged" },
  ];

  return (
    <div className="flex flex-col  items-center font-raleway py-16 px-4 md:px-8 bg-gray-50 text-gray-900">
      <h2 className="text-2xl md:text-3xl font-bold item-start text-left -ml-[700px]  text-lightblue mb-4">OUR METHODOLOGY</h2>
      <div className="h-2 w-10 lg:w-16 bg-lightblue -ml-[956px]  lg:mb-6"></div>
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1  md:grid-cols-3 gap-8">
          {steps.slice(0, 3).map((step) => (
            <div key={step.number} className="flex items-left text-left space-x-4">
              <span className="text-5xl md:text-6xl font-light text-gray-400">{step.number}</span>
              <div className="flex flex-col items-start">
                <h3 className="text-lg md:text-xl font-semibold text-lightblue">{step.title}</h3>
                <p className="text-sm md:text-base text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        <hr className="my-8 border-t font-raleway border-gray-300 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.slice(3).map((step) => (
            <div key={step.number} className="flex items-left text-left space-x-4">
              <span className="text-5xl md:text-6xl font-light text-gray-400">{step.number}</span>
              <div className="flex flex-col items-start">
                <h3 className="text-lg md:text-xl font-semibold text-lightblue">{step.title}</h3>
                <p className="text-sm md:text-base text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Methodology;
