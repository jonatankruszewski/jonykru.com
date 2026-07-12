'use client'

import RepoCard from '@/components/RepoCard'
import CtaBand from '@/components/ui/CtaBand'
import SectionHeader from '@/components/ui/SectionHeader'
import { useI18n } from '@/context/i18nContext'
import { authored, contributed } from '@/data/openSource'
import { getStats } from '@/lib/stats'

const OpenSourceView = () => {
  const { t } = useI18n()
  const stats = getStats()

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-16 md:pt-32">
        <p className="font-mono text-label uppercase tracking-label text-syn-comment">
          {t('oss.title')}
        </p>
        <h1 className="text-h1 text-ink mt-6 max-w-3xl text-balance">
          {t('home.ossTeaserTitle')}
        </h1>
        <p className="mt-6 max-w-2xl text-ink-muted">{t('oss.lede')}</p>

        <dl className="mt-12 flex flex-wrap gap-x-16 gap-y-8 border-t border-rule pt-8">
          {[
            {
              value: stats.authoredProjects,
              label: t('stats.authoredProjects')
            },
            {
              value: stats.publishedPackages,
              label: t('stats.publishedPackages')
            },
            {
              value: stats.contributedRepos,
              label: t('oss.contributedTitle')
            }
          ].map((item) => (
            <div key={item.label} className="flex flex-col-reverse">
              <dt className="font-mono text-label uppercase tracking-label text-syn-comment mt-2">
                {item.label}
              </dt>
              <dd className="font-mono text-h1 text-syn-number tabular-nums">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
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
