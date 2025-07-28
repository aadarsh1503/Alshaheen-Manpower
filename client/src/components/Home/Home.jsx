// src/components/Home.js

import React, { useRef } from 'react'; // 1. Import useRef
import Hero from '../Hero/Hero';
import HrSolutionsComponent from '../HrSolutionsComponent/HrSolutionsComponent';
import NewsEventsCarousel from '../NewsEventsCarousel/NewsEventsCarousel';
import VacanciesCarousel from '../VacanciesCarousel/VacanciesCarousel';
import BrochureSection from '../BrochureSection/BrochureSection';
import OurCustomer from '../OurCustomer/OurCustomer';

const Home = () => {
  // 2. Create a ref for the vacancies section
  const vacanciesRef = useRef(null);

  // 3. Create a function to handle the scroll
  const handleScrollToVacancies = () => {
    vacanciesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* 4. Pass the scroll handler function as a prop to Hero */}
      <Hero onFindJobClick={handleScrollToVacancies} />

      <HrSolutionsComponent />
      <NewsEventsCarousel />

      {/* 5. Attach the ref to a div wrapping the target component */}
      <div ref={vacanciesRef}>
        <VacanciesCarousel />
      </div>
      
      <OurCustomer />
      <BrochureSection />
    </div>
  );
};

export default Home;