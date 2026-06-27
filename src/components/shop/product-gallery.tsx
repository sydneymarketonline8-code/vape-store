'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { Play, X } from 'lucide-react'
import type { Product } from '@/types'
import { productImages } from '@/lib/product-image'

/**
 * Desktop: large main image (hover-zoom) + scrollable 80px thumbnail strip;
 * clicking a thumb cross-fades the main image. Mobile: a CSS scroll-snap
 * swipeable carousel (no embla dependency). If product.videoUrl exists, the
 * last thumb is a play button that opens a modal with an embedded iframe.
 */
export function ProductGallery({ product }: { product: Product }) {
  const images = productImages(product).slice(0, 6)
  const [active, setActive] = useState(0)
  const [videoOpen, setVideoOpen] = useState(false)

  return (
    <div>
      {/* ── Mobile: swipeable scroll-snap carousel ── */}
      <div className="lg:hidden">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-2xl pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((src, i) => (
            <div
              key={i}
              className="relative aspect-square w-[85%] shrink-0 snap-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"
            >
              <Image src={src} alt={`${product.name} — image ${i + 1}`} fill className="object-contain p-6" unoptimized />
            </div>
          ))}
        </div>
      </div>

      {/* ── Desktop: main image + thumbnail strip ── */}
      <div className="hidden lg:block">
        <div className="group relative aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <Image
                src={images[active]}
                alt={product.name}
                fill
                priority
                className="object-contain p-8 transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {(images.length > 1 || product.videoUrl) && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {images.map((src, i) => (
              <button
                key={i}
                type="button"
                aria-label={`View image ${i + 1}`}
                aria-current={i === active}
                onClick={() => setActive(i)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-gray-50 transition-colors ${
                  i === active ? 'border-primary ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-contain p-1.5" unoptimized />
              </button>
            ))}

            {product.videoUrl && (
              <button
                type="button"
                aria-label="Play product video"
                onClick={() => setVideoOpen(true)}
                className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-900 text-white transition-colors hover:bg-gray-800"
              >
                <Play className="h-6 w-6 fill-white" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Video modal ── */}
      <AnimatePresence>
        {videoOpen && product.videoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setVideoOpen(false)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
          >
            <div className="relative aspect-video w-full max-w-3xl" onClick={e => e.stopPropagation()}>
              <button
                type="button"
                aria-label="Close video"
                onClick={() => setVideoOpen(false)}
                className="absolute -top-10 right-0 text-white/80 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
              <iframe
                src={product.videoUrl}
                title={`${product.name} video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full rounded-xl"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
