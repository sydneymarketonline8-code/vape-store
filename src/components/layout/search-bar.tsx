'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Loader2, X } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface SearchResult {
  id: string
  slug: string
  name: string
  price: number
  image: string
}

interface SearchBarProps {
  /** full-width styling for the mobile expanded state */
  expanded?: boolean
  autoFocus?: boolean
  className?: string
  /** called after the user navigates to a result (e.g. to collapse mobile search) */
  onNavigate?: () => void
}

export function SearchBar({ expanded = false, autoFocus = false, className = '', onNavigate }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1) // keyboard-highlighted index (-1 = none)
  const rootRef = useRef<HTMLDivElement>(null)

  // Debounced fetch (300ms) with abort on re-type. All state updates happen
  // inside the async callback so none run synchronously in the effect body.
  useEffect(() => {
    const q = query.trim()
    const controller = new AbortController()
    const t = setTimeout(async () => {
      if (q.length < 2) {
        setResults([])
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=6`, {
          signal: controller.signal,
        })
        const data = await res.json()
        setResults(data.products ?? [])
        setOpen(true)
        setActive(-1)
      } catch (err) {
        if (!(err instanceof DOMException && err.name === 'AbortError')) setResults([])
      } finally {
        setLoading(false)
      }
    }, q.length < 2 ? 0 : 300)
    return () => {
      clearTimeout(t)
      controller.abort()
    }
  }, [query])

  // Close on click-outside.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  function goToResults() {
    const q = query.trim()
    if (!q) return
    setOpen(false)
    onNavigate?.()
    router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setOpen(false)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive(i => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      if (active >= 0 && results[active]) {
        e.preventDefault()
        setOpen(false)
        onNavigate?.()
        router.push(`/products/${results[active].slug}`)
      } else {
        goToResults()
      }
    }
  }

  const showPopover = open && query.trim().length >= 2

  return (
    <div ref={rootRef} className={`relative ${expanded ? 'w-full' : ''} ${className}`}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          role="combobox"
          aria-expanded={showPopover ? 'true' : 'false'}
          aria-controls="search-suggestions"
          aria-autocomplete="list"
          autoFocus={autoFocus}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search disposables, brands, e-liquids…"
          className="w-full rounded-full border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {loading ? (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />
        ) : query ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery('')
              setResults([])
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {showPopover && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          {results.length === 0 && !loading ? (
            <p className="px-4 py-6 text-center text-sm text-gray-500">
              No products found for &ldquo;{query.trim()}&rdquo;
            </p>
          ) : (
            <>
              <ul id="search-suggestions" role="listbox" className="max-h-[60vh] overflow-y-auto py-1">
                {results.map((p, i) => (
                  <li
                    key={p.id}
                    id={`search-option-${i}`}
                    role="option"
                    aria-selected={i === active ? 'true' : 'false'}
                    onMouseEnter={() => setActive(i)}
                  >
                    <Link
                      href={`/products/${p.slug}`}
                      tabIndex={-1}
                      onClick={() => {
                        setOpen(false)
                        onNavigate?.()
                      }}
                      className={`flex items-center gap-3 px-3 py-2 transition-colors ${
                        i === active ? 'bg-primary/5' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-gray-100">
                        {p.image && (
                          <Image src={p.image} alt="" fill sizes="40px" className="object-cover" />
                        )}
                      </div>
                      <span className="line-clamp-1 flex-1 text-sm text-gray-800">{p.name}</span>
                      <span className="shrink-0 text-sm font-semibold text-gray-900">
                        {formatPrice(p.price)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={goToResults}
                className="block w-full border-t border-gray-100 bg-gray-50 px-4 py-2.5 text-center text-sm font-medium text-primary hover:bg-gray-100"
              >
                View all results for &ldquo;{query.trim()}&rdquo;
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
