'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity } = useCartStore()
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-zinc-950 border-l border-zinc-800 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-violet-400" />
                <h2 className="font-semibold text-white">Your Cart</h2>
                {items.length > 0 && (
                  <span className="rounded-full bg-violet-600 px-2 py-0.5 text-xs font-bold text-white">
                    {items.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <ShoppingCart className="h-12 w-12 text-zinc-700 mb-4" />
                  <p className="text-zinc-400 font-medium mb-1">Your cart is empty</p>
                  <p className="text-zinc-600 text-sm mb-6">Add some products to get started</p>
                  <button
                    onClick={onClose}
                    className="rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map(item => (
                  <div
                    key={`${item.product.id}-${item.selectedFlavor}-${item.selectedNicotine}`}
                    className="flex gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4"
                  >
                    <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-800">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-zinc-500 mb-0.5">{item.product.brand}</p>
                      <p className="text-sm font-medium text-white truncate">
                        {item.product.name}
                      </p>
                      {item.selectedFlavor && (
                        <p className="text-xs text-zinc-500">{item.selectedFlavor}</p>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm text-white w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-zinc-600 hover:text-red-400 transition-colors"
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

            {items.length > 0 && (
              <div className="border-t border-zinc-800 px-6 py-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Subtotal</span>
                  <span className="font-bold text-white text-lg">{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-zinc-600">Shipping and taxes calculated at checkout</p>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="flex w-full items-center justify-center rounded-xl bg-violet-600 py-3.5 font-semibold text-white hover:bg-violet-500 transition-colors"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={onClose}
                  className="w-full rounded-xl border border-zinc-700 py-2.5 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
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
