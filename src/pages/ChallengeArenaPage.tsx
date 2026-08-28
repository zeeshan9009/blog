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
import { LiveVoteBattle } from '../components/challenges/LiveVoteBattle';
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
          type: 'challenge_entry',
          challengeId: activeChallenge.id,
          profileId: currentUserId
        },
        successUrl: `${window.location.origin}/challenges/${activeChallenge.slug || activeChallenge.id}/submit?status=paid`
      });

      if (currentUserId) {
        localStorage.setItem(`ranklancr_paid_${activeChallenge.id}_${currentUserId}`, 'true');
      }
      setHasEntered(true);
      
      try {
        fetch('/api/challenges?route=enter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            challengeId: activeChallenge.id,
            profileId: currentUserId
          })
        });
      } catch {}

      toast.success('Entry confirmed! You can now submit your work once submissions open.');
    } catch (err: any) {
      toast.error(err.message || 'Payment initiation cancelled');
    } finally {
      setIsEntering(false);
    }
  };

  // Handle Voting
  const handleVote = async (submission: ChallengeSubmission) => {
    if (!activeChallenge) return;

    if (votedSubmissionIds.includes(submission.id)) {
      toast.error('You have already voted for this project');
      return;
    }

    setIsVoting(submission.id);

    try {
      const res = await fetch('/api/challenges?route=vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: activeChallenge.id,
          submissionId: submission.id,
          voterFingerprint: user?.id || 'anon_' + Math.random().toString(36).substring(2, 9)
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setVotedSubmissionIds(prev => [...prev, submission.id]);
        setSubmissions(prev =>
          prev.map(s => (s.id === submission.id ? { ...s, voteCount: (s.voteCount || 0) + 1 } : s))
        );
        toast.success('Vote recorded on-chain!');
      } else {
        toast.error(data.error || 'Vote could not be registered');
      }
    } catch {
      toast.error('Network error registering vote');
    } finally {
      setIsVoting(null);
    }
  };

  const isEntryOpen = activeChallenge?.status === 'open_entry';
  const isSubmissionOpen = activeChallenge?.status === 'submission_window';
  const isVotingOpen = activeChallenge?.status === 'voting_window';
  const isClosed = activeChallenge?.status === 'closed';

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#1A1A1A] font-sans flex flex-col justify-between selection:bg-[#FF5A1F] selection:text-white">
      <Navbar />

      <main className="flex-1 pb-24 space-y-10">
        
        {/* Top Developer Rail Showcase */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-8">
          <TopDeveloperRail />
        </div>

        {/* Hero Header */}
        <div className="bg-white border-y border-[#E5E5E5] py-12 px-4 sm:px-8">
          <div className="max-w-[1440px] mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAFAF9] border border-[#E5E5E5] text-[11px] font-semibold text-[#FF5A1F] uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5" />
              <span>COMMUNITY SKILL ARENA // $5 ENTRY • ZERO CASH PRIZES</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1A1A1A]">
                  Challenge Arena: <span className="text-[#FF5A1F]">Merit Visibility</span>
                </h1>
                <p className="text-sm sm:text-base text-[#525252] font-normal leading-relaxed">
                  Compete in weekly skill prompts for a fixed $5 entry fee. Winners and top 3 receive 72-hour site-wide Top Developer Rail placement and permanent profile accolades. Pure merit, 100% public votes.
                </p>
              </div>

              {/* Reward Highlights Card */}
              <div className="bg-[#FAFAF9] border border-[#E5E5E5] p-5 min-w-[280px] shrink-0 space-y-2">
                <span className="text-[10px] text-[#737373] uppercase tracking-wider block font-semibold">
                  FLAGSHIP REWARD
                </span>
                <div className="text-2xl font-bold text-[#1A1A1A] leading-tight">
                  72h Rail Placement
                </div>
                <div className="text-xs text-[#525252] pt-1 flex justify-between font-mono">
                  <span>Entry Ticket:</span>
                  <span className="text-[#1A1A1A] font-semibold">$5.00 USD</span>
                </div>
              </div>
            </div>

            {/* Persistent Compliance Disclosure Banner */}
            <div className="p-3.5 bg-[#FAFAF9] border border-[#E5E5E5] text-xs text-[#525252] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#FF5A1F] shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-[#1A1A1A] font-semibold">Skill-Based Portfolio Competition:</strong> Placement is determined entirely by community votes — never by chance, luck, or payment amount. Entry fees fund platform operations; <strong className="text-[#1A1A1A] font-semibold">there is no cash prize and no monetary payout to any participant.</strong>
              </div>
            </div>

          </div>
        </div>

        {/* Challenge Action Toolbar & Details */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-8">
          
          {!activeChallenge && !isLoading && (
            <div className="bg-white border border-[#E5E5E5] p-10 sm:p-14 text-center max-w-2xl mx-auto space-y-5">
              <div className="w-14 h-14 bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-center mx-auto">
                <Trophy className="w-6 h-6 text-[#FF5A1F]" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
                  No Active Challenge Open Right Now
                </h2>
                <p className="text-xs sm:text-sm text-[#525252] leading-relaxed max-w-md mx-auto font-normal">
                  New 3-day engineering prompts drop regularly. Check back soon to pay the $5 entry, submit your project, and compete for the 72-hour Top Developer Rail!
                </p>
              </div>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/"
                  className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#FF5A1F] text-white text-xs font-semibold transition-colors border border-[#1A1A1A] hover:border-[#FF5A1F]"
                >
                  Back to Homepage
                </Link>
                <Link
                  to="/pricing"
                  className="px-5 py-2.5 bg-white hover:bg-[#FAFAF9] text-[#1A1A1A] text-xs font-semibold transition-colors border border-[#E5E5E5]"
                >
                  View Pricing & Rules
                </Link>
              </div>
            </div>
          )}

          {activeChallenge && (
            <div className="bg-white border border-[#E5E5E5] p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#FF5A1F] text-white text-[10px] font-semibold uppercase tracking-wider">
                      PHASE: {activeChallenge.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-xs font-medium text-[#737373] uppercase">
                      Category: {activeChallenge.category}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
                    {activeChallenge.title}
                  </h2>
                </div>

                {/* Top Actions */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  {isEntryOpen && (
                    <button
                      onClick={handleEnterChallenge}
                      disabled={isEntering || hasEntered}
                      className="py-2.5 px-5 bg-[#FF5A1F] hover:bg-[#E54E17] text-white text-xs font-semibold transition-colors flex items-center gap-2 border border-[#FF5A1F] cursor-pointer disabled:opacity-50"
                    >
                      {isEntering ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : hasEntered ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                          <span>Entered ($5 Paid)</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-white" />
                          <span>Enter Challenge — $5</span>
                        </>
                      )}
                    </button>
                  )}

                  {isSubmissionOpen && (
                    <button
                      onClick={() => setIsSubmitModalOpen(true)}
                      className="py-2.5 px-5 bg-[#1A1A1A] hover:bg-[#FF5A1F] text-white text-xs font-semibold transition-colors flex items-center gap-2 border border-[#1A1A1A] hover:border-[#FF5A1F] cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>Submit Work</span>
                    </button>
                  )}

                  <Link
                    to={`/challenges/${activeChallenge.slug || activeChallenge.id}/vote`}
                    className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-2 border border-emerald-600 cursor-pointer"
                  >
                    <Vote className="w-4 h-4" />
                    <span>Public Voting ↗</span>
                  </Link>

                  <button
                    onClick={() => setIsSponsorModalOpen(true)}
                    className="py-2.5 px-4 bg-transparent hover:bg-[#FAFAF9] text-[#525252] hover:text-[#1A1A1A] text-xs font-semibold transition-colors flex items-center gap-2 border border-[#E5E5E5] hover:border-[#1A1A1A] cursor-pointer"
                  >
                    <Building2 className="w-4 h-4 text-[#737373]" />
                    <span>Sponsor Arena</span>
                  </button>
                </div>
              </div>

              {/* Formatted Structured Challenge Prompt Box */}
              <div className="bg-[#FAFAF9] border border-[#E5E5E5] p-5 text-xs sm:text-sm text-[#525252] space-y-2">
                <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
                  <span className="text-[11px] font-semibold text-[#1A1A1A] uppercase tracking-wider">
                    📋 CHALLENGE SPECIFICATION & PROMPT
                  </span>
                  <Link
                    to={`/challenges/${activeChallenge.slug || activeChallenge.id}/submit`}
                    className="text-[11px] text-[#FF5A1F] hover:underline font-semibold"
                  >
                    Direct Submission Link ↗
                  </Link>
                </div>
                <div className="whitespace-pre-line leading-relaxed max-h-80 overflow-y-auto pr-2 space-y-2 text-[#525252] font-normal">
                  {activeChallenge.prompt}
                </div>
              </div>
            </div>
          )}

          {/* Submissions & Voting Section */}
          {activeChallenge && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
                <div className="flex items-center gap-2">
                  <Vote className="w-5 h-5 text-[#FF5A1F]" />
                  <h3 className="text-xl font-bold text-[#1A1A1A] tracking-tight">
                    {isClosed ? 'Final Submissions & Rankings' : 'Community Submissions & Voting'}
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#737373]">
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
                        className="bg-white border border-[#E5E5E5] hover:border-[#D4D4D4] p-6 flex flex-col justify-between transition-colors"
                      >
                        <div>
                          {/* Rank / Winner Tag */}
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="px-2 py-0.5 bg-[#FAFAF9] border border-[#E5E5E5] text-[10px] font-semibold text-[#1A1A1A] uppercase">
                              {sub.finalRank ? `RANK #${sub.finalRank}` : `ENTRY #${idx + 1}`}
                            </span>
                            <span className="font-mono text-xs font-bold text-[#FF5A1F]">
                              {sub.voteCount} Votes
                            </span>
                          </div>

                          {/* Author Info */}
                          <div className="flex items-center gap-3 mb-4">
                            <img
                              src={sub.authorAvatar}
                              alt={sub.authorName}
                              className="w-10 h-10 border border-[#E5E5E5] object-cover shrink-0 bg-[#FAFAF9]"
                            />
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-[#1A1A1A] truncate">{sub.authorName}</h4>
                              <p className="text-xs text-[#737373] truncate font-normal">{sub.authorTitle}</p>
                            </div>
                          </div>

                          <h4 className="font-bold text-sm text-[#1A1A1A] mb-1.5">{sub.title || 'Project Submission'}</h4>
                          <p className="text-xs text-[#525252] font-normal line-clamp-3 mb-4">{sub.submissionText}</p>

                          <a
                            href={sub.submissionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline mb-4"
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
                            className={`w-full py-2.5 px-3 text-xs font-semibold border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                              hasVotedThis
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                : 'bg-[#1A1A1A] hover:bg-[#FF5A1F] border-[#1A1A1A] hover:border-[#FF5A1F] text-white'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${hasVotedThis ? 'fill-emerald-600 text-emerald-600' : ''}`} />
                            <span>{hasVotedThis ? 'Voted' : 'Vote For This Project'}</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white border border-[#E5E5E5] p-8 text-center space-y-2">
                  <Trophy className="w-8 h-8 text-[#FF5A1F] mx-auto" />
                  <h4 className="text-sm font-bold text-[#1A1A1A]">Submissions Opening Shortly</h4>
                  <p className="text-xs text-[#525252] font-normal">Enter now to secure your spot for the submission window.</p>
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
