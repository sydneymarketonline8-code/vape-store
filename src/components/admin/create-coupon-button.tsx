'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, Loader2 } from 'lucide-react'

export function CreateCouponButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    code: '', type: 'percent', value: '', minOrderValue: '', maxUses: '', expiresAt: '', isActive: true,
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setError(data.error ?? 'Could not create coupon.'); return }
      setOpen(false)
      setForm({ code: '', type: 'percent', value: '', minOrderValue: '', maxUses: '', expiresAt: '', isActive: true })
      router.refresh()
    } catch {
      setError('Network error.')
    } finally {
      setSaving(false)
    }
  }

  const inputCls = 'w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none'

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
        <Plus className="h-4 w-4" /> Create Coupon
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-900">New Coupon</h3>
              <button type="button" aria-label="Close" onClick={() => setOpen(false)}><X className="h-5 w-5 text-neutral-400" /></button>
            </div>
            <form onSubmit={submit} className="space-y-3">
              <input required value={form.code} onChange={set('code')} placeholder="CODE (e.g. SAVE10)" className={`${inputCls} font-mono uppercase`} />
              <div className="grid grid-cols-2 gap-3">
                <select aria-label="Type" value={form.type} onChange={set('type')} className={inputCls}>
                  <option value="percent">Percentage %</option>
                  <option value="fixed">Fixed $</option>
                </select>
                <input required type="number" step="0.01" value={form.value} onChange={set('value')} placeholder={form.type === 'percent' ? 'e.g. 10' : 'e.g. 25'} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" step="0.01" value={form.minOrderValue} onChange={set('minOrderValue')} placeholder="Min order $" className={inputCls} />
                <input type="number" value={form.maxUses} onChange={set('maxUses')} placeholder="Max uses (blank = ∞)" className={inputCls} />
              </div>
              <label className="block text-xs font-medium text-neutral-500">
                Expires
                <input type="date" value={form.expiresAt} onChange={set('expiresAt')} className={`${inputCls} mt-1`} />
              </label>
              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input type="checkbox" checked={form.isActive} onChange={set('isActive')} className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary" />
                Active
              </label>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button type="submit" disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />} Create Coupon
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
