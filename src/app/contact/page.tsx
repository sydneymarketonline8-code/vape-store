import type { Metadata } from 'next'
import Link from 'next/link'
import { MessageCircle, Mail, ShoppingBag, Truck, RotateCcw, Store, Wallet, ChevronRight } from 'lucide-react'
import { PageSchema, FaqList, type Faq } from '@/components/common/page-schema'
import { whatsappLink } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Contact Aussie Vape — message us on WhatsApp or email for order help, product questions, returns and wholesale. Australian-based support.',
  alternates: { canonical: '/contact' },
}

const faqs: Faq[] = [
  {
    q: 'How do I contact Aussie Vape?',
    a: 'The fastest way is WhatsApp — tap the WhatsApp button on any page or message us directly. You can also email support@aussievape.com.au. Include your order number if your enquiry is about an existing order so we can help faster.',
  },
  {
    q: 'How quickly does Aussie Vape respond?',
    a: 'We reply to WhatsApp and email enquiries as quickly as we can, usually within one Australian business day. WhatsApp is typically the quickest.',
  },
  {
    q: 'Does Aussie Vape have a phone number?',
    a: 'We handle support through WhatsApp and email rather than a phone line, so there is a written record of your enquiry and order details. WhatsApp is the best way to reach us quickly.',
  },
  {
    q: 'How do I pay for my order?',
    a: 'Aussie Vape accepts PayID and cryptocurrency. After you place an order, use the WhatsApp button to confirm your payment method and receive the payment details, and we lock your order in. We do not store card details or offer buy-now-pay-later.',
  },
]

const HELP = [
  { icon: ShoppingBag, title: 'Orders & payment', desc: 'Placing an order, PayID or crypto payment, and confirming your order.', href: undefined },
  { icon: Truck, title: 'Delivery', desc: 'Tracking and delivery questions, Australia-wide.', href: '/order-tracking', cta: 'Order Tracking' },
  { icon: RotateCcw, title: 'Returns & refunds', desc: 'Faulty items or 30-day returns on unopened products.', href: '/returns', cta: 'Returns & Refunds' },
  { icon: Store, title: 'Wholesale & bulk', desc: 'Trade pricing and bulk packs for businesses.', href: '/wholesale', cta: 'Bulk & Wholesale' },
]

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageSchema name="Contact" slug="/contact" faqs={faqs} />

      <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/" className="hover:text-[#1B7A3E]">Home</Link>
        <span>/</span>
        <span className="text-gray-600">Contact</span>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Contact Aussie Vape</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-gray-500">
        Questions about an order, a product, payment or wholesale? Our Australian-based team is here to help by WhatsApp or email — usually within one business day.
      </p>

      {/* Contact method cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <a
          href={whatsappLink('Hi Aussie Vape, I have a question.')}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-[#1B7A3E] hover:shadow-sm"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50">
            <MessageCircle className="h-5 w-5 text-[#1B7A3E]" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-gray-900">WhatsApp <span className="text-[#1B7A3E]">— fastest</span></span>
            <span className="mt-0.5 block text-sm text-gray-500 group-hover:text-[#1B7A3E]">Message us on WhatsApp</span>
          </span>
        </a>
        <a
          href="mailto:support@aussievape.com.au"
          className="group flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-[#1B7A3E] hover:shadow-sm"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50">
            <Mail className="h-5 w-5 text-[#1B7A3E]" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-gray-900">Email</span>
            <span className="mt-0.5 block truncate text-sm text-gray-500 group-hover:text-[#1B7A3E]">support@aussievape.com.au</span>
          </span>
        </a>
      </div>

      {/* What we can help with */}
      <h2 className="mb-4 mt-12 text-xl font-bold text-gray-900">What we can help with</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {HELP.map(({ icon: Icon, title, desc, href, cta }) => {
          const inner = (
            <>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                <Icon className="h-4 w-4 text-gray-600" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-gray-900">{title}</span>
                <span className="mt-0.5 block text-sm text-gray-500">{desc}</span>
                {cta && (
                  <span className="mt-1 inline-flex items-center gap-0.5 text-xs font-medium text-[#1B7A3E]">
                    {cta} <ChevronRight className="h-3 w-3" />
                  </span>
                )}
              </span>
            </>
          )
          return href ? (
            <Link key={title} href={href} className="group flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-[#1B7A3E]">
              {inner}
            </Link>
          ) : (
            <div key={title} className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
              {inner}
            </div>
          )
        })}
      </div>

      {/* How payment works — highlighted callout */}
      <div className="mt-8 flex items-start gap-4 rounded-2xl border border-[#1B7A3E]/20 bg-green-50/60 p-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white">
          <Wallet className="h-5 w-5 text-[#1B7A3E]" />
        </span>
        <div>
          <h2 className="text-sm font-bold text-gray-900">How payment works</h2>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">
            We accept <strong>PayID</strong> and <strong>cryptocurrency</strong>. Place your order, then use the WhatsApp button to get the
            payment details for your chosen method and lock your order in. Buying in volume? See{' '}
            <Link href="/wholesale" className="font-medium text-[#1B7A3E] hover:underline">wholesale</Link>.
          </p>
        </div>
      </div>

      {/* FAQ */}
      <h2 className="mb-4 mt-12 text-xl font-bold text-gray-900">Common questions</h2>
      <FaqList items={faqs} />

      <p className="mt-8 text-xs text-gray-400">For adults 18+ only. Nicotine is an addictive chemical.</p>
    </div>
  )
}
