import React from 'react';
import { Trophy, Flame, Building2, Check, ArrowRight, ShieldCheck, HelpCircle, ArrowLeft, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/pixelpush/Navbar';
import { Footer } from '../components/pixelpush/Footer';

export const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-[#e8622c] selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-10 w-full">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-slate-600 hover:text-black mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>[ RETURN TO HOME ]</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white font-mono text-xs font-bold uppercase">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>TRANSPARENT PRICING & FEE BREAKDOWN</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-black">
            Simple, Transparent Pricing.
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Clear fees for creator skill competitions, brand advertising sponsorships, and Outbid Spotlight visibility. Zero hidden charges.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          {/* Card 1: Challenge Entry Fee ($5) */}
          <div className="bg-white border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-block px-2.5 py-0.5 bg-black text-white font-mono text-[10px] font-bold uppercase">
                COMMUNITY ARENA
              </div>
              <div>
                <h3 className="text-xl font-black text-black">Skill Challenge Entry</h3>
                <p className="text-xs text-slate-600 mt-1">Per-challenge entry fee to compete for 72h Top Developer Rail visibility.</p>
              </div>

              <div className="text-4xl font-black text-black font-mono">
                $5.00 <span className="text-xs font-normal text-slate-500 font-sans">USD / entry</span>
              </div>

              <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Right to submit 1 project entry</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Public community merit voting</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>72-Hour Top Developer Rail reward (Top 3)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Permanent winner badge on profile</span>
                </li>
              </ul>
            </div>

            <Link
              to="/arena"
              className="w-full py-3 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider transition text-center border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              [ BROWSE CHALLENGES ]
            </Link>
          </div>

          {/* Card 2: Fixed Brand Sponsorship ($50 - $150) */}
          <div className="bg-white border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-block px-2.5 py-0.5 bg-blue-600 text-white font-mono text-[10px] font-bold uppercase">
                BRAND PROMOTION
              </div>
              <div>
                <h3 className="text-xl font-black text-black">Fixed Sponsorships</h3>
                <p className="text-xs text-slate-600 mt-1">Instant brand placements for developer tools, SaaS, and tech companies.</p>
              </div>

              <div className="text-4xl font-black text-black font-mono">
                $50 — $150 <span className="text-xs font-normal text-slate-500 font-sans">USD</span>
              </div>

              <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Bronze ($50):</strong> Arena page banner badge</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Silver ($150):</strong> Homepage card logo & arena callout</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instant first-payment reservation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Click-through destination tracking</span>
                </li>
              </ul>
            </div>

            <Link
              to="/arena"
              className="w-full py-3 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold uppercase tracking-wider transition text-center border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              [ SPONSOR AN ARENA ]
            </Link>
          </div>

          {/* Card 3: Gold Flagship Outbid Auction ($100+) */}
          <div className="bg-orange-50 border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_#e8622c] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-block px-2.5 py-0.5 bg-[#e8622c] text-white font-mono text-[10px] font-bold uppercase">
                FLAGSHIP AUCTION
              </div>
              <div>
                <h3 className="text-xl font-black text-black">Gold Co-Sponsorship</h3>
                <p className="text-xs text-slate-600 mt-1">Ascending live outbid auction for exclusive co-branding with the challenge winner.</p>
              </div>

              <div className="text-4xl font-black text-black font-mono">
                $100.00+ <span className="text-xs font-normal text-slate-500 font-sans">USD Floor</span>
              </div>

              <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-orange-200">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#e8622c] shrink-0" />
                  <span><strong>48h Top Developer Rail:</strong> Promoted alongside winner</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#e8622c] shrink-0" />
                  <span>Live ascending outbid competition</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#e8622c] shrink-0" />
                  <span>Minimum increment: +$25.00 or +10%</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#e8622c] shrink-0" />
                  <span>Automated social broadcast announcement</span>
                </li>
              </ul>
            </div>

            <Link
              to="/arena"
              className="w-full py-3 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold uppercase tracking-wider transition text-center border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              [ ENTER GOLD AUCTION ]
            </Link>
          </div>

        </div>

        {/* Merchant & Security Disclosures */}
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
          <h3 className="text-sm font-black text-black font-mono uppercase flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Merchant Billing & Currency Disclosures</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700 leading-relaxed">
            <div>
              <p><strong>Currency:</strong> All fees are billed in United States Dollars (USD).</p>
              <p className="mt-1"><strong>Payment Merchant:</strong> Our orders are processed by our Merchant of Record, <strong>Paddle.com</strong> (supporting Cards, PayPal, Apple Pay, Wire).</p>
            </div>
            <div>
              <p><strong>Delivery:</strong> Digital submission rights and advertising placements are activated immediately upon transaction authorization.</p>
              <p className="mt-1"><strong>Billing Inquiries:</strong> Contact <a href="mailto:ranklanrc@gmail.com" className="text-[#e8622c] underline font-bold font-mono">ranklanrc@gmail.com</a>.</p>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
