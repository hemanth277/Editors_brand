-- ============================================================
--  EDITORS BRAND – Supabase Migration
--  Run this entire file in Supabase SQL Editor
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── 1. admin_profiles ────────────────────────────────────────
-- Extends auth.users for admin role tracking
create table if not exists public.admin_profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  role        text not null default 'admin' check (role in ('admin', 'super_admin')),
  created_at  timestamptz not null default now()
);

-- ── 2. customers ─────────────────────────────────────────────
create table if not exists public.customers (
  id          uuid primary key default uuid_generate_v4(),
  full_name   text not null,
  phone       text not null,
  email       text not null,
  created_at  timestamptz not null default now()
);

-- ── 3. pricing_packages ──────────────────────────────────────
create table if not exists public.pricing_packages (
  id          uuid primary key default uuid_generate_v4(),
  code        text not null,
  name        text not null,
  price       integer not null,
  duration    text not null,
  features    text[] not null default '{}',
  badge       text,
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── 4. bookings ──────────────────────────────────────────────
create table if not exists public.bookings (
  id              uuid primary key default uuid_generate_v4(),
  customer_id     uuid references public.customers(id) on delete set null,
  full_name       text not null,
  phone           text not null,
  email           text not null,
  event_type      text not null,
  event_date      date not null,
  location        text not null,
  package_name    text not null,
  requirements    text,
  status          text not null default 'pending'
                    check (status in ('pending','confirmed','completed','cancelled')),
  admin_notes     text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ── 5. services ──────────────────────────────────────────────
create table if not exists public.services (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  description text,
  image_url   text,
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── 6. portfolio ─────────────────────────────────────────────
create table if not exists public.portfolio (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  category      text not null,
  media_type    text not null check (media_type in ('image','video')),
  storage_path  text not null,
  public_url    text,
  thumbnail_url text,
  is_featured   boolean not null default false,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── Auto-updated updated_at trigger ──────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger bookings_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

create trigger pricing_packages_updated_at
  before update on public.pricing_packages
  for each row execute function public.set_updated_at();

create trigger services_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

create trigger portfolio_updated_at
  before update on public.portfolio
  for each row execute function public.set_updated_at();

-- ── Helper: is_admin() ────────────────────────────────────────
create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.admin_profiles
    where id = auth.uid()
  );
$$;

-- ════════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY
-- ════════════════════════════════════════════════════════════

alter table public.admin_profiles   enable row level security;
alter table public.customers        enable row level security;
alter table public.bookings         enable row level security;
alter table public.pricing_packages enable row level security;
alter table public.services         enable row level security;
alter table public.portfolio        enable row level security;

-- ── admin_profiles policies ──────────────────────────────────
create policy "Admins can view own profile"
  on public.admin_profiles for select
  using (auth.uid() = id);

create policy "Super admins can view all profiles"
  on public.admin_profiles for select
  using (public.is_admin());

-- ── customers policies ───────────────────────────────────────
-- Public can INSERT (booking creates customer)
create policy "Anyone can insert a customer"
  on public.customers for insert
  with check (true);

-- Only admins can SELECT customers
create policy "Admins can view customers"
  on public.customers for select
  using (public.is_admin());

create policy "Admins can update customers"
  on public.customers for update
  using (public.is_admin());

-- ── bookings policies ────────────────────────────────────────
-- Public can INSERT a booking
create policy "Anyone can submit a booking"
  on public.bookings for insert
  with check (true);

-- Only admins can read bookings
create policy "Admins can view all bookings"
  on public.bookings for select
  using (public.is_admin());

create policy "Admins can update bookings"
  on public.bookings for update
  using (public.is_admin());

create policy "Admins can delete bookings"
  on public.bookings for delete
  using (public.is_admin());

-- ── pricing_packages policies ────────────────────────────────
-- Everyone can read active packages (shown on public site)
create policy "Public can view active packages"
  on public.pricing_packages for select
  using (is_active = true);

create policy "Admins can view all packages"
  on public.pricing_packages for select
  using (public.is_admin());

create policy "Admins can insert packages"
  on public.pricing_packages for insert
  with check (public.is_admin());

create policy "Admins can update packages"
  on public.pricing_packages for update
  using (public.is_admin());

create policy "Admins can delete packages"
  on public.pricing_packages for delete
  using (public.is_admin());

-- ── services policies ────────────────────────────────────────
create policy "Public can view active services"
  on public.services for select
  using (is_active = true);

create policy "Admins can manage services"
  on public.services for all
  using (public.is_admin());

-- ── portfolio policies ───────────────────────────────────────
create policy "Public can view portfolio"
  on public.portfolio for select
  using (true);

create policy "Admins can manage portfolio"
  on public.portfolio for all
  using (public.is_admin());

-- ════════════════════════════════════════════════════════════
--  STORAGE BUCKETS
-- ════════════════════════════════════════════════════════════

insert into storage.buckets (id, name, public)
values
  ('portfolio-images', 'portfolio-images', true),
  ('event-videos',     'event-videos',     true)
on conflict (id) do nothing;

-- Portfolio-images storage policies
create policy "Public can view portfolio images"
  on storage.objects for select
  using (bucket_id = 'portfolio-images');

create policy "Admins can upload portfolio images"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-images' and public.is_admin());

create policy "Admins can delete portfolio images"
  on storage.objects for delete
  using (bucket_id = 'portfolio-images' and public.is_admin());

-- Event-videos storage policies
create policy "Public can view event videos"
  on storage.objects for select
  using (bucket_id = 'event-videos');

create policy "Admins can upload event videos"
  on storage.objects for insert
  with check (bucket_id = 'event-videos' and public.is_admin());

create policy "Admins can delete event videos"
  on storage.objects for delete
  using (bucket_id = 'event-videos' and public.is_admin());

-- ════════════════════════════════════════════════════════════
--  SEED DATA – Pricing packages (mirrors src/data/pricing.js)
-- ════════════════════════════════════════════════════════════

insert into public.pricing_packages
  (code, name, price, duration, features, badge, sort_order)
values
  (
    'PACKAGE 01', 'Half Day Plan', 4999,
    'Up to 4 hours of coverage',
    array[
      'Up to 4 hours of coverage',
      'One professional Reel Maker',
      'Vertical video shooting',
      'Edited highlight reels',
      'Digital delivery'
    ],
    null, 1
  ),
  (
    'PACKAGE 02', 'Full Day Plan', 8999,
    'Up to 8 hours of coverage',
    array[
      'Up to 8 hours of coverage',
      'Professional event coverage',
      'Multiple edited reels',
      'Candid moments',
      'Digital delivery'
    ],
    'Most Popular', 2
  ),
  (
    'PACKAGE 03', 'Premium Plan', 14999,
    'Full-day premium event coverage',
    array[
      'Full-day event coverage',
      'Premium creative coverage',
      'Multiple highlight reels',
      'Priority editing',
      'Customized deliverables'
    ],
    null, 3
  )
on conflict do nothing;
