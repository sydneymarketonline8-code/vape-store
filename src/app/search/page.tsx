import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getFeaturedProducts } from '@/data/products'
import { ProductCard } from '@/components/shop/product-card'
import { SearchBar } from '@/components/layout/search-bar'
import { SearchView } from '@/components/shop/search-view'
import {
  parseSearchParams,
  searchProducts,
  didYouMean,
  POPULAR_SEARCHES,
  buildSearchHref,
} from '@/lib/search'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  const { q } = await searchParams
  const query = (Array.isArray(q) ? q[0] : q)?.trim()
  return {
    title: query ? `Search: ${query}` : 'Search',
    robots: { index: false },
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const raw = await searchParams
  const params = parseSearchParams(raw)

  // ── No query → popular searches + featured products ──
  if (!params.q) {
    const featured = getFeaturedProducts().slice(0, 8)
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Search</h1>
        <div className="max-w-2xl"><SearchBar expanded /></div>

        <div className="mt-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Popular Searches</p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map(term => (
              <Link key={term} href={buildSearchHref({ q: term })} className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:border-primary hover:text-primary">
                {term}
              </Link>
            ))}
          </div>
        </div>

        {featured.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-5 text-lg font-bold text-gray-900">Featured Products</h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Query present → results ──
  const result = searchProducts(params)
  const suggestion = result.total === 0 ? didYouMean(params.q) : null

  // Analytics: log only the initial search view (not every filter/page tweak).
  const isFreshSearch =
    params.page === 1 &&
    params.sort === 'featured' &&
    params.status === 'all' &&
    params.categories.length === 0 &&
    params.minPrice == null &&
    params.maxPrice == null
  if (isFreshSearch) {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      await db.from('search_logs').insert({ query: params.q, results_count: result.total, user_id: user?.id ?? null })
    } catch {
      /* analytics is best-effort */
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 max-w-2xl"><SearchBar expanded initialQuery={params.q} /></div>
      <h1 className="mb-6 text-xl font-bold text-gray-900">
        {result.total} {result.total === 1 ? 'result' : 'results'} for &ldquo;{params.q}&rdquo;
      </h1>
      <SearchView params={params} result={result} didYouMean={suggestion} />
    </div>
  )
}
