'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import ThemeToggle from '@/components/ThemeToggle'
import CtaButton from '@/components/ui/CtaButton'
import { useI18n } from '@/context/i18nContext'
import { BOOK_A_CALL_URL } from '@/data/site'
import { stripLocale } from '@/lib/locale'
import { isActiveRoute, NAV_ROUTES } from '@/lib/nav'

const SiteNav = () => {
  const pathname = usePathname()
  const { t, localePath } = useI18n()
  const [open, setOpen] = useState(false)

  // A route change should never leave the mobile panel hanging open.
  useEffect(() => setOpen(false), [pathname])

  // The active check and the route table both speak bare paths ("/blog"); the
  // URL carries a locale prefix ("/es/blog"), so compare against the stripped
  // path and re-prefix every href with the active locale.
  const basePath = stripLocale(pathname)

  const links = NAV_ROUTES.map((route) => {
    const active = isActiveRoute(basePath, route.href)

    return (
      <Link
        key={route.href}
        href={localePath(route.href)}
        aria-current={active ? 'page' : undefined}
        className={`font-mono text-label uppercase tracking-label py-1 border-b-2 transition-colors ${
          active
            ? 'text-ink border-accent'
            : 'text-ink-muted border-transparent hover:text-ink'
        }`}
      >
        {t(route.labelKey)}
      </Link>
    )
  })

  return (
    <header className="sticky top-0 z-50 bg-canvas border-b border-rule">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:bg-accent focus:text-accent-ink focus:px-4 focus:py-2 focus:font-mono focus:text-label"
      >
        {t('nav.skipToContent')}
      </a>

      <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between gap-6">
        <Link
          href={localePath('/')}
          className="font-mono text-h3 font-bold text-ink tracking-tight"
        >
          JK<span className="text-accent-ink bg-accent px-1 ms-0.5">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">{links}</div>

        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          <CtaButton href={BOOK_A_CALL_URL} external className="px-4 py-2">
            {t('nav.bookACall')}
          </CtaButton>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? t('nav.close') : t('nav.menu')}
          className="md:hidden text-ink"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-rule px-6 py-6 flex flex-col gap-5">
          {links}
          <div className="flex items-center gap-3 pt-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <CtaButton href={BOOK_A_CALL_URL} external>
            {t('nav.bookACall')}
          </CtaButton>
        </div>
      )}
    </header>
  )
}

export default SiteNav
