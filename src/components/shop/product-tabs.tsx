'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Star, X, Loader2, BadgeCheck } from 'lucide-react'
import type { Product, ProductReview } from '@/types'
import { StarRating } from './star-rating'

const TABS = ['Description', 'Specifications', 'Shipping & Returns', 'Reviews'] as const
type Tab = typeof TABS[number]

const REVIEWS_PER_PAGE = 5

export function ProductTabs({
  product,
  rating,
  reviewCount,
}: {
  product: Product
  rating: number
  reviewCount: number
}) {
  const [tab, setTab] = useState<Tab>('Description')

  // Allow the rating row (ProductInfo) to deep-link here via #reviews.
  useEffect(() => {
    function syncFromHash() {
      if (window.location.hash === '#reviews') {
        setTab('Reviews')
        document.getElementById('product-tabs')?.scrollIntoView({ behavior: 'smooth' })
      }
    }
    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)
    return () => window.removeEventListener('hashchange', syncFromHash)
  }, [])

  return (
    <section id="product-tabs" className="mt-14 scroll-mt-24">
      <div className="flex flex-wrap border-b border-gray-200">
        {TABS.map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-medium transition-all ${
              tab === t ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {t}
            {t === 'Reviews' && reviewCount > 0 && (
              <span className="ml-1.5 text-xs text-gray-400">({reviewCount})</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 'Description' && <DescriptionTab product={product} />}
        {tab === 'Specifications' && <SpecsTab product={product} />}
        {tab === 'Shipping & Returns' && <ShippingTab />}
        {tab === 'Reviews' && <ReviewsTab product={product} rating={rating} reviewCount={reviewCount} />}
      </div>
    </section>
  )
}

// ── Description ───────────────────────────────────────────────────────────────
function DescriptionTab({ product }: { product: Product }) {
  // Catalogue descriptions are plain text, so we render them as text (XSS-safe).
  // If descriptions ever become rich HTML, sanitize with DOMPurify before
  // dangerouslySetInnerHTML.
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <p className="whitespace-pre-line leading-relaxed text-gray-600">{product.description}</p>
    </div>
  )
}

// ── Specifications ────────────────────────────────────────────────────────────
function SpecsTab({ product }: { product: Product }) {
  const entries: [string, string][] = product.specs
    ? Object.entries(product.specs)
    : ([
        ['Brand', product.brand],
        ['Category', product.category],
        ...(product.puffCount ? [['Puff Count', `${product.puffCount.toLocaleString()} puffs`]] : []),
        ...(product.mlSize ? [['E-Liquid Volume', `${product.mlSize}ml`]] : []),
        ...(product.flavors?.length ? [['Flavours', product.flavors.join(', ')]] : []),
        ...(product.nicotineStrengths?.length
          ? [['Nicotine Strengths', product.nicotineStrengths.map(n => `${n}mg`).join(', ')]]
          : []),
      ] as [string, string][])

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <tbody>
          {entries.map(([k, v], i) => (
            <tr key={k} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <th scope="row" className="w-1/3 px-4 py-3 text-left font-medium text-gray-500">{k}</th>
              <td className="px-4 py-3 text-gray-900">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Shipping & Returns ────────────────────────────────────────────────────────
function ShippingTab() {
  return (
    <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 text-sm leading-relaxed text-gray-600">
      <div>
        <h3 className="mb-1 font-semibold text-gray-900">Shipping</h3>
        <p>Free standard shipping Australia-wide on orders over $300. Orders are dispatched from our Sydney warehouse within 1 business day and typically arrive in 2–5 business days. A $250 minimum order applies.</p>
      </div>
      <div>
        <h3 className="mb-1 font-semibold text-gray-900">Returns</h3>
        <p>Unopened products may be returned within 30 days for a refund or exchange. For hygiene and safety reasons, opened e-liquids, disposables and pouches cannot be returned unless faulty.</p>
      </div>
      <div>
        <h3 className="mb-1 font-semibold text-gray-900">Age Verification</h3>
        <p>All vaping products are strictly for adults 18 years and over. Orders may require age verification on delivery.</p>
      </div>
    </div>
  )
}

// ── Reviews ───────────────────────────────────────────────────────────────────
function obfuscateName(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0]
  return `${parts[0]} ${parts[parts.length - 1][0]}.`
}

function ReviewsTab({ product, rating, reviewCount }: { product: Product; rating: number; reviewCount: number }) {
  const [reviews, setReviews] = useState<ProductReview[] | null>(null)
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    let active = true
    fetch(`/api/reviews?productId=${encodeURIComponent(product.id)}`)
      .then(r => (r.ok ? r.json() : { reviews: [] }))
      .then(d => { if (active) setReviews(d.reviews ?? []) })
      .catch(() => { if (active) setReviews([]) })
    return () => { active = false }
  }, [product.id])

  // Distribution from loaded reviews.
  const dist = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    n: (reviews ?? []).filter(r => Math.round(r.rating) === stars).length,
  }))
  const loadedTotal = reviews?.length ?? 0
  const totalPages = Math.max(1, Math.ceil(loadedTotal / REVIEWS_PER_PAGE))
  const pageReviews = (reviews ?? []).slice((page - 1) * REVIEWS_PER_PAGE, page * REVIEWS_PER_PAGE)

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      {/* Aggregate */}
      <div className="grid gap-6 border-b border-gray-100 pb-6 sm:grid-cols-[200px_1fr]">
        <div className="flex flex-col items-center justify-center text-center">
          {reviewCount > 0 ? (
            <>
              <span className="text-5xl font-black text-gray-900">{rating.toFixed(1)}</span>
              <StarRating value={rating} showCount={false} className="mt-1" />
              <span className="mt-1 text-sm text-gray-400">{reviewCount} review{reviewCount === 1 ? '' : 's'}</span>
            </>
          ) : (
            <>
              <span className="text-3xl font-bold text-gray-300">—</span>
              <span className="mt-1 text-sm text-gray-400">No ratings yet</span>
            </>
          )}
        </div>
        <div className="flex flex-col justify-center gap-1.5">
          {dist.map(({ stars, n }) => {
            const pct = loadedTotal ? (n / loadedTotal) * 100 : 0
            return (
              <div key={stars} className="flex items-center gap-2 text-sm">
                <span className="flex w-12 items-center gap-1 text-gray-500">
                  {stars} <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-8 text-right text-gray-400">{n}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Write a review */}
      <div className="flex items-center justify-between py-4">
        <h3 className="font-semibold text-gray-900">Customer Reviews</h3>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          Write a Review
        </button>
      </div>

      {/* List */}
      {reviews === null ? (
        <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div>
      ) : pageReviews.length === 0 ? (
        <p className="py-10 text-center text-gray-500">No reviews yet. Be the first to review this product.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-100">
            {pageReviews.map(r => (
              <li key={r.id} className="py-4">
                <div className="mb-1 flex items-center gap-2">
                  <StarRating value={r.rating} showCount={false} size={14} />
                  {r.verified && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                      <BadgeCheck className="h-3.5 w-3.5" /> Verified Purchase
                    </span>
                  )}
                </div>
                {r.title && <p className="font-semibold text-gray-900">{r.title}</p>}
                <p className="mt-0.5 text-sm leading-relaxed text-gray-600">{r.body}</p>
                <p className="mt-1.5 text-xs text-gray-400">
                  {obfuscateName(r.reviewerName)} · {new Date(r.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPage(i + 1)}
                  className={`h-8 w-8 rounded-lg border text-sm ${
                    page === i + 1 ? 'border-primary bg-primary text-white' : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {modalOpen && <WriteReviewModal product={product} onClose={() => setModalOpen(false)} />}
    </div>
  )
}

// ── Write review modal ────────────────────────────────────────────────────────
function WriteReviewModal({
  product,
  onClose,
}: {
  product: Product
  onClose: () => void
}) {
  const [rating, setRating] = useState(5)
  const [hover, setHover] = useState(0)
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'auth' | 'error'>('idle')
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('saving')
    setError('')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, rating, reviewerName: name, title, body }),
      })
      if (res.status === 401) { setStatus('auth'); return }
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        setError(d.error ?? 'Something went wrong.')
        setStatus('error')
        return
      }
      setStatus('done')
    } catch {
      setError('Network error.')
      setStatus('error')
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Write a Review</h3>
          <button type="button" aria-label="Close" onClick={onClose}><X className="h-5 w-5 text-gray-400" /></button>
        </div>

        {status === 'done' ? (
          <div className="py-6 text-center">
            <p className="font-medium text-gray-900">Thanks for your review!</p>
            <p className="mt-1 text-sm text-gray-500">It will appear once approved by our team.</p>
            <button type="button" onClick={onClose} className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Close</button>
          </div>
        ) : status === 'auth' ? (
          <div className="py-6 text-center">
            <p className="font-medium text-gray-900">Please sign in to leave a review.</p>
            <Link href="/login" className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Sign In</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} type="button" aria-label={`${n} stars`}
                    onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} onClick={() => setRating(n)}>
                    <Star className={`h-7 w-7 ${n <= (hover || rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                  </button>
                ))}
              </div>
            </div>
            <input required value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Review title (optional)"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            <textarea required value={body} onChange={e => setBody(e.target.value)} placeholder="Your review" rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            {status === 'error' && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={status === 'saving'}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60">
              {status === 'saving' && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit Review
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
