import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LandingProvider } from '@/contexts/LandingContext'
import { Toaster } from '@/components/ui/toaster'
import Background3D from '../components/Background3D';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Providers from './Providers';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RespireX - AI-Powered Respiratory Health Platform',
  description: 'Advanced respiratory health monitoring and analysis platform using AI technology.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} text-white bg-black min-h-screen`}>
        <LandingProvider>
          <Providers>
            <Background3D />
            <div className="relative z-10">
              <Navbar activeSection="home" />
              <div className='m-10 p-3'>
                {children}
              </div>
              <Footer />
            </div>
          </Providers>
          <Toaster />
        </LandingProvider>
      </body>
    </html>
  )
}