'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { ShopCategory } from '@/lib/nav'

/**
 * Full-width "Shop" dropdown: a parent-category rail on the left and a
 * 3-column subcategory grid on the right. Hovering/focusing a parent swaps
 * the grid. Rendered inside MegaMenu's positioned wrapper.
 */
export function MegaMenuPanel({
  categories,
  onNavigate,
}: {
  categories: ShopCategory[]
  onNavigate?: () => void
}) {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = categories[activeIdx] ?? categories[0]

  if (!active) return null

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-[240px_1fr] gap-0 px-4 sm:px-6 lg:px-8">
      {/* Left rail: parent categories */}
      <ul className="border-r border-gray-100 py-3 pr-3" role="tablist" aria-label="Shop categories">
        {categories.map((cat, i) => (
          <li key={cat.slug}>
            <button
              type="button"
              role="tab"
              aria-selected={i === activeIdx}
              onMouseEnter={() => setActiveIdx(i)}
              onFocus={() => setActiveIdx(i)}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                i === activeIdx
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
              }`}
            >
              {/* 120×80 thumbnail (gradient placeholder — swap for <Image> when assets exist) */}
              <span
                className={`flex h-8 w-12 shrink-0 items-center justify-center rounded text-xs font-black ${
                  i === activeIdx ? 'bg-white/20 text-white' : 'bg-primary-light text-primary'
                }`}
                aria-hidden
              >
                {cat.label.charAt(0)}
              </span>
              <span className="flex-1 font-medium">{cat.label}</span>
              <ChevronRight className={`h-4 w-4 ${i === activeIdx ? 'opacity-100' : 'opacity-0'}`} />
            </button>
          </li>
        ))}
      </ul>

      {/* Right area: subcategory grid for the active parent */}
      <div className="max-h-[480px] overflow-y-auto py-4 pl-6">
        <div className="mb-3 flex items-baseline justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">{active.label}</h3>
            <p className="text-xs text-gray-500">{active.blurb}</p>
          </div>
          <Link
            href={active.href}
            onClick={onNavigate}
            className="text-sm font-medium text-primary hover:underline"
          >
            Shop all →
          </Link>
        </div>
        <ul className="grid grid-cols-3 gap-x-6 gap-y-1">
          {active.subcategories.map(sub => (
            <li key={sub.href}>
              <Link
                href={sub.href}
                onClick={onNavigate}
                className="block rounded-md px-2 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-primary focus-visible:bg-gray-50 focus-visible:outline-none"
              >
                {sub.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
