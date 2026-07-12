'use client'

import RepoCard from '@/components/RepoCard'
import CtaBand from '@/components/ui/CtaBand'
import SectionHeader from '@/components/ui/SectionHeader'
import { useI18n } from '@/context/i18nContext'
import { authored, contributed } from '@/data/openSource'

const OpenSourceView = () => {
  const { t } = useI18n()

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-16 md:pt-32">
        <p className="font-mono text-label uppercase tracking-label text-ink-muted">
          {t('oss.title')}
        </p>
        <h1 className="text-h1 text-ink mt-6 max-w-3xl text-balance">
          {t('home.ossTeaserTitle')}
        </h1>
        <p className="mt-6 max-w-xl text-ink-muted">{t('oss.lede')}</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-16">
        <SectionHeader
          title={t('oss.authoredTitle')}
          lede={t('oss.authoredBody')}
        />
        <div className="grid gap-6 md:grid-cols-2">
          {authored().map((project) => (
            <RepoCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-32">
        <SectionHeader
          title={t('oss.contributedTitle')}
          lede={t('oss.contributedBody')}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {contributed().map((project) => (
            <RepoCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  )
}

export default OpenSourceView
