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
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-modern hover:shadow-modern-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      
      {/* Top Banner & Badges */}
      <div className="relative aspect-[16/8] bg-slate-950 overflow-hidden border-b border-slate-100">
        <img
          src={challenge.bannerImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80'}
          alt={challenge.title}
          className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-500"
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`px-2.5 py-1 text-[10px] font-sans font-bold uppercase tracking-wider rounded-lg shadow-sm flex items-center gap-1.5 ${statusBg}`}>
            {challenge.status === 'closed' ? <ShieldCheck className="w-3.5 h-3.5" /> : <Trophy className="w-3.5 h-3.5" />}
            <span>{statusLabel}</span>
          </span>

          <span className="px-2 py-1 bg-black/80 backdrop-blur-xs text-white font-mono text-[10px] uppercase font-bold rounded-md border border-white/10">
            {challenge.category}
          </span>
        </div>

        {/* Reward Badge (Top Right) */}
        <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-md text-white border border-amber-400/40 px-3 py-1.5 rounded-xl shadow-md flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400 shrink-0 fill-amber-400" />
          <div>
            <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold leading-tight">
              WINNER REWARD
            </span>
            <span className="text-xs sm:text-sm font-black font-sans text-amber-400 leading-none">
              72h Top Developer Rail
            </span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between font-sans">
        <div className="space-y-2">
          <h3 
            onClick={() => onViewDetails(challenge)}
            className="text-xl font-bold text-slate-950 leading-tight tracking-tight hover:text-[#e8622c] transition cursor-pointer line-clamp-2 font-heading"
          >
            {challenge.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed line-clamp-3">
            {challenge.prompt
              ? challenge.prompt
                  .replace(/#+\s*/g, '')
                  .replace(/\*\*/g, '')
                  .replace(/---+/g, ' ')
                  .replace(/\n+/g, ' ')
                  .trim()
              : 'Compete in this skill challenge, build your project, and get public community votes.'}
          </p>

          <button
            type="button"
            onClick={() => onViewDetails(challenge)}
            className="text-xs font-bold text-[#e8622c] hover:text-orange-700 transition inline-flex items-center gap-1 cursor-pointer pt-1"
          >
            <span>Read full prompt & rules →</span>
          </button>
        </div>

        {/* Challenge Metrics & Countdown */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60">
          <div>
            <span className="text-[10px] font-sans text-slate-500 uppercase tracking-wider block font-bold">
              {challenge.status === 'closed' ? 'STATUS' : 'WINDOW CLOSES IN'}
            </span>
            {challenge.status === 'closed' ? (
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Winners Declared
              </span>
            ) : (
              <span className="text-xs font-mono font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-[#e8622c]" />
                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
              </span>
            )}
          </div>

          <div>
            <span className="text-[10px] font-sans text-slate-500 uppercase tracking-wider block font-bold">
              ENTRY & SELECTION
            </span>
            <span className="text-xs font-bold text-slate-900 mt-0.5 block">
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
                className="flex-1 py-3 px-4 bg-[#e8622c] hover:bg-orange-600 text-white font-sans text-xs font-bold rounded-xl transition-all shadow-orange-glow flex items-center justify-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>Enter Challenge ($5)</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              </button>

              <button
                onClick={() => onSponsorChallenge(challenge)}
                className="py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-sans text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-200/90 shadow-xs cursor-pointer"
                title="Sponsor this challenge for 48h co-branded visibility"
              >
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Sponsor Visibility</span>
              </button>
            </>
          )}

          {challenge.status === 'submission_window' && (
            <>
              <button
                onClick={() => onSubmitWork(challenge)}
                className="flex-1 py-3 px-4 bg-slate-950 hover:bg-orange-600 text-white font-sans text-xs font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>Submit Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onSponsorChallenge(challenge)}
                className="py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-sans text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-200/90 shadow-xs cursor-pointer"
                title="Sponsor this challenge for 48h co-branded visibility"
              >
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Sponsor Visibility</span>
              </button>
            </>
          )}

          {challenge.status === 'voting_window' && (
            <button
              onClick={() => onViewDetails(challenge)}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Vote className="w-3.5 h-3.5" />
              <span>Vote On Submissions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {challenge.status === 'closed' && (
            <button
              onClick={() => onViewDetails(challenge)}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-[#e8622c] text-white font-sans text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>View Winners & Leaderboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Disclaimer Note */}
        <p className="text-[11px] text-slate-500 text-center leading-tight pt-1">
          ⚡ Pure merit ranking. Rewards are non-cash visibility placements (72h Top Developer Rail).
        </p>

      </div>

    </div>
  );
};

export default ChallengeCard;
