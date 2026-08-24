import React, { useState } from 'react';
import { X, Flame, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { PromotedCampaign } from '../../types/promotedAuction';
import toast from 'react-hot-toast';

interface OutbidModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: PromotedCampaign | null;
  onSuccess?: () => void;
}

export const OutbidModal: React.FC<OutbidModalProps> = ({
  isOpen,
  onClose,
  campaign,
  onSuccess
}) => {
  const { user } = useAuth();
  const currentBid = campaign ? Number(campaign.currentBid) || 2 : 2;
  const suggestedMin = currentBid + 1;

  const [bidAmount, setBidAmount] = useState<number>(suggestedMin);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !campaign) return null;

  const handleOutbidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please sign in to place an auction bid');
      return;
    }

    if (bidAmount <= currentBid) {
      toast.error(`Bid amount must be greater than current bid ($${currentBid})`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/promotions/auction/bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: campaign.id,
          userId: user.id,
          bidderName: user.name || 'Advertiser',
          amount: bidAmount
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to place outbid');
      }

      toast.success(`⚡ Outbid successful! Current bid updated to $${bidAmount}`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Error placing outbid');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        
        {/* Header */}
        <div className="bg-black text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 fill-[#e8622c] text-[#e8622c]" />
            <h3 className="font-black text-sm uppercase font-mono tracking-tight">Outbid / Raise Placement</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Campaign Info */}
        <div className="p-4 bg-slate-50 border-b-2 border-black space-y-1">
          <div className="text-[10px] font-mono font-bold uppercase text-slate-500">Target Promoted Placement</div>
          <div className="font-black text-sm text-black">{campaign.title}</div>
          <div className="text-xs font-mono text-[#e8622c] font-bold">
            {campaign.authorName} • Current Position #{campaign.currentPosition}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleOutbidSubmit} className="p-5 space-y-4">
          
          {/* Bid Comparison Card */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-orange-50/60 border-2 border-black">
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Current Bid</div>
              <div className="text-2xl font-black text-black">${currentBid}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Min Next Bid</div>
              <div className="text-2xl font-black text-[#e8622c]">${suggestedMin}</div>
            </div>
          </div>

          {/* Quick Increment Buttons */}
          <div>
            <label className="block text-[10px] font-mono text-slate-600 font-bold uppercase mb-1.5">
              Quick Increment Options
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setBidAmount(suggestedMin)}
                className={`py-1.5 font-mono text-xs font-bold border-2 transition cursor-pointer ${
                  bidAmount === suggestedMin ? 'bg-black text-white border-black' : 'bg-white border-slate-300 hover:border-black'
                }`}
              >
                + $1 (${suggestedMin})
              </button>
              <button
                type="button"
                onClick={() => setBidAmount(currentBid + 5)}
                className={`py-1.5 font-mono text-xs font-bold border-2 transition cursor-pointer ${
                  bidAmount === currentBid + 5 ? 'bg-black text-white border-black' : 'bg-white border-slate-300 hover:border-black'
                }`}
              >
                + $5 (${currentBid + 5})
              </button>
              <button
                type="button"
                onClick={() => setBidAmount(currentBid + 10)}
                className={`py-1.5 font-mono text-xs font-bold border-2 transition cursor-pointer ${
                  bidAmount === currentBid + 10 ? 'bg-black text-white border-black' : 'bg-white border-slate-300 hover:border-black'
                }`}
              >
                + $10 (${currentBid + 10})
              </button>
            </div>
          </div>

          {/* Custom Bid Input */}
          <div>
            <label className="block text-[10px] font-mono text-black font-bold uppercase mb-1">
              Custom Bid Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 font-black text-sm text-black">$</span>
              <input
                type="number"
                min={suggestedMin}
                step="1"
                value={bidAmount}
                onChange={(e) => setBidAmount(Math.max(suggestedMin, Number(e.target.value) || suggestedMin))}
                className="w-full pl-7 pr-3 py-2 bg-white border-2 border-black text-base font-black font-mono focus:outline-hidden focus:border-[#e8622c]"
                required
              />
            </div>
          </div>

          {/* ProRank Safety Notice */}
          <div className="text-[10px] font-mono text-slate-600 bg-slate-100 p-2.5 border border-black/20 space-y-1">
            <div className="font-bold text-black flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>ProRank Independence Guarantee</span>
            </div>
            <p>
              Your organic ProRank position and talent score remain 100% untouched. This auction only sets your sponsored visibility tier.
            </p>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting || bidAmount <= currentBid}
            className="w-full py-3 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-black uppercase transition cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>PROCESSING OUTBID...</span>
            ) : (
              <>
                <span>[ ⚡ SUBMIT OUTBID — ${bidAmount} ]</span>
                <ArrowUpRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
