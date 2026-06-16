'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useWishlistStore } from '@/lib/wishlist-store'

/** Links to /wishlist with a live count badge. */
export function WishlistIcon({ className = '' }: { className?: string }) {
  const count = useWishlistStore(s => s.items.length)

  return (
    <Link
      href="/wishlist"
      aria-label={`Wishlist${count > 0 ? `, ${count} item${count === 1 ? '' : 's'}` : ''}`}
      className={`relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className}`}
    >
      <Heart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-white">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  )
}
