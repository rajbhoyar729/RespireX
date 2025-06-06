"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as React from "react"
import useScrollAnimation from '../hooks/useScrollAnimation';

gsap.registerPlugin(ScrollTrigger);

interface AboutProps {
  isActive: boolean;
}

const About: React.FC<AboutProps> = ({ isActive }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  useScrollAnimation({
    sectionRef,
    animatedRefs: [titleRef, contentRef],
    start: "top center",
    end: "center center",
    stagger: 0.1,
  });

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

