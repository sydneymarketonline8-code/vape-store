import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Truck, PackageCheck, Clock, ShieldCheck, MapPin } from 'lucide-react'
import { STATES } from '@/data/locations'
import { PageSchema, FaqList, type Faq } from '@/components/common/page-schema'
import { Crumb, H2, IconCard, StatCard } from '@/components/common/page-ui'

export const metadata: Metadata = {
  title: 'Vape Delivery Australia — Every State & Territory',
  description:
    'Fast, tracked vape delivery Australia-wide — NSW, VIC, QLD, WA, SA, TAS, ACT & NT. Dispatch within one business day, free shipping over $300. Buy vapes online for delivery to your state.',
  alternates: { canonical: '/vape-delivery' },
}

const faqs: Faq[] = [
  {
    q: 'Does Aussie Vape deliver vapes Australia-wide?',
    a: 'Yes. We ship to every state and territory in Australia — NSW, VIC, QLD, WA, SA, TAS, ACT and NT — from metro capitals to regional and remote areas.',
  },
  {
    q: 'How fast is vape delivery in Australia?',
    a: 'Orders are dispatched from our Australian warehouse within one business day of payment being confirmed. East-coast metro areas typically receive orders in 2–5 business days; WA, TAS and the NT can take a little longer. Every order is tracked.',
  },
  {
    q: 'Is shipping free?',
    a: 'Orders over $300 ship free Australia-wide. A flat-rate fee applies to orders under $300, and a $250 minimum order applies to all purchases.',
  },
  {
    q: 'Do vaping laws differ by state?',
    a: 'Vaping products are regulated nationally by the TGA and you must be 18+ everywhere in Australia. Public and indoor vaping (smoke-free area) rules are administered by each state and territory health authority. Pick your state below for local details, or see our Vaping Laws page.',
  },
]

export default function VapeDeliveryPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageSchema name="Vape Delivery Australia" slug="/vape-delivery" faqs={faqs} />
      <Crumb name="Vape Delivery" />

      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Vape Delivery Australia</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-gray-500">
        Fast, tracked delivery to every Australian state and territory. Choose your state for local delivery times and the
        rules that apply where you live.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-4">
        <StatCard icon={Truck} label="Australia-Wide" sub="All states & territories" />
        <StatCard icon={Clock} label="~1 Business Day" sub="Dispatch after payment" />
        <StatCard icon={PackageCheck} label="Free over $300" sub="Tracked delivery" />
        <StatCard icon={ShieldCheck} label="Age-Verified" sub="18+ only" />
      </div>

      <H2>Choose your state or territory</H2>
      <div className="grid gap-3 sm:grid-cols-2">
        {STATES.map(s => (
          <Link
            key={s.slug}
            href={`/vape-delivery/${s.slug}`}
            className="group flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-[#1B7A3E]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50">
              <MapPin className="h-4 w-4 text-[#1B7A3E]" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-gray-900 group-hover:text-[#1B7A3E]">
                {s.name} <span className="text-gray-400">({s.abbr})</span>
              </span>
              <span className="mt-0.5 block text-sm text-gray-500">
                Delivery to {s.capital} — {s.deliveryDays}
              </span>
            </span>
            <ArrowRight className="ml-auto mt-1 h-4 w-4 shrink-0 text-gray-300 group-hover:text-[#1B7A3E]" />
          </Link>
        ))}
      </div>

      <H2>How Australia-wide delivery works</H2>
      <div className="grid gap-3 sm:grid-cols-3">
        <IconCard icon={Clock} title="Dispatch">
          Packed and shipped from our Australian warehouse within one business day of payment confirmation.
        </IconCard>
        <IconCard icon={Truck} title="Delivery">
          2–5 business days to most metro areas; WA, TAS and NT a little longer. Regional areas may add a day or two.
        </IconCard>
        <IconCard icon={PackageCheck} title="Tracking" href="/order-tracking" cta="Track an order">
          Every order is tracked end to end, and we can share the link with you on WhatsApp.
        </IconCard>
      </div>
      <p className="mt-3 text-sm text-gray-500">
        See full costs and timings on our <Link href="/shipping" className="font-medium text-[#1B7A3E] hover:underline">shipping policy</Link> page.
      </p>

      <H2>Vape delivery FAQ</H2>
      <FaqList items={faqs} />

      <div className="mt-12 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-10 text-center">
        <h2 className="text-lg font-bold text-gray-900">Ready to order?</h2>
        <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">Browse the full range and we&apos;ll get it on the way to your state fast.</p>
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
