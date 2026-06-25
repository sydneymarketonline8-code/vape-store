import type { Metadata } from 'next'
import Link from 'next/link'
import { ShoppingBag, Store, ArrowRight, ExternalLink } from 'lucide-react'
import { whatsappLink } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Where to Buy',
  description: 'Buy Aussie Vape products online with fast Australia-wide delivery, or find our authorised stockists.',
}

interface Stockist {
  name: string
  location: string
  url?: string
}

// Authorised stockists / retail partners. Add entries as partnerships are set up.
const STOCKISTS: Stockist[] = []

export default function WhereToBuyPage() {
  const stockistWa = whatsappLink('Hi Aussie Vape, I’m a retailer interested in stocking your products.')

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">Where to Buy</h1>
        <p className="mx-auto mt-3 max-w-2xl text-gray-600">
          Aussie Vape is an online store — shop our full range direct, with fast tracked delivery Australia-wide.
        </p>
      </div>

      {/* Shop online */}
      <div className="mx-auto mt-10 max-w-xl rounded-2xl border-2 border-primary/30 bg-primary/5 p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white">
          <ShoppingBag className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Shop Online</h2>
        <p className="mt-2 text-sm text-gray-600">Browse 2,000+ products and have them delivered to your door.</p>
        <Link href="/products" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark">
          Shop All Products <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Stockists */}
      <section className="mt-16">
        <h2 className="text-center text-2xl font-bold text-gray-900">Authorised Stockists</h2>
        {STOCKISTS.length === 0 ? (
          <p className="mx-auto mt-4 max-w-xl text-center text-sm text-gray-500">
            We don&apos;t have physical retail stockists listed yet — the best place to buy is online, direct from us.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {STOCKISTS.map(s => {
              const inner = (
                <div className="flex h-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-5 text-center transition-shadow hover:shadow-md">
                  <Store className="mb-2 h-6 w-6 text-primary" />
                  <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.location}</p>
                  {s.url && <span className="mt-1 inline-flex items-center gap-1 text-xs text-primary">Visit <ExternalLink className="h-3 w-3" /></span>}
                </div>
              )
              return s.url ? (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer">{inner}</a>
              ) : (
                <div key={s.name}>{inner}</div>
              )
            })}
          </div>
        )}
      </section>

      {/* Become a stockist */}
      <section className="mt-16 rounded-2xl bg-gray-50 px-6 py-10 text-center">
        <h2 className="text-xl font-bold text-gray-900">Want to stock Aussie Vape?</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-gray-600">
          Retailers — reach out about wholesale and trade pricing.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/wholesale" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">Wholesale Info</Link>
          <a href={stockistWa} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-gray-400">Enquire on WhatsApp</a>
        </div>
      </section>
    </div>
  )
}
