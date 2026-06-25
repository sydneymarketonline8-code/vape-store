import Script from 'next/script'

/**
 * Google Tag Manager — loaded via next/script (afterInteractive). No-ops until
 * NEXT_PUBLIC_GTM_ID is set, so it's safe to leave wired up.
 */
export function GoogleTagManager() {
  const id = process.env.NEXT_PUBLIC_GTM_ID
  if (!id) return null
  return (
    <>
      <Script
        id="gtm-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');`,
        }}
      />
      <noscript>
        <iframe src={`https://www.googletagmanager.com/ns.html?id=${id}`} height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} title="gtm" />
      </noscript>
    </>
  )
}

/**
 * Live-chat widget (Tidio). Loaded lazily (lazyOnload). No-ops until
 * NEXT_PUBLIC_TIDIO_KEY is set. Swap the src for Crisp if you prefer.
 */
export function ChatWidget() {
  const key = process.env.NEXT_PUBLIC_TIDIO_KEY
  if (!key) return null
  return <Script src={`https://code.tidio.co/${key}.js`} strategy="lazyOnload" />
}
