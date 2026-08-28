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
      <div className={`p-6 bg-white border border-[#E5E5E5] animate-pulse ${className}`}>
        <div className="h-6 w-48 bg-slate-200 mb-4" />
        <div className="h-24 bg-slate-100" />
      </div>
    );
  }

  // If real winners exist in the database, render real winners
  const hasRealWinners = topDevs.length > 0;

  return (
    <section className={`bg-white border border-[#E5E5E5] p-6 sm:p-8 ${className} font-sans`}>
      
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#E5E5E5] mb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#FAFAF9] border border-[#E5E5E5] text-[10px] sm:text-[11px] font-semibold text-[#FF5A1F] uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" />
            <span>72-Hour Earned Flagship Rail</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight flex items-center gap-2">
            Top Challenge Winners Rail
          </h2>
          <p className="text-xs sm:text-sm text-[#525252] font-normal">
            Merit-earned leaderboard visibility rewarded to the top-voted creators in our latest skill arenas.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1 bg-[#FAFAF9] border border-[#E5E5E5] text-xs font-semibold text-[#525252]">
          <Clock className="w-3.5 h-3.5 text-[#FF5A1F]" />
          <span>72H Visibility Reward</span>
        </div>
      </div>

      {/* Grid: Either Real Winners OR Live Claimable Challenge Slots */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {hasRealWinners ? (
          topDevs.map((dev) => {
            const isFirst = dev.rankPosition === 1;
            const badgeLabel = isFirst ? 'CHALLENGE WINNER (1ST)' : dev.rankPosition === 2 ? 'RUNNER UP (2ND)' : 'RUNNER UP (3RD)';
            const medalBg = isFirst 
              ? 'bg-[#FF5A1F] text-white' 
              : dev.rankPosition === 2 
              ? 'bg-slate-700 text-white' 
              : 'bg-slate-600 text-white';

            return (
              <div
                key={dev.id}
                className="bg-white border border-[#E5E5E5] hover:border-[#D4D4D4] p-5 relative flex flex-col justify-between transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs font-bold ${medalBg}`}>
                      #{dev.rankPosition}
                    </span>
                    <span className="text-[10px] font-semibold tracking-wider text-[#1A1A1A] border border-[#E5E5E5] px-1.5 py-0.5 bg-[#FAFAF9] uppercase">
                      {badgeLabel}
                    </span>
                  </div>
                  {isFirst && <Crown className="w-4 h-4 text-[#FF5A1F]" />}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={dev.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${dev.id}`}
                      alt={dev.name}
                      className="w-12 h-12 border border-[#E5E5E5] object-cover shrink-0 bg-[#FAFAF9]"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#1A1A1A] truncate">{dev.name}</h4>
                      <p className="text-xs text-[#525252] truncate font-normal">{dev.title || 'Top Creator'}</p>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#FAFAF9] border border-[#E5E5E5] space-y-1 text-xs">
                    <div className="text-[11px] text-[#525252] flex justify-between font-mono">
                      <span>Winner Position #{dev.rankPosition}</span>
                      <span>Challenge: {dev.challengeTitle || 'Skill Prompt'}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/arena"
                  className="mt-4 w-full py-2 bg-[#FAFAF9] hover:bg-[#1A1A1A] hover:text-white border border-[#E5E5E5] hover:border-[#1A1A1A] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>View Arena Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })
        ) : (
          [1, 2, 3].map((position) => (
            <div
              key={position}
              className="bg-white border border-[#E5E5E5] p-5 flex flex-col justify-between space-y-4 hover:border-[#D4D4D4] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 bg-[#FAFAF9] border border-[#E5E5E5] text-[10px] font-semibold text-[#1A1A1A] uppercase">
                    POSITION #{position}
                  </span>
                  <span className="text-[10px] text-[#FF5A1F] font-semibold uppercase">
                    OPEN TO EARN
                  </span>
                </div>

                <div className="flex items-center gap-3 my-2">
                  <div className="w-11 h-11 bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-center shrink-0">
                    <Trophy className="w-5 h-5 text-[#FF5A1F]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1A1A1A]">Unclaimed #{position} Spot</h4>
                    <p className="text-xs text-[#525252] font-normal">Next 3-day arena winner takes this placement</p>
                  </div>
                </div>

                <p className="text-xs text-[#525252] font-normal leading-relaxed pt-2">
                  Enter open skill challenges for $5, get public community votes on your project, and hold 72h site-wide visibility.
                </p>
              </div>

              <Link
                to="/arena"
                className="w-full py-2.5 bg-[#FF5A1F] hover:bg-[#E54E17] text-white text-xs font-semibold transition-colors text-center border border-[#FF5A1F]"
              >
                Enter Arena ($5)
              </Link>
            </div>
          ))
        )}
      </div>

    </section>
  );
};

export default TopDeveloperRail;
