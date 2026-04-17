import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";


export const metadata: Metadata = {
  title: "Holy Smokes Engraving",
  description: "Custom laser engraving, handcrafted pieces, and faith inspired artwork",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className='h-full antialiased'
    >

      <body className="min-h-screen flex flex-col bg-surface-950 text-surface-50">
        <Navbar/>
        <main className="flex-1">{children}</main>
        <Footer/>
        </body>

    </html>
  );
}
