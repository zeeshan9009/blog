import React from 'react';
import { Navbar } from '../components/pixelpush/Navbar';
import { Footer } from '../components/pixelpush/Footer';
import { SpotlightSection } from '../components/pixelpush/SpotlightSection';
import { ShieldCheck, Flame, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PromotedRankingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans flex flex-col selection:bg-orange-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10 w-full">
        
        {/* Header Banner */}
        <div className="border-b-2 border-black pb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-xs font-mono font-bold uppercase shadow-[2px_2px_0px_0px_#e8622c]">
            <Flame className="w-4 h-4 fill-[#e8622c] text-[#e8622c]" />
            <span>Ascending Auction Leaderboard</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-black tracking-tight font-mono">
            Outbid Spotlight Top 3
          </h1>

          <p className="text-sm font-mono text-slate-600 max-w-2xl leading-relaxed">
            Compete for exclusive 72-hour visibility at the top of RankLancr. Highest qualifying bids secure Top 3 placement globally and across relevant categories with direct link routing.
          </p>
        </div>

        {/* Live Outbid Spotlight Component */}
        <div className="space-y-6">
          <SpotlightSection />
        </div>

        {/* Auction Integrity & Rules Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6">
          <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-black">
              <Flame className="w-4 h-4 text-[#e8622c] fill-[#e8622c]" />
              <span>72-Hour Hold Window</span>
            </div>
            <p className="text-xs text-slate-600 font-mono leading-relaxed">
              When you win a slot, your placement remains active for 72 hours. Bids decay toward the base floor if unheld.
            </p>
          </div>

          <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-black">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Quality Gatekeeping</span>
            </div>
            <p className="text-xs text-slate-600 font-mono leading-relaxed">
              Only verified talent with ratings ≥ 4.0 (or new user grace period) and zero active disputes can claim Spotlight slots.
            </p>
          </div>

          <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-black">
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>Organic Independence</span>
            </div>
            <p className="text-xs text-slate-600 font-mono leading-relaxed">
              Paid bids strictly power Spotlight placement. Organic ProRank scores remain 100% untouched by auction spend.
            </p>
          </div>
        </div>

        {/* Terms Link */}
        <div className="text-center pt-4">
          <Link
            to="/terms"
            className="text-xs font-mono text-slate-500 hover:text-black underline"
          >
            Review Full Auction & Outbid Rules →
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default PromotedRankingPage;
