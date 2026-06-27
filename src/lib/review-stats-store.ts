'use client'

import { useEffect } from 'react'
import { create } from 'zustand'

interface Stat {
  rating: number
  count: number
}

interface ReviewStatsState {
  stats: Record<string, Stat>
  status: 'idle' | 'loading' | 'done'
  ensure: () => void
}

/**
 * Lazily fetches the approved-review aggregates once (the first time any product
 * card mounts) and caches them for the session, so a grid of cards triggers a
 * single request rather than one per card.
 */
export const useReviewStatsStore = create<ReviewStatsState>((set, get) => ({
  stats: {},
  status: 'idle',
  ensure: () => {
    if (get().status !== 'idle') return
    set({ status: 'loading' })
    fetch('/api/review-stats')
      .then(r => r.json())
      .then(d => set({ stats: d.stats ?? {}, status: 'done' }))
      .catch(() => set({ status: 'done' }))
  },
}))

/** Real approved-review stat for a product, or undefined if it has none. */
export function useReviewStat(productId: string): Stat | undefined {
  const ensure = useReviewStatsStore(s => s.ensure)
  const stat = useReviewStatsStore(s => s.stats[productId])
  useEffect(() => {
    ensure()
  }, [ensure])
  return stat
}
