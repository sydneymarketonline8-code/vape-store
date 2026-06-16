'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { User, ChevronDown, LogOut } from 'lucide-react'
import { ACCOUNT_LINKS } from '@/lib/nav'

export interface AccountUser {
  name: string
  email: string
  initials: string
}

/** Authenticated → avatar + dropdown. Anonymous → Sign In / Create Account. */
export function AccountMenu({ user }: { user: AccountUser | null }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="hidden rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:inline-block"
        >
          Create Account
        </Link>
      </div>
    )
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 rounded-lg p-1 pr-2 text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
          {user.initials || <User className="h-4 w-4" />}
        </span>
        <ChevronDown className="hidden h-3.5 w-3.5 text-gray-400 sm:block" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl"
        >
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="truncate text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="truncate text-xs text-gray-500">{user.email}</p>
          </div>
          {ACCOUNT_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-primary focus-visible:bg-gray-50 focus-visible:outline-none"
            >
              {link.label}
            </Link>
          ))}
          <form action="/api/auth/logout" method="post" className="border-t border-gray-100">
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 focus-visible:bg-red-50 focus-visible:outline-none"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
