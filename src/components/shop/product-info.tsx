'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ChevronRight, ShoppingCart, Heart, Zap, Minus, Plus,
  Truck, Lock, ShieldCheck, RotateCcw, FileText, Link2, Mail, Check, AlertTriangle,
} from 'lucide-react'
import type { Product } from '@/types'
import { useCartStore } from '@/lib/store'
import { useWishlistStore } from '@/lib/wishlist-store'
import { formatPrice } from '@/lib/utils'
import { StarRating } from './star-rating'

interface Crumb {
  name: string
  href: string
}

export function ProductInfo({
  product,
  rating,
  reviewCount,
  breadcrumbs,
}: {
  product: Product
  rating: number
  reviewCount: number
  breadcrumbs: Crumb[]
}) {
  const router = useRouter()
  const { addItem, setOpen } = useCartStore()
  const { toggle, isWishlisted } = useWishlistStore()
  const wishlisted = isWishlisted(product.id)

  const [flavor, setFlavor] = useState(product.flavors?.[0] ?? '')
  const [nicotine, setNicotine] = useState(product.nicotineStrengths?.[0])
  const [qty, setQty] = useState(1)
  const [copied, setCopied] = useState(false)

  const sku = product.sku ?? product.id
  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0
  const savings = product.originalPrice ? product.originalPrice - product.price : 0

  // Inventory: prefer DB status/qty when present, else the JSON inStock flag.
  const maxQty = product.inventoryQty ?? 99
  const soldOut =
    product.status === 'sold_out' || product.inventoryQty === 0 || (!product.inStock && product.status !== 'pre_order')

  function addToCart() {
    for (let i = 0; i < qty; i++) addItem(product, { flavor: flavor || undefined, nicotine })
  }
  function handleAddToCart() {
    addToCart()
    setOpen(true)
  }
  function handleBuyNow() {
    // No Stripe Checkout Session in this project — use the existing order flow.
    addToCart()
    router.push('/checkout')
  }
  function scrollToReviews() {
    window.location.hash = 'reviews'
  }
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-400">
          {breadcrumbs.map((c, i) => (
            <li key={c.href} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-gray-300" />}
              {i < breadcrumbs.length - 1 ? (
                <Link href={c.href} className="hover:text-primary">{c.name}</Link>
              ) : (
                <span className="line-clamp-1 text-gray-600">{c.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Title + SKU */}
      <div>
        <Link
          href={`/products?brand=${encodeURIComponent(product.brand)}`}
          className="mb-1 block text-sm font-semibold uppercase tracking-widest text-primary hover:underline"
        >
          {product.brand}
        </Link>
        <h1 className="text-xl font-bold leading-tight text-gray-900 sm:text-2xl">{product.name}</h1>
        <p className="mt-1 text-xs text-neutral-400">SKU: {sku}</p>
      </div>

      {/* Rating → scrolls to reviews. Only shown once there are real reviews. */}
      <button type="button" onClick={scrollToReviews} className="flex w-fit items-center gap-2 text-sm hover:opacity-80">
        {reviewCount > 0 ? (
          <StarRating value={rating} count={reviewCount} />
        ) : (
          <span className="text-gray-400">No reviews yet — be the first to review</span>
        )}
      </button>

      {/* Price */}
      <div className="flex flex-wrap items-baseline gap-3 border-y border-gray-100 py-4">
        <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
        {product.originalPrice && (
          <>
            <span className="text-lg text-neutral-400 line-through">{formatPrice(product.originalPrice)}</span>
            <span className="rounded-full bg-red-500 px-2.5 py-1 text-sm font-semibold text-white">
              Save {formatPrice(savings)} ({discountPct}%)
            </span>
          </>
        )}
        <span className="ml-auto text-sm text-gray-400">AUD incl. GST</span>
      </div>

      {/* Flavour variant */}
      {product.flavors && product.flavors.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold text-gray-700">
            Flavour: <span className="font-normal text-primary">{flavor}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.flavors.map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFlavor(f)}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-all ${
                  flavor === f
                    ? 'border-primary bg-primary/5 font-semibold text-primary'
                    : 'border-neutral-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Nicotine variant */}
      {product.nicotineStrengths && product.nicotineStrengths.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold text-gray-700">
            Nicotine: <span className="font-normal text-primary">{nicotine}mg</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.nicotineStrengths.map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setNicotine(n)}
                className={`rounded-lg border px-4 py-2 text-sm transition-all ${
                  nicotine === n
                    ? 'border-primary bg-primary/5 font-semibold text-primary'
                    : 'border-neutral-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                {n}mg
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Inventory badge */}
      <InventoryBadge product={product} soldOut={soldOut} />

      {/* Quantity + actions */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5">
            <button type="button" aria-label="Decrease quantity" disabled={qty <= 1}
              onClick={() => setQty(q => Math.max(1, q - 1))}
              className="text-gray-400 transition-colors hover:text-gray-700 disabled:opacity-40">
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="number"
              aria-label="Quantity"
              min={1}
              max={maxQty}
              value={qty}
              onChange={e => setQty(Math.min(maxQty, Math.max(1, Number(e.target.value) || 1)))}
              className="w-12 [appearance:textfield] bg-transparent text-center font-semibold text-gray-900 focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button type="button" aria-label="Increase quantity" disabled={qty >= maxQty}
              onClick={() => setQty(q => Math.min(maxQty, q + 1))}
              className="text-gray-400 transition-colors hover:text-gray-700 disabled:opacity-40">
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={soldOut}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-white transition-colors hover:bg-primary-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingCart className="h-4 w-4" />
            {soldOut ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>

        <button
          type="button"
          onClick={() => toggle(product)}
          className={`flex w-full items-center justify-center gap-2 rounded-lg border py-3 text-sm font-medium transition-all ${
            wishlisted
              ? 'border-red-200 bg-red-50 text-red-500 hover:bg-red-100'
              : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900'
          }`}
        >
          <Heart className="h-4 w-4" fill={wishlisted ? '#EF4444' : 'none'} stroke={wishlisted ? '#EF4444' : 'currentColor'} />
          {wishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={soldOut}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Zap className="h-4 w-4" />
          Buy Now
        </button>
      </div>

      {/* Trust strip */}
      <div className="grid grid-cols-2 gap-2 border-t border-gray-100 pt-4 sm:grid-cols-4">
        {[
          { icon: Truck, label: 'Free Shipping', sub: 'Orders $300+' },
          { icon: Lock, label: 'Secure Checkout', sub: 'SSL encrypted' },
          { icon: ShieldCheck, label: 'Age-Verified', sub: '18+ only' },
          { icon: RotateCcw, label: '30-Day Returns', sub: 'Easy returns' },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex flex-col items-center gap-1 rounded-xl border border-gray-100 bg-gray-50 p-3 text-center">
            <Icon className="h-5 w-5 text-primary" />
            <p className="text-xs font-semibold text-gray-700">{label}</p>
            <p className="text-[10px] text-gray-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* Share + optional manual */}
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span className="font-medium">Share:</span>
        <button type="button" onClick={copyLink} className="flex items-center gap-1 hover:text-primary">
          {copied ? <Check className="h-4 w-4 text-primary" /> : <Link2 className="h-4 w-4" />}
          {copied ? 'Copied!' : 'Copy link'}
        </button>
        <a
          href={`mailto:?subject=${encodeURIComponent(product.name)}&body=${encodeURIComponent(`Check this out: ${product.name}`)}`}
          className="flex items-center gap-1 hover:text-primary"
        >
          <Mail className="h-4 w-4" /> Email
        </a>
        {product.manualUrl && (
          <a href={product.manualUrl} target="_blank" rel="noopener noreferrer" className="ml-auto flex items-center gap-1 hover:text-primary">
            <FileText className="h-4 w-4" /> Manual
          </a>
        )}
      </div>
    </div>
  )
}

function InventoryBadge({ product, soldOut }: { product: Product; soldOut: boolean }) {
  const base = 'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold'

  if (product.status === 'pre_order') {
    return <span className={`${base} bg-blue-50 text-blue-700`}>Pre-Order — ships in 2–3 weeks</span>
  }
  if (soldOut) {
    return <span className={`${base} bg-red-50 text-red-600`}>Out of Stock</span>
  }
  if (product.inventoryQty != null && product.inventoryQty <= 5) {
    return <span className={`${base} bg-amber-50 text-amber-700`}><AlertTriangle className="h-4 w-4" /> Only {product.inventoryQty} left!</span>
  }
  return <span className={`${base} bg-green-50 text-green-700`}><Check className="h-4 w-4" /> In Stock</span>
}
