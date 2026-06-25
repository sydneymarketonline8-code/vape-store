import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createClient, isAdmin } from '@/lib/supabase/server'
import { ok, err, zodErr, forbidden } from '@/lib/api/response'

const ListQuery = z.object({
  category: z.string().optional(),
  sort: z.enum(['featured', 'price_asc', 'price_desc', 'newest', 'az', 'za']).default('featured'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(60).default(20),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
})

const SORT: Record<string, { col: string; asc: boolean }> = {
  price_asc: { col: 'price', asc: true },
  price_desc: { col: 'price', asc: false },
  newest: { col: 'created_at', asc: false },
  az: { col: 'name', asc: true },
  za: { col: 'name', asc: false },
  featured: { col: 'featured', asc: false },
}

// GET /api/products — public, filtered/sorted/paginated list.
export async function GET(req: NextRequest) {
  const parsed = ListQuery.safeParse(Object.fromEntries(req.nextUrl.searchParams))
  if (!parsed.success) return zodErr(parsed.error)
  const { category, sort, page, limit, minPrice, maxPrice } = parsed.data

  const supabase = await createClient()
  let q = supabase
    .from('products')
    .select('id, name, slug, brand, category, price, original_price, image, status, inventory_qty', { count: 'exact' })
  if (category) q = q.eq('category', category)
  if (minPrice != null) q = q.gte('price', minPrice)
  if (maxPrice != null) q = q.lte('price', maxPrice)
  const s = SORT[sort]
  q = q.order(s.col, { ascending: s.asc }).range((page - 1) * limit, page * limit - 1)

  const { data, count, error } = await q
  if (error) return err(error.message, 500)
  return ok(
    { products: data ?? [], total: count ?? 0, page, totalPages: Math.max(1, Math.ceil((count ?? 0) / limit)) },
    { headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' } }
  )
}

const ProductInput = z.object({
  id: z.string().min(1).optional(),
  slug: z.string().min(1),
  name: z.string().min(1),
  brand: z.string().optional(),
  category: z.enum(['disposables', 'mods', 'e-liquids', 'pouches', 'accessories']),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.number().nonnegative(),
  originalPrice: z.number().nonnegative().nullish(),
  costPrice: z.number().nonnegative().nullish(),
  sku: z.string().nullish(),
  inventoryQty: z.number().int().min(0).default(0),
  status: z.enum(['active', 'draft', 'pre_order', 'sold_out']).default('active'),
  image: z.string().optional(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
})

// POST /api/products — admin: create a product.
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return forbidden()

  const body = await req.json().catch(() => null)
  const parsed = ProductInput.safeParse(body)
  if (!parsed.success) return zodErr(parsed.error)
  const p = parsed.data

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('products')
    .insert({
      id: p.id ?? p.slug,
      slug: p.slug,
      name: p.name,
      brand: p.brand ?? '',
      category: p.category,
      description: p.description ?? '',
      short_description: p.shortDescription ?? '',
      price: p.price,
      original_price: p.originalPrice ?? null,
      cost_price: p.costPrice ?? null,
      sku: p.sku ?? null,
      inventory_qty: p.inventoryQty,
      status: p.status,
      image: p.image ?? '',
      tags: p.tags,
      featured: p.featured,
    })
    .select()
    .single()
  if (error) return err(error.code === '23505' ? 'A product with that slug/SKU already exists.' : error.message, 400)
  return ok({ product: data }, { status: 201 })
}
