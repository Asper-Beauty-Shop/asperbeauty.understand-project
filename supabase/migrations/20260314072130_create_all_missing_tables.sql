-- Migration: Create all missing tables to match types.ts schema
-- Generated: 2026-03-14

-- ============================================================
-- ENUMS
-- ============================================================
do $$ begin create type public.app_role as enum ('admin', 'editor'); exception when duplicate_object then null; end $$;
do $$ begin create type public.locale_code as enum ('en', 'ar'); exception when duplicate_object then null; end $$;

-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists public.profiles (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  auth_user_id uuid references auth.users(id) on delete set null,
  display_name text,
  phone        text,
  tags         jsonb,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);
alter table public.profiles enable row level security;
create policy if not exists "Users can read own profile" on public.profiles for select using (auth.uid() = user_id);
create policy if not exists "Users can insert own profile" on public.profiles for insert with check (auth.uid() = user_id);
create policy if not exists "Users can update own profile" on public.profiles for update using (auth.uid() = user_id);
grant select on public.profiles to anon;
grant select, insert, update, delete on public.profiles to authenticated;

-- ============================================================
-- USER ROLES
-- ============================================================
create table if not exists public.user_roles (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       public.app_role not null,
  created_at timestamptz default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;
create policy if not exists "Users read own roles" on public.user_roles for select using (auth.uid() = user_id);
grant select on public.user_roles to anon;
grant select, insert, update, delete on public.user_roles to authenticated;

-- ============================================================
-- CONCIERGE PROFILES
-- ============================================================
create table if not exists public.concierge_profiles (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  skin_concern        text not null,
  skin_type           text,
  recommended_routine jsonb not null default '[]'::jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (user_id)
);
alter table public.concierge_profiles enable row level security;
create policy if not exists "Users manage own concierge profile" on public.concierge_profiles for all using (auth.uid() = user_id);
grant select on public.concierge_profiles to anon;
grant select, insert, update, delete on public.concierge_profiles to authenticated;

-- ============================================================
-- TELEMETRY EVENTS
-- ============================================================
create table if not exists public.telemetry_events (
  id             bigint generated always as identity primary key,
  user_id        uuid references auth.users(id) on delete set null,
  event          text not null,
  source         text not null,
  payload        jsonb not null default '{}'::jsonb,
  correlation_id text,
  occurred_at    timestamptz not null default now()
);
alter table public.telemetry_events enable row level security;
create policy if not exists "Authenticated insert telemetry" on public.telemetry_events for insert with check (auth.uid() = user_id or user_id is null);
create policy if not exists "Service role reads telemetry" on public.telemetry_events for select using (auth.role() = 'service_role');
grant select on public.telemetry_events to anon;
grant select, insert, update, delete on public.telemetry_events to authenticated;
create index if not exists telemetry_events_occurred_at_idx on public.telemetry_events(occurred_at desc);

-- ============================================================
-- PRODUCTS — add missing columns
-- ============================================================
alter table public.products
  add column if not exists availability_status text,
  add column if not exists bestseller_rank     integer,
  add column if not exists clinical_badge      text,
  add column if not exists condition           text,
  add column if not exists gold_stitch_tier    boolean not null default false,
  add column if not exists gtin                text,
  add column if not exists hex_swatch          text,
  add column if not exists key_ingredients     text[],
  add column if not exists mpn                 text,
  add column if not exists pharmacist_note     text,
  add column if not exists product_highlights  text[],
  add column if not exists tags                text[],
  add column if not exists texture_profile     text;

-- ============================================================
-- BRANDS — add missing columns
-- ============================================================
alter table public.brands
  add column if not exists description     text,
  add column if not exists featured        boolean not null default false,
  add column if not exists image_url       text not null default '',
  add column if not exists logo_image_path text,
  add column if not exists sort_order      integer not null default 0;
update public.brands set image_url = coalesce(hero_image_url, '') where image_url = '' and hero_image_url is not null;

-- ============================================================
-- CONVERSATIONS + MESSAGES
-- ============================================================
create table if not exists public.conversations (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  title      text,
  created_at timestamptz not null default now()
);
alter table public.conversations enable row level security;
create policy if not exists "Users manage own conversations" on public.conversations for all using (auth.uid() = user_id);
grant select on public.conversations to anon;
grant select, insert, update, delete on public.conversations to authenticated;

create table if not exists public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role            text not null,
  content         text not null,
  created_at      timestamptz not null default now()
);
alter table public.messages enable row level security;
create policy if not exists "Users manage own messages" on public.messages for all
  using (exists (select 1 from public.conversations c where c.id = conversation_id and c.user_id = auth.uid()));
