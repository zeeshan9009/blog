import React, { useState, useEffect } from 'react';
import { Vote, Trophy, Clock, Sparkles, Flame, Swords, ArrowRight } from 'lucide-react';
import Countdown from 'react-countdown';
import { Link } from 'react-router-dom';
import { useRealtimeTable } from '../../hooks/useRealtimeChannel';
import type { Challenge, ChallengeSubmission } from '../../types/challenge';

interface LiveVoteBattleProps {
  challenge?: Challenge | null;
  submissions?: ChallengeSubmission[];
  className?: string;
}

export const LiveVoteBattle: React.FC<LiveVoteBattleProps> = ({
  challenge: propChallenge,
  submissions: propSubmissions,
  className = ''
}) => {
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(propChallenge || null);
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>(propSubmissions || []);
  const [loading, setLoading] = useState(!propChallenge);

  // Realtime subscription to challenge votes
  const liveVotes = useRealtimeTable<{ id: string; submission_id: string; challenge_id?: string }>(
    'challenge_votes',
    activeChallenge ? `challenge_id=eq.${activeChallenge.id}` : undefined,
    []
  );

  // Fetch active challenge if not passed as prop
  useEffect(() => {
    if (propChallenge) {
      setActiveChallenge(propChallenge);
      if (propSubmissions) setSubmissions(propSubmissions);
      setLoading(false);
      return;
    }

    async function loadActiveVotingChallenge() {
      try {
        const res = await fetch('/api/challenges');
        if (res.ok) {
          const data = await res.json();
          if (data.challenges && data.challenges.length > 0) {
            const votingChallenge = data.challenges.find(
              (c: Challenge) => c.status === 'voting_window'
            ) || data.challenges[0];
            setActiveChallenge(votingChallenge);

            // Fetch submissions for this challenge
            const detailRes = await fetch(`/api/challenges?id=${votingChallenge.slug || votingChallenge.id}`);
            if (detailRes.ok) {
              const detailData = await detailRes.json();
              if (detailData.submissions) {
                setSubmissions(detailData.submissions);
              }
            }
          }
        }
      } catch {
        // Handle silently
      } finally {
        setLoading(false);
      }
    }

    loadActiveVotingChallenge();
  }, [propChallenge, propSubmissions]);

  // Adjust votes in real-time when new votes come in
  useEffect(() => {
    if (liveVotes.length > 0) {
      const latestVote = liveVotes[0];
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === latestVote.submission_id
            ? { ...sub, voteCount: (sub.voteCount || 0) + 1 }
            : sub
        )
      );
    }
  }, [liveVotes]);

  if (loading) {
    return (
      <div className={`p-6 bg-white border border-[#E5E5E5] animate-pulse ${className}`}>
        <div className="h-6 w-48 bg-slate-200 mb-4" />
        <div className="h-24 bg-slate-100" />
      </div>
    );
  }

  const isVotingActive = activeChallenge?.status === 'voting_window';
  const sortedSubmissions = [...submissions].sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
  const top1 = sortedSubmissions[0];
  const top2 = sortedSubmissions[1];

  // If no voting challenge is active, render the clean "Next Challenge Starts In..." countdown state
  if (!isVotingActive || !top1) {
    const nextDropDate = new Date(Date.now() + 24 * 3600 * 1000 + 6 * 3600 * 1000);

    return (
      <div className={`bg-white border border-[#E5E5E5] p-6 sm:p-8 font-sans ${className}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-4 mb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#FAFAF9] border border-[#E5E5E5] text-[10px] font-semibold text-[#FF5A1F] uppercase tracking-wider">
              <Clock className="w-3 h-3" />
              <span>Upcoming Arena Cycle</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
              Next Live Vote Battle Drops Soon
            </h3>
          </div>

          <div className="bg-[#FAFAF9] border border-[#E5E5E5] p-2.5 px-4 text-xs font-semibold text-[#1A1A1A]">
            <span className="text-[#737373] block text-[9px] uppercase tracking-wider font-medium">STARTS IN</span>
            <Countdown
              date={nextDropDate}
              renderer={({ hours, minutes, seconds }) => (
                <span className="text-sm font-bold text-[#FF5A1F] font-mono">
                  {hours}h {minutes}m {seconds}s
                </span>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#525252] max-w-xl font-normal leading-relaxed">
            {activeChallenge
              ? `Current phase: ${activeChallenge.status.replace('_', ' ').toUpperCase()} (${activeChallenge.title}). Head-to-head Live Vote Battle unlocks as soon as voting window starts!`
              : 'New 3-day engineering challenges launch every week. Fixed $5 entry, zero cash prizes, pure merit-based visibility.'}
          </p>

          <Link
            to="/arena"
            className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#FF5A1F] text-white text-xs font-semibold transition-colors border border-[#1A1A1A] hover:border-[#FF5A1F] whitespace-nowrap"
          >
            Explore Arena
          </Link>
        </div>
      </div>
    );
  }

  // Active Live Vote Battle Head-to-Head
  const vote1 = top1.voteCount || 0;
  const vote2 = top2 ? top2.voteCount || 0 : 0;
  const totalVotes = Math.max(1, vote1 + vote2);
  const pct1 = Math.round((vote1 / totalVotes) * 100);
  const pct2 = Math.round((vote2 / totalVotes) * 100);

  const votingEndDate = activeChallenge?.votingDeadline
    ? new Date(activeChallenge.votingDeadline)
    : new Date(Date.now() + 18 * 3600 * 1000);

  return (
    <div className={`bg-white border border-[#E5E5E5] p-6 sm:p-8 font-sans ${className}`}>
      
      {/* Top Bar: Battle Header + Countdown Timer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-5 mb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#FF5A1F] text-white text-[10px] font-semibold uppercase tracking-wider">
            <Swords className="w-3.5 h-3.5 fill-white" />
            <span>LIVE VOTE BATTLE // HEAD-TO-HEAD</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">
            {activeChallenge.title}
          </h3>
          <p className="text-xs text-[#525252] font-normal">
            Real-time community voting. The winner takes the #1 Top Developer Rail!
          </p>
        </div>

        <div className="bg-[#FAFAF9] border border-[#E5E5E5] p-3 px-4 self-start sm:self-auto">
          <span className="text-[9px] text-[#737373] font-semibold uppercase tracking-wider block">
            VOTING CLOSES IN
          </span>
          <Countdown
            date={votingEndDate}
            renderer={({ hours, minutes, seconds, completed }) => (
              <span className="text-base font-bold text-[#1A1A1A] font-mono">
                {completed ? 'VOTING CLOSED' : `${hours}h ${minutes}m ${seconds}s`}
              </span>
            )}
          />
        </div>
      </div>

      {/* Head to Head Duel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        
        {/* Competitor #1 (Leading) */}
        <div className="border border-[#E5E5E5] p-5 bg-[#FAFAF9] relative flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="px-2 py-0.5 bg-[#FF5A1F] text-white font-semibold text-xs uppercase flex items-center gap-1">
              <Trophy className="w-3 h-3 fill-white" /> #1 LEADER
            </span>
            <span className="text-base font-bold text-[#1A1A1A] font-mono">
              {vote1} Votes <span className="text-xs text-[#737373] font-normal">({pct1}%)</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <img
              src={top1.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={top1.authorName}
              className="w-12 h-12 border border-[#E5E5E5] object-cover shrink-0 bg-white"
            />
            <div className="min-w-0">
              <div className="font-bold text-sm text-[#1A1A1A] truncate">{top1.authorName}</div>
              <p className="text-xs text-[#525252] truncate font-normal">{top1.title || top1.authorTitle || 'Project Entry'}</p>
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div className="space-y-1">
            <div className="w-full h-2.5 bg-[#E5E5E5] overflow-hidden relative">
              <div
                style={{ width: `${pct1}%` }}
                className="h-full bg-[#FF5A1F] transition-all duration-700 ease-out"
              />
            </div>
          </div>
        </div>

        {/* Competitor #2 (Challenger) */}
        {top2 ? (
          <div className="border border-[#E5E5E5] p-5 bg-white relative flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="px-2 py-0.5 bg-[#FAFAF9] border border-[#E5E5E5] text-[#1A1A1A] font-semibold text-xs uppercase">
                #2 CHALLENGER
              </span>
              <span className="text-base font-bold text-[#1A1A1A] font-mono">
                {vote2} Votes <span className="text-xs text-[#737373] font-normal">({pct2}%)</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={top2.authorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}
                alt={top2.authorName}
                className="w-12 h-12 border border-[#E5E5E5] object-cover shrink-0 bg-white"
              />
              <div className="min-w-0">
                <div className="font-bold text-sm text-[#1A1A1A] truncate">{top2.authorName}</div>
                <p className="text-xs text-[#525252] truncate font-normal">{top2.title || top2.authorTitle || 'Project Entry'}</p>
              </div>
            </div>

            {/* Animated Progress Bar */}
            <div className="space-y-1">
              <div className="w-full h-2.5 bg-[#E5E5E5] overflow-hidden relative">
                <div
                  style={{ width: `${pct2}%` }}
                  className="h-full bg-[#1A1A1A] transition-all duration-700 ease-out"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-[#E5E5E5] p-5 bg-white flex flex-col items-center justify-center text-center space-y-2">
            <Sparkles className="w-6 h-6 text-[#FF5A1F]" />
            <div className="font-semibold text-xs uppercase text-[#1A1A1A]">Awaiting 2nd Finalist</div>
            <p className="text-xs text-[#737373]">Vote on entries or submit your project to join the battle!</p>
          </div>
        )}

      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#E5E5E5]">
        <span className="text-xs text-[#737373] text-center sm:text-left font-normal">
          Votes are verified in real-time. Anti-bot fingerprinted.
        </span>
        <Link
          to={`/challenges/${activeChallenge.slug || activeChallenge.id}/vote`}
          className="w-full sm:w-auto px-5 py-2.5 bg-[#FF5A1F] hover:bg-[#E54E17] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 border border-[#FF5A1F] cursor-pointer"
        >
          <Vote className="w-3.5 h-3.5" />
          <span>Cast Your Vote Now ↗</span>
        </Link>
      </div>

    </div>
  );
};

export default LiveVoteBattle;
