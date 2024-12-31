"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';

interface HeroSectionProps {
  isActive: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isActive }) => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const subheadingRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const subheading = subheadingRef.current;
    const cta = ctaRef.current;

    gsap.set([heading, subheading, cta], { autoAlpha: 0, y: 50 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top center",
        end: "bottom center",
        toggleActions: "play none none reverse",
      },
    });

    tl.to(heading, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" })
      .to(subheading, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
      .to(cta, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4");

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="home" 
      className={`relative min-h-screen flex items-center justify-center text-white overflow-hidden ${isActive ? 'active' : ''}`}
    >
      
      <div className="text-center max-w-4xl px-4 relative z-10">
        <h1 ref={headingRef} className="text-5xl md:text-7xl font-bold mb-6">
          Breathe Easy, Live Healthy
        </h1>
        <p ref={subheadingRef} className="text-xl md:text-2xl mb-12">
          Revolutionizing respiratory health with AI-powered early detection and personalized care.
        </p>
        <div ref={ctaRef} className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/register" className="bg-yellow-400 text-gray-900 font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition duration-300 transform hover:scale-105">
            Get Started
          </Link>
          <button className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-blue-600 transition duration-300 transform hover:scale-105">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

