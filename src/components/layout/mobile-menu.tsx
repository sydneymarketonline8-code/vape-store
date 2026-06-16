'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ChevronDown, LogOut } from 'lucide-react'
import { NAV_ITEMS, SHOP_CATEGORIES, ACCOUNT_LINKS } from '@/lib/nav'
import type { AccountUser } from './account-menu'

/** Full-screen left drawer with accordion categories + account/newsletter footer. */
export function MobileMenu({
  open,
  onClose,
  user,
}: {
  open: boolean
  onClose: () => void
  user: AccountUser | null
}) {
  const [expanded, setExpanded] = useState<string | null>(null)

  // Lock body scroll while open.
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [open])

  // Close on Escape.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 lg:hidden"
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            className="fixed inset-y-0 left-0 z-50 flex w-[88%] max-w-sm flex-col bg-white shadow-2xl lg:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
              <span className="text-lg font-black tracking-tight text-primary">AUSSIE VAPES</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable nav */}
            <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Mobile">
              {NAV_ITEMS.map(item =>
                item.mega ? (
                  <div key={item.label} className="border-b border-gray-50">
                    {SHOP_CATEGORIES.map(cat => {
                      const isOpen = expanded === cat.slug
                      return (
                        <div key={cat.slug}>
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            onClick={() => setExpanded(isOpen ? null : cat.slug)}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50"
                          >
                            {cat.label}
                            <ChevronDown
                              className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            />
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden pl-3"
                              >
                                {cat.subcategories.map(sub => (
                                  <li key={sub.href}>
                                    <Link
                                      href={sub.href}
                                      onClick={onClose}
                                      className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary"
                                    >
                                      {sub.label}
                                    </Link>
                                  </li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onClose}
                    className={`block rounded-lg px-3 py-3 text-sm font-medium hover:bg-gray-50 ${
                      item.highlight ? 'text-red-600' : 'text-gray-800'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            {/* Footer: account + newsletter */}
            <div className="border-t border-gray-100 bg-gray-50 px-4 py-4">
              {user ? (
                <>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {user.initials}
                    </span>
                    <span className="truncate text-sm font-medium text-gray-800">{user.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {ACCOUNT_LINKS.map(link => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={onClose}
                        className="rounded-md px-2 py-1.5 text-sm text-gray-600 hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  <form action="/api/auth/logout" method="post" className="mt-2">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-red-600"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="flex-1 rounded-lg border border-gray-300 py-2.5 text-center text-sm font-medium text-gray-700"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={onClose}
                    className="flex-1 rounded-lg bg-primary py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Create Account
                  </Link>
                </div>
              )}

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Get deals &amp; new drops
                </p>
                <form
                  className="mt-2 flex gap-2"
                  action="/api/newsletter"
                  method="post"
                  onSubmit={e => e.preventDefault()}
                >
                  <input
                    type="email"
                    required
                    placeholder="Your email"
                    className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white"
                  >
                    Join
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
