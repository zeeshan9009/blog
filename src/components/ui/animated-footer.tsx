"use client";

import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "../../lib/utils";

export interface AnimatedFooterProps {
  /** The large display words along the bottom edge. */
  headingLines?: string[];
  /** Left image URL, sampled into ASCII art. Same-origin or CORS-enabled. */
  leftImage?: string;
  /** Right image URL, sampled into ASCII art. Same-origin or CORS-enabled. */
  rightImage?: string;
  /** Footer background color. Defaults to tailwind classes. */
  background?: string;
  /** Text color for headings. Defaults to tailwind classes. */
  textColor?: string;
  /** Character ramp, ordered dark → light, used to render the ASCII art. */
  asciiChars?: string;
  /** Color of the ASCII glyphs. Adapts to dark/light mode by default. */
  charColor?: string;
  /** Fill color of a highlighted (hovered) cell. */
  hoverColor?: string;
  /** Glyph color inside a highlighted cell. Adapts to dark/light mode by default. */
  hoverCharColor?: string;
  /** Number of columns each image is sampled to. */
  columns?: number;
  /** Pixel size of each ASCII cell. */
  cellSize?: number;
  /** Font size (px) of the ASCII glyphs. */
  fontSize?: number;
  /** Pointer parallax strength in px; set to 0 to disable. */
  parallaxStrength?: number;
  /** Cursor influence radius, in cells, for the hover highlight. */
  hoverRadius?: number;
  /** Play the reveal when the footer scrolls into view (else show immediately). */
  revealOnScroll?: boolean;
  /** Controlled reveal. When set, ignores built-in observer. */
  revealed?: boolean;
  /** Additional classes for the root element. */
  className?: string;
}

// Procedural high-contrast reaching hand rasterizer for reliable sampling
function generateProceduralHand(side: "left" | "right", cols: number, rows: number): number[][] {
  const grid: number[][] = [];
  for (let y = 0; y < rows; y++) {
    const row: number[] = [];
    for (let x = 0; x < cols; x++) {
      const normX = side === "left" ? x / cols : 1 - x / cols;
      const normY = y / rows;

      // Arm & Palm curve
      const armCenterY = 0.55 - normX * 0.25;
      const armThickness = 0.35 * (1 - normX * 0.7);
      const distToArm = Math.abs(normY - armCenterY);

      // Fingers extending toward the edge (normX -> 1)
      let fingerMask = 0;
      if (normX > 0.45) {
        const fingerPhase = (normY - 0.2) * 16;
        const fingerWave = Math.sin(fingerPhase);
        if (fingerWave > 0.2 && distToArm < 0.22) {
          fingerMask = Math.min(1, (normX - 0.45) * 2.5);
        }
      }

      let brightness = 0;
      if (distToArm < armThickness) {
        const edgeShading = 1 - distToArm / armThickness;
        brightness = Math.min(1, edgeShading * 1.2 + fingerMask * 0.5);
      }

      row.push(brightness);
    }
    grid.push(row);
  }
  return grid;
}

