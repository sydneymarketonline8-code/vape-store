import Link from 'next/link'
import { ChevronRight, type LucideIcon } from 'lucide-react'

/** Breadcrumb row for support/policy pages. */
export function Crumb({ name }: { name: string }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-xs text-gray-400">
      <Link href="/" className="hover:text-[#1B7A3E]">Home</Link>
      <span>/</span>
      <span className="text-gray-600">{name}</span>
    </nav>
  )
}

/** Section heading with consistent spacing. */
export function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 mt-12 text-xl font-bold text-gray-900">{children}</h2>
}

/** Icon card with title + body, optionally a link with a CTA chevron. */
export function IconCard({
  icon: Icon,
  title,
  children,
  href,
  cta,
}: {
  icon: LucideIcon
  title: string
  children: React.ReactNode
  href?: string
  cta?: string
}) {
  const inner = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
        <Icon className="h-4 w-4 text-gray-600" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-gray-900">{title}</span>
        <span className="mt-0.5 block text-sm leading-relaxed text-gray-500">{children}</span>
        {cta && (
          <span className="mt-1 inline-flex items-center gap-0.5 text-xs font-medium text-[#1B7A3E]">
            {cta} <ChevronRight className="h-3 w-3" />
          </span>
        )}
      </span>
    </>
  )
  return href ? (
    <Link href={href} className="group flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-[#1B7A3E]">
      {inner}
    </Link>
  ) : (
    <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">{inner}</div>
  )
}

/** Centred stat tile (e.g. "Free over $300"). */
export function StatCard({ icon: Icon, label, sub }: { icon: LucideIcon; label: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center">
      <span className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
        <Icon className="h-5 w-5 text-[#1B7A3E]" />
      </span>
      <p className="text-sm font-bold text-gray-900">{label}</p>
      <p className="mt-0.5 text-xs text-gray-500">{sub}</p>
    </div>
  )
}

/** Highlighted callout card. tone "green" (default) or "amber" (disclaimers). */
export function Callout({
  icon: Icon,
  title,
  tone = 'green',
  children,
}: {
  icon: LucideIcon
  title: string
  tone?: 'green' | 'amber'
  children: React.ReactNode
}) {
  const styles =
    tone === 'amber'
      ? { border: 'border-amber-200', bg: 'bg-amber-50', chip: 'bg-white', icon: 'text-amber-600' }
      : { border: 'border-[#1B7A3E]/20', bg: 'bg-green-50/60', chip: 'bg-white', icon: 'text-[#1B7A3E]' }
  return (
    <div className={`flex items-start gap-4 rounded-2xl border ${styles.border} ${styles.bg} p-5`}>
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles.chip}`}>
        <Icon className={`h-5 w-5 ${styles.icon}`} />
      </span>
      <div>
        <h2 className="text-sm font-bold text-gray-900">{title}</h2>
        <div className="mt-1 text-sm leading-relaxed text-gray-600">{children}</div>
      </div>
    </div>
  )
}
