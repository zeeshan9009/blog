import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Trophy,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ExternalLink,
  Loader2,
  Flame,
  Clock,
  Vote,
  AlertCircle,
  Share2
} from 'lucide-react';
import { Navbar } from '../components/pixelpush/Navbar';
import { Footer } from '../components/pixelpush/Footer';
import { useAuth } from '../context/AuthContext';
import { useTalent } from '../context/TalentContext';
import { RANKLANCR_PADDLE_PRODUCTS } from '../config/paddleProducts';
import { openRankLancrCheckout } from '../services/paddle/paddleService';
import type { Challenge, ChallengeSubmission } from '../types/challenge';
import toast from 'react-hot-toast';

export const ChallengeSubmissionPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { professionals } = useTalent();
  const userProfile = professionals.find(p => p.userId === user?.id) || professionals[0];

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasEntered, setHasEntered] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [mySubmission, setMySubmission] = useState<ChallengeSubmission | null>(null);

  // Form submission state
  const [title, setTitle] = useState('');
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submissionText, setSubmissionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUserId = user?.id || userProfile?.id;

  // Fetch challenge by slug
  const fetchChallenge = async () => {
    if (!slug) return;
    try {
      setIsLoading(true);
      const res = await fetch(`/api/challenges?slug=${encodeURIComponent(slug)}`);
      if (res.ok) {
        const data = await res.json();
        const ch = data.challenge;
        setChallenge(ch);
        const subList: ChallengeSubmission[] = data.submissions || [];
        setSubmissions(subList);

        // Check if user has already entered
        const isPaidInStorage = ch && currentUserId && localStorage.getItem(`ranklancr_paid_${ch.id}_${currentUserId}`) === 'true';
        const isPaidInDB = Boolean(data.entries && currentUserId && data.entries.some((e: any) => e.profileId === currentUserId || e.profileId === user?.id || e.profileId === userProfile?.id));
        const isReturnFromCheckout = searchParams.get('status') === 'paid' || searchParams.get('checkout') === 'completed';

        if (isPaidInDB || isPaidInStorage || isReturnFromCheckout) {
          setHasEntered(true);
          if (ch && currentUserId) {
            localStorage.setItem(`ranklancr_paid_${ch.id}_${currentUserId}`, 'true');
            // If returning from checkout, register in DB
            if (isReturnFromCheckout) {
              fetch('/api/challenges?route=enter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  challengeId: ch.id,
                  profileId: currentUserId,
                  paddleTransactionId: searchParams.get('transaction_id') || 'paddle_live'
                })
              }).catch(() => {});
            }
          }
        }

        // Check if user already submitted work
        if (currentUserId) {
          const userSub = subList.find(s => s.profileId === currentUserId || s.profileId === user?.id || s.profileId === userProfile?.id);
          if (userSub) {
            setMySubmission(userSub);
          }
        }
      } else {
        setChallenge(null);
      }
    } catch (e) {
      console.warn('Failed to load challenge by slug:', e);
      setChallenge(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenge();
  }, [slug, user, userProfile]);

  // Handle $5 Entry Fee Payment
  const handleEnterChallenge = async () => {
    if (!challenge) return;

    if (!user) {
      toast.error('Please sign in first to enter this challenge');
      navigate('/login');
      return;
    }

    if (hasEntered) {
      toast.success('You have already entered this challenge!');
      return;
    }

    setIsEntering(true);
    try {
      await openRankLancrCheckout({
        priceId: RANKLANCR_PADDLE_PRODUCTS.challengeEntry.priceId,
        customerEmail: user.email || undefined,
        customData: {
          challengeId: challenge.id,
          profileId: currentUserId
        },
        successUrl: `${window.location.origin}/challenges/${challenge.slug || challenge.id}/submit?status=paid`
      });

      // Record locally and persist entry
      if (currentUserId) {
        localStorage.setItem(`ranklancr_paid_${challenge.id}_${currentUserId}`, 'true');
        setHasEntered(true);
        await fetch('/api/challenges?route=enter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            challengeId: challenge.id,
            profileId: currentUserId,
            paddleTransactionId: 'paddle_modal_success'
          })
        });
      }
    } catch (err: any) {
      toast.error('Checkout error: ' + (err.message || 'Payment could not be initialized'));
    } finally {
      setIsEntering(false);
    }
  };

  // Handle Work Submission
  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challenge) return;

    if (!title.trim() || !submissionUrl.trim()) {
      toast.error('Please provide a project title and repository/demo URL');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/challenges?route=submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: challenge.id,
          profileId: currentUserId,
          title: title.trim(),
          submissionUrl: submissionUrl.trim(),
          submissionText: submissionText.trim()
        })
      });

      if (res.ok) {
        const data = await res.json();
        toast.success('🎉 Project submitted successfully! Your entry is now in the Arena.');
        setMySubmission(data.submission || {
          id: `sub_${Date.now()}`,
          challengeId: challenge.id,
          profileId: currentUserId,
          title: title.trim(),
          submissionUrl: submissionUrl.trim(),
          submissionText: submissionText.trim(),
          voteCount: 0,
          authorName: user?.name || 'Creator',
          authorAvatar: '',
          authorTitle: 'Developer',
          authorScore: 80,
          authorVerified: true,
          createdAt: new Date().toISOString()
        });
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to submit work');
      }
    } catch (e: any) {
      toast.error(e.message || 'Submission error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center font-mono space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#e8622c] mx-auto" />
            <p className="text-xs text-slate-600 font-bold uppercase">Verifying entry & loading challenge...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // 404: Challenge Not Found
  if (!challenge) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="bg-white border-2 border-black p-10 sm:p-14 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-lg mx-auto space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h1 className="text-2xl font-black font-mono text-black uppercase">Challenge Not Found</h1>
            <p className="text-xs sm:text-sm font-mono text-slate-600 leading-relaxed">
              The challenge link you followed does not exist or has expired.
            </p>
            <div className="pt-2">
              <Link
                to="/arena"
                className="px-5 py-2.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold uppercase transition inline-block border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                [ Explore Challenge Arena ]
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isClosedOrVoting = challenge.status === 'voting_window' || challenge.status === 'closed';

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 font-sans flex flex-col justify-between selection:bg-[#e8622c] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-500">
          <Link to="/arena" className="hover:text-black transition">Challenges</Link>
          <span>/</span>
          <span className="text-black truncate max-w-xs">{challenge.title}</span>
          <span>/</span>
          <span className="text-[#e8622c]">Submit</span>
        </div>

        {/* Challenge Header Card */}
        <div className="bg-white border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase border border-black ${
                challenge.status === 'open_entry' || challenge.status === 'submission_window'
                  ? 'bg-amber-400 text-black'
                  : 'bg-slate-200 text-slate-800'
              }`}>
                {challenge.status.replace('_', ' ').toUpperCase()}
              </span>
              <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                {challenge.category}
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 border border-slate-300">
              <Clock className="w-3.5 h-3.5 text-[#e8622c]" />
              <span>
                {challenge.status === 'open_entry' ? 'Entry Open' : 'Submissions Open'}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight font-mono">
              {challenge.title}
            </h1>
            <div className="text-xs sm:text-sm font-mono text-slate-700 leading-relaxed whitespace-pre-line bg-[#faf8f5] p-4 border border-slate-300 max-h-64 overflow-y-auto">
              {challenge.prompt}
            </div>
          </div>

          {/* Reward Flagship Callout */}
          <div className="p-3 bg-amber-50 border-2 border-amber-400 font-mono text-xs text-amber-950 flex items-center gap-2.5">
            <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Winner Reward:</strong> 72-Hour Site-Wide Top Developer Rail Placement + Verified Profile Accolade.
            </span>
          </div>
        </div>

        {/* State 1: Submissions Closed / Voting in Progress */}
        {isClosedOrVoting && (
          <div className="bg-white border-2 border-black p-8 sm:p-10 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
            <Lock className="w-10 h-10 text-slate-500 mx-auto" />
            <h2 className="text-xl font-black font-mono text-black uppercase">Submissions Are Closed for this Arena</h2>
            <p className="text-xs sm:text-sm font-mono text-slate-600 max-w-md mx-auto leading-relaxed">
              The submission deadline has passed and community voting is now active.
            </p>
            <div className="pt-2">
              <Link
                to={`/arena?challenge=${challenge.id}`}
                className="px-5 py-2.5 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-bold uppercase transition inline-flex items-center gap-2 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <Vote className="w-4 h-4" />
                <span>[ View & Vote on Projects ]</span>
              </Link>
            </div>
          </div>
        )}

        {/* State 2: ALREADY SUBMITTED WORK (Prevents duplicate entries and duplicate payments) */}
        {mySubmission && (
          <div className="bg-white border-2 border-black p-8 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6 font-mono">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 border-2 border-black flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-black uppercase">Your Project is Live in the Arena</h2>
                  <p className="text-xs text-slate-600">You have already submitted your work for this challenge.</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-300">
                1 PASS USED
              </span>
            </div>

            {/* Submitted Project Details */}
            <div className="bg-[#fafafa] border-2 border-black p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Project Title</span>
                <span className="text-xs font-mono font-bold text-[#e8622c] bg-orange-100 px-2 py-0.5 border border-orange-300">
                  {mySubmission.voteCount} Public Votes
                </span>
              </div>
              <h3 className="text-base font-black text-black">{mySubmission.title}</h3>
              
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500">Submission URL:</span>
                <a
                  href={mySubmission.submissionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#e8622c] hover:underline font-bold flex items-center gap-1 truncate max-w-xs"
                >
                  <span>{mySubmission.submissionUrl}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <Link
                to={`/arena?challenge=${challenge.id}`}
                className="w-full sm:w-auto px-6 py-3 bg-[#e8622c] hover:bg-black text-white text-xs font-bold uppercase transition flex items-center justify-center gap-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                <Vote className="w-4 h-4" />
                <span>[ View Your Entry in Arena ]</span>
              </Link>
              
              <button
                type="button"
                onClick={() => {
                  const url = `${window.location.origin}/arena?challenge=${challenge.id}`;
                  navigator.clipboard.writeText(url);
                  toast.success('Arena link copied! Share it to get votes.');
                }}
                className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-slate-100 text-black text-xs font-bold uppercase transition flex items-center justify-center gap-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share for Votes</span>
              </button>
            </div>
          </div>
        )}

        {/* State 3: User Has NOT Entered — Show Entry Checkout Flow */}
        {!isClosedOrVoting && !mySubmission && !hasEntered && (
          <div className="bg-white border-2 border-black p-8 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
            <div className="text-center space-y-2 border-b border-slate-200 pb-6">
              <div className="w-12 h-12 bg-amber-100 border-2 border-black flex items-center justify-center mx-auto shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Trophy className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-2xl font-black font-mono text-black uppercase">
                Step 1: Secure Challenge Entry Pass
              </h2>
              <p className="text-xs sm:text-sm font-mono text-slate-600 max-w-lg mx-auto leading-relaxed">
                Pay the fixed $5 entry fee to register your spot. Once confirmed, you will instantly unlock the project submission form below.
              </p>
            </div>

            {/* $5 Entry Ticket Benefits */}
            <div className="bg-[#fafafa] border-2 border-black p-5 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between font-bold border-b border-slate-200 pb-2">
                <span className="text-black uppercase">Arena Entry Fee</span>
                <span className="text-xl font-black text-black">$5.00 USD</span>
              </div>
              <div className="space-y-2 text-slate-700">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Right to submit 1 repository / demo URL</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% merit-based public community voting</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Top 3 earn 72h site-wide Top Developer Rail placement</span>
                </div>
              </div>
            </div>

            {/* Entry Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleEnterChallenge}
                disabled={isEntering}
                className="w-full py-4 bg-[#e8622c] hover:bg-black text-white font-mono text-sm font-black uppercase tracking-wider transition flex items-center justify-center gap-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer disabled:opacity-50"
              >
                {isEntering ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Opening Paddle Checkout...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>[ ENTER CHALLENGE WITH PADDLE — $5.00 ]</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* State 4: User HAS Entered & NOT yet submitted — Show Project Submission Form */}
        {!isClosedOrVoting && !mySubmission && hasEntered && (
          <form onSubmit={handleSubmitProject} className="bg-white border-2 border-black p-8 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6 font-mono">
            <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-black uppercase">
                  Submit Your Project
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Enter pass confirmed ($5 paid). Fill out your project details for public voting.
                </p>
              </div>
              <div className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>ENTRY PASS VERIFIED</span>
              </div>
            </div>

            {/* Project Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-black uppercase">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Real-Time Developer Leaderboard"
                className="w-full px-4 py-3 bg-[#fafafa] border-2 border-black text-xs font-mono font-medium focus:bg-white focus:outline-hidden"
              />
            </div>

            {/* GitHub / Demo URL */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-black uppercase">
                Repository or Live Demo URL *
              </label>
              <input
                type="url"
                required
                value={submissionUrl}
                onChange={(e) => setSubmissionUrl(e.target.value)}
                placeholder="https://github.com/username/project or https://demo.app"
                className="w-full px-4 py-3 bg-[#fafafa] border-2 border-black text-xs font-mono font-medium focus:bg-white focus:outline-hidden"
              />
            </div>

            {/* Description & Tech Stack */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-black uppercase">
                Technical Highlights & Stack (Optional)
              </label>
              <textarea
                rows={4}
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="Describe key architectural decisions, performance metrics, framework used..."
                className="w-full px-4 py-3 bg-[#fafafa] border-2 border-black text-xs font-mono font-medium focus:bg-white focus:outline-hidden"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-black hover:bg-[#e8622c] text-white text-xs sm:text-sm font-black uppercase tracking-wider transition flex items-center justify-center gap-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Work...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>[ SUBMIT WORK TO CHALLENGE ARENA ]</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default ChallengeSubmissionPage;
