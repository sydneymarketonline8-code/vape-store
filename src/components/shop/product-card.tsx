'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import { Product } from '@/types'
import { useCartStore } from '@/lib/store'
import { useWishlistStore } from '@/lib/wishlist-store'
import { formatPrice } from '@/lib/utils'

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
  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : undefined

  const activeBadge = badge ?? (product.originalPrice ? 'sale' : product.featured ? 'top' : undefined)

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
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:shadow-md hover:border-gray-300">

        {/* Image zone */}
        <div className="relative aspect-square overflow-hidden rounded-t-xl bg-gray-50">
          <Image
            src={product.image}
            alt={product.name}
            fill
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
            className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm transition-all hover:shadow-md"
          >
            <Heart
              className="h-3.5 w-3.5 transition-all"
              fill={wishlisted ? '#EF4444' : 'none'}
              stroke={wishlisted ? '#EF4444' : '#9CA3AF'}
            />
          </button>
        </div>

        {/* Info zone */}
        <div className="p-3">
          <p className="mb-0.5 text-[11px] font-medium uppercase tracking-wide text-gray-400">
            {product.brand}
          </p>
          <h3 className="mb-1.5 line-clamp-2 text-sm font-semibold leading-snug text-gray-900">
            {product.name}
          </h3>

          {/* Stars */}
          <div className="mb-2 flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                />
              ))}
            </div>
            <span className="text-[11px] text-gray-400">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="mb-3 flex items-baseline gap-2">
            <span className={`text-base font-bold ${product.originalPrice ? 'text-red-600' : 'text-gray-900'}`}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          {/* Quick Add */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1B7A3E] py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#156331] active:scale-[0.98]"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Quick Add
          </button>
        </div>
      </div>
    </Link>
  )
}
