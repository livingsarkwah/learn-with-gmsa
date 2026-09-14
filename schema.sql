create extension if not exists "uuid-ossp";

create table if not exists public.admins (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  full_name text not null,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

drop policy if exists "Admins can read their own profile" on public.admins;
create policy "Admins can read their own profile" on public.admins
for select using (lower(email) = lower(auth.jwt() ->> 'email'));

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admins
    where lower(email) = lower(auth.jwt() ->> 'email')
  );
$$;

create table if not exists public.colleges (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.programs (
  id uuid primary key default uuid_generate_v4(),
  college_id uuid references public.colleges(id) on delete set null,
  name text not null,
  created_at timestamptz not null default now(),
  unique (college_id, name)
);

create table if not exists public.courses (
  id uuid primary key default uuid_generate_v4(),
  program_id uuid not null references public.programs(id) on delete cascade,
  code text not null,
  title text not null,
  level integer not null check (level between 100 and 600),
  semester integer not null check (semester in (1, 2)),
  created_at timestamptz not null default now(),
  unique (program_id, code)
);

create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  member_only boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.resource_collections (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.resources (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  category_id uuid not null references public.categories(id) on delete restrict,
  course_id uuid references public.courses(id) on delete set null,
  collection_id uuid references public.resource_collections(id) on delete set null,
  resource_type text not null check (resource_type in ('pdf', 'video', 'document')),
  file_url text not null,
  file_name text,
  tags text[] not null default '{}',
  download_count integer not null default 0,
  created_at timestamptz not null default now(),
  status text not null default 'published' check (status in ('draft', 'published'))
);

create table if not exists public.bookmarks (
  id uuid primary key default uuid_generate_v4(),
  resource_id uuid not null references public.resources(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (resource_id)
);

create index if not exists idx_resources_created_at on public.resources(created_at desc);
create index if not exists idx_resources_course_id on public.resources(course_id);
create index if not exists idx_resources_collection_id on public.resources(collection_id);
create index if not exists idx_resources_status on public.resources(status);

alter table public.resources enable row level security;
alter table public.programs enable row level security;
alter table public.courses enable row level security;
alter table public.categories enable row level security;
alter table public.resource_collections enable row level security;

create policy "Public can read published resources" on public.resources
for select using (status = 'published');

create policy "Public can read published programs" on public.programs
for select using (true);

create policy "Public can read courses" on public.courses
for select using (true);

create policy "Public can read categories" on public.categories
for select using (true);

create policy "Public can read collections" on public.resource_collections
for select using (true);

create policy "Admins can manage all data" on public.resources
for all using (public.is_admin()) with check (public.is_admin());

create policy "Admins can manage programs" on public.programs
for all using (public.is_admin()) with check (public.is_admin());

create policy "Admins can manage courses" on public.courses
for all using (public.is_admin()) with check (public.is_admin());

create policy "Admins can manage categories" on public.categories
for all using (public.is_admin()) with check (public.is_admin());

create policy "Admins can manage collections" on public.resource_collections
for all using (public.is_admin()) with check (public.is_admin());
