import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap } from 'lucide-react';
import { PromoteModal } from '../modals/PromoteModal';
import { SPONSORED_BOOST_PRICE_USD, SPONSORED_BOOST_DURATION_HOURS } from '../../config/pricing';

export const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [isPromoteOpen, setIsPromoteOpen] = useState(false);

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
            No hidden subscription fees. Free organic discovery or {SPONSORED_BOOST_DURATION_HOURS}-hour sponsored visibility for ${SPONSORED_BOOST_PRICE_USD}.
          </p>
        </div>

        {/* 2-Column Balanced Square Pricing Grid (Free vs $2 Boost) */}
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8 items-stretch">
          
          {/* 1. Starter (Free Discovery) */}
          <div className="p-8 sm:p-10 bg-[#fafafa] border-2 border-slate-200 flex flex-col justify-between space-y-8 rounded-none">
            <div className="space-y-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Free Discovery
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl sm:text-5xl font-black text-black tracking-tight">$0</span>
                  <span className="text-xs text-slate-500 font-semibold">/ forever</span>
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
                  <span>Direct client contact links</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#e8622c] shrink-0" />
                  <span>Standard organic search ranking</span>
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
                className="pixel-btn-outline-inner w-full py-3.5 font-bold text-xs text-center cursor-pointer"
              >
                Create Free Profile
              </button>
            </div>
          </div>

          {/* 2. Pro (Dark Square Card - $2/24 hours - Featured Boost) */}
          <div className="relative p-8 sm:p-10 bg-black text-white flex flex-col justify-between space-y-8 shadow-2xl border-2 border-[#e8622c] rounded-none">
            {/* Top Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 bg-[#e8622c] text-white font-black text-[10px] uppercase tracking-wider shadow-md rounded-none">
              Most Popular Boost
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  24h Sponsored Boost
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">${SPONSORED_BOOST_PRICE_USD}</span>
                  <span className="text-xs text-slate-400 font-semibold">/ {SPONSORED_BOOST_DURATION_HOURS} hours</span>
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {SPONSORED_BOOST_DURATION_HOURS}-Hour Sponsored Visibility at the top of ProRank relevant talent searches.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-800 space-y-3.5 text-xs sm:text-sm text-slate-200">
                <div className="flex items-center gap-2.5 text-orange-300 font-bold">
                  <Zap className="w-4 h-4 text-[#e8622c] shrink-0" />
                  <span>Pinned in Top Sponsored Results</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Promoted badge on profile card</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant 24-hour activation timer</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Real-time search click analytics</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zero subscription lock-in</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsPromoteOpen(true)}
              className="w-full py-3.5 bg-[#e8622c] hover:bg-orange-500 text-white font-black text-xs text-center transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-2 rounded-none"
            >
              <Zap className="w-4 h-4" />
              <span>Promote Profile for ${SPONSORED_BOOST_PRICE_USD}</span>
            </button>
          </div>

        </div>

      </div>

      <PromoteModal
        isOpen={isPromoteOpen}
        onClose={() => setIsPromoteOpen(false)}
      />
    </section>
  );
};

export default Pricing;
