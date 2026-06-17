'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, Ticket, User, Heart, Users, LogOut } from 'lucide-react'

const NAV = [
  { href: '/account/orders', label: 'My Orders', icon: Package },
  { href: '/account/coupons', label: 'Discount Coupons', icon: Ticket },
  { href: '/account/profile', label: 'Account Info', icon: User },
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/account/referral', label: 'Referral Program', icon: Users },
] as const

export function AccountSidebar({
  name,
  email,
  initials,
  avatarUrl,
}: {
  name: string
  email: string
  initials: string
  avatarUrl: string | null
}) {
  const pathname = usePathname()

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      {/* User card */}
      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4">
        {avatarUrl ? (
          <Image src={avatarUrl} alt={name} width={48} height={48} className="h-12 w-12 rounded-full object-cover" unoptimized />
        ) : (
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            {initials}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">{name}</p>
          <p className="truncate text-xs text-gray-500">{email}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="mt-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          )
        })}

        <form action="/api/auth/logout" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </form>
      </nav>
    </aside>
  )
}
