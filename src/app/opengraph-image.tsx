import { ImageResponse } from 'next/og'

export const alt = 'Aussie Vape — Vape Deals, Bundles & Bulk Packs Australia'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Dynamically generated default Open Graph / Twitter image (no static asset).
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1B7A3E 0%, #0f5128 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 92, fontWeight: 800, color: '#ffffff', letterSpacing: -2 }}>AUSSIE VAPE</div>
        <div style={{ marginTop: 16, fontSize: 36, color: 'rgba(255,255,255,0.85)' }}>
          Vape Deals, Bundles &amp; Bulk Packs
        </div>
        <div style={{ marginTop: 40, fontSize: 24, color: 'rgba(255,255,255,0.7)' }}>
          Buy more, save more — fast AU-wide shipping
        </div>
      </div>
    ),
    { ...size }
  )
}
