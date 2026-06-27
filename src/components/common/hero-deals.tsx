'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'

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
  const savings = s.originalPrice ? s.originalPrice - s.price : 0

  return (
    <div className={className}>
      <div
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b4225] via-[#0f5731] to-[#062619] shadow-2xl ring-1 ring-white/10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Ambient glow accents */}
        <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-28 right-1/4 h-72 w-72 rounded-full bg-lime-300/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_85%_15%,rgba(255,255,255,0.08),transparent_55%)]" />

        <AnimatePresence mode="wait">
          <motion.div
            key={s.slug}
            initial={{ opacity: 0, x: 36 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -36 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <Link
              href={`/products/${s.slug}`}
              className="group relative grid min-h-[320px] items-center gap-6 p-7 sm:min-h-[360px] sm:grid-cols-2 sm:p-12"
            >
              {/* Copy */}
              <div className="order-2 sm:order-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100 ring-1 ring-white/15 backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5" /> {s.discountPct ? 'Deal of the Day' : 'Featured'}
                </span>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300/90">{s.brand}</p>
                <h2 className="mt-2 text-3xl font-black leading-[1.08] text-white sm:text-4xl">{s.name}</h2>
                <div className="mt-5 flex flex-wrap items-end gap-3">
                  <span className="text-4xl font-black tracking-tight text-white">${s.price.toFixed(2)}</span>
                  {s.originalPrice && (
                    <span className="pb-1 text-lg text-emerald-200/60 line-through">${s.originalPrice.toFixed(2)}</span>
                  )}
                  {savings > 0 && (
                    <span className="mb-1 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow">
                      Save ${savings.toFixed(2)}
                    </span>
                  )}
                </div>
                <span className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-[#0b4225] shadow-lg ring-1 ring-black/5 transition-all group-hover:gap-3 group-hover:shadow-xl">
                  Shop this deal <ArrowRight className="h-4 w-4" />
                </span>
              </div>

              {/* Product stage */}
              <div className="order-1 flex justify-center sm:order-2 sm:justify-end">
                <div className="relative">
                  <div aria-hidden className="absolute inset-0 scale-110 rounded-full bg-emerald-300/25 blur-2xl" />
                  <div className="relative aspect-square w-48 rounded-[1.75rem] bg-gradient-to-br from-white to-gray-100 p-2 shadow-2xl ring-1 ring-white/30 sm:w-64">
                    <div className="relative h-full w-full overflow-hidden rounded-[1.4rem] bg-white">
                      <Image
                        src={s.image}
                        alt={`${s.brand} ${s.name} — buy online Australia | Aussie Vape`}
                        fill
                        priority={index === 0}
                        sizes="(max-width: 640px) 192px, 256px"
                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>
                  {s.discountPct && (
                    <div className="absolute -right-3 -top-3 flex h-16 w-16 rotate-6 flex-col items-center justify-center rounded-full bg-red-500 text-white shadow-lg ring-4 ring-[#0f5731] sm:h-[4.5rem] sm:w-[4.5rem]">
                      <span className="text-lg font-black leading-none sm:text-xl">{s.discountPct}%</span>
                      <span className="text-[9px] font-bold uppercase tracking-wide">Off</span>
                    </div>
                  )}
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
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur transition-colors hover:bg-white/25"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next deal"
              onClick={() => go(index + 1)}
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur transition-colors hover:bg-white/25"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {slides.map((slide, i) => (
            <button
              key={slide.slug}
              type="button"
              aria-label={`Go to deal ${i + 1}`}
              aria-current={i === index ? 'true' : 'false'}
              onClick={() => go(i)}
              className={`h-2 rounded-full transition-all ${i === index ? 'w-7 bg-[#1B7A3E]' : 'w-2 bg-gray-300 hover:bg-gray-400'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
