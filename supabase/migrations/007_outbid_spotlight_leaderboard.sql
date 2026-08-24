-- Migration 007: Outbid Spotlight Leaderboard
-- Implements ascending auction slots (Global Top 3 + Category Top 3) with 72-hour decay and audit ledger

create table if not exists spotlight_slots (
  id uuid primary key default gen_random_uuid(),
  scope text not null check (scope in ('global', 'category')),
  category text, -- Null for global, category string (e.g. 'Web Development') for category scope
  position int not null check (position between 1 and 3),
  current_holder_profile_id text,
  current_holder_name text,
  current_holder_avatar text,
  current_holder_title text,
  current_holder_destination_url text,
  current_holder_platform text default 'website',
  current_price_cents int not null default 500, -- starting price e.g. $5.00
  min_increment_cents int not null default 100, -- minimum increment e.g. $1.00 or 5%
  claimed_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz default now(),
  constraint uq_spotlight_slot unique (scope, category, position)
);

create table if not exists spotlight_bids (
  id uuid primary key default gen_random_uuid(),
  slot_id uuid references spotlight_slots(id) on delete cascade,
  profile_id text not null,
  bidder_name text,
  bidder_email text,
  destination_url text,
  destination_platform text,
  amount_cents int not null,
  stripe_payment_intent_id text not null,
  status text not null check (status in ('succeeded', 'failed', 'refunded')),
  created_at timestamptz default now()
);

create index if not exists idx_spotlight_bids_slot on spotlight_bids (slot_id, created_at desc);
create index if not exists idx_spotlight_bids_profile on spotlight_bids (profile_id);
create index if not exists idx_spotlight_slots_lookup on spotlight_slots (scope, category, position);

-- Enable RLS
alter table spotlight_slots enable row level security;
alter table spotlight_bids enable row level security;

-- Public can read all active spotlight slots
create policy "Public read spotlight slots"
  on spotlight_slots for select
  using (true);

-- Public read for audit activity feed (only public fields)
create policy "Public read spotlight bids"
  on spotlight_bids for select
  using (status = 'succeeded');

-- Service role full access
create policy "Service role manage spotlight slots"
  on spotlight_slots for all
  using (true)
  with check (true);

create policy "Service role manage spotlight bids"
  on spotlight_bids for all
  using (true)
  with check (true);

-- Seed Default Global Top 3 Slots
insert into spotlight_slots (scope, category, position, current_price_cents, min_increment_cents)
values
  ('global', null, 1, 1000, 100),
  ('global', null, 2, 700, 100),
  ('global', null, 3, 500, 100)
on conflict (scope, category, position) do nothing;

-- Seed Default Category Top 3 Slots (Web Development, UI/UX Design, AI Engineering, Mobile Development)
insert into spotlight_slots (scope, category, position, current_price_cents, min_increment_cents)
values
  ('category', 'Web Development', 1, 800, 100),
  ('category', 'Web Development', 2, 600, 100),
  ('category', 'Web Development', 3, 400, 100),
  ('category', 'UI/UX Design', 1, 600, 100),
  ('category', 'UI/UX Design', 2, 400, 100),
  ('category', 'UI/UX Design', 3, 300, 100),
  ('category', 'AI Engineering', 1, 800, 100),
  ('category', 'AI Engineering', 2, 600, 100),
  ('category', 'AI Engineering', 3, 400, 100),
  ('category', 'Mobile Development', 1, 600, 100),
  ('category', 'Mobile Development', 2, 400, 100),
  ('category', 'Mobile Development', 3, 300, 100)
on conflict (scope, category, position) do nothing;
