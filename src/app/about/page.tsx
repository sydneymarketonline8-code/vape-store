import type { Metadata } from 'next'
import { InfoPage, Section, L } from '@/components/common/info-page'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Aussie Vape — an Australian-owned online vape retailer focused on fast dispatch and customer service.',
}

export default function AboutPage() {
  return (
    <InfoPage
      title="About Aussie Vape"
      intro="An Australian-owned online vape store built for adult vapers who want a reliable range, fair prices, and fast dispatch."
    >
      <Section heading="Who We Are">
        <p>Aussie Vape is a Melbourne-based retailer supplying disposables, pod systems, e-liquids, and accessories to adult customers across Australia. We focus on a curated range from the brands customers actually ask for.</p>
      </Section>
      <Section heading="What We Stand For">
        <p>Strict 18+ age verification, honest product information, and responsive Australia-based support. We never market to minors and we comply with applicable advertising and product regulations.</p>
      </Section>
      <Section heading="Get In Touch">
        <p>Questions or feedback? We&apos;d love to hear from you — head to our <L href="/contact">Contact</L> page.</p>
      </Section>
    </InfoPage>
  )
}
