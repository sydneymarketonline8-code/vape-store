import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Set New Password',
  // Token-bearing utility page — keep it out of the index.
  robots: { index: false, follow: false },
}

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children
}
