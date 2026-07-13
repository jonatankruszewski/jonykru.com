import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ReactNode } from 'react'
import { FontPlexHebrew, FontPlexMono, FontPlexSans } from '@/app/fonts'
import RTLHandler from '@/components/RTLHandler'
import SiteFooter from '@/components/SiteFooter'
import SiteNav from '@/components/SiteNav'
import { I18nProvider } from '@/context/i18nContext'
import { ThemeProvider } from '@/context/themeContext'
import { SITE_URL } from '@/data/site'
import {
  personSchema,
  serializeJsonLd,
  websiteSchema
} from '@/lib/structuredData'

// Content-Security-Policy, delivered as a meta tag so it ships inside the static
// HTML (there's no server to set a response header, and this way it's verifiable
// in-browser). Everything the site loads is first-party except the Formspree
// endpoint the contact form posts to. 'unsafe-inline' is unavoidable: the static
// export emits inline bootstrap scripts/styles and there's no server to mint a
// nonce. Clickjacking is handled by the X-Frame-Options header (CloudFront) —
// frame-ancestors is ignored when a CSP is delivered via meta.
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "img-src 'self' data:",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "connect-src 'self' https://formspree.io",
  "form-action 'self' https://formspree.io"
].join('; ')

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fffbeb' },
    { media: '(prefers-color-scheme: dark)', color: '#282a36' }
  ]
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Jonatan Kruszewski — Software Engineer',
    template: '%s — Jonatan Kruszewski'
  },
  description:
    'Software engineer who takes AI systems past the demo — frontend, backend, CI and automation. Author of the rxova libraries; contributor to immer, typedash and Pane.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Jonatan Kruszewski',
    url: '/',
    images: ['/og/home.png']
  },
  twitter: { card: 'summary_large_image', images: ['/og/home.png'] }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // No theme class here, and no theme script anywhere: globals.css defaults to
    // Dracula and switches to Solarized Light on prefers-color-scheme, so the
    // first frame is already correct with zero JavaScript. ThemeProvider only
    // adds a .light/.dark override when someone uses the toggle.
    <html
      lang="en"
      dir="ltr"
      className={`${FontPlexMono.variable} ${FontPlexSans.variable} ${FontPlexHebrew.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-canvas text-ink font-sans">
        <meta
          httpEquiv="Content-Security-Policy"
          content={CONTENT_SECURITY_POLICY}
        />
        {/* Machine-readable identity for search engines. Static, so it renders
            in the initial HTML with no client cost. */}
        <script type="application/ld+json">
          {serializeJsonLd(personSchema())}
        </script>
        <script type="application/ld+json">
          {serializeJsonLd(websiteSchema())}
        </script>
        <ThemeProvider>
          <I18nProvider>
            <RTLHandler />
            <SiteNav />
            <main id="content">{children}</main>
            <SiteFooter />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
