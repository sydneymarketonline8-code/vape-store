import type { SVGProps } from 'react'

/**
 * Custom, illustrated SVG product icons for each storefront category.
 * Detailed vector illustrations (gradients, gloss, labels) — used in place of
 * emojis on category tiles, the /categories hub, mega-menu and elsewhere.
 * Size via className (e.g. `h-10 w-10`); viewBox is 48×48 for crisp detail.
 */

type IconProps = SVGProps<SVGSVGElement>

const base = (props: IconProps) => ({
  viewBox: '0 0 48 48',
  xmlns: 'http://www.w3.org/2000/svg',
  role: 'img' as const,
  ...props,
})

/** Disposable vape — upright device with mouthpiece, puff-count screen, gloss. */
export function DisposableVapeIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-label="Disposable vape">
      <defs>
        <linearGradient id="disp-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#34b364" />
          <stop offset="0.5" stopColor="#1B7A3E" />
          <stop offset="1" stopColor="#125a2d" />
        </linearGradient>
      </defs>
      <rect x="16.5" y="4.5" width="7" height="7" rx="3" transform="translate(4)" fill="#11151c" />
      <rect x="20" y="5" width="8" height="7" rx="3" fill="#11151c" />
      <rect x="15" y="9" width="18" height="34" rx="6.5" fill="url(#disp-body)" />
      <rect x="18.5" y="12" width="3" height="28" rx="1.5" fill="#ffffff" opacity="0.28" />
      <rect x="19.5" y="19" width="9" height="12" rx="2.5" fill="#0b1220" opacity="0.9" />
      <rect x="21" y="21.5" width="6" height="2" rx="1" fill="#4ade80" />
      <rect x="21" y="25" width="4" height="1.6" rx="0.8" fill="#4ade80" opacity="0.65" />
      <circle cx="24" cy="38" r="1.7" fill="#bbf7d0" />
    </svg>
  )
}

/** Pod system — metal device with a translucent juice pod + fire button. */
export function PodSystemIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-label="Pod system">
      <defs>
        <linearGradient id="pod-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#475569" />
          <stop offset="0.5" stopColor="#1e293b" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="pod-juice" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bbf7d0" />
          <stop offset="1" stopColor="#34b364" />
        </linearGradient>
      </defs>
      <rect x="18" y="5" width="12" height="15" rx="3" fill="url(#pod-juice)" opacity="0.92" />
      <rect x="22" y="3" width="4" height="4" rx="1.5" fill="#11151c" />
      <rect x="13" y="16" width="22" height="27" rx="6" fill="url(#pod-body)" />
      <rect x="16.5" y="19" width="2.6" height="20" rx="1.3" fill="#ffffff" opacity="0.18" />
      <circle cx="24" cy="29" r="3.6" fill="#1B7A3E" />
      <circle cx="24" cy="29" r="1.5" fill="#bbf7d0" />
      <rect x="20" y="35" width="8" height="2" rx="1" fill="#334155" />
    </svg>
  )
}

/** E-liquid — dropper bottle with liquid fill and a label. */
export function ELiquidIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-label="E-liquid">
      <defs>
        <linearGradient id="eliq-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1f2937" />
          <stop offset="0.5" stopColor="#111827" />
          <stop offset="1" stopColor="#030712" />
        </linearGradient>
      </defs>
      <rect x="20" y="4" width="8" height="7" rx="1.5" fill="#0b0f17" />
      <rect x="22.5" y="2.5" width="3" height="3" rx="1.2" fill="#e63946" />
      <rect x="21" y="11" width="6" height="3" fill="#0b0f17" />
      <rect x="14.5" y="14" width="19" height="28" rx="5" fill="url(#eliq-glass)" />
      <path d="M14.5 26 h19 v11 a5 5 0 0 1 -5 5 h-9 a5 5 0 0 1 -5 -5 Z" fill="#1B7A3E" opacity="0.85" />
      <rect x="17.5" y="27.5" width="13" height="10.5" rx="2" fill="#ffffff" opacity="0.94" />
      <rect x="19.5" y="30" width="9" height="2" rx="1" fill="#1B7A3E" />
      <rect x="19.5" y="33.5" width="7" height="1.6" rx="0.8" fill="#9ca3af" />
      <rect x="19.5" y="36" width="5" height="1.4" rx="0.7" fill="#cbd5e1" />
      <rect x="16.6" y="16.5" width="2.4" height="22" rx="1.2" fill="#ffffff" opacity="0.22" />
    </svg>
  )
}

/** Nicotine pouch — round tin with lid, label band and gloss. */
export function NicotinePouchIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-label="Nicotine pouch">
      <defs>
        <linearGradient id="pouch-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#34b364" />
          <stop offset="0.5" stopColor="#1B7A3E" />
          <stop offset="1" stopColor="#125a2d" />
        </linearGradient>
      </defs>
      <rect x="10" y="14" width="28" height="22" fill="url(#pouch-body)" />
      <ellipse cx="24" cy="36" rx="14" ry="5" fill="#0f4d26" />
      <rect x="10" y="20" width="28" height="9" fill="#ffffff" opacity="0.93" />
      <rect x="14" y="23" width="20" height="2.4" rx="1.2" fill="#1B7A3E" />
      <rect x="14" y="26.5" width="13" height="1.6" rx="0.8" fill="#9ca3af" />
      <ellipse cx="24" cy="14" rx="14" ry="5" fill="#3ec46f" />
      <ellipse cx="24" cy="13.4" rx="9" ry="3" fill="#1B7A3E" opacity="0.55" />
      <path d="M11 14 a13 4 0 0 0 4 3.4" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

/** Accessories — replacement coil (metal cylinder, mesh, threaded base). */
export function AccessoryIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-label="Vape accessory">
      <defs>
        <linearGradient id="acc-metal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#cbd5e1" />
          <stop offset="0.5" stopColor="#94a3b8" />
          <stop offset="1" stopColor="#64748b" />
        </linearGradient>
      </defs>
      <rect x="15" y="13" width="18" height="21" fill="url(#acc-metal)" />
      <ellipse cx="24" cy="34" rx="9" ry="3" fill="#64748b" />
      <ellipse cx="24" cy="13" rx="9" ry="3" fill="#e2e8f0" />
      <g stroke="#475569" strokeWidth="1" opacity="0.5">
        <line x1="19" y1="14" x2="19" y2="33" />
        <line x1="24" y1="14" x2="24" y2="33" />
        <line x1="29" y1="14" x2="29" y2="33" />
      </g>
      <rect x="21" y="33" width="6" height="6" fill="#94a3b8" />
      <g stroke="#475569" strokeWidth="1">
        <line x1="21" y1="35" x2="27" y2="35" />
        <line x1="21" y1="37" x2="27" y2="37" />
      </g>
      <circle cx="20" cy="17.5" r="1.4" fill="#1B7A3E" />
      <circle cx="28" cy="17.5" r="1.4" fill="#1B7A3E" />
    </svg>
  )
}

const ICONS: Record<string, (p: IconProps) => React.JSX.Element> = {
  disposables: DisposableVapeIcon,
  mods: PodSystemIcon,
  'e-liquids': ELiquidIcon,
  pouches: NicotinePouchIcon,
  accessories: AccessoryIcon,
}

/** Dispatch the right illustrated icon for a category slug. */
export function CategoryIcon({ slug, ...props }: IconProps & { slug: string }) {
  const Icon = ICONS[slug] ?? AccessoryIcon
  return <Icon {...props} />
}
