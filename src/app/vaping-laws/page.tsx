import type { Metadata } from 'next'
import { InfoPage, Section } from '@/components/common/info-page'

export const metadata: Metadata = {
  title: 'Vaping Laws',
  description: 'An overview of Australian vaping regulations and our commitment to responsible, age-restricted sales.',
}

export default function VapingLawsPage() {
  return (
    <InfoPage
      title="Vaping Laws"
      intro="Australian vaping regulations change over time. The summary below is general information only and is not legal advice."
    >
      <Section heading="Age Restriction">
        <p>It is illegal to sell vaping products to anyone under 18 in Australia. We enforce strict age verification on every order and may request proof of age before dispatch.</p>
      </Section>
      <Section heading="Nicotine Regulations">
        <p>The sale and supply of nicotine vaping products is regulated in Australia and rules differ by state and territory. Customers are responsible for understanding the regulations that apply where they live.</p>
      </Section>
      <Section heading="Stay Informed">
        <p>For the most current and authoritative information, refer to the Australian Therapeutic Goods Administration (TGA) and your state or territory health department.</p>
      </Section>
    </InfoPage>
  )
}
