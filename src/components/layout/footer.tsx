import Link from 'next/link'
import { Zap } from 'lucide-react'
import { NewsletterForm } from '@/components/common/newsletter-form'

const SocialIcons = {
  Instagram: () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  Twitter: () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  Facebook: () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  Youtube: () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
}

const shopLinks = [
  { href: '/products?category=disposables', label: 'Disposables' },
  { href: '/products?category=mods',        label: 'Mods & Kits' },
  { href: '/products?category=e-liquids',   label: 'E-Liquids' },
  { href: '/products?category=accessories', label: 'Accessories' },
  { href: '/products',                      label: 'All Products' },
]
const helpLinks = [
  { href: '#', label: 'Contact Us' },
  { href: '#', label: 'FAQs' },
  { href: '#', label: 'Shipping Policy' },
  { href: '#', label: 'Returns & Refunds' },
  { href: '#', label: 'Age Verification Policy' },
]

export function Footer() {
  return (
    <footer className="border-t border-[#1e1e2e] bg-[#06060a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500">
                <Zap className="h-4 w-4 text-white" fill="white" />
              </div>
              <span className="font-heading text-xl font-bold tracking-wide">
                <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">AUSSIE</span>
                <span className="text-white"> VAPE</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Australia&apos;s premium online vape store. Quality products, fast dispatch, always for adults 18+.
            </p>
            <div className="flex gap-3">
              {([['Instagram', SocialIcons.Instagram], ['Twitter', SocialIcons.Twitter], ['Facebook', SocialIcons.Facebook], ['YouTube', SocialIcons.Youtube]] as const).map(([name, Icon]) => (
                <a
                  key={name}
                  href="#"
                  aria-label={name}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1e1e2e] bg-[#12121a] text-slate-500 transition-all hover:border-violet-500/50 hover:text-violet-400"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-heading mb-4 text-sm font-semibold tracking-widest text-white uppercase">Shop</h3>
            <ul className="space-y-2.5">
              {shopLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-500 transition-colors hover:text-violet-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-heading mb-4 text-sm font-semibold tracking-widest text-white uppercase">Help</h3>
            <ul className="space-y-2.5">
              {helpLinks.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-slate-500 transition-colors hover:text-violet-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-heading mb-1 text-sm font-semibold tracking-widest text-white uppercase">Newsletter</h3>
            <p className="mb-4 text-sm text-slate-500">Join 10,000+ vapers. Get exclusive deals.</p>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#1e1e2e] pt-8 sm:flex-row">
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} Aussie Vape. All rights reserved. For adults 18+ only.</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 mr-1">We accept:</span>
            {['VISA', 'MC', 'AMEX', 'PayPal', 'Apple Pay'].map(p => (
              <span key={p} className="rounded border border-[#1e1e2e] bg-[#12121a] px-2 py-0.5 text-[10px] font-medium text-slate-500">
                {p}
              </span>
            ))}
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-slate-700">
          WARNING: This product contains nicotine, which is an addictive chemical.
        </p>
      </div>
    </footer>
  )
}
