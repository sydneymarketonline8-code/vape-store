import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ChevronLeft, Check, Truck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { products } from '@/data/products'
import { OrderStatusBadge } from '@/components/account/order-status-badge'
import { ReorderButton } from '@/components/account/reorder-button'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Order Details' }

const TIMELINE = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'] as const

// Best-effort carrier tracking URL.
function trackingUrl(carrier: string | null | undefined, tn: string): string | null {
  const c = (carrier ?? '').toLowerCase()
  if (c.includes('auspost') || c.includes('australia post')) return `https://auspost.com.au/mypost/track/#/details/${tn}`
  if (c.includes('startrack')) return `https://startrack.com.au/track/details/${tn}`
  if (c.includes('aramex') || c.includes('fastway')) return `https://www.aramex.com.au/tools/track?l=${tn}`
  return null
}

type OrderItem = {
  id: string
  product_id: string | null
  product_name: string
  product_image?: string | null
  quantity: number
  price: number
  selected_flavor?: string | null
  selected_nicotine?: number | null
}
type Order = {
  id: string
  order_number?: string | null
  status: string
  total: number
  created_at: string
  address: Record<string, unknown> | null
  subtotal?: number | null
  shipping_amount?: number | null
  discount_amount?: number | null
  tracking_number?: string | null
  carrier?: string | null
  order_items: OrderItem[]
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const { data: order } = (await db
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .maybeSingle()) as { data: Order | null }

  if (!order) notFound()

  const ref = order.order_number ?? order.id.slice(0, 8).toUpperCase()
  const statusLc = order.status?.toLowerCase()
  const cancelled = statusLc === 'cancelled' || statusLc === 'refunded'
  const currentStep = TIMELINE.indexOf(statusLc as (typeof TIMELINE)[number])

  const address = order.address as {
    name?: string; line1?: string; suburb?: string; state?: string; postcode?: string; phone?: string
  } | null

  const itemsSubtotal = order.order_items.reduce((s, i) => s + i.price * i.quantity, 0)
  const discount = order.discount_amount ?? 0
  const shipping = order.shipping_amount ?? Math.max(0, order.total - itemsSubtotal + discount)
  const trackUrl = order.tracking_number ? trackingUrl(order.carrier, order.tracking_number) : null

  return (
    <div>
      <Link href="/account/orders" className="mb-5 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary">
        <ChevronLeft className="h-4 w-4" /> Back to Orders
      </Link>

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order {ref}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Placed {new Date(order.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          <ReorderButton
            items={order.order_items
              .map(i => {
                const product = i.product_id ? products.find(p => p.id === i.product_id) : undefined
                return product
                  ? {
                      product,
                      quantity: i.quantity,
                      flavor: i.selected_flavor,
                      nicotine: i.selected_nicotine,
                    }
                  : null
              })
              .filter((l): l is NonNullable<typeof l> => l !== null)}
          />
        </div>
      </div>

      {/* Timeline */}
      {!cancelled && (
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center">
            {TIMELINE.map((step, i) => {
              const done = i <= currentStep
              return (
                <div key={step} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      done ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {done ? <Check className="h-4 w-4" /> : i + 1}
                    </span>
                    <span className={`mt-1.5 text-xs capitalize ${done ? 'font-medium text-gray-700' : 'text-gray-400'}`}>
                      {step}
                    </span>
                  </div>
                  {i < TIMELINE.length - 1 && (
                    <div className={`mx-1 h-0.5 flex-1 ${i < currentStep ? 'bg-primary' : 'bg-gray-100'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tracking */}
      {order.tracking_number && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-5">
          <div className="flex items-center gap-3 text-sm">
            <Truck className="h-5 w-5 text-sky-600" />
            <div>
              <p className="font-semibold text-gray-900">
                {order.carrier || 'Carrier'} · {order.tracking_number}
              </p>
              <p className="text-xs text-gray-500">Your order is on its way.</p>
            </div>
          </div>
          {trackUrl && (
            <a href={trackUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700">
              Track Shipment
            </a>
          )}
        </div>
      )}

      {/* Items */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-500">Items</h2>
        <div className="divide-y divide-gray-100">
          {order.order_items.map(item => {
            const img = item.product_image || products.find(p => p.id === item.product_id)?.image
            return (
              <div key={item.id} className="flex items-center gap-4 py-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                  {img && <Image src={img} alt={item.product_name} fill sizes="56px" className="object-contain p-1" unoptimized />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                  {item.selected_flavor && <p className="text-xs text-gray-400">{item.selected_flavor}</p>}
                  <p className="text-xs text-gray-400">
                    {formatPrice(item.price)} × {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Address + totals */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {address && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">Shipping Address</h3>
            <p className="text-sm text-gray-800">{address.name}</p>
            <p className="text-sm text-gray-600">{address.line1}</p>
            <p className="text-sm text-gray-600">{address.suburb} {address.state} {address.postcode}</p>
            {address.phone && <p className="mt-1 text-sm text-gray-500">{address.phone}</p>}
          </div>
        )}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">Order Total</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-500"><dt>Subtotal</dt><dd className="text-gray-900">{formatPrice(itemsSubtotal)}</dd></div>
            <div className="flex justify-between text-gray-500"><dt>Shipping</dt><dd className={shipping === 0 ? 'font-medium text-primary' : 'text-gray-900'}>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd></div>
            {discount > 0 && <div className="flex justify-between text-gray-500"><dt>Discount</dt><dd className="text-red-600">−{formatPrice(discount)}</dd></div>}
            <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold text-gray-900"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
          </dl>
        </div>
      </div>
    </div>
  )
}
