import React, { useEffect, useState } from 'react';
import { Trophy, Crown, Sparkles, ArrowRight, ShieldCheck, Flame, Clock, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
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
        // Handle error silently
      } finally {
        setLoading(false);
      }
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

  // If real winners exist in the database, render real winners
  const hasRealWinners = topDevs.length > 0;

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
            Top Challenge Winners Rail
            <Sparkles className="w-5 h-5 text-[#e8622c]" />
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Merit-earned leaderboard visibility rewarded to the top-voted creators in our latest skill arenas.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 bg-white border-2 border-black text-xs font-mono font-bold text-slate-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>72H VISIBILITY REWARD</span>
        </div>
      </div>

      {/* Grid: Either Real Winners OR Live Claimable Challenge Slots */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {hasRealWinners ? (
          topDevs.map((dev) => {
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
                    ? 'shadow-[6px_6px_0px_0px_#e8622c]' 
                    : 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2 font-mono">
                    <span className={`px-2 py-0.5 text-xs font-black border ${medalColor}`}>
                      #{dev.rankPosition}
                    </span>
                    <span className="text-[10px] font-bold tracking-wider text-black border border-black px-1.5 py-0.5 bg-slate-50 uppercase">
                      {badgeLabel}
                    </span>
                  </div>
                  {isFirst && <Crown className="w-5 h-5 text-amber-500 fill-amber-400" />}
                </div>

                <div className="flex items-center gap-3.5 mb-4">
                  <img
                    src={dev.avatar}
                    alt={dev.name}
                    className="w-12 h-12 rounded-none border-2 border-black object-cover bg-slate-100 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-black text-sm text-black truncate tracking-tight">{dev.name}</h3>
                    <p className="text-xs text-slate-600 truncate">{dev.title}</p>
                    <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-[#e8622c] mt-0.5">
                      <Trophy className="w-3 h-3 shrink-0" />
                      <span className="truncate">{dev.challengeTitle}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Held for next 72h</span>
                  <span className="text-[#e8622c] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> VERIFIED WINNER
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          /* Real Claimable State: 3 Challenge Slots Open */
          <>
            {/* Slot #1: 1st Place */}
            <div className="bg-white border-2 border-black p-5 flex flex-col justify-between space-y-4 shadow-[6px_6px_0px_0px_#e8622c]">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 font-mono">
                  <span className="px-2 py-0.5 text-xs font-black border bg-amber-400 text-black border-black">
                    #1
                  </span>
                  <span className="text-[10px] font-bold text-black border border-black px-1.5 py-0.5 bg-amber-50 uppercase">
                    1ST PLACE • CLAIMABLE
                  </span>
                </div>
                <Crown className="w-5 h-5 text-amber-500 fill-amber-400" />
              </div>

              <div className="space-y-1.5">
                <div className="text-sm font-black text-black font-mono">
                  Champion Showcase Slot
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Reserved for the #1 top-voted winner in our upcoming skill challenge arena.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">72H Site-wide Hold</span>
                <Link
                  to="/arena"
                  className="px-2.5 py-1 bg-[#e8622c] text-white font-mono text-[10px] font-bold uppercase hover:bg-black transition"
                >
                  [ ENTER TO WIN ]
                </Link>
              </div>
            </div>

            {/* Slot #2: 2nd Place */}
            <div className="bg-white border-2 border-black p-5 flex flex-col justify-between space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 font-mono">
                  <span className="px-2 py-0.5 text-xs font-black border bg-slate-200 text-black border-black">
                    #2
                  </span>
                  <span className="text-[10px] font-bold text-black border border-black px-1.5 py-0.5 bg-slate-50 uppercase">
                    2ND PLACE • CLAIMABLE
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-sm font-black text-black font-mono">
                  Runner-Up Showcase Slot
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Reserved for the 2nd place finalist upon community vote resolution.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">72H Site-wide Hold</span>
                <Link
                  to="/arena"
                  className="px-2.5 py-1 bg-black text-white font-mono text-[10px] font-bold uppercase hover:bg-[#e8622c] transition"
                >
                  [ COMPETE ]
                </Link>
              </div>
            </div>

            {/* Slot #3: 3rd Place */}
            <div className="bg-white border-2 border-black p-5 flex flex-col justify-between space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 font-mono">
                  <span className="px-2 py-0.5 text-xs font-black border bg-amber-700 text-white border-black">
                    #3
                  </span>
                  <span className="text-[10px] font-bold text-black border border-black px-1.5 py-0.5 bg-slate-50 uppercase">
                    3RD PLACE • CLAIMABLE
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-sm font-black text-black font-mono">
                  Runner-Up Showcase Slot
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Reserved for the 3rd place finalist upon community vote resolution.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">72H Site-wide Hold</span>
                <Link
                  to="/arena"
                  className="px-2.5 py-1 bg-black text-white font-mono text-[10px] font-bold uppercase hover:bg-[#e8622c] transition"
                >
                  [ COMPETE ]
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

    </section>
  );
};

export default TopDeveloperRail;
