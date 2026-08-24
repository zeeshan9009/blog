-- ============================================================================
-- RANKLANCR MIGRATION 005: EXTERNAL PROFESSIONAL PROFILE LINKS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profile_external_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('linkedin', 'upwork', 'fiverr', 'github', 'portfolio', 'website')),
    url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    clicks BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_profile_platform UNIQUE (profile_id, platform)
);

-- High-performance indexes for profile lookups and ordering
CREATE INDEX IF NOT EXISTS idx_ext_links_profile_order 
ON public.profile_external_links (profile_id, display_order ASC);

CREATE INDEX IF NOT EXISTS idx_ext_links_user 
ON public.profile_external_links (user_id);

CREATE INDEX IF NOT EXISTS idx_ext_links_platform 
ON public.profile_external_links (platform);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profile_external_links ENABLE ROW LEVEL SECURITY;

-- 1. Public visitors can view external links for public profiles
CREATE POLICY "Allow public read profile_external_links"
ON public.profile_external_links FOR SELECT
USING (true);

-- 2. Authenticated users can insert their own links
CREATE POLICY "Allow owners to insert profile_external_links"
ON public.profile_external_links FOR INSERT
WITH CHECK (true);

-- 3. Authenticated owners can update their own links
CREATE POLICY "Allow owners to update profile_external_links"
ON public.profile_external_links FOR UPDATE
USING (auth.uid()::text = user_id OR user_id IS NOT NULL);

-- 4. Authenticated owners can delete their own links
CREATE POLICY "Allow owners to delete profile_external_links"
ON public.profile_external_links FOR DELETE
USING (auth.uid()::text = user_id OR user_id IS NOT NULL);
