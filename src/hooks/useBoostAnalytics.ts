import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { calculateFairnessScoreFromCounts } from '../services/ranking/fairnessScore.js';

export interface BoostAnalyticsData {
  impressions: number;
  sponsoredImpressions: number;
  clicks: number;
  inquiries: number;
  ctrPercent: number;
  conversionPercent: number;
  fairRotation: {
    status: 'ACTIVE' | 'OPTIMAL' | 'DAMPED';
    exposureRatio: number;
    fairnessFactor: number;
    isDamped: boolean;
    description: string;
  };
  lastUpdated: string;
}

const DEFAULT_ANALYTICS: BoostAnalyticsData = {
  impressions: 0,
  sponsoredImpressions: 0,
  clicks: 0,
  inquiries: 0,
  ctrPercent: 0,
  conversionPercent: 0,
  fairRotation: {
    status: 'ACTIVE',
    exposureRatio: 1.0,
    fairnessFactor: 1.0,
    isDamped: false,
    description: 'Anti-monopoly damping active'
  },
  lastUpdated: new Date().toISOString()
};

export function useBoostAnalytics(profileId?: string | null) {
  const [data, setData] = useState<BoostAnalyticsData>(DEFAULT_ANALYTICS);
  const [isLoading, setIsLoading] = useState(true);
  const [isRealTimeActive, setIsRealTimeActive] = useState(false);
  const mountedRef = useRef(true);

  const fetchAnalytics = useCallback(async (isSilent = false) => {
    if (!profileId) return;
    if (!isSilent) setIsLoading(true);

    try {
      // 1. Fetch from serverless analytics API
      const res = await fetch(`/api/analytics?profileId=${encodeURIComponent(profileId)}`);
      if (res.ok) {
        const json = await res.json();
        if (mountedRef.current && json && typeof json.impressions === 'number') {
          setData(json);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Fallback to client-side Supabase query
    }

    try {
      const sinceTimestamp = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      // Client direct count fallback
      const [impRes, clkRes, inqRes, sponRes] = await Promise.all([
        supabase.from('profile_impressions').select('*', { count: 'exact', head: true }).eq('profile_id', profileId).gte('created_at', sinceTimestamp),
        supabase.from('profile_clicks').select('*', { count: 'exact', head: true }).eq('profile_id', profileId).gte('created_at', sinceTimestamp),
        supabase.from('profile_inquiries').select('*', { count: 'exact', head: true }).eq('profile_id', profileId).gte('created_at', sinceTimestamp),
        supabase.from('profile_impressions').select('*', { count: 'exact', head: true }).eq('profile_id', profileId).eq('was_sponsored', true).gte('created_at', sinceTimestamp)
      ]);

      const impressions = impRes.count || 0;
      const sponsoredImpressions = sponRes.count || 0;
      const clicks = clkRes.count || 0;
      const inquiries = inqRes.count || 0;

      const ctrPercent = impressions > 0 ? Number(((clicks / impressions) * 100).toFixed(1)) : 0;
      const conversionPercent = clicks > 0 ? Number(((inquiries / clicks) * 100).toFixed(1)) : (inquiries > 0 ? 100 : 0);

      const fairnessFactor = calculateFairnessScoreFromCounts(sponsoredImpressions, Math.max(sponsoredImpressions, 100), 1);
      const isDamped = sponsoredImpressions > 500;

      if (mountedRef.current) {
        setData({
          impressions,
          sponsoredImpressions,
          clicks,
          inquiries,
          ctrPercent,
          conversionPercent,
          fairRotation: {
            status: isDamped ? 'DAMPED' : 'ACTIVE',
            exposureRatio: sponsoredImpressions > 0 ? 1.1 : 0.8,
            fairnessFactor,
            isDamped,
            description: isDamped ? 'Anti-monopoly damping active' : 'Balanced exposure on'
          },
          lastUpdated: new Date().toISOString()
        });
      }
    } catch {
      // Retain previous or default data
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  }, [profileId]);

  useEffect(() => {
    mountedRef.current = true;
    if (!profileId) {
      setIsLoading(false);
      return;
    }

    fetchAnalytics();

    // 15-second Polling Heartbeat
    const pollInterval = setInterval(() => {
      fetchAnalytics(true);
    }, 15000);

    // Supabase Realtime Channel Subscription
    const channelName = `analytics_${profileId.replace(/[^a-zA-Z0-9_]/g, '_')}`;
    const channel = supabase.channel(channelName)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'profile_impressions', filter: `profile_id=eq.${profileId}` },
        () => {
          setData(prev => ({
            ...prev,
            impressions: prev.impressions + 1,
            ctrPercent: Number(((prev.clicks / (prev.impressions + 1)) * 100).toFixed(1))
          }));
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'profile_clicks', filter: `profile_id=eq.${profileId}` },
        () => {
          setData(prev => {
            const nextClicks = prev.clicks + 1;
            return {
              ...prev,
              clicks: nextClicks,
              ctrPercent: prev.impressions > 0 ? Number(((nextClicks / prev.impressions) * 100).toFixed(1)) : 100,
              conversionPercent: Number(((prev.inquiries / nextClicks) * 100).toFixed(1))
            };
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'profile_inquiries', filter: `profile_id=eq.${profileId}` },
        () => {
          setData(prev => {
            const nextInq = prev.inquiries + 1;
            return {
              ...prev,
              inquiries: nextInq,
              conversionPercent: prev.clicks > 0 ? Number(((nextInq / prev.clicks) * 100).toFixed(1)) : 100
            };
          });
        }
      )
      .subscribe((status) => {
        if (mountedRef.current) {
          setIsRealTimeActive(status === 'SUBSCRIBED');
        }
      });

    return () => {
      mountedRef.current = false;
      clearInterval(pollInterval);
      supabase.removeChannel(channel);
    };
  }, [profileId, fetchAnalytics]);

  return {
    analytics: data,
    isLoading,
    isRealTimeActive,
    refetch: () => fetchAnalytics(false)
  };
}
