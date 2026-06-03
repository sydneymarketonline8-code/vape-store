import Link from 'next/link'
import { ArrowRight, Zap, Star } from 'lucide-react'
import { ProductCard } from '@/components/shop/product-card'
import { CountdownTimer } from '@/components/common/countdown-timer'
import { NewsletterForm } from '@/components/common/newsletter-form'
import { getFeaturedProducts, products } from '@/data/products'

const BRANDS = [
  { name: 'IGET',      color: 'from-violet-500 to-purple-700' },
  { name: 'ALFAKHER',  color: 'from-amber-500 to-orange-700' },
  { name: 'GUNNPOD',   color: 'from-emerald-500 to-green-700' },
  { name: 'HQD',       color: 'from-blue-500 to-indigo-700' },
  { name: 'ALIBARBAR', color: 'from-pink-500 to-rose-700' },
  { name: 'RELX',      color: 'from-cyan-500 to-teal-700' },
  { name: 'JNR',       color: 'from-orange-500 to-red-700' },
  { name: 'ADALYA',    color: 'from-indigo-500 to-violet-700' },
  { name: 'ELUX',      color: 'from-teal-500 to-cyan-700' },
  { name: 'Kuz',       color: 'from-rose-500 to-pink-700' },
]

const CATEGORY_PILLS = [
  { label: 'All',          href: '/products' },
  { label: 'Disposables',  href: '/products?category=disposables' },
  { label: 'Mods & Kits',  href: '/products?category=mods' },
  { label: 'E-Liquids',    href: '/products?category=e-liquids' },
  { label: 'Accessories',  href: '/products?category=accessories' },
]

export default function HomePage() {
  const featured  = getFeaturedProducts()
  const hotDeals  = products.slice(10, 14).map(p => ({
    ...p,
    originalPrice: Math.ceil(p.price * 1.25 / 5) * 5,
  }))

  return (
    <div>
      {/* ── Section 1: Hero ──────────────────────────────────── */}
      <section className="relative flex min-h-[500px] items-center overflow-hidden">
        {/* Glow orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-violet-700/15 blur-3xl" />
          <div className="absolute right-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-cyan-600/10 blur-3xl" />
          {/* Subtle dot grid */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-400">
              <Zap className="h-3.5 w-3.5" />
              Australia&apos;s #1 Online Vape Store
            </div>
            <h1 className="font-heading mb-4 text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
              Premium Vapes.{' '}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Unbeatable Prices.
              </span>
            </h1>
            <p className="mb-10 max-w-lg text-lg leading-relaxed text-slate-400">
              Shop the latest disposables, mods, and e-liquids from the world&apos;s top brands.
              Fast dispatch. Free shipping on orders over $99.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-4 font-semibold text-white transition-all hover:from-violet-500 hover:to-cyan-400 hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] active:scale-95"
              >
                Shop Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-500/40 px-8 py-4 font-semibold text-cyan-400 transition-all hover:border-cyan-400 hover:bg-cyan-500/10"
              >
                View Deals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Category Pills ────────────────────────── */}
      <section className="border-y border-[#1e1e2e] bg-[#0d0d15] py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORY_PILLS.map((pill, i) => (
              <Link
                key={pill.label}
                href={pill.href}
                className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  i === 0
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white'
                    : 'border border-[#1e1e2e] text-slate-400 hover:border-violet-500/50 hover:text-violet-400'
                }`}
              >
                {pill.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Featured Products ─────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-heading text-3xl font-bold text-white">Featured Products</h2>
              <p className="mt-1 text-slate-500">Handpicked favourites from our collection</p>
            </div>
            <Link href="/products" className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300 transition-colors">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} isNew={i < 2} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Brands Row ─────────────────────────────── */}
      <section className="border-y border-[#1e1e2e] bg-[#0d0d15] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading mb-8 text-center text-2xl font-bold text-white">
            Shop by Brand
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {BRANDS.map(brand => (
              <Link
                key={brand.name}
                href={`/products?brand=${brand.name}`}
                className="group flex shrink-0 flex-col items-center gap-2"
              >
                <div className="relative overflow-hidden rounded-xl border border-[#1e1e2e] bg-[#12121a] p-5 transition-all duration-300 hover:border-violet-500/40 hover:shadow-[0_0_20px_rgba(124,58,237,0.12)]">
                  <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${brand.color}`} />
                  <span className="font-heading block min-w-[80px] text-center text-sm font-bold text-white">
                    {brand.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: Hot Deals ──────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading text-3xl font-bold text-white">
                🔥 Hot Deals
              </h2>
              <p className="mt-1 text-slate-500">Limited time offers — ends tonight</p>
            </div>
            <CountdownTimer />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {hotDeals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 6: Newsletter ─────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-900/30 via-[#12121a] to-cyan-900/20 p-10 text-center">
            {/* Glow */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-0 h-56 w-96 -translate-x-1/2 rounded-full bg-violet-700/20 blur-3xl" />
            </div>
            <div className="relative">
              <div className="mb-2 flex justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <h2 className="font-heading mb-2 text-3xl font-bold text-white">
                Join 10,000+ Vapers
              </h2>
              <p className="mx-auto mb-8 max-w-md text-slate-400">
                Get exclusive deals, new product drops, and member-only discounts straight to your inbox.
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
