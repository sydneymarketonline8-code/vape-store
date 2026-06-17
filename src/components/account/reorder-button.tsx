'use client'

import { RotateCcw } from 'lucide-react'
import { products } from '@/data/products'
import { useCartStore } from '@/lib/store'

interface ReorderItem {
  productId: string | null
  quantity: number
  flavor?: string | null
  nicotine?: number | null
}

/** Adds every still-available line item from a past order back into the cart. */
export function ReorderButton({ items }: { items: ReorderItem[] }) {
  const { addItem, setOpen } = useCartStore()

  function reorder() {
    let added = 0
    for (const it of items) {
      const product = products.find(p => p.id === it.productId)
      if (!product) continue
      for (let i = 0; i < it.quantity; i++) {
        addItem(product, { flavor: it.flavor || undefined, nicotine: it.nicotine ?? undefined })
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
