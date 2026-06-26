import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/shop/product-card'
import { FaqList } from '@/components/common/page-schema'
import { resolveBrand, brandHubParams, brandSlug } from '@/lib/collections-query'
import { buildBrandSeo } from '@/lib/collection-seo'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.aussievape.com.au'

export const dynamicParams = true

export function generateStaticParams() {
  return brandHubParams(4)
}

type Params = Promise<{ brand: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { brand } = await params
  const data = resolveBrand(brand)
  if (!data) return { title: 'Brand Not Found' }
  const seo = buildBrandSeo(data.brand, data.count, data.minPrice, data.categories.map(c => c.name), data.puffCounts)
  return {
    title: { absolute: seo.metaTitle },
    description: seo.metaDescription,
    alternates: { canonical: `/brands/${brand}` },
    openGraph: { title: seo.metaTitle, description: seo.metaDescription, type: 'website', url: `${SITE_URL}/brands/${brand}` },
  }
}

export default async function BrandHubPage({ params }: { params: Params }) {
  const { brand } = await params
  const data = resolveBrand(brand)
  if (!data) notFound()

  const seo = buildBrandSeo(data.brand, data.count, data.minPrice, data.categories.map(c => c.name), data.puffCounts)

  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Brands', href: '/brands' },
    { name: data.brand, href: `/brands/${brand}` },
  ]
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: `${SITE_URL}${c.href}` })),
  }
  const collectionPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: seo.metaTitle,
    description: seo.metaDescription,
    url: `${SITE_URL}/brands/${brand}`,
    about: { '@type': 'Brand', name: data.brand },
    isPartOf: { '@type': 'WebSite', name: 'Aussie Vape', url: SITE_URL },
  }
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: seo.faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 to-green-800">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-white/80">
              {crumbs.map((c, i) => (
                <li key={c.href} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-white/50" />}
                  {i < crumbs.length - 1 ? (
                    <Link href={c.href} className="hover:text-white hover:underline">{c.name}</Link>
                  ) : (
                    <span aria-current="page" className="font-medium text-white">{c.name}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">{data.brand} Vapes Australia</h1>
          <p className="mt-2 max-w-3xl text-sm text-white/85 sm:text-base">{seo.intro}</p>
        </div>
      </section>

      {/* Shop by category */}
      {data.categories.length > 0 && (
        <section aria-label={`${data.brand} by category`} className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Shop {data.brand} by category</h2>
            <div className="flex flex-wrap gap-2">
              {data.categories.map(c => (
                <Link
                  key={c.slug}
                  href={`/collections/${c.slug}/${brandSlug(data.brand)}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-[#1B7A3E] hover:text-[#1B7A3E]"
                >
                  {c.name} <span className="text-xs text-gray-400">{c.count}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top products */}
      <section aria-label={`Top ${data.brand} products`} className="border-t border-gray-100 bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Top {data.brand} Products</h2>
            <Link href={`/products?brand=${encodeURIComponent(data.brand)}`} className="flex items-center gap-1 text-sm font-medium text-[#1B7A3E] hover:underline">
              View all {data.count} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {data.topProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* About + FAQ */}
      <section aria-label={`About ${data.brand}`} className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900">About {data.brand} at Aussie Vape</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">{seo.whyBuy}</p>

          <h2 className="mb-4 mt-10 text-xl font-bold text-gray-900">{data.brand} — FAQ</h2>
          <FaqList items={seo.faqs} />

          <p className="mt-6 text-xs text-gray-400">
            Browse <Link href="/brands" className="text-[#1B7A3E] hover:underline">all brands</Link> or our{' '}
            <Link href="/deals" className="text-[#1B7A3E] hover:underline">pack deals</Link>. For adults 18+ only. Nicotine is an addictive chemical.
          </p>
        </div>
      </section>
    </div>
  )
}
