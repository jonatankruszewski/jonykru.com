import './globals.css'
import Link from 'next/link'
import { FontPlexHebrew, FontPlexMono, FontPlexSans } from '@/app/fonts'

/**
 * The global 404 sits outside `/[lang]`, so it has no locale and no root layout
 * — it renders its own <html>/<body>. English is the neutral fallback; the link
 * points at the default locale.
 */
export default function NotFound() {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${FontPlexMono.variable} ${FontPlexSans.variable} ${FontPlexHebrew.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-canvas text-ink font-sans">
        <section className="mx-auto max-w-6xl px-6 py-32 md:py-48">
          <p className="font-mono text-display text-ink tabular-nums">404</p>
          <h1 className="text-h1 text-ink mt-8">Nothing here.</h1>
          <p className="mt-4 max-w-md text-ink-muted">
            That page doesn&apos;t exist — or it did, and the redesign ate it.
          </p>
          <div className="mt-10">
            <Link
              href="/en"
              className="inline-flex items-center gap-2 bg-accent text-accent-ink font-mono text-label uppercase tracking-label px-6 py-3 hover:opacity-90 transition-opacity"
            >
              Back home
            </Link>
          </div>
        </section>
      </body>
    </html>
  )
}
