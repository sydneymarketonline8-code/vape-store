'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Check } from 'lucide-react'

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']

export function AdminOrderActions({
  orderId,
  initialStatus,
  initialTracking,
  initialCarrier,
  initialNote,
}: {
  orderId: string
  initialStatus: string
  initialTracking: string
  initialCarrier: string
  initialNote: string
}) {
  const router = useRouter()
  const [status, setStatus] = useState(initialStatus)
  const [tracking, setTracking] = useState(initialTracking)
  const [carrier, setCarrier] = useState(initialCarrier)
  const [note, setNote] = useState(initialNote)
  const [busy, setBusy] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function patch(payload: Record<string, unknown>, key: string) {
    setBusy(key)
    setError('')
    setDone(null)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error ?? 'Update failed.')
        return
      }
      setDone(key)
      router.refresh()
      setTimeout(() => setDone(null), 2000)
    } catch {
      setError('Network error.')
    } finally {
      setBusy(null)
    }
  }

  const label = (key: string, fallback: string) =>
    busy === key ? <Loader2 className="h-4 w-4 animate-spin" /> : done === key ? <Check className="h-4 w-4" /> : fallback

  return (
    <div className="space-y-4">
      {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      {/* Status */}
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <p className="mb-2 text-sm font-semibold text-neutral-900">Order Status</p>
        <div className="flex gap-2">
          <select aria-label="Order status" value={status} onChange={e => setStatus(e.target.value)}
            className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm capitalize focus:border-primary focus:outline-none">
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button type="button" onClick={() => patch({ status }, 'status')} disabled={busy != null}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60">
            {label('status', 'Save')}
          </button>
        </div>
      </div>

      {/* Tracking */}
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <p className="mb-2 text-sm font-semibold text-neutral-900">Shipping & Tracking</p>
        <p className="mb-2 text-xs text-neutral-400">Saving a tracking number marks the order as shipped.</p>
        <div className="space-y-2">
          <input value={tracking} onChange={e => setTracking(e.target.value)} placeholder="Tracking number"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
          <input value={carrier} onChange={e => setCarrier(e.target.value)} placeholder="Carrier (e.g. Australia Post)"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
          <button type="button" onClick={() => patch({ trackingNumber: tracking, carrier }, 'tracking')} disabled={busy != null}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60">
            {label('tracking', 'Save Tracking')}
          </button>
        </div>
      </div>

      {/* Internal note */}
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <p className="mb-2 text-sm font-semibold text-neutral-900">Internal Note</p>
        <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="Notes visible to staff only"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
        <button type="button" onClick={() => patch({ note }, 'note')} disabled={busy != null}
          className="mt-2 flex items-center gap-1.5 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:border-neutral-400 disabled:opacity-60">
          {label('note', 'Save Note')}
        </button>
      </div>

      {/* Refund */}
      <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
        <p className="mb-1 text-sm font-semibold text-neutral-900">Refund</p>
        <p className="mb-2 text-xs text-neutral-500">Marks the order refunded. Payment is reversed manually (PayID/crypto).</p>
        <button type="button"
          onClick={() => { if (confirm('Mark this order as refunded?')) patch({ refund: true }, 'refund') }}
          disabled={busy != null}
          className="flex items-center gap-1.5 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-60">
          {label('refund', 'Issue Refund')}
        </button>
      </div>
    </div>
  )
}
