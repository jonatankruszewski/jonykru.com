'use client'

import { ArrowUpRight } from 'lucide-react'
import { useI18n } from '@/context/i18nContext'
import type { MediumFlatData } from '@/types/medium.types'

type ArticleRowProps = {
  article: MediumFlatData
}

const formatDate = (value: string): string =>
  new Date(value).toISOString().slice(0, 10)

const ArticleRow = ({ article }: ArticleRowProps) => {
  const { t } = useI18n()

  return (
    <li className="border-b border-rule">
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group grid gap-2 py-6 md:grid-cols-[8rem_1fr_auto] md:items-baseline md:gap-8"
      >
        <time
          dateTime={article.pubDate}
          className="font-mono text-label text-ink-muted tabular-nums"
        >
          {formatDate(article.pubDate)}
        </time>

        <h3 className="text-h3 text-ink group-hover:underline decoration-accent decoration-2 underline-offset-4">
          {article.title}
        </h3>

        <span className="font-mono text-label uppercase tracking-label text-ink-muted inline-flex items-center gap-1 group-hover:text-ink transition-colors">
          {t('writing.readArticle')}
          <ArrowUpRight size={14} aria-hidden />
        </span>
      </a>
    </li>
  )
}

export default ArticleRow
