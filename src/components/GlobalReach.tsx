import React from 'react';
import { ArrowRight } from 'lucide-react';

interface MetricItem {
  value: string;
  label: string;
}

const metrics: MetricItem[] = [
  { value: '2.4M', label: 'Products' },
  { value: '847K', label: 'Active Owners' },
  { value: '18M', label: 'Verifications' },
  { value: '142', label: 'Countries' }
];

export const GlobalReach: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-white text-neutral-950 py-16 sm:py-24 border-b border-neutral-200">

      {/* Background Map Video in Subtle Light Mode */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <video
          src="/map.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-15"
        />
        {/* White Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/70" />
      </div>

      <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10">

          {/* ========================================================= */}
          {/* LEFT: Typography & CTA */}
          {/* ========================================================= */}
          <div className="w-full lg:w-[48%] flex flex-col items-start text-left">
            <div className="font-mono text-[11px] uppercase tracking-wider text-[#155EEF] font-bold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#155EEF] animate-pulse" />
              <span>GLOBAL INFRASTRUCTURE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight uppercase leading-[1.05] mb-4 font-sans text-neutral-950">
              PHYSICAL PRODUCTS<br />
              ARE NOW <span className="text-[#155EEF]">DATA.</span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed max-w-md mb-8">
              A global network for product identity, trust and verification.
            </p>

            <a
              href="#explore-network"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-none bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-150 shadow-md group"
            >
              <span>Explore Global Network</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>

          {/* ========================================================= */}
          {/* RIGHT / BOTTOM: Square UI Metrics Bar */}
          {/* ========================================================= */}
          <div className="w-full lg:w-[48%] bg-white/90 backdrop-blur-md border border-neutral-300 rounded-none p-5 sm:p-6 shadow-xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-2 divide-y sm:divide-y-0 sm:divide-x divide-neutral-200 text-center">
              {metrics.map((item, idx) => (
                <div key={idx} className="pt-2 sm:pt-0 sm:px-3 first:pt-0 first:pl-0 last:pr-0">
                  <div className="text-2xl sm:text-3xl font-black text-neutral-950 font-sans tracking-tight leading-tight">
                    {item.value}
                  </div>
                  <div className="text-[10px] sm:text-xs text-neutral-500 font-mono font-medium leading-tight mt-1 uppercase">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};

