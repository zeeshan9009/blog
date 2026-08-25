import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Trophy, ArrowRight, ShieldCheck, Sparkles, LayoutDashboard } from 'lucide-react';
import { Navbar } from '../components/pixelpush/Navbar';
import { Footer } from '../components/pixelpush/Footer';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-[#e8622c] selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-16 w-full my-auto">
        <div className="bg-white border-2 border-black p-8 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center space-y-6">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 border border-emerald-400 text-emerald-800 font-mono text-xs font-bold uppercase">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>TRANSACTION COMPLETED VIA PADDLE</span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
              You're In! Welcome to the Arena.
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto">
              Your payment has been authorized and your digital submission rights / sponsorship placement are immediately active.
            </p>
          </div>

          {/* Feature Highlights Card */}
          <div className="p-4 bg-orange-50/80 border-2 border-black text-left space-y-3 font-mono text-xs text-black">
            <div className="font-black uppercase text-[#e8622c] flex items-center gap-1.5">
              <Trophy className="w-4 h-4" />
              <span>Next Steps for Creators & Sponsors:</span>
            </div>
            <ul className="space-y-1.5 text-slate-800 list-disc list-inside">
              <li>Navigate to the active <strong>Challenge Arena</strong>.</li>
              <li>Submit your live GitHub repo or project demo link during the submission window.</li>
              <li>Invite colleagues and community peers to vote on your project.</li>
            </ul>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Link
              to="/arena"
              className="py-3.5 px-4 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider transition border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              <span>[ GO TO ARENA ]</span>
            </Link>

            <Link
              to="/dashboard"
              className="py-3.5 px-4 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold uppercase tracking-wider transition border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>[ MY DASHBOARD ]</span>
            </Link>
          </div>

          {/* Receipt Note */}
          <p className="text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-200">
            A digital receipt and order confirmation has been emailed to you by Paddle.com.
          </p>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WelcomePage;
