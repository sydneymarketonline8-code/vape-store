import { NextRequest, NextResponse } from 'next/server'
import { parseSearchParams, matchCategory } from '@/lib/search'
import { searchProducts } from '@/lib/search-query'

/**
 * Product search / autocomplete. Runs over the local JSON catalogue (the
 * storefront's source of truth). When products move to Supabase, swap
 * searchProducts() for a `.textSearch('fts', q, { type: 'websearch' })` query.
 *
 * Params: q, limit (default 6), page, category, sort, minPrice, maxPrice, status.
 * Returns: { products, totalCount, query, categoryMatch }
 *
 * (Search analytics are logged from the /search page, not here, to avoid
 * flooding search_logs on every autocomplete keystroke.)
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const params = parseSearchParams(Object.fromEntries(sp.entries()))
  const limit = Math.min(Math.max(Number(sp.get('limit')) || 6, 1), 48)

  const { items, total } = searchProducts(params, limit)

  const products = items.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku ?? p.id,
    price: p.price,
    compareAtPrice: p.originalPrice ?? null,
    status: p.inStock ? 'active' : 'sold_out',
    image: p.image,
    images: [{ url: p.image, is_primary: true }],
  }))

  return NextResponse.json({
    products,
    totalCount: total,
    query: params.q,
    categoryMatch: params.q ? matchCategory(params.q) : null,
  })
}
