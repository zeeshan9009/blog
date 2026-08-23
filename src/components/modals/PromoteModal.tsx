import React, { useState, useEffect } from 'react';
import { X, Zap, Sparkles, CheckCircle2, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useTalent } from '../../context/TalentContext';
import { verifyProfilePromotionEligibility } from '../../services/ranking/antiAbuse';
import type { Professional } from '../../types/talent';

interface PromoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  professional?: Professional | null;
}

export const PromoteModal: React.FC<PromoteModalProps> = ({ isOpen, onClose, professional }) => {
  const { currentProfile, promoteProfile, professionals } = useTalent();
  const [selectedProId, setSelectedProId] = useState<string>(professional?.id || currentProfile?.id || professionals[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'applepay'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (professional?.id) {
      setSelectedProId(professional.id);
    } else if (currentProfile?.id) {
      setSelectedProId(currentProfile.id);
    }
  }, [professional, currentProfile]);

  if (!isOpen) return null;

  const targetPro = professionals.find(p => p.id === selectedProId) || currentProfile || professionals[0];
  const eligibility = targetPro ? verifyProfilePromotionEligibility(targetPro) : { isEligible: true, reasons: [] };

  const isAlreadyPromoted = targetPro?.isPromoted && targetPro?.promotionExpiresAt && new Date(targetPro.promotionExpiresAt).getTime() > Date.now();

  const handlePayAndPromote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPro) return;

    setIsProcessing(true);
    setTimeout(async () => {
      const methodLabel =
        paymentMethod === 'card'
          ? 'Credit Card (Stripe)'
          : paymentMethod === 'paypal'
          ? 'PayPal'
          : 'Apple Pay';

      const success = await promoteProfile(targetPro.id, methodLabel);
      setIsProcessing(false);
      if (success) {
        setIsSuccess(true);
      }
    }, 800);
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden rounded-none">
        
        {/* Modal Header */}
        <div className="relative bg-black text-white p-6 border-b-2 border-black">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 text-white hover:bg-[#e8622c] border border-white/20 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
            <Zap className="w-3 h-3 text-[#e8622c]" />
            <span>PRORANK $1 / 24-HOUR PROMOTION</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Sponsored Profile Placement
          </h2>
          <p className="text-slate-400 text-xs mt-1 font-medium">
            Activate top placement on relevant searches for 24 hours. Zero subscription lock-in.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 border-2 border-black flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-black text-black">Sponsored Visibility Activated!</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  Your profile for <strong>{targetPro?.name}</strong> is now boosted on relevant keyword searches for the next 24 hours.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-full py-2.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition cursor-pointer"
              >
                [ VIEW ACTIVE LISTINGS ]
              </button>
            </div>
          ) : (
            <form onSubmit={handlePayAndPromote} className="space-y-4">
              
              {/* Profile Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                  Target Talent Profile
                </label>
                <select
                  value={selectedProId}
                  onChange={(e) => setSelectedProId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border-2 border-black text-xs font-bold text-black outline-hidden"
                >
                  {professionals.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.title} ({p.isPromoted ? 'Currently Promoted' : 'Organic'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Already active extension notice */}
              {isAlreadyPromoted && (
                <div className="p-3 bg-orange-50 border-2 border-[#e8622c] text-xs flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#e8622c] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-black block">Active Promotion in Progress</span>
                    <span className="text-slate-600 text-[11px]">
                      Purchasing now will extend your existing 24-hour window by <strong>+24 hours</strong>.
                    </span>
                  </div>
                </div>
              )}

              {/* Eligibility Warning */}
              {!eligibility.isEligible && (
                <div className="p-3 bg-red-50 border-2 border-red-500 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-red-900 block">Profile Incomplete for Promotion</span>
                    <ul className="list-disc pl-4 text-[11px] text-red-700 mt-1 space-y-0.5">
                      {eligibility.reasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Breakdown Card */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Sponsored Search Placement</span>
                  <span className="font-mono text-black font-bold">$1.00 USD</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Duration</span>
                  <span className="font-mono text-black font-bold">24 Hours (Non-recurring)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Marketplace Commission</span>
                  <span className="font-mono text-emerald-600 font-bold">0% CUT</span>
                </div>
                <div className="pt-2 border-t border-slate-300 flex justify-between font-bold text-black text-sm">
                  <span>Total Amount Due</span>
                  <span className="font-mono text-[#e8622c]">$1.00</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 text-xs font-bold border-2 transition cursor-pointer font-mono ${
                      paymentMethod === 'card' ? 'border-black bg-black text-white' : 'border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    Credit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`py-2 text-xs font-bold border-2 transition cursor-pointer font-mono ${
                      paymentMethod === 'paypal' ? 'border-black bg-black text-white' : 'border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    PayPal
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('applepay')}
                    className={`py-2 text-xs font-bold border-2 transition cursor-pointer font-mono ${
                      paymentMethod === 'applepay' ? 'border-black bg-black text-white' : 'border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    Apple Pay
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing || !eligibility.isEligible}
                className={`w-full py-3 text-white font-mono text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                  !eligibility.isEligible
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-[#e8622c] hover:bg-black cursor-pointer'
                }`}
              >
                {isProcessing ? (
                  <span>AUTHORIZING $1.00 PAYMENT...</span>
                ) : (
                  <>
                    <span>PAY $1.00 & ACTIVATE 24H VISIBILITY</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-slate-500 pt-1">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>256-BIT ENCRYPTED • IDEMPOTENT SERVER-SIDE VERIFICATION</span>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
