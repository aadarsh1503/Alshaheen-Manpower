import React from 'react';

// ✨ We are now importing ALL icons from a single, highly compatible library: Font Awesome ('fa')
import { 
  FaConciergeBell,
  FaShieldAlt,
  FaTruck,
  FaWrench,
  FaBuilding,
  FaHardHat
} from 'react-icons/fa';


const TechnicalSkillsTraining = () => {
  
  // The data structure is the same, but with new, compatible icons
  const skillsData = [
    {
      icon: <FaConciergeBell />, // Perfect icon for Hospitality
      category: "HOSPITALITY",
      skills: ["Waiter", "Housekeeper"]
    },
    {
      icon: <FaShieldAlt />, // Clear icon for Security
      category: "SECURITY",
      skills: ["Guard"]
    },
    {
      icon: <FaTruck />, // Standard icon for Logistics
      category: "LOGISTICS",
      skills: ["Warehouse Worker", "Aviation"]
    },
    {
      icon: <FaWrench />, // Great icon for MEP (Mechanical, Electrical, Plumbing)
      category: "MEP",
      skills: ["Electrical", "HVAC", "Plumbing"]
    },
    {
      icon: <FaBuilding />, // Clear icon for Facility Management
      category: "FACILITY MANAGEMENT",
      skills: ["Carpenter", "Cleaner", "Office Boy"]
    },
    {
      icon: <FaHardHat />, // Perfect icon for Civil / Construction
      category: "CIVIL",
      skills: ["Mason", "Steel Fixer", "Shuttering Carpenter"]
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 font-raleway">
      <div className="max-w-7xl mx-auto py-20 px-6 lg:px-8">
        
        <div className="max-w-3xl">
          <h2 className="text-3xl lg:text-5xl font-bold text-lightblue">
            TECHNICAL SKILLS TRAINING
          </h2>
          <div className="w-72 h-2 bg-lightblue my-4 rounded-full"></div>
          <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
            Our training programs are designed to accelerate the recruitment process, delivering job-ready candidates and improving the quality of the workforce.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {skillsData.map((item, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-transparent 
                         hover:shadow-2xl hover:border-lightblue hover:-translate-y-2 
                         transition-all duration-300 ease-in-out cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="text-DarkRed text-3xl">
                  {item.icon}
                </div>
                <h3 className="text-DarkRed font-bold text-lg">
                  {item.category}
                </h3>
              </div>
              
              <hr className="border-gray-200" />
              
              <ul className="mt-4 space-y-2 text-gray-700 text-base lg:text-lg">
                {item.skills.map((skill, skillIndex) => (
                  <li key={skillIndex}>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechnicalSkillsTraining;