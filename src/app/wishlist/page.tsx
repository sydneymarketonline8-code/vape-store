import type { Metadata } from 'next'
import { WishlistClient } from '@/components/shop/wishlist-client'

export const metadata: Metadata = {
  title: 'Wishlist',
  description: 'Your saved Aussie Vapes products.',
}

export default function WishlistPage() {
  return (
    <div>
      <div className="border-b border-gray-200 bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Wishlist</h1>
          <p className="mt-1 text-sm text-gray-500">Products you&apos;ve saved for later</p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <WishlistClient />
      </div>
    </div>
  )
}
