'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'
import type { Product } from '@/types'
import { buildProductsHref, type ProductsQuery, type ProductsSort } from '@/lib/products-params'
import { ProductCard } from './product-card'
import { ProductCardSkeleton } from './product-card-skeleton'
import { SidebarFilters } from './sidebar-filters'
import { Pagination } from './pagination'

interface ProductsBrowserProps {
  query: ProductsQuery
  heading: string
  total: number
  page: number
  totalPages: number
  items: Product[]
}

/**
 * URL-driven browse shell. Filtering/sort/pagination run on the server
 * (queryAllProducts); this component only renders the current page slice and
 * pushes param changes to the URL — so it never bundles the catalogue.
 */
export function ProductsBrowser({ query, heading, total, page, totalPages, items }: ProductsBrowserProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(query.search)

  const go = (patch: Partial<ProductsQuery>) => {
    const next: ProductsQuery = { ...query, page: 1, ...patch }
    startTransition(() => router.push(buildProductsHref(next)))
  }

  // Keep the search box in sync when the URL changes via navigation.
  useEffect(() => {
    setSearchInput(query.search)
  }, [query.search])

  // Debounced push as the user types in the search box.
  useEffect(() => {
    if (searchInput === query.search) return
    const t = setTimeout(() => {
      startTransition(() => router.push(buildProductsHref({ ...query, search: searchInput, page: 1 })))
    }, 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  return (
    <div>
      {/* Heading */}
      <div className="border-b border-gray-200 bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">{heading}</h1>
          <p className="mt-1 text-sm text-gray-500">{total.toLocaleString()} products</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">

          {/* Sidebar */}
          <div className={`${sidebarOpen ? 'fixed inset-0 z-40 flex' : 'hidden'} lg:relative lg:inset-auto lg:z-auto lg:flex`}>
            {sidebarOpen && (
              <div className="fixed inset-0 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}
            <div className="relative z-10 h-screen overflow-y-auto border-r border-gray-200 bg-white p-6 lg:h-auto lg:border-0 lg:bg-transparent lg:p-0">
              <div className="mb-5 flex items-center justify-between lg:hidden">
                <h2 className="font-bold text-gray-900">Filters</h2>
                <button type="button" aria-label="Close filters" onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>
              <SidebarFilters
                filters={{
                  category: query.category,
                  brands: query.brands,
                  minPrice: 0,
                  maxPrice: query.maxPrice,
                  inStockOnly: query.inStock,
                }}
                onChange={f =>
                  go({ category: f.category, brands: f.brands, maxPrice: f.maxPrice, inStock: f.inStockOnly })
                }
              />
            </div>
          </div>

          {/* Main */}
          <div className="min-w-0 flex-1">
            {/* Sort bar */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900 lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </button>
                <div className="relative flex-1 sm:w-64">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#1B7A3E] focus:outline-none"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      aria-label="Clear"
                      onClick={() => setSearchInput('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Sort by:</span>
                <select
                  aria-label="Sort products"
                  value={query.sort}
                  onChange={e => go({ sort: e.target.value as ProductsSort })}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-[#1B7A3E] focus:outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="new">Newest</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {isPending ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : items.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                  {items.map(product => (
                    <ProductCard key={product.id} product={product} badge={product.featured ? 'top' : undefined} />
                  ))}
                </div>
                <div className="mt-10">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    hrefForPage={p => buildProductsHref({ ...query, page: p })}
                  />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <p className="text-gray-500">No products found</p>
                <p className="mt-1 text-sm text-gray-400">Try adjusting your filters or search</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
