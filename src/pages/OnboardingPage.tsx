import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Building2,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { RankLancrLogo } from '../components/brand/RankLancrLogo';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUserRoles } = useAuth();

  const handleContinue = () => {
    setUserRoles(['provider', 'buyer']);
    navigate('/create-profile');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-[#e8622c] selection:text-white flex flex-col justify-between">
      
      {/* Top Header */}
      <header className="h-16 border-b-2 border-black bg-white px-4 sm:px-8 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <RankLancrLogo size="md" showDomain={true} isLink={false} />
          <span className="hidden sm:inline-block px-2 py-0.5 bg-orange-100 text-[#e8622c] text-[10px] font-mono font-bold">
            CHALLENGE ARENA ONBOARDING
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500">
          <ShieldCheck className="w-4 h-4 text-[#e8622c]" />
          <span>UNIFIED CREATOR ACCOUNT</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-8 py-10 flex flex-col justify-center">
        
        {/* Title Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-[#e8622c] text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WELCOME {user?.name ? user.name.toUpperCase() : 'TO RANKLANCR'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight">
            One Account for Everything
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Your RankLancr account gives you full access to compete in challenges, vote on community entries, and sponsor skill arenas.
          </p>
        </div>

        {/* Unified Account Card */}
        <div className="bg-white border-2 border-black p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#e8622c] text-white border-2 border-black flex items-center justify-center shadow-xs shrink-0">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <span className="px-2 py-0.5 bg-slate-100 border border-slate-300 text-[10px] font-mono font-bold text-slate-700 uppercase">
                UNIFIED CREATOR & SPONSOR PASSPORT
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-black tracking-tight mt-1">
                Challenge Competitor & Arena Sponsor
              </h2>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-200 text-xs sm:text-sm text-slate-700">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Compete:</strong> Pay $5 to enter 3-day skill challenges and win 72h Top Developer Rail visibility.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Vote:</strong> Participate in 72h fingerprint-verified community voting for entries.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Sponsor:</strong> Claim Bronze, Silver, or Gold tier sponsorships to promote your company/tool.</span>
            </div>
          </div>

          <button
            onClick={handleContinue}
            className="w-full py-4 bg-black hover:bg-[#e8622c] text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <UserCheck className="w-4 h-4" />
            <span>[ COMPLETE YOUR PROFILE & ENTER ARENA ]</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t-2 border-black bg-white px-4 sm:px-8 py-3 text-center text-xs font-mono text-slate-500">
        <span>© 2026 RANKLANCR • ZERO COMMISSION CHALLENGE ARENA</span>
      </footer>

    </div>
  );
};

export default OnboardingPage;
