-- ============================================================================
-- RANKLANCR MIGRATION 010: DROP UNUSED DATABASE COLUMNS
-- ============================================================================
-- Removes deprecated, unused, and redundant columns across database tables
-- to optimize storage, improve write latency, and clean up schema architecture.
-- ============================================================================

-- 1. Clean up unused columns from 'profiles'
DO $$
BEGIN
  -- username: not used; user identity is managed via user_id / auth.users
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'username') THEN
    ALTER TABLE public.profiles DROP COLUMN username;
  END IF;

  -- detailed_skills: redundant; skills TEXT[] is exclusively used
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'detailed_skills') THEN
    ALTER TABLE public.profiles DROP COLUMN detailed_skills;
  END IF;

  -- email_verified: handled directly by auth.users (Supabase Auth)
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'email_verified') THEN
    ALTER TABLE public.profiles DROP COLUMN email_verified;
  END IF;

  -- profile_completeness: deprecated calculated metric no longer used in UI
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'profile_completeness') THEN
    ALTER TABLE public.profiles DROP COLUMN profile_completeness;
  END IF;
END $$;

-- 2. Clean up unused columns from 'services'
DO $$
BEGIN
  -- slug: services do not have dedicated slug routing
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'services' AND column_name = 'slug') THEN
    ALTER TABLE public.services DROP COLUMN slug;
  END IF;

  -- deliverables: redundant with description and skills list
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'services' AND column_name = 'deliverables') THEN
    ALTER TABLE public.services DROP COLUMN deliverables;
  END IF;
END $$;

-- 3. Clean up unused columns from 'challenges'
DO $$
BEGIN
  -- category_id: challenges table uses category (TEXT)
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'challenges' AND column_name = 'category_id') THEN
    ALTER TABLE public.challenges DROP COLUMN category_id;
  END IF;
END $$;
