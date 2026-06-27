import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * GET /api/review-stats → aggregate of APPROVED customer reviews, keyed by
 * product id: { stats: { [productId]: { rating, count } } }.
 *
 * Powers honest star ratings on product cards — only products with genuine
 * approved reviews appear here; everything else shows no rating (never the
 * scraped catalogue numbers).
 */
export async function GET() {
  try {
    const supabase = await createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any
    const { data, error } = await db
      .from('reviews')
      .select('product_id, rating')
      .eq('status', 'approved')
    if (error) throw error

    const acc: Record<string, { sum: number; count: number }> = {}
    for (const r of (data ?? []) as { product_id: string; rating: number }[]) {
      const a = acc[r.product_id] ?? (acc[r.product_id] = { sum: 0, count: 0 })
      a.sum += r.rating
      a.count += 1
    }
    const stats: Record<string, { rating: number; count: number }> = {}
    for (const [id, { sum, count }] of Object.entries(acc)) {
      stats[id] = { rating: Math.round((sum / count) * 10) / 10, count }
    }
    return NextResponse.json(
      { stats },
      { headers: { 'Cache-Control': 'public, max-age=120, stale-while-revalidate=600' } },
    )
  } catch {
    // Table missing / DB unreachable → empty (cards simply show no rating).
    return NextResponse.json({ stats: {} })
  }
}
