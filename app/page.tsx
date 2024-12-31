'use client'

import { useRef, useState, useEffect } from 'react'
import { LocomotiveScrollProvider } from 'react-locomotive-scroll'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import About from '../components/About'
import Features from '../components/Features'
import Solution from '../components/Solution'
import Footer from '../components/Footer'
import { auth } from "@/auth"


export default async function Home() {
  const session = await auth()
  const containerRef = useRef(null)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const sections = ['home', 'about', 'features', 'solution']

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <LocomotiveScrollProvider
      options={{
        smooth: true,
        lerp: 0.05,
        multiplier: 0.5,
      }}
      containerRef={containerRef}
      watch={[]}
    >
      <div className="flex flex-col min-h-screen">
        <Navbar activeSection={activeSection} />
        <main data-scroll-container ref={containerRef} className="flex-grow">
          <HeroSection isActive={activeSection === 'home'} />
          <About isActive={activeSection === 'about'} />
          <Features isActive={activeSection === 'features'} />
          <Solution isActive={activeSection === 'solution'} />
        </main>
        <div className="h-screen bg-transparent"></div>
      </div>
    </LocomotiveScrollProvider>
  )
}

