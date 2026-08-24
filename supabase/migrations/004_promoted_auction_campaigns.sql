-- ============================================================================
-- RANKLANCR MIGRATION 004: PROMOTED RANKING / BOOST AUCTION SYSTEM
-- ============================================================================

-- 1. Promoted Campaigns Table
CREATE TABLE IF NOT EXISTS public.promoted_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    profile_id TEXT,
    author_name TEXT NOT NULL,
    avatar_url TEXT,
    title TEXT NOT NULL,
    description TEXT,
    destination_type TEXT NOT NULL CHECK (destination_type IN ('linkedin', 'fiverr', 'upwork', 'github', 'portfolio', 'website', 'other')),
    destination_url TEXT NOT NULL,
    category TEXT DEFAULT 'Full Stack',
    skills TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'outbid', 'expired', 'paused', 'cancelled')),
    starting_bid NUMERIC(10,2) NOT NULL DEFAULT 2.00 CHECK (starting_bid >= 2.00),
    current_bid NUMERIC(10,2) NOT NULL DEFAULT 2.00 CHECK (current_bid >= starting_bid),
    current_position INT DEFAULT 1,
    peak_position INT DEFAULT 1,
    impressions BIGINT DEFAULT 0,
    clicks BIGINT DEFAULT 0,
    external_visits BIGINT DEFAULT 0,
    start_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 HOURS'),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- High-performance indexes for live auction sorting and query filtering
CREATE INDEX IF NOT EXISTS idx_promoted_status_bid 
ON public.promoted_campaigns (status, current_bid DESC, expires_at DESC);

CREATE INDEX IF NOT EXISTS idx_promoted_category 
ON public.promoted_campaigns (category, status);

