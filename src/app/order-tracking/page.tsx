import type { Metadata } from 'next'
import { InfoPage, Section, L } from '@/components/common/info-page'

export const metadata: Metadata = {
  title: 'Order Tracking',
  description: 'Track your Aussie Vapes order and find your tracking number.',
}

export default function OrderTrackingPage() {
  return (
    <InfoPage title="Order Tracking" intro="Keep an eye on your delivery from dispatch to doorstep.">
      <Section heading="Find Your Tracking Number">
        <p>When your order ships, we email you a tracking number and a link to the carrier&apos;s tracking page. Check your inbox (and spam folder) for an email from Aussie Vapes.</p>
      </Section>
      <Section heading="Order History">
        <p>Signed-in customers can view all orders and their status from the <L href="/account">My Account</L> page.</p>
      </Section>
      <Section heading="Need Help?">
        <p>If it&apos;s been more than 6 business days since dispatch and your order hasn&apos;t arrived, <L href="/contact">contact our support team</L> with your order number.</p>
      </Section>
    </InfoPage>
  )
}
