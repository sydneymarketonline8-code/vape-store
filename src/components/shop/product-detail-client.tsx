'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Star, ShoppingCart, Heart, ChevronLeft,
  Truck, RotateCcw, ShieldCheck, Minus, Plus,
} from 'lucide-react'
import { Product } from '@/types'
import { useCartStore } from '@/lib/store'
import { useWishlistStore } from '@/lib/wishlist-store'
import { formatPrice } from '@/lib/utils'

const TABS = ['Description', 'Specifications', 'Reviews'] as const
type Tab = typeof TABS[number]

export function ProductDetailClient({ product }: { product: Product }) {
  const [selectedFlavor,   setSelectedFlavor]   = useState(product.flavors?.[0] ?? '')
  const [selectedNicotine, setSelectedNicotine] = useState(product.nicotineStrengths?.[0])
  const [quantity,         setQuantity]          = useState(1)
  const [activeTab,        setActiveTab]         = useState<Tab>('Description')

  const { addItem, setOpen }     = useCartStore()
  const { toggle, isWishlisted } = useWishlistStore()
  const wishlisted               = isWishlisted(product.id)

  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : undefined

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) {
      addItem(product, { flavor: selectedFlavor, nicotine: selectedNicotine })
    }
    setOpen(true)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-400">
        <Link href="/" className="hover:text-[#1B7A3E]">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[#1B7A3E]">Products</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category}`} className="hover:text-[#1B7A3E] capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="line-clamp-1 text-gray-600">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">

        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-8"
            unoptimized
          />
          {discountPct && (
            <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
              -{discountPct}%
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">

          {/* Brand + title */}
          <div>
            <Link
              href={`/products?brand=${product.brand}`}
              className="mb-1 block text-sm font-semibold uppercase tracking-widest text-[#1B7A3E] hover:underline"
            >
              {product.brand}
            </Link>
            <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
              {product.name}
            </h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {product.rating} <span className="text-gray-300">|</span>{' '}
              <span className="text-[#1B7A3E]">{product.reviewCount} reviews</span>
            </span>
          </div>

          {/* Price */}
          <div className="flex flex-wrap items-baseline gap-3 border-y border-gray-100 py-4">
            <span className={`text-3xl font-bold ${product.originalPrice ? 'text-red-600' : 'text-gray-900'}`}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-sm font-semibold text-red-600">
                  Save {discountPct}%
                </span>
              </>
            )}
            <span className="ml-auto text-sm text-gray-400">AUD incl. GST</span>
          </div>

          {/* Flavours */}
          {product.flavors && product.flavors.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold text-gray-700">
                Flavour: <span className="font-normal text-[#1B7A3E]">{selectedFlavor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.flavors.map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setSelectedFlavor(f)}
                    className={`rounded-lg border px-3 py-1.5 text-sm transition-all ${
                      selectedFlavor === f
                        ? 'border-[#1B7A3E] bg-green-50 text-[#1B7A3E] font-medium'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Nicotine */}
          {product.nicotineStrengths && product.nicotineStrengths.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold text-gray-700">
                Nicotine: <span className="font-normal text-[#1B7A3E]">{selectedNicotine}mg</span>
              </p>
              <div className="flex gap-2">
                {product.nicotineStrengths.map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setSelectedNicotine(n)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                      selectedNicotine === n
                        ? 'border-[#1B7A3E] bg-green-50 text-[#1B7A3E]'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {n}mg
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty + Add to cart */}
          <div className="flex gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-gray-400 hover:text-gray-700 transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-semibold text-gray-900">{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity(quantity + 1)}
                className="text-gray-400 hover:text-gray-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#1B7A3E] font-semibold text-white transition-colors hover:bg-[#156331] active:scale-[0.98]"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
          </div>

          {/* Wishlist */}
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

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-4">
            {[
              { icon: Truck,       label: 'Free Shipping', sub: 'Orders $300+' },
              { icon: RotateCcw,   label: '30-Day Returns', sub: 'Easy returns' },
              { icon: ShieldCheck, label: 'Age Verified', sub: '18+ only' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-100 bg-gray-50 p-3 text-center">
                <Icon className="h-5 w-5 text-[#1B7A3E]" />
                <p className="text-xs font-semibold text-gray-700">{label}</p>
                <p className="text-[10px] text-gray-400">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-14">
        <div className="flex border-b border-gray-200">
          {TABS.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'border-b-2 border-[#1B7A3E] text-[#1B7A3E]'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
          {activeTab === 'Description' && (
            <p className="leading-relaxed text-gray-600">{product.description}</p>
          )}
          {activeTab === 'Specifications' && (
            <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {([
                ['Brand',    product.brand],
                ['Category', product.category],
                ...(product.puffCount ? [['Puff Count', `${product.puffCount.toLocaleString()} puffs`] as [string, string]] : []),
                ['In Stock', product.inStock ? 'Yes' : 'No'],
                ['Rating',   `${product.rating} / 5`],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} className="flex justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-2.5">
                  <dt className="text-sm text-gray-500">{k}</dt>
                  <dd className="text-sm font-medium text-gray-900">{v}</dd>
                </div>
              ))}
            </dl>
          )}
          {activeTab === 'Reviews' && (
            <div className="py-8 text-center text-gray-500">
              No reviews yet. Be the first to review this product.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
