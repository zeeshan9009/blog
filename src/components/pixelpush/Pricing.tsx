import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Flame, ArrowRight } from 'lucide-react';

export const Pricing: React.FC = () => {
  const navigate = useNavigate();

  const scrollToSpotlight = () => {
    const el = document.getElementById('spotlight');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-white border-b border-slate-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Eyebrow & Heading */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#e8622c] mb-3">
            <span className="w-2 h-2 bg-[#e8622c] block" />
            <span>Pricing</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-black tracking-[-0.03em] leading-tight">
            Transparent plans for talent & clients
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-3">
            No hidden subscription fees. Free organic discovery or competitive Outbid Spotlight Top 3 placement.
          </p>
        </div>

        {/* 2-Column Balanced Square Pricing Grid (Free vs Outbid Spotlight) */}
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8 items-stretch">
          
          {/* 1. Starter (Free Discovery) */}
          <div className="p-8 sm:p-10 bg-[#fafafa] border-2 border-slate-200 flex flex-col justify-between space-y-8 rounded-none">
            <div className="space-y-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Organic Discovery
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl sm:text-5xl font-black text-black tracking-tight font-mono">$0</span>
                  <span className="text-xs text-slate-500 font-semibold font-mono">/ forever</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Everything you need to search talent or create your free portfolio profile.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-200 space-y-3.5 text-xs sm:text-sm text-slate-700 font-medium">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#e8622c] shrink-0" />
                  <span>Search & filter all vetted talent</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#e8622c] shrink-0" />
                  <span>Free professional profile & portfolio</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#e8622c] shrink-0" />
                  <span>Direct client contact links (LinkedIn, Upwork, Fiverr, GitHub)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#e8622c] shrink-0" />
                  <span>Standard ProRank organic search ranking</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#e8622c] shrink-0" />
                  <span>Zero platform commission on contracts</span>
                </div>
              </div>
            </div>

            <div className="pixel-btn-outline-wrapper w-full">
              <button
                onClick={() => navigate('/create-profile')}
                className="pixel-btn-outline-inner w-full py-3.5 font-bold text-xs text-center cursor-pointer font-mono"
              >
                [ CREATE FREE PROFILE ]
              </button>
            </div>
          </div>

          {/* 2. Spotlight Leaderboard (Ascending Auction) */}
          <div className="relative p-8 sm:p-10 bg-black text-white flex flex-col justify-between space-y-8 shadow-2xl border-2 border-[#e8622c] rounded-none">
            {/* Top Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 bg-[#e8622c] text-white font-black text-[10px] uppercase tracking-wider shadow-md font-mono rounded-none">
              Premium Placement
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-orange-400 font-mono">
                  Outbid Spotlight Leaderboard
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono">From $5</span>
                  <span className="text-xs text-slate-400 font-semibold font-mono">/ 72h hold</span>
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Claim exclusive Top 3 placement at the top of RankLancr homepage and category pages.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-800 space-y-3.5 text-xs sm:text-sm text-slate-200">
                <div className="flex items-center gap-2.5 text-orange-300 font-bold">
                  <Flame className="w-4 h-4 text-[#e8622c] fill-[#e8622c] shrink-0" />
                  <span>Top 3 Ascending Outbid Slots</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>72-Hour Guaranteed Hold Window</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct click-through to your external profiles</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Quality Gate Protected (Rating ≥ 4.0 or grace period)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Live leaderboard outbid alerts</span>
                </div>
              </div>
            </div>

            <button
              onClick={scrollToSpotlight}
              className="w-full py-3.5 bg-[#e8622c] hover:bg-orange-500 text-white font-black text-xs text-center transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-2 font-mono rounded-none"
            >
              <Flame className="w-4 h-4 fill-white" />
              <span>[ VIEW & CLAIM SPOTLIGHT SLOTS ]</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Pricing;
