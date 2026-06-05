'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useWishlistStore } from '@/lib/wishlist-store'
import { products as allProducts } from '@/data/products'

export function WishlistSync() {
  const { items, isWishlisted, toggle } = useWishlistStore()

  useEffect(() => {
    async function sync() {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: dbRows } = await db
        .from('wishlist_items')
        .select('product_id')
        .eq('user_id', user.id) as { data: { product_id: string }[] | null }

      if (!dbRows) return
      const dbIds = new Set(dbRows.map(r => r.product_id))

      // Add DB items not yet in local store
      for (const { product_id } of dbRows) {
        if (!isWishlisted(product_id)) {
          const product = allProducts.find(p => p.id === product_id)
          if (product) toggle(product)
        }
      }

      // Upload local items not yet in Supabase (added before login)
      const toUpload = items
        .filter(p => !dbIds.has(p.id))
        .map(p => ({ user_id: user.id, product_id: p.id }))

      if (toUpload.length) {
        await db
          .from('wishlist_items')
          .upsert(toUpload, { onConflict: 'user_id,product_id', ignoreDuplicates: true })
      }
    }

    sync()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
