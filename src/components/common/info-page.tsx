import Link from 'next/link'

/** Shared layout for static content pages (Contact, FAQ, Shipping, etc.). */
export function InfoPage({
  title,
  intro,
  children,
}: {
  title: string
  intro?: string
  children?: React.ReactNode
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <nav className="mb-6 text-xs text-gray-400">
        <Link href="/" className="transition-colors hover:text-[#1B7A3E]">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-gray-600">{title}</span>
      </nav>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
      {intro && <p className="mt-3 leading-relaxed text-gray-500">{intro}</p>}
      <div className="mt-8">{children}</div>
    </div>
  )
}

/** Styled internal link for use in content-page copy (client-side navigation). */
export function L({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-[#1B7A3E] hover:underline">
      {children}
    </Link>
  )
}

export function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 first:mt-0">
      <h2 className="text-lg font-semibold text-gray-900">{heading}</h2>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-gray-600">{children}</div>
    </section>
  )
}
