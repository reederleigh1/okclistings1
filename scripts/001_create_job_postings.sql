-- Create job_postings table
create table if not exists public.job_postings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  location text not null,
  job_type text not null,
  description text not null,
  salary_range text,
  contact_email text not null,
  contact_phone text,
  tier text not null check (tier in ('basic', 'featured', 'premium')),
  created_at timestamp with time zone default now(),
  expires_at timestamp with time zone default (now() + interval '30 days')
);

-- Enable RLS
alter table public.job_postings enable row level security;

-- Allow anyone to view active job postings
create policy "job_postings_select_all"
  on public.job_postings for select
  using (expires_at > now());

-- Allow anyone to insert job postings (after payment)
create policy "job_postings_insert_all"
  on public.job_postings for insert
  with check (true);

-- Create index for better query performance
create index if not exists job_postings_created_at_idx on public.job_postings(created_at desc);
create index if not exists job_postings_tier_idx on public.job_postings(tier);
