import { NextRequest } from 'next/server'
import { products } from '@/data/products'
import { ok } from '@/lib/api/response'

// GET /api/products/resolve?ids=a,b,c — returns the local catalogue Product
// objects for the given ids. Lets client code (e.g. wishlist sync) hydrate a few
// products without bundling the whole ~1.4 MB catalogue into the browser.
export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('ids') ?? ''
  const ids = new Set(raw.split(',').map(s => s.trim()).filter(Boolean))
  if (!ids.size) return ok({ products: [] })
  const found = products.filter(p => ids.has(p.id)).slice(0, 100)
  return ok({ products: found })
}
