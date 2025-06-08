"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanding } from '@/contexts/LandingContext';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const { activeSection, registerSection } = useLanding();

  useEffect(() => {
    if (sectionRef.current) {
      registerSection('about', sectionRef);
    }
  }, [registerSection]);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const content = contentRef.current;

    if (!section || !title || !content) return;

    // Set initial states
    gsap.set([title, content], {
      autoAlpha: 0,
      y: 50
    });

    // Create timeline for animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'bottom 20%',
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
    .to(content, {
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
      gsap.set([title, content], {
        autoAlpha: 1,
        y: 0
      });
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="about" 
      className={`py-20 ${activeSection === 'about' ? 'active' : ''}`}
      data-scroll
      data-scroll-speed="0.5"
      data-scroll-delay="0.1"
    >
      <div className="container mx-auto px-4">
        <h2 
          ref={titleRef} 
          className="text-4xl font-bold text-center mb-8 text-white"
          style={{
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            WebkitTextStroke: '1px rgba(255,255,255,0.1)'
          }}
        >
          About RespireX
        </h2>
        <p 
          ref={contentRef} 
          className="text-lg text-gray-200 max-w-3xl mx-auto text-center"
        >
          At RespireX, we're pioneering the future of respiratory health. Our AI-powered platform analyzes respiratory sounds to detect early signs of diseases like asthma, COPD, and pneumonia. By combining cutting-edge technology with medical expertise, we're making early diagnosis more accessible and accurate than ever before.
        </p>
      </div>
    </section>
  );
};

export default About;

