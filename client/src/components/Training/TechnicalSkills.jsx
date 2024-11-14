import React from 'react';

const TechnicalSkills = () => {
  return (
    <div className="flex flex-col md:flex-row bg-gray-100 p-8">
      {/* Left Side - Image */}
      <div className="md:w-1/2 flex justify-center items-center">
        <img
          src="https://www.groupl.ae/images/ser_pic11.jpg" // replace with your image path
          alt="Soft Skills Training"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Content */}
      <div className="md:w-1/2 p-8 text-gray-700">
        <h2 className="text-3xl font-bold text-red-600 mb-4">SOFT SKILLS TRAINING</h2>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-red-600">ENGLISH BASICS COMMUNICATION</h3>
          <ul className="text-gray-600 list-disc pl-4 space-y-1">
            <li>Social Skills</li>
            <li>Customer Care</li>
            <li>Complaint Handling</li>
            <li>Telephone Etiquette</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-red-600">PERSONAL GROOMING</h3>
          <p className="text-gray-600">
            Every employer has rules and policies about employee hygiene and grooming, and because you may interact with customers, you must present a clean, positive, and professional image. At GroupL, these finer nuances of Personal Grooming are taken care of.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TechnicalSkills;
