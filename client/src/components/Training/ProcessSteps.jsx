import React from 'react';
import i1 from "./i1.png";

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
    <div className="relative lg:h-[500px] h-[1300px] py-10">
      {/* Background overlay image for large screens, black background for small screens */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-100 hidden sm:block"
        style={{ backgroundImage: `url(${i1})` }}
      ></div>
      <div className="absolute inset-0 bg-lightblue opacity-80 sm:hidden"></div>

      {/* Steps grid */}
      <div className="relative z-10 lg:ml-4  grid grid-cols-1 mt-32 sm:grid-cols-3 lg:grid-cols-7 gap-6 px-8">
  {steps.map((step, index) => (
    <div key={index} className="flex flex-col text-center">
      {/* Image with right arrow */}
      <div className="flex ">
        <img src={step.icon} alt={step.text} className="w-28 h-28 items-center lg:ml-0 ml-24 text-center justify-center object-contain" />
        {/* Right arrow, hidden on small screens and after the last item */}
        {index < steps.length - 1 && (
          <p className="text-white font-bold text-lg ml-2 mt-10 items-center  hidden sm:block">{`→`}</p>
        )}
      </div>
      {/* Text below the image */}
      <p className="text-white font-bold mt-2 px-8 -ml-4 lg:-ml-12 text-sm leading-tight">{step.text}</p>
    </div>
  ))}
</div>

    </div>
  );
};

export default ProcessSteps;
