import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { CreateCouponButton } from '@/components/admin/create-coupon-button'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Coupons' }

type Coupon = {
  id: string; code: string; type: 'percent' | 'fixed'; value: number
  min_order_value: number; max_uses: number | null; uses_count: number
  expires_at: string | null; is_active: boolean
}

export default async function AdminCouponsPage() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any
  const { data } = await db.from('coupons').select('*').order('created_at', { ascending: false })
  const coupons = (data ?? []) as Coupon[]
  const now = new Date().getTime()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Coupons</h1>
        <CreateCouponButton />
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        {coupons.length === 0 ? (
          <p className="p-8 text-center text-sm text-neutral-400">No coupons yet. Create your first one.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-neutral-100 bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
                <tr><th className="px-5 py-3 font-medium">Code</th><th className="px-5 py-3 font-medium">Type</th><th className="px-5 py-3 font-medium">Value</th><th className="px-5 py-3 font-medium">Min Order</th><th className="px-5 py-3 font-medium">Uses</th><th className="px-5 py-3 font-medium">Expires</th><th className="px-5 py-3 font-medium">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {coupons.map(c => {
                  const expired = c.expires_at != null && new Date(c.expires_at).getTime() < now
                  const active = c.is_active && !expired
                  return (
                    <tr key={c.id} className="hover:bg-neutral-50">
                      <td className="px-5 py-3"><span className="rounded bg-neutral-100 px-2 py-1 font-mono text-xs font-semibold text-neutral-800">{c.code}</span></td>
                      <td className="px-5 py-3 capitalize text-neutral-600">{c.type}</td>
                      <td className="px-5 py-3 font-medium text-neutral-900">{c.type === 'percent' ? `${c.value}%` : formatPrice(c.value)}</td>
                      <td className="px-5 py-3 text-neutral-600">{c.min_order_value > 0 ? formatPrice(c.min_order_value) : '—'}</td>
                      <td className="px-5 py-3 text-neutral-600">{c.uses_count}{c.max_uses != null ? ` / ${c.max_uses}` : ''}</td>
                      <td className="px-5 py-3 text-neutral-600">{c.expires_at ? new Date(c.expires_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No expiry'}</td>
                      <td className="px-5 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${active ? 'bg-green-50 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>
                          {expired ? 'expired' : c.is_active ? 'active' : 'inactive'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
