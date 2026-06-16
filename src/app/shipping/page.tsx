import type { Metadata } from 'next'
import { InfoPage, Section, L } from '@/components/common/info-page'

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'Shipping times, costs, and dispatch information for Aussie Vape orders across Australia.',
}

export default function ShippingPage() {
  return (
    <InfoPage title="Shipping Policy" intro="Fast, tracked dispatch to every state and territory in Australia.">
      <Section heading="Dispatch Times">
        <p>Orders placed before 2:00pm AEST on a business day are typically dispatched the same day. Orders placed after that, or on weekends and public holidays, are dispatched the next business day.</p>
      </Section>
      <Section heading="Delivery Estimates">
        <p>Standard delivery takes 2–6 business days depending on your location. Metro areas are usually faster than regional and remote areas.</p>
      </Section>
      <Section heading="Shipping Costs">
        <p>Flat-rate shipping applies at checkout. Orders over $300 qualify for free standard shipping Australia-wide.</p>
      </Section>
      <Section heading="Tracking">
        <p>You&apos;ll receive a tracking number by email once your order ships. You can also check status on our <L href="/order-tracking">Order Tracking</L> page.</p>
      </Section>
    </InfoPage>
  )
}
