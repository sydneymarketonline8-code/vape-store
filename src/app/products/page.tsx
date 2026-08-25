import type { Metadata } from 'next'
import { ProductsBrowser } from '@/components/shop/products-browser'
import { parseProductsQuery, productsHeading } from '@/lib/products-params'
import { queryAllProducts } from '@/lib/products-query'
import { brandSlug, brandHubParams } from '@/lib/collections-query'
import { COLLECTIONS } from '@/lib/collections'

/**
 * Canonical target for a filtered listing. A single-brand or single-category
 * filter has a dedicated pillar page (/brands/[brand], /collections/[slug]) that
 * matches the query far better than the generic listing, so point the canonical
 * there to consolidate signals instead of at /products.
 */
function canonicalFor(q: ReturnType<typeof parseProductsQuery>): string {
  if (q.brands.length === 1 && q.category === 'all') {
    const slug = brandSlug(q.brands[0])
    if (brandHubParams(4).some(b => b.brand === slug)) return `/brands/${slug}`
  }
  if (q.category !== 'all' && q.brands.length === 0 && COLLECTIONS.some(c => c.slug === q.category)) {
    return `/collections/${q.category}`
  }
  return '/products'
}

type RawParams = Record<string, string | string[] | undefined>

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<RawParams>
}): Promise<Metadata> {
  const q = parseProductsQuery(await searchParams)
  const title = productsHeading(q)
  return {
    title,
    description: `Shop ${title.toLowerCase()} at VapesAU — fast AU-wide shipping, age-verified, and 30-day returns.`,
    alternates: { canonical: canonicalFor(q) },
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<RawParams>
}) {
  const query = parseProductsQuery(await searchParams)
  const result = queryAllProducts(query)
  const heading = productsHeading(query)

  return (
    <ProductsBrowser
      query={query}
      heading={heading}
      total={result.total}
      page={result.page}
      totalPages={result.totalPages}
      items={result.items}
    />
  )
}
