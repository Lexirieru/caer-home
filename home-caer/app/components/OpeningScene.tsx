"use client";

import React, { useState, useEffect } from 'react';
import TextType from './TextType';

interface OpeningSceneProps {
  onComplete: () => void;
}

const OpeningScene: React.FC<OpeningSceneProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTextType, setShowTextType] = useState(false);
  const [completedScenes, setCompletedScenes] = useState<number[]>([]);

  const scenes = [
    "Isolated Liquidity, Borrowable from Any Chain."
  ];

  useEffect(() => {
    console.log('OpeningScene mounted, starting animation in 500ms');
    const timer = setTimeout(() => {
      console.log('Starting opening scene animation');
      setIsVisible(true);
      setShowTextType(true);
    }, 500);

    // Fallback: Setelah 3 detik, transisi ke web utama
    const completeTimer = setTimeout(() => {
      console.log('3 seconds completed, transitioning to main page');
      setIsVisible(false);
      setTimeout(() => {
        onComplete();
      }, 500);
    }, 3500); // 500ms delay + 3 detik

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const handleSentenceComplete = (sentence: string, index: number) => {
    console.log('Scene completed:', index, sentence);
    setCompletedScenes(prev => [...prev, index]);
    
    // Langsung transisi tanpa delay
    console.log('Scene completed, transitioning to main page');
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div 
        className={`text-white text-center opening-scene-enter ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {showTextType && (
          <div className="text-4xl sm:text-6xl font-bold font-neue-montreal mb-4 leading-tight">
            <TextType
              text={scenes}
              typingSpeed={30}
              pauseDuration={500}
              showCursor={true}
              cursorCharacter="|"
              loop={false}
              onSentenceComplete={handleSentenceComplete}
              initialDelay={100}
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default OpeningScene;
