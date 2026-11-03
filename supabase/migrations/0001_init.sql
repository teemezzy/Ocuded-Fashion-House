-- O_Cubed — initial schema
-- Run in the Supabase SQL editor (or `supabase db push`).
-- Mirrors the planned data model: settings, weekly schedule, date overrides,
-- appointments, payments, and the admin email whitelist.

-- ---------- extensions ----------
create extension if not exists "pgcrypto";

-- ---------- enums ----------
do $$ begin
  create type event_type as enum ('Wedding', 'Engagement', 'Cultural', 'Custom');
exception when duplicate_object then null; end $$;

do $$ begin
  create type consultation_type as enum ('In-person', 'Virtual');
exception when duplicate_object then null; end $$;

do $$ begin
  create type appointment_status as enum
    ('pending', 'confirmed', 'rescheduled', 'completed', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type override_type as enum ('blocked', 'open');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('success', 'refunded', 'pending');
exception when duplicate_object then null; end $$;

-- ---------- admin_settings (singleton) ----------
create table if not exists admin_settings (
  id                  int primary key default 1,
  consultation_price  integer not null default 50000,
  slot_duration       integer not null default 60,   -- minutes
  buffer_time         integer not null default 15,    -- minutes
  booking_window_days integer not null default 60,
  business_name       text not null default 'O_Cubed Fashion House',
  business_email      text not null default 'hello@ocubed.com',
  business_phone      text not null default '',
  studio_address      text not null default '',
  timezone            text not null default 'Africa/Lagos',
  updated_at          timestamptz not null default now(),
  constraint singleton check (id = 1)
);

-- ---------- weekly_schedule (one row per weekday) ----------
create table if not exists weekly_schedule (
  day        text primary key,          -- 'Monday' … 'Sunday'
  weekday    int  not null,             -- 0=Sun … 6=Sat
  active     boolean not null default true,
  start_time text not null default '10:00',
  end_time   text not null default '16:00'
);

-- ---------- date_overrides ----------
create table if not exists date_overrides (
  id         uuid primary key default gen_random_uuid(),
  date       date not null unique,
  type       override_type not null,
  note       text,
  created_at timestamptz not null default now()
);

-- ---------- appointments ----------
create table if not exists appointments (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  email              text not null,
  phone              text,
  date               date not null,
  time               text not null,             -- 'HH:mm'
  event_type         event_type not null,
  event_date         date,
  consultation_type  consultation_type not null,
  status             appointment_status not null default 'pending',
  amount             integer not null default 0,
  paid               boolean not null default false,
  paystack_ref       text,
  notes              text,
  meta               jsonb,                      -- pre-consultation answers
  rescheduled_to     uuid references appointments(id),
  created_at         timestamptz not null default now()
);
create index if not exists appointments_date_idx on appointments (date);
create index if not exists appointments_status_idx on appointments (status);

-- ---------- payments ----------
create table if not exists payments (
  id             uuid primary key default gen_random_uuid(),
  appointment_id uuid references appointments(id) on delete set null,
  name           text not null,
  amount         integer not null,
  reference      text not null unique,
  status         payment_status not null default 'success',
  paid_at        timestamptz not null default now()
);

-- ---------- allowed_admins (email whitelist) ----------
create table if not exists allowed_admins (
  email      text primary key,
  added_at   timestamptz not null default now()
);

-- ================= Row Level Security =================
alter table admin_settings   enable row level security;
alter table weekly_schedule  enable row level security;
alter table date_overrides   enable row level security;
alter table appointments     enable row level security;
alter table payments         enable row level security;
alter table allowed_admins   enable row level security;

-- helper: is the current user a whitelisted admin?
create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from allowed_admins
    where email = (auth.jwt() ->> 'email')
  );
$$;

-- Public (anon) may READ availability data so the booking page works.
drop policy if exists "public read settings" on admin_settings;
create policy "public read settings" on admin_settings for select using (true);

drop policy if exists "public read schedule" on weekly_schedule;
create policy "public read schedule" on weekly_schedule for select using (true);

drop policy if exists "public read overrides" on date_overrides;
create policy "public read overrides" on date_overrides for select using (true);

-- Anyone may CREATE a (pending) appointment from the booking form.
drop policy if exists "public create appointment" on appointments;
create policy "public create appointment" on appointments
  for insert with check (true);

-- Admins can do everything.
drop policy if exists "admin all settings" on admin_settings;
create policy "admin all settings" on admin_settings for all
  using (is_admin()) with check (is_admin());

drop policy if exists "admin all schedule" on weekly_schedule;
create policy "admin all schedule" on weekly_schedule for all
  using (is_admin()) with check (is_admin());

drop policy if exists "admin all overrides" on date_overrides;
create policy "admin all overrides" on date_overrides for all
  using (is_admin()) with check (is_admin());

drop policy if exists "admin all appointments" on appointments;
create policy "admin all appointments" on appointments for all
  using (is_admin()) with check (is_admin());

drop policy if exists "admin all payments" on payments;
create policy "admin all payments" on payments for all
  using (is_admin()) with check (is_admin());

drop policy if exists "admin read whitelist" on allowed_admins;
create policy "admin read whitelist" on allowed_admins for all
  using (is_admin()) with check (is_admin());

-- NOTE: server-side code uses the service-role key, which bypasses RLS.
-- The policies above protect any direct anon/client access.
