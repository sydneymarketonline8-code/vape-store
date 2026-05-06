'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingCart, ChevronLeft, Package, Zap, Shield, Minus, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { Product } from '@/types'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'

export function ProductDetailClient({ product }: { product: Product }) {
  const [selectedFlavor, setSelectedFlavor] = useState(product.flavors?.[0] || '')
  const [selectedNicotine, setSelectedNicotine] = useState(product.nicotineStrengths?.[0])
  const [quantity, setQuantity] = useState(1)
  const { addItem, setOpen } = useCartStore()

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) {
      addItem(product, { flavor: selectedFlavor, nicotine: selectedNicotine })
    }
    setOpen(true)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mb-8"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
          />
          {product.originalPrice && (
            <div className="absolute top-4 left-4 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
              SALE
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-violet-400 uppercase tracking-wide mb-1">{product.brand}</p>
            <h1 className="text-3xl font-black text-white mb-3">{product.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-zinc-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-zinc-400">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black text-white">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xl text-zinc-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <p className="text-zinc-400 leading-relaxed">{product.description}</p>

          {product.flavors && product.flavors.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-white mb-3">
                Flavor: <span className="text-violet-400">{selectedFlavor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.flavors.map(flavor => (
                  <button
                    key={flavor}
                    onClick={() => setSelectedFlavor(flavor)}
                    className={`rounded-lg border px-3 py-1.5 text-sm transition-all ${
                      selectedFlavor === flavor
                        ? 'border-violet-500 bg-violet-500/20 text-violet-300'
                        : 'border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-white'
                    }`}
                  >
                    {flavor}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.nicotineStrengths && product.nicotineStrengths.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-white mb-3">
                Nicotine: <span className="text-violet-400">{selectedNicotine}mg</span>
              </p>
              <div className="flex gap-2">
                {product.nicotineStrengths.map(strength => (
                  <button
                    key={strength}
                    onClick={() => setSelectedNicotine(strength)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                      selectedNicotine === strength
                        ? 'border-violet-500 bg-violet-500/20 text-violet-300'
                        : 'border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-white'
                    }`}
                  >
                    {strength}mg
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-semibold text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToCart}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 font-semibold text-white hover:bg-violet-500 transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </motion.button>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-zinc-800 pt-6">
            {[
              {
                icon: Package,
                label: product.puffCount
                  ? `${product.puffCount.toLocaleString()} Puffs`
                  : 'In Stock',
              },
              { icon: Zap, label: 'Fast Shipping' },
              { icon: Shield, label: '21+ Only' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800">
                  <Icon className="h-4 w-4 text-violet-400" />
                </div>
                <span className="text-xs text-zinc-500">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
