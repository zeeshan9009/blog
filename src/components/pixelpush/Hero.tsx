import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { ActivityFeedTicker } from './ActivityFeedTicker';

export const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-16 pb-16 sm:pt-24 sm:pb-20 bg-white border-b border-[#E5E5E5] text-[#1A1A1A] font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* 1. Small Eyebrow Label */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAFAF9] border border-[#E5E5E5] text-[11px] font-semibold text-[#FF5A1F] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-[#FF5A1F] shrink-0" />
            <span>Live Challenge Arena // 72h Visibility Rewards</span>
          </div>
        </div>

        {/* 2. One Large Confident Headline + 3. Clean Subtext */}
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

        {/* 4. Primary CTA + Secondary CTA Side by Side */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/arena')}
            className="w-full sm:w-auto px-7 py-3.5 bg-[#FF5A1F] hover:bg-[#E54E17] text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer border border-[#FF5A1F]"
          >
            <Trophy className="w-4 h-4 text-white" />
            <span>Enter Challenge Arena ($5)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('rail-steal-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else navigate('/arena');
            }}
            className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-[#FAFAF9] text-[#1A1A1A] font-semibold text-sm transition-colors flex items-center justify-center gap-2 border border-[#1A1A1A] cursor-pointer"
          >
            <Zap className="w-4 h-4 text-[#FF5A1F]" />
            <span>Contest The Rail</span>
          </button>
        </div>

        {/* 5. Below CTAs: Quieter Compliance Strip & Live Ticker */}
        <div className="space-y-3 pt-6 border-t border-[#E5E5E5] max-w-2xl mx-auto">
          {/* Live Activity Feed Ticker */}
          <ActivityFeedTicker />

          {/* Compliance Disclosure Strip */}
          <div className="p-3 bg-[#FAFAF9] border border-[#E5E5E5] text-xs text-[#525252] flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#FF5A1F] shrink-0 mt-0.5" />
            <div className="leading-normal">
              <strong className="text-[#1A1A1A] font-semibold">Skill-Based Competition:</strong> Placement is determined entirely by community votes — never by chance, luck, or payment amount. Entry fees fund platform operations; <strong className="text-[#1A1A1A] font-semibold">there is no cash prize and no monetary payout to any participant.</strong>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
