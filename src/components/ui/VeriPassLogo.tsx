import React from 'react';
import { cn } from '../../lib/utils';

export interface VeriPassLogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showText?: boolean;
  showDomain?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Exact VeriPass V-Shield Icon SVG
 */
export function VeriPassLogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-8 h-8", className)}
    >
      <defs>
        {/* Navy dark gradient for left arm */}
        <linearGradient id="vp-left-navy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B1B3D" />
          <stop offset="100%" stopColor="#061229" />
        </linearGradient>

        {/* Electric blue gradient for right arm */}
        <linearGradient id="vp-right-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0062FF" />
          <stop offset="100%" stopColor="#0080FF" />
        </linearGradient>

        {/* Shield badge gradient */}
        <linearGradient id="vp-badge-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0062FF" />
          <stop offset="100%" stopColor="#0077FF" />
        </linearGradient>

        {/* Shadow under right arm fold */}
        <filter id="vp-fold-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="-2" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Left Arm of the V (Dark Navy) */}
      <path
        d="M 31 22 C 30 19 33 16 37 16 L 43 16 C 46 16 48 18 49 21 L 62 55 C 63 58 61 61 58 61 L 49 61 C 46 61 44 59 43 56 Z"
        fill="url(#vp-left-navy)"
      />

      {/* Left Arm Full Polygon */}
      <path
        d="M 33 22.5 C 31.5 19.5 33.5 16 37 16 H 43.5 C 46 16 48.5 18 49.5 20.5 L 63.5 54.5 C 64.5 57 63 60.5 60 61 H 53.5 C 51 61 48.5 59 47.5 56.5 L 33 22.5 Z"
        fill="url(#vp-left-navy)"
      />

      {/* Vertex join and base */}
      <path
        d="M 32 23 C 30.5 19.5 33 16 37 16 L 44 16 C 46.5 16 48.8 18 49.8 20.5 L 61 48 C 58 50 55 52 52 53.5 L 47.5 42 L 32 23 Z"
        fill="url(#vp-left-navy)"
      />

      {/* Primary Left Dark Leg */}
      <path
        d="M 34 20 C 31.5 18 31 16 35 16 L 44 16 C 47 16 49 18 50.5 21 L 66 60 C 67.5 64 64 68 60 68 L 51 68 C 47.5 68 45 65.5 43.5 62 L 34 20 Z"
        fill="url(#vp-left-navy)"
      />

      {/* Right Arm of the V (Electric Blue Overlap with Shadow) */}
      <g filter="url(#vp-fold-shadow)">
        <path
          d="M 44.5 62 C 43 65.5 45.5 68 49 68 L 56 68 C 59.5 68 62.5 66 64 62.5 L 75 35 C 76.5 31.5 74 28 70.5 28 L 63.5 28 C 60 28 57 30 55.5 33.5 L 44.5 62 Z"
          fill="url(#vp-right-blue)"
        />
      </g>

      {/* Top Right Shield Badge */}
      <g>
        <path
          d="M 68 15 C 68 12.5 70 10.5 72.5 10.5 H 85.5 C 88 10.5 90 12.5 90 15 V 23 C 90 30.5 83 37.5 79 40 C 78.5 40.3 77.5 40.3 77 40 C 73 37.5 68 30.5 68 23 V 15 Z"
          fill="url(#vp-badge-blue)"
        />

        {/* Crisp White Checkmark inside Shield */}
        <path
          d="M 74 22 L 77.5 26 L 85 17.5"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

/**
 * Complete VeriPass Brand Logo (Icon + Wordmark + Domain)
 */
export function VeriPassLogo({
  className,
  iconClassName,
  textClassName,
  showText = true,
  showDomain = false,
  size = 'md',
}: VeriPassLogoProps) {
  const sizeClasses = {
    sm: { icon: 'w-6 h-6', text: 'text-base', subtext: 'text-[9px]' },
    md: { icon: 'w-8 h-8', text: 'text-xl', subtext: 'text-[10px]' },
    lg: { icon: 'w-10 h-10', text: 'text-2xl', subtext: 'text-[12px]' },
    xl: { icon: 'w-14 h-14', text: 'text-4xl', subtext: 'text-[15px]' },
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      {/* Exact Vector Logo Icon */}
      <VeriPassLogoIcon className={cn(currentSize.icon, iconClassName)} />

      {/* Wordmark & Optional Subtitle */}
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <div className={cn("font-black tracking-tight font-sans flex items-center", currentSize.text, textClassName)}>
            <span className="text-[#081736]">Veri</span>
            <span className="text-[#0062FF]">Pass</span>
            <span className="text-[#0062FF] text-[0.55em] align-super font-bold ml-0.5 -mt-2">®</span>
          </div>

          {showDomain && (
            <span className={cn("font-sans font-medium text-[#081736]/70 tracking-[0.18em] lowercase mt-0.5", currentSize.subtext)}>
              useveripass.com
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default VeriPassLogo;
