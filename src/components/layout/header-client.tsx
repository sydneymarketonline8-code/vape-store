'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, Search as SearchIcon, X } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { useUser } from '@/lib/use-user'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { SearchBar } from './search-bar'
import { CartIcon } from './cart-icon'
import { WishlistIcon } from './wishlist-icon'
import { AccountMenu } from './account-menu'
import { MegaMenu } from './mega-menu'
import { MobileMenu } from './mobile-menu'

function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`flex flex-col leading-none ${className}`} aria-label="Aussie Vape home">
      <span className="text-xl font-black tracking-tight text-primary sm:text-2xl">AUSSIE VAPE</span>
      <span className="hidden text-[10px] font-medium uppercase tracking-widest text-gray-400 sm:block">
        Australia&apos;s #1 Online Vape Store
      </span>
    </Link>
  )
}

export function HeaderClient() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileSearch, setMobileSearch] = useState(false)
  const { isOpen, setOpen } = useCartStore()
  const user = useUser()

  // Condensed shadow after 60px of scroll.
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 60)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-white transition-shadow ${
          scrolled ? 'shadow-lg' : 'shadow-md'
        }`}
      >
        {/* ── Row 1 ── */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Mobile: hamburger */}
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo — centered on mobile, left on desktop */}
            <div className="flex flex-1 justify-center lg:flex-none lg:justify-start">
              <Logo />
            </div>

            {/* Desktop search (≈40% width) */}
            <div className="hidden flex-1 justify-center px-4 lg:flex">
              <div className="w-full max-w-md">
                <SearchBar />
              </div>
            </div>

            {/* Icon cluster */}
            <div className="flex items-center gap-1">
              {/* Mobile search toggle */}
              <button
                type="button"
                aria-label={mobileSearch ? 'Close search' : 'Search'}
                aria-expanded={mobileSearch}
                onClick={() => setMobileSearch(s => !s)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
              >
                {mobileSearch ? <X className="h-5 w-5" /> : <SearchIcon className="h-5 w-5" />}
              </button>

              <WishlistIcon className="hidden sm:flex" />
              <CartIcon />
              <div className="hidden lg:block">
                <AccountMenu user={user} />
              </div>
            </div>
          </div>

          {/* Mobile expanding search row */}
          {mobileSearch && (
            <div className="pb-3 lg:hidden">
              <SearchBar expanded autoFocus onNavigate={() => setMobileSearch(false)} />
            </div>
          )}
        </div>

        {/* ── Row 2: mega navigation (desktop only) ── */}
        <div className="hidden border-t border-gray-100 lg:block">
          <MegaMenu />
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} user={user} />
      <CartDrawer open={isOpen} onClose={() => setOpen(false)} />
    </>
  )
}
