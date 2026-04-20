import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import {Inter} from 'next/font/google'

const inter = Inter({subsets:['latin']})
export const metadata: Metadata = {
  title: 'Holy Smokes Engraving',
  description:
    'Custom laser engraving, handcrafted pieces, and faith inspired artwork',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="inter min-h-screen flex flex-col bg-surface-950 text-surface-50">
        <Navbar />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-accent-500 text-white px-4 py-2 rounded z-50"
        >
          Skip to main content
        </a>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
