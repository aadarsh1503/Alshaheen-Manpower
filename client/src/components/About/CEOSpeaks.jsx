import React from 'react';

const CEOSpeaks = () => {
  return (
    <div className="bg-gray-100 p-8 md:px-20 lg:px-40">
      {/* Title */}
      <h2 className="text-3xl font-bold text-lightblue mb-2">CEO SPEAKS</h2>
      <div className="w-10 h-1 bg-lightblue mb-6"></div>

      {/* Content */}
      <p className="text-gray-700 mb-6">
        Nearly fifty years ago, GVS was founded with a dream. A dream to fulfill human potential.
        It is a dream that we work on every day. Today, GVS opens doors for international migrant workers
        and empowers them to earn a better livelihood. Recruiting across an array of industries including —
        Security, Facility Management, Construction, Food and Beverage, Retail, Hospitality, Aviation,
        Healthcare, and Oil and Gas, we have leveraged our vast experience servicing those sectors and
        created job-specific training courses to ensure that all workers deployed by GVS arrive job-ready.
      </p>
      <p className="text-gray-700 mb-6">
        Continually expanding our reach, we currently recruit from 32 countries across South Asia,
        South-East Asia, Africa, Middle East, Eastern Europe, and Russia. GVS is committed to expanding
        its presence to newer employer markets, giving job-seekers a wide range of opportunities. This is
        complemented by our efforts to scale up the existing training infrastructure to cover all job roles,
        across our entire network. We are also optimizing our newly digitized processes to scale the operational
        life cycle. As GVS enters the sixth decade of its life, the pursuit of our dream is stronger than
        ever, as is our commitment to bringing skills and opportunities together.
      </p>

      {/* CEO Name */}
      <p className="text-lightblue font-bold">RIYADH SHAHEEN</p>
    </div>
  );
};

export default CEOSpeaks;
