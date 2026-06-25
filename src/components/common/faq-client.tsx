'use client'

import { useMemo, useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { FAQ_SECTIONS } from '@/data/faqs'

export function FaqClient() {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()

  const sections = useMemo(() => {
    if (!q) return FAQ_SECTIONS
    return FAQ_SECTIONS.map(s => ({
      ...s,
      items: s.items.filter(i => i.q.toLowerCase().includes(q) || i.a.toLowerCase().includes(q)),
    })).filter(s => s.items.length > 0)
  }, [q])

  const total = sections.reduce((n, s) => n + s.items.length, 0)

  return (
    <div>
      <div className="relative mb-8">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search FAQs…"
          className="w-full rounded-full border border-gray-300 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {total === 0 ? (
        <p className="py-10 text-center text-sm text-gray-500">No FAQs match &ldquo;{query.trim()}&rdquo;. Try a different term, or message us on WhatsApp.</p>
      ) : (
        <div className="space-y-10">
          {sections.map(section => (
            <section key={section.title}>
              <h2 className="mb-3 text-lg font-bold text-gray-900">{section.title}</h2>
              <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white">
                {section.items.map(item => (
                  <details key={item.q} className="group" open={!!q}>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-gray-900 [&::-webkit-details-marker]:hidden">
                      {item.q}
                      <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="px-5 pb-4 text-sm leading-relaxed text-gray-600">{item.a}</div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
