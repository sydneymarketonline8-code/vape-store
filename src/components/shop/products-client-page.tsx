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

interface ProductsClientPageProps {
  initialCategory?: string
  initialBrand?: string
  initialTag?: string
  initialSale?: boolean
  initialPacks?: boolean
}

const TAG_LABELS: Record<string, string> = {
  'nicotine-free': 'Nicotine-Free Vapes',
  'lower-nicotine': 'Lower Nicotine Vapes',
}

export function ProductsClientPage({
  initialCategory,
  initialBrand,
  initialTag,
  initialSale,
  initialPacks,
}: ProductsClientPageProps) {
  const [filters, setFilters] = useState<Filters>({
    category:    initialCategory || 'all',
    brands:      initialBrand ? [initialBrand.toUpperCase()] : [],
    minPrice:    0,
    maxPrice:    400,
    inStockOnly: false,
  })
  const [tag]       = useState(initialTag || '')
  const [saleOnly]  = useState(!!initialSale)
  const [packsOnly] = useState(!!initialPacks)
  const [sort,        setSort]       = useState('featured')
  const [search,      setSearch]     = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filtered = useMemo(() => {
    let r = [...allProducts]
    if (filters.category !== 'all') r = r.filter(p => p.category === filters.category)
    if (filters.brands.length)      r = r.filter(p => filters.brands.includes(p.brand))
    if (tag)                        r = r.filter(p => p.tags.includes(tag))
    if (saleOnly)                   r = r.filter(p => p.originalPrice != null)
    if (packsOnly)                  r = r.filter(p => p.tags.includes('bundle'))
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
  }, [filters, sort, search, tag, saleOnly, packsOnly])

  const heading =
    filters.brands.length === 1       ? filters.brands[0] :
    tag && TAG_LABELS[tag]            ? TAG_LABELS[tag] :
    saleOnly                          ? 'Sale & Clearance' :
    packsOnly                         ? 'Bulk Vape Packs' :
    filters.category === 'all'        ? 'All Products' :
    filters.category === 'e-liquids'  ? 'E-Liquids & Salts' :
    filters.category === 'mods'       ? 'Pod Systems & Kits' :
    filters.category === 'pouches'    ? 'Nicotine Pouches' :
    filters.category.charAt(0).toUpperCase() + filters.category.slice(1)

  return (
    <div>
      {/* Category banner */}
      <div className="border-b border-gray-200 bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">{heading}</h1>
          <p className="mt-1 text-sm text-gray-500">{filtered.length} products</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">

          {/* Sidebar */}
          <div className={`${sidebarOpen ? 'fixed inset-0 z-40 flex' : 'hidden'} lg:relative lg:flex lg:z-auto lg:inset-auto`}>
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
              <SidebarFilters filters={filters} onChange={setFilters} />
            </div>
          </div>

          {/* Main */}
          <div className="flex-1 min-w-0">
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
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#1B7A3E] focus:outline-none"
                  />
                  {search && (
                    <button
                      type="button"
                      aria-label="Clear"
                      onClick={() => setSearch('')}
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
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-[#1B7A3E] focus:outline-none"
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
              <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    badge={i < 4 ? 'new' : product.featured ? 'top' : undefined}
                  />
                ))}
              </div>
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
