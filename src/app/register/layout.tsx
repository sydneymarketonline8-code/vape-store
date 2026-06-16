import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create an Aussie Vape account for faster checkout and order history. Adults 18+ only.',
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children
}
