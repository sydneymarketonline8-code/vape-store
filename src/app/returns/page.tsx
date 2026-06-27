import type { Metadata } from 'next'
import Link from 'next/link'
import { RotateCcw, ShieldAlert, Wallet, PackageX, CalendarClock } from 'lucide-react'
import { PageSchema, FaqList, HowToSteps, type Faq, type HowToStep } from '@/components/common/page-schema'
import { Crumb, H2, IconCard, StatCard, Callout } from '@/components/common/page-ui'

export const metadata: Metadata = {
  title: 'Returns & Refunds',
  description:
    'Aussie Vape returns — 30-day returns on unopened products, fast faulty-item replacements, and how to start a return. Australian-based support.',
  alternates: { canonical: '/returns' },
}

const steps: HowToStep[] = [
  { name: 'Contact us', text: 'Message us on WhatsApp, or via the Contact page, with your order number and reason for return.' },
  { name: 'Confirm eligibility', text: 'We confirm eligibility and send you return instructions.' },
  { name: 'Post it back', text: 'Post the item back to us in its original, unopened packaging.' },
  { name: 'Refund or exchange', text: 'Once received and inspected, your refund or exchange is processed.' },
]

const faqs: Faq[] = [
  {
    q: "What is Aussie Vape's return policy?",
    a: 'Unopened products in their original sealed packaging can be returned within 30 days of delivery for a refund or exchange. Opened disposables, e-liquids and nicotine pouches cannot be returned for hygiene reasons unless they are faulty.',
  },
  {
    q: 'Can I return an opened vape?',
    a: 'For health and hygiene reasons, opened disposables, e-liquids and nicotine pouches cannot be returned unless they are faulty. Unopened items in their original packaging can be returned within 30 days.',
  },
  {
    q: 'How long does a refund take from Aussie Vape?',
    a: 'Approved refunds are processed within 1–3 business days of us receiving and inspecting the returned item, via your original payment method (PayID or crypto).',
  },
  {
    q: 'What if my vape arrived broken?',
    a: 'Contact us within 7 days of delivery with your order number and a photo or description. For genuine faults we arrange a replacement or refund at no cost to you.',
  },
  {
    q: 'Do I pay for return shipping?',
    a: 'Return postage is the customer’s responsibility for change-of-mind returns. If the item is faulty or we sent the wrong product, we cover the return cost.',
  },
]

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageSchema name="Returns & Refunds" slug="/returns" faqs={faqs} howTo={{ name: 'How to return an item to Aussie Vape', steps }} />
      <Crumb name="Returns & Refunds" />
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Returns &amp; Refunds</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-gray-500">
        We want you to be happy with your order. Here&apos;s how returns work.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <StatCard icon={RotateCcw} label="30-Day Window" sub="Unopened products" />
        <StatCard icon={ShieldAlert} label="Faulty?" sub="Replaced or refunded" />
        <StatCard icon={CalendarClock} label="1–3 Business Days" sub="Refund once received" />
      </div>

      <Callout icon={PackageX} title="What can be returned" tone="green">
        <p>
          Unopened products in their original, sealed packaging can be returned within <strong>30 days</strong> of delivery for a refund or
          exchange. For health and hygiene reasons, opened disposables, e-liquids and nicotine pouches can&apos;t be returned unless faulty.
        </p>
      </Callout>

      <H2>Faulty or incorrect items</H2>
      <IconCard icon={ShieldAlert} title="Arrived faulty, damaged or wrong?">
        Contact us within 7 days of delivery with your order number and a photo or description. We&apos;ll arrange a replacement or refund for genuine faults at no cost to you.
      </IconCard>

      <H2>How to start a return</H2>
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <HowToSteps steps={steps} />
        <p className="mt-4 text-sm text-gray-500">
          Need help? <Link href="/contact" className="font-medium text-[#1B7A3E] hover:underline">Contact us</Link> with your order number.
        </p>
      </div>

      <H2>Refunds &amp; return shipping</H2>
      <div className="grid gap-3 sm:grid-cols-2">
        <IconCard icon={Wallet} title="Refund timing">
          Processed within 1–3 business days of us receiving and inspecting the item, via your original payment method (PayID or crypto).
        </IconCard>
        <IconCard icon={RotateCcw} title="Restocking & postage">
          No restocking fee on eligible unopened returns within 30 days. Return postage is yours unless the item is faulty or we sent the wrong product.
        </IconCard>
      </div>

      <H2>Returns FAQ</H2>
      <FaqList items={faqs} />

      <p className="mt-8 text-xs text-gray-400">For adults 18+ only. Nicotine is an addictive chemical.</p>
    </div>
  )
}
