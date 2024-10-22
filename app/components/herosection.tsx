import React from 'react';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-blue-200 bg-opacity-90 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0 animate-fadeInUp">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-yellow-400">
            Welcome to RespireX
          </h1>
          <p className="text-xl sm:text-2xl mb-8">
            Respiratory diseases recognition
          </p>
          <a
            href="#about"
            className="inline-block bg-yellow-400 text-gray-900 font-bold uppercase py-3 px-8 rounded-md hover:bg-white transition duration-300"
          >
            Explore More
          </a>
        </div>
        <div className="md:w-1/2 relative">
          <div className="w-full max-w-md mx-auto">
            <Image
              src="/img.png"
              alt="Lung Image"
              width={500}
              height={500}
              className="rounded-lg  drop-shadow-custom-yellow animate-float"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;