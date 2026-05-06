'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { ShoppingCart, Menu, X, Zap } from 'lucide-react'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Shop All' },
  { href: '/products?category=disposables', label: 'Disposables' },
  { href: '/products?category=mods', label: 'Mods' },
  { href: '/products?category=e-liquids', label: 'E-Liquids' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isOpen, setOpen, items } = useCartStore()
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
                <Zap className="h-4 w-4 text-white" fill="white" />
              </div>
              <span className="text-lg font-bold text-white">
                Vape<span className="text-violet-400">Store</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setOpen(true)}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>
              <Link
                href="/login"
                className="hidden sm:flex items-center rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-zinc-800 bg-zinc-950 md:hidden overflow-hidden"
            >
              <nav className="flex flex-col px-4 py-4 gap-1">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 rounded-lg border border-zinc-700 px-3 py-2.5 text-center text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <CartDrawer open={isOpen} onClose={() => setOpen(false)} />
    </>
  )
}
