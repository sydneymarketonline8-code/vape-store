import type { Metadata } from 'next'
import { InfoPage, Section, L } from '@/components/common/info-page'

export const metadata: Metadata = {
  title: 'Bulk & Wholesale',
  description: 'Trade pricing and bulk vape orders for retailers and businesses across Australia.',
}

export default function WholesalePage() {
  return (
    <InfoPage
      title="Bulk & Wholesale"
      intro="Buying for a store or in volume? We offer trade pricing and bulk vape packs with fast Australia-wide dispatch."
    >
      <Section heading="Who It's For">
        <p>Convenience stores, tobacconists, and registered businesses looking to stock popular disposable and pod brands at competitive trade rates.</p>
      </Section>
      <Section heading="Bulk Packs">
        <p>Many of our best-sellers are available in multi-unit packs at a lower per-unit price. Browse current <L href="/products?packs=true">bulk vape packs</L>.</p>
      </Section>
      <Section heading="Request Trade Pricing">
        <p>Email <a href="mailto:wholesale@aussievapes.example" className="text-[#1B7A3E] hover:underline">wholesale@aussievapes.example</a> with your business details and the products you&apos;re interested in, and our team will be in touch with a quote.</p>
      </Section>
    </InfoPage>
  )
}
