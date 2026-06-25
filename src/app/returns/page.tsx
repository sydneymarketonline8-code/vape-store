import type { Metadata } from 'next'
import { InfoPage, Section, L } from '@/components/common/info-page'

export const metadata: Metadata = {
  title: 'Returns & Refunds',
  description: 'Aussie Vape returns policy — 30-day returns on unopened products, faulty-item replacements, and how to start a return.',
}

export default function ReturnsPage() {
  return (
    <InfoPage title="Returns & Refunds" intro="We want you to be happy with your order. Here's how returns work.">
      <Section heading="Return Eligibility">
        <p>Unopened products in their original, sealed packaging can be returned within <strong>30 days</strong> of delivery for a refund or exchange.</p>
        <p>For health and hygiene reasons, <strong>opened disposables, e-liquids and nicotine pouches cannot be returned</strong> unless they are faulty.</p>
      </Section>
      <Section heading="Faulty or Incorrect Items">
        <p>If your item arrives faulty, damaged, or isn&apos;t what you ordered, contact us within <strong>7 days</strong> of delivery with your order number and a photo or description. We&apos;ll arrange a replacement or refund for genuine faults at no cost to you.</p>
      </Section>
      <Section heading="How to Start a Return">
        <ol className="list-decimal space-y-1 pl-5">
          <li>Message us on WhatsApp (or via the <L href="/contact">Contact</L> page) with your order number and reason for return.</li>
          <li>We&apos;ll confirm eligibility and send return instructions.</li>
          <li>Post the item back to us in its original packaging.</li>
          <li>Once received and inspected, your refund or exchange is processed.</li>
        </ol>
      </Section>
      <Section heading="Refund Timing">
        <p>Approved refunds are processed within <strong>1–3 business days</strong> of us receiving and inspecting the returned item, via your original payment method (PayID or crypto).</p>
      </Section>
      <Section heading="Restocking & Return Shipping">
        <p>There is <strong>no restocking fee</strong> for eligible unopened returns within 30 days. Return postage is the customer&apos;s responsibility unless the item is faulty or we sent the wrong product.</p>
      </Section>
    </InfoPage>
  )
}
