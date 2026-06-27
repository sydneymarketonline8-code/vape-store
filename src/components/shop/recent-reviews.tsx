'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Star, Quote } from 'lucide-react'

interface RecentReview {
  id: string
  rating: number
  title: string | null
  body: string
  reviewerName: string
  createdAt: string
  product: { name: string; slug: string; brand: string }
}

function obfuscate(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0]
  return `${parts[0]} ${parts[parts.length - 1][0]}.`
}

/**
 * Homepage social proof — the latest genuine, approved customer reviews. Renders
 * nothing until real reviews exist, so no fabricated testimonials are ever shown.
 */
export function RecentReviews() {
  const [reviews, setReviews] = useState<RecentReview[] | null>(null)

  useEffect(() => {
    let active = true
    fetch('/api/reviews/recent')
      .then(r => r.json())
      .then(d => { if (active) setReviews(d.reviews ?? []) })
      .catch(() => { if (active) setReviews([]) })
    return () => { active = false }
  }, [])

  if (!reviews || reviews.length === 0) return null

  return (
    <section className="border-t border-gray-100 bg-gray-50 py-14" aria-label="Customer reviews">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">What Our Customers Say</h2>
        <p className="mb-6 text-sm text-gray-500">Verified, approved reviews from real Aussie Vape customers.</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 6).map(r => (
            <figure key={r.id} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5">
              <Quote className="h-5 w-5 text-[#1B7A3E]/30" aria-hidden />
              <div className="mt-2 flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.round(r.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                ))}
              </div>
              {r.title && <figcaption className="mt-2 font-semibold text-gray-900">{r.title}</figcaption>}
              <blockquote className="mt-1 flex-1 text-sm leading-relaxed text-gray-600 line-clamp-4">{r.body}</blockquote>
              <p className="mt-3 text-xs text-gray-400">
                {obfuscate(r.reviewerName)} on{' '}
                <Link href={`/products/${r.product.slug}`} className="font-medium text-[#1B7A3E] hover:underline">
                  {r.product.name}
                </Link>
              </p>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
