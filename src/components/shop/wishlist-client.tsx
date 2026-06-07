'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useWishlistStore } from '@/lib/wishlist-store'
import { ProductCard } from './product-card'

export function WishlistClient() {
  const items = useWishlistStore(s => s.items)
  // Avoid hydration mismatch: the persisted store is only populated on the client.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Heart className="h-10 w-10 text-gray-300" />
        <p className="mt-4 text-gray-600">Your wishlist is empty</p>
        <p className="mt-1 text-sm text-gray-400">Tap the heart on any product to save it here.</p>
        <Link
          href="/products"
          className="mt-6 rounded-lg bg-[#1B7A3E] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#156331]"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {items.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
