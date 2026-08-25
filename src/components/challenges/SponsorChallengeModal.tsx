import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Loader2,
  Flame,
  TrendingUp,
  History,
  Crown
} from 'lucide-react';
import { RANKLANCR_PADDLE_PRODUCTS } from '../../config/paddleProducts';
import { openRankLancrCheckout } from '../../services/paddle/paddleService';
import { calculateMinNextSponsorshipBid } from '../../services/challenges/sponsorshipAuctionEngine';
import type { SponsorshipTier, ChallengeSponsorshipAuction } from '../../types/challenge';
import toast from 'react-hot-toast';

interface SponsorChallengeModalProps {
  challengeId: string;
  challengeTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SponsorChallengeModal: React.FC<SponsorChallengeModalProps> = ({
  challengeId,
  challengeTitle,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [selectedTier, setSelectedTier] = useState<'bronze' | 'silver' | 'gold_auction'>('gold_auction');
  const [companyName, setCompanyName] = useState('');
  const [companyLogoUrl, setCompanyLogoUrl] = useState('');
  const [companyLink, setCompanyLink] = useState('');
  const [customBidDollars, setCustomBidDollars] = useState<number>(150);
  const [auctionSlot, setAuctionSlot] = useState<ChallengeSponsorshipAuction | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    async function loadAuctionState() {
      try {
        const res = await fetch(`/api/challenges?id=${challengeId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.sponsorshipAuction) {
            setAuctionSlot(data.sponsorshipAuction);
            const minNext = calculateMinNextSponsorshipBid(data.sponsorshipAuction.currentBidCents);
            setCustomBidDollars(Math.round(minNext / 100));
          }
        }
      } catch (err) {
        console.warn('Failed to load live auction data:', err);
      }
    }

    loadAuctionState();
  }, [isOpen, challengeId]);

  if (!isOpen) return null;

  const currentBidDollars = Math.round((auctionSlot?.currentBidCents || 12500) / 100);
  const minRequiredNextDollars = Math.round(calculateMinNextSponsorshipBid(auctionSlot?.currentBidCents || 12500) / 100);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      setErrorMsg('Please enter your company / brand name.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      if (selectedTier === 'gold_auction') {
        // Ascending Outbid Auction Checkout
        if (customBidDollars < minRequiredNextDollars) {
          setErrorMsg(`Your bid ($${customBidDollars}) must be at least the minimum qualifying outbid of $${minRequiredNextDollars}.`);
          setLoading(false);
          return;
        }

        const res = await fetch('/api/challenges?route=sponsor-auction-bid', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            challengeId,
            amountCents: customBidDollars * 100,
            companyName: companyName.trim(),
            companyLogoUrl: companyLogoUrl.trim() || undefined,
            companyLink: companyLink.trim() || undefined
          })
        });

        const data = await res.json();
        if (!res.ok || data.error) {
          setErrorMsg(data.error || 'Failed to place auction outbid.');
          toast.error(data.error || 'Outbid failed.');
          return;
        }

        toast.success(`Outbid placed! ${companyName} is now the leading sponsor at $${customBidDollars}!`);
      } else {
        // Fixed Tier Checkout (Bronze or Silver) via Paddle
        const priceId = selectedTier === 'bronze' 
          ? RANKLANCR_PADDLE_PRODUCTS.bronzeSponsorship.priceId 
          : RANKLANCR_PADDLE_PRODUCTS.silverSponsorship.priceId;

        await openRankLancrCheckout({
          priceId,
          customData: {
            challengeId,
            tier: selectedTier,
            companyName: companyName.trim(),
            companyLogoUrl: companyLogoUrl.trim() || undefined,
            companyLink: companyLink.trim() || undefined
          },
          successUrl: `${window.location.origin}/welcome`
        });

        toast.success(`Opening Paddle Checkout for ${companyName}!`);
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
      toast.error('Network error during checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn font-sans">
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white border-2 border-black w-full max-w-2xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 border border-black bg-white hover:bg-black hover:text-white transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-black text-white text-[10px] font-mono font-bold uppercase">
            <Flame className="w-3.5 h-3.5 text-[#e8622c] fill-[#e8622c]" />
            <span>BRAND SPONSORSHIP • ASCENDING AUCTION ARENA</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Sponsor Challenge Arena
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Claim flagship brand placement or outbid competing sponsors on: <strong className="text-black">{challengeTitle}</strong>
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-300 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleCheckout} className="space-y-6">
          
          {/* Tier Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
              Select Sponsorship Format
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Gold Flagship Ascending Auction */}
              <button
                type="button"
                onClick={() => setSelectedTier('gold_auction')}
                className={`p-4 border-2 text-left transition flex flex-col justify-between relative cursor-pointer ${
                  selectedTier === 'gold_auction'
                    ? 'border-black bg-orange-50 shadow-[4px_4px_0px_0px_#e8622c]'
                    : 'border-slate-300 bg-white hover:border-black'
                }`}
              >
                <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-[#e8622c] text-white font-mono text-[9px] font-bold animate-pulse">
                  LIVE AUCTION
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-[#e8622c] flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-500 fill-amber-400" />
                    GOLD (AUCTION)
                  </div>
                  <div className="text-xl font-black text-black my-1">${currentBidDollars}</div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    48h co-branded Top Developer rail with winner
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] font-mono text-amber-900 font-bold">
                  Min next outbid: ${minRequiredNextDollars}
                </div>
              </button>

              {/* Silver Fixed */}
              <button
                type="button"
                onClick={() => setSelectedTier('silver')}
                className={`p-4 border-2 text-left transition flex flex-col justify-between cursor-pointer ${
                  selectedTier === 'silver'
                    ? 'border-black bg-slate-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    : 'border-slate-300 bg-white hover:border-black'
                }`}
              >
                <div>
                  <div className="text-xs font-mono font-bold text-slate-700">SILVER (FIXED)</div>
                  <div className="text-xl font-black text-black my-1">$150</div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    Homepage card logo & arena callout
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] font-mono text-slate-500">
                  Instant fixed slot
                </div>
              </button>

              {/* Bronze Fixed */}
              <button
                type="button"
                onClick={() => setSelectedTier('bronze')}
                className={`p-4 border-2 text-left transition flex flex-col justify-between cursor-pointer ${
                  selectedTier === 'bronze'
                    ? 'border-black bg-amber-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    : 'border-slate-300 bg-white hover:border-black'
                }`}
              >
                <div>
                  <div className="text-xs font-mono font-bold text-amber-800">BRONZE (FIXED)</div>
                  <div className="text-xl font-black text-black my-1">$50</div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    Arena page banner & "Sponsored by"
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] font-mono text-slate-500">
                  Instant fixed slot
                </div>
              </button>

            </div>
          </div>

          {/* Interactive Bidding Input for Gold Auction */}
          {selectedTier === 'gold_auction' && (
            <div className="p-4 bg-orange-50 border-2 border-black space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#e8622c] fill-[#e8622c]" />
                  <span className="font-mono text-xs font-bold uppercase text-black">
                    Outbid Leading Sponsor ({auctionSlot?.currentSponsorName || 'Current Holder'})
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-600">
                  Current: ${currentBidDollars}
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                  Your Outbid Amount ($ USD) — Minimum: ${minRequiredNextDollars}
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-2.5 text-sm font-bold text-slate-500 font-mono">$</span>
                    <input
                      type="number"
                      min={minRequiredNextDollars}
                      step={5}
                      value={customBidDollars}
                      onChange={(e) => setCustomBidDollars(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full pl-8 pr-3.5 py-2.5 border-2 border-black text-sm bg-white font-mono font-black text-black focus:outline-hidden focus:ring-2 focus:ring-[#e8622c]"
                    />
                  </div>

                  {/* Quick Bid Increment Buttons */}
                  <button
                    type="button"
                    onClick={() => setCustomBidDollars(minRequiredNextDollars)}
                    className="px-3 py-2.5 bg-white hover:bg-slate-100 border-2 border-black text-xs font-mono font-bold cursor-pointer"
                  >
                    Min (${minRequiredNextDollars})
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomBidDollars(minRequiredNextDollars + 50)}
                    className="px-3 py-2.5 bg-white hover:bg-slate-100 border-2 border-black text-xs font-mono font-bold cursor-pointer"
                  >
                    + $50
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomBidDollars(minRequiredNextDollars + 100)}
                    className="px-3 py-2.5 bg-white hover:bg-slate-100 border-2 border-black text-xs font-mono font-bold cursor-pointer"
                  >
                    + $100
                  </button>
                </div>
              </div>

              {/* Recent Bids Feed */}
              {auctionSlot?.recentBids && auctionSlot.recentBids.length > 0 && (
                <div className="pt-2 border-t border-orange-200">
                  <div className="text-[11px] font-mono font-bold text-slate-600 flex items-center gap-1 mb-2">
                    <History className="w-3 h-3" />
                    <span>Recent Bidding Activity:</span>
                  </div>
                  <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                    {auctionSlot.recentBids.slice(0, 3).map((b) => (
                      <div key={b.id} className="text-[11px] font-mono flex items-center justify-between text-slate-700 bg-white/80 px-2 py-1 border border-orange-200">
                        <span className="font-bold">{b.companyName}</span>
                        <span className="font-black text-[#e8622c]">${(b.amountCents / 100).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Company Details Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                Company / Brand Name *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Supastack AI, Acme Inc."
                className="w-full px-3.5 py-2.5 border-2 border-black text-sm bg-white font-medium focus:outline-hidden focus:ring-2 focus:ring-[#e8622c]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                  Logo URL (Optional)
                </label>
                <input
                  type="url"
                  value={companyLogoUrl}
                  onChange={(e) => setCompanyLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3.5 py-2.5 border-2 border-black text-sm bg-white font-medium focus:outline-hidden focus:ring-2 focus:ring-[#e8622c]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                  Destination Link (Optional)
                </label>
                <input
                  type="url"
                  value={companyLink}
                  onChange={(e) => setCompanyLink(e.target.value)}
                  placeholder="https://yourbrand.com"
                  className="w-full px-3.5 py-2.5 border-2 border-black text-sm bg-white font-medium focus:outline-hidden focus:ring-2 focus:ring-[#e8622c]"
                />
              </div>
            </div>
          </div>

          {/* Legal / Non-influence Notice */}
          <div className="p-3 bg-amber-50/70 border border-amber-300 text-[11px] font-mono text-amber-900 leading-relaxed">
            <strong>Auction & Non-Influence Policy:</strong> Bids are final and non-refundable. Outbid sponsors are replaced on the live leaderboard. Sponsors <strong>never</strong> influence public voting, scoring, or winner selection.
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Payment...</span>
              </>
            ) : selectedTier === 'gold_auction' ? (
              <>
                <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>[ PLACE OUTBID — ${customBidDollars}.00 USD ]</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>[ CLAIM {selectedTier.toUpperCase()} — {selectedTier === 'bronze' ? '$50.00' : '$150.00'} USD ]</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default SponsorChallengeModal;
