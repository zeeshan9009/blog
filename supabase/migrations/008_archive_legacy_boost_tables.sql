-- ============================================================================
-- RANKLANCR MIGRATION 008: ARCHIVE LEGACY SPONSORED BOOST & AUCTION TABLES
-- ============================================================================
-- Decommissioning legacy $2/24h Sponsored Boost and early auction tables.
-- Superceded by Outbid Spotlight Leaderboard and Challenge Arena.
--
-- COMPLIANCE / AUDIT POLICY:
-- DO NOT DROP TABLES. Historical financial records and Stripe payments must
-- remain queryable and immutable.
-- ============================================================================

-- 1. Archive promotions table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'promotions') THEN
    ALTER TABLE public.promotions RENAME TO promotions_archived_20260825;
    COMMENT ON TABLE public.promotions_archived_20260825 IS
      'Archived on removal of $2/24h Sponsored Boost system. Read-only historical record, do not write to this table.';
  END IF;
END $$;

-- 2. Archive promoted_campaigns table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'promoted_campaigns') THEN
    ALTER TABLE public.promoted_campaigns RENAME TO promoted_campaigns_archived_20260825;
    COMMENT ON TABLE public.promoted_campaigns_archived_20260825 IS
      'Archived on removal of legacy promoted auction system. Read-only historical record, do not write to this table.';
  END IF;
END $$;

-- 3. Archive promotion_bids table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'promotion_bids') THEN
    ALTER TABLE public.promotion_bids RENAME TO promotion_bids_archived_20260825;
    COMMENT ON TABLE public.promotion_bids_archived_20260825 IS
      'Archived legacy promotion bid logs. Read-only historical record, do not write to this table.';
  END IF;
END $$;

-- 4. Archive promotion_analytics table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'promotion_analytics') THEN
    ALTER TABLE public.promotion_analytics RENAME TO promotion_analytics_archived_20260825;
    COMMENT ON TABLE public.promotion_analytics_archived_20260825 IS
      'Archived legacy promotion analytics snapshots. Read-only historical record.';
  END IF;
END $$;

-- 5. Archive promotion_admin_config table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'promotion_admin_config') THEN
    ALTER TABLE public.promotion_admin_config RENAME TO promotion_admin_config_archived_20260825;
    COMMENT ON TABLE public.promotion_admin_config_archived_20260825 IS
      'Archived legacy promotion admin config. Read-only.';
  END IF;
END $$;
