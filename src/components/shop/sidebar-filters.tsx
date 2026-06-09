'use client'

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
  { value: 'all',         label: 'All Products' },
  { value: 'disposables', label: 'Disposable Vapes' },
  { value: 'mods',        label: 'Pod Systems & Kits' },
  { value: 'e-liquids',   label: 'E-Liquids & Salts' },
  { value: 'pouches',     label: 'Nicotine Pouches' },
  { value: 'accessories', label: 'Accessories' },
]

const TOP_BRANDS = [
  'IGET', 'HQD', 'GUNNPOD', 'LOST MARY', 'ALIBARBAR',
  'FASTA', 'JNR', 'KUZ', 'ALFAKHER', 'X-QLUSIVE',
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
    <aside className="w-60 shrink-0 space-y-6">

      {/* Category */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-700">
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
                  ? 'bg-green-50 font-medium text-[#1B7A3E]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Brands */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-700">
          Brand
        </h3>
        <div className="space-y-2">
          {TOP_BRANDS.map(brand => (
            <label key={brand} className="flex cursor-pointer items-center gap-3 group">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="h-4 w-4 rounded border-gray-300 accent-[#1B7A3E]"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Price */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-700">
          Max Price
        </h3>
        <input
          type="range"
          aria-label="Maximum price"
          min={0}
          max={400}
          step={5}
          value={filters.maxPrice}
          onChange={e => set({ maxPrice: Number(e.target.value) })}
          className="w-full accent-[#1B7A3E]"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>$0</span>
          <span className="font-semibold text-[#1B7A3E]">${filters.maxPrice}</span>
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* In stock */}
      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={filters.inStockOnly}
          onChange={e => set({ inStockOnly: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300 accent-[#1B7A3E]"
        />
        <span className="text-sm text-gray-600">In Stock Only</span>
      </label>

      {/* Reset */}
      {(filters.brands.length > 0 || filters.inStockOnly || filters.maxPrice < 400) && (
        <button
          type="button"
          onClick={() => onChange({ category: filters.category, brands: [], minPrice: 0, maxPrice: 400, inStockOnly: false })}
          className="text-xs text-[#1B7A3E] hover:underline"
        >
          Clear all filters
        </button>
      )}
    </aside>
  )
}
