import type { Metadata } from 'next'
import { InfoPage, Section, L } from '@/components/common/info-page'
import { PageSchema, FaqList, HowToSteps, type Faq, type HowToStep } from '@/components/common/page-schema'

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
    <InfoPage title="Order Tracking" intro="Keep an eye on your delivery from dispatch to doorstep.">
      <PageSchema name="Order Tracking" slug="/order-tracking" faqs={faqs} howTo={{ name: 'How to track your Aussie Vape order', steps }} />

      <Section heading="How to track your order">
        <HowToSteps steps={steps} />
      </Section>

      <Section heading="What the delivery statuses mean">
        <dl className="overflow-hidden rounded-xl border border-gray-200 divide-y divide-gray-100">
          {STATUSES.map(s => (
            <div key={s.label} className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-[140px_1fr]">
              <dt className="text-sm font-semibold text-gray-900">{s.label}</dt>
              <dd className="text-sm text-gray-600">{s.desc}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section heading="Order history">
        <p>Signed-in customers can view all orders and their status any time from <L href="/account/orders">My Orders</L>.</p>
      </Section>

      <Section heading="Tracking FAQ">
        <FaqList items={faqs} />
      </Section>

      <p className="mt-8 text-xs text-gray-400">For adults 18+ only. Nicotine is an addictive chemical.</p>
    </InfoPage>
  )
}
