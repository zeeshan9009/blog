import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Flame, ShieldCheck, Lock, Mail, ExternalLink, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-slate-400 border-t-2 border-black pt-16 pb-12 font-sans selection:bg-[#e8622c] selection:text-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 space-y-12">
        
        {/* Top Callout Banner */}
        <div className="pb-12 border-b border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#e8622c] text-white font-mono text-[10px] font-bold uppercase">
              <Trophy className="w-3.5 h-3.5" />
              <span>COMMUNITY SKILL COMPETITION PLATFORM</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Compete in Skill Arenas. Win 72h Visibility.
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-2xl">
              Pay $5 to enter skill challenges, earn public community votes, and claim site-wide Top Developer Rail showcase placements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/arena"
              className="px-5 py-3 bg-[#e8622c] hover:bg-white text-white hover:text-black font-mono text-xs font-bold transition border border-black shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)]"
            >
              [ BROWSE CHALLENGES ]
            </Link>
            <Link
              to="/pricing"
              className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold transition border border-slate-700"
            >
              View Pricing & Fees
            </Link>
          </div>
        </div>

        {/* 4-Column Navigation & Legal Compliance Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
          
          {/* Column 1: Platform & Arenas */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
              Platform & Arenas
            </div>
            <ul className="space-y-2 font-medium">
              <li>
                <Link to="/arena" className="hover:text-white transition flex items-center gap-1.5 text-amber-400 font-bold">
                  <span>🏆 Challenge Arena</span>
                </Link>
              </li>
              <li>
                <Link to="/spotlight" className="hover:text-white transition flex items-center gap-1.5 text-[#e8622c] font-bold">
                  <span>🔥 Outbid Spotlight (72h)</span>
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition">
                  Pricing & Fee Breakdown ($5 Entry)
                </Link>
              </li>
              <li>
                <Link to="/create-profile" className="hover:text-white transition">
                  Create Creator Passport
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition">
                  User Command Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Legal & Merchant Compliance */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
              Legal & Compliance
            </div>
            <ul className="space-y-2 font-medium">
              <li>
                <Link to="/terms" className="hover:text-white transition">
                  Terms of Service (No Cash Payouts)
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition text-emerald-400 font-bold">
                  Privacy Policy (GDPR / CCPA)
                </Link>
              </li>
              <li>
                <Link to="/refunds" className="hover:text-white transition text-amber-400 font-bold">
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li>
                <Link to="/rules" className="hover:text-white transition">
                  Auction & Fair Play Rules
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Support & Inquiries */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
              Customer Support Desk
            </div>
            <ul className="space-y-2 font-medium">
              <li>
                <Link to="/contact" className="hover:text-white transition flex items-center gap-1 text-white font-bold">
                  <Mail className="w-3.5 h-3.5 text-[#e8622c]" />
                  <span>Contact Support Ticket</span>
                </Link>
              </li>
              <li>
                <a href="mailto:ranklanrc@gmail.com" className="hover:text-white transition font-mono text-[#e8622c]">
                  ranklanrc@gmail.com
                </a>
              </li>
              <li className="text-[11px] text-slate-500 font-mono">
                Response SLA: Within 24-48 Hours
              </li>
              <li className="text-[11px] text-slate-500 font-mono">
                Dispute Desk: Active Mon-Sat
              </li>
            </ul>
          </div>

          {/* Column 4: Merchant of Record (Lemon Squeezy) */}
          <div className="space-y-3 p-4 bg-slate-900/80 border border-slate-800">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Merchant of Record</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Our order process is conducted by our online reseller & Merchant of Record <strong>Lemon Squeezy</strong>.
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center gap-2 font-mono text-[10px] text-slate-400">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>256-Bit SSL Encrypted Checkout</span>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-[#e8622c] flex items-center justify-center text-white text-xs font-black font-mono border border-black">
              R
            </div>
            <span>© 2026 RankLancr.lol Platform Inc. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 font-mono text-[11px]">
            <Link to="/terms" className="hover:text-white transition">Terms</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-white transition">Privacy</Link>
            <span>•</span>
            <Link to="/refunds" className="hover:text-white transition">Refunds</Link>
            <span>•</span>
            <Link to="/pricing" className="hover:text-white transition">Pricing</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-white transition">Support</Link>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