grant select on public.messages to anon;
grant select, insert, update, delete on public.messages to authenticated;

-- ============================================================
-- CUSTOMER LEADS + NEWSLETTER + COD ORDERS
-- ============================================================
create table if not exists public.customer_leads (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete set null,
  source       text not null default 'web',
  status       text not null default 'new',
  email        text, phone text, skin_concern text, chat_summary text,
  notes        text, order_id text, order_value numeric,
  follow_up_at timestamptz, created_at timestamptz default now(), updated_at timestamptz default now()
);
alter table public.customer_leads enable row level security;
create policy if not exists "Admins manage leads" on public.customer_leads for all
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
grant select on public.customer_leads to anon;
grant select, insert, update, delete on public.customer_leads to authenticated;

create table if not exists public.newsletter_subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  subscribed_at timestamptz not null default now()
);
alter table public.newsletter_subscribers enable row level security;
create policy if not exists "Anyone can subscribe" on public.newsletter_subscribers for insert with check (true);
grant select on public.newsletter_subscribers to anon;
grant select, insert, update, delete on public.newsletter_subscribers to authenticated;

create table if not exists public.cod_orders (
  id uuid primary key default gen_random_uuid(), order_number text not null unique,
  customer_name text not null, customer_phone text not null, customer_email text,
  delivery_address text not null, city text not null default '', delivery_notes text,
  items jsonb not null default '[]', subtotal numeric not null default 0,
  shipping_cost numeric not null default 0, total numeric not null default 0,
  status text not null default 'pending', driver_id uuid references auth.users(id) on delete set null,
  customer_lat double precision, customer_lng double precision, notes text,
  assigned_at timestamptz, delivered_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.cod_orders enable row level security;
create policy if not exists "Admins manage orders" on public.cod_orders for all
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
grant select on public.cod_orders to anon;
grant select, insert, update, delete on public.cod_orders to authenticated;

-- ============================================================
-- REGIMEN PLANS + STEPS + USER CHOICES
-- ============================================================
create table if not exists public.regimen_plans (
  id uuid primary key default gen_random_uuid(), title text not null,
  description text, created_at timestamptz not null default now()
);
alter table public.regimen_plans enable row level security;
create policy if not exists "Public read regimen plans" on public.regimen_plans for select using (true);
grant select on public.regimen_plans to anon;
grant select, insert, update, delete on public.regimen_plans to authenticated;

create table if not exists public.regimen_steps (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.regimen_plans(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  step_number integer not null, instruction text,
  created_at timestamptz not null default now()
);
alter table public.regimen_steps enable row level security;
create policy if not exists "Public read regimen steps" on public.regimen_steps for select using (true);
grant select on public.regimen_steps to anon;
grant select, insert, update, delete on public.regimen_steps to authenticated;

create table if not exists public.user_regimen_choices (
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid not null references public.regimen_plans(id) on delete cascade,
  created_at timestamptz not null default now(), primary key (user_id, plan_id)
);
alter table public.user_regimen_choices enable row level security;
create policy if not exists "Users manage own regimen choices" on public.user_regimen_choices for all using (auth.uid() = user_id);
grant select on public.user_regimen_choices to anon;
grant select, insert, update, delete on public.user_regimen_choices to authenticated;

-- ============================================================
-- USER PROFILES + CONSULTATIONS
-- ============================================================
create table if not exists public.user_profiles (
  user_id       uuid primary key references auth.users(id) on delete cascade,
  skin_type     text, skin_concerns text[], updated_at timestamptz not null default now()
);
alter table public.user_profiles enable row level security;
create policy if not exists "Users manage own user profiles" on public.user_profiles for all using (auth.uid() = user_id);
grant select on public.user_profiles to anon;
grant select, insert, update, delete on public.user_profiles to authenticated;

create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_id uuid references public.concierge_profiles(id) on delete set null,
  channel text, locale text, regimen jsonb, transcript jsonb,
  created_at timestamptz not null default now()
);
alter table public.consultations enable row level security;
create policy if not exists "Users manage own consultations" on public.consultations for all using (auth.uid() = user_id);
grant select on public.consultations to anon;
grant select, insert, update, delete on public.consultations to authenticated;

-- ============================================================
-- PIPELINE + PRODUCT CLINICAL METADATA
-- ============================================================
create table if not exists public.product_clinical_metadata (
  id bigint generated always as identity primary key,
  shopify_product_id text not null unique, sku text not null,
  clinical_summary text not null, concern_tags text[] not null default '{}',
  detected_ingredients text[] not null default '{}', confidence_score numeric not null default 0,
  audit_model text not null, pipeline_version text not null,
  last_run_id text, last_audited_at timestamptz not null default now()
);
alter table public.product_clinical_metadata enable row level security;
create policy if not exists "Public read clinical metadata" on public.product_clinical_metadata for select using (true);
grant select on public.product_clinical_metadata to anon;
grant select, insert, update, delete on public.product_clinical_metadata to authenticated;

create table if not exists public.pipeline_error_log (
  id bigint generated always as identity primary key,
  shopify_product_id text not null, sku text not null, stage text not null,
  error_message text not null, run_id text, resolved boolean not null default false,
  run_timestamp timestamptz not null default now()
);
alter table public.pipeline_error_log enable row level security;
create policy if not exists "Admins read pipeline errors" on public.pipeline_error_log for select
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
grant select on public.pipeline_error_log to authenticated;

create table if not exists public.pipeline_requeue_queue (
  id bigint generated always as identity primary key,
  shopify_product_id text not null, sku text not null, stage text not null,
  requested_by text, requested_at timestamptz not null default now()
);
alter table public.pipeline_requeue_queue enable row level security;
create policy if not exists "Admins manage requeue" on public.pipeline_requeue_queue for all
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
grant select on public.pipeline_requeue_queue to authenticated;

-- ============================================================
-- REMAINING MISC TABLES
-- ============================================================
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(), table_name text not null,
  operation text not null, record_id uuid, old_data jsonb, new_data jsonb,
  created_at timestamptz not null default now()
);
alter table public.audit_logs enable row level security;
create policy if not exists "Service role audit logs" on public.audit_logs for select using (auth.role() = 'service_role');
grant select on public.audit_logs to authenticated;

