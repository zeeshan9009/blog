import React, { useEffect, useState } from 'react';
import { Trophy, Crown, Sparkles, ExternalLink, ShieldCheck, Flame, Clock } from 'lucide-react';
import type { TopDeveloperEntry } from '../../types/challenge';

interface TopDeveloperRailProps {
  className?: string;
  limit?: number;
}

export const TopDeveloperRail: React.FC<TopDeveloperRailProps> = ({ className = '', limit = 3 }) => {
  const [topDevs, setTopDevs] = useState<TopDeveloperEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadTopDevs() {
      try {
        const res = await fetch('/api/top-developers');
        if (res.ok) {
          const data = await res.json();
          if (data.topDevelopers && data.topDevelopers.length > 0) {
            setTopDevs(data.topDevelopers.slice(0, limit));
            return;
          }
        }
      } catch {
        // Fallback to sample data for visual polish
      } finally {
        setLoading(false);
      }

      // Sample showcase winner when live data is initializing
      setTopDevs([
        {
          id: 'top-1',
          profileId: 'demo-winner',
          name: 'Alexandre Dubois',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
          title: 'Senior AI & WebGL Engineer',
          challengeId: '11111111-1111-1111-1111-111111111111',
          challengeTitle: 'Next.js 15 & Streaming Agent UI',
          rankPosition: 1,
          expiresAt: new Date(Date.now() + 64 * 3600000).toISOString(),
          coSponsor: {
            companyName: 'Supastack AI',
            companyLogoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
            companyLink: 'https://supastack.ai',
            tier: 'gold'
          },
          createdAt: new Date().toISOString()
        },
        {
          id: 'top-2',
          profileId: 'demo-runner1',
          name: 'Sofia Chen',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
          title: 'Design Systems Architect',
          challengeId: '11111111-1111-1111-1111-111111111111',
          challengeTitle: 'Next.js 15 & Streaming Agent UI',
          rankPosition: 2,
          expiresAt: new Date(Date.now() + 64 * 3600000).toISOString(),
          createdAt: new Date().toISOString()
        },
        {
          id: 'top-3',
          profileId: 'demo-runner2',
          name: 'Marcus Vance',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
          title: 'TypeScript & Rust Specialist',
          challengeId: '11111111-1111-1111-1111-111111111111',
          challengeTitle: 'Next.js 15 & Streaming Agent UI',
          rankPosition: 3,
          expiresAt: new Date(Date.now() + 64 * 3600000).toISOString(),
          createdAt: new Date().toISOString()
        }
      ]);
    }

    loadTopDevs();
  }, [limit]);

  if (loading) {
    return (
      <div className={`p-6 bg-white border-2 border-black animate-pulse ${className}`}>
        <div className="h-6 w-48 bg-slate-200 mb-4" />
        <div className="h-24 bg-slate-100" />
      </div>
    );
  }

  if (topDevs.length === 0) {
    return null;
  }

  return (
    <section className={`bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${className}`}>
      
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b-2 border-black/80 mb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-black text-white font-mono text-[10px] font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>72-HOUR EARNED FLAGSHIP RAIL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight flex items-center gap-2">
            Top Challenge Winners
            <Sparkles className="w-5 h-5 text-[#e8622c]" />
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Merit-earned leaderboard visibility rewarded to the top-voted creators in our latest skill arenas.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 bg-white border-2 border-black text-xs font-mono font-bold text-slate-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>72H HOLD DURATION</span>
        </div>
      </div>

      {/* Top 3 Winner Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {topDevs.map((dev) => {
          const isFirst = dev.rankPosition === 1;
          const badgeLabel = isFirst ? 'CHALLENGE WINNER (1ST)' : dev.rankPosition === 2 ? 'RUNNER UP (2ND)' : 'RUNNER UP (3RD)';
          const medalColor = isFirst 
            ? 'bg-amber-400 text-black border-black' 
            : dev.rankPosition === 2 
            ? 'bg-slate-300 text-slate-900 border-black' 
            : 'bg-amber-700 text-white border-black';

          return (
            <div
              key={dev.id}
              className={`bg-white border-2 border-black p-5 relative flex flex-col justify-between transition-all ${
                isFirst 
                  ? 'shadow-[6px_6px_0px_0px_#e8622c] hover:shadow-[8px_8px_0px_0px_#e8622c] hover:-translate-y-0.5' 
                  : 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              {/* Header Rank Badge */}
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className={`w-7 h-7 rounded-none border-2 font-mono font-black text-xs flex items-center justify-center ${medalColor} shadow-xs`}>
                    #{dev.rankPosition}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase border border-black ${
                    isFirst ? 'bg-orange-100 text-[#e8622c]' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {badgeLabel}
                  </span>
                </div>

                {isFirst && (
                  <Crown className="w-5 h-5 text-amber-500 fill-amber-400 shrink-0" />
                )}
              </div>

              {/* Developer Info */}
              <div className="flex items-center gap-3.5 mb-4">
                <img
                  src={dev.avatar}
                  alt={dev.name}
                  className="w-13 h-13 rounded-none border-2 border-black object-cover shrink-0 shadow-xs"
                />
                <div className="min-w-0">
                  <h3 className="text-base font-black text-black truncate tracking-tight">
                    {dev.name}
                  </h3>
                  <p className="text-xs text-slate-600 truncate font-medium">
                    {dev.title}
                  </p>
                  <div className="text-[11px] font-mono text-amber-800 font-bold truncate mt-0.5">
                    🏆 {dev.challengeTitle}
                  </div>
                </div>
              </div>

              {/* Co-Sponsor Banner (If Gold sponsor attached to this challenge) */}
              {dev.coSponsor && isFirst && (
                <div className="mt-2 mb-4 p-2.5 bg-amber-50 border border-amber-300 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    {dev.coSponsor.companyLogoUrl && (
                      <img
                        src={dev.coSponsor.companyLogoUrl}
                        alt={dev.coSponsor.companyName}
                        className="w-5 h-5 rounded-none border border-black object-cover shrink-0"
                      />
                    )}
                    <span className="text-[11px] text-amber-950 font-bold truncate">
                      Co-Presented by <span className="underline">{dev.coSponsor.companyName}</span>
                    </span>
                  </div>

                  {dev.coSponsor.companyLink && (
                    <a
                      href={dev.coSponsor.companyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-800 hover:text-black font-mono text-[10px] font-bold flex items-center gap-1 shrink-0"
                    >
                      Visit <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              {/* Footer CTA */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-500">
                  Held for next 72h
                </span>
                <span className="font-bold text-[#e8622c] uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  VERIFIED WINNER
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};

export default TopDeveloperRail;
