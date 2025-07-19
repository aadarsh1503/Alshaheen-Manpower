import React from 'react';

const Methodology = () => {
  const steps = [
    { number: "01", title: "IDENTIFY", description: "Robust network to identify the most suitable candidates across numerous countries simultaneously." },
    { number: "02", title: "RECRUIT", description: "Screen, assess and recruit against specific skill standards and competencies." },
    { number: "03", title: "TEST", description: "Comprehensive testing to assess skills, competencies, and English language proficiency. 100% online test records." },
    { number: "04", title: "TRAIN", description: "Dedicated training facilities for skill-based and technical training, creating a job-ready workforce." },
    { number: "05", title: "DEPLOY", description: "Development of job-ready resources to the Client within the prescribed deployment timeline." },
    { number: "06", title: "MAINTAIN", description: "Post-deployment welfare support to ensure a high-performance and engaged workforce." },
  ];

  return (
    <div className="font-raleway py-20 md:py-28 px-4 bg-gray-50 text-gray-900 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* --- Section Header --- */}
        <div className="text-left mb-16">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-lightblue mb-3">
            OUR METHODOLOGY
          </h2>
          <div className="w-32 h-2 bg-lightblue rounded-full"></div>
        </div>

        {/* --- Timeline Container --- */}
        <div className="relative">
          {/* The central timeline spine */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-lightblue/30"></div>

          {/* Mapping over the steps */}
          <div className="space-y-12 md:space-y-0">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative flex items-center"
                // This part alternates the layout for desktop
                style={{ flexDirection: index % 2 === 0 ? 'row' : 'row-reverse' }}
              >
                {/* --- The Content Card --- */}
                <div className="w-full md:w-5/12 p-6">
                  <div className="relative bg-white/60 backdrop-blur-sm p-6 rounded-lg shadow-lg hover:shadow-2xl hover:shadow-lightblue/20 hover:scale-[1.02] transition-all duration-300 ease-in-out border border-gray-200/50">
                    
                    {/* Giant number in the background */}
                    <span className="absolute -top-4 -left-1 text-8xl font-black text-lightblue/10 select-none z-0">
                      {step.number}
                    </span>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <h3 className="text-xl lg:text-2xl font-semibold text-lightblue mb-2">
                        {step.title}
                      </h3>
                      <p className="text-base lg:text-lg md:text-base text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* --- The Timeline Node and Connector --- */}
                <div className="hidden md:flex items-center justify-center w-2/12">
                  <div className="w-4 h-4 bg-lightblue rounded-full z-10 shadow-[0_0_0_4px_rgba(173,216,230,0.4)]"></div>
                </div>
                
                {/* --- Spacer for the other side on desktop --- */}
                <div className="hidden md:block w-5/12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Methodology;