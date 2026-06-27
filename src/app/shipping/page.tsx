import type { Metadata } from 'next'
import Link from 'next/link'
import { Truck, Clock, MapPin, DollarSign, PackageCheck, ShieldCheck, Globe } from 'lucide-react'
import { PageSchema, FaqList, type Faq } from '@/components/common/page-schema'
import { Crumb, H2, IconCard, StatCard, Callout } from '@/components/common/page-ui'

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description:
    'Aussie Vape shipping — free AU delivery over $300, fast dispatch and tracked delivery to every Australian state. Australia-wide only.',
  alternates: { canonical: '/shipping' },
}

const faqs: Faq[] = [
  {
    q: 'Does Aussie Vape offer free shipping?',
    a: 'Yes — orders over $300 ship free, Australia-wide. A flat-rate shipping fee applies to orders under $300, and a minimum order of $250 applies to all purchases.',
  },
  {
    q: 'How long does Aussie Vape take to ship?',
    a: 'Orders are dispatched from our Australian warehouse within one business day of payment being confirmed. Delivery then typically takes 2–6 business days depending on your location.',
  },
  {
    q: 'Does Aussie Vape ship to all Australian states?',
    a: 'Yes, we deliver to every Australian state and territory. Regional and remote areas may take a little longer than metro areas.',
  },
  {
    q: 'Is my order tracked?',
    a: 'Yes, every order is sent with tracking. We add the tracking number to your account once your order ships, and can share it with you on WhatsApp.',
  },
  {
    q: 'Does Aussie Vape ship internationally?',
    a: 'No, we currently ship within Australia only and do not offer international delivery.',
  },
]

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageSchema name="Shipping" slug="/shipping" faqs={faqs} />
      <Crumb name="Shipping" />
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Shipping Policy</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-gray-500">
        Fast, tracked delivery to{' '}
        <Link href="/vape-delivery" className="font-medium text-[#1B7A3E] hover:underline">every Australian state and territory</Link>.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <StatCard icon={Truck} label="Free AU Shipping" sub="Orders over $300" />
        <StatCard icon={Clock} label="~1 Business Day" sub="Dispatch after payment" />
        <StatCard icon={PackageCheck} label="Tracked" sub="Australia-wide" />
      </div>

      <H2>Costs &amp; delivery</H2>
      <div className="grid gap-3 sm:grid-cols-2">
        <IconCard icon={DollarSign} title="Shipping costs">
          Flat-rate fee on orders under $300; orders over $300 ship free. A $250 minimum order applies.
        </IconCard>
        <IconCard icon={Clock} title="Dispatch">
          Within 1 business day of payment being confirmed. Weekend and public-holiday orders go out the next business day.
        </IconCard>
        <IconCard icon={Truck} title="Delivery time">
          Typically 2–6 business days depending on your location, with metro areas at the faster end.
        </IconCard>
        <IconCard icon={PackageCheck} title="Tracking" href="/account/orders" cta="My Orders">
          A tracking number is added to your account on dispatch, and we can share it on WhatsApp.
        </IconCard>
      </div>

      <H2>Good to know</H2>
      <div className="space-y-4">
        <Callout icon={ShieldCheck} title="Age verification on delivery">
          Our products are for adults 18+ only. A signature may be required and the courier may ask for ID — orders can&apos;t be left where age can&apos;t be verified.
        </Callout>
        <div className="grid gap-3 sm:grid-cols-2">
          <IconCard icon={MapPin} title="Remote areas">
            Regional and remote deliveries may take longer. We&apos;ll contact you directly about any stock or courier delays.
          </IconCard>
          <IconCard icon={Globe} title="International">
            We currently ship within Australia only and do not offer international delivery.
          </IconCard>
        </div>
      </div>

      <H2>Shipping FAQ</H2>
      <FaqList items={faqs} />

      <p className="mt-8 text-xs text-gray-400">For adults 18+ only. Nicotine is an addictive chemical.</p>
    </div>
  )
}
