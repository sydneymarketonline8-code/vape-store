'use client'

import { products } from '@/data/products'
import { ProductCategory } from '@/types'

interface Filters {
  category: string
  brands: string[]
  minPrice: number
  maxPrice: number
  inStockOnly: boolean
}

interface SidebarFiltersProps {
  filters: Filters
  onChange: (f: Filters) => void
}

const CATEGORIES: { value: ProductCategory | 'all'; label: string }[] = [
  { value: 'all',          label: 'All Products' },
  { value: 'disposables',  label: 'Disposables' },
  { value: 'mods',         label: 'Mods & Kits' },
  { value: 'e-liquids',    label: 'E-Liquids' },
  { value: 'accessories',  label: 'Accessories' },
]

const TOP_BRANDS = [
  'IGET', 'ALFAKHER', 'ALIBARBAR', 'GUNNPOD', 'HQD',
  'JNR', 'RELX', 'ADALYA', 'BIMO', 'Kuz',
]

export function SidebarFilters({ filters, onChange }: SidebarFiltersProps) {
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch })

  const toggleBrand = (brand: string) => {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand]
    set({ brands: next })
  }

  return (
    <aside className="w-full shrink-0 space-y-6 lg:w-64">

      {/* Category */}
      <div>
        <h3 className="font-heading mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Category
        </h3>
        <div className="space-y-1">
          {CATEGORIES.map(cat => (
            <button
              type="button"
              key={cat.value}
              onClick={() => set({ category: cat.value })}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                filters.category === cat.value
                  ? 'bg-violet-600/20 text-violet-400 font-medium'
                  : 'text-slate-400 hover:bg-[#1e1e2e] hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-heading mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Brand
        </h3>
        <div className="space-y-2">
          {TOP_BRANDS.map(brand => (
            <label key={brand} className="flex cursor-pointer items-center gap-3 group">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="h-4 w-4 rounded border-[#1e1e2e] bg-[#0d0d15] accent-violet-600"
              />
              <span className="text-sm text-slate-400 group-hover:text-white transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="font-heading mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Max Price
        </h3>
        <input
          type="range"
          min={0}
          max={400}
          step={5}
          value={filters.maxPrice}
          onChange={e => set({ maxPrice: Number(e.target.value) })}
          className="w-full accent-violet-600"
        />
        <div className="mt-1 flex justify-between text-xs text-slate-500">
          <span>$0</span>
          <span className="font-semibold text-violet-400">${filters.maxPrice}</span>
        </div>
      </div>

      {/* In stock */}
      <div>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={e => set({ inStockOnly: e.target.checked })}
            className="h-4 w-4 rounded border-[#1e1e2e] bg-[#0d0d15] accent-violet-600"
          />
          <span className="text-sm text-slate-400">In Stock Only</span>
        </label>
      </div>

      {/* Reset */}
      {(filters.brands.length > 0 || filters.inStockOnly || filters.maxPrice < 400) && (
        <button
          type="button"
          onClick={() => onChange({ category: filters.category, brands: [], minPrice: 0, maxPrice: 400, inStockOnly: false })}
          className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
        >
          ✕ Clear filters
        </button>
      )}
    </aside>
  )
}
