'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, Tag } from 'lucide-react'

export interface HeroSlide {
  slug: string
  brand: string
  name: string
  image: string
  price: number
  originalPrice: number | null
  discountPct: number | null
}

/**
 * Auto-rotating hero deals carousel. Slide data is computed server-side in
 * page.tsx and passed in, so the products JSON never lands in the client bundle.
 */
export function HeroDeals({ slides }: { slides: HeroSlide[] }) {
  const count = slides.length
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const go = useCallback((n: number) => setIndex(((n % count) + count) % count), [count])

  useEffect(() => {
    if (paused || count <= 1) return
    const t = setInterval(() => setIndex(i => (i + 1) % count), 4500)
    return () => clearInterval(t)
  }, [paused, count])

  if (count === 0) return null
  const s = slides[index]

  return (
    <div className="flex justify-center lg:justify-end">
      <div
        className="w-72 sm:w-80"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <Link href={`/products/${s.slug}`} className="block">
                <div className="relative aspect-square bg-gray-50">
                  <Image
                    src={s.image}
                    alt={`${s.brand} ${s.name} — buy online Australia | Aussie Vape`}
                    fill
                    priority={index === 0}
                    sizes="320px"
                    className="object-contain p-6"
                  />
                  {s.discountPct ? (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold text-white">
                      <Tag className="h-3 w-3" /> -{s.discountPct}%
                    </span>
                  ) : (
                    <span className="absolute left-3 top-3 rounded-full bg-[#1B7A3E] px-2.5 py-0.5 text-xs font-bold text-white">
                      Deal
                    </span>
                  )}
                </div>
                <div className="border-t border-gray-100 p-4">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">{s.brand}</p>
                  <p className="mt-0.5 line-clamp-2 text-sm font-semibold text-gray-900">{s.name}</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-bold text-[#1B7A3E]">${s.price.toFixed(2)}</span>
                    {s.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">${s.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <span className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg bg-[#1B7A3E] py-2 text-sm font-semibold text-white transition-colors hover:bg-[#156331]">
                    Shop <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>

          {count > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous deal"
                onClick={() => go(index - 1)}
                className="absolute left-2 top-[38%] z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow transition-colors hover:bg-white hover:text-[#1B7A3E]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next deal"
                onClick={() => go(index + 1)}
                className="absolute right-2 top-[38%] z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow transition-colors hover:bg-white hover:text-[#1B7A3E]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {count > 1 && (
          <div className="mt-3 flex justify-center gap-1.5">
            {slides.map((slide, i) => (
              <button
                key={slide.slug}
                type="button"
                aria-label={`Go to deal ${i + 1}`}
                aria-current={i === index ? 'true' : 'false'}
                onClick={() => go(i)}
                className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-[#1B7A3E]' : 'w-1.5 bg-gray-300 hover:bg-gray-400'}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
