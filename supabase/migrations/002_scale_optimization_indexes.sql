-- =========================================================
-- Migration 002: ProRank 10,000+ Scale Optimization Indexes & Pre-computed Scoring
-- =========================================================

-- 1. Ensure required extensions exist
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- 2. Add Missing Quality Gate & Pre-computed Columns to Profiles (if not exists)
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2) DEFAULT 5.00,
  ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS active_disputes INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS account_standing TEXT DEFAULT 'active' CHECK (account_standing IN ('active', 'flagged', 'suspended')),
  ADD COLUMN IF NOT EXISTS cached_score NUMERIC(5,2) DEFAULT 80.00;

-- 3. GIN INDEX for Array & Text Search (High performance for skills & keywords)
CREATE INDEX IF NOT EXISTS idx_profiles_skills_gin 
  ON profiles USING gin (skills);

CREATE INDEX IF NOT EXISTS idx_profiles_bio_trgm 
  ON profiles USING gin (bio gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_profiles_name_trgm 
  ON profiles USING gin (name gin_trgm_ops);

-- 4. B-Tree & Composite Indexes for SQL WHERE Filtering & Range Scans
CREATE INDEX IF NOT EXISTS idx_profiles_category_status_comp 
  ON profiles (category_id, status, profile_completeness);

CREATE INDEX IF NOT EXISTS idx_profiles_location 
  ON profiles (location);

CREATE INDEX IF NOT EXISTS idx_profiles_hourly_rate 
  ON profiles (hourly_rate);

CREATE INDEX IF NOT EXISTS idx_profiles_quality_gate 
  ON profiles (status, profile_completeness, rating, review_count, active_disputes, account_standing);

CREATE INDEX IF NOT EXISTS idx_profiles_cached_score_desc 
  ON profiles (cached_score DESC);

-- 5. Promotions Active Lookup Composite Index
CREATE INDEX IF NOT EXISTS idx_promotions_active_lookup 
  ON promotions (status, starts_at, ends_at, profile_id);

-- 6. Trigger to automatically pre-compute profile quality and score on INSERT/UPDATE
CREATE OR REPLACE FUNCTION compute_profile_cached_score()
RETURNS TRIGGER AS $$
DECLARE
    skills_cnt INT := COALESCE(array_length(NEW.skills, 1), 0);
    skills_factor NUMERIC := LEAST(1.0, skills_cnt::NUMERIC / 6.0);
    exp_factor NUMERIC := LEAST(1.0, COALESCE(NEW.experience_years, 1)::NUMERIC / 6.0);
    port_cnt INT := CASE WHEN NEW.portfolio IS NOT NULL AND jsonb_typeof(NEW.portfolio) = 'array' 
                         THEN jsonb_array_length(NEW.portfolio) 
                         ELSE 0 END;
    port_factor NUMERIC := LEAST(1.0, port_cnt::NUMERIC / 3.0);
    rev_rating NUMERIC := COALESCE(NEW.rating, 5.0) / 5.0;
    rev_cnt INT := COALESCE(NEW.review_count, 0);
    reviews_factor NUMERIC := LEAST(1.0, rev_rating * (LEAST(rev_cnt, 50)::NUMERIC / 50.0));
    completeness_factor NUMERIC := CASE WHEN NEW.name IS NOT NULL AND NEW.bio IS NOT NULL AND NEW.profile_image IS NOT NULL THEN 1.0 ELSE 0.7 END;
    calc_score NUMERIC;
BEGIN
    calc_score := (0.40 * skills_factor) + (0.25 * exp_factor) + (0.20 * port_factor) + (0.10 * reviews_factor) + (0.05 * completeness_factor);
    NEW.cached_score := ROUND(calc_score * 100, 2);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_cached_score ON profiles;
CREATE TRIGGER trg_profiles_cached_score
BEFORE INSERT OR UPDATE OF skills, experience_years, portfolio, rating, review_count, name, bio, profile_image
ON profiles
FOR EACH ROW EXECUTE FUNCTION compute_profile_cached_score();

-- 7. High-Performance SQL Search Stored Procedure / RPC for 10k+ scale
CREATE OR REPLACE FUNCTION search_profiles_scaled(
    p_query TEXT DEFAULT '',
    p_category TEXT DEFAULT 'All',
    p_location TEXT DEFAULT '',
    p_max_rate INT DEFAULT NULL,
    p_min_completeness INT DEFAULT 90,
    p_limit INT DEFAULT 50,
    p_offset INT DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    name TEXT,
    headline TEXT,
    bio TEXT,
    location TEXT,
    country TEXT,
    profile_image TEXT,
    category_id TEXT,
    hourly_rate INT,
    experience_years INT,
    professional_score INT,
    profile_completeness INT,
    status TEXT,
    skills TEXT[],
    detailed_skills JSONB,
    experience JSONB,
    portfolio JSONB,
    reviews JSONB,
    external_links JSONB,
    is_verified BOOLEAN,
    views_count BIGINT,
    clicks_count BIGINT,
    inquiries_count BIGINT,
    rating NUMERIC,
    review_count INT,
    active_disputes INT,
    account_standing TEXT,
    cached_score NUMERIC,
    created_at TIMESTAMPTZ,
    is_promoted BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    WITH active_promos AS (
        SELECT pr.profile_id
        FROM promotions pr
        WHERE pr.status = 'active'
          AND pr.starts_at <= now()
          AND pr.ends_at > now()
    )
    SELECT 
        p.id,
        p.user_id,
        p.name,
        p.headline,
        p.bio,
        p.location,
        p.country,
        p.profile_image,
        p.category_id,
        p.hourly_rate,
        p.experience_years,
        p.professional_score,
        p.profile_completeness,
        p.status,
        p.skills,
        p.detailed_skills,
        p.experience,
        p.portfolio,
        p.reviews,
        p.external_links,
        p.is_verified,
        p.views_count,
        p.clicks_count,
        p.inquiries_count,
        COALESCE(p.rating, 5.0),
        COALESCE(p.review_count, 0),
        COALESCE(p.active_disputes, 0),
        COALESCE(p.account_standing, 'active'),
        COALESCE(p.cached_score, 80.0),
        p.created_at,
        (promo.profile_id IS NOT NULL) AS is_promoted
    FROM profiles p
    LEFT JOIN active_promos promo ON promo.profile_id = p.id
    WHERE p.status = 'published'
      AND p.profile_completeness >= p_min_completeness
      AND (p_category = 'All' OR p.category_id ILIKE p_category)
      AND (p_max_rate IS NULL OR p.hourly_rate <= p_max_rate)
      AND (p_location = '' OR p.location ILIKE ('%' || p_location || '%') OR p.country ILIKE ('%' || p_location || '%'))
      AND (
          p_query = '' 
          OR p.headline ILIKE ('%' || p_query || '%')
          OR p.bio ILIKE ('%' || p_query || '%')
          OR p.skills && string_to_array(lower(p_query), ' ')
      )
    ORDER BY 
        (promo.profile_id IS NOT NULL) DESC,
        p.cached_score DESC,
        p.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;
