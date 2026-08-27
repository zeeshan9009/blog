import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Trophy,
  Vote,
  Heart,
  Search,
  SlidersHorizontal,
  ExternalLink,
  Loader2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Share2,
  ShieldCheck,
  Flame,
  Award,
  Sparkles,
  TrendingUp,
  UserCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Navbar } from '../components/pixelpush/Navbar';
import { Footer } from '../components/pixelpush/Footer';
import { useAuth } from '../context/AuthContext';
import type { Challenge, ChallengeSubmission, ChallengeVotingSettings } from '../types/challenge';
import toast from 'react-hot-toast';

export const PublicVotingPage: React.FC = () => {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const challengeParam = slug || id;

  const { user } = useAuth();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [votingSettings, setVotingSettings] = useState<ChallengeVotingSettings | null>(null);
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'votes' | 'newest' | 'title' | 'author'>('votes');
  const [activeTab, setActiveTab] = useState<'participants' | 'leaderboard'>('participants');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  // Local Vote Tracking
  const [votedSubIds, setVotedSubIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`voted_subs_${challengeParam}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isVotingSubId, setIsVotingSubId] = useState<string | null>(null);

  // Client Fingerprint for Anti-Abuse
  const getClientFingerprint = () => {
    let fp = localStorage.getItem('ranklancr_voter_fp');
    if (!fp) {
      fp = `fp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem('ranklancr_voter_fp', fp);
    }
    return fp;
  };

  const fetchVotingData = async () => {
    if (!challengeParam) return;
    try {
      setIsLoading(true);
      const res = await fetch(`/api/challenges?slug=${encodeURIComponent(challengeParam)}&route=voting`);
      if (res.ok) {
        const data = await res.json();
        setChallenge(data.challenge);
        setVotingSettings(data.votingSettings);
        setSubmissions(data.submissions || []);
        setTotalVotes(data.totalVotes || 0);
      } else {
        // Fallback to standard challenge details endpoint
        const fallbackRes = await fetch(`/api/challenges?slug=${encodeURIComponent(challengeParam)}`);
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          setChallenge(fallbackData.challenge);
          setVotingSettings(fallbackData.votingSettings || null);
          const validSubs = (fallbackData.submissions || []).filter((s: any) => s.status === 'approved' || s.status === 'submitted');
          setSubmissions(validSubs);
          setTotalVotes(validSubs.reduce((sum: number, s: any) => sum + (s.voteCount || 0), 0));
        } else {
          setChallenge(null);
        }
      }
    } catch (e) {
      console.warn('Failed to load voting data:', e);
      setChallenge(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVotingData();
  }, [challengeParam]);

  // Handle Casting a Vote
  const handleCastVote = async (submission: ChallengeSubmission) => {
    if (votedSubIds.includes(submission.id)) {
      toast.error('You have already voted for this project!');
      return;
    }

    if (votingSettings?.requireAuth && !user) {
      toast.error('Authentication is required to vote on this challenge. Please sign in first.');
      return;
    }

    setIsVotingSubId(submission.id);
    try {
      const res = await fetch('/api/challenges?route=vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: submission.id,
          clientFingerprint: getClientFingerprint(),
          userId: user?.id || null
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('🗳️ Vote recorded successfully!');
        const updatedVotedList = [...votedSubIds, submission.id];
        setVotedSubIds(updatedVotedList);
        localStorage.setItem(`voted_subs_${challengeParam}`, JSON.stringify(updatedVotedList));

        // Optimistically update counts
        setSubmissions(prev =>
          prev.map(s => (s.id === submission.id ? { ...s, voteCount: s.voteCount + 1 } : s))
        );
        setTotalVotes(prev => prev + 1);
      } else {
        toast.error(data.error || 'Failed to record vote');
      }
    } catch (err: any) {
      toast.error(err.message || 'Voting request failed');
    } finally {
      setIsVotingSubId(null);
    }
  };

  // Filtered & Sorted Submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const q = searchQuery.toLowerCase();
      return (
        !q ||
        (sub.title || '').toLowerCase().includes(q) ||
        (sub.authorName || '').toLowerCase().includes(q) ||
        (sub.authorTitle || '').toLowerCase().includes(q) ||
        (sub.submissionText || '').toLowerCase().includes(q)
      );
    }).sort((a, b) => {
      if (sortBy === 'votes') {
        return (b.voteCount || 0) - (a.voteCount || 0);
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      }
      if (sortBy === 'author') {
        return (a.authorName || '').localeCompare(b.authorName || '');
      }
      return 0;
    });
  }, [submissions, searchQuery, sortBy]);

  // Paginated Slices
  const totalPages = Math.max(1, Math.ceil(filteredSubmissions.length / pageSize));
  const paginatedSubmissions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSubmissions.slice(start, start + pageSize);
  }, [filteredSubmissions, currentPage, pageSize]);

  // Deterministic Leaderboard Ranking
  const leaderboardList = useMemo(() => {
    return [...submissions].sort((a, b) => {
      if (b.voteCount !== a.voteCount) {
        return b.voteCount - a.voteCount;
      }
      const timeA = new Date(a.lastVotedAt || a.createdAt).getTime();
      const timeB = new Date(b.lastVotedAt || b.createdAt).getTime();
      if (timeA !== timeB) return timeA - timeB;
      return String(a.id).localeCompare(String(b.id));
    });
  }, [submissions]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-between font-mono">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#e8622c] mx-auto" />
            <p className="text-xs text-slate-600 font-bold uppercase">Loading Challenge Voting Arena...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-between font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white border-2 border-black p-10 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-md space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-black font-mono uppercase">Challenge Not Found</h2>
            <p className="text-xs font-mono text-slate-600">The voting link is invalid or expired.</p>
            <Link
              to="/arena"
              className="px-5 py-2.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold uppercase transition inline-block border border-black"
            >
              [ Return to Arena ]
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isVotingActive = challenge.status === 'voting_window' || votingSettings?.voteStatus === 'active';
  const isEnded = challenge.status === 'closed' || votingSettings?.voteStatus === 'ended';

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 font-sans flex flex-col justify-between selection:bg-[#e8622c] selection:text-white">
      <Navbar />

      <main className="flex-1 pb-24">
        
        {/* Hero Banner Header */}
        <div className="bg-black text-white border-y-2 border-black py-10 sm:py-14 px-4 sm:px-8">
          <div className="max-w-[1440px] mx-auto space-y-4">
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-400">
              <Link to="/arena" className="hover:text-white transition">Challenge Arena</Link>
              <span>/</span>
              <span className="text-white truncate max-w-xs">{challenge.title}</span>
              <span>/</span>
              <span className="text-[#e8622c]">Public Voting</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e8622c] text-white font-mono text-xs font-bold uppercase tracking-wider">
                  <Vote className="w-4 h-4 fill-white" />
                  <span>COMMUNITY MERIT VOTING • 100% PUBLIC DECIDED</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight font-mono">
                  Vote for Your Favorite <span className="text-[#e8622c]">Participant.</span>
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed font-mono">
                  Explore verified developer submissions for <strong className="text-white">"{challenge.title}"</strong>. Cast your vote to help decide who earns the 72-Hour Top Developer Rail reward!
                </p>
              </div>

              {/* Status / Voting Stats Box */}
              <div className="bg-slate-900 border-2 border-[#e8622c] p-5 shadow-[4px_4px_0px_0px_#e8622c] min-w-[260px] shrink-0 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400 font-bold uppercase text-[10px]">
                  <span>VOTING WINDOW</span>
                  <span className={`px-2 py-0.5 ${isVotingActive ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                    {isVotingActive ? 'ACTIVE' : isEnded ? 'CLOSED' : 'UPCOMING'}
                  </span>
                </div>
                <div className="text-3xl font-black text-amber-400">
                  {totalVotes} <span className="text-xs text-slate-300 font-bold uppercase">Votes Cast</span>
                </div>
                <div className="text-[11px] text-slate-400 flex justify-between pt-1 border-t border-slate-800">
                  <span>Verified Submissions:</span>
                  <span className="text-white font-bold">{submissions.length}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Challenge Specification Overview */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-8">
          <div className="bg-white border-2 border-black p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3 font-mono text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                CHALLENGE PROMPT & OBJECTIVE
              </span>
              <div className="flex items-center gap-3">
                <Link
                  to={`/challenges/${challenge.slug || challenge.id}/submit`}
                  className="text-xs text-[#e8622c] hover:underline font-bold"
                >
                  [ View Submission Page ]
                </Link>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Voting link copied to clipboard!');
                  }}
                  className="p-1 hover:bg-slate-100 border border-slate-300 transition cursor-pointer flex items-center gap-1 px-2"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Arena</span>
                </button>
              </div>
            </div>
            <p className="text-slate-700 leading-relaxed max-h-24 overflow-y-auto whitespace-pre-line">
              {challenge.prompt}
            </p>
          </div>
        </div>

        {/* Main Content Area: Tabs, Search & Cards */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 space-y-6">
          
          {/* Navigation Sub-Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('participants')}
                className={`py-2 px-4 font-mono text-xs font-bold uppercase transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'participants'
                    ? 'bg-black text-white border-2 border-black shadow-[3px_3px_0px_0px_#e8622c]'
                    : 'bg-white hover:bg-slate-100 text-slate-800 border-2 border-black'
                }`}
              >
                <Vote className="w-3.5 h-3.5" />
                <span>Vote for Projects ({submissions.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`py-2 px-4 font-mono text-xs font-bold uppercase transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'leaderboard'
                    ? 'bg-black text-white border-2 border-black shadow-[3px_3px_0px_0px_#e8622c]'
                    : 'bg-white hover:bg-slate-100 text-slate-800 border-2 border-black'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Live Leaderboard</span>
              </button>
            </div>

            {/* Search and Sort Toolbar */}
            {activeTab === 'participants' && (
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search participant, tech, title..."
                    className="pl-8 pr-3 py-1.5 bg-white border-2 border-black text-xs font-mono focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-bold">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-2.5 py-1.5 bg-white border-2 border-black font-mono text-xs font-bold focus:outline-hidden cursor-pointer"
                  >
                    <option value="votes">Most Votes</option>
                    <option value="newest">Newest</option>
                    <option value="title">Project Title</option>
                    <option value="author">Participant Name</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* TAB 1: PARTICIPANT CARDS GRID */}
          {activeTab === 'participants' && (
            <div className="space-y-6">
              
              {paginatedSubmissions.length === 0 ? (
                <div className="bg-white border-2 border-black p-12 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3 font-mono">
                  <Vote className="w-10 h-10 text-slate-400 mx-auto" />
                  <h3 className="text-lg font-black text-black uppercase">No Matching Submissions Found</h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    No verified participant entries matched your search query. Try clearing the search filter.
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-4 py-2 bg-black text-white text-xs font-bold uppercase transition"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedSubmissions.map((sub, idx) => {
                    const hasVoted = votedSubIds.includes(sub.id);
                    const isVotingThis = isVotingSubId === sub.id;
                    const votePercentage = totalVotes > 0 ? Math.round(((sub.voteCount || 0) / totalVotes) * 1000) / 10 : 0;

                    return (
                      <div
                        key={sub.id}
                        className={`bg-white border-2 border-black p-6 flex flex-col justify-between transition-all font-mono text-xs ${
                          hasVoted
                            ? 'shadow-[6px_6px_0px_0px_#10b981]'
                            : 'shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)]'
                        }`}
                      >
                        <div className="space-y-4">
                          
                          {/* Top Rank Badge & Vote Score */}
                          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                            <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-300 text-[10px] font-bold uppercase text-slate-800">
                              ENTRY #{idx + 1 + (currentPage - 1) * pageSize}
                            </span>

                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-[#e8622c] bg-orange-50 px-2 py-0.5 border border-orange-200">
                                {sub.voteCount} Votes ({votePercentage}%)
                              </span>
                            </div>
                          </div>

                          {/* Participant Profile info */}
                          <div className="flex items-center gap-3">
                            <img
                              src={sub.authorAvatar}
                              alt={sub.authorName}
                              className="w-12 h-12 border-2 border-black rounded-full object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-sm font-black text-black truncate">{sub.authorName}</h4>
                                {sub.authorVerified && (
                                  <span title="Verified Developer">
                                    <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 truncate">{sub.authorTitle}</p>
                              <span className="text-[10px] text-emerald-700 font-bold">★ Score {sub.authorScore}</span>
                            </div>
                          </div>

                          {/* Project Title & Work Description */}
                          <div className="space-y-1.5 pt-1">
                            <h3 className="font-black text-base text-black leading-snug">
                              {sub.title || 'Challenge Project Submission'}
                            </h3>
                            <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed">
                              {sub.submissionText || 'No description provided by author.'}
                            </p>
                          </div>

                          {/* Work Preview Links */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[11px] text-slate-500 font-bold">Repository / Demo:</span>
                            <a
                              href={sub.submissionUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline font-bold flex items-center gap-1 truncate max-w-[180px]"
                            >
                              <span>Inspect Project</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          </div>

                        </div>

                        {/* Vote Button */}
                        <div className="pt-5 mt-4 border-t border-slate-200">
                          <button
                            type="button"
                            onClick={() => handleCastVote(sub)}
                            disabled={hasVoted || isVotingThis || !isVotingActive}
                            className={`w-full py-3 px-4 font-mono text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-2 border-2 border-black cursor-pointer disabled:opacity-75 ${
                              hasVoted
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-500'
                                : !isVotingActive
                                ? 'bg-slate-200 text-slate-600 border-slate-400 cursor-not-allowed'
                                : 'bg-black hover:bg-[#e8622c] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                            }`}
                          >
                            {isVotingThis ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Verifying & Recording Vote...</span>
                              </>
                            ) : hasVoted ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>VOTED FOR THIS ENTRY</span>
                              </>
                            ) : !isVotingActive ? (
                              <span>VOTING UNAVAILABLE</span>
                            ) : (
                              <>
                                <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                                <span>[ VOTE FOR THIS PROJECT ]</span>
                              </>
                            )}
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination Bar */}
              {totalPages > 1 && (
                <div className="pt-4 flex items-center justify-between border-t-2 border-black font-mono text-xs">
                  <span className="text-slate-500 font-bold">
                    Page {currentPage} of {totalPages} ({filteredSubmissions.length} Projects)
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 bg-white border-2 border-black font-bold uppercase hover:bg-slate-100 disabled:opacity-40 cursor-pointer flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Prev</span>
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 bg-white border-2 border-black font-bold uppercase hover:bg-slate-100 disabled:opacity-40 cursor-pointer flex items-center gap-1"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: LIVE LEADERBOARD (Deterministic Merit Ranking) */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-6 font-mono">
              <div className="p-4 bg-amber-50 border-2 border-amber-400 text-xs text-amber-950 flex items-center gap-3">
                <Trophy className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <strong>Deterministic Ranking Rules:</strong> Tied votes are automatically resolved by (1) Earliest timestamp of reaching vote count, and (2) Stable deterministic submission identifier.
                </div>
              </div>

              <div className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-black text-white uppercase text-[11px] border-b-2 border-black">
                    <tr>
                      <th className="p-3.5 text-center w-16">Rank</th>
                      <th className="p-3.5">Participant</th>
                      <th className="p-3.5">Project Title</th>
                      <th className="p-3.5 text-center">Vote Count</th>
                      <th className="p-3.5 text-center">% of Total Votes</th>
                      <th className="p-3.5 text-right">Project Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {leaderboardList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500 text-xs">
                          No submissions recorded yet.
                        </td>
                      </tr>
                    ) : (
                      leaderboardList.map((entry, index) => {
                        const rank = index + 1;
                        const isTop3 = rank <= 3;
                        const percentage = totalVotes > 0 ? Math.round(((entry.voteCount || 0) / totalVotes) * 1000) / 10 : 0;

                        return (
                          <tr
                            key={entry.id}
                            className={`hover:bg-orange-50/50 transition ${
                              rank === 1
                                ? 'bg-amber-50/60 font-bold'
                                : rank === 2
                                ? 'bg-slate-50/80 font-bold'
                                : rank === 3
                                ? 'bg-orange-50/30'
                                : ''
                            }`}
                          >
                            <td className="p-3.5 text-center font-black text-sm">
                              {rank === 1 ? '🥇 #1' : rank === 2 ? '🥈 #2' : rank === 3 ? '🥉 #3' : `#${rank}`}
                            </td>

                            <td className="p-3.5">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={entry.authorAvatar}
                                  alt={entry.authorName}
                                  className="w-7 h-7 rounded-full border border-black"
                                />
                                <div>
                                  <div className="font-bold text-black">{entry.authorName}</div>
                                  <div className="text-[10px] text-slate-500">{entry.authorTitle}</div>
                                </div>
                              </div>
                            </td>

                            <td className="p-3.5 max-w-xs">
                              <div className="font-bold text-black truncate">{entry.title}</div>
                            </td>

                            <td className="p-3.5 text-center font-black text-sm text-[#e8622c]">
                              <span className="px-2 py-0.5 bg-orange-100 border border-orange-300">
                                {entry.voteCount}
                              </span>
                            </td>

                            <td className="p-3.5 text-center font-bold text-slate-700">
                              {percentage}%
                            </td>

                            <td className="p-3.5 text-right">
                              <a
                                href={entry.submissionUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#e8622c] hover:underline font-bold inline-flex items-center gap-1"
                              >
                                <span>Inspect</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </main>

      <Footer />
    </div>
  );
};

export default PublicVotingPage;
