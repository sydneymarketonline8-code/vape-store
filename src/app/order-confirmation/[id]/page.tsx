import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id }   = await params
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  type OrderRow = {
    id: string; status: string; total: number; email: string
    created_at: string; address: unknown
    order_items: { id: string; product_name: string; quantity: number; price: number; selected_flavor?: string }[]
  }

  const { data: order } = await db
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .single() as { data: OrderRow | null }

  if (!order) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
        <p className="text-gray-500">Order not found.</p>
        <Link href="/" className="mt-4 text-sm text-[#1B7A3E] hover:underline">
          Return home
        </Link>
      </div>
    )
  }

  const address = order.address as {
    name?: string; line1?: string; suburb?: string; state?: string; postcode?: string
  } | null

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16">

      {/* Success header */}
      <div className="mb-10 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50 border-2 border-[#1B7A3E]">
            <CheckCircle className="h-10 w-10 text-[#1B7A3E]" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Order Placed!</h1>
        <p className="mt-2 text-gray-500">
          Thanks for your order. We&apos;ll get it on its way shortly.
        </p>
        <p className="mt-1 text-sm text-gray-400">
          Order ID: <span className="font-mono text-gray-600">{id.slice(0, 8).toUpperCase()}</span>
        </p>
      </div>

      {/* Order card */}
      <div className="space-y-5">

        {/* Items */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500">
            <Package className="h-4 w-4" /> Items Ordered
          </h2>
          <div className="divide-y divide-gray-100">
            {(order.order_items as {
              id: string; product_name: string; quantity: number
              price: number; selected_flavor?: string
            }[]).map(item => (
              <div key={item.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                  {item.selected_flavor && (
                    <p className="text-xs text-gray-400">{item.selected_flavor}</p>
                  )}
                  <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-gray-100 pt-4 flex justify-between font-bold text-gray-900">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Shipping + status */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {address && (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                Shipping To
              </h3>
              <p className="text-sm text-gray-800">{address.name}</p>
              <p className="text-sm text-gray-600">{address.line1}</p>
              <p className="text-sm text-gray-600">
                {address.suburb} {address.state} {address.postcode}
              </p>
            </div>
          )}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
              Order Status
            </h3>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-sm font-semibold text-amber-700 capitalize">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              {order.status}
            </span>
            <p className="mt-2 text-xs text-gray-400">
              You&apos;ll receive a confirmation email at{' '}
              <span className="text-gray-600">{order.email}</span>
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/account"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#1B7A3E] py-3 text-sm font-semibold text-[#1B7A3E] hover:bg-green-50 transition-colors"
          >
            View All Orders
          </Link>
          <Link
            href="/products"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1B7A3E] py-3 text-sm font-semibold text-white hover:bg-[#156331] transition-colors"
          >
            Continue Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
