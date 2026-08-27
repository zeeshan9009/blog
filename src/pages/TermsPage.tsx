import React from 'react';
import { Navbar } from '../components/pixelpush/Navbar';
import { Footer } from '../components/pixelpush/Footer';
import { ShieldCheck, Flame, Scale, FileText, AlertTriangle, Trophy, Building2 } from 'lucide-react';

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
            Terms of Service & Challenge Arena Rules
          </h1>
          <p className="text-xs text-slate-600">
            Last Updated: August 2026 • RankLancr Challenge-First Protocol
          </p>
        </div>

        {/* Section 1: Challenge Arena Rules & No Cash Prize Notice */}
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-black text-black uppercase">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>1. Challenge Arena Architecture (Visibility Rewards Only — No Cash Payouts)</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            RankLancr operates skill-based challenge competitions. <strong>All rewards awarded to winners and top 3 participants are strictly visibility-based</strong> (specifically, 72-hour site-wide Top Developer Rail placement, permanent profile badges, and automated social media broadcasts). <strong>No cash prizes or monetary distributions are paid out</strong> under any circumstances.
          </p>
        </div>

        {/* Section 2: Fixed $5 Entry Fee Policy */}
        <div className="bg-amber-50/80 border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <div className="flex items-center gap-2 text-sm font-black text-black uppercase">
            <AlertTriangle className="w-4 h-4 text-[#e8622c]" />
            <span>2. Fixed $5.00 Entry Fee (Strict Non-Refundable Policy)</span>
          </div>
          
          <div className="p-3.5 bg-white border border-amber-300 text-xs text-amber-950 space-y-2">
            <p className="leading-relaxed">
              Entering a challenge requires a <strong>fixed $5.00 entry fee</strong>:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-800 pt-1">
              <li><strong>Non-Refundable:</strong> Entry fees are pure platform service fees that fund platform maintenance and verification infrastructure. They are non-refundable once paid.</li>
              <li><strong>Submission Right Only:</strong> Paying the entry fee unlocks the eligibility to submit one project during the challenge submission window. It <strong>never</strong> buys votes, improves ranking, or guarantees placement.</li>
              <li><strong>Disqualification:</strong> Submissions violating anti-abuse policies (e.g. malicious URLs or bot-voting manipulation) will be disqualified without refund.</li>
            </ul>
          </div>
        </div>

        {/* Section 3: Company Sponsorship Non-Influence & Ascending Auction Policy */}
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-black text-black uppercase">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>3. Brand Sponsorship & Gold Ascending Auction Policy</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Companies and tool creators may purchase Bronze ($50) or Silver ($150) fixed sponsorships, or compete in the <strong>Gold Flagship Ascending Outbid Auction</strong> (floor $100, minimum +$25 / +10% increment).
          </p>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-800 pt-1">
            <li><strong>Displacement & No Refunds:</strong> Outbid bids are non-refundable and purchase visibility for the duration held on the live leaderboard. Highest bidder at the close of the bidding window claims the 72h co-branded Top Developer rail placement.</li>
            <li><strong>Strict Non-Influence Policy:</strong> Sponsorship payments purchase brand advertising placement only. <strong>Sponsors have zero influence over community voting, algorithmic ranking, or winner selection.</strong></li>
          </ul>
        </div>

        {/* Section 4: Outbid Spotlight Ascending Auction Policy */}
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-black text-black uppercase">
            <Flame className="w-4 h-4 text-[#e8622c] fill-[#e8622c]" />
            <span>4. Outbid Spotlight Ascending Auction Policy</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Spotlight leaderboard slots are claimed via ascending auction. Holding a slot guarantees placement for up to 72 hours or until outbid by another party (+5% / +$1.00 min increment). Bids are final and non-refundable.
          </p>
        </div>

        {/* Section 5: Anti-Abuse & Rate Limiting */}
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-black text-black uppercase">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>5. Anti-Abuse & Voter Fingerprint Verification</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Voting is limited to 1 vote per verified browser/device fingerprint per submission, and rate-limited to 5 votes per minute per IP. Scripted, automated, or sybil vote attempts are filtered and discarded.
          </p>
        </div>

        {/* Section 6: Digital Delivery & Intellectual Property */}
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-black text-black uppercase">
            <Scale className="w-4 h-4 text-purple-600" />
            <span>6. Intellectual Property & Creator Rights</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Participants retain 100% intellectual property ownership of code, designs, and content submitted to challenges. By submitting a project, you grant RankLancr a non-exclusive license to publicly display your submission in the arena and showcase rail.
          </p>
        </div>

        {/* Section 7: Merchant of Record & Support Contact */}
        <div className="bg-orange-50 border-2 border-black p-6 shadow-[4px_4px_0px_0px_#e8622c] space-y-2">
          <div className="flex items-center gap-2 text-sm font-black text-black uppercase">
            <FileText className="w-4 h-4 text-[#e8622c]" />
            <span>7. Merchant of Record & Support Contact</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Our order process is conducted by our online reseller & Merchant of Record <strong>Lemon Squeezy</strong>. Lemon Squeezy provides all customer service inquiries and handles returns.
          </p>
          <p className="text-xs text-slate-700 pt-1">
            For direct platform support or terms inquiries, contact us at <a href="mailto:ranklanrc@gmail.com" className="text-[#e8622c] underline font-bold font-mono">ranklanrc@gmail.com</a>.
          </p>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;
