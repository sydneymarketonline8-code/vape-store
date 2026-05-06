export function HeroBg() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* Dot grid texture */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hero-dots" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.045)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-dots)" />
      </svg>

      {/* Geometric + vapor SVG layer */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 860"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <style>{`
            @keyframes vsFlt1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
            @keyframes vsFlt2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
            @keyframes vsFlt3 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
            @keyframes vsPulse { 0%,100%{opacity:.5} 50%{opacity:1} }
            @keyframes vsDash  { to{stroke-dashoffset:-40} }
            .vs-f1{animation:vsFlt1 7s ease-in-out infinite}
            .vs-f2{animation:vsFlt2 9s ease-in-out infinite 1.5s}
            .vs-f3{animation:vsFlt3 6s ease-in-out infinite 3s}
            .vs-pulse{animation:vsPulse 3s ease-in-out infinite}
            .vs-dash{stroke-dasharray:6 4;animation:vsDash 3s linear infinite}
          `}</style>

          {/* Radial glow for node halos */}
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nodeGlowBlue" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
          </radialGradient>

          {/* Vapor gradient for bottom wave */}
          <linearGradient id="vaporGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* ── Ambient glow orbs ─────────────────────────────────── */}
        <ellipse cx="320"  cy="420" rx="460" ry="340" fill="rgba(109,40,217,0.07)" />
        <ellipse cx="1180" cy="180" rx="340" ry="280" fill="rgba(96,165,250,0.05)" />
        <ellipse cx="1050" cy="650" rx="240" ry="200" fill="rgba(139,92,246,0.04)" />

        {/* ── Large hexagon — top right (floating) ───────────────── */}
        <g className="vs-f1">
          {/* outer */}
          <polygon
            points="1336,130 1268,248 1132,248 1064,130 1132,12 1268,12"
            fill="none"
            stroke="rgba(139,92,246,0.13)"
            strokeWidth="1.5"
          />
          {/* inner */}
          <polygon
            points="1302,130 1251,216 1149,216 1098,130 1149,44 1251,44"
            fill="none"
            stroke="rgba(139,92,246,0.06)"
            strokeWidth="1"
          />
          {/* corner dots */}
          {[
            [1336,130],[1268,248],[1132,248],[1064,130],[1132,12],[1268,12]
          ].map(([cx,cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="3" fill="rgba(139,92,246,0.25)" />
          ))}
        </g>

        {/* ── Medium hexagon — top left (floating) ───────────────── */}
        <g className="vs-f2">
          <polygon
            points="196,188 158,254 82,254 44,188 82,122 158,122"
            fill="none"
            stroke="rgba(139,92,246,0.11)"
            strokeWidth="1.5"
          />
          <polygon
            points="178,188 150,237 94,237 66,188 94,139 150,139"
            fill="none"
            stroke="rgba(139,92,246,0.05)"
            strokeWidth="1"
          />
        </g>

        {/* ── Small hexagons — decorative ────────────────────────── */}
        <g className="vs-f3">
          <polygon
            points="1114,510 1083,564 1021,564 990,510 1021,456 1083,456"
            fill="none"
            stroke="rgba(96,165,250,0.11)"
            strokeWidth="1"
          />
        </g>
        <polygon
          points="354,508 329,551 279,551 254,508 279,465 329,465"
          fill="none"
          stroke="rgba(139,92,246,0.07)"
          strokeWidth="1"
        />
        <polygon
          points="840,668 820,703 780,703 760,668 780,633 820,633"
          fill="none"
          stroke="rgba(96,165,250,0.07)"
          strokeWidth="1"
        />
        <polygon
          points="620,80 604,108 572,108 556,80 572,52 604,52"
          fill="none"
          stroke="rgba(139,92,246,0.08)"
          strokeWidth="1"
        />

        {/* ── Circuit traces ──────────────────────────────────────── */}
        <g stroke="rgba(139,92,246,0.09)" strokeWidth="1" fill="none">
          {/* left cluster: hex corner → node → node */}
          <path d="M 158,254 H 254 V 465" />
          <path d="M 254,360 H 380" />
        </g>
        <g stroke="rgba(96,165,250,0.07)" strokeWidth="1" fill="none">
          {/* right cluster */}
          <path d="M 990,510 H 760" />
          <path d="M 1114,510 H 1280 V 580 H 1400" />
          {/* top right small trace */}
          <path d="M 1064,130 H 960 V 240" />
        </g>

        {/* Dashed animated traces */}
        <path
          className="vs-dash"
          d="M 254,360 H 500"
          stroke="rgba(139,92,246,0.12)"
          strokeWidth="1"
          fill="none"
        />
        <path
          className="vs-dash"
          d="M 960,240 H 840 V 340"
          stroke="rgba(96,165,250,0.10)"
          strokeWidth="1"
          fill="none"
          style={{ animationDelay: '1.2s' }}
        />

        {/* ── Circuit nodes ───────────────────────────────────────── */}
        <g className="vs-pulse">
          {/* Node 1 */}
          <circle cx="254" cy="360" r="14" fill="url(#nodeGlow)" />
          <circle cx="254" cy="360" r="4"  fill="rgba(139,92,246,0.5)" />
          <circle cx="254" cy="360" r="7"  fill="none" stroke="rgba(139,92,246,0.25)" strokeWidth="1" />

          {/* Node 2 */}
          <circle cx="760" cy="510" r="14" fill="url(#nodeGlowBlue)" />
          <circle cx="760" cy="510" r="4"  fill="rgba(96,165,250,0.5)" />
          <circle cx="760" cy="510" r="7"  fill="none" stroke="rgba(96,165,250,0.25)" strokeWidth="1" />

          {/* Node 3 */}
          <circle cx="960" cy="240" r="10" fill="url(#nodeGlow)" />
          <circle cx="960" cy="240" r="3"  fill="rgba(139,92,246,0.4)" />

          {/* Node 4 */}
          <circle cx="380" cy="360" r="3"  fill="rgba(139,92,246,0.35)" />
          <circle cx="840" cy="340" r="3"  fill="rgba(96,165,250,0.35)" />
        </g>

        {/* ── Diagonal ruled lines (very faint) ───────────────────── */}
        <g stroke="rgba(255,255,255,0.025)" strokeWidth="1">
          <line x1="0"   y1="860" x2="860"  y2="0" />
          <line x1="280" y1="860" x2="1140" y2="0" />
          <line x1="580" y1="860" x2="1440" y2="0" />
        </g>

        {/* ── Vapor wave — bottom ──────────────────────────────────── */}
        <path
          d="M 0,730
             C 160,695 320,760 520,715
             C 720,670 860,735 1060,695
             C 1260,655 1370,730 1440,710
             V 860 H 0 Z"
          fill="url(#vaporGrad)"
        />
        <path
          d="M 0,775
             C 180,748 400,792 620,762
             C 840,732 980,778 1220,750
             C 1360,732 1410,770 1440,760
             V 860 H 0 Z"
          fill="rgba(139,92,246,0.035)"
        />
        <path
          d="M 0,820
             C 240,806 480,830 720,818
             C 960,806 1200,828 1440,814
             V 860 H 0 Z"
          fill="rgba(139,92,246,0.025)"
        />

        {/* ── Small floating particles ─────────────────────────────── */}
        <g fill="rgba(139,92,246,0.2)">
          <circle cx="480"  cy="160" r="1.5" className="vs-f2" />
          <circle cx="720"  cy="300" r="1"   className="vs-f1" />
          <circle cx="1100" cy="400" r="1.5" className="vs-f3" />
          <circle cx="200"  cy="600" r="1"   className="vs-f2" />
          <circle cx="1320" cy="620" r="1.5" className="vs-f1" />
          <circle cx="650"  cy="680" r="1"   className="vs-f3" />
        </g>
        <g fill="rgba(96,165,250,0.18)">
          <circle cx="900"  cy="120" r="1.5" className="vs-f1" />
          <circle cx="340"  cy="300" r="1"   className="vs-f3" />
          <circle cx="1180" cy="520" r="1.5" className="vs-f2" />
        </g>
      </svg>
    </div>
  )
}
