-- Allow the new 'pouches' product category (nicotine/caffeine pouches).
-- Run this against the existing database before re-seeding products.

alter table public.products
  drop constraint if exists products_category_check;

alter table public.products
  add constraint products_category_check
  check (category in ('disposables','mods','e-liquids','pouches','accessories'));
