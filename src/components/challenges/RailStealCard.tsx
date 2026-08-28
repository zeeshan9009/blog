import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Crown,
  Sparkles,
  Zap,
  Flame,
  Clock,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Users,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import Countdown from 'react-countdown';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { useTalent } from '../../context/TalentContext';
import { attemptRailSteal, getNextEligibleTimestamp } from '../../services/ranking/railStealEngine';
import { useRealtimeTable } from '../../hooks/useRealtimeChannel';
import type { ChallengeSubmission } from '../../types/challenge';

interface RailHolderInfo {
  id: string;
  name: string;
  avatar?: string;
  title: string;
  challengeId: string;
  challengeTitle: string;
  voteCount: number;
  heldSince: string;
  submissionUrl?: string;
}

export const RailStealCard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { professionals } = useTalent();
  const userProfile = professionals.find((p) => p.userId === user?.id) || professionals[0];
  const currentUserId = user?.id || userProfile?.id;

  const [holder, setHolder] = useState<RailHolderInfo | null>(null);
  const [activeChallengeId, setActiveChallengeId] = useState<string>('');
  const [activeChallengeTitle, setActiveChallengeTitle] = useState<string>('Weekly Skill Arena');

  const [userSubmissions, setUserSubmissions] = useState<ChallengeSubmission[]>([]);
  const [selectedSubId, setSelectedSubId] = useState<string>('');
  const [isStealModalOpen, setIsStealModalOpen] = useState(false);
  const [isStealing, setIsStealing] = useState(false);
  const [flashEffect, setFlashEffect] = useState(false);
  const [timeHeldString, setTimeHeldString] = useState<string>('Open Slot');
  const [cooldownExpiresAt, setCooldownExpiresAt] = useState<number | null>(null);
  const [lastAttemptError, setLastAttemptError] = useState<string | null>(null);

  // Realtime subscriptions
  const stealAttempts = useRealtimeTable<{ id: string; challenge_id: string; succeeded: boolean }>(
    'rail_steal_attempts',
    undefined,
    []
  );
  const stealEvents = useRealtimeTable<{ id: string; new_holder_id: string; vote_count_at_steal: number }>(
    'rail_steal_events',
    undefined,
    []
  );

  // Trigger flash animation on incoming steal event
  useEffect(() => {
    if (stealEvents.length > 0) {
      setFlashEffect(true);
      const timer = setTimeout(() => setFlashEffect(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [stealEvents]);

  // Update dynamic "Held for X" timer every minute
  useEffect(() => {
    if (!holder?.heldSince) {
      setTimeHeldString('Open Slot');
      return;
    }

    const updateTimer = () => {
      const start = new Date(holder.heldSince).getTime();
      const diffMs = Math.max(0, Date.now() - start);
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      setTimeHeldString(hours > 0 ? `${hours}h ${mins}m` : `${mins}m`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [holder?.heldSince]);

  // Load real active challenge & winner state
  useEffect(() => {
    async function loadRailState() {
      try {
        const res = await fetch('/api/challenges');
        if (res.ok) {
          const data = await res.json();
          if (data.challenges && data.challenges.length > 0) {
            const active = data.challenges[0];
            setActiveChallengeId(active.id);
            setActiveChallengeTitle(active.title);

            if (active.winner) {
              setHolder({
                id: active.winner.profileId || active.winner.submissionId,
                name: active.winner.name,
                avatar: active.winner.avatar,
                title: active.winner.title || 'Challenge Winner',
                challengeId: active.id,
                challengeTitle: active.title,
                voteCount: active.voteCount || 0,
                heldSince: active.rail_held_since || active.created_at || new Date().toISOString()
              });
            } else if (active.current_rail_holder_id) {
              setHolder({
                id: active.current_rail_holder_id,
                name: 'Active Leader',
                title: 'Current Challenge Top Entry',
                challengeId: active.id,
                challengeTitle: active.title,
                voteCount: active.current_rail_vote_count || 0,
                heldSince: active.rail_held_since || new Date().toISOString()
              });
            }
          }
        }
      } catch {
        // Fallback
      }
    }

    loadRailState();
  }, []);

  // Fetch user's eligible submissions & restore cooldown state
  useEffect(() => {
    async function loadUserSubs() {
      if (!currentUserId) return;
      try {
        const res = await fetch(`/api/challenges?route=my-submissions&profileId=${currentUserId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.submissions && data.submissions.length > 0) {
            setUserSubmissions(data.submissions);
            const initialSubId = data.submissions[0].id;
            setSelectedSubId(initialSubId);

            // Check if there is stored cooldown for this submission
            const storedCooldown = localStorage.getItem(`rail_steal_cooldown_${currentUserId}_${initialSubId}`);
            if (storedCooldown) {
              const expireTime = parseInt(storedCooldown, 10);
              if (expireTime > Date.now()) {
                setCooldownExpiresAt(expireTime);
              } else {
                localStorage.removeItem(`rail_steal_cooldown_${currentUserId}_${initialSubId}`);
              }
            }
          }
        }
      } catch {
        // Fallback
      }
    }

    loadUserSubs();
  }, [currentUserId]);

  // When selected submission changes, check cooldown
  useEffect(() => {
    if (!currentUserId || !selectedSubId) return;
    const nextEligible = getNextEligibleTimestamp(currentUserId, selectedSubId);
    if (nextEligible && nextEligible > Date.now()) {
      setCooldownExpiresAt(nextEligible);
    } else {
      const stored = localStorage.getItem(`rail_steal_cooldown_${currentUserId}_${selectedSubId}`);
      if (stored) {
        const exp = parseInt(stored, 10);
        if (exp > Date.now()) setCooldownExpiresAt(exp);
        else setCooldownExpiresAt(null);
      } else {
        setCooldownExpiresAt(null);
      }
    }
  }, [selectedSubId, currentUserId]);

  // Handle Steal Attempt Execution
  const handleExecuteSteal = async () => {
    if (!currentUserId) {
      toast.error('Please log in or create a developer profile first.');
      navigate('/auth');
      return;
    }

    if (!selectedSubId && userSubmissions.length === 0) {
      toast.error('You need an active challenge submission to attempt a rail steal!');
      setIsStealModalOpen(false);
      navigate('/arena');
      return;
    }

    setIsStealing(true);
    setLastAttemptError(null);

    try {
      const targetSubId = selectedSubId || userSubmissions[0]?.id || '';
      const targetChallengeId = holder?.challengeId || activeChallengeId;
      const result = await attemptRailSteal(
        targetChallengeId,
        targetSubId,
        currentUserId,
        userProfile
      );

      if (result.success) {
        toast.success('🎉 RAIL CLAIMED! You now hold the #1 Top Developer Spot!', {
          description: `You are now holding the Top Developer Rail with ${result.challengerVoteCount} votes.`
        });
        setHolder({
          id: currentUserId,
          name: userProfile?.name || 'You',
          title: userProfile?.title || 'Top Developer',
          avatar: userProfile?.avatar,
          challengeId: targetChallengeId,
          challengeTitle: activeChallengeTitle,
          voteCount: result.challengerVoteCount || 1,
          heldSince: new Date().toISOString()
        });
        setIsStealModalOpen(false);
        setFlashEffect(true);
        setTimeout(() => setFlashEffect(false), 2500);
      } else {
        // Handle Cooldown timestamp if rate-limited or failed attempt
        if (result.nextEligibleAt) {
          setCooldownExpiresAt(result.nextEligibleAt);
          localStorage.setItem(`rail_steal_cooldown_${currentUserId}_${targetSubId}`, result.nextEligibleAt.toString());
        }

        const reasonMsg = Array.isArray(result.reason)
          ? result.reason.join(' ')
          : result.reason || 'Not enough votes yet to take the Rail.';

        setLastAttemptError(reasonMsg);

        toast.error('❌ Steal Attempt Failed', {
          description: reasonMsg,
          duration: 6000
        });
      }
    } catch (err: any) {
      toast.error('Failed to attempt rail steal: ' + (err.message || 'Error'));
    } finally {
      setIsStealing(false);
    }
  };

  const attemptsTodayCount = stealAttempts.length;
  const isCooldownActive = Boolean(cooldownExpiresAt && cooldownExpiresAt > Date.now());

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div
        className={`relative bg-white border border-[#E5E5E5] p-6 sm:p-8 transition-colors ${
          flashEffect ? 'ring-2 ring-[#FF5A1F] bg-[#FAFAF9]' : ''
        }`}
      >
        {/* Top Eyebrow Tag & Live Counters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#E5E5E5] mb-6">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-[#1A1A1A] text-white font-sans text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-[#FF5A1F]" />
              #1 Top Developer Rail
            </span>
            <span className="px-2.5 py-1 bg-[#FAFAF9] border border-[#E5E5E5] text-[#FF5A1F] font-sans text-xs font-semibold uppercase flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#FF5A1F]" />
              Live Takeover
            </span>
          </div>

          {/* Social Proof Live Counter & Timer */}
          <div className="flex items-center gap-3 text-xs text-[#525252]">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#FAFAF9] border border-[#E5E5E5]">
              <Users className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span><strong className="text-[#1A1A1A] font-semibold">{attemptsTodayCount}</strong> attempts recorded</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#FAFAF9] border border-[#E5E5E5]">
              <Clock className="w-3.5 h-3.5 text-[#525252]" />
              <span>{holder ? <>Held for <strong className="font-mono font-semibold text-[#1A1A1A]">{timeHeldString}</strong></> : 'Open for Takeover'}</span>
            </div>
          </div>
        </div>

        {/* Center Main Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left / Center Holder Spotlight */}
          <div className="lg:col-span-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative shrink-0">
              {holder?.avatar ? (
                <img
                  src={holder.avatar}
                  alt={holder.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 border border-[#E5E5E5] object-cover bg-[#FAFAF9]"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 border border-[#E5E5E5] bg-[#FAFAF9] flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-[#FF5A1F]" />
                </div>
              )}
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#FF5A1F] flex items-center justify-center">
                <Crown className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            <div className="space-y-2 min-w-0 w-full font-sans">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#FAFAF9] border border-[#E5E5E5] text-[#1A1A1A] font-semibold text-[11px] uppercase tracking-wider">
                  {holder ? 'CURRENT #1 HOLDER' : 'OPEN FOR TAKEOVER'}
                </span>
                <span className="text-xs text-[#737373] font-normal flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Placement
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight truncate">
                {holder ? holder.name : 'Unclaimed #1 Champion Rail'}
              </h2>

              <p className="text-sm text-[#525252] font-normal truncate">
                {holder ? holder.title : 'First qualifying project submission takes the #1 flagship spot.'}
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-3 text-xs">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAFAF9] border border-[#E5E5E5] text-[#1A1A1A] truncate max-w-full font-medium">
                  <Trophy className="w-3.5 h-3.5 text-[#FF5A1F] shrink-0" />
                  <span className="truncate">Prompt: {holder ? holder.challengeTitle : activeChallengeTitle}</span>
                </div>

                <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E5E5E5] font-mono font-bold text-[#FF5A1F] shrink-0">
                  <span>{holder ? `${holder.voteCount} Community Votes` : '0 Votes (Open to Beat)'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Action Callout */}
          <div className="lg:col-span-4 bg-[#FAFAF9] border border-[#E5E5E5] p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-1.5 font-sans">
              <div className="text-[11px] font-semibold text-[#737373] uppercase tracking-wider">CHALLENGER ACTION</div>
              <h3 className="text-sm font-bold text-[#1A1A1A] leading-snug">
                {holder ? 'Think your project is better? Steal the crown.' : 'Be the first creator to hold the #1 Rail.'}
              </h3>
              <p className="text-xs text-[#525252] leading-relaxed">
                {holder
                  ? `If your submission has more than ${holder.voteCount} votes, you instantly take over the #1 Top Developer Rail.`
                  : 'Submit your 3-day challenge project for $5 and claim site-wide #1 visibility.'}
              </p>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-[#E5E5E5]">
              <button
                type="button"
                disabled={isCooldownActive}
                onClick={() => {
                  if (!user && !userProfile) {
                    toast.error('Log in to contest the rail');
                    navigate('/auth');
                    return;
                  }
                  setIsStealModalOpen(true);
                }}
                className={`w-full py-3 px-4 text-white font-sans text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 border ${
                  isCooldownActive
                    ? 'bg-slate-400 border-slate-400 cursor-not-allowed text-slate-100'
                    : 'bg-[#FF5A1F] border-[#FF5A1F] hover:bg-[#E54E17] hover:border-[#E54E17] cursor-pointer'
                }`}
              >
                {isCooldownActive && cooldownExpiresAt ? (
                  <div className="flex items-center gap-1.5 font-mono">
                    <Clock className="w-3.5 h-3.5 text-white" />
                    <span>Cooldown: </span>
                    <Countdown
                      date={cooldownExpiresAt}
                      onComplete={() => setCooldownExpiresAt(null)}
                      renderer={({ minutes, seconds }) => (
                        <span className="font-bold">
                          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                        </span>
                      )}
                    />
                  </div>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-white" />
                    <span>Attempt Rail Steal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <Link
                to="/arena"
                className="block text-center text-xs font-medium text-[#525252] hover:text-[#1A1A1A] transition"
              >
                Don't have an entry yet? Enter for $5 ↗
              </Link>
            </div>
          </div>

        </div>

        {/* Footer Guarantee */}
        <div className="mt-6 pt-4 border-t border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-sans text-[#737373]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-600 shrink-0" />
            <span>Top Developer Rail placement is earned by community vote count, not chance or payment amount. Zero cash prizes.</span>
          </div>
          <div>
            <span>Real-time anti-bot verified voting.</span>
          </div>
        </div>

      </div>

      {/* Steal Modal */}
      {isStealModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 backdrop-blur-xs font-mono">
          <div className="bg-[#fffdfa] border-3 border-black w-full max-w-lg p-5 sm:p-8 space-y-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative max-h-[95vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b-2 border-black pb-3">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#e8622c] text-white text-[10px] font-black uppercase">
                  <Flame className="w-3 h-3 fill-white" />
                  CONFIRM STEAL ATTEMPT
                </div>
                <h3 className="text-lg sm:text-xl font-black text-black uppercase">
                  Steal Top Developer Rail
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsStealModalOpen(false)}
                className="w-8 h-8 border-2 border-black bg-white hover:bg-slate-100 font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-amber-50 border-2 border-amber-300 space-y-1.5">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-600" />
                  Target to Beat: {holder ? `${holder.name} (${holder.voteCount} votes)` : '0 Votes (Open Claim)'}
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  {holder
                    ? <>Your entry must have strictly more than <strong>{holder.voteCount} votes</strong> to take the Rail.</>
                    : 'Any active verified submission will immediately claim the #1 Rail spot!'}
                </p>
              </div>

              {lastAttemptError && (
                <div className="p-3 bg-red-50 border-2 border-red-400 space-y-1 text-red-800">
                  <div className="font-bold uppercase flex items-center gap-1.5 text-xs text-red-900">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    Attempt Result:
                  </div>
                  <p className="text-[11px] font-medium leading-relaxed">
                    {lastAttemptError}
                  </p>
                </div>
              )}

              {userSubmissions.length > 0 ? (
                <div className="space-y-2">
                  <label className="font-bold text-black uppercase text-[11px] block">
                    Select Your Qualifying Submission:
                  </label>
                  <select
                    value={selectedSubId}
                    onChange={(e) => setSelectedSubId(e.target.value)}
                    className="w-full p-2.5 bg-white border-2 border-black font-mono text-xs font-bold focus:outline-hidden"
                  >
                    {userSubmissions.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.title || sub.challengeTitle || 'Submission'} — ({sub.voteCount} votes)
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="p-4 bg-white border-2 border-black space-y-2 text-center">
                  <AlertTriangle className="w-6 h-6 text-orange-500 mx-auto" />
                  <div className="font-bold text-black uppercase">No active challenge entry found</div>
                  <p className="text-[11px] text-slate-600">
                    To contest and steal the rail, first enter a skill challenge for $5 and build your project.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsStealModalOpen(false);
                      navigate('/arena');
                    }}
                    className="mt-1 px-4 py-2 bg-black hover:bg-[#e8622c] text-white text-xs font-bold uppercase transition"
                  >
                    [ ENTER ARENA NOW ]
                  </button>
                </div>
              )}
            </div>

            <div className="pt-3 border-t-2 border-black flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setIsStealModalOpen(false)}
                className="min-h-[44px] px-4 py-2 bg-white hover:bg-slate-100 text-black border-2 border-black font-mono text-xs font-bold uppercase cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isStealing || isCooldownActive || userSubmissions.length === 0}
                onClick={handleExecuteSteal}
                className={`min-h-[44px] px-5 py-2 font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                  isCooldownActive
                    ? 'bg-slate-400 text-slate-200 cursor-not-allowed'
                    : 'bg-[#e8622c] hover:bg-black text-white cursor-pointer disabled:opacity-50'
                }`}
              >
                {isStealing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying Votes...</span>
                  </>
                ) : isCooldownActive && cooldownExpiresAt ? (
                  <div className="flex items-center gap-1">
                    <span>Try again in </span>
                    <Countdown
                      date={cooldownExpiresAt}
                      onComplete={() => setCooldownExpiresAt(null)}
                      renderer={({ minutes, seconds }) => (
                        <span className="font-black text-amber-200">
                          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                        </span>
                      )}
                    />
                  </div>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    <span>Execute Steal</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RailStealCard;
