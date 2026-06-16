'use client'

import { useEffect, useRef, useState } from 'react'
import { SORT_OPTIONS } from '@/lib/collections'
import type { Availability, BrandFacet, CollectionParams, SortKey } from '@/lib/collections'

interface FilterPanelProps {
  brands: BrandFacet[]
  priceBounds: { min: number; max: number }
  params: CollectionParams
  /** merge a partial filter change into the URL (resets to page 1) */
  onApply: (next: Partial<CollectionParams>) => void
  onClear: () => void
  pending?: boolean
  /** show the Sort control (mobile sheet only — desktop sorts above the grid) */
  showSort?: boolean
  /** close handler for the mobile sheet's Apply button */
  onClose?: () => void
}

function Section({ title, children, defaultOpen = true }: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  return (
    <details open={defaultOpen} className="group border-b border-gray-100 py-4 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-gray-900">
        {title}
        <span className="text-gray-400 transition-transform group-open:rotate-180">▾</span>
      </summary>
      <div className="pt-3">{children}</div>
    </details>
  )
}

export function FilterPanel({
  brands,
  priceBounds,
  params,
  onApply,
  onClear,
  pending,
  showSort,
  onClose,
}: FilterPanelProps) {
  // Local draft (component is remounted via `key` when params change upstream).
  const [selBrands, setSelBrands] = useState<string[]>(params.brands)
  const [status, setStatus] = useState<Availability>(params.status)
  const [min, setMin] = useState<number>(params.minPrice ?? priceBounds.min)
  const [max, setMax] = useState<number>(params.maxPrice ?? priceBounds.max)
  const priceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function toggleBrand(name: string) {
    const next = selBrands.includes(name)
      ? selBrands.filter(b => b !== name)
      : [...selBrands, name]
    setSelBrands(next)
    onApply({ brands: next })
  }

  function changeStatus(next: Availability) {
    setStatus(next)
    onApply({ status: next })
  }

  // Debounced (400ms) price push.
  function schedulePrice(nextMin: number, nextMax: number) {
    if (priceTimer.current) clearTimeout(priceTimer.current)
    priceTimer.current = setTimeout(() => {
      onApply({
        minPrice: nextMin > priceBounds.min ? nextMin : null,
        maxPrice: nextMax < priceBounds.max ? nextMax : null,
      })
    }, 400)
  }
  useEffect(() => () => { if (priceTimer.current) clearTimeout(priceTimer.current) }, [])

  function onMinChange(v: number) {
    const clamped = Math.min(Math.max(v, priceBounds.min), max)
    setMin(clamped)
    schedulePrice(clamped, max)
  }
  function onMaxChange(v: number) {
    const clamped = Math.max(Math.min(v, priceBounds.max), min)
    setMax(clamped)
    schedulePrice(min, clamped)
  }

  const activeCount =
    selBrands.length + (status !== 'all' ? 1 : 0) +
    (min > priceBounds.min || max < priceBounds.max ? 1 : 0)

  return (
    <div className={pending ? 'pointer-events-none opacity-60' : ''}>
      {/* Refine by brand (stands in for child-category checkboxes — categories are flat) */}
      <Section title="Brand">
        <ul className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
          {brands.map(b => (
            <li key={b.name}>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={selBrands.includes(b.name)}
                  onChange={() => toggleBrand(b.name)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="flex-1 truncate">{b.name}</span>
                <span className="text-xs text-gray-400">{b.count}</span>
              </label>
            </li>
          ))}
        </ul>
      </Section>

      {/* Availability (data has inStock only — no pre-order status yet) */}
      <Section title="Availability">
        <div className="space-y-1.5">
          {([['all', 'All'], ['in_stock', 'In Stock']] as const).map(([val, label]) => (
            <label key={val} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                name="availability"
                checked={status === val}
                onChange={() => changeStatus(val)}
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              />
              {label}
            </label>
          ))}
        </div>
      </Section>

      {/* Price range */}
      <Section title="Price">
        <div className="px-0.5">
          <div className="relative h-5">
            <input
              type="range"
              aria-label="Minimum price"
              min={priceBounds.min}
              max={priceBounds.max}
              step={1}
              value={min}
              onChange={e => onMinChange(Number(e.target.value))}
              className="pointer-events-none absolute inset-x-0 top-2 h-1 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            />
            <input
              type="range"
              aria-label="Maximum price"
              min={priceBounds.min}
              max={priceBounds.max}
              step={1}
              value={max}
              onChange={e => onMaxChange(Number(e.target.value))}
              className="pointer-events-none absolute inset-x-0 top-2 h-1 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            />
            <div className="absolute inset-x-0 top-2 h-1 rounded bg-gray-200" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <label className="flex-1">
              <span className="sr-only">Min price</span>
              <input
                type="number"
                value={min}
                min={priceBounds.min}
                max={max}
                onChange={e => onMinChange(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
              />
            </label>
            <span className="text-gray-400">–</span>
            <label className="flex-1">
              <span className="sr-only">Max price</span>
              <input
                type="number"
                value={max}
                min={min}
                max={priceBounds.max}
                onChange={e => onMaxChange(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
              />
            </label>
          </div>
        </div>
      </Section>

      {/* Sort — mobile only */}
      {showSort && (
        <Section title="Sort">
          <select
            aria-label="Sort products"
            value={params.sort}
            onChange={e => onApply({ sort: e.target.value as SortKey })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </Section>
      )}

      {/* Actions */}
      <div className="sticky bottom-0 mt-4 space-y-2 bg-white pt-2">
        <button
          type="button"
          onClick={() => {
            onApply({
              brands: selBrands,
              status,
              minPrice: min > priceBounds.min ? min : null,
              maxPrice: max < priceBounds.max ? max : null,
            })
            onClose?.()
          }}
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Apply Filters{activeCount > 0 ? ` (${activeCount})` : ''}
        </button>
        <button
          type="button"
          onClick={() => {
            setSelBrands([])
            setStatus('all')
            setMin(priceBounds.min)
            setMax(priceBounds.max)
            onClear()
          }}
          className="block w-full text-center text-sm text-gray-500 hover:text-primary"
        >
          Clear All
        </button>
      </div>
    </div>
  )
}
