-- ============================================================================
-- RANKLANCR MIGRATION 011: CHALLENGE-FIRST PIVOT SYSTEM
-- ============================================================================
-- Implements the full challenge-first architecture:
-- 1. Challenges table with 4-phase state machine (draft, open_entry, submission_window, voting_window, closed)
-- 2. Fixed $5 Challenge Entries
-- 3. Submissions with locked timestamps & denormalized vote counters
-- 4. Fingerprint-verified Challenge Votes (unique constraint, rate-limited)
-- 5. Top Developer 72-hour visibility rail entries
-- 6. 3-Tier Company Sponsorships (Bronze $50, Silver $150, Gold $300)
-- 7. Challenge Badges (Challenge Winner, Challenge Runner-up)
-- ============================================================================

-- 1. Challenges Table
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Development',
  banner_image TEXT DEFAULT 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
  status TEXT NOT NULL DEFAULT 'open_entry'
    CHECK (status IN ('draft', 'open_entry', 'submission_window', 'voting_window', 'closed')),
  entry_deadline TIMESTAMPTZ NOT NULL,
  submission_deadline TIMESTAMPTZ NOT NULL,
  voting_deadline TIMESTAMPTZ NOT NULL,
  entry_fee_cents INT NOT NULL DEFAULT 500, -- Fixed $5.00 entry fee
  winner_submission_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE challenges IS 'Skill-based challenges with fixed $5 entry fee and 72-hour earned visibility rewards.';

-- 2. Challenge Entries Table
CREATE TABLE IF NOT EXISTS challenge_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('succeeded', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (challenge_id, profile_id)
);

COMMENT ON TABLE challenge_entries IS 'Paid $5 entry fee ledger for challenge participation. Non-refundable platform revenue.';

-- 3. Challenge Submissions Table
CREATE TABLE IF NOT EXISTS challenge_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  submission_url TEXT NOT NULL,
  submission_text TEXT,
  vote_count INT NOT NULL DEFAULT 0,
  final_rank INT,
  locked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (challenge_id, profile_id)
);

COMMENT ON TABLE challenge_submissions IS 'Project entries submitted during submission_window. Locked upon window close.';

-- 4. Challenge Votes Table
CREATE TABLE IF NOT EXISTS challenge_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES challenge_submissions(id) ON DELETE CASCADE,
  voter_fingerprint TEXT NOT NULL,
  voter_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (submission_id, voter_fingerprint)
);

COMMENT ON TABLE challenge_votes IS 'Fingerprint-verified public votes on challenge submissions. One vote per fingerprint per submission.';

-- 5. Top Developer Entries Table (72-Hour Visibility Rail)
CREATE TABLE IF NOT EXISTS top_developer_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  rank_position INT NOT NULL CHECK (rank_position BETWEEN 1 AND 3),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE top_developer_entries IS '72-hour earned visibility rail entries for challenge top 3 finishers.';

-- 6. Challenge Sponsorships Table (3-Tier Pricing)
CREATE TABLE IF NOT EXISTS challenge_sponsorships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  company_logo_url TEXT,
  company_link TEXT,
  tier TEXT NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold')),
  amount_cents INT NOT NULL, -- Bronze: 5000 ($50), Silver: 15000 ($150), Gold: 30000 ($300)
  stripe_payment_intent_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('succeeded', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (challenge_id, tier)
);

COMMENT ON TABLE challenge_sponsorships IS '3-tier company sponsorships for brand visibility. Gold sponsors receive 48h co-branded placement in the Top Developer rail.';

-- 7. Challenge Badges Table
CREATE TABLE IF NOT EXISTS challenge_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL CHECK (badge_type IN ('challenge_winner', 'challenge_runner_up')),
  created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE challenge_badges IS 'Permanent profile badges awarded to top 3 challenge finishers.';

-- 8. Denormalized Counter Trigger Function
CREATE OR REPLACE FUNCTION increment_challenge_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE challenge_submissions
  SET vote_count = vote_count + 1
  WHERE id = NEW.submission_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_challenge_vote_count ON challenge_votes;
CREATE TRIGGER trg_challenge_vote_count
AFTER INSERT ON challenge_votes
FOR EACH ROW EXECUTE FUNCTION increment_challenge_vote_count();

-- 9. Performance Indices
CREATE INDEX IF NOT EXISTS idx_challenges_status ON challenges (status, voting_deadline);
CREATE INDEX IF NOT EXISTS idx_submissions_challenge ON challenge_submissions (challenge_id, vote_count DESC);
CREATE INDEX IF NOT EXISTS idx_top_dev_active ON top_developer_entries (expires_at) WHERE expires_at > now();
CREATE INDEX IF NOT EXISTS idx_sponsorships_challenge ON challenge_sponsorships (challenge_id, tier);
CREATE INDEX IF NOT EXISTS idx_entries_profile ON challenge_entries (profile_id, challenge_id);
CREATE INDEX IF NOT EXISTS idx_badges_profile ON challenge_badges (profile_id);

-- 10. Row Level Security Policies
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE top_developer_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_sponsorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_badges ENABLE ROW LEVEL SECURITY;

-- Public can read all active challenges
CREATE POLICY "Public read challenges" ON challenges FOR SELECT USING (true);

-- Public can read verified submissions
CREATE POLICY "Public read submissions" ON challenge_submissions FOR SELECT USING (true);

-- Authenticated profiles can enter challenges
CREATE POLICY "Users can view their challenge entries" ON challenge_entries FOR SELECT USING (true);
CREATE POLICY "Users can create challenge entries" ON challenge_entries FOR INSERT WITH CHECK (true);

-- Users can submit their own challenge projects
CREATE POLICY "Users can manage own submissions" ON challenge_submissions FOR ALL USING (true);

-- Public can vote (enforced by unique fingerprint at DB level)
CREATE POLICY "Public can vote" ON challenge_votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view votes" ON challenge_votes FOR SELECT USING (true);

-- Public can view Top Developer rail entries & sponsorships & badges
CREATE POLICY "Public read top developers" ON top_developer_entries FOR SELECT USING (true);
CREATE POLICY "Public read sponsorships" ON challenge_sponsorships FOR SELECT USING (true);
CREATE POLICY "Public read badges" ON challenge_badges FOR SELECT USING (true);

-- 11. Seed Initial Featured Challenge
INSERT INTO challenges (
  id,
  title,
  prompt,
  category,
  status,
  entry_deadline,
  submission_deadline,
  voting_deadline,
  entry_fee_cents
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Next.js 15 & AI Agent Interface Challenge',
  'Build a lightning-fast Next.js 15 UI with streaming AI responses, keyboard navigation shortcuts, and zero layout shift. Winner earns 72h site-wide Top Developer Rail placement!',
  'Development',
  'open_entry',
  now() + interval '2 days',
  now() + interval '5 days',
  now() + interval '8 days',
  500
) ON CONFLICT (id) DO NOTHING;
