import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { products } from '@/data/products'
import { StarRating } from '@/components/shop/star-rating'
import { AdminReviewActions } from '@/components/admin/admin-review-actions'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Reviews' }

const TABS = [
  { key: 'pending', label: 'Pending Approval' },
  { key: 'approved', label: 'Approved' },
  { key: 'all', label: 'All' },
] as const

type Review = {
  id: string; product_id: string; reviewer_name: string; rating: number
  title: string | null; body: string; status: string; created_at: string
}

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab = 'pending' } = await searchParams
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  let query = db.from('reviews').select('id, product_id, reviewer_name, rating, title, body, status, created_at').order('created_at', { ascending: false })
  if (tab === 'pending') query = query.eq('status', 'pending')
  else if (tab === 'approved') query = query.eq('status', 'approved')

  const { data } = await query
  const reviews = (data ?? []) as Review[]
  const productName = (id: string) => products.find(p => p.id === id)?.name ?? id

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">Reviews</h1>

      <div className="mb-4 flex gap-1.5">
        {TABS.map(t => (
          <Link key={t.key} href={`/admin/reviews?tab=${t.key}`}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-primary text-white' : 'border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100'
            }`}>
            {t.label}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        {reviews.length === 0 ? (
          <p className="p-8 text-center text-sm text-neutral-400">No reviews{tab === 'pending' ? ' awaiting approval' : ''}.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-neutral-100 bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
                <tr><th className="px-5 py-3 font-medium">Product</th><th className="px-5 py-3 font-medium">Reviewer</th><th className="px-5 py-3 font-medium">Rating</th><th className="px-5 py-3 font-medium">Review</th><th className="px-5 py-3 font-medium">Date</th><th className="px-5 py-3 text-right font-medium">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {reviews.map(r => (
                  <tr key={r.id} className="align-top hover:bg-neutral-50">
                    <td className="px-5 py-3 text-neutral-800">{productName(r.product_id)}</td>
                    <td className="px-5 py-3 text-neutral-600">{r.reviewer_name}</td>
                    <td className="px-5 py-3"><StarRating value={r.rating} showCount={false} size={13} /></td>
                    <td className="max-w-xs px-5 py-3">
                      {r.title && <p className="font-medium text-neutral-900">{r.title}</p>}
                      <p className="line-clamp-2 text-neutral-600">{r.body}</p>
                    </td>
                    <td className="px-5 py-3 text-neutral-500">{new Date(r.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</td>
                    <td className="px-5 py-3"><AdminReviewActions reviewId={r.id} status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
