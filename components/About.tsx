"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React from 'react';

gsap.registerPlugin(ScrollTrigger);

interface AboutProps {
  isActive: boolean;
}

const About: React.FC<AboutProps> = ({ isActive }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const content = contentRef.current;

    gsap.set([title, content], { autoAlpha: 0, y: 50 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top center",
        end: "center center",
        toggleActions: "play none none reverse",
      },
    });

    tl.to(title, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" })
      .to(content, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4");

    return () => {
      tl.kill();
    };
  }, [isActive]);

  return (
    <section ref={sectionRef} id="about" className={`py-20 ${isActive ? 'active' : ''}`}>
      <div className="container mx-auto px-4">
        <h2 ref={titleRef} className="text-4xl font-bold text-center mb-8 text-white">About RespireX</h2>
        <p ref={contentRef} className="text-lg text-gray-200 max-w-3xl mx-auto text-center">
          At RespireX, we're pioneering the future of respiratory health. Our AI-powered platform analyzes respiratory sounds to detect early signs of diseases like asthma, COPD, and pneumonia. By combining cutting-edge technology with medical expertise, we're making early diagnosis more accessible and accurate than ever before.
        </p>
      </div>
    </section>
  );
};

export default About;

