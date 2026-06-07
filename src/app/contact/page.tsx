import type { Metadata } from 'next'
import { InfoPage, Section, L } from '@/components/common/info-page'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Aussie Vapes team — support hours, email, and order enquiries.',
}

export default function ContactPage() {
  return (
    <InfoPage
      title="Contact Us"
      intro="Questions about an order, a product, or wholesale? Our Australia-based team is here to help during AEST business hours."
    >
      <Section heading="Customer Support">
        <p>Email: <a href="mailto:support@aussievapes.example" className="text-[#1B7A3E] hover:underline">support@aussievapes.example</a></p>
        <p>Hours: Monday–Friday, 9:00am–5:00pm AEST</p>
        <p>We aim to respond to all enquiries within one business day.</p>
      </Section>
      <Section heading="Order Enquiries">
        <p>Have your order number ready and include it in your message so we can help faster. For delivery status, see <L href="/order-tracking">Order Tracking</L>.</p>
      </Section>
      <Section heading="Wholesale & Bulk">
        <p>For trade pricing and bulk orders, visit our <L href="/wholesale">Bulk &amp; Wholesale</L> page.</p>
      </Section>
    </InfoPage>
  )
}
