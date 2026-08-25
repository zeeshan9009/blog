import React from 'react';
import { ShieldCheck, RefreshCw, AlertTriangle, ArrowLeft, Mail, FileText, CheckCircle2, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/pixelpush/Navbar';
import { Footer } from '../components/pixelpush/Footer';

export const RefundPolicyPage: React.FC = () => {
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
            <RefreshCw className="w-3.5 h-3.5 text-[#e8622c]" />
            <span>MERCHANT BILLING & CANCELLATION TERMS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black">
            Refund & Cancellation Policy
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 font-mono">
            Last Updated: August 25, 2026 • Effective for all transactions on RankLancr.lol
          </p>
        </div>

        {/* Executive Summary Alert */}
        <div className="bg-amber-50 border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-950 uppercase">
            <AlertTriangle className="w-4 h-4 text-[#e8622c] shrink-0" />
            <span>Digital Goods & Service Consumption Notice</span>
          </div>
          <p className="text-xs text-amber-950 leading-relaxed">
            RankLancr provides digital competition submission rights, real-time algorithmic voter ranking, and digital advertising visibility. Because our services and server verification resources are <strong>consumed immediately upon payment</strong>, transactions are governed by the specific non-refundable terms below.
          </p>
        </div>

        {/* Section 1: Challenge Entry Fees ($5.00) */}
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
          <h2 className="text-base sm:text-lg font-black text-black font-mono uppercase">
            1. Skill Challenge Entry Fees ($5.00 USD)
          </h2>
          <div className="text-xs text-slate-700 space-y-2 leading-relaxed">
            <p>
              When you pay the <strong>$5.00 fixed entry fee</strong> to enter a skill challenge:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
              <li><strong>Immediate Service Delivery:</strong> Your payment immediately unlocks the digital right to submit one project entry to the challenge arena for the duration of the submission window.</li>
              <li><strong>Strict Non-Refundable Nature:</strong> Entry fees are pure platform service fees that cover compute, anti-abuse verification, and server infrastructure. Entry fees are <strong>non-refundable</strong> once paid, regardless of whether you submit a project or the final ranking outcome.</li>
              <li><strong>Zero Outcome Guarantee:</strong> Paying an entry fee does not purchase votes, guarantee visibility, or guarantee ranking. Results are determined 100% by community merit votes.</li>
            </ul>
          </div>
        </div>

        {/* Section 2: Brand Sponsorships & Gold Outbid Auctions */}
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
          <h2 className="text-base sm:text-lg font-black text-black font-mono uppercase">
            2. Brand Sponsorships & Gold Ascending Auctions
          </h2>
          <div className="text-xs text-slate-700 space-y-2 leading-relaxed">
            <p>
              When a company purchases a Bronze ($50), Silver ($150), or Gold Outbid Auction sponsorship:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
              <li><strong>Immediate Visibility:</strong> Brand assets (logo, link, callout) are published immediately to the challenge arena.</li>
              <li><strong>Outbid Displacement Policy:</strong> In the Gold Ascending Auction, bids purchase active visibility on the live leaderboard for the duration held. If another sponsor places a higher qualifying outbid, the new bidder takes the lead. Prior bids are <strong>not refunded</strong>, as advertising exposure was delivered while holding the slot.</li>
            </ul>
          </div>
        </div>

        {/* Section 3: Outbid Spotlight Homepage Auctions */}
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
          <h2 className="text-base sm:text-lg font-black text-black font-mono uppercase">
            3. Outbid Spotlight 72h Homepage Auctions
          </h2>
          <div className="text-xs text-slate-700 space-y-2 leading-relaxed">
            <p>
              Outbid Spotlight slots deliver real-time digital advertising on the homepage. Payments for outbid placements are <strong>final and non-refundable</strong> upon transaction completion.
            </p>
          </div>
        </div>

        {/* Section 4: Eligible Refund Exceptions (Technical & Duplicate Billing) */}
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
          <h2 className="text-base sm:text-lg font-black text-black font-mono uppercase text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>4. Eligible Refund Exceptions</span>
          </h2>
          <div className="text-xs text-slate-700 space-y-2 leading-relaxed">
            <p>We will issue a <strong>100% full refund</strong> under the following verified technical circumstances:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
              <li><strong>Duplicate Billing:</strong> If a technical error causes your credit card to be charged multiple times for the same single challenge entry or sponsorship slot.</li>
              <li><strong>Platform Cancellation:</strong> If a challenge arena is cancelled or withdrawn by RankLancr administration prior to the close of the entry window.</li>
              <li><strong>Documented Technical Failure:</strong> If verified platform downtime directly prevented you from submitting your project during an active submission window.</li>
            </ul>
          </div>
        </div>

        {/* Section 5: How to Request a Refund / Dispute Resolution */}
        <div className="bg-orange-50 border-2 border-black p-6 shadow-[4px_4px_0px_0px_#e8622c] space-y-3">
          <h2 className="text-base font-black text-black font-mono uppercase flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#e8622c]" />
            <span>5. Dispute Resolution & Refund Requests</span>
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            Our order process is conducted by our online reseller & Merchant of Record <strong>Paddle.com</strong>. If you experience a billing anomaly or duplicate charge, <strong>please contact our support team before initiating a bank chargeback</strong>. We review and resolve all legitimate billing inquiries within <strong>24 to 48 business hours</strong>.
          </p>
          <div className="p-3 bg-white border border-black font-mono text-xs text-black space-y-1">
            <div><strong>Official Support Email:</strong> <a href="mailto:ranklanrc@gmail.com" className="text-[#e8622c] underline font-bold">ranklanrc@gmail.com</a></div>
            <div><strong>Subject Line:</strong> Refund Request — [Your Email / Paddle Order ID]</div>
            <div><strong>Merchant of Record:</strong> Paddle.com Market Ltd.</div>
            <div><strong>SLA:</strong> 24 Hours Response Guarantee</div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default RefundPolicyPage;
