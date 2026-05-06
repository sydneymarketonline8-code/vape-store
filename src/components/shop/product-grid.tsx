'use client'

import { useState, useMemo } from 'react'
import { products } from '@/data/products'
import { ProductCard } from './product-card'
import { ProductCategory } from '@/types'
import { SlidersHorizontal, X } from 'lucide-react'

const categories: { value: ProductCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Products' },
  { value: 'disposables', label: 'Disposables' },
  { value: 'mods', label: 'Mods & Kits' },
  { value: 'e-liquids', label: 'E-Liquids' },
  { value: 'accessories', label: 'Accessories' },
]

export function ProductGrid({ initialCategory }: { initialCategory?: string }) {
  const [activeCategory, setActiveCategory] = useState(initialCategory || 'all')
  const [sortBy, setSortBy] = useState('featured')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    let result = [...products]

    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory)
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags.some(t => t.includes(q))
      )
    }

    switch (sortBy) {
      case 'price-asc':
        return result.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return result.sort((a, b) => b.price - a.price)
      case 'rating':
        return result.sort((a, b) => b.rating - a.rating)
      default:
        return result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }
  }, [activeCategory, sortBy, searchQuery])

  return (
    <div>
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-zinc-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                activeCategory === cat.value
                  ? 'bg-violet-600 text-white'
                  : 'border border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-zinc-500 mb-6">
        {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-zinc-500 text-lg mb-2">No products found</p>
          <p className="text-zinc-600 text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
