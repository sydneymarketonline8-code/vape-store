import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset your VapesAU account password — we’ll email you a secure link to set a new one.',
  alternates: { canonical: '/forgot-password' },
}

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children
}
