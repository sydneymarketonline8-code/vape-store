'use client'

// Catches errors in the root layout itself. Must render its own <html>/<body>.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#fff', color: '#111827' }}>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: 48 }} aria-hidden>⚠️</div>
          <h1 style={{ marginTop: 16, fontSize: 24, fontWeight: 700 }}>Something went wrong</h1>
          <p style={{ marginTop: 8, maxWidth: 420, color: '#6b7280' }}>
            A critical error occurred. Please reload the page, or return to the homepage.
          </p>
          {error.digest && <p style={{ marginTop: 4, fontSize: 12, color: '#d1d5db' }}>Ref: {error.digest}</p>}
          <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button type="button" onClick={() => reset()} style={{ background: '#1B7A3E', color: '#fff', border: 'none', fontWeight: 600, padding: '12px 24px', borderRadius: 8, cursor: 'pointer' }}>
              Reload
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- global-error renders outside the app tree; a full reload is intentional */}
            <a href="/" style={{ border: '1px solid #d1d5db', color: '#374151', fontWeight: 600, padding: '12px 24px', borderRadius: 8, textDecoration: 'none' }}>
              Go Home
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
