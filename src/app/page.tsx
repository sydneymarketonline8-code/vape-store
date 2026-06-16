import Link from 'next/link'
import { ArrowRight, Star, Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react'
import { ProductCard } from '@/components/shop/product-card'
import { NewsletterForm } from '@/components/common/newsletter-form'
import { products } from '@/data/products'

const BRANDS = [
  { name: 'IGET',      href: '/products?brand=IGET' },
  { name: 'ALFAKHER',  href: '/products?brand=ALFAKHER' },
  { name: 'GUNNPOD',   href: '/products?brand=GUNNPOD' },
  { name: 'HQD',       href: '/products?brand=HQD' },
  { name: 'ALIBARBAR', href: '/products?brand=ALIBARBAR' },
  { name: 'RELX',      href: '/products?brand=RELX' },
  { name: 'JNR',       href: '/products?brand=JNR' },
  { name: 'ADALYA',    href: '/products?brand=ADALYA' },
  { name: 'ELUX',      href: '/products?brand=ELUX' },
  { name: 'Kuz',       href: '/products?brand=Kuz' },
  { name: 'BIMO',      href: '/products?brand=BIMO' },
  { name: 'BANG',      href: '/products?brand=BANG' },
]

const CATEGORIES = [
  { label: 'Disposable Vapes',   href: '/products?category=disposables', count: '1,697 products', emoji: '💨' },
  { label: 'Pod Systems & Kits', href: '/products?category=mods',        count: '29 products',    emoji: '🔋' },
  { label: 'E-Liquids & Salts',  href: '/products?category=e-liquids',   count: '173 flavours',   emoji: '💧' },
  { label: 'Nicotine Pouches',   href: '/products?category=pouches',     count: '105 products',   emoji: '🟢' },
  { label: 'Accessories',        href: '/products?category=accessories', count: '23 products',    emoji: '🎒' },
]

const TRUST_BADGES = [
  { icon: Truck,       label: 'Free AU Shipping',   sub: 'Orders over $300' },
  { icon: ShieldCheck, label: 'Age-Verified Store', sub: '18+ only' },
  { icon: RotateCcw,   label: '30-Day Returns',     sub: 'Hassle-free' },
  { icon: Headphones,  label: 'AU-Based Support',   sub: 'AEST business hours' },
  { icon: Star,        label: '4.8/5 Rated',        sub: '10,000+ reviews' },
]

export default function HomePage() {
  // Featured spotlight: IGET BAR 3500 PUFFS (as shown on real site)
  const featuredProduct =
    products.find(p => p.brand === 'IGET' && p.puffCount === 3500) ??
    products.find(p => p.brand === 'IGET') ??
    products[0]

  // Best sellers: ADALYA 16000 + ALFAKHER 15000 single units (no packs)
  const bestSellers = products
    .filter(p =>
      (p.brand === 'ADALYA') ||
      (p.brand === 'ALFAKHER' && p.puffCount === 15000 && !p.name.toLowerCase().includes('pack'))
    )
    .slice(0, 8)

  // New arrivals: ALFAKHER CROWN BAR 8000 PUFFS + 15000 packs
  const newArrivals = products
    .filter(p =>
      p.brand === 'ALFAKHER' &&
      (p.puffCount === 8000 || (p.puffCount === 15000 && p.name.toLowerCase().includes('pack')))
    )
    .slice(0, 8)

  return (
    <div className="bg-white">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="border-b border-gray-100 bg-gradient-to-br from-green-50 via-white to-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid min-h-[400px] grid-cols-1 items-center gap-8 py-16 lg:grid-cols-2">
            <div>
              <h1 className="mb-4 text-4xl font-black leading-tight text-gray-900 sm:text-5xl">
                Australia&apos;s #1 Online<br />
                <span className="text-[#1B7A3E]">Vape Store</span>
              </h1>
              <p className="mb-8 max-w-md text-lg text-gray-500">
                Premium vapes at wholesale prices. Trusted by 10,000+ customers across Australia.
                Fast dispatch, nation-wide.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/products?category=disposables"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1B7A3E] px-8 py-3.5 font-semibold text-white transition-colors hover:bg-[#156331]"
                >
                  Shop Disposables <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#1B7A3E] px-8 py-3.5 font-semibold text-[#1B7A3E] transition-colors hover:bg-green-50"
                >
                  Browse All Products
                </Link>
              </div>
            </div>

            {/* Featured product spotlight */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-72">
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
                  <div className="relative aspect-square bg-gray-50">
                    <img
                      src={featuredProduct.image}
                      alt={featuredProduct.name}
                      className="h-full w-full object-contain p-6"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-[#1B7A3E] px-2.5 py-0.5 text-xs font-bold text-white">
                      Top
                    </span>
                  </div>
                  <div className="border-t border-gray-100 p-4">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                      {featuredProduct.brand}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-sm font-semibold text-gray-900">
                      {featuredProduct.name}
                    </p>
                    <p className="mt-1 font-bold text-[#1B7A3E]">
                      from ${featuredProduct.price.toFixed(2)}
                    </p>
                    <Link
                      href={`/products/${featuredProduct.slug}`}
                      className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg bg-[#1B7A3E] py-2 text-sm font-semibold text-white hover:bg-[#156331]"
                    >
                      Shop <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust badges ─────────────────────────────────────── */}
      <section className="border-b border-gray-100 py-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50">
                  <Icon className="h-4 w-4 text-[#1B7A3E]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">{label}</p>
                  <p className="text-[11px] text-gray-400">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Shop by Category ─────────────────────────────────── */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Shop by Category</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.label}
                href={cat.href}
                className="group flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-5 text-center transition-all hover:border-[#1B7A3E] hover:shadow-sm"
              >
                <span className="text-3xl">{cat.emoji}</span>
                <p className="text-sm font-semibold text-gray-900 group-hover:text-[#1B7A3E]">{cat.label}</p>
                <p className="text-xs text-gray-400">{cat.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Aussie Vape Brands ───────────────────────────── */}
      <section className="border-y border-gray-100 bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Top Aussie Vape Brands</h2>
            <Link href="/products" className="flex items-center gap-1 text-sm font-medium text-[#1B7A3E] hover:underline">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {BRANDS.map(brand => (
              <Link
                key={brand.name}
                href={brand.href}
                className="shrink-0 rounded-xl border border-gray-200 bg-white px-6 py-4 text-sm font-bold text-gray-700 shadow-sm transition-all hover:border-[#1B7A3E] hover:text-[#1B7A3E] hover:shadow-md"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Best Sellers ─────────────────────────────────────── */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Best Sellers</h2>
            <Link href="/products?category=disposables" className="flex items-center gap-1 text-sm font-medium text-[#1B7A3E] hover:underline">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {bestSellers.map((product, i) => (
              <ProductCard key={product.id} product={product} badge={i < 2 ? 'top' : undefined} />
            ))}
          </div>
        </div>
      </section>

      {/* ── New Arrivals ─────────────────────────────────────── */}
      <section className="border-y border-gray-100 bg-gray-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
            <Link href="/products" className="flex items-center gap-1 text-sm font-medium text-[#1B7A3E] hover:underline">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={product} badge="new" />
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-[#1a3a2a] py-14">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
          <div className="mb-2 flex justify-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <h2 className="mb-2 text-2xl font-bold text-white">
            Join 10,000+ Australian Vapers
          </h2>
          <p className="mb-8 text-green-200">
            Get exclusive deals, new product alerts, and member-only discounts.
          </p>
          <NewsletterForm className="mx-auto max-w-md" />
        </div>
      </section>
    </div>
  )
}
