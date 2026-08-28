-- Migration: 018_viral_live_features.sql / 008_viral_live_features.sql
-- RankLancr.lol — Viral Live Features: Steal the Rail, Live Vote Battle, Global Activity Feed

-- 1. Ensure challenges table has rail tracking columns
alter table challenges add column if not exists current_rail_holder_id uuid references profiles(id);
alter table challenges add column if not exists current_rail_vote_count int default 0;
alter table challenges add column if not exists rail_held_since timestamptz default now();

-- 2. Table: rail_steal_events
-- Logs every time someone successfully takes over the Top Developer Rail
create table if not exists rail_steal_events (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid references challenges(id) on delete cascade,
  previous_holder_id uuid references profiles(id) on delete set null,
  new_holder_id uuid references profiles(id) on delete set null,
  submission_id uuid references challenge_submissions(id) on delete set null,
  stolen_at timestamptz default now(),
  vote_count_at_steal int not null
);

-- 3. Table: rail_steal_attempts
-- Tracks every attempt (both failed and successful) for the "X people tried today" counter
create table if not exists rail_steal_attempts (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid references challenges(id) on delete cascade,
  attempted_by_id uuid references profiles(id) on delete set null,
  submission_id uuid references challenge_submissions(id) on delete set null,
  succeeded boolean not null default false,
  attempted_at timestamptz default now()
);

-- 4. Table: activity_feed
-- Generic lightweight event log for the landing-page live ticker
create table if not exists activity_feed (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in
    ('rail_steal', 'new_vote', 'new_entry', 'spotlight_outbid', 'challenge_won')),
  actor_id uuid references profiles(id) on delete set null,
  actor_display_name text not null,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

create index if not exists idx_activity_feed_created_at on activity_feed(created_at desc);
create index if not exists idx_rail_steal_events_challenge on rail_steal_events(challenge_id);
create index if not exists idx_rail_steal_attempts_challenge on rail_steal_attempts(challenge_id);
create index if not exists idx_rail_steal_attempts_created_at on rail_steal_attempts(attempted_at desc);

-- 5. Enable Realtime replication on these tables
do $$
begin
  begin
    alter publication supabase_realtime add table rail_steal_events;
  exception when others then null;
  end;
  begin
    alter publication supabase_realtime add table rail_steal_attempts;
  exception when others then null;
  end;
  begin
    alter publication supabase_realtime add table activity_feed;
  exception when others then null;
  end;
  begin
    alter publication supabase_realtime add table challenge_votes;
  exception when others then null;
  end;
end $$;

-- 6. Trigger: auto-insert into activity_feed when a rail steal happens
create or replace function log_rail_steal_to_feed()
returns trigger as $$
declare
  v_display_name text;
begin
  select coalesce(p.display_name, p.name, 'Anonymous Challenger')
  into v_display_name
  from profiles p
  where p.id = new.new_holder_id;

  if v_display_name is null then
    v_display_name := 'A Top Developer';
  end if;

  insert into activity_feed (event_type, actor_id, actor_display_name, metadata)
  values (
    'rail_steal',
    new.new_holder_id,
    v_display_name,
    jsonb_build_object(
      'challenge_id', new.challenge_id,
      'previous_holder_id', new.previous_holder_id,
      'submission_id', new.submission_id,
      'vote_count', new.vote_count_at_steal
    )
  );
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_log_rail_steal on rail_steal_events;
create trigger trg_log_rail_steal
after insert on rail_steal_events
for each row execute function log_rail_steal_to_feed();
