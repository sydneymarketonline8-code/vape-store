import 'server-only'
import { products as allProducts } from '@/data/products'
import type { Product } from '@/types'
import {
  PAGE_SIZE,
  type SortKey,
  type CollectionParams,
  type CollectionResult,
  type BrandFacet,
} from '@/lib/collections'

// Server-only query execution over the local JSON catalogue. Kept out of
// '@/lib/collections' so client components can import the constants/helpers there
// without dragging the ~1.4 MB catalogue into the browser bundle. The `server-only`
// import makes any client-side import of this module a build error.

function sortProducts(list: Product[], sort: SortKey): Product[] {
  const r = [...list]
  switch (sort) {
    case 'price_asc':
      return r.sort((a, b) => a.price - b.price)
    case 'price_desc':
      return r.sort((a, b) => b.price - a.price)
    case 'best_selling':
      return r.sort((a, b) => b.reviewCount - a.reviewCount)
    case 'newest':
      // No created_at in local data — id descending is a reasonable proxy.
      return r.sort((a, b) => Number(b.id) - Number(a.id))
    case 'az':
      return r.sort((a, b) => a.name.localeCompare(b.name))
    case 'za':
      return r.sort((a, b) => b.name.localeCompare(a.name))
    default:
      return r.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || b.reviewCount - a.reviewCount
      )
  }
}

/** Lightweight category stats for SEO copy/metadata (count, from-price, top brands). */
export function categoryStats(slug: string): { count: number; minPrice: number; topBrands: string[] } {
  const base = allProducts.filter(p => p.category === slug)
  const counts = new Map<string, number>()
  let min = Infinity
  for (const p of base) {
    if (p.brand && p.brand !== 'OTHER') counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1)
    if (p.price < min) min = p.price
  }
  const topBrands = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([b]) => b)
  return { count: base.length, minPrice: Number.isFinite(min) ? min : 0, topBrands }
}

// ── Tier-2 brand cluster pages: /collections/[slug]/[brand] ──────────────────

export const brandSlug = (b: string) => b.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

export interface BrandCategoryData {
  brand: string
  list: Product[]
  count: number
  minPrice: number
  puffCounts: number[]
  puffSeries: { puff: number; count: number }[]
  otherBrands: { name: string; slug: string; count: number }[]
}

export interface SeriesData {
  brand: string
  puff: number
  list: Product[]
  count: number
  minPrice: number
  otherSeries: { puff: number; count: number }[]
}

/** Brand×category combos with at least `min` products — for generateStaticParams + sitemap. */
export function brandCategoryParams(min = 5): { slug: string; brand: string }[] {
  const counts = new Map<string, { slug: string; brand: string; n: number }>()
  for (const p of allProducts) {
    if (!p.brand || p.brand === 'OTHER') continue
    const key = `${p.category}::${p.brand}`
    const e = counts.get(key) ?? { slug: p.category, brand: p.brand, n: 0 }
    e.n++
    counts.set(key, e)
  }
  return [...counts.values()].filter(e => e.n >= min).map(e => ({ slug: e.slug, brand: brandSlug(e.brand) }))
}

/** Resolve a brand slug within a category to its products + cross-link data (null if unknown). */
export function resolveBrandInCategory(slug: string, brandParam: string): BrandCategoryData | null {
  const inCat = allProducts.filter(p => p.category === slug && p.brand && p.brand !== 'OTHER')
  if (!inCat.length) return null
  const brand = [...new Set(inCat.map(p => p.brand))].find(b => brandSlug(b) === brandParam)
  if (!brand) return null

  const list = inCat
    .filter(p => p.brand === brand)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
  const minPrice = Math.min(...list.map(p => p.price))

  // Per-puff series counts (sorted by puff desc) for the brand in this category.
  const puffMap = new Map<number, number>()
  for (const p of list) if (p.puffCount) puffMap.set(p.puffCount, (puffMap.get(p.puffCount) ?? 0) + 1)
  const puffSeries = [...puffMap.entries()].map(([puff, count]) => ({ puff, count })).sort((a, b) => b.puff - a.puff)
  const puffCounts = puffSeries.map(s => s.puff)

  const counts = new Map<string, number>()
  for (const p of inCat) counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1)
  const otherBrands = [...counts.entries()]
    .filter(([b]) => b !== brand)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, slug: brandSlug(name), count }))

  return { brand, list, count: list.length, minPrice, puffCounts, puffSeries, otherBrands }
}

