'use client'

import RepoCard from '@/components/RepoCard'
import CtaBand from '@/components/ui/CtaBand'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import StatList from '@/components/ui/StatList'
import { useI18n } from '@/context/i18nContext'
import { authored, contributed } from '@/lib/openSource'
import { getStats } from '@/lib/stats'

const OpenSourceView = () => {
  const { t } = useI18n()
  const stats = getStats()

  return (
    <>
      <PageHero
        eyebrow={t('oss.title')}
        title={t('home.ossTeaserTitle')}
        lede={t('oss.lede')}
      >
        <StatList
          className="mt-12 flex flex-wrap gap-x-16 gap-y-8 border-t border-rule pt-8"
          stats={[
            {
              value: stats.authoredProjects,
              label: t('stats.authoredProjects')
            },
            {
              value: stats.publishedPackages,
              label: t('stats.publishedPackages')
            },
            { value: stats.contributedRepos, label: t('oss.contributedTitle') }
          ]}
        />
      </PageHero>

      <section className="mx-auto max-w-6xl px-6 pt-16">
        <SectionHeader
          title={t('oss.authoredTitle')}
          lede={t('oss.authoredBody', {
            projects: stats.authoredProjects,
            packages: stats.publishedPackages
          })}
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
        <div className="grid gap-6 md:grid-cols-2">
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
