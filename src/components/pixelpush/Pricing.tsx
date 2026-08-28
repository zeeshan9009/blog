import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, Trophy, Building2, Flame, ArrowRight, ShieldCheck } from 'lucide-react';

export const Pricing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-white border-b-2 border-black">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Eyebrow & Heading */}
        <div className="max-w-2xl mx-auto text-center mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#e8622c]">
            <span className="w-2 h-2 bg-[#e8622c] block" />
            <span>TRANSPARENT ARENA PRICING</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-black tracking-tight leading-tight">
            Clear Fees. Zero Hidden Cuts.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium">
            Pay a simple $5 fee to enter skill challenges, or secure paid visibility placements to showcase your dev tools to high-intent builders.
          </p>
        </div>

        {/* Persistent Compliance Disclosure Banner */}
        <div className="max-w-3xl mx-auto mb-12 p-3.5 sm:p-4 bg-amber-50/90 border-2 border-black font-mono text-xs text-amber-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#e8622c] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Skill Competition & Compliance Notice:</strong> RankLancr is a skill-based portfolio competition. Placement is determined entirely by community votes — never by chance, luck, or payment amount. Entry fees fund platform operations; <strong>there is no cash prize and no monetary payout to any participant.</strong>
          </div>
        </div>

        {/* 3-Column Balanced Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto gap-8 items-stretch">
          
          {/* 1. Challenge Entry Fee ($5) */}
          <div className="p-8 bg-[#fafafa] border-2 border-black flex flex-col justify-between space-y-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="space-y-6">
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#e8622c] flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>CREATOR ENTRY</span>
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl sm:text-5xl font-black text-black tracking-tight font-mono">$5</span>
                  <span className="text-xs text-slate-500 font-bold font-mono">/ challenge</span>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Single entry fee to submit your project and compete for 72-hour site-wide Top Developer Rail placement.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-200 space-y-3 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Right to submit 1 project repository / demo</span>
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
              className="w-full py-3.5 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider transition text-center border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              [ ENTER AN ARENA ]
            </Link>
          </div>

          {/* 2. Outbid Spotlight Placement ($5 Floor) */}
          <div className="p-8 bg-[#fafafa] border-2 border-black flex flex-col justify-between space-y-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="space-y-6">
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-blue-600" />
                  <span>SPOTLIGHT PLACEMENT</span>
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl sm:text-4xl font-black text-black tracking-tight font-mono">$5+</span>
                  <span className="text-xs text-slate-500 font-bold font-mono">/ 72h hold</span>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Paid ascending-bid visibility auction to hold a Top 3 Developer Spotlight card on the homepage.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-200 space-y-3 text-xs text-slate-700 font-medium">
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
              className="w-full py-3.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold uppercase tracking-wider transition text-center border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              [ VIEW SPOTLIGHT ]
            </Link>
          </div>

          {/* 3. Challenge Co-Sponsorship Placement ($50+ Floor) */}
          <div className="p-8 bg-orange-50 border-2 border-black flex flex-col justify-between space-y-8 shadow-[6px_6px_0px_0px_#e8622c]">
            <div className="space-y-6">
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#e8622c] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>CO-SPONSORSHIP AUCTION</span>
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl sm:text-5xl font-black text-black tracking-tight font-mono">$50+</span>
                  <span className="text-xs text-slate-500 font-bold font-mono">floor</span>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Bid to secure 48-hour co-branded visibility placement alongside the featured challenge creator.
                </p>
              </div>

              <div className="pt-6 border-t border-orange-200 space-y-3 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#e8622c] shrink-0" />
                  <span>Co-branded 48h Top Developer showcase</span>
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
              className="w-full py-3.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold uppercase tracking-wider transition text-center border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              [ SPONSOR ARENA ]
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Pricing;
