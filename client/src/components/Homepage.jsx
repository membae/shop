import React from 'react'
import WhyChooseUs from './Homepage/WhyChooseUs'
import NewArrivals from './Homepage/NewArrivals'
import BestSellers from './Homepage/BestSeller'
import HeroSection from './Homepage/HeroSection'

const Homepage = () => {
  return (
    <div className='-mt-16'>
     <HeroSection />
      <BestSellers />
      <NewArrivals />
      <WhyChooseUs />
    </div>
  )
}

export default Homepage
