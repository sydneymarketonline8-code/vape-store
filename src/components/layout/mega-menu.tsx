'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { NAV_ITEMS, SHOP_CATEGORIES, type ShopCategory } from '@/lib/nav'
import { MegaMenuPanel } from './mega-menu-panel'

interface ApiCategory {
  slug: string
}

/**
 * Desktop nav row. The "Shop" item opens a full-width MegaMenuPanel on
 * hover/focus; other items are plain links. The panel's parent list is
 * reconciled against the live DB categories (/api/categories) but falls back
 * to the static taxonomy so it always renders.
 */
export function MegaMenu() {
  const [shopOpen, setShopOpen] = useState(false)
  const [categories, setCategories] = useState<ShopCategory[]>(SHOP_CATEGORIES)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Load DB categories once; keep only the taxonomy entries that exist there.
  useEffect(() => {
    let cancelled = false
    fetch('/api/categories', { cache: 'force-cache', next: { revalidate: 3600 } })
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (cancelled || !data?.categories?.length) return
        const slugs = new Set((data.categories as ApiCategory[]).map(c => c.slug))
        const filtered = SHOP_CATEGORIES.filter(c => slugs.has(c.slug))
        if (filtered.length) setCategories(filtered)
      })
      .catch(() => {/* keep static fallback */})
    return () => {
      cancelled = true
    }
  }, [])

  // Close on Escape.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setShopOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  function open() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setShopOpen(true)
  }
  // Small delay so moving the cursor into the panel doesn't close it.
  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setShopOpen(false), 120)
  }

  return (
    <div ref={wrapRef} className="relative" onMouseLeave={scheduleClose}>
      <nav className="mx-auto flex max-w-7xl items-center gap-1 px-4 sm:px-6 lg:px-8" aria-label="Primary">
        {NAV_ITEMS.map(item =>
          item.mega ? (
            <div key={item.label} onMouseEnter={open}>
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={shopOpen}
                onClick={() => setShopOpen(o => !o)}
                onFocus={open}
                className={`flex items-center gap-1 px-3 py-3 text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  shopOpen ? 'text-primary' : 'text-gray-700'
                }`}
              >
                {item.label}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${shopOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          ) : (
            <Link
              key={item.label}
              href={item.href}
              onMouseEnter={scheduleClose}
              className={`px-3 py-3 text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                item.highlight ? 'font-semibold text-red-600 hover:text-red-700' : 'text-gray-700'
              }`}
            >
              {item.label}
            </Link>
          )
        )}
      </nav>

      <AnimatePresence>
        {shopOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.14 }}
            onMouseEnter={open}
            className="absolute left-0 right-0 top-full z-50 border-t border-gray-100 bg-white shadow-xl"
          >
            <MegaMenuPanel categories={categories} onNavigate={() => setShopOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
