import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { ActivityFeedTicker } from './ActivityFeedTicker';
import { RailStealCard } from '../challenges/RailStealCard';

export const Hero: React.FC = () => {
  return (
    <section className="pt-12 pb-16 sm:pt-20 sm:pb-20 bg-white border-b border-[#E5E5E5] text-[#1A1A1A] font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* 1. Small Eyebrow Label */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAFAF9] border border-[#E5E5E5] text-[11px] font-semibold text-[#FF5A1F] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-[#FF5A1F] shrink-0" />
            <span>Live Challenge Arena // 72h Visibility Rewards</span>
          </div>
        </div>

        {/* 2. Headline + Clean Subtext */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#1A1A1A] leading-[1.12]">
            Submit your best work.{' '}
            <br className="hidden sm:block" />
            <span className="text-[#FF5A1F]">Steal the #1 spot.</span>{' '}
            <br className="hidden sm:block" />
            Get stolen tomorrow.
          </h1>

          <p className="text-base sm:text-lg text-[#525252] font-normal leading-relaxed max-w-2xl mx-auto pt-1">
            The merit-first developer competition where community votes crown the top creator. Build in 3 days, contest the Top Developer Rail in real time, and hold #1 against incoming challengers.
          </p>
        </div>

        {/* 3. Live Activity Feed Ticker */}
        <div className="max-w-2xl mx-auto">
          <ActivityFeedTicker />
        </div>

        {/* 4. #1 Top Developer Rail Card — Centerpiece right at the top */}
        <div id="rail-steal-section" className="pt-2">
          <RailStealCard />
        </div>

        {/* 5. Quiet Compliance Disclosure Strip */}
        <div className="max-w-3xl mx-auto p-3.5 bg-[#FAFAF9] border border-[#E5E5E5] text-xs text-[#525252] flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#FF5A1F] shrink-0 mt-0.5" />
          <div className="leading-normal">
            <strong className="text-[#1A1A1A] font-semibold">Skill-Based Competition:</strong> Placement is determined entirely by community votes — never by chance, luck, or payment amount. Entry fees fund platform operations; <strong className="text-[#1A1A1A] font-semibold">there is no cash prize and no monetary payout to any participant.</strong>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
