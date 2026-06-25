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
