import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { CollectionView } from '@/components/shop/collection-view'
import {
  COLLECTIONS,
  getCollection,
  parseCollectionParams,
  buildCollectionHref,
} from '@/lib/collections'
import { queryCollection } from '@/lib/collections-query'

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

  return {
    title: `${collection.name} | Aussie Vape`,
    description: collection.description,
    // Canonical points at the clean URL (no query params) to avoid duplicate
    // indexing of every filter/sort/page combination.
    alternates: { canonical: `/collections/${slug}` },
    openGraph: {
      title: `${collection.name} | Aussie Vape`,
      description: collection.description,
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

  return (
    <>
      {/* rel=prev / rel=next for paginated views (React 19 hoists these to <head>) */}
      {result.page > 1 && (
        <link rel="prev" href={`${SITE_URL}${buildCollectionHref(slug, { ...parsed, page: result.page - 1 })}`} />
      )}
      {result.page < result.totalPages && (
        <link rel="next" href={`${SITE_URL}${buildCollectionHref(slug, { ...parsed, page: result.page + 1 })}`} />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

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
            {collection.name}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/85 sm:text-base">
            {collection.description}
          </p>
        </div>
      </section>

      <CollectionView slug={slug} params={parsed} result={result} />
    </>
  )
}
