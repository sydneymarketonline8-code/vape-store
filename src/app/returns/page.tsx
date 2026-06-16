import type { Metadata } from 'next'
import { InfoPage, Section } from '@/components/common/info-page'

export const metadata: Metadata = {
  title: 'Returns & Refunds',
  description: 'Our 30-day returns policy, eligibility, and how to request a refund or replacement at Aussie Vape.',
}

export default function ReturnsPage() {
  return (
    <InfoPage title="Returns & Refunds" intro="Not quite right? We offer hassle-free returns within 30 days of delivery.">
      <Section heading="Eligibility">
        <p>To be eligible for a return, items must be unopened, unused, and in their original packaging. For health and safety reasons, opened e-liquids and disposable devices cannot be returned unless faulty.</p>
      </Section>
      <Section heading="Faulty or Incorrect Items">
        <p>If your order arrives damaged, faulty, or incorrect, contact us within 7 days of delivery and we&apos;ll arrange a replacement or refund at no cost to you.</p>
      </Section>
      <Section heading="How to Request a Return">
        <p>Email <a href="mailto:support@aussievapes.example" className="text-[#1B7A3E] hover:underline">support@aussievapes.example</a> with your order number and reason for return. We&apos;ll respond with return instructions within one business day.</p>
      </Section>
      <Section heading="Refund Processing">
        <p>Approved refunds are issued to your original payment method within 5–10 business days of us receiving the returned item.</p>
      </Section>
    </InfoPage>
  )
}
