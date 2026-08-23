import React, { useState } from 'react';
import { X, Zap, Sparkles, CheckCircle2, CreditCard, Lock, ArrowRight } from 'lucide-react';
import { useTalent } from '../../context/TalentContext';
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
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('987');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync if target pro changes
  React.useEffect(() => {
    if (professional?.id) {
      setSelectedProId(professional.id);
    } else if (currentProfile?.id) {
      setSelectedProId(currentProfile.id);
    }
  }, [professional, currentProfile]);

  if (!isOpen) return null;

  const targetPro = professionals.find(p => p.id === selectedProId) || currentProfile || professionals[0];

  const handlePayAndPromote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPro) return;

    setIsProcessing(true);
    // Simulate brief payment gateway authorization
    setTimeout(async () => {
      const methodLabel =
        paymentMethod === 'card'
          ? 'Credit Card (Stripe)'
          : paymentMethod === 'paypal'
          ? 'PayPal'
          : 'Apple Pay';

      await promoteProfile(targetPro.id, methodLabel);
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1000);
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-7">
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5" />
            24-Hour Sponsored Visibility
          </div>

          <h3 className="text-2xl font-bold text-white tracking-tight">
            Promote Your Profile
          </h3>
          <p className="text-slate-300 text-sm mt-1">
            Get featured in the clearly labeled <span className="text-emerald-400 font-semibold">Sponsored</span> section on ProRank searches for 24 hours.
          </p>
        </div>

        {/* Modal Content */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-2xl font-bold text-slate-900">Promotion Active!</h4>
              <p className="text-slate-600 text-sm mt-2 max-w-sm mx-auto">
                <span className="font-semibold text-slate-900">{targetPro?.name}</span> is now sponsored on ProRank for the next 24 hours.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span>Amount Paid:</span>
                <span className="font-bold text-slate-900">$1.00 USD</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-bold text-slate-900">24 Hours from now</span>
              </div>
              <div className="flex justify-between">
                <span>Placement:</span>
                <span className="font-bold text-emerald-600">ProRank Sponsored Search Top</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
            >
              View In Search Results
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handlePayAndPromote} className="p-6 sm:p-7 space-y-6">
            {/* Target Profile Picker (if multiple) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Select Profile to Promote
              </label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <img
                  src={targetPro?.avatar}
                  alt={targetPro?.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/30"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 text-sm truncate">{targetPro?.name}</div>
                  <div className="text-xs text-slate-500 truncate">{targetPro?.title} • {targetPro?.location}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
                    Score: {targetPro?.score}/100
                  </span>
                </div>
              </div>
            </div>

            {/* Value Highlights */}
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Sponsored Top Placement</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Promoted Profile Badge</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Up to 4x Profile Views</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Real-time Boost Analytics</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition ${
                    paymentMethod === 'card'
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-semibold shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition ${
                    paymentMethod === 'paypal'
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-semibold shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-extrabold text-indigo-600 text-base">P</span>
                  PayPal
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('applepay')}
                  className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition ${
                    paymentMethod === 'applepay'
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-semibold shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold text-slate-900 text-sm"> Pay</span>
                  Apple Pay
                </button>
              </div>
            </div>

            {/* Mock Card Input */}
            {paymentMethod === 'card' && (
              <div className="space-y-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <label className="text-slate-600 font-medium block mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-600 font-medium block mb-1">Expires</label>
                    <input
                      type="text"
                      value={cardExp}
                      onChange={e => setCardExp(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 font-medium block mb-1">CVC</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={e => setCardCvc(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Total and CTA */}
            <div className="pt-2">
              <div className="flex items-center justify-between py-2 border-t border-slate-100 mb-4">
                <span className="text-sm font-medium text-slate-600">Total Due Today:</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900">$1.00</span>
                  <span className="text-xs text-slate-500">/ 24 hrs</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 text-base"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing $1 Promotion...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Pay $1 & Promote for 24 Hours
                  </>
                )}
              </button>
            </div>

            {/* Important Platform Disclaimer */}
            <div className="flex items-start gap-2 text-[11px] text-slate-400 leading-relaxed border-t border-slate-100 pt-3">
              <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>
                <strong>Important Notice:</strong> $1 purchases 24-hour sponsored visibility on ProRank’s search results only. ProRank is an independent discovery platform and does not control third-party rankings (LinkedIn, Fiverr, Upwork) or guarantee employment.
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
