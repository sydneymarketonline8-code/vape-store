'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, Plus, Minus, Check, Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { productImage } from '@/lib/product-image'
import type { Product } from '@/types'

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, updateQuantity, addItem } = useCartStore()
  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const count = items.reduce((s, i) => s + i.quantity, 0)

  // Cross-sell suggestions — fetched once the drawer first opens.
  const [suggestions, setSuggestions] = useState<Product[]>([])
  useEffect(() => {
    if (!open || suggestions.length) return
    let active = true
    fetch('/api/cross-sell')
      .then(r => r.json())
      .then(d => { if (active) setSuggestions(d.products ?? []) })
      .catch(() => {})
    return () => { active = false }
  }, [open, suggestions.length])

  const inCart = new Set(items.map(i => i.product.id))
  const crossSell = suggestions.filter(p => !inCart.has(p.id)).slice(0, 6)

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-gray-200 bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[#1B7A3E]" />
                <h2 className="text-base font-bold text-gray-900">Shopping Cart</h2>
                {count > 0 && (
                  <span className="rounded-full bg-[#1B7A3E] px-2 py-0.5 text-xs font-bold text-white">
                    {count}
                  </span>
                )}
              </div>
              <button
                type="button"
                aria-label="Close cart"
                onClick={onClose}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-20 text-center">
                  <ShoppingBag className="mb-3 h-12 w-12 text-gray-200" />
                  <p className="font-semibold text-gray-700">Your cart is empty</p>
                  <p className="mt-1 text-sm text-gray-400">Add some products to get started</p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-5 rounded-lg bg-[#1B7A3E] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#156331]"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map(item => (
                  <div
                    key={`${item.product.id}-${item.selectedFlavor}`}
                    className="flex gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white border border-gray-100">
                      <Image src={productImage(item.product)} alt={item.product.name} fill className="object-contain p-1" unoptimized />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="text-[11px] text-gray-400">{item.product.brand}</p>
                      <p className="truncate text-sm font-semibold text-gray-900">{item.product.name}</p>
                      {item.selectedFlavor && (
                        <p className="text-xs text-gray-400">{item.selectedFlavor}</p>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1">
                          <button
                            type="button"
                            aria-label="Decrease"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="text-gray-400 transition-colors hover:text-gray-700"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-5 text-center text-sm font-medium text-gray-900">{item.quantity}</span>
                          <button
                            type="button"
                            aria-label="Increase"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="text-gray-400 transition-colors hover:text-gray-700"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                          <button
                            type="button"
                            aria-label="Remove"
                            onClick={() => removeItem(item.product.id)}
                            className="text-gray-300 transition-colors hover:text-red-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cross-sell — honest "you might also like", popular in-stock items */}
            {items.length > 0 && crossSell.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-4">
                <p className="mb-2 text-xs font-semibold text-gray-700">You might also like</p>
                <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-1">
                  {crossSell.map(p => (
                    <div key={p.id} className="w-28 shrink-0">
                      <Link href={`/products/${p.slug}`} onClick={onClose} className="block">
                        <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                          <Image src={productImage(p)} alt={p.name} fill sizes="112px" className="object-contain p-2" unoptimized />
                        </div>
                        <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-gray-700">{p.name}</p>
                      </Link>
                      <div className="mt-1 flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-gray-900">{formatPrice(p.price)}</span>
                        <button
                          type="button"
                          aria-label={`Add ${p.name} to cart`}
                          onClick={() => addItem(p)}
                          className="rounded-md bg-[#1B7A3E] px-2 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-[#156331]"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 px-6 py-5 space-y-4">
                {/* Free-shipping progress nudge (honest — $300 threshold) */}
                {total >= 300 ? (
                  <div className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
                    <Check className="h-3.5 w-3.5" /> You&apos;ve unlocked free AU shipping!
                  </div>
                ) : (
                  <div>
                    <p className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Truck className="h-3.5 w-3.5 text-[#1B7A3E]" />
                      Add <span className="font-semibold text-gray-900">${(300 - total).toFixed(2)}</span> more for free shipping
                    </p>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-[#1B7A3E] transition-all" style={{ width: `${Math.min(100, (total / 300) * 100)}%` }} />
                    </div>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Minimum order</span>
                  <span className={total >= 250 ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>
                    {total >= 250 ? (
                      <span className="inline-flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Met</span>
                    ) : (
                      `$${(250 - total).toFixed(2)} to go`
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-gray-900">Subtotal</span>
                  <span className="text-xl text-gray-900">{formatPrice(total)}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="flex w-full items-center justify-center rounded-lg bg-[#1B7A3E] py-3.5 font-semibold text-white transition-colors hover:bg-[#156331]"
                >
                  Proceed to Checkout
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-lg border border-gray-200 py-2.5 text-sm text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
