import type { Metadata } from 'next'
import { InfoPage, Section, L } from '@/components/common/info-page'

export const metadata: Metadata = {
  title: 'Beginners Guide',
  description: 'New to vaping? A plain-English guide to device types, nicotine strengths, and choosing your first setup.',
}

export default function BeginnersGuidePage() {
  return (
    <InfoPage
      title="Beginners Guide"
      intro="A plain-English introduction for adult vapers choosing their first setup. General information only — not health advice."
    >
      <Section heading="Disposables vs Pod Systems">
        <p>Disposables are ready to use out of the box and discarded when empty — the simplest place to start. Pod systems are rechargeable and refillable, which can work out cheaper over time.</p>
      </Section>
      <Section heading="Understanding Nicotine Strength">
        <p>Nicotine strength is shown in mg/mL. Lower strengths suit lighter use; higher strengths deliver more per puff. If you&apos;re unsure, start lower.</p>
      </Section>
      <Section heading="Picking a Flavour">
        <p>Flavours range from fruit and menthol to dessert and tobacco profiles. Browse by category on our <L href="/products">shop page</L> to find one that suits you.</p>
      </Section>
      <Section heading="Looking After Your Device">
        <p>Keep devices away from heat and water, charge with the correct cable, and store e-liquids out of reach of children and pets.</p>
      </Section>
    </InfoPage>
  )
}
