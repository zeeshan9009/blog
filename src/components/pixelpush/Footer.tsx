import React from 'react';
import { ShieldCheck, Trophy, Sparkles, Flame, Building2, Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1E293B] text-slate-300 font-sans border-t border-slate-700/60">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-16 space-y-12">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Column 1: Brand & Purpose */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-[#FF5A1F] flex items-center justify-center text-white font-bold text-sm">
                R
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                RankLancr<span className="text-[#FF5A1F]">.lol</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              The community skill challenge arena for builders and creators. Compete for $5, win 72h site-wide visibility placements on the Top Developer Rail, and discover elite verified talent with 0% platform cuts.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-white">
              Platform & Arena
            </div>
            <ul className="space-y-2 text-xs text-slate-400 font-normal">
              <li>
                <Link to="/arena" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-[#FF5A1F]" />
                  <span>Challenge Arena ($5 Entry)</span>
                </Link>
              </li>
              <li>
                <Link to="/spotlight" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#FF5A1F]" />
                  <span>Spotlight Placements</span>
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">
                  Pricing & Placement Fees
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Platform & Principles
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Support */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-white">
              Customer Support
            </div>
            <ul className="space-y-2 text-xs text-slate-400 font-normal">
              <li>
                <Link to="/contact" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#FF5A1F]" />
                  <span>Contact Support Desk</span>
                </Link>
              </li>
              <li>
                <a href="mailto:ranklancr@gmail.com" className="hover:text-white transition-colors text-slate-300 font-mono">
                  ranklancr@gmail.com
                </a>
              </li>
              <li className="text-[11px] text-slate-400">
                Response SLA: Within 24-48 Hours
              </li>
              <li>
                <Link to="/refunds" className="hover:text-white transition-colors">
                  Refund & Cancellation Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Compliance & Security Notice */}
          <div className="space-y-3 text-xs text-slate-400 font-normal">
            <div className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Skill & Compliance Notice</span>
            </div>
            <p className="leading-relaxed text-slate-400">
              RankLancr is a skill-based competition platform. Voting is 100% merit-based. <strong className="text-slate-200 font-medium">No cash prizes, odds, or gambling mechanics.</strong>
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-Bit SSL Encrypted Checkout</span>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <span>© 2026 RankLancr • Independent Web Platform. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <span>•</span>
            <Link to="/refunds" className="hover:text-white transition-colors">Refunds</Link>
            <span>•</span>
            <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-white transition-colors">Support</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
