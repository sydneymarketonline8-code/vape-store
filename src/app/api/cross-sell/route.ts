import { NextResponse } from 'next/server'
import { products } from '@/data/products'

/**
 * Cross-sell suggestions for the cart drawer. Returns popular in-stock products
 * (full objects, so the client can add them straight to the cart). Reads the
 * local catalogue server-side, keeping the products JSON out of the client bundle.
 */
const popularity = (p: (typeof products)[number]) => (p.featured ? 1_000_000 : 0) + (p.reviewCount ?? 0)

export function GET() {
  const top = products
    .filter(p => p.inStock)
    .sort((a, b) => popularity(b) - popularity(a))
    .slice(0, 12)

  return NextResponse.json(
    { products: top },
    { headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=600' } },
  )
}
