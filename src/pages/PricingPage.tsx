import React, { useState, useEffect } from 'react';
import { Trophy, Flame, Building2, Check, ArrowRight, ShieldCheck, ArrowLeft, Loader2, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/pixelpush/Navbar';
import { Footer } from '../components/pixelpush/Footer';
import { useAuth } from '../context/AuthContext';
import { RANKLANCR_PADDLE_PRODUCTS } from '../config/paddleProducts';
import { openRankLancrCheckout, getLocalizedPricePreviews } from '../services/paddle/paddleService';
import toast from 'react-hot-toast';

export const PricingPage: React.FC = () => {
  const { user } = useAuth();

  const [localizedPrices, setLocalizedPrices] = useState<Record<string, string>>({
    [RANKLANCR_PADDLE_PRODUCTS.challengeEntry.priceId]: '$5.00',
    [RANKLANCR_PADDLE_PRODUCTS.bronzeSponsorship.priceId]: '$50.00',
    [RANKLANCR_PADDLE_PRODUCTS.silverSponsorship.priceId]: '$150.00',
    [RANKLANCR_PADDLE_PRODUCTS.goldSponsorship.priceId]: '$100.00'
  });

  const [loadingCheckoutPriceId, setLoadingCheckoutPriceId] = useState<string | null>(null);

  useEffect(() => {
    async function loadPrices() {
      const priceIds = [
        RANKLANCR_PADDLE_PRODUCTS.challengeEntry.priceId,
        RANKLANCR_PADDLE_PRODUCTS.bronzeSponsorship.priceId,
        RANKLANCR_PADDLE_PRODUCTS.silverSponsorship.priceId,
        RANKLANCR_PADDLE_PRODUCTS.goldSponsorship.priceId
      ];
      const preview = await getLocalizedPricePreviews(priceIds);
      if (Object.keys(preview).length > 0) {
        setLocalizedPrices(prev => ({ ...prev, ...preview }));
      }
    }
    loadPrices();
  }, []);

  const handleCheckout = async (priceId: string, customData?: Record<string, any>) => {
    setLoadingCheckoutPriceId(priceId);
    try {
      await openRankLancrCheckout({
        priceId,
        customerEmail: user?.email || undefined,
        customData: {
          ...customData,
          userId: user?.id
        }
      });
    } catch (err: any) {
      toast.error('Failed to open checkout: ' + (err.message || 'Error'));
    } finally {
      setLoadingCheckoutPriceId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-[#e8622c] selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-8 w-full">
        
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
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>TRANSPARENT ONE-OFF PRICING</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-black">
            Challenge Entries & Visibility Placements
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Pay a simple $5 fee to enter skill challenges, or secure paid promotional visibility to showcase your tools to high-intent developers. Zero subscriptions or hidden cuts.
          </p>
        </div>

        {/* Persistent Compliance Disclosure Banner */}
        <div className="max-w-3xl mx-auto p-4 bg-amber-50/90 border-2 border-black font-mono text-xs text-amber-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#e8622c] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Skill Competition Compliance Notice:</strong> RankLancr is a skill-based portfolio competition. Placement is determined entirely by community votes — never by chance, luck, or payment amount. Entry fees fund platform operations; <strong>there is no cash prize and no monetary payout to any participant.</strong>
          </div>
        </div>

        {/* 3-Column Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          
          {/* Card 1: Challenge Entry Fee ($5) */}
          <div className="bg-white border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-block px-2.5 py-0.5 bg-black text-white font-mono text-[10px] font-bold uppercase">
                COMMUNITY ARENA
              </div>
              <div>
                <h3 className="text-xl font-black text-black">Skill Challenge Entry</h3>
                <p className="text-xs text-slate-600 mt-1">Per-challenge entry ticket to submit your project and compete for 72h visibility.</p>
              </div>

              <div className="text-4xl font-black text-black font-mono">
                {localizedPrices[RANKLANCR_PADDLE_PRODUCTS.challengeEntry.priceId] || '$5.00'}{' '}
                <span className="text-xs font-normal text-slate-500 font-sans">/ entry</span>
              </div>

              <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Right to submit 1 project repo/demo</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% public community merit voting</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Top creator earns 72h site-wide rail placement</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Permanent verified badge on creator profile</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleCheckout(RANKLANCR_PADDLE_PRODUCTS.challengeEntry.priceId, { type: 'challenge_entry' })}
              disabled={loadingCheckoutPriceId === RANKLANCR_PADDLE_PRODUCTS.challengeEntry.priceId}
              className="w-full py-3.5 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider transition text-center border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loadingCheckoutPriceId === RANKLANCR_PADDLE_PRODUCTS.challengeEntry.priceId ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>[ ENTER CHALLENGE ({localizedPrices[RANKLANCR_PADDLE_PRODUCTS.challengeEntry.priceId] || '$5.00'}) ]</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Card 2: Outbid Spotlight ($5+ Floor) */}
          <div className="bg-white border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-block px-2.5 py-0.5 bg-blue-600 text-white font-mono text-[10px] font-bold uppercase">
                HOMEPAGE SPOTLIGHT
              </div>
              <div>
                <h3 className="text-xl font-black text-black">Spotlight Placements</h3>
                <p className="text-xs text-slate-600 mt-1">Paid promotional cards on the homepage held for 72 hours.</p>
              </div>

              <div className="text-4xl font-black text-black font-mono">
                $5.00+{' '}
                <span className="text-xs font-normal text-slate-500 font-sans">/ 72h hold</span>
              </div>

              <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct link & card on homepage</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Guaranteed 72-hour visibility hold</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Transparent outbid increment (+5% / +$1)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Decoupled from challenge judging</span>
                </li>
              </ul>
            </div>

            <Link
              to="/spotlight"
              className="w-full py-3.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold uppercase tracking-wider transition text-center border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2"
            >
              <span>[ VIEW SPOTLIGHT ]</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3: Arena Co-Sponsorship Placement ($50+) */}
          <div className="bg-orange-50 border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_#e8622c] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-block px-2.5 py-0.5 bg-[#e8622c] text-white font-mono text-[10px] font-bold uppercase">
                CO-SPONSORSHIP AUCTION
              </div>
              <div>
                <h3 className="text-xl font-black text-black">Arena Co-Sponsorship</h3>
                <p className="text-xs text-slate-600 mt-1">Ascending live outbid auction for exclusive 48h co-branding with the challenge winner.</p>
              </div>

              <div className="text-4xl font-black text-black font-mono">
                $50.00+{' '}
                <span className="text-xs font-normal text-slate-500 font-sans">Floor</span>
              </div>

              <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-orange-200">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#e8622c] shrink-0" />
                  <span><strong>48h Top Developer Rail:</strong> Promoted with winner</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#e8622c] shrink-0" />
                  <span>Brand logo, description & destination link</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#e8622c] shrink-0" />
                  <span>Outbid ascending auction (+5% / +$1 min)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#e8622c] shrink-0" />
                  <span>Zero influence over challenge outcomes</span>
                </li>
              </ul>
            </div>

            <Link
              to="/arena"
              className="w-full py-3.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold uppercase tracking-wider transition text-center border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2"
            >
              <span>[ SPONSOR ARENA ]</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

        {/* Merchant & Security Disclosures */}
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
          <h3 className="text-sm font-black text-black font-mono uppercase flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Authorized Merchant of Record & Checkout Disclosures</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700 leading-relaxed">
            <div>
              <p><strong>Currency & Taxes:</strong> Prices are displayed in USD with automatic tax/VAT calculation via Lemon Squeezy.</p>
              <p className="mt-1"><strong>Payment Methods:</strong> Visa, MasterCard, AMEX, Discover, PayPal, and Apple Pay.</p>
            </div>
            <div>
              <p><strong>Delivery:</strong> Digital submission access and brand visibility placements activate immediately upon transaction completion.</p>
              <p className="mt-1"><strong>Official Support:</strong> <a href="mailto:ranklancr@gmail.com" className="text-[#e8622c] underline font-bold font-mono">ranklancr@gmail.com</a></p>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
