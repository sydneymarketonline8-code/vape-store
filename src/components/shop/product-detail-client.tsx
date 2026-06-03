'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Star, ShoppingCart, Heart, ChevronLeft,
  Zap, Lock, Truck, Package, Minus, Plus,
} from 'lucide-react'
import { motion } from 'framer-motion'
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
  const savings = product.originalPrice ? product.originalPrice - product.price : null

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) {
      addItem(product, { flavor: selectedFlavor, nicotine: selectedNicotine })
    }
    setOpen(true)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/products"
        className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-violet-400"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">

        {/* Left — image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-[#1e1e2e] bg-[#0d0d15]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
          />
          {product.originalPrice && (
            <span className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-3 py-1 text-sm font-bold text-white">
              SALE
            </span>
          )}
        </div>

        {/* Right — details */}
        <div className="flex flex-col gap-5">
          {/* Brand + name */}
          <div>
            <Link
              href={`/products?brand=${product.brand}`}
              className="mb-1 block text-sm font-semibold uppercase tracking-widest text-violet-400 hover:text-violet-300"
            >
              {product.brand}
            </Link>
            <h1 className="font-heading text-3xl font-bold leading-tight text-white">
              {product.name}
            </h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
              ))}
            </div>
            <span className="text-sm text-slate-400">
              {product.rating} <span className="text-slate-600">({product.reviewCount} reviews)</span>
            </span>
          </div>

          {/* Price */}
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="font-heading text-4xl font-bold text-white">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-slate-500 line-through">{formatPrice(product.originalPrice)}</span>
                {savings && (
                  <span className="rounded-full bg-cyan-500/15 px-3 py-0.5 text-sm font-bold text-cyan-400">
                    Save {formatPrice(savings)}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Flavor */}
          {product.flavors && product.flavors.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-slate-300">
                Flavour: <span className="text-violet-400">{selectedFlavor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.flavors.map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setSelectedFlavor(f)}
                    className={`rounded-lg border px-3 py-1.5 text-sm transition-all ${
                      selectedFlavor === f
                        ? 'border-violet-500 bg-violet-500/20 text-violet-300'
                        : 'border-[#1e1e2e] text-slate-400 hover:border-slate-500 hover:text-white'
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
              <p className="mb-2 text-sm font-medium text-slate-300">
                Nicotine: <span className="text-violet-400">{selectedNicotine}mg</span>
              </p>
              <div className="flex gap-2">
                {product.nicotineStrengths.map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setSelectedNicotine(n)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                      selectedNicotine === n
                        ? 'border-violet-500 bg-violet-500/20 text-violet-300'
                        : 'border-[#1e1e2e] text-slate-400 hover:border-slate-500 hover:text-white'
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
            <div className="flex items-center gap-2 rounded-xl border border-[#1e1e2e] bg-[#12121a] px-4 py-3">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-semibold text-white">{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity(quantity + 1)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={handleAddToCart}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 font-semibold text-white transition-all hover:from-violet-500 hover:to-cyan-400 hover:shadow-[0_0_24px_rgba(124,58,237,0.4)]"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </motion.button>
          </div>

          {/* Wishlist */}
          <button
            type="button"
            onClick={() => toggle(product)}
            className={`flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition-all ${
              wishlisted
                ? 'border-red-500/40 text-red-400 hover:bg-red-500/10'
                : 'border-[#1e1e2e] text-slate-400 hover:border-violet-500/40 hover:text-violet-400'
            }`}
          >
            <Heart className="h-4 w-4" fill={wishlisted ? '#f87171' : 'none'} stroke={wishlisted ? '#f87171' : 'currentColor'} />
            {wishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
          </button>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-2 border-t border-[#1e1e2e] pt-4">
            {[
              { icon: Zap,     label: 'Fast Dispatch' },
              { icon: Lock,    label: 'Secure Payment' },
              { icon: Truck,   label: 'Free Ship $99+' },
              { icon: Package, label: product.puffCount ? `${product.puffCount.toLocaleString()} Puffs` : 'In Stock' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 rounded-full border border-[#1e1e2e] bg-[#12121a] px-3 py-1.5"
              >
                <Icon className="h-3.5 w-3.5 text-violet-400" />
                <span className="text-xs text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16">
        <div className="flex gap-0 border-b border-[#1e1e2e]">
          {TABS.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'border-b-2 border-violet-500 text-violet-400'
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-[#1e1e2e] bg-[#12121a] p-6">
          {activeTab === 'Description' && (
            <p className="leading-relaxed text-slate-300">{product.description}</p>
          )}
          {activeTab === 'Specifications' && (
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                ['Brand',    product.brand],
                ['Category', product.category],
                ...(product.puffCount ? [['Puff Count', `${product.puffCount.toLocaleString()} puffs`]] : []),
                ['In Stock', product.inStock ? 'Yes' : 'No'],
                ['Rating',   `${product.rating} / 5`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 rounded-lg border border-[#1e1e2e] bg-[#0d0d15] px-4 py-2.5">
                  <dt className="text-sm text-slate-500">{k}</dt>
                  <dd className="text-sm font-medium text-white">{v}</dd>
                </div>
              ))}
            </dl>
          )}
          {activeTab === 'Reviews' && (
            <div className="text-center py-8">
              <p className="text-slate-400">No reviews yet. Be the first to review this product.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
