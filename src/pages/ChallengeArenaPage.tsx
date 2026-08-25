import React, { useState, useEffect } from 'react';
import { Trophy, Flame, Sparkles, Heart, ThumbsUp, ShieldCheck, DollarSign, Award, ExternalLink, Video, Clock, MessageSquare, ArrowLeft } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/pixelpush/Navbar';
import { Footer } from '../components/pixelpush/Footer';
import { ChallengeSubmitModal } from '../components/challenges/ChallengeSubmitModal';
import { ChallengeBidModal } from '../components/challenges/ChallengeBidModal';
import { calculateBidFeeBreakdown } from '../services/challenges/challengeBidService';
import type { Challenge, ChallengeSubmission, ChallengeBid, ChallengeDetailResponse } from '../types/challenge';
import toast from 'react-hot-toast';

export const ChallengeArenaPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const challengeIdParam = searchParams.get('id');

  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([]);
  const [recentBids, setRecentBids] = useState<ChallengeBid[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Voting state
  const [votedSubmissionIds, setVotedSubmissionIds] = useState<string[]>([]);
  const [isVoting, setIsVoting] = useState<string | null>(null);

  // Modals
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);

  const fetchChallengeDetail = async () => {
    try {
      // 1. If ID provided fetch it, otherwise fetch the default open challenge
      let targetId = challengeIdParam;
      if (!targetId) {
        const listRes = await fetch('/api/challenges?status=open');
        if (listRes.ok) {
          const listData = await listRes.json();
          if (listData.challenges && listData.challenges.length > 0) {
            targetId = listData.challenges[0].id;
          }
        }
      }

      const res = await fetch(`/api/challenges?id=${targetId || '11111111-1111-1111-1111-111111111111'}`);
      if (res.ok) {
        const data: ChallengeDetailResponse = await res.json();
        setActiveChallenge(data.challenge);
        setSubmissions(data.submissions);
        setRecentBids(data.recentBids);
        setStats(data.stats);
      }
    } catch (e) {
      console.warn('Failed to load challenge details:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChallengeDetail();
  }, [challengeIdParam]);

  const handleVote = async (submission: ChallengeSubmission) => {
    if (votedSubmissionIds.includes(submission.id)) {
      toast.error('You have already voted for this entry.');
      return;
    }

    setIsVoting(submission.id);
    try {
      const res = await fetch('/api/challenges?route=vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: submission.id,
          clientFingerprint: `fp_${Date.now().toString(36)}`
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to record vote.');
      }

      setVotedSubmissionIds(prev => [...prev, submission.id]);
      setSubmissions(prev => prev.map(s => s.id === submission.id ? { ...s, voteCount: s.voteCount + (data.weight || 1) } : s));
      toast.success(`Vote recorded (+${data.weight || 1.0} weight)!`);
    } catch (err: any) {
      toast.error(err.message || 'Error recording vote.');
    } finally {
      setIsVoting(null);
    }
  };

  const prizeDollars = activeChallenge ? (activeChallenge.prizePoolCents / 100).toLocaleString('en-US') : '0';
  const feeBreakdown = calculateBidFeeBreakdown(activeChallenge?.prizePoolCents || 0);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 font-sans flex flex-col justify-between selection:bg-[#e8622c] selection:text-white">
      <Navbar />

      <main className="flex-1 pb-24">
        
        {/* Hero Header */}
        <div className="bg-black text-white border-b-4 border-[#e8622c] py-12 px-4 sm:px-8">
          <div className="max-w-[1440px] mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e8622c] text-white font-mono text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-4 h-4 fill-white" />
              <span>OFFICIAL COMPETITION // FIXED $2 BID PRIZE POOL</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                  CHALLENGE ARENA: <span className="text-amber-400">MERIT LEADERBOARD</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                  Compete in weekly prompts evaluated 100% on merit (60% community vote + 40% expert judge score). Bidding $2 expands the shared prize pool for builders without altering win odds.
                </p>
              </div>

              {/* Prize Pool Hero Widget */}
              <div className="bg-slate-900 border-2 border-amber-400 p-4 sm:p-5 shadow-[4px_4px_0px_0px_#f59e0b] min-w-[280px] shrink-0 font-mono">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
                  TOTAL SHARED PRIZE POOL
                </span>
                <div className="text-3xl sm:text-4xl font-black text-amber-400 leading-tight">
                  ${prizeDollars}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                  <span>Net Winner Take:</span>
                  <span className="text-emerald-400 font-bold">${feeBreakdown.netPrizePoolDollars.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Action Toolbar */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 space-y-8">
          
          {activeChallenge && (
            <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#e8622c] text-white font-mono text-[10px] font-bold uppercase">
                    ACTIVE CHALLENGE
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                    Category: {activeChallenge.category}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-black">{activeChallenge.title}</h2>
                <p className="text-xs sm:text-sm text-slate-700 max-w-2xl">{activeChallenge.prompt}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="px-5 py-3 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-bold transition flex items-center gap-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>[ SUBMIT ENTRY ]</span>
                </button>

                <button
                  onClick={() => setIsBidModalOpen(true)}
                  className="px-5 py-3 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition flex items-center gap-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                >
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <span>[ BOOST POOL +$2 ]</span>
                </button>
              </div>
            </div>
          )}

          {/* Submissions Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Submissions Feed */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between border-b-2 border-black pb-2">
                <h3 className="font-mono font-black text-sm uppercase tracking-wider text-black flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#e8622c]" />
                  <span>SUBMISSIONS LEADERBOARD ({submissions.length})</span>
                </h3>
                <span className="text-[11px] font-mono text-slate-500">
                  RANKED BY MERIT (60% VOTES + 40% JUDGE SCORE)
                </span>
              </div>

              {submissions.length > 0 ? (
                <div className="space-y-4">
                  {submissions.map((sub, idx) => {
                    const hasVoted = votedSubmissionIds.includes(sub.id);

                    return (
                      <div
                        key={sub.id}
                        className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4"
                      >
                        {/* Header: Rank + Author */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className={`w-8 h-8 flex items-center justify-center font-mono font-black text-sm border-2 border-black ${
                              idx === 0 ? 'bg-amber-400 text-black' : idx === 1 ? 'bg-slate-200 text-black' : idx === 2 ? 'bg-orange-200 text-black' : 'bg-slate-50 text-slate-700'
                            }`}>
                              #{idx + 1}
                            </span>

                            <img
                              src={sub.authorAvatar}
                              alt={sub.authorName}
                              className="w-10 h-10 border border-black object-cover"
                            />

                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-bold text-sm text-black">{sub.authorName}</h4>
                                {sub.authorVerified && (
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                )}
                              </div>
                              <span className="text-xs text-slate-500 font-medium block">
                                {sub.authorTitle} • Score {sub.authorScore}/100
                              </span>
                            </div>
                          </div>

                          {/* Vote Action */}
                          <button
                            onClick={() => handleVote(sub)}
                            disabled={hasVoted || isVoting === sub.id}
                            className={`px-3 py-1.5 font-mono text-xs font-bold border-2 border-black transition flex items-center gap-1.5 shadow-xs cursor-pointer ${
                              hasVoted
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-600 cursor-default'
                                : 'bg-white hover:bg-[#e8622c] hover:text-white text-black'
                            }`}
                          >
                            <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-emerald-600' : ''}`} />
                            <span>{hasVoted ? 'VOTED' : 'VOTE'}</span>
                            <span className="px-1.5 py-0.2 bg-black text-white text-[10px] font-bold">
                              {sub.voteCount}
                            </span>
                          </button>
                        </div>

                        {/* Title & Description */}
                        <div className="space-y-1.5">
                          <h5 className="font-black text-base text-black">{sub.title}</h5>
                          {sub.submissionText && (
                            <p className="text-xs text-slate-700 leading-relaxed font-sans">
                              {sub.submissionText}
                            </p>
                          )}
                        </div>

                        {/* Links Toolbar */}
                        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3">
                          <a
                            href={sub.submissionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-black hover:text-white border border-slate-300 font-mono text-xs font-bold transition"
                          >
                            <span>VIEW WORK PREVIEW</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>

                          {sub.demoVideoUrl && (
                            <a
                              href={sub.demoVideoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 hover:bg-[#e8622c] hover:text-white text-[#e8622c] border border-orange-300 font-mono text-xs font-bold transition"
                            >
                              <Video className="w-3 h-3" />
                              <span>WATCH DEMO</span>
                            </a>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white border-2 border-black p-12 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
                  <Sparkles className="w-10 h-10 text-amber-500 mx-auto" />
                  <h4 className="text-base font-black text-black">NO SUBMISSIONS YET</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Be the first builder to enter and claim the public prize pool!
                  </p>
                  <button
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="mt-2 px-5 py-2 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-bold transition cursor-pointer"
                  >
                    [ SUBMIT FIRST ENTRY ]
                  </button>
                </div>
              )}
            </div>

            {/* Right: Prize Pool & Recent Boosters */}
            <div className="space-y-6">
              
              {/* Prize Pool Breakdown Card */}
              <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <div className="flex items-center gap-2 border-b-2 border-black pb-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <h4 className="font-mono font-black text-xs uppercase tracking-wider text-black">
                    PRIZE POOL DISTRIBUTION
                  </h4>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between p-2 bg-slate-50 border border-slate-200">
                    <span className="text-slate-600">Total Pool:</span>
                    <span className="font-black text-black">${prizeDollars}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-emerald-50 border border-emerald-300">
                    <span className="text-emerald-900 font-bold">1st Place Payout (90%):</span>
                    <span className="font-black text-emerald-700">${feeBreakdown.netPrizePoolDollars.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 border border-slate-200 text-slate-500 text-[11px]">
                    <span>Platform Operations (10%):</span>
                    <span>${feeBreakdown.platformFeeDollars.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsBidModalOpen(true)}
                  className="w-full py-2.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 border border-black cursor-pointer shadow-xs"
                >
                  <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                  <span>[ ADD $2 POOL BOOST ]</span>
                </button>
              </div>

              {/* Recent Sponsors Feed */}
              <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <div className="flex items-center gap-2 border-b-2 border-black pb-2">
                  <Heart className="w-4 h-4 text-red-500 fill-red-400" />
                  <h4 className="font-mono font-black text-xs uppercase tracking-wider text-black">
                    RECENT POOL BOOSTERS
                  </h4>
                </div>

                {recentBids.length > 0 ? (
                  <div className="space-y-2.5">
                    {recentBids.map(b => (
                      <div key={b.id} className="p-2.5 bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-black font-mono">{b.bidderLabel}</span>
                          <span className="font-mono text-emerald-600 font-bold">+$2.00</span>
                        </div>
                        {b.bidderMessage && (
                          <p className="text-[11px] text-slate-600 italic">"{b.bidderMessage}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 font-mono text-center py-4">
                    Be the first sponsor to boost this week's pool!
                  </p>
                )}
              </div>

              {/* Rules & Non-Pay-To-Win Guarantee */}
              <div className="bg-amber-50 border-2 border-black p-4 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-mono font-bold text-amber-900 uppercase">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Fairness & Merit Rules</span>
                </div>
                <p className="text-[11px] text-slate-700 leading-snug">
                  1. Winner decided by 60% community votes + 40% client judge score.<br/>
                  2. Bidding $2 expands prize money only — it <strong>never</strong> increases votes or win odds.<br/>
                  3. Ties break by earliest submission time.
                </p>
              </div>

            </div>

          </div>

        </div>

      </main>

      {/* Modals */}
      <ChallengeSubmitModal
        challenge={activeChallenge}
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmitted={() => {
          setIsSubmitModalOpen(false);
          fetchChallengeDetail();
        }}
      />

      <ChallengeBidModal
        challenge={activeChallenge}
        isOpen={isBidModalOpen}
        onClose={() => setIsBidModalOpen(false)}
        onBidComplete={() => {
          setIsBidModalOpen(false);
          fetchChallengeDetail();
        }}
      />

      <Footer />
    </div>
  );
};
