'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useWishlistStore } from '@/lib/wishlist-store'
import type { Product } from '@/types'

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

      // Add DB items not yet in local store. Resolve them via the server so this
      // root-layout component never bundles the full catalogue into every page.
      const missing = [...dbIds].filter(id => !isWishlisted(id))
      if (missing.length) {
        try {
          const res = await fetch(`/api/products/resolve?ids=${encodeURIComponent(missing.join(','))}`)
          if (res.ok) {
            const body = (await res.json()) as { data?: { products?: Product[] } }
            for (const product of body.data?.products ?? []) {
              if (!isWishlisted(product.id)) toggle(product)
            }
          }
        } catch {
          /* offline / transient — local store is still intact */
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
