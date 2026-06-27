import Link from 'next/link'
import { ArrowRight, Truck, RotateCcw, ShieldCheck, Headphones, Boxes, Mail, Tag } from 'lucide-react'
import { ProductCard } from '@/components/shop/product-card'
import { CategoryIcon } from '@/components/icons/category-icons'
import { HeroIntro } from '@/components/common/hero-intro'
import { HeroDeals, type HeroSlide } from '@/components/common/hero-deals'
import { NewsletterForm } from '@/components/common/newsletter-form'
import { products } from '@/data/products'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.aussievape.com.au'

// Category tiles link to the canonical /collections/[slug] pages (not the legacy
// /products?category= filter). Counts are computed from the catalogue, not hardcoded.
const CATEGORY_META: { slug: string; label: string; unit: string }[] = [
  { slug: 'disposables', label: 'Disposable Vapes',   unit: 'products' },
  { slug: 'mods',        label: 'Pod Systems & Kits', unit: 'products' },
  { slug: 'e-liquids',   label: 'E-Liquids & Salts',  unit: 'flavours' },
  { slug: 'pouches',     label: 'Nicotine Pouches',   unit: 'products' },
  { slug: 'accessories', label: 'Accessories',        unit: 'products' },
]

const TRUST_BADGES = [
  { icon: Truck,       label: 'Free AU Shipping',   sub: 'Orders over $300' },
  { icon: ShieldCheck, label: 'Age-Verified Store', sub: '18+ only' },
  { icon: RotateCcw,   label: '30-Day Returns',     sub: 'Unopened items' },
  { icon: Headphones,  label: 'AU-Based Support',   sub: 'WhatsApp & email' },
  { icon: Boxes,       label: '2,000+ Products',    sub: 'In stock now' },
]

