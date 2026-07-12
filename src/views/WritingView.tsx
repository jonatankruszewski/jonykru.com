'use client'

import { ArrowUpRight } from 'lucide-react'
import ArticleRow from '@/components/ArticleRow'
import CtaBand from '@/components/ui/CtaBand'
import { useI18n } from '@/context/i18nContext'
import { SOCIALS } from '@/data/site'
import mediumData from '@/dataFetchers/mediumData.json'
import { sortByDateDesc } from '@/lib/publications'
import type { MediumFlatData } from '@/types/medium.types'

const WritingView = () => {
  const { t } = useI18n()
  const articles = sortByDateDesc(mediumData as MediumFlatData[])

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-16 md:pt-32">
        <p className="font-mono text-label uppercase tracking-label text-ink-muted">
          {t('writing.title')}
        </p>
        <h1 className="text-h1 text-ink mt-6 max-w-3xl text-balance">
          {t('writing.title')}
        </h1>
        <p className="mt-6 max-w-xl text-ink-muted">{t('writing.lede')}</p>

        {/*
          The Medium RSS feed only ever returns the latest 10, so this is a
          window, not an archive. Say so rather than implying a lifetime total —
          the old site claimed "24+" and could not back it.
        */}
        <p className="mt-6 font-mono text-label text-ink-muted">
          {t('writing.feedNote')}
        </p>
      </section>

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

export default WritingView
