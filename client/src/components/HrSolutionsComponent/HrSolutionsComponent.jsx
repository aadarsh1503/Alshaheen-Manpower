import React from 'react';

// --- Data Abstraction ---
// By moving the data out of the JSX, the component becomes much cleaner
// and easier to update. Adding or removing a solution is now a one-line change.
const solutionsData = [
  { href: '/aviation', imgSrc: 'https://www.groupl.ae/images/srvc_3.png', label: 'AVIATION' },
  { href: '/construction', imgSrc: 'https://www.groupl.ae/images/srvc_4.png', label: 'CONSTRUCTION' },
  { href: '/events', imgSrc: 'https://www.groupl.ae/images/srvc_9.png', label: 'EVENTS' },
  { href: '/healthcare', imgSrc: 'https://www.groupl.ae/images/srvc_11.png', label: 'HEALTHCARE' },
  { href: '/hospitality', imgSrc: 'https://www.groupl.ae/images/srvc_6.png', label: 'HOSPITALITY' },
  { href: '/logistics', imgSrc: 'https://www.groupl.ae/images/srvc_8.png', label: 'LOGISTICS' },
  { href: '/manufacturing', imgSrc: 'https://www.groupl.ae/images/srvc_5.png', label: 'MANUFACTURING' },
  { href: '/retail', imgSrc: 'https://www.groupl.ae/images/srvc_2.png', label: 'RETAIL' },
  { href: '/security', imgSrc: 'https://www.groupl.ae/images/srvc_1.png', label: 'SECURITY' },
];

const SolutionItem = ({ href, imgSrc, label }) => (
  <a href={href} className="flex flex-col items-center group">
    <div className="rounded-full p-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
        <img src={imgSrc} alt={label} className="w-14 h-14 lg:w-16 lg:h-16" />
    </div>
    {/* Corrected non-standard font size and added margin-top for spacing */}
    <p className="text-white text-sm font-semibold text-center mt-3 tracking-wide">
      {label}
    </p>
  </a>
);

const HrSolutionsComponent = () => {
  return (
    // The main flex container remains the same, as it's a good structure.
    <div className="flex flex-col lg:flex-row w-full bg-white font-raleway">
      
      {/* Left Side: Solutions Grid */}
      {/* 
        IMPROVEMENTS:
        - Used flexbox (`flex items-center justify-center`) to perfectly center the grid. This solves the "negative space" problem.
        - Removed inconsistent and hardcoded margins like `lg:ml-32`.
        - Simplified padding for a cleaner look.
        - The grid now has a consistent, responsive gap.
      */}
      <div className="w-full lg:w-1/2 bg-lightgreen flex items-center justify-center p-8 lg:p-12 min-h-[450px]">
        <div className="grid grid-cols-3 gap-x-4 gap-y-8 sm:gap-10">
          {solutionsData.map((solution) => (
            <SolutionItem key={solution.href} {...solution} />
          ))}
        </div>
      </div>

      {/* Right Side: Content */}
      {/* 
        IMPROVEMENTS:
        - Removed all `<br />` tags. Text now flows naturally and responsively.
        - Used `max-w-xl` on the text container to ensure readable line lengths on all screen sizes, which is a core principle of good typography and layout.
        - Standardized padding and margins for better visual hierarchy and balance.
        - The button now uses padding instead of fixed-width, making it flexible.
      */}
      <div className="w-full lg:w-1/2 bg-lgray flex items-center justify-center p-8 lg:p-16">
        <div className="max-w-xl">
          <h1 className="text-lightblue text-2xl lg:text-3xl font-sans font-bold mb-5 leading-tight">
            THE UAE'S LEADING PROVIDER OF UNIQUE AND INNOVATIVE HR SOLUTIONS
          </h1>
          <div className="h-1 w-20 bg-lightgreen mb-6"></div>
          <p className="text-gray-600 text-base lg:text-lg mb-8">
            We work with a broad range of industries such as Financial Services, Aviation, Logistics, Retail, IT, Oil & Gas, Call Centers, Construction, and can support organizations of any size—start-up or large.
          </p>
          <a
            href="/about"
            className="inline-block bg-lightgreen text-white px-8 py-3 font-semibold uppercase tracking-wider hover:bg-DarkRed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lightgreen"
          >
            Know More
          </a>
        </div>
      </div>
    </div>
  );
};

export default HrSolutionsComponent;