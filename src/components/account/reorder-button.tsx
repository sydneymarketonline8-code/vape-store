'use client'

import { RotateCcw } from 'lucide-react'
import type { Product } from '@/types'
import { useCartStore } from '@/lib/store'

interface ReorderLine {
  product: Product
  quantity: number
  flavor?: string | null
  nicotine?: number | null
}

/**
 * Adds every still-available line item from a past order back into the cart.
 * Products are resolved server-side and passed in, so this client component
 * doesn't bundle the catalogue.
 */
export function ReorderButton({ items }: { items: ReorderLine[] }) {
  const { addItem, setOpen } = useCartStore()

  function reorder() {
    let added = 0
    for (const it of items) {
      for (let i = 0; i < it.quantity; i++) {
        addItem(it.product, { flavor: it.flavor || undefined, nicotine: it.nicotine ?? undefined })
      }
      added++
    }
    if (added > 0) setOpen(true)
  }

  return (
    <button
      type="button"
      onClick={reorder}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
    >
      <RotateCcw className="h-4 w-4" /> Reorder
    </button>
  )
}
