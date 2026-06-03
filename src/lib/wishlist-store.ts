'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/types'

interface WishlistStore {
  items: Product[]
  toggle: (product: Product) => void
  isWishlisted: (id: string) => boolean
  count: () => number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) => {
        const { items } = get()
        const exists = items.some(i => i.id === product.id)
        set({ items: exists ? items.filter(i => i.id !== product.id) : [...items, product] })
      },
      isWishlisted: (id) => get().items.some(i => i.id === id),
      count: () => get().items.length,
    }),
    { name: 'aussievape-wishlist' }
  )
)
