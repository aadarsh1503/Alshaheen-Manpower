import React from 'react'
import Hero from '../Hero/Hero'
import HrSolutionsComponent from '../HrSolutionsComponent/HrSolutionsComponent'
import NewsEventsCarousel from '../NewsEventsCarousel/NewsEventsCarousel'
import VacanciesCarousel from '../VacanciesCarousel/VacanciesCarousel'
import BrochureSection from '../BrochureSection/BrochureSection'

const Home = () => {
  return (
    <div>
        <Hero />
        <HrSolutionsComponent />
        <NewsEventsCarousel />
        <VacanciesCarousel />
        <BrochureSection />

    </div>
  )
}

export default Home