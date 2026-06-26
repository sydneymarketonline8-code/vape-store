// Client-safe params + URL helpers for the /products browse page. No catalogue
// import here, so client components can build hrefs without bundling the JSON.
// Query execution lives in '@/lib/products-query' (server-only).

export const PRODUCTS_PAGE_SIZE = 24

export type ProductsSort = 'featured' | 'new' | 'price-asc' | 'price-desc' | 'rating'

export interface ProductsQuery {
  category: string // 'all' or a category slug
  brands: string[] // brand names (as displayed/stored)
  tag: string
  sale: boolean
  packs: boolean
  inStock: boolean
  maxPrice: number // 0..400 (400 = slider max)
  pack: number | null // pack size, e.g. 3/5/10/20 (matches "N PACK" in the name)
  puffs: number | null // exact puff count, e.g. 15000
  search: string
  sort: ProductsSort
  page: number
}

export const TAG_LABELS: Record<string, string> = {
  'nicotine-free': 'Nicotine-Free Vapes',
  'lower-nicotine': 'Lower Nicotine Vapes',
}

const SORTS: ProductsSort[] = ['featured', 'new', 'price-asc', 'price-desc', 'rating']
type Raw = Record<string, string | string[] | undefined>

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v
}

export function parseProductsQuery(raw: Raw): ProductsQuery {
  // Accept both `brands` (comma list) and legacy single `brand` (incoming links).
  const brandRaw = raw.brands ?? raw.brand
  const brands = (Array.isArray(brandRaw) ? brandRaw : brandRaw ? [brandRaw] : [])
    .flatMap(b => b.split(','))
    .map(b => b.trim())
    .filter(Boolean)

  const sortRaw = first(raw.sort) as ProductsSort | undefined
  const sort = sortRaw && SORTS.includes(sortRaw) ? sortRaw : 'featured'

  const pageNum = Number(first(raw.page))
  const maxNum = Number(first(raw.maxPrice))
  const packNum = Number(first(raw.pack))
  const puffsNum = Number(first(raw.puffs))

  return {
    category: first(raw.category) || 'all',
    brands,
    tag: first(raw.tag) ?? '',
    sale: first(raw.sale) === 'true',
    packs: first(raw.packs) === 'true',
    inStock: first(raw.status) === 'in_stock',
    maxPrice: Number.isFinite(maxNum) && maxNum >= 0 && maxNum <= 400 ? maxNum : 400,
    pack: Number.isFinite(packNum) && packNum > 1 ? Math.floor(packNum) : null,
    puffs: Number.isFinite(puffsNum) && puffsNum > 0 ? Math.floor(puffsNum) : null,
    search: (first(raw.q) ?? '').trim(),
    sort,
    page: Number.isFinite(pageNum) && pageNum > 0 ? Math.floor(pageNum) : 1,
  }
}

/** Serialize a query back to /products?… omitting defaults for clean URLs. */
export function buildProductsHref(q: Partial<ProductsQuery>): string {
  const p = new URLSearchParams()
  if (q.category && q.category !== 'all') p.set('category', q.category)
  if (q.brands && q.brands.length) p.set('brands', q.brands.join(','))
  if (q.tag) p.set('tag', q.tag)
  if (q.sale) p.set('sale', 'true')
  if (q.packs) p.set('packs', 'true')
  if (q.inStock) p.set('status', 'in_stock')
  if (q.pack) p.set('pack', String(q.pack))
  if (q.puffs) p.set('puffs', String(q.puffs))
  if (q.maxPrice != null && q.maxPrice < 400) p.set('maxPrice', String(q.maxPrice))
  if (q.search) p.set('q', q.search)
  if (q.sort && q.sort !== 'featured') p.set('sort', q.sort)
  if (q.page && q.page > 1) p.set('page', String(q.page))
  const s = p.toString()
  return `/products${s ? `?${s}` : ''}`
}

export function productsHeading(q: ProductsQuery): string {
  if (q.pack) return `${q.pack}-Pack Vape Deals`
  if (q.puffs) {
    const p = `${q.puffs.toLocaleString()}-Puff`
    return q.brands.length === 1 ? `${q.brands[0]} ${p} Vapes` : `${p} Vapes`
  }
  if (q.brands.length === 1) return q.brands[0]
  if (q.tag && TAG_LABELS[q.tag]) return TAG_LABELS[q.tag]
  if (q.sale) return 'Sale & Clearance'
  if (q.packs) return 'Bulk Vape Packs'
  switch (q.category) {
    case 'all': return 'All Products'
    case 'e-liquids': return 'E-Liquids & Salts'
    case 'mods': return 'Pod Systems & Kits'
    case 'pouches': return 'Nicotine Pouches'
    case 'disposables': return 'Disposable Vapes'
    case 'accessories': return 'Accessories'
    default: return q.category.charAt(0).toUpperCase() + q.category.slice(1)
  }
}
