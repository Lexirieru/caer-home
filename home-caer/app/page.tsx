"use client";

import React from "react";
import LiquidChrome from "./components/LiquidChrome";
import PillNav from "./components/PillNav";
import { MorphingText } from "@/components/magicui/morphing-text";


export default function Home() {
  // Mencegah text selection di seluruh halaman
  React.useEffect(() => {
    const preventSelection = (e: Event) => {
      e.preventDefault();
    };
    
    document.addEventListener('selectstart', preventSelection);
    document.addEventListener('dragstart', preventSelection);
    
    return () => {
      document.removeEventListener('selectstart', preventSelection);
      document.removeEventListener('dragstart', preventSelection);
    };
  }, []);

  return (
    <div className="relative min-h-screen no-select">
      {/* Background dengan LiquidChrome */}
      <div style={{ width: '100%', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
        <LiquidChrome
          baseColor={[0.1, 0.1, 0.1]}
          speed={0.3}
          amplitude={0.3}
          interactive={true}
        />
      </div>

      {/* PillNav */}
      <PillNav
        logo="/caerlogo.png"
        logoAlt="Caer Logo"
        items={[
          { label: 'Docs', href: '/docs' },
          { label: 'Waitlist', href: '/waitlist' }
        ]}
        activeHref="/"
        className="custom-nav"
        ease="power2.easeOut"
        baseColor="rgba(255, 255, 255, 0.1)"
        pillColor="rgba(255, 255, 255, 0.2)"
        hoveredPillTextColor="#ffffff"
        pillTextColor="#ffffff"
      />
      
      {/* Konten utama */}
      <div className="relative z-20 font-sans flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col items-center justify-center text-white no-select gap-8">
          <MorphingText 
            texts={["Stay Caer", "Stay Liquid"]}
            className="text-white font-playfair text-4xl sm:text-6xl"
          />
          <h2 className="text-white font-neue-montreal text-xl sm:text-2xl text-center font-light tracking-wide">
            Borrow Anychain, Lend Everychain
          </h2>
        </main>
      </div>
    </div>
  );
}
