import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Sparkles,
  Heart,
  ShieldCheck,
  Building2,
  Vote,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Lock,
  ExternalLink,
  Loader2,
  Award,
  Flame
} from 'lucide-react';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import { Navbar } from '../components/pixelpush/Navbar';
import { Footer } from '../components/pixelpush/Footer';
import { TopDeveloperRail } from '../components/challenges/TopDeveloperRail';
import { ChallengeSubmitModal } from '../components/challenges/ChallengeSubmitModal';
import { SponsorChallengeModal } from '../components/challenges/SponsorChallengeModal';
import { useAuth } from '../context/AuthContext';
import { useTalent } from '../context/TalentContext';
import { RANKLANCR_PADDLE_PRODUCTS } from '../config/paddleProducts';
import { openRankLancrCheckout } from '../services/paddle/paddleService';
import type { Challenge, ChallengeSubmission, ChallengeSponsorship } from '../types/challenge';
import toast from 'react-hot-toast';

export const ChallengeArenaPage: React.FC = () => {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const [searchParams] = useSearchParams();
  const challengeIdParam = slug || id || searchParams.get('challenge') || searchParams.get('id');
  const actionParam = searchParams.get('action');

  const { user } = useAuth();
  const { professionals } = useTalent();
  const userProfile = professionals.find(p => p.userId === user?.id) || professionals[0];

  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([]);
  const [sponsorships, setSponsorships] = useState<ChallengeSponsorship[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // User state
  const [hasEntered, setHasEntered] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  // Voting state
  const [votedSubmissionIds, setVotedSubmissionIds] = useState<string[]>([]);
  const [isVoting, setIsVoting] = useState<string | null>(null);

  // Modals
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);

  const fetchChallengeDetail = async () => {
    try {
      let targetId = challengeIdParam;
      if (!targetId) {
        const listRes = await fetch('/api/challenges');
        if (listRes.ok) {
          const listData = await listRes.json();
          if (listData.challenges && listData.challenges.length > 0) {
            targetId = listData.challenges[0].slug || listData.challenges[0].id;
          }
        }
      }

      if (!targetId) {
        setActiveChallenge(null);
        setSubmissions([]);
        setSponsorships([]);
        setIsLoading(false);
        return;
      }

      const res = await fetch(`/api/challenges?id=${targetId}`);
      if (res.ok) {
        const data = await res.json();
        setActiveChallenge(data.challenge);
        setSubmissions(data.submissions || []);
        setSponsorships(data.sponsorships || []);
        setStats(data.stats);

        const currentUserId = user?.id || userProfile?.id;
        const isPaidInStorage = currentUserId && localStorage.getItem(`ranklancr_paid_${data.challenge.id}_${currentUserId}`) === 'true';
        const isPaidInDB = Boolean(data.entries && currentUserId && data.entries.some((e: any) => e.profileId === currentUserId || e.profileId === userProfile?.id || e.profileId === user?.id));

        if (isPaidInDB || isPaidInStorage) {
          setHasEntered(true);
          if (currentUserId) {
            localStorage.setItem(`ranklancr_paid_${data.challenge.id}_${currentUserId}`, 'true');
          }
        }
      } else {
        setActiveChallenge(null);
      }
    } catch (e) {
      console.warn('Failed to load challenge details:', e);
      setActiveChallenge(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChallengeDetail();
  }, [challengeIdParam, user, userProfile]);

  useEffect(() => {
    if (actionParam === 'enter' && activeChallenge?.status === 'open_entry') {
      handleEnterChallenge();
    }
  }, [actionParam, activeChallenge]);

  // Handle $5 Entry Fee via Paddle
  const handleEnterChallenge = async () => {
    if (!activeChallenge) return;

    if (hasEntered) {
      toast.success('You have already entered this challenge!');
      return;
    }

    const currentUserId = user?.id || userProfile?.id;

    setIsEntering(true);
    try {
      await openRankLancrCheckout({
        priceId: RANKLANCR_PADDLE_PRODUCTS.challengeEntry.priceId,
        customerEmail: user?.email || undefined,
        customData: {
          challengeId: activeChallenge.id,
          profileId: currentUserId
        },
        successUrl: `${window.location.origin}/challenges/${activeChallenge.slug || activeChallenge.id}/submit?status=paid`
      });

      if (currentUserId) {
        localStorage.setItem(`ranklancr_paid_${activeChallenge.id}_${currentUserId}`, 'true');
        setHasEntered(true);
        fetch('/api/challenges?route=enter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            challengeId: activeChallenge.id,
            profileId: currentUserId,
            paddleTransactionId: 'paddle_modal_success'
          })
        }).catch(() => {});
      }
    } catch (err: any) {
      toast.error('Failed to open checkout: ' + (err.message || 'Error'));
    } finally {
      setIsEntering(false);
    }
  };

  // Handle Voting
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
          clientFingerprint: `fp_${Date.now().toString(36)}`,
          userId: user?.id
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to record vote.');
      }

      setVotedSubmissionIds(prev => [...prev, submission.id]);
      setSubmissions(prev =>
        prev.map(s => (s.id === submission.id ? { ...s, voteCount: s.voteCount + 1 } : s))
      );
      toast.success('Vote cast successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Error recording vote.');
    } finally {
      setIsVoting(null);
    }
  };

  const isEntryOpen = activeChallenge?.status === 'open_entry';
  const isSubmissionOpen = activeChallenge?.status === 'submission_window';
  const isVotingOpen = activeChallenge?.status === 'voting_window';
  const isClosed = activeChallenge?.status === 'closed';

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 font-sans flex flex-col justify-between selection:bg-[#e8622c] selection:text-white">
      <Navbar />

      <main className="flex-1 pb-24">
        
        {/* Top Developer Rail Showcase */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-8">
          <TopDeveloperRail />
        </div>

        {/* Hero Header */}
        <div className="bg-black text-white border-y-2 border-black py-12 px-4 sm:px-8 mt-8">
          <div className="max-w-[1440px] mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e8622c] text-white font-mono text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-4 h-4 fill-white" />
              <span>COMMUNITY SKILL ARENA // $5 ENTRY • ZERO CASH PRIZES</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                  CHALLENGE ARENA: <span className="text-[#e8622c]">MERIT VISIBILITY.</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                  Compete in weekly skill prompts for a fixed $5 entry fee. Winners and top 3 receive 72-hour site-wide Top Developer Rail placement and permanent profile accolades. Pure merit, 100% public votes.
                </p>
              </div>

              {/* Reward Highlights Card */}
              <div className="bg-slate-900 border-2 border-[#e8622c] p-4 sm:p-5 shadow-[4px_4px_0px_0px_#e8622c] min-w-[280px] shrink-0 font-mono">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
                  FLAGSHIP REWARD
                </span>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 leading-tight">
                  72h Rail Placement
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                  <span>Entry Fee:</span>
                  <span className="text-white font-bold">$5.00 USD</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Action Toolbar & Details */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 space-y-8">
          
          {!activeChallenge && !isLoading && (
            <div className="bg-white border-2 border-black p-12 sm:p-16 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-2xl mx-auto space-y-5">
              <div className="w-16 h-16 bg-amber-100 border-2 border-black flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <Trophy className="w-8 h-8 text-amber-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black font-mono text-black uppercase tracking-tight">
                  No Active Challenge Open Right Now
                </h2>
                <p className="text-xs sm:text-sm font-mono text-slate-600 leading-relaxed max-w-md mx-auto">
                  New 3-day engineering prompts drop regularly. Check back soon to pay the $5 entry, submit your project, and compete for the 72-hour Top Developer Rail!
                </p>
              </div>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/"
                  className="px-5 py-2.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold uppercase transition border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                >
                  [ Back to Homepage ]
                </Link>
                <Link
                  to="/pricing"
                  className="px-5 py-2.5 bg-white hover:bg-slate-100 text-black font-mono text-xs font-bold uppercase transition border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                >
                  [ View Pricing & Rules ]
                </Link>
              </div>
            </div>
          )}

          {activeChallenge && (
            <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-[#e8622c] text-white font-mono text-[10px] font-bold uppercase">
                      PHASE: {activeChallenge.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                      Category: {activeChallenge.category}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-3xl font-black text-black tracking-tight font-mono">
                    {activeChallenge.title}
                  </h2>
                </div>

                {/* Top Actions */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  {isEntryOpen && (
                    <button
                      onClick={handleEnterChallenge}
                      disabled={isEntering || hasEntered}
                      className="py-3 px-5 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-bold transition flex items-center gap-2 border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer disabled:opacity-50"
                    >
                      {isEntering ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : hasEntered ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                          <span>[ ENTERED ($5 PAID) ]</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>[ ENTER CHALLENGE — $5 ]</span>
                        </>
                      )}
                    </button>
                  )}

                  {isSubmissionOpen && (
                    <button
                      onClick={() => setIsSubmitModalOpen(true)}
                      className="py-3 px-5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition flex items-center gap-2 border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>[ SUBMIT WORK ]</span>
                    </button>
                  )}

                  <button
                    onClick={() => setIsSponsorModalOpen(true)}
                    className="py-3 px-4 bg-white hover:bg-slate-100 text-black font-mono text-xs font-bold transition flex items-center gap-2 border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                  >
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>[ SPONSOR ARENA ]</span>
                  </button>
                </div>
              </div>

              {/* Formatted Structured Challenge Prompt Box */}
              <div className="bg-[#faf8f5] border-2 border-slate-300 p-5 font-mono text-xs sm:text-sm text-slate-800 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-300 pb-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    📋 CHALLENGE SPECIFICATION & PROMPT
                  </span>
                  <Link
                    to={`/challenges/${activeChallenge.slug || activeChallenge.id}/submit`}
                    className="text-[11px] text-[#e8622c] hover:underline font-bold"
                  >
                    Direct Submission Link ↗
                  </Link>
                </div>
                <div className="whitespace-pre-line leading-relaxed max-h-80 overflow-y-auto pr-2 space-y-2 text-slate-700">
                  {activeChallenge.prompt}
                </div>
              </div>
            </div>
          )}

          {/* Submissions & Voting Section */}
          {activeChallenge && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-black pb-3">
                <div className="flex items-center gap-2">
                  <Vote className="w-5 h-5 text-[#e8622c]" />
                  <h3 className="text-xl font-black text-black tracking-tight">
                    {isClosed ? 'Final Submissions & Rankings' : 'Community Submissions & Voting'}
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {submissions.length} Projects Submitted
                </span>
              </div>

            {submissions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {submissions.map((sub, idx) => {
                  const hasVotedThis = votedSubmissionIds.includes(sub.id);
                  const isWinner = sub.finalRank === 1;

                  return (
                    <div
                      key={sub.id}
                      className={`bg-white border-2 border-black p-5 flex flex-col justify-between transition-all ${
                        isWinner
                          ? 'shadow-[6px_6px_0px_0px_#e8622c]'
                          : 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5'
                      }`}
                    >
                      <div>
                        {/* Rank / Winner Tag */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="px-2 py-0.5 bg-slate-100 border border-slate-300 text-[10px] font-mono font-bold text-slate-700 uppercase">
                            {sub.finalRank ? `RANK #${sub.finalRank}` : `ENTRY #${idx + 1}`}
                          </span>
                          <span className="font-mono text-xs font-bold text-[#e8622c]">
                            {sub.voteCount} Votes
                          </span>
                        </div>

                        {/* Author Info */}
                        <div className="flex items-center gap-3 mb-4">
                          <img
                            src={sub.authorAvatar}
                            alt={sub.authorName}
                            className="w-10 h-10 border border-black object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-sm font-black text-black truncate">{sub.authorName}</h4>
                            <p className="text-xs text-slate-500 truncate">{sub.authorTitle}</p>
                          </div>
                        </div>

                        <h4 className="font-bold text-sm text-black mb-1.5">{sub.title || 'Project Submission'}</h4>
                        <p className="text-xs text-slate-600 font-medium line-clamp-3 mb-4">{sub.submissionText}</p>

                        <a
                          href={sub.submissionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-mono font-bold text-blue-600 hover:underline mb-4"
                        >
                          <span>Live Preview / GitHub</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      {/* Vote Button */}
                      {isVotingOpen && (
                        <button
                          onClick={() => handleVote(sub)}
                          disabled={hasVotedThis || isVoting === sub.id}
                          className={`w-full py-2.5 px-3 font-mono text-xs font-bold border border-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            hasVotedThis
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-black hover:bg-[#e8622c] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${hasVotedThis ? 'fill-emerald-600 text-emerald-600' : ''}`} />
                          <span>{hasVotedThis ? 'VOTED' : 'VOTE FOR THIS PROJECT'}</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white border-2 border-black p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
                <Trophy className="w-8 h-8 text-amber-500 mx-auto" />
                <h4 className="text-sm font-black text-black">Submissions Opening Shortly</h4>
                <p className="text-xs text-slate-600">Enter now to secure your spot for the submission window.</p>
              </div>
            )}

          </div>
          )}

        </div>

      </main>

      <Footer />

      {/* Modals */}
      {activeChallenge && (
        <>
          <ChallengeSubmitModal
            challenge={activeChallenge}
            isOpen={isSubmitModalOpen}
            onClose={() => setIsSubmitModalOpen(false)}
            onSubmitted={() => {
              setIsSubmitModalOpen(false);
              fetchChallengeDetail();
            }}
          />

          <SponsorChallengeModal
            challengeId={activeChallenge.id}
            challengeTitle={activeChallenge.title}
            isOpen={isSponsorModalOpen}
            onClose={() => setIsSponsorModalOpen(false)}
            onSuccess={() => {
              setIsSponsorModalOpen(false);
              fetchChallengeDetail();
            }}
          />
        </>
      )}

    </div>
  );
};

export default ChallengeArenaPage;