export function AnimatedFooter({
  headingLines = ["VERIPASS", "USEVERIPASS.COM"],
  leftImage = "/animated-footer/hand-left.jpg",
  rightImage = "/animated-footer/hand-right.jpg",
  background,
  textColor,
  asciiChars = "........:::=+xX#0369",
  charColor = "Adaptive",
  hoverColor = "#155EEF", // VeriPass signature blue or #ff6a00
  hoverCharColor = "Adaptive",
  columns = 80,
  cellSize = 16,
  fontSize = 15,
  parallaxStrength = 20,
  hoverRadius = 8,
  revealOnScroll = true,
  revealed,
  className,
}: AnimatedFooterProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // In-view detection
  const isInView = useInView(rootRef, { once: false, margin: "-100px" });
  const isVisible = revealed !== undefined ? revealed : revealOnScroll ? isInView : true;

  // Pointer state in pixel & cell coordinates
  const [pointer, setPointer] = useState<{
    x: number;
    y: number;
    cellX: number;
    cellY: number;
    active: boolean;
  }>({
    x: -9999,
    y: -9999,
    cellX: -9999,
    cellY: -9999,
    active: false,
  });

  // Parallax offset
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  // Precomputed sampled brightness matrices for left and right
  const [leftGrid, setLeftGrid] = useState<number[][]>(() => generateProceduralHand("left", columns, Math.floor(columns * 0.45)));
  const [rightGrid, setRightGrid] = useState<number[][]>(() => generateProceduralHand("right", columns, Math.floor(columns * 0.45)));

  // Sample real image brightness if loaded, else use procedural high-res hand
  const sampleImage = useCallback((url: string, side: "left" | "right", cols: number) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => {
      try {
        const aspect = img.naturalHeight / img.naturalWidth || 0.6;
        const rows = Math.max(10, Math.floor(cols * aspect));
        const offscreen = document.createElement("canvas");
        offscreen.width = cols;
        offscreen.height = rows;
        const oCtx = offscreen.getContext("2d", { willReadFrequently: true });
        if (!oCtx) return;

        oCtx.drawImage(img, 0, 0, cols, rows);
        const imgData = oCtx.getImageData(0, 0, cols, rows);
        const data = imgData.data;

        const grid: number[][] = [];
        for (let y = 0; y < rows; y++) {
          const row: number[] = [];
          for (let x = 0; x < cols; x++) {
            const idx = (y * cols + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3] / 255;
            // standard luminance formula
            const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            row.push(lum * a);
          }
          grid.push(row);
        }

        if (side === "left") setLeftGrid(grid);
        else setRightGrid(grid);
      } catch (err) {
        console.warn("Could not sample image directly, fallback to procedural hand.", err);
      }
    };
  }, []);

  useEffect(() => {
    if (leftImage) sampleImage(leftImage, "left", columns);
    if (rightImage) sampleImage(rightImage, "right", columns);
  }, [leftImage, rightImage, columns, sampleImage]);

  // Handle pointer tracking
  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rootRef.current) return;
    const rect = rootRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cellX = Math.floor(x / cellSize);
    const cellY = Math.floor(y / cellSize);

    setPointer({ x, y, cellX, cellY, active: true });

    if (parallaxStrength > 0) {
      const normX = (x / rect.width - 0.5) * 2;
      const normY = (y / rect.height - 0.5) * 2;
      setParallax({
        x: normX * parallaxStrength,
        y: normY * parallaxStrength,
      });
    }
  };

  const handlePointerLeave = () => {
    setPointer((prev) => ({ ...prev, active: false, cellX: -9999, cellY: -9999 }));
    setParallax({ x: 0, y: 0 });
  };

  // Main canvas ASCII rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const charRamp = asciiChars.split("");

    const resize = () => {
      if (!canvas.parentElement) return;
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.parentElement.clientWidth;
      const h = canvas.parentElement.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, width, height);
      ctx.font = `700 ${fontSize}px "SF Mono", Monaco, "Cascadia Code", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const totalCols = Math.ceil(width / cellSize);
      const totalRows = Math.ceil(height / cellSize);

      const isLightBg = !background || background.includes("white") || background.includes("light");
      const defaultCharColor = charColor === "Adaptive" ? (isLightBg ? "#0f172a" : "#cbd5e1") : charColor;
      const defaultHoverCharColor = hoverCharColor === "Adaptive" ? "#ffffff" : hoverCharColor;

      // Left hand position with parallax
      const leftStartX = Math.floor(parallax.x / cellSize);
      const leftStartY = Math.floor((height * 0.15 + parallax.y) / cellSize);

      // Right hand position with parallax
      const rightCols = rightGrid[0]?.length || columns;
      const rightStartX = totalCols - rightCols + Math.floor(-parallax.x / cellSize);
      const rightStartY = Math.floor((height * 0.15 - parallax.y) / cellSize);

      for (let gy = 0; gy < totalRows; gy++) {
        for (let gx = 0; gx < totalCols; gx++) {
          const pixelX = gx * cellSize;
          const pixelY = gy * cellSize;
          const centerX = pixelX + cellSize / 2;
          const centerY = pixelY + cellSize / 2;

          // Check distance from cursor in cell units
          const distCells = Math.hypot(gx - pointer.cellX, gy - pointer.cellY);
          const isHighlighted = pointer.active && distCells <= hoverRadius;

          // Compute sampled brightness at this cell
          let brightness = 0;

          // Sample left hand grid
          const relLeftX = gx - leftStartX;
          const relLeftY = gy - leftStartY;
          if (
            relLeftY >= 0 &&
            relLeftY < leftGrid.length &&
            relLeftX >= 0 &&
            relLeftX < (leftGrid[relLeftY]?.length || 0)
          ) {
            brightness = Math.max(brightness, leftGrid[relLeftY][relLeftX] || 0);
          }

          // Sample right hand grid
          const relRightX = gx - rightStartX;
          const relRightY = gy - rightStartY;
          if (
            relRightY >= 0 &&
            relRightY < rightGrid.length &&
            relRightX >= 0 &&
            relRightX < (rightGrid[relRightY]?.length || 0)
          ) {
            brightness = Math.max(brightness, rightGrid[relRightY][relRightX] || 0);
          }

          // Ambient background dot pattern
          if (brightness <= 0.05) {
            brightness = 0.05;
          }

          // Select ASCII glyph from ramp
          const rampIndex = Math.min(
            charRamp.length - 1,
            Math.max(0, Math.floor(brightness * (charRamp.length - 1)))
          );
          const char = charRamp[rampIndex] || ".";

          // If cell is hovered, fill cell square with hoverColor & white glyph
          if (isHighlighted) {
            const glowAlpha = Math.max(0.1, 1 - distCells / hoverRadius);
            ctx.fillStyle = hoverColor;
            ctx.globalAlpha = glowAlpha;
            ctx.fillRect(pixelX, pixelY, cellSize, cellSize);
            ctx.globalAlpha = 1.0;

            ctx.fillStyle = defaultHoverCharColor;
            ctx.fillText(char, centerX, centerY);
          } else {
            // Normal character rendering
            const alpha = 0.12 + brightness * 0.88;
            ctx.fillStyle = defaultCharColor;
            ctx.globalAlpha = alpha;
            ctx.fillText(char, centerX, centerY);
            ctx.globalAlpha = 1.0;
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, [
    asciiChars,
    background,
    cellSize,
    charColor,
    fontSize,
    hoverCharColor,
    hoverColor,
    hoverRadius,
    leftGrid,
    parallax,
    pointer,
    rightGrid,
  ]);

  return (
    <footer
      ref={rootRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      className={cn(
        "relative w-full overflow-hidden select-none border-t-2 border-neutral-200 transition-colors duration-300",
        background ? background : "bg-white text-neutral-950",
        className
      )}
      style={{
        minHeight: "560px",
      }}
    >
      {/* Background ASCII Canvas (sampled from Left & Right Hands) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Foreground Container with Reveal Transition */}
      <motion.div
        initial={revealOnScroll ? { opacity: 0, y: 40 } : false}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-12 pt-14 pb-10 flex flex-col justify-between min-h-[560px]"
      >
        {/* Top Header Information & Protocol Badges */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-10 border-b border-neutral-200/90 backdrop-blur-2xs bg-white/60 p-4 sm:p-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-[#155EEF]" />
              <span className="font-mono text-sm sm:text-base font-black tracking-tight text-neutral-950 uppercase">
                USEVERIPASS.COM
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-300 text-emerald-700 text-[10px] font-mono font-bold uppercase">
                Mainnet Live
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-sans">
              Decentralized Digital Product Passport & Anti-Counterfeit Verification Protocol
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="px-3 py-1.5 bg-neutral-100/90 border border-neutral-200 text-neutral-800">
              SOC2 Type II • ISO 27001
            </div>
            <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 font-bold">
              Dynamic QR & NFC Dual-Chip
            </div>
          </div>
        </div>

        {/* Large Display Words Along the Bottom Edge (exact VengeanceUI format) */}
        <div className="py-16 sm:py-24 text-left pointer-events-none">
          <div className="font-sans font-black tracking-tighter uppercase leading-[0.88] text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-neutral-950">
            {headingLines.map((line, idx) => (
              <span
                key={idx}
                className={cn(
                  "block hover:text-[#155EEF] transition-colors pointer-events-auto cursor-default",
                  textColor,
                  idx === 1 && "text-[#155EEF]"
                )}
              >
                {line}
              </span>
            ))}
          </div>
        </div>

        {/* Multi-Column Nav & Bottom Links */}
        <div className="pt-8 border-t border-neutral-200/90 backdrop-blur-2xs bg-white/70 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-600 font-sans">
          <div className="flex items-center gap-4">
            <span className="font-mono font-semibold text-neutral-900">
              © 2026 useveripass.com. All rights reserved.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-mono text-[11px]">
            <a href="#product" className="hover:text-neutral-950 transition-colors">Infrastructure</a>
            <a href="#developers" className="hover:text-neutral-950 transition-colors">Developer API</a>
            <a href="#privacy" className="hover:text-neutral-950 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-neutral-950 transition-colors">Terms of Service</a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}

export default AnimatedFooter;
