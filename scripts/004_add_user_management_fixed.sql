-- Create profiles table for user information
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamp with time zone default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Drop existing policies before creating to make script idempotent
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_delete_own" on public.profiles;

-- Profiles policies
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = id);

-- Add user_id column to job_postings table
alter table public.job_postings 
add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Enable RLS on job_postings
alter table public.job_postings enable row level security;

-- Drop existing policies before creating to make script idempotent
drop policy if exists "job_postings_select_all" on public.job_postings;
drop policy if exists "job_postings_insert_own" on public.job_postings;
drop policy if exists "job_postings_update_own" on public.job_postings;
drop policy if exists "job_postings_delete_own" on public.job_postings;

-- Job postings policies
-- Anyone can view active job postings
create policy "job_postings_select_all"
  on public.job_postings for select
  using (expires_at > now());

-- Only authenticated users can insert job postings
create policy "job_postings_insert_own"
  on public.job_postings for insert
  with check (auth.uid() = user_id);

-- Users can only update their own job postings
create policy "job_postings_update_own"
  on public.job_postings for update
  using (auth.uid() = user_id);

-- Users can only delete their own job postings
create policy "job_postings_delete_own"
  on public.job_postings for delete
  using (auth.uid() = user_id);

-- Create trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (
    new.id,
    new.email
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
