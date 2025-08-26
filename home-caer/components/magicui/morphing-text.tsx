"use client";

import { useCallback, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

const morphTime = 1.5;
const cooldownTime = 1.0;

const useMorphingText = (texts: string[], isPaused: boolean = false) => {
  const textIndexRef = useRef(0);
  const morphRef = useRef(0);
  const cooldownRef = useRef(0);
  const timeRef = useRef(new Date());
  const isInitializedRef = useRef(false);
  const animationRef = useRef<number | null>(null);

  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);

  const setStyles = useCallback(
    (fraction: number) => {
      const [current1, current2] = [text1Ref.current, text2Ref.current];
      if (!current1 || !current2) return;

      current2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      current2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      const invertedFraction = 1 - fraction;
      current1.style.filter = `blur(${Math.min(
        8 / invertedFraction - 8,
        100,
      )}px)`;
      current1.style.opacity = `${Math.pow(invertedFraction, 0.4) * 100}%`;

      // Update text content during transition
      const currentText = texts[textIndexRef.current % texts.length];
      const nextText = texts[(textIndexRef.current + 1) % texts.length];
      
      current1.textContent = currentText;
      current2.textContent = nextText;

      // Adjust positioning based on text content - ensure consistency
      if (currentText === "Stay Caer") {
        current1.style.transform = "translateX(0.6em)";
      } else if (currentText === "Stay Liquid") {
        current1.style.transform = "translateX(0.15em)";
      }

      if (nextText === "Stay Caer") {
        current2.style.transform = "translateX(0.6em)";
      } else if (nextText === "Stay Liquid") {
        current2.style.transform = "translateX(0.15em)";
      }
    },
    [texts],
  );

  const doMorph = useCallback(() => {
    morphRef.current -= cooldownRef.current;
    cooldownRef.current = 0;

    let fraction = morphRef.current / morphTime;

    if (fraction > 1) {
      cooldownRef.current = cooldownTime;
      fraction = 1;
    }

    setStyles(fraction);

    if (fraction === 1) {
      textIndexRef.current++;
    }
  }, [setStyles]);

  const doCooldown = useCallback(() => {
    morphRef.current = 0;
    const [current1, current2] = [text1Ref.current, text2Ref.current];
    if (current1 && current2) {
      current2.style.filter = "none";
      current2.style.opacity = "100%";
      current1.style.filter = "none";
      current1.style.opacity = "0%";
    }
  }, []);

  useEffect(() => {
    // Initialize text content and positioning
    const [current1, current2] = [text1Ref.current, text2Ref.current];
    if (current1 && current2 && !isInitializedRef.current) {
      current1.textContent = texts[0];
      current2.textContent = texts[1];
      
      // Set initial positioning
      if (texts[0] === "Stay Caer") {
        current1.style.transform = "translateX(0.6em)";
      } else if (texts[0] === "Stay Liquid") {
        current1.style.transform = "translateX(0.15em)";
      }
      
      if (texts[1] === "Stay Caer") {
        current2.style.transform = "translateX(0.6em)";
      } else if (texts[1] === "Stay Liquid") {
        current2.style.transform = "translateX(0.15em)";
      }
      
      isInitializedRef.current = true;
    }

    let isActive = true;

    const animate = () => {
      if (!isActive || isPaused) return;
      
      animationRef.current = requestAnimationFrame(animate);

      const newTime = new Date();
      const dt = (newTime.getTime() - timeRef.current.getTime()) / 1000;
      timeRef.current = newTime;

      cooldownRef.current -= dt;

      if (cooldownRef.current <= 0) doMorph();
      else doCooldown();
    };

    // Start animation immediately but with better cleanup
    animate();

    return () => {
      isActive = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [doMorph, doCooldown, texts, isPaused]);

  return { text1Ref, text2Ref };
};

interface MorphingTextProps {
  className?: string;
  texts: string[];
  isPaused?: boolean;
}

interface TextsProps {
  texts: string[];
  isPaused?: boolean;
}

const Texts: React.FC<TextsProps> = ({ texts, isPaused = false }) => {
  const { text1Ref, text2Ref } = useMorphingText(texts, isPaused);
  
  // Calculate width based on longest text to prevent overflow
  const maxLength = Math.max(...texts.map(text => text.length));
  const containerWidth = `${maxLength * 0.5}em`;
  
  return (
    <div className="relative inline-block" style={{ minWidth: containerWidth }}>
      <span
        className="inline-block leading-none"
        ref={text1Ref}
      />
      <span
        className="absolute left-0 top-0 inline-block leading-none"
        ref={text2Ref}
      />
    </div>
  );
};

const SvgFilters: React.FC = () => (
  <svg
    id="filters"
    className="fixed h-0 w-0"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <filter id="threshold">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 255 -140"
        />
      </filter>
    </defs>
  </svg>
);

export const MorphingText: React.FC<MorphingTextProps> = ({
  texts,
  className,
  isPaused = false,
}) => (
  <div
    className={cn(
      "relative mx-auto font-sans text-[40pt] font-bold leading-none [filter:url(#threshold)_blur(0.6px)] lg:text-[6rem] flex justify-center max-w-screen-lg",
      className,
    )}
  >
    <Texts texts={texts} isPaused={isPaused} />
    <SvgFilters />
  </div>
);
