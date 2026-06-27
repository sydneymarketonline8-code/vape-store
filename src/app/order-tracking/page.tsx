import type { Metadata } from 'next'
import Link from 'next/link'
import { PackageSearch, ListOrdered } from 'lucide-react'
import { PageSchema, FaqList, HowToSteps, type Faq, type HowToStep } from '@/components/common/page-schema'
import { Crumb, H2, IconCard } from '@/components/common/page-ui'

export const metadata: Metadata = {
  title: 'Order Tracking',
  description:
    'Track your Aussie Vape order — find your tracking number, understand delivery statuses, and get help if your order is delayed.',
  alternates: { canonical: '/order-tracking' },
}

const steps: HowToStep[] = [
  { name: 'Check your confirmation email', text: 'When you place an order you get a confirmation email with your order number.' },
  { name: 'Confirm payment on WhatsApp', text: 'Use the WhatsApp button to confirm your PayID or crypto payment so we can lock the order in and dispatch it.' },
  { name: 'Get your tracking link', text: 'When your order ships we email a tracking number and a link to the carrier’s tracking page.' },
  { name: 'Track it', text: 'Open the carrier link to follow your parcel, or sign in and view status under My Account.' },
  { name: 'Contact us if delayed', text: 'If it has been more than 6 business days since dispatch, message us with your order number.' },
]

const STATUSES: { label: string; desc: string }[] = [
  { label: 'Pending', desc: 'Order placed — we’re waiting on payment confirmation via WhatsApp (PayID or crypto).' },
  { label: 'Processing', desc: 'Payment confirmed and your order is being packed for dispatch.' },
  { label: 'Dispatched', desc: 'Your order has left our warehouse and a tracking number has been sent.' },
  { label: 'In Transit', desc: 'The courier has your parcel and it’s on the way to you.' },
  { label: 'Delivered', desc: 'Your order has been delivered. A signature or ID may have been required.' },
]

const faqs: Faq[] = [
  {
    q: 'How do I track my Aussie Vape order?',
    a: 'When your order ships, we email a tracking number and a link to the carrier’s tracking page. Signed-in customers can also view order status under My Account. Check your inbox and spam folder for the dispatch email.',
  },
  {
    q: 'How long does Aussie Vape take to dispatch?',
    a: 'Orders are dispatched from our Australian warehouse within one business day of payment being confirmed on WhatsApp. Delivery then typically takes 2–6 business days depending on your location.',
  },
  {
    q: 'Where do I find my tracking number?',
    a: 'It’s in your dispatch email from Aussie Vape, and on the My Account → Orders page once your order has shipped. We can also share it with you on WhatsApp.',
  },
  {
    q: 'My order hasn’t arrived — what should I do?',
    a: 'First check the carrier tracking link and your spam folder for the dispatch email. If it has been more than 6 business days since dispatch, contact us on WhatsApp or email with your order number and we’ll chase it up.',
  },
]

export default function OrderTrackingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageSchema name="Order Tracking" slug="/order-tracking" faqs={faqs} howTo={{ name: 'How to track your Aussie Vape order', steps }} />
      <Crumb name="Order Tracking" />
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Order Tracking</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-gray-500">Keep an eye on your delivery from dispatch to doorstep.</p>

      <H2>How to track your order</H2>
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <HowToSteps steps={steps} />
      </div>

      <H2>What the delivery statuses mean</H2>
      <div className="space-y-2">
        {STATUSES.map((s, i) => (
          <div key={s.label} className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-50 text-xs font-bold text-[#1B7A3E]">{i + 1}</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">{s.label}</p>
              <p className="mt-0.5 text-sm text-gray-500">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <H2>More help</H2>
      <div className="grid gap-3 sm:grid-cols-2">
        <IconCard icon={ListOrdered} title="Order history" href="/account/orders" cta="My Orders">
          Signed-in customers can view all orders and their status any time.
        </IconCard>
        <IconCard icon={PackageSearch} title="Order delayed?" href="/contact" cta="Contact us">
          Check the tracking link and your spam folder first, then message us with your order number.
        </IconCard>
      </div>

      <H2>Tracking FAQ</H2>
      <FaqList items={faqs} />

      <p className="mt-8 text-xs text-gray-400">For adults 18+ only. Nicotine is an addictive chemical.</p>
    </div>
  )
}
