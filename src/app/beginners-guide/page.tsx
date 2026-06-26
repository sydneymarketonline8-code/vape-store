import type { Metadata } from 'next'
import { InfoPage, Section, L } from '@/components/common/info-page'
import { PageSchema, FaqList, HowToSteps, type Faq, type HowToStep } from '@/components/common/page-schema'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Beginners Guide — Vaping in Australia',
  description:
    'New to vaping? A plain-English guide to device types, nicotine strengths and how to use a disposable — for adult Australians. General info, not health advice.',
  alternates: { canonical: '/beginners-guide' },
}

const UPDATED = '2026-06-27'

const steps: HowToStep[] = [
  { name: 'Unpack it', text: 'Remove the disposable from its packaging and take off any silicone caps on the mouthpiece and base.' },
  { name: 'Inhale gently', text: 'Most disposables are draw-activated — just inhale on the mouthpiece, no buttons.' },
  { name: 'Take a slow draw', text: 'Draw slowly for 3–4 seconds rather than hard and fast.' },
  { name: 'Pace yourself', text: 'Wait around 30 seconds between puffs so the coil can re-saturate.' },
  { name: 'Store it safely', text: 'Keep it away from heat and water, and out of reach of children and pets.' },
]

const faqs: Faq[] = [
  {
    q: 'What vape should I start with in Australia?',
    a: 'Most beginners start with a disposable — there is no setup, charging or refilling, so you can try flavours and nicotine strengths with the least fuss. If you vape regularly, a refillable pod system usually works out cheaper over time.',
  },
  {
    q: 'How do I use a disposable vape?',
    a: 'Unpack it, remove any silicone caps, then inhale gently on the mouthpiece — most disposables are draw-activated with no buttons. Draw slowly for a few seconds and pace yourself between puffs.',
  },
  {
    q: 'What nicotine strength should a beginner use?',
    a: 'Nicotine strength is shown in mg/mL. If you are unsure, start lower — you can move up if it is not enough. Nicotine-free options are also available. Strengths are listed on each product page where applicable.',
  },
  {
    q: 'Is vaping safe for beginners?',
    a: 'We cannot give medical advice and vaping is not risk-free. If you have health questions, speak to a doctor or pharmacist. This guide covers device types and how to choose; for the rules in Australia see our Vaping Laws page.',
  },
  {
    q: 'Can I buy vapes online in Australia?',
    a: 'Australian vaping rules changed in 2024 and are regulated by the TGA, and they continue to change. See our Vaping Laws page and your state or territory health authority for the current position. Aussie Vape is an age-verified store for adults 18+.',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Beginners Guide to Vaping in Australia',
  description: 'A plain-English guide to vape device types, nicotine strengths and how to use a disposable, for adult Australians.',
  author: { '@type': 'Organization', name: 'Aussie Vape', url: SITE_URL },
  publisher: { '@type': 'Organization', name: 'Aussie Vape', url: SITE_URL },
  datePublished: '2026-06-01',
  dateModified: UPDATED,
  mainEntityOfPage: `${SITE_URL}/beginners-guide`,
}

export default function BeginnersGuidePage() {
  return (
    <InfoPage
      title="Beginners Guide to Vaping in Australia"
      intro="A plain-English introduction for adult Australians choosing their first setup. General information only — not health or medical advice."
    >
      <PageSchema name="Beginners Guide" slug="/beginners-guide" faqs={faqs} howTo={{ name: 'How to use a disposable vape', steps }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <Section heading="What is vaping?">
        <p>A vape heats e-liquid into an inhalable vapour. A battery powers a coil, the coil heats the e-liquid, and you draw the vapour through a mouthpiece. Devices range from simple all-in-one disposables to refillable pod systems you top up yourself. This is general information, not health advice.</p>
      </Section>

      <Section heading="Which type is right for you?">
        <p><strong>Disposable vapes</strong> — ready to use out of the box, nothing to charge or refill. The simplest place to start and great for trying flavours. Browse <L href="/collections/disposables">disposable vapes</L>.</p>
        <p><strong>Pod systems &amp; kits</strong> — rechargeable and refillable, so they cost less per puff over time and give you more control over flavour and strength. Browse <L href="/collections/mods">pod systems</L>.</p>
        <p><strong>Nicotine pouches</strong> — no device and no vapour. A smoke-free option placed under the lip. Browse <L href="/collections/pouches">nicotine pouches</L>.</p>
      </Section>

      <Section heading="Understanding nicotine strength">
        <p>Nicotine strength is shown in mg/mL — lower strengths suit lighter use, higher strengths deliver more per puff, and nicotine-free options are available. There are two common types: <strong>nicotine salt</strong> (smoother at higher strengths, common in disposables) and <strong>freebase</strong>. If you&apos;re unsure, start lower. Browse <L href="/collections/e-liquids">e-liquids &amp; salts</L>.</p>
      </Section>

      <Section heading="How to use a disposable vape">
        <HowToSteps steps={steps} />
      </Section>

      <Section heading="Vaping & the law in Australia">
        <p>You must be 18 or older. Vaping products are regulated by the TGA and the rules changed in 2024 — and continue to change. For the current position, see our <L href="/vaping-laws">Vaping Laws</L> page and your state or territory health authority. Aussie Vape is an age-verified store.</p>
      </Section>

      <Section heading="Looking after your device">
        <p>Keep devices away from heat and water, charge rechargeables with the correct cable, and store e-liquids and devices out of reach of children and pets.</p>
      </Section>

      <Section heading="Beginner FAQ">
        <FaqList items={faqs} />
      </Section>

      <p className="mt-8 text-xs text-gray-400">For adults 18+ only. Nicotine is an addictive chemical. General information only — not health advice.</p>
    </InfoPage>
  )
}
