'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import ArticleRow from '@/components/ArticleRow'
import RepoCard from '@/components/RepoCard'
import Typewriter from '@/components/Typewriter'
import CtaBand from '@/components/ui/CtaBand'
import CtaButton from '@/components/ui/CtaButton'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import StatList from '@/components/ui/StatList'
import { useI18n } from '@/context/i18nContext'
import { BOOK_A_CALL_URL } from '@/data/site'
import mediumData from '@/dataFetchers/mediumData.json'
import { featured } from '@/lib/openSource'
import { latest } from '@/lib/publications'
import { getStats } from '@/lib/stats'
import type { MediumFlatData } from '@/types/medium.types'

const CAPABILITIES = ['ai', 'frontend', 'backend', 'automation'] as const
const TEASER_ARTICLES = 3

const SectionLink = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    className="link font-mono text-label uppercase tracking-label inline-flex items-center gap-1"
  >
    {label}
    <ArrowRight size={14} className="rtl-flip" aria-hidden />
  </Link>
)

const HomeView = () => {
  const { t, tList } = useI18n()
  const stats = getStats()
  const articles = latest(mediumData as MediumFlatData[], TEASER_ARTICLES)

  return (
    <>
      <PageHero
        eyebrow={t('home.eyebrow')}
        lede={t('home.lede')}
        title={
          // min-height reserves the tallest phrase so the CTAs below don't jump
          // as the line types and erases.
          <h1 className="text-display text-ink mt-6 max-w-4xl min-h-[2.2em]">
            <Typewriter phrases={tList('home.headlinePhrases')} />
          </h1>
        }
      >
        <div className="mt-10 flex flex-wrap gap-4">
          <CtaButton href={BOOK_A_CALL_URL} external>
            {t('home.primaryCta')}
          </CtaButton>
          <CtaButton href="/open-source" variant="outline">
            {t('home.secondaryCta')}
          </CtaButton>
        </div>
      </PageHero>

      {/* Every number derives from the data; none are typed by hand. */}
      <section className="border-y border-rule">
        <StatList
          className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-2 gap-8 md:grid-cols-4"
          stats={[
            {
              value: stats.publishedPackages,
              label: t('stats.publishedPackages')
            },
            { value: stats.certifications, label: t('stats.certifications') },
            { value: stats.articles, label: t('stats.articles') },
            {
              value: stats.yearsOfExperience,
              label: t('stats.yearsOfExperience')
            }
          ]}
        />
      </section>

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

      <section className="mx-auto max-w-6xl px-6 pt-32">
        <SectionHeader
          eyebrow={t('oss.title')}
          title={t('home.ossTeaserTitle')}
          lede={t('home.ossTeaserBody')}
          action={
            <SectionLink href="/open-source" label={t('home.ossTeaserCta')} />
          }
        />
        <div className="grid gap-6 md:grid-cols-3">
          {featured().map((project) => (
            <RepoCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-32">
        <SectionHeader
          eyebrow={t('home.writingTitle')}
          title={t('home.writingTitle')}
          lede={t('home.writingBody')}
          action={<SectionLink href="/blog" label={t('home.writingCta')} />}
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
