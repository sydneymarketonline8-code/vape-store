'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, Search as SearchIcon, X } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { useUser } from '@/lib/use-user'
import { SITE_TAGLINE } from '@/lib/site'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { SearchBar } from './search-bar'
import { CartIcon } from './cart-icon'
import { WishlistIcon } from './wishlist-icon'
import { AccountMenu } from './account-menu'
import { MegaMenu } from './mega-menu'
import { MobileMenu } from './mobile-menu'

function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`} aria-label="VapeHub home">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center sm:h-10 sm:w-10">
        <svg viewBox="0 0 32 32" className="h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="vh-hub" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#8B5CF6" />
              <stop offset="1" stopColor="#4C1D95" />
            </linearGradient>
          </defs>
          <path d="M16 1.6 28.1 8.6v14l-12.1 7-12.1-7v-14z" fill="url(#vh-hub)" />
          <g stroke="#ffffff" strokeWidth="1.1" opacity="0.55">
            <path d="M16 16 16 8.4M16 16l6.6-3.8M16 16l6.6 3.8M16 16v7.6M16 16l-6.6 3.8M16 16L9.4 12.2" />
          </g>
          <g fill="#ffffff">
            <circle cx="16" cy="16" r="3.4" />
            <circle cx="16" cy="8.4" r="1.9" />
            <circle cx="22.6" cy="12.2" r="1.9" />
            <circle cx="22.6" cy="19.8" r="1.9" />
            <circle cx="16" cy="23.6" r="1.9" />
            <circle cx="9.4" cy="19.8" r="1.9" />
            <circle cx="9.4" cy="12.2" r="1.9" />
          </g>
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-xl font-black tracking-tight text-primary sm:text-2xl">VAPEHUB</span>
        <span className="hidden text-[11px] font-medium uppercase tracking-widest text-gray-400 sm:block">
          {SITE_TAGLINE}
        </span>
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
