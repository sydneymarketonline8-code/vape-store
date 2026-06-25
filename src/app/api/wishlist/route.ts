import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { ok, err, zodErr, unauthorized } from '@/lib/api/response'

// GET /api/wishlist — the signed-in user's saved product ids.
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return unauthorized()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('wishlist_items')
    .select('product_id, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  if (error) return err(error.message, 500)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ok({ items: data ?? [], productIds: (data ?? []).map((r: any) => r.product_id) })
}

const Body = z.object({ productId: z.string().min(1) })

// POST /api/wishlist — add a product.
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return unauthorized()

  const parsed = Body.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return zodErr(parsed.error)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('wishlist_items')
    .upsert({ user_id: user.id, product_id: parsed.data.productId }, { onConflict: 'user_id,product_id' })
  if (error) return err(error.message, 400)
  return ok({ added: parsed.data.productId }, { status: 201 })
}

// DELETE /api/wishlist?productId=... — remove a product.
export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return unauthorized()

  const productId = req.nextUrl.searchParams.get('productId') ?? (await req.json().catch(() => ({})))?.productId
  if (!productId) return err('productId is required.')

  const { error } = await supabase
    .from('wishlist_items')
    .delete()
    .eq('user_id', user.id)
    .eq('product_id', productId)
  if (error) return err(error.message, 500)
  return ok({ removed: productId })
}
