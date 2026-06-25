import { createClient, isAdmin } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

// Upsert a product into Supabase. NOTE: the storefront currently reads products
// from local JSON, so saved changes won't appear there until the catalogue is
// migrated to the products table. This makes the admin editor forward-ready.
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const b = await request.json().catch(() => ({}))
  const slug = (b.slug ?? '').toString().trim()
  const id = (b.id ?? slug).toString().trim()
  const name = (b.name ?? '').toString().trim()

  if (!name || !slug) {
    return NextResponse.json({ error: 'Name and slug are required.' }, { status: 400 })
  }

  const num = (v: unknown) => (v === '' || v == null || Number.isNaN(Number(v)) ? null : Number(v))

  const row = {
    id,
    slug,
    name,
    brand: (b.brand ?? '').toString(),
    category: b.category || 'disposables',
    description: b.description ?? '',
    short_description: b.shortDescription ?? '',
    price: num(b.price) ?? 0,
    original_price: num(b.compareAtPrice),
    cost_price: num(b.cost),
    sku: b.sku || null,
    inventory_qty: num(b.inventoryQty) ?? 0,
    status: ['active', 'draft', 'pre_order', 'sold_out'].includes(b.status) ? b.status : 'active',
    weight_lbs: num(b.weight),
    length_in: num(b.length),
    width_in: num(b.width),
    height_in: num(b.height),
    featured: !!b.featured,
    tags: Array.isArray(b.tags)
      ? b.tags
      : (b.tags ?? '').toString().split(',').map((t: string) => t.trim()).filter(Boolean),
    specs: b.specs && typeof b.specs === 'object' ? b.specs : {},
    meta_title: b.metaTitle || null,
    meta_description: b.metaDescription || null,
    image: b.image ?? '',
    in_stock: num(b.inventoryQty) == null ? true : Number(b.inventoryQty) > 0,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any
  const { data, error } = await db.from('products').upsert(row).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  // Bust any cached product data so the change shows up (Next 16 requires a
  // cache-life profile as the 2nd arg).
  revalidateTag('products', 'max')
  return NextResponse.json({ ok: true, product: data })
}
