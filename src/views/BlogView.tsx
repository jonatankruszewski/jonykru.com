'use client'

import { ArrowUpRight } from 'lucide-react'
import ArticleRow from '@/components/ArticleRow'
import CtaBand from '@/components/ui/CtaBand'
import PageHero from '@/components/ui/PageHero'
import { useI18n } from '@/context/i18nContext'
import { SOCIALS } from '@/data/site'
import mediumData from '@/dataFetchers/mediumData.json'
import { sortByDateDesc } from '@/lib/publications'
import type { MediumFlatData } from '@/types/medium.types'

/** Medium's RSS caps at 10; anything beyond came from the Medium export. */
const FEED_LIMIT = 10

const BlogView = () => {
  const { t } = useI18n()
  const articles = sortByDateDesc(mediumData as MediumFlatData[])

  return (
    <>
      <PageHero
        eyebrow={t('writing.title')}
        title={t('writing.title')}
        lede={t('writing.lede')}
      >
        {/* Only true while the archive is still feed-capped. Once it holds more
            than the feed can return, the caveat stops being true and is hidden. */}
        {articles.length <= FEED_LIMIT && (
          <p className="mt-6 font-mono text-label text-syn-comment">
            {t('writing.feedNote')}
          </p>
        )}
      </PageHero>

      <section className="mx-auto max-w-6xl px-6">
        <ul className="border-t border-rule">
          {articles.map((article) => (
            <ArticleRow key={article.guid} article={article} />
          ))}
        </ul>

        <a
          href={SOCIALS.medium}
          target="_blank"
          rel="noopener noreferrer"
          className="link font-mono text-label uppercase tracking-label inline-flex items-center gap-1 mt-10"
        >
          {t('writing.allOnMedium')}
          <ArrowUpRight size={14} aria-hidden />
        </a>
      </section>

      <CtaBand />
    </>
  )
}

export default BlogView
