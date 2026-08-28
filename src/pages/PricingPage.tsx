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
    <div className="min-h-screen bg-[#FAFAF9] text-[#1A1A1A] font-sans selection:bg-[#FF5A1F] selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-14 space-y-10 w-full">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#525252] hover:text-[#1A1A1A] mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#E5E5E5] text-[11px] font-semibold text-[#FF5A1F] uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" />
            <span>Transparent Pricing & Placements</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1A1A1A]">
            Challenge Entries & Visibility Placements
          </h1>

          <p className="text-sm sm:text-base text-[#525252] font-normal leading-relaxed">
            Pay a simple $5 fee to enter skill challenges, or secure paid promotional visibility to showcase your tools to high-intent developers. Zero subscriptions or hidden cuts.
          </p>
        </div>

        {/* Persistent Compliance Disclosure Banner */}
        <div className="max-w-3xl mx-auto p-4 bg-white border border-[#E5E5E5] text-xs text-[#525252] flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-[#FF5A1F] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-[#1A1A1A] font-semibold">Skill Competition Compliance Notice:</strong> RankLancr is a skill-based portfolio competition. Placement is determined entirely by community votes — never by chance, luck, or payment amount. Entry fees fund platform operations; <strong className="text-[#1A1A1A] font-semibold">there is no cash prize and no monetary payout to any participant.</strong>
          </div>
        </div>

        {/* 3-Column Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          
          {/* Card 1: Challenge Entry Fee ($5) */}
          <div className="bg-white border border-[#E5E5E5] p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-[#D4D4D4] transition-colors">
            <div className="space-y-4">
              <div className="inline-block px-2 py-0.5 bg-[#FAFAF9] border border-[#E5E5E5] text-[#1A1A1A] text-[10px] font-semibold uppercase tracking-wider">
                COMMUNITY ARENA
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1A1A1A]">Skill Challenge Entry</h3>
                <p className="text-xs text-[#525252] mt-1">Per-challenge entry ticket to submit your project and compete for 72h visibility.</p>
              </div>

              <div className="text-4xl font-bold text-[#1A1A1A] font-mono">
                {localizedPrices[RANKLANCR_PADDLE_PRODUCTS.challengeEntry.priceId] || '$5.00'}{' '}
                <span className="text-xs font-normal text-[#737373] font-sans">/ entry</span>
              </div>

              <ul className="space-y-2.5 text-xs text-[#525252] pt-4 border-t border-[#E5E5E5]">
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
              className="w-full py-3 bg-[#FF5A1F] hover:bg-[#E54E17] text-white text-xs font-semibold transition-colors text-center border border-[#FF5A1F] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loadingCheckoutPriceId === RANKLANCR_PADDLE_PRODUCTS.challengeEntry.priceId ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Enter Challenge ({localizedPrices[RANKLANCR_PADDLE_PRODUCTS.challengeEntry.priceId] || '$5.00'})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Card 2: Outbid Spotlight ($5+ Floor) */}
          <div className="bg-white border border-[#E5E5E5] p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-[#D4D4D4] transition-colors">
            <div className="space-y-4">
              <div className="inline-block px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-semibold uppercase tracking-wider">
                HOMEPAGE SPOTLIGHT
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1A1A1A]">Spotlight Placements</h3>
                <p className="text-xs text-[#525252] mt-1">Paid promotional cards on the homepage held for 72 hours.</p>
              </div>

              <div className="text-4xl font-bold text-[#1A1A1A] font-mono">
                $5.00+{' '}
                <span className="text-xs font-normal text-[#737373] font-sans">/ 72h hold</span>
              </div>

              <ul className="space-y-2.5 text-xs text-[#525252] pt-4 border-t border-[#E5E5E5]">
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
              className="w-full py-3 bg-white hover:bg-[#FAFAF9] text-[#1A1A1A] text-xs font-semibold transition-colors text-center border border-[#1A1A1A] flex items-center justify-center gap-2"
            >
              <span>View Spotlight</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3: Arena Co-Sponsorship Placement ($50+) */}
          <div className="bg-[#FAFAF9] border border-[#FF5A1F]/50 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-block px-2 py-0.5 bg-[#FF5A1F] text-white text-[10px] font-semibold uppercase tracking-wider">
                CO-SPONSORSHIP AUCTION
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1A1A1A]">Arena Co-Sponsorship</h3>
                <p className="text-xs text-[#525252] mt-1">Ascending live outbid auction for exclusive 48h co-branding with the challenge winner.</p>
              </div>

              <div className="text-4xl font-bold text-[#1A1A1A] font-mono">
                $50.00+{' '}
                <span className="text-xs font-normal text-[#737373] font-sans">Floor</span>
              </div>

              <ul className="space-y-2.5 text-xs text-[#525252] pt-4 border-t border-[#E5E5E5]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#FF5A1F] shrink-0" />
                  <span><strong>48h Top Developer Rail:</strong> Promoted with winner</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#FF5A1F] shrink-0" />
                  <span>Brand logo, description & destination link</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#FF5A1F] shrink-0" />
                  <span>Outbid ascending auction (+5% / +$1 min)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#FF5A1F] shrink-0" />
                  <span>Zero influence over challenge outcomes</span>
                </li>
              </ul>
            </div>

            <Link
              to="/arena"
              className="w-full py-3 bg-[#1A1A1A] hover:bg-[#FF5A1F] text-white text-xs font-semibold transition-colors text-center border border-[#1A1A1A] hover:border-[#FF5A1F] flex items-center justify-center gap-2"
            >
              <span>Sponsor Arena</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

        {/* Merchant & Security Disclosures */}
        <div className="bg-white border border-[#E5E5E5] p-6 space-y-3">
          <h3 className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Authorized Merchant of Record & Checkout Disclosures</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#525252] leading-relaxed">
            <div>
              <p><strong>Currency & Taxes:</strong> Prices are displayed in USD with automatic tax/VAT calculation via Lemon Squeezy.</p>
              <p className="mt-1"><strong>Payment Methods:</strong> Visa, MasterCard, AMEX, Discover, PayPal, and Apple Pay.</p>
            </div>
            <div>
              <p><strong>Delivery:</strong> Digital submission access and brand visibility placements activate immediately upon transaction completion.</p>
              <p className="mt-1"><strong>Official Support:</strong> <a href="mailto:ranklancr@gmail.com" className="text-[#FF5A1F] underline font-medium font-mono">ranklancr@gmail.com</a></p>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
