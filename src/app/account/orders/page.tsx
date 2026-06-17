import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { OrderStatusBadge } from '@/components/account/order-status-badge'
import { Package, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Orders' }

const PAGE_SIZE = 10

type OrderRow = {
  id: string
  order_number?: string | null
  status: string
  total: number
  created_at: string
  order_items: { quantity: number }[]
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data, count } = await db
    .from('orders')
    .select('id, order_number, status, total, created_at, order_items(quantity)', { count: 'exact' })
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .range(from, to)

  const orders = (data ?? []) as OrderRow[]
  const total = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">My Orders</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-20 text-center">
          <Package className="mb-3 h-10 w-10 text-gray-300" />
          <p className="font-medium text-gray-700">No orders yet</p>
          <p className="mt-1 text-sm text-gray-400">When you place an order it will appear here.</p>
          <Link href="/products" className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Order #</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Items</th>
                    <th className="px-4 py-3 font-medium">Total</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map(o => {
                    const itemCount = o.order_items?.reduce((n, i) => n + i.quantity, 0) ?? 0
                    const ref = o.order_number ?? o.id.slice(0, 8).toUpperCase()
                    return (
                      <tr key={o.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-gray-900">{ref}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {new Date(o.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-3"><OrderStatusBadge status={o.status} /></td>
                        <td className="px-4 py-3 text-gray-600">{itemCount}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900">{formatPrice(o.total)}</td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/account/orders/${o.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-primary hover:text-primary"
                          >
                            <Eye className="h-3.5 w-3.5" /> View Details
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="mt-5 flex items-center justify-center gap-1.5">
              {page > 1 ? (
                <Link href={`/account/orders?page=${page - 1}`} className="flex h-9 items-center rounded-lg border border-gray-200 px-3 text-sm text-gray-600 hover:border-gray-300">
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              ) : (
                <span className="flex h-9 items-center rounded-lg border border-gray-100 px-3 text-gray-300"><ChevronLeft className="h-4 w-4" /></span>
              )}
              <span className="px-2 text-sm text-gray-500">Page {page} of {totalPages}</span>
              {page < totalPages ? (
                <Link href={`/account/orders?page=${page + 1}`} className="flex h-9 items-center rounded-lg border border-gray-200 px-3 text-sm text-gray-600 hover:border-gray-300">
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <span className="flex h-9 items-center rounded-lg border border-gray-100 px-3 text-gray-300"><ChevronRight className="h-4 w-4" /></span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
