import React from 'react';
import { ArrowRight } from 'lucide-react';

export const CtaBanner: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-white py-12 sm:py-16 border-b border-neutral-200">
      
      {/* Grid texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000004_1px,transparent_1px),linear-gradient(to_bottom,#00000004_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none -z-10" />

      <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-10">
          
          {/* ========================================================= */}
          {/* LEFT: Powerful Slogan Headline */}
          {/* ========================================================= */}
          <div className="w-full lg:w-[42%] flex flex-col items-start text-left shrink-0">
            <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-black tracking-tight uppercase leading-[1.06] font-sans">
              <span className="text-neutral-950 block">IF IT EXISTS,</span>
              <span className="text-neutral-950 block">IT SHOULD HAVE</span>
              <span className="text-[#155EEF] block">AN IDENTITY.</span>
            </h2>
          </div>

          {/* ========================================================= */}
          {/* CENTER: Description & CTA Button */}
          {/* ========================================================= */}
          <div className="w-full lg:w-[32%] flex flex-col items-start text-left">
            <p className="text-xs sm:text-[13px] text-neutral-600 font-normal leading-relaxed mb-4 max-w-xs">
              Give every physical product a permanent place on the internet.
            </p>

            <a
              href="#start-building"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-none bg-[#155EEF] hover:bg-[#124bbf] active:bg-[#0f3ea3] text-white font-bold text-xs uppercase tracking-wider transition-all duration-150 shadow-xs active:translate-y-0.5"
            >
              <span>START BUILDING</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* ========================================================= */}
          {/* RIGHT: Brand Signature & Social Icons with Divider */}
          {/* ========================================================= */}
          <div className="w-full lg:w-[26%] flex flex-col items-start lg:items-end justify-between border-t lg:border-t-0 lg:border-l border-slate-200 pt-6 lg:pt-0 lg:pl-10">
            
            {/* VeriPass Brand Signature */}
            <div className="flex flex-col items-start lg:items-end mb-4">
              <div className="text-xl font-bold tracking-tight text-neutral-950 flex items-center">
                <span>VeriPass</span>
                <span className="text-xs ml-0.5 font-normal">®</span>
              </div>
              <div className="font-mono text-[9px] tracking-wider text-slate-500 uppercase mt-0.5">
                PRODUCT IDENTITY INFRASTRUCTURE
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 text-neutral-800">
              {/* LinkedIn */}
              <a 
                href="#linkedin" 
                aria-label="LinkedIn"
                className="w-7 h-7 rounded-none bg-neutral-100 hover:bg-neutral-950 hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28M7.85 18.5V10.1H5.06v8.4h2.79z" />
                </svg>
              </a>

              {/* X (Twitter) */}
              <a 
                href="#x" 
                aria-label="X (Twitter)"
                className="w-7 h-7 rounded-none bg-neutral-100 hover:bg-neutral-950 hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* GitHub */}
              <a 
                href="#github" 
                aria-label="GitHub"
                className="w-7 h-7 rounded-none bg-neutral-100 hover:bg-neutral-950 hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                </svg>
              </a>

              {/* YouTube */}
              <a 
                href="#youtube" 
                aria-label="YouTube"
                className="w-7 h-7 rounded-none bg-neutral-100 hover:bg-neutral-950 hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
};
