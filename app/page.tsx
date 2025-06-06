'use client'

import { useRef, useState, useEffect, RefObject } from 'react'
import { LocomotiveScrollProvider } from 'react-locomotive-scroll'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import About from '../components/About'
import Features from '../components/Features'
import Solution from '../components/Solution'
import Footer from '../components/Footer'
import { auth } from "@/auth"

interface NavbarProps {
  activeSection: string
}

export default function Home() {
  const containerRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState('home');
  const [watchedElements, setWatchedElements] = useState<HTMLElement[]>([]);
  const [isScrollReady, setIsScrollReady] = useState(false);

  // Initialize ScrollTrigger and set up scroll container
  useEffect(() => {
    if (!containerRef.current) return;

    // Set Locomotive Scroll as the scroller for ScrollTrigger
    ScrollTrigger.defaults({ 
      scroller: containerRef.current,
      markers: false,
      anticipatePin: 1,
      fastScrollEnd: true,
      preventOverlaps: true,
    });

    // Set the watched elements
    const elements = [
      document.getElementById('home'),
      document.getElementById('about'),
      document.getElementById('features'),
      document.getElementById('solution'),
    ].filter(Boolean) as HTMLElement[];

    setWatchedElements(elements);

    // Initial refresh after Locomotive Scroll is ready
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
      setIsScrollReady(true);
    }, 500);

    // Cleanup function
    return () => {
      clearTimeout(refreshTimer);
      ScrollTrigger.defaults({ scroller: null });
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      setIsScrollReady(false);
    };
  }, []);

  // Enhanced IntersectionObserver for better section tracking
  useEffect(() => {
    if (!watchedElements.length || !isScrollReady) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let activeId = activeSection;

        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            activeId = entry.target.id;
          }
        });

        if (activeId && activeId !== activeSection) {
          setActiveSection(activeId);
        }
      },
      { 
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '-20% 0px -20% 0px'
      }
    );
    
    watchedElements.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, [watchedElements, isScrollReady, activeSection]);

  return (
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
          if (isScrollReady) {
            ScrollTrigger.update();
            requestAnimationFrame(() => {
              ScrollTrigger.update();
            });
          }
        },
        onReady: () => {
          setTimeout(() => {
            ScrollTrigger.refresh();
            setIsScrollReady(true);
          }, 100);
        },
        onDestroy: () => {
          ScrollTrigger.getAll().forEach(trigger => trigger.kill());
          setIsScrollReady(false);
        }
      }}
      containerRef={containerRef as RefObject<HTMLElement>}
      watch={watchedElements}
    >
      <div className="flex flex-col min-h-screen">
        <Navbar activeSection={activeSection} />
        <main 
          data-scroll-container 
          ref={containerRef} 
          className="flex-grow"
          data-scroll
          data-scroll-speed="0.5"
          data-scroll-direction="vertical"
          data-scroll-delay="0.1"
        >
          <div className="relative">
            <HeroSection isActive={activeSection === 'home'} />
            <About isActive={activeSection === 'about'} />
            <Features isActive={activeSection === 'features'} />
            <Solution isActive={activeSection === 'solution'} />
          </div>
        </main>
      </div>
    </LocomotiveScrollProvider>
  );
}