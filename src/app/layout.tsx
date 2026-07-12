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

// Runs before paint so the theme class is on <html> for the first frame.
// Without it the site flashes the wrong canvas on every load.
const THEME_SCRIPT = `
try {
  var t = localStorage.getItem('theme');
  if (t !== 'light' && t !== 'dark') {
    t = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  document.documentElement.classList.toggle('dark', t === 'dark');
} catch (e) {}
`

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${FontPlexMono.variable} ${FontPlexSans.variable} ${FontPlexHebrew.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
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
