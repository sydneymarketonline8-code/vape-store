import { Star } from 'lucide-react'

/**
 * Star rating display with optional half-star and review count.
 * Renders 5 stars; the filled portion reflects `value` (0–5).
 */
export function StarRating({
  value,
  count,
  size = 16,
  showCount = true,
  className = '',
}: {
  value: number
  count?: number
  size?: number
  showCount?: boolean
  className?: string
}) {
  const rounded = Math.round(value * 2) / 2 // nearest half

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex" role="img" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
        {[0, 1, 2, 3, 4].map(i => {
          const fillPct = Math.max(0, Math.min(1, rounded - i)) * 100
          return (
            <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
              <Star className="absolute inset-0 text-gray-200" style={{ width: size, height: size }} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fillPct}%` }}>
                <Star
                  className="fill-amber-400 text-amber-400"
                  style={{ width: size, height: size }}
                />
              </span>
            </span>
          )
        })}
      </div>
      {showCount && (
        <span className="text-sm text-gray-500">
          {value.toFixed(1)}
          {count != null && (
            <>
              {' '}
              <span className="text-gray-300">|</span>{' '}
              <span className="text-primary">{count} review{count === 1 ? '' : 's'}</span>
            </>
          )}
        </span>
      )}
    </div>
  )
}
