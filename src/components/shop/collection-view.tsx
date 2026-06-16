'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { SlidersHorizontal, X, PackageOpen } from 'lucide-react'
import { ProductCard } from './product-card'
import { ProductCardSkeleton } from './product-card-skeleton'
import { FilterPanel } from './filter-panel'
import { Pagination } from './pagination'
import {
  SORT_OPTIONS,
  buildCollectionHref,
  buildCollectionQuery,
  type CollectionParams,
  type CollectionResult,
  type SortKey,
} from '@/lib/collections'

interface CollectionViewProps {
  slug: string
  params: CollectionParams
  result: CollectionResult
}

export function CollectionView({ slug, params, result }: CollectionViewProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [sheetOpen, setSheetOpen] = useState(false)

  const { items, total, totalPages, page, brands, priceBounds } = result

  // Merge a filter change into the URL; any filter/sort change resets to page 1.
  function applyFilters(next: Partial<CollectionParams>) {
    const merged: Partial<CollectionParams> = {
      sort: params.sort,
      status: params.status,
      brands: params.brands,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      ...next,
      page: 1,
    }
    startTransition(() => router.push(buildCollectionHref(slug, merged), { scroll: false }))
  }

  function clearAll() {
    startTransition(() => router.push(`/collections/${slug}`, { scroll: false }))
  }

  const hrefForPage = (p: number) => buildCollectionHref(slug, { ...params, page: p })

  const activeCount =
    params.brands.length +
    (params.status !== 'all' ? 1 : 0) +
    (params.minPrice != null || params.maxPrice != null ? 1 : 0)

  // FilterPanel is remounted when params change so its local draft re-seeds.
  const panelKey = JSON.stringify(buildCollectionQuery(params))

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
        {/* ── Desktop sidebar ── */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-500">Filters</h2>
            <FilterPanel
              key={panelKey}
              brands={brands}
              priceBounds={priceBounds}
              params={params}
              onApply={applyFilters}
              onClear={clearAll}
              pending={isPending}
            />
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="min-w-0">
          {/* Top bar */}
          <div className="mb-5 flex items-center justify-between gap-3">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{total}</span>{' '}
              {total === 1 ? 'Product' : 'Products'}
            </p>

            <div className="flex items-center gap-2">
              {/* Mobile filters trigger */}
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="relative flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:border-gray-300 lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-white">
                    {activeCount}
                  </span>
                )}
              </button>

              {/* Desktop sort */}
              <div className="hidden items-center gap-2 sm:flex">
                <span className="text-sm text-gray-400">Sort by:</span>
                <select
                  aria-label="Sort products"
                  value={params.sort}
                  onChange={e => applyFilters({ sort: e.target.value as SortKey })}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Grid / empty state */}
          {total === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-24 text-center">
              <PackageOpen className="mb-4 h-12 w-12 text-gray-300" />
              <p className="text-base font-medium text-gray-700">No products match your filters.</p>
              <p className="mt-1 text-sm text-gray-400">Try widening your price range or clearing brands.</p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="relative">
              <div
                className={`grid grid-cols-2 gap-4 transition-opacity sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 ${
                  isPending ? 'opacity-40' : ''
                }`}
              >
                {items.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Skeleton overlay while a filter transition is pending */}
              {isPending && (
                <div className="pointer-events-none absolute inset-0 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                  {Array.from({ length: Math.min(items.length || 8, 8) }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SEO-friendly Link-based pagination */}
          <Pagination currentPage={page} totalPages={totalPages} hrefForPage={hrefForPage} />
        </div>
      </div>

      {/* ── Mobile bottom sheet ── */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheetOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 lg:hidden"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 320 }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-5 lg:hidden"
            >
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900">Filters</h2>
                <button type="button" aria-label="Close filters" onClick={() => setSheetOpen(false)}>
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>
              <FilterPanel
                key={panelKey}
                brands={brands}
                priceBounds={priceBounds}
                params={params}
                onApply={applyFilters}
                onClear={clearAll}
                pending={isPending}
                showSort
                onClose={() => setSheetOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
