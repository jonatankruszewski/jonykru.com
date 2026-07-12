'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import ArticleRow from '@/components/ArticleRow'
import RepoCard from '@/components/RepoCard'
import CtaBand from '@/components/ui/CtaBand'
import CtaButton from '@/components/ui/CtaButton'
import SectionHeader from '@/components/ui/SectionHeader'
import { useI18n } from '@/context/i18nContext'
import { featured } from '@/data/openSource'
import { BOOK_A_CALL_URL } from '@/data/site'
import mediumData from '@/dataFetchers/mediumData.json'
import { latest } from '@/lib/publications'
import { getStats } from '@/lib/stats'
import type { MediumFlatData } from '@/types/medium.types'

const CAPABILITIES = ['ai', 'frontend', 'backend', 'automation'] as const

const HomeView = () => {
  const { t } = useI18n()
  const stats = getStats()
  const articles = latest(mediumData as MediumFlatData[], 3)

  const proof = [
    { value: stats.openSourceProjects, label: t('stats.openSourceProjects') },
    { value: stats.certifications, label: t('stats.certifications') },
    { value: stats.articles, label: t('stats.articles') },
    { value: stats.yearsOfExperience, label: t('stats.yearsOfExperience') }
  ]

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-20 md:pt-32 md:pb-28">
        <p className="font-mono text-label uppercase tracking-label text-ink-muted">
          {t('home.eyebrow')}
        </p>

        <h1 className="text-display text-ink mt-6 max-w-4xl text-balance">
          {t('home.headline')}
        </h1>

        <p className="mt-8 max-w-xl text-ink-muted">{t('home.lede')}</p>

        <div className="mt-10 flex flex-wrap gap-4">
          <CtaButton href={BOOK_A_CALL_URL} external>
            {t('home.primaryCta')}
          </CtaButton>
          <CtaButton href="/open-source" variant="outline">
            {t('home.secondaryCta')}
          </CtaButton>
        </div>
      </section>

      {/* Proof strip — every number derives from the data, none are typed by hand. */}
      <section className="border-y border-rule">
        <dl className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-2 gap-8 md:grid-cols-4">
          {proof.map((item) => (
            <div key={item.label} className="flex flex-col-reverse">
              <dt className="font-mono text-label uppercase tracking-label text-ink-muted mt-2">
                {item.label}
              </dt>
              <dd className="font-mono text-h1 text-ink tabular-nums">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Capabilities */}
      <section className="mx-auto max-w-6xl px-6 pt-32">
        <SectionHeader
          eyebrow={t('home.capabilitiesLabel')}
          title={t('home.capabilitiesTitle')}
        />
        <div className="grid gap-x-12 gap-y-14 md:grid-cols-2">
          {CAPABILITIES.map((key) => (
            <div key={key} className="border-s-2 border-accent ps-6">
              <h3 className="text-h3 text-ink">
                {t(`capabilities.${key}.title`)}
              </h3>
              <p className="mt-3 text-ink-muted">
                {t(`capabilities.${key}.body`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Open source */}
      <section className="mx-auto max-w-6xl px-6 pt-32">
        <SectionHeader
          eyebrow={t('oss.title')}
          title={t('home.ossTeaserTitle')}
          lede={t('home.ossTeaserBody')}
          action={
            <Link
              href="/open-source"
              className="link font-mono text-label uppercase tracking-label inline-flex items-center gap-1"
            >
              {t('home.ossTeaserCta')}
              <ArrowRight size={14} className="rtl-flip" aria-hidden />
            </Link>
          }
        />
        <div className="grid gap-6 md:grid-cols-3">
          {featured().map((project) => (
            <RepoCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      {/* Writing */}
      <section className="mx-auto max-w-6xl px-6 pt-32">
        <SectionHeader
          eyebrow={t('home.writingTitle')}
          title={t('home.writingTitle')}
          lede={t('home.writingBody')}
          action={
            <Link
              href="/writing"
              className="link font-mono text-label uppercase tracking-label inline-flex items-center gap-1"
            >
              {t('home.writingCta')}
              <ArrowRight size={14} className="rtl-flip" aria-hidden />
            </Link>
          }
        />
        <ul className="border-t border-rule">
          {articles.map((article) => (
            <ArticleRow key={article.guid} article={article} />
          ))}
        </ul>
      </section>

      <CtaBand />
    </>
  )
}

export default HomeView
