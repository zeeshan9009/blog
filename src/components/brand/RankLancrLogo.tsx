import React from 'react';
import { Link } from 'react-router-dom';

interface RankLancrLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showDomain?: boolean;
  isLink?: boolean;
}

export const RankLancrLogo: React.FC<RankLancrLogoProps> = ({
  className = '',
  size = 'md',
  showDomain = true,
  isLink = true
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const content = (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Sharp High-Impact RankLancr Geometric Icon */}
      <div
        className={`${iconSizes[size]} bg-black relative flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_#e8622c] group-hover:shadow-[3px_3px_0px_0px_#000000] transition-all`}
      >
        {/* SVG Lance + Rank Step Symbol */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-white"
        >
          {/* Ascending Rank Steps */}
          <path d="M4 18H7V14H4V18Z" fill="white" />
          <path d="M9 18H12V10H9V18Z" fill="white" />
          <path d="M14 18H17V6H14V18Z" fill="#e8622c" />
          {/* Sharp Lance Spearhead Arrow */}
          <path
            d="M17 5L20.5 8.5L20.5 4L16 4L17 5Z"
            fill="#e8622c"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex items-baseline">
        <span className={`${textSizes[size]} font-black tracking-tight text-black`}>
          Rank<span className="text-black font-extrabold">Lancr</span>
          {showDomain && (
            <span className="text-[#e8622c] font-mono font-bold text-xs sm:text-sm ml-0.5">
              .com
            </span>
          )}
        </span>
      </div>
    </div>
  );

  if (isLink) {
    return (
      <Link to="/" className="inline-block focus:outline-hidden">
        {content}
      </Link>
    );
  }

  return content;
};

export default RankLancrLogo;
