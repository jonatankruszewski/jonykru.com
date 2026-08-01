'use client'

import { ArrowUpRight } from 'lucide-react'
import { useI18n } from '@/context/i18nContext'
import { byOrg } from '@/lib/openSource'
import type { OssOrg } from '@/types/openSource.types'

type OrgBandProps = {
  org: OssOrg
}

/**
 * The authored work is one org, not three repos that happen to share a prefix.
 * Without this the page named rxova only in passing, inside a lede — so the
 * org had a site, a GitHub home and a release pipeline that the section never
 * linked to.
 */
const OrgBand = ({ org }: OrgBandProps) => {
  const { t } = useI18n()
  const repos = byOrg(org.id)

  return (
    <section
      aria-labelledby="oss-org"
      className="border border-rule p-8 md:p-10 flex flex-col gap-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-x-10 gap-y-4">
        <div className="max-w-2xl">
          <p className="font-mono text-label uppercase tracking-label text-syn-comment mb-4">
            {t('oss.org.label')}
          </p>
          <h2 id="oss-org" className="text-h2 text-ink font-mono">
            {org.name}
          </h2>
          <p className="mt-2 text-ink-muted">{t(org.taglineKey)}</p>
        </div>

        <p className="font-mono text-label uppercase tracking-label text-syn-comment">
          {t('oss.org.reposLabel')}
          <span className="text-syn-number tabular-nums ms-2">
            {repos.length}
          </span>
        </p>
      </div>

      <p className="max-w-3xl text-ink-muted">
        {t(org.blurbKey, { repos: repos.length })}
      </p>

      <div className="flex flex-wrap items-center gap-5 border-t border-rule pt-6">
        <a
          href={org.url}
          target="_blank"
          rel="noopener noreferrer"
          className="link font-mono text-label uppercase tracking-label inline-flex items-center gap-1"
        >
          {t('oss.org.viewSite')}
          <ArrowUpRight size={14} aria-hidden />
        </a>
        <a
          href={org.github}
          target="_blank"
          rel="noopener noreferrer"
          className="link font-mono text-label uppercase tracking-label inline-flex items-center gap-1"
        >
          {t('oss.org.viewGithub')}
          <ArrowUpRight size={14} aria-hidden />
        </a>
      </div>
    </section>
  )
}

export default OrgBand
