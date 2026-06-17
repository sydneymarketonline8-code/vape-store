'use client'

import { usePathname } from 'next/navigation'

/**
 * Hides storefront chrome (header, footer, announcement bar, WhatsApp FAB) on
 * /admin routes, which use their own dark-sidebar shell. Children still render
 * on the server; this just omits them from the admin tree.
 */
export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null
  return <>{children}</>
}
