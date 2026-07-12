'use client'

import { ArrowUpRight, Star } from 'lucide-react'
import { useI18n } from '@/context/i18nContext'
import { OssProject, starsFor } from '@/data/openSource'

type RepoCardProps = {
  project: OssProject
}

const RepoCard = ({ project }: RepoCardProps) => {
  const { t } = useI18n()
  const stars = starsFor(project.repo)

  return (
    <article className="border border-rule p-6 flex flex-col gap-5 hover:border-ink transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-h3 text-ink">{project.name}</h3>
          <p className="font-mono text-label text-ink-muted mt-1">
            {project.repo}
          </p>
        </div>

        {stars !== undefined && stars > 0 && (
          <span
            className="flex items-center gap-1 font-mono text-label text-ink-muted tabular-nums shrink-0"
            aria-label={`${stars} ${t('oss.starsLabel')}`}
          >
            <Star size={12} aria-hidden />
            {stars.toLocaleString()}
          </span>
        )}
      </div>

      <p className="text-ink-muted">{t(project.blurbKey)}</p>

      {project.contributions && (
        <ul className="flex flex-col gap-3 border-t border-rule pt-4">
          {project.contributions.map((contribution) => (
            <li key={contribution.url} className="flex flex-col gap-1">
              <a
                href={contribution.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link font-mono text-label"
              >
                {contribution.ref}
              </a>
              <span className="text-ink-muted text-sm">
                {t(contribution.titleKey)}
              </span>
              {/*
                An open PR is not a merged one, and anyone can click through and
                see that. Never render it as though it shipped.
              */}
              <span
                className={`font-mono text-label uppercase tracking-label w-fit ${
                  contribution.status === 'merged'
                    ? 'bg-accent text-accent-ink px-1.5'
                    : 'text-ink-muted border border-rule px-1.5'
                }`}
              >
                {contribution.status === 'merged'
                  ? t('oss.merged')
                  : t('oss.open')}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-5 mt-auto pt-2">
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="link font-mono text-label uppercase tracking-label inline-flex items-center gap-1"
        >
          {t('oss.viewRepo')}
          <ArrowUpRight size={14} aria-hidden />
        </a>
        {project.npm && (
          <a
            href={project.npm}
            target="_blank"
            rel="noopener noreferrer"
            className="link font-mono text-label uppercase tracking-label"
          >
            {t('oss.viewNpm')}
          </a>
        )}
      </div>
    </article>
  )
}

export default RepoCard
