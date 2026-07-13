'use client'

import Link from 'next/link'
import VersionDisplay from '@/components/VersionDisplay'
import { useI18n } from '@/context/i18nContext'
import { SOCIALS } from '@/data/site'
import { NAV_ROUTES } from '@/lib/nav'

const SOCIAL_LINKS = [
  { label: 'GitHub', href: SOCIALS.github },
  { label: 'LinkedIn', href: SOCIALS.linkedin },
  { label: 'Medium', href: SOCIALS.medium },
  { label: 'Stack Overflow', href: SOCIALS.stackOverflow }
]

const SiteFooter = () => {
  const { t, localePath } = useI18n()

  return (
    <footer className="border-t border-rule mt-32">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-wrap gap-12 justify-between">
          <nav className="flex flex-col gap-3">
            {NAV_ROUTES.map((route) => (
              <Link
                key={route.href}
                href={localePath(route.href)}
                className="font-mono text-label uppercase tracking-label text-ink-muted hover:text-ink transition-colors"
              >
                {t(route.labelKey)}
              </Link>
            ))}
          </nav>

          <nav className="flex flex-col gap-3">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-label uppercase tracking-label text-ink-muted hover:text-ink transition-colors"
              >
                {social.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-16 pt-6 border-t border-rule flex flex-wrap items-center justify-between gap-4 font-mono text-label text-ink-muted">
          <span>
            © {new Date().getFullYear()} Jonatan Kruszewski.{' '}
            {t('footer.copyright')}
          </span>
          <span className="flex items-center gap-4">
            <span>{t('footer.builtWith')}</span>
            <VersionDisplay />
          </span>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
