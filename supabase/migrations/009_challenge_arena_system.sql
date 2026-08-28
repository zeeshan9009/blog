-- ============================================================================
-- 009_CHALLENGE_ARENA_SYSTEM.SQL
-- Challenge Arena: Weekly skill challenge, fixed-$2 bid prize pool expansion,
-- merit-based winner selection, vote triggers, and social publish tracking.
-- ============================================================================

-- 1. Challenges Table
create table if not exists challenges (
  id uuid primary key default gen_random_uuid(),
  category_id text,
  title text not null,
  prompt text not null,
  category text not null default 'Development',
  banner_image text default 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
  status text not null default 'open' check (status in ('open','judging','closed')),
  submission_deadline timestamptz not null,
  voting_deadline timestamptz not null,
  prize_pool_cents int not null default 0,
  platform_fee_bps int not null default 1000, -- 10% (1000 basis points)
  winner_submission_id uuid,
  created_at timestamptz default now()
);

comment on table challenges is 'Weekly skill-based challenges where freelancers submit work and public prize pool expands by $2 bids.';

-- 2. Challenge Submissions Table
create table if not exists challenge_submissions (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references challenges(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  title text,
  submission_url text,
  submission_text text,
  demo_video_url text,
  vote_count numeric(10,1) not null default 0,
  client_score numeric(5,2),
  final_rank int,
  created_at timestamptz default now(),
  unique (challenge_id, profile_id)
);

comment on table challenge_submissions is 'Freelancer entries for a specific challenge. Merit-ranked by public votes and client judge score.';

-- 3. Challenge Votes Table
create table if not exists challenge_votes (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references challenge_submissions(id) on delete cascade,
  voter_profile_id uuid references profiles(id) on delete set null,
  voter_fingerprint text not null,
  voter_ip text,
  weight numeric(3,1) not null default 1.0,
  created_at timestamptz default now(),
  unique (submission_id, voter_fingerprint)
);

comment on table challenge_votes is 'Fingerprint-verified votes on challenge submissions. Verified accounts weight=2.0, guests weight=1.0.';

-- 4. Challenge Bids Table (Fixed $2 Prize Pool Boost)
create table if not exists challenge_bids (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references challenges(id) on delete cascade,
  bidder_profile_id uuid references profiles(id) on delete set null,
  bidder_label text not null default 'Anonymous Supporter',
  bidder_message text,
  bidder_avatar text,
  amount_cents int not null default 200,
  stripe_payment_intent_id text not null,
  status text not null check (status in ('succeeded','failed')),
  created_at timestamptz default now()
);

comment on table challenge_bids is 'Fixed $2 pool additions by sponsors/clients. Strictly grows the prize pool without affecting submission vote counts.';

-- 5. Challenge Social Posts Table
create table if not exists challenge_social_posts (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references challenges(id) on delete cascade,
  platform text not null check (platform in ('x','instagram','linkedin')),
  post_url text,
  caption text,
  status text not null default 'published' check (status in ('queued','published','failed')),
  retry_count int not null default 0,
  posted_at timestamptz default now()
);

comment on table challenge_social_posts is 'Audit log for automated social media publications celebrating challenge winners and sponsors.';

-- 6. Performance Indices
create index if not exists idx_challenges_status_deadline on challenges (status, voting_deadline);
create index if not exists idx_submissions_challenge on challenge_submissions (challenge_id, vote_count desc);
create index if not exists idx_votes_submission on challenge_votes (submission_id);
create index if not exists idx_bids_challenge on challenge_bids (challenge_id, created_at desc);

-- 7. Denormalized Counter Trigger Functions
create or replace function increment_submission_vote_count()
returns trigger as $$
begin
  update challenge_submissions
  set vote_count = vote_count + NEW.weight
  where id = NEW.submission_id;
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists trg_vote_count on challenge_votes;
create trigger trg_vote_count
after insert on challenge_votes
for each row execute function increment_submission_vote_count();

create or replace function increment_prize_pool()
returns trigger as $$
begin
  if NEW.status = 'succeeded' then
    update challenges
    set prize_pool_cents = prize_pool_cents + NEW.amount_cents
    where id = NEW.challenge_id;
  end if;
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists trg_prize_pool on challenge_bids;
create trigger trg_prize_pool
after insert on challenge_bids
for each row execute function increment_prize_pool();

-- 8. No dummy seed challenge (Empty state ready for live admin creation)

