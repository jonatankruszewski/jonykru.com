import type { Metadata, Viewport } from 'next'
import './globals.css'
import Script from 'next/script'
import { ReactNode } from 'react'
import { FontPlexHebrew, FontPlexMono, FontPlexSans } from '@/app/fonts'
import RTLHandler from '@/components/RTLHandler'
import SiteFooter from '@/components/SiteFooter'
import SiteNav from '@/components/SiteNav'
import { I18nProvider } from '@/context/i18nContext'
import { ThemeProvider } from '@/context/themeContext'
import { SITE_URL } from '@/data/site'

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
    default: 'Jonatan Kruszewski — AI Dev',
    template: '%s — Jonatan Kruszewski'
  },
  description:
    'AI developer who ships across the whole stack — frontend, backend, CI and automation. Contributor to Pane, typedash and immer; author of the rxova libraries.',
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
    <html
      lang="en"
      dir="ltr"
      // Dark-first, so the markup ships with the class already on. public/theme.js
      // then corrects it before paint for anyone who prefers or saved light.
      className={`dark ${FontPlexMono.variable} ${FontPlexSans.variable} ${FontPlexHebrew.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Applies the saved theme before first paint. A real file rather than an
            inline string, so the app carries no dangerouslySetInnerHTML. */}
        <Script src="/theme.js" strategy="beforeInteractive" />
      </head>
      <body className="bg-canvas text-ink font-sans">
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
