import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { ok, err, zodErr } from '@/lib/api/response'

const Body = z.object({
  code: z.string().min(1),
  subtotal: z.coerce.number().nonnegative().default(0),
})

// POST /api/coupons/validate — checks a code and returns the discount amount.
export async function POST(req: NextRequest) {
  const parsed = Body.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return zodErr(parsed.error)
  const { code, subtotal } = parsed.data

  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: coupon } = await (supabase as any)
    .from('coupons')
    .select('code, type, value, min_order_value, max_uses, uses_count, expires_at, is_active')
    .eq('code', code.trim().toUpperCase())
    .maybeSingle()

  if (!coupon || !coupon.is_active) return err('Invalid coupon code.', 404)
  if (coupon.expires_at && new Date(coupon.expires_at).getTime() < Date.now()) return err('This coupon has expired.')
  if (coupon.max_uses != null && coupon.uses_count >= coupon.max_uses) return err('This coupon has been fully redeemed.')
  if (subtotal < coupon.min_order_value) {
    return err(`Minimum spend of $${coupon.min_order_value.toFixed(2)} required for this coupon.`)
  }

  const raw = coupon.type === 'percent' ? (subtotal * coupon.value) / 100 : coupon.value
  const discount = Math.min(Math.round(raw * 100) / 100, subtotal)

  return ok({
    valid: true,
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    discount,
    minOrderValue: coupon.min_order_value,
  })
}
