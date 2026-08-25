-- ============================================================================
-- RANKLANCR MIGRATION 012: CHALLENGE SPONSORSHIP ASCENDING AUCTION ENGINE
-- ============================================================================
-- Adds ascending auction bidding tables for Challenge Sponsorships (Spotlight-style):
-- 1. challenge_sponsorship_slots: Live high-bid holder & state per challenge
-- 2. challenge_sponsorship_bids: Immutable audit ledger of all placed sponsor bids
-- ============================================================================

-- 1. Live Challenge Sponsorship Auction Slots Table
CREATE TABLE IF NOT EXISTS challenge_sponsorship_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  current_bid_cents INT NOT NULL DEFAULT 10000, -- Base floor: $100.00 USD
  min_increment_cents INT NOT NULL DEFAULT 2500, -- Minimum increment: $25.00 USD or +10%
  current_sponsor_name TEXT,
  current_sponsor_logo_url TEXT,
  current_sponsor_link TEXT,
  total_bids_count INT NOT NULL DEFAULT 0,
  claimed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (challenge_id)
);

COMMENT ON TABLE challenge_sponsorship_slots IS 'Live ascending auction state for the Gold Flagship Challenge Sponsorship slot.';

-- 2. Challenge Sponsorship Bids Ledger Table
CREATE TABLE IF NOT EXISTS challenge_sponsorship_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  company_logo_url TEXT,
  company_link TEXT,
  amount_cents INT NOT NULL,
  stripe_payment_intent_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('succeeded', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE challenge_sponsorship_bids IS 'Immutable audit ledger of all placed ascending auction bids for challenge sponsorships.';

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_spon_slots_challenge ON challenge_sponsorship_slots (challenge_id);
CREATE INDEX IF NOT EXISTS idx_spon_bids_challenge ON challenge_sponsorship_bids (challenge_id, created_at DESC);

-- 4. Row Level Security Policies
ALTER TABLE challenge_sponsorship_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_sponsorship_bids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read sponsorship slots" ON challenge_sponsorship_slots FOR SELECT USING (true);
CREATE POLICY "Public read sponsorship bids" ON challenge_sponsorship_bids FOR SELECT USING (status = 'succeeded');

-- 5. Seed Initial Slot for Featured Challenge
INSERT INTO challenge_sponsorship_slots (
  challenge_id,
  current_bid_cents,
  min_increment_cents,
  current_sponsor_name,
  current_sponsor_logo_url,
  current_sponsor_link,
  total_bids_count
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  12500, -- $125.00 Current High Bid
  2500,
  'Supastack AI',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
  'https://supastack.ai',
  1
) ON CONFLICT (challenge_id) DO NOTHING;
