-- ============================================================================
-- RANKLANCR MIGRATION 006: GUEST PROMOTIONS & SECURE MANAGEMENT TOKEN
-- ============================================================================

ALTER TABLE public.promoted_campaigns 
ADD COLUMN IF NOT EXISTS user_email TEXT,
ADD COLUMN IF NOT EXISTS management_token TEXT UNIQUE;

-- Create high-speed lookup index for secure magic management tokens
CREATE INDEX IF NOT EXISTS idx_promoted_campaigns_mgmt_token 
ON public.promoted_campaigns (management_token);

CREATE INDEX IF NOT EXISTS idx_promoted_campaigns_user_email 
ON public.promoted_campaigns (user_email);

-- Ensure RLS allows token-based management lookups and updates
CREATE POLICY "Allow management token read"
ON public.promoted_campaigns FOR SELECT
USING (true);

CREATE POLICY "Allow management token update"
ON public.promoted_campaigns FOR UPDATE
USING (true);