create table if not exists public.ai_message_audit (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null, persona text not null,
  triggers text[] not null default '{}', request_snippet text, force_persona text,
  inventory_guard text, prompt_tokens integer, completion_tokens integer,
  created_at timestamptz not null default now()
);
alter table public.ai_message_audit enable row level security;
create policy if not exists "Service role ai audit" on public.ai_message_audit for select using (auth.role() = 'service_role');
grant select on public.ai_message_audit to authenticated;

create table if not exists public.site_config (
  key text primary key, value text not null, updated_at timestamptz default now()
);
alter table public.site_config enable row level security;
create policy if not exists "Public read site config" on public.site_config for select using (true);
grant select on public.site_config to anon;
grant select, insert, update, delete on public.site_config to authenticated;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(), provider text not null,
  event_type text not null, signature text not null, raw_body text not null,
  payload jsonb not null, external_id text, timestamp bigint,
  valid boolean not null default false, received_at timestamptz not null default now()
);
alter table public.events enable row level security;
create policy if not exists "Service role events" on public.events for select using (auth.role() = 'service_role');
grant select on public.events to authenticated;

create table if not exists public.webhook_audit_logs (
  id uuid primary key default gen_random_uuid(), provider text not null,
  event_type text not null, status text not null, response_ms integer,
  concern_detected text, error_message text, received_at timestamptz not null default now()
);
alter table public.webhook_audit_logs enable row level security;
create policy if not exists "Service role webhook logs" on public.webhook_audit_logs for select using (auth.role() = 'service_role');
grant select on public.webhook_audit_logs to authenticated;
