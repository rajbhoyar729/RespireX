import React from 'react';
import Navbar from './components/navbar';
import HeroSection from './components/herosection';
import About from './components/about';

// Placeholder components for Services and Contact
const Services = () => (
  <section id="services" className="min-h-screen flex items-center justify-center bg-blue-200 bg-opacity-90">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white mb-4">Our Services</h2>
      <p className="text-lg text-gray-300">Comprehensive respiratory disease detection and analysis.</p>
    </div>
  </section>
);

const Contact = () => (
  <section id="contact" className="min-h-screen flex items-center justify-center bg-blue-200 bg-opacity-90">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white mb-4">Contact Us</h2>
      <p className="text-lg text-gray-300">Get in touch for more information about RespireX.</p>
    </div>
  </section>
);

export default function Home() {
  return (
    <div className="bg-blue-200 min-h-screen">
      <Navbar />
      <main className="snap-y snap-mandatory h-screen overflow-y-scroll">
        <div className="snap-start">
          <HeroSection />
        </div>
        <div className="snap-start">
          <About />
        </div>
        <div className="snap-start">
          <Services />
        </div>
        <div className="snap-start">
          <Contact />
        </div>
      </main>
    </div>
  );
}