import type { Metadata } from 'next'
import { InfoPage, Section, L } from '@/components/common/info-page'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about ordering, shipping, payment, and age verification at Aussie Vape.',
}

export default function FaqPage() {
  return (
    <InfoPage title="Frequently Asked Questions" intro="Answers to the questions we hear most often.">
      <Section heading="Do I need to be 18 or over to order?">
        <p>Yes. All sales are strictly for adults aged 18 and over. Orders are age-verified and we may request ID before dispatch.</p>
      </Section>
      <Section heading="How long does shipping take?">
        <p>Most orders are dispatched same or next business day. Delivery typically takes 2–6 business days Australia-wide. See our <L href="/shipping">Shipping Policy</L> for details.</p>
      </Section>
      <Section heading="What payment methods do you accept?">
        <p>We accept all major debit and credit cards via secure Stripe checkout.</p>
      </Section>
      <Section heading="Can I return a product?">
        <p>Unopened products can be returned within 30 days. See <L href="/returns">Returns &amp; Refunds</L> for the full policy.</p>
      </Section>
      <Section heading="Where do you ship from?">
        <p>All orders ship from our Australian warehouse.</p>
      </Section>
    </InfoPage>
  )
}
