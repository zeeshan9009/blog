import React from 'react';

export const BrandTicker: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#FBFBFA] border-b border-neutral-200/80 py-12 lg:py-16">
      
      {/* Subtle Dot Grid Background on sides */}
      <div className="absolute inset-0 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-40" />

      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        
        {/* Eyebrow Headline matching exact screenshot */}
        <p className="text-center font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] text-neutral-400 font-semibold mb-10">
          POWERING THE WORLD&apos;S MOST AMBITIOUS COMPANIES
        </p>

        {/* Monochromatic Clean Brand Logo Strip */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-20 opacity-70 hover:opacity-100 transition-opacity duration-300">
          
          {/* 1. Ravical */}
          <div className="flex items-center gap-1.5 text-[#334D41] hover:text-neutral-900 transition-colors cursor-default">
            <span className="font-sans font-black text-xl tracking-tight">Ravical</span>
          </div>

          {/* 2. artifact */}
          <div className="flex items-center gap-2 text-[#334D41] hover:text-neutral-900 transition-colors cursor-default">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L4 22h3.5l1.8-4.5h5.4L16.5 22H20L12 2zm-1.3 12.5L12 9.2l1.3 5.3h-2.6z" />
            </svg>
            <span className="font-sans font-extrabold text-xl tracking-tight">artifact</span>
          </div>

          {/* 3. SYNDIO */}
          <div className="flex items-center gap-2 text-[#334D41] hover:text-neutral-900 transition-colors cursor-default">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 3.3l6.5 3.3L12 11.8 5.5 8.6 12 5.3z" />
            </svg>
            <span className="font-mono font-black text-lg tracking-wider">SYNDIO</span>
          </div>

          {/* 4. IFS */}
          <div className="flex items-center gap-2 text-[#334D41] hover:text-neutral-900 transition-colors cursor-default">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3m0 14v3M2 12h3m14 0h3m-3.1-6.9l-2.1 2.1m-9.6 9.6l-2.1 2.1m0-13.8l2.1 2.1m9.6 9.6l2.1 2.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="font-sans font-black text-xl tracking-tight">IFS</span>
          </div>

          {/* 5. COPADO */}
          <div className="flex items-center gap-2 text-[#334D41] hover:text-neutral-900 transition-colors cursor-default">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M18 6h-4.5c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5H18c2.5 0 4.5-2 4.5-4.5S20.5 6 18 6zm0 6h-4.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5H18c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5zM6 6c-2.5 0-4.5 2-4.5 4.5S3.5 15 6 15h4.5c2.5 0 4.5-2 4.5-4.5S13 6 10.5 6H6zm0 6c-.8 0-1.5-.7-1.5-1.5S5.2 9 6 9h4.5c.8 0 1.5.7 1.5 1.5S11.3 12 10.5 12H6z" />
            </svg>
            <span className="font-sans font-extrabold text-lg tracking-wide">COPADO</span>
          </div>

          {/* 6. AGENCY */}
          <div className="flex items-center gap-2 text-[#334D41] hover:text-neutral-900 transition-colors cursor-default">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zm0 9L2 16l10 5 10-5-10-5z" />
            </svg>
            <span className="font-sans font-black text-lg tracking-wider">AGENCY</span>
          </div>

          {/* 7. Ravical (Duplicate as in reference strip) */}
          <div className="hidden sm:flex items-center gap-1.5 text-[#334D41] hover:text-neutral-900 transition-colors cursor-default">
            <span className="font-sans font-black text-xl tracking-tight">Ravical</span>
          </div>

        </div>

      </div>

    </section>
  );
};
