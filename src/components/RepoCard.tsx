'use client'

import { ArrowUpRight, Star } from 'lucide-react'
import { useI18n } from '@/context/i18nContext'
import { starsFor } from '@/lib/openSource'
import type { ContributionStatus, OssProject } from '@/types/openSource.types'

/**
 * Landed work reads green; everything else stays muted, so a proposal can never
 * borrow the colour of something that shipped.
 */
const STATUS_STYLE: Record<ContributionStatus, string> = {
  merged: 'text-syn-string border-syn-string',
  resolved: 'text-syn-string border-syn-string',
  open: 'text-syn-comment border-rule',
  closed: 'text-syn-comment border-rule'
}

const STATUS_LABEL_KEY: Record<ContributionStatus, string> = {
  merged: 'oss.merged',
  resolved: 'oss.resolved',
  open: 'oss.open',
  closed: 'oss.closed'
}

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
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-h3 text-ink">{project.name}</h3>
            {/* The org badge is what makes rxova legible as a brand on a card
                that would otherwise only show it as a repo-path prefix. */}
            {project.org && (
              <span className="font-mono text-label uppercase tracking-label text-syn-const border border-syn-const/40 px-1.5">
                {project.org}
              </span>
            )}
          </div>
          <p className="font-mono text-label text-syn-comment mt-1">
            {project.repo}
          </p>
        </div>

        {stars !== undefined && stars > 0 && (
          <span
            className="flex items-center gap-1 font-mono text-label text-syn-number tabular-nums shrink-0"
            aria-label={`${stars} ${t('oss.starsLabel')}`}
          >
            <Star size={12} aria-hidden />
            {stars.toLocaleString()}
          </span>
        )}
      </div>

      <p className="text-ink-muted">{t(project.blurbKey)}</p>

      {project.packages && (
        <div className="border-t border-rule pt-4">
          <p className="font-mono text-label uppercase tracking-label text-ink-muted mb-3">
            {t('oss.packagesLabel')}
          </p>
          <ul className="flex flex-wrap gap-2">
            {project.packages.map((pkg) => (
              <li key={pkg.name}>
                <a
                  href={pkg.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border border-rule px-2 py-1 font-mono text-label text-syn-string hover:border-syn-string transition-colors"
                >
                  {pkg.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {project.contributions && (
        <ul className="flex flex-col gap-3 border-t border-rule pt-4">
          {project.contributions.map((contribution) => (
            <li key={contribution.url} className="flex flex-col gap-1">
              <a
                href={contribution.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-label text-syn-const underline decoration-syn-const/40 decoration-2 underline-offset-4 hover:decoration-syn-const"
              >
                {contribution.ref}
              </a>
              <span className="text-ink-muted text-sm">
                {t(contribution.titleKey)}
              </span>
              {/*
                A proposed PR is not a merged one, and anyone can click through
                and see that. Never render it as though it shipped.
              */}
              <span
                className={`font-mono text-label uppercase tracking-label w-fit px-1.5 border ${STATUS_STYLE[contribution.status]}`}
              >
                {t(STATUS_LABEL_KEY[contribution.status])}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-5 mt-auto pt-2">
        {/* Docs first: for the authored work it's the link a reader actually
            wants, and it's the org's own site rather than someone else's. */}
        {project.docs && (
          <a
            href={project.docs}
            target="_blank"
            rel="noopener noreferrer"
            className="link font-mono text-label uppercase tracking-label inline-flex items-center gap-1"
          >
            {t('oss.viewDocs')}
            <ArrowUpRight size={14} aria-hidden />
          </a>
        )}
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
