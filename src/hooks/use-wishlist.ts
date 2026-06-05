'use client'

import { useWishlistStore } from '@/lib/wishlist-store'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@/types'

export function useWishlist() {
  const store = useWishlistStore()

  async function toggle(product: Product) {
    const wasWishlisted = store.isWishlisted(product.id)
    store.toggle(product)

    try {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      if (wasWishlisted) {
        await db.from('wishlist_items').delete()
          .match({ user_id: user.id, product_id: product.id })
      } else {
        await db.from('wishlist_items')
          .insert({ user_id: user.id, product_id: product.id })
      }
    } catch {
      // Fail silently — local Zustand state is source of truth
    }
  }

  return { ...store, toggle }
}
