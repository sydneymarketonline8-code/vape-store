import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createClient, isAdmin } from '@/lib/supabase/server'
import { ok, err, zodErr, forbidden } from '@/lib/api/response'

// GET /api/coupons — admin: list all coupons.
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return forbidden()

  const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false })
  if (error) return err(error.message, 500)
  return ok({ coupons: data ?? [] })
}

const CouponInput = z.object({
  code: z.string().min(1),
  type: z.enum(['percent', 'fixed']).default('percent'),
  value: z.number().positive(),
  minOrderValue: z.number().nonnegative().default(0),
  maxUses: z.number().int().positive().nullish(),
  expiresAt: z.string().datetime().nullish(),
  isActive: z.boolean().default(true),
})

// POST /api/coupons — admin: create a coupon.
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return forbidden()

  const parsed = CouponInput.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return zodErr(parsed.error)
  const c = parsed.data

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('coupons')
    .insert({
      code: c.code.trim().toUpperCase(),
      type: c.type,
      value: c.value,
      min_order_value: c.minOrderValue,
      max_uses: c.maxUses ?? null,
      expires_at: c.expiresAt ?? null,
      is_active: c.isActive,
    })
    .select()
    .single()
  if (error) return err(error.code === '23505' ? 'That coupon code already exists.' : error.message, 400)
  return ok({ coupon: data }, { status: 201 })
}
