import 'server-only'
import { products as allProducts } from '@/data/products'
import type { Product } from '@/types'
import { PRODUCTS_PAGE_SIZE, type ProductsQuery } from '@/lib/products-params'

// Server-only filtering/sort/pagination for /products over the local catalogue.

export interface ProductsResult {
  items: Product[]
  total: number
  totalPages: number
  page: number
}

export function queryAllProducts(q: ProductsQuery): ProductsResult {
  let r = allProducts
  if (q.category !== 'all') r = r.filter(p => p.category === q.category)
  if (q.brands.length) {
    const set = new Set(q.brands.map(b => b.toUpperCase()))
    r = r.filter(p => set.has(p.brand.toUpperCase()))
  }
  if (q.tag) r = r.filter(p => p.tags.includes(q.tag))
  if (q.sale) r = r.filter(p => p.originalPrice != null)
  if (q.packs) r = r.filter(p => p.tags.includes('bundle'))
  if (q.inStock) r = r.filter(p => p.inStock)
  r = r.filter(p => p.price <= q.maxPrice)
  if (q.search) {
    const s = q.search.toLowerCase()
    r = r.filter(
      p =>
        p.name.toLowerCase().includes(s) ||
        p.brand.toLowerCase().includes(s) ||
        p.tags.some(t => t.includes(s))
    )
  }

  const sorted = [...r]
  switch (q.sort) {
    // No created_at in local data — id descending is a reasonable "newest" proxy.
    case 'new': sorted.sort((a, b) => Number(b.id) - Number(a.id)); break
    case 'price-asc': sorted.sort((a, b) => a.price - b.price); break
    case 'price-desc': sorted.sort((a, b) => b.price - a.price); break
    case 'rating': sorted.sort((a, b) => b.rating - a.rating); break
    default: sorted.sort((a, b) => Number(b.featured) - Number(a.featured)); break
  }

  const total = sorted.length
  const totalPages = Math.max(1, Math.ceil(total / PRODUCTS_PAGE_SIZE))
  const page = Math.min(Math.max(1, q.page), totalPages)
  const start = (page - 1) * PRODUCTS_PAGE_SIZE
  return { items: sorted.slice(start, start + PRODUCTS_PAGE_SIZE), total, totalPages, page }
}
