import Link from 'next/link'
import { Truck, ShieldCheck, RotateCcw, Headphones, Boxes } from 'lucide-react'
import { SITE_TAGLINE, SOCIAL_LINKS } from '@/lib/site'
import { STATES } from '@/data/locations'

const SocialIcons = {
  Instagram: () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  Facebook: () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  Twitter: () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
}

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex flex-col leading-none">
              <span className="text-lg font-black tracking-tight text-[#1B7A3E]">AUSSIE VAPE</span>
              <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400">
                {SITE_TAGLINE}
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Australia&apos;s leading online vape wholesale supplier. Fast dispatch, Australia-wide.
            </p>
            {SOCIAL_LINKS.length > 0 && (
              <div className="flex gap-2">
                {SOCIAL_LINKS.map(({ name, url }) => {
                  const Icon = SocialIcons[name]
                  return (
                    <a
                      key={name}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={name}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-400 transition-all hover:border-[#1B7A3E] hover:text-[#1B7A3E]"
                    >
                      <Icon />
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* Shop */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-900">Shop</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/products?category=disposables', label: 'Disposable Vapes' },
                { href: '/products?category=mods',        label: 'Pod Systems & Kits' },
                { href: '/products?category=e-liquids',   label: 'E-Liquids & Salts' },
                { href: '/products?category=pouches',     label: 'Nicotine Pouches' },
                { href: '/products?category=accessories', label: 'Accessories' },
                { href: '/categories',                    label: 'All Categories' },
                { href: '/deals',                         label: 'Package Deals' },
                { href: '/products?sale=true',            label: 'Sale' },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-gray-500 transition-colors hover:text-[#1B7A3E]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-900">Support</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/contact',         label: 'Contact Us' },
                { href: '/order-tracking',  label: 'Order Tracking' },
                { href: '/shipping',        label: 'Shipping Policy' },
                { href: '/vape-delivery',   label: 'Vape Delivery' },
                { href: '/returns',         label: 'Returns & Refunds' },
                { href: '/beginners-guide', label: 'Beginners Guide' },
                { href: '/faq',             label: 'FAQ' },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-gray-500 transition-colors hover:text-[#1B7A3E]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-900">Account</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/account',      label: 'My Account' },
                { href: '/wishlist',     label: 'Wishlist' },
                { href: '/about',        label: 'About' },
                { href: '/vaping-laws',  label: 'Vaping Laws' },
                { href: '/wholesale',    label: 'Bulk & Wholesale' },
                { href: '/blog',         label: 'Blog' },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-gray-500 transition-colors hover:text-[#1B7A3E]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-10 grid grid-cols-2 gap-3 border-t border-gray-200 pt-8 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { Icon: Truck,       label: 'Free AU Shipping',   sub: 'Orders over $300', href: '/shipping',    aria: 'Free Australia-wide shipping on orders over $300' },
            { Icon: ShieldCheck, label: 'Age-Verified Store', sub: '18+ only',         href: '/vaping-laws', aria: 'Age-verified store for adults 18 and over' },
            { Icon: RotateCcw,   label: '30-Day Returns',     sub: 'Unopened items',   href: '/returns',     aria: '30-day hassle-free returns on unopened Aussie Vape products' },
            { Icon: Headphones,  label: 'AU-Based Support',   sub: 'WhatsApp & email', href: '/contact',     aria: 'Australian-based customer support via WhatsApp and email' },
            { Icon: Boxes,       label: '2,000+ Products',    sub: 'In stock now',     href: '/products',    aria: 'Over 2,000 vape products in stock and ready to ship Australia-wide' },
          ].map(({ Icon, label, sub, href, aria }) => (
            <Link key={label} href={href} aria-label={aria} title={aria} className="-m-1 flex items-center gap-3 rounded-lg p-1 transition-colors hover:bg-gray-50">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50">
                <Icon className="h-4 w-4 text-[#1B7A3E]" />
              </span>
              <div>
                <p className="text-xs font-semibold text-gray-800">{label}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* SEO text block */}
        <div className="mt-10 border-t border-gray-200 pt-8">
          <h2 className="text-sm font-bold text-gray-800">Buy Vapes &amp; Vape Deals Online in Australia</h2>
          <p className="mt-2 max-w-4xl text-xs leading-relaxed text-gray-400">
            Aussie Vape is an Australian online vape store specialising in vape deals, multi-pack bundles and bulk packs. Shop{' '}
            <Link href="/collections/disposables" className="hover:text-[#1B7A3E]">disposable vapes</Link>,{' '}
            <Link href="/collections/mods" className="hover:text-[#1B7A3E]">pod systems</Link>,{' '}
            <Link href="/collections/e-liquids" className="hover:text-[#1B7A3E]">e-liquids and nicotine salts</Link> and{' '}
            <Link href="/collections/pouches" className="hover:text-[#1B7A3E]">nicotine pouches</Link> from brands like{' '}
            <Link href="/products?brand=ALFAKHER" className="hover:text-[#1B7A3E]">ALFAKHER Crown Bar</Link> and{' '}
            <Link href="/products?brand=IGET" className="hover:text-[#1B7A3E]">IGET</Link>, with fast AU-wide shipping and free delivery on orders over $300. Buying for a store? See{' '}
            <Link href="/wholesale" className="hover:text-[#1B7A3E]">wholesale vapes</Link>. New to vaping or checking the rules? Read our{' '}
            <Link href="/beginners-guide" className="hover:text-[#1B7A3E]">beginners guide</Link> and{' '}
            <Link href="/vaping-laws" className="hover:text-[#1B7A3E]">vaping laws</Link> pages.
          </p>
          <p className="mt-3 text-xs text-gray-400">
            <span className="font-semibold text-gray-500">Vape delivery by state:</span>{' '}
            {STATES.map((s, i) => (
              <span key={s.slug}>
                {i > 0 && <span className="text-gray-300"> · </span>}
                <Link href={`/vape-delivery/${s.slug}`} className="hover:text-[#1B7A3E]">{s.abbr}</Link>
              </span>
            ))}
          </p>
        </div>

        {/* Legal links */}
        <div className="mt-8 flex flex-wrap justify-center gap-x-4 gap-y-2 border-t border-gray-200 pt-6 text-xs text-gray-400">
          {[
            { href: '/terms', label: 'Terms of Service' },
            { href: '/privacy', label: 'Privacy Policy' },
            { href: '/vaping-laws', label: 'Vaping Laws' },
            { href: '/shipping', label: 'Shipping' },
            { href: '/returns', label: 'Returns' },
            { href: '/contact', label: 'Contact' },
          ].map(l => (
            <Link key={l.href} href={l.href} className="hover:text-[#1B7A3E]">{l.label}</Link>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Aussie Vape. All rights reserved. For adults 18+ only.
          </p>
          <p className="text-xs text-gray-400">
            WARNING: Nicotine is an addictive chemical.
          </p>
        </div>
      </div>
    </footer>
  )
}
