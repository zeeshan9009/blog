/**
 * RankLancr Frontend Telemetry Service
 * Fire-and-forget tracking for clicks and inquiries
 */

import { supabase } from '../lib/supabase';

export function trackProfileClick(profileId: string, source: string = 'search_card') {
  if (!profileId) return;

  const payload = {
    event: 'click',
    profileId,
    source,
    timestamp: new Date().toISOString()
  };

  try {
    // 1. Try Beacon API for fast background transmission
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/track', blob);
      return;
    }

    // 2. Fallback to fetch
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(() => {
      // Fallback directly to Supabase client if API route unreachable
      supabase.from('profile_clicks').insert([{
        profile_id: profileId,
        source
      }]).then();
    });
  } catch {
    // Fail silently
  }
}

export function trackProfileInquiry(
  profileId: string,
  details?: { inquiryType?: string; senderName?: string; senderEmail?: string; budget?: string }
) {
  if (!profileId) return;

  const payload = {
    event: 'inquiry',
    profileId,
    inquiryType: details?.inquiryType || 'contact_form',
    senderName: details?.senderName,
    senderEmail: details?.senderEmail,
    budget: details?.budget,
    timestamp: new Date().toISOString()
  };

  try {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(() => {
      supabase.from('profile_inquiries').insert([{
        profile_id: profileId,
        inquiry_type: details?.inquiryType || 'contact_form',
        sender_name: details?.senderName || null,
        sender_email: details?.senderEmail || null,
        budget: details?.budget || null
      }]).then();
    });
  } catch {
    // Fail silently
  }
}
