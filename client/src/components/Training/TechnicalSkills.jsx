import React from 'react';
import i13 from "./i13.jpg"

const TechnicalSkills = () => {
  return (
    <div className="flex flex-col font-raleway md:flex-row bg-gray-100 ">
      {/* Left Side - Image */}
      <div className="md:w-1/2 flex justify-center items-center">
        <img
          src={i13} // replace with your image path
          alt="Soft Skills Training"
          className="lg:w-full w-72 h-[600px] object-cover"
        />
      </div>

      {/* Right Side - Content */}
      <div className="md:w-1/2 p-8 text-gray-700">
      <div className="flex items-start pl-6 border-l-4 border-DarkRed mb-12">
  <div>
    <h2 className="text-3xl font-bold font-raleway text-lightblue mb-4">SOFT SKILLS TRAINING</h2>
    <div className="mb-1">
      <h3 className="text-xl font-semibold font-raleway text-DarkRed">ENGLISH BASICS COMMUNICATION</h3>
      <ul className="text-gray-600 space-y-1 font-raleway list-none">
        <li className="relative ">Social Skills</li>
        <li className="relative ">Customer Care</li>
        <li className="relative ">Complaint Handling</li>
        <li className="relative ">Telephone Etiquette</li>
      </ul>
    </div>
  </div>
</div>


        <div className="flex items-start pl-6 border-l-4 border-red-600">
  <div>
    <h3 className="text-xl font-semibold font-raleway text-red-600">PERSONAL GROOMING</h3>
    <p className="text-gray-600 text-lg font-raleway">
    Employers emphasize the importance of hygiene and grooming, particularly for employees who engage with customers. A clean, professional appearance is crucial to creating a positive impression. At AL SHAHEEN MANPOWER, we ensure that these key aspects of personal grooming are meticulously addressed, preparing our candidates to uphold the highest standards of professionalism
    </p>
  </div>
</div>

      </div>
    </div>
  );
};

export default TechnicalSkills;
