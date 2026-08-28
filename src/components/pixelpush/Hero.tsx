import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, ArrowRight, Zap, ShieldCheck, Sparkles, Flame } from 'lucide-react';
import { ActivityFeedTicker } from './ActivityFeedTicker';

const ROTATING_PHRASES = [
  'Steal the #1 spot.',
  'Claim 72h site-wide visibility.',
  'Crown your project #1.',
  'Defend the Top Developer Rail.'
];

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState('out');
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % ROTATING_PHRASES.length);
        setFadeState('in');
      }, 350);
    }, 3800);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-10 sm:pt-16 pb-12 bg-gradient-to-b from-white via-slate-50/50 to-slate-50/80 text-slate-900 font-sans border-b border-slate-200/80 overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-orange-400/10 via-amber-300/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Sleek Live Status Pill Badge */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white/90 border border-slate-200/90 rounded-full text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-md hover:border-slate-300 transition">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#e8622c]" />
            </span>
            <span className="font-bold text-slate-900 tracking-tight">LIVE TAKEOVER ARENA</span>
            <span className="text-slate-300 font-normal">•</span>
            <span className="text-slate-600 font-mono font-medium">$5 Entry Ticket</span>
            <span className="text-slate-300 font-normal">•</span>
            <span className="text-[#e8622c] font-bold">72h Merit Visibility</span>
          </div>
        </div>

        {/* Dynamic Punchy Headline Hook with Shimmer & Word Cycling */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-black text-slate-950 tracking-tight leading-[1.1] font-heading">
            Submit your best work.{' '}
            <br className="hidden sm:block" />
            <span
              className={`inline-block animate-gradient-text transition-all duration-300 transform ${
                fadeState === 'in' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95'
              }`}
            >
              {ROTATING_PHRASES[phraseIndex]}
            </span>{' '}
            <br className="hidden sm:block" />
            <span className="text-slate-800">Get stolen tomorrow.</span>
          </h1>

          {/* Wider, 1-2 line clean Subheading */}
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
            The merit-first skill competition where transparent community votes crown top builders. Submit your 3-day project, contest the #1 Top Developer Rail in real time, and hold your placement against incoming creators.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto pt-2">
          <button
            type="button"
            onClick={() => navigate('/arena')}
            className="w-full sm:w-auto px-7 py-3.5 bg-[#e8622c] hover:bg-orange-600 text-white font-bold text-sm rounded-xl shadow-orange-glow hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
          >
            <Trophy className="w-4 h-4 text-amber-200 fill-amber-200" />
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
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm border border-slate-200/90 rounded-xl shadow-modern-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
          >
            <Zap className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>Contest The Rail</span>
          </button>
        </div>

        {/* Persistent Compliance Disclosure Banner - Refined Glass Pill */}
        <div className="max-w-3xl mx-auto p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs text-amber-950 shadow-modern-sm flex items-start gap-3 backdrop-blur-xs">
          <ShieldCheck className="w-4 h-4 text-[#e8622c] shrink-0 mt-0.5" />
          <div className="leading-relaxed text-slate-700">
            <strong className="text-slate-900 font-semibold">Skill-Based Portfolio Competition:</strong> Placement is determined entirely by community votes — never by chance, luck, or payment amount. Entry fees fund platform operations; <strong className="text-slate-900">there is no cash prize and no monetary payout to any participant.</strong>
          </div>
        </div>

        {/* Live Activity Feed Ticker — Modern Floating Pill */}
        <div className="pt-2">
          <ActivityFeedTicker />
        </div>

      </div>
    </section>
  );
};

export default Hero;
