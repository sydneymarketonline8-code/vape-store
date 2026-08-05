import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Securely complete your VapesAU order.',
  robots: { index: false },
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children
}
