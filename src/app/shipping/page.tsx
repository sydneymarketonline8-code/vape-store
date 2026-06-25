import type { Metadata } from 'next'
import { InfoPage, Section, L } from '@/components/common/info-page'

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'Shipping costs, dispatch and delivery times for Aussie Vape orders — fast, tracked delivery Australia-wide.',
}

export default function ShippingPage() {
  return (
    <InfoPage title="Shipping Policy" intro="Fast, tracked delivery to every Australian state and territory.">
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
      <Section heading="Remote Areas & Exceptions">
        <p>Deliveries to regional and remote areas may take additional time. In rare cases of stock or courier delays we&apos;ll contact you directly to keep you informed.</p>
      </Section>
      <Section heading="International Shipping">
        <p>We currently ship <strong>within Australia only</strong> and do not offer international delivery.</p>
      </Section>
    </InfoPage>
  )
}
