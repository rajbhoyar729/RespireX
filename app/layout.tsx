'use client'

import { Poppins } from 'next/font/google'
import './globals.css'
import Background3D from '../components/Background3D'

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className} text-white bg-black min-h-screen`}>
        <Background3D /> 
        <div className="relative z-10">
          {children}
        </div>
        
      </body>
    </html>
  )
}

