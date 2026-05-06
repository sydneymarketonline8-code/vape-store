'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import { Product } from '@/types'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'

export function ProductCard({ product }: { product: Product }) {
  const { addItem, setOpen } = useCartStore()

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    addItem(product)
    setOpen(true)
  }

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link href={`/products/${product.slug}`} className="group block">
        <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden hover:border-zinc-700 transition-colors">
          <div className="absolute top-3 left-3 z-10 flex gap-2">
            {product.originalPrice && (
              <span className="rounded-full bg-red-500/20 border border-red-500/30 px-2 py-0.5 text-xs font-semibold text-red-400">
                SALE
              </span>
            )}
            {product.featured && (
              <span className="rounded-full bg-violet-500/20 border border-violet-500/30 px-2 py-0.5 text-xs font-semibold text-violet-400">
                FEATURED
              </span>
            )}
          </div>

          <div className="relative h-56 bg-zinc-800 overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized
            />
          </div>

          <div className="p-4">
            <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wide">{product.brand}</p>
            <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2 leading-snug">
              {product.name}
            </h3>

            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-zinc-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-zinc-500">({product.reviewCount})</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-white">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="ml-2 text-xs text-zinc-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              <button
                onClick={handleAddToCart}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-colors active:scale-95"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
