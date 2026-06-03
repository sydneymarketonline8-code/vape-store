'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { Product } from '@/types'
import { useCartStore } from '@/lib/store'
import { useWishlistStore } from '@/lib/wishlist-store'
import { formatPrice } from '@/lib/utils'

export function ProductCard({ product, isNew }: { product: Product; isNew?: boolean }) {
  const { addItem, setOpen }     = useCartStore()
  const { toggle, isWishlisted } = useWishlistStore()
  const wishlisted               = isWishlisted(product.id)
  const savings = product.originalPrice ? product.originalPrice - product.price : null

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    addItem(product)
    setOpen(true)
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    toggle(product)
  }

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
      <Link href={`/products/${product.slug}`} className="group block h-full">
        <div className="flex h-full flex-col rounded-xl border border-[#1e1e2e] bg-[#12121a] transition-all duration-300 hover:border-violet-500/40 hover:shadow-[0_0_20px_rgba(124,58,237,0.1)]">

          {/* Image zone */}
          <div className="relative aspect-square overflow-hidden rounded-t-xl bg-[#0d0d15]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
              {product.originalPrice && (
                <span className="rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-2.5 py-0.5 text-[11px] font-bold text-white">
                  SALE
                </span>
              )}
              {isNew && (
                <span className="rounded-full bg-cyan-500 px-2.5 py-0.5 text-[11px] font-bold text-white">
                  NEW
                </span>
              )}
            </div>
            <button
              type="button"
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              onClick={handleWishlist}
              className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full border border-[#1e1e2e] bg-[#12121a]/80 text-slate-400 backdrop-blur-sm transition-all hover:border-red-500/40 hover:text-red-400"
            >
              <Heart
                className="h-3.5 w-3.5 transition-all"
                fill={wishlisted ? '#f87171' : 'none'}
                stroke={wishlisted ? '#f87171' : 'currentColor'}
              />
            </button>
          </div>

          {/* Info */}
          <div className="flex flex-1 flex-col p-4">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-violet-400">
              {product.brand}
            </p>
            <h3 className="mb-2 line-clamp-2 flex-1 text-sm font-semibold leading-snug text-white">
              {product.name}
            </h3>
            <div className="mb-3 flex items-center gap-1.5">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
                ))}
              </div>
              <span className="text-[11px] text-slate-500">({product.reviewCount})</span>
            </div>
            <div className="mb-3 flex flex-wrap items-baseline gap-1">
              <span className="text-lg font-bold text-white">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-sm text-slate-500 line-through">{formatPrice(product.originalPrice)}</span>
                  {savings && (
                    <span className="text-xs font-semibold text-cyan-400">Save {formatPrice(savings)}</span>
                  )}
                </>
              )}
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:from-violet-500 hover:to-cyan-400 hover:shadow-[0_0_16px_rgba(124,58,237,0.35)] active:scale-[0.98]"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
