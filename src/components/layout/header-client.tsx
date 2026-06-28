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
    <Link href="/" className={`flex items-center gap-2 ${className}`} aria-label="Aussie Vape home">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#22934A] to-[#0f5128] shadow-sm sm:h-9 sm:w-9">
        <svg viewBox="0 0 32 32" className="h-5 w-5 sm:h-[22px] sm:w-[22px]" aria-hidden="true">
          <defs>
            <linearGradient id="av-drop" x1="16" y1="5.5" x2="16" y2="26.5" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#DCF1E4" />
            </linearGradient>
          </defs>
          <path d="M16 5.5C16 5.5 8.5 13.5 8.5 18.8a7.5 7.5 0 0 0 15 0C23.5 13.5 16 5.5 16 5.5Z" fill="url(#av-drop)" />
          <circle cx="12.8" cy="17.6" r="2.1" fill="#ffffff" opacity="0.6" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-xl font-black tracking-tight text-primary sm:text-2xl">AUSSIE VAPE</span>
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
