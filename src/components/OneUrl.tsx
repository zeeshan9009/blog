import React, { useState } from 'react';
import { Globe, Lock } from 'lucide-react';

interface ProductUrlItem {
  id: string;
  url: string;
  name: string;
}

const productUrls: ProductUrlItem[] = [
  {
    id: '1',
    url: 'useveripass.com/p/8F4K29',
    name: 'Diamond Ring'
  },
  {
    id: '2',
    url: 'useveripass.com/p/GOLD-9921',
    name: 'Gold Necklace'
  },
  {
    id: '3',
    url: 'useveripass.com/p/ROLEX-X81',
    name: 'Luxury Watch'
  }
];

export const OneUrl: React.FC = () => {
  const [activeUrl, setActiveUrl] = useState<string>('useveripass.com/p/8F4K29');

  return (
    <section className="relative w-full overflow-hidden bg-white py-6 sm:py-8 border-b border-neutral-200">
      <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
          
          {/* ========================================================= */}
          {/* LEFT: Heading & Subtitle */}
          {/* ========================================================= */}
          <div className="w-full lg:w-[24%] flex flex-col items-start text-left shrink-0">
            <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-black tracking-tight uppercase leading-[1.05] mb-2 font-sans">
              <span className="text-neutral-950 block">EVERY PRODUCT.</span>
              <span className="text-[#155EEF] block">ONE URL.</span>
            </h2>
            <p className="text-xs sm:text-[13px] text-neutral-600 font-normal leading-relaxed max-w-[240px]">
              Physical objects can now have permanent digital addresses.
            </p>
          </div>

          {/* ========================================================= */}
          {/* CENTER: Browser URL Bar & Interactive URL Switcher Card */}
          {/* ========================================================= */}
          <div className="w-full lg:w-[62%] bg-white border border-slate-200/90 rounded-none p-3 shadow-2xs">
            
            {/* Top Browser Address Inset Bar */}
            <div className="bg-[#f8fafc] border border-slate-200/80 px-3.5 py-2 flex items-center gap-2.5 mb-3">
              <div className="w-4 h-4 rounded-none bg-emerald-500 flex items-center justify-center shrink-0">
                <Lock className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="font-mono text-xs text-slate-800 tracking-tight select-all">
                {activeUrl}
              </span>
            </div>

            {/* Bottom 3 Columns with thin vertical dividers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
              {productUrls.map((item) => {
                const isActive = activeUrl === item.url;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveUrl(item.url)}
                    className={`px-3 py-1.5 text-left transition-colors cursor-pointer group ${
                      isActive ? 'bg-blue-50/40' : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="font-mono text-[11px] font-medium text-slate-800 group-hover:text-blue-600 truncate">
                      {item.url}
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans mt-0.5">
                      {item.name}
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT: Compact Monospace Badge Card */}
          {/* ========================================================= */}
          <div className="w-full lg:w-[130px] xl:w-[140px] bg-[#f8fafc] border border-slate-200/70 p-3.5 rounded-none flex flex-col justify-between shrink-0 min-h-[96px]">
            <div className="text-slate-600 mb-2">
              <Globe className="w-4 h-4 stroke-[1.75]" />
            </div>

            <div className="font-mono text-[9px] leading-[1.35] text-slate-600 uppercase tracking-wider font-medium">
              A PERMANENT<br />
              URL FOR EVERY<br />
              <span className="text-slate-900 font-semibold">PHYSICAL PRODUCT.</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
