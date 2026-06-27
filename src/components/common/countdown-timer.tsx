'use client'

import { useEffect, useState } from 'react'

export function CountdownTimer() {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 })

  useEffect(() => {
    const endOfDay = () => {
      const d = new Date()
      d.setHours(23, 59, 59, 0)
      return d
    }
    const tick = () => {
      const diff = Math.max(0, endOfDay().getTime() - Date.now())
      setTime({
        h: Math.floor(diff / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
        s: Math.floor((diff % 60_000) / 1_000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const pad = (n: number) => n.toString().padStart(2, '0')

  return (
    <div className="flex items-center gap-2">
      {([time.h, time.m, time.s] as const).map((val, i) => (
        <div key={i} className="flex items-end gap-2">
          <div className="flex flex-col items-center">
            <span className="font-heading min-w-[3rem] rounded-lg border border-[#1e1e2e] bg-[#12121a] px-3 py-1.5 text-center text-2xl font-bold text-white tabular-nums">
              {pad(val)}
            </span>
            <span className="mt-1 text-[11px] font-medium uppercase tracking-widest text-slate-600">
              {['HRS', 'MIN', 'SEC'][i]}
            </span>
          </div>
          {i < 2 && (
            <span className="mb-6 text-xl font-bold text-violet-500">:</span>
          )}
        </div>
      ))}
    </div>
  )
}
