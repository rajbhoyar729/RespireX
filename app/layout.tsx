import { Poppins } from 'next/font/google';
import './globals.css';
import Background3D from '../components/Background3D';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Providers from './Providers'; // Import the Providers component

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${poppins.className} text-white bg-black min-h-screen`}>
        <Providers> {/* Wrap with Providers */}
          <Background3D />
          <div className="relative z-10">
            <Navbar activeSection="home" />
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}