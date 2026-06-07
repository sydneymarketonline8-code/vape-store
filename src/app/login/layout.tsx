import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your Aussie Vapes account to view orders and manage your details.',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
