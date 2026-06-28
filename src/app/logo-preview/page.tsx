import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Logo Preview',
  robots: { index: false, follow: false },
}

const TILE = (uid: string) => (
  <linearGradient id={`t-${uid}`} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
    <stop offset="0" stopColor="#22934A" />
    <stop offset="1" stopColor="#0F5128" />
  </linearGradient>
)

const WHITE = (uid: string) => (
  <linearGradient id={`w-${uid}`} x1="16" y1="5" x2="16" y2="27" gradientUnits="userSpaceOnUse">
    <stop offset="0" stopColor="#ffffff" />
    <stop offset="1" stopColor="#DCF1E4" />
  </linearGradient>
)

function Droplet({ size, uid }: { size: number; uid: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <defs>{TILE(uid)}{WHITE(uid)}</defs>
      <rect width="32" height="32" rx="7.5" fill={`url(#t-${uid})`} />
      <path d="M16 5.5C16 5.5 8.5 13.5 8.5 18.8a7.5 7.5 0 0 0 15 0C23.5 13.5 16 5.5 16 5.5Z" fill={`url(#w-${uid})`} />
      <circle cx="12.8" cy="17.6" r="2.2" fill="#ffffff" opacity="0.6" />
    </svg>
  )
}

function Cloud({ size, uid }: { size: number; uid: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <defs>{TILE(uid)}{WHITE(uid)}</defs>
      <rect width="32" height="32" rx="7.5" fill={`url(#t-${uid})`} />
      <g fill={`url(#w-${uid})`}>
        <circle cx="12.3" cy="18.2" r="4.3" />
        <circle cx="20" cy="18.2" r="4.9" />
        <circle cx="16" cy="13.8" r="5.2" />
        <rect x="8.6" y="17.4" width="14.8" height="5" rx="2.5" />
      </g>
      <circle cx="13.5" cy="14.5" r="1.6" fill="#ffffff" opacity="0.7" />
    </svg>
  )
}

function Monogram({ size, uid }: { size: number; uid: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <defs>{TILE(uid)}{WHITE(uid)}</defs>
      <rect width="32" height="32" rx="7.5" fill={`url(#t-${uid})`} />
      <text
        x="16"
        y="21.6"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, Arial, sans-serif"
        fontWeight={800}
        fontSize="13.5"
        letterSpacing="-0.6"
        fill={`url(#w-${uid})`}
      >
        AV
      </text>
    </svg>
  )
}

const CONCEPTS = [
  { key: 'droplet', name: 'A — Refined droplet (current)', Mark: Droplet },
  { key: 'cloud', name: 'B — Vapor cloud', Mark: Cloud },
  { key: 'monogram', name: 'C — "AV" monogram', Mark: Monogram },
] as const

const SIZES = [16, 24, 32, 48, 80]

export default function LogoPreviewPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Logo concepts — side by side</h1>
      <p className="mt-2 text-gray-500">
        Tell me which one (A, B or C) and I&apos;ll apply it to the favicon, Apple icon and header, then remove this page.
      </p>

      <div className="mt-10 space-y-12">
        {CONCEPTS.map(({ key, name, Mark }) => (
          <section key={key} className="rounded-2xl border border-gray-200 p-6">
            <h2 className="mb-5 text-xl font-bold text-gray-900">{name}</h2>

            {/* Size scale */}
            <div className="flex flex-wrap items-end gap-6">
              {SIZES.map(s => (
                <div key={s} className="flex flex-col items-center gap-2">
                  <Mark size={s} uid={`${key}-${s}`} />
                  <span className="text-xs text-gray-400">{s}px</span>
                </div>
              ))}
            </div>

            {/* Header lockups — on white and on dark */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-4">
                <Mark size={36} uid={`${key}-hdr-light`} />
                <span className="flex flex-col leading-none">
                  <span className="text-2xl font-black tracking-tight text-[#1B7A3E]">AUSSIE VAPE</span>
                  <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400">Vape Deals, Bundles &amp; Bulk Packs</span>
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-[#0f2418] p-4">
                <Mark size={36} uid={`${key}-hdr-dark`} />
                <span className="flex flex-col leading-none">
                  <span className="text-2xl font-black tracking-tight text-white">AUSSIE VAPE</span>
                  <span className="text-[11px] font-medium uppercase tracking-widest text-green-300/70">Vape Deals, Bundles &amp; Bulk Packs</span>
                </span>
              </div>
            </div>

            {/* Browser-tab simulation */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-t-lg border border-b-0 border-gray-200 bg-gray-50 px-3 py-2">
              <Mark size={16} uid={`${key}-tab`} />
              <span className="text-xs text-gray-600">Aussie Vape — Vape Deals…</span>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
