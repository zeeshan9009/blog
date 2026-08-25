import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Sparkles, ArrowRight, ShieldCheck, Building2, Vote, Lock, Flame } from 'lucide-react';
import type { Challenge } from '../../types/challenge';

interface ChallengeCardProps {
  challenge: Challenge;
  onEnterChallenge: (challenge: Challenge) => void;
  onSubmitWork: (challenge: Challenge) => void;
  onSponsorChallenge: (challenge: Challenge) => void;
  onViewDetails: (challenge: Challenge) => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onEnterChallenge,
  onSubmitWork,
  onSponsorChallenge,
  onViewDetails
}) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const targetDate = challenge.status === 'open_entry'
    ? challenge.entryDeadline
    : challenge.status === 'submission_window'
    ? challenge.submissionDeadline
    : challenge.votingDeadline;

  useEffect(() => {
    const target = new Date(targetDate || Date.now()).getTime();

    const updateTimer = () => {
      const diff = Math.max(0, target - Date.now());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const statusLabel = 
    challenge.status === 'open_entry'
      ? 'ENTRIES OPEN ($5 ENTRY)'
      : challenge.status === 'submission_window'
      ? 'SUBMISSIONS OPEN (3 DAYS)'
      : challenge.status === 'voting_window'
      ? 'PUBLIC VOTING (72H)'
      : 'CHALLENGE COMPLETED';

  const statusBg =
    challenge.status === 'open_entry'
      ? 'bg-[#e8622c] text-white'
      : challenge.status === 'submission_window'
      ? 'bg-blue-600 text-white'
      : challenge.status === 'voting_window'
      ? 'bg-emerald-600 text-white'
      : 'bg-slate-900 text-slate-300';

  return (
    <div className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[9px_9px_0px_0px_#e8622c] hover:-translate-y-0.5 transition-all flex flex-col justify-between overflow-hidden rounded-none">
      
      {/* Top Banner & Badges */}
      <div className="relative aspect-[16/8] bg-slate-950 overflow-hidden border-b-2 border-black">
        <img
          src={challenge.bannerImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80'}
          alt={challenge.title}
          className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-500"
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider border border-black shadow-xs flex items-center gap-1.5 ${statusBg}`}>
            {challenge.status === 'closed' ? <ShieldCheck className="w-3.5 h-3.5" /> : <Trophy className="w-3.5 h-3.5" />}
            <span>{statusLabel}</span>
          </span>

          <span className="px-2 py-1 bg-black/90 text-white font-mono text-[10px] uppercase font-bold border border-white/20">
            {challenge.category}
          </span>
        </div>

        {/* Reward Badge (Top Right) */}
        <div className="absolute bottom-3 right-3 bg-black text-white border-2 border-[#e8622c] p-2 sm:px-3 sm:py-1.5 shadow-[3px_3px_0px_0px_#e8622c] flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <span className="text-[9px] font-mono text-slate-300 uppercase tracking-widest block font-bold leading-tight">
              WINNER REWARD
            </span>
            <span className="text-sm sm:text-base font-black font-mono text-amber-400 leading-none">
              72h Top Developer Rail
            </span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          <h3 
            onClick={() => onViewDetails(challenge)}
            className="text-lg sm:text-xl font-black text-black leading-tight tracking-tight hover:text-[#e8622c] transition cursor-pointer"
          >
            {challenge.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
            {challenge.prompt}
          </p>
        </div>

        {/* Challenge Metrics & Countdown */}
        <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-3 bg-orange-50/50 p-3 border border-orange-200/60">
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
              {challenge.status === 'closed' ? 'STATUS' : 'WINDOW CLOSES IN'}
            </span>
            {challenge.status === 'closed' ? (
              <span className="text-xs font-mono font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Winners Declared
              </span>
            ) : (
              <span className="text-xs font-mono font-black text-black flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-[#e8622c]" />
                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
              </span>
            )}
          </div>

          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
              ENTRY & SELECTION
            </span>
            <span className="text-xs font-mono font-bold text-slate-900 mt-0.5 block">
              $5 Entry • 100% Public Votes
            </span>
          </div>
        </div>

        {/* Action Buttons Based on Lifecycle */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
          {challenge.status === 'open_entry' && (
            <>
              <button
                onClick={() => onEnterChallenge(challenge)}
                className="flex-1 py-2.5 px-3 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 border border-black cursor-pointer shadow-xs"
              >
                <span>[ ENTER CHALLENGE ($5) ]</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </button>

              <button
                onClick={() => onSponsorChallenge(challenge)}
                className="py-2.5 px-3 bg-white hover:bg-orange-50 text-black font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 border border-black cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 text-[#e8622c] fill-[#e8622c]" />
                <span>SPONSOR AUCTION</span>
              </button>
            </>
          )}

          {challenge.status === 'submission_window' && (
            <>
              <button
                onClick={() => onSubmitWork(challenge)}
                className="flex-1 py-2.5 px-3 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 border border-black cursor-pointer shadow-xs"
              >
                <span>[ SUBMIT PROJECT ]</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onSponsorChallenge(challenge)}
                className="py-2.5 px-3 bg-white hover:bg-orange-50 text-black font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 border border-black cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 text-[#e8622c] fill-[#e8622c]" />
                <span>SPONSOR AUCTION</span>
              </button>
            </>
          )}

          {challenge.status === 'voting_window' && (
            <button
              onClick={() => onViewDetails(challenge)}
              className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-black text-white font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 border border-black cursor-pointer shadow-xs"
            >
              <Vote className="w-3.5 h-3.5" />
              <span>[ VOTE ON SUBMISSIONS ]</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {challenge.status === 'closed' && (
            <button
              onClick={() => onViewDetails(challenge)}
              className="w-full py-2.5 px-3 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 border border-black cursor-pointer"
            >
              <span>[ VIEW WINNERS & LEADERBOARD ]</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Disclaimer Note */}
        <p className="text-[10px] font-mono text-slate-500 text-center leading-tight">
          ⚡ Pure merit ranking. Rewards are non-cash visibility placements (72h Top Developer Rail).
        </p>

      </div>

    </div>
  );
};

export default ChallengeCard;
