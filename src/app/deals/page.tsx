import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Tag, Package, Truck, BadgePercent } from 'lucide-react'
import { products } from '@/data/products'
import type { Product } from '@/types'
import { COLLECTIONS } from '@/lib/collections'
import { ProductCard } from '@/components/shop/product-card'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.aussievape.com.au'

const popularity = (p: Product) => (p.featured ? 1_000_000 : 0) + (p.reviewCount ?? 0)
const discountPct = (p: Product) => (p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0)

const bundles = products.filter(p => p.tags?.includes('bundle'))
const maxDiscount = bundles.length ? Math.max(...bundles.map(discountPct)) : 0

export const metadata: Metadata = {
  title: 'Vape Package Deals & Bundle Packs',
  description: `Save up to ${maxDiscount}% on vape multi-packs at Aussie Vape — IGET, ALFAKHER, GUNNPOD and more in 3, 5, 10 & 20-packs. Fast AU shipping, free over $300.`,
  alternates: { canonical: '/deals' },
}

export default function DealsPage() {
  // Top package deals — biggest real discounts first.
  const deals = [...bundles]
    .sort((a, b) => discountPct(b) - discountPct(a) || popularity(b) - popularity(a))
    .slice(0, 8)

  // Real savings-by-pack-size: average discount of bundles whose name says "N PACK".
  const tiers = [3, 5, 10, 20]
    .map(n => {
      const inSize = bundles.filter(p => new RegExp(`\\b${n}\\s*PACK\\b`, 'i').test(p.name))
      const ds = inSize.map(discountPct).filter(Boolean)
      return { n, count: inSize.length, avg: ds.length ? Math.round(ds.reduce((a, b) => a + b, 0) / ds.length) : 0 }
    })
    .filter(t => t.count > 0)

  // Brands that actually have pack products.
  const brandCounts: Record<string, number> = {}
  for (const p of bundles) if (p.brand && p.brand !== 'OTHER') brandCounts[p.brand] = (brandCounts[p.brand] ?? 0) + 1
  const packBrands = Object.entries(brandCounts).sort((a, b) => b[1] - a[1]).slice(0, 10)

  // 4 top products from each high-volume category (>= 100 products).
  const counts: Record<string, number> = {}
  for (const p of products) counts[p.category] = (counts[p.category] ?? 0) + 1
  const categoryRows = COLLECTIONS.map(c => ({ ...c, count: counts[c.slug] ?? 0 }))
    .filter(c => c.count >= 100)
    .sort((a, b) => b.count - a.count)
    .map(c => ({
      ...c,
      top: products
        .filter(p => p.category === c.slug && !p.tags?.includes('bundle'))
        .sort((a, b) => popularity(b) - popularity(a))
        .slice(0, 4),
    }))

  const dealsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Vape package deals at Aussie Vape',
    itemListElement: deals.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `${SITE_URL}/products/${p.slug}`,
    })),
  }
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Deals', item: `${SITE_URL}/deals` },
    ],
  }
  const faqs = [
    {
      q: 'How much do I save buying packs?',
      a: `Multi-packs are priced below buying singly — up to ${maxDiscount}% off per device. The discount is already in the pack price, so there are no codes to enter.`,
    },
    { q: 'Do pack orders get free shipping?', a: 'Orders over $300 ship free Australia-wide, and larger packs often qualify automatically. Everything dispatches fast from Australia.' },
    { q: 'Which brands have pack deals?', a: `${packBrands.slice(0, 6).map(([b]) => b).join(', ')} and more — ${bundles.length} pack products in total across 3, 5, 10 and 20-packs.` },
    { q: 'Can I buy packs for wholesale?', a: 'Yes — larger packs give the best per-unit price. See our wholesale page for trade pricing and bulk enquiries.' },
  ]
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dealsJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-600 to-red-900">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1.5 text-xs text-white/60">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>›</span>
            <span aria-current="page" className="text-white/80">Deals</span>
          </nav>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
            <Tag className="h-3.5 w-3.5" /> Buy More, Save More
          </span>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Save up to {maxDiscount}% on Vape Packs</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/80">
            Multi-pack and bundle deals on Australia&apos;s favourite vapes — buy in 3, 5, 10 or 20-packs and pay less per
            device. Genuine stock, fast dispatch, free shipping on orders over $300.
          </p>
          <Link href="/products?packs=true" className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-white/90">
            Shop all packs <ArrowRight className="h-4 w-4" />
          </Link>

          {/* Real savings-by-pack-size tiers */}
          {tiers.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {tiers.map(t => (
                <div key={t.n} className="rounded-xl border border-white/15 bg-white/10 p-4 text-center">
                  <p className="text-xs font-medium text-white/70">{t.n}-Pack</p>
                  <p className="mt-1 text-2xl font-bold text-white">~{t.avg}%</p>
                  <p className="text-[11px] text-white/60">avg saving · {t.count} deals</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-gray-100 py-10" aria-label="How pack savings work">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            { icon: Package, title: 'Pick a pack size', desc: 'Choose 3, 5, 10 or 20 — the bigger the pack, the lower the price per device.' },
            { icon: BadgePercent, title: 'Discount is built in', desc: `The pack price is already reduced (up to ${maxDiscount}% off). No codes to enter.` },
            { icon: Truck, title: 'Free shipping $300+', desc: 'Larger packs often qualify for free AU-wide shipping. Fast dispatch from Australia.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
                <Icon className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{title}</p>
                <p className="mt-0.5 text-sm text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top package deals */}
      <section className="py-12" aria-label="Package deals">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Top Package Deals</h2>
            <Link href="/products?packs=true" className="flex items-center gap-1 text-sm font-medium text-[#1B7A3E] hover:underline">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {deals.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {deals.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No package deals available right now — check back soon.</p>
          )}
        </div>
      </section>

      {/* Shop packs by brand */}
      {packBrands.length > 0 && (
        <section className="border-y border-gray-100 bg-gray-50 py-10" aria-label="Shop packs by brand">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-5 text-xl font-bold text-gray-900">Shop Packs by Brand</h2>
            <div className="flex flex-wrap gap-2">
              {packBrands.map(([brand, count]) => (
                <Link
                  key={brand}
                  href={`/products?brand=${encodeURIComponent(brand)}&packs=true`}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-[#1B7A3E] hover:text-[#1B7A3E]"
                >
                  {brand} <span className="text-xs text-gray-400">{count}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top products from the highest-volume categories */}
      {categoryRows.map((c, i) => (
        <section key={c.slug} aria-label={`Top ${c.name}`} className={i % 2 === 0 ? 'py-12' : 'border-y border-gray-100 bg-gray-50 py-12'}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Top {c.name}</h2>
                <p className="mt-1 text-sm text-gray-500">{c.count.toLocaleString()} products in stock</p>
              </div>
              <Link href={`/collections/${c.slug}`} className="flex shrink-0 items-center gap-1 text-sm font-medium text-[#1B7A3E] hover:underline">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {c.top.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* FAQ */}
      <section aria-label="Package deals FAQ" className="border-t border-gray-100 bg-gray-50 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-xl font-bold text-gray-900">Pack Deals — FAQ</h2>
          <div className="space-y-5">
            {faqs.map(f => (
              <div key={f.q}>
                <h3 className="text-sm font-semibold text-gray-900">{f.q}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  {f.q.startsWith('Can I buy packs') ? (
                    <>
                      Yes — larger packs give the best per-unit price. See our{' '}
                      <Link href="/wholesale" className="text-[#1B7A3E] hover:underline">wholesale</Link> page for trade
                      pricing and bulk enquiries.
                    </>
                  ) : (
                    f.a
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
