'use client'

import CtaButton from '@/components/ui/CtaButton'
import { useI18n } from '@/context/i18nContext'
import { BOOK_A_CALL_URL } from '@/data/site'

// Full-bleed lime. Ink on lime is 15.5:1, so the type stays readable at the
// one place on the site where the accent takes over the whole surface.
const CtaBand = () => {
  const { t } = useI18n()

  return (
    <section className="bg-accent text-accent-ink mt-32">
      <div className="mx-auto max-w-6xl px-6 py-24 flex flex-wrap items-end justify-between gap-10">
        <div className="max-w-xl">
          <h2 className="text-h1">{t('home.closingTitle')}</h2>
          <p className="mt-4 text-accent-ink">{t('home.closingBody')}</p>
        </div>

        <CtaButton
          href={BOOK_A_CALL_URL}
          external
          className="bg-ink text-canvas hover:bg-canvas hover:text-ink"
        >
          {t('home.primaryCta')}
        </CtaButton>
      </div>
    </section>
  )
}

export default CtaBand
