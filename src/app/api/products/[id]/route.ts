import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createClient, isAdmin } from '@/lib/supabase/server'
import { ok, err, zodErr, forbidden, notFound } from '@/lib/api/response'
import type { Database } from '@/lib/supabase/database.types'

type ProductRow = Database['public']['Tables']['products']['Row']

// GET /api/products/[id] — public. `id` may be a slug or a product id.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .or(`slug.eq.${id},id.eq.${id}`)
    .limit(1)
    .maybeSingle()
  const product = data as ProductRow | null
  if (!product) return notFound('Product')

  return ok({
    product,
    images: product.images?.length ? product.images : product.image ? [product.image] : [],
    variants: { flavors: product.flavors ?? [], nicotineStrengths: product.nicotine_strengths ?? [] },
    rating: { average: product.rating, count: product.review_count },
  })
}

const ProductPatch = z.object({
  slug: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  brand: z.string().optional(),
  category: z.enum(['disposables', 'mods', 'e-liquids', 'pouches', 'accessories']).optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.number().nonnegative().optional(),
  originalPrice: z.number().nonnegative().nullish(),
  costPrice: z.number().nonnegative().nullish(),
  sku: z.string().nullish(),
  inventoryQty: z.number().int().min(0).optional(),
  status: z.enum(['active', 'draft', 'pre_order', 'sold_out']).optional(),
  image: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
})

// PUT /api/products/[id] — admin: update a product (by id).
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return forbidden()

  const parsed = ProductPatch.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return zodErr(parsed.error)
  const b = parsed.data

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const update: Record<string, any> = {}
  if (b.slug !== undefined) update.slug = b.slug
  if (b.name !== undefined) update.name = b.name
  if (b.brand !== undefined) update.brand = b.brand
  if (b.category !== undefined) update.category = b.category
  if (b.description !== undefined) update.description = b.description
  if (b.shortDescription !== undefined) update.short_description = b.shortDescription
  if (b.price !== undefined) update.price = b.price
  if (b.originalPrice !== undefined) update.original_price = b.originalPrice
  if (b.costPrice !== undefined) update.cost_price = b.costPrice
  if (b.sku !== undefined) update.sku = b.sku
  if (b.inventoryQty !== undefined) update.inventory_qty = b.inventoryQty
  if (b.status !== undefined) update.status = b.status
  if (b.image !== undefined) update.image = b.image
  if (b.tags !== undefined) update.tags = b.tags
  if (b.featured !== undefined) update.featured = b.featured

  if (Object.keys(update).length === 0) return err('No fields to update.')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).from('products').update(update).eq('id', id).select().single()
  if (error) return err(error.message, 400)
  if (!data) return notFound('Product')
  return ok({ product: data })
}

// DELETE /api/products/[id] — admin.
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return forbidden()

  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return err(error.message, 500)
  return ok({ deleted: id })
}
