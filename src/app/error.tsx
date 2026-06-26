'use client'

import Link from 'next/link'
import { RefreshCw, Home, AlertTriangle } from 'lucide-react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <AlertTriangle className="h-12 w-12 text-amber-500" aria-hidden />
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Something went wrong</h1>
      <p className="mt-2 max-w-md text-gray-500">
        An unexpected error occurred. You can try again, or head back to the homepage.
      </p>
      {error.digest && <p className="mt-1 text-xs text-gray-300">Ref: {error.digest}</p>}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button onClick={() => reset()} className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark">
          <RefreshCw className="h-4 w-4" /> Reload
        </button>
        <Link href="/" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:border-gray-400">
          <Home className="h-4 w-4" /> Go Home
        </Link>
      </div>
    </div>
  )
}
