import { createClient } from '@/lib/supabase/server'
import { products } from '@/data/products'
import { NextResponse } from 'next/server'

/**
 * GET /api/reviews/recent → the latest approved customer reviews across the
 * whole store, joined to product name/slug for a homepage social-proof section.
 * Returns an empty list when there are no reviews yet (so nothing fake is shown).
 */
export async function GET() {
  try {
    const supabase = await createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any
    const { data, error } = await db
      .from('reviews')
      .select('id, product_id, reviewer_name, rating, title, body, created_at')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(9)
    if (error) throw error

    const byId = new Map(products.map(p => [p.id, p]))
    const reviews = ((data ?? []) as Array<{
      id: string; product_id: string; reviewer_name: string; rating: number; title: string | null; body: string; created_at: string
    }>)
      .map(r => {
        const p = byId.get(r.product_id)
        if (!p) return null
        return {
          id: r.id,
          rating: r.rating,
          title: r.title,
          body: r.body,
          reviewerName: r.reviewer_name,
          createdAt: r.created_at,
          product: { name: p.name, slug: p.slug, brand: p.brand },
        }
      })
      .filter(Boolean)

    return NextResponse.json(
      { reviews },
      { headers: { 'Cache-Control': 'public, max-age=120, stale-while-revalidate=600' } },
    )
  } catch {
    return NextResponse.json({ reviews: [] })
  }
}
