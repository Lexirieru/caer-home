"use client";

import React from "react";
import Image from "next/image";
import LiquidChrome from "./components/LiquidChrome";
import { MorphingText } from "@/components/magicui/morphing-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";


export default function Home() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetAnimation, setSheetAnimation] = useState('');

  // Prevent text selection across the entire page
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

  // Control sheet animation
  useEffect(() => {
    if (isSheetOpen) {
      setSheetAnimation('sheet-popup-in');
    } else {
      setSheetAnimation('sheet-popup-out');
    }
  }, [isSheetOpen]);

  return (
    <div className="relative min-h-screen no-select bg-black">
      {/* Background with LiquidChrome */}
      <div style={{ width: '100%', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
        <LiquidChrome
          baseColor={[0.1, 0.1, 0.1]}
          speed={0.3}
          amplitude={0.3}
          interactive={true}
        />
      </div>


      
      {/* Caer Logo - Absolute Position */}
      <div className="absolute top-53 left-1/2 transform -translate-x-1/2 z-30">
        <Image 
          src="/caerwhitecut.png" 
          alt="Caer Logo" 
          width={75} 
          height={75} 
          priority
          className="opacity-90 hover:opacity-100 transition-opacity duration-300"
        />
      </div>

      {/* X Logo and Docs - Bottom Right Corner */}
      <div className="absolute bottom-8 right-8 z-30 flex items-center gap-6">
        <a 
          href="https://x.com/caerfinance" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block opacity-70 hover:opacity-100 transition-opacity duration-300"
        >
          <Image 
            src="/xlogo.png" 
            alt="X (Twitter) Logo" 
            width={40} 
            height={40} 
            className="hover:scale-110 transition-transform duration-300"
          />
        </a>
        <a 
          href="https://caer.gitbook.io/caer/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-white font-neue-montreal text-lg opacity-70 hover:opacity-100 transition-opacity duration-300 hover:scale-105 transition-transform duration-300"
        >
          Docs
        </a>
      </div>

      {/* Main content */}
      <div className="relative z-20 font-sans flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col items-center justify-center text-white no-select gap-8">
          <MorphingText 
            texts={["Stay Caer", "Stay Liquid"]}
            className="text-white font-playfair text-4xl sm:text-6xl"
          />
          <h2 className="text-white font-neue-montreal text-xl sm:text-2xl text-center font-light tracking-wide">
            Borrow Anychain, Lend Everychain
          </h2>
          
          {/* Waitlist Button */}
          <div className="mt-1">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen} modal={false}>
              <SheetTrigger asChild>
                <Button 
                  className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 font-neue-montreal px-8 py-3 text-lg rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Join Waitlist
                </Button>
              </SheetTrigger>
              <SheetContent className={`w-[400px] sm:w-[540px] bg-white/5 backdrop-blur-xl border border-white/20 shadow-2xl ${sheetAnimation}`}>
                <SheetHeader className="sheet-content-animate">
                  <SheetTitle className="text-white font-neue-montreal text-2xl">
                    Join Caer Waitlist
                  </SheetTitle>
                  <SheetDescription className="text-gray-200 font-neue-montreal">
                    Be the first to know when Caer launches. Get early access to unified liquidity across all chains.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid flex-1 auto-rows-min gap-6 px-4 mt-8 sheet-content-animate-delay-1">
                  <div className="grid gap-3">
                    <Label htmlFor="email" className="text-white font-neue-montreal">
                      Email Address
                    </Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email address"
                      className="bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-300 font-neue-montreal focus:border-white/40 focus:ring-white/20"
                    />
                  </div>
                </div>
                <SheetFooter className="mt-8 sheet-content-animate-delay-2">
                  <Button 
                    type="submit" 
                    className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 font-neue-montreal w-full shadow-lg"
                  >
                    Join Waitlist
                  </Button>
                  <SheetClose asChild>
                    <Button 
                      variant="outline" 
                      className="bg-white/5 backdrop-blur-md border border-white/20 text-white hover:bg-white/10 font-neue-montreal w-full shadow-lg"
                    >
                      Cancel
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </main>
      </div>
    </div>
  );
}
