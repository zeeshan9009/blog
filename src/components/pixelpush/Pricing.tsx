import React from 'react';
import { Trophy, Check, ArrowRight, ShieldCheck, Flame, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-20 bg-slate-50/50 border-b border-slate-200/80 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-full text-xs font-semibold text-amber-900">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>TRANSPARENT PRICING & VISIBILITY PLACEMENTS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight font-heading">
            Simple Entries. <span className="text-[#e8622c]">High-Impact Visibility.</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            Pay a flat $5 fee to enter skill challenges, or secure promotional visibility to showcase your brand to top developers. No subscriptions, zero cuts.
          </p>
        </div>

        {/* Persistent Compliance Disclosure Banner */}
        <div className="max-w-3xl mx-auto p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs text-amber-950 shadow-modern-sm flex items-start gap-3 backdrop-blur-xs">
          <ShieldCheck className="w-4 h-4 text-[#e8622c] shrink-0 mt-0.5" />
          <div className="leading-relaxed text-slate-700 font-sans">
            <strong className="text-slate-900 font-semibold">Skill Competition Compliance Notice:</strong> RankLancr is a skill-based portfolio competition. Placement is determined entirely by community votes — never by chance, luck, or payment amount. Entry fees fund platform operations; <strong className="text-slate-900">there is no cash prize and no monetary payout to any participant.</strong>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2 max-w-6xl mx-auto">
          
          {/* 1. Skill Challenge Entry ($5) */}
          <div className="p-8 bg-white border border-slate-200/90 rounded-2xl flex flex-col justify-between space-y-8 shadow-modern hover:shadow-modern-lg transition-all duration-300">
            <div className="space-y-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#e8622c] flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>COMMUNITY ARENA</span>
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-black text-slate-950 tracking-tight font-heading">$5.00</span>
                  <span className="text-xs text-slate-500 font-medium font-sans">/ entry ticket</span>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed font-normal">
                  Per-challenge entry ticket to submit your project and compete for 72h site-wide visibility.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-3 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Right to submit 1 project repo/demo</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% merit-based public community voting</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Top creator earns 72h site-wide rail placement</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Permanent verified badge on creator profile</span>
                </div>
              </div>
            </div>

            <Link
              to="/arena"
              className="w-full py-3.5 bg-[#e8622c] hover:bg-orange-600 text-white font-sans text-xs font-bold rounded-xl transition text-center shadow-orange-glow hover:shadow-md"
            >
              Enter An Arena ($5)
            </Link>
          </div>

          {/* 2. Outbid Spotlight Placement ($5 Floor) */}
          <div className="p-8 bg-white border border-slate-200/90 rounded-2xl flex flex-col justify-between space-y-8 shadow-modern hover:shadow-modern-lg transition-all duration-300">
            <div className="space-y-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-blue-600" />
                  <span>SPOTLIGHT PLACEMENT</span>
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-black text-slate-950 tracking-tight font-heading">$5.00+</span>
                  <span className="text-xs text-slate-500 font-medium font-sans">/ 72h hold</span>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed font-normal">
                  Paid ascending-bid visibility auction to hold a Top 3 Developer Spotlight card on the homepage.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-3 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct link & card on homepage</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Guaranteed 72-hour visibility hold</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Transparent outbid increment (+5% / +$1)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Separated from challenge voting</span>
                </div>
              </div>
            </div>

            <Link
              to="/spotlight"
              className="w-full py-3.5 bg-slate-900 hover:bg-[#e8622c] text-white font-sans text-xs font-bold rounded-xl transition text-center shadow-sm"
            >
              View Spotlight Placements
            </Link>
          </div>

          {/* 3. Challenge Co-Sponsorship Placement ($50+ Floor) */}
          <div className="p-8 bg-orange-50/50 border-2 border-orange-500/40 rounded-2xl flex flex-col justify-between space-y-8 shadow-modern-lg relative">
            <div className="absolute -top-3.5 right-6 px-3 py-1 bg-[#e8622c] text-white text-[10px] font-bold uppercase rounded-full shadow-sm">
              SPONSORSHIP AUCTION
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#e8622c] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>CO-SPONSORSHIP AUCTION</span>
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-black text-slate-950 tracking-tight font-heading">$50.00+</span>
                  <span className="text-xs text-slate-500 font-medium font-sans">floor</span>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed font-normal">
                  Ascending live outbid auction for exclusive 48h co-branding with the challenge winner.
                </p>
              </div>

              <div className="pt-6 border-t border-orange-200/80 space-y-3 text-xs text-slate-800 font-medium">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#e8622c] shrink-0" />
                  <span><strong>48h Top Developer Rail:</strong> Promoted with winner</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#e8622c] shrink-0" />
                  <span>Brand logo, description & destination link</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#e8622c] shrink-0" />
                  <span>Outbid ascending auction (+5% / +$1 min)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#e8622c] shrink-0" />
                  <span>Zero influence over challenge outcomes</span>
                </div>
              </div>
            </div>

            <Link
              to="/arena"
              className="w-full py-3.5 bg-slate-900 hover:bg-[#e8622c] text-white font-sans text-xs font-bold rounded-xl transition text-center shadow-sm"
            >
              Sponsor Arena Visibility
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Pricing;
