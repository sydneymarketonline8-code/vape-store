import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { products } from '@/data/products'
import type { Product } from '@/types'
import { ProductCard } from '@/components/shop/product-card'
import { BrandQuickNav } from '@/components/shop/brand-quick-nav'
import { brandSlug } from '@/lib/collections-query'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.aussievape.com.au'
const FEATURED_COUNT = 12

export const metadata: Metadata = {
  title: 'Shop Vapes by Brand',
  description:
    'Browse every vape brand at Aussie Vape — IGET, HQD, GUNNPOD, Lost Mary, Alfakher and more. Real stock, AU-wide shipping, age-verified checkout.',
  alternates: { canonical: '/brands' },
}

// Cycled gradient bands (no brand banner images exist — consistent with collections).
const GRADIENTS = [
  'from-emerald-600 to-green-800',
  'from-sky-700 to-indigo-900',
  'from-purple-700 to-fuchsia-900',
  'from-amber-600 to-orange-800',
  'from-rose-600 to-red-900',
  'from-slate-600 to-slate-900',
]

const brandId = (b: string) => b.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const popularity = (p: Product) => (p.featured ? 1_000_000 : 0) + (p.reviewCount ?? 0)

interface BrandStat {
  brand: string
  count: number
  min: number
  top: Product[]
}

function buildBrands() {
  const byBrand: Record<string, Product[]> = {}
  for (const p of products) {
    if (!p.brand || p.brand === 'OTHER') continue
    ;(byBrand[p.brand] ??= []).push(p)
  }
  const all: BrandStat[] = Object.entries(byBrand).map(([brand, list]) => ({
    brand,
    count: list.length,
    min: Math.min(...list.map(p => p.price)),
    top: [...list].sort((a, b) => popularity(b) - popularity(a)).slice(0, 4),
  }))
  const featured = [...all].sort((a, b) => b.count - a.count).slice(0, FEATURED_COUNT)
  const az = [...all].sort((a, b) => a.brand.localeCompare(b.brand))
  return { featured, az }
}

export default function BrandsPage() {
  const { featured, az } = buildBrands()

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Brands', item: `${SITE_URL}/brands` },
    ],
  }

  const brandListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Vape brands at Aussie Vape',
    itemListElement: featured.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.brand,
      url: `${SITE_URL}/products?brand=${encodeURIComponent(b.brand)}`,
    })),
  }

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(brandListJsonLd) }} />

      {/* Hero */}
      <div className="border-b border-gray-200 bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-1.5 text-xs text-gray-400">
            <Link href="/" className="hover:text-[#1B7A3E]">Home</Link>
            <span>›</span>
            <span aria-current="page" className="text-gray-600">Brands</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">Shop Vapes by Brand</h1>
          <p className="mt-1 text-sm text-gray-500">
            {az.length} brands in stock — fast AU-wide shipping, age-verified checkout.
          </p>
        </div>
      </div>

      {/* Sticky scroll-spy nav over the featured brands */}
      <BrandQuickNav items={featured.map(b => ({ id: brandId(b.brand), label: b.brand }))} />

      {/* Featured brand sections */}
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        {featured.map((b, i) => (
          <section
            key={b.brand}
            id={brandId(b.brand)}
            aria-label={`${b.brand} vapes Australia`}
            className="scroll-mt-16 overflow-hidden rounded-2xl border border-gray-200"
          >
            {/* Gradient band */}
            <Link
              href={`/brands/${brandSlug(b.brand)}`}
              className={`block bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} px-6 py-7 sm:px-8`}
            >
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60">
                {b.count.toLocaleString()} products · from ${b.min.toFixed(2)}
              </p>
              <div className="mt-1 flex items-end justify-between gap-4">
                <h2 className="text-2xl font-bold text-white sm:text-3xl">{b.brand}</h2>
                <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-white/90">
                  View all <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>

            <div className="p-6 sm:p-8">
              <p className="mb-5 max-w-3xl text-sm leading-relaxed text-gray-600">
                Shop the full {b.brand} range at Aussie Vape — {b.count.toLocaleString()} products from $
                {b.min.toFixed(2)}, with genuine stock and fast dispatch Australia-wide.
              </p>

              {/* Refinement chips — only params /products actually supports */}
              <div className="mb-6 flex flex-wrap gap-2">
                {[
                  { label: 'All products', href: `/products?brand=${encodeURIComponent(b.brand)}` },
                  { label: 'In stock', href: `/products?brand=${encodeURIComponent(b.brand)}&status=in_stock` },
                  { label: 'Price: low → high', href: `/products?brand=${encodeURIComponent(b.brand)}&sort=price-asc` },
                  { label: 'Top rated', href: `/products?brand=${encodeURIComponent(b.brand)}&sort=rating` },
                ].map(chip => (
                  <Link
                    key={chip.label}
                    href={chip.href}
                    className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-[#1B7A3E] hover:text-[#1B7A3E]"
                  >
                    {chip.label}
                  </Link>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
                {b.top.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Full A–Z brand index */}
      <section aria-label="All brands" className="border-t border-gray-100 bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-xl font-bold text-gray-900">All Brands A–Z</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {az.map(({ brand, count }) => (
              <Link
                key={brand}
                href={`/brands/${brandSlug(brand)}`}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3.5 transition-all hover:border-[#1B7A3E] hover:shadow-sm"
              >
                <span className="text-sm font-semibold uppercase tracking-wide text-gray-800">{brand}</span>
                <span className="text-xs text-gray-400">{count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
