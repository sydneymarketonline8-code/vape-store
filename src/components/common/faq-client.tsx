'use client'

import { useMemo, useState } from 'react'
import { Search, Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { FAQ_SECTIONS } from '@/data/faqs'

export function FaqClient() {
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)
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
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-neutral-500">{section.title}</h2>
              <div>
                {section.items.map(item => {
                  const id = `${section.title}::${item.q}`
                  const open = openId === id
                  return (
                    <div key={id} className="border-b border-neutral-200">
                      <button
                        type="button"
                        onClick={() => setOpenId(open ? null : id)}
                        aria-expanded={open ? 'true' : 'false'}
                        className="group flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left"
                      >
                        <span className={`text-base font-medium transition-colors ${open ? 'text-primary' : 'text-neutral-800 group-hover:text-primary'}`}>
                          {item.q}
                        </span>
                        <Plus
                          aria-hidden
                          className={`h-5 w-5 shrink-0 text-primary transition-transform duration-200 ${open ? 'rotate-45' : 'rotate-0'}`}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <p className="pb-5 pt-1 text-sm leading-relaxed text-neutral-600">{item.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
