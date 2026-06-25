import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { products } from '@/data/products'
import type { Product } from '@/types'
import { COLLECTIONS } from '@/lib/collections'
import { ProductCard } from '@/components/shop/product-card'
import { BrandQuickNav } from '@/components/shop/brand-quick-nav'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.aussievape.com.au'

export const metadata: Metadata = {
  title: 'Shop All Vape Categories',
  description:
    'Browse every category at Aussie Vape — disposables, pod systems, e-liquids & salts, nicotine pouches and accessories. Real stock, AU-wide shipping, age-verified checkout.',
  alternates: { canonical: '/categories' },
}

const popularity = (p: Product) => (p.featured ? 1_000_000 : 0) + (p.reviewCount ?? 0)

function buildCategories() {
  return COLLECTIONS.map(c => {
    const list = products.filter(p => p.category === c.slug)
    const brandCounts: Record<string, number> = {}
    for (const p of list) if (p.brand && p.brand !== 'OTHER') brandCounts[p.brand] = (brandCounts[p.brand] ?? 0) + 1
    return {
      ...c,
      count: list.length,
      min: list.length ? Math.min(...list.map(p => p.price)) : 0,
      topBrands: Object.entries(brandCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([b]) => b),
      hasSale: list.some(p => p.originalPrice != null),
      hasPacks: list.some(p => p.tags?.includes('bundle')),
      top: [...list].sort((a, b) => popularity(b) - popularity(a)).slice(0, 4),
    }
  }).sort((a, b) => b.count - a.count)
}

export default function CategoriesPage() {
  const cats = buildCategories()

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Categories', item: `${SITE_URL}/categories` },
    ],
  }

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Vape categories at Aussie Vape',
    itemListElement: cats.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      url: `${SITE_URL}/collections/${c.slug}`,
    })),
  }

  const faqs = [
    {
      q: 'Where can I buy vapes online in Australia?',
      a: `Aussie Vape (aussievape.com.au) stocks over ${products.length.toLocaleString()} products across ${cats.length} categories with fast AU-wide shipping. Orders over $300 ship free, and checkout is age-verified (18+).`,
    },
    {
      q: 'What vape categories does Aussie Vape stock?',
      a: `Disposable vapes, pod systems & kits, e-liquids & nicotine salts, nicotine pouches and accessories — ${cats.map(c => `${c.name} (${c.count})`).join(', ')}.`,
    },
    {
      q: 'Do I need to be over 18 to buy?',
      a: 'Yes. Aussie Vape is an age-verified store and only sells to adults aged 18 and over, in line with Australian requirements. See our vaping laws page for details.',
    },
  ]
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Hero */}
      <div className="border-b border-gray-200 bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-1.5 text-xs text-gray-400">
            <Link href="/" className="hover:text-[#1B7A3E]">Home</Link>
            <span>›</span>
            <span aria-current="page" className="text-gray-600">Categories</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">Shop All Vape Categories</h1>
          <p className="mt-1 text-sm text-gray-500">
            {products.length.toLocaleString()} products across {cats.length} categories — fast AU-wide shipping, age-verified checkout.
          </p>
        </div>
      </div>

      {/* Sticky scroll-spy nav */}
      <BrandQuickNav items={cats.map(c => ({ id: c.slug, label: c.name }))} />

      {/* Category sections */}
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        {cats.map(c => (
          <section
            key={c.slug}
            id={c.slug}
            aria-label={`${c.name} Australia`}
            className="scroll-mt-16 overflow-hidden rounded-2xl border border-gray-200"
          >
            {/* Gradient band */}
            <Link href={`/collections/${c.slug}`} className={`block bg-gradient-to-br ${c.gradient} px-6 py-7 sm:px-8`}>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60">
                {c.count.toLocaleString()} products{c.min ? ` · from $${c.min.toFixed(2)}` : ''}
              </p>
              <div className="mt-1 flex items-end justify-between gap-4">
                <h2 className="text-2xl font-bold text-white sm:text-3xl">{c.name}</h2>
                <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-white/90">
                  View all <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>

            <div className="p-6 sm:p-8">
              <p className="mb-5 max-w-3xl text-sm leading-relaxed text-gray-600">{c.description}</p>

              {/* Subcategory chips — real top brands + supported refinements */}
              <div className="mb-6 flex flex-wrap gap-2">
                {c.topBrands.map(brand => (
                  <Link
                    key={brand}
                    href={`/products?category=${c.slug}&brand=${encodeURIComponent(brand)}`}
                    className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-[#1B7A3E] hover:text-[#1B7A3E]"
                  >
                    {brand}
                  </Link>
                ))}
                <Link href={`/products?category=${c.slug}&status=in_stock`} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-[#1B7A3E] hover:text-[#1B7A3E]">In stock</Link>
                {c.hasSale && <Link href={`/products?category=${c.slug}&sale=true`} className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:border-red-400">On sale</Link>}
                {c.hasPacks && <Link href={`/products?category=${c.slug}&packs=true`} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-[#1B7A3E] hover:text-[#1B7A3E]">Multi-packs</Link>}
                <Link href={`/products?category=${c.slug}&sort=new`} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-[#1B7A3E] hover:text-[#1B7A3E]">Newest</Link>
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

      {/* FAQ */}
      <section aria-label="Frequently asked questions" className="border-t border-gray-100 bg-gray-50 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-5">
            {faqs.map(f => (
              <div key={f.q}>
                <h3 className="text-sm font-semibold text-gray-900">{f.q}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  {f.q.includes('over 18') ? (
                    <>
                      Yes. Aussie Vape is an age-verified store and only sells to adults aged 18 and over, in line with
                      Australian requirements. See our{' '}
                      <Link href="/vaping-laws" className="text-[#1B7A3E] hover:underline">vaping laws</Link> page for details.
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
