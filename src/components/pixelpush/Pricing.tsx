import React from 'react';
import { Trophy, Check, ArrowRight, ShieldCheck, Flame, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-20 sm:py-24 bg-white border-b border-[#E5E5E5] font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAFAF9] border border-[#E5E5E5] text-[11px] font-semibold text-[#FF5A1F] uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" />
            <span>Transparent Pricing & Visibility Placements</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-[#1A1A1A] tracking-tight">
            Simple Entries. <span className="text-[#FF5A1F]">High-Impact Visibility.</span>
          </h2>

          <p className="text-sm sm:text-base text-[#525252] font-normal leading-relaxed max-w-2xl mx-auto">
            Pay a flat $5 fee to enter skill challenges, or secure promotional visibility to showcase your brand to top developers. No subscriptions, zero cuts.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2 max-w-6xl mx-auto">
          
          {/* 1. Skill Challenge Entry ($5) */}
          <div className="p-8 bg-white border border-[#E5E5E5] hover:border-[#D4D4D4] transition-colors flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[#FF5A1F] flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>COMMUNITY ARENA</span>
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-bold text-[#1A1A1A] tracking-tight font-mono">$5.00</span>
                  <span className="text-xs text-[#737373] font-medium">/ entry ticket</span>
                </div>
                <p className="text-xs text-[#525252] mt-2 leading-relaxed font-normal">
                  Per-challenge entry ticket to submit your project and compete for 72h site-wide visibility.
                </p>
              </div>

              <div className="pt-6 border-t border-[#E5E5E5] space-y-3 text-xs text-[#525252] font-normal">
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
              className="w-full py-3.5 bg-[#FF5A1F] hover:bg-[#E54E17] text-white font-semibold text-xs transition-colors text-center border border-[#FF5A1F]"
            >
              Enter An Arena ($5)
            </Link>
          </div>

          {/* 2. Outbid Spotlight Placement ($5 Floor) */}
          <div className="p-8 bg-white border border-[#E5E5E5] hover:border-[#D4D4D4] transition-colors flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-blue-600" />
                  <span>SPOTLIGHT PLACEMENT</span>
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-bold text-[#1A1A1A] tracking-tight font-mono">$5.00+</span>
                  <span className="text-xs text-[#737373] font-medium">/ 72h hold</span>
                </div>
                <p className="text-xs text-[#525252] mt-2 leading-relaxed font-normal">
                  Paid ascending-bid visibility auction to hold a Top 3 Developer Spotlight card on the homepage.
                </p>
              </div>

              <div className="pt-6 border-t border-[#E5E5E5] space-y-3 text-xs text-[#525252] font-normal">
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
              className="w-full py-3.5 bg-white hover:bg-[#FAFAF9] text-[#1A1A1A] font-semibold text-xs transition-colors text-center border border-[#1A1A1A]"
            >
              View Spotlight Placements
            </Link>
          </div>

          {/* 3. Challenge Co-Sponsorship Placement ($50+ Floor) */}
          <div className="p-8 bg-[#FAFAF9] border border-[#FF5A1F]/50 flex flex-col justify-between space-y-8 relative">
            <div className="absolute -top-3 right-6 px-2.5 py-0.5 bg-[#FF5A1F] text-white text-[10px] font-semibold uppercase tracking-wider">
              SPONSORSHIP PLACEMENT
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[#FF5A1F] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>CO-SPONSORSHIP AUCTION</span>
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-bold text-[#1A1A1A] tracking-tight font-mono">$50.00+</span>
                  <span className="text-xs text-[#737373] font-medium">floor</span>
                </div>
                <p className="text-xs text-[#525252] mt-2 leading-relaxed font-normal">
                  Ascending live outbid auction for exclusive 48h co-branding with the challenge winner.
                </p>
              </div>

              <div className="pt-6 border-t border-[#E5E5E5] space-y-3 text-xs text-[#1A1A1A] font-normal">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#FF5A1F] shrink-0" />
                  <span><strong>48h Top Developer Rail:</strong> Promoted with winner</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#FF5A1F] shrink-0" />
                  <span>Brand logo, description & destination link</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#FF5A1F] shrink-0" />
                  <span>Outbid ascending auction (+5% / +$1 min)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#FF5A1F] shrink-0" />
                  <span>Zero influence over challenge outcomes</span>
                </div>
              </div>
            </div>

            <Link
              to="/arena"
              className="w-full py-3.5 bg-[#1A1A1A] hover:bg-[#FF5A1F] text-white font-semibold text-xs transition-colors text-center border border-[#1A1A1A] hover:border-[#FF5A1F]"
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
