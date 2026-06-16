import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * SEO-friendly pagination: every page is a real <Link> (crawlable).
 * `hrefForPage` builds the href so the parent controls query serialization.
 */
export function Pagination({
  currentPage,
  totalPages,
  hrefForPage,
}: {
  currentPage: number
  totalPages: number
  hrefForPage: (page: number) => string
}) {
  if (totalPages <= 1) return null

  // Windowed page list with ellipses: 1 … 4 5 [6] 7 8 … 20
  const pages: (number | 'gap')[] = []
  const push = (n: number) => pages.push(n)
  const window = 1
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || (p >= currentPage - window && p <= currentPage + window)) {
      push(p)
    } else if (pages[pages.length - 1] !== 'gap') {
      pages.push('gap')
    }
  }

  const base =
    'flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm transition-colors'

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Pagination">
      {currentPage > 1 ? (
        <Link href={hrefForPage(currentPage - 1)} rel="prev" aria-label="Previous page"
          className={`${base} border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900`}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className={`${base} cursor-not-allowed border-gray-100 text-gray-300`} aria-disabled>
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {pages.map((p, i) =>
        p === 'gap' ? (
          <span key={`gap-${i}`} className="px-1 text-gray-400">
            …
          </span>
        ) : p === currentPage ? (
          <span key={p} aria-current="page" className={`${base} border-primary bg-primary font-semibold text-white`}>
            {p}
          </span>
        ) : (
          <Link key={p} href={hrefForPage(p)}
            className={`${base} border-gray-200 text-gray-700 hover:border-gray-300 hover:text-primary`}>
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link href={hrefForPage(currentPage + 1)} rel="next" aria-label="Next page"
          className={`${base} border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900`}>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className={`${base} cursor-not-allowed border-gray-100 text-gray-300`} aria-disabled>
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  )
}
