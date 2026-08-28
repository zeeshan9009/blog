import React, { useState, useEffect } from 'react';
import { Flame, Zap, Trophy, Vote, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRealtimeTable } from '../../hooks/useRealtimeChannel';
import { supabase } from '../../lib/supabase';

export interface ActivityFeedItem {
  id: string;
  event_type: 'rail_steal' | 'new_vote' | 'new_entry' | 'spotlight_outbid' | 'challenge_won';
  actor_id?: string;
  actor_display_name: string;
  metadata?: any;
  created_at: string;
}

export const ActivityFeedTicker: React.FC = () => {
  const realtimeEvents = useRealtimeTable<ActivityFeedItem>('activity_feed', undefined, []);
  const [items, setItems] = useState<ActivityFeedItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load initial real events from Supabase or API
  useEffect(() => {
    async function loadRealFeed() {
      try {
        const { data, error } = await supabase
          .from('activity_feed')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (!error && data && data.length > 0) {
          setItems(data as ActivityFeedItem[]);
        }
      } catch {
        // Handle silently
      }
    }

    loadRealFeed();
  }, []);

  // Update when realtime events arrive
  useEffect(() => {
    if (realtimeEvents.length > 0) {
      setItems((prev) => {
        const combined = [...realtimeEvents, ...prev];
        const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
        return unique.slice(0, 30);
      });
    }
  }, [realtimeEvents]);

  // Cycle ticker every 4 seconds
  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [items.length]);

  const currentEvent = items[currentIndex] || items[0];

  const renderEventIcon = (type?: ActivityFeedItem['event_type']) => {
    switch (type) {
      case 'rail_steal':
        return <Trophy className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />;
      case 'new_vote':
        return <Vote className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'new_entry':
        return <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
      case 'spotlight_outbid':
        return <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400 shrink-0" />;
      case 'challenge_won':
        return <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      default:
        return <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
    }
  };

  const renderEventText = (event?: ActivityFeedItem) => {
    if (!event) {
      return (
        <span className="text-slate-200">
          ⚡ Challenge Arena is open — Submit your project to contest and claim the #1 Top Developer Rail!
        </span>
      );
    }

    const actor = <strong className="text-white font-bold">{event.actor_display_name}</strong>;
    switch (event.event_type) {
      case 'rail_steal':
        return (
          <>
            🔴 {actor} just <span className="text-[#ff8a58] font-bold">claimed the #1 Top Developer Rail</span>
            {event.metadata?.vote_count ? ` (${event.metadata.vote_count} votes)` : ''}
          </>
        );
      case 'new_vote':
        return (
          <>
            🟢 {actor} cast a public vote for {event.metadata?.challenge_title || 'a top project'}
          </>
        );
      case 'new_entry':
        return (
          <>
            🚀 {actor} entered the $5 Skill Challenge Arena
          </>
        );
      case 'spotlight_outbid':
        return (
          <>
            🔥 {actor} claimed #{event.metadata?.position || 1} Spotlight for {event.metadata?.amount || 'Top Slot'}
          </>
        );
      case 'challenge_won':
        return (
          <>
            👑 {actor} won the 72-Hour Flagship Rail hold
          </>
        );
      default:
        return (
          <>
            ⚡ {actor} performed live activity on RankLancr
          </>
        );
    }
  };

  const timeAgo = (() => {
    if (!currentEvent?.created_at) return 'Live now';
    try {
      return formatDistanceToNow(new Date(currentEvent.created_at), { addSuffix: true });
    } catch {
      return 'just now';
    }
  })();

  return (
    <div className="w-full max-w-2xl mx-auto px-2">
      <div className="bg-slate-950/90 text-white border border-slate-800 rounded-full px-4 py-2 text-xs shadow-modern-lg backdrop-blur-md flex items-center justify-between gap-3 overflow-hidden">
        {/* Left: Live indicator + Icon */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="bg-[#e8622c] text-white px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider">
            LIVE
          </span>
          {renderEventIcon(currentEvent?.event_type)}
        </div>

        {/* Middle: Event text ticker */}
        <div className="flex-1 truncate text-slate-200 text-left transition-opacity duration-300 font-sans">
          {renderEventText(currentEvent)}
        </div>

        {/* Right: Timestamp */}
        <div className="text-[11px] text-slate-400 shrink-0 font-mono hidden sm:block">
          {timeAgo}
        </div>
      </div>
    </div>
  );
};

export default ActivityFeedTicker;
