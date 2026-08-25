import React from 'react';
import { Navbar } from '../components/pixelpush/Navbar';
import { Footer } from '../components/pixelpush/Footer';
import { ShieldCheck, Flame, Scale, FileText, AlertTriangle } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 font-sans flex flex-col selection:bg-orange-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 w-full font-mono">
        
        {/* Header */}
        <div className="border-b-2 border-black pb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-black text-white text-[10px] font-bold uppercase">
            <FileText className="w-3.5 h-3.5" />
            <span>Legal Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
            Terms of Service & Auction Rules
          </h1>
          <p className="text-xs text-slate-600">
            Last Updated: August 2026 • RankLancr 0% Commission Protocol
          </p>
        </div>

        {/* Section 1: 0% Commission & Platform Direct Links */}
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-black text-black uppercase">
            <Scale className="w-4 h-4 text-emerald-600" />
            <span>1. 0% Commission Marketplace Architecture</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            RankLancr operates with zero platform commission on client-freelancer transactions. Freelancers link their authentic external professional profiles (LinkedIn, Upwork, Fiverr, GitHub, or Portfolio) and negotiate contract terms directly with buyers. RankLancr does not intermediate funds, hold escrow, or scrape third-party data.
          </p>
        </div>

        {/* Section 2: Outbid Spotlight & Ascending Auction Policy */}
        <div className="bg-amber-50/80 border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <div className="flex items-center gap-2 text-sm font-black text-black uppercase">
            <Flame className="w-4 h-4 text-[#e8622c] fill-[#e8622c]" />
            <span>2. Outbid Spotlight Ascending Auction Policy (Strict No-Refund Policy)</span>
          </div>
          
          <div className="p-3.5 bg-white border border-amber-300 text-xs text-amber-950 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-[#e8622c]">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>ASCENDING AUCTION DISPLACEMENT POLICY:</span>
            </div>
            <p className="leading-relaxed">
              When you submit a paid bid to claim a <strong>Top 3 Spotlight Leaderboard Slot</strong>, your payment purchases visibility for up to <strong>72 hours</strong>.
            </p>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-800 pt-1">
              <li><strong>Displacement Without Refund:</strong> If another freelancer places a higher qualifying bid (+5% or +$1.00 min increment), they immediately assume that slot, displacing the prior holder. <strong>All auction bids are final and non-refundable</strong>.</li>
              <li><strong>Decay & Reset:</strong> If an active slot reaches the end of its 72-hour hold period without new competing bids, the slot reverts to open status and price decays toward the base floor ($5.00).</li>
              <li><strong>Fairness Exemption:</strong> Spotlight leaderboard slots are pure paid auctions and are explicitly exempt from organic impression equalizers.</li>
            </ul>
          </div>

          <div className="p-3 bg-slate-100 border border-slate-300 text-[11px] text-slate-600">
            <strong>Legacy System Notice:</strong> The legacy $2 / 24h Sponsored Boost feature was formally discontinued as of August 2026 in preparation for Challenge Arena. Historic terms and conditions applied to prior purchases made before retirement.
          </div>
        </div>

        {/* Section 3: ProRank Organic Independence & Quality Gate */}
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-black text-black uppercase">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>3. ProRank Organic Talent Integrity & Quality Gate</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Organic ProRank scores are determined strictly by relevance, skill benchmarks, client reviews, and project quality. <strong>Paying for paid promotion NEVER alters, inflates, or feeds into a freelancer's organic ProRank score.</strong> Furthermore, accounts with active disputes, flagged standing, or ratings below 4.0 are ineligible to purchase sponsored placements.
          </p>
        </div>

        {/* Section 4: Anti-Abuse & Wash Bidding Prevention */}
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-black text-black uppercase">
            <span>4. Anti-Abuse & Rate Limiting</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            To prevent botting, self-dealing, or artificial price manipulation, claim attempts are rate-limited to a maximum of 1 claim per slot per 10 minutes per profile. All bids and PaymentIntents are logged to an immutable audit ledger (`spotlight_bids`).
          </p>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;
