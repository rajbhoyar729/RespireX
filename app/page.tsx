'use client'

import { useRef, useEffect } from 'react'
import LocomotiveScroll from 'locomotive-scroll'
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

    let scroll: any;

    if (containerRef.current) {
      scroll = new LocomotiveScroll({
        el: containerRef.current,
        smooth: true,
        lerp: 0.1,
        multiplier: 1,
      });

      scroll.on('scroll', ScrollTrigger.update);

      ScrollTrigger.scrollerProxy(containerRef.current, {
        scrollTop(value) {
          return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
          return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        pinType: containerRef.current?.style.transform ? "transform" : "fixed"
      });

      // Refresh ScrollTrigger when Locomotive Scroll is ready
      ScrollTrigger.addEventListener('refresh', () => scroll.update());
      ScrollTrigger.refresh();
    }

    return () => {
      if (scroll) {
        scroll.destroy();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      ScrollTrigger.removeEventListener('refresh', () => scroll.update());
      ScrollTrigger.scrollerProxy(containerRef.current, undefined); // Clear the scroller proxy with undefined
    };
  }, []);

  return (
    <LandingProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar activeSection="home" />
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
      </div>
    </LandingProvider>
  );
}