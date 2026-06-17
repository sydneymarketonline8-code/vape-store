import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { OrderStatusBadge } from '@/components/account/order-status-badge'
import { AdminOrderActions } from '@/components/admin/admin-order-actions'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Order' }

type OrderItem = { id: string; product_name: string; quantity: number; price: number; selected_flavor?: string | null }
type Order = {
  id: string; order_number: string | null; status: string; total: number; email: string | null
  created_at: string; tracking_number: string | null; carrier: string | null; notes: string | null
  address: { name?: string; line1?: string; suburb?: string; state?: string; postcode?: string; phone?: string; paymentMethod?: string } | null
  order_items: OrderItem[]
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any
  const { data: order } = (await db.from('orders').select('*, order_items(*)').eq('id', id).maybeSingle()) as { data: Order | null }
  if (!order) notFound()

  const ref = order.order_number ?? order.id.slice(0, 8).toUpperCase()
  const a = order.address

  return (
    <div>
      <Link href="/admin/orders" className="mb-4 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary">
        <ChevronLeft className="h-4 w-4" /> Back to Orders
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Order {ref}</h1>
          <p className="mt-1 text-sm text-neutral-500">{new Date(order.created_at).toLocaleString('en-AU')}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left: items + customer */}
        <div className="space-y-6">
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-neutral-500">Items</h2>
            <div className="divide-y divide-neutral-100">
              {order.order_items.map(it => (
                <div key={it.id} className="flex items-center justify-between py-2.5 text-sm">
                  <div>
                    <p className="text-neutral-900">{it.product_name}</p>
                    {it.selected_flavor && <p className="text-xs text-neutral-400">{it.selected_flavor}</p>}
                    <p className="text-xs text-neutral-400">{formatPrice(it.price)} × {it.quantity}</p>
                  </div>
                  <span className="font-medium text-neutral-900">{formatPrice(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between border-t border-neutral-100 pt-3 font-bold text-neutral-900">
              <span>Total</span><span>{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-neutral-500">Customer</h3>
              <p className="text-sm text-neutral-800">{a?.name ?? '—'}</p>
              <p className="text-sm text-neutral-600">{order.email}</p>
              {a?.phone && <p className="text-sm text-neutral-600">{a.phone}</p>}
              {a?.paymentMethod && <p className="mt-2 text-xs text-neutral-500">Payment: <span className="font-medium capitalize">{a.paymentMethod}</span></p>}
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-neutral-500">Shipping Address</h3>
              <p className="text-sm text-neutral-600">{a?.line1}</p>
              <p className="text-sm text-neutral-600">{a?.suburb} {a?.state} {a?.postcode}</p>
            </div>
          </div>
        </div>

        {/* Right: actions */}
        <AdminOrderActions
          orderId={order.id}
          initialStatus={order.status}
          initialTracking={order.tracking_number ?? ''}
          initialCarrier={order.carrier ?? ''}
          initialNote={order.notes ?? ''}
        />
      </div>
    </div>
  )
}
