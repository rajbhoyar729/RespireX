'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

interface LandingContextType {
  activeSection: string;
  isScrolling: boolean;
  scrollProgress: number;
  setActiveSection: (section: string) => void;
  setIsScrolling: (isScrolling: boolean) => void;
  setScrollProgress: (progress: number) => void;
  sectionRefs: {
    [key: string]: React.RefObject<HTMLElement>;
  };
  registerSection: (id: string, ref: React.RefObject<HTMLElement>) => void;
}

const LandingContext = createContext<LandingContextType | undefined>(undefined);

export function LandingProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sectionRefs, setSectionRefs] = useState<{ [key: string]: React.RefObject<HTMLElement> }>({});

  const registerSection = useCallback((id: string, ref: React.RefObject<HTMLElement>) => {
    setSectionRefs(prev => ({
      ...prev,
      [id]: ref
    }));
  }, []);

  // Handle scroll events
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);

      // Calculate scroll progress
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const progress = (scrollPosition / (documentHeight - windowHeight)) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Handle section visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            setActiveSection(sectionId);
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '-20% 0px -20% 0px'
      }
    );

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [sectionRefs]);

  const value = {
    activeSection,
    isScrolling,
    scrollProgress,
    setActiveSection,
    setIsScrolling,
    setScrollProgress,
    sectionRefs,
    registerSection
  };

  return (
    <LandingContext.Provider value={value}>
      {children}
    </LandingContext.Provider>
  );
}

export function useLanding() {
  const context = useContext(LandingContext);
  if (context === undefined) {
    throw new Error('useLanding must be used within a LandingProvider');
  }
  return context;
} 