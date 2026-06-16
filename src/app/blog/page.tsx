import type { Metadata } from 'next'
import { InfoPage, Section, L } from '@/components/common/info-page'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Guides, product spotlights, and news from the Aussie Vape team.',
}

export default function BlogPage() {
  return (
    <InfoPage
      title="Blog"
      intro="Guides, product spotlights, and news for adult vapers. New articles coming soon."
    >
      <Section heading="Coming Soon">
        <p>We&apos;re putting together helpful guides on choosing your first device, understanding nicotine strengths, and getting the most from your gear.</p>
        <p>In the meantime, our <L href="/beginners-guide">Beginners Guide</L> is a great place to start.</p>
      </Section>
    </InfoPage>
  )
}
