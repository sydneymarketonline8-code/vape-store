import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import type { FlavourSibling } from '@/lib/flavours'

/**
 * "More flavours in this range" — sibling flavour SKUs as image tiles. Each tile
 * is a real product (the flavour), linking to its page. Strong internal linking
 * between flavour variants; no fabricated colour swatches or data.
 */
export function FlavourRange({
  rangeName,
  currentLabel,
  siblings,
}: {
  rangeName: string
  currentLabel: string
  siblings: FlavourSibling[]
}) {
  return (
    <section className="mt-14" aria-label={`More ${rangeName} flavours`}>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">More {rangeName} flavours</h2>
          <p className="mt-0.5 text-sm text-gray-500">You&apos;re viewing {currentLabel} — {siblings.length}+ more in this range.</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {siblings.map(({ product, label }) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group rounded-xl border border-gray-200 bg-white p-2 transition-all hover:border-[#1B7A3E] hover:shadow-sm"
            title={product.name}
          >
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-50">
              <Image
                src={product.image}
                alt={`${product.name} — buy online Australia | Aussie Vape`}
                fill
                sizes="(max-width:640px) 30vw, (max-width:1024px) 22vw, 14vw"
                className="object-contain p-1.5 transition-transform group-hover:scale-105"
              />
            </div>
            <p className="mt-1.5 line-clamp-2 text-xs font-medium text-gray-800 group-hover:text-[#1B7A3E]">{label}</p>
            <p className="text-xs font-bold text-gray-900">{formatPrice(product.price)}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
