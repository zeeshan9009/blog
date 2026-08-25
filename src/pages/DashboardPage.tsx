import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Trophy,
  Sparkles,
  Settings,
  ShieldCheck,
  Award,
  Vote,
  ExternalLink,
  Building2,
  CheckCircle2,
  Clock,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTalent } from '../context/TalentContext';
import { RankLancrLogo } from '../components/brand/RankLancrLogo';
import { calculateProfileQualityScore } from '../services/ranking/profileQualityScore';
import { calculateProfessionalScore } from '../services/ranking/professionalScore';
import type { Professional } from '../types/talent';
import type { Challenge, ChallengeSubmission, ChallengeBadge, ChallengeSponsorship } from '../types/challenge';
import toast from 'react-hot-toast';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { professionals } = useTalent();

  const [activeTab, setActiveTab] = useState<'overview' | 'entries' | 'submissions' | 'badges' | 'sponsorships'>('overview');
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [mySubmissions, setMySubmissions] = useState<ChallengeSubmission[]>([]);
  const [myBadges, setMyBadges] = useState<ChallengeBadge[]>([]);
  const [mySponsorships, setMySponsorships] = useState<ChallengeSponsorship[]>([]);
  const [loading, setLoading] = useState(true);

  const myProfile = useMemo<Professional>(() => {
    const found = professionals.find(p => p.userId === user?.id || p.id === user?.id) || (user ? null : professionals[0]);
    if (found) return found;
    return {
      id: user?.id || 'demo-provider',
      name: user?.name || 'Challenge Creator',
      title: 'Full Stack Engineer',
      category: 'Web Development',
      location: 'Global',
      country: 'Global',
      avatar: user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'Pro')}`,
      bio: '',
      hourlyRate: 50,
      experienceYears: 3,
      score: 85,
      rating: 5.0,
      reviewCount: 0,
      skills: ['TypeScript', 'Next.js', 'React', 'Tailwind CSS'],
      experience: [],
      portfolio: [],
      reviews: [],
      externalLinks: {},
      isVerified: true,
      isPromoted: false,
      viewsCount: 0,
      clicksCount: 0,
      inquiriesCount: 0,
      createdAt: new Date().toISOString()
    };
  }, [professionals, user]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const res = await fetch('/api/challenges');
        if (res.ok) {
          const data = await res.json();
          setActiveChallenges(data.challenges || []);
        }
      } catch (e) {
        console.warn('Dashboard fetch error:', e);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const qualityScoreNorm = useMemo(() => calculateProfileQualityScore(myProfile), [myProfile]);
  const completenessPercent = Math.round(qualityScoreNorm * 100);
  const proScoreResult = useMemo(() => calculateProfessionalScore(myProfile), [myProfile]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-[#e8622c] selection:text-white pb-24">
      
      {/* 1. Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-black py-3 px-4 sm:px-8 shadow-xs">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RankLancrLogo size="sm" showDomain={true} />
            <span className="px-2 py-0.5 bg-black text-white font-mono text-[10px] font-bold uppercase tracking-wider">
              CHALLENGE DASHBOARD
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/arena')}
              className="px-3.5 py-1.5 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-bold transition flex items-center gap-1.5 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>[ ENTER ARENA ]</span>
            </button>

            <Link
              to="/settings"
              className="p-1.5 border-2 border-black bg-slate-100 hover:bg-slate-200 transition"
              title="Settings"
            >
              <Settings className="w-4 h-4 text-black" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-8 space-y-8">
        
        {/* Profile Card & Stats Banner */}
        <div className="bg-white border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={myProfile.avatar}
              alt={myProfile.name}
              className="w-16 h-16 border-2 border-black object-cover shrink-0 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-black tracking-tight">{myProfile.name}</h1>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold uppercase border border-emerald-300">
                  CREATOR PASSPORT
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">{myProfile.title}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
            <div className="p-3 bg-slate-50 border border-black text-center">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">ProRank Quality</span>
              <span className="text-xl font-black text-black">{proScoreResult.displayScore}/100</span>
            </div>
            <div className="p-3 bg-orange-50 border border-black text-center">
              <span className="text-[10px] text-[#e8622c] uppercase block font-bold">Completed Arenas</span>
              <span className="text-xl font-black text-[#e8622c]">{mySubmissions.length}</span>
            </div>
            <div className="col-span-2 sm:col-span-1 p-3 bg-amber-50 border border-black text-center">
              <span className="text-[10px] text-amber-800 uppercase block font-bold">Badges Won</span>
              <span className="text-xl font-black text-amber-600">{myBadges.length}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b-2 border-black overflow-x-auto pb-0 font-mono text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 px-4 border-t-2 border-x-2 border-black -mb-[2px] transition cursor-pointer ${
              activeTab === 'overview' ? 'bg-black text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            ARENA OVERVIEW
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`py-2.5 px-4 border-t-2 border-x-2 border-black -mb-[2px] transition cursor-pointer ${
              activeTab === 'submissions' ? 'bg-black text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            MY SUBMISSIONS ({mySubmissions.length})
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`py-2.5 px-4 border-t-2 border-x-2 border-black -mb-[2px] transition cursor-pointer ${
              activeTab === 'badges' ? 'bg-black text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            EARNED BADGES ({myBadges.length})
          </button>
          <button
            onClick={() => setActiveTab('sponsorships')}
            className={`py-2.5 px-4 border-t-2 border-x-2 border-black -mb-[2px] transition cursor-pointer ${
              activeTab === 'sponsorships' ? 'bg-black text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            MY SPONSORSHIPS ({mySponsorships.length})
          </button>
        </div>

        {/* Tab Panels */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-black tracking-tight font-mono">
                CURRENT LIVE ARENAS
              </h2>
              <span className="text-xs font-mono text-slate-500">
                {activeChallenges.length} Active Challenges
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeChallenges.map((ch) => (
                <div
                  key={ch.id}
                  className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-orange-100 text-[#e8622c] font-mono text-[10px] font-bold uppercase">
                        {ch.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500">
                        $5.00 Entry
                      </span>
                    </div>

                    <h3 className="text-base font-black text-black tracking-tight">{ch.title}</h3>
                    <p className="text-xs text-slate-600 font-medium line-clamp-2">{ch.prompt}</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-200 flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/arena?challenge=${ch.id}`)}
                      className="w-full py-2 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition text-center cursor-pointer"
                    >
                      [ VIEW ARENA ]
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-base font-black text-black mb-4">My Submitted Projects</h3>
            {mySubmissions.length > 0 ? (
              <div className="space-y-3">
                {mySubmissions.map((sub) => (
                  <div key={sub.id} className="p-4 border border-black flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-black">{sub.title}</h4>
                      <a href={sub.submissionUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline">
                        {sub.submissionUrl}
                      </a>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#e8622c]">{sub.voteCount} Votes</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 font-mono text-xs space-y-2">
                <Trophy className="w-8 h-8 mx-auto text-slate-400" />
                <p>You have not submitted projects to active arenas yet.</p>
                <button
                  onClick={() => navigate('/arena')}
                  className="px-4 py-2 bg-black text-white font-bold hover:bg-[#e8622c] transition mt-2 inline-block cursor-pointer"
                >
                  Browse Active Challenges
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-base font-black text-black mb-4">Earned Arena Badges</h3>
            {myBadges.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {myBadges.map((b) => (
                  <div key={b.id} className="p-4 bg-amber-50 border-2 border-black text-center space-y-2">
                    <Award className="w-8 h-8 text-amber-500 mx-auto" />
                    <div className="font-mono font-bold text-xs uppercase text-black">{b.badgeType.replace('_', ' ')}</div>
                    <div className="text-[11px] text-slate-600">{b.challengeTitle}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 font-mono text-xs">
                <Award className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p>No badges earned yet. Place in the top 3 of a challenge arena to unlock permanent badges!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'sponsorships' && (
          <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-base font-black text-black mb-4">My Brand Sponsorships</h3>
            {mySponsorships.length > 0 ? (
              <div className="space-y-3">
                {mySponsorships.map((s) => (
                  <div key={s.id} className="p-4 border border-black flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-black">{s.companyName}</h4>
                      <span className="font-mono text-xs text-amber-700 uppercase">{s.tier} Sponsor</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-600">${(s.amountCents / 100).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 font-mono text-xs space-y-2">
                <Building2 className="w-8 h-8 mx-auto text-slate-400" />
                <p>No active brand sponsorships. Sponsor a challenge arena to promote your product to builders.</p>
                <button
                  onClick={() => navigate('/arena')}
                  className="px-4 py-2 bg-black text-white font-bold hover:bg-[#e8622c] transition mt-2 inline-block cursor-pointer"
                >
                  Explore Arenas to Sponsor
                </button>
              </div>
            )}
          </div>
        )}

      </main>

    </div>
  );
};

export default DashboardPage;
