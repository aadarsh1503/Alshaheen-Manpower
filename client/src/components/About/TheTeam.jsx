import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Import your custom CSS file for animations
import './t.css'; 

// Import your images as before
import i1 from "./i1.png";
import i2 from "./i2.png";
import i3 from "./i3.png";
import i4 from "./i4.png";
import i5 from "./i5.jpeg";
import i6 from "./i6.png";

const TheTeam = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get('/api/team/public');
        setTeamMembers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching team members:', error);
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-gray-100 font-raleway py-20 md:py-28 px-4">
        <div className="max-w-7xl mx-auto flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lightblue"></div>
        </div>
      </div>
    );
  }

  if (teamMembers.length === 0) {
    return null;
  }

  const activeMember = teamMembers[activeIndex];

  return (
    <div className="w-full bg-gray-100 font-raleway py-20 md:py-28 px-4">
      <div className="max-w-7xl mx-auto">
        {/* --- Section Header --- */}
        <div className="text-left mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-lightblue mb-3">
            MEET THE TEAM
          </h2>
          <div className="w-32 h-2 bg-lightblue rounded-full"></div>
        </div>

        {/* --- Main Layout: Featured Profile + Selection List --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          
          {/* --- LEFT (or TOP on mobile): Featured Profile Card --- */}
          <div className="lg:col-span-2">
            <div className="sticky top-28 bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-2xl shadow-lightblue/20 border border-gray-200/50 transition-all duration-500 ease-in-out">
              <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-8">
                <div className="flex-shrink-0">
                  <img
                    key={activeMember.name} 
                    src={activeMember.image_url || '/placeholder-avatar.png'}
                    alt={activeMember.name}
                    className="w-40 h-40 lg:w-48 lg:h-48 rounded-full object-cover ring-4 ring-lightblue ring-offset-4 ring-offset-gray-100 animation-fade-in"
                  />
                </div>
                <div className="animation-fade-in-slow">
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-800">
                    {activeMember.name}
                  </h3>
                  <p className="text-lg text-lightgreen font-semibold mt-1">
                    {activeMember.role}
                  </p>
                  <p className="text-gray-600 mt-4 text-base lg:text-lg leading-relaxed hidden sm:block">
                    Leading our team with vision and dedication to drive innovation and excellence in every project we undertake.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT (or BOTTOM on mobile): Selection List --- */}
          <div className="lg:col-span-1">
            <div className="space-y-3">
              {teamMembers.map((member, index) => (
                <button
                  key={member.id}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  className={`w-full flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 ease-in-out border-2
                    ${activeIndex === index
                      ? 'bg-lightblue/10 border-lightblue shadow-md'
                      : 'bg-white/60 border-transparent hover:bg-white hover:border-lightblue/50'
                    }`
                  }
                >
                  <img 
                    src={member.image_url || '/placeholder-avatar.png'} 
                    alt={member.name} 
                    className="w-12 h-12 rounded-full object-cover mr-4" 
                  />
                  <div>
                    <p className="font-semibold text-gray-800 text-left">{member.name}</p>
                    <p className="text-sm text-gray-500 text-left">{member.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheTeam;