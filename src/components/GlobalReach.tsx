import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface MetricItem {
  value: string;
  label: string;
}

const metrics: MetricItem[] = [
  { value: '2.4M', label: 'PRODUCTS IDENTIFIED' },
  { value: '847K', label: 'ACTIVE OWNERS' },
  { value: '18M', label: 'VERIFICATIONS' },
  { value: '142', label: 'COUNTRIES' }
];

export const GlobalReach: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-white py-10 sm:py-14 border-b border-neutral-200">
      
      {/* Grid texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000004_1px,transparent_1px),linear-gradient(to_bottom,#00000004_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none -z-10" />

      <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* ========================================================= */}
          {/* LEFT: Typography */}
          {/* ========================================================= */}
          <div className="lg:col-span-3 flex flex-col items-start text-left">
            <div className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-3">
              GLOBAL REACH
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight uppercase leading-[1.08] mb-3 font-sans">
              <span className="text-neutral-950 block">PHYSICAL PRODUCTS</span>
              <span className="text-neutral-950">ARE NOW </span>
              <span className="text-[#155EEF]">DATA.</span>
            </h2>

            <p className="text-xs sm:text-[13px] text-neutral-600 font-normal leading-relaxed max-w-[260px]">
              A global network for product identity, trust and verification.
            </p>
          </div>

          {/* ========================================================= */}
          {/* CENTER: World Map Network Visual */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 bg-[#070B14] border border-slate-800 rounded-none p-4 relative overflow-hidden h-[180px] sm:h-[200px] flex items-center justify-center shadow-md group">
            
            {/* Ambient map glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-44 bg-blue-600/15 rounded-full blur-2xl pointer-events-none" />

            {/* SVG World Map & Network Arcs */}
            <svg
              className="w-full h-full object-contain relative z-10 opacity-90"
              viewBox="0 0 700 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* World Continents Simplified Outlines */}
              {/* North America */}
              <path
                d="M80 60 Q120 40 180 50 Q230 70 210 120 Q170 140 140 170 Q110 180 100 130 Z"
                fill="#121D33"
              />
              {/* South America */}
              <path
                d="M170 180 Q210 190 230 230 Q210 290 180 300 Q150 260 160 210 Z"
                fill="#121D33"
              />
              {/* Europe */}
              <path
                d="M320 60 Q380 50 400 80 Q390 120 340 120 Q310 100 320 60 Z"
                fill="#152442"
              />
              {/* Africa */}
              <path
                d="M320 130 Q390 130 410 180 Q390 260 350 270 Q310 230 310 170 Z"
                fill="#121D33"
              />
              {/* Asia */}
              <path
                d="M410 60 Q520 40 600 70 Q620 140 570 180 Q480 170 420 130 Z"
                fill="#14213D"
              />
              {/* Australia */}
              <path
                d="M540 220 Q610 210 620 250 Q590 290 530 270 Z"
                fill="#121D33"
              />

              {/* Connecting Arcs */}
              <path
                d="M160 110 Q260 40 360 80"
                stroke="#2563EB"
                strokeWidth="1.2"
                strokeDasharray="3 3"
                opacity="0.75"
              />
              <path
                d="M360 80 Q460 30 540 90"
                stroke="#2563EB"
                strokeWidth="1.2"
                strokeDasharray="3 3"
                opacity="0.75"
              />
              <path
                d="M160 110 Q280 200 360 200"
                stroke="#3B82F6"
                strokeWidth="1"
                opacity="0.6"
              />
              <path
                d="M360 80 Q450 160 570 240"
                stroke="#3B82F6"
                strokeWidth="1"
                opacity="0.6"
              />
              <path
                d="M360 80 Q360 140 370 200"
                stroke="#3B82F6"
                strokeWidth="1"
                opacity="0.6"
              />
              <path
                d="M540 90 Q600 160 570 240"
                stroke="#3B82F6"
                strokeWidth="1"
                opacity="0.6"
              />

              {/* Glowing Hub Nodes */}
              {/* New York / US East */}
              <circle cx="160" cy="110" r="4" fill="#60A5FA" />
              <circle cx="160" cy="110" r="8" stroke="#3B82F6" strokeWidth="1" opacity="0.6" className="animate-ping" />

              {/* London / Europe */}
              <circle cx="360" cy="80" r="5" fill="#3B82F6" />
              <circle cx="360" cy="80" r="10" stroke="#60A5FA" strokeWidth="1.5" opacity="0.8" />

              {/* Tokyo / East Asia */}
              <circle cx="560" cy="110" r="4.5" fill="#60A5FA" />
              <circle cx="560" cy="110" r="8" stroke="#3B82F6" strokeWidth="1" opacity="0.6" />

              {/* Dubai */}
              <circle cx="430" cy="130" r="4" fill="#3B82F6" />

              {/* Singapore */}
              <circle cx="510" cy="180" r="4" fill="#60A5FA" />

              {/* Sydney */}
              <circle cx="580" cy="250" r="4" fill="#3B82F6" />

              {/* Sao Paulo */}
              <circle cx="210" cy="230" r="3.5" fill="#3B82F6" />

              {/* Johannesburg */}
              <circle cx="370" cy="220" r="3.5" fill="#3B82F6" />
            </svg>

          </div>

          {/* ========================================================= */}
          {/* RIGHT: Metric Stats List with link icon */}
          {/* ========================================================= */}
          <div className="lg:col-span-3 bg-white border border-slate-200/90 rounded-none p-4 shadow-2xs relative flex flex-col justify-between min-h-[180px] sm:min-h-[200px]">
            
            {/* Top Right Arrow Link */}
            <div className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer">
              <ArrowUpRight className="w-4 h-4 stroke-[2]" />
            </div>

            {/* 4 Rows */}
            <div className="divide-y divide-slate-100 flex flex-col justify-between h-full">
              {metrics.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
                  <div className="text-xl sm:text-2xl font-black text-[#155EEF] font-sans tracking-tight min-w-[75px]">
                    {item.value}
                  </div>
                  <div className="text-[10px] sm:text-[10.5px] font-mono font-medium text-slate-500 uppercase tracking-wider">
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
