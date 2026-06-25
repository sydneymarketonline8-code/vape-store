import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createClient, isAdmin } from '@/lib/supabase/server'
import { ok, err, zodErr, unauthorized, forbidden, notFound } from '@/lib/api/response'

// GET /api/orders/[id] — order detail. RLS returns it only to the owner or an
// admin; otherwise it 404s (also avoids leaking existence).
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return unauthorized()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .maybeSingle()
  if (error) return err(error.message, 500)
  if (!data) return notFound('Order')
  return ok({ order: data })
}

const Patch = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).optional(),
  trackingNumber: z.string().nullish(),
  carrier: z.string().nullish(),
  note: z.string().nullish(),
})

// PATCH /api/orders/[id] — admin: update status / add tracking / add a note.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return forbidden()

  const parsed = Patch.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return zodErr(parsed.error)
  const b = parsed.data

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const update: Record<string, any> = {}
  if (b.status) update.status = b.status
  if (b.carrier !== undefined) update.carrier = b.carrier || null
  if (b.trackingNumber !== undefined) {
    update.tracking_number = b.trackingNumber || null
    if (b.trackingNumber) update.status = 'shipped'
  }
  if (b.note !== undefined) update.notes = b.note || null
  if (Object.keys(update).length === 0) return err('No fields to update.')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).from('orders').update(update).eq('id', id).select().single()
  if (error) return err(error.message, 400)
  return ok({ order: data })
}
