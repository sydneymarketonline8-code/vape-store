'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { Star, ShoppingCart, Heart, Check } from 'lucide-react'
import { Product } from '@/types'
import { useCartStore } from '@/lib/store'
import { useWishlistStore } from '@/lib/wishlist-store'
import { formatPrice } from '@/lib/utils'
import { productImage } from '@/lib/product-image'

type BadgeType = 'top' | 'new' | 'sale'

function Badge({ type, discount }: { type: BadgeType; discount?: number }) {
  if (type === 'top')  return <span className="rounded-full bg-blue-500 px-2.5 py-0.5 text-[11px] font-bold text-white">Top</span>
  if (type === 'new')  return <span className="rounded-full bg-[#1B7A3E] px-2.5 py-0.5 text-[11px] font-bold text-white">New</span>
  if (type === 'sale') return <span className="rounded-full bg-red-500 px-2.5 py-0.5 text-[11px] font-bold text-white">{discount ? `-${discount}%` : 'Sale'}</span>
  return null
}

export function ProductCard({ product, badge }: { product: Product; badge?: BadgeType }) {
  const { addItem, setOpen }     = useCartStore()
  const { toggle, isWishlisted } = useWishlistStore()
  const wishlisted               = isWishlisted(product.id)
  const [added, setAdded]        = useState(false)
  const [burst, setBurst]        = useState(0) // bump to retrigger the heart burst
  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : undefined

  const activeBadge = badge ?? (product.originalPrice ? 'sale' : product.featured ? 'top' : undefined)

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    addItem(product)
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      setOpen(true)
    }, 700)
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    if (!wishlisted) setBurst(b => b + 1)
    toggle(product)
  }

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:border-gray-300 hover:shadow-md">

        {/* Image zone */}
        <div className="relative aspect-square overflow-hidden rounded-t-xl bg-gray-50">
          <Image
            src={productImage(product)}
            alt={`${product.name} — Buy Online Australia | Aussie Vape`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
          {activeBadge && (
            <div className="absolute left-2.5 top-2.5">
              <Badge type={activeBadge} discount={discountPct} />
            </div>
          )}
          <button
            type="button"
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={handleWishlist}
            className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <motion.span key={burst} animate={burst ? { scale: [1, 1.4, 1] } : undefined} transition={{ duration: 0.3 }}>
              <Heart
                className="h-3.5 w-3.5"
                fill={wishlisted ? '#EF4444' : 'none'}
                stroke={wishlisted ? '#EF4444' : '#9CA3AF'}
              />
            </motion.span>
          </button>
        </div>

        {/* Info zone */}
        <div className="p-3">
          <p className="mb-0.5 text-[11px] font-medium uppercase tracking-wide text-gray-400">{product.brand}</p>
          <h3 className="mb-1.5 line-clamp-2 text-sm font-semibold leading-snug text-gray-900">{product.name}</h3>

          <div className="mb-2 flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
              ))}
            </div>
            <span className="text-[11px] text-gray-400">({product.reviewCount})</span>
          </div>

          <div className="mb-3 flex items-baseline gap-2">
            <span className={`text-base font-bold ${product.originalPrice ? 'text-red-600' : 'text-gray-900'}`}>{formatPrice(product.price)}</span>
            {product.originalPrice && <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>}
          </div>

          {/* Low-stock cue — only when real inventory data says so */}
          {product.inventoryQty != null && product.inventoryQty > 0 && product.inventoryQty <= 5 && (
            <p className="mb-2 text-[11px] font-semibold text-amber-600">Only {product.inventoryQty} left</p>
          )}

          {/* Quick Add — pulses + swaps to a checkmark on add */}
          <motion.button
            type="button"
            onClick={handleAddToCart}
            animate={added ? { scale: [1, 1.06, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white transition-colors ${
              added ? 'bg-green-600' : 'bg-[#1B7A3E] hover:bg-[#156331]'
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span key="added" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <Check className="h-4 w-4" /> Added
                </motion.span>
              ) : (
                <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <ShoppingCart className="h-3.5 w-3.5" /> Quick Add
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </Link>
  )
}
