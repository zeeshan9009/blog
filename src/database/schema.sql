-- =========================================================
-- ProRank Database Schema & Row Level Security (Production)
-- =========================================================

-- Enable UUID & Trigram Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    headline TEXT,
    bio TEXT,
    location TEXT,
    country TEXT,
    profile_image TEXT,
    category_id TEXT,
    hourly_rate INTEGER DEFAULT 50,
    experience_years INTEGER DEFAULT 3,
    professional_score INTEGER DEFAULT 80,
    status TEXT NOT NULL DEFAULT 'published'
        CHECK (status IN ('draft', 'published', 'suspended')),
    skills TEXT[] DEFAULT '{}',
    experience JSONB DEFAULT '[]',
    portfolio JSONB DEFAULT '[]',
    reviews JSONB DEFAULT '[]',
    external_links JSONB DEFAULT '{}',
    is_verified BOOLEAN DEFAULT false,
    views_count BIGINT DEFAULT 0,
    clicks_count BIGINT DEFAULT 0,
    inquiries_count BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_category ON profiles(category_id);
CREATE INDEX IF NOT EXISTS idx_profiles_headline_trgm ON profiles USING gin (headline gin_trgm_ops);

-- 2. USER ROLES TABLE
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('buyer', 'provider')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, role)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);

-- 3. SERVICES TABLE (Gigs & Service Offers)
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    skills TEXT[] DEFAULT '{}',
    price INTEGER NOT NULL DEFAULT 50, -- USD
    price_type TEXT NOT NULL DEFAULT 'starting_from'
        CHECK (price_type IN ('starting_from', 'hourly', 'fixed')),
    delivery_days TEXT NOT NULL DEFAULT '3 days',
    image TEXT,
    status TEXT NOT NULL DEFAULT 'published'
        CHECK (status IN ('draft', 'published', 'paused', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_services_profile ON services(profile_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);

-- 4. SERVICE REQUESTS TABLE (Direct Hire Requests)
CREATE TABLE IF NOT EXISTS service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    provider_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    buyer_user_id UUID,
    buyer_name TEXT NOT NULL,
    buyer_email TEXT NOT NULL,
    project_description TEXT NOT NULL,
    budget TEXT NOT NULL,
    deadline TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'accepted', 'declined', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_service_requests_provider ON service_requests(provider_profile_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_buyer ON service_requests(buyer_user_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);

-- 5. PROMOTIONS TABLE ($1 / 24-Hour Sponsored Visibility)
CREATE TABLE IF NOT EXISTS promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'active', 'expired', 'cancelled', 'refunded')),
    amount_cents INTEGER NOT NULL DEFAULT 100, -- Exactly $1.00 USD
    currency TEXT NOT NULL DEFAULT 'USD',
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    payment_id TEXT UNIQUE,
    payment_method TEXT DEFAULT 'stripe',
    impressions BIGINT NOT NULL DEFAULT 0,
    clicks BIGINT NOT NULL DEFAULT 0,
    contacts BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(status, starts_at, ends_at);
CREATE INDEX IF NOT EXISTS idx_promotions_profile ON promotions(profile_id);
CREATE INDEX IF NOT EXISTS idx_promotions_payment ON promotions(payment_id);

-- 6. PROMOTION EVENTS TABLE (Impression, Click, Contact deduplication)
CREATE TABLE IF NOT EXISTS promotion_events (
    id BIGSERIAL PRIMARY KEY,
    promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL
        CHECK (event_type IN ('impression', 'click', 'contact', 'report')),
    visitor_hash TEXT,
    search_query TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_promotion_events_lookup ON promotion_events(promotion_id, event_type, created_at);

-- 7. PROMOTION DAILY STATS TABLE
CREATE TABLE IF NOT EXISTS promotion_daily_stats (
    promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
    stat_date DATE NOT NULL,
    impressions INTEGER NOT NULL DEFAULT 0,
    clicks INTEGER NOT NULL DEFAULT 0,
    contacts INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (promotion_id, stat_date)
);

-- 8. SEARCH EVENTS TABLE (Query & Anti-abuse tracking)
CREATE TABLE IF NOT EXISTS search_events (
    id BIGSERIAL PRIMARY KEY,
    query TEXT NOT NULL,
    visitor_hash TEXT,
    results_count INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_search_events_visitor ON search_events(visitor_hash, created_at);

-- 9. PROFILE VIEWS TABLE
CREATE TABLE IF NOT EXISTS profile_views (
    id BIGSERIAL PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    visitor_hash TEXT,
    source TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profile_views_profile ON profile_views(profile_id, created_at);

-- 10. CONTACT REQUESTS TABLE (Direct Inquiries)
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

CREATE INDEX IF NOT EXISTS idx_contact_requests_profile ON contact_requests(profile_id);

-- =========================================================
-- EXPIRATION & UTILITY FUNCTIONS
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

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_services_updated_at ON services;
CREATE TRIGGER trg_services_updated_at
BEFORE UPDATE ON services
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_service_requests_updated_at ON service_requests;
CREATE TRIGGER trg_service_requests_updated_at
BEFORE UPDATE ON service_requests
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can view published; Owner can insert/update
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (status = 'published');

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = user_id);

-- User Roles: User can view and manage their own roles
CREATE POLICY "Users can view their own roles"
ON user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roles"
ON user_roles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own roles"
ON user_roles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own roles"
ON user_roles FOR DELETE
USING (auth.uid() = user_id);

-- Services: Public can view published services; Profile owner can manage
CREATE POLICY "Public services are viewable by everyone"
ON services FOR SELECT
USING (status = 'published');

CREATE POLICY "Profile owners can insert services"
ON services FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = services.profile_id
    AND profiles.user_id = auth.uid()
));

CREATE POLICY "Profile owners can update services"
ON services FOR UPDATE
USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = services.profile_id
    AND profiles.user_id = auth.uid()
));

CREATE POLICY "Profile owners can delete services"
ON services FOR DELETE
USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = services.profile_id
    AND profiles.user_id = auth.uid()
));

-- Service Requests: Provider and Buyer can view; Anyone can submit request
CREATE POLICY "Buyers and Providers can view their service requests"
ON service_requests FOR SELECT
USING (
    auth.uid() = buyer_user_id OR
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = service_requests.provider_profile_id
        AND profiles.user_id = auth.uid()
    )
);

CREATE POLICY "Anyone can create a service request"
ON service_requests FOR INSERT
WITH CHECK (true);

CREATE POLICY "Providers and Buyers can update their service requests"
ON service_requests FOR UPDATE
USING (
    auth.uid() = buyer_user_id OR
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = service_requests.provider_profile_id
        AND profiles.user_id = auth.uid()
    )
);

-- Promotions: Public can view active promotions
CREATE POLICY "Active promotions are viewable by everyone"
ON promotions FOR SELECT
USING (status = 'active' AND starts_at <= now() AND ends_at > now());

CREATE POLICY "Users can view their own promotions"
ON promotions FOR SELECT
USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = promotions.profile_id
    AND profiles.user_id = auth.uid()
));

-- Contact Requests: Profile owner can view received inquiries; anyone can submit
CREATE POLICY "Profile owners can view received inquiries"
ON contact_requests FOR SELECT
USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = contact_requests.profile_id
    AND profiles.user_id = auth.uid()
));

CREATE POLICY "Anyone can create a contact request"
ON contact_requests FOR INSERT
WITH CHECK (true);
