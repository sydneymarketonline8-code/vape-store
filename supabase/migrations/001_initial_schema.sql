-- ─────────────────────────────────────────────────────────────────────────────
-- Aussie Vapes — Initial Schema
-- Run in Supabase SQL Editor: Dashboard → SQL Editor → New Query → paste → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Products ─────────────────────────────────────────────────────────────────
create table if not exists public.products (
  id               text        primary key,
  slug             text        unique not null,
  name             text        not null,
  brand            text        not null,
  category         text        not null check (category in ('disposables','mods','e-liquids','pouches','accessories')),
  price            numeric(10,2) not null,
  original_price   numeric(10,2),
  image            text        not null,
  images           text[]      not null default '{}',
  description      text        not null default '',
  short_description text       not null default '',
  flavors          text[],
  nicotine_strengths integer[],
  in_stock         boolean     not null default true,
  featured         boolean     not null default false,
  rating           numeric(3,1) not null default 4.5,
  review_count     integer     not null default 0,
  tags             text[]      not null default '{}',
  puff_count       integer,
  ml_size          integer,
  created_at       timestamptz default now()
);

alter table public.products enable row level security;

create policy "products_public_read"
  on public.products for select using (true);

create policy "products_service_write"
  on public.products for all using (auth.role() = 'service_role');

-- Index for fast category + brand lookups
create index if not exists idx_products_category on public.products (category);
create index if not exists idx_products_brand    on public.products (brand);
create index if not exists idx_products_featured on public.products (featured) where featured = true;

-- ── Profiles ─────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id           uuid primary key references auth.users on delete cascade,
  email        text,
  first_name   text,
  last_name    text,
  created_at   timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_own_read"
  on public.profiles for select using (auth.uid() = id);

create policy "profiles_own_update"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Orders ───────────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users on delete set null,
  status       text not null default 'pending'
                 check (status in ('pending','processing','shipped','delivered','cancelled')),
  total        numeric(10,2) not null,
  email        text,
  address      jsonb,
  stripe_id    text,
  created_at   timestamptz default now()
);

alter table public.orders enable row level security;

create policy "orders_own_read"
  on public.orders for select using (auth.uid() = user_id);

create policy "orders_service_write"
  on public.orders for all using (auth.role() = 'service_role');

-- ── Order Items ───────────────────────────────────────────────────────────────
create table if not exists public.order_items (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid not null references public.orders on delete cascade,
  product_id        text references public.products,
  product_name      text not null,
  quantity          integer not null check (quantity > 0),
  price             numeric(10,2) not null,
  selected_flavor   text,
  selected_nicotine integer
);

alter table public.order_items enable row level security;

create policy "order_items_own_read"
  on public.order_items for select using (
    auth.uid() = (select user_id from public.orders where id = order_id)
  );

create policy "order_items_service_write"
  on public.order_items for all using (auth.role() = 'service_role');

-- ── Wishlist ─────────────────────────────────────────────────────────────────
create table if not exists public.wishlist_items (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users on delete cascade,
  product_id text not null references public.products on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, product_id)
);

alter table public.wishlist_items enable row level security;

create policy "wishlist_own_all"
  on public.wishlist_items for all using (auth.uid() = user_id);
