'use client'

import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/store'

/** Cart trigger with a live item-count badge. Opens the CartDrawer via the store. */
export function CartIcon({ className = '' }: { className?: string }) {
  const setOpen = useCartStore(s => s.setOpen)
  const count = useCartStore(s => s.items.reduce((n, i) => n + i.quantity, 0))

  return (
    <button
      type="button"
      aria-label={`Open cart${count > 0 ? `, ${count} item${count === 1 ? '' : 's'}` : ''}`}
      onClick={() => setOpen(true)}
      className={`relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className}`}
    >
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-white">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}
