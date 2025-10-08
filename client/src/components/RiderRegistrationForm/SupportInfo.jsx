import React from 'react';

// Icons as separate components for clarity
const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D9232D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
);
const DocumentQuestionIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D9232D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>
);
const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);

const SupportInfoItem = ({ icon, title, value }) => (
    <div className="flex items-start gap-4">
        {icon}
        <div>
            <p className="text-sm text-gray-500 font-semibold tracking-wider">{title}</p>
            <p className="text-xl font-semibold text-[#D9232D] mt-1">{value}</p>
        </div>
    </div>
);


const SupportInfo = () => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-10">You can also find us</h2>
      <div className="space-y-10">
        <SupportInfoItem
          icon={<PhoneIcon />}
          title="INTERNATIONAL CALL CENTER"
          value="80114444"
        />
        <SupportInfoItem
          icon={<DocumentQuestionIcon />}
          title="LOST PROPERTY"
          value="+973 17138489"
        />
      </div>
      <div className="mt-12 pt-8 border-t border-gray-200">
        <button className="w-full border-2 border-gray-600 text-gray-800 font-bold py-3 px-6 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
          <LocationIcon />
          BIA LOCATION MAP
        </button>
      </div>
    </>
  );
};

export default SupportInfo;