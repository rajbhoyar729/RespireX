'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Background3D() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

    const updateSize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
    }

    updateSize()
    containerRef.current.appendChild(renderer.domElement)

    // Create snowfall particles
    const snowGeometry = new THREE.BufferGeometry()
    const snowCount = 5000
    const posArray = new Float32Array(snowCount * 3)
    const scaleArray = new Float32Array(snowCount)

    for(let i = 0; i < snowCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 2000
      posArray[i + 1] = (Math.random() - 0.5) * 2000
      posArray[i + 2] = (Math.random() - 0.5) * 2000
      scaleArray[i / 3] = Math.random()
    }

    snowGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
    snowGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1))

    const snowMaterial = new THREE.PointsMaterial({
      size: 2,
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    })

    const snow = new THREE.Points(snowGeometry, snowMaterial)
    scene.add(snow)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0x3b82f6, 2)
    pointLight.position.set(20, 20, 20)
    scene.add(pointLight)

    camera.position.z = 50

    let mouseX = 0
    let mouseY = 0

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - window.innerWidth / 2) / 100
      mouseY = (event.clientY - window.innerHeight / 2) / 100
    }

    const animate = () => {
      requestAnimationFrame(animate)

      // Animate snow particles
      const positions = snow.geometry.attributes.position.array as Float32Array
      const scales = snow.geometry.attributes.scale.array as Float32Array
      
      for(let i = 0; i < snowCount * 3; i += 3) {
        positions[i + 1] -= (0.1 + scales[i / 3] * 0.5)
        if(positions[i + 1] < -1000) {
          positions[i + 1] = 1000
        }
      }
      snow.geometry.attributes.position.needsUpdate = true

      // Rotate snow based on mouse
      snow.rotation.x += 0.0001
      snow.rotation.y += 0.0001

      // Camera movement
      camera.position.x += (mouseX - camera.position.x) * 0.05
      camera.position.y += (-mouseY - camera.position.y) * 0.05
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }

    animate()

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', updateSize)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', updateSize)
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none" 
      style={{ 
        zIndex: -1,
        opacity: 0.8
      }} 
    />
  )
}

