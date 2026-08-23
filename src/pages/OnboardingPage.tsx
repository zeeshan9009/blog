import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Code,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
  Search,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { RankLancrLogo } from '../components/brand/RankLancrLogo';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUserRoles } = useAuth();

  const handleSelectRole = (roleChoice: 'buyer' | 'provider' | 'both') => {
    if (roleChoice === 'buyer') {
      setUserRoles(['buyer']);
      navigate('/find-services');
    } else if (roleChoice === 'provider') {
      setUserRoles(['provider']);
      navigate('/create-profile');
    } else {
      setUserRoles(['buyer', 'provider']);
      navigate('/create-profile');
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-[#e8622c] selection:text-white flex flex-col justify-between">
      
      {/* Top Header */}
      <header className="h-16 border-b-2 border-black bg-white px-4 sm:px-8 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <RankLancrLogo size="md" showDomain={true} isLink={false} />
          <span className="hidden sm:inline-block px-2 py-0.5 bg-orange-100 text-[#e8622c] text-[10px] font-mono font-bold">
            ONBOARDING
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500">
          <ShieldCheck className="w-4 h-4 text-[#e8622c]" />
          <span>MULTI-ROLE ECOSYSTEM</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-8 py-10 flex flex-col justify-center">
        
        {/* Title Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-[#e8622c] text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WELCOME {user?.name ? user.name.toUpperCase() : 'TO PRORANK'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight">
            What brings you to ProRank?
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Choose how you want to use ProRank. You can easily update this choice later in Settings.
          </p>
        </div>

        {/* Two Large Choice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          
          {/* Card 1: HIRE A SERVICE (Buyer) */}
          <div className="group bg-white border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[9px_9px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-black text-white border-2 border-black flex items-center justify-center mb-5 group-hover:bg-[#e8622c] transition-colors shadow-xs">
                <Briefcase className="w-7 h-7" />
              </div>

              <div className="inline-block px-2 py-0.5 bg-slate-100 border border-slate-300 text-[10px] font-mono font-bold text-slate-700 uppercase mb-2">
                OPTION 01 • SERVICE BUYER
              </div>

              <h2 className="text-2xl font-black text-black tracking-tight mb-2">
                Hire a Service
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-medium">
                Find vetted professionals and hire them directly for your project with 0% marketplace markups.
              </p>

              {/* Feature Points */}
              <div className="space-y-2.5 mb-8 border-t border-slate-200 pt-4 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Search Node.js, React, Webflow, Designers & SEO</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Transparent 0-100 deterministic ProRank score</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct client messaging & custom budget requests</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectRole('buyer')}
              className="w-full py-3.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              <Search className="w-4 h-4" />
              <span>[ HIRE A SERVICE ]</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: OFFER A SERVICE (Provider) */}
          <div className="group bg-white border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_#e8622c] hover:shadow-[9px_9px_0px_0px_#e8622c] hover:-translate-y-1 transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-[#e8622c] text-white border-2 border-black flex items-center justify-center mb-5 group-hover:bg-black transition-colors shadow-xs">
                <Code className="w-7 h-7" />
              </div>

              <div className="inline-block px-2 py-0.5 bg-orange-100 border border-[#e8622c]/40 text-[10px] font-mono font-bold text-[#e8622c] uppercase mb-2">
                OPTION 02 • SERVICE PROVIDER
              </div>

              <h2 className="text-2xl font-black text-black tracking-tight mb-2">
                Offer a Service
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-medium">
                Showcase your skills, create services, get discovered, and earn 100% of your earnings.
              </p>

              {/* Feature Points */}
              <div className="space-y-2.5 mb-8 border-t border-slate-200 pt-4 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#e8622c] shrink-0" />
                  <span>Free professional profile & multiple gig services</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#e8622c] shrink-0" />
                  <span>Optional $1 / 24-hour sponsored visibility boost</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#e8622c] shrink-0" />
                  <span>0% commission on client inquiries & project contracts</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectRole('provider')}
              className="w-full py-3.5 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>[ OFFER A SERVICE ]</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Option 3: Both Roles */}
        <div className="mt-8 text-center bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2 bg-slate-100 border border-black shrink-0">
              <Users className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="font-bold text-xs text-black">Want to both hire talent & offer services?</div>
              <div className="text-[11px] text-slate-500">Enable unified dual dashboard mode with seamless one-click switching.</div>
            </div>
          </div>

          <button
            onClick={() => handleSelectRole('both')}
            className="px-5 py-2.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition cursor-pointer shrink-0"
          >
            [ SELECT BOTH (BUYER + PROVIDER) ]
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t-2 border-black bg-white px-4 sm:px-8 py-3 text-center text-xs font-mono text-slate-500">
        <span>© 2026 PRORANK • CHOOSE YOUR ROLE AT ANY TIME IN SETTINGS</span>
      </footer>

    </div>
  );
};

export default OnboardingPage;
