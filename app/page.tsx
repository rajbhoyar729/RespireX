'use client'

import { useEffect, useRef } from 'react'
import HeroSection from '@/components/HeroSection'
import Features from '@/components/Features'
import Solution from '@/components/Solution'
import About from '@/components/About'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
// import LocomotiveScroll from 'locomotive-scroll'
// import 'locomotive-scroll/dist/locomotive-scroll.css'
import Navbar from '../components/Navbar'
import { LandingProvider } from '@/contexts/LandingContext'

declare module 'locomotive-scroll' {
  interface LocomotiveScroll {
    scroll: {
      instance: {
        scroll: {
          y: number;
        };
      };
    };
  }
}

export default function Home() {
  // const scrollRef = useRef<HTMLDivElement>(null)
  // const locomotiveScrollRef = useRef<LocomotiveScroll | null>(null)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger)

    // Initialize Locomotive Scroll
    // if (scrollRef.current) {
    //   locomotiveScrollRef.current = new LocomotiveScroll({
    //     el: scrollRef.current,
    //     smooth: true,
    //     lerp: 0.1
    //   })

    //   // Update ScrollTrigger when locomotive scroll updates
    //   locomotiveScrollRef.current.on('scroll', ScrollTrigger.update)

    //   // Tell ScrollTrigger to use these proxy methods for the ".smooth-wrapper" element
    //   ScrollTrigger.scrollerProxy(scrollRef.current, {
    //     scrollTop(value) {
    //       if (value != null) {
    //         if (locomotiveScrollRef.current) {
    //           locomotiveScrollRef.current.scrollTo(value as number, { duration: 0, disableLerp: true })
    //         }
    //         return
    //       }
    //       return locomotiveScrollRef.current?.scroll.instance.scroll.y || 0
    //     },
    //     getBoundingClientRect() {
    //       return {
    //         top: 0,
    //         left: 0,
    //         width: window.innerWidth,
    //         height: window.innerHeight,
    //         right: window.innerWidth,
    //         bottom: window.innerHeight
    //       }
    //     },
    //     pinType: scrollRef.current.style.transform ? 'transform' : 'fixed'
    //   })

    //   // Each time the window updates, refresh ScrollTrigger and locomotive scroll
    //   ScrollTrigger.addEventListener('refresh', () => {
    //     if (locomotiveScrollRef.current) {
    //       locomotiveScrollRef.current.update()
    //     }
    //   })

    //   // After everything is set up, refresh ScrollTrigger
    //   ScrollTrigger.refresh()

    //   // Update ScrollTrigger on window resize
    //   window.addEventListener('resize', () => {
    //     if (locomotiveScrollRef.current) {
    //       locomotiveScrollRef.current.update()
    //       ScrollTrigger.refresh()
    //     }
    //   })
    // }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      // if (locomotiveScrollRef.current) {
      //   locomotiveScrollRef.current.destroy()
      //   locomotiveScrollRef.current = null
      // }
      // window.removeEventListener('resize', () => {
      //   if (locomotiveScrollRef.current) {
      //     locomotiveScrollRef.current.update()
      //     ScrollTrigger.refresh()
      //   }
      // })
    }
  }, [])

  return (
    <LandingProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar activeSection="home" />
        <main 
          // ref={scrollRef} 
          className="flex-grow"
          // data-scroll-container
        >
          <div className="relative">
            <HeroSection />
            <Features />
            <Solution />
            <About />
          </div>
        </main>
      </div>
    </LandingProvider>
  )
}