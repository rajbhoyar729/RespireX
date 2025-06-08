"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanding } from '@/contexts/LandingContext';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { activeSection, registerSection } = useLanding();

  useEffect(() => {
    if (sectionRef.current) {
      registerSection('home', sectionRef);
    }
  }, [registerSection]);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const cta = ctaRef.current;

    if (!section || !title || !subtitle || !cta) return;

    // Set initial states
    gsap.set([title, subtitle, cta], {
      autoAlpha: 0,
      y: 50
    });

    // Create timeline for animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        scrub: 0.5,
        markers: false,
      }
    });

    // Add animations to timeline
    tl.to(title, {
      autoAlpha: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out'
    })
    .to(subtitle, {
      autoAlpha: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out'
    }, '-=0.5')
    .to(cta, {
      autoAlpha: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out'
    }, '-=0.5');

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === section) {
          trigger.kill();
        }
      });
      // Reset states
      gsap.set([title, subtitle, cta], {
        autoAlpha: 1,
        y: 0
      });
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="home" 
      className={`min-h-screen flex items-center justify-center relative ${activeSection === 'home' ? 'active' : ''}`}
      data-scroll
      data-scroll-speed="0.5"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30 z-0" />
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 
            ref={titleRef}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
            style={{
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              WebkitTextStroke: '1px rgba(255,255,255,0.2)'
            }}
          >
            Welcome to RespireX
          </h1>
          <p 
            ref={subtitleRef}
            className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed"
          >
            Revolutionizing respiratory health monitoring with advanced AI technology
          </p>
          <div 
            ref={ctaRef}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
          >
            <Link 
              href="/register" 
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get Started
            </Link>
            <Link 
              href="/about" 
              className="px-8 py-3 bg-white/10 backdrop-blur-md text-white rounded-lg font-semibold hover:bg-white/20 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

