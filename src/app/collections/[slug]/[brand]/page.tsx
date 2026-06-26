import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { ProductCard } from '@/components/shop/product-card'
import { Pagination } from '@/components/shop/pagination'
import { FaqList } from '@/components/common/page-schema'
import { getCollection } from '@/lib/collections'
import { resolveBrandInCategory, brandCategoryParams } from '@/lib/collections-query'
import { buildBrandCategorySeo } from '@/lib/collection-seo'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.aussievape.com.au'
const PAGE_SIZE = 24

export const dynamicParams = true

export function generateStaticParams() {
  return brandCategoryParams(5)
}

type Params = Promise<{ slug: string; brand: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, brand } = await params
  const collection = getCollection(slug)
  const data = collection && resolveBrandInCategory(slug, brand)
  if (!collection || !data) return { title: 'Not Found' }

  const seo = buildBrandCategorySeo(data.brand, collection.name, data.count, data.minPrice, data.puffCounts, slug)
  return {
    title: { absolute: seo.metaTitle },
    description: seo.metaDescription,
    alternates: { canonical: `/collections/${slug}/${brand}` },
    openGraph: {
      title: seo.metaTitle,
      description: seo.metaDescription,
      type: 'website',
      url: `${SITE_URL}/collections/${slug}/${brand}`,
    },
  }
}

export default async function BrandCategoryPage({
  params,
  searchParams,
}: {
  params: Params
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { slug, brand } = await params
  const collection = getCollection(slug)
  if (!collection) notFound()
  const data = resolveBrandInCategory(slug, brand)
  if (!data) notFound()

  const sp = await searchParams
  const pageRaw = Number(Array.isArray(sp.page) ? sp.page[0] : sp.page)
  const totalPages = Math.max(1, Math.ceil(data.count / PAGE_SIZE))
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.min(Math.floor(pageRaw), totalPages) : 1
  const items = data.list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const seo = buildBrandCategorySeo(data.brand, collection.name, data.count, data.minPrice, data.puffCounts, slug)

  const crumbs = [
    { name: 'Home', href: '/' },
    { name: collection.name, href: `/collections/${slug}` },
    { name: data.brand, href: `/collections/${slug}/${brand}` },
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
    url: `${SITE_URL}/collections/${slug}/${brand}`,
    isPartOf: { '@type': 'WebSite', name: 'Aussie Vape', url: SITE_URL },
  }
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: seo.faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }

  const hrefForPage = (p: number) => `/collections/${slug}/${brand}${p > 1 ? `?page=${p}` : ''}`

  return (
    <>
      {page > 1 && <link rel="prev" href={`${SITE_URL}${hrefForPage(page - 1)}`} />}
      {page < totalPages && <link rel="next" href={`${SITE_URL}${hrefForPage(page + 1)}`} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Hero */}
      <section className={`relative bg-gradient-to-br ${collection.gradient}`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
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
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Buy {data.brand} {collection.name} Online Australia
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-white/85 sm:text-base">{seo.intro}</p>
        </div>
      </section>

      {/* Product grid */}
      <section aria-label={`${data.brand} ${collection.name}`} className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">{data.count.toLocaleString()} {data.brand} products</h2>
            <Link href={`/products?brand=${encodeURIComponent(data.brand)}`} className="text-sm font-medium text-[#1B7A3E] hover:underline">
              Filter &amp; sort all {data.brand} →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {items.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="mt-10">
            <Pagination currentPage={page} totalPages={totalPages} hrefForPage={hrefForPage} />
          </div>
        </div>
      </section>

      {/* Also popular (sibling brand cross-links) */}
      {data.otherBrands.length > 0 && (
        <section aria-label="Also popular" className="border-t border-gray-100 bg-gray-50 py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Also popular in {collection.name}</h2>
            <div className="flex flex-wrap gap-2">
              {data.otherBrands.map(b => (
                <Link
                  key={b.slug}
                  href={`/collections/${slug}/${b.slug}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-[#1B7A3E] hover:text-[#1B7A3E]"
                >
                  {b.name} <span className="text-xs text-gray-400">{b.count}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why buy + FAQ */}
      <section aria-label={`About ${data.brand}`} className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900">Why buy {data.brand} at Aussie Vape?</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">{seo.whyBuy}</p>

          <h2 className="mb-4 mt-10 text-xl font-bold text-gray-900">{data.brand} {collection.name} — FAQ</h2>
          <FaqList items={seo.faqs} />

          <p className="mt-6 text-xs text-gray-400">
            Looking for more? Browse all <Link href={`/collections/${slug}`} className="text-[#1B7A3E] hover:underline">{collection.name.toLowerCase()}</Link> or our{' '}
            <Link href="/deals" className="text-[#1B7A3E] hover:underline">pack deals</Link>. For adults 18+ only. Nicotine is an addictive chemical.
          </p>
        </div>
      </section>
    </>
  )
}
