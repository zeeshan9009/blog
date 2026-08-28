import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, ArrowRight, Award, Zap, Flame, ShieldCheck, Info } from 'lucide-react';
import { ActivityFeedTicker } from './ActivityFeedTicker';

export const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-6 sm:pt-10 pb-8 bg-[#faf8f5] text-slate-900 font-sans border-b-2 border-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Live Status Pill Badge */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border-2 border-black text-[10px] sm:text-[11px] font-mono font-bold text-slate-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
            <span><strong className="text-black">LIVE</strong> TAKEOVER ARENA</span>
            <span className="text-slate-300">•</span>
            <span><strong className="text-black">$5</strong> Fixed Entry</span>
            <span className="text-slate-300">•</span>
            <span className="text-[#e8622c] uppercase font-mono font-black">72h Visibility Rewards</span>
          </div>
        </div>

        {/* Dynamic Punchy Headline Hook */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-black tracking-tight font-mono leading-[1.1]">
            Submit your best work.{' '}
            <span className="text-[#e8622c] underline decoration-4 sm:decoration-6 decoration-black underline-offset-4">
              Steal the #1 spot.
            </span>{' '}
            Get stolen tomorrow.
          </h1>

          <p className="text-xs sm:text-sm font-mono text-slate-600 max-w-xl mx-auto leading-relaxed pt-1">
            The merit-first developer competition where community votes crown the top creator. Build in 3 days, contest the Top Developer Rail in real time, and hold #1 against incoming challengers.
          </p>
        </div>

        {/* Persistent Compliance Disclosure Banner */}
        <div className="max-w-2xl mx-auto p-3 sm:p-3.5 bg-amber-50/90 border-2 border-black font-mono text-[11px] sm:text-xs text-amber-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#e8622c] shrink-0 mt-0.5" />
          <div className="leading-snug">
            <strong>Skill-Based Portfolio Competition:</strong> Placement is determined entirely by community votes — never by chance, luck, or payment amount. Entry fees fund platform operations; <strong>there is no cash prize and no monetary payout to any participant.</strong>
          </div>
        </div>

        {/* Live Activity Feed Ticker — Directly under the hook */}
        <div className="pt-1">
          <ActivityFeedTicker />
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto pt-2">
          <button
            type="button"
            onClick={() => navigate('/arena')}
            className="w-full sm:w-auto px-6 py-3 bg-[#e8622c] hover:bg-black text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>[ ENTER ARENA — $5 ]</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('rail-steal-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else navigate('/arena');
            }}
            className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-100 text-black font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
            <span>[ CONTEST THE RAIL ]</span>
          </button>
        </div>

      </div>
    </section>
  );
};

export default Hero;
