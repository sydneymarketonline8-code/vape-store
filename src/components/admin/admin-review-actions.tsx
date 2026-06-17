'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, Loader2 } from 'lucide-react'

export function AdminReviewActions({ reviewId, status }: { reviewId: string; status: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function set(next: 'approved' | 'rejected') {
    setBusy(true)
    try {
      await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex justify-end gap-2">
      <button type="button" disabled={busy || status === 'approved'} onClick={() => set('approved')}
        className="inline-flex items-center gap-1 rounded-lg border border-green-200 bg-green-50 px-2.5 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100 disabled:opacity-40">
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} Approve
      </button>
      <button type="button" disabled={busy || status === 'rejected'} onClick={() => set('rejected')}
        className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-40">
        <X className="h-3.5 w-3.5" /> Reject
      </button>
    </div>
  )
}
