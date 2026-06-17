import { WishlistClient } from '@/components/shop/wishlist-client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Wishlist' }

export default function AccountWishlistPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Wishlist</h1>
      <WishlistClient />
    </div>
  )
}
