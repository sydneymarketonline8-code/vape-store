-- ─────────────────────────────────────────────────────────────────────────────
-- Aussie Vapes — Complete e-commerce + admin backend schema
--
-- Self-contained and idempotent. Safe to run on a fresh database or re-run on an
-- existing one (uses `create ... if not exists`, guarded enums, and
-- `drop policy if exists`).
--
-- Run in Supabase SQL Editor: Dashboard → SQL Editor → New Query → paste → Run.
--
-- Supersedes 001_initial_schema.sql + 002_add_pouches_category.sql.
-- Keeps storefront columns (category, in_stock, featured, original_price) so the
-- existing site keeps working, and adds the columns the admin dashboard needs.
-- ─────────────────────────────────────────────────────────────────────────────

create extension if not exists pgcrypto;   -- gen_random_uuid()

-- ── Enums ────────────────────────────────────────────────────────────────────
do $$ begin
  create type public.product_status as enum ('active','draft','pre_order','sold_out');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.order_status as enum
    ('pending','confirmed','processing','shipped','delivered','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.coupon_type as enum ('percent','fixed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.user_role as enum ('customer','affiliate','admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.review_status as enum ('pending','approved','rejected');
exception when duplicate_object then null; end $$;

-- ── Shared helpers ─────────────────────────────────────────────────────────────
-- Keep updated_at fresh on any row update.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Admin check helper (used by the RLS policies below and by
-- /lib/supabase/server.ts). plpgsql + security definer so it can read profiles
-- regardless of the caller's RLS, and so body resolution defers to call time
-- (profiles is created further down).
create or replace function public.is_admin(uid uuid)
returns boolean
language plpgsql
security definer
set search_path = public
stable
as $$
begin
  return exists (
    select 1 from public.profiles
    where id = uid and role = 'admin'
  );
end;
$$;

-- Build the weighted product search vector. Declared IMMUTABLE so it can be used
-- in a generated column — inlining to_tsvector('english', …) directly trips
-- Postgres's "generation expression is not immutable" check (42P17).
create or replace function public.products_search_doc(
  p_name text, p_sku text, p_brand text, p_description text, p_tags text[]
) returns tsvector language sql immutable as $$
  select setweight(to_tsvector('english', coalesce(p_name, '')), 'A')
      || setweight(to_tsvector('english', coalesce(p_sku, '')), 'A')
      || setweight(to_tsvector('english', coalesce(p_brand, '')), 'A')
      || setweight(to_tsvector('english', coalesce(p_description, '')), 'B')
      || setweight(to_tsvector('english', coalesce(array_to_string(p_tags, ' '), '')), 'C');
$$;

-- ── Categories ─────────────────────────────────────────────────────────────────
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  description text not null default '',
  parent_id   uuid references public.categories on delete set null,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.categories enable row level security;

drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read"
  on public.categories for select using (true);

drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write"
  on public.categories for all using (public.is_admin(auth.uid()));

-- Seed the storefront's fixed categories (slugs match the products.category check).
insert into public.categories (name, slug, sort_order) values
  ('Disposables', 'disposables', 1),
  ('Mods',        'mods',        2),
  ('E-Liquids',   'e-liquids',   3),
  ('Pouches',     'pouches',     4),
  ('Accessories', 'accessories', 5)
on conflict (slug) do nothing;

-- ── Products ─────────────────────────────────────────────────────────────────
create table if not exists public.products (
  id                 text          primary key,
  slug               text          unique not null,
  name               text          not null,
  brand              text          not null default '',
  -- Storefront category slug (kept for existing filters). category_id is the
  -- normalized FK used by the admin dashboard.
  category           text          not null
                       check (category in ('disposables','mods','e-liquids','pouches','accessories')),
  category_id        uuid          references public.categories on delete set null,
  description        text          not null default '',
  short_description  text          not null default '',
  -- Pricing
  price              numeric(10,2) not null,
  original_price     numeric(10,2),                 -- "compare at" / was-price
  cost_price         numeric(10,2),                 -- internal cost, admin only
  -- Media
  image              text          not null default '',
  images             text[]        not null default '{}',
  -- Merchandising
  flavors            text[],
  nicotine_strengths integer[],
  tags               text[]        not null default '{}',
  puff_count         integer,
  ml_size            integer,
  featured           boolean       not null default false,
  status             public.product_status not null default 'active',
  -- Inventory / fulfilment
  sku                text          unique,
  inventory_qty      integer       not null default 0,
  in_stock           boolean       not null default true,
  weight_lbs         numeric(10,2),
  length_in          numeric(10,2),
  width_in           numeric(10,2),
  height_in          numeric(10,2),
  -- Flexible technical specs: { "Power": "15HP", "Capacity": "2ml" }
  specs              jsonb         not null default '{}'::jsonb,
  -- SEO
  meta_title         text,
  meta_description   text,
  -- Social proof (denormalized from reviews)
  rating             numeric(3,1)  not null default 4.5,
  review_count       integer       not null default 0,
  -- Weighted full-text search vector (used by GET /api/search once products
  -- live in DB). name/sku/brand = A, description = B, tags = C.
  fts                tsvector generated always as (
                       public.products_search_doc(name, sku, brand, description, tags)
                     ) stored,
  created_at         timestamptz   not null default now(),
  updated_at         timestamptz   not null default now()
);

alter table public.products enable row level security;

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read"
  on public.products for select using (true);

drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write"
  on public.products for all using (public.is_admin(auth.uid()));

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute procedure public.set_updated_at();

-- Indexes on columns guaranteed to exist on legacy installs. Indexes that depend
-- on the new columns are created at the end, after the reconciliation block.
create index if not exists idx_products_category on public.products (category);
create index if not exists idx_products_brand    on public.products (brand);
create index if not exists idx_products_featured on public.products (featured) where featured = true;

-- ── Profiles ─────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid primary key references auth.users on delete cascade,
  email         text,
  first_name    text,
  last_name     text,
  phone         text,
  role          public.user_role not null default 'customer',
  avatar_url    text,
  -- 8-char referral code, auto-generated; shared as /register?ref=CODE
  referral_code text unique default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
  referred_by   uuid references auth.users on delete set null,
  created_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_own_read" on public.profiles;
create policy "profiles_own_read"
  on public.profiles for select using (auth.uid() = id);

drop policy if exists "profiles_own_update" on public.profiles;
create policy "profiles_own_update"
  on public.profiles for update using (auth.uid() = id);

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all"
  on public.profiles for all using (public.is_admin(auth.uid()));

-- Note: idx_profiles_role is created after the reconciliation block below, since
-- `role` may not exist on a pre-existing profiles table until it is added there.

-- Auto-create a profile on signup. Captures name from signup metadata and, if
-- the user registered via /register?ref=CODE, links referred_by to the referrer.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  ref_code text := nullif(new.raw_user_meta_data->>'ref', '');
  ref_id   uuid;
begin
  if ref_code is not null then
    select id into ref_id from public.profiles where referral_code = upper(ref_code) limit 1;
  end if;

  insert into public.profiles (id, email, first_name, last_name, referred_by)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    ref_id
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Orders ───────────────────────────────────────────────────────────────────
-- Human-readable order numbers: AV-1001, AV-1002, …
create sequence if not exists public.order_number_seq start 1001;

create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  order_number     text unique not null default ('AV-' || nextval('public.order_number_seq')),
  user_id          uuid references auth.users on delete set null,
  email            text,
  status           public.order_status not null default 'pending',
  -- Money
  subtotal         numeric(10,2) not null default 0,
  shipping_amount  numeric(10,2) not null default 0,
  discount_amount  numeric(10,2) not null default 0,
  tax_amount       numeric(10,2) not null default 0,
  total            numeric(10,2) not null,
  coupon_code      text,
  -- Addresses (jsonb: { name, line1, line2, city, state, postcode, country, phone }).
  -- The shipping address jsonb also carries `paymentMethod` ('payid' | 'crypto').
  address          jsonb,            -- shipping address (kept name for back-compat)
  billing_address  jsonb,
  -- Fulfilment
  tracking_number  text,
  carrier          text,
  notes            text,             -- internal admin notes
  -- Payment
  stripe_id        text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.orders enable row level security;

drop policy if exists "orders_own_read" on public.orders;
create policy "orders_own_read"
  on public.orders for select using (auth.uid() = user_id);

-- Customers create orders for themselves; guests create with a null user_id.
drop policy if exists "orders_insert" on public.orders;
create policy "orders_insert"
  on public.orders for insert with check (auth.uid() = user_id or user_id is null);

drop policy if exists "orders_admin_all" on public.orders;
create policy "orders_admin_all"
  on public.orders for all using (public.is_admin(auth.uid()));

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute procedure public.set_updated_at();

create index if not exists idx_orders_user_id    on public.orders (user_id);
create index if not exists idx_orders_status     on public.orders (status);
create index if not exists idx_orders_created_at on public.orders (created_at desc);
create index if not exists idx_orders_email      on public.orders (email);

-- ── Order items ────────────────────────────────────────────────────────────────
create table if not exists public.order_items (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid not null references public.orders on delete cascade,
  product_id        text references public.products on delete set null,
  product_name      text not null,
  product_image     text,
  sku               text,
  quantity          integer not null check (quantity > 0),
  price             numeric(10,2) not null,
  selected_flavor   text,
  selected_nicotine integer
);

alter table public.order_items enable row level security;

drop policy if exists "order_items_own_read" on public.order_items;
create policy "order_items_own_read"
  on public.order_items for select using (
    auth.uid() = (select user_id from public.orders where id = order_id)
  );

-- Insert items only for an order the caller could create (own or guest order).
drop policy if exists "order_items_insert" on public.order_items;
create policy "order_items_insert"
  on public.order_items for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id = auth.uid() or o.user_id is null)
    )
  );

