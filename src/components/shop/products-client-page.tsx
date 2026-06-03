'use client'

import { useState, useMemo } from 'react'
import { products as allProducts } from '@/data/products'
import { ProductCard } from './product-card'
import { SidebarFilters } from './sidebar-filters'
import { SlidersHorizontal, X } from 'lucide-react'

interface Filters {
  category: string
  brands: string[]
  minPrice: number
  maxPrice: number
  inStockOnly: boolean
}

export function ProductsClientPage({ initialCategory }: { initialCategory?: string }) {
  const [filters, setFilters] = useState<Filters>({
    category:    initialCategory || 'all',
    brands:      [],
    minPrice:    0,
    maxPrice:    400,
    inStockOnly: false,
  })
  const [sort,         setSort]        = useState('featured')
  const [search,       setSearch]      = useState('')
  const [sidebarOpen,  setSidebarOpen] = useState(false)

  const filtered = useMemo(() => {
    let r = [...allProducts]
    if (filters.category !== 'all') r = r.filter(p => p.category === filters.category)
    if (filters.brands.length)      r = r.filter(p => filters.brands.includes(p.brand))
    if (filters.inStockOnly)        r = r.filter(p => p.inStock)
    r = r.filter(p => p.price <= filters.maxPrice)
    if (search) {
      const q = search.toLowerCase()
      r = r.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q))
      )
    }
    switch (sort) {
      case 'price-asc':  return r.sort((a, b) => a.price - b.price)
      case 'price-desc': return r.sort((a, b) => b.price - a.price)
      case 'rating':     return r.sort((a, b) => b.rating - a.rating)
      default:           return r.sort((a, b) => Number(b.featured) - Number(a.featured))
    }
  }, [filters, sort, search])

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">

      {/* Page heading */}
      <div className="mb-8 border-b border-[#1e1e2e] pb-6">
        <h1 className="font-heading text-3xl font-bold text-white">
          {filters.category === 'all' ? 'All Products' :
            filters.category === 'e-liquids' ? 'E-Liquids' :
            filters.category.charAt(0).toUpperCase() + filters.category.slice(1)}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{filtered.length} products found</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar — desktop always visible, mobile drawer */}
        <div className={`${sidebarOpen ? 'fixed inset-0 z-40 flex' : 'hidden'} lg:relative lg:flex lg:z-auto lg:inset-auto`}>
          {sidebarOpen && (
            <div className="fixed inset-0 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}
          <div className="relative z-10 h-full overflow-y-auto border-r border-[#1e1e2e] bg-[#0a0a0f] p-6 lg:border-0 lg:bg-transparent lg:p-0">
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h2 className="font-heading text-lg font-bold text-white">Filters</h2>
              <button type="button" aria-label="Close filters" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <SidebarFilters filters={filters} onChange={setFilters} />
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Sort / search bar */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-[#1e1e2e] bg-[#12121a] px-3 py-2 text-sm text-slate-400 transition-colors hover:text-white lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-[#1e1e2e] bg-[#12121a] px-4 py-2 text-sm text-white placeholder-slate-600 focus:border-violet-500 focus:outline-none"
                />
                {search && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Sort:</span>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="rounded-lg border border-[#1e1e2e] bg-[#12121a] px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} isNew={i < 6} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <p className="text-lg text-slate-400">No products found</p>
              <p className="mt-1 text-sm text-slate-600">Try adjusting your filters or search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
