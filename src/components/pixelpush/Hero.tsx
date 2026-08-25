import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Vote,
  Flame,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section className="pt-6 sm:pt-8 pb-8 bg-[#faf8f5] text-slate-900 font-sans border-b-2 border-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-5">
        
        {/* Live Status Pill Badge */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-black text-[10px] sm:text-[11px] font-mono font-bold text-slate-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="w-2 h-2 rounded-full bg-[#e8622c] animate-pulse shrink-0" />
            <span><strong className="text-black">100%</strong> Merit-Based Voting</span>
            <span className="text-slate-300">•</span>
            <span><strong className="text-black">$5</strong> Fixed Entry</span>
            <span className="text-slate-300">•</span>
            <span className="text-[#e8622c] uppercase font-mono">72h Visibility Rewards</span>
          </div>
        </div>

        {/* Dynamic Headline */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-4xl lg:text-[44px] font-black text-black tracking-tight font-mono leading-[1.15]">
            Compete in Skill Challenges. Win{' '}
            <span className="text-[#e8622c] underline decoration-4 decoration-black underline-offset-4">
              72h Flagship Visibility.
            </span>
          </h1>

          <p className="text-xs sm:text-sm font-mono text-slate-600 max-w-xl mx-auto leading-relaxed">
            The merit-first developer competition arena. Pay a fixed $5 entry fee, build your project in 3 days, and let public voting choose the top 3 for site-wide Top Developer Rail placement.
          </p>
        </div>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto pt-1">
          <button
            onClick={() => navigate('/arena')}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>[ ENTER CHALLENGE ARENA ]</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('top-dev-rail');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else navigate('/arena');
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-slate-100 text-black font-mono text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>[ VIEW WINNERS ]</span>
          </button>
        </div>

        {/* Three Micro Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 border-t border-slate-300 max-w-2xl mx-auto text-[11px] font-mono">
          <div className="p-2 bg-white border border-black flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-bold text-slate-800">Zero Pay-to-Win</span>
          </div>

          <div className="p-2 bg-white border border-black flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="font-bold text-slate-800">72h Top Developer Rail</span>
          </div>

          <div className="p-2 bg-white border border-black flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="font-bold text-slate-800">3-Tier Sponsorships</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
