import Link from 'next/link'
import { Zap, Globe, MessageCircle, Users } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
                <Zap className="h-4 w-4 text-white" fill="white" />
              </div>
              <span className="text-lg font-bold text-white">
                Vape<span className="text-violet-400">Store</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-500 max-w-xs">
              Premium vaping products for adults 21+. Quality you can taste, service you can trust.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-zinc-500 hover:text-violet-400 transition-colors">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="text-zinc-500 hover:text-violet-400 transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="#" className="text-zinc-500 hover:text-violet-400 transition-colors">
                <Users className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">Shop</h3>
            <ul className="space-y-2">
              {[
                { href: '/products?category=disposables', label: 'Disposables' },
                { href: '/products?category=mods', label: 'Mods & Kits' },
                { href: '/products?category=e-liquids', label: 'E-Liquids' },
                { href: '/products?category=accessories', label: 'Accessories' },
                { href: '/products', label: 'All Products' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">
              Information
            </h3>
            <ul className="space-y-2">
              {[
                { href: '#', label: 'About Us' },
                { href: '#', label: 'Shipping Policy' },
                { href: '#', label: 'Returns & Refunds' },
                { href: '#', label: 'Contact Us' },
                { href: '#', label: 'FAQ' },
              ].map(link => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2">
              {[
                { href: '#', label: 'Privacy Policy' },
                { href: '#', label: 'Terms of Service' },
                { href: '#', label: 'Age Verification Policy' },
              ].map(link => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} VapeStore. All rights reserved. For adults 21+ only.
          </p>
          <p className="text-xs text-zinc-600">
            WARNING: This product contains nicotine. Nicotine is an addictive chemical.
          </p>
        </div>
      </div>
    </footer>
  )
}
