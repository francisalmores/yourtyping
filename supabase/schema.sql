-- YourTyping database schema
-- Paste this whole file into Supabase: SQL Editor -> New query -> Run

-- Profiles: one row per signed-up user, holds their public display name
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);


-- Test results: every completed typing test gets a row
create table if not exists public.test_results (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  wpm int not null,
  raw_wpm int not null,
  accuracy int not null,
  duration int not null,
  correct_chars int not null,
  incorrect_chars int not null,
  correct_words int not null,
  total_words int not null,
  created_at timestamptz default now()
);

alter table public.test_results enable row level security;

create policy "Results are viewable by everyone"
  on public.test_results for select
  using (true);

create policy "Users can insert their own results"
  on public.test_results for insert
  with check (auth.uid() = user_id);


-- Game scores: falling-words game results
create table if not exists public.game_scores (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  score int not null,
  created_at timestamptz default now()
);

alter table public.game_scores enable row level security;

create policy "Game scores are viewable by everyone"
  on public.game_scores for select
  using (true);

create policy "Users can insert their own game scores"
  on public.game_scores for insert
  with check (auth.uid() = user_id);


-- Leaderboard view: each user's BEST wpm per test duration
create or replace view public.leaderboard as
select distinct on (tr.user_id, tr.duration)
  tr.user_id,
  p.username,
  tr.wpm,
  tr.accuracy,
  tr.duration,
  tr.created_at
from public.test_results tr
join public.profiles p on p.id = tr.user_id
order by tr.user_id, tr.duration, tr.wpm desc;
