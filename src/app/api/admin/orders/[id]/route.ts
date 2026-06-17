import { createClient, isAdmin } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const update: Record<string, any> = {}

  if (body.status) update.status = body.status
  if (body.carrier !== undefined) update.carrier = body.carrier || null
  if (body.trackingNumber !== undefined) {
    update.tracking_number = body.trackingNumber || null
    // Adding tracking marks the order shipped.
    if (body.trackingNumber) update.status = 'shipped'
  }
  if (body.note !== undefined) update.notes = body.note || null
  // No Stripe — a refund is recorded as a status change (settled manually).
  if (body.refund) update.status = 'refunded'

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any
  const { data, error } = await db.from('orders').update(update).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, order: data })
}
