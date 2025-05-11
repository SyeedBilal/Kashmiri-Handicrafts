import React from 'react';
import womanImage from  "../../assets/images/Banner2.png";


const Hero = () => {
  return (
    <>
    
    
    <div className="hero-section relative w-full h-[90vh] md:h-[70vh] overflow-hidden">
      <img loading='lazy'
        src={womanImage} 
        alt="Kashmiri Carpet" 
        className="w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <div className="text-center text-white px-4 w-full max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[70%]">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-4">Authentic Kashmiri Handicrafts</h1>
          <p className="text-base sm:text-lg md:text-xl">Discover Centuries-Old Craftsmanship</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Hero;