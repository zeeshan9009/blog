-- Migration 015: Challenge Slug Auto-Generation & Direct Submission Routing
-- Ensures every challenge has a unique, collision-resistant, human-readable URL slug

ALTER TABLE challenges ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Create slug generation function
CREATE OR REPLACE FUNCTION generate_challenge_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INT := 1;
BEGIN
  -- Generate base slug from title (lowercase, remove special chars, replace spaces with hyphens)
  base_slug := lower(regexp_replace(COALESCE(NEW.title, ''), '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);

  -- Fallback if title contains no alphanumeric chars (e.g. only emojis)
  IF base_slug IS NULL OR length(base_slug) = 0 THEN
    base_slug := 'challenge-' || substr(COALESCE(NEW.id::text, gen_random_uuid()::text), 1, 8);
  END IF;

  final_slug := base_slug;

  -- Handle collisions by suffixing incrementing counter
  WHILE EXISTS (SELECT 1 FROM challenges WHERE slug = final_slug AND id != NEW.id) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;

  NEW.slug := final_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate slug before insert or when title/slug is updated
DROP TRIGGER IF EXISTS trg_generate_slug ON challenges;
CREATE TRIGGER trg_generate_slug
BEFORE INSERT OR UPDATE OF title, slug ON challenges
FOR EACH ROW EXECUTE FUNCTION generate_challenge_slug();

-- Backfill any existing challenges without a slug
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT id, title FROM challenges WHERE slug IS NULL LOOP
    UPDATE challenges 
    SET title = title 
    WHERE id = r.id;
  END LOOP;
END $$;

-- Create index on slug for sub-millisecond query lookups
CREATE INDEX IF NOT EXISTS idx_challenges_slug ON challenges(slug);
