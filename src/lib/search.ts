import { COLLECTIONS, SORT_OPTIONS, type SortKey } from '@/lib/collections'
import type { Product } from '@/types'

// Client-safe search metadata + helpers. Query execution lives in
// '@/lib/search-query' (server-only) so this module never bundles the catalogue.

export const POPULAR_SEARCHES = [
  'IGET', 'Disposables', 'Nicotine Pouches', 'Pod Kits', 'HQD', 'Vape Juice',
]

export const SEARCH_CATEGORIES = COLLECTIONS.map(c => ({ slug: c.slug, label: c.name }))

export type SearchStatus = 'all' | 'in_stock'

export interface SearchParams {
  q: string
  page: number
  sort: SortKey
  minPrice: number | null
  maxPrice: number | null
  categories: string[]
  status: SearchStatus
}

export interface SearchResult {
  items: Product[]
  total: number
  totalPages: number
  page: number
  categories: { slug: string; label: string; count: number }[]
  priceBounds: { min: number; max: number }
}

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v
}

export function parseSearchParams(raw: Record<string, string | string[] | undefined>): SearchParams {
  const sortRaw = first(raw.sort) as SortKey | undefined
  const sort = SORT_OPTIONS.some(o => o.value === sortRaw) ? (sortRaw as SortKey) : 'featured'
  const pageNum = Number(first(raw.page))
  const min = Number(first(raw.minPrice))
  const max = Number(first(raw.maxPrice))
  const catsRaw = raw.category ?? raw.categories
  const categories = (Array.isArray(catsRaw) ? catsRaw : catsRaw ? [catsRaw] : [])
    .flatMap(c => c.split(','))
    .map(c => c.trim())
    .filter(Boolean)
  return {
    q: (first(raw.q) ?? '').trim(),
    page: Number.isFinite(pageNum) && pageNum > 0 ? Math.floor(pageNum) : 1,
    sort,
    minPrice: Number.isFinite(min) ? min : null,
    maxPrice: Number.isFinite(max) ? max : null,
    categories,
    status: first(raw.status) === 'in_stock' ? 'in_stock' : 'all',
  }
}

export function buildSearchHref(p: Partial<SearchParams>): string {
  const q = new URLSearchParams()
  if (p.q) q.set('q', p.q)
  if (p.page && p.page > 1) q.set('page', String(p.page))
  if (p.sort && p.sort !== 'featured') q.set('sort', p.sort)
  if (p.status && p.status !== 'all') q.set('status', p.status)
  if (p.categories && p.categories.length) q.set('category', p.categories.join(','))
  if (p.minPrice != null) q.set('minPrice', String(p.minPrice))
  if (p.maxPrice != null) q.set('maxPrice', String(p.maxPrice))
  const s = q.toString()
  return `/search${s ? `?${s}` : ''}`
}

/** If the query matches a category name/slug, return it (for "Search in X"). */
export function matchCategory(q: string): { slug: string; label: string } | null {
  const ql = q.trim().toLowerCase()
  if (ql.length < 2) return null
  const hit = COLLECTIONS.find(
    c => c.name.toLowerCase().includes(ql) || c.slug.includes(ql) || ql.includes(c.slug)
  )
  return hit ? { slug: hit.slug, label: hit.name } : null
}

function levenshtein(a: string, b: string): number {
  const m = a.length
  const n = b.length
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)])
  for (let j = 0; j <= n; j++) d[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      )
    }
  }
  return d[m][n]
}

/** Closest category name to the query, for a "Did you mean…" hint. */
export function didYouMean(q: string): string | null {
  const ql = q.trim().toLowerCase()
  if (ql.length < 3) return null
  let best: string | null = null
  let bestD = Infinity
  for (const c of COLLECTIONS) {
    for (const candidate of [c.name.toLowerCase(), c.slug]) {
      const d = levenshtein(ql, candidate)
      if (d < bestD) {
        bestD = d
        best = c.name
      }
    }
  }
  return bestD > 0 && bestD <= 3 ? best : null
}
