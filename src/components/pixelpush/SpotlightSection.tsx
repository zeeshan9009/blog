import React, { useState, useEffect } from 'react';
import { Flame, Zap, ExternalLink, ShieldCheck, Clock, ArrowUpRight, TrendingUp, Sparkles } from 'lucide-react';
import { PlatformBrandIcon } from '../brand/PlatformBrandIcon';
import { SpotlightClaimModal } from '../modals/SpotlightClaimModal';
import type { SpotlightSlot, SpotlightScope, SpotlightStatsSummary } from '../../types/spotlight';

const SCOPES = [
  { label: 'Global Top 3', scope: 'global' as SpotlightScope, category: undefined },
  { label: 'Web Development', scope: 'category' as SpotlightScope, category: 'Web Development' },
  { label: 'UI/UX Design', scope: 'category' as SpotlightScope, category: 'UI/UX Design' },
  { label: 'AI Engineering', scope: 'category' as SpotlightScope, category: 'AI Engineering' },
  { label: 'Mobile Dev', scope: 'category' as SpotlightScope, category: 'Mobile Development' }
];

export const SpotlightSection: React.FC = () => {
  const [selectedScopeIndex, setSelectedScopeIndex] = useState(0);
  const [slots, setSlots] = useState<SpotlightSlot[]>([]);
  const [stats, setStats] = useState<SpotlightStatsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSlotForClaim, setSelectedSlotForClaim] = useState<SpotlightSlot | null>(null);

  const currentTab = SCOPES[selectedScopeIndex];

  // Fetch Spotlight Slots for current scope/category
  const fetchSlots = async () => {
    try {
      const url = currentTab.scope === 'global'
        ? '/api/spotlight?scope=global'
        : `/api/spotlight?scope=category&category=${encodeURIComponent(currentTab.category || '')}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.slots) {
          setSlots(data.slots);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Fallback in case endpoint is local
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Activity Feed Stats
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/spotlight/stats');
      if (res.ok) {
        const data = await res.json();
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchSlots();
    fetchStats();
  }, [selectedScopeIndex]);

  const formatCountdown = (expiresAt?: string | null) => {
    if (!expiresAt) return 'Open slot';
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m left`;
  };

  return (
    <section className="w-full bg-[#fdfbf7] border-y-2 border-black py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-400 border border-black font-mono text-[10px] font-black uppercase text-black shadow-xs">
              <Flame className="w-3.5 h-3.5 fill-black" />
              <span>Ascending Outbid Leaderboard</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-mono text-black tracking-tight">
              🔥 Outbid Spotlight
            </h2>
            <p className="text-xs font-mono text-slate-600 max-w-xl">
              Ascending public auction slots with a guaranteed 72-hour hold. Pay more than the current highest bid to claim #1 placement.
            </p>
          </div>

          {/* Social Proof Stats Pill */}
          {stats && (
            <div className="bg-white border-2 border-black p-2.5 px-4 font-mono text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-bold">Total Claimed</span>
                <span className="font-black text-black">${(stats.totalSpentAllTimeCents / 100).toFixed(0)} USD</span>
              </div>
              <div className="w-px h-6 bg-slate-200" />
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-bold">Hold Duration</span>
                <span className="font-black text-[#e8622c]">72 Hours</span>
              </div>
            </div>
          )}
        </div>

        {/* Scope Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {SCOPES.map((tab, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedScopeIndex(idx)}
              className={`px-3 py-1.5 font-mono text-xs font-bold border-2 transition cursor-pointer whitespace-nowrap ${
                selectedScopeIndex === idx
                  ? 'bg-black text-white border-black shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Top 3 Spotlight Slots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {slots.map((slot) => {
            const hasHolder = Boolean(slot.currentHolderName && !slot.isExpired);
            const priceDollars = (slot.currentPriceCents / 100).toFixed(2);
            const minBidDollars = (slot.nextMinimumBidCents / 100).toFixed(2);

            return (
              <div
                key={slot.id}
                className={`bg-white border-2 border-black p-5 flex flex-col justify-between space-y-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition hover:-translate-y-0.5 ${
                  slot.position === 1 ? 'ring-2 ring-amber-400' : ''
                }`}
              >
                {/* Header: Position Badge + Price + Countdown */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 font-mono text-xs font-black uppercase border border-black ${
                      slot.position === 1 ? 'bg-amber-400 text-black' :
                      slot.position === 2 ? 'bg-slate-200 text-black' :
                      'bg-orange-100 text-black'
                    }`}>
                      #{slot.position} {slot.position === 1 && '👑'}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase text-amber-800 bg-amber-50 px-1.5 py-0.5 border border-amber-300">
                      Spotlight
                    </span>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-sm font-black text-black">
                      ${priceDollars}
                    </div>
                    <div className="text-[9px] text-slate-500">
                      {hasHolder ? formatCountdown(slot.expiresAt) : 'Open Slot'}
                    </div>
                  </div>
                </div>

                {/* Profile Card */}
                <div className="space-y-2 font-mono">
                  {hasHolder ? (
                    <>
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 border-2 border-black bg-slate-50 flex items-center justify-center shrink-0">
                          <PlatformBrandIcon platform={slot.currentHolderPlatform || 'website'} className="w-5 h-5 text-black" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-black text-sm text-black truncate">
                            {slot.currentHolderName}
                          </h4>
                          <p className="text-xs text-slate-600 truncate">
                            {slot.currentHolderTitle}
                          </p>
                        </div>
                      </div>

                      {slot.currentHolderDestinationUrl && (
                        <a
                          href={slot.currentHolderDestinationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#e8622c] hover:text-black transition"
                        >
                          <span>View Direct Profile</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </>
                  ) : (
                    <div className="py-4 text-center space-y-1">
                      <Sparkles className="w-6 h-6 text-amber-500 mx-auto" />
                      <div className="text-xs font-bold text-black uppercase">Unclaimed Slot #{slot.position}</div>
                      <p className="text-[10px] text-slate-500">
                        Claim this slot for <strong>${priceDollars}</strong> and hold #{slot.position} for 72 hours.
                      </p>
                    </div>
                  )}
                </div>

                {/* Action: Outbid / Claim */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 font-mono">
                  <div className="text-[10px] text-slate-500">
                    Next min: <strong className="text-black">${minBidDollars}</strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedSlotForClaim(slot)}
                    className="px-3.5 py-2 bg-black hover:bg-[#e8622c] text-white text-xs font-black uppercase transition cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5"
                  >
                    <span>{hasHolder ? `Outbid ($${minBidDollars})` : `Claim Slot`}</span>
                    <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Activity Ticker */}
        {stats && stats.recentActivity && stats.recentActivity.length > 0 && (
          <div className="bg-white border-2 border-black p-3 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2 text-black font-bold shrink-0">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
              <span>LIVE AUCTION ACTIVITY:</span>
            </div>
            <div className="text-slate-600 truncate text-[11px]">
              🔥 <strong>{stats.recentActivity[0].bidderName}</strong> just claimed #{stats.recentActivity[0].position} in {stats.recentActivity[0].category || 'Global'} for <strong>${(stats.recentActivity[0].amountCents / 100).toFixed(0)} USD</strong>
            </div>
          </div>
        )}

      </div>

      {/* Claim Modal */}
      {selectedSlotForClaim && (
        <SpotlightClaimModal
          isOpen={Boolean(selectedSlotForClaim)}
          onClose={() => setSelectedSlotForClaim(null)}
          onSuccess={() => {
            fetchSlots();
            fetchStats();
          }}
          slot={selectedSlotForClaim}
        />
      )}
    </section>
  );
};

export default SpotlightSection;