export default function HomePage() {
  // ── Real, data-derived counts ────────────────────────────────────────────
  const categoryCounts: Record<string, number> = {}
  const brandCounts: Record<string, number> = {}
  for (const p of products) {
    categoryCounts[p.category] = (categoryCounts[p.category] ?? 0) + 1
    if (p.brand) brandCounts[p.brand] = (brandCounts[p.brand] ?? 0) + 1
  }

  // Best sellers: in-stock, ranked by popularity proxy (featured, then review volume).
  const popularity = (p: (typeof products)[number]) =>
    (p.featured ? 1_000_000 : 0) + (p.reviewCount ?? 0)
  const bestSellers = products
    .filter(p => p.inStock)
    .sort((a, b) => popularity(b) - popularity(a))
    .slice(0, 8)

  // Shop by Brand: real top brands with at least 4 products, each showing its top 4.
  const brandShowcase = Object.entries(brandCounts)
    .filter(([, n]) => n >= 4)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([brand, count]) => ({
      brand,
      count,
      products: products
        .filter(p => p.brand === brand)
        .sort((a, b) => popularity(b) - popularity(a))
        .slice(0, 4),
    }))

  // Package deals: bundle/multi-pack products, real max saving, available pack sizes.
  const discountPct = (p: (typeof products)[number]) =>
    p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0
  const bundles = products.filter(p => p.tags?.includes('bundle'))
  const maxDiscount = bundles.length ? Math.max(...bundles.map(discountPct)) : 0
  const topDeals = [...bundles].sort((a, b) => discountPct(b) - discountPct(a)).slice(0, 4)
  const packSizes = [3, 5, 10, 20].filter(n =>
    bundles.some(p => new RegExp(`\\b${n}\\s*PACK\\b`, 'i').test(p.name))
  )

  // Hero deals carousel: genuine markdowns (real originalPrice) ranked by discount,
  // padded with the most popular in-stock products to fill 8 slides. Serialisable only.
  const markdowns = products
    .filter(p => p.inStock && p.originalPrice)
    .sort((a, b) => discountPct(b) - discountPct(a))
  const heroFill = products
    .filter(p => p.inStock && !markdowns.includes(p))
    .sort((a, b) => popularity(b) - popularity(a))
  const heroDeals: HeroSlide[] = [...markdowns, ...heroFill].slice(0, 8).map(p => ({
    slug: p.slug,
    brand: p.brand,
    name: p.name,
    image: p.image,
    price: p.price,
    originalPrice: p.originalPrice ?? null,
    discountPct: discountPct(p) || null,
  }))

  // ItemList JSON-LD for the best-seller carousel (links only — no fabricated ratings).
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best-selling vapes at Aussie Vape',
    itemListElement: bestSellers.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `${SITE_URL}/products/${p.slug}`,
    })),
  }

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="border-b border-gray-100 bg-gradient-to-br from-green-50 via-white to-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <div className="max-w-2xl">
            <HeroIntro />
          </div>

          {/* Full-width rotating deals banner (data computed server-side, above) */}
          <HeroDeals slides={heroDeals} className="mt-10" />
        </div>
      </section>

      {/* ── Trust badges ─────────────────────────────────────── */}
      <section className="border-b border-gray-100 py-5" aria-label="Why shop with Aussie Vape">
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
      <section className="py-14" aria-label="Shop by category">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Shop All Vape Categories</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {CATEGORY_META.map(cat => (
              <Link
                key={cat.slug}
                href={`/collections/${cat.slug}`}
                className="group flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-5 text-center transition-all hover:border-[#1B7A3E] hover:shadow-sm"
              >
                <CategoryIcon slug={cat.slug} className="h-11 w-11 transition-transform group-hover:scale-110" />
                <p className="text-sm font-semibold text-gray-900 group-hover:text-[#1B7A3E]">{cat.label}</p>
                <p className="text-xs text-gray-400">
                  {(categoryCounts[cat.slug] ?? 0).toLocaleString()} {cat.unit}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Best Sellers ─────────────────────────────────────── */}
      <section className="border-y border-gray-100 bg-gray-50 py-14" aria-label="Best selling vapes">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Best Sellers</h2>
            <Link href="/collections/disposables" className="flex items-center gap-1 text-sm font-medium text-[#1B7A3E] hover:underline">
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

      {/* ── Package Deals ────────────────────────────────────── */}
      {topDeals.length > 0 && (
        <section className="py-14" aria-label="Vape package deals">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <div className="grid gap-6 bg-gradient-to-br from-rose-600 to-red-900 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                    <Tag className="h-3.5 w-3.5" /> Buy More, Save More
                  </span>
                  <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Save up to {maxDiscount}% on Vape Packs</h2>
                  <p className="mt-2 max-w-xl text-sm text-white/80">
                    Multi-pack bundles on Australia&apos;s favourite vapes — the bigger the pack, the less you pay per device.
                  </p>
                  {packSizes.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {packSizes.map(n => (
                        <Link
                          key={n}
                          href={`/products?pack=${n}`}
                          className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/20"
                        >
                          {n}-Pack
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <Link
                  href="/deals"
                  className="inline-flex h-fit items-center gap-1.5 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-white/90"
                >
                  Shop all deals <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-white p-6 sm:gap-5 sm:p-8 lg:grid-cols-4">
                {topDeals.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Shop by Brand (real top brands, top 4 each) ──────── */}
      {brandShowcase.map(({ brand, count, products: brandProducts }) => (
        <section
          key={brand}
          id={`brand-${brand.toLowerCase().replace(/\s+/g, '-')}`}
          aria-label={`${brand} vapes Australia`}
          className="py-14 [&:nth-of-type(even)]:border-y [&:nth-of-type(even)]:border-gray-100 [&:nth-of-type(even)]:bg-gray-50"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{brand}</h2>
                <p className="mt-1 text-sm text-gray-500">{count.toLocaleString()} products in stock</p>
              </div>
              <Link
                href={`/products?brand=${encodeURIComponent(brand)}`}
                className="flex shrink-0 items-center gap-1 text-sm font-medium text-[#1B7A3E] hover:underline"
              >
                View all {brand} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {brandProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ── SEO copy (factual, no health claims) ─────────────── */}
      <section className="border-t border-gray-100 py-14" aria-label="About Aussie Vape">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Buy Vapes Online in Australia</h2>
          <div className="space-y-4 text-sm leading-relaxed text-gray-600">
            <p>
              Aussie Vape is an Australian online vape store stocking over 2,000 products — from{' '}
              <Link href="/collections/disposables" className="text-[#1B7A3E] hover:underline">disposable vapes</Link> and{' '}
              <Link href="/collections/mods" className="text-[#1B7A3E] hover:underline">pod systems</Link> to{' '}
              <Link href="/collections/e-liquids" className="text-[#1B7A3E] hover:underline">e-liquids and nicotine salts</Link>,{' '}
              <Link href="/collections/pouches" className="text-[#1B7A3E] hover:underline">nicotine pouches</Link> and{' '}
              <Link href="/collections/accessories" className="text-[#1B7A3E] hover:underline">accessories</Link>. Browse
              leading brands including IGET, HQD, GUNNPOD and Lost Mary, with new stock added regularly and fast dispatch
              Australia-wide.
            </p>
            <p>
              Orders over $300 ship free, and every order is age-verified (18+) in line with Australian requirements. New
              to vaping? Our{' '}
              <Link href="/beginners-guide" className="text-[#1B7A3E] hover:underline">beginners guide</Link> explains the
              device types and how to choose, and our{' '}
              <Link href="/vaping-laws" className="text-[#1B7A3E] hover:underline">vaping laws</Link> page covers the
              current Australian rules. For bulk orders see{' '}
              <Link href="/wholesale" className="text-[#1B7A3E] hover:underline">wholesale</Link>, or visit our{' '}
              <Link href="/faq" className="text-[#1B7A3E] hover:underline">FAQ</Link> for shipping, payment and returns.
            </p>
          </div>
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-[#1a3a2a] py-14" aria-label="Newsletter signup">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
          <div className="mb-3 flex justify-center">
            <Mail className="h-7 w-7 text-green-300" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-white">Join the Aussie Vape Newsletter</h2>
          <p className="mb-8 text-green-200">
            Get new product alerts, restock notifications and member-only discounts.
          </p>
          <NewsletterForm className="mx-auto max-w-md" />
        </div>
      </section>
    </div>
  )
}
