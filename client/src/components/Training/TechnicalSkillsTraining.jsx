import React from 'react';

const TechnicalSkillsTraining = () => {
  return (
    <div className="max-w-7xl mx-auto p-10">
      <h2 className="text-3xl font-bold text-lightblue">TECHNICAL SKILLS TRAINING</h2>
      <div className="w-20 h-1 bg-lightblue my-2"></div>
      
      {/* Paragraph Section Below Heading */}
      <p className="text-gray-700 max-w-7xl mb-10">
      Our training programs are designed to accelerate the recruitment process, delivering job-ready candidates and improving the quality of the workforce. We prioritize our trainees, equipping them with essential skills that ensure they are prepared and capable of starting work right away upon placement."
      </p>
      
      {/* Grid Section for the Skills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        <div>
          <h3 className="text-DarkRed font-bold border-l-4 border-DarkRed pl-2">HOSPITALITY <br /><span className='text-black font-normal'>Waiter</span><br /><span className='text-black font-normal'>Housekeeper</span></h3>
        </div>

        <div>
          <h3 className="text-DarkRed font-bold border-l-4 border-DarkRed pl-2">SECURITY <br /> GUARD</h3>
        </div>

        <div>
          <h3 className="text-DarkRed font-bold border-l-4 border-DarkRed pl-2">LOGISTICS <br /><span className='text-black font-normal'>Warehouse Worker</span><br /><span className='text-black font-normal'>Aviation</span></h3>
        </div>

        <div>
          <h3 className="text-DarkRed font-bold border-l-4 border-DarkRed pl-2">MEP<br /><span className='text-black font-normal'>Electrical</span><br /><span className='text-black font-normal'>HVAC</span><br /><span className='text-black font-normal'>Plumbing</span></h3>
        </div>

        <div>
          <h3 className="text-DarkRed font-bold border-l-4 border-DarkRed pl-2">FACILITY MANAGEMENT<br /><span className='text-black font-normal'>Carpenter</span><br /><span className='text-black font-normal'>Cleaner</span><br /><span className='text-black font-normal'>Office Boy</span></h3>
        </div>

        <div>
          <h3 className="text-DarkRed font-bold border-l-4 border-DarkRed pl-2">CIVIL<br /><span className='text-black font-normal'>Mason</span><br /><span className='text-black font-normal'>Steel Fixer</span><br /><span className='text-black font-normal'>Shuttering Carpenter</span></h3>
        </div>
      </div>
    </div>
  );
};

export default TechnicalSkillsTraining;