drop policy if exists "order_items_admin_all" on public.order_items;
create policy "order_items_admin_all"
  on public.order_items for all using (public.is_admin(auth.uid()));

create index if not exists idx_order_items_order_id   on public.order_items (order_id);
create index if not exists idx_order_items_product_id on public.order_items (product_id);

-- ── Coupons ──────────────────────────────────────────────────────────────────
create table if not exists public.coupons (
  id              uuid primary key default gen_random_uuid(),
  code            text unique not null,
  type            public.coupon_type not null default 'percent',
  value           numeric(10,2) not null,         -- percent (0-100) or fixed amount
  min_order_value numeric(10,2) not null default 0,
  max_uses        integer,                        -- null = unlimited
  uses_count      integer not null default 0,
  expires_at      timestamptz,
  is_active       boolean not null default true,
  user_id         uuid references auth.users on delete cascade, -- null = public coupon
  created_at      timestamptz not null default now()
);

alter table public.coupons enable row level security;

-- Anyone may read an active coupon (needed at checkout to validate a code).
drop policy if exists "coupons_public_read_active" on public.coupons;
create policy "coupons_public_read_active"
  on public.coupons for select using (is_active = true);

-- Users can always see coupons issued specifically to them (incl. used/expired).
drop policy if exists "coupons_own_read" on public.coupons;
create policy "coupons_own_read"
  on public.coupons for select using (auth.uid() = user_id);

