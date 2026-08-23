-- =========================================================
-- ProRank Database Schema & Row Level Security
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    name TEXT NOT NULL,
    username TEXT UNIQUE,
    headline TEXT,
    bio TEXT,
    location TEXT,
    country TEXT,
    profile_image TEXT,
    category_id TEXT,
    hourly_rate INTEGER DEFAULT 50,
    experience_years INTEGER DEFAULT 3,
    professional_score INTEGER DEFAULT 80,
    profile_completeness INTEGER DEFAULT 85,
    status TEXT NOT NULL DEFAULT 'published'
        CHECK (status IN ('draft', 'published', 'suspended')),
    skills TEXT[] DEFAULT '{}',
    detailed_skills JSONB DEFAULT '[]',
    experience JSONB DEFAULT '[]',
    portfolio JSONB DEFAULT '[]',
    reviews JSONB DEFAULT '[]',
    external_links JSONB DEFAULT '{}',
    is_verified BOOLEAN DEFAULT false,
    email_verified BOOLEAN DEFAULT true,
    views_count BIGINT DEFAULT 0,
    clicks_count BIGINT DEFAULT 0,
    inquiries_count BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_category ON profiles(category_id);
CREATE INDEX IF NOT EXISTS idx_profiles_headline_trgm ON profiles USING gin (headline gin_trgm_ops);

-- 2. PROMOTIONS TABLE
CREATE TABLE IF NOT EXISTS promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'active', 'expired', 'cancelled', 'refunded')),
    amount_cents INTEGER NOT NULL DEFAULT 100, -- $1.00 USD
    currency TEXT NOT NULL DEFAULT 'USD',
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    payment_id TEXT UNIQUE,
    impressions BIGINT NOT NULL DEFAULT 0,
    clicks BIGINT NOT NULL DEFAULT 0,
    contacts BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Promotions indexes
CREATE INDEX IF NOT EXISTS idx_promotions_active
ON promotions(status, starts_at, ends_at);

CREATE INDEX IF NOT EXISTS idx_promotions_profile
ON promotions(profile_id);

-- 3. PROMOTION EVENTS TABLE
CREATE TABLE IF NOT EXISTS promotion_events (
    id BIGSERIAL PRIMARY KEY,
    promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL
        CHECK (event_type IN ('impression', 'click', 'contact', 'report')),
    visitor_hash TEXT,
    search_query TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_promotion_events_lookup
ON promotion_events(promotion_id, event_type, created_at);

-- 4. PROMOTION DAILY STATS TABLE
CREATE TABLE IF NOT EXISTS promotion_daily_stats (
    promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
    stat_date DATE NOT NULL,
    impressions INTEGER NOT NULL DEFAULT 0,
    clicks INTEGER NOT NULL DEFAULT 0,
    contacts INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (promotion_id, stat_date)
);

-- 5. SEARCH EVENTS TABLE (Lightweight Analytics)
CREATE TABLE IF NOT EXISTS search_events (
    id BIGSERIAL PRIMARY KEY,
    query TEXT NOT NULL,
    visitor_hash TEXT,
    results_count INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. PROFILE VIEWS TABLE
CREATE TABLE IF NOT EXISTS profile_views (
    id BIGSERIAL PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    visitor_hash TEXT,
    source TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. CONTACT REQUESTS TABLE
CREATE TABLE IF NOT EXISTS contact_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    message TEXT NOT NULL,
    budget TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================
-- EXPIRATION FUNCTION
-- =========================================================
CREATE OR REPLACE FUNCTION expire_outdated_promotions()
RETURNS void AS $$
BEGIN
    UPDATE promotions
    SET status = 'expired'
    WHERE status = 'active'
    AND ends_at <= now();
END;
$$ LANGUAGE plpgsql;

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Public Profiles: Everyone can read published profiles
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (status = 'published');

-- Users can manage their own profile
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Promotions: Public can view active promotions
CREATE POLICY "Active promotions are viewable by everyone"
ON promotions FOR SELECT
USING (status = 'active' AND starts_at <= now() AND ends_at > now());

-- Sensitive promotion changes are restricted to server/admin
CREATE POLICY "Users can view their own promotions"
ON promotions FOR SELECT
USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = promotions.profile_id
    AND profiles.user_id = auth.uid()
));

-- Contact Requests: Profile owner can view their leads
CREATE POLICY "Profile owners can view received inquiries"
ON contact_requests FOR SELECT
USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = contact_requests.profile_id
    AND profiles.user_id = auth.uid()
));

-- Public can submit contact requests
CREATE POLICY "Anyone can create a contact request"
ON contact_requests FOR INSERT
WITH CHECK (true);