/** Series slug helpers: a series is a brand's exact puff count, e.g. "15000-puffs". */
export const seriesSlug = (puff: number) => `${puff}-puffs`

/** Series combos (category × brand × puff, ≥min products, brand has ≥2 puff counts). */
export function seriesParams(min = 5): { slug: string; brand: string; series: string }[] {
  const combo = new Map<string, number>()
  const brandPuffs = new Map<string, Set<number>>()
  for (const p of allProducts) {
    if (!p.brand || p.brand === 'OTHER' || !p.puffCount) continue
    combo.set(`${p.category}::${p.brand}::${p.puffCount}`, (combo.get(`${p.category}::${p.brand}::${p.puffCount}`) ?? 0) + 1)
    const bk = `${p.category}::${p.brand}`
    if (!brandPuffs.has(bk)) brandPuffs.set(bk, new Set())
    brandPuffs.get(bk)!.add(p.puffCount)
  }
  const out: { slug: string; brand: string; series: string }[] = []
  for (const [key, n] of combo) {
    const [cat, brand, puff] = key.split('::')
    if (n >= min && (brandPuffs.get(`${cat}::${brand}`)?.size ?? 0) >= 2) {
      out.push({ slug: cat, brand: brandSlug(brand), series: seriesSlug(Number(puff)) })
    }
  }
  return out
}

/** Resolve a series page (category + brand slug + "{puff}-puffs") to its products. */
export function resolveSeries(slug: string, brandParam: string, seriesParam: string): SeriesData | null {
  const puff = parseInt(seriesParam, 10)
  if (!Number.isFinite(puff) || puff <= 0) return null
  const inCat = allProducts.filter(p => p.category === slug && p.brand && p.brand !== 'OTHER')
  const brand = [...new Set(inCat.map(p => p.brand))].find(b => brandSlug(b) === brandParam)
  if (!brand) return null
  const brandProducts = inCat.filter(p => p.brand === brand)
  const list = brandProducts
    .filter(p => p.puffCount === puff)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
  if (!list.length) return null
  const minPrice = Math.min(...list.map(p => p.price))
  const otherMap = new Map<number, number>()
  for (const p of brandProducts) if (p.puffCount && p.puffCount !== puff) otherMap.set(p.puffCount, (otherMap.get(p.puffCount) ?? 0) + 1)
  const otherSeries = [...otherMap.entries()].map(([puff, count]) => ({ puff, count })).sort((a, b) => b.puff - a.puff)
  return { brand, puff, list, count: list.length, minPrice, otherSeries }
}

/** Filter → sort → paginate a collection, returning the page slice + facets. */
export function queryCollection(slug: string, params: CollectionParams): CollectionResult {
  const base = allProducts.filter(p => p.category === slug)

  // Facets from the full collection so options stay stable as filters change.
  const brandCounts = new Map<string, number>()
  let lo = Infinity
  let hi = 0
  for (const p of base) {
    brandCounts.set(p.brand, (brandCounts.get(p.brand) ?? 0) + 1)
    if (p.price < lo) lo = p.price
    if (p.price > hi) hi = p.price
  }
  const priceBounds = {
    min: Number.isFinite(lo) ? Math.floor(lo) : 0,
    max: hi > 0 ? Math.ceil(hi) : 100,
  }
  const brands: BrandFacet[] = [...brandCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))

  // Apply selections.
  let filtered = base
  if (params.brands.length) {
    const set = new Set(params.brands.map(b => b.toUpperCase()))
    filtered = filtered.filter(p => set.has(p.brand.toUpperCase()))
  }
  if (params.status === 'in_stock') filtered = filtered.filter(p => p.inStock)
  if (params.minPrice != null) filtered = filtered.filter(p => p.price >= params.minPrice!)
  if (params.maxPrice != null) filtered = filtered.filter(p => p.price <= params.maxPrice!)

  const sorted = sortProducts(filtered, params.sort)

  const total = sorted.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const page = Math.min(params.page, totalPages)
  const start = (page - 1) * PAGE_SIZE
  const items = sorted.slice(start, start + PAGE_SIZE)

  return { items, total, totalPages, page, brands, priceBounds }
}
