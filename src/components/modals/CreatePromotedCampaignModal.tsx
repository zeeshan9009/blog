import React, { useState, useMemo } from 'react';
import { X, Flame, CheckCircle2, ArrowRight, Copy, Check, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTalent } from '../../context/TalentContext';
import { autoDetectPlatformAndValidate } from '../../services/validation/externalProfileValidator.js';
import { PlatformBrandIcon } from '../brand/PlatformBrandIcon';
import toast from 'react-hot-toast';

interface CreatePromotedCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  currentHighestBid?: number;
  initialBid?: number;
  initialUrl?: string;
  initialCategory?: string;
}

export const CreatePromotedCampaignModal: React.FC<CreatePromotedCampaignModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentHighestBid = 10,
  initialBid,
  initialUrl = '',
  initialCategory = 'Web Development'
}) => {
  const { user } = useAuth();
  const { professionals } = useTalent();
  const navigate = useNavigate();

  const userProfile = professionals.find(p => p.userId === user?.id || p.id === user?.id);

  const [destinationUrl, setDestinationUrl] = useState(initialUrl);
  const [email, setEmail] = useState(user?.email || '');
  const [bidAmount, setBidAmount] = useState<number>(
    initialBid !== undefined && initialBid >= 2
      ? initialBid
      : Math.max(2, currentHighestBid > 0 ? currentHighestBid + 1 : 2)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdResult, setCreatedResult] = useState<{ managementUrl: string; managementToken: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Live Auto-Detection of Platform & Logo
  const detection = useMemo(() => {
    if (!destinationUrl.trim()) return null;
    return autoDetectPlatformAndValidate(destinationUrl);
  }, [destinationUrl]);

  if (!isOpen) return null;

  const minToTakeNumberOne = currentHighestBid > 0 ? currentHighestBid + 1 : 2;

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

    if (!email.trim() || !email.includes('@')) {
      toast.error('Valid email is required for magic management link and outbid alerts');
      return;
    }

    if (bidAmount < 2) {
      toast.error('Minimum starting bid is $2.00 USD');
      return;
    }

    setIsSubmitting(true);
    try {
      // Clean author/title from profile or URL path
      let author = user?.name || userProfile?.name;
      if (!author) {
        try {
          const parsed = new URL(validation.sanitizedUrl);
          const pathParts = parsed.pathname.split('/').filter(Boolean);
          author = pathParts[pathParts.length - 1] || 'Professional Specialist';
        } catch {
          author = 'Professional Specialist';
        }
      }

      const title = userProfile?.title || `${validation.platformName} Professional`;

      const res = await fetch('/api/promotions/auction/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          profileId: userProfile?.id || user?.id,
          userEmail: email.trim(),
          authorName: author,
          avatarUrl: user?.avatar_url || userProfile?.avatar,
          title,
          description: '',
          destinationType: validation.platform,
          destinationUrl: validation.sanitizedUrl,
          category: initialCategory || 'Web Development',
          skills: userProfile?.skills || ['Specialist'],
          startingBid: bidAmount
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create promotion');
      }

      toast.success('🔥 Promotion successfully launched!');
      if (onSuccess) onSuccess();
      setCreatedResult({
        managementUrl: data.managementUrl,
        managementToken: data.managementToken
      });
    } catch (err: any) {
      toast.error(err.message || 'Error launching campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        
        {/* Header */}
        <div className="bg-black text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 fill-[#e8622c] text-[#e8622c]" />
            <h3 className="font-black text-base uppercase font-mono tracking-tight">
              {createdResult ? 'Promotion Live!' : 'Promote Your Profile'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {createdResult ? (
          /* Success Magic Link View */
          <div className="p-6 space-y-5 font-mono text-center">
            <div className="w-14 h-14 bg-orange-100 border-2 border-black flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Flame className="w-8 h-8 fill-[#e8622c] text-[#e8622c]" />
            </div>

            <div>
              <h4 className="text-lg font-black uppercase text-black">
                🎉 Your Promotion Is Live!
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Your profile is active on the live board. Bookmark or copy your magic management link to monitor clicks, check rank, or outbid competitors.
              </p>
            </div>

            {/* Magic Link Box */}
            <div className="p-3 bg-slate-50 border-2 border-black flex items-center justify-between gap-2 text-left">
              <span className="text-xs font-bold text-black truncate">
                {window.location.origin}{createdResult.managementUrl}
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}${createdResult.managementUrl}`);
                  setCopied(true);
                  toast.success('Magic link copied!');
                  setTimeout(() => setCopied(false), 2500);
                }}
                className="px-3 py-1.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold shrink-0 transition cursor-pointer"
              >
                {copied ? '[ COPIED ✓ ]' : '[ COPY LINK ]'}
              </button>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  navigate(createdResult.managementUrl);
                  onClose();
                }}
                className="w-full py-3.5 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-black uppercase transition cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                [ GO TO MANAGEMENT DASHBOARD ⚡ ]
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 bg-white hover:bg-slate-100 border border-black font-mono text-xs font-bold uppercase transition cursor-pointer"
              >
                Close & Return to Board
              </button>
            </div>
          </div>
        ) : (
          /* Ultra-Clean 3-Step Form */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            
            {/* 1. Profile URL Input with Live Auto-Detection */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono text-black font-bold uppercase">
                1. Profile URL <span className="text-red-500">*</span>
              </label>
              
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🔗</span>
                <input
                  type="text"
                  value={destinationUrl}
                  onChange={(e) => setDestinationUrl(e.target.value)}
                  placeholder="https://www.linkedin.com/in/username"
                  className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border-2 border-black font-mono text-xs font-bold text-black placeholder:text-slate-400 focus:outline-hidden focus:border-[#e8622c]"
                  required
                />
              </div>

              {/* Dynamic Auto-Detected Platform Banner */}
              {detection && detection.isValid && (
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2.5 py-1 animate-fadeIn">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <PlatformBrandIcon platform={detection.platform} className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span>✓ {detection.platformName} detected</span>
                </div>
              )}
            </div>

            {/* 2. Bid Amount Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase text-black">
                <span>2. Your 24H Bid Amount</span>
                <span className="text-slate-500 font-normal">Min: $2.00</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-sm text-black">$</span>
                  <input
                    type="number"
                    min="2"
                    step="1"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Math.max(2, Number(e.target.value) || 2))}
                    className="w-full pl-7 pr-3 py-2.5 bg-slate-50 border-2 border-black font-mono font-black text-sm text-black focus:outline-hidden focus:border-[#e8622c]"
                    required
                  />
                </div>

                <div className="text-right font-mono text-[10px] bg-orange-50 border border-black/20 p-2 shrink-0">
                  <div className="text-slate-500">To reach #1:</div>
                  <div className="font-black text-[#e8622c] text-xs">${minToTakeNumberOne}</div>
                </div>
              </div>
            </div>

            {/* 3. Email Input */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono text-black font-bold uppercase">
                3. Your Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full p-2.5 bg-slate-50 border-2 border-black font-mono text-xs font-bold text-black placeholder:text-slate-400 focus:outline-hidden focus:border-[#e8622c]"
                required
              />
              <span className="text-[10px] text-slate-500 font-mono block">
                Used to send your magic management link & instant outbid alerts.
              </span>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-black uppercase transition cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <span>ACTIVATING PROMOTION...</span>
              ) : (
                <>
                  <span>[ 🔥 CONTINUE TO PAYMENT — ${bidAmount} ]</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-[10px] font-mono text-slate-500 text-center pt-1">
              Zero login required • 100% direct link to your authentic profile
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default CreatePromotedCampaignModal;
