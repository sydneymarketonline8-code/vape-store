import type { Metadata } from 'next'
import { InfoPage, Section, L } from '@/components/common/info-page'
import { PageSchema, FaqList, HowToSteps, type Faq, type HowToStep } from '@/components/common/page-schema'

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
    <InfoPage title="Returns & Refunds" intro="We want you to be happy with your order. Here's how returns work.">
      <PageSchema name="Returns & Refunds" slug="/returns" faqs={faqs} howTo={{ name: 'How to return an item to Aussie Vape', steps }} />

      <Section heading="Return Eligibility">
        <p>Unopened products in their original, sealed packaging can be returned within <strong>30 days</strong> of delivery for a refund or exchange.</p>
        <p>For health and hygiene reasons, <strong>opened disposables, e-liquids and nicotine pouches cannot be returned</strong> unless they are faulty.</p>
      </Section>
      <Section heading="Faulty or Incorrect Items">
        <p>If your item arrives faulty, damaged, or isn&apos;t what you ordered, contact us within <strong>7 days</strong> of delivery with your order number and a photo or description. We&apos;ll arrange a replacement or refund for genuine faults at no cost to you.</p>
      </Section>
      <Section heading="How to Start a Return">
        <HowToSteps steps={steps} />
        <p>Need help? <L href="/contact">Contact us</L> with your order number.</p>
      </Section>
      <Section heading="Refund Timing">
        <p>Approved refunds are processed within <strong>1–3 business days</strong> of us receiving and inspecting the returned item, via your original payment method (PayID or crypto).</p>
      </Section>
      <Section heading="Restocking & Return Shipping">
        <p>There is <strong>no restocking fee</strong> for eligible unopened returns within 30 days. Return postage is the customer&apos;s responsibility unless the item is faulty or we sent the wrong product.</p>
      </Section>
      <Section heading="Returns FAQ">
        <FaqList items={faqs} />
      </Section>

      <p className="mt-8 text-xs text-gray-400">For adults 18+ only. Nicotine is an addictive chemical.</p>
    </InfoPage>
  )
}
