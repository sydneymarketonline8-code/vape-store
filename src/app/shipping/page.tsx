import type { Metadata } from 'next'
import { InfoPage, Section, L } from '@/components/common/info-page'
import { PageSchema, FaqList, type Faq } from '@/components/common/page-schema'

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description:
    'Aussie Vape shipping — free AU delivery over $300, fast dispatch and tracked delivery to every Australian state. Australia-wide only.',
  alternates: { canonical: '/shipping' },
}

const faqs: Faq[] = [
  {
    q: 'Does Aussie Vape offer free shipping?',
    a: 'Yes — orders over $300 ship free, Australia-wide. A flat-rate shipping fee applies to orders under $300, and a minimum order of $250 applies to all purchases.',
  },
  {
    q: 'How long does Aussie Vape take to ship?',
    a: 'Orders are dispatched from our Australian warehouse within one business day of payment being confirmed. Delivery then typically takes 2–6 business days depending on your location.',
  },
  {
    q: 'Does Aussie Vape ship to all Australian states?',
    a: 'Yes, we deliver to every Australian state and territory. Regional and remote areas may take a little longer than metro areas.',
  },
  {
    q: 'Is my order tracked?',
    a: 'Yes, every order is sent with tracking. We add the tracking number to your account once your order ships, and can share it with you on WhatsApp.',
  },
  {
    q: 'Does Aussie Vape ship internationally?',
    a: 'No, we currently ship within Australia only and do not offer international delivery.',
  },
]

export default function ShippingPage() {
  return (
    <InfoPage title="Shipping Policy" intro="Fast, tracked delivery to every Australian state and territory.">
      <PageSchema name="Shipping" slug="/shipping" faqs={faqs} />

      <Section heading="Shipping Costs">
        <p>A flat-rate shipping fee applies to orders under $300. Orders <strong>over $300 ship free</strong>, Australia-wide. A minimum order of $250 applies to all purchases.</p>
      </Section>
      <Section heading="Dispatch (Processing Time)">
        <p>Orders are dispatched from our Australian warehouse within <strong>1 business day</strong> of payment being confirmed. Orders placed on weekends or public holidays are dispatched the next business day.</p>
      </Section>
      <Section heading="Delivery (Transit Time)">
        <p>Once dispatched, delivery typically takes <strong>2–6 business days</strong> depending on your location. Metro areas are usually at the faster end of that range.</p>
      </Section>
      <Section heading="Tracking">
        <p>Every order is sent with tracking. Once your order ships we add the tracking number to your account — view it under <L href="/account/orders">My Orders</L>, or we&apos;ll share it with you on WhatsApp.</p>
      </Section>
      <Section heading="Age Verification on Delivery">
        <p>Our products are for adults 18+ only. A signature may be required on delivery, and the courier may ask for ID to confirm age. Orders can&apos;t be left unattended where age can&apos;t be verified.</p>
      </Section>
      <Section heading="Remote Areas & Exceptions">
        <p>Deliveries to regional and remote areas may take additional time. In rare cases of stock or courier delays we&apos;ll contact you directly to keep you informed.</p>
      </Section>
      <Section heading="International Shipping">
        <p>We currently ship <strong>within Australia only</strong> and do not offer international delivery.</p>
      </Section>
      <Section heading="Shipping FAQ">
        <FaqList items={faqs} />
      </Section>

      <p className="mt-8 text-xs text-gray-400">For adults 18+ only. Nicotine is an addictive chemical.</p>
    </InfoPage>
  )
}
