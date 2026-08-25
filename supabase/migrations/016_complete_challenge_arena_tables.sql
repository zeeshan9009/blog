-- =============================================================================
-- RANKLANCR COMPLETE CHALLENGE ARENA TABLES MIGRATION
-- Run this in your Supabase Dashboard -> SQL Editor
-- =============================================================================

-- 1. Create challenges table
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  prompt TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Development',
  banner_image TEXT,
  status TEXT NOT NULL DEFAULT 'open_entry'
    CHECK (status IN ('draft', 'open_entry', 'submission_window', 'voting_window', 'closed')),
  entry_deadline TIMESTAMPTZ NOT NULL,
  submission_deadline TIMESTAMPTZ NOT NULL,
  voting_deadline TIMESTAMPTZ NOT NULL,
  entry_fee_cents INT NOT NULL DEFAULT 500,
  winner_submission_id UUID,
  current_sponsor_bid_cents INT DEFAULT 10000,
  current_sponsor_company TEXT,
  current_sponsor_logo_url TEXT,
  current_sponsor_link TEXT,
  current_sponsor_min_increment_cents INT NOT NULL DEFAULT 1000,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create challenge_entries table
CREATE TABLE IF NOT EXISTS public.challenge_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL,
  paddle_transaction_id TEXT,
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL DEFAULT 'succeeded' CHECK (status IN ('succeeded', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (challenge_id, profile_id)
);

-- 3. Create challenge_submissions table
CREATE TABLE IF NOT EXISTS public.challenge_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL,
  title TEXT NOT NULL,
  submission_url TEXT NOT NULL,
  submission_text TEXT,
  vote_count INT NOT NULL DEFAULT 0,
  final_rank INT,
  locked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (challenge_id, profile_id)
);

-- 4. Create challenge_votes table
CREATE TABLE IF NOT EXISTS public.challenge_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.challenge_submissions(id) ON DELETE CASCADE,
  voter_fingerprint TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (submission_id, voter_fingerprint)
);

-- 5. Create challenge_sponsorship_slots table (Auction Leaderboard)
CREATE TABLE IF NOT EXISTS public.challenge_sponsorship_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  current_bid_cents INT NOT NULL DEFAULT 10000,
  current_sponsor_name TEXT,
  current_sponsor_logo TEXT,
  current_sponsor_link TEXT,
  min_increment_cents INT NOT NULL DEFAULT 1000,
  total_bids_count INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (challenge_id)
);

-- 6. Create challenge_sponsorship_bids table
CREATE TABLE IF NOT EXISTS public.challenge_sponsorship_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  company_logo_url TEXT,
  company_link TEXT,
  amount_cents INT NOT NULL,
  paddle_transaction_id TEXT,
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL DEFAULT 'succeeded' CHECK (status IN ('succeeded', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Create challenge_sponsorships table (Fixed Tier Sponsorships)
CREATE TABLE IF NOT EXISTS public.challenge_sponsorships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold')),
  sponsor_name TEXT NOT NULL,
  sponsor_logo TEXT,
  sponsor_url TEXT,
  sponsor_tagline TEXT,
  amount_cents INT NOT NULL,
  paddle_transaction_id TEXT,
  status TEXT NOT NULL DEFAULT 'succeeded' CHECK (status IN ('succeeded', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Create top_developer_entries table
CREATE TABLE IF NOT EXISTS public.top_developer_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  rank_position INT NOT NULL CHECK (rank_position BETWEEN 1 AND 3),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Create challenge_badges table
CREATE TABLE IF NOT EXISTS public.challenge_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL CHECK (badge_type IN ('challenge_winner', 'challenge_runner_up')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Create challenge_social_posts table
CREATE TABLE IF NOT EXISTS public.challenge_social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('x', 'instagram', 'tiktok', 'facebook')),
  post_url TEXT,
  posted_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-increment vote count trigger
CREATE OR REPLACE FUNCTION increment_challenge_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.challenge_submissions 
  SET vote_count = vote_count + 1 
  WHERE id = NEW.submission_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_challenge_vote_count ON public.challenge_votes;
CREATE TRIGGER trg_challenge_vote_count
AFTER INSERT ON public.challenge_votes
FOR EACH ROW EXECUTE FUNCTION increment_challenge_vote_count();

-- Auto slug generator trigger
CREATE OR REPLACE FUNCTION generate_challenge_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INT := 1;
BEGIN
  base_slug := lower(regexp_replace(COALESCE(NEW.title, ''), '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);

  IF base_slug IS NULL OR length(base_slug) = 0 THEN
    base_slug := 'challenge-' || substr(COALESCE(NEW.id::text, gen_random_uuid()::text), 1, 8);
  END IF;

  final_slug := base_slug;

  WHILE EXISTS (SELECT 1 FROM public.challenges WHERE slug = final_slug AND id != NEW.id) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;

  NEW.slug := final_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_generate_slug ON public.challenges;
CREATE TRIGGER trg_generate_slug
BEFORE INSERT OR UPDATE OF title, slug ON public.challenges
FOR EACH ROW EXECUTE FUNCTION generate_challenge_slug();

-- Enable RLS and add public read/insert policies
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_sponsorship_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_sponsorship_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_sponsorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.top_developer_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_social_posts ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Allow public read on challenges" ON public.challenges FOR SELECT USING (true);
CREATE POLICY "Allow public insert on challenges" ON public.challenges FOR ALL USING (true);

CREATE POLICY "Allow public read on challenge_entries" ON public.challenge_entries FOR SELECT USING (true);
CREATE POLICY "Allow public insert on challenge_entries" ON public.challenge_entries FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on challenge_submissions" ON public.challenge_submissions FOR SELECT USING (true);
CREATE POLICY "Allow public insert on challenge_submissions" ON public.challenge_submissions FOR ALL USING (true);

CREATE POLICY "Allow public read on challenge_votes" ON public.challenge_votes FOR SELECT USING (true);
CREATE POLICY "Allow public insert on challenge_votes" ON public.challenge_votes FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on challenge_sponsorship_slots" ON public.challenge_sponsorship_slots FOR ALL USING (true);
CREATE POLICY "Allow public read on challenge_sponsorship_bids" ON public.challenge_sponsorship_bids FOR ALL USING (true);
CREATE POLICY "Allow public read on challenge_sponsorships" ON public.challenge_sponsorships FOR ALL USING (true);
CREATE POLICY "Allow public read on top_developer_entries" ON public.top_developer_entries FOR ALL USING (true);
CREATE POLICY "Allow public read on challenge_badges" ON public.challenge_badges FOR ALL USING (true);
CREATE POLICY "Allow public read on challenge_social_posts" ON public.challenge_social_posts FOR ALL USING (true);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_challenges_status ON public.challenges (status, voting_deadline);
CREATE INDEX IF NOT EXISTS idx_challenges_slug ON public.challenges (slug);
CREATE INDEX IF NOT EXISTS idx_submissions_challenge ON public.challenge_submissions (challenge_id, vote_count DESC);
CREATE INDEX IF NOT EXISTS idx_top_dev_active ON public.top_developer_entries (expires_at) WHERE expires_at > now();
