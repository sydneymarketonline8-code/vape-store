'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, updateQuantity } = useCartStore()
  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const count = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-[#1e1e2e] bg-[#12121a] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1e1e2e] px-6 py-4">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-violet-400" />
                <h2 className="font-heading text-lg font-semibold text-white">Your Cart</h2>
                {count > 0 && (
                  <span className="rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-2 py-0.5 text-xs font-bold text-white">
                    {count}
                  </span>
                )}
              </div>
              <button
                type="button"
                aria-label="Close cart"
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-[#1e1e2e] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-20 text-center">
                  <ShoppingBag className="mb-4 h-14 w-14 text-slate-700" />
                  <p className="font-semibold text-slate-300">Your cart is empty</p>
                  <p className="mt-1 text-sm text-slate-600">Add some products to get started</p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-6 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white hover:from-violet-500 hover:to-cyan-400"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map(item => (
                  <div
                    key={`${item.product.id}-${item.selectedFlavor}`}
                    className="flex gap-3 rounded-xl border border-[#1e1e2e] bg-[#0d0d15] p-3"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#12121a]">
                      <Image src={item.product.image} alt={item.product.name} fill className="object-cover" unoptimized />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-violet-400">{item.product.brand}</p>
                      <p className="truncate text-sm font-medium text-white">{item.product.name}</p>
                      {item.selectedFlavor && (
                        <p className="text-xs text-slate-500">{item.selectedFlavor}</p>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 rounded-lg border border-[#1e1e2e] bg-[#12121a] px-2 py-1">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="text-slate-400 hover:text-white transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-5 text-center text-sm text-white">{item.quantity}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="text-slate-400 hover:text-white transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                          <button
                            type="button"
                            aria-label="Remove item"
                            onClick={() => removeItem(item.product.id)}
                            className="text-slate-600 hover:text-red-400 transition-colors"
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

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[#1e1e2e] px-6 py-5 space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-xl font-bold text-white">{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-slate-600">Shipping &amp; taxes calculated at checkout</p>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-3.5 font-semibold text-white transition-all hover:from-violet-500 hover:to-cyan-400 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                >
                  Checkout →
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-xl border border-[#1e1e2e] py-2.5 text-sm text-slate-400 transition-colors hover:bg-[#1e1e2e] hover:text-white"
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
