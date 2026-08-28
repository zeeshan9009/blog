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
      ? 'bg-[#FF5A1F] text-white'
      : challenge.status === 'submission_window'
      ? 'bg-blue-600 text-white'
      : challenge.status === 'voting_window'
      ? 'bg-emerald-600 text-white'
      : 'bg-[#1A1A1A] text-slate-300';

  return (
    <div className="bg-white border border-[#E5E5E5] hover:border-[#D4D4D4] transition-colors flex flex-col justify-between overflow-hidden">
      
      {/* Top Banner & Badges */}
      <div className="relative aspect-[16/8] bg-[#1A1A1A] overflow-hidden border-b border-[#E5E5E5]">
        <img
          src={challenge.bannerImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80'}
          alt={challenge.title}
          className="w-full h-full object-cover opacity-85 hover:opacity-95 transition-opacity"
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`px-2 py-0.5 text-[10px] font-sans font-semibold uppercase tracking-wider flex items-center gap-1.5 ${statusBg}`}>
            {challenge.status === 'closed' ? <ShieldCheck className="w-3 h-3" /> : <Trophy className="w-3 h-3" />}
            <span>{statusLabel}</span>
          </span>

          <span className="px-2 py-0.5 bg-[#1A1A1A]/90 text-white font-mono text-[10px] uppercase font-semibold border border-white/20">
            {challenge.category}
          </span>
        </div>

        {/* Reward Badge (Top Right) */}
        <div className="absolute bottom-3 right-3 bg-[#1A1A1A] text-white border border-white/20 px-2.5 py-1 flex items-center gap-2">
          <Trophy className="w-3.5 h-3.5 text-[#FF5A1F] shrink-0" />
          <div>
            <span className="text-[9px] text-[#737373] uppercase tracking-wider block font-semibold leading-tight">
              REWARD
            </span>
            <span className="text-xs font-semibold font-sans text-white leading-none">
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
            className="text-lg font-bold text-[#1A1A1A] leading-snug tracking-tight hover:text-[#FF5A1F] transition-colors cursor-pointer line-clamp-2"
          >
            {challenge.title}
          </h3>

          <p className="text-xs text-[#525252] font-normal leading-relaxed line-clamp-3">
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
            className="text-xs font-semibold text-[#FF5A1F] hover:text-[#E54E17] transition-colors inline-flex items-center gap-1 cursor-pointer pt-1"
          >
            <span>Read full prompt & rules →</span>
          </button>
        </div>

        {/* Challenge Metrics & Countdown */}
        <div className="pt-3 border-t border-[#E5E5E5] grid grid-cols-2 gap-3 bg-[#FAFAF9] p-3 border border-[#E5E5E5]">
          <div>
            <span className="text-[10px] font-sans text-[#737373] uppercase tracking-wider block font-semibold">
              {challenge.status === 'closed' ? 'STATUS' : 'WINDOW CLOSES IN'}
            </span>
            {challenge.status === 'closed' ? (
              <span className="text-xs font-semibold text-[#1A1A1A] flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Winners Declared
              </span>
            ) : (
              <span className="text-xs font-mono font-semibold text-[#1A1A1A] flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-[#FF5A1F]" />
                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
              </span>
            )}
          </div>

          <div>
            <span className="text-[10px] font-sans text-[#737373] uppercase tracking-wider block font-semibold">
              ENTRY & SELECTION
            </span>
            <span className="text-xs font-medium text-[#1A1A1A] mt-0.5 block">
              $5 Entry • 100% Public Votes
            </span>
          </div>
        </div>

        {/* Action Buttons Based on Lifecycle */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          {challenge.status === 'open_entry' && (
            <>
              <button
                onClick={() => onEnterChallenge(challenge)}
                className="flex-1 py-2.5 px-4 bg-[#FF5A1F] hover:bg-[#E54E17] text-white font-sans text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-[#FF5A1F]"
              >
                <span>Enter Challenge ($5)</span>
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </button>

              <button
                onClick={() => onSponsorChallenge(challenge)}
                className="py-2.5 px-3 bg-transparent hover:bg-[#FAFAF9] text-[#525252] hover:text-[#1A1A1A] font-sans text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-[#E5E5E5] hover:border-[#1A1A1A] cursor-pointer"
                title="Sponsor this challenge for 48h co-branded visibility"
              >
                <Building2 className="w-3.5 h-3.5 text-[#737373]" />
                <span>Sponsor This Challenge</span>
              </button>
            </>
          )}

          {challenge.status === 'submission_window' && (
            <>
              <button
                onClick={() => onSubmitWork(challenge)}
                className="flex-1 py-2.5 px-4 bg-[#1A1A1A] hover:bg-[#FF5A1F] text-white font-sans text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-[#1A1A1A] hover:border-[#FF5A1F]"
              >
                <span>Submit Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onSponsorChallenge(challenge)}
                className="py-2.5 px-3 bg-transparent hover:bg-[#FAFAF9] text-[#525252] hover:text-[#1A1A1A] font-sans text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-[#E5E5E5] hover:border-[#1A1A1A] cursor-pointer"
                title="Sponsor this challenge for 48h co-branded visibility"
              >
                <Building2 className="w-3.5 h-3.5 text-[#737373]" />
                <span>Sponsor This Challenge</span>
              </button>
            </>
          )}

          {challenge.status === 'voting_window' && (
            <button
              onClick={() => onViewDetails(challenge)}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-600"
            >
              <Vote className="w-3.5 h-3.5" />
              <span>Vote On Submissions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {challenge.status === 'closed' && (
            <button
              onClick={() => onViewDetails(challenge)}
              className="w-full py-2.5 px-4 bg-[#1A1A1A] hover:bg-[#FF5A1F] text-white font-sans text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-[#1A1A1A] hover:border-[#FF5A1F]"
            >
              <span>View Winners & Leaderboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Disclaimer Note */}
        <p className="text-[11px] text-[#737373] text-center leading-tight pt-1">
          Pure merit ranking. Rewards are non-cash visibility placements (72h Top Developer Rail).
        </p>

      </div>

    </div>
  );
};

export default ChallengeCard;