drop policy if exists "coupons_admin_all" on public.coupons;
create policy "coupons_admin_all"
  on public.coupons for all using (public.is_admin(auth.uid()));

create index if not exists idx_coupons_code on public.coupons (code);

-- ── Reviews ──────────────────────────────────────────────────────────────────
create table if not exists public.reviews (
  id            uuid primary key default gen_random_uuid(),
  product_id    text not null references public.products on delete cascade,
  user_id       uuid references auth.users on delete set null,
  reviewer_name text not null,
  rating        integer not null check (rating between 1 and 5),
  title         text,
  body          text not null default '',
  status        public.review_status not null default 'pending',
  created_at    timestamptz not null default now()
);

alter table public.reviews enable row level security;

-- Public sees only approved reviews; authors see their own.
drop policy if exists "reviews_public_read_approved" on public.reviews;
create policy "reviews_public_read_approved"
  on public.reviews for select using (status = 'approved' or auth.uid() = user_id);

drop policy if exists "reviews_own_insert" on public.reviews;
create policy "reviews_own_insert"
  on public.reviews for insert with check (auth.uid() = user_id);

drop policy if exists "reviews_admin_all" on public.reviews;
create policy "reviews_admin_all"
  on public.reviews for all using (public.is_admin(auth.uid()));

create index if not exists idx_reviews_product_id on public.reviews (product_id);
create index if not exists idx_reviews_status     on public.reviews (status);

