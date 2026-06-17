import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { OrderStatusBadge } from '@/components/account/order-status-badge'
import { Search } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Orders' }

const STATUSES = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const
const PAGE_SIZE = 20

type OrderRow = {
  id: string; order_number: string | null; status: string; total: number
  created_at: string; email: string | null; address: { name?: string } | null
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>
}) {
  const { q = '', status = 'all', page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  let query = db.from('orders').select('id, order_number, status, total, created_at, email, address', { count: 'exact' })
  if (status !== 'all') query = query.eq('status', status)
  if (q.trim()) query = query.or(`order_number.ilike.%${q.trim()}%,email.ilike.%${q.trim()}%`)
  query = query.order('created_at', { ascending: false }).range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  const { data, count } = await query
  const orders = (data ?? []) as OrderRow[]
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE))

  const tabHref = (s: string) => {
    const sp = new URLSearchParams()
    if (q) sp.set('q', q)
    if (s !== 'all') sp.set('status', s)
    return `/admin/orders${sp.toString() ? `?${sp}` : ''}`
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">Orders</h1>

      {/* Search */}
      <form className="mb-4 max-w-md" action="/admin/orders">
        {status !== 'all' && <input type="hidden" name="status" value={status} />}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input name="q" defaultValue={q} placeholder="Search order # or email…"
            className="w-full rounded-lg border border-neutral-300 py-2 pl-10 pr-3 text-sm focus:border-primary focus:outline-none" />
        </div>
      </form>

      {/* Status tabs */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {STATUSES.map(s => (
          <Link key={s} href={tabHref(s)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
              status === s ? 'bg-primary text-white' : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
            }`}>
            {s}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        {orders.length === 0 ? (
          <p className="p-8 text-center text-sm text-neutral-400">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-neutral-100 bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
                <tr><th className="px-5 py-3 font-medium">Order #</th><th className="px-5 py-3 font-medium">Date</th><th className="px-5 py-3 font-medium">Customer</th><th className="px-5 py-3 font-medium">Total</th><th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3" /></tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-neutral-50">
                    <td className="px-5 py-3 font-mono text-neutral-900">
                      <Link href={`/admin/orders/${o.id}`} className="hover:text-primary">{o.order_number ?? o.id.slice(0, 8).toUpperCase()}</Link>
                    </td>
                    <td className="px-5 py-3 text-neutral-500">{new Date(o.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="px-5 py-3 text-neutral-600">{o.address?.name ?? o.email ?? '—'}</td>
                    <td className="px-5 py-3 font-medium text-neutral-900">{formatPrice(o.total)}</td>
                    <td className="px-5 py-3"><OrderStatusBadge status={o.status} /></td>
                    <td className="px-5 py-3 text-right"><Link href={`/admin/orders/${o.id}`} className="text-xs font-medium text-primary hover:underline">View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-1.5 text-sm">
          {Array.from({ length: totalPages }).slice(0, 12).map((_, i) => {
            const sp = new URLSearchParams()
            if (q) sp.set('q', q)
            if (status !== 'all') sp.set('status', status)
            if (i > 0) sp.set('page', String(i + 1))
            return (
              <Link key={i} href={`/admin/orders${sp.toString() ? `?${sp}` : ''}`}
                className={`h-8 w-8 rounded-lg border text-center leading-8 ${page === i + 1 ? 'border-primary bg-primary text-white' : 'border-neutral-200 text-neutral-700 hover:border-neutral-300'}`}>
                {i + 1}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
