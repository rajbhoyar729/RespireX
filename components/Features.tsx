"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Activity, Thermometer, Brain, AlertCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: 'AI-Powered Analysis',
    description: 'Advanced algorithms analyze respiratory sounds for accurate disease detection.',
    icon: Activity,
  },
  {
    title: 'Real-time Monitoring',
    description: 'Continuous assessment of respiratory health with instant feedback.',
    icon: Thermometer,
  },
  {
    title: 'Personalized Insights',
    description: 'Tailored health recommendations based on individual data.',
    icon: Brain,
  },
  {
    title: 'Early Warning System',
    description: 'Proactive alerts for potential respiratory issues.',
    icon: AlertCircle,
  },
];

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon: Icon, index }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;

    gsap.from(card, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top bottom-=100",
        toggleActions: "play none none reverse",
      },
    });
  }, [index]);

  return (
    <div ref={cardRef} className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg text-center transition duration-300 hover:shadow-xl transform hover:scale-105">
      <div className="flex justify-center items-center w-16 h-16 mb-4 rounded-full bg-blue-100 mx-auto">
        <Icon className="w-8 h-8 text-blue-500" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-200">{description}</p>
    </div>
  );
};

import React from 'react';

interface FeaturesProps {
  isActive: boolean;
}

const Features: React.FC<FeaturesProps> = ({ isActive }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;

    gsap.set(title, { autoAlpha: 0, y: 50 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top center",
        end: "center center",
        toggleActions: "play none none reverse",
      },
    });

    tl.to(title, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" });

    return () => {
      tl.kill();
    };
  }, [isActive]);

  return (
    <section ref={sectionRef} id="features" className={`py-20 ${isActive ? 'active' : ''}`}>
      <div className="container mx-auto px-4">
        <h2 ref={titleRef} className="text-4xl font-bold text-center mb-12 text-white">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

