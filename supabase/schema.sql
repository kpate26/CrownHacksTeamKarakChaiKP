create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organization text not null,
  category text not null,
  day text not null,
  date text not null,
  distance numeric not null default 0,
  duration text not null,
  image text not null,
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

create policy "Events are publicly readable"
  on public.events for select
  using (true);