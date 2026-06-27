'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Lock, Loader2, AlertCircle, Landmark, Bitcoin, MessageCircle } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { productImage } from '@/lib/product-image'
import { PAYMENT_METHODS, type PaymentMethod } from '@/lib/site'

const AU_STATES = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT']
const MIN_ORDER  = 250
const FREE_SHIP  = 300
const SHIP_COST  = 15

export default function CheckoutPage() {
  const router              = useRouter()
  const { items, clearCart } = useCartStore()
  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const shipping = subtotal >= FREE_SHIP ? 0 : SHIP_COST
  const total    = subtotal + shipping
  const belowMin = subtotal < MIN_ORDER

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', suburb: '', state: 'NSW', postcode: '',
  })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('payid')

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (belowMin) { setError(`Minimum order is ${formatPrice(MIN_ORDER)}.`); return }
    setLoading(true)
    setError('')

    const res = await fetch('/api/orders', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items,
        total,
        email:   form.email,
        paymentMethod,
        address: {
          name:     `${form.firstName} ${form.lastName}`,
          phone:    form.phone,
          line1:    form.address,
          suburb:   form.suburb,
          state:    form.state,
          postcode: form.postcode,
          country:  'AU',
        },
      }),
    })

    const data = await res.json()
    if (!res.ok) { setError(data.error ?? 'Something went wrong.'); setLoading(false); return }

    clearCart()
    router.push(`/order-confirmation/${data.order.id}`)
  }

  const inputCls = 'w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#1B7A3E] focus:outline-none transition-colors'
  const labelCls = 'mb-1.5 block text-sm font-medium text-gray-700'

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/products" className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1B7A3E] transition-colors">
        <ChevronLeft className="h-4 w-4" /> Continue Shopping
      </Link>

      <h1 className="mb-8 text-2xl font-bold text-gray-900">Checkout</h1>

      {/* Minimum order warning */}
      {belowMin && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-500" />
          Minimum order is <strong>{formatPrice(MIN_ORDER)}</strong>. Your cart is{' '}
          <strong>{formatPrice(subtotal)}</strong> — add{' '}
          {formatPrice(MIN_ORDER - subtotal)} more to proceed.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">

          {/* Left — form */}
          <div className="space-y-6 lg:col-span-3">

            {/* Contact */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-base font-bold text-gray-900">Contact Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>First Name *</label>
                    <input required type="text" placeholder="John" value={form.firstName} onChange={set('firstName')} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Last Name *</label>
                    <input required type="text" placeholder="Smith" value={form.lastName} onChange={set('lastName')} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Email *</label>
                  <input required type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input type="tel" placeholder="04XX XXX XXX" value={form.phone} onChange={set('phone')} className={inputCls} />
                </div>
              </div>
            </section>

            {/* Shipping */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-base font-bold text-gray-900">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Street Address *</label>
                  <input required type="text" placeholder="123 Example St" value={form.address} onChange={set('address')} className={inputCls} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className={labelCls}>Suburb *</label>
                    <input required type="text" placeholder="Sydney" value={form.suburb} onChange={set('suburb')} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Postcode *</label>
                    <input required type="text" placeholder="2000" maxLength={4} value={form.postcode} onChange={set('postcode')} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>State *</label>
                  <select aria-label="State" required value={form.state} onChange={set('state')} className={inputCls}>
                    {AU_STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </section>

            {/* Payment method */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-1 text-base font-bold text-gray-900">Payment Method</h2>
              <p className="mb-4 text-sm text-gray-500">
                Choose how you&apos;d like to pay. After you place your order we&apos;ll send the
                payment details over WhatsApp to lock it in.
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {PAYMENT_METHODS.map(m => {
                  const Icon = m.id === 'payid' ? Landmark : Bitcoin
                  const selected = paymentMethod === m.id
                  return (
                    <button
                      key={m.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                        selected
                          ? 'border-[#1B7A3E] bg-green-50 ring-1 ring-[#1B7A3E]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${selected ? 'text-[#1B7A3E]' : 'text-gray-400'}`} />
                      <span>
                        <span className={`block text-sm font-semibold ${selected ? 'text-[#1B7A3E]' : 'text-gray-900'}`}>
                          {m.label}
                        </span>
                        <span className="block text-xs text-gray-500">{m.blurb}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-gray-50 p-3 text-xs text-gray-500">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#1B7A3E]" />
                No card needed. Your order is reserved as <strong>pending</strong>, and we confirm
                payment with you directly on WhatsApp.
              </div>
            </section>

            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>

          {/* Right — order summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-base font-bold text-gray-900">Order Summary</h2>

              {items.length === 0 ? (
                <p className="text-sm text-gray-400">Your cart is empty.</p>
              ) : (
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
                  {items.map(item => (
                    <div key={`${item.product.id}-${item.selectedFlavor}`} className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                        <Image src={productImage(item.product)} alt={item.product.name} fill className="object-contain p-1" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-xs font-medium text-gray-800">{item.product.name}</p>
                        {item.selectedFlavor && <p className="text-xs text-gray-400">{item.selectedFlavor}</p>}
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2 border-t border-gray-100 pt-4">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-[#1B7A3E] font-medium' : 'text-gray-900'}>
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                {subtotal > 0 && subtotal < FREE_SHIP && (
                  <p className="text-xs text-gray-400">
                    Add {formatPrice(FREE_SHIP - subtotal)} more for free shipping
                  </p>
                )}
                <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || belowMin || items.length === 0}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1B7A3E] py-3.5 font-semibold text-white transition-colors hover:bg-[#156331] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                {loading ? 'Placing order…' : 'Place Order'}
              </button>
              <p className="mt-3 text-center text-xs text-gray-400">
                Secured by SSL. Your data is protected.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
