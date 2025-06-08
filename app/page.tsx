'use client'

import { useRef, useEffect } from 'react'
import { LocomotiveScrollProvider } from 'react-locomotive-scroll'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '../components/Navbar'
import HeroSection from '@/components/HeroSection'
import About from '@/components/About'
import Features from '@/components/Features'
import Solution from '@/components/Solution'
import { LandingProvider } from '@/contexts/LandingContext'

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure ScrollTrigger is properly initialized
    ScrollTrigger.config({
      ignoreMobileResize: true
    });
  }, []);

  return (
    <LandingProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <LocomotiveScrollProvider
          options={{
            smooth: true,
            lerp: 0.1,
            multiplier: 1,
            smartphone: {
              smooth: true,
              lerp: 0.1,
              multiplier: 1,
            },
            tablet: {
              smooth: true,
              lerp: 0.1,
              multiplier: 1,
            },
            onUpdate: (scroll: any) => {
              ScrollTrigger.update();
            },
            onReady: () => {
              setTimeout(() => {
                ScrollTrigger.refresh();
              }, 100);
            },
            onDestroy: () => {
              ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            }
          }}
          containerRef={containerRef}
        >
          <main 
            ref={containerRef} 
            className="flex-grow"
            data-scroll-container
          >
            <div className="relative">
              <HeroSection />
              <Solution />
              <Features />
              <About />
            </div>
          </main>
        </LocomotiveScrollProvider>
      </div>
    </LandingProvider>
  );
}