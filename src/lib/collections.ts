import type { Product } from '@/types'

// ── Collection (category) metadata ──────────────────────────────────────────
// The DB `categories` table is flat (no image_url), and products live in local
// JSON, so collection presentation lives here. `gradient` drives the hero.
export interface CollectionMeta {
  slug: string
  name: string
  description: string
  /** tailwind gradient classes for the hero (no category hero images exist yet) */
  gradient: string
}

export const COLLECTIONS: CollectionMeta[] = [
  {
    slug: 'disposables',
    name: 'Disposable Vapes',
    description:
      'Ready-to-use disposable vapes from the brands Australia loves — huge puff counts, bold flavours, no refills or charging required.',
    gradient: 'from-emerald-600 to-green-800',
  },
  {
    slug: 'mods',
    name: 'Pod Systems & Kits',
    description:
      'Refillable pod systems, starter kits and devices for a longer-lasting, more economical vape.',
    gradient: 'from-sky-700 to-indigo-900',
  },
  {
    slug: 'e-liquids',
    name: 'E-Liquids & Nic Salts',
    description: 'Freebase e-liquids and nicotine salts in a spectrum of flavours and strengths.',
    gradient: 'from-purple-700 to-fuchsia-900',
  },
  {
    slug: 'pouches',
    name: 'Nicotine Pouches',
    description: 'Tobacco-free nicotine and caffeine pouches — discreet, smoke-free and easy to use.',
    gradient: 'from-amber-600 to-orange-800',
  },
  {
    slug: 'accessories',
    name: 'Vape Accessories',
    description: 'Chargers, cases, batteries, coils and the spares that keep your kit running.',
    gradient: 'from-slate-600 to-slate-900',
  },
]

export function getCollection(slug: string): CollectionMeta | null {
  return COLLECTIONS.find(c => c.slug === slug) ?? null
}

// ── Query params ─────────────────────────────────────────────────────────────
export const PAGE_SIZE = 20

export type SortKey =
  | 'featured'
  | 'best_selling'
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'az'
  | 'za'

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'best_selling', label: 'Best Selling' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'az', label: 'A–Z' },
  { value: 'za', label: 'Z–A' },
]

export type Availability = 'all' | 'in_stock'

export interface CollectionParams {
  page: number
  sort: SortKey
  minPrice: number | null
  maxPrice: number | null
  brands: string[]
  status: Availability
}

type RawParams = Record<string, string | string[] | undefined>

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v
}

/** Parse + normalize the URL searchParams into a typed CollectionParams. */
export function parseCollectionParams(raw: RawParams): CollectionParams {
  const sortRaw = first(raw.sort) as SortKey | undefined
  const sort = SORT_OPTIONS.some(o => o.value === sortRaw) ? (sortRaw as SortKey) : 'featured'

  const pageNum = Number(first(raw.page))
  const page = Number.isFinite(pageNum) && pageNum > 0 ? Math.floor(pageNum) : 1

  const min = Number(first(raw.minPrice))
  const max = Number(first(raw.maxPrice))

  const brandsRaw = raw.brands ?? raw.brand
  const brands = (Array.isArray(brandsRaw) ? brandsRaw : brandsRaw ? [brandsRaw] : [])
    .flatMap(b => b.split(','))
    .map(b => b.trim())
    .filter(Boolean)

  const status: Availability = first(raw.status) === 'in_stock' ? 'in_stock' : 'all'

  return {
    page,
    sort,
    minPrice: Number.isFinite(min) ? min : null,
    maxPrice: Number.isFinite(max) ? max : null,
    brands,
    status,
  }
}

/** Serialize params back to a query object, omitting defaults for clean URLs. */
export function buildCollectionQuery(p: Partial<CollectionParams>): Record<string, string> {
  const q: Record<string, string> = {}
  if (p.page && p.page > 1) q.page = String(p.page)
  if (p.sort && p.sort !== 'featured') q.sort = p.sort
  if (p.status && p.status !== 'all') q.status = p.status
  if (p.brands && p.brands.length) q.brands = p.brands.join(',')
  if (p.minPrice != null) q.minPrice = String(p.minPrice)
  if (p.maxPrice != null) q.maxPrice = String(p.maxPrice)
  return q
}

export function buildCollectionHref(slug: string, p: Partial<CollectionParams>): string {
  const q = new URLSearchParams(buildCollectionQuery(p)).toString()
  return `/collections/${slug}${q ? `?${q}` : ''}`
}

// ── Query execution (in-memory over local JSON) ──────────────────────────────
export interface BrandFacet {
  name: string
  count: number
}

export interface CollectionResult {
  items: Product[]
  total: number
  totalPages: number
  page: number
  /** brand facet computed from the whole collection (stable regardless of selection) */
  brands: BrandFacet[]
  /** price bounds across the whole collection, for the slider */
  priceBounds: { min: number; max: number }
}

// Query execution lives in '@/lib/collections-query' (server-only) so this module
// stays free of the catalogue JSON and is safe to import from client components.
