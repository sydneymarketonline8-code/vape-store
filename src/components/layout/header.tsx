'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Zap, Search, Heart, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { useWishlistStore } from '@/lib/wishlist-store'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { href: '/', label: 'Home' },
  {
    href: '/products',
    label: 'Shop',
    dropdown: [
      { href: '/products?category=disposables', label: 'Disposables' },
      { href: '/products?category=mods',        label: 'Mods & Kits' },
      { href: '/products?category=e-liquids',   label: 'E-Liquids' },
      { href: '/products?category=accessories', label: 'Accessories' },
    ],
  },
  { href: '/products', label: 'Brands' },
  { href: '/products', label: 'Deals' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [shopOpen, setShopOpen]     = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { isOpen, setOpen, items }  = useCartStore()
  const wishlistCount               = useWishlistStore(s => s.items.length)
  const cartCount                   = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#1e1e2e] bg-[#0a0a0f]/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-6">

            {/* Logo */}
            <Link href="/" className="flex shrink-0 items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500">
                <Zap className="h-4 w-4 text-white" fill="white" />
              </div>
              <span className="font-heading text-xl font-bold tracking-wide">
                <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  AUSSIE
                </span>
                <span className="text-white"> VAPE</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map(link =>
                link.dropdown ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setShopOpen(true)}
                    onMouseLeave={() => setShopOpen(false)}
                  >
                    <button type="button" className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:text-white">
                      {link.label}
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    <AnimatePresence>
                      {shopOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 top-full min-w-[180px] rounded-xl border border-[#1e1e2e] bg-[#12121a] p-2 shadow-2xl shadow-black/50"
                        >
                          {link.dropdown.map(item => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="block rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-violet-500/10 hover:text-violet-400"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Search"
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-[#12121a] hover:text-white"
              >
                <Search className="h-4 w-4" />
              </button>

              <Link
                href="#"
                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-[#12121a] hover:text-white"
              >
                <Heart className="h-4 w-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 text-[9px] font-bold text-white">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                aria-label="Open cart"
                onClick={() => setOpen(true)}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-[#12121a] hover:text-white"
              >
                <ShoppingBag className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 text-[9px] font-bold text-white">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              <Link
                href="/login"
                className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-[#12121a] hover:text-white sm:flex"
              >
                <User className="h-4 w-4" />
              </Link>

              <button
                type="button"
                aria-label="Toggle menu"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-[#12121a] hover:text-white md:hidden"
              >
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden pb-3"
              >
                <input
                  type="text"
                  autoFocus
                  placeholder="Search products, brands..."
                  className="w-full rounded-xl border border-[#1e1e2e] bg-[#12121a] px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-[#1e1e2e] bg-[#0a0a0f] md:hidden"
            >
              <nav className="flex flex-col gap-1 p-4">
                {navLinks.map(link => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-[#12121a] hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
                {[
                  { href: '/products?category=disposables', label: '↳ Disposables' },
                  { href: '/products?category=mods',        label: '↳ Mods & Kits' },
                  { href: '/products?category=e-liquids',   label: '↳ E-Liquids' },
                ].map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-[#12121a] hover:text-violet-400"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <CartDrawer open={isOpen} onClose={() => setOpen(false)} />
    </>
  )
}