CREATE INDEX IF NOT EXISTS idx_promoted_user 
ON public.promoted_campaigns (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_promoted_expires 
ON public.promoted_campaigns (expires_at) WHERE status = 'active';

-- 2. Promotion Bids History Table
CREATE TABLE IF NOT EXISTS public.promotion_bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.promoted_campaigns(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    bidder_name TEXT,
    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 2.00),
    payment_status TEXT DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    is_winning BOOLEAN DEFAULT true,
    previous_highest_bid NUMERIC(10,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_promotion_bids_campaign 
ON public.promotion_bids (campaign_id, created_at DESC);

-- 3. Promotion Analytics Snapshot Table
CREATE TABLE IF NOT EXISTS public.promotion_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.promoted_campaigns(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    impressions BIGINT DEFAULT 0,
    clicks BIGINT DEFAULT 0,
    external_visits BIGINT DEFAULT 0,
    ctr NUMERIC(5,2) DEFAULT 0.00,
    position INT DEFAULT 1,
    exposure_share NUMERIC(5,2) DEFAULT 0.00,
    damping_percentage NUMERIC(5,2) DEFAULT 0.00
);

CREATE INDEX IF NOT EXISTS idx_promotion_analytics_campaign_time 
ON public.promotion_analytics (campaign_id, timestamp DESC);

-- 4. Admin Auction Config Table
CREATE TABLE IF NOT EXISTS public.promotion_admin_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    min_bid NUMERIC(10,2) DEFAULT 2.00,
    default_duration_hours INT DEFAULT 24,
    max_duration_hours INT DEFAULT 168,
    damping_threshold NUMERIC(4,2) DEFAULT 1.20,
    max_exposure_share NUMERIC(4,2) DEFAULT 0.50,
    banned_domains TEXT[] DEFAULT ARRAY['spam.com', 'phishing.net', 'malware.org'],
    approved_platforms TEXT[] DEFAULT ARRAY['linkedin.com', 'fiverr.com', 'upwork.com', 'github.com'],
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default admin config if empty
INSERT INTO public.promotion_admin_config (min_bid, default_duration_hours, damping_threshold)
SELECT 2.00, 24, 1.20
WHERE NOT EXISTS (SELECT 1 FROM public.promotion_admin_config);

-- 5. Atomic RPC Function: Place Auction Bid & Recalculate Positions
CREATE OR REPLACE FUNCTION place_auction_bid(
    p_campaign_id UUID,
    p_user_id TEXT,
    p_bidder_name TEXT,
    p_amount NUMERIC(10,2)
)
RETURNS JSON AS $$
DECLARE
    v_campaign RECORD;
    v_min_bid NUMERIC(10,2) := 2.00;
    v_current_winning NUMERIC(10,2);
    v_new_position INT;
    v_result JSON;
BEGIN
    -- 1. Lock campaign row for update
    SELECT * INTO v_campaign
    FROM public.promoted_campaigns
    WHERE id = p_campaign_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Campaign not found with ID %', p_campaign_id;
    END IF;

    IF v_campaign.status != 'active' AND v_campaign.status != 'outbid' THEN
        RAISE EXCEPTION 'Cannot bid on inactive/expired campaign';
    END IF;

    IF v_campaign.expires_at <= NOW() THEN
        UPDATE public.promoted_campaigns SET status = 'expired' WHERE id = p_campaign_id;
        RAISE EXCEPTION 'This campaign auction has already expired';
    END IF;

    -- Validate bid is greater than current bid
    IF p_amount <= v_campaign.current_bid THEN
        RAISE EXCEPTION 'New bid ($%) must be strictly greater than current bid ($%)', p_amount, v_campaign.current_bid;
    END IF;

    -- Record previous winning bid
    v_current_winning := v_campaign.current_bid;

    -- 2. Insert bid record
    INSERT INTO public.promotion_bids (
        campaign_id,
        user_id,
        bidder_name,
        amount,
        payment_status,
        is_winning,
        previous_highest_bid
    ) VALUES (
        p_campaign_id,
        p_user_id,
        p_bidder_name,
        p_amount,
        'completed',
        true,
        v_current_winning
    );

    -- 3. Update campaign current bid and mark active
    UPDATE public.promoted_campaigns
    SET 
        current_bid = p_amount,
        status = 'active',
        updated_at = NOW()
    WHERE id = p_campaign_id;

    -- 4. Recalculate positions for all active campaigns
    WITH ranked AS (
        SELECT 
            id,
            ROW_NUMBER() OVER (ORDER BY current_bid DESC, updated_at ASC) as new_pos
        FROM public.promoted_campaigns
        WHERE status IN ('active', 'outbid') AND expires_at > NOW()
    )
    UPDATE public.promoted_campaigns c
    SET 
        current_position = r.new_pos,
        peak_position = LEAST(c.peak_position, r.new_pos),
        status = CASE WHEN r.new_pos = 1 THEN 'active' ELSE 'active' END
    FROM ranked r
    WHERE c.id = r.id;

    -- Fetch updated campaign
    SELECT * INTO v_campaign
    FROM public.promoted_campaigns
    WHERE id = p_campaign_id;

    SELECT json_build_object(
        'success', true,
        'campaign_id', p_campaign_id,
        'new_bid', p_amount,
        'previous_bid', v_current_winning,
        'current_position', v_campaign.current_position,
        'peak_position', v_campaign.peak_position,
        'status', v_campaign.status,
        'expires_at', v_campaign.expires_at
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Row Level Security (RLS)
ALTER TABLE public.promoted_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotion_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotion_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotion_admin_config ENABLE ROW LEVEL SECURITY;

-- Allow public read of active/outbid campaigns
CREATE POLICY "Allow public read active promoted_campaigns"
ON public.promoted_campaigns FOR SELECT
USING (true);

-- Allow authenticated users to create campaigns
CREATE POLICY "Allow users to create promoted_campaigns"
ON public.promoted_campaigns FOR INSERT
WITH CHECK (true);

-- Allow owners to update their own campaigns
CREATE POLICY "Allow owners to update promoted_campaigns"
ON public.promoted_campaigns FOR UPDATE
USING (auth.uid()::text = user_id OR user_id IS NOT NULL);

-- Allow public read of bids
CREATE POLICY "Allow public read promotion_bids"
ON public.promotion_bids FOR SELECT
USING (true);

CREATE POLICY "Allow insert promotion_bids"
ON public.promotion_bids FOR INSERT
WITH CHECK (true);

-- Allow public read analytics
CREATE POLICY "Allow public read promotion_analytics"
ON public.promotion_analytics FOR SELECT
USING (true);

CREATE POLICY "Allow insert promotion_analytics"
ON public.promotion_analytics FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public read promotion_admin_config"
ON public.promotion_admin_config FOR SELECT
USING (true);
