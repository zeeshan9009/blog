import React from 'react';
import { ShieldCheck, Trophy, Sparkles, User, Mail, ArrowLeft, Target, Users, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/pixelpush/Navbar';
import { Footer } from '../components/pixelpush/Footer';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-[#e8622c] selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-8 w-full">
        
        {/* Header */}
        <div className="space-y-3 border-b-2 border-black pb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-slate-600 hover:text-black mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>[ RETURN TO HOME ]</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-black text-white font-mono text-[10px] font-bold uppercase">
            <User className="w-3.5 h-3.5 text-[#e8622c]" />
            <span>ABOUT RANKLANCR PLATFORM</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black">
            About RankLancr
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 font-mono">
            Skill-based developer portfolio competitions & transparent merit discovery.
          </p>
        </div>

        {/* Core Mission */}
        <div className="bg-white border-2 border-black p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-black font-mono uppercase flex items-center gap-2">
            <Target className="w-5 h-5 text-[#e8622c]" />
            <span>Our Purpose & What We Build</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            <strong>RankLancr</strong> is an independent portfolio showcase and skill-based competition platform built for software developers, UI/UX engineers, and AI builders. We replace opaque job boards and traditional algorithmic discovery with merit-driven, 3-day engineering challenges.
          </p>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Participants submit real code repositories, functional web applications, and UI prototypes. Community peers and visitors vote on work quality in real-time, allowing top creators to earn site-wide visibility placements on our flagship <strong>Top Developer Rail</strong>.
          </p>
        </div>

        {/* Transparent Non-Gambling & No Cash Prize Certification */}
        <div className="bg-amber-50 border-2 border-black p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3 font-mono">
          <div className="flex items-center gap-2 text-sm font-black text-black uppercase">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Platform Structure & Compliance Principles</span>
          </div>
          <div className="space-y-2 text-xs text-amber-950 leading-relaxed">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>100% Skill & Merit-Based:</strong> Challenge rankings are determined purely by public community votes evaluating submitted code and design quality. Randomness, luck, and chance play zero role.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>No Cash Prizes or Monetary Payouts:</strong> RankLancr never awards cash prizes or financial returns to challenge entrants. All awards are purely promotional visibility placements, verified profile credentials, and digital portfolio exposure.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Fixed Operational Service Fee:</strong> The $5.00 entry fee directly covers server infrastructure, anti-bot verification, and platform hosting. It is not pooled into a prize fund.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Decoupled Advertising Visibility:</strong> Brand sponsorships and Outbid Spotlight slots are strictly paid advertising visibility placements. Sponsors and advertisers have zero influence over challenge voting or merit outcomes.</span>
            </div>
          </div>
        </div>

        {/* Platform Operations & Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
            <div className="text-xs font-mono font-bold uppercase text-slate-500">Platform Structure</div>
            <div className="text-base font-black text-black">RankLancr (Independent Platform)</div>
            <p className="text-xs text-slate-600 font-mono">
              Operated independently by founder & developer. Dedicated to fair creator visibility.
            </p>
          </div>

          <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
            <div className="text-xs font-mono font-bold uppercase text-slate-500">Direct Support Contact</div>
            <a href="mailto:ranklancr@gmail.com" className="text-sm font-bold text-[#e8622c] hover:underline block font-mono">
              ranklancr@gmail.com
            </a>
            <p className="text-xs text-slate-600 font-mono">
              Official support desk responding to inquiries within 24-48 business hours.
            </p>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
