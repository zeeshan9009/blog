import React, { useState } from 'react';
import { X, Flame, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PlatformBrandIcon } from '../brand/PlatformBrandIcon';
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
  const [email, setEmail] = useState(user?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !campaign) return null;

  const handleOutbidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (bidAmount <= currentBid) {
      toast.error(`Bid amount must be greater than current bid ($${currentBid})`);
      return;
    }

    if (!user && (!email.trim() || !email.includes('@'))) {
      toast.error('Please provide a valid email for outbid alerts & receipt');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/promotions/auction/bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: campaign.id,
          userId: user?.id,
          bidderName: user?.name || email.trim() || 'Advertiser',
          email: email.trim(),
          amount: bidAmount
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to place outbid');
      }

      toast.success(`⚡ Outbid successful! Bid raised to $${bidAmount}`);
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
        <div className="p-4 bg-slate-50 border-b-2 border-black flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 border border-black bg-white flex items-center justify-center shrink-0">
              <PlatformBrandIcon platform={campaign.destinationType} className="w-4 h-4 text-black" />
            </div>
            <div className="min-w-0">
              <div className="font-black text-xs text-black truncate">{campaign.authorName}</div>
              <div className="text-[10px] font-mono text-slate-500 truncate">{campaign.title}</div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">Current Bid</div>
            <div className="font-mono font-black text-sm text-[#e8622c]">${currentBid}</div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleOutbidSubmit} className="p-5 space-y-4 font-mono">
          
          {/* Outbid Calculator */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold uppercase text-black">
              <span>Your New Bid Amount</span>
              <span className="text-slate-500 font-normal">Min to Outbid: ${suggestedMin}</span>
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-base text-black">$</span>
              <input
                type="number"
                min={suggestedMin}
                step="1"
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border-2 border-black font-black text-base text-black focus:outline-hidden focus:border-[#e8622c]"
                required
              />
            </div>
          </div>

          {/* Email input for guest outbidding */}
          {!user && (
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase text-black">
                Your Email (for receipt & management link) <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full p-2.5 bg-slate-50 border-2 border-black text-xs font-bold text-black focus:outline-hidden focus:border-[#e8622c]"
                required
              />
            </div>
          )}

          {/* Action button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#e8622c] hover:bg-black text-white text-xs font-black uppercase transition cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>PROCESSING OUTBID...</span>
            ) : (
              <>
                <span>[ ⚡ CONFIRM OUTBID FOR ${bidAmount} ]</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-[10px] text-slate-500 text-center">
            Zero login required • Instant real-time leaderboard update
          </div>
        </form>

      </div>
    </div>
  );
};

export default OutbidModal;
