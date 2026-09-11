"use client";

import React, { useState, useEffect, useId } from "react";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface MorphTextProps {
  /**
   * Array of words / phrases to cycle through.
   * @default ["CREATE", "DESIGN", "DEVELOP"]
   */
  words?: string[];
  /**
   * Duration (ms) each word is displayed before transitioning.
   * @default 3200
   */
  interval?: number;
  /**
   * Optional subtext rendered beneath the morphing word.
   */
  subtext?: string;
  /**
   * Font size passed as a CSS value (e.g. "clamp(3rem, 15vw, 10rem)").
   * Defaults to a fluid clamp that scales with the viewport.
   */
  fontSize?: string;
  /**
   * Font family. Defaults to `"Space Grotesk", sans-serif`.
   */
  fontFamily?: string;
  /** Extra CSS classes on the root wrapper. */
  className?: string;
  /** Extra CSS classes on the morphing text container. */
  textClassName?: string;
  /** Extra CSS classes on the subtext element. */
  subtextClassName?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function MorphText({
  words = ["CREATE", "DESIGN", "DEVELOP"],
  interval = 3200,
  subtext,
  fontSize = "clamp(2rem, 5vw, 3.6rem)",
  fontFamily = 'inherit',
  className,
  textClassName,
  subtextClassName,
}: MorphTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const uid = useId().replace(/:/g, "");
  const filterId = `morph-threshold-${uid}`;

  // Sequential word timer: displays one word fully, then transitions to the next
  useEffect(() => {
    if (!words || words.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [words, interval]);

  return (
    <div className={cn("morph-text-root relative flex flex-col items-center", className)}>
      {/* ── Threshold SVG filter (hidden) ─────────────────────────── */}
      <svg
        aria-hidden="true"
        focusable="false"
        style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
      >
        <defs>
          <filter id={filterId}>
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* ── Morphing word container (Sharp solid background) ── */}
      <div
        className={cn(
          "morph-text-container relative select-none inline-flex items-center justify-center",
          textClassName
        )}
        style={{
          fontSize,
          fontWeight: 900,
          fontFamily,
        }}
      >
        {/* Word Rotator: renders one clean word at a time with sequential exit -> enter */}
        <div
          className="morph-word-rotator relative flex items-center justify-center overflow-visible"
          style={{ 
            height: "1.25em", 
            minWidth: "16ch",
            filter: `url(#${filterId})`
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={`${words[currentIndex]}-${currentIndex}`}
              initial={{ 
                opacity: 0, 
                filter: "blur(18px)", 
                scale: 0.88,
                y: 4
              }}
              animate={{ 
                opacity: 1, 
                filter: "blur(0px)", 
                scale: 1,
                y: 0
              }}
              exit={{ 
                opacity: 0, 
                filter: "blur(18px)", 
                scale: 1.12,
                y: -4
              }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="morph-word absolute whitespace-nowrap font-black"
            >
              {words[currentIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Optional subtext ──────────────────────────────────────── */}
      {subtext && (
        <p
          className={cn(
            "morph-subtext mt-8 uppercase tracking-[0.2em] text-[#888]",
            subtextClassName
          )}
          style={{
            fontSize: "1.2rem",
            opacity: 0,
            fontFamily,
          }}
        >
          {subtext}
        </p>
      )}
    </div>
  );
}

export default MorphText;

