"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import useScrollAnimation from '../hooks/useScrollAnimation';
import * as React from "react"

interface HeroSectionProps {
  isActive: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isActive }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useScrollAnimation({
    sectionRef,
    animatedRefs: [headingRef, subheadingRef, ctaRef],
    start: "top center",
    end: "bottom center",
    stagger: 0.2,
  });

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

