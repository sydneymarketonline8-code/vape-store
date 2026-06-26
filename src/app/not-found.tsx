import Link from 'next/link'
import { Home, Search } from 'lucide-react'
import { DisposableVapeIcon } from '@/components/icons/category-icons'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <p className="bg-gradient-to-br from-emerald-500 to-green-800 bg-clip-text text-7xl font-black tracking-tighter text-transparent sm:text-9xl">
        404
      </p>
      <DisposableVapeIcon className="mx-auto mt-3 h-16 w-16" aria-hidden />
      <h1 className="mt-4 text-2xl font-bold text-gray-900">This page went up in vapour</h1>
      <p className="mt-2 max-w-md text-gray-500">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back on track.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark">
          <Home className="h-4 w-4" /> Go Home
        </Link>
        <Link href="/search" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:border-gray-400">
          <Search className="h-4 w-4" /> Search Products
        </Link>
      </div>
      <Link href="/products" className="mt-4 text-sm text-primary hover:underline">
        Or browse all products →
      </Link>
    </div>
  )
}