-- ── Affiliates ─────────────────────────────────────────────────────────────────
create table if not exists public.affiliates (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users on delete set null,
  code            text unique not null,           -- referral code, e.g. VAPER10
  commission_rate numeric(5,2) not null default 10.0,  -- percent of order subtotal
  clicks          integer not null default 0,
  total_referrals integer not null default 0,
  total_earned    numeric(10,2) not null default 0,
  total_paid      numeric(10,2) not null default 0,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

alter table public.affiliates enable row level security;

drop policy if exists "affiliates_own_read" on public.affiliates;
create policy "affiliates_own_read"
  on public.affiliates for select using (auth.uid() = user_id);

drop policy if exists "affiliates_admin_all" on public.affiliates;
create policy "affiliates_admin_all"
  on public.affiliates for all using (public.is_admin(auth.uid()));

-- Tracks which orders came through an affiliate (for the Affiliate admin page).
create table if not exists public.affiliate_referrals (
  id             uuid primary key default gen_random_uuid(),
  affiliate_id   uuid not null references public.affiliates on delete cascade,
  order_id       uuid references public.orders on delete set null,
  commission     numeric(10,2) not null default 0,
  status         text not null default 'pending'
                   check (status in ('pending','approved','paid','rejected')),
  created_at     timestamptz not null default now()
);

alter table public.affiliate_referrals enable row level security;

drop policy if exists "affiliate_referrals_admin_all" on public.affiliate_referrals;
create policy "affiliate_referrals_admin_all"
  on public.affiliate_referrals for all using (public.is_admin(auth.uid()));

create index if not exists idx_affiliate_referrals_affiliate on public.affiliate_referrals (affiliate_id);

-- ── Wishlist ─────────────────────────────────────────────────────────────────
create table if not exists public.wishlist_items (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users on delete cascade,
  product_id text not null references public.products on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

alter table public.wishlist_items enable row level security;

drop policy if exists "wishlist_own_all" on public.wishlist_items;
create policy "wishlist_own_all"
  on public.wishlist_items for all using (auth.uid() = user_id);

-- ── Search logs (analytics; powers "Popular Searches" reporting) ─────────────
create table if not exists public.search_logs (
  id            uuid primary key default gen_random_uuid(),
  query         text not null,
  results_count integer not null default 0,
  user_id       uuid references auth.users on delete set null,
  created_at    timestamptz not null default now()
);

alter table public.search_logs enable row level security;

-- Anyone (incl. anonymous shoppers) may record a search; only admins can read.
drop policy if exists "search_logs_insert" on public.search_logs;
create policy "search_logs_insert"
  on public.search_logs for insert with check (true);

drop policy if exists "search_logs_admin_read" on public.search_logs;
create policy "search_logs_admin_read"
  on public.search_logs for select using (public.is_admin(auth.uid()));

create index if not exists idx_search_logs_query   on public.search_logs (query);
create index if not exists idx_search_logs_created on public.search_logs (created_at desc);

-- ── Blog posts ───────────────────────────────────────────────────────────────
create table if not exists public.blog_posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  excerpt      text,
  content      text not null default '',   -- HTML authored in the admin editor
  cover_image  text,
  author       text,
  published_at timestamptz,                 -- null = draft (hidden from the public)
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

-- Public sees only published posts; admins manage everything.
drop policy if exists "blog_public_read" on public.blog_posts;
create policy "blog_public_read"
  on public.blog_posts for select using (published_at is not null and published_at <= now());

drop policy if exists "blog_admin_all" on public.blog_posts;
create policy "blog_admin_all"
  on public.blog_posts for all using (public.is_admin(auth.uid()));

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row execute procedure public.set_updated_at();

create index if not exists idx_blog_published on public.blog_posts (published_at desc);

-- ── Reconcile pre-existing installs ──────────────────────────────────────────
-- If an earlier schema was already applied (the now-removed 001_initial_schema.sql
-- + 002_add_pouches_category.sql), the `create table if not exists` blocks above
-- leave those tables untouched — so the new admin columns would be missing. These
-- guarded statements add them. Every one is a no-op on a fresh database.

-- products: add the admin/inventory/SEO columns
alter table public.products add column if not exists category_id      uuid references public.categories on delete set null;
alter table public.products add column if not exists cost_price       numeric(10,2);
alter table public.products add column if not exists status           public.product_status not null default 'active';
alter table public.products add column if not exists sku              text;
alter table public.products add column if not exists inventory_qty    integer not null default 0;
alter table public.products add column if not exists weight_lbs       numeric(10,2);
alter table public.products add column if not exists length_in        numeric(10,2);
alter table public.products add column if not exists width_in         numeric(10,2);
alter table public.products add column if not exists height_in        numeric(10,2);
alter table public.products add column if not exists specs            jsonb not null default '{}'::jsonb;
alter table public.products add column if not exists meta_title       text;
alter table public.products add column if not exists meta_description text;
alter table public.products add column if not exists updated_at       timestamptz not null default now();
-- (Re)create the weighted fts column via the IMMUTABLE helper. Generated-column
-- expressions can't be ALTERed, so drop + recreate to pick up the definition.
-- Cheap on an empty/small products table; the GIN index is recreated below.
alter table public.products drop column if exists fts;
alter table public.products add column fts tsvector generated always as (
  public.products_search_doc(name, sku, brand, description, tags)
) stored;
do $$ begin
  alter table public.products add constraint products_sku_key unique (sku);
exception when duplicate_object or duplicate_table then null; end $$;
-- widen the legacy category check to include 'pouches' (folds in old 002)
alter table public.products drop constraint if exists products_category_check;
alter table public.products add constraint products_category_check
  check (category in ('disposables','mods','e-liquids','pouches','accessories'));

-- profiles: add role + phone + account-dashboard fields
alter table public.profiles add column if not exists phone         text;
alter table public.profiles add column if not exists role          public.user_role not null default 'customer';
alter table public.profiles add column if not exists avatar_url    text;
alter table public.profiles add column if not exists referred_by   uuid references auth.users on delete set null;
alter table public.profiles add column if not exists referral_code text;
update public.profiles set referral_code = upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)) where referral_code is null;
alter table public.profiles alter column referral_code set default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
do $$ begin
  alter table public.profiles add constraint profiles_referral_code_key unique (referral_code);
