import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import '../globals.css'
import { ReactNode } from 'react'
import { FontPlexHebrew, FontPlexMono, FontPlexSans } from '@/app/fonts'
import SiteFooter from '@/components/SiteFooter'
import SiteNav from '@/components/SiteNav'
import { I18nProvider } from '@/context/i18nContext'
import { ThemeProvider } from '@/context/themeContext'
import { SITE_URL } from '@/data/site'
import { directionOf, isLocale, LOCALES } from '@/lib/locale'
import {
  personSchema,
  serializeJsonLd,
  websiteSchema
} from '@/lib/structuredData'

// See app/[lang]/page.tsx siblings for per-page metadata. This CSP is delivered
// as a meta tag (static export, no server header) and only in production —
// React dev mode uses eval(), which the policy blocks.
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

// Only the three locales are pre-rendered; anything else 404s.
export const dynamicParams = false

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fffbeb' },
    { media: '(prefers-color-scheme: dark)', color: '#282a36' }
  ]
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(SITE_URL),
    openGraph: { type: 'website', siteName: 'Jonatan Kruszewski' }
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()

  return (
    // lang/dir are now set from the route, server-side — no client RTLHandler.
    // globals.css still paints the theme from prefers-color-scheme with no JS;
    // ThemeProvider only writes an override class after a toggle.
    <html
      lang={lang}
      dir={directionOf(lang)}
      className={`${FontPlexMono.variable} ${FontPlexSans.variable} ${FontPlexHebrew.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-canvas text-ink font-sans">
        {process.env.NODE_ENV === 'production' && (
          <meta
            httpEquiv="Content-Security-Policy"
            content={CONTENT_SECURITY_POLICY}
          />
        )}
        <script type="application/ld+json">
          {serializeJsonLd(personSchema())}
        </script>
        <script type="application/ld+json">
          {serializeJsonLd(websiteSchema())}
        </script>
        <ThemeProvider>
          <I18nProvider locale={lang}>
            <SiteNav />
            <main id="content">{children}</main>
            <SiteFooter />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
