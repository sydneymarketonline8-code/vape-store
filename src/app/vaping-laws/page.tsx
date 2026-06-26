import type { Metadata } from 'next'
import { InfoPage, Section, L } from '@/components/common/info-page'
import { PageSchema, FaqList, type Faq } from '@/components/common/page-schema'

export const metadata: Metadata = {
  title: 'Vaping Laws in Australia',
  description:
    'A plain-English overview of Australian vaping regulations — age limits, the TGA framework and where to check the current rules. General info, not legal advice.',
  alternates: { canonical: '/vaping-laws' },
}

const UPDATED = '27 June 2026'

const faqs: Faq[] = [
  {
    q: 'Is vaping legal in Australia?',
    a: 'Vaping is regulated nationally by the Therapeutic Goods Administration (TGA), and you must be 18 or older. The rules around how vapes are sold and supplied changed in 2024 and continue to change. For the current legal position, check the TGA and your state or territory health authority. This page is general information, not legal advice.',
  },
  {
    q: 'What is the legal age to vape in Australia?',
    a: 'It is illegal to sell vaping products to anyone under 18 anywhere in Australia.',
  },
  {
    q: 'Do I need a prescription to buy nicotine vapes in Australia?',
    a: 'Australia moved to a pharmacy-based supply model for vaping products in 2024. Depending on the product and your circumstances, a prescription may or may not be required. Check the TGA and a pharmacist for the current requirements that apply to you.',
  },
  {
    q: 'Can I vape in public in Australia?',
    a: 'Public and indoor vaping rules vary by state and territory and are often similar to smoking laws. Check your local council and your state or territory rules before vaping in public spaces.',
  },
  {
    q: 'Are nicotine pouches legal in Australia?',
    a: 'Regulation of nicotine pouches in Australia has been changing. Check the TGA and your state or territory health authority for the current position before purchasing.',
  },
  {
    q: 'Where can I find the latest Australian vaping laws?',
    a: 'The most current and authoritative information is published by the Therapeutic Goods Administration (tga.gov.au) and the Australian Department of Health, plus your state or territory health department.',
  },
]

export default function VapingLawsPage() {
  return (
    <InfoPage
      title="Vaping Laws in Australia"
      intro="Australian vaping regulations change over time. The summary below is general information only and is not legal advice."
    >
      <PageSchema name="Vaping Laws" slug="/vaping-laws" faqs={faqs} />

      <p className="-mt-4 mb-2 text-xs text-gray-400">Last updated: {UPDATED}</p>

      <Section heading="Age restriction (18+)">
        <p>It is illegal to sell vaping products to anyone under 18 in Australia. We enforce strict age verification on every order and may request proof of age before dispatch or on delivery.</p>
      </Section>

      <Section heading="How vaping is regulated">
        <p>Vaping and nicotine products in Australia are regulated nationally by the <strong>Therapeutic Goods Administration (TGA)</strong>, alongside state and territory laws. Customers are responsible for understanding the regulations that apply where they live.</p>
      </Section>

      <Section heading="What changed in 2024">
        <p>As part of national reforms in 2024, vaping products in Australia moved towards a <strong>pharmacy-based supply model</strong>, with sales through general retailers restricted. Some lower-strength products may be supplied by pharmacists to adults 18+ without a prescription, while others can require one. These rules continue to evolve — always check official sources for the current position.</p>
      </Section>

      <Section heading="Where you can vape">
        <p>Public and indoor vaping rules vary by state and territory, and are often aligned with smoking laws. There is no single national rule for where you can vape — check your local council and your state or territory health authority.</p>
      </Section>

      <Section heading="Stay informed">
        <p>
          For the most current and authoritative information, refer to the{' '}
          <a href="https://www.tga.gov.au" target="_blank" rel="noopener noreferrer" className="text-[#1B7A3E] hover:underline">Therapeutic Goods Administration (TGA)</a>,{' '}
          the <a href="https://www.health.gov.au" target="_blank" rel="noopener noreferrer" className="text-[#1B7A3E] hover:underline">Australian Department of Health</a>, and your state or territory health department.
          New to vaping? See our <L href="/beginners-guide">Beginners Guide</L>.
        </p>
      </Section>

      <Section heading="Frequently asked questions">
        <FaqList items={faqs} />
      </Section>

      <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-800">
        <strong>Disclaimer:</strong> This page is for general informational purposes only and does not constitute legal
        advice. Vaping regulations in Australia change frequently — always check with the TGA and your state or territory
        health authority for the most current information. For adults 18+ only. Nicotine is an addictive chemical.
      </div>
    </InfoPage>
  )
}