exception when duplicate_object or duplicate_table then null; end $$;

-- coupons: add per-user ownership
alter table public.coupons add column if not exists user_id uuid references auth.users on delete cascade;

-- orders: add the new money/fulfilment columns. Add every column FIRST (incl.
-- updated_at) before the order_number backfill UPDATE — that UPDATE fires the
-- set_updated_at trigger, which references updated_at.
alter table public.orders add column if not exists order_number    text;
alter table public.orders add column if not exists subtotal        numeric(10,2) not null default 0;
alter table public.orders add column if not exists shipping_amount numeric(10,2) not null default 0;
alter table public.orders add column if not exists discount_amount numeric(10,2) not null default 0;
alter table public.orders add column if not exists tax_amount      numeric(10,2) not null default 0;
alter table public.orders add column if not exists coupon_code     text;
alter table public.orders add column if not exists billing_address jsonb;
alter table public.orders add column if not exists tracking_number text;
alter table public.orders add column if not exists carrier         text;
alter table public.orders add column if not exists notes           text;
alter table public.orders add column if not exists updated_at      timestamptz not null default now();
-- now backfill order_number + add default/uniqueness
update public.orders set order_number = 'AV-' || nextval('public.order_number_seq') where order_number is null;
alter table public.orders alter column order_number set default ('AV-' || nextval('public.order_number_seq'));
do $$ begin
  alter table public.orders add constraint orders_order_number_key unique (order_number);
exception when duplicate_object or duplicate_table then null; end $$;
-- convert legacy text status → order_status enum (safe: old check values are a subset)
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'orders'
      and column_name = 'status' and data_type <> 'USER-DEFINED'
  ) then
    alter table public.orders drop constraint if exists orders_status_check;
    alter table public.orders alter column status drop default;
    alter table public.orders alter column status type public.order_status using status::public.order_status;
    alter table public.orders alter column status set default 'pending';
  end if;
end $$;

-- order_items: add image + sku snapshot columns
alter table public.order_items add column if not exists product_image text;
alter table public.order_items add column if not exists sku           text;

-- Indexes on the new columns (created here so they exist on both fresh and
-- already-provisioned databases — see the reconciliation block above).
create index if not exists idx_profiles_role        on public.profiles (role);
create index if not exists idx_profiles_referred_by on public.profiles (referred_by);
create index if not exists idx_coupons_user_id      on public.coupons (user_id);
create index if not exists idx_products_category_id on public.products (category_id);
create index if not exists idx_products_status      on public.products (status);
create index if not exists idx_products_sku         on public.products (sku);
create index if not exists idx_products_low_stock   on public.products (inventory_qty) where inventory_qty < 5;
create index if not exists idx_products_fts         on public.products using gin (fts);

-- ── Avatar storage bucket ────────────────────────────────────────────────────
-- Public bucket for profile avatars; users may write only inside their own
-- {userId}/ folder. (If your project restricts DDL on the storage schema, create
-- the bucket + policies from the Supabase Storage dashboard instead.)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_public_read"
  on storage.objects for select using (bucket_id = 'avatars');

drop policy if exists "avatars_user_insert" on storage.objects;
create policy "avatars_user_insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "avatars_user_update" on storage.objects;
create policy "avatars_user_update"
  on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "avatars_user_delete" on storage.objects;
create policy "avatars_user_delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- ─────────────────────────────────────────────────────────────────────────────
-- Notes
-- • The service role key bypasses RLS entirely, so admin server components that
--   use it can read/write every table regardless of the policies above. The
--   is_admin()-based policies protect direct access via the anon/auth key.
-- • To grant yourself admin: update public.profiles set role='admin' where email='you@…';
-- ─────────────────────────────────────────────────────────────────────────────
