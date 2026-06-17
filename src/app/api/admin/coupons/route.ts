import { createClient, isAdmin } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  const code = (body.code ?? '').trim().toUpperCase()
  const type = body.type === 'fixed' ? 'fixed' : 'percent'
  const value = Number(body.value)

  if (!code) return NextResponse.json({ error: 'Code is required.' }, { status: 400 })
  if (!Number.isFinite(value) || value <= 0) return NextResponse.json({ error: 'Enter a valid value.' }, { status: 400 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any
  const { data, error } = await db
    .from('coupons')
    .insert({
      code,
      type,
      value,
      min_order_value: Number(body.minOrderValue) || 0,
      max_uses: body.maxUses ? Number(body.maxUses) : null,
      expires_at: body.expiresAt || null,
      is_active: body.isActive !== false,
    })
    .select()
    .single()

  if (error) {
    const msg = error.code === '23505' ? 'That code already exists.' : error.message
    return NextResponse.json({ error: msg }, { status: 400 })
  }
  return NextResponse.json({ ok: true, coupon: data }, { status: 201 })
}
