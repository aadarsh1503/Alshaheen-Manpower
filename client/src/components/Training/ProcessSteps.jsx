import React from 'react';
import i1 from "./i1.png"

const ProcessSteps = () => {
  const steps = [
    { text: 'Demand for workers is raised', icon: 'https://www.groupl.ae/images/traning_ic1.png' },
    { text: 'Source potential candidates', icon: 'https://www.groupl.ae/images/traning_ic2.png' },
    { text: 'Pre-screening', icon: 'https://www.groupl.ae/images/traning_ic3.png' },
    { text: 'Interview by employer', icon: 'https://www.groupl.ae/images/traning_ic4.png' },
    { text: 'Training of selected staff', icon: 'https://www.groupl.ae/images/traning_ic5.png' },
    { text: 'Visas', icon: 'https://www.groupl.ae/images/traning_ic6.png' },
    { text: 'Final approval and deployment', icon: 'https://www.groupl.ae/images/traning_ic7.png' }
  ];

  return (
    <div className="bg-red-700 text-white h-[500px] py-10 relative">
      {/* Background overlay image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-100"
        style={{ backgroundImage: `url(${i1})` }}
      ></div>

      <div className="relative z-10 flex items-center justify-center lg:mt-32 space-x-3 px-6">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center max-w-[140px]">
              {/* Set uniform width and height to keep images aligned */}
              <img src={step.icon} alt={step.text} className="w-28 h-28 object-contain" />
              <p className="text-center font-bold mt-2 text-sm leading-tight">{step.text}</p>
            </div>

            {/* Arrow between steps, except after the last one */}
            {index < steps.length - 1 && (
              <div className="text-white text-2xl">&#8594;</div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProcessSteps;
