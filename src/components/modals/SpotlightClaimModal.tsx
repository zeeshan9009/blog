import React, { useState, useMemo } from 'react';
import { X, Flame, ShieldAlert, CheckCircle2, ArrowRight, Zap, ExternalLink, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTalent } from '../../context/TalentContext';
import { autoDetectPlatformAndValidate } from '../../services/validation/externalProfileValidator.js';
import { PlatformBrandIcon } from '../brand/PlatformBrandIcon';
import type { SpotlightSlot } from '../../types/spotlight';
import toast from 'react-hot-toast';

interface SpotlightClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: SpotlightSlot | null;
  onSuccess?: () => void;
}

export const SpotlightClaimModal: React.FC<SpotlightClaimModalProps> = ({
  isOpen,
  onClose,
  slot,
  onSuccess
}) => {
  const { user } = useAuth();
  const { professionals } = useTalent();

  const userProfile = professionals.find(p => p.userId === user?.id || p.id === user?.id);

  const initialPriceCents = slot?.nextMinimumBidCents || (slot?.currentPriceCents ? slot.currentPriceCents + 100 : 600);
  const minRequiredBidCents = slot?.nextMinimumBidCents || 600;

  const [destinationUrl, setDestinationUrl] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [bidAmountCents, setBidAmountCents] = useState<number>(initialPriceCents);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-detect platform and logo
  const detection = useMemo(() => {
    if (!destinationUrl.trim()) return null;
    return autoDetectPlatformAndValidate(destinationUrl);
  }, [destinationUrl]);

  if (!isOpen || !slot) return null;

  const currentPriceFormatted = (slot.currentPriceCents / 100).toFixed(2);
  const minRequiredBidFormatted = (minRequiredBidCents / 100).toFixed(2);
  const yourBidFormatted = (bidAmountCents / 100).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!destinationUrl.trim()) {
      toast.error('Please enter your profile URL');
      return;
    }

    const validation = autoDetectPlatformAndValidate(destinationUrl);
    if (!validation.isValid || !validation.sanitizedUrl) {
      toast.error(validation.error || 'Please enter a valid HTTPS profile URL');
      return;
    }

    if (!user && (!email.trim() || !email.includes('@'))) {
      toast.error('Valid email is required for outbid notifications and claim receipt');
      return;
    }

    if (bidAmountCents < minRequiredBidCents) {
      toast.error(`Minimum bid to claim this slot is $${minRequiredBidFormatted}`);
      return;
    }

    setIsSubmitting(true);
    try {
      let author = user?.name || userProfile?.name;
      if (!author) {
        try {
          const parsed = new URL(validation.sanitizedUrl);
          const parts = parsed.pathname.split('/').filter(Boolean);
          author = parts[parts.length - 1] || 'Specialist';
        } catch {
          author = 'Specialist';
        }
      }

      const res = await fetch('/api/spotlight/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId: slot.id,
          profileId: user?.id || userProfile?.id,
          authorName: author,
          email: email.trim(),
          title: userProfile?.title || `${validation.platformName} Specialist`,
          destinationUrl: validation.sanitizedUrl,
          bidAmountCents
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to claim spotlight slot');
      }

      toast.success(`🔥 Congratulations! You now hold Spotlight Slot #${slot.position}!`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Error claiming slot');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn font-mono">
      <div className="relative w-full max-w-md bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        
        {/* Header */}
        <div className="bg-black text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 fill-amber-400 text-amber-400" />
            <h3 className="font-black text-sm sm:text-base uppercase tracking-tight">
              Claim Spotlight #{slot.position}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slot Info Card */}
        <div className="p-4 bg-amber-50 border-b-2 border-black flex items-center justify-between gap-3">
          <div>
            <span className="px-2 py-0.5 bg-amber-400 text-black text-[10px] font-black uppercase">
              {slot.scope === 'global' ? 'Global Leaderboard' : `${slot.category} Leaderboard`}
            </span>
            <div className="font-black text-sm text-black mt-1">
              Position #{slot.position} Spotlight Slot
            </div>
            <div className="text-[10px] text-slate-600">
              Current Holder: <strong>{slot.currentHolderName || 'Open / Unclaimed'}</strong>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Current Price</div>
            <div className="font-black text-sm text-black line-through text-slate-400">
              ${currentPriceFormatted}
            </div>
            <div className="text-xs font-black text-[#e8622c]">
              Min: ${minRequiredBidFormatted}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          
          {/* 1. Profile URL */}
          <div className="space-y-1.5">
            <label className="block text-[11px] text-black font-bold uppercase">
              1. Profile URL <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🔗</span>
              <input
                type="text"
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                placeholder="https://www.linkedin.com/in/username"
                className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border-2 border-black text-xs font-bold text-black focus:outline-hidden focus:border-[#e8622c]"
                required
              />
            </div>

            {/* Platform indicator */}
            {detection && detection.isValid && (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2.5 py-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <PlatformBrandIcon platform={detection.platform} className="w-4 h-4 text-emerald-800 shrink-0" />
                <span>✓ {detection.platformName} detected</span>
              </div>
            )}
          </div>

          {/* 2. Bid Amount (in Dollars) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase text-black">
              <span>2. Your Bid Amount (USD)</span>
              <span className="text-[#e8622c]">Min: ${minRequiredBidFormatted}</span>
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-base text-black">$</span>
              <input
                type="number"
                min={minRequiredBidCents / 100}
                step="1"
                value={bidAmountCents / 100}
                onChange={(e) => setBidAmountCents(Math.round(Number(e.target.value) * 100))}
                className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border-2 border-black font-black text-base text-black focus:outline-hidden focus:border-[#e8622c]"
                required
              />
            </div>
          </div>

          {/* 3. Email Input */}
          {!user && (
            <div className="space-y-1.5">
              <label className="block text-[11px] text-black font-bold uppercase">
                3. Your Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full p-2.5 bg-slate-50 border-2 border-black text-xs font-bold text-black focus:outline-hidden focus:border-[#e8622c]"
                required
              />
              <span className="text-[10px] text-slate-500 block">
                Required for instant outbid alerts and receipt.
              </span>
            </div>
          )}

          {/* Explicit No-Refund Displacement Notice */}
          <div className="p-3 bg-amber-50/80 border border-amber-300 text-[10px] text-amber-900 leading-relaxed flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Ascending Auction Policy:</strong> You receive a guaranteed <strong>72-hour hold</strong>. If another freelancer outbids this price, you will be displaced without refund (standard Outbid mechanics).
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#e8622c] hover:bg-black text-white text-xs font-black uppercase transition cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>PROCESSING OUTBID CLAIM...</span>
            ) : (
              <>
                <span>[ 🔥 CLAIM SPOTLIGHT FOR ${yourBidFormatted} ]</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default SpotlightClaimModal;
