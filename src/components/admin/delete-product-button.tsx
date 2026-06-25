'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function remove() {
    if (!confirm(`Delete "${name}"? This removes it from the database.`)) return
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      if (res.ok) router.refresh()
      else alert('Delete failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={remove}
      disabled={busy}
      aria-label={`Delete ${name}`}
      className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
    >
      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
      Delete
    </button>
  )
}
