import React from 'react';
import i1 from "./i1.png";
import i2 from "./i2.png";
import i3 from "./i3.png";
import i4 from "./i4.png";
import i5 from "./i5.png";
import i6 from "./i6.png";
import i7 from "./i7.png";
import i8 from "./i8.png";
import i9 from "./i9.png";

// --- Data Abstraction ---
const solutionsData = [
  { href: '/aviation', imgSrc: i1, label: 'AVIATION' },
  { href: '/construction', imgSrc: i2, label: 'CONSTRUCTION' },
  { href: '/events', imgSrc: i3, label: 'EVENTS' },
  { href: '/healthcare', imgSrc: i4, label: 'HEALTHCARE' },
  { href: '/hospitality', imgSrc: i5, label: 'HOSPITALITY' },
  { href: '/logistics', imgSrc: i6, label: 'LOGISTICS' },
  { href: '/manufacturing', imgSrc: i7, label: 'MANUFACTURING' },
  { href: '/retail', imgSrc: i8, label: 'RETAIL' },
  { href: '/security', imgSrc: i9, label: 'SECURITY' },
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