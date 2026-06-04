'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ShoppingBag, User, Menu, X, ChevronDown, Heart } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { useWishlistStore } from '@/lib/wishlist-store'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { motion, AnimatePresence } from 'framer-motion'

const NAV = [
  { href: '/', label: 'Home' },
  {
    href: '/products?category=disposables',
    label: 'Disposable Vapes',
    dropdown: [
      { href: '/products?category=disposables', label: 'All Disposables' },
      { href: '/products?brand=IGET',           label: 'IGET' },
      { href: '/products?brand=GUNNPOD',        label: 'Gunnpod' },
      { href: '/products?brand=HQD',            label: 'HQD' },
      { href: '/products?brand=ALFAKHER',       label: 'Alfakher' },
    ],
  },
  { href: '/products?category=mods',        label: 'Pod Systems' },
  { href: '/products?category=e-liquids',   label: 'Nicotine Salts' },
  { href: '/products?category=e-liquids',   label: 'E-Liquids' },
  { href: '/products?category=accessories', label: 'Accessories' },
  { href: '/products',                      label: 'Brands' },
  { href: '/products',                      label: 'Packs' },
  { href: '/products',                      label: 'Sale', highlight: true },
  { href: '#',                              label: 'Contact' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dispOpen,   setDispOpen]   = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { isOpen, setOpen, items }  = useCartStore()
  const wishlistCount               = useWishlistStore(s => s.items.length)
  const cartCount                   = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <>
      <header className="border-b border-gray-200 bg-white">
        {/* Top row: logo + icons */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">

            {/* Logo */}
            <Link href="/" className="flex flex-col leading-none">
              <span className="text-xl font-black tracking-tight text-[#1B7A3E] sm:text-2xl">
                AUSSIE VAPES
              </span>
              <span className="hidden text-[10px] font-medium uppercase tracking-widest text-gray-400 sm:block">
                Australia&apos;s #1 Online Vape Store
              </span>
            </Link>

            {/* Right icons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Search"
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <Search className="h-4 w-4" />
              </button>
              <Link
                href="#"
                aria-label="Wishlist"
                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <Heart className="h-4 w-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#1B7A3E] text-[9px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <button
                type="button"
                aria-label="Open cart"
                onClick={() => setOpen(true)}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <ShoppingBag className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#1B7A3E] text-[9px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </button>
              <Link
                href="/login"
                className="hidden h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 sm:flex"
              >
                <User className="h-4 w-4" />
              </Link>
              <button
                type="button"
                aria-label="Toggle menu"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:hidden"
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
                  placeholder="Search products..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#1B7A3E] focus:outline-none"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav row */}
        <div className="hidden border-t border-gray-100 lg:block">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-0">
              {NAV.map(link =>
                link.dropdown ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setDispOpen(true)}
                    onMouseLeave={() => setDispOpen(false)}
                  >
                    <button
                      type="button"
                      className="flex items-center gap-1 px-3 py-3 text-sm text-gray-700 transition-colors hover:text-[#1B7A3E]"
                    >
                      {link.label}
                      <ChevronDown className="h-3 w-3" />
                    </button>
                    <AnimatePresence>
                      {dispOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.12 }}
                          className="absolute left-0 top-full z-50 min-w-[200px] rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg"
                        >
                          {link.dropdown.map(item => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="block rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-green-50 hover:text-[#1B7A3E]"
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
                    className={`px-3 py-3 text-sm transition-colors hover:text-[#1B7A3E] ${
                      link.highlight
                        ? 'font-semibold text-red-600 hover:text-red-700'
                        : 'text-gray-700'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-gray-100 bg-white lg:hidden"
            >
              <nav className="flex flex-col p-4 gap-0.5">
                {NAV.map(link => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-green-50 hover:text-[#1B7A3E] ${
                      link.highlight ? 'font-semibold text-red-600' : 'text-gray-700'
                    }`}
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
