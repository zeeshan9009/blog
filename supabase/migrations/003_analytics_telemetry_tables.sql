-- ============================================================================
-- RANKLANCR MIGRATION 003: REAL-TIME TELEMETRY & 24H BOOST ANALYTICS
-- ============================================================================

-- 1. Profile Impressions Table
CREATE TABLE IF NOT EXISTS public.profile_impressions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id TEXT NOT NULL,
    search_query TEXT,
    was_sponsored BOOLEAN DEFAULT false,
    visitor_ip_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- High-performance composite indexes for 24-hour time-window queries
CREATE INDEX IF NOT EXISTS idx_impressions_profile_time 
ON public.profile_impressions (profile_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_impressions_time 
ON public.profile_impressions (created_at DESC);

-- 2. Profile Clicks Table
CREATE TABLE IF NOT EXISTS public.profile_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id TEXT NOT NULL,
    source TEXT DEFAULT 'search_result',
    visitor_ip_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clicks_profile_time 
ON public.profile_clicks (profile_id, created_at DESC);

-- 3. Profile Inquiries Table
CREATE TABLE IF NOT EXISTS public.profile_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id TEXT NOT NULL,
    inquiry_type TEXT DEFAULT 'contact_form',
    sender_name TEXT,
    sender_email TEXT,
    budget TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_profile_time 
ON public.profile_inquiries (profile_id, created_at DESC);

-- 4. Fast Server-Side 24H Aggregation RPC Function
CREATE OR REPLACE FUNCTION get_profile_24h_analytics(p_profile_id TEXT)
RETURNS JSON AS $$
DECLARE
    v_impressions BIGINT;
    v_sponsored_impressions BIGINT;
    v_clicks BIGINT;
    v_inquiries BIGINT;
    v_total_sponsored_impressions BIGINT;
    v_total_eligible_boosts BIGINT;
    v_result JSON;
BEGIN
    -- 24H Impressions for this profile
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE was_sponsored = true)
    INTO v_impressions, v_sponsored_impressions
    FROM public.profile_impressions
    WHERE profile_id = p_profile_id
      AND created_at >= NOW() - INTERVAL '24 HOURS';

    -- 24H Clicks for this profile
    SELECT COUNT(*)
    INTO v_clicks
    FROM public.profile_clicks
    WHERE profile_id = p_profile_id
      AND created_at >= NOW() - INTERVAL '24 HOURS';

    -- 24H Inquiries for this profile
    SELECT COUNT(*)
    INTO v_inquiries
    FROM public.profile_inquiries
    WHERE profile_id = p_profile_id
      AND created_at >= NOW() - INTERVAL '24 HOURS';

    -- Global total sponsored impressions in last 24h
    SELECT COUNT(*)
    INTO v_total_sponsored_impressions
    FROM public.profile_impressions
    WHERE was_sponsored = true
      AND created_at >= NOW() - INTERVAL '24 HOURS';

    -- Active promotions count
    SELECT COUNT(*)
    INTO v_total_eligible_boosts
    FROM public.promotions
    WHERE status = 'active' AND ends_at > NOW();

    -- Build JSON Response
    SELECT json_build_object(
        'profile_id', p_profile_id,
        'impressions_24h', COALESCE(v_impressions, 0),
        'sponsored_impressions_24h', COALESCE(v_sponsored_impressions, 0),
        'clicks_24h', COALESCE(v_clicks, 0),
        'inquiries_24h', COALESCE(v_inquiries, 0),
        'global_sponsored_impressions_24h', COALESCE(v_total_sponsored_impressions, 0),
        'active_boosts_count', GREATEST(1, COALESCE(v_total_eligible_boosts, 1)),
        'timestamp', NOW()
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Row Level Security (RLS) Policies
ALTER TABLE public.profile_impressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for fire-and-forget telemetry
CREATE POLICY "Allow public insert to profile_impressions" 
ON public.profile_impressions FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert to profile_clicks" 
ON public.profile_clicks FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert to profile_inquiries" 
ON public.profile_inquiries FOR INSERT WITH CHECK (true);

-- Allow public read of aggregated telemetry
CREATE POLICY "Allow public read profile_impressions" 
ON public.profile_impressions FOR SELECT USING (true);

CREATE POLICY "Allow public read profile_clicks" 
ON public.profile_clicks FOR SELECT USING (true);

CREATE POLICY "Allow public read profile_inquiries" 
ON public.profile_inquiries FOR SELECT USING (true);
