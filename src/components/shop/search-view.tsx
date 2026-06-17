'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SlidersHorizontal, X, SearchX } from 'lucide-react'
import { ProductCard } from './product-card'
import { ProductCardSkeleton } from './product-card-skeleton'
import { Pagination } from './pagination'
import { SORT_OPTIONS, type SortKey } from '@/lib/collections'
import {
  buildSearchHref,
  SEARCH_CATEGORIES,
  type SearchParams,
  type SearchResult,
} from '@/lib/search'

export function SearchView({
  params,
  result,
  didYouMean,
}: {
  params: SearchParams
  result: SearchResult
  didYouMean: string | null
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [min, setMin] = useState(params.minPrice ?? result.priceBounds.min)
  const [max, setMax] = useState(params.maxPrice ?? result.priceBounds.max)
  const priceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (priceTimer.current) clearTimeout(priceTimer.current) }, [])

  const { items, total, totalPages, page, categories, priceBounds } = result

  function apply(next: Partial<SearchParams>) {
    startTransition(() =>
      router.push(buildSearchHref({ ...params, ...next, page: 1 }), { scroll: false })
    )
  }
  function clearAll() {
    setMin(priceBounds.min)
    setMax(priceBounds.max)
    startTransition(() => router.push(buildSearchHref({ q: params.q }), { scroll: false }))
  }
  function toggleCategory(slug: string) {
    const next = params.categories.includes(slug)
      ? params.categories.filter(c => c !== slug)
      : [...params.categories, slug]
    apply({ categories: next })
  }
  function schedulePrice(nMin: number, nMax: number) {
    if (priceTimer.current) clearTimeout(priceTimer.current)
    priceTimer.current = setTimeout(() => {
      apply({
        minPrice: nMin > priceBounds.min ? nMin : null,
        maxPrice: nMax < priceBounds.max ? nMax : null,
      })
    }, 400)
  }

  const activeCount =
    params.categories.length +
    (params.status !== 'all' ? 1 : 0) +
    (params.minPrice != null || params.maxPrice != null ? 1 : 0)

  const filters = (
    <div className={isPending ? 'pointer-events-none opacity-60' : ''}>
      {/* Category multi-select */}
      <div className="border-b border-gray-100 pb-4">
        <p className="mb-2 text-sm font-semibold text-gray-900">Category</p>
        <ul className="space-y-1.5">
          {categories.map(c => (
            <li key={c.slug}>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={params.categories.includes(c.slug)}
                  onChange={() => toggleCategory(c.slug)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="flex-1">{c.label}</span>
                <span className="text-xs text-gray-400">{c.count}</span>
              </label>
            </li>
          ))}
          {categories.length === 0 && <li className="text-xs text-gray-400">No categories</li>}
        </ul>
      </div>

      {/* Availability */}
      <div className="border-b border-gray-100 py-4">
        <p className="mb-2 text-sm font-semibold text-gray-900">Availability</p>
        {(['all', 'in_stock'] as const).map(s => (
          <label key={s} className="flex cursor-pointer items-center gap-2 py-0.5 text-sm text-gray-700">
            <input type="radio" name="search-availability" checked={params.status === s} onChange={() => apply({ status: s })}
              className="h-4 w-4 border-gray-300 text-primary focus:ring-primary" />
            {s === 'all' ? 'All' : 'In Stock'}
          </label>
        ))}
      </div>

      {/* Price */}
      <div className="border-b border-gray-100 py-4">
        <p className="mb-2 text-sm font-semibold text-gray-900">Price</p>
        <div className="flex items-center gap-2">
          <input type="number" aria-label="Min price" value={min} min={priceBounds.min} max={max}
            onChange={e => { const v = Number(e.target.value) || 0; setMin(v); schedulePrice(v, max) }}
            className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:border-primary focus:outline-none" />
          <span className="text-gray-400">–</span>
          <input type="number" aria-label="Max price" value={max} min={min} max={priceBounds.max}
            onChange={e => { const v = Number(e.target.value) || 0; setMax(v); schedulePrice(min, v) }}
            className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:border-primary focus:outline-none" />
        </div>
      </div>

      {/* Sort (mobile) */}
      <div className="py-4 lg:hidden">
        <p className="mb-2 text-sm font-semibold text-gray-900">Sort</p>
        <select aria-label="Sort products" value={params.sort} onChange={e => apply({ sort: e.target.value as SortKey })}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none">
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {activeCount > 0 && (
        <button type="button" onClick={clearAll} className="mt-2 w-full text-center text-sm text-gray-500 hover:text-primary">
          Clear All Filters
        </button>
      )}
    </div>
  )

  return (
    <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-500">Filters</h2>
          {filters}
        </div>
      </aside>

      <div className="min-w-0">
        <div className="mb-5 flex items-center justify-between gap-3">
          <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">{total}</span> {total === 1 ? 'result' : 'results'}</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setSheetOpen(true)} className="relative flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:border-gray-300 lg:hidden">
              <SlidersHorizontal className="h-4 w-4" /> Filters
              {activeCount > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-white">{activeCount}</span>}
            </button>
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-sm text-gray-400">Sort by:</span>
              <select aria-label="Sort products" value={params.sort} onChange={e => apply({ sort: e.target.value as SortKey })}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {total === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-20 text-center">
            <SearchX className="mb-3 h-10 w-10 text-gray-300" />
            <p className="text-base font-medium text-gray-700">No results for &ldquo;{params.q}&rdquo;</p>
            {didYouMean && (
              <p className="mt-2 text-sm text-gray-500">
                Did you mean{' '}
                <Link href={buildSearchHref({ q: didYouMean })} className="font-medium text-primary hover:underline">{didYouMean}</Link>?
              </p>
            )}
            <p className="mt-5 text-xs font-medium uppercase tracking-wide text-gray-400">Try searching for</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {SEARCH_CATEGORIES.map(c => (
                <Link key={c.slug} href={buildSearchHref({ q: c.label })} className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:border-primary hover:text-primary">
                  {c.label}
                </Link>
              ))}
            </div>
            <Link href="/products" className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="relative">
            <div className={`grid grid-cols-2 gap-4 transition-opacity sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 ${isPending ? 'opacity-40' : ''}`}>
              {items.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            {isPending && (
              <div className="pointer-events-none absolute inset-0 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: Math.min(items.length || 8, 8) }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            )}
          </div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} hrefForPage={p => buildSearchHref({ ...params, page: p })} />
      </div>

      {/* Mobile filter sheet */}
      {sheetOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-black/40 lg:hidden" onClick={() => setSheetOpen(false)} />
          <div className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-5 lg:hidden">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">Filters</h2>
              <button type="button" aria-label="Close filters" onClick={() => setSheetOpen(false)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            {filters}
            <button type="button" onClick={() => setSheetOpen(false)} className="mt-3 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white">
              Show {total} {total === 1 ? 'result' : 'results'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
