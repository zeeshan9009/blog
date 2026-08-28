import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

/**
 * SCALE / TRAFFIC SPIKE MONITORING NOTE:
 * Monitor Supabase Dashboard → Realtime → concurrent connections if traffic spikes.
 * If nearing plan limits, migrate ActivityFeedTicker and LiveVoteBattle broadcast channels
 * to Pusher or Ably; keep rail_steal_events/challenge_votes Postgres Changes on Supabase
 * since those are lower-frequency.
 */

/**
 * Realtime hook subscribing to Supabase postgres_changes for a given table.
 */
export function useRealtimeTable<T extends { id?: string | number }>(
  table: string,
  filter?: string,
  initialData: T[] = []
): T[] {
  const [rows, setRows] = useState<T[]>(initialData);

  useEffect(() => {
    if (initialData.length > 0 && rows.length === 0) {
      setRows(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    const channelId = `realtime:${table}${filter ? `:${filter}` : ''}:${Date.now().toString(36)}`;
    
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes' as any,
        {
          event: '*',
          schema: 'public',
          table,
          ...(filter ? { filter } : {})
        },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            setRows((prev) => [payload.new as T, ...prev].slice(0, 50));
          } else if (payload.eventType === 'UPDATE') {
            setRows((prev) =>
              prev.map((r: any) => (r.id === payload.new?.id ? { ...r, ...payload.new } : r))
            );
          } else if (payload.eventType === 'DELETE') {
            setRows((prev) => prev.filter((r: any) => r.id !== payload.old?.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter]);

  return rows;
}

/**
 * Hook to listen for user-specific Supabase broadcasts (e.g. when someone steals their rail spot).
 */
export function useUserBroadcast(
  userId?: string | null,
  onRailStolen?: (payload: { stolenBy: string; voteCount?: number; challengeId?: string }) => void
) {
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`user:${userId}`)
      .on('broadcast', { event: 'rail_stolen' }, (payload: any) => {
        const data = payload?.payload || payload;
        const stolenBy = data?.stolenBy || 'Another developer';
        toast.error(`⚠️ Your Top Developer Rail spot was stolen by ${stolenBy}!`, {
          description: data?.voteCount ? `They reached ${data.voteCount} votes.` : 'Submit more work to reclaim #1!',
          duration: 8000
        });
        if (onRailStolen) {
          onRailStolen(data);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, onRailStolen]);
}
