import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Truck, Clock, PackageCheck, ShieldCheck, MapPin, Scale } from 'lucide-react'
import { products } from '@/data/products'
import { STATES, getState } from '@/data/locations'
import { ProductCard } from '@/components/shop/product-card'
import { PageSchema, FaqList, type Faq } from '@/components/common/page-schema'
import { H2, IconCard, StatCard, Callout } from '@/components/common/page-ui'

export const dynamicParams = false

export function generateStaticParams() {
  return STATES.map(s => ({ state: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state } = await params
  const s = getState(state)
  if (!s) return {}
  return {
    title: `Buy Vapes Online in ${s.name} | Fast Vape Delivery to ${s.capital}`,
    description: `Order vapes online for delivery across ${s.name} — ${s.capital}, ${s.cities[1]}, ${s.cities[2]} and more. Disposables, pods, e-liquids & pouches, tracked ${s.deliveryDays}. Free over $300. 18+.`,
    alternates: { canonical: `/vape-delivery/${s.slug}` },
  }
}

const popularity = (p: (typeof products)[number]) => (p.featured ? 1_000_000 : 0) + (p.reviewCount ?? 0)

export default async function StateDeliveryPage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params
  const s = getState(state)
  if (!s) notFound()

  const popular = products.filter(p => p.inStock).sort((a, b) => popularity(b) - popularity(a)).slice(0, 4)
  const cityList = s.cities.slice(0, 4).join(', ')

  const faqs: Faq[] = [
    {
      q: `Do you deliver vapes to ${s.name}?`,
      a: `Yes — Aussie Vape ships Australia-wide, including all of ${s.name}, from ${s.capital} to regional areas like ${s.cities.slice(1, 4).join(', ')}. Orders are dispatched within one business day of payment being confirmed and typically arrive in ${s.deliveryDays}.`,
    },
    {
      q: `How long does vape delivery take to ${s.capital}?`,
      a: `Metro ${s.capital} orders usually arrive in ${s.deliveryDays} after dispatch, while regional ${s.name} can take a little longer. Every order is sent with tracking so you can follow it to your door.`,
    },
    {
      q: `Is there free vape shipping in ${s.name}?`,
      a: `Yes. Orders over $300 ship free anywhere in ${s.name}. A flat-rate shipping fee applies to orders under $300, and a $250 minimum order applies to all purchases.`,
    },
    {
      q: `Is it legal to buy vapes in ${s.name}?`,
      a: `Vaping products are regulated nationally by the TGA and you must be 18 or older to purchase. Public and indoor vaping rules in ${s.name} are administered by ${s.health.name}. The rules changed in 2024 and continue to change — see our Vaping Laws page and ${s.health.name} for the current position. This is general information, not legal advice.`,
    },
  ]

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageSchema name={`Vape Delivery ${s.abbr}`} slug={`/vape-delivery/${s.slug}`} faqs={faqs} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-gray-400">
        <Link href="/" className="hover:text-[#1B7A3E]">Home</Link>
        <span>/</span>
        <Link href="/vape-delivery" className="hover:text-[#1B7A3E]">Vape Delivery</Link>
        <span>/</span>
        <span className="text-gray-600">{s.name}</span>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Buy Vapes Online in {s.name}
      </h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-gray-500">
        Fast, tracked vape delivery to {s.capital} and across {s.name} — including {cityList} and beyond. Shop disposables,
        pods, e-liquids and nicotine pouches with dispatch within one business day and free shipping on orders over $300.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-4">
        <StatCard icon={Truck} label={s.deliveryDays} sub={`Tracked to ${s.capital}`} />
        <StatCard icon={PackageCheck} label="Free over $300" sub={`Across ${s.abbr}`} />
        <StatCard icon={Clock} label="~1 Business Day" sub="Dispatch" />
        <StatCard icon={ShieldCheck} label="Age-Verified" sub="18+ only" />
      </div>

      <H2>Areas we deliver to in {s.name}</H2>
      <p className="mb-4 max-w-2xl text-sm text-gray-500">
        We deliver to every postcode in {s.name}. Popular delivery areas include:
      </p>
      <div className="flex flex-wrap gap-2">
        {s.cities.map(c => (
          <span key={c} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700">
            <MapPin className="h-3 w-3 text-[#1B7A3E]" /> {c}
          </span>
        ))}
      </div>

      <H2>Shipping to {s.name}</H2>
      <div className="grid gap-3 sm:grid-cols-3">
        <IconCard icon={Clock} title="Fast dispatch">
          Orders are packed and dispatched within one business day of payment being confirmed.
        </IconCard>
        <IconCard icon={Truck} title="Delivery time">
          Typically {s.deliveryDays} to {s.capital}; regional {s.name} may take a little longer.
        </IconCard>
        <IconCard icon={PackageCheck} title="Tracked" href="/order-tracking" cta="Track an order">
          Every {s.abbr} order ships with tracking, and we can share it on WhatsApp.
        </IconCard>
      </div>
      <p className="mt-3 text-sm text-gray-500">
        Full details on our <Link href="/shipping" className="font-medium text-[#1B7A3E] hover:underline">shipping policy</Link> page.
      </p>

      <H2>Popular vapes delivered to {s.name}</H2>
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {popular.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <Link href="/products" className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[#1B7A3E] hover:underline">
        Shop all products <ArrowRight className="h-3.5 w-3.5" />
      </Link>

      <H2>Vaping laws in {s.name}</H2>
      <Callout icon={Scale} title={`${s.abbr} rules at a glance`}>
        <p>
          You must be 18 or older to buy vaping products in {s.name}. They&apos;re regulated nationally by the TGA, while public and
          indoor vaping (smoke-free area) rules are administered by{' '}
          <a href={s.health.url} target="_blank" rel="noopener noreferrer" className="font-medium text-[#1B7A3E] hover:underline">{s.health.name}</a>.
          The rules changed in 2024 and keep evolving — see our{' '}
          <Link href="/vaping-laws" className="font-medium text-[#1B7A3E] hover:underline">vaping laws</Link> page and {s.health.name} for
          the current position. General information only, not legal advice.
        </p>
      </Callout>

      <H2>{s.abbr} vape delivery FAQ</H2>
      <FaqList items={faqs} />

      {/* CTA band */}
      <div className="mt-12 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-10 text-center">
        <h2 className="text-lg font-bold text-gray-900">Order vapes to {s.capital} today</h2>
        <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
          Dispatched within one business day, tracked all the way to your door in {s.name}.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/products" className="rounded-lg bg-[#1B7A3E] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#156331]">
            Shop All Vapes
          </Link>
          <Link href="/deals" className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 transition-colors hover:border-gray-400">
            View Pack Deals
          </Link>
        </div>
      </div>

      <p className="mt-8 text-xs text-gray-400">For adults 18+ only. Nicotine is an addictive chemical.</p>
    </div>
  )
}
