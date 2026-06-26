import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { CollectionView } from '@/components/shop/collection-view'
import { FaqList } from '@/components/common/page-schema'
import { buildCollectionSeo } from '@/lib/collection-seo'
import {
  COLLECTIONS,
  getCollection,
  parseCollectionParams,
  buildCollectionHref,
} from '@/lib/collections'
import { queryCollection, categoryStats, brandSlug } from '@/lib/collections-query'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.aussievape.com.au'

// Pre-render every collection slug; unknown slugs render on-demand (≈ fallback: 'blocking').
export const dynamicParams = true

export function generateStaticParams() {
  return COLLECTIONS.map(c => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const collection = getCollection(slug)
  if (!collection) return { title: 'Collection Not Found' }

  const seo = buildCollectionSeo(slug, collection.name, categoryStats(slug))
  return {
    // `absolute` avoids the root template appending a second "— Aussie Vape".
    title: { absolute: seo.metaTitle },
    description: seo.metaDescription,
    // Canonical points at the clean URL (no query params) to avoid duplicate
    // indexing of every filter/sort/page combination.
    alternates: { canonical: `/collections/${slug}` },
    openGraph: {
      title: seo.metaTitle,
      description: seo.metaDescription,
      type: 'website',
      url: `${SITE_URL}/collections/${slug}`,
    },
  }
}

type RawSearchParams = Record<string, string | string[] | undefined>

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<RawSearchParams>
}) {
  const { slug } = await params
  const collection = getCollection(slug)
  if (!collection) notFound()

  const parsed = parseCollectionParams(await searchParams)
  const result = queryCollection(slug, parsed)
  const stats = categoryStats(slug)
  const seo = buildCollectionSeo(slug, collection.name, stats)

  // Breadcrumb chain: Home → Shop → Category (categories are flat, no grandparent).
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/products' },
    { name: collection.name, href: `/collections/${slug}` },
  ]

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.href}`,
    })),
  }

  const collectionPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: seo.metaTitle,
    description: seo.metaDescription,
    url: `${SITE_URL}/collections/${slug}`,
    isPartOf: { '@type': 'WebSite', name: 'Aussie Vape', url: SITE_URL },
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: seo.faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      {/* rel=prev / rel=next for paginated views (React 19 hoists these to <head>) */}
      {result.page > 1 && (
        <link rel="prev" href={`${SITE_URL}${buildCollectionHref(slug, { ...parsed, page: result.page - 1 })}`} />
      )}
      {result.page < result.totalPages && (
        <link rel="next" href={`${SITE_URL}${buildCollectionHref(slug, { ...parsed, page: result.page + 1 })}`} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* ── Hero ── */}
      <section className={`relative bg-gradient-to-br ${collection.gradient}`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-white/80">
              {crumbs.map((c, i) => (
                <li key={c.href} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-white/50" />}
                  {i < crumbs.length - 1 ? (
                    <Link href={c.href} className="hover:text-white hover:underline">
                      {c.name}
                    </Link>
                  ) : (
                    <span aria-current="page" className="font-medium text-white">{c.name}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Buy {collection.name} Online Australia
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-white/85 sm:text-base">
            {seo.intro}
          </p>
        </div>
      </section>

      <CollectionView slug={slug} params={parsed} result={result} />

      {/* ── Shop by brand (Tier-2 internal links) ── */}
      {result.brands.length > 0 && (
        <section aria-label={`Shop ${collection.name} by brand`} className="border-t border-gray-100 bg-gray-50 py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Shop {collection.name} by brand</h2>
            <div className="flex flex-wrap gap-2">
              {result.brands.slice(0, 14).map(b => (
                <Link
                  key={b.name}
                  href={`/collections/${slug}/${brandSlug(b.name)}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-[#1B7A3E] hover:text-[#1B7A3E]"
                >
                  {b.name} <span className="text-xs text-gray-400">{b.count}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Why buy + FAQ ── */}
      <section aria-label={`About ${collection.name}`} className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900">Why buy {collection.name.toLowerCase()} at Aussie Vape?</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">{seo.whyBuy}</p>

          <h2 className="mb-4 mt-10 text-xl font-bold text-gray-900">{collection.name} — FAQ</h2>
          <FaqList items={seo.faqs} />

          <p className="mt-6 text-xs text-gray-400">For adults 18+ only. Nicotine is an addictive chemical.</p>
        </div>
      </section>
    </>
  )
}
