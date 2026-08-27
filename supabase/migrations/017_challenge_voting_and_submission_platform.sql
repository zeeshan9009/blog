-- =============================================================================
-- MIGRATION 017: CHALLENGE VOTING, SUBMISSION PLATFORM & ANTI-ABUSE ENGINE
-- Run in your Supabase SQL Editor to support the full challenge lifecycle
-- =============================================================================

-- 1. Extend challenge_submissions table with status lifecycle & payment columns
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'challenge_submissions' AND column_name = 'status') THEN
    ALTER TABLE public.challenge_submissions ADD COLUMN status TEXT NOT NULL DEFAULT 'submitted'
      CHECK (status IN ('draft', 'payment_pending', 'paid', 'submission_pending', 'submitted', 'approved', 'rejected'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'challenge_submissions' AND column_name = 'payment_status') THEN
    ALTER TABLE public.challenge_submissions ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'paid'
      CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'failed', 'refunded'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'challenge_submissions' AND column_name = 'payment_transaction_id') THEN
    ALTER TABLE public.challenge_submissions ADD COLUMN payment_transaction_id TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'challenge_submissions' AND column_name = 'review_feedback') THEN
    ALTER TABLE public.challenge_submissions ADD COLUMN review_feedback TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'challenge_submissions' AND column_name = 'updated_at') THEN
    ALTER TABLE public.challenge_submissions ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'challenge_submissions' AND column_name = 'last_voted_at') THEN
    ALTER TABLE public.challenge_submissions ADD COLUMN last_voted_at TIMESTAMPTZ;
  END IF;
END $$;

-- 2. Create challenge_voting_settings table
CREATE TABLE IF NOT EXISTS public.challenge_voting_settings (
  challenge_id UUID PRIMARY KEY REFERENCES public.challenges(id) ON DELETE CASCADE,
  max_votes_per_voter INT NOT NULL DEFAULT 1,
  allow_once_per_participant BOOLEAN NOT NULL DEFAULT true,
  require_auth BOOLEAN NOT NULL DEFAULT false,
  is_public BOOLEAN NOT NULL DEFAULT true,
  min_votes INT DEFAULT 1,
  max_votes INT DEFAULT 10,
  voting_start_at TIMESTAMPTZ,
  voting_end_at TIMESTAMPTZ,
  vote_status TEXT NOT NULL DEFAULT 'active' CHECK (vote_status IN ('upcoming', 'active', 'ended')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create vote_audit_logs table
CREATE TABLE IF NOT EXISTS public.vote_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.challenge_submissions(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  voter_identifier TEXT NOT NULL,
  voter_profile_id UUID,
  ip_address TEXT,
  user_agent TEXT,
  client_fingerprint TEXT,
  status TEXT NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'flagged_suspicious', 'rejected')),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create suspicious_activity table
CREATE TABLE IF NOT EXISTS public.suspicious_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES public.challenge_submissions(id) ON DELETE CASCADE,
  voter_identifier TEXT,
  activity_type TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Indexes for lightning-fast lookups
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.challenge_submissions(status, payment_status);
CREATE INDEX IF NOT EXISTS idx_submissions_challenge_status ON public.challenge_submissions(challenge_id, status);
CREATE INDEX IF NOT EXISTS idx_vote_audit_challenge ON public.vote_audit_logs(challenge_id, voter_identifier);
CREATE INDEX IF NOT EXISTS idx_vote_audit_submission ON public.vote_audit_logs(submission_id, created_at);
CREATE INDEX IF NOT EXISTS idx_suspicious_challenge ON public.suspicious_activity(challenge_id, created_at);

-- 7. Enable RLS and public policies
ALTER TABLE public.challenge_voting_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vote_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suspicious_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on challenge_voting_settings" ON public.challenge_voting_settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on challenge_voting_settings" ON public.challenge_voting_settings FOR ALL USING (true);

CREATE POLICY "Allow public read on vote_audit_logs" ON public.vote_audit_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert on vote_audit_logs" ON public.vote_audit_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on suspicious_activity" ON public.suspicious_activity FOR SELECT USING (true);
CREATE POLICY "Allow public insert on suspicious_activity" ON public.suspicious_activity FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Allow public insert on notifications" ON public.notifications FOR ALL USING (true);
