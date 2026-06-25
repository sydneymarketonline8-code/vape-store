import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Tag } from 'lucide-react'
import { products } from '@/data/products'
import type { Product } from '@/types'
import { COLLECTIONS } from '@/lib/collections'
import { ProductCard } from '@/components/shop/product-card'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.aussievape.com.au'

export const metadata: Metadata = {
  title: 'Vape Package Deals & Bundles',
  description:
    'Save more on multi-packs and bundle deals at Aussie Vape — disposables, e-liquids and nicotine pouches at wholesale prices with fast AU-wide shipping.',
  alternates: { canonical: '/deals' },
}

const popularity = (p: Product) => (p.featured ? 1_000_000 : 0) + (p.reviewCount ?? 0)

export default function DealsPage() {
  // Package deals = bundle/multi-pack products (all carry a discounted price).
  const deals = products
    .filter(p => p.tags?.includes('bundle'))
    .sort((a, b) => popularity(b) - popularity(a))
    .slice(0, 8)

  // 4 top (non-bundle) products from each high-volume category (>= 100 products).
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

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dealsJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-600 to-red-900">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1.5 text-xs text-white/60">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>›</span>
            <span aria-current="page" className="text-white/80">Deals</span>
          </nav>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
            <Tag className="h-3.5 w-3.5" /> Package Deals & Bundles
          </span>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Save More When You Buy More</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/80">
            Multi-pack and bundle deals on Australia&apos;s favourite vapes — wholesale pricing, genuine stock and fast
            dispatch Australia-wide. Free shipping on orders over $300.
          </p>
          <Link
            href="/products?packs=true"
            className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-white/90"
          >
            Shop all deals <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Package deals grid */}
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

      {/* Top products from the highest-volume categories */}
      {categoryRows.map((c, i) => (
        <section
          key={c.slug}
          aria-label={`Top ${c.name}`}
          className={i % 2 === 0 ? 'border-y border-gray-100 bg-gray-50 py-12' : 'py-12'}
        >
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
    </div>
  )
}
