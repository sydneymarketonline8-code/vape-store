'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, FolderTree, Boxes, ShoppingCart, Ticket, Handshake,
  Users, Star, FileText, Files, Settings, Truck, CreditCard, LogOut, Menu, X, Cog,
} from 'lucide-react'

type Item = { href: string; label: string; icon: React.ComponentType<{ className?: string }> }
type Section = { title: string; items: Item[] }

const SECTIONS: Section[] = [
  { title: 'Overview', items: [{ href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard }] },
  {
    title: 'Catalog',
    items: [
      { href: '/admin/products', label: 'Products', icon: Package },
      { href: '/admin/categories', label: 'Categories', icon: FolderTree },
      { href: '/admin/inventory', label: 'Inventory', icon: Boxes },
    ],
  },
  {
    title: 'Sales',
    items: [
      { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
      { href: '/admin/coupons', label: 'Coupons', icon: Ticket },
      { href: '/admin/affiliate', label: 'Affiliate', icon: Handshake },
    ],
  },
  {
    title: 'Customers',
    items: [
      { href: '/admin/customers', label: 'Users', icon: Users },
      { href: '/admin/reviews', label: 'Reviews', icon: Star },
    ],
  },
  {
    title: 'Content',
    items: [
      { href: '/admin/blog', label: 'Blog Posts', icon: FileText },
      { href: '/admin/pages', label: 'Pages', icon: Files },
    ],
  },
  {
    title: 'Settings',
    items: [
      { href: '/admin/settings', label: 'General', icon: Settings },
      { href: '/admin/settings/shipping', label: 'Shipping', icon: Truck },
      { href: '/admin/settings/payments', label: 'Payments', icon: CreditCard },
    ],
  },
]

function NavContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      <div className="flex items-center gap-2 px-5 py-5">
        <Cog className="h-6 w-6 text-primary" />
        <span className="text-lg font-black tracking-tight text-white">Admin Panel</span>
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-6">
        {SECTIONS.map(section => (
          <div key={section.title}>
            <p className="px-3 pb-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(`${href}/`)
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={onNavigate}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                        active ? 'bg-primary font-medium text-white' : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
      <form action="/api/auth/logout" method="post" className="border-t border-neutral-800 p-3">
        <button type="submit" className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white">
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </form>
    </>
  )
}

export function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col bg-neutral-900 lg:flex">
        <NavContent pathname={pathname} />
      </aside>

      {/* Mobile top bar */}
      <div className="flex items-center gap-3 border-b border-neutral-200 bg-neutral-900 px-4 py-3 lg:hidden">
        <button type="button" aria-label="Open admin menu" onClick={() => setOpen(true)} className="text-white">
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-bold text-white">Admin Panel</span>
      </div>

      {/* Mobile drawer */}
      {open && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-neutral-900 lg:hidden">
            <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="absolute right-3 top-4 text-neutral-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
            <NavContent pathname={pathname} onNavigate={() => setOpen(false)} />
          </aside>
        </>
      )}
    </>
  )
}
