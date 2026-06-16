import { NextRequest, NextResponse } from 'next/server'
import { products } from '@/data/products'

/**
 * Autocomplete search. Products currently live in local JSON, so this filters
 * that in-memory. When products move to Supabase, swap the body for a full-text
 * query against the products.fts tsvector column (added in 001_init.sql):
 *
 *   const { data } = await supabase
 *     .from('products')
 *     .select('id, slug, name, price, image')
 *     .textSearch('fts', q, { type: 'websearch' })
 *     .limit(limit)
 */
export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get('q') ?? '').trim().toLowerCase()
  const limit = Math.min(Math.max(Number(req.nextUrl.searchParams.get('limit')) || 6, 1), 24)

  if (q.length < 2) return NextResponse.json({ products: [] })

  const matches = products
    .filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
    )
    .slice(0, limit)
    .map(p => ({ id: p.id, slug: p.slug, name: p.name, price: p.price, image: p.image }))

  return NextResponse.json({ products: matches })
}
