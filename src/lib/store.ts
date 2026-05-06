'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, CartStore, Product } from '@/types'

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product: Product, options) => {
        const { items } = get()
        const existing = items.find(
          item =>
            item.product.id === product.id &&
            item.selectedFlavor === options?.flavor &&
            item.selectedNicotine === options?.nicotine
        )

        if (existing) {
          set({
            items: items.map(item =>
              item === existing ? { ...item, quantity: item.quantity + 1 } : item
            ),
          })
        } else {
          set({
            items: [
              ...items,
              {
                product,
                quantity: 1,
                selectedFlavor: options?.flavor,
                selectedNicotine: options?.nicotine,
              },
            ],
          })
        }
      },

      removeItem: (productId: string) => {
        set({ items: get().items.filter(item => item.product.id !== productId) })
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set({
          items: get().items.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      setOpen: (open: boolean) => set({ isOpen: open }),
    }),
    { name: 'vapestore-cart' }
  )
)
