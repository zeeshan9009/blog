import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Loader2,
  Flame,
  Crown,
  TrendingUp,
  History
} from 'lucide-react';
import { calculateMinNextSponsorshipBid } from '../../services/challenges/sponsorshipAuctionEngine';
import type { ChallengeSponsorshipAuction } from '../../types/challenge';
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
  const [companyName, setCompanyName] = useState('');
  const [companyLogoUrl, setCompanyLogoUrl] = useState('');
  const [companyLink, setCompanyLink] = useState('');
  const [customBidDollars, setCustomBidDollars] = useState<number>(55);
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
            const minNext = calculateMinNextSponsorshipBid(data.sponsorshipAuction.currentBidCents || 5000);
            setCustomBidDollars(Math.round(minNext / 100));
          } else {
            setCustomBidDollars(50);
          }
        }
      } catch (err) {
        console.warn('Failed to load live auction data:', err);
      }
    }

    loadAuctionState();
  }, [isOpen, challengeId]);

  if (!isOpen) return null;

  const currentBidDollars = Math.round((auctionSlot?.currentBidCents || 5000) / 100);
  const minRequiredNextDollars = Math.round(calculateMinNextSponsorshipBid(auctionSlot?.currentBidCents || 5000) / 100);

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      setErrorMsg('Please enter your company or brand name.');
      return;
    }

    if (customBidDollars < minRequiredNextDollars) {
      setErrorMsg(`Your outbid ($${customBidDollars}) must be at least the minimum qualifying outbid of $${minRequiredNextDollars}.`);
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
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
      if (!res.ok) {
        throw new Error(data.error || 'Failed to place sponsorship bid.');
      }

      toast.success(`🎉 High Bid of $${customBidDollars} Placed for ${companyName}!`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
      toast.error(err.message || 'Network error during sponsorship bid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn font-mono">
      <div
        role="dialog"
        aria-modal="true"
        className="bg-[#fffdfa] border-3 border-black w-full max-w-xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 border-2 border-black bg-white hover:bg-slate-100 font-bold flex items-center justify-center cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-6 space-y-2 border-b-2 border-black pb-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-black text-white text-[10px] font-black uppercase">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>CO-BRANDED VISIBILITY PLACEMENT AUCTION</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-black tracking-tight uppercase">
            Bid to Sponsor Arena Visibility
          </h2>

          <p className="text-xs text-slate-600 font-sans leading-relaxed">
            Bid to secure a 48-hour co-branded visibility placement alongside the featured Top Developer. Sponsorship is strictly an advertising placement and carries zero influence over challenge voting or outcomes.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3 bg-red-50 border-2 border-red-400 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleBidSubmit} className="space-y-5">
          
          {/* Current Auction State Box */}
          <div className="bg-amber-50 border-2 border-black p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-600" />
                Current High Bid:
              </div>
              <div className="text-xl font-black text-black">
                ${currentBidDollars} USD
              </div>
            </div>

            {auctionSlot?.currentSponsorName && (
              <div className="text-[11px] text-slate-600 flex items-center justify-between border-t border-amber-200 pt-2">
                <span>Current Holder: <strong>{auctionSlot.currentSponsorName}</strong></span>
                <span className="text-emerald-700 font-bold">Active High Bidder</span>
              </div>
            )}

            <div className="text-[11px] text-slate-600 bg-white border border-black p-2 flex items-center justify-between">
              <span>Minimum Next Outbid (+5% or +$1):</span>
              <strong className="text-[#e8622c]">${minRequiredNextDollars} USD</strong>
            </div>
          </div>

          {/* Bid Amount Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-black uppercase">
              Your Outbid Amount ($ USD):
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-sm text-slate-500">$</span>
              <input
                type="number"
                min={minRequiredNextDollars}
                step={1}
                value={customBidDollars}
                onChange={(e) => setCustomBidDollars(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full pl-8 pr-4 py-2.5 bg-white border-2 border-black font-mono text-sm font-black focus:outline-hidden"
              />
            </div>
            <p className="text-[10px] text-slate-500 font-sans">
              Enter any amount equal to or greater than ${minRequiredNextDollars} USD.
            </p>
          </div>

          {/* Company Details */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-black uppercase">
                Company / Brand Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Acme Corp, Supabase, Vercel"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-2.5 bg-white border-2 border-black font-mono text-xs focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-black uppercase">
                Brand Logo URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://yourcompany.com/logo.png"
                value={companyLogoUrl}
                onChange={(e) => setCompanyLogoUrl(e.target.value)}
                className="w-full p-2.5 bg-white border-2 border-black font-mono text-xs focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-black uppercase">
                Destination Link URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://yourcompany.com"
                value={companyLink}
                onChange={(e) => setCompanyLink(e.target.value)}
                className="w-full p-2.5 bg-white border-2 border-black font-mono text-xs focus:outline-hidden"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t-2 border-black flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-white hover:bg-slate-100 text-black border-2 border-black font-mono text-xs font-bold uppercase cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || customBidDollars < minRequiredNextDollars}
              className="px-6 py-2.5 bg-[#e8622c] hover:bg-black text-white border-2 border-black font-mono text-xs font-black uppercase transition flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Outbid...</span>
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>[ Place Outbid — ${customBidDollars} ]</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default SponsorChallengeModal;
