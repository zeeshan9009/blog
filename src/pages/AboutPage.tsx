import React from 'react';
import { ShieldCheck, Trophy, Sparkles, User, Mail, ArrowLeft, Target, Users, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/pixelpush/Navbar';
import { Footer } from '../components/pixelpush/Footer';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#1A1A1A] font-sans selection:bg-[#FF5A1F] selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-14 space-y-8 w-full">
        
        {/* Header */}
        <div className="space-y-3 border-b border-[#E5E5E5] pb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#525252] hover:text-[#1A1A1A] mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#E5E5E5] text-[11px] font-semibold text-[#FF5A1F] uppercase tracking-wider">
            <User className="w-3.5 h-3.5" />
            <span>About RankLancr Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1A1A1A]">
            About RankLancr
          </h1>

          <p className="text-xs sm:text-sm text-[#525252] font-normal">
            Skill-based developer portfolio competitions & transparent merit discovery.
          </p>
        </div>

        {/* Core Mission */}
        <div className="bg-white border border-[#E5E5E5] p-6 sm:p-8 space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-[#1A1A1A] flex items-center gap-2">
            <Target className="w-5 h-5 text-[#FF5A1F]" />
            <span>Our Purpose & What We Build</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#525252] leading-relaxed font-normal">
            <strong className="text-[#1A1A1A]">RankLancr</strong> is an independent portfolio showcase and skill-based competition platform built for software developers, UI/UX engineers, and AI builders. We replace opaque job boards and traditional algorithmic discovery with merit-driven, 3-day engineering challenges.
          </p>
          <p className="text-xs sm:text-sm text-[#525252] leading-relaxed font-normal">
            Participants submit real code repositories, functional web applications, and UI prototypes. Community peers and visitors vote on work quality in real-time, allowing top creators to earn site-wide visibility placements on our flagship <strong className="text-[#1A1A1A]">Top Developer Rail</strong>.
          </p>
        </div>

        {/* Transparent Non-Gambling & No Cash Prize Certification */}
        <div className="bg-white border border-[#E5E5E5] p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-base font-bold text-[#1A1A1A]">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Platform Structure & Compliance Principles</span>
          </div>
          <div className="space-y-3 text-xs text-[#525252] leading-relaxed font-normal">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong className="text-[#1A1A1A]">100% Skill & Merit-Based:</strong> Challenge rankings are determined purely by public community votes evaluating submitted code and design quality. Randomness, luck, and chance play zero role.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong className="text-[#1A1A1A]">No Cash Prizes or Monetary Payouts:</strong> RankLancr never awards cash prizes or financial returns to challenge entrants. All awards are purely promotional visibility placements, verified profile credentials, and digital portfolio exposure.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong className="text-[#1A1A1A]">Fixed Operational Service Fee:</strong> The $5.00 entry fee directly covers server infrastructure, anti-bot verification, and platform hosting. It is not pooled into a prize fund.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong className="text-[#1A1A1A]">Decoupled Advertising Visibility:</strong> Brand sponsorships and Outbid Spotlight slots are strictly paid advertising visibility placements. Sponsors and advertisers have zero influence over challenge voting or merit outcomes.</span>
            </div>
          </div>
        </div>

        {/* Platform Operations & Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-[#E5E5E5] p-6 space-y-2">
            <div className="text-[11px] font-semibold uppercase text-[#737373] tracking-wider">Platform Structure</div>
            <div className="text-base font-bold text-[#1A1A1A]">RankLancr (Independent Platform)</div>
            <p className="text-xs text-[#525252] font-normal">
              Operated independently by founder & developer. Dedicated to fair creator visibility.
            </p>
          </div>

          <div className="bg-white border border-[#E5E5E5] p-6 space-y-2">
            <div className="text-[11px] font-semibold uppercase text-[#737373] tracking-wider">Direct Support Contact</div>
            <a href="mailto:ranklancr@gmail.com" className="text-sm font-semibold text-[#FF5A1F] hover:underline block font-mono">
              ranklancr@gmail.com
            </a>
            <p className="text-xs text-[#525252] font-normal">
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
