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
 * Full-width auto-rotating hero deals banner. Slide data is computed server-side
 * in page.tsx and passed in, so the products JSON never lands in the client bundle.
 */
export function HeroDeals({ slides, className = '' }: { slides: HeroSlide[]; className?: string }) {
  const count = slides.length
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const go = useCallback((n: number) => setIndex(((n % count) + count) % count), [count])

  useEffect(() => {
    if (paused || count <= 1) return
    const t = setInterval(() => setIndex(i => (i + 1) % count), 5000)
    return () => clearInterval(t)
  }, [paused, count])

  if (count === 0) return null
  const s = slides[index]

  return (
    <div className={className}>
      <div
        className="relative overflow-hidden rounded-2xl border border-[#1B7A3E]/30 bg-gradient-to-br from-[#1B7A3E] to-[#0f4f28] shadow-lg"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={s.slug}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <Link
              href={`/products/${s.slug}`}
              className="group grid min-h-[300px] items-center gap-4 p-6 sm:min-h-[340px] sm:grid-cols-2 sm:gap-6 sm:p-10"
            >
              {/* Copy */}
              <div className="order-2 sm:order-1">
                {s.discountPct ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                    <Tag className="h-3.5 w-3.5" /> Save {s.discountPct}%
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                    <Tag className="h-3.5 w-3.5" /> Featured Deal
                  </span>
                )}
                <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-green-200">{s.brand}</p>
                <h2 className="mt-1 text-2xl font-bold leading-tight text-white sm:text-3xl">{s.name}</h2>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-3xl font-black text-white">${s.price.toFixed(2)}</span>
                  {s.originalPrice && (
                    <span className="text-lg text-green-200/70 line-through">${s.originalPrice.toFixed(2)}</span>
                  )}
                </div>
                <span className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-[#1B7A3E] transition-transform group-hover:scale-105">
                  Shop this deal <ArrowRight className="h-4 w-4" />
                </span>
              </div>

              {/* Product image on a light panel so the artwork stays legible */}
              <div className="order-1 flex justify-center sm:order-2 sm:justify-end">
                <div className="relative aspect-square w-44 rounded-2xl bg-white sm:w-60">
                  <Image
                    src={s.image}
                    alt={`${s.brand} ${s.name} — buy online Australia | Aussie Vape`}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 640px) 176px, 240px"
                    className="object-contain p-5"
                  />
                </div>
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
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next deal"
              onClick={() => go(index + 1)}
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-4 flex justify-center gap-1.5">
          {slides.map((slide, i) => (
            <button
              key={slide.slug}
              type="button"
              aria-label={`Go to deal ${i + 1}`}
              aria-current={i === index ? 'true' : 'false'}
              onClick={() => go(i)}
              className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-[#1B7A3E]' : 'w-2 bg-gray-300 hover:bg-gray-400'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
