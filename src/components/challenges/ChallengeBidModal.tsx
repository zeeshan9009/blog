import React, { useState } from 'react';
import { X, DollarSign, Trophy, ShieldAlert, CheckCircle2, Heart, Sparkles, Building2 } from 'lucide-react';
import { calculateBidFeeBreakdown } from '../../services/challenges/challengeBidService';
import type { Challenge } from '../../types/challenge';
import toast from 'react-hot-toast';

interface ChallengeBidModalProps {
  challenge: Challenge | null;
  isOpen: boolean;
  onClose: () => void;
  onBidComplete?: () => void;
}

export const ChallengeBidModal: React.FC<ChallengeBidModalProps> = ({
  challenge,
  isOpen,
  onClose,
  onBidComplete
}) => {
  const [bidderLabel, setBidderLabel] = useState('');
  const [bidderMessage, setBidderMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !challenge) return null;

  const feeBreakdown = calculateBidFeeBreakdown(200); // Fixed $2.00

  const handleBoost = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsProcessing(true);

    try {
      const response = await fetch('/api/challenges?route=bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: challenge.id,
          bidderLabel: bidderLabel.trim() || 'Anonymous Supporter',
          bidderMessage: bidderMessage.trim() || undefined
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete pool boost.');
      }

      setSuccess(true);
      toast.success('Added $2 to the Challenge Arena prize pool!');
      onBidComplete?.();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error processing boost. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetAndClose = () => {
    setBidderLabel('');
    setBidderMessage('');
    setErrorMsg(null);
    setSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn rounded-none">
        
        {/* Header */}
        <div className="p-4 border-b-2 border-black flex items-center justify-between bg-amber-100">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-600" />
            <h2 className="font-mono font-black text-sm uppercase tracking-wider text-black">
              BOOST PRIZE POOL // FIXED $2.00
            </h2>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1 hover:bg-black hover:text-white transition border border-black cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {success ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-amber-100 border-2 border-black rounded-full flex items-center justify-center mx-auto text-amber-600">
                <Heart className="w-10 h-10 fill-amber-500 text-amber-600" />
              </div>
              <h3 className="text-xl font-black text-black">PRIZE POOL EXPANDED!</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you! Your <strong>$2.00 contribution</strong> was successfully added to <strong>"{challenge.title}"</strong>.
                The full net prize will be paid directly to the merit-selected champion!
              </p>
              <button
                onClick={handleResetAndClose}
                className="mt-4 px-6 py-2.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition cursor-pointer"
              >
                [ BACK TO ARENA ]
              </button>
            </div>
          ) : (
            <form onSubmit={handleBoost} className="space-y-4">
              
              {/* Fee Breakdown Card */}
              <div className="p-4 bg-slate-900 text-white border-2 border-black space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-bold uppercase">FIXED CONTRIBUTION</span>
                  <span className="text-xl font-black text-amber-400">$2.00 USD</span>
                </div>
                
                <div className="pt-2 border-t border-slate-700 text-xs space-y-1.5 text-slate-300">
                  <div className="flex justify-between">
                    <span>Net Added to Winner Prize Pool (90%)</span>
                    <span className="text-emerald-400 font-bold">+${feeBreakdown.netPrizePoolDollars.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Platform Infrastructure Fee (10%)</span>
                    <span>${feeBreakdown.platformFeeDollars.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border-2 border-red-500 text-red-700 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Sponsor Name / Label */}
              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold text-black uppercase flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Sponsor / Supporter Name</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp, @username, or Anonymous Supporter"
                  maxLength={40}
                  value={bidderLabel}
                  onChange={(e) => setBidderLabel(e.target.value)}
                  className="w-full px-3 py-2 text-xs border-2 border-black focus:outline-hidden focus:bg-orange-50 font-medium"
                />
              </div>

              {/* Sponsor Message */}
              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold text-black uppercase">
                  Supportive Shoutout / Message (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Excited to see innovative AI interface architectures!"
                  maxLength={120}
                  value={bidderMessage}
                  onChange={(e) => setBidderMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs border-2 border-black focus:outline-hidden focus:bg-orange-50 font-sans"
                />
              </div>

              {/* Strict Non-Pay-To-Win Notice */}
              <div className="p-3 bg-amber-50 border border-amber-300 text-[11px] text-slate-700 space-y-1">
                <div className="font-bold text-black flex items-center gap-1 font-mono uppercase">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  <span>Structural Integrity Guarantee</span>
                </div>
                <p className="leading-snug">
                  Bidding strictly grows the shared prize pool. It <strong>never</strong> buys votes, alters scores, or affects win odds. The winner is decided 100% on merit by public votes and client judges.
                </p>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-bold transition flex items-center justify-center gap-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>[ PROCESSING $2.00 BOOST... ]</span>
                  ) : (
                    <>
                      <DollarSign className="w-4 h-4" />
                      <span>[ CONFIRM & BOOST PRIZE POOL $2.00 ]</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
