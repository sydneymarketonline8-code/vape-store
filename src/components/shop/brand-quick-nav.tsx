'use client'

import { useEffect, useState } from 'react'

interface BrandNavItem {
  id: string
  label: string
}

/** Sticky horizontal brand jump-nav with scroll-spy highlighting. */
export function BrandQuickNav({ items }: { items: BrandNavItem[] }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? '')

  useEffect(() => {
    const sections = items
      .map(i => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null)
    if (!sections.length) return

    const observer = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id)
        }
      },
      { rootMargin: '-30% 0px -60% 0px' }
    )
    sections.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [items])

  return (
    <nav
      aria-label="Jump to brand"
      className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2.5 sm:px-6 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map(i => (
          <a
            key={i.id}
            href={`#${i.id}`}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              active === i.id
                ? 'border-[#1B7A3E] bg-[#1B7A3E] text-white'
                : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:text-gray-900'
            }`}
          >
            {i.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
