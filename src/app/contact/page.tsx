import type { Metadata } from 'next'
import { InfoPage, Section, L } from '@/components/common/info-page'
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

export default function ContactPage() {
  return (
    <InfoPage
      title="Contact Aussie Vape"
      intro="Questions about an order, a product, payment or wholesale? Our Australian-based team is here to help by WhatsApp or email."
    >
      <PageSchema name="Contact" slug="/contact" faqs={faqs} />

      <Section heading="How to reach us">
        <p>
          <strong>WhatsApp</strong> (fastest):{' '}
          <a href={whatsappLink('Hi Aussie Vape, I have a question.')} target="_blank" rel="noopener noreferrer" className="text-[#1B7A3E] hover:underline">
            message us on WhatsApp
          </a>
        </p>
        <p>
          <strong>Email:</strong>{' '}
          <a href="mailto:support@aussievape.com.au" className="text-[#1B7A3E] hover:underline">support@aussievape.com.au</a>
        </p>
        <p>We usually reply within one Australian business day.</p>
      </Section>

      <Section heading="What we can help with">
        <p><strong>Orders &amp; payment</strong> — placing an order, PayID or crypto payment, and confirming your order. See how payment works below or message us.</p>
        <p><strong>Delivery</strong> — tracking and delivery questions. Start with <L href="/order-tracking">Order Tracking</L>.</p>
        <p><strong>Returns &amp; refunds</strong> — faulty items or 30-day returns on unopened products. See <L href="/returns">Returns &amp; Refunds</L>.</p>
        <p><strong>Wholesale &amp; bulk</strong> — trade pricing and bulk packs. See <L href="/wholesale">Bulk &amp; Wholesale</L>.</p>
      </Section>

      <Section heading="How payment works">
        <p>
          We accept <strong>PayID</strong> and <strong>cryptocurrency</strong>. Place your order, then use the WhatsApp button to get
          the payment details for your chosen method and lock your order in. For bulk orders, see <L href="/wholesale">wholesale</L>.
        </p>
      </Section>

      <Section heading="Common questions">
        <FaqList items={faqs} />
      </Section>

      <p className="mt-8 text-xs text-gray-400">For adults 18+ only. Nicotine is an addictive chemical.</p>
    </InfoPage>
  )
}
