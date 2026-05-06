# VapeStore — Ecommerce Website

## Project Overview
A modern, responsive ecommerce website for a vape retailer. Built with a dark, premium aesthetic and full shopping functionality including age verification, product catalog, cart, and Stripe checkout.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Cart/State**: Zustand (persisted to localStorage)
- **Payments**: Stripe
- **Auth**: NextAuth.js
- **Icons**: Lucide React

## Project Structure
```
src/
  app/                  # Next.js App Router pages
    (auth)/             # Login, register pages
    (shop)/             # Main shop pages
    api/                # API routes (auth, stripe, products)
    layout.tsx          # Root layout with providers
    page.tsx            # Homepage
  components/
    ui/                 # shadcn/ui base components
    layout/             # Header, Footer, Nav
    shop/               # ProductCard, ProductGrid, Filters
    cart/               # CartDrawer, CartItem, CartSummary
    common/             # AgeGate, Hero, etc.
  lib/
    stripe.ts           # Stripe client/server helpers
    auth.ts             # NextAuth config
    store.ts            # Zustand cart store
    utils.ts            # Shared utilities
  types/                # TypeScript type definitions
  data/                 # Mock product data (until DB is added)
```

## Key Features
1. **Age Verification Gate** — Modal on first visit, stores consent in localStorage. Legal requirement for vape products.
2. **Product Catalog** — Filterable by category (disposables, mods, e-liquids, accessories), brand, nicotine strength, and flavor.
3. **Product Detail Page** — Image gallery, variant selection (size/strength), add to cart.
4. **Cart Drawer** — Slide-out cart, quantity controls, persisted across sessions.
5. **Checkout** — Stripe-powered, handles payment and order confirmation.
6. **Auth** — Customer accounts (register, login, order history).
7. **Responsive** — Mobile-first, works on all screen sizes.

## Design System
- **Theme**: Dark — deep black/slate backgrounds with electric blue (`#3B82F6`) or purple (`#8B5CF6`) accents
- **Typography**: Inter (sans-serif), bold headings, clean body text
- **Spacing**: Tailwind default scale
- **Breakpoints**: Tailwind defaults (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
- **Components**: shadcn/ui base components, customized to match dark theme

## Commands
```bash
npm run dev       # Start development server
npm run build     # Production build
npm run lint      # ESLint
npm run type-check  # TypeScript check (tsc --noEmit)
```

## Environment Variables
```
NEXTAUTH_SECRET=
NEXTAUTH_URL=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

## Code Conventions
- Use `@/` path alias for all imports from `src/`
- Server Components by default; add `"use client"` only when needed (interactivity, hooks, browser APIs)
- Co-locate component styles with Tailwind; no separate CSS files unless needed
- All product/type definitions live in `src/types/`
- Mock data lives in `src/data/` — replace with DB/API calls when backend is added

## Legal Notes
- Age gate is mandatory — never bypass or remove it
- Comply with platform/ad policies (no targeting minors)
- Product descriptions must not make health claims
