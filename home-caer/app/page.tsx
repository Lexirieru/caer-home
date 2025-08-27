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
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setErrorMessage('Please enter your email address');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setEmail('');
        // Close sheet after 2 seconds
        setTimeout(() => {
          setIsSheetOpen(false);
          setSubmitStatus('idle');
        }, 2000);
      } else {
        setErrorMessage(data.error || 'Something went wrong');
        setSubmitStatus('error');
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when sheet opens
  useEffect(() => {
    if (isSheetOpen) {
      setEmail('');
      setSubmitStatus('idle');
      setErrorMessage('');
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
                    {submitStatus === 'success' ? 'Welcome to Caer! 🚀' : 'Join Caer Waitlist'}
                  </SheetTitle>
                  <SheetDescription className="text-gray-200 font-neue-montreal">
                    {submitStatus === 'success' 
                      ? 'You\'ve been added to the waitlist! Check your email for confirmation.'
                      : 'Be the first to know when Caer launches. Get early access to unified liquidity across all chains.'
                    }
                  </SheetDescription>
                </SheetHeader>
                
                {submitStatus === 'success' ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎉</div>
                      <p className="text-white font-neue-montreal text-lg">
                        You're on the list!
                      </p>
                      <p className="text-gray-300 font-neue-montreal text-sm mt-2">
                        We'll notify you when Caer launches.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="grid flex-1 auto-rows-min gap-6 px-4 mt-8 sheet-content-animate-delay-1">
                    <div className="grid gap-3">
                      <Label htmlFor="email" className="text-white font-neue-montreal">
                        Email Address
                      </Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-300 font-neue-montreal focus:border-white/40 focus:ring-white/20"
                        disabled={isSubmitting}
                      />
                      {submitStatus === 'error' && (
                        <p className="text-red-400 text-sm font-neue-montreal">
                          {errorMessage}
                        </p>
                      )}
                    </div>
                  </form>
                )}
                
                <SheetFooter className="mt-8 sheet-content-animate-delay-2">
                  {submitStatus !== 'success' && (
                    <Button 
                      type="submit" 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 font-neue-montreal w-full shadow-lg disabled:opacity-50"
                    >
                      {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                    </Button>
                  )}
                  <SheetClose asChild>
                    <Button 
                      variant="outline" 
                      className="bg-white/5 backdrop-blur-md border border-white/20 text-white hover:bg-white/10 font-neue-montreal w-full shadow-lg"
                    >
                      {submitStatus === 'success' ? 'Close' : 'Cancel'}
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
