'use client'

import Link from 'next/link'
import { ChevronLeft, Lock } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'

export default function CheckoutPage() {
  const { items } = useCartStore()
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = subtotal >= 50 ? 0 : 9.99
  const total = subtotal + shipping

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mb-8"
      >
        <ChevronLeft className="h-4 w-4" />
        Continue Shopping
      </Link>

      <h1 className="text-2xl font-bold text-white mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="font-semibold text-white mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">First Name</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Email</label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Address</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm text-zinc-400 mb-1.5">City</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">ZIP</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="font-semibold text-white mb-4">Payment</h2>
            <div className="rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-center">
              <p className="text-sm text-zinc-500">
                Stripe payment integration — connect your Stripe keys in{' '}
                <code className="text-violet-400">.env.local</code> to enable live payments.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 sticky top-24">
            <h2 className="font-semibold text-white mb-4">Order Summary</h2>
            {items.length === 0 ? (
              <p className="text-zinc-500 text-sm">Your cart is empty.</p>
            ) : (
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div
                    key={item.product.id}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-zinc-400 truncate pr-2">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="text-white whitespace-nowrap">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="border-t border-zinc-800 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Subtotal</span>
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Shipping</span>
                <span className="text-white">
                  {shipping === 0 ? 'Free' : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-zinc-800">
                <span className="text-white">Total</span>
                <span className="text-white">{formatPrice(total)}</span>
              </div>
            </div>
            <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 font-semibold text-white hover:bg-violet-500 transition-colors">
              <Lock className="h-4 w-4" />
              Place Order
            </button>
            <p className="mt-3 text-center text-xs text-zinc-600">
              Secured by Stripe. Your data is protected.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
