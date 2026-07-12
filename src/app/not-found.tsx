'use client'

import CtaButton from '@/components/ui/CtaButton'
import { useI18n } from '@/context/i18nContext'

export default function NotFound() {
  const { t } = useI18n()

  return (
    <section className="mx-auto max-w-6xl px-6 py-32 md:py-48">
      <p className="font-mono text-display text-ink tabular-nums">404</p>
      <h1 className="text-h1 text-ink mt-8">{t('notFound.title')}</h1>
      <p className="mt-4 max-w-md text-ink-muted">{t('notFound.body')}</p>
      <div className="mt-10">
        <CtaButton href="/">{t('notFound.cta')}</CtaButton>
      </div>
    </section>
  )
}
