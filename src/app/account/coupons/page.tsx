import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { CopyButton } from '@/components/account/copy-button'
import { Ticket } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Discount Coupons' }

type Coupon = {
  id: string
  code: string
  type: 'percent' | 'fixed'
  value: number
  min_order_value: number
  max_uses: number | null
  uses_count: number
  expires_at: string | null
  is_active: boolean
}

function couponStatus(c: Coupon): { label: string; cls: string } {
  const expired = c.expires_at != null && new Date(c.expires_at).getTime() < Date.now()
  const used = c.max_uses != null && c.uses_count >= c.max_uses
  if (!c.is_active) return { label: 'inactive', cls: 'bg-gray-100 text-gray-500' }
  if (expired) return { label: 'expired', cls: 'bg-red-50 text-red-600' }
  if (used) return { label: 'used', cls: 'bg-gray-100 text-gray-500' }
  return { label: 'active', cls: 'bg-green-50 text-green-700' }
}

export default async function CouponsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const { data } = await db
    .from('coupons')
    .select('id, code, type, value, min_order_value, max_uses, uses_count, expires_at, is_active')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const coupons = (data ?? []) as Coupon[]

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Discount Coupons</h1>

      {coupons.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-20 text-center">
          <Ticket className="mb-3 h-10 w-10 text-gray-300" />
          <p className="font-medium text-gray-700">No coupons yet</p>
          <p className="mt-1 text-sm text-gray-400">Discount codes issued to you will appear here.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">Discount</th>
                  <th className="px-4 py-3 font-medium">Min. Order</th>
                  <th className="px-4 py-3 font-medium">Expires</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {coupons.map(c => {
                  const status = couponStatus(c)
                  const discount = c.type === 'percent' ? `${c.value}% off` : `${formatPrice(c.value)} off`
                  return (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3"><span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs font-semibold text-gray-800">{c.code}</span></td>
                      <td className="px-4 py-3 font-medium text-gray-900">{discount}</td>
                      <td className="px-4 py-3 text-gray-600">{c.min_order_value > 0 ? formatPrice(c.min_order_value) : '—'}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {c.expires_at ? new Date(c.expires_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No expiry'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${status.cls}`}>{status.label}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <CopyButton value={c.code} label="Copy Code" />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
