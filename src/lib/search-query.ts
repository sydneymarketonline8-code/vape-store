import 'server-only'
import { products as allProducts } from '@/data/products'
import { PAGE_SIZE, type SortKey } from '@/lib/collections'
import { SEARCH_CATEGORIES, type SearchParams, type SearchResult } from '@/lib/search'
import type { Product } from '@/types'

// Server-only search execution over the local JSON catalogue. Kept out of
// '@/lib/search' so client components can import its constants/helpers without
// pulling the catalogue into the browser bundle.

function matchesQuery(p: Product, terms: string[]): boolean {
  if (!terms.length) return true
  const hay = `${p.name} ${p.brand} ${p.tags.join(' ')} ${p.shortDescription}`.toLowerCase()
  return terms.every(t => hay.includes(t)) // AND across terms (websearch-like)
}

function sortProducts(list: Product[], sort: SortKey): Product[] {
  const r = [...list]
  switch (sort) {
    case 'price_asc': return r.sort((a, b) => a.price - b.price)
    case 'price_desc': return r.sort((a, b) => b.price - a.price)
    case 'best_selling': return r.sort((a, b) => b.reviewCount - a.reviewCount)
    case 'newest': return r.sort((a, b) => Number(b.id) - Number(a.id))
    case 'az': return r.sort((a, b) => a.name.localeCompare(b.name))
    case 'za': return r.sort((a, b) => b.name.localeCompare(a.name))
    default: return r.sort((a, b) => Number(b.featured) - Number(a.featured) || b.reviewCount - a.reviewCount)
  }
}

export function searchProducts(params: SearchParams, pageSize: number = PAGE_SIZE): SearchResult {
  const terms = params.q.toLowerCase().split(/\s+/).filter(Boolean)
  const base = allProducts.filter(p => matchesQuery(p, terms))

  // Category facet + price bounds computed before category/price selection.
  const catCounts = new Map<string, number>()
  let lo = Infinity
  let hi = 0
  for (const p of base) {
    catCounts.set(p.category, (catCounts.get(p.category) ?? 0) + 1)
    if (p.price < lo) lo = p.price
    if (p.price > hi) hi = p.price
  }
  const categories = SEARCH_CATEGORIES.filter(c => catCounts.has(c.slug)).map(c => ({
    ...c,
    count: catCounts.get(c.slug)!,
  }))
  const priceBounds = { min: Number.isFinite(lo) ? Math.floor(lo) : 0, max: hi > 0 ? Math.ceil(hi) : 100 }

  let filtered = base
  if (params.categories.length) {
    const set = new Set(params.categories)
    filtered = filtered.filter(p => set.has(p.category))
  }
  if (params.status === 'in_stock') filtered = filtered.filter(p => p.inStock)
  if (params.minPrice != null) filtered = filtered.filter(p => p.price >= params.minPrice!)
  if (params.maxPrice != null) filtered = filtered.filter(p => p.price <= params.maxPrice!)

  const sorted = sortProducts(filtered, params.sort)
  const total = sorted.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const page = Math.min(params.page, totalPages)
  const start = (page - 1) * pageSize
  return { items: sorted.slice(start, start + pageSize), total, totalPages, page, categories, priceBounds }
}
