/** Lightweight inline SVG area sparkline (no charting dependency). */
export function Sparkline({ data, className = 'text-primary' }: { data: number[]; className?: string }) {
  if (data.length < 2) return <div className="h-9" />
  const w = 120
  const h = 36
  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const range = max - min || 1
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w
      const y = h - ((v - min) / range) * h
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={`h-9 w-full ${className}`} preserveAspectRatio="none" aria-hidden>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill="currentColor" opacity="0.12" />
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
